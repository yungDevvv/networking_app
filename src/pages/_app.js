// pages/_app.js
import '../styles/globals.css'
import { useRouter } from 'next/router';
import { appWithTranslation } from 'next-i18next';
import { NextUIProvider } from "@nextui-org/system";
import AuthLayout from '../components/layouts/AuthLayout';
import MainLayout from '../components/layouts/MainLayout';
import { ModalProvider } from '../context/ModalProvider';
import { AllModals } from '../components/modals/all_modals';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname } = router;
  console.log(pathname)
  // const isAuthPage = !['/auth/login', '/auth/register', '/auth/reset-password', '/auth/update-password', '/auth/profile', '/profile/*'].includes(pathname);
  const isAuthPage = !['/auth/login', '/auth/register', '/auth/reset-password', '/auth/update-password', '/auth/profile', '/profile/[hashId]', '/private-group/no-access'].includes(pathname);
  
  return (
    // <NextUIProvider>
    <>
      {!isAuthPage ? (
        <AuthLayout>
          <Component {...pageProps} />
        </AuthLayout>
      ) : (
        <MainLayout {...pageProps}>
          <ModalProvider>
            <Component {...pageProps} />
            <AllModals {...pageProps} />
          </ModalProvider>
        </MainLayout>
      )}
    </>
  );
}

export default appWithTranslation(MyApp);
