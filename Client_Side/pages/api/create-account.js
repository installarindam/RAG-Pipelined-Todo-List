// pages/api/create-account.js

// Import necessary modules
import mysql from 'mysql';

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'sql6.freemysqlhosting.net',
  user: 'sql6694703',
  password: 'F3Q8sIsEH4',
  database: 'sql6694703'
});

export default function handler(req, res) {
  if (req.method !== 'POST') {
    // Only accept POST requests
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const { email, password } = req.body;

  // Validate email and password (add more validation as needed)

  // Connect to the database
  connection.connect();

  // Execute the SQL query to insert the user's email and hashed password
  const sql = 'INSERT INTO credential (email, pass) VALUES (?, ?)';
  connection.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error('Error inserting user into database:', err);
      res.status(500).json({ error: 'Failed to create account' });
      return;
    }
    console.log('User created successfully');
    res.status(200).json({ message: 'Account created successfully' });
  });

  // Close the database connection
  connection.end();
}
