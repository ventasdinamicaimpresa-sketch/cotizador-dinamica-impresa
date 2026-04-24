window.PAPELES = {
  bond:[
    {id:'bond75_carta',  name:'Bond 75gr (carta)',  costo:1.56, tamanos:['carta','doblecarta','30x45'],  impacto:'bajo'},
    {id:'bond75_oficio', name:'Bond 75gr (oficio)', costo:1.63, tamanos:['oficio'],                     impacto:'bajo'},
    {id:'bond90_carta',  name:'Bond 90gr (carta)',  costo:1.60, tamanos:['carta','doblecarta','30x45'],  impacto:'bajo'},
    {id:'bond90_oficio', name:'Bond 90gr (oficio)', costo:1.95, tamanos:['oficio'],                     impacto:'bajo'},
    {id:'bond120',       name:'Bond 120gr',         costo:3.00, tamanos:['carta','doblecarta','30x45','oficio'],impacto:'bajo'},
  ],
  lustrolito:[
    {id:'couche128',name:'Couché/Lustrolito 128gr (carta)',costo:2.31,tamanos:['carta','doblecarta','30x45'],impacto:'bajo'},
    {id:'couche130',name:'Couché/Lustrolito 130gr (oficio)',costo:3.26,tamanos:['oficio','32x50'],impacto:'bajo'},
    {id:'couche148',name:'Couché 148gr (carta)',costo:2.95,tamanos:['carta','doblecarta','30x45'],impacto:'medio'},
    {id:'couche150',name:'Couché 150gr (oficio)',costo:3.50,tamanos:['oficio','32x50'],impacto:'medio'},
    {id:'couche200c',name:'Couché 200gr (carta)',costo:3.42,tamanos:['carta','doblecarta','30x45'],impacto:'medio'},
    {id:'couche200o',name:'Couché 200gr (oficio)',costo:4.91,tamanos:['oficio','32x50'],impacto:'medio'},
    {id:'couche250c',name:'Couché 250gr (carta)',costo:4.51,tamanos:['carta','doblecarta','30x45'],impacto:'medio'},
    {id:'couche250o',name:'Couché 250gr (oficio)',costo:6.23,tamanos:['oficio','32x50'],impacto:'medio'},
    {id:'couche300c',name:'Couché 300gr (carta)',costo:5.40,tamanos:['carta','doblecarta','30x45'],impacto:'alto'},
    {id:'couche300o',name:'Couché 300gr (oficio)',costo:7.37,tamanos:['oficio','32x50'],impacto:'alto'},
  ],
  opalina:[
    {id:'opal120c', name:'Papel opalina 120gr',costo:3.80,tamanos:['carta','doblecarta','30x45'],impacto:'medio'},
    {id:'opal120o', name:'Opalina Blanca 120gr (oficio)',costo:5.07,tamanos:['oficio','32x50'],impacto:'medio'},
    {id:'cart225b', name:'Cartulina Opalina Blanca 225gr',costo:7.34,tamanos:['carta','oficio','doblecarta','30x45'],impacto:'alto'},
    {id:'cart225c', name:'Cartulina Opalina Crema 225gr',costo:6.20,tamanos:['carta','oficio','doblecarta','30x45'],impacto:'alto'},
  ],
  adhesivo:[
    {id:'adhbri',name:'Adhesivo Brillante',costo:11.00,tamanos:['carta','oficio','doblecarta','30x45','32x50'],impacto:'bajo'},
    {id:'adhref',name:'Adhesivo Refrigeración',costo:12.50,tamanos:['carta','oficio','doblecarta','30x45','32x50'],impacto:'bajo'},
  ],
  grueso:[
    {id:'croma',  name:'Cartulina Cromacote 10pt',  costo:15.50,tamanos:['carta','oficio','doblecarta','30x45'],impacto:'alto'},
    {id:'sulfa',  name:'Cartulina Sulfatada 12pt',   costo:15.00,tamanos:['carta','oficio','doblecarta','30x45'],impacto:'alto'},
    {id:'bristol',name:'Cartulina Bristol',           costo:10.00,tamanos:['carta','doblecarta','30x45'],impacto:'alto'},
  ],
  traslucido:[
    {id:'albanene',name:'Papel Albanene 180gr',costo:16.00,tamanos:['carta','oficio','doblecarta'],impacto:'bajo'},
    {id:'acetato', name:'Papel Acetato',        costo:14.00,tamanos:['carta','doblecarta'],            impacto:'bajo'},
  ],
  invitacion:[
    {id:'stardc',name:'Cart. Stardeam Kant Silk',costo:28.00,tamanos:['carta','oficio','30x45','32x50'],impacto:'alto'},
    {id:'stardp',name:'Papel Stardeam Kant Silk',costo:20.00,tamanos:['carta','oficio','30x45','32x50'],impacto:'alto'},
  ]
};

