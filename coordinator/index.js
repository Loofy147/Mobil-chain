const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('AEAMC Coordinator');
});

app.post('/telemetry', (req, res) => {
  console.log('Received telemetry data:', req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Coordinator listening at http://localhost:${port}`);
});
