const west = {
  package_id: 3,
  name: 'West package',
  sensors: {
    temperature: Math.floor(Math.random() * 100),
    humidity: Math.floor(Math.random() * 100),
    soilMoisture: { 'Sensor data': Math.floor(Math.random() * 100).toString() },
    light: Math.floor(Math.random() * 100).toString(),
    time: new Date().getTime()
  }
};

module.exports = west;
