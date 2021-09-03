import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      recordId: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET #dt = :date, #tp = :type, clinic = :clinic, reason = :reason, attachments = :attachments",
    ExpressionAttributeValues: {
      ":date": data.date || null,
      ":type": data.type || null,
      ":clinic": data.clinic || null,
      ":reason": data.reason || null,
      ":attachments": data.attachments || null,
    },
    ExpressionAttributeNames: {
      "#dt": "date",
      "#tp": "type"
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  await dynamoDb.update(params);

  return { status: true };
});
