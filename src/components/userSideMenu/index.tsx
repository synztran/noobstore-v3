import { EnumSideMenu } from "@/constants/Enums"
import { useAuth } from "@/context/Auth"
import { classNames } from "@/utils/AppConfig"
import { Disclosure } from "@headlessui/react"
import { ArrowRightOnRectangleIcon, BellIcon, MapPinIcon, ShoppingCartIcon, UserIcon } from "@heroicons/react/24/outline"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import { useRouter } from "next/router"
import { useState } from "react"
import { PAGE_LINK } from "../constants"

const MenuList = [
  {
    icon: UserIcon,
    href: PAGE_LINK.USER_DETAIL,
    name: 'Tài khoản',
    id: EnumSideMenu.DETAIL
  },
  {
    icon: BellIcon,
    href: PAGE_LINK.USER_NOTIFICATION,
    name: 'Thông báo',
    id: EnumSideMenu.NOTIFICATION
  },
  {
    icon: MapPinIcon,
    href: PAGE_LINK.USER_ADDRESSES,
    name: 'Đia chỉ',
    id: EnumSideMenu.ADDRESSES
  },
  {
    icon: ShoppingCartIcon,
    href: PAGE_LINK.USER_ORDERS,
    name: 'Đơn hàng',
    id: EnumSideMenu.ORDERS
  },
  {
    icon: ArrowRightOnRectangleIcon,
    href: '',
    name: 'Đăng xuất',
    id: EnumSideMenu.LOGOUT
  }
]

const UserSideMenu = () => {
  const router = useRouter()

  const [openLogout, setOpenLogout] = useState(false)

  const handleClick = (menu : {
    icon: any,
    href: string,
    name: string,
    id: EnumSideMenu
  }) => {
    if (menu.id === EnumSideMenu.LOGOUT) {
      // handle logout
      setOpenLogout(true)
    } else {
      router.push({
        pathname: menu.href,
        query: {
          ...router.query
        }
      })
    }
  }

  const handleClose = () => {
    setOpenLogout(false)
  }

  return (
    <div>
      <div>
        <main className="mx-auto max-w-7xl">
        <section
						aria-labelledby="products-heading"
						className="pb-24 pt-6">

						<form className="hidden lg:block">
							{MenuList.map((menu, idx) => (
								<Disclosure
									as="div"
									key={idx}
								>
									{({ open }) => (
										<Box onClick={() => handleClick(menu)}>
											<h3 className={classNames("flow-root group")}>
												<Disclosure.Button style={{width: '100.5%'}} className={classNames(`flex items-center justify-start py-3 pl-4 text-sm gap-2`, router.pathname === menu.href ? 'bg-red-50 border-r-4 border-red-400' : '')}>
                          <menu.icon className={classNames("w-8 h-8", router.pathname === menu.href ? `` : '')} />
													<span className={classNames("font-medium text-base", router.pathname === menu.href ? `` : '')}>
														{menu.name}
													</span>
												</Disclosure.Button>
											</h3>
										</Box>
									)}
								</Disclosure>
							))}
						</form>
					</section>
        </main>
      </div>
      <PopupLogOut open={openLogout} handleClose={handleClose} />
    </div>
  )
}

export default UserSideMenu

const PopupLogOut = ({open, handleClose}: {open: boolean, handleClose: () => void}) => {
  const { logout } = useAuth() 
  const handleLogout = () => {
    // 
    logout();
  }
 
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Đăng xuất tài khoản</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="flex justify-end items-center gap-2">
          <Button className="" onClick={handleClose}>
            <span className="normal-case">Đóng</span>
          </Button>
          <Button onClick={handleLogout} autoFocus>
            <span className="normal-case">Thoát</span>
          </Button>
        </DialogActions>
    </Dialog>
  )
}