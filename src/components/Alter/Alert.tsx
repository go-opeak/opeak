import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface AlertProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  type?: "success" | "error" | "info";
}

export const Alert: React.FC<AlertProps> = ({
  isOpen,
  message,
  onClose,
  type = "info",
}) => {
  if (!isOpen) return null;

  return (
    <AlertWrapper>
      <AlertOverlay onClick={onClose} />
      <AlertContent type={type}>
        <AlertMessage>{message}</AlertMessage>
        <AlertButton onClick={onClose}>확인</AlertButton>
      </AlertContent>
    </AlertWrapper>
  );
};

const AlertWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const AlertOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
`;

const AlertContent = styled.div<{ type: "success" | "error" | "info" }>`
  background: white;
  padding: 24px;
  border-radius: 12px;
  min-width: 300px;
  max-width: 90%;
  position: relative;
  z-index: 1001;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  border-top: 4px solid
    ${(props) =>
      props.type === "success"
        ? "#4CAF50"
        : props.type === "error"
        ? "#f44336"
        : "#2196F3"};
`;

const AlertMessage = styled.p`
  margin: 0 0 20px 0;
  font-size: 16px;
  color: #333;
  line-height: 1.5;
  white-space: pre-line; // 개행
`;

const AlertButton = styled.button`
  background: #000;
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #333;
  }
`;
