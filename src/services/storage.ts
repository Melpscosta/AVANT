// ------------------------------------------------------
//     STORAGE GLOBAL - FUNCIONA EM WEB E REACT NATIVE
// ------------------------------------------------------

const memory: Record<string, string> = {};

function isWeb() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

const storage = {
  // ----------------------- GET RAW -----------------------
  get(key: string) {
    try {
      if (isWeb()) return sessionStorage.getItem(key);
      return memory[key] || null;
    } catch {
      return null;
    }
  },

  // ----------------------- SET RAW -----------------------
  set(key: string, value: any) {
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    try {
      if (isWeb()) sessionStorage.setItem(key, serialized);
      else memory[key] = serialized;
    } catch {}
  },

  // ----------------------- REMOVE ------------------------
  remove(key: string) {
    try {
      if (isWeb()) sessionStorage.removeItem(key);
      else delete memory[key];
    } catch {}
  },

  // ----------------------- CLEAR -------------------------
  clear() {
    try {
      if (isWeb()) sessionStorage.clear();
      else Object.keys(memory).forEach(k => delete memory[k]);
    } catch {}
  },

  // ----------------------- JSON HELPERS ------------------
  getJSON(key: string) {
    try {
      const raw = storage.get(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setJSON(key: string, obj: any) {
    try {
      storage.set(key, JSON.stringify(obj));
    } catch {}
  },

  // ----------------------- OBJECT ALIASES ---------------
  getObject(key: string) {
    return storage.getJSON(key);
  },

  setObject(key: string, obj: any) {
    storage.setJSON(key, obj);
  },

  // ----------------------- STRING HELPERS ---------------
  getString(key: string) {
    return storage.get(key);
  },

  setString(key: string, value: string) {
    storage.set(key, value);
  },

  // ----------------------- NUMBER HELPERS ---------------
  getNumber(key: string) {
    const raw = storage.get(key);
    if (raw === null || raw === undefined) return null;
    const n = Number(raw);
    return isNaN(n) ? null : n;
  },

  setNumber(key: string, value: number) {
    storage.set(key, String(value));
  }
};

export default storage;
