import { EnumSideMenu } from '@/constants/Enums'
import { useAuth } from '@/context/Auth'
import { classNames } from '@/utils/AppConfig'
import { ArrowRightOnRectangleIcon, BuildingStorefrontIcon, Cog6ToothIcon, GiftIcon, HeartIcon, MapPinIcon, ShoppingCartIcon, StarIcon, UserIcon, WalletIcon } from '@heroicons/react/24/outline'
import { useMemo, useState } from 'react'
import PopupLogOut from '../PopupLogout'

interface IMenu {
  icon: React.ElementType
  href: string
  label: string
  sublabel: string
  id: string
  isActive?: boolean
  subId?: string
}

// Account block
const AccountMenu: IMenu[] = [
  {
    icon: UserIcon,
    href: '/account#detail',
    label: 'Thông tin cá nhân',
    sublabel: 'Quản lý tài khoản, thông tin cá nhân',
    id: EnumSideMenu.DETAIL,
    isActive: true,
    subId: EnumSideMenu.POINT_HISTORY,
  },
  {
    icon: ShoppingCartIcon,
    href: '/account#orders',
    label: 'Đơn hàng',
    sublabel: 'Quản lý, chỉnh sửa đơn hàng',
    id: EnumSideMenu.ORDERS,
    isActive: true,
  },
  {
    icon: HeartIcon,
    href: '/account#wishlist',
    label: 'Yêu thích',
    sublabel: 'Sản phẩm đã lưu',
    id: 'wishlist',
    isActive: false,
  },
  {
    icon: MapPinIcon,
    href: '/account#addresses',
    label: 'Sổ địa chỉ',
    sublabel: 'Quản lý địa chỉ giao hàng',
    id: EnumSideMenu.ADDRESSES,
    isActive: true,
  },
  {
    icon: StarIcon,
    href: '/account#raffleHistory',
    label: 'Lịch sử raffle',
    sublabel: 'Xem các raffle đã tham gia',
    id: 'raffleHistory',
    isActive: true,
  },
]

// Maker block (only show if user.role === 'Maker')
const MakerMenu: IMenu[] = [
  {
    icon: BuildingStorefrontIcon,
    href: '/account#makerDashboard',
    label: 'Maker dashboard',
    sublabel: 'Quản lý sản phẩm, đơn hàng của bạn',
    id: 'makerDashboard',
  },
  {
    icon: GiftIcon,
    href: '/account#makerRaffle',
    label: 'Quản lý raffle',
    sublabel: 'Tạo và quản lý các raffle',
    id: 'makerRaffle',
  },
]

// Reward/Preferences block
const OtherMenu: IMenu[] = [
  {
    icon: WalletIcon,
    href: '/account#rewards',
    label: 'Rewards',
    sublabel: 'Điểm thưởng, hoàn tiền, ưu đãi',
    id: 'rewards',
  },
  {
    icon: Cog6ToothIcon,
    href: '/account#preferences',
    label: 'Thiết lập',
    sublabel: 'Thiết lập tài khoản',
    id: 'preferences',
  },
]

import useMakerQuery from '@/react-query/makers/api/useMakerQuery'
import React from 'react'
import { Button } from '../ReUIComponent'
import MakerBlock from './MakerBlock'

interface UserSideMenuProps {
  selectedMenu: string
  onSelectMenu: (id: string) => void
  handleRegisterMaker: () => void
}

