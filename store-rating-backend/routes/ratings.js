const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken, authorizeRoles('NORMAL'));

router.post('/', async (req, res) => {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    if (!storeId || !rating) {
        return res.status(400).json({ message: 'Store ID and rating are required.' });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    try {
        const newRating = await pool.query(
            `INSERT INTO ratings (rating, user_id, store_id) 
             VALUES ($1, $2, $3) RETURNING *`,
            [rating, userId, storeId]
        );

        res.status(201).json({ message: 'Rating submitted successfully', rating: newRating.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ message: 'You have already rated this store. Please modify your existing rating instead.' });
        }
        console.error(err);
        res.status(500).json({ message: 'Server error submitting rating.' });
    }
});

router.put('/:storeId', async (req, res) => {
    const { rating } = req.body;
    const { storeId } = req.params;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'A valid rating between 1 and 5 is required.' });
    }

    try {
        const updatedRating = await pool.query(
            `UPDATE ratings SET rating = $1 
             WHERE store_id = $2 AND user_id = $3 
             RETURNING *`,
            [rating, storeId, userId]
        );

        if (updatedRating.rows.length === 0) {
            return res.status(404).json({ message: 'Rating not found or you do not have permission to modify it.' });
        }

        res.json({ message: 'Rating updated successfully', rating: updatedRating.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error updating rating.' });
    }
});

module.exports = router;