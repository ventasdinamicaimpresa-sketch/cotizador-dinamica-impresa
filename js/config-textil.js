const DEFAULT_TABULADOR = {
    serigrafia: {
        marco_normal: 160,
        marco_maquila: 120, // Solo informativo o si se agrega check de maquila
        cargo_poliester: 8,
        cargo_mezcla: 6,
        cargo_color_oscuro: 8,
        carta_costo_1_2_tintas: 14,
        carta_costo_3_mas_tintas: 9,
        cargo_oficio: 1.5,
        escudo_costo_1_2_tintas: 8,
        escudo_costo_3_mas_tintas: 6,
    },
    descuentos: [
        { min: 1000, desc: 0.50 },
        { min: 850, desc: 0.45 },
        { min: 700, desc: 0.40 },
        { min: 550, desc: 0.30 },
        { min: 400, desc: 0.25 },
        { min: 250, desc: 0.20 },
        { min: 150, desc: 0.15 },
        { min: 100, desc: 0.10 },
        { min: 0, desc: 0 }
    ],
    utilidad_playeras: [
        { max: 20, util: 2.00 }, // x2
        { max: 50, util: 1.85 }, // 85% extra
        { max: 100, util: 1.80 },
        { max: 200, util: 1.70 },
        { max: 500, util: 1.60 },
        { max: 800, util: 1.50 },
        { max: Infinity, util: 1.40 }
    ],
    personalizado: {
        viniles: [
            { id: 'basico', nombre: 'Básico Detalle', costoM: 220 },
            { id: 'metalico', nombre: 'Metálico', costoM: 250 },
            { id: 'glitter', nombre: 'Glitter', costoM: 330 },
            { id: 'holografico', nombre: 'Holográfico', costoM: 185 },
        ],
        tarifas_planchado: [
            { max: 25, tarifa: 20 },
            { max: Infinity, tarifa: 15 }
        ],
        maquila: {
            corte_min: 50,
            corte_metro_bajo: 80, // < 5m
            corte_metro_alto: 65,  // >= 5m
            depilado_min: 60,
            depilado_metro_bajo: 60, // < 10m
            depilado_metro_alto: 45,  // >= 10m
        },
        utilidad_vinil: [
            { max: 0.25, util: 2.5 },
            { max: 0.50, util: 2.3 },
            { max: 0.75, util: 2.0 },
            { max: 1.00, util: 1.8 },
            { max: 10.00, util: 1.8 },
            { max: Infinity, util: 1.6 }
        ],
        dtf: {
            ancho_cm: 58,
            margen_cm: 2, // 1cm extra por lado
            precios: {
                cuarto: { costo: 120, util: 2.0 },
                medio: { costo: 220, util: 2.0 },
                metro: { costo: 370, util: 1.8 }
            },
            envio: {
                costo: 200,
                metros_por_costo: 10,
                costo_minimo_gratis: 1550
            }
        }
    },
    sublimacion: {
        precios_impresion: {
            carta: [
                { max: 20, costo: 30 },
                { max: 49, costo: 25 },
                { max: Infinity, costo: 19 }
            ],
            oficio: [
                { max: 20, costo: 38 },
                { max: 49, costo: 28 },
                { max: Infinity, costo: 23 }
            ]
        },
        medidas_material: {
            carta: { anchoCM: 19, altoCM: 26 },
            oficio: { anchoCM: 19, altoCM: 32 }
        }
    },
    otros: {
        envio_por_70_pz: 220,
        merma_porcentaje: 0.05, // 5 prendas por cada 100
        diseno_cliente: 150,
        diseno_guardado: 200,
        diseno_nuevo: 300
    }
};

