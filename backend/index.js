import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import cors from 'cors';
import {v4 as uuidv4} from 'uuid';

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'sqluser',
  password: 'Prathu1@',
  database: 'org'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

const generateRandomResponse = () => {
  const responses = [
    "I'm not sure about that.",
    "Interesting question!",
    "Let me think about that.",
    "That's a good point.",
    "I need more information to answer that.",
    "I'm not programmed to respond to that.",
    "I'll look into it.",
    "Hmm, let me check my database.",
    "I'm not certain.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

app.post("/storeFeedback", (req, res) => {
  const { messageId, feedback } = req.body;
  const sql = "INSERT INTO feedback_data (message_id, feedback) VALUES (?, ?)";
  db.query(sql, [messageId, feedback], (err, result) => {
      if (err) {
          console.error("Error storing feedback:", err);
          res.status(500).send("Error storing feedback");
      } else {
          console.log("Feedback stored successfully");
          res.sendStatus(200);
      }
  });
});

app.post('/storeChatData', (req, res) => {
  const { prompt, response } = req.body;
  const sql = 'INSERT INTO chat_data (prompt, response) VALUES (?, ?)';
  db.query(sql, [prompt, response], (err, result) => {
    if (err) {
      console.error('Error storing chat data:', err);
      res.status(500).send('Error storing chat data');
    } else {
      console.log('Chat data stored successfully');
      res.sendStatus(200);
    }
  });
});

app.post('/clearChatHistory', (req, res) => {
  const sql = 'DELETE FROM chat_data';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error clearing chat history:', err);
      res.status(500).send('Error clearing chat history');
    } else {
      console.log('Chat history cleared successfully');
      res.sendStatus(200);
    }
  });
});

app.get('/getChatHistory', (req, res) => {
  const sql = 'SELECT * FROM chat_data';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching chat history:', err);
      res.status(500).send('Error fetching chat history');
    } else {
      res.json(result);
      console.log('Sent chat history:');
    }
  });
});

app.get('/getChatData', (req, res) => {
  const response = generateRandomResponse();
  res.send(response);
  // console.log('Sent message:', response);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});