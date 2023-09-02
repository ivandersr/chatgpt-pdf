const { FileLoader } = require('./FileLoader');
const { LLMChain } = require('./LLMChain');

class LLMService {
  query = async ({ path, question }) => {
    const vectorStore = await FileLoader.getVectorStore(path);

    const template = `
    Utilize os seguintes contextos para responder a questão no final.
    Caso não saiba a resposta, apenas diga que não tem dados suficientes pra 
    responder a pergunta, não tente inferir nada.
    Utilize no máximo três sentenças e mantenha a resposta tão concisa quanto
    possível.
    {context}
    Question: {question}
    Helpful Answer:
    `;

    const chain = LLMChain.getChain({
      modelName: 'gpt-3.5-turbo',
      store: vectorStore.asRetriever(),
      template
    });

    const response = await chain.call({
      query: question
    });

    return response;
  }
}

module.exports = new LLMService();
