import AccountInfo from '@/components/account/AccountInfo'
import Addresses from '@/components/account/Addresses'
import Orders from '@/components/account/Orders'
import PointHistory from '@/components/account/PointHistory'
import Preferences from '@/components/account/Preferences'
import RaffleHistory from '@/components/account/RaffleHistory'
import RegisterMakerModal from '@/components/account/RegisterMaker'
import Rewards from '@/components/account/Rewards'
import Wishlist from '@/components/account/Wishlist'
import Breadcumb from '@/components/breadcumb'
import MakerDashboard from '@/components/maker/MakerDashboard'
import MakerRaffle from '@/components/maker/MakerRaffle'
import UserSideMenu from '@/components/userSideMenu'
import { BreadcumbTitle } from '@/constants'
import { EnumSideMenu } from '@/constants/Enums'
import { useAuth } from '@/context/Auth'
import useAccount from '@/hook/useAccount'
import { Base } from '@/templates/Base'
import React, { useState } from 'react'

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
  [EnumSideMenu.POINT_HISTORY]: <PointHistory />,
}

const AccountPage: React.FC = () => {
  const auth = useAuth()
  const { isAuthenticated } = auth || {}
  const { selectedMenu, handleSelectMenu } = useAccount()
  const [isOpen, toggle] = useState({
    registerMaker: false,
  })

  const handleCloseRegisterMaker = () => toggle({ ...isOpen, registerMaker: false })

  if (!isAuthenticated) return null

  return (
    <Base>
      <div className="mx-w-full relative z-1">
        {/* <Breadcumb mainRoot={BreadcumbTitle['account.detail'] as string} subRoot="Thông tin tài khoản" /> */}
        <article className="flex mt-4 gap-4 h-full min-h-0">
          <div className="w-[22%]">
            <UserSideMenu selectedMenu={selectedMenu} onSelectMenu={handleSelectMenu} handleRegisterMaker={() => toggle({ ...isOpen, registerMaker: true })} />
          </div>
          <div className="w-1 border-r border-gray-400" />
          <div className="w-[78%]">{COMPONENT_MAP[selectedMenu] || <AccountInfo />}</div>
        </article>
      </div>
      <RegisterMakerModal isOpen={isOpen.registerMaker} handleClose={handleCloseRegisterMaker} />
    </Base>
  )
}

export default AccountPage
