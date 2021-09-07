import handler from "./libs/handler-lib";
import cognito from "./libs/cognito-lib";

export const main = handler(async (event, context) => {
  const params = {
    UserPoolId: process.env.userPoolId,
    Filter: "",
    Limit: 10,
    //AttributesToGet: [],
  };
  const allUsers = await cognito.listUsers(params);
  const usersArray = allUsers.Users;

  const adminUsersParams = {
    GroupName: "AdminUsers",
    UserPoolId: process.env.userPoolId,
    Limit: 10,
    //AttributesToGet: [],
  };
  const adminUsers = await cognito.listUsersInGroup(params);
  const adminUsersArray = adminUsers.Users;
  const adminUsernames = adminUsersArray.map(user => user.Username);
  const result = [];

  for (var i = 0; i < usersArray.length; i++) {
    var user = usersArray[i];
    if(!adminUsernames.includes(user.Username)) { 
      var attributes = user.Attributes;
      for (var j = 0; j < attributes.length; j++) {
        if (attributes[j].Name === "email") {
          user.Email = attributes[j].Value;
        }
        if (attributes[j].Name === "name") {
          user.Name = attributes[j].Value;
        }
      }
      result.push(user);
    }    
  }
  

  
  return result;
});
