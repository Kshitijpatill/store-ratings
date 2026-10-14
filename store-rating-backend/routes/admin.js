const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateRegistration } = require('../utils/validation');

router.use(authenticateToken, authorizeRoles('ADMIN'));

router.get('/dashboard', async (req, res) => {
    try {
        const usersCount = await pool.query('SELECT COUNT(*) FROM users');
        const storesCount = await pool.query('SELECT COUNT(*) FROM stores');
        const ratingsCount = await pool.query('SELECT COUNT(*) FROM ratings');

        res.json({
            totalUsers: parseInt(usersCount.rows[0].count),
            totalStores: parseInt(storesCount.rows[0].count),
            totalRatings: parseInt(ratingsCount.rows[0].count)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
});

router.post('/users', async (req, res) => {
    const { name, email, password, address, role } = req.body;

    const validationErrors = validateRegistration({ name, email, password, address });
    if (!['ADMIN', 'NORMAL', 'STORE_OWNER'].includes(role)) {
        validationErrors.push("Invalid role specified.");
    }

    if (validationErrors.length > 0) return res.status(400).json({ errors: validationErrors });

    try {
        const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) return res.status(400).json({ message: 'Email already exists.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            `INSERT INTO users (name, email, password, address, role) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role`,
            [name, email, hashedPassword, address, role]
        );

        res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error creating user' });
    }
});

router.get('/users', async (req, res) => {
    const { name, email, address, role, sortBy = 'name', order = 'asc' } = req.query;

    try {
        let query = `
            SELECT u.id, u.name, u.email, u.address, u.role, 
                   COALESCE(ROUND(AVG(r.rating), 2), 0) AS store_rating
            FROM users u
            LEFT JOIN stores s ON u.id = s.owner_id
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE 1=1
        `;
        const values = [];
        let index = 1;

        if (name) { query += ` AND u.name ILIKE $${index++}`; values.push(`%${name}%`); }
        if (email) { query += ` AND u.email ILIKE $${index++}`; values.push(`%${email}%`); }
        if (address) { query += ` AND u.address ILIKE $${index++}`; values.push(`%${address}%`); }
        if (role) { query += ` AND u.role = $${index++}`; values.push(role); }

        query += ` GROUP BY u.id`;

        const validSortColumns = ['name', 'email', 'address', 'role'];
        const sortColumn = validSortColumns.includes(sortBy) ? `u.${sortBy}` : 'u.name';
        const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

        query += ` ORDER BY ${sortColumn} ${sortOrder}`;

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching users' });
    }
});

module.exports = router;