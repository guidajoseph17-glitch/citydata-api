const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function populateMoreCities() {
  console.log('Adding more cities to database...');
  
  try {
    // Read and execute the SQL file
    const fs = require('fs').promises;
    const sqlContent = await fs.readFile('./database/add-more-cities.sql', 'utf8');
    await pool.query(sqlContent);
    
    // Verify cities were added
    const result = await pool.query('SELECT COUNT(*) as count FROM cities');
    console.log(`Total cities in database: ${result.rows[0].count}`);
    
    console.log('Cities added successfully!');
  } catch (error) {
    console.error('Error adding cities:', error);
  } finally {
    await pool.end();
  }
}

populateMoreCities();
