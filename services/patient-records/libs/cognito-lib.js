import AWS from "aws-sdk";

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

export default {
  listUsers: (params) => cognitoidentityserviceprovider.listUsers(params).promise(),
  updateUserAttributes: (params) => cognitoidentityserviceprovider.adminUpdateUserAttributes(params).promise(),
};
