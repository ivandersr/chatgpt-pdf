const { PDFLoader } = require('langchain/document_loaders/fs/pdf');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');

const FileLoader = (() => {
    let vectorStore;
    let currentPath;

    const createVectorStore = async (filePath) => {
        const data = await (new PDFLoader(filePath)).load();
        const embeddings = new OpenAIEmbeddings();
        return await MemoryVectorStore.fromDocuments(data, embeddings);
    }

    return {
        getVectorStore: async (path) => {
            if (!vectorStore || path !== currentPath) {
                vectorStore = await createVectorStore(path);
                currentPath = path;
            }

            return vectorStore;
        }
    };
})();

module.exports = { FileLoader };