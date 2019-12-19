
export default function Cache<T = any>(max: number) {
  let data = {} as { [key: string]: T };
  let keys = [] as string[];
  let size = 0;

  return {
    async set(key: string, value: T) {
      data[key] = value;
      keys.push(key);
      size += 1;
      if (size >= max) {
        const target = keys.shift();
        if (target) delete data[target];
      }
    },
    remove(key: string) {
      delete data[key];
      keys.splice(keys.indexOf(key), 1);
      size -= 1;
    },
    get(key: string): T {
      if (!data[key]) throw new Error('failed to retrive value from key, please check if key is exists first');
      return data[key];
    },
    has(key: string) {
      return data[key] !== undefined;
    },
    clear() {
      size = 0;
      data = {};
      keys = [];
    },
  };
}
