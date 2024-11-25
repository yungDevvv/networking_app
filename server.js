const express = require('express');
const next = require('next');
const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();
const { hashEncodeId, hashDecodeId } = require('./hashId');
const { authenticateToken, formatProfile, formatForMySQL } = require('./utils');
const promisePool = require('./db');

app.prepare().then(() => {
  const server = express();
  server.use(express.json({ limit: '10mb' }));


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
      const [user] = await promisePool.query(`SELECT up.*, 
              c.company_name, 
              c.company_logo, 
              c.id AS company_id 
        FROM user_profiles up
        LEFT JOIN Companies c ON up.company = c.id
        WHERE up.id = ?`, [id]);

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
                SELECT up.*, 
       c.company_name,
       c.company_logo
FROM user_profiles up
LEFT JOIN Companies c ON up.company = c.id
WHERE up.address1 LIKE ? OR
      up.email_address LIKE ? OR
      up.first_name LIKE ? OR
      up.last_name LIKE ? OR
      up.notice LIKE ? OR
      up.offering LIKE ? OR
      up.phone LIKE ? OR
      up.searching LIKE ? OR
      up.title LIKE ? OR
      up.website LIKE ? OR
      c.company_name LIKE ?;
      `;
      const params = Array(11).fill(`%${searchTerm}%`);

      const [rows] = await promisePool.query(sql, params);

      const profiles = rows.map(item => {
        return formatProfile(item);
      })

      res.status(200).json(profiles);
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

  server.get('/api/users', async (req, res) => {
    try {
      const [result] = await promisePool.query(`
        SELECT up.*, 
          c.company_name, 
          c.company_logo, 
          c.id AS company_id 
        FROM user_profiles up
        LEFT JOIN Companies c ON up.company = c.id`);

      const profiles = result.map(item => {
        return formatProfile(item);
      })


      res.status(200).json({ users: profiles })
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
      const [result] = await promisePool.query(
        `SELECT up.*, 
              c.company_name, 
              c.company_logo, 
              c.id AS company_id 
        FROM user_profiles up
        LEFT JOIN Companies c ON up.company = c.id
        WHERE up.user_id = ?`,
        [user_id]
      );



      if (result.length > 0) {
        const profile = formatProfile(result[0]);
        return res.status(200).json({ profile: { ...profile } });
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
                  SELECT user_profiles.*, 
                NetworkMember.role, 
                NetworkMember.profileId, 
                Companies.company_name, 
                Companies.company_logo
          FROM NetworkMember
          JOIN user_profiles ON NetworkMember.profileId = user_profiles.id
          LEFT JOIN Companies ON user_profiles.company = Companies.id
          WHERE NetworkMember.networkId = ?;
      `, [networkId]);

      res.status(200).json({ members });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  server.delete('/api/networks/:networkId/members/:memberProfileId', authenticateToken, async (req, res) => {
    const { networkId, memberProfileId } = req.params;
    const { profileId } = req.user;

    if (!profileId || !memberProfileId || !networkId) {
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
        [memberProfileId, networkId]
      );

      if (!memberToRemove) {
        return res.status(404).json({ error: 'Member not found in this network.' });
      }

      await promisePool.query('DELETE FROM NetworkMember WHERE profileId = ? AND networkId = ?', [memberProfileId, networkId]);

      return res.status(200).json({ message: 'Member removed successfully.' });
    } catch (error) {
      console.error('Error removing member:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  server.delete('/api/networks/:networkId/leave', authenticateToken, async (req, res) => {
    const { networkId } = req.params;
    const { profileId } = req.user;

    try {
      await promisePool.query(`DELETE FROM NetworkMember WHERE profileId = ? AND networkId = ?`, [profileId, networkId]);
      return res.status(200).json({ message: 'You successfully leaved from network!' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
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
        return res.status(200).json({ networks: [] });
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
        [profileId, search_text, formatForMySQL(start_date), formatForMySQL(end_date)]
      );

      res.status(201).json({ message: "Week search successfully created!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  server.get('/api/week-searches', async (req, res) => {
    console.log("SERVER ENDPOINT CHECK")
    const count = req.query?.count ? req.query.count : false;
   
    try {
      const [result] = await promisePool.query(`
        SELECT week_searches.*, user_profiles.avatar, user_profiles.first_name, user_profiles.last_name, user_profiles.address1
        FROM week_searches
        JOIN user_profiles ON week_searches.profileId = user_profiles.id
        WHERE week_searches.is_active = 1
        ORDER BY start_date DESC
        ${count ? `LIMIT ${count}` : ''}
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

      query += ` ORDER BY created_at DESC`;

      const [result] = await promisePool.query(query, queryParams);

      res.status(200).json({ result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  server.delete('/api/week-searches/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { profileId } = req.user;

    try {
      const [weekSearch] = await promisePool.query("SELECT * FROM week_searches WHERE id = ?", [id])

      if (weekSearch[0].profileId !== profileId) {
        return res.status(203).json({ message: "You don't have permission to do this!" })
      }

      await promisePool.query(`DELETE FROM week_searches WHERE id = ?`, [id]);
      return res.status(200).json({ message: 'Week search deleted successfully' });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  server.put('/api/week-searches/:id', async (req, res) => {
    const { id } = req.params;
    const { search_text, is_active, end_date} = req.body;

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
        'UPDATE week_searches SET search_text = ?, is_active = ?, start_date = NOW(), updated_at = NOW(), end_date = ? WHERE id = ?',
        [search_text, is_active, formatForMySQL(end_date), id]
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

      query += ` ORDER BY week_searches.created_at DESC`;

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
    const { profileId } = req.user;

    try {
      const [company] = await promisePool.query("SELECT * FROM Companies WHERE id = ?", [companyId])

      if (company[0].profileId !== profileId) {
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
    const { profileId } = req.user;

    try {
      const [company] = await promisePool.query("SELECT * FROM Companies WHERE id = ?", [companyId])

      if (company[0].profileId !== profileId) {
        return res.status(403).json({ message: "You don't have permission to do this!" })
      }

      await promisePool.query(`DELETE FROM Companies WHERE id = ?`, [companyId]);

      return res.status(200).json({ message: 'Company deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }

  });







  server.get("/api/private-groups", async (req, res) => {
    try {
      const [rows] = await promisePool.query("SELECT * FROM PrivateGroup");
      res.status(200).json(rows)
    } catch (error) {
      res.status(500).json({ message: "Internal Error: " + error.message })
    }
  })

  server.get("/api/private-groups/:privateGroupId", async (req, res) => {
    const { privateGroupId } = req.params;

    try {
      const [group] = await promisePool.query("SELECT * FROM PrivateGroup WHERE id = ?", [privateGroupId]);
      res.status(200).json({ group })
    } catch (error) {
      res.status(500).json({ message: "Internal Error: " + error.message })
    }
  })

  server.get("/api/private-groups/:privateGroupId/members", async (req, res) => {
    const { privateGroupId } = req.params;

    try {
      const [members] = await promisePool.query(`
        SELECT user_profiles.*, 
                PrivateGroupMember.role, 
                PrivateGroupMember.profileId, 
                Companies.company_name, 
                Companies.company_logo
          FROM PrivateGroupMember
          JOIN user_profiles ON PrivateGroupMember.profileId = user_profiles.id
          LEFT JOIN Companies ON user_profiles.company = Companies.id
          WHERE PrivateGroupMember.privateGroupId = ?;`, [privateGroupId]);

      return res.status(200).json({ members })
    } catch (error) {
      return res.status(500).json({ message: "Internal Error: " + error.message })
    }
  })

  server.post("/api/private-groups", authenticateToken, async (req, res) => {
    const { title, description } = req.body;
    const { profileId } = req.user;

    try {
      const [insertResult] = await promisePool.query(
        `INSERT INTO PrivateGroup (profileId, title, description, founder) VALUES (?, ?, ?, ?)`,
        [profileId, title, description, profileId]
      );

      const privateGroupId = insertResult.insertId;

      await promisePool.query(`
      INSERT INTO PrivateGroupMember (role, profileId, privateGroupId)
      VALUES ('ADMIN', ?, ?)
    `, [profileId, privateGroupId]);

      res.status(201).json({ message: 'Network created successfully', privateGroupId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error then creating network', error });
    }
  })

  server.put('/api/private-groups/:privateGroupId', authenticateToken, async (req, res) => {
    const { privateGroupId } = req.params;
    const { title, description } = req.body;
    const { profileId } = req.user;

    if (!profileId || !privateGroupId) {
      return res.status(400).json({ error: 'Profile ID, Group ID are required.' });
    }

    try {
      const [adminCheck] = await promisePool.query(
        'SELECT role FROM PrivateGroupMember WHERE profileId = ? AND privateGroupId = ?',
        [profileId, privateGroupId]
      );

      if (!adminCheck || adminCheck[0].role !== 'ADMIN') {
        return res.status(403).json({ error: 'You do not have permission to remove members.' });
      }

      await promisePool.query('UPDATE PrivateGroup SET title = ?, description = ? WHERE id = ?', [title, description, privateGroupId]);

      return res.status(200).json({ message: 'Group edited successfully' });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  })

  server.delete('/api/private-groups/:privateGroupId', authenticateToken, async (req, res) => {
    const { privateGroupId } = req.params;
    const { profileId } = req.user;

    if (!profileId || !privateGroupId) {
      return res.status(400).json({ error: 'Profile ID, Group ID are required.' });
    }

    try {
      const [group] = await promisePool.query(
        'SELECT founder FROM PrivateGroup WHERE id = ?',
        [privateGroupId]
      );

      if (group[0].founder !== profileId) {
        return res.status(403).json({ error: 'You do not have permission to delete this group.' });
      }

      await promisePool.query('DELETE FROM PrivateGroup WHERE id = ?', [privateGroupId]);

      return res.status(200).json({ message: 'Group deleted successfully' });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  })

  server.get('/api/private-groups/admin/:id', authenticateToken, async (req, res) => {
    const { profileId } = req.user;

    try {
      const [groups] = await promisePool.query(`
        SELECT pg.* 
        FROM PrivateGroup pg
        INNER JOIN PrivateGroupMember pgm ON pg.id = pgm.privateGroupId
        WHERE pgm.profileId = ? AND pgm.role = 'ADMIN'
      `, [profileId]);

      return res.status(200).json(groups);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  })

  server.get('/api/private-groups/user/:id', authenticateToken, async (req, res) => {
    const { profileId } = req.user;

    try {
      const [groups] = await promisePool.query(`
        SELECT pg.* 
        FROM PrivateGroup pg
        INNER JOIN PrivateGroupMember pgm ON pg.id = pgm.privateGroupId
        WHERE pgm.profileId = ?
      `, [profileId]);

      return res.status(200).json({ groups });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  })

  server.get('/api/private-groups/:privateGroupId/access', authenticateToken, async (req, res) => {
    const { profileId } = req.user;
    const { privateGroupId } = req.params;

    try {
      const [rows] = await promisePool.execute(
        `SELECT COUNT(*) AS member_count 
           FROM PrivateGroupMember 
           WHERE profileId = ? AND privateGroupId = ?`,
        [profileId, privateGroupId]
      );

      const memberCount = rows[0].member_count;

      if (memberCount > 0) {
        res.json({ access: true });
      } else {
        res.json({ access: false });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error', err });
    }
  })

  server.delete('/api/private-groups/:privateGroupId/members/:memberProfileId', authenticateToken, async (req, res) => {
    const { privateGroupId, memberProfileId } = req.params;
    const { profileId } = req.user;

    if (!profileId || !memberProfileId || !privateGroupId) {
      return res.status(400).json({ error: 'Profile ID, Member ID, and Network ID are required.' });
    }

    try {

      const [adminCheck] = await promisePool.query(
        'SELECT role FROM PrivateGroupMember WHERE profileId = ? AND privateGroupId = ?',
        [profileId, privateGroupId]
      );

      if (!adminCheck || adminCheck[0].role !== 'ADMIN') {
        return res.status(403).json({ error: 'You do not have permission to remove members.' });
      }

      const [memberToRemove] = await promisePool.query(
        'SELECT * FROM PrivateGroupMember WHERE profileId = ? AND privateGroupId = ?',
        [memberProfileId, privateGroupId]
      );

      if (!memberToRemove) {
        return res.status(404).json({ error: 'Member not found in this group.' });
      }

      await promisePool.query('DELETE FROM PrivateGroupMember WHERE profileId = ? AND privateGroupId = ?', [memberProfileId, privateGroupId]);

      return res.status(200).json({ message: 'Member removed successfully.' });
    } catch (error) {
      console.error('Error removing member:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  server.put('/api/private-groups/:privateGroupId/members/:memberProfileId/role', authenticateToken, async (req, res) => {
    const { privateGroupId, memberProfileId } = req.params;
    const { currentRole } = req.body;
    const { profileId } = req.user;

    if (!privateGroupId || !memberProfileId || !currentRole) {
      return res.status(400).json({ error: 'Private Group ID, Profile ID, current role, and new role are required.' });
    }

    const newRole = currentRole === "GUEST" ? "ADMIN" : "GUEST"


    try {
      const [founderCheck] = await promisePool.query(
        'SELECT founder FROM PrivateGroup WHERE id = ?',
        [privateGroupId]
      );

      if (!founderCheck || founderCheck.length === 0) {
        return res.status(404).json({ error: 'Group not found.' });
      }

      const founderProfileId = founderCheck[0].founder;

      if (memberProfileId === founderProfileId) {
        return res.status(403).json({ error: 'Cannot change the role of the group founder.' });
      }

      const [adminCheck] = await promisePool.query(
        'SELECT role FROM PrivateGroupMember WHERE profileId = ? AND privateGroupId = ?',
        [profileId, privateGroupId]
      );

      if (!adminCheck || adminCheck[0].role !== 'ADMIN') {
        return res.status(403).json({ error: 'You do not have permission to change roles.' });
      }

      await promisePool.query(
        'UPDATE PrivateGroupMember SET role = ? WHERE profileId = ? AND privateGroupId = ?',
        [newRole, memberProfileId, privateGroupId]
      );

      return res.status(200).json({ message: 'User role updated successfully.' });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  server.delete('/api/private-groups/:privateGroupId/leave', authenticateToken, async (req, res) => {
    const { privateGroupId } = req.params;
    const { profileId } = req.user;

    try {
      const [adminCheck] = await promisePool.query(
        'SELECT role FROM PrivateGroupMember WHERE profileId = ? AND privateGroupId = ?',
        [profileId, privateGroupId]
      );

      if (!adminCheck || adminCheck[0].role !== 'ADMIN') {
        return res.status(403).json({ error: 'You do not have permission to leave.' });
      }

      await promisePool.query(`DELETE FROM PrivateGroupMember WHERE profileId = ? AND privateGroupId = ?`, [profileId, privateGroupId]);

      return res.status(200).json({ message: 'You successfully leaved from group!' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });






  server.post('/api/invite', authenticateToken, async (req, res) => {
    const { recipientId, groupId } = req.body;
    const { first_name, last_name, profileId } = req.user;
    if (!recipientId || !groupId) {
      return res.status(400).json({ error: 'Не указаны все параметры' });
    }

    try {
      const inviteLink = `https://nodetest.crossmedia.fi/api/join/${groupId}?profileId=${recipientId}`;


      const [result] = await promisePool.query(
        `INSERT INTO Notifications (recipientId, senderId, privateGroupId, inviteLink, message)
       VALUES (?, ?, ?, ?, ?)`,
        [recipientId, profileId, groupId, inviteLink, `${first_name} ${last_name} is invited you to private group!`]
      );
      res.status(200).json({ message: 'Приглашение отправлено' });
    } catch (err) {
      console.error('Ошибка при создании уведомления:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  });


  server.get('/api/notifications/:recipientId', async (req, res) => {
    const { recipientId } = req.params;

    try {
      const [notifications] = await promisePool.query(
        `SELECT * FROM Notifications WHERE recipientId = ? AND isRead = 0 ORDER BY created_at DESC`,
        [recipientId]
      );

      res.status(200).json(notifications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error while getting notifications' });
    }
  });


  server.patch('/api/notifications/:id/read', async (req, res) => {
    const { id } = req.params;

    try {
      await promisePool.query('UPDATE Notifications SET isRead = TRUE WHERE id = ?', [id]);
      res.status(200).json({ message: 'Notification marked as read' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating notification status' });
    }
  });


  server.get('/api/join/:groupId', async (req, res) => {
    const { groupId } = req.params;
    const { profileId } = req.query;

    if (!groupId || !profileId) {
      return res.status(400).json({ error: 'No groupId or Profile Id provided' });
    }

    try {
      const [groupResult] = await promisePool.query(
        `SELECT * FROM PrivateGroup WHERE id = ?`,
        [groupId]
      );

      if (groupResult.length === 0) {
        return res.status(404).json({ error: 'Group not found' });
      }

      const [memberCheck] = await promisePool.query(
        `SELECT * FROM PrivateGroupMember WHERE profileId = ? AND privateGroupId = ?`,
        [profileId, groupId]
      );

      if (memberCheck.length > 0) {
        return res.redirect(302, '/?alreadyIn=true');
      }


      await promisePool.query(
        `INSERT INTO PrivateGroupMember (profileId, privateGroupId, role) 
       VALUES (?, ?, 'GUEST')`,
        [profileId, groupId]
      );


      res.redirect('/private-group/' + groupId);

    } catch (err) {
      console.error('Ошибка при присоединении к группе:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
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
