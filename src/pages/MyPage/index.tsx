// MyPage.tsx
import { useState } from "react";
import styled from "styled-components";
import { SurveyManage } from "./SurveyManage";
import { useNavigate } from "react-router-dom";
import { Header } from "@components/Header";

export const MyPage = () => {
  const [activeMenu, setActiveMenu] = useState("survey");
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeMenu) {
      case "survey":
        return <SurveyManage />;
      case "profile":
        return (
          <ComingSoonSection>
            <h2>프로필 설정</h2>
            <p>서비스 준비중입니다.</p>
          </ComingSoonSection>
        );
      case "account":
        return (
          <ComingSoonSection>
            <h2>계정 설정</h2>
            <p>서비스 준비중입니다.</p>
          </ComingSoonSection>
        );
      default:
        return <SurveyManage />;
    }
  };

  return (
    <>
      <Header />
      <PageContainer>
        {/* 사이드 네비게이션 */}
        <Sidebar>
          <SidebarHeader>My Page</SidebarHeader>
          <NavList>
            <NavItem
              isActive={activeMenu === "survey"}
              onClick={() => setActiveMenu("survey")}
            >
              <NavIcon>📋</NavIcon>내 설문 관리
            </NavItem>
            <NavItem
              isActive={activeMenu === "profile"}
              onClick={() => setActiveMenu("profile")}
            >
              <NavIcon>👤</NavIcon>
              프로필 설정
            </NavItem>
            <NavItem
              isActive={activeMenu === "account"}
              onClick={() => setActiveMenu("account")}
            >
              <NavIcon>⚙️</NavIcon>
              계정 설정
            </NavItem>
          </NavList>
        </Sidebar>

        {/* 메인 컨텐츠 */}
        <MainContent>{renderContent()}</MainContent>
      </PageContainer>
    </>
  );
};

// Styled Components
const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 60px;
`;

const Sidebar = styled.nav`
  width: 250px;
  background: white;
  border-right: 1px solid #eee;
  padding: 24px 0;
  flex-shrink: 0;
`;

const SidebarHeader = styled.h2`
  font-size: 20px;
  font-weight: 600;
  padding: 0 24px;
  margin-bottom: 24px;
  color: #111;
`;

const NavList = styled.div`
  display: flex;
  flex-direction: column;
`;

const NavItem = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  width: 100%;
  border: none;
  background: ${(props) => (props.isActive ? "#f5f5f5" : "transparent")};
  color: ${(props) => (props.isActive ? "#111" : "#666")};
  font-size: 15px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    color: #111;
  }
`;

const NavIcon = styled.span`
  font-size: 18px;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 24px;
  min-width: 0;
`;

const ComingSoonSection = styled.div`
  text-align: center;
  padding: 48px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #111;
  }

  p {
    color: #666;
    font-size: 16px;
  }
`;