const DEFAULT_CATALOGO_PLAYERAS = [
    {
        marca: "M&O = CUELLO REDNDO Y TIPO POLO ECONOMICAS",
        tipo: "4800 GOLD 100% ALGODÓN UNISEX",
        variantes: [
            { nombre: "BLANCO (S-XL)", menor: 46.45, mayor: 33.54 }, // menor: 1 pz, mayor: 12+ pz
            { nombre: "BLANCO (XXL)", menor: 57.38, mayor: 45.41 },
            { nombre: "BLANCO (3XL/4XL)", menor: 69.95, mayor: 49.87 },
            { nombre: "NEGRO Y COLORES (S-XL)", menor: 53.51, mayor: 38.63 },
            { nombre: "NEGRO Y COLORES (XXL)", menor: 64.15, mayor: 46.52 },
            { nombre: "NEGRO Y COLORES (3XL/4XL)", menor: 76.65, mayor: 56.57 },
            { nombre: "VERDE/NARANJA SEGURIDAD (S-XL)", menor: 55.69, mayor: 40.39 },
            { nombre: "VERDE/NARANJA SEGURIDAD (XXL)", menor: 67.23, mayor: 48.76 },
            { nombre: "VERDE/N. SEGURIDAD (3XL/4XL)", menor: 82.23, mayor: 58.80 }
        ]
    },
    {
        marca: "M&O = CUELLO REDNDO Y TIPO POLO ECONOMICAS",
        tipo: "4810 GOLD 100% ALGODÓN DAMA",
        variantes: [
            { nombre: "BLANCO (S-XL)", menor: 54.92, mayor: 40.91 },
            { nombre: "BLANCO (XXL)", menor: 70.31, mayor: 52.37 },
            { nombre: "NEGRO Y COLORES (S-XL)", menor: 61.08, mayor: 46.09 },
            { nombre: "NEGRO Y COLORES (XXL)", menor: 85.69, mayor: 64.66 }
        ]
    },
    {
        marca: "M&O = CUELLO REDNDO Y TIPO POLO ECONOMICAS",
        tipo: "4850 GOLD 100% ALGODÓN NIÑO",
        variantes: [
            { nombre: "BLANCO (XXS-M)", menor: 33.38, mayor: 26.04 },
            { nombre: "BLANCO (L-XL)", menor: 36.46, mayor: 28.44 },
            { nombre: "BLANCO (XXL)", menor: 47.23, mayor: 36.84 },
            { nombre: "NEGRO Y COLORES (XXS-M)", menor: 38.00, mayor: 29.64 },
            { nombre: "NEGRO Y COLORES (L-XL)", menor: 43.38, mayor: 33.84 },
            { nombre: "NEGRO Y COLORES (XXL)", menor: 51.85, mayor: 40.44 },
            { nombre: "COLORES NEÓN (XXS-M)", menor: 39.54, mayor: 30.84 },
            { nombre: "COLORES NEÓN (L-XL)", menor: 44.92, mayor: 35.04 },
            { nombre: "COLORES NEÓN (XXL)", menor: 53.38, mayor: 41.64 }
        ]
    },
    {
        marca: "M&O = CUELLO REDNDO Y TIPO POLO ECONOMICAS",
        tipo: "7000 TIPO POLO PIQUE HOMBRE",
        variantes: [
            { nombre: "BLANCO (S-XL)", menor: 98.50, mayor: 70.92 },
            { nombre: "BLANCO (2XL-3XL)", menor: 126.83, mayor: 91.32 },
            { nombre: "NEGRO Y COLORES (S-XL)", menor: 115.17, mayor: 82.92 },
            { nombre: "NEGRO Y COLORES (2XL-3XL)", menor: 135.17, mayor: 97.32 }
        ]
    },
    {
        marca: "M&O = CUELLO REDNDO Y TIPO POLO ECONOMICAS",
        tipo: "7600 TIPO POLO PIQUE DAMA",
        variantes: [
            { nombre: "BLANCO (S-XL)", menor: 98.50, mayor: 71.91 },
            { nombre: "BLANCO (XXL)", menor: 121.83, mayor: 88.94 },
            { nombre: "NEGRO Y COLORES (S-XL)", menor: 111.83, mayor: 81.64 },
            { nombre: "NEGRO Y COLORES (XXL)", menor: 135.17, mayor: 98.67 }
        ]
    },
    {
        marca: "GILDAN = CUELLO REDONDO PREMIUM",
        tipo: "64000 SOFT STYLE HOMBRE",
        variantes: [
            { nombre: "BLANCO (S-XL)", menor: 56.43, mayor: 43.15 },
            { nombre: "BLANCO (XXL)", menor: 70.02, mayor: 53.54 },
            { nombre: "NEGRO Y COLORES (S-XL)", menor: 66.22, mayor: 50.64 },
            { nombre: "NEGRO Y COLORES (XXL)", menor: 80.86, mayor: 61.84 }
        ]
    },
    {
        marca: "GILDAN = CUELLO REDONDO PREMIUM",
        tipo: "64000L SOFT STYLE DAMA",
        variantes: [
            { nombre: "BLANCO (X-XL)", menor: 57.09, mayor: 43.66 },
            { nombre: "BLANCO (XXL)", menor: 68.85, mayor: 52.65 },
            { nombre: "NEGRO Y COLORES (S-XL)", menor: 63.51, mayor: 48.56 },
            { nombre: "NEGRO Y COLORES (XXL)", menor: 76.17, mayor: 58.25 }
        ]
    },
    {
        marca: "MAXIMA DEPORITVA = TIPO POLO PREMIUM",
        tipo: "MAXPP TIPO POLO PIQUE HOMBRE",
        variantes: [
            { nombre: "BLANCO (S-XL)", menor: 125.23, mayor: 106.44 }, // mayor es -15% (12+ pz) -> aprox 106.44
            { nombre: "BLANCO (XXL-XXXL)", menor: 161.95, mayor: 137.65 },
            { nombre: "GRIS JASPE (S-XL)", menor: 131.48, mayor: 111.75 },
            { nombre: "GRIS JASPE (XXL-XXXL)", menor: 171.33, mayor: 145.63 },
            { nombre: "NEGRO Y COLORES (S-XL)", menor: 150.23, mayor: 127.69 },
            { nombre: "NEGRO Y COLORES (XXL-XXXL)", menor: 195.55, mayor: 166.21 }
        ]
    },
    {
        marca: "MAXIMA DEPORITVA = TIPO POLO PREMIUM",
        tipo: "MAXDM TIPO POLO PIQUE DAMA",
        variantes: [
            { nombre: "BLANCO (S-XL)", menor: 121.67, mayor: 103.41 },
            { nombre: "GRIS JASPE (S-XL)", menor: 124.05, mayor: 105.44 },
            { nombre: "NEGRO Y COLORES (S-XL)", menor: 135.16, mayor: 114.88 }
        ]
    },
    {
        marca: "ULTRA DRY = TELA DEPORTIVA",
        tipo: "UDCR MANGA CORTA DRY FIT",
        variantes: [
            { nombre: "UNISEX (S-XL)", menor: 101.31, mayor: 86.11 }, // -15%
            { nombre: "UNISEX (2XL-3XL)", menor: 131.31, mayor: 111.61 },
            { nombre: "DAMA (S-XL)", menor: 101.31, mayor: 86.11 },
            { nombre: "NIÑO (S-XL)", menor: 90.54, mayor: 76.95 }
        ]
    },
    {
        marca: "ULTRA DRY = TELA DEPORTIVA",
        tipo: "UDCRML MANGA LARGA DRY FIT",
        variantes: [
            { nombre: "UNISEX (S-XL)", menor: 140.54, mayor: 119.45 },
            { nombre: "UNISEX (XXL)", menor: 182.85, mayor: 155.42 }
        ]
    },
    {
        marca: "ULTRA DRY = TELA DEPORTIVA",
        tipo: "UDTP TIPO POLO MANGA CORTA DRY FIT",
        variantes: [
            { nombre: "UNISEX (S-XL)", menor: 184.75, mayor: 157.03 },
            { nombre: "UNISEX (XXL)", menor: 221.31, mayor: 188.11 },
            { nombre: "DAMA (S-XL)", menor: 184.75, mayor: 157.03 },
            { nombre: "NIÑO (S-XL)", menor: 168.08, mayor: 142.86 }
        ]
    },
    {
        marca: "ULTRA DRY = TELA DEPORTIVA",
        tipo: "UDTPML TIPO POLO MANGA LARGA DRY FIT",
        variantes: [
            { nombre: "UNISEX (S-XL)", menor: 249.75, mayor: 212.28 },
            { nombre: "UNISEX (XXL)", menor: 324.75, mayor: 276.03 }
        ]
    },
    {
        marca: "PLAYERYTEES = SUBLIMACION",
        tipo: "4000C/D/N CUELLO REDONDO SUBLIMAR",
        variantes: [
            { nombre: "ADULTO/DAMA BLANCO (S-XL)", menor: 58.17, mayor: 48.14 }, // mayor 12pz
            { nombre: "ADULTO/DAMA BLANCO (XXL)", menor: 67.13, mayor: 55.61 },
            { nombre: "NIÑO BLANCO (XS-XL)", menor: 41.92, mayor: 34.60 }
        ]
    },
    {
        marca: "YAZBECK = CUELLO REDONDO",
        tipo: "C0200 CUELLO REDONDO CABALLERO",
        variantes: [
            { nombre: "BLANCO (CH-EG)", menor: 60.00, mayor: 38.28 }, // menor: menudeo, mayor: mayoreo
            { nombre: "BLANCO (EEG)", menor: 75.00, mayor: 48.14 },
            { nombre: "BLANCO (EEEG)", menor: 94.50, mayor: 60.32 },
            { nombre: "COLORES (CH-EG)", menor: 60.00, mayor: 44.08 },
            { nombre: "COLORES (EEG)", menor: 75.00, mayor: 55.10 },
            { nombre: "COLORES (EEEG)", menor: 94.50, mayor: 69.02 }
        ]
    },
    {
        marca: "YAZBECK = CUELLO REDONDO",
        tipo: "N0300 CUELLO REDONDO NIÑOS",
        variantes: [
            { nombre: "BLANCO (CH a EG)", menor: 40.00, mayor: 27.26 },
            { nombre: "NEGRO Y COLORES (CH a EG)", menor: 40.00, mayor: 32.48 }
        ]
    },
    {
        marca: "YAZBECK = CUELLO REDONDO",
        tipo: "J0300 CUELLO REDONDO JOVENES",
        variantes: [
            { nombre: "BLANCO (ECH-EG)", menor: 50.00, mayor: 31.32 },
            { nombre: "NEGRO Y COLORES (ECH-EG)", menor: 50.00, mayor: 37.70 }
        ]
    }
];

