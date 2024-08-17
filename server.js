const express = require('express');
const app = express();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './.env' });
const port = 3000;

// Create database connection
const db = mysql.createConnection({
     host: process.env.DB_HOST,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME
});

// Check if connection works
db.connect((err) => {
     if (err) return console.log("Error connecting to database.");
     console.log("Connected to MySQL as id:", db.threadId);
});

// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'frontends')));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(session({
     secret: crypto.randomBytes(64).toString('hex'),
     resave: false,
     saveUninitialized: false,
     cookie: { secure: false } // Set to true if using HTTPS
}));

app.use((err, req, res, next) => {
     console.error(err.stack);
     res.status(500).json({ error: 'Internal Server Error' });
});

// // ROUTES
// app.use('/login', require('./frontends/login'));
// app.use('/dashboard', require('./netlify/functions/dashboard'));

// Users registration route
app.post('/netlify/functions/register', async (req, res) => {
     try {
          const users = `SELECT * FROM users WHERE email = ?`;
          // Check if user exists
          db.query(users, [req.body.email], (err, data) => {
               if (data.length) return res.status(409).json("User already exists");

               // Password Hashing
               const salt = bcrypt.genSaltSync(10);
               const hashedPassword = bcrypt.hashSync(req.body.password, salt);

               const newUser = `INSERT INTO users(email, username, password) VALUES(?)`;
               const values = [req.body.email, req.body.username, hashedPassword];

               db.query(newUser, [values], (err, data) => {
                    if (err) return res.status(400).json("Something went wrong");

                    return res.status(200).json("User created successfully");
               });
          });
     } catch (err) {
          res.status(500).json("Internal Server Error");
     }
});

app.post('/netlify/functions/login', async (req, res) => {
     try {
          const { email, password } = req.body;
          const query = 'SELECT * FROM users WHERE email = ?';

          db.query(query, [email], (err, data) => {
               if (err) {
                    console.error('Database query error:', err);
                    return res.status(500).json({ message: 'Internal Server Error' });
               }

               if (data.length === 0) {
                    return res.status(404).json({ message: 'User not found' });
               }

               const user = data[0];
               const isPasswordValid = bcrypt.compareSync(password, user.password);

               if (!isPasswordValid) {
                    return res.status(400).json({ message: 'Invalid email or password' });
               }

               return res.status(200).json({ message: 'Login successful' });
          });
     } catch (err) {
          console.error('Server error:', err);
          res.status(500).json({ message: 'Internal Server Error' });
     }
});

// Logout Route
app.get('/netlify/functions/logout', (req, res) => {
     req.session.destroy((err) => {
          if (err) {
               return res.status(500).send('Failed to log out');
          }
          res.send('Logged out successfully');
     });
});

// Password reset route
app.put('/netlify/functions/reset', async (req, res) => {
     try {
          const users = `SELECT * FROM users WHERE email = ?`;
          db.query(users, [req.body.email], (err, data) => {
               if (data.length === 0) return res.status(404).json("User not registered");

               const salt = bcrypt.genSaltSync(10);
               const hashedPassword = bcrypt.hashSync(req.body.password, salt);

               const newPasswordQuery = `UPDATE users SET password = ? WHERE id = ?`;
               const values = [hashedPassword, data[0].id];

               db.query(newPasswordQuery, values, (err, result) => {
                    if (err) return res.status(400).json("Something went wrong");

                    return res.status(200).json("Password changed successfully");
               });
          });
     } catch (err) {
          res.status(500).json("Internal Server Error");
     }
});

// Dashboard route
app.get('/netlify/functions/dashboard', (req, res) => {
     if (req.isAuthenticated()) {
          res.json({ message: `Welcome to your dashboard, ${req.user.username}` });
     } else {
          res.status(401).json({ error: 'Unauthorized. Please log in to access your dashboard.' });
     }
});

app.get('/download-pdf', (req, res) => {
     const doc = new PDFDocument();
     const filePath = path.join(__dirname, 'output.pdf');
     doc.pipe(fs.createWriteStream(filePath));

     doc.fontSize(12).text('Table Data', 100, 100);

     const tableData = [
          ['Name', 'Age', 'Gender'],
          ['John Doe', '25', 'Male'],
          ['Jane Doe', '28', 'Female']
     ];

     let startY = 150;
     tableData.forEach(row => {
          let startX = 100;
          row.forEach(cell => {
               doc.text(cell, startX, startY);
               startX += 100;
          });
          startY += 20;
     });

     doc.end();

     doc.on('finish', () => {
          res.download(filePath, 'table.pdf', (err) => {
               if (err) {
                    console.error('Error downloading file:', err);
                    res.status(500).send('Error downloading file');
               } else {
                    console.log('File downloaded successfully');
               }
          });
     });
});

app.get('/netlify/functions/expenses', async (req, res) => {
     try {
          const [rows] = await db.promise().query('SELECT * FROM expenses');

          res.status(200).json({
               success: true,
               data: rows
          });
     } catch (error) {
          console.error('Error querying the database:', error);
          res.status(500).json({
               success: false,
               message: 'Server Error'
          });
     }
});

app.listen(port, () => {
     console.log(`Server is running on http://localhost:${port}`);
});
