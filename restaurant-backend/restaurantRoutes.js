// restaurantRoutes.js
const express = require('express');
const router = express.Router();
const db = require('./db'); // η σύνδεση με MariaDB

// Επιστρέφει όλα τα εστιατόρια
router.get('/restaurants', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM restaurants');
        res.json({ restaurants: rows });
    } catch (error) {
        console.error('Σφάλμα κατά την ανάκτηση εστιατορίων:', error);
        res.status(500).json({ message: 'Σφάλμα server' });
    }
});

module.exports = router;
