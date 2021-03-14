let data = [
  {
    id: "1",
    firstName: "Luke",
    lastName: "Skywalker",
  },
];

export interface IRecord {
  firstName: string;
  lastName: string;
}

export const db = {
  query: () => {
    return data;
  },
  get: (id: string) => {
    return data.find((item) => item.id === id);
  },
  create: (record: IRecord) => {
    const userRecord = {
      ...record,
      id: `${data.length + 1}`,
    };

    data.push(userRecord);

    return userRecord;
  },
  update: (id: string, record: IRecord) => {
    data = data.map((item) =>
      item.id === id
        ? {
            id,
            ...record,
          }
        : item
    );

    return {
      ...record,
      id,
    };
  },
  delete: (id: string) => {
    const user = data.find((item) => item.id === id);
    data = data.filter((item) => item.id !== id);
    return user;
  },
};
