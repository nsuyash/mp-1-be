const express = require('express')
const {initalizeDatabase} = require('./db/db.connect')
const Products = require('./models/products.models')
const app = express()
const cors = require('cors')
const { features } = require('process')
const corsOpt = {
  origin: "*",
  credentials: true
}

initalizeDatabase()

app.use(express.json())
app.use(cors(corsOpt))

// To get all data route
async function obtainAllProducts() {
  try {
    const products = await Products.find();
    return products;
  } catch (error) {
    throw error;
  }
}

// Route to get filtered products
app.get('/products', async (req, res) => {
  try {
    // Fetch filtered products from the database
    const products = await obtainAllProducts();

    if (products.length > 0) {      
      res.status(200).json(products);
    } else {
      res.status(404).json({ error: "Products Not Found." });
    }
  } catch (err) {
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
});

// To get product by Id route

async function obtainProductById(productId){
  try {
    const product = await Products.findById(productId)
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



// Function to get products by category with filters
async function getAllProductOfMobilesAndTablets(filters) {
  try {
    // Include both category and filters in the query object
    const query = { collectionType: "Mobiles&Tablets", ...filters };
    const products = await Products.find(query);
    return products;
  } catch (error) {
    throw error;
  }
}

// Route to handle GET request for "Mobiles & Tablets" collection
app.get('/collection/Mobiles&Tablets', async (req, res) => {
  try {
    const { brand, ram, internalStorage, primaryCamera, secondaryCamera, processor } = req.query;

    let filters = {};

    // Apply brand filter
    if (brand) {
      const brandName = brand.split(",");
      filters["features.brand"] = { $in: brandName };
    }

    // Apply RAM filter
    if (ram) {
      const ramValues = ram.split(",").map(value => parseInt(value.trim()))
      filters["features.ram"] = { $in: ramValues };
    }

    // Apply internal storage filter
    if (internalStorage) {
      const internalStorageValues = internalStorage.split(",").map(value => parseInt(value.trim()))
      filters["features.internal&nbsp;storage"] = { $in: internalStorageValues };
    }

    // Apply primary camera filter
    if (primaryCamera) {
      const primaryCameraValues = primaryCamera.split(",").map(value => parseInt(value.trim()))
      filters["features.primary&nbsp;camera"] = { $in: primaryCameraValues };
    }

    // Apply secondary camera filter
    if (secondaryCamera) {
      const secondaryCameraValues = secondaryCamera.split(",").map(value => parseInt(value.trim()))
      filters["features.secondary&nbsp;camera"] = { $in: secondaryCameraValues };
    }

    // Apply processor filter
    if (processor) {
      const processorName = processor.split(",");
      filters["features.processor"] = { $in: processorName };
    }

    // Fetch products based on category and filters
    const products = await getAllProductOfMobilesAndTablets(filters);

    // Check if products are found and return response
    if (products && products.length > 0) {

      const availableBrand = await Products.distinct('features.brand', {collectionType: 'Mobiles&Tablets'})
      const availableRam = await Products.distinct('features.ram', {collectionType: 'Mobiles&Tablets'})
      const availablePrimaryCamera = await Products.distinct('features.primary&nbsp;camera', {collectionType: 'Mobiles&Tablets'})
      const availableSecondaryCamera = await Products.distinct('features.secondary&nbsp;camera', {collectionType: 'Mobiles&Tablets'})
      const availableInternalStorage = await Products.distinct('features.internal&nbsp;storage', {collectionType: 'Mobiles&Tablets'})
      const availableProcessor = await Products.distinct('features.processor', {collectionType: 'Mobiles&Tablets'})
      
      
      res.status(200).json({products, filters: {brand: availableBrand, ram: availableRam, internalStorage: availableInternalStorage, primaryCamera: availablePrimaryCamera, secondaryCamera: availableSecondaryCamera, processor: availableProcessor}});
    } else {
      res.status(404).json({ message: "No products found matching the criteria."});
    }
  } catch (error) {
    // Handle errors and return a 500 status with the error message
    res.status(500).json({ error: `An error occurred while fetching products: ${error.message}` });
  }
});

//Function to get products by category with filters
async function getAllProductOfLaptops(filters){
  try {
    console.log(filters)
    const query = {collectionType: "Laptops", ...filters}
    const products = await Products.find(query)
    return products
  } catch (err) {
    throw err
  }
}

// Route to handle GET request for "laptops" collection
app.get('/collection/Laptops', async (req, res) => {
  try {

    const {brand, ram , ssd, type, processorBrand, processorGeneration, processor} = req.query
    const filters = {}

    if (brand) {
      const brandNames = brand.split(",").map(name => name.trim())
      filters['features.brand'] = { $in : brandNames }
    }

    if (ram) {
      const ramValues = ram.split(",").map(value => parseInt(value.trim()))
      filters['features.ram'] = { $in : ramValues }
    }

    if (ssd) {
      const ssdValues = ssd.split(",").map(value => parseInt(value.trim()))
      filters['features.ssd'] = { $in : ssdValues }
    }

    if (type) {
      const typeNames = type.split(",").map(name => name.trim())
      filters['features.type'] = { $in : typeNames}
    }

    if (processorBrand) {
      const processorBrandNames = processorBrand.split(",").map(name => name.trim())
      filters['features.processor&nbsp;brand'] = { $in : processorBrandNames }
    }

    if (processorGeneration) {
      const processorGenerationNames = processorGeneration.split(",").map(name => name.trim())
      filters['features.processor&nbsp;generation'] = { $in : processorGenerationNames}
    }

    if (processor) {
      const processorNames = processor.split(",").map(name => name.trim())
      filters['features.processor'] = { $in : processorNames}
    }
    
    
    const products = await getAllProductOfLaptops(filters)

    if(products && products.length > 0){

      const availableBrands = await Products.distinct('features.brand', { collectionType : 'Laptops' })
      const availableRams = await Products.distinct('features.ram', { collectionType : 'Laptops' })
      const availableSsds = await Products.distinct('features.ssd', { collectionType : 'Laptops' })
      const availableProcessorBrands = await Products.distinct('features.processor&nbsp;brand', { collectionType : 'Laptops' })
      const availableProcessorGeneration = await Products.distinct('features.processor&nbsp;generation', { collectionType : 'Laptops' })
      const availableProcessorNames = await Products.distinct('features.processor', { collectionType : 'Laptops' })
      
      res.status(200).json({products, filters: {brand: availableBrands, ram: availableRams, ssd: availableSsds, processorBrand: availableProcessorBrands, processorGeneration: availableProcessorGeneration, processorName: availableProcessorNames}})
    } else {
      res.status(404).json({error: "No products found matching the criteria."})
    }
  } catch (err) {
    res.status(500).json({error: "An error occurred while fetching products."})
  }
})




// To seed multiple product data at once route
async function seedAllProductsAtOnce(products){
  try {
    let savedProduct = []
    for(let product of products){
      const newProduct = new Products(product)
      await newProduct.save();
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
      res.status(200).json({message: "Data Added Successfully!", data: newProducts})
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
    const newProduct = new Products(product)
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
