// Polyfill sessionStorage para React Native
const memory: Record<string, string> = {};

export const session = {
  getItem(key: string) {
    return memory[key] || null;
  },
  setItem(key: string, value: string) {
    memory[key] = value;
  },
  removeItem(key: string) {
    delete memory[key];
  },
  clear() {
    Object.keys(memory).forEach(k => delete memory[k]);
  },
  getAll() {
    return memory;
  }
};
