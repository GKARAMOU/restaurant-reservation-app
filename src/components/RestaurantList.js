import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReservationForm from './ReservationForm';
import { Filter } from 'lucide-react';

const RestaurantList = ({ token, onReservationSuccess }) => {

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const [locations, setLocations] = useState([]);
  const [cuisines, setCuisines] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');

  const [showFilters, setShowFilters] = useState(false);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {

    const fetchRestaurants = async () => {

      try {

        const response = await axios.get(
          'http://localhost:3001/restaurants',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const allRestaurants = response.data.restaurants;

        setRestaurants(allRestaurants);

        const uniqueLocations = [
          ...new Set(allRestaurants.map(r => r.location))
        ];

        const uniqueCuisines = [
          ...new Set(allRestaurants.map(r => r.description))
        ];

        setLocations(uniqueLocations);
        setCuisines(uniqueCuisines);

      } catch (err) {

        console.error('Failed to fetch restaurants:', err);

      }

    };

    fetchRestaurants();

  }, [token]);

  const filteredRestaurants = restaurants.filter(r => {

    const matchLocation = selectedLocation
      ? r.location === selectedLocation
      : true;

    const matchCuisine = selectedCuisine
      ? r.description === selectedCuisine
      : true;

    const matchName = searchName
      ? r.name.toLowerCase().includes(searchName.toLowerCase())
      : true;

    return matchLocation && matchCuisine && matchName;

  });

  return (

    <div className="mt-10">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-4xl font-black text-white">
            Restaurants
          </h2>

          <p className="text-slate-400 mt-2">
            Discover and reserve amazing places.
          </p>

        </div>

        <button
          onClick={() => setShowFilters(prev => !prev)}
          className="p-4 rounded-2xl border border-white/10 bg-slate-900/60 hover:border-cyan-400 transition duration-300"
        >

          <Filter className="text-cyan-400" size={22} />

        </button>

      </div>

      {/* FILTERS */}
      {showFilters && (

        <div className="grid md:grid-cols-3 gap-4 mb-10">

          <select
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
            className="bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-4 text-white"
          >

            <option value="">All Locations</option>

            {locations.map(loc => (

              <option key={loc} value={loc}>
                {loc}
              </option>

            ))}

          </select>

          <select
            value={selectedCuisine}
            onChange={e => setSelectedCuisine(e.target.value)}
            className="bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-4 text-white"
          >

            <option value="">All Categories</option>

            {cuisines.map(c => (

              <option key={c} value={c}>
                {c}
              </option>

            ))}

          </select>

          <input
            type="text"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            placeholder="Search restaurant..."
            className="bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-slate-500"
          />

        </div>

      )}

      {/* EMPTY STATE */}
      {filteredRestaurants.length === 0 ? (

        <div className="p-8 rounded-3xl border border-red-500/20 bg-red-500/10 text-red-300">

          No restaurants found.

        </div>

      ) : (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredRestaurants.map((restaurant) => (

            <motion.div
              key={restaurant.restaurant_id}

              initial={{
                opacity: 0,
                scale: 0.7,
                rotate: -4,
                y: 80
              }}

              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
                y: 0
              }}

              whileHover={{
                scale: 1.04,
                y: -10,
                rotate: 1
              }}

              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 12,
                delay: restaurant.restaurant_id * 0.08
              }}

              onClick={() => {

                setSelectedRestaurant(restaurant);

                setTimeout(() => {

                  const form = document.getElementById('reservation-form');

                  if (form) {

                    form.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });

                  }

                }, 150);

              }}

              className={`group cursor-pointer rounded-3xl border p-6 transition duration-300 backdrop-blur-xl ${
                selectedRestaurant?.restaurant_id === restaurant.restaurant_id
                  ? 'border-cyan-400 bg-cyan-400/10'
                  : 'border-white/10 bg-slate-900/60 hover:border-cyan-400/50'
              }`}
            >

              {/* RESTAURANT IMAGE */}
              <div className="relative overflow-hidden h-44 rounded-2xl mb-5">

                <motion.img
                  whileHover={{ scale: 1.12 }}
                  transition={{ duration: 0.6 }}

                  src={
                    restaurant.image ||

                    (
                      restaurant.name.toLowerCase().includes('pizza') ||
                      restaurant.name.toLowerCase().includes('piazza')

                        ? 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1400&auto=format&fit=crop'

                      : restaurant.name.toLowerCase().includes('sushi')

                        ? 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1400&auto=format&fit=crop'

                      : restaurant.name.toLowerCase().includes('burger')

                        ? 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1400&auto=format&fit=crop'

                      : restaurant.name.toLowerCase().includes('tacos')

                        ? 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=1400&auto=format&fit=crop'

                      : restaurant.name.toLowerCase().includes('νησί') ||
                        restaurant.name.toLowerCase().includes('sea')

                        ? 'https://images.unsplash.com/photo-1579631542720-3a87824fff86?q=80&w=1400&auto=format&fit=crop'

                      : restaurant.name.toLowerCase().includes('παράδεισος')

                        ? 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1400&auto=format&fit=crop'

                      : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1400&auto=format&fit=crop'
                    )
                  }

                  alt={restaurant.name}

                  className="w-full h-full object-cover"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* GLOW */}
                <motion.div
                  animate={{
                    opacity: [0.2, 0.4, 0.2]
                  }}

                  transition={{
                    duration: 4,
                    repeat: Infinity
                  }}

                  className="absolute inset-0 bg-cyan-400/10"
                />

              </div>

              {/* TOP */}
              <div className="flex items-center justify-between mb-3">

                <h3 className="text-2xl font-bold text-white">
                  {restaurant.name}
                </h3>

                <motion.span
                  whileHover={{ scale: 1.3 }}
                  className="text-cyan-400 text-sm"
                >
                  ★ 4.8
                </motion.span>

              </div>

              {/* DESCRIPTION */}
              <p className="text-slate-400 mb-5">
                {restaurant.description || 'Modern dining experience'}
              </p>

              {/* FOOTER */}
              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-500">
                  📍 {restaurant.location || 'Athens'}
                </span>

                <motion.button
                  whileTap={{ scale: 0.9 }}

                  whileHover={{
                    scale: 1.08,
                    boxShadow: '0px 0px 25px rgba(34,211,238,0.5)'
                  }}

                  onClick={(e) => {

                    e.stopPropagation();

                    setSelectedRestaurant(restaurant);

                    setTimeout(() => {

                      const form = document.getElementById('reservation-form');

                      if (form) {

                        form.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        });

                      }

                    }, 150);

                  }}

                  className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition"
                >

                  Reserve

                </motion.button>

              </div>

            </motion.div>

          ))}

        </div>

      )}

      {/* RESERVATION FORM */}
      {selectedRestaurant && (

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12"
        >

          <ReservationForm
            token={token}
            selectedRestaurant={selectedRestaurant}
            onReservationSuccess={onReservationSuccess}
          />

        </motion.div>

      )}

    </div>

  );
};

export default RestaurantList;