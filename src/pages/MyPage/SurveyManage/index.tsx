import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import styled from "styled-components";
import { fetchSurveyDaya } from "@services/survey";
import { survey as surveyQuestions } from "../../../types/survey";
import axios from "axios";
import { API_URL } from "@constants/url";

// API 함수 추가
async function updateSurveyData(data: any) {
  const response = await axios.post(`${API_URL}/api/survey`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("TOKEN")}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export const SurveyManage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);

  const queryClient = useQueryClient();

  // 설문 데이터 조회
  const {
    data: surveyData,
    error,
    isLoading,
  } = useQuery("survey", fetchSurveyDaya, {
    onSuccess: (data) => {
      if (!editedData) {
        setEditedData(data);
      }
    },
  });

  // 설문 데이터 업데이트 mutation
  const mutation = useMutation(updateSurveyData, {
    onSuccess: () => {
      queryClient.invalidateQueries("survey");
      setIsEditing(false);
    },
  });

  if (isLoading)
    return <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>;
  if (error)
    return <ErrorMessage>데이터를 불러오는데 실패했습니다.</ErrorMessage>;
  if (!surveyData) return <ErrorMessage>데이터가 없습니다.</ErrorMessage>;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await mutation.mutateAsync(editedData);
      alert("설문이 성공적으로 수정되었습니다.");
    } catch (error) {
      alert("설문 수정에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    setEditedData(surveyData);
    setIsEditing(false);
  };

  const handleChange = (questionName: string, value: string | string[]) => {
    setEditedData((prev: any) => ({
      ...prev,
      [questionName]: value,
    }));
  };

  return (
    <Container>
      <Header>
        <Title>Background Survey</Title>
        {!isEditing ? (
          <ActionButton onClick={handleEdit}>
            <span>Edit Survey</span>
          </ActionButton>
        ) : (
          <ButtonGroup>
            <ActionButton onClick={handleSave} variant="primary">
              <span>Save Changes</span>
            </ActionButton>
            <ActionButton onClick={handleCancel} variant="secondary">
              <span>Cancel</span>
            </ActionButton>
          </ButtonGroup>
        )}
      </Header>

      <SurveyContent>
        {surveyQuestions.map((question) => (
          <QuestionCard key={question.name}>
            <QuestionTitle>{question.title}</QuestionTitle>
            {isEditing ? (
              question.type === "radio" ? (
                <OptionsGrid>
                  {question.options.map((option) => (
                    <OptionItem key={option}>
                      <RadioInput
                        type="radio"
                        name={question.name}
                        value={option}
                        checked={editedData[question.name] === option}
                        onChange={(e) =>
                          handleChange(question.name, e.target.value)
                        }
                        id={`${question.name}-${option}`}
                      />
                      <OptionLabel htmlFor={`${question.name}-${option}`}>
                        {option}
                      </OptionLabel>
                    </OptionItem>
                  ))}
                </OptionsGrid>
              ) : (
                <OptionsGrid>
                  {question.options.map((option) => (
                    <OptionItem key={option}>
                      <CheckboxInput
                        type="checkbox"
                        id={`${question.name}-${option}`}
                        checked={editedData[question.name]?.includes(option)}
                        onChange={(e) => {
                          const currentValues = editedData[question.name] || [];
                          let newValues;
                          if (e.target.checked) {
                            newValues = [...currentValues, option];
                          } else {
                            newValues = currentValues.filter(
                              (v: string) => v !== option
                            );
                          }
                          handleChange(question.name, newValues);
                        }}
                      />
                      <OptionLabel htmlFor={`${question.name}-${option}`}>
                        {option}
                      </OptionLabel>
                    </OptionItem>
                  ))}
                </OptionsGrid>
              )
            ) : (
              <AnswerDisplay>
                {Array.isArray(surveyData[question.name]) ? (
                  surveyData[question.name].map((item: string) => (
                    <AnswerTag key={item}>{item}</AnswerTag>
                  ))
                ) : (
                  <AnswerTag>{surveyData[question.name]}</AnswerTag>
                )}
              </AnswerDisplay>
            )}
          </QuestionCard>
        ))}
      </SurveyContent>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #111;
`;

const ActionButton = styled.button<{ variant?: "primary" | "secondary" }>`
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #000;
  background: ${(props) => (props.variant === "secondary" ? "white" : "black")};
  color: ${(props) => (props.variant === "secondary" ? "black" : "white")};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const SurveyContent = styled.div`
  padding: 24px;
  display: grid;
  gap: 24px;
`;

const QuestionCard = styled.div`
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  transition: border-color 0.2s;

  &:hover {
    border-color: #e0e0e0;
  }
`;

const QuestionTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #111;
  margin-bottom: 16px;
`;

const OptionsGrid = styled.div`
  display: grid;
  gap: 12px;
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OptionLabel = styled.label`
  font-size: 14px;
  color: #333;
  cursor: pointer;
  user-select: none;
`;

const RadioInput = styled.input`
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 50%;
  margin: 0;
  cursor: pointer;
  transition: all 0.2s;

  &:checked {
    border-color: #000;
    background: #000;
    box-shadow: inset 0 0 0 3px white;
  }

  &:hover {
    border-color: #000;
  }
`;

const CheckboxInput = styled.input`
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin: 0;
  cursor: pointer;
  transition: all 0.2s;

  &:checked {
    border-color: #000;
    background: #000;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' width='18px' height='18px'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E");
    background-size: 12px;
    background-position: center;
    background-repeat: no-repeat;
  }

  &:hover {
    border-color: #000;
  }
`;

const AnswerDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const AnswerTag = styled.span`
  background: #f8f9fa;
  padding: 6px 12px;
  border-radius: 5px;
  font-size: 14px;
  color: #333;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 15px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #dc3545;
  font-size: 15px;
`;
