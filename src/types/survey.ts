type SurveyDataKeys =
  | "occupation"
  | "isStudent"
  | "recentCourse"
  | "livingArrangement"
  | "leisureActivities"
  | "hobbies"
  | "sports"
  | "travelExperience";

export interface SurveyData {
  occupation: string;
  isStudent: string;
  recentCourse: string;
  livingArrangement: string;
  leisureActivities: string[];
  hobbies: string[];
  sports: string[];
  travelExperience: string[];
}

interface QuestionType {
  title: string;
  name: SurveyDataKeys;
  type: "radio" | "checkbox";
  options: string[];
  minSelect?: number;
}

export const survey: QuestionType[] = [
  {
    title: "현재 귀하는 어느 분야에 종사하고 계신가요?",
    name: "occupation",
    type: "radio",
    options: ["사업/회사", "재택근무/재택사업", "교사/교육자", "일 경험 없음"],
  },
  {
    title: "현재 당신은 학생인가요?",
    name: "isStudent",
    type: "radio",
    options: ["예", "아니오"],
  },
  {
    title: "최근 어떤 강의를 수강했습니까?",
    name: "recentCourse",
    type: "radio",
    options: [
      "학위 과정 수업",
      "전문 기술 향상을 위한 평생 학습",
      "어학 수업",
      "수강 후 5년 이상 지남",
    ],
  },
  {
    title: "현재 귀하는 어디에 살고 계십니까?",
    name: "livingArrangement",
    type: "radio",
    options: [
      "개인 주택이나 아파트에 홀로 거주",
      "친구나 룸메이트와 함께 주택이나 아파트에 거주",
      "가족(배우자/자녀/기타 가족)과 함께 주택이나 아파트에 거주",
      "학교 기숙사",
      "군대 막사, 군 시설",
    ],
  },
  {
    title: "귀하는 여가 활동으로 주로 무엇을 하나요? (2개 이상)",
    name: "leisureActivities",
    type: "checkbox",
    options: [
      "영화보기",
      "클럽/나이트클럽 가기",
      "박물관 가기",
      "공원가기",
      "주거 개선",
      "해변가기",
      "스포츠 관람",
      "요리 관련 프로그램 시청",
      "공연보기",
      "게임하기",
      "캠핑하기",
      "SNS 글 올리기",
      "구직활동",
      "술집/바에 가기",
      "친구들과 문자하기",
      "당구치기",
      "자원 봉사",
      "차 드라이브 하기",
      "시험 대비 과정 수강",
      "뉴스 보거나 듣기",
      "카페/커피 전문점 가기",
      "체스",
      "콘서트 보기",
      "TV 시청",
      "쇼핑하기",
      "리얼리티 쇼 보기",
    ],
    minSelect: 2,
  },
  {
    title: "귀하의 취미나 관심사는 무엇인가요? (1개 이상)",
    name: "hobbies",
    type: "checkbox",
    options: [
      "여행 관련 잡지나 블로그 글 읽기",
      "춤추기",
      "그림 그리기",
      "음악 감상하기",
      "요리하기",
      "사진 촬영하기",
      "악기 연주하기",
      "주식 투자",
      "혼자서 노래 부르거나 합창하기",
      "애완동물 키우기",
      "신문 읽기",
      "글쓰기",
      "독서",
      "아이에게 책 읽어주기",
    ],
    minSelect: 1,
  },
  {
    title: "귀하는 주로 어떤 운동을 즐기십니까? (1개 이상)",
    name: "sports",
    type: "checkbox",
    options: [
      "축구",
      "미식축구",
      "농구",
      "야구, 소프트볼",
      "하키",
      "크로켓",
      "골프",
      "배구",
      "배드민턴",
      "탁구",
      "테니스",
      "수영",
      "자전거",
      "스키/스노보드",
      "아이스 스케이트",
      "조깅",
      "걷기",
      "하이킹, 트레킹",
      "헬스",
      "낚시",
      "요가",
      "태권도",
      "운동 수업 수강하기",
      "운동을 전혀 하지 않음",
    ],
    minSelect: 1,
  },
  {
    title: "귀하는 어떤 출장을 다녀온 경험이 있습니까? (1개 이상)",
    name: "travelExperience",
    type: "checkbox",
    options: [
      "국내 여행",
      "해외 여행",
      "집에서 보내는 휴가",
      "국내 출장",
      "해외 출장",
    ],
    minSelect: 1,
  },
];
