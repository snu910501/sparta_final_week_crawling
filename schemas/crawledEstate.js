const mongoose = require('mongoose');

const { Schema } = mongoose;
const crawledEstateSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('CrawledEstate', crawledEstateSchema);
