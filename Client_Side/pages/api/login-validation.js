// pages/api/login-validation.js

import mysql from 'mysql';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // Only accept POST requests
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const { email, password } = req.body;

  // MySQL connection configuration
  const connection = mysql.createConnection({
    host: 'sql6.freemysqlhosting.net',
    user: 'sql6694703',
    password: 'F3Q8sIsEH4',
    database: 'sql6694703'
  });

  // Connect to the database
  connection.connect();

  // Execute the SQL query to check if the email exists
  const checkEmailQuery = 'SELECT * FROM credential WHERE email = ?';
  connection.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Error during login validation:', err);
      res.status(500).json({ error: 'Failed to validate login' });
      connection.end(); // Close the database connection
      return;
    }

    // Check if any matching user records were found
    if (results.length === 0) {
      // No matching user records found for the provided email
      res.status(404).json({ error: 'User not found' });
      connection.end(); // Close the database connection
      return;
    }

    // If email exists, execute the SQL query to check if the password matches
    const checkPasswordQuery = 'SELECT * FROM credential WHERE email = ? AND pass = ?';
    connection.query(checkPasswordQuery, [email, password], (err, results) => {
      if (err) {
        console.error('Error during login validation:', err);
        res.status(500).json({ error: 'Failed to validate login' });
        connection.end(); // Close the database connection
        return;
      }

      // Check if any matching user records were found with the provided email and password
      if (results.length === 0) {
        // Password does not match the email
        res.status(401).json({ error: 'Wrong password' });
      } else {
        // Email and password are valid
        res.status(200).json({ valid: true });
      }

      // Close the database connection after all queries have been executed
      connection.end();
    });
  });
}
