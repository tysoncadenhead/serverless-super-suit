import { Function, resolveHandler } from "sls-super-suit";

import { APIGatewayEvent } from "aws-lambda";
import { db } from "../db";

const user = new Function<APIGatewayEvent>(
  async (event) => {
    const id = `${event.pathParameters?.id}`;
    const user = db.get(id);

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "User not found",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  },
  {
    name: "getUser",
    handler: resolveHandler(__filename),
    events: [
      {
        http: {
          path: "/user/{id}",
          method: "GET",
        },
      },
    ],
  }
);

export const invoke = user.invoke;

export default user;
