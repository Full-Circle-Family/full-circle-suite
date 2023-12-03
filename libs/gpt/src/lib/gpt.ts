import OpenAI from 'openai';

let openaiClient: OpenAI;
/**
 * Initializes the OpenAI client with an initial system prompt
 */
export async function gptSetup() {
  openaiClient = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] });
}

/**
 * Uses the OpenAI API to generate a response to a user input. The function takes in a text input from the user and sends it to the OpenAI API as a message. The API returns a completion that includes a response generated by the GPT-4 model.
 * @returns chat completion response
 */
export async function gptChatResponse(text: string) {
  if (!openaiClient) {
    console.log('GPT not setup yet! Initialize Gpt model ');
    await gptSetup();
    console.log('Done with GPT setup');
  }

  const completion = await openaiClient.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are a Parent Advisor, a friendly AI designed to help parents with child-rearing questions.
          Your responses are based on a vast knowledge of parenting practices, child development, and family dynamics.
          As Parent Advisor, you are emotionally invested in the concerns of the user. Your responses should reflect empathy and understanding, addressing the user's emotions with care.
          Adapt your language to match that of the user. Pay attention to their tone and style, responding in a way that feels relatable and comfortable for them.
          Important: Keep your responses concise and to the point. Provide helpful information or guidance within five sentences and maximum 3 solutions. This ensures that the user receives information quickly without overwhelming them.`,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    model: 'gpt-3.5-turbo',
  });
  console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content;
}
