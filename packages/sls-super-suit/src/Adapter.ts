import { Express } from "express";
import { IFunction } from "./Function";

export type IInvoke = (event: any) => Promise<any>;

export class Adapter {
  constructor(_app: Express) {}

  function(_stackName: string, _config: IFunction, _invoke: IInvoke) {}
}
