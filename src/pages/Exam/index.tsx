import { useState, useEffect, useRef } from "react";
import { generateOPIcQuestions } from "../../types/question";
import { ROUTES } from "@constants/routes";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchSurveyDaya } from "@services/survey";
import { ReactComponent as Logo } from "@assets/svg/logo.svg";
import { API_URL } from "@constants/url";
import { useAlert } from "@components/Alter/AlertProvider";

// Interface definitions
interface TimerProps {
  isRunning: boolean;
}

interface ProgressDotProps {
  isActive: boolean;
  isCompleted: boolean;
}

interface UserResponse {
  questionNumber: number;
  question: string;
  userScript: string;
}

// Web Speech API interfaces
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: ErrorEvent) => void;
  onend: () => void; // onend 속성 추가
  start: () => void;
  stop: () => void;
}

interface ScriptRequest {
  scripts: {
    questionNumber: number;
    question: string;
    userScript: string;
  }[];
}
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Google Speech-to-Text API function
export const fetchSpeechToText = async (audioFile: string, isWeb: boolean) => {
  try {
    const GOOGLE_API_KEY = "" + process.env.REACT_APP_GOOGLE_API_KEY;

    const config = isWeb
      ? {
          encoding: "WEBM_OPUS",
          sampleRateHertz: 48000,
          languageCode: "ko-KR",
        }
      : {
          encoding: "LINEAR16",
          sampleRateHertz: 44100,
          languageCode: "ko-KR",
        };

    const response = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("TOKEN")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          config,
          audio: {
            content: audioFile,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results[0]?.alternatives[0]?.transcript || "";
  } catch (error) {
    console.error("Failed to recognize speech", error);
    return "";
  }
};

// Main Component
export const Exam = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isQuestionReady, setIsQuestionReady] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(40 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [playCount, setPlayCount] = useState<number>(0);
  const [hasListened, setHasListened] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [userResponses, setUserResponses] = useState<UserResponse[]>([]);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthesis = window.speechSynthesis;
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [webcamError, setWebcamError] = useState<string>("");

  // Webcam initialization
  const initWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
      setWebcamError("웹캠 접근에 실패했습니다. 권한을 확인해주세요.");
    }
  };

  useEffect(() => {
    initWebcam();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, timeRemaining]);

  // Questions loading
  const { data: surveyData, isLoading } = useQuery("survey", fetchSurveyDaya);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const generatedQuestions = await generateOPIcQuestions();

        setQuestions(generatedQuestions);
      } catch (error) {
        setError(error + "");
      }
    };
    loadQuestions();
  }, []);

  // Speech synthesis for questions
  const speakQuestion = (question: string) => {
    if (playCount >= 2) return;

    if (speechRef.current) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(question);
    utterance.lang = "en-US";
    utterance.rate = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setPlayCount((prev) => prev + 1);
      setHasListened(true);
    };

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  // Web Speech API 초기화 부분 수정
  useEffect(() => {
    const SpeechRecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionConstructor) {
      recognitionRef.current = new SpeechRecognitionConstructor();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      let finalTranscript = ""; // 최종 텍스트 보관
      let interimTranscript = ""; // 임시 텍스트 보관

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
            setTranscript(finalTranscript.trim());
          } else {
            interimTranscript = transcript;
            // 임시 결과도 화면에 표시하기 위해 현재까지의 최종 결과와 임시 결과를 합침
            setTranscript((finalTranscript + interimTranscript).trim());
          }
        }
      };

      recognitionRef.current.onend = () => {
        // 음성 인식이 끝났을 때 자동으로 다시 시작
        if (isListening) {
          recognitionRef.current?.start();
        }
      };

      recognitionRef.current.onerror = (event: ErrorEvent) => {
        console.error("Speech recognition error", event.error);
        if (event.error === "no-speech") {
          // 음성이 감지되지 않았을 때 다시 시작
          if (isListening) {
            recognitionRef.current?.start();
          }
        } else {
          setIsListening(false);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]); // isListening을 의존성 배열에 추가

  // Start 버튼 핸들러 수정
  const handleStart = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setIsTimerRunning(true);
        setIsQuestionReady(true);
        setTranscript(""); // 새로운 녹음 시작 시 transcript 초기화
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
      }
    }
  };

  const { showAlert } = useAlert();

  // handleNext 함수 수정
  const handleNext = async () => {
    if (!questions) return;

    try {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      }

      setIsTimerRunning(false);
      setIsQuestionReady(false);

      // 현재 답변 저장
      const newResponse = {
        questionNumber: currentQuestionIndex + 1,
        question: questions[currentQuestionIndex],
        userScript: transcript.trim(),
      };

      // 마지막 질문인 경우
      if (currentQuestionIndex === questions.length - 1) {
        // 모든 답변을 포함한 최종 배열 생성
        const allResponses = [...userResponses, newResponse];

        // 서버 요청 형식에 맞게 데이터 구조화
        const requestData: ScriptRequest = {
          scripts: allResponses.map((response) => ({
            questionNumber: response.questionNumber,
            question: response.question,
            userScript: response.userScript,
          })),
        };

        // console.log("Sending data to server:", requestData);
        showAlert(
          "수고하셨습니다. 모든 답변을 완료하였습니다. \n AI 첨삭 결과는 약 3분 후에 확인 가능합니다."
        );

        try {
          const result = await axios.post(
            `${API_URL}/api/feedback/opic`,
            requestData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("TOKEN")}`,
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Server response:", result.data);
        } catch (error) {
          console.error("Failed to send responses:", error);
          showAlert(
            "현재 모든 AI 크래딧이 소진되어 해당 기능을 사용하실 수 없습니다. \n "
          );
        }
      } else {
        // 다음 질문으로 이동
        setUserResponses((prev) => [...prev, newResponse]);
        setCurrentQuestionIndex((prev) => prev + 1);
        setPlayCount(0);
        setHasListened(false);
        setTranscript("");
      }
    } catch (error) {
      console.error("Error in handleNext:", error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  // Utility functions
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (!questions) {
    return <div>No questions available</div>;
  }

  return (
    <ExamWrapper>
      <ExamContainer>
        <MainSection>
          <VideoArea>
            <QuestionProgress>
              Question {currentQuestionIndex + 1} of {questions.length}
            </QuestionProgress>
            <QuestionBox>
              <QuestionText>{questions[currentQuestionIndex]}</QuestionText>
              <AudioControls>
                <AudioButton
                  onClick={() => speakQuestion(questions[currentQuestionIndex])}
                  disabled={playCount >= 2}
                >
                  {isPlaying ? <div>🔇</div> : <div>🔊</div>}
                  <PlayCount>{2 - playCount} 회</PlayCount>
                </AudioButton>
                <Timer isRunning={isTimerRunning}>
                  {formatTime(timeRemaining)}
                </Timer>
              </AudioControls>
            </QuestionBox>

            <VideoFrame>
              <Video ref={videoRef} autoPlay playsInline muted />
              {isListening && <RecordingDot />}
              {webcamError && <ErrorMessage>{webcamError}</ErrorMessage>}
              {/* {transcript && (
                <TranscriptOverlay>{transcript}</TranscriptOverlay>
              )} */}
            </VideoFrame>

            <ControlBar>
              <Logo />
              <ControlButton
                onClick={!isQuestionReady ? handleStart : handleNext}
                disabled={!hasListened && !isQuestionReady}
              >
                {!isQuestionReady ? "Start" : "Next →"}
              </ControlButton>
            </ControlBar>

            <ProgressDots>
              {Array.from({ length: questions.length }, (_, i) => (
                <ProgressDot
                  key={i}
                  isActive={i === currentQuestionIndex}
                  isCompleted={i < currentQuestionIndex}
                />
              ))}
            </ProgressDots>
          </VideoArea>
        </MainSection>

        {/* 사이드 패널 */}
        <SidePanel>
          <InfoCard>
            <CardTitle>Background Survey</CardTitle>
            {isLoading ? (
              <div>Loading...</div>
            ) : surveyData ? (
              <SurveyContent>
                {surveyData.occupation && (
                  <SurveyItem>
                    <Label>직업</Label>
                    <Value>{surveyData.occupation}</Value>
                  </SurveyItem>
                )}
                {surveyData.isStudent && (
                  <SurveyItem>
                    <Label>학생 여부</Label>
                    <Value>
                      {surveyData.isStudent === "예"
                        ? "학생"
                        : surveyData.recentCourse}
                    </Value>
                  </SurveyItem>
                )}
                {surveyData.livingArrangement && (
                  <SurveyItem>
                    <Label>거주지</Label>
                    <Value>{surveyData.livingArrangement}</Value>
                  </SurveyItem>
                )}
                {surveyData.leisureActivities && (
                  <SurveyItem>
                    <Label>여가활동</Label>
                    <TagList>
                      {surveyData.leisureActivities.map((activity: string) => (
                        <Tag key={activity}>{activity}</Tag>
                      ))}
                    </TagList>
                  </SurveyItem>
                )}
                {surveyData.hobbies && (
                  <SurveyItem>
                    <Label>취미</Label>
                    <TagList>
                      {surveyData.hobbies.map((hobby: string) => (
                        <Tag key={hobby}>{hobby}</Tag>
                      ))}
                    </TagList>
                  </SurveyItem>
                )}
                {surveyData.sports && (
                  <SurveyItem>
                    <Label>운동</Label>
                    <TagList>
                      {surveyData.sports.map((sport: string) => (
                        <Tag key={sport}>{sport}</Tag>
                      ))}
                    </TagList>
                  </SurveyItem>
                )}

                {surveyData.travelExperience && (
                  <SurveyItem>
                    <Label>여행/출장 경험</Label>
                    <TagList>
                      {surveyData.travelExperience.map((travel: string) => (
                        <Tag key={travel}>{travel}</Tag>
                      ))}
                    </TagList>
                  </SurveyItem>
                )}
              </SurveyContent>
            ) : (
              <div>No survey data available</div>
            )}
          </InfoCard>
        </SidePanel>
      </ExamContainer>
      <ExitButton onClick={() => navigate(ROUTES.MAIN)}>Exit Test</ExitButton>
    </ExamWrapper>
  );
};

// Styled Components
const ExamWrapper = styled.div`
  min-height: 100vh;
  background: #fafafa;
  padding: 0 100px;
`;

const ExamContainer = styled.div`
  display: flex;
  gap: 24px;
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px;
  height: calc(100vh - 30px);
`;

const MainSection = styled.main`
  flex: 1;
  min-width: 0;
`;

const VideoArea = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const QuestionBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
`;

const QuestionText = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: #111;
  flex: 1;
`;

const AudioControls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const AudioButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f5f5f5;
  }
`;

const PlayCount = styled.span`
  font-size: 14px;
  color: #666;
`;

const Timer = styled.div<TimerProps>`
  font-size: 24px;
  font-weight: 600;
  color: ${(props) => (props.isRunning ? "#FF4444" : "#111")};
  font-variant-numeric: tabular-nums;
`;

const VideoFrame = styled.div`
  position: relative;
  flex: 1;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TranscriptOverlay = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  max-width: 80%;
  text-align: center;
`;

const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const QuestionProgress = styled.div`
  color: #666;
  font-size: 14px;
`;

const ControlButton = styled.button`
  background: #000;
  color: white;
  font-weight: 500;
  padding: 12px 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #222;
  }
`;

const ProgressDots = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const ProgressDot = styled.div<ProgressDotProps>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) =>
    props.isActive ? "#000" : props.isCompleted ? "#666" : "#ddd"};
  transition: all 0.2s;
`;

const RecordingDot = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff4444;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

const SidePanel = styled.aside`
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #111;
`;

const SurveyContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SurveyItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 13px;
  color: #666;
`;

const Value = styled.span`
  font-size: 14px;
  color: #111;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: #666;
`;

const ExitButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #000;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #222;
  }
`;

const ErrorMessage = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 68, 68, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
`;
