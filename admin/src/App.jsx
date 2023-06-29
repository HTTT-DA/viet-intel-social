import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout/Layout';


function App() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}/>
                <Route path="/dashboard" element={<Layout />}/>
                <Route path="/profile" element={<Layout></Layout>}/>
                <Route path="/category" element={<Layout />}/>
                <Route path="/notification" element={<Layout />}/>
                <Route path="/content-censorship" element={<Layout />}/>
                <Route path="/message" element={<Layout />}/>
                <Route path="/import-export" element={<Layout />}/>
                <Route path="/api-configure" element={<Layout />}/>
            </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;