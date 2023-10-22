import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";


export async function aiExtract(textContent) {
  try {
    const zodSchema = z.object({
      routes: z
        .array(
          z.object({})
        )
        .describe("An array of route sales mentioned in the text"),
    });

    const prompt = new ChatPromptTemplate({
      promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
          "find and List any route sales data mentioned in the following text, collect full information about each route. if the contain no information then return null."
        ),
        HumanMessagePromptTemplate.fromTemplate("{inputText}"),
      ],
      inputVariables: ["inputText"],
    });

    const llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0,
    });

    // Binding "function_call" below makes the model always call the specified function.
    // If you want to allow the model to call functions selectively, omit it.
    const functionCallingModel = llm.bind({
      functions: [
        {
          name: "output_formatter",
          description: "Should always be used to properly format output",
          parameters: zodToJsonSchema(zodSchema),
        },
      ],
      function_call: { name: "output_formatter" },
    });

    const outputParser = new JsonOutputFunctionsParser();

    const chain = prompt.pipe(functionCallingModel).pipe(outputParser);

    const response = await chain.invoke({
      inputText: textContent,
    });


    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
}
