import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

//import pages
import Home from './pages/Home';
import AllTitles from './pages/festivals/Index';
import SingleTitle from './pages/festivals/Show';

//import components
import Navbar from './components/Navbar';

const App = () => {
    const [authenticated, setAuthenticated] = useState(false);

    const onAuthenticated = (auth) => {
        setAuthenticated(auth);
    };

    return (
        <Router>
            <Navbar authenticated={authenticated}/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/titles" element={<AllTitles />} />
                <Route path="/titles/:id" element={<SingleTitle />} />
            </Routes>
        </Router>
    );
};

export default App;