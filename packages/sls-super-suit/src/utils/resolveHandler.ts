export const resolveHandler = (path: string, exportInvokeFn?: string) => {
  const absolutePath = path.replace(`${process.cwd()}/`, "");
  return `${absolutePath.split(".ts")[0].split(".js")[0]}.${
    exportInvokeFn || "invoke"
  }`;
};
