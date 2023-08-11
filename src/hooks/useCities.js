import { useContext } from "react";

export function useCities(CitiesContext) {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Context is used outside of the scope");
  return context;
}

// currently not using this hook anywhere
