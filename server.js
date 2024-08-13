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
const secret = crypto.randomBytes(64).toString('hex');
const PDFDocument = require('pdfkit');
const fs = require('fs');

dotenv.config({ path: './.env' });

app.use(session({
     secret: '18854f92b4959eb7e6c1bee1e7b14230695822f54f8590b814a3f37b2f3a799588908102854f511820c633a2e46314c1035650918584f7765050b786ae7ef7c4',
     resave: false,
     saveUninitialized: false,
     cookie: { secure: false } // Set to true if using HTTPS
}));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.use(express.json());
app.use(cors());
// app.use(passport.initialize());
// app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

// Connection to the database
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

// Users registration route
app.post('/register', async (req, res) => {
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

// User login route
app.post('/login', async (req, res) => {
     try {
          const users = `SELECT * FROM users WHERE email = ?`;
          db.query(users, [req.body.email], (err, data) => { 
               if (data.length === 0) return res.status(404).json("User not found");

               const isPasswordValid = bcrypt.compareSync(req.body.password, data[0].password);

               if (!isPasswordValid) return res.status(400).json("Invalid email or password");

               return res.status(200).json("Login Successful");
          });

     } catch (err) {
          res.status(500).json("Internal Server Error");
     }
});

// Logout Route
app.get('/logout', (req, res) => {
     req.session.destroy((err) => {
       if (err) {
         return res.status(500).send('Failed to log out');
       }
       res.send('Logged out successfully');
     });
});

// app.get('/', (req, res) => {
//      res.sendFile(path.join(__dirname, './index.html'));
// });

// Add expenses routing
app.post('/expenses', async (req, res) => { 
     try {
          const { email, category_id, amount, expense_date, description, created_at, updated_at } = req.body;
          
          // Check if the user exists
          db.query(`SELECT * FROM users WHERE email = ?`, [email], (err, users) => {
               if (err) return res.status(500).json({ error: 'Database query error' });
               if (users.length === 0) return res.status(404).json({ error: 'User not found' });
               
               // Insert the new expense
               db.query(`INSERT INTO expenses (user_id, category_id, amount, expense_date, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                    [users[0].id, category_id, amount, expense_date, description, created_at, updated_at], (err, result1) => {
                         if (err) return res.status(500).json({ error: 'Database query error' });

                         db.query(`INSERT INTO categories (user_id, category_name, created_at, updated_at) VALUES (?, ?, ?, ?)`, 
                              [users[0].id, category_name, created_at, updated_at], (err, result2) => {
                                   if (err) return res.status(500).json({ error: 'Database query error' });

                                   res.status(201).json({
                                        message: 'Expense and category added successfully',
                                        expense_id: result1.insertId,
                                        category_id: result2.insertId
                                   });
                              });
                    });
          });
     } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
});

// Password reset route
app.put('/reset', async (req, res) => {
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
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: `Welcome to your dashboard, ${req.user.username}` });
  } else {
    res.status(401).json({ error: 'Unauthorized. Please log in to access your dashboard.' });
  }
});

app.get('/download-pdf', (req, res) => {
     // Create a new PDF document
     const doc = new PDFDocument();
   
     // Pipe the PDF into a file
     const filePath = path.join(__dirname, 'output.pdf');
     doc.pipe(fs.createWriteStream(filePath));
   
     // Add some content to the PDF
     doc.fontSize(12).text('Table Data', 100, 100);
   
     // Example table data
     const tableData = [
       ['Name', 'Age', 'Gender'],
       ['John Doe', '25', 'Male'],
       ['Jane Doe', '28', 'Female']
     ];
   
     // Add table to PDF
     let startY = 150;
     tableData.forEach(row => {
       let startX = 100;
       row.forEach(cell => {
         doc.text(cell, startX, startY);
         startX += 100;
       });
       startY += 20;
     });
   
     // Finalize the PDF and end the stream
     doc.end();
   
     // Wait for the PDF to be written to disk, then send it to the user
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

//View Expenses routinne
// Define the route handler for GET requests to /api/view_expenses
app.get('/view_expenses', async (req, res) => {
     try {
       // Query the database using await
       const [rows] = await db.promise().query('SELECT * FROM expenses');
       
       // Respond with the results
       res.status(200).json({
         success: true,
         data: rows
       });
     } catch (error) {
       // Handle errors
       console.error('Error querying the database:', error);
       res.status(500).json({
         success: false,
         message: 'Server Error'
       });
     }
   });
   
app.listen(3000, () => {
     console.log("Server is running on https://expense-tracker-backend-api-endpoints.netlify.app");
});