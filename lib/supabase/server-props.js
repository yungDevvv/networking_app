// // lib/supabase/server-props.js
// import { createServerClient, serializeCookieHeader } from '@supabase/ssr';

// export function createClient(ctx) {
//   const { req, res } = ctx;

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//     {
//       cookies: {
//         getAll() {
//           return Object.keys(req.cookies).map((name) => ({
//             name,
//             value: req.cookies[name] || '',
//           }));
//         },
//         setAll(cookiesToSet) {
//           res.setHeader(
//             'Set-Cookie',
//             cookiesToSet.map(({ name, value, options }) =>
//               serializeCookieHeader(name, value, options)
//             )
//           );
//         },
//       },
//     }
//   );

//   return supabase;
// }


import { createServerClient, serializeCookieHeader } from '@supabase/ssr'

export function createClient({ req, res }) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return Object.keys(req.cookies).map((name) => ({ name, value: req.cookies[name] || '' }))
        },
        setAll(cookiesToSet) {
          res.setHeader(
            'Set-Cookie',
            cookiesToSet.map(({ name, value, options }) =>
              serializeCookieHeader(name, value, options)
            )
          )
        },
      },
    }
  )

  return supabase
}