import { App } from "sls-super-suit-dev";
import stack from "./index";

const app = new App({
  stacks: [stack],
  port: 3111,
});

app.listen();
