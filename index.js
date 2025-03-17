const express = require('express')
const { faker } =  require('@faker-js/faker');
const mongoose = require('mongoose');

const {Schema, Types} = mongoose; //mongoose.Schema // new code 

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/brotherszone');
}

main().catch(err => console.log(err));

const BrandSchema = new mongoose.Schema({
  name: String
});
const SliderSchema = new mongoose.Schema({
  image: String
});



const ProductSchema = new mongoose.Schema({
  brand_id: { type: Schema.Types.ObjectId, ref: 'brands' }, // new code 
  image: String,
  name: String,
  price: Number,
  images: Array
});




















const app = express()
const port = 3001

let assets_folder = express.static('assets')
app.use(assets_folder)

app.set('view engine', 'ejs')

app.get('/', async (req, res) => {

  
  

  //connect with brands collection
  const BrandModel = mongoose.model('brands', BrandSchema) 
  const ProductsModel = mongoose.model('products', ProductSchema)

  /* new code for test */ 
  // const ProductD = await ProductsModel.findOne().populate('brand_id').exec();
  // return res.send(ProductD)


  const SliderModel = mongoose.model('sliders', SliderSchema)
  

  //get url query paramiter use `query` property in requset object
  const query_param = req.query;

  //count total data in model or collection
  const total_product = await ProductsModel.countDocuments();

  //undefined, Null, false, 'when empty string', [when empty array], {when empty object}  this data type returns false
  
  const page =  query_param.page ?? 1;

  //or

  /*
  if(query_param.page){
    page = query_param.page
  }
  else{
    page = 1
  }
  */



  const show_perpage = 12;
  const skip_data = (page - 1) * show_perpage;
  let total_page_count = total_product / show_perpage;

  //Math.ceil() return nearest upper integer value like 6.2 = 7, 8.2 = 9
  total_page_count = Math.ceil(total_page_count)

  /*
  1 -1 * 10 = 0
  2 -1* 10 = 20 
  3 -1* 10 = 30 
  */




  //getting data 
  const products_data = await ProductsModel.find({}).skip(skip_data).limit(show_perpage)
  .populate('brand_id') //new code 
  .exec(); //new code 



  const brand_data = await BrandModel.find({})
  const slider_data = await SliderModel.find({})

  //render home.ejs and passing data for showing
  res.render('home', {
    brands: brand_data,
    products: products_data,


    active_page: parseInt(page),
    total_page_count: total_page_count, // send total page count in browser 
    
    
    sliders: JSON.stringify(slider_data) // convert slider_data object to string
  })

});

app.get('/details-page/:id',async (req, res) => {

  const id = req.params.id;
  //connect with brands collection
  const BrandModel = mongoose.model('brands', BrandSchema) 
  const ProductsModel = mongoose.model('products', ProductSchema)
  //getting data 
  const brand_data = await BrandModel.find({})
  const product_data = await ProductsModel.findOne({ _id: id})

  res.render('details-page',{
    brands: brand_data,
    productData: product_data
  })

});

app.get('/brand-data-insert', async (req, res) => {
  const BrandModel = mongoose.model('brands', BrandSchema);
  
  for(let i =0; i< 25; i++){
    //insert using create method 
    await BrandModel.create({
      name: faker.commerce.productAdjective()
    })
  }
  res.send('data inserted')
  
});

app.get('/sliders-data-insert', async (req, res) => {
  const SliderModel = mongoose.model('sliders', SliderSchema);

  for(let i =0; i< 4; i++){
    await SliderModel.create({
      image: faker.image.url({ height: 570, width: 1920 })
    })
  }

  res.send('data inserted')

});





app.get('/products-data-insert', async (req, res) => {
  const ProductModel = mongoose.model('products', ProductSchema);

  const BrandModel = mongoose.model('brands', BrandSchema);

  // new code modify 
  const BrandData = await BrandModel.find(
    {}, // first paramiter condtion object
    
    {_id: 1} // second paramiter projection object
  );

  // return res.send(BrandData);

  await ProductModel.deleteMany({})

  for(let i =0; i< 100; i++){
    const images = [
      faker.image.url({ height: 1080, width: 1080 }),
      faker.image.url({ height: 1080, width: 1080 }),
      faker.image.url({ height: 1080, width: 1080 }),
      faker.image.url({ height: 1080, width: 1080 })
    ];

    await ProductModel.create({
      image: faker.image.url({ height: 1080, width: 1080 }),
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      images: images, // Save images as an 
      
      
      /* new code relation data id insert */
      //brand: new Types.ObjectId('67c856649ee9815c9f005917'), //moongose.Types.ObjectId()
      // brand_id: BrandData[0]._id,
      brand_id: faker.helpers.arrayElement(BrandData)._id
      
    })
  }
  res.send('data inserted')

});



/*

app.get('/fake-data-test', async (req, res) => {
  const BrandModel = mongoose.model('brands', BrandSchema);

  //for delete all data 
  await BrandModel.deleteMany({})

  //drop collection
  // mongoose.connection.db.dropCollection("brands");

  const all_brands = [];

  for(let i =0; i< 25; i++){

    //each object insert in all brands array 
    all_brands.push({
      name: faker.commerce.productAdjective()
    })
  }

  //insert using insertMany method
  BrandModel.insertMany(all_brands)

  // create new object of Model
  const brand = new BrandModel({
      name: faker.commerce.productAdjective()
    })

  //insert using save method
  await brand.save()

  //insert using create method 
  await BrandModel.create({
    name: faker.commerce.productAdjective()
  })

  res.send('Data Inserted')
})

*/

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})