let TABULADOR_COSTOS = JSON.parse(localStorage.getItem('TABULADOR_TEXTIL')) || DEFAULT_TABULADOR;
let CATALOGO_PLAYERAS = JSON.parse(localStorage.getItem('CATALOGO_PLAYERAS_TEXTIL')) || DEFAULT_CATALOGO_PLAYERAS;

// MAPPING DE MIGRACIÓN DE MARCAS
const brandMigrationMap = {
    "M&O": "M&O = CUELLO REDNDO Y TIPO POLO ECONOMICAS",
    "GILDAN": "GILDAN = CUELLO REDONDO PREMIUM",
    "MAXIMA DEPORTIVA": "MAXIMA DEPORITVA = TIPO POLO PREMIUM",
    "ULTRA DRY": "ULTRA DRY = TELA DEPORTIVA",
    "PLAYERYTEES": "PLAYERYTEES = SUBLIMACION",
    "YAZBEK": "YAZBECK = CUELLO REDONDO",
    // También incluir las versiones de la migración anterior por si acaso
    "CUELLO REDONDO Y TIPO POLO ECONOMICAS": "M&O = CUELLO REDNDO Y TIPO POLO ECONOMICAS",
    "CUELLO REDONDO PREMIUM": "GILDAN = CUELLO REDONDO PREMIUM",
    "TIPO POLO PREMIUM": "MAXIMA DEPORITVA = TIPO POLO PREMIUM",
    "TELA DEPORTIVA": "ULTRA DRY = TELA DEPORTIVA",
    "SUBLIMACION": "PLAYERYTEES = SUBLIMACION",
    "CUELLO REDONDO": "YAZBECK = CUELLO REDONDO"
};