// Exponer como const para compatibilidad hacia atrás si es necesario
const PAPELES = window.PAPELES;

// ============================================================
// TABLAS DE IMPRESIÓN (precio por cara carta tamaño base)
// ============================================================
window.RANGOS = [
  {min:1000, max:Infinity, key:'1000'},
  {min:500,  max:999,      key:'500'},
  {min:100,  max:499,      key:'100'},
  {min:25,   max:99,       key:'25'},
  {min:1,    max:24,       key:'1'},
];

window.TABLA_IMP = {
  color:{
    bajo:{
      '30': {maq:3.80, '1000':4.58, '500':4.71, '100':5.24, '25':5.76, '1':6.55},
      '50': {maq:4.21, '1000':5.08, '500':5.22, '100':5.80, '25':6.38, '1':7.25},
      '80': {maq:4.83, '1000':5.83, '500':5.99, '100':6.66, '25':7.33, '1':8.32},
      '100':{maq:5.24, '1000':6.32, '500':6.50, '100':7.22, '25':7.94, '1':9.03},
    },
    medio:{
      '30': {maq:5.65, '1000':6.43, '500':6.56, '100':7.09, '25':7.61, '1':8.40},
      '50': {maq:6.06, '1000':6.93, '500':7.07, '100':7.65, '25':8.23, '1':9.10},
      '80': {maq:6.68, '1000':7.68, '500':7.84, '100':8.51, '25':9.18, '1':10.17},
      '100':{maq:7.09, '1000':8.17, '500':8.35, '100':9.07, '25':9.79, '1':10.88},
    },
    alto:{
      '30': {maq:8.30, '1000':9.08, '500':9.21, '100':9.74, '25':10.26, '1':11.05},
      '50': {maq:8.71, '1000':9.58, '500':9.72, '100':10.30, '25':10.88, '1':11.75},
      '80': {maq:9.33, '1000':10.33, '500':10.49, '100':11.16, '25':11.83, '1':12.82},
      '100':{maq:9.74, '1000':10.82, '500':11.00, '100':11.72, '25':12.44, '1':13.53},
    }
  },
  bn:{
    bajo:{
      '50': {maq:3.05, '1000':3.12, '500':3.12, '100':3.50, '25':4.18, '1':4.52},
      '100':{maq:5.06, '1000':5.18, '500':5.18, '100':5.81, '25':6.94, '1':7.50},
    },
    medio:{
      '50': {maq:4.90, '1000':4.97, '500':4.97, '100':5.35, '25':6.03, '1':6.37},
      '100':{maq:6.91, '1000':7.03, '500':7.03, '100':7.66, '25':8.79, '1':9.35},
    },
    alto:{
      '50': {maq:7.55, '1000':7.62, '500':7.62, '100':8.00, '25':8.68, '1':9.02},
      '100':{maq:9.56, '1000':9.68, '500':9.68, '100':10.31, '25':11.44, '1':12.00},
    }
  }
};

window.MULT_IMP = {carta:1,oficio:1.15,doblecarta:2,'30x45':2.5,'32x50':3.5};
window.MULT_PAPEL = {carta:2,oficio:2.3,doblecarta:2,'30x45':3,'32x50':3};
window.CORTE_EXTRA = {carta:0,oficio:100,doblecarta:0,'30x45':150,'32x50':150};

