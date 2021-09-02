import handler from "./libs/handler-lib";
import cognito from "./libs/cognito-lib";

export const main = handler(async (event, context) => {
  const profile = JSON.parse(event.body);
  const userAttributes = [];
  var attributeType = {};
  for (const attribute in profile) {
    attributeType.Name = attribute;
    attributeType.Value = profile[attribute];
    userAttributes.push(attributeType);
  }
  const params = {
    UserPoolId: process.env.userPoolId,
    UserAttributes: userAttributes,
    Username: event.pathParameters.userPoolUserId,
  };

  await cognito.updateUserAttributes(params);

  return { status: true };
});
