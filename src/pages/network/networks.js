import { CircleArrowRight, SquarePlus } from "lucide-react";
import { checkAuth } from "../../lib/check-auth";
import { useModal } from "../../context/ModalProvider";
import { getUserNetworks } from "../../lib/networks";
import Link from "next/link";
import { useTranslation } from "next-i18next";

export const getServerSideProps = async (ctx) => {
   const { props } = await checkAuth(ctx);
   const networks = await getUserNetworks(props.profile.id);

   return { props: { ...props, ...networks } }
};


export default function MyNetworks({ networks }) {
   const { openModal } = useModal();
   const {t} = useTranslation("common");

   return (
      <div>
         <div className="w-full flex justify-between mb-4">
            <h1 className="text-xl font-bold">{t("my_networks")}</h1>
            <button type="button" onClick={() => openModal("create-network")}>
               <SquarePlus className="text-green-500" />
            </button>
         </div>
         <div className="space-y-6 w-full">
            {networks.length !== 0
               ? networks.map((network) => (
                  <Link
                     href={"/network/" + network.id}
                     key={network.id}
                     className="bg-white w-full border rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow duration-300 flex items-center justify-between"
                  >
                     <h3 className="text-lg font-semibold">{network.name}</h3>
                     <button>
                        <CircleArrowRight strokeWidth={1.25} />
                     </button>
                  </Link>
               ))
               : "Non of your networks found!"
            }
         </div>
      </div>
   )
}

