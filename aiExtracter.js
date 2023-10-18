import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

export async function aiExtract(textContent) {
  try {
    const zodSchema = z.object({
      route: z
        .array(
          z.object({
            route: z.string().describe("The name of the route"),
            url: z.string().describe("The URL of the route"),
            price: z.number().describe("The Price of the route"),
            downpayment: z.number().describe("The down payment of the route"),
            weeklynet: z.number().describe("The Weekly net income"),
            description: z.string().describe("The description of the route"),
            location: z.string().describe("Location of the route"),
          })
        )
        .describe("An array of route sales mentioned in the text"),
    });

    const prompt = new ChatPromptTemplate({
      promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
          "List all route sales mentioned in the following text."
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

    // const jsonResponse = JSON.stringify(response, null, 2);
    // console.log(jsonResponse);
    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
}
