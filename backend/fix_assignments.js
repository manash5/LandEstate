import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'LandEstate',
  user: 'postgres',
  password: 'admin123'
});

async function fix() {
  await client.connect();
  
  // Set Dipesh's manager to Prashant (user_id 15)
  await client.query('UPDATE "Employees" SET manager_id = 15 WHERE id = 7');
  
  // Remove Dipesh from Manash's properties (user_id 17)
  await client.query('UPDATE properties SET employee_id = NULL WHERE user_id = 17 AND employee_id = 7');
  
  console.log('✅ Fixed!');
  await client.end();
}

fix();
