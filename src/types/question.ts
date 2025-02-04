import axios from "axios";
import { SurveyData } from "./survey";
import { API_URL } from "@constants/url";

interface TopicQuestions {
  [key: string]: string[];
}

interface QuestionSet {
  topic: string;
  questions: string[];
}

export interface GeneratedQuestion {
  number: number; // 질문 번호 추가
  question: string;
}

export const generateOPIcQuestions = async (): Promise<string[]> => {
  try {
    const surveyData = await getSurvey();
    if (!surveyData) {
      throw new Error("설문 데이터를 불러올 수 없습니다.");
    }

    const finalQuestions: string[] = [];

    // 1. 자기소개 질문 추가
    finalQuestions.push(
      "Let's start the interview now. Tell me a little bit about yourself"
    );

    // 2. 설문 기반 질문 세트 생성
    const surveyQuestionSets = generateSurveyBasedQuestionSets(surveyData);

    if (surveyQuestionSets.length === 0) {
      throw new Error("설문 기반 질문을 생성할 수 없습니다.");
    }

    // 사용 가능한 설문 세트 복사 (중복 방지를 위해)
    const availableSets = [...surveyQuestionSets];

    // 3. 2단 콤보용 설문 주제 선택 (한 세트에서 2개 질문)
    if (availableSets.length === 0) {
      throw new Error("사용 가능한 설문 세트가 없습니다.");
    }
    const twoComboSetIndex = Math.floor(Math.random() * availableSets.length);
    const twoComboSet = availableSets.splice(twoComboSetIndex, 1)[0]; // 사용한 세트 제거
    finalQuestions.push(...twoComboSet.questions.slice(0, 2));

    // 4. 3단 콤보 구성 (4세트)
    // 돌발 주제 세트 수 결정 (1-2개)
    const suddenTopicsCount = Math.random() < 0.5 ? 1 : 2;

    // 돌발 주제 콤보 추가
    const suddenTopics = [...getSuddenTopics()]; // 복사본 생성
    for (let i = 0; i < suddenTopicsCount; i++) {
      const randomTopicIndex = Math.floor(Math.random() * suddenTopics.length);
      const selectedTopic = suddenTopics.splice(randomTopicIndex, 1)[0]; // 선택된 주제 제거
      const topicQuestions = getQuestionsForTopic(selectedTopic);
      finalQuestions.push(...topicQuestions);
    }

    // 롤플레이 콤보 추가 (1세트)
    const rolePlayQuestions = getRolePlayQuestions();
    finalQuestions.push(...getRandomQuestions(rolePlayQuestions, 3));

    // 남은 설문 주제 콤보 추가 (1-2세트)
    const remainingSurveyCount = 4 - suddenTopicsCount - 1; // 전체 4세트 - 돌발 세트 - 롤플레이

    // 남은 설문 세트 수와 사용 가능한 세트 수 확인
    if (remainingSurveyCount > availableSets.length) {
      throw new Error("사용 가능한 설문 세트가 부족합니다.");
    }

    // 남은 설문 세트에서 랜덤 선택 (중복 없이)
    for (let i = 0; i < remainingSurveyCount; i++) {
      if (availableSets.length === 0) break;
      const selectedSetIndex = Math.floor(Math.random() * availableSets.length);
      const selectedSet = availableSets.splice(selectedSetIndex, 1)[0]; // 사용한 세트 제거
      finalQuestions.push(...selectedSet.questions);
    }

    return finalQuestions;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("질문 생성 중 오류가 발생했습니다.");
  }
};

