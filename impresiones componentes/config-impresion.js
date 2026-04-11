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
  {min:501, max:Infinity, key:'501'},
  {min:351, max:500, key:'351'},
  {min:151, max:350, key:'151'},
  {min:81,  max:150, key:'81'},
  {min:26,  max:80,  key:'26'},
  {min:1,   max:25,  key:'1'},
];

window.TABLA_IMP = {
  color:{
    bajo:{
      '30': {maq:8.86, '501':9.06,  '351':9.52,  '151':10.18, '81':11.16, '26':12.15, '1':13.13},
      '50': {maq:10.15, '501':14.01, '351':14.72, '151':15.74, '81':17.26, '26':18.78, '1':20.31},
      '80': {maq:15.54, '501':21.44, '351':22.53, '151':24.08, '81':26.41, '26':28.74, '1':31.07},
      '100':{maq:19.12, '501':26.39, '351':27.73, '151':29.64, '81':32.51, '26':35.38, '1':38.25},
    },
    medio:{
      '30': {maq:9.07, '501':9.27,  '351':9.74,  '151':10.41, '81':11.42, '26':12.42, '1':13.43},
      '50': {maq:10.30, '501':14.22, '351':14.94, '151':15.97, '81':17.52, '26':19.06, '1':20.61},
      '80': {maq:15.69, '501':21.65, '351':22.74, '151':24.31, '81':26.66, '26':29.02, '1':31.37},
      '100':{maq:19.27, '501':26.60, '351':27.95, '151':29.87, '81':32.76, '26':35.66, '1':38.55},
    },
    alto:{
      '30': {maq:9.34, '501':9.54,  '351':10.03, '151':10.72, '81':11.76, '26':12.79, '1':13.83},
      '50': {maq:10.50, '501':14.49, '351':15.23, '151':16.28, '81':17.86, '26':19.43, '1':21.01},
      '80': {maq:15.89, '501':21.92, '351':23.03, '151':24.62, '81':27.00, '26':29.39, '1':31.77},
      '100':{maq:19.47, '501':26.87, '351':28.24, '151':30.18, '81':33.10, '26':36.03, '1':38.95},
    }
  },
  bn:{
    bajo:{
      '50': {maq:3.05,'501':3.12,'351':3.28,'151':3.50,'81':3.84,'26':4.18,'1':4.52},
      '100':{maq:5.06,'501':5.18,'351':5.44,'151':5.81,'81':6.38,'26':6.94,'1':7.50},
    },
    medio:{
      '50': {maq:3.21,'501':3.28,'351':3.45,'151':3.69,'81':4.05,'26':4.40,'1':4.76},
      '100':{maq:5.25,'501':5.37,'351':5.64,'151':6.03,'81':6.61,'26':7.20,'1':7.78},
    },
    alto:{
      '50': {maq:3.38,'501':3.45,'351':3.63,'151':3.88,'81':4.25,'26':4.63,'1':5.00},
      '100':{maq:5.43,'501':5.55,'351':5.83,'151':6.23,'81':6.83,'26':7.44,'1':8.04},
    }
  }
};

window.MULT_IMP = {carta:1,oficio:1.15,doblecarta:2,'30x45':2.5,'32x50':3.5};
window.MULT_PAPEL = {carta:2,oficio:2.3,doblecarta:2,'30x45':3,'32x50':3};
window.CORTE_EXTRA = {carta:0,oficio:150,doblecarta:0,'30x45':150,'32x50':150};

const RANGOS = window.RANGOS;
const TABLA_IMP = window.TABLA_IMP;
const MULT_IMP = window.MULT_IMP;
const MULT_PAPEL = window.MULT_PAPEL;
const CORTE_EXTRA = window.CORTE_EXTRA;
