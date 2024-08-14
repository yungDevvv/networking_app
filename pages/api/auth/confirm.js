import { createClient } from '../../../lib/supabase/server-props'; // Исправьте путь при необходимости

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).setHeader('Allow', 'GET').end();
    return;
  }

  const supabase = createClient({ req, res });
  const { token_hash, type } = req.query;

  if (!token_hash || !type) {
    res.status(400).json({ error: 'Missing parameters' });
    return;
  }

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  });

  if (error) {
    res.status(400).json({ error: 'Invalid or expired token' });
    return;
  }

  res.redirect('/');
}