const generateSurveyBasedQuestionSets = (
  surveyData: SurveyData
): QuestionSet[] => {
  const questionSets: QuestionSet[] = [];

  // 직업 관련 질문 세트
  if (surveyData.occupation === "사업/회사") {
    questionSets.push({
      topic: "직장",
      questions: [
        "You indicated in the survey that you're employed. Tell me about the company you currently work for. Where is it located and when was it established?",
        "Please describe your office or workplace in detail. What does it look like? What can be found in your place of work?",
        "Tell me about the technology or equipment in your office or workplace. Which device do you use regularly? What do you use them for?",
      ],
    });
  }

  // 학생 관련 질문 세트
  if (surveyData.isStudent === "예") {
    questionSets.push({
      topic: "학교",
      questions: [
        "You indicated in the survey that you attend university. Tell me about your school. Where is it? What dose it look like?",
        "Tell me about your first visit to your school. When was it, and who were you with?",
        "Many students become friends with their classmates. Tell me about how and when you met your close friend at school.",
      ],
    });
  }

  // 여가 활동 질문 세트
  surveyData.leisureActivities.forEach((activity) => {
    const leisureQuestions = getLeisureQuestions();
    if (activity in leisureQuestions) {
      const questions = leisureQuestions[activity];
      if (questions.length >= 3) {
        questionSets.push({
          topic: activity,
          questions: questions.slice(0, 3), // 정확히 3개의 질문만 사용
        });
      }
    }
  });

  // 취미 질문 세트
  surveyData.hobbies.forEach((hobby) => {
    const hobbyQuestions = getHobbyQuestions();
    if (hobby in hobbyQuestions) {
      const questions = hobbyQuestions[hobby];
      if (questions.length >= 3) {
        questionSets.push({
          topic: hobby,
          questions: questions.slice(0, 3),
        });
      }
    }
  });

  // 스포츠 질문 세트
  surveyData.sports.forEach((sport) => {
    const sportQuestions = getSportQuestions();
    if (sport in sportQuestions) {
      const questions = sportQuestions[sport];
      if (questions.length >= 3) {
        questionSets.push({
          topic: sport,
          questions: questions.slice(0, 3),
        });
      }
    }
  });

  return questionSets;
};

// 랜덤 질문 세트 선택
const selectRandomQuestionSet = (sets: QuestionSet[]): QuestionSet => {
  const index = Math.floor(Math.random() * sets.length);
  return sets[index];
};

// 돌발 주제 목록 가져오기
const getSuddenTopics = (): string[] => [
  "집안일 거들기",
  "외식",
  "인터넷 서핑",
  "명절",
  "은행",
  "교통",
  "건강 병원",
  "호텔",
  "패션",
  "약속",
  "가구 가전",
  "재활용",
  "날씨",
  "도서관",
];

