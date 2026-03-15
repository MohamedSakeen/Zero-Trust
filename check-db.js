const { Pool } = require('pg');

async function checkDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/university_exam_db',
  });

  try {
    console.log('Attempting to connect to PostgreSQL...');
    const client = await pool.connect();
    console.log('✓ Successfully connected to PostgreSQL');
    
    // Check if database exists
    const result = await client.query('SELECT current_database()');
    console.log('✓ Current database:', result.rows[0].current_database);
    
    // Check for existing tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    if (tables.rows.length > 0) {
      console.log('✓ Existing tables found:');
      tables.rows.forEach(row => console.log('  -', row.table_name));
    } else {
      console.log('ℹ No tables found in database (migrations not yet run)');
    }
    
    client.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    await pool.end();
    process.exit(1);
  }
}

checkDatabase();
