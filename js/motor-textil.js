let carritoPlayeras = [];
let idUbicacion = 0;
let idPersonalizado = 0;
let llevaPersonalizado = false;
let hayExistencia = false;

document.addEventListener('DOMContentLoaded', () => {
    agregarUbicacion();
    cargarMarcasPlayeras();
    generarUITabulador();

    // Listener para actualizar el indicador de meta en tiempo real
    document.getElementById('cantidad_general').addEventListener('input', function() {
        const val = this.value || 0;
        document.getElementById('meta_pzas').innerText = val;
    });
});

// ─────────────────────────────────────────────
//  GESTIÓN DE UBICACIONES (SERIGRAFÍA)
// ─────────────────────────────────────────────
function agregarUbicacion() {
    idUbicacion++;
    const row = document.createElement('div');
    row.className = 'ubicacion-row';
    row.id = `ub_${idUbicacion}`;
    row.innerHTML = `
        <div class="form-group">
            <label>Área de impresión</label>
            <select class="sel-ubicacion" onchange="verificarTamanoUbicacion(${idUbicacion})">
                <option value="" disabled selected>— Selecciona el área —</option>
                <option value="frente">Frente</option>
                <option value="espalda">Espalda</option>
                <option value="escudo">Escudo (Pecho Izquierdo)</option>
                <option value="manga_izq">Manga Izquierda</option>
                <option value="manga_der">Manga Derecha</option>
            </select>
        </div>
        <div class="form-group div-tamano" id="tamano_container_${idUbicacion}" style="display:none;">
            <label>Tamaño</label>
            <select class="sel-tamano">
                <option value="carta">Carta (21.5 × 28 cm)</option>
                <option value="oficio">Oficio+ (23 × 34 cm)</option>
            </select>
        </div>
        <div class="form-group">
            <label>Tintas (1–4)</label>
            <input type="number" class="sel-tintas" min="1" max="4" placeholder="Ej: 2">
        </div>
        <div>
            <button class="btn btn-red btn-sm" style="margin-top:18px;" onclick="eliminarUbicacion(${idUbicacion})"><i class="fas fa-trash"></i></button>
        </div>
    `;
    document.getElementById('contenedor_ubicaciones').appendChild(row);
}

function verificarTamanoUbicacion(id) {
    const row = document.getElementById(`ub_${id}`);
    const ubi = row.querySelector('.sel-ubicacion').value;
    const divTamano = document.getElementById(`tamano_container_${id}`);
    divTamano.style.display = (ubi === 'frente' || ubi === 'espalda') ? 'flex' : 'none';
}

function eliminarUbicacion(id) {
    if (document.querySelectorAll('.ubicacion-row').length > 1) {
        document.getElementById(`ub_${id}`).remove();
    } else {
        alert('Debe haber por lo menos una ubicación de impresión.');
    }
}

// ─────────────────────────────────────────────
//  GESTIÓN DE PERSONALIZADO
// ─────────────────────────────────────────────
function setPersonalizado(val) {
    llevaPersonalizado = (val === 'si');
    document.getElementById('btn_pers_si').className = llevaPersonalizado ? 'toggle-btn active-si' : 'toggle-btn';
    document.getElementById('btn_pers_no').className = !llevaPersonalizado ? 'toggle-btn active-no' : 'toggle-btn';
    document.getElementById('seccion_personalizado').style.display = llevaPersonalizado ? 'block' : 'none';

    // Si cambia a No, limpiar los personalizados
    if (!llevaPersonalizado) {
        document.getElementById('contenedor_personalizado').innerHTML = '';
        idPersonalizado = 0;
    } else if (document.querySelectorAll('.personalizado-row').length === 0) {
        agregarPersonalizado();
    }
}

function agregarPersonalizado() {
    idPersonalizado++;
    const row = document.createElement('div');
    row.className = 'personalizado-row';
    row.id = `pers_${idPersonalizado}`;
    row.innerHTML = `
        <div class="form-group">
            <label>Área del Personalizado</label>
            <select class="pers-ubicacion">
                <option value="" disabled selected>— Selecciona área —</option>
                <option value="frente">Frente</option>
                <option value="espalda">Espalda</option>
                <option value="escudo">Escudo (Pecho Izq.)</option>
                <option value="manga_izq">Manga Izquierda</option>
                <option value="manga_der">Manga Derecha</option>
                <option value="cuello">Cuello / Nuca</option>
                <option value="otro">Otro</option>
            </select>
        </div>
        <div class="form-group">
            <label>Ancho (cm)</label>
            <input type="number" class="pers-ancho" min="1" placeholder="Ej: 20">
        </div>
        <div class="form-group">
            <label>Alto (cm)</label>
            <input type="number" class="pers-alto" min="1" placeholder="Ej: 15">
        </div>
        <div class="form-group">
            <label>Técnica</label>
            <select class="pers-tecnica" onchange="this.parentElement.nextElementSibling.style.display = this.value === 'vinil' ? 'block' : 'none'">
                <option value="" disabled selected>— Selecciona —</option>
                <option value="vinil">Vinil Textil</option>
                <option value="dtf">DTF</option>
            </select>
        </div>
        <div class="form-group" style="display:none;">
            <label>Tipo de Vinil</label>
            <select class="pers-tipo-vinil">
                <option value="basico">Básico Detalle ($220/m)</option>
                <option value="metalico">Metálico ($250/m)</option>
                <option value="glitter">Glitter ($330/m)</option>
                <option value="holografico">Holográfico ($185/m)</option>
            </select>
        </div>
        <div>
            <button class="btn btn-red btn-sm" style="margin-top:18px;background:#9333EA;" onclick="eliminarPersonalizado(${idPersonalizado})"><i class="fas fa-trash"></i></button>
        </div>
    `;
    document.getElementById('contenedor_personalizado').appendChild(row);
}

function eliminarPersonalizado(id) {
    document.getElementById(`pers_${id}`).remove();
}

// ─────────────────────────────────────────────
//  CATÁLOGO PLAYERAS
// ─────────────────────────────────────────────
function toggleCatalogoPlayeras() {
    const act = document.getElementById('origen_playeras').value;
    const uiCatalogo = document.getElementById('catalogo_playeras_ui');
    const indicadorMeta = document.getElementById('indicador_meta');
    const cantGeneral = document.getElementById('cantidad_general');

    if (act === 'comprar') {
        uiCatalogo.style.display = 'block';
        indicadorMeta.style.display = 'flex';
        document.getElementById('meta_pzas').innerText = cantGeneral.value || 0;
        cantGeneral.disabled = true;
    } else {
        uiCatalogo.style.display = 'none';
        indicadorMeta.style.display = 'none';
        cantGeneral.disabled = false;
    }
}

function setExistencia(val) {
    hayExistencia = (val === 'si');
    document.getElementById('btn_exis_si').className = hayExistencia ? 'toggle-btn active-si' : 'toggle-btn';
    document.getElementById('btn_exis_no').className = !hayExistencia ? 'toggle-btn active-no' : 'toggle-btn';
}

function cargarMarcasPlayeras() {
    const marcasMap = [...new Set(CATALOGO_PLAYERAS.map(c => c.marca))];
    const selMarca = document.getElementById('cat_marca');
    selMarca.innerHTML = marcasMap.map(m => `<option value="${m}">${m}</option>`).join('');
    actualizarModelosPlayeras();
}

function actualizarModelosPlayeras() {
    const marcaSeleccionada = document.getElementById('cat_marca').value;
    const modelos = CATALOGO_PLAYERAS.filter(c => c.marca === marcaSeleccionada);
    const selModelo = document.getElementById('cat_modelo');
    selModelo.innerHTML = modelos.map((m, idx) => `<option value="${idx}">${m.tipo}</option>`).join('');
    mostrarVariantesPlayera();
}

