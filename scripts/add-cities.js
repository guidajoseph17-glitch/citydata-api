const { Pool } = require('pg');
const fs = require('fs').promises;
require('dotenv').config();

async function addCities() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('Adding 50 cities to database...');
    
    // Read the SQL file
    const sql = await fs.readFile('./database/add-50-cities.sql', 'utf8');
    
    // Execute it
    await pool.query(sql);
    
    // Check results
    const result = await pool.query('SELECT COUNT(*) as count FROM cities');
    console.log(`Success! Total cities: ${result.rows[0].count}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

addCities();
