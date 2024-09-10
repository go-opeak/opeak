import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 16px; // 기본 폰트 사이즈 설정
  }

  body {
    overflow-x: hidden;
    touch-action: manipulation;
    -webkit-overflow-scrolling: touch;
    -webkit-tap-highlight-color: transparent; // 탭 시 하이라이트 제거
  }

  #root {
    height: 100%;
    background-color: #fff;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  input, button {
    font-family: inherit;
    font-size: inherit;
  }

  // 모바일에서 선택 방지
  * {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  // 입력 필드는 선택 가능하게
  input, textarea {
    -webkit-user-select: auto;
    -khtml-user-select: auto;
    -moz-user-select: auto;
    -ms-user-select: auto;
    user-select: auto;
  }
`;

export default GlobalStyle;