const UserSideMenu: React.FC<UserSideMenuProps> = ({ selectedMenu, onSelectMenu, handleRegisterMaker }) => {
  const { user } = useAuth() || {}
  const [openLogout, setOpenLogout] = useState(false)
  const { data: makerData, isLoading } = useMakerQuery({
    params: { makerId: user?.makerId },
    enabled: !!user?.makerId,
  })

  const isSelected = useMemo(() => {
    return (menu: IMenu) => {
      console.log(menu, selectedMenu)
      return menu.id === selectedMenu || menu.subId === selectedMenu
    }
  }, [selectedMenu])

  const handleClick = (menuId: string) => {
    onSelectMenu(menuId)
  }

  const handleLogout = () => {
    // Implement logout logic here (e.g., clear auth tokens, redirect to login page)
    setOpenLogout(!openLogout)
  }

  const handleClose = () => {
    setOpenLogout(false)
  }

  console.log('AccountMenu', AccountMenu)

  return (
    <div className="w-full">
      <main className="mx-auto">
        {/* Account Block */}
        <section className="mb-6">
          <div className="mb-2 font-bold text-gray-600 uppercase tracking-widest pl-2">Account</div>
          <div className="rounded-xl bg-white shadow p-2 space-y-2 border border-gray-200">
            {AccountMenu.map((menu, idx) => (
              <div
                key={menu.id}
                className={classNames('flex items-center gap-3 py-3 px-2 cursor-pointer hover:bg-gray-200 rounded-md group transition', menu.isActive ? '' : 'bg-gray-100 opacity-50 pointer-events-none', isSelected(menu) ? 'bg-red-50! border-r-4 border-red-400!' : '')}
                onClick={() => handleClick(menu.id)}
              >
                <menu.icon className="w-7 h-7 text-gray-500 group-hover:text-red-400" />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-base text-gray-900 truncate">{menu.label}</span>
                  <span className="text-xs text-gray-700 line-clamp-2">{menu.isActive ? menu.sublabel : 'Chức năng sắp ra mắt'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Maker Block: always show. If not Maker, show register button. */}
        <section className="mb-6">
          <div className="mb-2 font-bold text-gray-600 uppercase tracking-widest pl-2">Maker</div>
          {/* {isLoading ? (
						<div className="rounded-xl bg-white shadow p-2 divide-y divide-gray-100 border border-gray-200 space-y-2">
							<div className="flex items-center gap-3 py-3 px-2">
								<Skeleton
									variant="circular"
									width={28}
									height={28}
								/>
								<div className="flex flex-col flex-1 min-w-0 gap-2">
									<Skeleton
										variant="text"
										width="60%"
										height={20}
									/>
									<Skeleton
										variant="text"
										width="80%"
										height={16}
									/>
								</div>
							</div>
						</div>
					) : null} */}
          <div className={`rounded-xl bg-white shadow p-2 divide-y divide-gray-100 border border-gray-200 ${isLoading ? 'hidden' : ''}`}>
            {makerData ? (
              <MakerBlock isLoading={isLoading} maker={makerData} selectedMenu={selectedMenu} onSelectMenu={onSelectMenu} onVerifyAgain={() => {}} />
            ) : (
              <div className="flex flex-col items-center py-6">
                <span className="mb-2 font-semibold">Bạn chưa là Maker.</span>
                <Button variant={'primary'} fontSize={'sm'} onClick={handleRegisterMaker}>
                  Đăng ký trở thành Maker
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Other Block */}
        <section>
          <div className="mb-2 font-bold text-gray-600 uppercase tracking-widest pl-2">Thông tin</div>
          <div className="rounded-xl bg-white shadow p-2 divide-y divide-gray-100 border border-gray-200">
            {OtherMenu.map((menu, idx) => (
              <div key={menu.id} className={classNames('flex items-center gap-3 py-3 px-2 cursor-pointer hover:bg-gray-50 group transition', isSelected(menu) ? 'bg-yellow-50 border-r-4 border-yellow-400' : '')} onClick={() => handleClick(menu.id)}>
                <menu.icon className="w-7 h-7 text-gray-500 group-hover:text-yellow-500" />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-base text-gray-900 truncate">{menu.label}</span>
                  <span className="text-xs text-gray-500 truncate">{menu.sublabel}</span>
                </div>
              </div>
            ))}
            {/* Logout always at the end */}
            <div className={classNames('flex items-center gap-3 py-3 px-2 cursor-pointer hover:bg-gray-50 group transition')} onClick={handleLogout}>
              <ArrowRightOnRectangleIcon className="w-7 h-7 text-gray-500 group-hover:text-red-500" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-semibold text-base text-gray-900 truncate">Đăng xuất</span>
                <span className="text-xs text-gray-500 truncate">Thoát khỏi tài khoản</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PopupLogOut open={openLogout} handleClose={handleClose} />
    </div>
  )
}

export default UserSideMenu
