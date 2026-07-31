// Κεντρικό αρχείο backend server της εφαρμογής κράτησης τραπεζιών
// Περιλαμβάνει endpoints για εγγραφή, σύνδεση, διαχείριση κρατήσεων και εστιατορίων

const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Ενεργοποίηση CORS
app.use(cors());

// JSON Middleware
app.use(express.json());

const SECRET_KEY = 'your_secret_key';

// =========================
// AUTH MIDDLEWARE
// =========================
function authenticateToken(req, res, next) {

    const authHeader = req.headers['authorization'];

    const token =
        authHeader &&
        authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(
        token,
        SECRET_KEY,
        (err, user) => {

            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;

            next();
        }
    );
}

// =========================
// REGISTER
// =========================
app.post('/register', async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {

        return res.status(400).json({
            message: 'Παρακαλώ συμπληρώστε όλα τα πεδία.'
        });

    }

    try {

        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length > 0) {

            return res.status(409).json({
                message: 'Το email χρησιμοποιείται ήδη.'
            });

        }

        const hashedPassword =
            bcrypt.hashSync(password, 10);

        await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.status(201).json({
            message: 'Εγγραφή επιτυχής!'
        });

    } catch (err) {

        console.error('Database error:', err);

        res.status(500).json({
            message: 'Σφάλμα κατά την εγγραφή.'
        });

    }

});

// =========================
// LOGIN
// =========================
app.post('/login', async (req, res) => {

    const { email, password } = req.body;

    try {

        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {

            return res.status(401).json({
                message: 'Χρήστης δεν βρέθηκε.'
            });

        }

        const user = users[0];

        const isPasswordValid =
            bcrypt.compareSync(
                password,
                user.password
            );

        if (!isPasswordValid) {

            return res.status(401).json({
                message: 'Λάθος κωδικός πρόσβασης.'
            });

        }

        // JWT TOKEN
        const token = jwt.sign(

            {
                user_id: user.user_id,
                name: user.name,
                email: user.email
            },

            SECRET_KEY,

            {
                expiresIn: '1h'
            }

        );

        // 🔥 SEND USERNAME TOO
        res.status(200).json({

            message: 'Επιτυχής σύνδεση!',
            token,
            name: user.name

        });

    } catch (err) {

        console.error('Database error:', err);

        res.status(500).json({
            message: 'Σφάλμα κατά την σύνδεση.'
        });

    }

});

// =========================
// LOCATIONS
// =========================
app.get('/locations', async (req, res) => {

    try {

        const [locations] = await db.query(
            'SELECT DISTINCT location FROM restaurants'
        );

        res.status(200).json({
            locations: locations.map(
                row => row.location
            )
        });

    } catch (err) {

        console.error('Database error:', err);

        res.status(500).json({
            message: 'Σφάλμα κατά την ανάκτηση των τοποθεσιών.'
        });

    }

});

// =========================
// GET RESTAURANTS
// =========================
app.get('/restaurants', async (req, res) => {

    const location = req.query.location;

    try {

        let query = 'SELECT * FROM restaurants';

        let params = [];

        if (location) {

            query += ' WHERE location = ?';

            params.push(location);

        }

        const [restaurants] =
            await db.query(query, params);

        res.status(200).json({
            restaurants
        });

    } catch (err) {

        console.error('Database error:', err);

        res.status(500).json({
            message: 'Σφάλμα κατά την ανάκτηση των εστιατορίων.'
        });

    }

});

// =========================
// ADD RESTAURANT
// =========================
app.post('/restaurants', authenticateToken, async (req, res) => {

    const {
        name,
        location,
        description
    } = req.body;

    if (!name || !location || !description) {

        return res.status(400).json({
            message: 'Όλα τα πεδία είναι υποχρεωτικά.'
        });

    }

    try {

        await db.query(

            'INSERT INTO restaurants (name, location, description) VALUES (?, ?, ?)',

            [
                name,
                location,
                description
            ]

        );

        res.status(201).json({
            message: 'Το εστιατόριο προστέθηκε επιτυχώς!'
        });

    } catch (err) {

        console.error('Σφάλμα κατά την εισαγωγή εστιατορίου:', err);

        res.status(500).json({
            message: 'Σφάλμα κατά την εισαγωγή.'
        });

    }

});

