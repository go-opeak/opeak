import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm, Controller } from "react-hook-form";
import { survey, SurveyData } from "../../types/survey";
import { useSetRecoilState } from "recoil";
import { surveyDataState } from "@states/surveyAtoms";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/routes";
import axios from "axios";
import { API_URL } from "@constants/url";

const Survey: React.FC = () => {
  const { control, handleSubmit, watch } = useForm<SurveyData>();
  const setSurveyData = useSetRecoilState(surveyDataState);
  const navigate = useNavigate();

  const [totalSelected, setTotalSelected] = useState(0);

  const watchFields = watch();

  useEffect(() => {
    const checkboxFields = [
      "leisureActivities",
      "hobbies",
      "sports",
      "travelExperience",
    ] as const;
    const total = checkboxFields.reduce(
      (sum, field) => sum + (watchFields[field]?.length || 0),
      0
    );
    setTotalSelected(total);
  }, [watchFields]);

  const submitSurvey = async (data: SurveyData) => {
    try {
      const response = await axios.post(`${API_URL}/api/survey`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("TOKEN")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        console.log("Survey submitted successfully:", response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      throw new Error("설문 제출 중 오류가 발생했습니다.");
    }
  };

  const onSubmit = async (data: SurveyData) => {
    const checkboxQuestions = survey.filter((q) => q.type === "checkbox");
    const notMetMinimum = checkboxQuestions.filter(
      (q) => q.minSelect !== undefined && data[q.name].length < q.minSelect
    );

    if (notMetMinimum.length > 0) {
      alert(
        `다음 항목에서 최소 선택 개수를 만족하지 않았습니다:\n${notMetMinimum
          .map((q) => q.title)
          .join("\n")}`
      );
      return;
    }

    try {
      await submitSurvey(data);
      setSurveyData(data);
      navigate(ROUTES.MAIN);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SurveyContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        {survey.map((question, index) => (
          <QuestionContainer key={index}>
            <QuestionTitle>{question.title}</QuestionTitle>
            <Controller
              name={question.name as keyof SurveyData}
              control={control}
              defaultValue={question.type === "checkbox" ? [] : ""}
              render={({ field }) => (
                <OptionContainer>
                  {question.options.map((option, optionIndex) => (
                    <Option key={optionIndex}>
                      <input
                        type={question.type}
                        {...field}
                        value={option}
                        checked={
                          question.type === "checkbox"
                            ? Array.isArray(field.value) &&
                              field.value.includes(option)
                            : field.value === option
                        }
                        onChange={(e) => {
                          if (question.type === "checkbox") {
                            const currentValue = Array.isArray(field.value)
                              ? field.value
                              : [];
                            let newValue;
                            if (e.target.checked) {
                              if (totalSelected < 12) {
                                newValue = [...currentValue, option];
                              } else {
                                alert("최대 12개까지만 선택할 수 있습니다.");
                                return;
                              }
                            } else {
                              newValue = currentValue.filter(
                                (v) => v !== option
                              );
                            }
                            field.onChange(newValue);
                          } else {
                            field.onChange(e.target.value);
                          }
                        }}
                        disabled={
                          question.type === "checkbox" &&
                          !field.value.includes(option) &&
                          totalSelected >= 12
                        }
                      />{" "}
                      {option}
                    </Option>
                  ))}
                </OptionContainer>
              )}
            />
          </QuestionContainer>
        ))}
        <SubmitButton type="submit">제출하기</SubmitButton>
      </form>
    </SurveyContainer>
  );
};

export default Survey;

const SurveyContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const QuestionContainer = styled.div`
  margin-bottom: 30px;
`;

const QuestionTitle = styled.h3`
  margin-bottom: 10px;
`;

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Option = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const SubmitButton = styled.button`
  background-color: black;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
`;
