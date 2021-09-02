import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {

  const getRecordParams = {
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
  const recordToDeleteArray = await dynamoDb.query(getRecordParams);
  const recordToDelete = recordToDeleteArray.Items[0];
  const identityId = recordToDelete.userId;

  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be removed
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: identityId,
      recordId: event.pathParameters.id
    }
  };

  await dynamoDb.delete(params);

  return { status: true };
});
