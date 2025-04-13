const mysql = require('mysql2/promise');
const config = require('./config'); // Assuming you have a config.js file

async function main() {
    // Create a MySQL connection pool
    const pool = mysql.createPool(config.db);

    try {
        // Create 'Posts' table
        const createUsersTableQuery = `
            CREATE TABLE IF NOT EXISTS posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content text NOT NULL
            )
        `;

        await pool.query(createUsersTableQuery);
        console.log('Posts table created or already exists');

        // Insert sample data into 'posts' table
        const insertUsersQuery = `
            INSERT INTO posts (title, content) 
            VALUES 
                ('Halo', 'Halo Hi'),
                ('Hi', 'Hi Halo')
        `;

        try {
            await pool.query(insertUsersQuery);
            console.log('Sample data inserted into posts table');
        } catch (error) {
            // Check if the error is a duplicate entry error
            if (error.code === 'ER_DUP_ENTRY') {
                console.log('Sample data already exists in the posts table');
            } else {
                // If it's not a duplicate entry error, re-throw it
                throw error;
            }
        }

        // Select all posts
        const [results] = await pool.query('SELECT * FROM posts');
        console.log('Current data in posts table:');
        console.log(results);

    } catch (err) {
        console.error('An error occurred:', err);
    } finally {
        // Close the pool
        await pool.end();
    }
}

main().catch(console.error);