import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    IndexName: process.env.indexName,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    ExpressionAttributeValues: {
      ":userPoolUserId": event.pathParameters.userPoolUserId,
      ":recordId": event.pathParameters.id,
    },
    KeyConditionExpression: "userPoolUserId = :userPoolUserId and recordId = :recordId"

  };

  const result = await dynamoDb.query(params);
  // Return the matching list of items in response body
  return result.Items[0];
});
