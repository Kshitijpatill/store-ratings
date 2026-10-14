const bcrypt = require('bcrypt');
const pool = require('../db');

const seedAdmin = async () => {
    const adminEmail = 'admin.system@example.com';
    const adminPassword = 'AdminPassword123!';
    const adminName = 'System Administrator User';
    const adminAddress = 'Central Administrative Headquarters, City Office';

    try {
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
        if (existing.rows.length > 0) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await pool.query(
            `INSERT INTO users (name, email, password, address, role) 
             VALUES ($1, $2, $3, $4, 'ADMIN')`,
            [adminName, adminEmail, hashedPassword, adminAddress]
        );

        console.log('Admin user created successfully!');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding admin user:', err);
        process.exit(1);
    }
};

seedAdmin();
