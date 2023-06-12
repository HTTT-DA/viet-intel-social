import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from "./pages/Home/Home";
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
function App() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout><Home /></Layout>}/>
                <Route path="/sign-in" element={<SignIn />}/>
                <Route path="/sign-up" element={<SignUp />}/>
            </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
