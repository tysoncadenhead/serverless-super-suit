import { PROJECT_NAME_LOWER } from "../constants";
import debugFn from "debug";

export const debug = (key: string) => (message: string) =>
  debugFn(`${PROJECT_NAME_LOWER}:${key}`)(message);
