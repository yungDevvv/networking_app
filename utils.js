const jwt = require("jsonwebtoken")
const mysql = require('mysql2');
const promisePool = require('./db');

const authenticateToken = async (req, res, next) => {
   const authHeader = req.headers['authorization'];
  
   const token = authHeader && authHeader.split(' ')[1];

   if (!token) {
      return res.status(401).json({ message: 'Access token required' });
   }


   jwt.verify(token, 'RC4HUPq4Tqivyn0m+ocQyiR50pvxX5uiY1pYZq/JP494ZomEsoauzqFyCFoIv1RZOSQVwUyzAjuybVyaQ2MVhA==', async (err, user) => {
      if (err) {
         return res.status(403).json({ message: 'Invalid token' });
      }

      const [profile] = await promisePool.query(`SELECT id, first_name, last_name FROM user_profiles WHERE user_id = ?`, [user.sub])

      if (profile.length === 0) {
         res.redirect('/auth/profile');
         return;
      }
      
      req.user = {
         user_id: user.sub,
         profileId: profile[0].id,
         first_name: profile[0].first_name,
         last_name: profile[0].last_name
      }

      next();
   });
};

const formatProfile = (profile) => {
   const profileData = {
      id: profile.id,
      user_id: profile.user_id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      email_address: profile.email_address,
      title: profile.title,
      phone: profile.phone,
      address1: profile.address1,
      website: profile.website,
      searching: profile.searching,
      offering: profile.offering,
      notice: profile.notice,
      avatar: profile.avatar,
      businessNetworks: profile.businessNetworks,
      privacy_settings: profile.privacy_settings,
      company: profile.company_id !== null 
      ? {
        id: profile.company_id,
        company_name: profile.company_name,
        company_logo: profile.company_logo,
      }
      : null 
    }

    return profileData;
}

const formatForMySQL = (dateString) => {
   const date = new Date(dateString);
   
   if (isNaN(date.getTime())) {
       throw new Error("Invalid date format");
   }
   
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const day = String(date.getDate()).padStart(2, '0');
   const hours = String(date.getHours()).padStart(2, '0');
   const minutes = String(date.getMinutes()).padStart(2, '0');
   const seconds = String(date.getSeconds()).padStart(2, '0');

   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

module.exports = {authenticateToken, formatProfile, formatForMySQL};