import AccountInfo from "@/components/account/AccountInfo";
import Addresses from "@/components/account/Addresses";
import Orders from "@/components/account/Orders";
import Preferences from "@/components/account/Preferences";
import RaffleHistory from "@/components/account/RaffleHistory";
import Rewards from "@/components/account/Rewards";
import Wishlist from "@/components/account/Wishlist";
import Breadcumb from "@/components/breadcumb";
import MakerDashboard from "@/components/maker/MakerDashboard";
import MakerRaffle from "@/components/maker/MakerRaffle";
import UserSideMenu from "@/components/userSideMenu";
import { BreadcumbTitle } from "@/constants";
import { EnumSideMenu } from "@/constants/Enums";
import { useAuth } from "@/context/Auth";
import { Base } from "@/templates/Base";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Divider } from "@mui/material";

const COMPONENT_MAP: Record<string, React.ReactNode> = {
  [EnumSideMenu.DETAIL]: <AccountInfo />,
  [EnumSideMenu.ORDERS]: <Orders />,
  wishlist: <Wishlist />,
  [EnumSideMenu.ADDRESSES]: <Addresses />,
  raffleHistory: <RaffleHistory />,
  rewards: <Rewards />,
  preferences: <Preferences />,
  makerDashboard: <MakerDashboard />,
  makerRaffle: <MakerRaffle />,
};

const AccountPage: React.FC = () => {
  const auth = useAuth();
  const { isAuthenticated } = auth || {};
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState<string>(EnumSideMenu.DETAIL);

  useEffect(() => {
    if (!router.isReady) return;

    const hash = router.asPath.split("#")[1];
    if (hash) {
      setSelectedMenu(hash);
    }
  }, [router.isReady, router.asPath]);

  const handleSelectMenu = (id: string) => {
    setSelectedMenu(id);
    router.push(`/account#${id}`, undefined, { shallow: true });
  };

  if (!isAuthenticated) return null;

  return (
    <Base>
      <div className="mx-w-full p-6 sm:py-6 lg:px-8 relative z-1">
        <Breadcumb
          mainRoot={BreadcumbTitle["account.detail"] as string}
          subRoot="Thông tin tài khoản"
        />
        <article className="flex mt-4 gap-4">
          <div className="flex-initial w-1/4">
            <UserSideMenu
              selectedMenu={selectedMenu}
              onSelectMenu={handleSelectMenu}
            />
          </div>
          <Divider orientation="vertical" />
          <div className="w-3/4">
            {COMPONENT_MAP[selectedMenu] || <AccountInfo />}
          </div>
        </article>
      </div>
    </Base>
  );
};

export default AccountPage;
