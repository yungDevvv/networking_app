const express = require('express');
const next = require('next');
const mysql = require('mysql2');
const Hashids = require('hashids/cjs');
const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();
const { hashEncodeId, hashDecodeId } = require('./hashId');
const authenticateToken = require('./utils');

app.prepare().then(() => {
  const server = express();
  server.use(express.json({ limit: '10mb' }));

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


  server.get('/profile:hashId', async (req, res) => {
    const { hashId } = req.params;

    const originalId = hashDecodeId(hashId);

    if (!originalId) {
      return res.status(404).json({ error: 'Invalid profile ID' });
    }

    const [user] = await promisePool.query(`SELECT * FROM user_profiles WHERE id = ?`, [id]);

    if (user.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profile = [user[0]];


    res.status(200).json({ profile });
  })

  server.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const [user] = await promisePool.query(`SELECT * FROM user_profiles WHERE id = ?`, [id]);

      if (user.length === 0) return res.status(200).json({ user: null });
      res.status(200).json({ user: user[0] });

    } catch (error) {
      console.error('Error fetching user', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  server.post('/api/privacy-settings/:profileId', async (req, res) => {
    const { profileId } = req.params;
    const settings = req.body;

    try {
      const settingsJson = JSON.stringify(settings);
      console.log(settingsJson)
      await promisePool.query(
        'UPDATE user_profiles SET privacy_settings = ? WHERE id = ?',
        [settingsJson, profileId]
      );

      res.status(200).json({ message: 'Privacy settings updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating privacy settings', error });
    }
  });

  server.get('/api/search-users', async (req, res) => {
    const { query } = req;
    const searchTerm = query.search || '';

    try {
      const sql = `
        SELECT * FROM user_profiles
        WHERE address1 LIKE ? OR
              company LIKE ? OR
              email_address LIKE ? OR
              first_name LIKE ? OR
              last_name LIKE ? OR
              notice LIKE ? OR
              offering LIKE ? OR
              phone LIKE ? OR
              searching LIKE ? OR
              title LIKE ? OR
              website LIKE ?
      `;
      const params = Array(11).fill(`%${searchTerm}%`);

      const [rows] = await promisePool.query(sql, params);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  server.post('/api/update-profile', async (req, res) => {
    const {
      user_id,
      firstName,
      lastName,
      emailAddress,
      company,
      title,
      phone,
      address1,
      website,
      searching,
      offering,
      notice,
      avatar,
      businessNetworks
    } = req.body;

    const businessNetworksJSON = JSON.stringify(businessNetworks);

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const [existingProfile] = await promisePool.query(
        'SELECT * FROM user_profiles WHERE user_id = ?',
        [user_id]
      );

      if (existingProfile.length > 0) {
        await promisePool.query(
          `UPDATE user_profiles 
          SET first_name = ?, 
              last_name = ?, 
              email_address = ?, 
              company = ?, 
              title = ?, 
              phone = ?, 
              address1 = ?, 
              website = ?, 
              searching = ?, 
              offering = ?, 
              avatar = ?, 
              notice = ?, 
              businessNetworks = ? 
          WHERE user_id = ?`,
          [
            firstName,
            lastName,
            emailAddress,
            company,
            title,
            phone,
            address1,
            website,
            searching,
            offering,
            avatar,
            notice,
            businessNetworksJSON,
            user_id
          ]
        );
        res.status(200).json({ message: 'Profile updated successfully' });
      } else {
        await promisePool.query(
          `INSERT INTO user_profiles 
          (user_id, first_name, last_name, email_address, company, title, phone, address1, website, searching, offering, notice, avatar, businessNetworks) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            user_id,
            firstName,
            lastName,
            emailAddress,
            company,
            title,
            phone,
            address1,
            website,
            searching,
            offering,
            notice,
            avatar,
            businessNetworksJSON
          ]
        );
        res.status(201).json({ message: 'Profile created successfully' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Error updating profile' });
    }
  });

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

  server.get('/api/get-users', async (req, res) => {
    try {
      const [rows] = await promisePool.query('SELECT * FROM user_profiles')
      res.status(200).json({ users: rows })
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  })

  server.get('/api/profile-exists', async (req, res) => {

    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const [profile] = await promisePool.query(
        `SELECT up.*, c.company_name 
         FROM user_profiles up
         LEFT JOIN Companies c ON up.company = c.id
         WHERE up.user_id = ?`,
        [user_id]
      );


      if (profile.length > 0) {
        return res.status(200).json({ profile: profile });
      }

      return res.status(200).json({ profile: null });

    } catch (error) {
      console.error('Error checking profile:', error);
      return res.status(500).json({ error: 'Error checking profile' });
    }
  });





  server.post('/api/create-network', async (req, res) => {
    const { name, profileId } = req.body;
    try {

      const [networkResult] = await promisePool.query(`
      INSERT INTO Network (name, profileId)
      VALUES (?, ?)
    `, [name, profileId]);

      const networkId = networkResult.insertId;  // ID of created Network

      await promisePool.query(`
      INSERT INTO NetworkMember (role, profileId, networkId)
      VALUES ('ADMIN', ?, ?)
    `, [profileId, networkId]);

      res.status(201).json({ message: 'Network created successfully', networkId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error then creating network', error });
    }
  });

  server.get('/api/get-user-networks/:id', async (req, res) => {
    const profileId = req.params.id;

    try {
      const [networks] = await promisePool.query(`
        SELECT n.id, n.name
        FROM Network n
        JOIN NetworkMember nm ON n.id = nm.networkId
        WHERE nm.profileId = ?
      `, [profileId]);

      res.status(200).json({ networks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting user networks', error });
    }
  });

  server.post('/api/add-user-to-network', async (req, res) => {
    const { profileId, networkId } = req.body;

    if (!profileId || !networkId) {
      return res.status(400).json({ error: 'Profile ID or Network ID are required.' });
    }

    try {

      const [existingMember] = await promisePool.query(
        'SELECT * FROM NetworkMember WHERE profileId = ? AND networkId = ?',
        [profileId, networkId]
      );


      if (existingMember.length > 0) {
        return res.status(409).json({ error: 'User is already a member of this network.', message: '' });
      }

      await promisePool.query(
        'INSERT INTO NetworkMember (profileId, networkId, role) VALUES (?, ?, ?)',
        [profileId, networkId, 'GUEST']
      );

      res.status(200).json({ message: 'Profile added to network successfully.', error: '' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  });

  server.get('/api/networks/:id', async (req, res) => {
    const networkId = req.params.id;

    if (!networkId) {
      return res.status(400).json({ error: 'Network ID is required.' });
    }

    try {
      const [network] = await promisePool.query('SELECT * FROM Network WHERE id = ?', [networkId]);

      if (!network) {
        return res.status(404).json({ error: 'Network not found.' });
      }

      res.status(200).json({ network });
    } catch (error) {
      console.error('Error fetching network:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  server.get('/api/networks/:id/members', async (req, res) => {
    const networkId = req.params.id;

    try {
      const [members] = await promisePool.query(`
        SELECT user_profiles.*, NetworkMember.role, NetworkMember.profileId
        FROM NetworkMember JOIN user_profiles ON NetworkMember.profileId = user_profiles.id 
        WHERE NetworkMember.networkId = ?
      `, [networkId]);

      res.status(200).json({ members });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  server.post('/api/networks/remove-member', async (req, res) => {
    const { profileId, memberId, networkId } = req.body;

    if (!profileId || !memberId || !networkId) {
      return res.status(400).json({ error: 'Profile ID, Member ID, and Network ID are required.' });
    }

    try {

      const [adminCheck] = await promisePool.query(
        'SELECT role FROM NetworkMember WHERE profileId = ? AND networkId = ?',
        [profileId, networkId]
      );

      if (!adminCheck || adminCheck[0].role !== 'ADMIN') {
        return res.status(403).json({ error: 'You do not have permission to remove members.' });
      }


      const [memberToRemove] = await promisePool.query(
        'SELECT * FROM NetworkMember WHERE profileId = ? AND networkId = ?',
        [memberId, networkId]
      );

      if (!memberToRemove) {
        return res.status(404).json({ error: 'Member not found in this network.' });
      }

      await promisePool.query('DELETE FROM NetworkMember WHERE profileId = ? AND networkId = ?', [memberId, networkId]);

      res.status(200).json({ message: 'Member removed successfully.' });
    } catch (error) {
      console.error('Error removing member:', error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  });

  server.delete('/api/networks/:networkId/delete', async (req, res) => {
    const { networkId } = req.params;

    if (!networkId) {
      return res.status(400).json({ error: 'Network ID is required.' });
    }

    try {

      await promisePool.query('DELETE FROM NetworkMember WHERE networkId = ?', [networkId]);

      const result = await promisePool.query('DELETE FROM Network WHERE id = ?', [networkId]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Network not found.' });
      }

      res.status(200).json({ message: 'Network and its members deleted successfully.' });
    } catch (error) {
      console.error('Error deleting network:', error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  });

  server.get('/api/networks/admin/:profileId', async (req, res) => {
    const profileId = req.params.profileId;

    if (!profileId) {
      return res.status(400).json({ error: 'Profile ID is required' });
    }

    try {
      const [networks] = await promisePool.query(`
        SELECT n.* 
        FROM Network n
        INNER JOIN NetworkMember nm ON n.id = nm.networkId
        WHERE nm.profileId = ? AND nm.role = 'ADMIN'
    `, [profileId]);

      if (networks.length === 0) {
        return res.status(404).json({ message: 'No networks found where the user is an admin' });
      }

      res.status(200).json({ networks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  })





  server.post('/api/week-searches', async (req, res) => {
    const { profileId, search_text, start_date, end_date } = req.body;

    try {
      await promisePool.query(
        `INSERT INTO week_searches (profileId, search_text, start_date, end_date)
         VALUES (?, ?, ?, ?)`,
        [profileId, search_text, start_date, end_date]
      );

      res.status(201).json({ message: "Week search successfully created!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  server.get('/api/week-searches', async (req, res) => {
    try {
      const [result] = await promisePool.query(`
        SELECT week_searches.*, user_profiles.avatar, user_profiles.first_name, user_profiles.last_name, user_profiles.address1
        FROM week_searches
        JOIN user_profiles ON week_searches.profileId = user_profiles.id
        WHERE week_searches.is_active = 1
        ORDER BY start_date DESC
      `);
      res.status(200).json({ result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  server.get('/api/week-searches/:profileId', async (req, res) => {
    const profileId = req.params.profileId;
    const { twoWeeks } = req.query;
    let query = `SELECT * FROM week_searches WHERE profileId = ?`;
    const queryParams = [profileId];

    try {

      if (twoWeeks === 'true') {
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const formattedDate = twoWeeksAgo.toISOString().split('T')[0];

        query += ` AND start_date >= ?`;
        queryParams.push(formattedDate);
      }

      query += ` ORDER BY start_date DESC`;

      const [result] = await promisePool.query(query, queryParams);

      res.status(200).json({ result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  server.delete('/api/week-searches/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
      const [profile] = await promisePool.query(`SELECT id FROM user_profiles WHERE user_id = ?`, [userId])

      if (profile.length === 0) {
        res.status(404).json({ message: "Profile not found!" })
      }

      const [weekSearch] = await promisePool.query("SELECT * FROM week_searches WHERE id = ?", [id])

      if (weekSearch[0].profileId !== profile[0].id) {
        res.status(203).json({ message: "You don't have permission to do this!" })
      } else {
        await promisePool.query(`DELETE FROM week_searches WHERE id = ?`, [id]);
        res.status(200).json({ message: 'Week search deleted successfully' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  server.put('/api/week-searches/:id', async (req, res) => {
    const { id } = req.params;
    const { search_text, is_active } = req.body;

    if (!search_text) {
      return res.status(400).json({ error: 'Search text is required' });
    }

    try {
      const [weekSearch] = await promisePool.query(
        'SELECT * FROM week_searches WHERE id = ?',
        [id]
      );

      if (weekSearch.length === 0) {
        return res.status(404).json({ error: 'Week search not found' });
      }

      await promisePool.query(
        'UPDATE week_searches SET search_text = ?, is_active = ?, updated_at = NOW() WHERE id = ?',
        [search_text, is_active, id]
      );

      res.status(200).json({ message: 'Week search updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  server.post('/api/week-searches/:weekSearchId/comments', async (req, res) => {
    const { weekSearchId } = req.params;
    const { profileId, comment_text } = req.body;

    if (!profileId) {
      return res.status(400).json({ error: 'Profile ID is required' });
    }
    try {
      const [insertResult] = await promisePool.query(
        'INSERT INTO week_search_comments (week_search_id, profileId, comment_text) VALUES (?, ?, ?)',
        [weekSearchId, profileId, comment_text]
      );

      const [newComment] = await promisePool.query(
        `SELECT 
            wsc.*, 
            up.avatar,
            up.first_name,
            up.last_name
        FROM week_search_comments wsc
        JOIN user_profiles up ON wsc.profileId = up.id
        WHERE wsc.id = ?`,
        [insertResult.insertId]
      );

      res.status(201).json(newComment[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  server.get('/api/week-searches/:weekSearchId/comments', async (req, res) => {
    const { weekSearchId } = req.params;

    try {
      const [comments] = await promisePool.query(
        `SELECT 
            wsc.*, 
            up.avatar,
            up.first_name,
            up.last_name
         FROM week_search_comments wsc
         JOIN user_profiles up ON wsc.profileId = up.id
         WHERE wsc.week_search_id = ?
         ORDER BY wsc.created_at DESC`,
        [weekSearchId]
      );

      res.status(200).json(comments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  server.get('/api/search-week-searches', async (req, res) => {
    const { search = "", filter } = req.query;

    try {
      const currentDate = new Date().toISOString().split('T')[0];


      let dateCondition = '';
      if (filter === 'thisWeek') {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        const startDateStr = startDate.toISOString().split('T')[0];
        dateCondition = `start_date >= '${startDateStr}'`;
      } else if (filter === 'twoWeeks') {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 14);
        const startDateStr = startDate.toISOString().split('T')[0];
        dateCondition = `start_date >= '${startDateStr}'`;
      } else if (filter === 'thisMonth') {
        const startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 30);
        const startDateStr = startDate.toISOString().split('T')[0];
        dateCondition = `start_date >= '${startDateStr}'`;
      }


      let query = `
        SELECT week_searches.*, 
               user_profiles.avatar, 
               user_profiles.first_name, 
               user_profiles.last_name, 
               user_profiles.address1
        FROM week_searches
        JOIN user_profiles ON week_searches.profileId = user_profiles.id
        WHERE week_searches.is_active = 1 
        AND week_searches.search_text LIKE ?`;

      const queryParams = [`%${search}%`];

      if (dateCondition) {
        query += ` AND (${dateCondition})`;
      }

      query += ` ORDER BY week_searches.start_date DESC`;

      const [rows] = await promisePool.query(query, queryParams);

      res.status(200).json(rows);
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });





  server.post('/api/companies', async (req, res) => {
    const { profileId, company_name } = req.body;

    try {
      const [existingCompany] = await promisePool.query(
        `SELECT * FROM Companies WHERE profileId = ?`,
        [profileId]
      );

      if (existingCompany.length > 0) {
        return res.status(400).json({ error: "You can create only one company" });
      }

      const [insertResult] = await promisePool.query(
        `INSERT INTO Companies (profileId, company_name) VALUES (?, ?)`,
        [profileId, company_name]
      );

      const companyId = insertResult.insertId;

     
      await promisePool.query(
        `UPDATE user_profiles SET company = ? WHERE id = ?`,
        [companyId, profileId]
      );
      res.status(201).json({ message: "Company successfully created!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  server.put('/api/companies/:companyId', authenticateToken, async (req, res) => {
    const { companyId } = req.params;
    const { company_name, company_logo } = req.body;
    const userId = req.userId;

    try {
      const [profile] = await promisePool.query(`SELECT id FROM user_profiles WHERE user_id = ?`, [userId])

      if (profile.length === 0) {
        res.status(404).json({ message: "Profile not found!" })
      }

      const [company] = await promisePool.query("SELECT * FROM Companies WHERE id = ?", [companyId])

      if (company[0].profileId !== profile[0].id) {
        res.status(403).json({ message: "You don't have permission to do this!" })
      }

      await promisePool.query('UPDATE Companies SET company_name = ?, company_logo = ? WHERE id = ?', [company_name, company_logo, companyId]);
      return res.status(200).json({ message: 'Company edited successfully' });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  })

  server.get('/api/companies', async (req, res) => {
    try {
      const [companies] = await promisePool.query(`SELECT * FROM Companies`);
      res.status(200).json({ companies });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  server.get('/api/companies/:profileId', async (req, res) => {
    const { profileId } = req.params;
    console.log(profileId, "SERVER :profileId");
    try {
      const [userCompany] = await promisePool.query(`SELECT * FROM Companies WHERE profileId = ?`, [profileId]);

      if (userCompany.length === 0) {
        return res.status(200).json({ userCompany: null });
      }

      return res.status(200).json({ userCompany: userCompany[0] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  server.delete('/api/companies/:companyId', authenticateToken, async (req, res) => {
    const { companyId } = req.params;
    const userId = req.userId;

    try {
      const [profile] = await promisePool.query(`SELECT id FROM user_profiles WHERE user_id = ?`, [userId])

      if (profile.length === 0) {
        res.status(404).json({ message: "Profile not found!" })
      }

      const [company] = await promisePool.query("SELECT * FROM Companies WHERE id = ?", [companyId])

      if (company[0].profileId !== profile[0].id) {
        res.status(403).json({ message: "You don't have permission to do this!" })
      } else {
        await promisePool.query(`DELETE FROM Companies WHERE id = ?`, [companyId]);
        res.status(200).json({ message: 'Company deleted successfully' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
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
