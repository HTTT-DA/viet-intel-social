import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from "./pages/Home/Home";
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Profile from './pages/Profile/Profile';
import OtherProfile from "./pages/OtherProfile/OtherProfile";
import {SearchQuestionProvider} from "./context/SearchQuestionContext";
function App() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SearchQuestionProvider><Layout><Home /></Layout></SearchQuestionProvider>}/>
                <Route path="/sign-in" element={<SignIn />}/>
                <Route path="/sign-up" element={<SignUp />}/>
                <Route path="/profile" element={<SearchQuestionProvider><Layout><Profile /></Layout></SearchQuestionProvider>}/>
                <Route path="/profile/:id" element={<SearchQuestionProvider><Layout><OtherProfile /></Layout></SearchQuestionProvider>}/>
            </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
