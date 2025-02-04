import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ROUTES } from "@constants/routes";
import { useAuth } from "@contexts/AuthContext";
import { Header } from "@components/Header";
import { useQuery } from "react-query";
import { fetchFeedbackHistory } from "@services/feedback";
import { FeedbackHistoryResponse } from "../../types/feedback";
import {} from "../../assets/image/banner.png";

export const Main = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const { data: feedbackHistory, isLoading } =
    useQuery<FeedbackHistoryResponse>("feedbackHistory", () =>
      fetchFeedbackHistory()
    );

  if (!auth) {
    return <div>Loading...</div>;
  }

  return (
    <Wrapper>
      <Header />
      {auth.isAuthenticated ? (
        <Container>
          <MainContent>
            <Section>
              <SectionTitle>
                <Icon>💻</Icon> OPIc 학습 관리
              </SectionTitle>
              <CardGrid>
                <FeatureBox>
                  <CardTitle>테스트 시작하기</CardTitle>
                  <TestForm>
                    <FormGroup>
                      <Label>언어</Label>
                      <Select defaultValue="영어">
                        <option>영어</option>
                      </Select>
                    </FormGroup>
                    <FormGroup>
                      <Label>난이도</Label>
                      <Select defaultValue="1">
                        <option>5-5</option>
                      </Select>
                    </FormGroup>
                    <Button onClick={() => navigate(ROUTES.EXAM)}>
                      테스트 시작하기
                    </Button>
                  </TestForm>
                </FeatureBox>

                <FeatureBox>
                  <CardTitle>나의 학습 기록</CardTitle>
                  <ReviewList>
                    {isLoading ? (
                      <LoadingText>불러오는 중...</LoadingText>
                    ) : feedbackHistory?.content.length === 0 ? (
                      <EmptyText>아직 테스트 기록이 없습니다.</EmptyText>
                    ) : (
                      feedbackHistory?.content.map((feedback) => (
                        <ReviewItem
                          key={feedback.feedbackId}
                          onClick={() =>
                            navigate(
                              `${ROUTES.FEEDBACK}/${feedback.feedbackId}`
                            )
                          }
                        >
                          <ReviewDate>
                            {new Date(
                              feedback.feedbackTime
                            ).toLocaleDateString()}
                          </ReviewDate>
                          <ReviewInfo>
                            <LevelBadge>{feedback.estimatedLevel}</LevelBadge>
                            <ScoreText>
                              {feedback.overallScore.toFixed(1)}점
                            </ScoreText>
                          </ReviewInfo>
                        </ReviewItem>
                      ))
                    )}
                  </ReviewList>
                </FeatureBox>
              </CardGrid>
            </Section>

            {/* <Section>
              <SectionTitle>
                <Icon>💡</Icon> 학습 리소스
              </SectionTitle>
              <ResourceGrid>
                <ResourceCard>
                  <ResourceIcon>📱</ResourceIcon>
                  <ResourceTitle>온라인 강의</ResourceTitle>
                  <ResourceDesc>언제 어디서나 학습하세요</ResourceDesc>
                </ResourceCard>
                <ResourceCard>
                  <ResourceIcon>📚</ResourceIcon>
                  <ResourceTitle>학습 자료</ResourceTitle>
                  <ResourceDesc>체계적인 커리큘럼</ResourceDesc>
                </ResourceCard>
                <ResourceCard>
                  <ResourceIcon>🎯</ResourceIcon>
                  <ResourceTitle>맞춤 피드백</ResourceTitle>
                  <ResourceDesc>상세한 분석과 조언</ResourceDesc>
                </ResourceCard>
                <ResourceCard>
                  <ResourceIcon>🤝</ResourceIcon>
                  <ResourceTitle>1:1 관리</ResourceTitle>
                  <ResourceDesc>개인별 학습 케어</ResourceDesc>
                </ResourceCard>
              </ResourceGrid>
            </Section> */}
          </MainContent>
        </Container>
      ) : (
        <LandingSection>
          <BannerContainer>
            <Banner
              src={require("../../assets/image/banner.png")}
              alt="welcome banner"
            />
            <StartButton onClick={() => navigate(ROUTES.LOGIN)}>
              시작하기
            </StartButton>
          </BannerContainer>
        </LandingSection>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  background: #fafafa;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #000;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #333;
  }
`;

const Container = styled.div`
  padding-top: 80px; // 헤더 높이만큼 여백
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Section = styled.section`
  margin-bottom: 40px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 100%;
`;

const TestForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Label = styled.label`
  min-width: 60px;
  font-size: 14px;
  color: #666;
`;

const Select = styled.select`
  flex: 1;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 6px;
  font-size: 14px;
  color: #333;

  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const StartButton = styled.button`
  font-weight: 500;
  cursor: pointer;
  transition: background color 0.4s;
  &:hover {
    background: white;
    color: black;
  }
  background: black;
  color: #f5f5f5;
  border: 1px solid white;
  position: relative;
  font-size: 15px;
  width: 100px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 200px;
  left: 100px;
  border-radius: 5px;
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
`;

const ResourceCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const LandingSection = styled.div`
  padding-top: 70px;
  width: 100%;
  height: 100vh;
  position: relative;
`;

const BannerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
const Banner = styled.img`
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Icon = styled.span`
  font-size: 28px;
`;

const ResourceIcon = styled.div`
  font-size: 32px;
  margin-bottom: 16px;
`;

const ResourceTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const ResourceDesc = styled.p`
  color: #666;
  font-size: 14px;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ReviewItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  &:hover {
    background-color: #f8f8f8;
  }

  &:last-child {
    border-bottom: none;
  }
`;
const LoadingText = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const ReviewDate = styled.div`
  font-size: 14px;
  color: #666;
`;

const ReviewInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
`;

const LevelBadge = styled.span`
  background-color: #4caf50;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
`;

const ScoreText = styled.span`
  color: #333;
  font-weight: 500;
`;

const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;
