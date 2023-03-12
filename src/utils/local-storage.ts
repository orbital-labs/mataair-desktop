// set item to local storage
export const setItem = (key: string, value: object | string) => {
  const data = typeof value === "object" ? JSON.stringify(value) : value;
  localStorage.setItem(key, data);
};

// get item from local storage
export const getItem = (key: string) => {
  const data = localStorage.getItem(key);

  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return data || null;
    }
  }
  return null;
};

// remove item from local storage
export const removeItem = (key: string) => {
  localStorage.removeItem(key);
};
