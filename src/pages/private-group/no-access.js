import Head from "next/head";

export default function NoAccess() {
   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Head> 
        <title>Access Denied</title>
        <meta name="description" content="Access Denied Page" />
      </Head>
      <div className="text-center bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-700 mb-6">
          You do not have permission to view this page because you are not a member of the private group.
        </p>
        <a
          href="/"
          className="inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Go to Home
        </a>
      </div>
    </div>
   )
}