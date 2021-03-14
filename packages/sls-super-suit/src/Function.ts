import { Adapter } from "./Adapter";
import type { AwsFunctionHandler } from "serverless/aws";

export interface IFunction extends AwsFunctionHandler {
  name: string;
}

interface IGenerateResult {
  functions: {
    [key: string]: AwsFunctionHandler;
  };
}

interface IResponseType {
  statusCode: number;
  body: string;
}

type ResponseType = IResponseType | string;

export class Function<EventType> {
  _adapters: Array<Adapter> = [];
  _fn: (event: EventType) => Promise<ResponseType>;
  _config: IFunction;

  constructor(
    fn: (event: EventType) => Promise<ResponseType>,
    config: IFunction
  ) {
    this._fn = fn;
    this._config = config;

    this.invoke = this.invoke.bind(this);
  }

  async invoke(event: EventType): Promise<ResponseType> {
    return this._fn(event);
  }

  addAdapter(adapter: Adapter) {
    this._adapters.push(adapter);
  }

  generateFunction(): IGenerateResult {
    const { name, ...fn } = this._config;

    return {
      functions: {
        [name]: {
          ...fn,
        },
      },
    };
  }

  generate(): IGenerateResult {
    return this.generateFunction();
  }

  serve(stackName: string) {
    this._adapters.forEach((adapter) => {
      adapter.function(stackName, this._config, this.invoke);
    });
  }
}
