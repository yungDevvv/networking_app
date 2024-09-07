// context/ModalContext.js
import {useState, useEffect } from 'react';
import ChooseNetworkModal from './choose-network-modal';
import CreateNetworkModal from './create-network-modal';
import { useModal } from '../../context/ModalProvider';
// import { checkAuth } from '../../lib/check-auth';

// export const getServerSideProps = async (ctx) => {
//   return await checkAuth(ctx);
// };

export const AllModals = ({profile}) => {
  const [isMounted, setIsMounted] = useState(false);
  const {modals} = useModal();
 
  useEffect(() => {
    setIsMounted(true);
  }, [])

  if (!isMounted) return null;
  
  return (
    <>
      {modals['choose-network'] && <ChooseNetworkModal userProfileId={profile.id} />}
      {modals['create-network'] && <CreateNetworkModal profileId={profile.id} />}
    </>
  );
};