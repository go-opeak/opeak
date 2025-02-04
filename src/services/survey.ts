import { API_URL } from "@constants/url";
import axios from "axios";

export async function fetchSurveyDaya() {
  try {
    const response = await axios.get(`${API_URL}/api/survey`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("TOKEN")}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      console.log("Survey data retrieved successfully:", response.data);
      return response.data;
    }
    throw new Error("설문 데이터를 불러오는데 실패했습니다.");
  } catch (error) {
    console.error("Error getting survey:", error);
    throw new Error("설문 데이터를 불러오는 중 오류가 발생했습니다.");
  }
}
