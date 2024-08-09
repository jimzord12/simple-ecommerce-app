import { useState, useEffect } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize the state with the value from Local Storage (or the initial value)
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      // Return the initial value if running on the server (e.g., during SSR)
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      // Parse the stored JSON or return the initial value if not available
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key “" + key + "”: ", error);
      return initialValue;
    }
  });

  // Create a setter function that also stores the value in Local Storage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save the value in state
      setStoredValue(valueToStore);
      // Save the value in Local Storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error setting localStorage key “" + key + "”: ", error);
    }
  };

  // Create a function to remove the item from Local Storage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error("Error removing localStorage key “" + key + "”: ", error);
    }
  };

  return [storedValue, setValue, removeValue] as const;
}

export default useLocalStorage;
