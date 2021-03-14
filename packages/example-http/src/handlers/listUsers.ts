import { Function, resolveHandler } from "sls-super-suit";

import { APIGatewayEvent } from "aws-lambda";
import { db } from "../db";

const listUsers = new Function<APIGatewayEvent>(
  async (event) => {
    const users = db.query();

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  },
  {
    name: "listUsers",
    handler: resolveHandler(__filename),
    events: [
      {
        http: {
          path: "/user",
          method: "GET",
        },
      },
    ],
  }
);

export const invoke = listUsers.invoke;

export default listUsers;
