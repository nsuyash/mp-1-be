const express = require('express')
const {initalizeDatabase} = require('./db/db.connect')
const MobileAndTablets = require('./models/mobile&Tablets.models')
const app = express()
const cors = require('cors')
const corsOpt = {
  origin: "*",
  credentials: true
}

initalizeDatabase()

app.use(express.json())
app.use(cors(corsOpt))

// To get all data route
async function obtainAllProducts(){
  try {
    const products = await MobileAndTablets.find()
    return products
  } catch (error){
    throw error
  }
}

app.get('/products', async (req, res) => {
  try {
    const products = await obtainAllProducts()
    if(products){
      res.status(200).json(products)
    } else {
      res.status(404).json({error: "Products Not Found."})
    }
  } catch (error) {
    res.status(500).json({error: `Failed to fetch Products: ${error}.`})
  }
})

// To get product by Id route

async function obtainProductById(productId){
  try {
    const product = await MobileAndTablets.findById(productId)
    return product
  } catch (error){
    throw error
  }
}

app.get('/products/:productId', async (req, res) => {
  try {
    const product = await obtainProductById(req.params.productId)
    
    if(product){
      res.status(200).json(product)
    } else {
      res.status(404).json({error: "Products Not Found."})
    }
  } catch (error){
    res.status(500).json({error: `Failed to fetch Products: ${error}.`})
  }
})

// To get all product by category

async function getAllProductByCategory(category){
  try {
    const products = await MobileAndTablets.find({categoryName: category})
    return products
  } catch (error) {
    throw error
  }
}

app.get('/collection/:categoryName', async (req, res) => {
  try {
    const products = await getAllProductByCategory(req.params.categoryName)

    if(products){
      res.status(200).json(products)
    }
  } catch (error) {
    
  }
}) 
// To seed multiple product data at once route

async function seedAllProductsAtOnce(products){
  try {
    let savedProduct = []
    for(let product of products){
      const newProduct = new MobileAndTablets(product)
      newProduct.save();
      savedProduct.push(newProduct)
    }
    return savedProduct
  } catch (error){
    throw error
  }
}

app.post('/seedProduct/allProducts', async (req, res) => {
  try {
    const newProducts = await seedAllProductsAtOnce(req.body)

    if(newProducts){
      res.status(200).json(newProducts)
    } else {
      res.status(400).json({error: "Failed to add product. Check input data is in correct format."})
    }
  } catch (error){
    res.status(500).json({error: `Failed to add Products: ${error}.`})
  }
})

// To seed single product one data at once route

async function seedProducts(product){
  try {
    const newProduct = new MobileAndTablets(product)
    const savedProduct = newProduct.save()
    return savedProduct
  } catch (error){
    throw error
  }
}

app.post('/seedProduct/product', async (req, res) => {
  try {
    const newProduct = await seedProducts(req.body)

    if(newProduct){
      res.status(200).json(newProduct)
    } else {
      res.status(400).json({error: "Failed to add product. Check input data is in correct format."})
    }
  } catch (error){
    res.status(500).json({error: `Failed to add Products: ${error}.`})
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Sever is running on port ${PORT}`)
})
