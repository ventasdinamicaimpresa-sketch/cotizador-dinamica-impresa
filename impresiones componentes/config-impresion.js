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
    {id:'opal120c', name:'Opalina Blanca 120gr (carta)',costo:3.80,tamanos:['carta','doblecarta','30x45'],impacto:'medio'},
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
      '50': {maq:12.77,'501':13.05,'351':13.72,'151':14.66,'81':16.08,'26':17.50,'1':18.92},
      '80': {maq:21.10,'501':21.57,'351':22.66,'151':24.23,'81':26.57,'26':28.92,'1':31.26},
      '100':{maq:26.93,'501':27.53,'351':28.93,'151':30.92,'81':33.92,'26':36.91,'1':39.90},
    },
    medio:{
      '50': {maq:12.93,'501':13.22,'351':13.89,'151':14.85,'81':16.29,'26':17.72,'1':19.16},
      '80': {maq:21.28,'501':21.75,'351':22.85,'151':24.43,'81':26.79,'26':29.16,'1':31.52},
      '100':{maq:27.12,'501':27.72,'351':29.13,'151':31.14,'81':34.15,'26':37.17,'1':40.18},
    },
    alto:{
      '50': {maq:13.10,'501':13.39,'351':14.07,'151':15.04,'81':16.49,'26':17.95,'1':19.40},
      '80': {maq:21.45,'501':21.93,'351':23.04,'151':24.63,'81':27.01,'26':29.40,'1':31.78},
      '100':{maq:27.30,'501':27.90,'351':29.32,'151':31.34,'81':34.37,'26':37.41,'1':40.44},
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
