const mongoose = require("mongoose");

const mobileAndTabletsSchema = new mongoose.Schema({
  colletionType: {
    type: String,
    required: true,
    value: "Mobile&Tablets"
  },
  subCollectionType: {
    type: String,
    required: true,
    enum: ["mobile", "tablet"]
  },
  name: {
    type: String,
    required: true
  },
  subContent: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  mrp: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  brand: {
    type: String,
    required: true,
    enum: ["SAMSUNG", "vivo", "OPPO", "realme", "POCO", "MOTOROLA", "REDMI", "Apple"]
  },
  productImageUrl: {
    type: String,
    required: true
  },
  productImagesUrl: [{
    type: String,
    required: true
  }],
  highlights: [{
    type: String,
    required: true
  }],
  warranty: {
    type: String,
    required: true
  },
  description: [{
    imageUrl: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }],
  memoryAndStorage: {
    internalStorage: {
      type: Number,
      required: true
    },
    ram: {
      type: Number,
      required: true
    },
    expandableStorage: {
      type: String,
      required: true
    },
    supportedMemoryCardType: {
      type: String,
      required: true
    },
    memorCardSlotType: {
      type: String,
      required: true
    }
  },
  disclaimer: [{
    type: String,
    required: true
  }]
});

const MobileAndTablets = mongoose.model('MobileAndTablets', mobileAndTabletsSchema);

module.exports = MobileAndTablets