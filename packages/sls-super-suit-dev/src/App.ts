import { Adapter, Stack } from "sls-super-suit";

import { HttpAdapter } from "./adapters/HttpAdapter";
import cors from "cors";
import { debug } from "./utils/debug";
import express from "express";

export interface IApp {
  port?: number;
  stacks: Array<Stack>;
}

export class App {
  type: "app";

  _adapters: Array<typeof Adapter> = [];
  _config: IApp;

  constructor(config: IApp) {
    this._config = config;

    this._adapters.push(HttpAdapter);
  }

  listen() {
    const app = express();
    const port = this._config.port || 3000;

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(cors());

    this._config.stacks.forEach((stack) => {
      this._adapters.forEach((Adapter) => {
        stack.addAdapter(new Adapter(app));
        stack.serve();
      });
    });

    return app.listen(port, () => {
      debug(`started`)(`Started at http://localhost:${port}`);
    });
  }
}
