// pages/api/session.js
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ session });
}
