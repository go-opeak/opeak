import { API_URL } from "@constants/url";
import axios from "axios";

// API 호출 시
export const fetchFeedbackHistory = async (
  page: number = 0,
  size: number = 10
) => {
  try {
    const response = await axios.get(`${API_URL}/api/feedback/history`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("TOKEN")}`, // TOKEN으로 수정
        "Content-Type": "application/json",
      },
      params: { page, size },
    });

    if (response.status === 200) {
      return response.data;
    }
    throw new Error("첨삭 데이터를 불러오는데 실패했습니다.");
  } catch (error) {
    console.error("Error fetching feedback history:", error);
    throw new Error("첨삭 데이터를 불러오는 중 오류가 발생했습니다.");
  }
};

export const fetchFeedbackDetail = async (feedbackId: number) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/feedback/history/${feedbackId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("TOKEN")}`, // TOKEN으로 수정
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    }
    throw new Error("첨삭 상세 데이터를 불러오는데 실패했습니다.");
  } catch (error) {
    console.error("Error fetching feedback detail:", error);
    throw new Error("첨삭 상세 데이터를 불러오는 중 오류가 발생했습니다.");
  }
};
