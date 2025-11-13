const express = require('express');
const { calculateEPS } = require('./scoring');
const MicroblockService = require('./microblock_service');
const app = express();
const port = 3000;

const devices = {};
const microblockService = new MicroblockService();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('AEAMC Coordinator');
});

app.get('/stats', (req, res) => {
  res.json(microblockService.getStats());
});

app.post('/telemetry', (req, res) => {
  const telemetryData = req.body;
  console.log('Received telemetry data:', telemetryData);

  const eps = calculateEPS(telemetryData);
  console.log(`Calculated EPS for ${telemetryData.deviceId}: ${eps}`);

  devices[telemetryData.deviceId] = {
    telemetry: telemetryData,
    eps: eps,
    lastSeen: Date.now()
  };

  res.sendStatus(200);
});

app.post('/task', (req, res) => {
  const { deviceId } = req.body;
  const device = devices[deviceId];

  if (!device) {
    return res.status(404).json({ error: 'Device not found' });
  }

  // Simple threshold-based selection
  if (device.eps > 0.5) {
    const task = {
      id: `task-${Date.now()}`,
      data: 'process_image.jpg'
    };
    console.log(`Assigning task ${task.id} to ${deviceId} with EPS ${device.eps}`);
    res.json(task);
  } else {
    console.log(`Device ${deviceId} with EPS ${device.eps} did not meet threshold for task`);
    res.status(404).json({ error: 'No task available' });
  }
});

app.post('/proof', (req, res) => {
  console.log('Received proof:', req.body);
  const result = microblockService.addReceipt(req.body);
  if (result.accepted) {
    res.status(202).json(result);
  } else {
    res.status(400).json(result);
  }
});

app.listen(port, () => {
  console.log(`Coordinator listening at http://localhost:${port}`);
});
