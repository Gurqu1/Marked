import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Routes
app.post('/url', (req, res) => {
  const bodyData = req.body;
  console.log(bodyData)
  res.send('Hello World!');
});

app.get('/', (req, res) => {
  res.send('Hello World!');
})

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;