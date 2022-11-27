import {BrowserRouter as Router, Routes, Route, Outlet} from 'react-router-dom';
import {AuthContext} from "./utils/AuthContext";

//import pages
import Home from './pages/Home';
import AllTitles from './pages/festivals/Index';
import SingleTitle from './pages/festivals/Show';
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
                    <Route path='titles' element={<AllTitles />} />
                    <Route path='titles/:id' element={<SingleTitle />} />
                </Route>
            </Routes>
        </Router>
        </AuthContext.Provider>
    );
};

export default App;