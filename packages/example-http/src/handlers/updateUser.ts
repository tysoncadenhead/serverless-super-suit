import { Function, resolveHandler } from "sls-super-suit";
import { IRecord, db } from "../db";

import { APIGatewayEvent } from "aws-lambda";

const updateUser = new Function<APIGatewayEvent>(
  async (event) => {
    const id = `${event.pathParameters?.id}`;
    const body = (event?.body as any) as IRecord;

    const user = db.update(id, {
      firstName: body?.firstName,
      lastName: body?.lastName,
    });

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
    name: "updateUser",
    handler: resolveHandler(__filename),
    events: [
      {
        http: {
          path: "/user/{id}",
          method: "PUT",
        },
      },
    ],
  }
);

export const invoke = updateUser.invoke;

export default updateUser;
