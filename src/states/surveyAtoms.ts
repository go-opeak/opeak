import { SurveyData } from "../types/survey";
import { atom } from "recoil";

export const surveyDataState = atom<SurveyData | null>({
  key: "surveyDataState",
  default: null,
});
