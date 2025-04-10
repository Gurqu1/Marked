// api/index.js
import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/url', (req, res) => {
  const bodyData = req.body;
  console.log(bodyData);
  res.send('Hello World url!');
});

// Export the handler
export const handler = serverless(app);
