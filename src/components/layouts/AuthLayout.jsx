const AuthLayout = ({ children }) => {
   return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
         {children}
      </div>
   )
}

export default AuthLayout;