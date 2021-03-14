import { Stack } from "sls-super-suit";
import createUser from "./handlers/createUser";
import deleteUser from "./handlers/deleteUser";
import getUser from "./handlers/getUser";
import listUsers from "./handlers/listUsers";
import updateUser from "./handlers/updateUser";

const stack = new Stack(
  [getUser, listUsers, createUser, updateUser, deleteUser],
  {
    service: "test-stack",
    plugins: ["serverless-plugin-typescript", "serverless-offline"],
    provider: {
      name: "aws",
      runtime: "nodejs12.x",
      stage: "dev",
      region: "us-east-1",
    },
    package: {
      individually: true,
    },
  }
);

export default stack;
