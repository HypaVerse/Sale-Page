import { Container, Line, LabelHeader, IconContainer } from './styles';
import { IoRefreshSharp } from 'react-icons/io5';

interface IHeaderPage {
  children: React.ReactNode;
  refresh?: () => void;
}

const HeaderPage: React.FC<IHeaderPage> = ({ children, refresh }) => {
  return (
    <Container>
      <LabelHeader>
        <span>{children}</span>
        {refresh && (
          <IconContainer onClick={() => refresh()}>
            <IoRefreshSharp color="rgb(11, 11, 30)" size={20} />
          </IconContainer>
        )}
      </LabelHeader>
      <Line />
    </Container>
  );
};

export default HeaderPage;