let refModeloSeleccionado = null;
function mostrarVariantesPlayera() {
    const marcaSel = document.getElementById('cat_marca').value;
    const idxMod = parseInt(document.getElementById('cat_modelo').value);
    const modelos = CATALOGO_PLAYERAS.filter(c => c.marca === marcaSel);
    refModeloSeleccionado = modelos[idxMod];
    if (!refModeloSeleccionado) return;

    document.getElementById('variantes_container').innerHTML = refModeloSeleccionado.variantes.map((v, i) => `
        <div class="variante-item">
            <span>${v.nombre}</span>
            <small>Mayoreo: $${v.mayor} | Menudeo: $${v.menor}</small>
            <input type="number" id="var_${i}" min="0" value="" placeholder="Cantidad">
        </div>
    `).join('');
}

function agregarAlCarrito() {
    if (!refModeloSeleccionado) return;
    let agregadas = false;
    refModeloSeleccionado.variantes.forEach((v, i) => {
        const el = document.getElementById(`var_${i}`);
        const cant = parseInt(el.value);
        if (cant > 0) {
            carritoPlayeras.push({
                idxCarr: Date.now() + Math.random(),
                marca: refModeloSeleccionado.marca,
                modelo: refModeloSeleccionado.tipo,
                variante: v,
                cantidad: cant
            });
            agregadas = true;
            el.value = '';
        }
    });
    if (agregadas) renderCarrito();
}

function renderCarrito() {
    let html = '';
    let totPzas = 0;
    carritoPlayeras.forEach(c => {
        totPzas += c.cantidad;
        html += `<div class="carrito-item">
            <div><b>${c.cantidad}×</b> ${c.marca} — ${c.modelo} (${c.variante.nombre})</div>
            <button class="btn btn-red btn-sm" onclick="quitarDelCarrito(${c.idxCarr})"><i class="fas fa-times"></i></button>
        </div>`;
    });
    document.getElementById('lista_carrito').innerHTML = html || '<p style="color:#94a3b8;">Sin prendas añadidas.</p>';
    document.getElementById('total_piezas_carrito').innerText = `Total piezas: ${totPzas}`;
    document.getElementById('cantidad_general').value = totPzas > 0 ? totPzas : '';
}

function quitarDelCarrito(id) {
    carritoPlayeras = carritoPlayeras.filter(c => c.idxCarr !== id);
    renderCarrito();
}

// ─────────────────────────────────────────────
//  LEER PERSONALIZADOS (para incluir en resumen)
// ─────────────────────────────────────────────
function leerPersonalizados() {
    const resultado = [];
    document.querySelectorAll('.personalizado-row').forEach(row => {
        const ubicEl = row.querySelector('.pers-ubicacion');
        const anchoEl = row.querySelector('.pers-ancho');
        const altoEl = row.querySelector('.pers-alto');
        const tecnicaEl = row.querySelector('.pers-tecnica');
        const tipoVinilEl = row.querySelector('.pers-tipo-vinil');

        resultado.push({
            ubicacion: ubicEl.value ? ubicEl.options[ubicEl.selectedIndex].text : 'Sin especificar',
            ancho: parseFloat(anchoEl.value) || 0,
            alto: parseFloat(altoEl.value) || 0,
            tecnica: tecnicaEl.value || 'Sin especificar',
            tipoVinilVal: tipoVinilEl.value,
            tipoVinilTxt: tipoVinilEl.options[tipoVinilEl.selectedIndex].text
        });
    });
    return resultado;
}

