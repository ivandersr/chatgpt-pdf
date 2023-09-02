const { PromptTemplate } = require("langchain");
const { RetrievalQAChain } = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");

const LLMChain = (() => {
    let chain;
    let currentTemplate;

    const createChain = ({modelName, store, template}) => {
        const model = new ChatOpenAI({ modelName });
        return RetrievalQAChain.fromLLM(model, store, {
            prompt: PromptTemplate.fromTemplate(template)
        });
    }

    return {
        getChain: ({ modelName, store, template }) => {
            if (!chain || currentTemplate !== template) {
                chain = createChain({ modelName, store, template });
                currentTemplate = template;
            }

            return chain;
        }
    };
})();

module.exports = { LLMChain };