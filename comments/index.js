const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(cors());

app.post('/posts/:id/comments', async (req, res) => {
  const comment = {
    id: randomBytes(4).toString('hex'),
    content: req.body.content,
    postId: req.params.id,
    createdAt: Date.now(),
    status: 'pending',
  };
  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: comment,
  });

  res.status(201).send({ type: 'success', message: 'Comment created.' });
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  if (type === 'CommentModerated') {
    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data,
    });
  }
  res.send({});
});

const port = 4002;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
