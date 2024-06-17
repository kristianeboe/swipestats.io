"use client";

import React, { useContext } from "react";

// Used to create a context wiht values that don't require non null assertions
// annoyingly though, it can't be used to aliviate prop drilling in server components, because it requires "use client"

export const createGenericContext = <T>() => {
  // Create a context with a generic parameter or undefined
  const genericContext = React.createContext<T | undefined>(undefined);

  // Check if the value provided to the context is defined or throw an error
  const useGenericContext = () => {
    const contextIsDefined = useContext(genericContext);
    if (!contextIsDefined) {
      throw new Error("useGenericContext must be used within a Provider");
    }
    return contextIsDefined;
  };

  return [useGenericContext, genericContext.Provider] as const;
};
