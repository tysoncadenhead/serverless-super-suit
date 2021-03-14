import type { Functions, Serverless } from "serverless/aws";

import { Adapter } from "./Adapter";

export interface IStack extends Serverless {}

interface IGenerate {
  functions: Functions;
}

interface IStackFunction {
  generate: () => IGenerate;
  serve: (stackName: string) => void;
  addAdapter: (adapter: Adapter) => void;
}

export class Stack {
  type: "stack";

  _adapters: Array<Adapter> = [];
  _config: IStack;
  _stackFunctions: Array<IStackFunction>;

  constructor(stackFunctions: Array<IStackFunction>, config: IStack) {
    this._config = config;
    this._stackFunctions = stackFunctions;
  }

  addAdapter(adapter: Adapter) {
    this._adapters.push(adapter);
  }

  generate(): Serverless {
    const children = this._stackFunctions.map((fn) => fn.generate());
    const functions = children.reduce((prev, current) => {
      return {
        ...prev,
        ...current.functions,
      };
    }, {});

    return {
      ...this._config,
      functions,
    };
  }

  serve() {
    this._stackFunctions.forEach((fn) => {
      this._adapters.forEach((adapter) => {
        fn.addAdapter(adapter);
      });

      fn.serve(this._config.service as string);
    });
  }
}
