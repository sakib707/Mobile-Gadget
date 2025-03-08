const express = require('express')
const { faker } =  require('@faker-js/faker');
const mongoose = require('mongoose');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/brotherszone');
}

main().catch(err => console.log(err));

// import { faker } from '@faker-js/faker';

const BrandSchema = new mongoose.Schema({
  name: String
});
const SliderSchema = new mongoose.Schema({
  image: String
});




const ProductSchema = new mongoose.Schema({
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
  const SliderModel = mongoose.model('sliders', SliderSchema) 
  //getting data 
  const brand_data = await BrandModel.find({})
  const products_data = await ProductsModel.find({});
  const slider_data = await SliderModel.find({})

  //render home.ejs and passing data for showing
  res.render('home', {
    brands: brand_data,
    products: products_data,
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
      image: faker.image.url({
        height: 400,
        width: 600
      })
    })
  }
  res.send('data inserted')

});

app.get('/products-data-insert', async (req, res) => {
  const ProductModel = mongoose.model('products', ProductSchema);

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
      images: images // Save images as an array
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