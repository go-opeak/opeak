import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ROUTES } from "@constants/routes";
import { useAuth } from "@contexts/AuthContext";
import { ReactComponent as Logo } from "@assets/svg/logo.svg";

export const Header = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  if (!auth) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      auth.logout();
      navigate(ROUTES.MAIN);
    }
  };

  return (
    <Wrapper>
      <LogoWrapper onClick={() => navigate(ROUTES.MAIN)}>
        <Logo />
      </LogoWrapper>
      <Nav>
        {auth.isAuthenticated && (
          <>
            <Button onClick={handleLogout}>Logout</Button>
            <Button onClick={() => navigate(ROUTES.MY_PAGE)}>My Page</Button>
          </>
        )}
      </Nav>
      <MenuButton>☰</MenuButton>
    </Wrapper>
  );
};

// 스타일 정의
const Wrapper = styled.header`
  position: fixed;
  width: 100vw;
  z-index: 99;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  height: 70px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const LogoWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;

  svg {
    height: 40px;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    display: none; // 모바일 화면에서는 숨김
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background-color: black;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3e3e3e;
  }
`;

const MenuButton = styled.button`
  display: none; // 기본적으로 숨김
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block; // 모바일 화면에서만 표시
  }
`;
