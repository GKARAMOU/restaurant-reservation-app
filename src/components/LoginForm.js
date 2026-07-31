import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ setToken, setUsername }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                'http://localhost:3001/login',
                {
                    email,
                    password
                }
            );

            const { token } = response.data;

            // GET USERNAME
            const userName =
                response.data.user?.name ||
                response.data.name ||
                email.split('@')[0];

            // SAVE TOKEN
            setToken(token);
            window.location.reload();
            // SAVE USERNAME
            setUsername(userName);

            // LOCAL STORAGE
            localStorage.setItem('token', token);
            localStorage.setItem('username', userName);

            // CLEAR ERROR
            setError('');

        } catch (err) {

            setError('Αποτυχία σύνδεσης. Ελέγξτε τα στοιχεία σας.');

        }

    };

    return (

        <form
            onSubmit={handleLogin}
            className="space-y-6"
        >

            {/* EMAIL */}
            <div>

                <label className="block text-sm text-slate-400 mb-3">
                    Email
                </label>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-900/80 border border-white/10 focus:border-cyan-400 focus:outline-none text-white placeholder:text-slate-500 transition duration-300"
                />

            </div>

            {/* PASSWORD */}
            <div>

                <label className="block text-sm text-slate-400 mb-3">
                    Password
                </label>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-900/80 border border-white/10 focus:border-cyan-400 focus:outline-none text-white placeholder:text-slate-500 transition duration-300"
                />

            </div>

            {/* BUTTON */}
            <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 hover:scale-[1.02] transition duration-300 shadow-[0_0_40px_rgba(34,211,238,0.25)]"
            >

                Sign In

            </button>

            {/* ERROR */}
            {error && (

                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">

                    {error}

                </div>

            )}

        </form>

    );
};

export default LoginForm;