// Aplicar migración si detectamos nombres viejos en el catálogo cargado del localStorage
let huboMigracion = false;
CATALOGO_PLAYERAS.forEach(item => {
    if (brandMigrationMap[item.marca]) {
        item.marca = brandMigrationMap[item.marca];
        huboMigracion = true;
    }
});

if (huboMigracion) {
    localStorage.setItem('CATALOGO_PLAYERAS_TEXTIL', JSON.stringify(CATALOGO_PLAYERAS));
}

// Asegurar que nuevas llaves existan si vienen de un localStorage viejo
if (!TABULADOR_COSTOS.personalizado) {
    TABULADOR_COSTOS.personalizado = DEFAULT_TABULADOR.personalizado;
} else if (!TABULADOR_COSTOS.personalizado.dtf) {
    TABULADOR_COSTOS.personalizado.dtf = DEFAULT_TABULADOR.personalizado.dtf;
} else if (!TABULADOR_COSTOS.personalizado.dtf.envio) {
    TABULADOR_COSTOS.personalizado.dtf.envio = DEFAULT_TABULADOR.personalizado.dtf.envio;
}

if (!TABULADOR_COSTOS.sublimacion) {
    TABULADOR_COSTOS.sublimacion = DEFAULT_TABULADOR.sublimacion;
}

function guardarTabulador() {
    localStorage.setItem('TABULADOR_TEXTIL', JSON.stringify(TABULADOR_COSTOS));
    localStorage.setItem('CATALOGO_PLAYERAS_TEXTIL', JSON.stringify(CATALOGO_PLAYERAS));
}
