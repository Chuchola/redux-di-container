import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import DogsPage from './pages/DogsPage/DogsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DogsPage />,
  },
]);

export default router;
