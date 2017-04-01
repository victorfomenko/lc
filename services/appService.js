import $http from './$http';
var api = {};
api.optionsList = {
  print: {
    frame: [
      {value: null, name: ""}
    ],
    borders: [
      {value: null, name: ""}
    ]
  },
  canvas: {
    frame: [
      {value: '150', name: '1.5 см в толщину'},
      {value: '300', name: '3 см в толщину'}/*,
       {value: 'BF', name: 'Древесная черная'},
       {value: 'WF', name: 'Древесная белая'},
       {value: 'EF', name: 'Древесная кофейная'}*/
    ],
    borders: [
      {value: 'BB', name: 'Черный край'},
      {value: 'WB', name: 'Белый край'},
      {value: 'LB', name: 'Заливка фоном'}
    ]
  },
  inframe: {
    frame: [
      {value: 'BF', name: 'Древесная черная'},
      {value: 'WF', name: 'Древесная белая'},
      {value: 'EF', name: 'Древесная кофейная'}
    ],
    borders: [
      {value: '630MA', name: '6 см матовые'},
      {value: 'NOMA', name: 'Без матовых краев'}
    ]
  },
  sizesH: [
    {value: '30|30', name: '30см × 30см'},
    {value: '40|60', name: '40см × 60см'},
    {value: '60|60', name: '60см × 60см'},
    {value: '60|90', name: '60см × 90см'},
    {value: '90|90', name: '90см × 90см'},
    {value: '75|100', name: '75см × 100см'}

  ],
  sizesV: [
    {value: '30|30', name: '30см × 30см'},
    {value: '60|40', name: '60см × 40см'},
    {value: '60|60', name: '60см × 60см'},
    {value: '90|60', name: '90см × 60см'},
    {value: '90|90', name: '90см × 90см'},
    {value: '100|75', name: '100см × 75см'}
  ],
  // sizesH: [
  //   {value: '20|25', name: '20см × 25см'},
  //   {value: '30|30', name: '30см × 30см'},
  //   {value: '30|40', name: '30см × 40см'},
  //   {value: '30|45', name: '30см × 45см'},
  //   {value: '40|50', name: '40см × 50см'},
  //   {value: '40|60', name: '40см × 60см'},
  //   {value: '45|60', name: '45см × 60см'},
  //   {value: '50|60', name: '50см × 60см'},
  //   {value: '60|60', name: '60см × 60см'},
  //   {value: '50|75', name: '50см × 75см'},
  //   {value: '60|90', name: '60см × 90см'},
  //   {value: '90|90', name: '90см × 90см'},
  //   {value: '95|95', name: '95см × 95см'},
  //   {value: '75|100', name: '75см × 100см'},
  //   {value: '45|120', name: '45см × 120см'},
  //   {value: '90|135', name: '90см × 135см'},
  //   {value: '60|180', name: '60см × 180см'}
  // ],
  // sizesV: [
  //   {value: '25|20', name: '25см × 20см'},
  //   {value: '30|30', name: '30см × 30см'},
  //   {value: '40|30', name: '40см × 30см'},
  //   {value: '45|30', name: '45см × 30см'},
  //   {value: '50|40', name: '50см × 40см'},
  //   {value: '60|40', name: '60см × 40см'},
  //   {value: '60|45', name: '60см × 45см'},
  //   {value: '60|50', name: '60см × 50см'},
  //   {value: '60|60', name: '60см × 60см'},
  //   {value: '75|50', name: '75см × 50см'},
  //   {value: '90|60', name: '90см × 60см'},
  //   {value: '90|90', name: '90см × 90см'},
  //   {value: '95|95', name: '95см × 95см'},
  //   {value: '100|75', name: '100см × 75см'}
  // ],
  sizes: []
};
for (var i = 25; i <= 180; i++) { //generate canvas sizes from 20 sm to 160 sm
  var newSize = {
    value: i.toString(),
    name: i + 'см'
  };
  api.optionsList.sizes.push(newSize)
}
api.productStates = [
  {id: 'PO', name: 'Печать', class: "print-only", isActive: true},
  {id: 'CP', name: 'На холсте', class: "canvas", isActive: false},
  {id: 'FP', name: 'В раме', class: "frame", isActive: false}
];
api.pictures = [];
api.dataForSent = {
  formName: '',
  formPhone: '',
  formEmail: '',
  formPostal: '',
  formProduct: 'CP',
  formFrameSize: api.optionsList.sizesV[1].value,
  formFrameType: '150',
  formBorderType: 'BB',
  formPrice: '',
  formShippingPrice: 0,
  formCity: 'Казань',
  formAddress: '',
  imageBase64: '',
  image: ''

};
api.imageProp = 1.5; //default horizontal prop
api.calcPrice = function (width, height, productType, borderType) {
  if (!productType || !width || !height) return;
  width = Number(width);
  height = Number(height);

  var price = 0;
  var canvasBackstretch = 10, // запас для натяжки на подрамник
    frameSizeSquare = (width * height) / 10000,
    frameCanvasSizeSquare = ((width * 1 + canvasBackstretch) * (height * 1 + canvasBackstretch)) / 10000,
    frameSizeSquareInner = ((width - 3) * (height - 3)) / 10000,
    frameLength = (width * 2 + height * 2) / 100,
    POCoast = 1500,
    CPCoast = 1500,
    FPCoast = 400,
    boxing = 50, // упаковка. цена за метр
    assembly = 85, // сборка. цена за метр
    underFrameCoast1 = 100,
    underFrameCoast2 = 160,
    frameCoast = 790,
    penokartonCoast = 300,
    paspartuCoast = 557,
    glassCoast = 650;

  //calculate if print only
  if (productType === "PO" && !borderType) {
    price = 2 * Math.round((frameSizeSquare * POCoast) / 10) * 10 + 100;
  }
  //calculate if canvas print
  else if (productType === "CP" && borderType) {

    var underFrameCoast;
    switch (borderType) {
      default:
      case '150':
        underFrameCoast = underFrameCoast1;
        break;
      case '300':
        underFrameCoast = underFrameCoast2;
        break;
    }
    const printPrice =      frameCanvasSizeSquare * CPCoast;
    const underFramePrice = frameLength * underFrameCoast;
    const buildPrice = frameLength * assembly;
    const primeCoast = printPrice + underFramePrice + buildPrice + boxing; // Себестоимость
    price = primeCoast*1.1; // накрутка 10% по умолчанию
    
    if(width + height === 100){
      price = primeCoast*1.2;  // накрутка 20% для размеров 40x60
    }
    else if(width + height === 60){
      price = primeCoast*1.6;  // накрутка 60% для размеров 30x30
    }
    price = Math.round(price / 1) * 1; // Round

  }
  //calculate if frame print
  else if (productType === "FP" && borderType) {
    if (borderType === 'NOMA') {
      paspartuCoast = 0
    }
    const printPrice = frameSizeSquareInner * FPCoast;
    const framePrice = frameLength * frameCoast;
    const glassPrice = frameSizeSquareInner * glassCoast;
    const buildPrice = frameLength * assembly;
    const paspartuPrice = frameSizeSquareInner * paspartuCoast;
    const penokartonPrice = frameSizeSquareInner * penokartonCoast;
    const primeCoast = printPrice + framePrice + glassPrice + paspartuPrice + penokartonPrice + buildPrice + boxing;
    price = primeCoast;
    price = primeCoast*1.6; // накрутка 60% по умолчанию
    
    if(width + height === 60 || width + height === 175){
      price = primeCoast*1.8;  // накрутка 80% для размеров 30x30 и 75x100
    }

    price = Math.round(price / 1) * 1; // Round

  }
  return price;
};
api.calcPriceSaveForSent = function () {
  var data = this.dataForSent,
    frameSizeWH = data.formFrameSize.split('|'),
    width = frameSizeWH[0],
    height = frameSizeWH[1],
    productType = data.formProduct,
    borderType = '';

  switch (productType) {
    default:
    case 'CP':
      borderType = data.formFrameType;
      break;
    case 'FP':
      borderType = data.formBorderType;
      break;
  }
  var price = api.calcPrice(width, height, productType, borderType);
  this.dataForSent.formPrice = price;
  return price;
};
api.getImageList = function (limit) {
  return $http.post('/ajax/getListOfPic.php', limit)
    .then(function (data) {
      if (typeof  data === 'object') {
        return data;
      }
    })
    .catch(function (data) {
      console.log(data);
    });
};
export default api;