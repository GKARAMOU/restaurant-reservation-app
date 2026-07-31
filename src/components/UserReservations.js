// Συνιστώσα React που ανακτά και εμφανίζει τις κρατήσεις του συνδεδεμένου χρήστη
import axios from 'axios';
import { useEffect, useState } from 'react';

function UserReservations() {
  const [reservations, setReservations] = useState([]);

  // Κατά την αρχική φόρτωση, γίνεται αίτημα στο backend για τις κρατήσεις του χρήστη
  useEffect(() => {
    const token = localStorage.getItem('token');

    // Στέλνεται GET αίτημα με το JWT token στον header
    axios.get('http://localhost:3001/reservations/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      setReservations(response.data);
    })
    .catch(error => {
      console.error('Σφάλμα κατά την ανάκτηση κρατήσεων:', error);
    });
  }, []);

  // Επιστρέφεται λίστα κρατήσεων με βασικές πληροφορίες (ημερομηνία, ώρα, άτομα)
  return (
    <div>
      <h2>Οι κρατήσεις μου</h2>
      <ul>
        {reservations.map(res => (
          <li key={res.reservation_id}>
            {res.date} - {res.time} - {res.people_count} άτομα
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserReservations;
