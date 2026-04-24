// ============================================================
// MOTOR DE CÁLCULO PARA IMPRESIONES
// ============================================================

const NOMBRES_TAMANO={carta:'Carta (21.6 × 28 cm)',oficio:'Oficio (21.6 × 34 cm)',doblecarta:'Doble Carta (28 × 43.2)', '30x45':'30 × 45 cm','32x50':'32 × 50 cm'};

function getPapelById(id){
  // Requiere de la constante PAPELES cargada de config-impresion.js
  for(const cat of Object.values(PAPELES)){
    const p = cat.find(x=>x.id===id);
    if(p) return p;
  }
  return null;
}

window.getRangoKey = function(cantidad){
  // Requiere de la constante RANGOS cargada de config-impresion.js
  const rangos = window.RANGOS || RANGOS;
  for(const r of rangos){
    if(cantidad >= r.min && cantidad <= r.max) return r.key;
  }
  return '1';
}

window.getPrecioImp = function(modo, impacto, cobertura, cantidad, maquila){
  // Requiere de la constante TABLA_IMP cargada de config-impresion.js
  const cobert = String(cobertura);
  let impactoKey = impacto || 'bajo'; // Por defecto bajo
  const tablas = window.TABLA_IMP || TABLA_IMP;
  if(!tablas[modo]) return 0;
  
  // Si falta key o no existe para modo BN, intentar bajo por defecto
  if(modo==='bn' && !tablas.bn[impactoKey]) impactoKey = 'bajo';
  
  const tabla = tablas[modo][impactoKey];
  if(!tabla) return 0;
  const subT = tabla[cobert];
  if(!subT) return 0;
  if(maquila==='si') return subT.maq;
  const key = window.getRangoKey(cantidad);
  return subT[key] || 0;
}

// Para compatibilidad interna
const getRangoKey = window.getRangoKey;
const getPrecioImp = window.getPrecioImp;

window.getCostoLaminado = function(tipo, tamanoBase, cantidad) {
    let tb = tamanoBase;
    if (tb === 'doble-carta') tb = 'doblecarta';
    if (tb === 'doble-oficio' || tb === 'oficio') tb = 'oficio';
    
    if (!costosLaminado[tipo] || !costosLaminado[tipo][tb]) return 0;
    const rangos = costosLaminado[tipo][tb];
    for (const r of rangos) {
        if (cantidad >= r.min && cantidad <= r.max) return r.costo;
    }
    return rangos[rangos.length - 1].costo;
};
const getCostoLaminado = window.getCostoLaminado;

