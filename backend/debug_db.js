import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'LandEstate',
  user: 'postgres',
  password: 'admin123'
});

async function debugDB() {
  try {
    await client.connect();
    
    console.log('=== EMPLOYEES ===');
    const employees = await client.query('SELECT id, name, email, manager_id FROM "Employees"');
    console.table(employees.rows);
    
    console.log('=== PROPERTIES WITH EMPLOYEE ASSIGNMENTS ===');
    const properties = await client.query('SELECT id, name, user_id, employee_id FROM properties ORDER BY user_id');
    console.table(properties.rows);
    
    console.log('=== USERS (ADMINS) ===');
    const users = await client.query('SELECT id, name, email FROM "Users"');
    console.table(users.rows);
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

debugDB();
