const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.post('/', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
    const { name, email, address, ownerId } = req.body;

    if (!name || !email || !address || !ownerId) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const ownerCheck = await pool.query('SELECT role FROM users WHERE id = $1', [ownerId]);
        if (ownerCheck.rows.length === 0 || ownerCheck.rows[0].role !== 'STORE_OWNER') {
            return res.status(400).json({ message: 'Provided user ID is not a valid Store Owner.' });
        }

        const newStore = await pool.query(
            `INSERT INTO stores (name, email, address, owner_id) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, email, address, ownerId]
        );

        res.status(201).json({ message: 'Store created successfully', store: newStore.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error creating store' });
    }
});

router.get('/', authenticateToken, async (req, res) => {
    const { name, address, sortBy = 'name', order = 'asc' } = req.query;
    const userId = req.user.id;

    try {
        let query = `
            SELECT s.id, s.name, s.email, s.address, 
                   COALESCE(ROUND(AVG(r.rating), 2), 0) AS overall_rating,
                   (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = $${1}) AS my_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE 1=1
        `;
        const values = [userId];
        let index = 2;

        if (name) { query += ` AND s.name ILIKE $${index++}`; values.push(`%${name}%`); }
        if (address) { query += ` AND s.address ILIKE $${index++}`; values.push(`%${address}%`); }

        query += ` GROUP BY s.id`;

        const validSortColumns = ['name', 'address', 'overall_rating'];
        const sortColumn = validSortColumns.includes(sortBy) ? (sortBy === 'overall_rating' ? 'overall_rating' : `s.${sortBy}`) : 's.name';
        const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

        query += ` ORDER BY ${sortColumn} ${sortOrder}`;

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching stores' });
    }
});

module.exports = router;