function calcularPartida(p){
  const papel = getPapelById(p.papelId);
  if(!papel) return null;
  const {cantidad, tamano, frente, reverso, cobertura, maquila, laminadoFrente, laminadoReverso} = p;
  const multImp = MULT_IMP[tamano]||1;
  const multPapel = MULT_PAPEL[tamano]||2;
  let corteExtra = CORTE_EXTRA[tamano]||0;
  // Ajuste especial solicitado: Oficio $100 publico, $50 maquila
  if(tamano === 'oficio') {
    corteExtra = (maquila === 'si') ? 50 : 100;
  }
  const ambosLados = reverso !== 'no';
  
  // Calcular cantidad total de clics (Frente + Reverso) para bracket de precio, agrupando por factor de tamaño
  const clicksAContar = Math.ceil(cantidad * (ambosLados ? 2 : 1) * multImp);

  // Impresión frente
  const precioNormalFrente = getPrecioImp(frente, papel.impacto, cobertura, cantidad * multImp, maquila);
  const precioImpFrente = getPrecioImp(frente, papel.impacto, cobertura, clicksAContar, maquila);
  let costoImpFrente = precioImpFrente * multImp * cantidad;

  // Impresión reverso
  let costoImpReverso = 0;
  let precioNormalReverso = 0;
  let precioImpReverso = 0;
  if(ambosLados){
    precioNormalReverso = getPrecioImp(reverso, papel.impacto, cobertura, cantidad * multImp, maquila);
    precioImpReverso = getPrecioImp(reverso, papel.impacto, cobertura, clicksAContar, maquila);
    costoImpReverso = precioImpReverso * multImp * cantidad;
  }

  // Papel: calcular hojas necesarias (se cobra exactamente lo que se usa)
  const hojasPorPliego = getHojasPorPliego(tamano, papel.id);
  const pliegos = Math.ceil(cantidad / hojasPorPliego); // solo referencia
  let multPapelOverride = multPapel;
  if(papel.id === 'albanene') multPapelOverride = 3; // "la mas cara"

  const costoPliegoBruto = papel.costo * pliegos; // referencia de pliegos
  let costoPapel = 0;

  if (papel.id === 'acetato') {
    // Acetato ignora pliegos, se cobra precio fijo por unidad
    const precioBaseAcetato = (tamano === 'doblecarta') ? 21 : 9;
    costoPapel = precioBaseAcetato * cantidad;
  } else {
    // Cálculo normal: se cobra por hoja individual usada, no por pliego completo
    const costoHojaIndividual = (papel.costo / hojasPorPliego) * multPapelOverride;
    let costoHojasUsadas = costoHojaIndividual * cantidad;
    // Si es invitación se carga 50% extra al papel
    if(['stardc', 'stardp'].includes(papel.id)) {
      costoHojasUsadas *= 1.5;
    }
    costoPapel = costoHojasUsadas + corteExtra;
  }
  
  // Costos explicativos (por hoja cortada)
  const costoHojaBruta = papel.costo / hojasPorPliego;
  const costoHojaFinal = costoHojaBruta * multPapel;

  // Cortes
  let costoCortes = 0;
  let detalleCorte = "";
  if (p.tipoCorte === 'registro') {
    if (cantidad <= 9) {
      costoCortes = 150;
      detalleCorte = `Tarifa base de $150.00 (1 a 9 hojas)`;
    } else if (cantidad <= 25) {
      costoCortes = cantidad * 13;
      detalleCorte = `${cantidad} hojas x $13.00 c/u (10 a 25 hojas)`;
    } else {
      costoCortes = cantidad * 10;
      detalleCorte = `${cantidad} hojas x $10.00 c/u (más de 25 hojas)`;
    }
  } else if (p.tipoCorte === 'guillotina' || p.cortes > 0) {
    costoCortes = (p.cortes || 0) * 25;
    detalleCorte = `${p.cortes || 0} cortes x $25.00 c/u`;
  }

  // Diseño
  const costoDiseno = p.diseno || 0;
  // Laminado
  let costoTotalLaminado = 0;
  let detalleLaminado = 'Sin laminado';
  let costoLamFrentePorPieza = 0;
  let costoLamReversoPorPieza = 0;

  if (laminadoFrente && laminadoFrente !== 'no') {
      costoLamFrentePorPieza = getCostoLaminado(laminadoFrente, tamano, cantidad);
      if (laminadoReverso && laminadoReverso !== 'no') {
          costoLamReversoPorPieza = getCostoLaminado(laminadoReverso, tamano, cantidad);
      }
      const costoLamCalculado = (costoLamFrentePorPieza + costoLamReversoPorPieza) * cantidad;
      costoTotalLaminado = Math.max(costoLamCalculado, LAMINADO_MINIMO);
      detalleLaminado = `Frente ${laminadoFrente} ($${costoLamFrentePorPieza.toFixed(2)}/pz)` + 
                        (laminadoReverso && laminadoReverso !== 'no' ? `, Reverso ${laminadoReverso} ($${costoLamReversoPorPieza.toFixed(2)}/pz)` : `, sin reverso`);
  }

  const subtotal = costoImpFrente + costoImpReverso + costoPapel + costoCortes + costoDiseno + costoTotalLaminado;
  const unitario = subtotal / cantidad;

  return {
    costoImpFrente, costoImpReverso, costoPapel, costoCortes, detalleCorte, costoDiseno,
    costoTotalLaminado, detalleLaminado, costoLamFrentePorPieza, costoLamReversoPorPieza,
    subtotal, unitario, pliegos, hojasPorPliego,
    precioImpFrente, precioImpReverso, 
    precioNormalFrente, precioNormalReverso, clicksAContar,
    costoHojaBruta, costoHojaFinal,
    corteExtra, costoPliegoBruto, multPapel
  };
}

function getHojasPorPliego(tamano, papelId){
  // Determinar tamaño del pliego por el ID del papel
  const p = getPapelById(papelId);
  // pliego 57x87 o 61x90 ≈ carta
  // pliego 70x95 ≈ oficio
  // pliego 51x66 / 72x51 ≈ adhesivos/stardeam
  const pligoGrande = ['bond75_oficio','bond90_oficio','couche130','couche150','couche200o','couche250o','couche300o','opal120o'];
  const pligoAdh = ['adhbri','adhref','stardc','stardp'];
  let mapa;
  if(pligoGrande.includes(papelId)){
    mapa = {carta:8,oficio:8,doblecarta:4,'30x45':4,'32x50':3};
  } else if(pligoAdh.includes(papelId)){
    mapa = {carta:5,oficio:3,'30x45':1,'32x50':1,doblecarta:2};
  } else {
    mapa = {carta:8,oficio:8,doblecarta:4,'30x45':4,'32x50':2};
    // Excepciones de rendimiento solicitadas para oficio:
    if(['cart225b', 'cart225c'].includes(papelId)) mapa.oficio = 4;
    if(['croma', 'sulfa'].includes(papelId))       mapa.oficio = 7;
    if(papelId === 'albanene')                     mapa.oficio = 3;
  }
  return mapa[tamano]||1;
}
