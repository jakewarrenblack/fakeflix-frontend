import {BrowserRouter as Router, Routes, Route, Outlet} from 'react-router-dom';
import {AuthContext} from "./utils/AuthContext";

//import pages
import Home from './pages/Home';
import All from './pages/festivals/All';
import Single from './pages/festivals/Single';
import './index.css'

//import components
import Navbar from './components/Navbar';
import {useEffect, useState} from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import {NotFound} from "./pages/NotFound";

const App = () => {
    const [token, setToken] = useState(null)

    return (
        <AuthContext.Provider value={{
            token,
            setToken
        }}>
        <Router>
            <Navbar/>
            <Routes>
                <Route path='*' element={<NotFound />} />
                <Route path="/" element={<Home />} />
                <Route path="/" element={<ProtectedRoute />}>
                    <Route path='movies' element={<All type={'movies'} />} />
                    <Route path='title/:id' element={<Single />} />

                    <Route path='shows' element={<All type={'shows'} />} />
                    <Route path='title/:id' element={<Single />} />

                    <Route path='all' element={<All />} />
                    <Route path='title/:id' element={<Single />} />
                </Route>
            </Routes>
        </Router>
        </AuthContext.Provider>
    );
};

export default App;