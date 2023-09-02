const LLMService = require('./LLMService');

class LLMController {
  query = async (req, res) => {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        error: 'empty question not allowed'
      });
    }

    const answer = await LLMService.query({
      path: './assets/doc.pdf',
      question
    });

    return res.json({
      answer
    });
  }
}

module.exports = new LLMController();