import { Function, Stack } from "../";

interface IEvent {
  message: string;
}

describe("Stack", () => {
  it("Should generate output", async () => {
    const fn = new Function<IEvent>(
      async (event) => {
        return `Hello ${event.message}`;
      },
      {
        name: "test-fn",
        handler: "src/testFn.default",
        events: [
          {
            http: {
              path: "/test",
              method: "GET",
            },
          },
        ],
      }
    );

    const stack = new Stack([fn], {
      service: "test-stack",
      plugins: ["serverless-webpack"],
      provider: {
        name: "aws",
        runtime: "nodejs12.x",
        stage: "dev",
        region: "us-east-1",
      },
      custom: {
        dotenv: {
          basePath: "../../config/",
          include: ["DATABASE_URL"],
        },
      },
      package: { individually: true },
    });

    const result = await stack.generate();

    expect(result.functions).toEqual({
      "test-fn": {
        cors: false,
        handler: "src/testFn.default",
        memorySize: 1024,
        method: "POST",
        path: "/test",
        timeout: 30,
      },
    });

    expect(result.service).toEqual("test-stack");
  });
});
