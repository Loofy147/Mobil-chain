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

app.get('/task', (req, res) => {
  const task = {
    id: 'task-123',
    data: 'process_image.jpg'
  };
  console.log('Assigning task:', task);
  res.json(task);
});

app.post('/proof', (req, res) => {
  console.log('Received proof:', req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Coordinator listening at http://localhost:${port}`);
});
