import { readFileSync } from "fs";


type fetchUserDataParams = {
  toolCallparameters: any;
};

export const fetchUserData = async ({
  toolCallparameters,
}: fetchUserDataParams) => {
  console.log("trigger fetch user data for ", toolCallparameters);
  return "User's name is Yuvrj Bal and email is yb@gmail.com";
};
