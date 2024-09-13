// lib/withTranslation.js
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export function withTranslation(page) {
  return {
    ...page,
    getServerSideProps: async (context) => {
      const locale = context.locale || 'en';
      const translations = await serverSideTranslations(locale, ['common']);

      if (page.getServerSideProps) {
        const originalGetServerSideProps = page.getServerSideProps;
        const originalProps = await originalGetServerSideProps(context);

        return {
          props: {
            ...originalProps.props,
            ...translations,
          },
        };
      }

      return {
        props: {
          ...translations,
        },
      };
    },
  };
}
