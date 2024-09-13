const jwt = require("jsonwebtoken")
const mysql = require('mysql2');

 const authenticateToken = (req, res, next) => {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];

   if (!token) {
      return res.status(401).json({ message: 'Access token required' });
   }

   jwt.verify(token, 'RC4HUPq4Tqivyn0m+ocQyiR50pvxX5uiY1pYZq/JP494ZomEsoauzqFyCFoIv1RZOSQVwUyzAjuybVyaQ2MVhA==', (err, user) => {
      if (err) {
         return res.status(403).json({ message: 'Invalid token' });
      }
      
      req.userId = user.sub;
      
      next();
   });
};

module.exports = authenticateToken;