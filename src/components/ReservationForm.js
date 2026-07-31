import React, { useState } from 'react';
import axios from 'axios';

const ReservationForm = ({
  token,
  selectedRestaurant,
  onReservationSuccess
}) => {

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [error, setError] = useState('');

  const handleReservation = async (e) => {

    e.preventDefault();

    if (!date || !time || !peopleCount) {
      setError('Παρακαλώ συμπληρώστε όλα τα πεδία.');
      return;
    }

    try {

      await axios.post(
        'http://localhost:3001/reservations',
        {
          restaurant_id: selectedRestaurant.restaurant_id,
          date,
          time,
          people_count: peopleCount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onReservationSuccess();

    } catch (err) {

      setError('Αποτυχία στην κράτηση. Προσπαθήστε ξανά.');

    }
  };

  return (

    <div
      id="reservation-form"
      className="mt-12 rounded-[32px] border border-cyan-400/20 bg-slate-950/70 backdrop-blur-2xl p-8 shadow-[0_0_60px_rgba(34,211,238,0.08)]"
    >

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-4xl font-black text-white">
            Reserve Table
          </h2>

          <p className="text-slate-400 mt-2">
            Complete your reservation for{' '}

            <span className="text-cyan-400 font-semibold">
              {selectedRestaurant?.name}
            </span>

          </p>

        </div>

        <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/20">

          🍽️

        </div>

      </div>

      {/* FORM */}
      <form
        onSubmit={handleReservation}
        className="grid md:grid-cols-3 gap-6"
      >

        {/* DATE */}
        <div className="flex flex-col">

          <label className="text-sm text-slate-400 mb-2">
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full rounded-2xl bg-slate-900/80 border border-white/10 px-5 py-4 text-white outline-none focus:border-cyan-400 transition [color-scheme:dark]"
          />

        </div>

        {/* TIME */}
        <div className="flex flex-col">

          <label className="text-sm text-slate-400 mb-2">
            Time
          </label>

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="w-full rounded-2xl bg-slate-900/80 border border-white/10 px-5 py-4 text-white outline-none focus:border-cyan-400 transition [color-scheme:dark]"
          />

        </div>

        {/* PEOPLE */}
        <div className="flex flex-col">

          <label className="text-sm text-slate-400 mb-2">
            Guests
          </label>

          <input
            type="number"
            value={peopleCount}
            onChange={(e) => setPeopleCount(e.target.value)}
            min="1"
            required
            placeholder="Enter number of guests"
            className="w-full rounded-2xl bg-slate-900/80 border border-white/10 px-5 py-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 transition"
          />

        </div>

        {/* ERROR */}
        {error && (

          <div className="md:col-span-3 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-4 rounded-2xl">

            {error}

          </div>

        )}

        {/* BUTTON */}
        <div className="md:col-span-3 mt-4">

          <button
            type="submit"
            className="w-full py-5 rounded-2xl bg-cyan-400 text-slate-950 text-lg font-black hover:bg-cyan-300 transition duration-300 hover:scale-[1.01] shadow-[0_0_30px_rgba(34,211,238,0.35)]"
          >

            Confirm Reservation

          </button>

        </div>

      </form>

    </div>

  );
};

export default ReservationForm;