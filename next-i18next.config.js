const path = require('path');
module.exports = {
   i18n: {
     locales: ['fi', 'en'],
     defaultLocale: 'fi',   
     localeDetection: false
   },
   localePath: path.resolve('./public/locales'),
    react: { useSuspense: false },//this line
 };
