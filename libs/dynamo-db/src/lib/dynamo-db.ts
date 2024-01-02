import {
  DynamoDBClient,
  CreateTableCommand,
  CreateTableCommandInput,
  DeleteTableCommand,
  ListTablesCommand,
} from '@aws-sdk/client-dynamodb';
import {
  messageSchema,
  userSchema,
  gptSystemPromptSchema,
  selectedTrainingDataSchema,
  guidedExerciseSchema,
} from './table-schemas';

let dbClient: DynamoDBClient;
async function createTable(
  dbClient: DynamoDBClient,
  input: CreateTableCommandInput,
  name: string
) {
  try {
    const command = new CreateTableCommand(input);
    await dbClient.send(command);
    console.log('successfully created: ', name);
  } catch (err) {
    console.error(err);
  }
}

async function deleteTable(tableName: string) {
  const command = new DeleteTableCommand({
    TableName: tableName,
  });
  await dbClient.send(command);
  console.log('successfully deleted: ', tableName);
}

export async function initializeDB() {
  if (!dbClient) {
    const config = {
      //@ts-expect-error dunno why this happens
      region: import.meta.env.VITE_AWS_REGION_EU_NORTH,
      //@ts-expect-error dunno why this happens
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      //@ts-expect-error dunno why this happens
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    };

    dbClient = new DynamoDBClient(config);
    console.log(dbClient);
  }
  try {
    const command = new ListTablesCommand({});
    const results = await dbClient.send(command);

    //console.log('available tables in DynamoDB:\n', results.TableNames);
    if (results.TableNames) {
      if (!results.TableNames.includes('full-circle-messages')) {
        await createTable(dbClient, messageSchema, 'full-circle-messages');
      }
      if (!results.TableNames.includes('full-circle-users')) {
        await createTable(dbClient, userSchema, 'full-circle-users');
      }
      if (!results.TableNames.includes('full-circle-gpt-system-prompts')) {
        await createTable(
          dbClient,
          gptSystemPromptSchema,
          'full-circle-gpt-system-prompts'
        );
      }
      if (!results.TableNames.includes('full-circle-selected-training-data')) {
        await createTable(
          dbClient,
          selectedTrainingDataSchema,
          'full-circle-selected-training-data'
        );
      }
      if (!results.TableNames.includes('full-circle-guided-exercises')) {
        await createTable(
          dbClient,
          guidedExerciseSchema,
          'full-circle-guided-exercises'
        );
      }
    }

    return;
  } catch (err) {
    console.error(err);
  }
}

export async function deleteTables() {
  try {
    if (!dbClient) {
      dbClient = new DynamoDBClient({
        region: process.env.AWS_REGION_EU_NORTH,
      });
    }
    const command = new ListTablesCommand({});
    const results = await dbClient.send(command);
    //console.log('available tables in DynamoDB:\n', results.TableNames);
    if (results.TableNames) {
      if (results.TableNames.includes('full-circle-messages')) {
        await deleteTable('full-circle-messages');
      }
      if (results.TableNames.includes('full-circle-users')) {
        await deleteTable('full-circle-users');
      }
      if (results.TableNames.includes('full-circle-gpt-system-prompts')) {
        await deleteTable('full-circle-gpt-system-prompts');
      }
      if (results.TableNames.includes('full-circle-selected-training-data')) {
        await deleteTable('full-circle-selected-training-data');
      }
      if (results.TableNames.includes('full-circle-guided-exercises')) {
        await deleteTable('full-circle-guided-exercises');
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export { dbClient };
