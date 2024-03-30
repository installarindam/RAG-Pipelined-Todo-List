// pages/api/sendEmail.js

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userEmail, message } = req.body;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'todolistautomation@gmail.com',
        pass: 'zjaq kqlf brfd uqhq',
      },
    });

    // Define email options
    const mailOptions = {
      from: 'todolistautomation@gmail.com',
      to: userEmail,
      subject: 'Task Reminder: Missing Values',
      text: message,
    };

    try {
      // Send email
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, error: 'Failed to send email.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
