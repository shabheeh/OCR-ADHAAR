const SYSTEM_ID_KEY = "system_id";

const generateUUID = (): string => {
  return crypto.randomUUID();
};

export const setSystemId = (): string => {
  const existing = localStorage.getItem(SYSTEM_ID_KEY);
  if (!existing) {
    const id = generateUUID();
    localStorage.setItem(SYSTEM_ID_KEY, id);
    return id;
  }
  return existing;
};

export const getSystemId = (): string | null => {
  return localStorage.getItem(SYSTEM_ID_KEY);
};
