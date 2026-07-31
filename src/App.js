import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import RestaurantList from './components/RestaurantList';
import UserReservationsTable from './components/UserReservationsTable';

const App = () => {

    const [token, setToken] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [reservationSuccess, setReservationSuccess] = useState(false);
    const [username, setUsername] = useState('');

    const [activeSection, setActiveSection] = useState('restaurants');

    useEffect(() => {

        const savedToken = localStorage.getItem('token');
        const savedUsername = localStorage.getItem('username');

        if (savedToken) {

            setToken(savedToken);
            setUsername(savedUsername || 'Guest');
            setIsLoggedIn(true);

        }

    }, []);

    useEffect(() => {

        setIsLoggedIn(!!token);

    }, [token]);

    const handleLogout = () => {

        setToken('');
        setUsername('');
        setIsLoggedIn(false);

        localStorage.removeItem('token');
        localStorage.removeItem('username');

        setActiveSection('restaurants');

    };

    const toggleRegisterForm = () => {

        setShowRegister(!showRegister);

    };

    return (

        <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">

            {/* BACKGROUND GLOW */}
            <div className="fixed inset-0 -z-10">

                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[150px]" />

                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/20 blur-[150px]" />

            </div>

            {/* NAVBAR */}
            <nav className="flex items-center justify-between px-6 md:px-16 py-6 border-b border-white/10 backdrop-blur-xl bg-slate-950/70 sticky top-0 z-50">

                <h1 className="text-3xl font-black text-cyan-400">
                    Restaurants.
                </h1>

                {isLoggedIn && (

                    <nav className="flex items-center gap-10 text-slate-400 font-medium">

                        <button
                            onClick={() => setActiveSection('reservations')}
                            className={`hover:text-cyan-400 transition ${
                                activeSection === 'reservations'
                                    ? 'text-cyan-400'
                                    : ''
                            }`}
                        >
                            Reservations
                        </button>

                        <button
                            onClick={() => setActiveSection('restaurants')}
                            className={`hover:text-cyan-400 transition ${
                                activeSection === 'restaurants'
                                    ? 'text-cyan-400'
                                    : ''
                            }`}
                        >
                            Restaurants
                        </button>

                        <button
                            onClick={() => setActiveSection('dashboard')}
                            className={`hover:text-cyan-400 transition ${
                                activeSection === 'dashboard'
                                    ? 'text-cyan-400'
                                    : ''
                            }`}
                        >
                            Dashboard
                        </button>

                    </nav>

                )}

            </nav>

            {/* MAIN */}
            <div className="max-w-6xl mx-auto px-6 py-20">

                {/* HERO */}
                {!isLoggedIn && (

                    <div className="mb-20">

                        <p className="text-cyan-400 tracking-[0.3em] text-sm mb-6">
                            MODERN RESERVATION PLATFORM
                        </p>

                        <h1 className="text-5xl md:text-7xl font-black leading-tight">
                            Reserve your
                            <br />
                            favorite restaurant.
                        </h1>

                        <p className="mt-8 text-slate-400 text-lg max-w-2xl">
                            Full stack restaurant reservation application with authentication,
                            reservation management and real-time user interaction.
                        </p>

                    </div>

                )}

                {/* MAIN CARD */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">

                    {!isLoggedIn ? (

                        <>
                            <div className="mb-10">

                                <h2 className="text-3xl font-bold">

                                    {showRegister
                                        ? 'Create Account'
                                        : 'Welcome Back'}

                                </h2>

                                <p className="text-slate-400 mt-3">

                                    {showRegister
                                        ? 'Register to start reserving tables.'
                                        : 'Login to manage your reservations.'}

                                </p>

                            </div>

                            {showRegister ? (

                                <RegisterForm
                                    onRegisterSuccess={() => setShowRegister(false)}
                                />

                            ) : (

                                <LoginForm
                                    setToken={setToken}
                                    setUsername={setUsername}
                                />

                            )}

                            <button
                                className="mt-8 text-cyan-400 hover:text-cyan-300 transition"
                                onClick={toggleRegisterForm}
                            >

                                {showRegister
                                    ? 'Already have an account? Login'
                                    : "Don't have an account? Register"}

                            </button>

                        </>

                    ) : (

                        <>

                            {/* HEADER */}
                            <div className="flex items-center justify-between flex-wrap gap-6 mb-12">

                                <div>

                                    <h2 className="text-5xl font-black text-white">
                                        Welcome back 👋
                                    </h2>

                                    <p className="text-slate-400 mt-3 text-lg">
                                        Manage your reservations and discover premium restaurants.
                                    </p>

                                </div>

                                <div className="flex items-center gap-4">

                                    {/* PROFILE */}
                                    <div className="flex items-center gap-4 bg-slate-900/80 border border-cyan-400/20 rounded-3xl px-5 py-4 backdrop-blur-xl shadow-lg">

                                        {/* AVATAR */}
                                        <div className="relative">

                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-cyan-500/30">

                                                {username?.charAt(0).toUpperCase()}

                                            </div>

                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-slate-950" />

                                        </div>

                                        <div>

                                            <p className="text-white font-bold text-lg">
                                                {username}
                                            </p>

                                            <p className="text-cyan-400 text-sm">
                                                Premium Member
                                            </p>

                                        </div>

                                    </div>

                                    {/* LOGOUT */}
                                    <button
                                        onClick={handleLogout}
                                        className="px-6 py-4 rounded-2xl bg-red-500 hover:bg-red-400 transition duration-300 font-semibold"
                                    >
                                        Logout
                                    </button>

                                </div>

                            </div>

                            {/* SUCCESS MODAL */}
                            {reservationSuccess ? (

<div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-start justify-center z-50 pt-20 px-6">                                            <div className="w-full max-w-lg rounded-[32px] border border-cyan-400/10 bg-[#060816]/95 p-8 text-center shadow-[0_0_60px_rgba(34,211,238,0.12)]">

                                        {/* ICON */}
                                        <div className="w-20 h-20 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-5xl mx-auto mb-6">

                                            ✅

                                        </div>

                                        {/* TITLE */}
                                        <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
                                            Reservation Confirmed
                                        </h2>

                                        {/* DESCRIPTION */}
                                        <p className="text-slate-400 text-sm mb-8">
                                            Your premium reservation has been successfully completed.
                                        </p>

                                        {/* DETAILS */}
                                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 mb-8 text-left space-y-4">

                                            {/* STATUS */}
                                            <div className="flex justify-between items-center">

                                                <span className="text-slate-500">
                                                    Status
                                                </span>

                                                <span className="text-cyan-400 font-bold">
                                                    Confirmed
                                                </span>

                                            </div>

                                            {/* RESERVATION */}
                                            <div className="flex justify-between items-center">

                                                <span className="text-slate-500">
                                                    Reservation
                                                </span>

                                                <span className="text-white font-semibold">
                                                    Premium Dinner Reservation
                                                </span>

                                            </div>

                                            {/* MEMBER */}
                                            <div className="flex justify-between items-center">

                                                <span className="text-slate-500">
                                                    Member
                                                </span>

                                                <span className="text-white font-semibold">
                                                    {username}
                                                </span>

                                            </div>

                                        </div>

                                        {/* BUTTONS */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                                            {/* VIEW */}
                                            <button
                                                onClick={() => {
                                                    setReservationSuccess(false);
                                                    setActiveSection('reservations');
                                                }}
                                                className="py-4 rounded-2xl bg-cyan-400 text-slate-950 font-black hover:bg-cyan-300 transition"
                                            >

                                                View Reservations

                                            </button>

                                            {/* AGAIN */}
                                            <button
                                                onClick={() => setReservationSuccess(false)}
                                                className="py-4 rounded-2xl bg-white/10 text-white font-black hover:bg-white/20 transition"
                                            >

                                                Reserve Again

                                            </button>

                                            {/* LOGOUT */}
                                            <button
                                                onClick={handleLogout}
                                                className="py-4 rounded-2xl bg-red-500 text-white font-black hover:bg-red-400 transition"
                                            >

                                                Logout

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ) : (

                                <>

                                    {/* RESTAURANTS */}
                                    {activeSection === 'restaurants' && (

                                        <RestaurantList
                                            token={token}
                                            onReservationSuccess={() => setReservationSuccess(true)}
                                        />

                                    )}

                                    {/* RESERVATIONS */}
                                    {activeSection === 'reservations' && (

                                        <div className="mt-16">

                                            <UserReservationsTable token={token} />

                                        </div>

                                    )}

                                    {/* DASHBOARD */}
                                    {activeSection === 'dashboard' && (

                                        <div className="mt-10">

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

                                                    <p className="text-slate-400 mb-2">
                                                        Total Reservations
                                                    </p>

                                                    <h2 className="text-5xl font-black text-cyan-400">
                                                        24
                                                    </h2>

                                                </div>

                                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

                                                    <p className="text-slate-400 mb-2">
                                                        Favorite Restaurant
                                                    </p>

                                                    <h2 className="text-3xl font-bold">
                                                        La Piazza
                                                    </h2>

                                                </div>

                                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

                                                    <p className="text-slate-400 mb-2">
                                                        Account Status
                                                    </p>

                                                    <h2 className="text-3xl font-bold text-green-400">
                                                        Active
                                                    </h2>

                                                </div>

                                            </div>

                                        </div>

                                    )}

                                </>

                            )}

                        </>

                    )}

                </div>

            </div>

        </div>

    );
};

export default App;