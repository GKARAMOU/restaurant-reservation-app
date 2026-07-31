import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserReservationsTable = ({ token }) => {
    // Κατάσταση για τις κρατήσεις, τη φόρτωση, τα σφάλματα και την εμφάνιση των κρατήσεων
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showReservations, setShowReservations] = useState(false);
    const [editingReservation, setEditingReservation] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [newPeopleCount, setNewPeopleCount] = useState('');

    // Fetch κρατήσεων όταν φορτώνει το component ή όταν αλλάζει το token
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const res = await axios.get('http://localhost:3001/reservations/user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setReservations(res.data);
            } catch (err) {
                console.error('Σφάλμα στην ανάκτηση των κρατήσεων:', err);
                setError('Αποτυχία ανάκτησης δεδομένων');
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [token]); // Επανεκτέλεση όταν αλλάζει το token

    // Toggle για την εμφάνιση ή απόκρυψη των κρατήσεων
    const toggleReservations = () => {
        setShowReservations(!showReservations);
    };

    // Διαγραφή μιας κράτησης
    const handleDelete = async (reservationId) => {
        const numericReservationId = Number(reservationId);
        console.log("Διαγραφή κράτησης με ID:", numericReservationId);
        console.log("DELETE URL:", `http://localhost:3001/reservations/${numericReservationId}`);
        try {
            await axios.delete(`http://localhost:3001/reservations/${numericReservationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setReservations(reservations.filter(res => res.reservation_id !== numericReservationId));
            alert('Η κράτηση διαγράφηκε επιτυχώς!');
        } catch (err) {
            console.error('Σφάλμα στη διαγραφή της κράτησης:', err);
            alert('Σφάλμα κατά τη διαγραφή της κράτησης.');
        }
    };

    // Επεξεργασία μιας κράτησης
    const handleEdit = (reservationId) => {
        const reservation = reservations.find(res => res.reservation_id === reservationId);
        console.log("Επεξεργασία κράτησης:", reservation);
        setEditingReservation(reservationId);
        setNewDate(
            reservation.date
                ? new Date(reservation.date).toISOString().split('T')[0]
                : ''
        );
        setNewTime(reservation.time);
        setNewPeopleCount(reservation.people_count);
    };

    // Αποθήκευση της επεξεργασμένης κράτησης στη βάση δεδομένων
    const handleSaveEdit = async () => {
        try {
            const updatedReservation = {
                date: newDate,
                time: newTime,
                people_count: parseInt(newPeopleCount)
            };

            console.log("Αποστολή προς ενημέρωση:", updatedReservation);

            const numericEditingReservation = Number(editingReservation);
            console.log("PUT URL:", `http://localhost:3001/reservations/${numericEditingReservation}`);

            await axios.put(`http://localhost:3001/reservations/${numericEditingReservation}`, updatedReservation, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setReservations(reservations.map(res =>
                res.reservation_id === numericEditingReservation
                    ? { ...res, ...updatedReservation }
                    : res
            ));
            setEditingReservation(null);
            alert('Η κράτηση ενημερώθηκε επιτυχώς!');
        } catch (err) {
            console.error('Σφάλμα στην ενημέρωση της κράτησης:', err);
            alert('Σφάλμα κατά την ενημέρωση της κράτησης.');
        }
    };

    if (loading) return <p>Φόρτωση κρατήσεων...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h3 className="text-4xl font-black text-white mb-4">Οι Κρατήσεις μου</h3>
            <button
                onClick={toggleReservations}
                className="px-6 py-3 rounded-2xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 transition-all duration-300"
            >
                {showReservations ? 'Απόκρυψη Κρατήσεων' : 'Εμφάνιση Κρατήσεων'}
            </button>

            {showReservations && (
                <div>
                    {reservations.length === 0 ? (
                        <p>Δεν υπάρχουν κρατήσεις</p>
                    ) : (
                        <div className="mt-6 overflow-x-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                            <table className="w-full text-left text-white">
                                <thead className="border-b border-white/10 bg-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-cyan-300">
                                            Restaurant
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-cyan-300">
                                            Date
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-cyan-300">
                                            Time
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-cyan-300">
                                            People
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-cyan-300">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {reservations.map((res) => (
                                        <tr
                                            key={res.reservation_id}
                                            className="border-b border-white/5 hover:bg-white/5 transition"
                                        >
                                            <td className="px-6 py-5 font-medium">
                                                {res.restaurant_name || 'Unknown'}
                                            </td>

                                            <td className="px-6 py-5 text-slate-300">
                                                {new Date(res.date).toLocaleDateString()}
                                            </td>

                                            <td className="px-6 py-5 text-slate-300">
                                                {res.time}
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="rounded-full bg-cyan-400/10 px-4 py-1 text-cyan-300 border border-cyan-400/20">
                                                    {res.people_count} άτομα
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleEdit(res.reservation_id)}
                                                        className="rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-300 transition"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(res.reservation_id)}
                                                        className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-400 transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {editingReservation && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
                            <div className="bg-slate-950 border border-white/10 rounded-3xl p-8 flex flex-col gap-4 w-full max-w-md shadow-2xl">
                                <h4 className="text-2xl font-bold text-white mb-2">Edit Reservation</h4>
                                <input
                                    type="date"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white [color-scheme:dark]"
                                />
                                <input
                                    type="time"
                                    value={newTime}
                                    onChange={(e) => setNewTime(e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white [color-scheme:dark]"
                                />
                                <input
                                    type="number"
                                    value={newPeopleCount}
                                    onChange={(e) => setNewPeopleCount(e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white"
                                />
                                <div className="flex gap-4 mt-4">
                                    <button
                                        onClick={handleSaveEdit}
                                        className="flex-1 py-3 rounded-2xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 transition"
                                    >
                                        Save
                                    </button>

                                    <button
                                        onClick={() => setEditingReservation(null)}
                                        className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-400 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserReservationsTable;
