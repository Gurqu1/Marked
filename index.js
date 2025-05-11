import express from 'express';
import cors from 'cors';
import OpenAI from "openai";
import dotenv from 'dotenv';
import supabase from './supabaseClient.js';
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
- job_title
- job_description
- job_location
- salary_range

ONLY return valid JSON.
`;

async function generateResponse(data) {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: [
      { role: "system", content: "You are a backend API that only responds with valid JSON objects and only give answers with certainty do not provide or justify unkown answers and if there is an answer you dont know they just say unknown." },
      { role: "user", content: `${prompt}\n\nData:\n${JSON.stringify(data)}` }
    ],
    temperature: 0.2
  });

  const output = response.choices[0].message.content;
  console.log("AI Response:", output);

  try {
    const json = JSON.parse(output);
    insertDataToDatabase(json)
    console.log("Parsed JSON:", json);
  } catch (e) {
    console.warn("Could not parse response as JSON.");
  }
}


//Open api end

async function printDatabse() {
  const {data, error} = await supabase.from('Jobs').select('*');
  if(error){
    console.error("Error fetching data:", error);
  }
  else{
    console.log("Data from database:", data);
  }
}

async function insertDataToDatabase(data) {
  try{
    await supabase.from('Jobs').insert([data]);
  }
  catch (error) {
    console.error("Error inserting data:", error);
  }
}

//Routes Start


app.post('/url', (req, res) => {
  const bodyData = req.body;
  console.log(bodyData)
  res.send('Hello World url!');
  generateResponse(bodyData);
  printDatabse();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

//Routes End

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});




