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


export async function ExtractRouteLinks(textContent) {
  try {
    const zodSchema = z.object({
      data: z
        .array(z.string())
        .describe("An array of route sales links mentioned in the given text/array"),
    });

    const prompt = new ChatPromptTemplate({
      promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
          "You are an Assistant to review text/array of links and find any Route Distribution, or Direct Store Delivery (DSD), or Direct Sales, or Route-to-Market (RTM), or Vending Route, or Merchandising Route, related links and collect it from the text."
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
