const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === 'CommentCreated') {
    const { id, content, postId, createdAt, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status, createdAt });
  }
  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
  console.log(`Event Received: ${type}`);
};

app.get('/posts', (req, res) => {
  res.status(200).send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({});
});

const port = 4003;
app.listen(port, async () => {
  console.log(`Server started on port ${port}`);
  const { data } = await axios.get('http://localhost:4005/events');
  if (data.length > 0) {
    for (let event of data) {
      handleEvent(event.type, event.data);
    }
  }
});
