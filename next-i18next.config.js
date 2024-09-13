const path = require('path');
module.exports = {
   i18n: {
     locales: ['fi', 'en'],
     defaultLocale: 'fi',   
   },
   localePath: path.resolve('./public/locales'),
  //  react: { useSuspense: false },//this line
 };
