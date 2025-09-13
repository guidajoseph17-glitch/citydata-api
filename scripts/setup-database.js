const { Client } = require('pg');
const fs = require('fs').promises;
require('dotenv').config();

async function setupDatabase() {
  console.log('🗄️ Setting up CityData API database...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Read and execute the schema
    console.log('📄 Creating database schema...');
    const schema = await fs.readFile('./database/schema.sql', 'utf8');
    await client.query(schema);
    console.log('✅ Database schema created');

    console.log('🎉 Database setup complete!');
    
    // Test the setup
    const testQuery = await client.query('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = \'public\'');
    console.log(`📊 Tables created: ${testQuery.rows[0].table_count}`);
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