// ─────────────────────────────────────────────
//  CALCULAR COTIZACIÓN
// ─────────────────────────────────────────────
function calcularCotizacion() {
    const t = TABULADOR_COSTOS;

    // ── 1. CANTIDAD ──────────────────────────
    let cantidadBase = parseInt(document.getElementById('cantidad_general').value);
    if (isNaN(cantidadBase) || cantidadBase <= 0) {
        alert('⚠️ Ingresa una cantidad válida de prendas.');
        return;
    }

    // ── Validar selects generales ─────────────
    const servicio = document.getElementById('tipo_servicio').value;
    const idTela = document.getElementById('tipo_tela').value;
    const idColor = document.getElementById('color_tela').value;
    const tDis = document.getElementById('tipo_diseno').value;
    const origenPlayeras = document.getElementById('origen_playeras').value;

    if (!servicio) { alert('⚠️ Selecciona el tipo de servicio.'); return; }
    if (!idTela) { alert('⚠️ Selecciona el tipo de tela.'); return; }
    if (!idColor) { alert('⚠️ Selecciona el color de la tela.'); return; }
    if (!tDis) { alert('⚠️ Selecciona el tipo de diseño.'); return; }
    if (!origenPlayeras) { alert('⚠️ Selecciona quién aporta las playeras.'); return; }

    // ── 2. UBICACIONES ───────────────────────
    const rows = document.querySelectorAll('.ubicacion-row');
    let totalTintasPorPrenda = 0;
    let sumaImpresionUnitaria = 0;
    const detalleUbicaciones = [];

    for (const row of rows) {
        const ubiSel = row.querySelector('.sel-ubicacion');
        const ubi = ubiSel.value;
        if (!ubi) { alert('⚠️ Selecciona el área de impresión en todas las ubicaciones.'); return; }

        const ubiName = ubiSel.options[ubiSel.selectedIndex].text;
        const tintas = parseInt(row.querySelector('.sel-tintas').value);
        if (isNaN(tintas) || tintas < 1) { alert(`⚠️ Ingresa la cantidad de tintas para la ubicación: ${ubiName}`); return; }
        if (tintas > 4) { alert(`⚠️ Máximo 4 tintas por ubicación (${ubiName}).`); return; }

        totalTintasPorPrenda += tintas;

        let costoPorTinta = 0;
        let tamanoTexto = '';
        let isOficio = false;

        if (ubi === 'frente' || ubi === 'espalda') {
            isOficio = row.querySelector('.sel-tamano').value === 'oficio';
            tamanoTexto = isOficio ? 'Oficio+ (23×34cm)' : 'Carta (21.5×28cm)';
            costoPorTinta = tintas <= 2 ? t.serigrafia.carta_costo_1_2_tintas : t.serigrafia.carta_costo_3_mas_tintas;
            if (isOficio) costoPorTinta += t.serigrafia.cargo_oficio;
        } else {
            tamanoTexto = '1/4 Carta (10.5×13.5cm)';
            costoPorTinta = tintas <= 2 ? t.serigrafia.escudo_costo_1_2_tintas : t.serigrafia.escudo_costo_3_mas_tintas;
        }

        const subtotalUbi = costoPorTinta * tintas;
        sumaImpresionUnitaria += subtotalUbi;
        detalleUbicaciones.push({ ubiName, tintas, costoPorTinta, subtotalUbi, tamanoTexto, isOficio });
    }

    // ── 3. FONDEO TELA ───────────────────────
    const labelTela = document.getElementById('tipo_tela').options[document.getElementById('tipo_tela').selectedIndex].text;
    const labelColor = document.getElementById('color_tela').options[document.getElementById('color_tela').selectedIndex].text;

    let cargoFondeoTela = 0;
    let cargoFondeoColor = 0;
    
    // Si la tela NO es blanca, verificamos cargos por tipo de fibra (mezcla/poliéster)
    if (idColor !== 'blanca') {
        if (idTela === 'mezcla') cargoFondeoTela = t.serigrafia.cargo_mezcla;
        if (idTela === 'poliester') cargoFondeoTela = t.serigrafia.cargo_poliester;
    }
    
    // El cargo por color oscuro solo aplica si no es blanca
    if (idColor === 'negra_color') cargoFondeoColor = t.serigrafia.cargo_color_oscuro;
    
    const cargoFodeoTotal = cargoFondeoTela + cargoFondeoColor;
    const subtotalUnitario = sumaImpresionUnitaria + cargoFodeoTotal;

    // ── 4. DESCUENTO ─────────────────────────
    const impresionesTotales = totalTintasPorPrenda * cantidadBase;
    const totalBruto = subtotalUnitario * cantidadBase;
    const descObj = t.descuentos.find(d => impresionesTotales >= d.min);
    const porcentajeDesc = descObj ? descObj.desc : 0;
    const montoDescuento = totalBruto * porcentajeDesc;
    const totalImpresionNeto = totalBruto - montoDescuento;

    // ── 5. MARCOS ────────────────────────────
    const costoMarcos = totalTintasPorPrenda * t.serigrafia.marco_normal;

    // ── 6. PERSONALIZADO (sin costo aún) ─────
    const personalizados = llevaPersonalizado ? leerPersonalizados() : [];

    // ── 7. PLAYERAS ──────────────────────────
    let costoTotalPlayeras = 0;
    let costoEnvioTotal = 0;
    let numMermas = Math.ceil(cantidadBase / 100) * 5;
    let factorUtilidad = 2;
    const detallePlayeras = [];
    let infoEnvio = null;

    if (origenPlayeras === 'comprar') {
        if (carritoPlayeras.length === 0) { alert('⚠️ Agrega playeras al carrito antes de calcular.'); return; }

        const objUtil = t.utilidad_playeras.find(u => cantidadBase <= u.max) || t.utilidad_playeras[t.utilidad_playeras.length - 1];
        factorUtilidad = objUtil.util;

        carritoPlayeras.forEach(c => {
            const cantPz = c.cantidad;
            const precioBase = cantidadBase >= 12 ? c.variante.mayor : c.variante.menor;
            const precioVenta = precioBase * factorUtilidad;
            const subtotalRenglon = precioVenta * cantPz;
            costoTotalPlayeras += subtotalRenglon;
            detallePlayeras.push({ cantPz, marca: c.marca, modelo: c.modelo, variante: c.variante.nombre, precioBase, factorUtilidad, precioVenta, subtotalRenglon });
        });

        // Merma
        const precioMermaBase = carritoPlayeras[0].variante.mayor;
        const costoMerma = precioMermaBase * factorUtilidad * numMermas;
        costoTotalPlayeras += costoMerma;
        detallePlayeras._merma = { numMermas, precioMermaBase, factorUtilidad, costoMerma };

        // Envío (solo si NO hay existencia física)
        if (!hayExistencia) {
            const paquetesEnvio = Math.ceil(cantidadBase / 70);
            costoEnvioTotal = paquetesEnvio * t.otros.envio_por_70_pz;
            infoEnvio = { paquetesEnvio, costoEnvio: costoEnvioTotal, tarifa: t.otros.envio_por_70_pz };
        }
    }

    // ── 9. PERSONALIZADO (Vinil Textil & DTF) ────────
    let totalCostoPersonalizado = 0;
    
    // Config de Viniles desde el Tabulador
    const configVinil = {};
    t.personalizado.viniles.forEach(v => {
        configVinil[v.id] = { nombre: v.nombre, precioM: v.costoM, largoCm: 0 };
    });

    let totalPzasPlanchar = 0;
    const itemsVinilEnResumen = [];
    let largoTotalDTF = 0;
    let desglosePlanchado = null;
    let detallesDTF = null;

    if (personalizados && personalizados.length > 0) {
        personalizados.forEach(p => {
            if (p.tecnica === 'vinil') {
                // Calcular la longitud lineal óptima para esta pieza x cantidadBase
                if (p.ancho > 0 && p.alto > 0) {
                    const anchoUtil = 44; // 50cm menos 3cm de cada lado
                    
                    // Opción 1: Layout normal
                    const cols1 = Math.floor(anchoUtil / p.ancho);
                    const rows1 = cols1 > 0 ? Math.ceil(cantidadBase / cols1) : 0;
                    const len1 = cols1 > 0 ? rows1 * p.alto : Infinity;
                    
                    // Opción 2: Layout rotado
                    const cols2 = Math.floor(anchoUtil / p.alto);
                    const rows2 = cols2 > 0 ? Math.ceil(cantidadBase / cols2) : 0;
                    const len2 = cols2 > 0 ? rows2 * p.ancho : Infinity;

                    const mejorLargo = Math.min(len1, len2);
                    if (mejorLargo !== Infinity) {
                        configVinil[p.tipoVinilVal].largoCm += mejorLargo;
                    }
                }
                totalPzasPlanchar += cantidadBase;
            } else if (p.tecnica === 'dtf') {
                if (p.ancho > 0 && p.alto > 0) {
                    const anchoDTF = t.personalizado.dtf.ancho_cm;
                    const adic = t.personalizado.dtf.margen_cm;
                    const pA = p.ancho + adic;
                    const pAl = p.alto + adic;
                    
                    const cols1 = Math.floor(anchoDTF / pA);
                    const rows1 = cols1 > 0 ? Math.ceil(cantidadBase / cols1) : 0;
                    const len1 = cols1 > 0 ? rows1 * pAl : Infinity;

                    const cols2 = Math.floor(anchoDTF / pAl);
                    const rows2 = cols2 > 0 ? Math.ceil(cantidadBase / cols2) : 0;
                    const len2 = cols2 > 0 ? rows2 * pA : Infinity;

                    const mejorLargo = Math.min(len1, len2);
                    if (mejorLargo !== Infinity) {
                        largoTotalDTF += mejorLargo;
                    }
                }
                totalPzasPlanchar += cantidadBase;
            }
        });

        // Calcular costo por material agrupado
        Object.keys(configVinil).forEach(key => {
            const v = configVinil[key];
            if (v.largoCm > 0) {
                // Convertir a metros fraccionados exactos o múltiplos según regla
                const largoMtsCrudo = v.largoCm / 100;
                // Redondeamos hacia arriba en fracciones de 1/4 (0.25)
                const mtCobrar = Math.ceil(largoMtsCrudo * 4) / 4;

                // Utilidad desde el tabulador
                const objUtil = t.personalizado.utilidad_vinil.find(u => mtCobrar <= u.max) || t.personalizado.utilidad_vinil[t.personalizado.utilidad_vinil.length - 1];
                let utilidadMult = objUtil.util;

                const costoMaterial = mtCobrar * v.precioM;
                const ventaMaterial = costoMaterial * utilidadMult;

                let costoCorte = 0;
                const mC = t.personalizado.maquila;
                if (mtCobrar < 1.0) costoCorte = mC.corte_min;
                else if (mtCobrar < 5.0) costoCorte = mtCobrar * mC.corte_metro_bajo;
                else costoCorte = mtCobrar * mC.corte_metro_alto;

                let costoDepilado = 0;
                if (mtCobrar <= 1.0) costoDepilado = mC.depilado_min;
                else if (mtCobrar <= 10.0) costoDepilado = mtCobrar * mC.depilado_metro_bajo;
                else costoDepilado = mtCobrar * mC.depilado_metro_alto;

                const subtotalVinil = ventaMaterial + costoCorte + costoDepilado;
                totalCostoPersonalizado += subtotalVinil;

                itemsVinilEnResumen.push({
                    nombre: v.nombre,
                    mtCobrar,
                    utilidadMult,
                    precioM: v.precioM,
                    costoMaterial,
                    ventaMaterial,
                    costoCorte,
                    costoDepilado,
                    subtotalVinil
                });
            }
        });

        // Calcular costo de DTF
        if (largoTotalDTF > 0) {
            const mtsNormales = Math.floor(largoTotalDTF / 100);
            const sobrante = largoTotalDTF % 100;
            
            const pDTF = t.personalizado.dtf.precios;
            let metrosTotales = mtsNormales;
            let fraccionStr = "";
            let ventaFraccion = 0;
            let costoFraccion = 0;
            
            if (sobrante > 0 && sobrante <= 25) {
                ventaFraccion = pDTF.cuarto.costo * pDTF.cuarto.util;
                costoFraccion = pDTF.cuarto.costo;
                fraccionStr = " + 1/4 mt";
            } else if (sobrante > 25 && sobrante <= 50) {
                ventaFraccion = pDTF.medio.costo * pDTF.medio.util;
                costoFraccion = pDTF.medio.costo;
                fraccionStr = " + 1/2 mt";
            } else if (sobrante > 50) {
                metrosTotales += 1;
            }
            
            const costoMtsFull = metrosTotales * pDTF.metro.costo;
            const ventaMtsFull = costoMtsFull * pDTF.metro.util;
            
            const costoMaterialDTF = costoMtsFull + costoFraccion;
            const ventaMaterialDTF = ventaMtsFull + ventaFraccion;
            
            let costoEnvioDTF = 0;
            let ventaEnvioDTF = 0;
            const configEnvioDTF = t.personalizado.dtf.envio;
            
            if (costoMaterialDTF < configEnvioDTF.costo_minimo_gratis) {
                const totalMetrosFacturados = metrosTotales + (sobrante > 0 && sobrante <= 25 ? 0.25 : (sobrante > 25 && sobrante <= 50 ? 0.50 : 0));
                const tramosEnvio = Math.ceil((totalMetrosFacturados === 0 ? 0.1 : totalMetrosFacturados) / configEnvioDTF.metros_por_costo);
                costoEnvioDTF = tramosEnvio * configEnvioDTF.costo;
                ventaEnvioDTF = costoEnvioDTF; // Passthrough de costo de envío
            }

            const ventaTotalDTF = ventaMaterialDTF + ventaEnvioDTF;
            totalCostoPersonalizado += ventaTotalDTF;
            
            detallesDTF = {
                largoTotalCm: largoTotalDTF,
                metrosTotales,
                fraccionStr,
                costoBase: costoMaterialDTF,
                costoEnvioDTF,
                ventaMaterialDTF,
                ventaTotal: ventaTotalDTF
            };
        }

        // Costo de Planchado
        if (totalPzasPlanchar > 0) {
            const objPlancha = t.personalizado.tarifas_planchado.find(p => cantidadBase <= p.max) || t.personalizado.tarifas_planchado[t.personalizado.tarifas_planchado.length - 1];
            const tarifaPlanchado = objPlancha.tarifa;
            const costoTotalPlanchado = totalPzasPlanchar * tarifaPlanchado;
            totalCostoPersonalizado += costoTotalPlanchado;
            desglosePlanchado = { prensadas: totalPzasPlanchar, tarifa: tarifaPlanchado, total: costoTotalPlanchado };
        }
    }

    // ── 10. DISEÑO ────────────────────────────
    const labelDiseno = document.getElementById('tipo_diseno').options[document.getElementById('tipo_diseno').selectedIndex].text;
    let costoDiseno = 0;
    if (tDis === 'cliente') costoDiseno = t.otros.diseno_cliente;
    else if (tDis === 'guardado') costoDiseno = t.otros.diseno_guardado;
    else costoDiseno = t.otros.diseno_nuevo;

    // ── 11. TOTALES ───────────────────────────
    const costoNetoSinIVA = totalImpresionNeto + costoMarcos + costoTotalPlayeras + costoEnvioTotal + costoDiseno + totalCostoPersonalizado;
    const montoIVA = costoNetoSinIVA * 0.16;
    const costoNetoConIVA = costoNetoSinIVA + montoIVA;
    const unitarioSinIVA = costoNetoSinIVA / cantidadBase;
    const unitarioConIVA = costoNetoConIVA / cantidadBase;

    // ── MOSTRAR TOTALES ──────────────────────
    document.getElementById('res_subtotal').innerText = `$${costoNetoSinIVA.toFixed(2)}`;
    document.getElementById('res_iva').innerText = `$${montoIVA.toFixed(2)}`;
    document.getElementById('res_total_neto').innerText = `$${costoNetoConIVA.toFixed(2)}`;
    document.getElementById('res_unit_sin').innerText = `$${unitarioSinIVA.toFixed(2)}`;
    document.getElementById('res_unit_con').innerText = `$${unitarioConIVA.toFixed(2)}`;
    document.getElementById('panel_resultados').style.display = 'block';
    document.getElementById('explicacion_detalles').style.display = 'none';

    const ctx = {
        cantidadBase, detalleUbicaciones, totalTintasPorPrenda,
        sumaImpresionUnitaria, labelTela, labelColor,
        cargoFondeoTela, cargoFondeoColor, cargoFodeoTotal,
        subtotalUnitario, impresionesTotales, totalBruto,
        porcentajeDesc, montoDescuento, totalImpresionNeto,
        costoMarcos, t, origenPlayeras, numMermas,
        factorUtilidad, detallePlayeras, costoTotalPlayeras,
        infoEnvio, costoEnvioTotal, hayExistencia,
        costoDiseno, labelDiseno, tDis, personalizados,
        costoNetoSinIVA, montoIVA, costoNetoConIVA,
        unitarioSinIVA, unitarioConIVA,
        itemsVinilEnResumen, desglosePlanchado, totalCostoPersonalizado, detallesDTF
    };

    generarDesglose(ctx);
    generarResumen(ctx);
}

