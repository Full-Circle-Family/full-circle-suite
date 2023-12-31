import { ddbDocClient } from './dynamo-db';
import { ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

import { User } from './db-types';

const tableName = 'full-circle-users';
export async function getUser(phone: string): Promise<User | null> {
  try {
    const params = new ScanCommand({
      TableName: tableName,
      FilterExpression: 'phone = :value',
      ExpressionAttributeValues: {
        ':value': phone, // Use the appropriate data type (S for String, N for Number, etc.)
      },
    });
    //   const command = new GetItemCommand(params);
    const response = await ddbDocClient.send(params);

    if (response.Items && response.Items.length > 0) {
      const item = response.Items[0];
      // console.log(item);

      const user: User = {
        id: item.id,
        created: new Date(item.created),
        firstname: item.firstname,
        lastname: item.lastname,
        birthdate: new Date(item.birthdate),
        phone: item.phone,
        stressScore: item.stressScore,
        email: item.email,
        numberOfChildren: item.numberOfChildren,
        introduction: item.introduction,
        exerciseMode: item.exerciseMode,
        exerciseName: item.exerciseName,
        exerciseStep: item.exerciseStep,
        exerciseLastParticipated: new Date(item.exerciseLastParticipated),
        subscriptionStartDate: new Date(item.subscriptionStartDate),
        subscriptionEndDate: new Date(item.subscriptionEndDate),
      };
      // console.log(user);

      return user;
    } else {
      console.log('no user found');
      return null;
    }
  } catch (err) {
    console.log('error retrieving user', err);
    return null;
  }
}

export async function writeUser(user: User) {
  // convert dates to iso strings
  const convertedUser = {
    ...user,
    created: user.created.toISOString(),
    birthdate: user.birthdate.toISOString(),
    exerciseLastParticipated: user.exerciseLastParticipated.toISOString(),
    subscriptionStartDate: user.subscriptionStartDate.toISOString(),
    subscriptionEndDate: user.subscriptionEndDate
      ? user.subscriptionEndDate.toISOString()
      : null,
  };

  const putCommand = new PutCommand({
    TableName: tableName,
    Item: convertedUser,
  });
  await ddbDocClient.send(putCommand);
  console.log('written user');

  return user;
}

export async function createUser(userInfo: User) {
  const existingUser = await getUser(userInfo.phone);
  if (!existingUser) {
    writeUser(userInfo);
  } else {
    // TODO: report feedback to signing up user that phone number has already been taken
    console.error('User already exists');
  }
}
