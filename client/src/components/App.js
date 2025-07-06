import '../styles/App.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import React from 'react';

/** import components */
import Main from './Main';
import Quiz from './Quiz';
import Result from './Result';
import QuizList from './QuizList';
import { CheckUserExist } from '../helper/helper';


/** react routes */
const router = createBrowserRouter([
  {
    path : '/',
    element : <Main></Main>
  },
  {
    path : '/quiz',
    element : <CheckUserExist><Quiz /></CheckUserExist>
  },
  {
    path : '/result',
    element : <CheckUserExist><Result /></CheckUserExist>
  },
])

function App() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <RouterProvider router={router} />
      <QuizList />
    </div>
  );
}

export default App;