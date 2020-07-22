const express = require('express');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(cors());

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;
  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: {
      id,
      title,
    },
  });
  res.status(201).send({ type: 'success', message: 'Post created.' });
});

app.post('/events', (req, res) => {
  console.log('Received Event: ', req.body.type);
  res.send({});
});

const port = 4001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
