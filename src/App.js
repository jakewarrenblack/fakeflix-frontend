import {BrowserRouter as Router, Routes, Route, Outlet} from 'react-router-dom';
import {AuthContext} from "./utils/AuthContext";
import './index.css'

//import pages
import Home from './pages/Home';
import All from './pages/festivals/All';
import Single from './pages/festivals/Single';
import MyList from "./pages/festivals/MyList";
import {NotFound} from "./pages/NotFound";
import WhosWatching from "./pages/WhosWatching";

//import components
import Navbar from './components/Navbar';
import {useState} from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdateTitle from "./pages/festivals/UpdateTitle";
import AddTitle from "./pages/festivals/AddTitle";

const App = () => {
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    return (
        <div>
        <AuthContext.Provider value={{
            loading,
            setLoading,

            token,
            setToken,

            user,
            setUser,
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

                        <Route path='my_list' element={<MyList />} />

                        <Route path='updateTitle/:id' element={<UpdateTitle />} />
                        <Route path='addTitle' element={<AddTitle />} />

                        {/* Pass admin ID to fetch the admin and all their sub-users, to select an account from */}
                        {/* Like on netflix, multiple profiles but one admin */}
                        <Route path='selectProfile' element={<WhosWatching />} />
                    </Route>
                </Routes>
            </Router>
        </AuthContext.Provider>
        </div>
    );
};

export default App;