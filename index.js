import express from 'express';
import cors from 'cors';
import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = 3000;


app.use(cors());

app.use(express.json());

//Open api start

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// const data = {
//   posting: [
//     { name: "Alice", age: 25 },
//     { name: "Bob", age: 30 }
//   ]
// };

const prompt = `
Analyze the following job posting data and return a JSON object with:
- company_name
- Job_title
- job_description
- job_location
- salary_range

ONLY return valid JSON.
`;

async function generateResponse(data) {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: [
      { role: "system", content: "You are a backend API that only responds with valid JSON objects and only give answers with certainty do not provide or justify unkown answers." },
      { role: "user", content: `${prompt}\n\nData:\n${JSON.stringify(data)}` }
    ],
    temperature: 0.2
  });

  const output = response.choices[0].message.content;
  console.log("AI Response:", output);

  try {
    const json = JSON.parse(output);
    console.log("Parsed JSON:", json);
  } catch (e) {
    console.warn("Could not parse response as JSON.");
  }
}


//Open api end


app.post('/url', (req, res) => {
  const bodyData = req.body;
  console.log(bodyData)
  res.send('Hello World url!');
  generateResponse(bodyData);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});




