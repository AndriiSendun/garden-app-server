const south = require('./dummy-sensors/south');
const east = require('./dummy-sensors/east');
const west = require('./dummy-sensors/west');

const sendClientEvent = function(data) {
  if (typeof data.sensorErr === 'undefined') {
    return new Promise((res, rej) => {
      res(data);
    })
      .then(result => {
        socket_io.emit('clientEvent', result);
      })
      .then(data => socket_io.emit('southPackage', south))
      .then(data => socket_io.emit('westPackage', west))
      .then(data => socket_io.emit('eastPackage', east));
  } else {
    socket_io.emit('clientEvent', data);
  }
};

module.exports = sendClientEvent;
