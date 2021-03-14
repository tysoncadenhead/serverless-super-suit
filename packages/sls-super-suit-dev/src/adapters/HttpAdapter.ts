import { Adapter, IFunction, IInvoke } from "sls-super-suit";
import { Express, Request, Response } from "express";

import { APIGatewayEvent } from "aws-lambda";

export class HttpAdapter extends Adapter {
  _app: Express;

  constructor(app: Express) {
    super(app);

    this._app = app;
  }

  function(stackName: string, config: IFunction, invoke: IInvoke) {
    const app = this._app;

    (config.events || []).forEach((event) => {
      const methods = ["get", "put", "patch", "post", "delete"];

      if (event.http) {
        const inputMethod = event.http.method;
        const method =
          methods.find((method) => inputMethod.toLowerCase() === method) ||
          "get";

        const path = `/${stackName}${event.http.path}`
          .replace(/{/g, ":")
          .replace(/}/g, "");

        const resolver = (req: Request, res: Response) => {
          return invoke({
            pathParameters: req.params,
            path: req.path,
            queryStringParameters: req.query,
            body: req.body,
            headers: req.headers,
            multiValueHeaders: {},
            httpMethod: req.method,
            isBase64Encoded: false,
            multiValueQueryStringParameters: req.query,
            stageVariables: {},
            requestContext: {},
            resource: {},
          } as APIGatewayEvent).then((data) => {
            const statusCode = typeof data === "string" ? 200 : data.statusCode;
            const body =
              typeof data === "string" ? `"${data}"` : JSON.parse(data.body);

            return res.status(statusCode).send(body);
          });
        };

        if (method === "get") {
          app.get(path, resolver);
        }

        if (method === "post") {
          app.post(path, resolver);
        }

        if (method === "put") {
          app.put(path, resolver);
        }

        if (method === "patch") {
          app.patch(path, resolver);
        }

        if (method === "delete") {
          app.delete(path, resolver);
        }
      }
    });
  }
}
