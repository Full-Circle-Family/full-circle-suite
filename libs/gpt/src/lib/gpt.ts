// import { User, Message } from '@libs/dynamo-db'; // TODO: make this work
import {
  generateUserInfo,
  appendMessageHistory,
  exerciseUtilSystemPrompt,
  appendMessageHistoryStressLevel,
} from './utils';
import { executeGPTModel } from './execute-gpt';
import OpenAI from 'openai';

/**
 * Initializes the OpenAI client with an initial system prompt
 */
export function gptSetup(): OpenAI {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/**
 * @description Uses the OpenAI API to generate a response to a user input. The function takes in a text input from the user and sends it to the OpenAI API as a message. The API returns a completion that includes a response generated by the GPT-4 model.
 * @returns chat completion response
 */
export async function gptChatResponse(
  prompt: string,
  // messageHistory?: Message[],  // TODO: make this work
  // user?: User
  gptModelId: string,
  systemPrompt: string,
  user: any,
  messageHistory?: any
) {
  // console.log('\nCalling gptChatResponse\n');
  const openaiClient: OpenAI = gptSetup();

  let scopedSystemPrompt = systemPrompt;
  let userPrompt = user.introduction;
  //const userPrompt = generateUserInfo(user);
  if (!messageHistory) {
    userPrompt = user.initialIntroduction;
  }

  scopedSystemPrompt = scopedSystemPrompt + '\n\n' + userPrompt;

  // We feed this to the GPT prompt
  const messages = [
    {
      role: 'system',
      content: scopedSystemPrompt,
    },
  ];
  if (messageHistory) {
    appendMessageHistory(messageHistory, messages);
  }

  const completion = await executeGPTModel(
    messages,
    openaiClient,
    prompt,
    gptModelId
  );

  // console.log(completion.choices[0].message.content);
  return completion;
}

/**
 * Interprets the stress level of a user based on their message history. The function uses the OpenAI API to generate a response to a user input and to interpret the response to determine the user's stress level.
 * @param user The user object
 * @param prompt The current user prompt
 * @param messageHistory Message history of user and GPT model
 * @returns
 */
export async function interpretStressLevel(
  user: any,
  prompt: any,
  gptModelId: string,
  messageHistory?: any
) {
  console.log('\nCalling interpretStressLevel\n');
  const openaiClient = gptSetup();

  const systemPrompt = `Provide a stress level evaluation for the user based on the given messages. Use a number between -1 and 1, where -1 indicates high stress or sadness, and 1 indicates low stress or cheerfulness. Consider the user's emotional state in their most recent message as having a greater impact. Give a single number as your response.`;
  const messages = [
    {
      role: 'system',
      content: systemPrompt,
    },
  ];

  if (messageHistory) {
    appendMessageHistoryStressLevel(messageHistory, messages);
  }
  // console.log('messages we consider for stress level evaluation: ', messages);

  //console.log(messages);
  const scoreCompletion = await executeGPTModel(
    messages,
    openaiClient,
    prompt,
    gptModelId
  );

  if (!isNaN(+scoreCompletion)) {
    // check if a score was actually created
    user.stressScore = Number(+scoreCompletion);
  } else {
    const re = new RegExp('(-*\\d\\.*\\d*)');
    const score = scoreCompletion.match(re);

    if (score) {
      user.stressScore = score[0];
    }
  }
}

export async function gptExerciseResponse(
  prompt: string,
  messageHistory: any,
  user: any,
  exercise: any,
  gptModelId: string,
  systemPrompt: string
) {
  // console.log('\nCalling gptExerciseResponse\n');
  const openaiClient = gptSetup();

  let scopedSystemPrompt = systemPrompt;
  const userInfo = generateUserInfo(user);
  console.log(
    'Exercise Step: ',
    user.exerciseStep,
    ', Exercise Question: ',
    exercise.questions[user.exerciseStep]
  );
  if (userInfo.length > 0) {
    scopedSystemPrompt = scopedSystemPrompt + '\n\n' + userInfo;
  }
  const exercisePrompt = exercise.questions[user.exerciseStep];
  scopedSystemPrompt =
    scopedSystemPrompt + exerciseUtilSystemPrompt + exercisePrompt;

  // We feed this to the GPT prompt
  const messages = [
    {
      role: 'system',
      content: scopedSystemPrompt,
    },
  ];

  let exerciseMessageHistory;
  if (user.exerciseStep > 0) {
    exerciseMessageHistory = messageHistory.slice(user.exerciseStep * -1);
    if (messageHistory) {
      appendMessageHistory(exerciseMessageHistory, messages);
    }
  }

  const completion = await executeGPTModel(
    messages,
    openaiClient,
    prompt,
    gptModelId
  );
  return completion;
}
