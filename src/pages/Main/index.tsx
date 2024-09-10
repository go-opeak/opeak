import styled from "styled-components";

export const Main = () => {
  return (
    <Wrapper>
      <div>Main Page</div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.colors.primary.dark};
`;
