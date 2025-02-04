interface ScoreByCategory {
  grammar: number;
  wordChoice: number;
  pronunciation: number;
  taskCompletion: number;
  topicDevelopment: number;
}

interface ImprovedScript {
  questionNumber: number;
  question: string;
  originalScript: string;
  improvedScript: string;
  scoreByCategory: ScoreByCategory;
  improvementPoints: string[];
}

interface FeedbackDetailResponse {
  feedbackId: number;
  feedbackTime: string;
  estimatedLevel: string;
  overallScore: number;
  overallFeedback: string;
  improvedScripts: ImprovedScript[];
}

interface FeedbackHistory {
  feedbackId: number;
  feedbackTime: string;
  estimatedLevel: string;
  overallScore: number;
  overallFeedback: string;
}

interface FeedbackHistoryResponse {
  content: FeedbackHistory[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  size: number;
  numberOfElements: number;
  empty: boolean;
}

export type {
  FeedbackDetailResponse,
  FeedbackHistory,
  FeedbackHistoryResponse,
  ImprovedScript,
  ScoreByCategory,
};