// 돌발 주제의 질문 가져오기
const getQuestionsForTopic = (topic: string): string[] => {
  const suddenQuestions: TopicQuestions = {
    "집안일 거들기": [
      "Everyone has to do housework on a regular basis. What kind of chore do you usually do at home? Tell me about them in detail.",
      "You and your family probably have different responsibility at home. Tell me about which chores in family member is responsible for.",
      "Have you ever had chores that you weren't able to do? if so, explain why you weren't able to do them. Tell me using as many details as possible.",
    ],
    외식: [
      "What was the last restaurant you ate at? what did you have there? Who did you go with? Provide as many details in your response as possible.",
      "Is there a particular restaurant to you often to go? What kind of food does it serve? Why do you like to go there?",
      "Many countries that have special or unique foods. What are some of the transitional dishes in your country? Please describe them in detail.",
    ],
    "인터넷 서핑": [
      "When you work on projects, do you use the internet? Please explain what you use it for and why it is useful. Provide as many details in your response as possible.",
      "There are many different types of computers and programs available now. What kind of computer and programs do you have? Please describe them in detail.",
      "Everyone uses the Internet regularly these days. When did you use the internet for the first time? Do you use it a lot this day? How much time do you spend on the Internet each days?",
    ],
    명절: [
      "Can you tell me about a particularly memorable holiday you had when you were young? Describe what you did and what made it so memorable? Give me as many details as you can.",
      "Certain holidays or more important than others. What is the biggest holiday in your country? Tell me what you usually do on that holiday and how you celebrate it?",
      "There are many different ways to celebrate a holiday. How are holidays celebrated in your country, and what kind of special food are prepared?",
    ],
    은행: [
      "People go to the bank for many reasons. Why do people go to the bank? Please give me as many details as possible.",
      "Tell me about the banks in your country. Where are they located? When do they open and close? What do they look like? Please describe in as much detail as possible.",
      "Tell me about the last time you went to a bank. What did you do at the bank? Please describe your experience in detail.",
    ],
    교통: [
      "What is public transportation like in your country? Tell me which type of public transportation you prefer to use and why. Provide as many details in your response as possible.",
      "Public transportation systems are constantly being improved. Have there been any changes to the public transportation system in your city since you were young? Please tell me about them in detail.",
      "Sometimes riding the subway or bus can be uncomfortable. Have you ever had any problems while taking public transportation? Please describe your experience in detail.",
    ],
    "건강 병원": [
      "There are many different ways to stay healthy. What do you think a person should do to stay healthy? Give me as many detail as possible.",
      "Going to the dentist can be stressful. Are you afraid to visit the dentist? Have you ever had an unpleasant experience at a dental clinic?",
      "Have you ever had to quite doing something for healthy reasons? What was it that you had to give up?",
    ],
    호텔: [
      "Please tell me about the hotels in your country. What do they look like? Where are they located? What kind of facilities do they have?",
      "What do you usually do when you arrive at a hotel? Describe the steps you take when you stay at a hotel.",
      "Please describe a memorable experience you have had while staying at a hotel. What happened? What made the experience memorable?",
    ],
    패션: [
      "I'd like to know the kinds of clothes people typically wear in your country. What do that wear when they are relaxing at home? How is it different from what they wear at work?",
      "Tell me about the changes in fashion trends in your country. What kind of clothes did people wear in the past? How is it different from what people wear these days?",
      "Tell me about the last time you went shopping for clothes. What did you buy and who did you go with?",
    ],
    약속: [
      "People make appointment for a variety of reasons. What kind of appointment do you usually make with people? Who do you make them with?",
      "Where do you like to meet your friends? Why do you prefer this place? Provide as many detail as possible in your response.",
      "Tell me about a particularly memorable appointment with your friends. What made this experience so unforgettable? Give me as many details as you can.",
    ],
    "가구 가전": [
      "Tell me about your favorite piece of furniture in your house. What does it look like? Why is it your favorite? Give me as many details as possible.",
      "Can you tell me about a piece of furniture you bought recently? Where did you buy that? Give me as many detail as possible.",
      "Have you experienced any problem with your electronics? Describe a recent difficulty you faced, and explain how it happened. How did you solve this problem?",
    ],
    재활용: [
      "How do they people in your country recycle? What items do they recycle? Tell me about the recycling system in your country in detail.",
      "How do you recycle at home? When and how often do you take out recyclable items? Describe the process in detail.",
      "Tell me about our memorable experience you have had while recycling. What happened and what did you do? Please describe the experience in detail.",
    ],
    날씨: [
      "The weather varies from seasons to season. Tell me what the weather has been like these days. Provide as many details as possible.",
      "Many people feel that the weather was different when they were children. Have you noticed a change in the weather over the years? Was it different when you were young?",
      "Have you ever experienced something memorable because of the weather? please explain what happened and why it was memorable. Give me as many details as possible.",
    ],
    도서관: [
      "Did you ever have a problem while using a library? What was the problem and how was it resolved? Please provide as many details as possible.",
      "Can you tell me about the library you go to most often? Where is it located, and what does it look like? Why do you go there? Please tell me about it in detail.",
      "Tell me about your most recent visit to the library. When did you go? Who did you go with? What did you do there? Please provide as many details in your response as possible.",
    ],
  };

  return suddenQuestions[topic] || [];
};

// 롤플레이 질문 가져오기
const getRolePlayQuestions = (): string[] => [
  "I also live with my family now. Now ask three or a four questions about my family.",
  "I am currently a student at Harvard University. Please ask me three or four questions about Harvard University.",
  "I moved into a new house recently. Ask me three or four questions about my house.",
  "I enjoy going to the movies. Ask me three or four questions about the kind of movies I like.",
  "I also enjoy swimming. Please ask me three or four questions about my swimming habits.",
  "I'm planning to go to Vancouver in Canada. Ask me three or four questions about Vancouver.",
  "I go to the library often. Ask me three or four questions about the library I go to.",
];

