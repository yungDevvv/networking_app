const express = require('express');
const next = require('next');
const session = require('express-session');
const { auth } = require('express-openid-connect');

const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // server.use(
  //   session({
  //     secret: 'bc229d03e5817d8cdd4723de631374a131535d006d1a0f51fcbb03426f01b2ed',
  //     resave: false,
  //     saveUninitialized: true,
  //     cookie: {
  //       secure: true, // Используйте secure cookies в продакшене
  //       httpOnly: true,
  //       maxAge: 24 * 60 * 60 * 1000, // 24 часа
  //       transient: true
  //     },
  //   })
  // );

  // server.use( 
  //   auth({
  //     authRequired: false,
  //     auth0Logout: true,
  //     clientSecret: "ls9Jni9BHiUjFHQ5EqSwhoYpMKGUNnw3tkvSGNBtnIiUi7gtKopyXwMjAZrPY5ih",
  //     secret: 'bc229d03e5817d8cdd4723de631374a131535d006d1a0f51fcbb03426f01b2ed',
  //     baseURL: 'https://nodetest.crossmedia.fi',
  //     clientID: 'Brc0da1FYmzvclCviJEiNflG1calszDb',
  //     issuerBaseURL: 'https://dev-l5xx8ztzuc3gx85b.us.auth0.com',
  //     authorizationParams: {
  //       scope: 'openid profile email',
  //     },
  //     session: {
  //       rolling: true, // Обновляйте срок действия сессии при активности
  //       cookie: {
  //         transient: false
  //       }
  //     },
  //   })
  // );
    // Обработка выхода
    // server.get('/asd/logout', (req, res) => {
      
    //   req.session.destroy((err) => {
    //     if (err) {
    //       console.error('Ошибка при уничтожении сессии:', err);
    //     } else {
    //       console.log("SESSION destroy")
    //       res.redirect('https://dev-l5xx8ztzuc3gx85b.us.auth0.com/v2/logout?client_id=Brc0da1FYmzvclCviJEiNflG1calszDb&returnTo=https://nodetest.crossmedia.fi/api/auth/login');
    //     }
    //   });
    // });
    // server.get('/api/auth/logout', (req, res) => {
    //   console.log("'/api/auth/logout', SERVER API")
    //   console.log(req.session)
    //   req.session.destroy((err) => {
    //     if (err) {
    //       console.error('Ошибка при уничтожении сессии:', err);
    //       return res.status(500).json({ error: 'Ошибка при выходе' });
    //     }
    //     console.log(req.session, "REQ.SESSION AFTER DELETE")
    //     res.clearCookie('connect.sid');
    //     res.clearCookie('appSession'); // Очистка cookies
    //     res.redirect('https://dev-l5xx8ztzuc3gx85b.us.auth0.com/v2/logout?client_id=Brc0da1FYmzvclCviJEiNflG1calszDb&returnTo=https://nodetest.crossmedia.fi');
    //   });
    // });
    
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});

// const express = require('express');
// const next = require('next');
// const session = require('express-session');
// const { auth, requiresAuth } = require('express-openid-connect');

// const dev = true; // Убедитесь, что переменная dev установлена правильно в зависимости от вашей среды
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = express();

//   // Настройка сессий
//   server.use(
//     session({
//       secret: 'fMoVMWJgHkKyUe40q502WdVWKxCFcOSGjMDk1KVrQcKCb&state=eyJyZXR1cm5UbyI6Imh0dHBzOi8vbm9kZXRlc3QuY3Jvc3NtZWRpYS5maS8ifQasdasd', // Замените на секретный ключ
//       resave: false,
//       saveUninitialized: true,
//       cookie: {
//         secure: false, // Используйте secure cookies в продакшене
//         httpOnly: true,
//         maxAge: 24 * 60 * 60 * 1000, // 24 часа
//       },
//     })
//   );

//   // Настройка Auth0
//   server.use(
//     auth({
//       authRequired: false,
//       auth0Logout: true,
//       secret: 'ls9Jni9BHiUjFHQ5EqSwhoYpMKGUNnw3tkvSGNBtnIiUi7gtKopyXwMjAZrPY5ih', // Замените на секретный ключ
//       baseURL: 'https://nodetest.crossmedia.fi', // Измените на ваш базовый URL
//       clientID: 'Brc0da1FYmzvclCviJEiNflG1calszDb',
//       issuerBaseURL: 'https://dev-l5xx8ztzuc3gx85b.us.auth0.com',
//       authorizationParams: {
//         scope: 'openid profile email',
//       },
//       session: {
//         rolling: true, // Обновляйте срок действия сессии при активности
//       },
//     })
//   );

//   // Пример защищенной страницы
//   server.get('/profile', requiresAuth(), (req, res) => {
//     return app.render(req, res, '/profile', req.query);
//   });

//   // Основной обработчик всех запросов
//   server.all('*', (req, res) => {
//     return handle(req, res);
//   });

//   // Запуск сервера
//   server.listen(3000, (err) => {
//     if (err) throw err;
//     console.log('> Ready on http://localhost:3000');
//   });
// });
