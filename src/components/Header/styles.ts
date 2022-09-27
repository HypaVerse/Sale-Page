import styled from 'styled-components';

export const Container = styled.div`
  padding: 1rem 2rem;
  background-color: ${props => props.theme.header.background};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;

  height: 4rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const AddressContainer = styled.div`
  cursor: pointer;
  background-color: ${props => props.theme.address.background};
  min-width: 10rem;
  display: flex;
  text-align: center;
  padding: 0.5rem 1.8rem;
  border-radius: 0.4rem;
  color: white;
  font-size: 0.9rem;
`;
