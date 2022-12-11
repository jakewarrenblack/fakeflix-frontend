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
import EditUser from "./pages/festivals/EditUser";
import AddAvatar from "./pages/festivals/AddAvatar";

const App = () => {
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const [results, setResults] = useState(null)

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
                <Navbar setResults={setResults} results={results}/>
                <Routes>
                    <Route path='*' element={<NotFound />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/" element={<ProtectedRoute />}>
                        <Route  path='movies' element={<All results={results} type={'movies'} />} />
                        <Route path='title/:id' element={<Single />} />

                        <Route  path='shows' element={<All results={results} type={'shows'} />} />
                        <Route path='title/:id' element={<Single />} />

                        <Route  path='all' element={<All results={results} />} />
                        <Route path='title/:id' element={<Single />} />

                        <Route path='my_list' element={<MyList />} />

                        <Route path='updateTitle/:id' element={<UpdateTitle />} />
                        <Route path='addTitle' element={<AddTitle />} />

                        <Route path='editUser/:id' element={<EditUser />} />

                        <Route path='addAvatar' element={<AddAvatar />} />

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