// 여가 활동 질문 가져오기
const getLeisureQuestions = (): TopicQuestions => ({
  영화보기: [
    "In your background survey, you indicated that you enjoy watching movies. What is your favorite type of movie and why? Please provide the as many details as possible.",
    "Talk about a movie you remember best. What was it about? Who was in it? How did you feel when watching it?",
    "What is your routine when you go to the theater? What do you do before watching movies? What about after? Please describe your routine in detail.",
    "Who is your favorite actor? What movies has this actor starred in? What do you like about him or her?",
  ],
  공원가기: [
    "You indicated in the survey that you like to go to the park. Describe your favorite park in as much detail as possible. What makes it so special?",
    "How often do you go to the park? Who do you usually go with? What do you like to do tell me as much detail as possible.",
    "Please tell me about a time something interesting or unexpected happened at the park? Where and when did it occur? What ware you doing at the time?",
    "Tell me about what you usually do at the park? What is the typical day at the park like from beginning to end?",
  ],
  해변가기: [
    "In your background survey, you indicated that you like going to beaches. Where is your favorite beach and how often do you go there? Why do you like it?",
    "What items do you pack for a beach trip? Why do you take them with you? Provide as many details as possible.",
  ],
  캠핑하기: [
    "Tell me about your most memorable camping trip. What happened? What made the trip so memorable?",
    "What do you usually do when you go camping? Please tell me everything you do on a camping trip.",
  ],
  쇼핑하기: [
    "Unexpected difficulties can occur while we are shopping. What was a problem you recently experienced while shopping? How did you reserve this issue? Provide as many details in your response as possible.",
    "Describe a memorable or interesting experience you once had when shopping. What made this experience so unforgettable? Provide as many details as possible.",
    "Shopping is a popular activity. Tell me where you usually like to shop. When do you go there, and who do you go with? What do you usually buy?",
    "Is there a particular store that you visite regularly? Tell me what the store sells and why you like going there.",
  ],
  "TV 시청": [
    "When did you start watching TV and what made you interested in it? Describe in detail how TV shows have changed since you were young.",
    "Is there a TV show you used to watch that was particularly enjoyable? What was the title? Tell me what it was about and why you liked it so much.",
    "Tell me about the TV programs you like to watch. Why do you like to watch them? How often do you usually watch them? Give me as many details as possible.",
  ],
  "리얼리티 쇼 보기": [
    "In your background survey, you indicated that you enjoy watching reality shows. Where did your favorite reality show take place? What did that place look like? Why was the show filmed in that place? Provide as many details as you can.",
  ],
  "카페/커피 전문점 가기": [
    "You indicated in the survey that you like to go to cafe. Tell me about a cafe you go to often. Where is it located? What does it look like? Please describe it in detail.",
    "When was the first time you went to a cafe? Who did you go with? Did you like it? Please tell me as much detail as you can.",
    "Please tell me about a memorable experience you have had that a cafe. What happened? Why was this experience so memorable?",
    "What do you usually do at a cafe? Who do you go with? What do you like to order?",
  ],
});

// 취미 관련 질문 가져오기
const getHobbyQuestions = (): TopicQuestions => ({
  "음악 감상하기": [
    "In your background survey, you indicated that you enjoy listening to music. What kind of music do you like? Who is your favorite singer or composer.",
    "Where and when do you usually listen to music? What do you use to listen to music? Provide as many details as possible in your response.",
    "What first interested you in music? When you first heard your favorite singer or a composer, how did you feel? Has your taste in music changed at all?",
    "What is your favorite song? What makes it so special? Do you have a special memory associated with the song?",
  ],
});

// 스포츠 관련 질문 가져오기
const getSportQuestions = (): TopicQuestions => ({
  수영: [
    "In your background survey, you indicated that you know how to swim. When did you first learn how to swim. When was the last time you went swimming and with whom?",
    "Have you ever had a memorable experienc while you were swimming? Tell me about the explain from the beginning to the end.",
    "Swimming is very popular this days. How often do you swim? Who do you usually go with? Provide as many detail as possible in your response.",
    "Please explain why you enjoy swimming. What are some of the advantages of swimming and why is it better than other type of exercise.",
  ],
});

// 여행 관련 질문 가져오기
const getTravelQuestions = (): TopicQuestions => ({
  일반여행: [
    "Before you travel, what do you usually prepare for your trip? What things do you include in your luggage? Please list of pure items you take with you.",
    "You must have had a trip that was particular memorable. Describe that trip and tell me why it was unforgettable. Provide as many details as possible.",
  ],
  "국내 여행": [
    "You indicated in the survey that you enjoy traveling within your home country. What are your favorite places to visit and why do you like them?",
  ],
  "해외 여행": [
    "More and more people are traveling abroad these days. When did you first travel abroad? Where did you go and who did you go with?",
  ],
});

// 랜덤 주제 선택
const getRandomTopic = (topics: string[]): string => {
  const index = Math.floor(Math.random() * topics.length);
  return topics[index];
};

// 랜덤 질문 선택
const getRandomQuestions = (questions: string[], count: number): string[] => {
  return [...questions].sort(() => Math.random() - 0.5).slice(0, count);
};

// 서버에서 설문 데이터를 가져오는 함수는 동일하게 유지
export const getSurvey = async (): Promise<SurveyData> => {
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
};
