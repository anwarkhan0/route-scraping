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
          z.object({
            title: z.string().optional(),
            location: z.string().optional(),
            askingPrice: z.number().optional(),
            grossIncome: z.number().optional(),
            cashFlow: z.number().optional(),
            financing: z.boolean().optional(),
            sold: z.boolean().optional(),
            description: z.string().optional(),
          })
        )
        .describe("An object of Business route information."),
    });

    const prompt = new ChatPromptTemplate({
      promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(
          `Find any business/route sales data mentioned in the following text, collect full information, in the following format
            title: The title of the listing.
            location': The location of the listing.
            askingPrice: The asking price of the listing.
            choose one if yearly is available or weekly is available
            yearlyGross: The yearly gross income of the listing. or weeklyNet: The weekly gross income of the listing.
            cashFlow: The weekly net cash flow of the listing.
            financing: Details regarding financing options for the listing.
            description: Generate new description mentioning the website domain name and details provided in the listing.
            do not miss any information about route. if the text contain no information then return null.`
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
