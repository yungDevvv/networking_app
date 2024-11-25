// pages/api/invite.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient("https://arzprbxlhvfnbwpztmpo.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyenByYnhsaHZmbmJ3cHp0bXBvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMzQ3NDM4MCwiZXhwIjoyMDM5MDUwMzgwfQ.GdfFqK8jxc5f5sL_xRnS97oV1Xr-G92kydOUCBedQeg", {
   auth: {
      autoRefreshToken: false,
      persistSession: false
   }
});

export default async function handler(req, res) {
   // Разрешаем только POST запросы
   console.log(process.env.NEXT_PUBLIC_SUPABASE_URL, "ASDASDASDASDASDASDASDASDASDASDASD")
   console.log(process.env.SUPABASE_SERVICE_ROLE_KEY, "ASDASDASDASDASDASDASDASDASDASDASD")
   if (req.method === 'POST') {
     const { email } = req.body;
 
     if (!email) {
       return res.status(400).json({ error: 'Email is required' });
     }
 
     try {
       // Используем admin метод для отправки приглашения
       const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);
 
       if (error) {
         return res.status(400).json({ error: error.message });
       }
 
       return res.status(200).json({ message: 'Invitation sent successfully' });
     } catch (err) {
       return res.status(500).json({ error: 'Server error' });
     }
   } else {
     // Если метод не POST
     res.setHeader('Allow', ['POST']);
     return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
   }
 }