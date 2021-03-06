import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";
//date, type, clinic, reason, attachments

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const authProvider = event.requestContext.identity.cognitoAuthenticationProvider;
  const parts = authProvider.split(':');
  const params = {
    TableName: process.env.tableName,
    // 'Item' contains the attributes of the item to be created
    // - 'userId': user identities are federated through the
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'noteId': a unique uuid
    // - 'content': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      userPoolUserId: parts[parts.length - 1],
      recordId: uuid.v1(),
      date: data.date,
      type: data.type,
      clinic: data.clinic,
      reason: data.reason,
      attachments: data.attachments,
      createdAt: Date.now()
    }
  };

  await dynamoDb.put(params);

  return params.Item;
});