// ─────────────────────────────────────────────
//  DESGLOSE DETALLADO (HTML)
// ─────────────────────────────────────────────
function generarDesglose(d) {
    const sep = `<hr style="border-color:rgba(255,255,255,0.15);margin:10px 0;">`;
    let html = `<div class="desglose-section">`;

    html += `<h4 class="dg-title">📦 DATOS GENERALES</h4>`;
    html += `<p class="dg-row"><span>Prendas a imprimir:</span><strong>${d.cantidadBase} piezas</strong></p>`;
    html += `<p class="dg-row"><span>Tela:</span><strong>${d.labelTela}</strong></p>`;
    html += `<p class="dg-row"><span>Color tela:</span><strong>${d.labelColor}</strong></p>`;
    html += sep;

    html += `<h4 class="dg-title">🎨 IMPRESIÓN POR UBICACIÓN</h4>`;
    html += `<p class="dg-note">Fórmula: <code>Costo/Tinta × Núm. Tintas = Subtotal por Prenda en esa Ubicación</code></p>`;

    d.detalleUbicaciones.forEach(u => {
        const rango = u.tintas <= 2 ? '(tarifa 1-2 tintas)' : '(tarifa 3-4 tintas, descuento por cantidad)';
        html += `<div class="dg-box">`;
        html += `<b>📍 ${u.ubiName.toUpperCase()}</b> — ${u.tamanoTexto}`;
        if (u.isOficio) html += ` <small style="color:#fcd34d;">(+$${d.t.serigrafia.cargo_oficio}/tinta por tamaño Oficio+)</small>`;
        html += `<p class="dg-formula">$${u.costoPorTinta}/tinta ${rango} × ${u.tintas} tintas = <strong>$${u.subtotalUbi}</strong></p>`;
        html += `</div>`;
    });

    if (d.cargoFodeoTotal > 0) {
        html += `<div class="dg-box dg-warning">`;
        html += `<b>⚠️ CARGO FONDEO</b> — Se cobra 1 sola vez por prenda (sin importar cuántas ubicaciones)`;
        if (d.cargoFondeoTela > 0) html += `<p class="dg-formula">Tela ${d.labelTela}: +$${d.cargoFondeoTela}</p>`;
        if (d.cargoFondeoColor > 0) html += `<p class="dg-formula">Color ${d.labelColor}: +$${d.cargoFondeoColor} (fondeo para imprimir sobre oscuro)</p>`;
        html += `</div>`;
    }

    html += `<p class="dg-row dg-sum"><span>Subtotal unitario de impresión:</span><strong>$${d.subtotalUnitario}</strong></p>`;
    html += sep;

    html += `<h4 class="dg-title">💸 DESCUENTO POR VOLUMEN</h4>`;
    html += `<p class="dg-note">Cada tinta por prenda cuenta como 1 impresión. Fórmula: <code>Tintas/Prenda × Cantidad Prendas = Impresiones Totales</code></p>`;
    html += `<p class="dg-formula">${d.totalTintasPorPrenda} tintas/prenda × ${d.cantidadBase} prendas = <strong>${d.impresionesTotales} impresiones totales</strong></p>`;
    html += `<p class="dg-formula">Subtotal bruto: $${d.subtotalUnitario} × ${d.cantidadBase} prendas = <strong>$${d.totalBruto.toFixed(2)}</strong></p>`;

    if (d.porcentajeDesc > 0) {
        html += `<p class="dg-formula dg-green">Descuento ${(d.porcentajeDesc * 100)}%: $${d.totalBruto.toFixed(2)} × ${d.porcentajeDesc} = <strong>−$${d.montoDescuento.toFixed(2)}</strong></p>`;
    } else {
        html += `<p class="dg-formula dg-gray">Sin descuento (menos de 100 impresiones totales)</p>`;
    }
    html += `<p class="dg-row dg-sum"><span>Total Neto Impresión (bruto − descuento):</span><strong>$${d.totalImpresionNeto.toFixed(2)}</strong></p>`;
    html += sep;

    html += `<h4 class="dg-title">🖼️ MARCOS DE REVELADO</h4>`;
    html += `<p class="dg-note">1 marco por tinta. Se cobra UNA sola vez (no se multiplica por prendas).</p>`;
    html += `<p class="dg-formula">${d.totalTintasPorPrenda} tintas totales × $${d.t.serigrafia.marco_normal}/marco = <strong>$${d.costoMarcos}</strong></p>`;
    html += `<p class="dg-row dg-sum"><span>Total Marcos:</span><strong>$${d.costoMarcos}</strong></p>`;
    html += sep;

    // Personalizado
    if (d.personalizados && d.personalizados.length > 0) {
        html += `<h4 class="dg-title">⭐ PERSONALIZADO</h4>`;
        d.personalizados.forEach((p, i) => {
            html += `<div class="dg-box"><b>Elemento ${i + 1}:</b> ${p.ubicacion} — ${p.ancho}×${p.alto}cm — ${(p.tecnica==='vinil')?'Vinil Textil ('+p.tipoVinilTxt+')':'DTF'}</div>`;
        });
        
        if (d.itemsVinilEnResumen.length > 0) {
            html += `<p class="dg-formula dg-warning" style="margin-top:10px;">⚠️ Ancho de corte (descontando rodillos): 44cm.</p>`;
            d.itemsVinilEnResumen.forEach(v => {
                html += `<div class="dg-box dg-gray">`;
                html += `<b>Rollos de Vinil ${v.nombre}</b><br>`;
                html += `Longitud facturada: <strong>${v.mtCobrar} metros</strong> (redondeo a 0.25m)<br>`;
                html += `Venta Material: \`$${v.costoMaterial.toFixed(2)} × ${v.utilidadMult}\` = <strong>$${v.ventaMaterial.toFixed(2)}</strong><br>`;
                html += `Mano de Obra: Corte $${v.costoCorte.toFixed(2)} + Depilado $${v.costoDepilado.toFixed(2)}<br>`;
                html += `<span style="display:block;margin-top:5px;border-top:1px dashed #ccc;padding-top:5px;"><b>Subtotal Material + Maquila: $${v.subtotalVinil.toFixed(2)}</b></span>`;
                html += `</div>`;
            });
        }

        if (d.detallesDTF) {
            const dt = d.detallesDTF;
            html += `<div class="dg-box dg-gray">`;
            html += `<b>DTF (Direct to Film)</b><br>`;
            html += `Longitud óptima (incl. 1cm margen/lado), Ancho Rollo 58cm: <strong>${dt.largoTotalCm} cm</strong><br>`;
            html += `Facturado: <strong>${dt.metrosTotales} metro(s)${dt.fraccionStr}</strong><br>`;
            html += `Venta Material: \`Costo Base $${dt.costoBase.toFixed(2)} × Tabulador de Utilidad\` = <strong>$${dt.ventaMaterialDTF.toFixed(2)}</strong><br>`;
            
            if (dt.costoEnvioDTF > 0) {
                html += `Costo de Envío Proveedor DTF (compra material menor a límite gratis): <strong>+$${dt.costoEnvioDTF.toFixed(2)}</strong><br>`;
                html += `<strong style="font-size:1.1rem; color:#6ee7b7; display:block; margin-top:6px;">Subtotal DTF + Envío: $${dt.ventaTotal.toFixed(2)}</strong>`;
            } else {
                html += `<strong style="font-size:1.1rem; color:#6ee7b7; display:block; margin-top:6px;">Subtotal DTF (Envío $0 al superar límite): $${dt.ventaTotal.toFixed(2)}</strong>`;
            }
            html += `</div>`;
        }

        if (d.desglosePlanchado) {
            html += `<div class="dg-box dg-warning">`;
            html += `<b>Planchado / Transferencia Térmica</b><br>`;
            html += `Total de bajadas de plancha (Elementos × Playeras): ${d.desglosePlanchado.prensadas} prensadas.<br>`;
            html += `Tarifa aplicada: $${d.desglosePlanchado.tarifa} por prensada.<br>`;
            html += `<b>Total Planchado: $${d.desglosePlanchado.total.toFixed(2)}</b>`;
            html += `</div>`;
        }
        
        html += `<p class="dg-row dg-sum"><span>Total Personalizados:</span><strong>$${d.totalCostoPersonalizado.toFixed(2)}</strong></p>`;
        html += sep;
    }

    html += `<h4 class="dg-title">👕 PLAYERAS</h4>`;
    if (d.origenPlayeras === 'comprar') {
        html += `<p class="dg-note">Fórmula: <code>Precio Proveedor × Factor Utilidad × Cantidad = Subtotal</code></p>`;
        html += `<p class="dg-formula">Factor utilidad aplicado: <strong>×${d.factorUtilidad}</strong> para ${d.cantidadBase} prendas</p>`;
        html += `<p class="dg-formula">Precio base usado: ${d.cantidadBase >= 12 ? 'MAYOREO (+12 pzas)' : 'MENUDEO (menos de 12 pzas)'}</p>`;

        d.detallePlayeras.forEach(p => {
            html += `<div class="dg-box">`;
            html += `<b>${p.cantPz}× ${p.marca} — ${p.modelo} (${p.variante})</b>`;
            html += `<p class="dg-formula">$${p.precioBase} × ×${p.factorUtilidad} = $${p.precioVenta.toFixed(2)}/pieza</p>`;
            html += `<p class="dg-formula">$${p.precioVenta.toFixed(2)} × ${p.cantPz} pzas = <strong>$${p.subtotalRenglon.toFixed(2)}</strong></p>`;
            html += `</div>`;
        });

        if (d.detallePlayeras._merma) {
            const m = d.detallePlayeras._merma;
            html += `<div class="dg-box dg-warning">`;
            html += `<b>🔄 MERMA OPERATIVA</b> — 5 prendas por cada 100 pedidas`;
            html += `<p class="dg-formula">ceil(${d.cantidadBase}/100) × 5 = ${m.numMermas} prendas merma</p>`;
            html += `<p class="dg-formula">$${m.precioMermaBase} × ×${m.factorUtilidad} × ${m.numMermas} = <strong>$${m.costoMerma.toFixed(2)}</strong></p>`;
            html += `</div>`;
        }
        html += `<p class="dg-row dg-sum"><span>Total Playeras (con mermas):</span><strong>$${d.costoTotalPlayeras.toFixed(2)}</strong></p>`;

        html += sep;
        html += `<h4 class="dg-title">🚚 ENVÍO</h4>`;
        if (d.hayExistencia) {
            html += `<p class="dg-formula dg-green">✅ Playeras en existencia física. <strong>Costo Envío: $0.00</strong></p>`;
        } else if (d.infoEnvio) {
            const e = d.infoEnvio;
            html += `<div class="dg-box">`;
            html += `<b>Paquetes requeridos: ${e.paquetesEnvio}</b> (1 paquete cada 70 prendas)`;
            html += `<p class="dg-formula">${e.paquetesEnvio} paquetes × $${e.tarifa} = <strong>$${e.costoEnvio.toFixed(2)}</strong></p>`;
            html += `</div>`;
            html += `<p class="dg-row dg-sum"><span>Total Envío:</span><strong>$${e.costoEnvio.toFixed(2)}</strong></p>`;
        }
    } else {
        html += `<p class="dg-formula dg-green">✅ Cliente envía playeras. Costo = $0</p>`;
        html += `<p class="dg-formula">⚠️ Pedir ${d.numMermas} piezas extra de sobrante.</p>`;
        html += `<p class="dg-row dg-sum"><span>Total Playeras:</span><strong>$0.00</strong></p>`;
        html += sep;
        html += `<h4 class="dg-title">🚚 ENVÍO</h4>`;
        html += `<p class="dg-formula dg-gray">No aplica envío (el cliente entrega).</p>`;
    }
    html += sep;

    html += `<h4 class="dg-title">✏️ DISEÑO</h4>`;
    html += `<p class="dg-formula">${d.labelDiseno}: <strong>$${d.costoDiseno}</strong></p>`;
    html += sep;

    html += `<h4 class="dg-title">📊 RESUMEN FINAL</h4>`;
    html += `<table class="dg-table">
        <tr><td>Impresión neta (con desc.)</td><td>$${d.totalImpresionNeto.toFixed(2)}</td></tr>
        <tr><td>Marcos de revelado</td><td>$${d.costoMarcos}</td></tr>
        <tr><td>Costo de Playeras</td><td>$${d.costoTotalPlayeras.toFixed(2)}</td></tr>
        <tr><td>Costo de Envío</td><td>$${d.costoEnvioTotal.toFixed(2)}</td></tr>
        <tr><td>Personalizado</td><td>$${d.totalCostoPersonalizado.toFixed(2)}</td></tr>
        <tr><td>Diseño</td><td>$${d.costoDiseno}</td></tr>
        <tr class="dg-tr-sub"><td><b>SUBTOTAL sin IVA</b></td><td><b>$${d.costoNetoSinIVA.toFixed(2)}</b></td></tr>
        <tr><td>IVA 16%: $${d.costoNetoSinIVA.toFixed(2)} × 0.16</td><td>$${d.montoIVA.toFixed(2)}</td></tr>
        <tr class="dg-tr-total"><td><b>TOTAL con IVA</b></td><td><b>$${d.costoNetoConIVA.toFixed(2)}</b></td></tr>
        <tr><td>Costo unitario sin IVA</td><td>$${d.unitarioSinIVA.toFixed(2)}</td></tr>
        <tr><td>Costo unitario con IVA</td><td>$${d.unitarioConIVA.toFixed(2)}</td></tr>
    </table>`;

    html += `</div>`;
    document.getElementById('explicacion_detalles').innerHTML = html;
}

