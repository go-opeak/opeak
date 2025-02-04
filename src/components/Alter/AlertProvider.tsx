import React, { createContext, useContext, useState, useCallback } from "react";
import { Alert } from "./Alert";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/routes";

interface AlertContextType {
  showAlert: (message: string, type?: "success" | "error" | "info") => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error" | "info">("info");

  const showAlert = useCallback(
    (newMessage: string, newType: "success" | "error" | "info" = "info") => {
      setMessage(newMessage);
      setType(newType);
      setIsOpen(true);
    },
    []
  );

  const navigate = useNavigate();

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Alert
        isOpen={isOpen}
        message={message}
        type={type}
        onClose={() => {
          setIsOpen(false);
          navigate(ROUTES.MAIN);
        }}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
