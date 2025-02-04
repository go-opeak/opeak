import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchFeedbackDetail } from "@services/feedback";
import { FeedbackDetailResponse } from "../../types/feedback";
import { styled } from "styled-components";
import { Header } from "@components/Header";

export const FeedbackDetail = () => {
  const { feedbackId } = useParams();
  const { data: feedback, isLoading } = useQuery<FeedbackDetailResponse>(
    ["feedbackDetail", feedbackId],
    () => fetchFeedbackDetail(Number(feedbackId))
  );

  if (isLoading) return <LoadingState>로딩중...</LoadingState>;
  if (!feedback) return <ErrorState>피드백을 찾을 수 없습니다.</ErrorState>;

  return (
    <Wrapper>
      <Header />
      <Container>
        {/* 전체 평가 섹션 */}
        <OverallCard>
          <CardTitle>종합 평가</CardTitle>
          <ScoreSection>
            <ScoreBadge>
              <ScoreLabel>레벨</ScoreLabel>
              <ScoreValue>{feedback.estimatedLevel}</ScoreValue>
            </ScoreBadge>
            <ScoreBadge>
              <ScoreLabel>점수</ScoreLabel>
              <ScoreValue>{feedback.overallScore.toFixed(1)}</ScoreValue>
            </ScoreBadge>
          </ScoreSection>
          <FeedbackText>{feedback.overallFeedback}</FeedbackText>
        </OverallCard>

        {/* 질문별 피드백 섹션 */}
        <QuestionsGrid>
          {feedback.improvedScripts.map((script, index) => (
            <QuestionCard key={index}>
              <QuestionHeader>
                <QuestionNumber>{script.questionNumber}번 문제</QuestionNumber>
                <QuestionText>{script.question}</QuestionText>
              </QuestionHeader>

              {/* 평가 항목 스코어 */}
              <ScoreGrid>
                {Object.entries(script.scoreByCategory).map(
                  ([category, score]) => (
                    <ScoreBox key={category}>
                      <CategoryName>
                        {category === "pronunciation"
                          ? "발음"
                          : category === "taskCompletion"
                          ? "완결성"
                          : category === "grammar"
                          ? "문법"
                          : category === "wordChoice"
                          ? "어휘"
                          : category === "topicDevelopment"
                          ? "개연성"
                          : ""}
                      </CategoryName>
                      <CategoryScore>{score}/5</CategoryScore>
                    </ScoreBox>
                  )
                )}
              </ScoreGrid>

              {/* 스크립트 비교 */}
              <ScriptSection>
                <ScriptColumn>
                  <ColumnTitle>내 답변</ColumnTitle>
                  <ScriptBox original>{script.originalScript}</ScriptBox>
                </ScriptColumn>
                <ScriptColumn>
                  <ColumnTitle>개선된 답변</ColumnTitle>
                  <ScriptBox>{script.improvedScript}</ScriptBox>
                </ScriptColumn>
              </ScriptSection>

              {/* 개선점 */}
              <ImprovementSection>
                <SectionTitle>개선 포인트</SectionTitle>
                <PointsList>
                  {script.improvementPoints.map((point, i) => (
                    <PointItem key={i}>{point}</PointItem>
                  ))}
                </PointsList>
              </ImprovementSection>
            </QuestionCard>
          ))}
        </QuestionsGrid>
      </Container>
    </Wrapper>
  );
};

// Styled Components
const Wrapper = styled.div`
  background: #f8f9fa;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 24px 40px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 100px 0;
  font-size: 16px;
  color: #666;
`;

const ErrorState = styled(LoadingState)`
  color: #dc3545;
`;

const OverallCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const CardTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #111;
  margin-bottom: 24px;
`;

const ScoreSection = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const ScoreBadge = styled.div`
  background: #f8f9fa;
  padding: 16px 24px;
  border-radius: 12px;
  min-width: 120px;
  text-align: center;
`;

const ScoreLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const ScoreValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #111;
`;

const FeedbackText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #444;
`;

const QuestionsGrid = styled.div`
  display: grid;
  gap: 24px;
`;

const QuestionCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const QuestionHeader = styled.div`
  margin-bottom: 24px;
`;

const QuestionNumber = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
`;

const QuestionText = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111;
`;

const ScoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const ScoreBox = styled.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
`;

const CategoryName = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const CategoryScore = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #111;
`;

const ScriptSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ScriptColumn = styled.div``;

const ColumnTitle = styled.h4`
  font-size: 16px;
  font-weight: 500;
  color: #111;
  margin-bottom: 12px;
`;

const ScriptBox = styled.div<{ original?: boolean }>`
  background: ${(props) => (props.original ? "#f8f9fa" : "#f1f8ff")};
  padding: 20px;
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.6;
  color: #444;
  white-space: pre-wrap;
`;

const ImprovementSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 500;
  color: #111;
  margin-bottom: 16px;
`;

const PointsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PointItem = styled.li`
  position: relative;
  padding: 12px 0;
  padding-left: 24px;
  font-size: 15px;
  color: #444;
  line-height: 1.5;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  &:before {
    content: "•";
    position: absolute;
    left: 8px;
    color: #666;
  }
`;
