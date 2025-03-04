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



const app = express()
const port = 3000

let assets_folder = express.static('assets')
app.use(assets_folder)

app.set('view engine', 'ejs')

app.get('/brotherszone.com', (req, res) => {
  res.render('home')
})

app.get('/details-page', (req, res) => {
  res.render('details-page')
})



app.get('/brand-data-insert', async (req, res) => {
  const BrandModel = mongoose.model('brands', BrandSchema);
  
  for(let i =0; i< 25; i++){
    //insert using create method 
    await BrandModel.create({
      name: faker.commerce.productAdjective()
    })
  }

  res.send('data inserted')
})



app.get('/sliders-data-insert', async (req, res) => {
  
})

app.get('/products-data-insert', async (req, res) => {
  
})





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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})