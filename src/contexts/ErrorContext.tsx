import type { StateErrorServer } from "@/types/server";
import { createContext, useContext, useState, type ReactNode } from "react";

type ErrorContextValue = {
  error: StateErrorServer | null;
  setError: React.Dispatch<React.SetStateAction<StateErrorServer | null>>;
};

const ErrorContext = createContext<ErrorContextValue | null>(null);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<StateErrorServer | null>(null);

  return <ErrorContext value={{ error, setError }}>{children}</ErrorContext>;
};

export const useError = () => {
  const ctx = useContext(ErrorContext);
  if (!ctx) throw new Error("useError must be used within ErrorProvider");
  return ctx;
};
