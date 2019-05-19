const mongoose = require('mongoose');

const FlowerSensorSchema = new mongoose.Schema({
  temperature: String,
  humidity: String,
  soilMoisture: Object,
  light: String,
  time: String
});

const package = new mongoose.Schema({
  package_id: Number,
  name: String,
  sensors: FlowerSensorSchema
});

module.exports = mongoose.model('package', package);
