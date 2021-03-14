import { Function, resolveHandler } from "sls-super-suit";
import { IRecord, db } from "../db";

import { APIGatewayEvent } from "aws-lambda";

const createUser = new Function<APIGatewayEvent>(
  async (event) => {
    console.log("::event", event?.body);
    const body = (event?.body as any) as IRecord;

    const user = db.create({
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
    name: "createUser",
    handler: resolveHandler(__filename),
    events: [
      {
        http: {
          path: "/user",
          method: "POST",
        },
      },
    ],
  }
);

export const invoke = createUser.invoke;

export default createUser;
