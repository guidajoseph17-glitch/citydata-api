const { Client } = require('pg');
const fs = require('fs').promises;

async function loadSampleData() {
  console.log('🔄 Loading sample city data...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // First, create the schema
    try {
      const schema = await fs.readFile('./database/schema.sql', 'utf8');
      await client.query(schema);
      console.log('✅ Database schema ready');
    } catch (error) {
      console.log('⚠️ Schema already exists or error:', error.message);
    }

    // Load sample cities
    try {
      const sampleData = await fs.readFile('./database/sample-cities.sql', 'utf8');
      await client.query(sampleData);
      console.log('✅ Sample cities loaded');
    } catch (error) {
      console.log('⚠️ Sample data already exists or error:', error.message);
    }

    // Test the data
    const cityCount = await client.query('SELECT COUNT(*) as count FROM cities');
    console.log(`📊 Cities in database: ${cityCount.rows[0].count}`);

    // Test the API data
    const testCity = await client.query(`
      SELECT c.city_name, c.state_code, d.median_income, r.median_home_price 
      FROM cities c 
      LEFT JOIN demographics d ON c.city_id = d.city_id 
      LEFT JOIN real_estate r ON c.city_id = r.city_id 
      LIMIT 1
    `);
    
    if (testCity.rows.length > 0) {
      const city = testCity.rows[0];
      console.log(`✅ Sample data: ${city.city_name}, ${city.state_code} - Income: $${city.median_income}, Home Price: $${city.median_home_price}`);
    }

    console.log('🎉 Database setup complete! API ready to use.');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    await client.end();
  }
}

// Run immediately when server starts
loadSampleData();
