import express from 'express';
import cors from 'cors';
import { EventEmitter } from 'events';

const messages = [];
const emitter = new EventEmitter();
const app = express();

app.use(express.json());
app.use(cors());

app.post('/messages', (req, res) => {
  const { message } = req.body;

  messages.push(message);
  emitter.emit('message', message);
  res.status(201).send(message);
});

app.get('/messages', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Cache', 'no-store');

  emitter.on('message', (message) => {
    res.write(`data:${message}\n\n`);
  });
});

app.listen(3000, () => {
  console.log('Server run on http://localhost:3000');
});
