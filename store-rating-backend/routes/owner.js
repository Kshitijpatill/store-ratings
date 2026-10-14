const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken, authorizeRoles('STORE_OWNER'));

router.get('/dashboard', async (req, res) => {
    const ownerId = req.user.id;

    try {
        const storeResult = await pool.query(`
            SELECT s.id, s.name, COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.owner_id = $1
            GROUP BY s.id
        `, [ownerId]);

        if (storeResult.rows.length === 0) {
            return res.status(404).json({ message: 'No store found for this owner.' });
        }

        const store = storeResult.rows[0];

        const ratingsResult = await pool.query(`
            SELECT u.name, u.email, r.rating, r.id as rating_id
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = $1
            ORDER BY r.rating DESC
        `, [store.id]);

        res.json({
            store: {
                id: store.id,
                name: store.name,
                averageRating: parseFloat(store.average_rating)
            },
            reviews: ratingsResult.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching owner dashboard.' });
    }
});

module.exports = router;