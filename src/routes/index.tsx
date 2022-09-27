import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ITOList from 'pages/ITOList';
import Header from 'components/Header';

interface IGenericPage {
  children: any;
}

const Page: React.FC<IGenericPage> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Page>
              <ITOList />
            </Page>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
