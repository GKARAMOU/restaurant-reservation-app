import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = ({ onRegisterSuccess }) => {
    // Κατάσταση για το όνομα, το email, τον κωδικό, τα σφάλματα και την επιτυχία
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Συνάρτηση για την επεξεργασία της φόρμας εγγραφής
    const handleRegister = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:3001/register', {
                name,
                email,
                password,
            });

            if (response.status === 201) {
                setSuccess('Η εγγραφή ήταν επιτυχής!');

                setTimeout(() => {
                    onRegisterSuccess();
                }, 1500);
            }
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setError('Το email χρησιμοποιείται ήδη.');
            } else {
                setError('Αποτυχία εγγραφής. Παρακαλώ δοκιμάστε ξανά.');
            }
        }
    };

    return (
        <form onSubmit={handleRegister} className="space-y-5">
            <div>
                <label className="block text-sm text-slate-300 mb-2">
                    Όνομα
                </label>

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                />
            </div>

            <div>
                <label className="block text-sm text-slate-300 mb-2">
                    Email
                </label>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                />
            </div>

            <div>
                <label className="block text-sm text-slate-300 mb-2">
                    Password
                </label>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                />
            </div>

            <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-cyan-400 text-slate-950 font-bold text-lg hover:bg-cyan-300 transition shadow-[0_0_25px_rgba(34,211,238,0.35)]"
            >
                Create Account
            </button>

            {error && (
                <p className="text-red-400 text-sm font-medium">
                    {error}
                </p>
            )}

            {success && (
                <p className="text-cyan-400 text-sm font-medium">
                    {success}
                </p>
            )}
        </form>
    );
};

export default RegisterForm;