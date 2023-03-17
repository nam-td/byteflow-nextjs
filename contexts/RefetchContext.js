"use client";

import { useState } from "react";
import { createContext } from "react";

export const RefetchContext = createContext({});

export const RefetchContextProvider = ({ children }) => {
  const [refetch, setRefetch] = useState(false);
  return (
    <RefetchContext.Provider value={{ refetch, setRefetch }}>
      {children}
    </RefetchContext.Provider>
  );
};

