const mongoose = require('mongoose');

const recentlyViewedProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  productImageUrl: {
    type: String,
    required: true
  },
  mrp: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  referenceId: {
    type: String,
    required: true
  },
  collectionType: {
    type: String,
    required: true
  },
  subCollectionType: {
    type: String,
    required: true
  }
},{timestamps: true});

const RecentlyViewedProducts = mongoose.model('RecentlyViewedProducts', recentlyViewedProductSchema);

module.exports = RecentlyViewedProducts;