import { useAlert } from "@components/Alter/AlertProvider";
import { Header } from "@components/Header";
import { ROUTES } from "@constants/routes";
import { API_URL } from "@constants/url";
import { useAuth } from "@contexts/AuthContext";
import axios from "axios";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

type LoginForm = {
  email: string;
  password: string;
};

export const Login = () => {
  const [rememberEmail, setRememberEmail] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginForm>();
  const auth = useAuth();

  const navigate = useNavigate();
  const [invalidInput, setInvalidInput] = useState(false);

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    if (rememberEmail) {
      localStorage.setItem("email", data.email);
    } else {
      localStorage.removeItem("email");
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, data);

      auth?.login(response.data.token, response.data.userId);
      navigate(ROUTES.MAIN);
      setInvalidInput(false);
    } catch (error) {
      setInvalidInput(true);
      console.error("Login failed:", error);
    }
  };

  const userEmail = localStorage.getItem("email") || "";

  return (
    <>
      <Header />
      <Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Label>Email</Label>
            <Input defaultValue={userEmail} {...register("email")} />
          </InputGroup>
          <InputGroup>
            <Label>Password</Label>
            <Input
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && <ErrorText>비밀번호를 입력해주세요</ErrorText>}
          </InputGroup>
          {invalidInput && (
            <ErrorText>
              이메일 또는 비밀번호가 잘못 되었습니다. 이메일과 비밀번호를 정확히
              입력해 주세요.
            </ErrorText>
          )}
          <SubmitButton type="submit">로그인</SubmitButton>
        </Form>
        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            checked={rememberEmail}
            onChange={(e) => setRememberEmail(e.target.checked)}
          />
          <CheckboxLabel>이메일 기억하기</CheckboxLabel>
        </CheckboxGroup>
      </Container>
    </>
  );
};

// 스타일 정의
const Container = styled.div`
  height: 80vh;
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #212529;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  padding: 3rem 5rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 500px;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #495057;
  }
`;

const SubmitButton = styled.button`
  padding: 0.8rem;
  background-color: #212529;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #343a40;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
`;

const ErrorText = styled.span`
  color: #e03131;
  font-size: 0.8rem;
  margin-bottom: 10px;
`;
