const express = require('express');
const next = require('next');
const mysql = require('mysql2');
const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(express.json())
  
  const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'nodecode',
    password: 'PiARrrrXLQRM0fWzEOhv',
    database: 'nodedb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  const promisePool = pool.promise();

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Successfully connected to the database');
    connection.release();
  });

  server.get('/asd/hello', async (req, res) => {
    res.send("ASDASDASDASDASD")
  })

  server.post('/api/update-profile', async (req, res) => {
    const { user_id, firstName, lastName, emailAddress, company, title, phone, address1, website, searching, offering, notice } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    try {
      const [existingProfile] = await promisePool.query('SELECT * FROM user_profiles WHERE user_id = ?', [user_id]);
  
      if (existingProfile.length > 0) {
        await promisePool.query(
          'UPDATE user_profiles SET first_name = ?, last_name = ?, email_address = ?, company = ?, title = ?, phone = ?, address1 = ?, website = ?, searching = ?, offering = ?, notice = ? WHERE user_id = ?',
          [firstName, lastName, emailAddress, company, title, phone, address1, website, searching, offering, notice, user_id]
        );
        res.status(200).json({ message: 'Profile updated successfully' });
      } else {
        await promisePool.query(
          'INSERT INTO user_profiles (user_id, first_name, last_name, email_address, company, title, phone, address1, website, searching, offering, notice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [user_id, firstName, lastName, emailAddress, company, title, phone, address1, website, searching, offering, notice]
        );
        res.status(201).json({ message: 'Profile created successfully' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Error updating profile' });
    }
  })

  server.get('/api/get-profile', async (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const [rows] = await promisePool.query('SELECT * FROM user_profiles WHERE user_id = ?', [user_id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const profile = rows[0];
      res.status(200).json(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Error fetching profile' });
    }
  });



  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
