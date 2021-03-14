import { Function, resolveHandler } from "sls-super-suit";
import { IRecord, db } from "../db";

import { APIGatewayEvent } from "aws-lambda";

const deleteUser = new Function<APIGatewayEvent>(
  async (event) => {
    const id = `${event.pathParameters?.id}`;
    const body = (event?.body as any) as IRecord;

    const user = db.delete(id);

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
    name: "deleteUser",
    handler: resolveHandler(__filename),
    events: [
      {
        http: {
          path: "/user/{id}",
          method: "DELETE",
        },
      },
    ],
  }
);

export const invoke = deleteUser.invoke;

export default deleteUser;
