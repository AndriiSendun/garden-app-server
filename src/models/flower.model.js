const mongoose = require('mongoose');

const FlowerSchema = new mongoose.Schema({
  airHumidity: Number,
  airTemperature: Number,
  type: String,
  img_path: String,
  user_id: String,
  light: Number,
  name: String,
  soilHumidity: Number,
  delta: Number,
  package_id: String,
  created_at: Number
});

module.exports = mongoose.model('Flower', FlowerSchema);
