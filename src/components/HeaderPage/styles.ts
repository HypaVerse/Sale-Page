import styled from 'styled-components';

export const Container = styled.div``;

export const LabelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  span {
    font-size: 1.6rem;
    color: ${props => props.theme.darkest};
    padding: 0.3rem;
    font-weight: 500;
    user-select: none;
  }
`;

export const IconContainer = styled.div`
  opacity: 0.7;
  margin-top: 0.2rem;
  cursor: pointer;
`;

export const Line = styled.div`
  width: 100%;
  height: 0.05rem;
  background-color: ${props => props.theme.darkest};
  margin-top: 1rem;
  opacity: 0.8;
  border-radius: 1rem;
`;
