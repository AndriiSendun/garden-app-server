const FlowerSensorModel = require('../models/flower-sensor.model');
const express = require('express');
const round = require('mongo-round');
const socketController = require('../sockets/send-client-data');
const router = express.Router();

// POST
router.post('/packages', (req, res) => {
  socketController(req.body);
  if (!req.body || req.body.sensorErr) {
    return res.status(400).send(`Body missing, or sensor error: ${req.body}`);
  }

  const model = new FlowerSensorModel(req.body);
  model
    .save()
    .then(doc => {
      if (!doc || doc.length === 0) {
        return res.status(500);
      }

      res.status(201).send(doc);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// GET
router.get('/flower-sensors', (req, res) => {
  FlowerSensorModel.find()
    .sort({
      _id: -1
    })
    .limit(1)
    .then(doc => res.json(doc))
    .catch(err => err);
});

// UPDATE
router.put('/flower-sensors', (req, res) => {});

// DELETE
router.delete('/flower-sensors', (req, res) => {});

//GET flower's packeges data
router.get('/flower-sensor/:id', (req, res) => {
  const id = parseFloat(req.params.id);
  const time = req.query.time;
  const type = req.query.type;
  let selectFiled = null;
  let projectField = null;

  if (type === 'air') {
    selectFiled = 'humidity';
    projectField = 'humidity';
  } else if (type === 'water') {
    selectFiled = 'soilMoisture.Sensor data';
    projectField = 'soilMoisture';
  } else if (type === 'temperature') {
    selectFiled = 'temperature';
    projectField = 'temperature';
  }

  const stopTime = parseFloat(time) + 86400000;
  const startTime = parseFloat(time);
  const convertedTime = {
    $add: [new Date(0), '$time']
  };

  FlowerSensorModel.aggregate([
    {
      $match: {
        package_id: id,
        'sensors.time': {
          $gte: startTime.toString(),
          $lt: stopTime.toString()
        }
      }
    },
    {
      $project: {
        [projectField]: {
          $toDouble: '$sensors.' + [selectFiled]
        },
        time: {
          $toDouble: '$sensors.time'
        }
      }
    },
    {
      $project: {
        _id: 0,
        [projectField]: '$' + [projectField],
        hour: {
          $hour: convertedTime
        }
      }
    },
    {
      $group: {
        _id: '$hour',
        [projectField]: {
          $avg: '$' + [projectField]
        }
      }
    },
    {
      $project: {
        _id: 0,
        hour: '$_id',
        value: round({ $divide: ['$' + [projectField], 100] }, 2)
      }
    },
    {
      $sort: {
        hour: 1
      }
    }
  ]).then(sensorData => res.json(sensorData));
});

module.exports = router;
