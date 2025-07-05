
import '../styles/App.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
// Importing React components for different routes
import Main from './Main';
// Importing the Quiz component
import Quiz from './Quiz';
// Importing the Result component
import Result from './Result';


//** create router **/

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main></Main>,
  },
  {
    path: '/quiz',
    element: <Quiz></Quiz>,
  },
  {
    path: '/result',
    element: <Result></Result>,
  }
]);

function App() {
  return (
    <>
    <RouterProvider router={router} />
    </>
  );
}

export default App;
