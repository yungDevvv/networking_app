// import { createClient } from '../../../lib/supabase/server-props'; 

// export default async function handler(req, res) {
//   if (req.method !== 'GET') {
//     res.status(405).setHeader('Allow', 'GET').end();
//     return;
//   }

//   const supabase = createClient({ req, res });
//   const { token_hash, type } = req.query;

//   if (!token_hash || !type) {
//     res.status(400).json({ error: 'Missing parameters' });
//     return;
//   }

//   const { error } = await supabase.auth.verifyOtp({
//     type,
//     token_hash,
//   });

//   if (error) {
//     res.status(400).json({ error: 'Invalid or expired token' });
//     return;
//   }

//   res.redirect('/');
// }

import createClient from '../../../lib/supabase/api'

function stringOrFirstString(item) {
  return Array.isArray(item) ? item[0] : item
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).appendHeader('Allow', 'GET').end()
    return
  }

  const queryParams = req.query
  const token_hash = stringOrFirstString(queryParams.token_hash)
  const type = stringOrFirstString(queryParams.type)

  let next = '/error'

  if (token_hash && type) {
    const supabase = createClient(req, res)
    const { error } = await supabase.auth.verifyOtp({
      type: type,
      token_hash,
    })
    if (error) {
      console.error(error)
    } else {
      // next = stringOrFirstString(queryParams.next) || '/'
      next = "/auth/profile"
    }
  }

  res.redirect(next)
}