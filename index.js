require('dotenv').config();
const express = require('express');
const LLMController = require('./LLMController');

const app = express();
app.use(express.json());

app.post('/', LLMController.query);

app.listen(3334);