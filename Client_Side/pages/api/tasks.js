// pages/api/tasks.js

import mysql from 'mysql';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userEmail } = req.query;
    const connection = mysql.createConnection({
      host: 'sql6.freemysqlhosting.net',
      user: 'sql6694703',
      password: 'F3Q8sIsEH4',
      database: 'sql6694703'
    });

    connection.connect();

    const fetchTasksQuery = 'SELECT * FROM task WHERE email = ?';
    connection.query(fetchTasksQuery, [userEmail], (error, results) => {
      if (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
        return;
      }
      res.status(200).json(results);
    });

    connection.end();
  } else if (req.method === 'POST') {
    const { userEmail, taskName, taskDescription, taskReminderDate, taskReminderTime } = req.body;
    const connection = mysql.createConnection({
      host: 'sql6.freemysqlhosting.net',
      user: 'sql6694703',
      password: 'F3Q8sIsEH4',
      database: 'sql6694703'
    });

    connection.connect();

    const insertTaskQuery = 'INSERT INTO task (email, task_name, task_description, reminder_date, reminder_time) VALUES (?, ?, ?, ?, ?)';
    connection.query(insertTaskQuery, [userEmail, taskName, taskDescription, taskReminderDate, taskReminderTime], (error, results) => {
      if (error) {
        console.error('Error inserting task:', error);
        res.status(500).json({ error: 'Failed to insert task' });
        return;
      }
      res.status(201).json({ message: 'Task inserted successfully' });
    });

    connection.end();
  } else if (req.method === 'DELETE') {
    const { id } = req.query; // Extract taskId from query parameters
    const connection = mysql.createConnection({
      host: 'sql6.freemysqlhosting.net',
      user: 'sql6694703',
      password: 'F3Q8sIsEH4',
      database: 'sql6694703'
    });

    connection.connect();

    const deleteTaskQuery = 'DELETE FROM task WHERE id = ?';
    connection.query(deleteTaskQuery, [id], (error, results) => {
      if (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
        return;
      }
      res.status(200).json({ message: 'Task deleted successfully' });
    });

    connection.end();
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}