const RANGOS = window.RANGOS;
const TABLA_IMP = window.TABLA_IMP;
const MULT_IMP = window.MULT_IMP;
const MULT_PAPEL = window.MULT_PAPEL;
const CORTE_EXTRA = window.CORTE_EXTRA;

window.costosLaminado = {
    'brillante': {
        'carta': [{ min: 1, max: 50, costo: 4.00 }, { min: 51, max: 100, costo: 3.80 }, { min: 101, max: 150, costo: 3.50 }, { min: 151, max: 200, costo: 3.30 }, { min: 201, max: 500, costo: 3.00 }, { min: 501, max: Infinity, costo: 2.80 }],
        'oficio': [{ min: 1, max: 50, costo: 5.40 }, { min: 51, max: 100, costo: 5.13 }, { min: 101, max: 150, costo: 4.725 }, { min: 151, max: 200, costo: 4.455 }, { min: 201, max: 500, costo: 4.05 }, { min: 501, max: Infinity, costo: 3.78 }],
        'doblecarta': [{ min: 1, max: 50, costo: 8.00 }, { min: 51, max: 100, costo: 7.60 }, { min: 101, max: 150, costo: 7.00 }, { min: 151, max: 200, costo: 6.60 }, { min: 201, max: 500, costo: 6.00 }, { min: 501, max: Infinity, costo: 5.60 }],
        '30x45': [{ min: 1, max: 50, costo: 10.00 }, { min: 51, max: 100, costo: 9.50 }, { min: 101, max: 150, costo: 8.75 }, { min: 151, max: 200, costo: 8.25 }, { min: 201, max: 500, costo: 7.50 }, { min: 501, max: Infinity, costo: 7.00 }],
        '32x50': [{ min: 1, max: 50, costo: 14.00 }, { min: 51, max: 100, costo: 13.30 }, { min: 101, max: 150, costo: 12.25 }, { min: 151, max: 200, costo: 11.55 }, { min: 201, max: 500, costo: 10.50 }, { min: 501, max: Infinity, costo: 9.80 }]
    },
    'mate': {
        'carta': [{ min: 1, max: 50, costo: 4.60 }, { min: 51, max: 100, costo: 4.37 }, { min: 101, max: 150, costo: 4.025 }, { min: 151, max: 200, costo: 3.795 }, { min: 201, max: 500, costo: 3.45 }, { min: 501, max: Infinity, costo: 3.22 }],
        'oficio': [{ min: 1, max: 50, costo: 6.21 }, { min: 51, max: 100, costo: 5.8995 }, { min: 101, max: 150, costo: 5.43375 }, { min: 151, max: 200, costo: 5.12325 }, { min: 201, max: 500, costo: 4.6575 }, { min: 501, max: Infinity, costo: 4.347 }],
        'doblecarta': [{ min: 1, max: 50, costo: 9.20 }, { min: 51, max: 100, costo: 8.74 }, { min: 101, max: 150, costo: 8.05 }, { min: 151, max: 200, costo: 7.59 }, { min: 201, max: 500, costo: 6.90 }, { min: 501, max: Infinity, costo: 6.44 }],
        '30x45': [{ min: 1, max: 50, costo: 11.50 }, { min: 51, max: 100, costo: 10.925 }, { min: 101, max: 150, costo: 10.0625 }, { min: 151, max: 200, costo: 9.4875 }, { min: 201, max: 500, costo: 8.625 }, { min: 501, max: Infinity, costo: 8.05 }],
        '32x50': [{ min: 1, max: 50, costo: 16.10 }, { min: 51, max: 100, costo: 15.295 }, { min: 101, max: 150, costo: 14.0875 }, { min: 151, max: 200, costo: 13.2825 }, { min: 201, max: 500, costo: 12.075 }, { min: 501, max: Infinity, costo: 11.27 }]
    }
};

window.LAMINADO_MINIMO = 250;
const costosLaminado = window.costosLaminado;
const LAMINADO_MINIMO = window.LAMINADO_MINIMO;