// ─────────────────────────────────────────────
//  RESUMEN SIMPLIFICADO PARA WHATSAPP
// ─────────────────────────────────────────────
function generarResumen(d) {
    const lineas = [];

    // Ubicaciones en una línea
    const ubisTexto = d.detalleUbicaciones.map(u => `${u.ubiName} (${u.tintas} tinta${u.tintas > 1 ? 's' : ''})`).join(' + ');

    // Playeras
    let playerasTexto = '';
    if (d.origenPlayeras === 'comprar' && d.detallePlayeras.length > 0) {
        playerasTexto = d.detallePlayeras.map(p => `${p.cantPz}× ${p.marca} ${p.modelo} (${p.variante})`).join(', ');
    } else {
        playerasTexto = `Cliente envía (+ ${d.numMermas} pzas merma)`;
    }

    // Personalizado
    const persTexto = (d.personalizados && d.personalizados.length > 0)
        ? d.personalizados.map(p => `${p.ubicacion} ${p.ancho}×${p.alto}cm ${(p.tecnica==='vinil')?p.tipoVinilTxt:'DTF'}`).join(' | ')
        : null;

    // Descuento
    const descTexto = d.porcentajeDesc > 0
        ? `Desc. volumen ${(d.porcentajeDesc * 100)}%: −$${d.montoDescuento.toFixed(2)}`
        : null;

    lineas.push(`━━━ COTIZACIÓN TEXTIL ━━━`);
    lineas.push(`📦 Cantidad: ${d.cantidadBase} prendas`);
    lineas.push(`🎨 Servicio: SERIGRAFÍA IMPRESA`);
    lineas.push(`📍 Impresión: ${ubisTexto}`);
    if (persTexto) lineas.push(`⭐ Personalizado: ${persTexto}`);
    lineas.push(`👕 Playeras: ${playerasTexto}`);
    if (d.origenPlayeras === 'comprar') {
        lineas.push(`🚚 Envío: ${d.hayExistencia ? 'Sin cargo (Existencia)' : '$' + d.costoEnvioTotal.toFixed(2)}`);
    }
    lineas.push(`✏️ Diseño: ${d.labelDiseno.split('(')[0].trim()}`);
    if (descTexto) lineas.push(`💸 ${descTexto}`);
    lineas.push(`──────────────────────────`);
    lineas.push(`Subtotal:       $${d.costoNetoSinIVA.toFixed(2)}`);
    lineas.push(`IVA 16%:        $${d.montoIVA.toFixed(2)}`);
    lineas.push(`Total:          $${d.costoNetoConIVA.toFixed(2)}`);
    lineas.push(`Precio c/u:     $${d.unitarioConIVA.toFixed(2)} (con IVA)`);

    document.getElementById('resumen_texto').innerText = lineas.join('\n');
    document.getElementById('panel_resumen').style.display = 'block';
}

