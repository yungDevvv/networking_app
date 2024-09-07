import createClient from "../../../lib/supabase/api";


export default async function handler(req, res) {
   const { code, next } = req.query;
 
   if (code) {
      const supabase = createClient(req, res);
 
     const { error } = await supabase.auth.exchangeCodeForSession(code);
 
     if (!error) {
       const redirectTo = next ? decodeURIComponent(next) : '/';
       res.redirect(307, redirectTo);
     } else {
       res.redirect(307, '/auth/auth-code-error');
     }
   } else {
     res.status(400).json({ error: 'Code not provided' });
   }
 }