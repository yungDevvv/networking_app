// pages/api/session.js
import { createClient } from '../../lib/supabase/server-props';

export default async function handler(ctx) {
  const supabase = createClient(ctx);
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    return ctx.res.status(500).json({ error: error.message });
  }

  ctx.res.status(200).json({ session });
}