function copiarResumen() {
    const txt = document.getElementById('resumen_texto').innerText;
    navigator.clipboard.writeText(txt).then(() => {
        const btn = document.getElementById('btn_copiar');
        btn.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
        btn.style.background = '#059669';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i> Copiar al Portapapeles';
            btn.style.background = '';
        }, 2500);
    });
}

// ─────────────────────────────────────────────
//  TOGGLE EXPLICACIÓN
// ─────────────────────────────────────────────
function toggleExplicacion() {
    const el = document.getElementById('explicacion_detalles');
    const btn = document.getElementById('btn_explicacion');
    if (el.style.display === 'none' || el.style.display === '') {
        el.style.display = 'block';
        btn.innerHTML = '<i class="fas fa-chevron-up"></i> OCULTAR EXPLICACIÓN';
    } else {
        el.style.display = 'none';
        btn.innerHTML = '<i class="fas fa-file-invoice-dollar"></i> VER EXPLICACIÓN DETALLADA';
    }
}

// ─────────────────────────────────────────────
//  LIMPIAR CAMPOS
// ─────────────────────────────────────────────
function limpiarCampos() {
    if (!confirm('¿Deseas limpiar todos los campos y empezar de nuevo?')) return;

    document.getElementById('cantidad_general').value = '';
    document.getElementById('cantidad_general').disabled = false;
    document.getElementById('tipo_servicio').selectedIndex = 0;
    document.getElementById('tipo_tela').selectedIndex = 0;
    document.getElementById('color_tela').selectedIndex = 0;
    document.getElementById('origen_playeras').selectedIndex = 0;
    document.getElementById('tipo_diseno').selectedIndex = 0;

    // Existencia
    hayExistencia = false;
    document.getElementById('btn_exis_no').className = 'toggle-btn active-no';
    document.getElementById('btn_exis_si').className = 'toggle-btn';

    // Ubicaciones
    document.getElementById('contenedor_ubicaciones').innerHTML = '';
    idUbicacion = 0;
    agregarUbicacion();

    // Personalizado
    llevaPersonalizado = false;
    idPersonalizado = 0;
    document.getElementById('contenedor_personalizado').innerHTML = '';
    document.getElementById('seccion_personalizado').style.display = 'none';
    document.getElementById('btn_pers_no').className = 'toggle-btn active-no';
    document.getElementById('btn_pers_si').className = 'toggle-btn';

    // Carrito
    carritoPlayeras = [];
    document.getElementById('lista_carrito').innerHTML = '<p style="color:#94a3b8;">Sin prendas añadidas.</p>';
    document.getElementById('total_piezas_carrito').innerText = 'Total piezas: 0';
    document.getElementById('catalogo_playeras_ui').style.display = 'none';

    // Paneles
    document.getElementById('panel_resultados').style.display = 'none';
    document.getElementById('panel_resumen').style.display = 'none';
    document.getElementById('explicacion_detalles').style.display = 'none';
    document.getElementById('explicacion_detalles').innerHTML = '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─────────────────────────────────────────────
//  TABULADOR / COSTOS DEL SISTEMA
// ─────────────────────────────────────────────
function abrirConfig() { document.getElementById('modalConfig').style.display = 'flex'; }
function cerrarConfig() { document.getElementById('modalConfig').style.display = 'none'; }

function generarUITabulador() {
    const t = TABULADOR_COSTOS;
    const cat = CATALOGO_PLAYERAS;
    let html = ``;

    html += `<div class="sys-cost-group">
        <h3 style="color:var(--primary);margin-bottom:10px;"><i class="fas fa-print"></i> Serigrafía</h3>
        <div class="form-grid">
            <div class="form-group"><label>Marco Revelado ($)</label><input type="number" id="t_marco" value="${t.serigrafia.marco_normal}"></div>
            <div class="form-group"><label>Fondeo Tela Oscura ($)</label><input type="number" id="t_oscuro" value="${t.serigrafia.cargo_color_oscuro}"></div>
            <div class="form-group"><label>Fondeo Poliéster ($)</label><input type="number" id="t_poli" value="${t.serigrafia.cargo_poliester}"></div>
            <div class="form-group"><label>Fondeo Mezcla ($)</label><input type="number" id="t_mezcla" value="${t.serigrafia.cargo_mezcla}"></div>
            <div class="form-group"><label>Carta 1-2 Tintas ($/tinta)</label><input type="number" id="t_c1" value="${t.serigrafia.carta_costo_1_2_tintas}"></div>
            <div class="form-group"><label>Carta 3-4 Tintas ($/tinta)</label><input type="number" id="t_c2" value="${t.serigrafia.carta_costo_3_mas_tintas}"></div>
            <div class="form-group"><label>Cargo Oficio+ ($/tinta)</label><input type="number" id="t_oficio" value="${t.serigrafia.cargo_oficio}"></div>
            <div class="form-group"><label>Escudo/Manga 1-2 Tintas ($/tinta)</label><input type="number" id="t_e1" value="${t.serigrafia.escudo_costo_1_2_tintas}"></div>
            <div class="form-group"><label>Escudo/Manga 3-4 Tintas ($/tinta)</label><input type="number" id="t_e2" value="${t.serigrafia.escudo_costo_3_mas_tintas}"></div>
        </div>
    </div>`;

    html += `<div class="sys-cost-group">
        <h3 style="color:var(--primary);margin-bottom:10px;"><i class="fas fa-paint-brush"></i> Diseño y Envío</h3>
        <div class="form-grid">
            <div class="form-group"><label>Diseño — Cliente envía ($)</label><input type="number" id="t_dc" value="${t.otros.diseno_cliente}"></div>
            <div class="form-group"><label>Diseño — Guardado aquí ($)</label><input type="number" id="t_dg" value="${t.otros.diseno_guardado}"></div>
            <div class="form-group"><label>Diseño — Nuevo ($)</label><input type="number" id="t_dn" value="${t.otros.diseno_nuevo}"></div>
            <div class="form-group"><label>Envío (cada 70 pzas, $)</label><input type="number" id="t_envio" value="${t.otros.envio_por_70_pz}"></div>
        </div>
    </div>`;

    html += `<div class="sys-cost-group">
        <h3 style="color:var(--primary);margin-bottom:10px;"><i class="fas fa-star"></i> Personalizado (Vinil Textil)</h3>
        <div class="form-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">`;
    
    t.personalizado.viniles.forEach(v => {
        html += `<div class="form-group"><label>Vinil ${v.nombre} ($/m)</label><input type="number" class="t-pers-vinil" data-id="${v.id}" value="${v.costoM}"></div>`;
    });
    
    html += `
            <div class="form-group"><label>Corte Mínimo ($)</label><input type="number" id="t_corte_min" value="${t.personalizado.maquila.corte_min}"></div>
            <div class="form-group"><label>Corte Metro < 5m ($)</label><input type="number" id="t_corte_bajo" value="${t.personalizado.maquila.corte_metro_bajo}"></div>
            <div class="form-group"><label>Corte Metro >= 5m ($)</label><input type="number" id="t_corte_alto" value="${t.personalizado.maquila.corte_metro_alto}"></div>
            <div class="form-group"><label>Depilado Mínimo ($)</label><input type="number" id="t_depilado_min" value="${t.personalizado.maquila.depilado_min}"></div>
            <div class="form-group"><label>Depilado Metro < 10m ($)</label><input type="number" id="t_depilado_bajo" value="${t.personalizado.maquila.depilado_metro_bajo}"></div>
            <div class="form-group"><label>Depilado Metro >= 10m ($)</label><input type="number" id="t_depilado_alto" value="${t.personalizado.maquila.depilado_metro_alto}"></div>
            <div class="form-group"><label>Planchado (<= 25 pzas, $/hit)</label><input type="number" id="t_plancha_bajo" value="${t.personalizado.tarifas_planchado[0].tarifa}"></div>
            <div class="form-group"><label>Planchado (> 25 pzas, $/hit)</label><input type="number" id="t_plancha_alto" value="${t.personalizado.tarifas_planchado[1].tarifa}"></div>
        </div>
        
        <h4 style="margin-top:15px;color:var(--muted);font-size:0.9rem;">Utilidad Variable Vinil (Metraje : Multiplicador)</h4>
        <div class="form-grid" style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); margin-top:8px;">`;
    
    t.personalizado.utilidad_vinil.forEach((u, idx) => {
        html += `<div class="form-group"><label>Hasta ${u.max === Infinity ? '∞' : u.max + 'm'}</label><input type="number" step="0.1" class="t-pers-util" data-idx="${idx}" value="${u.util}"></div>`;
    });

    html += `</div></div>`;

    html += `<div class="sys-cost-group">
        <h3 style="color:var(--primary);margin-bottom:10px;"><i class="fas fa-print"></i> Personalizado (DTF)</h3>
        <div class="form-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
            <div class="form-group"><label>1/4 Metro Costo ($)</label><input type="number" id="t_dtf_c" value="${t.personalizado.dtf.precios.cuarto.costo}"></div>
            <div class="form-group"><label>1/4 Metro Utilidad (x)</label><input type="number" step="0.1" id="t_dtf_cu" value="${t.personalizado.dtf.precios.cuarto.util}"></div>
            
            <div class="form-group"><label>1/2 Metro Costo ($)</label><input type="number" id="t_dtf_m" value="${t.personalizado.dtf.precios.medio.costo}"></div>
            <div class="form-group"><label>1/2 Metro Utilidad (x)</label><input type="number" step="0.1" id="t_dtf_mu" value="${t.personalizado.dtf.precios.medio.util}"></div>
            
            <div class="form-group"><label>Metro Costo ($)</label><input type="number" id="t_dtf_mt" value="${t.personalizado.dtf.precios.metro.costo}"></div>
            <div class="form-group"><label>Metro Utilidad (x)</label><input type="number" step="0.1" id="t_dtf_mtu" value="${t.personalizado.dtf.precios.metro.util}"></div>
            
            <div class="form-group"><label>Envío DTF ($)</label><input type="number" id="t_dtf_e" value="${t.personalizado.dtf.envio.costo}"></div>
            <div class="form-group"><label>Envío Límite Metros</label><input type="number" id="t_dtf_em" value="${t.personalizado.dtf.envio.metros_por_costo}"></div>
            <div class="form-group"><label>Envío Gratis si Costo >= ($)</label><input type="number" id="t_dtf_eg" value="${t.personalizado.dtf.envio.costo_minimo_gratis}"></div>
        </div>
    </div>`;

    // SECCIÓN COSTO DE PLAYERAS (ORDENADO POR MARCA Y MODELO)
    html += `<div class="sys-cost-group">
        <h3 style="color:var(--primary);margin-bottom:10px;"><i class="fas fa-tshirt"></i> Costos de Playeras (Proveedor)</h3>
        <p style="font-size:0.8rem;color:var(--muted);margin-bottom:1.2rem;">Modifica los costos base. El sistema aplicará la utilidad en la cotización.</p>
        <div id="accordion-playeras">`;

    const marcas = [...new Set(cat.map(p => p.marca))];
    marcas.forEach(marca => {
        html += `<details class="marca-details">
            <summary class="marca-summary">${marca}</summary>
            <div style="padding:10px;">`;
        
        const modelos = cat.filter(p => p.marca === marca);
        modelos.forEach(modelo => {
            const globalIdx = cat.indexOf(modelo);
            html += `<details class="modelo-details">
                <summary class="modelo-summary">${modelo.tipo}</summary>
                <div class="variantes-edit-grid">
                    <div class="variantes-edit-header">Variante / Talla</div>
                    <div class="variantes-edit-header" style="text-align:right;">Menor</div>
                    <div class="variantes-edit-header" style="text-align:right;">Mayor</div>`;
            
            modelo.variantes.forEach((v, varIdx) => {
                html += `
                    <div style="font-size:0.85rem;color:var(--text);">${v.nombre}</div>
                    <input type="number" step="0.01" class="costo-playera-input" 
                        data-mod="${globalIdx}" data-var="${varIdx}" data-type="menor" value="${v.menor}">
                    <input type="number" step="0.01" class="costo-playera-input" 
                        data-mod="${globalIdx}" data-var="${varIdx}" data-type="mayor" value="${v.mayor}">
                `;
            });
            html += `</div></details>`;
        });
        html += `</div></details>`;
    });

    html += `</div></div>`;

    document.getElementById('formTabulador').innerHTML = html;
}

function guardarConfig() {
    // 1. Guardar Serigrafía y Otros
    TABULADOR_COSTOS.serigrafia.marco_normal = parseFloat(document.getElementById('t_marco').value);
    TABULADOR_COSTOS.serigrafia.cargo_color_oscuro = parseFloat(document.getElementById('t_oscuro').value);
    TABULADOR_COSTOS.serigrafia.cargo_poliester = parseFloat(document.getElementById('t_poli').value);
    TABULADOR_COSTOS.serigrafia.cargo_mezcla = parseFloat(document.getElementById('t_mezcla').value);
    TABULADOR_COSTOS.serigrafia.carta_costo_1_2_tintas = parseFloat(document.getElementById('t_c1').value);
    TABULADOR_COSTOS.serigrafia.carta_costo_3_mas_tintas = parseFloat(document.getElementById('t_c2').value);
    TABULADOR_COSTOS.serigrafia.cargo_oficio = parseFloat(document.getElementById('t_oficio').value);
    TABULADOR_COSTOS.serigrafia.escudo_costo_1_2_tintas = parseFloat(document.getElementById('t_e1').value);
    TABULADOR_COSTOS.serigrafia.escudo_costo_3_mas_tintas = parseFloat(document.getElementById('t_e2').value);
    TABULADOR_COSTOS.otros.diseno_cliente = parseFloat(document.getElementById('t_dc').value);
    TABULADOR_COSTOS.otros.diseno_guardado = parseFloat(document.getElementById('t_dg').value);
    TABULADOR_COSTOS.otros.diseno_nuevo = parseFloat(document.getElementById('t_dn').value);
    TABULADOR_COSTOS.otros.envio_por_70_pz = parseFloat(document.getElementById('t_envio').value);

    // 2. Guardar costos de Playeras
    document.querySelectorAll('.costo-playera-input').forEach(input => {
        const modIdx = parseInt(input.dataset.mod);
        const varIdx = parseInt(input.dataset.var);
        const type = input.dataset.type; // 'menor' o 'mayor'
        const val = parseFloat(input.value);
        if (!isNaN(val)) {
            CATALOGO_PLAYERAS[modIdx].variantes[varIdx][type] = val;
        }
    });

    // 3. Guardar Personalizado
    document.querySelectorAll('.t-pers-vinil').forEach(input => {
        const id = input.dataset.id;
        const vinil = TABULADOR_COSTOS.personalizado.viniles.find(v => v.id === id);
        if (vinil) vinil.costoM = parseFloat(input.value);
    });

    document.querySelectorAll('.t-pers-util').forEach(input => {
        const idx = parseInt(input.dataset.idx);
        TABULADOR_COSTOS.personalizado.utilidad_vinil[idx].util = parseFloat(input.value);
    });

    TABULADOR_COSTOS.personalizado.maquila.corte_min = parseFloat(document.getElementById('t_corte_min').value);
    TABULADOR_COSTOS.personalizado.maquila.corte_metro_bajo = parseFloat(document.getElementById('t_corte_bajo').value);
    TABULADOR_COSTOS.personalizado.maquila.corte_metro_alto = parseFloat(document.getElementById('t_corte_alto').value);
    TABULADOR_COSTOS.personalizado.maquila.depilado_min = parseFloat(document.getElementById('t_depilado_min').value);
    TABULADOR_COSTOS.personalizado.maquila.depilado_metro_bajo = parseFloat(document.getElementById('t_depilado_bajo').value);
    TABULADOR_COSTOS.personalizado.maquila.depilado_metro_alto = parseFloat(document.getElementById('t_depilado_alto').value);
    TABULADOR_COSTOS.personalizado.tarifas_planchado[0].tarifa = parseFloat(document.getElementById('t_plancha_bajo').value);
    TABULADOR_COSTOS.personalizado.tarifas_planchado[1].tarifa = parseFloat(document.getElementById('t_plancha_alto').value);

    // Guardar DTF
    TABULADOR_COSTOS.personalizado.dtf.precios.cuarto.costo = parseFloat(document.getElementById('t_dtf_c').value);
    TABULADOR_COSTOS.personalizado.dtf.precios.cuarto.util = parseFloat(document.getElementById('t_dtf_cu').value);
    TABULADOR_COSTOS.personalizado.dtf.precios.medio.costo = parseFloat(document.getElementById('t_dtf_m').value);
    TABULADOR_COSTOS.personalizado.dtf.precios.medio.util = parseFloat(document.getElementById('t_dtf_mu').value);
    TABULADOR_COSTOS.personalizado.dtf.precios.metro.costo = parseFloat(document.getElementById('t_dtf_mt').value);
    TABULADOR_COSTOS.personalizado.dtf.precios.metro.util = parseFloat(document.getElementById('t_dtf_mtu').value);
    
    TABULADOR_COSTOS.personalizado.dtf.envio.costo = parseFloat(document.getElementById('t_dtf_e').value);
    TABULADOR_COSTOS.personalizado.dtf.envio.metros_por_costo = parseFloat(document.getElementById('t_dtf_em').value);
    TABULADOR_COSTOS.personalizado.dtf.envio.costo_minimo_gratis = parseFloat(document.getElementById('t_dtf_eg').value);

    guardarTabulador();
    cerrarConfig();

    // Actualizar UI del catálogo por si cambiaron precios
    mostrarVariantesPlayera();
    renderCarrito();

    alert('✅ Tabulador y Catálogo guardados correctamente.');
}
