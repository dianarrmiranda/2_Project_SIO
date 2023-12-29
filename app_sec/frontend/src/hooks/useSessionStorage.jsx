import { useState } from 'react';

const useSessionStorage = (key, initialValue = null) => {
  const [value, setValue] = useState(
    JSON.parse(sessionStorage.getItem(key))
      ? JSON.parse(sessionStorage.getItem(key))
      : initialValue
  );

  const setItem = (newValue) => {
    setValue(newValue);
    sessionStorage.setItem(key, JSON.stringify(newValue));
  };

  const removeItem = () => {
    setValue(null);
    sessionStorage.removeItem(key);
  }

  return [value, setItem, removeItem];
};

export default useSessionStorage;
