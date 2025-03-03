const express = require('express')
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})