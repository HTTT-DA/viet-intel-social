import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Index from './layout';
import Home from "./pages/Home";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import OtherProfile from "./pages/OtherProfile";
import {SearchQuestionProvider} from "./context/SearchQuestionContext";
import NotFound from "./pages/NotFound";
function App() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SearchQuestionProvider><Index><Home /></Index></SearchQuestionProvider>}/>
                <Route path="/sign-in" element={<SignIn />}/>
                <Route path="/sign-up" element={<SignUp />}/>
                <Route path="/profile" element={<SearchQuestionProvider><Index><Profile /></Index></SearchQuestionProvider>}/>
                <Route path="/profile/:id" element={<SearchQuestionProvider><Index><OtherProfile /></Index></SearchQuestionProvider>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
