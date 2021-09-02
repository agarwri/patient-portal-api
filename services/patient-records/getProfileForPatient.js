import handler from "./libs/handler-lib";
import cognito from "./libs/cognito-lib";

export const main = handler(async (event, context) => {
  let filterString = "sub = " + "\"" + event.pathParameters.userPoolUserId + "\"";
  const params = {
    UserPoolId: process.env.userPoolId,
    Filter: filterString,
    Limit: 10,
  };

  const result = await cognito.listUsers(params);

  const userAttributes = result.Users[0].Attributes;

  // Return the matching list of items in response body
  return userAttributes;
});
