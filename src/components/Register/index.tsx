import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register:React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({username, email, password});
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <div>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit">Submit</button>
            <p> Already have an account? <Link to="/login">Login here</Link></p>
        </form>
    );
}

export default Register;