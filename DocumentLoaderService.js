const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { PDFLoader } = require('langchain/document_loaders/fs/pdf');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const { ChatOpenAI } = require('langchain/chat_models/openai');
const { RetrievalQAChain } = require('langchain/chains');
const { PromptTemplate } = require('langchain');

class DocumentLoaderService {
  loadDocument = async ({ path, question }) => {
    const data = await (new PDFLoader(path, { splitPages: false })).load();

    const splitDocs = await (new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 0
    })).splitDocuments(data);

    const embeddings = new OpenAIEmbeddings();

    const vectorStore = await MemoryVectorStore.fromDocuments(
      splitDocs,
      embeddings
    );

    const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });

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

    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
      prompt: PromptTemplate.fromTemplate(template)
    });

    const response = await chain.call({
      query: question
    });

    return response;
  }
}

module.exports = new DocumentLoaderService();
