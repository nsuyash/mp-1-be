const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  discription: {
    type: String,
    required: true
  },
  mrp: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: Number,
    required: true
  },
  color: [{
    type: String,
    enum: []
  }],
  feedback: [{
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    reviewTitle: {
      type: String,
      required: true
    },
    reviewContent: {
      type: String,
    }
  }]
  
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product