// =========================
// CREATE RESERVATION
// =========================
app.post('/reservations', authenticateToken, async (req, res) => {

    const {
        restaurant_id,
        date,
        time,
        people_count
    } = req.body;

    if (
        !restaurant_id ||
        !date ||
        !time ||
        !people_count
    ) {

        return res.status(400).json({
            message: 'Παρακαλώ συμπληρώστε όλα τα πεδία.'
        });

    }

    try {

        await db.query(

            `
            INSERT INTO reservations
            (user_id, restaurant_id, date, time, people_count)
            VALUES (?, ?, ?, ?, ?)
            `,

            [
                req.user.user_id,
                restaurant_id,
                date,
                time,
                people_count
            ]

        );

        res.status(201).json({
            message: 'Η κράτηση καταχωρήθηκε επιτυχώς!'
        });

    } catch (err) {

        console.error('Database error:', err);

        res.status(500).json({
            message: 'Σφάλμα κατά την αποθήκευση της κράτησης.'
        });

    }

});

// =========================
// GET USER RESERVATIONS
// =========================
app.get('/reservations/user', authenticateToken, async (req, res) => {

    try {

        const [reservations] = await db.query(

            `
            SELECT reservations.*, restaurants.name AS restaurant_name
            FROM reservations
            JOIN restaurants
            ON reservations.restaurant_id = restaurants.restaurant_id
            WHERE reservations.user_id = ?
            `,

            [req.user.user_id]

        );

        res.status(200).json(reservations);

    } catch (err) {

        console.error(err);

        res.status(500).send(
            'Σφάλμα στην ανάκτηση των κρατήσεων'
        );

    }

});

// =========================
// DELETE RESERVATION
// =========================
app.delete('/reservations/:id', authenticateToken, async (req, res) => {

    const reservationId = req.params.id;

    try {

        const [result] = await db.query(

            'DELETE FROM reservations WHERE reservation_id = ? AND user_id = ?',

            [
                reservationId,
                req.user.user_id
            ]

        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: 'Η κράτηση δεν βρέθηκε.'
            });

        }

        res.status(200).json({
            message: 'Η κράτηση διαγράφηκε επιτυχώς!'
        });

    } catch (err) {

        console.error('Database error:', err);

        res.status(500).json({
            message: 'Σφάλμα κατά τη διαγραφή της κράτησης.'
        });

    }

});

// =========================
// UPDATE RESERVATION
// =========================
app.put('/reservations/:id', authenticateToken, async (req, res) => {

    const reservationId = req.params.id;

    const {
        date,
        time,
        people_count
    } = req.body;

    if (
        !date ||
        !time ||
        !people_count
    ) {

        return res.status(400).json({
            message: 'Παρακαλώ συμπληρώστε όλα τα πεδία.'
        });

    }

    try {

        const [result] = await db.query(

            `
            UPDATE reservations
            SET date = ?, time = ?, people_count = ?
            WHERE reservation_id = ? AND user_id = ?
            `,

            [
                date,
                time,
                people_count,
                reservationId,
                req.user.user_id
            ]

        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: 'Η κράτηση δεν βρέθηκε.'
            });

        }

        res.status(200).json({
            message: 'Η κράτηση ενημερώθηκε επιτυχώς!'
        });

    } catch (err) {

        console.error('Database error:', err);

        res.status(500).json({
            message: 'Σφάλμα κατά την ενημέρωση της κράτησης.'
        });

    }

});

// =========================
// DELETE RESTAURANT
// =========================
app.delete('/restaurants/:id', authenticateToken, async (req, res) => {

    const restaurantId = req.params.id;

    try {

        const [result] = await db.query(

            'DELETE FROM restaurants WHERE restaurant_id = ?',

            [restaurantId]

        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: 'Το εστιατόριο δεν βρέθηκε.'
            });

        }

        res.status(200).json({
            message: 'Το εστιατόριο διαγράφηκε επιτυχώς!'
        });

    } catch (err) {

        console.error('Σφάλμα κατά τη διαγραφή εστιατορίου:', err);

        res.status(500).json({
            message: 'Σφάλμα server κατά τη διαγραφή.'
        });

    }

});

// =========================
// SERVER
// =========================
const PORT = 3001;

app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);

});