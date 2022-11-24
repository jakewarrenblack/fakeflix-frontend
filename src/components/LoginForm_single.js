import { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmail = (e) => {
        console.log("Email changed", e.target.value);
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        console.log("Password changed", e.target.value);
        setPassword(e.target.value);
    };

    const submitForm = () => {
        console.log("Clicked");
    };

    return (
        <>
            Email: <input type="text" name="email" value={email} onChange={handleEmail} />
            <br />
            Password: <input type="password" name="password" value={password} onChange={handlePassword} />
            <button onClick={submitForm}>Submit</button>
        </>
    );
};

export default LoginForm;