import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from "./pages/Home/Home";
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Profile from './pages/Profile/Profile';
import UserProfile from "./pages/UserProfile/UserProfile";
function App() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout><Home /></Layout>}/>
                <Route path="/sign-in" element={<SignIn />}/>
                <Route path="/sign-up" element={<SignUp />}/>
                <Route path="/profile" element={<Layout><Profile /></Layout>}/>
                <Route path="/profile/:id" element={<Layout><UserProfile /></Layout>}/>
            </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
