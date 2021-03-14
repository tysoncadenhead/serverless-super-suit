import { Function } from "../";

interface IEvent {
  message: string;
}

describe("Function", () => {
  it("Should provide a function to invoke", async () => {
    const fn = new Function<IEvent>(
      async (event) => {
        return `Hello ${event.message}`;
      },
      {
        name: "test-fn",
        handler: "src/testFn.default",
      }
    );

    const result = await fn.invoke({
      message: "world",
    });

    expect(result).toEqual("Hello world");
  });

  it("Should generate output", async () => {
    const fn = new Function<IEvent>(
      async (event) => {
        return `Hello ${event.message}`;
      },
      {
        name: "test-fn",
        handler: "src/testFn.default",
      }
    );

    const result = await fn.generate();

    expect(result.functions["test-fn"].handler).toEqual("src/testFn.default");
  });
});
