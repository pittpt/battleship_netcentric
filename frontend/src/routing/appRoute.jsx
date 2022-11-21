import React from 'react';
import { Route, Routes } from 'react-router-dom';

import MainPage from "../pages/main";
import JoinPage from "../pages/join";
import WelcomePage from '../pages/welcome';
import AdminPage from '../pages/admin';

const AppRoute = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </>
  );
}

export default AppRoute;