import DialogLogin from "@/components/dialogLogin";
import ModalCartItem from "@/components/modalCartItem";
import { callsToAction, contact, news, services } from "@/constants";
import { useAuth } from "@/context/Auth";
import { classNames } from "@/utils/AppConfig";
import useCart from "@/zustand/useCart";
import useDialogLogin, { useDialogLoginAction } from "@/zustand/useDialogLogin";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import {
	ChevronDownIcon
} from "@heroicons/react/20/solid";
import {
	Bars3Icon,
	ShoppingBagIcon,
	XMarkIcon
} from "@heroicons/react/24/outline";
import { Box, CircularProgress, Divider, IconButton, Menu, MenuItem } from "@material-ui/core";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import NextImage from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import LogoStore from "../../public/assets/icons/logo.png";
import styles from './styles.module.css';


export default function Header() {
	const router = useRouter();
	const {user, logout}:any = useAuth();

	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { isOpenDialogLogin } = useDialogLogin();
	const { toggleDialogLogin } = useDialogLoginAction();
	const { cart, isIniting } = useCart();
	console.log(cart)

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [isOpenModalCartItem, toggleModalCartItem] = useState(false);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	}

	const handleClose = () => {
		setAnchorEl(null);
	}

	const isSimpleHeader = ['/checkout'].includes(router.pathname);
	return (
		<header className="bg-gray-100 sticky top-0 z-50">
			<nav
				className={`container mx-auto flex items-center justify-between py-6 px-6 border-b border-black max-w-90 ${isSimpleHeader ? "px-12" : ""}`}
				aria-label="Global"
			>
				{
					!isSimpleHeader ? (
						<Popover.Group className="hidden md:flex md:flex-1 md:gap-x-6 md:order-1 lg:order-none">
							{/* <Popover className="relative">
								<Popover.Button className="flex items-center gap-x-1 text-base font-semibold leading-6 text-gray-900 outline-none">
									Danh mục
									<ChevronDownIcon
										className="h-5 w-5 flex-none text-gray-400"
										aria-hidden="true"
									/>
								</Popover.Button>

								<Transition
									as={Fragment}
									enter="transition ease-out duration-200"
									enterFrom="opacity-0 translate-y-1"
									enterTo="opacity-100 translate-y-0"
									leave="transition ease-in duration-150"
									leaveFrom="opacity-100 translate-y-0"
									leaveTo="opacity-0 translate-y-1">
									<Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
										<div className="p-4">
											{categories.map((item) => (
												<div
													key={item.name}
													className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
													<div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
														<item.icon
															className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
															aria-hidden="true"
														/>
													</div>
													<div className="flex-auto">
														<a
															href={item.href}
															className="block font-semibold text-gray-900">
															{item.name}
															<span className="absolute inset-0" />
														</a>
														<p className="mt-1 text-gray-600">
															{item.description}
														</p>
													</div>
												</div>
											))}
										</div>
									</Popover.Panel>
								</Transition>
							</Popover> */}
							{/* collection */}
							<Link href="/shop" className={classNames(`text-base font-semibold leading-6 text-gray-900`, styles.bbEffect ?? "")}>
								Shop
							</Link>
							{/* service */}
							<Popover className="relative">
								<Popover.Button className={`flex items-center gap-x-1 text-base font-semibold leading-6 text-gray-900 outline-none ${styles.bbEffect}`}>
									Dịch vụ
									<ChevronDownIcon
										className="h-5 w-5 flex-none text-gray-400"
										aria-hidden="true"
									/>
								</Popover.Button>

								<Transition
									as={Fragment}
									enter="transition ease-out duration-200"
									enterFrom="opacity-0 translate-y-1"
									enterTo="opacity-100 translate-y-0"
									leave="transition ease-in duration-150"
									leaveFrom="opacity-100 translate-y-0"
									leaveTo="opacity-0 translate-y-1">
									<Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
										<div className="p-4">
											{services.map((item) => (
												<div
													key={item.name}
													className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
													<div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
														<item.icon
															className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
															aria-hidden="true"
														/>
													</div>
													<div className="flex-auto">
														<a
															href={item.href}
															className="block font-semibold text-gray-900">
															{item.name}
															<span className="absolute inset-0" />
														</a>
														{/* <p className="mt-1 text-gray-600">
															{item?.description}
														</p> */}
													</div>
												</div>
											))}
										</div>
										{/* <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
											{callsToAction.map((item) => (
												<a
													key={item.name}
													href={item.href}
													className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100">
													<item.icon
														className="h-5 w-5 flex-none text-gray-400"
														aria-hidden="true"
													/>
													{item.name}
												</a>
											))}
										</div> */}
									</Popover.Panel>
								</Transition>
							</Popover>
							{/* news */}
							<Popover className="relative">
								<Popover.Button className={`flex items-center gap-x-1 text-base font-semibold leading-6 text-gray-900 outline-none ${styles.bbEffect}`}>
									Tin tức
									<ChevronDownIcon
										className="h-5 w-5 flex-none text-gray-400"
										aria-hidden="true"
									/>
								</Popover.Button>

								<Transition
									as={Fragment}
									enter="transition ease-out duration-200"
									enterFrom="opacity-0 translate-y-1"
									enterTo="opacity-100 translate-y-0"
									leave="transition ease-in duration-150"
									leaveFrom="opacity-100 translate-y-0"
									leaveTo="opacity-0 translate-y-1">
									<Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
										<div className="p-4">
											{news.map((item) => (
												<div
													key={item.name}
													className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
													<div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
														<item.icon
															className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
															aria-hidden="true"
														/>
													</div>
													<div className="flex-auto">
														<a
															href={item.href}
															className="block font-semibold text-gray-900">
															{item.name}
															<span className="absolute inset-0" />
														</a>
														<p className="mt-1 text-gray-600">
															{item.description}
														</p>
													</div>
												</div>
											))}
										</div>
										{/* <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
											{callsToAction.map((item) => (
												<a
													key={item.name}
													href={item.href}
													className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100">
													<item.icon
														className="h-5 w-5 flex-none text-gray-400"
														aria-hidden="true"
													/>
													{item.name}
												</a>
											))}
										</div> */}
									</Popover.Panel>
								</Transition>
							</Popover>
							{/* contact */}
							<Popover className="relative">
								<Popover.Button className={`flex items-center gap-x-1 text-base font-semibold leading-6 text-gray-900 outline-none ${styles.bbEffect}`}>
									Liên hệ
									<ChevronDownIcon
										className="h-5 w-5 flex-none text-gray-400"
										aria-hidden="true"
									/>
								</Popover.Button>

								<Transition
									as={Fragment}
									enter="transition ease-out duration-200"
									enterFrom="opacity-0 translate-y-1"
									enterTo="opacity-100 translate-y-0"
									leave="transition ease-in duration-150"
									leaveFrom="opacity-100 translate-y-0"
									leaveTo="opacity-0 translate-y-1">
									<Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
										<div className="p-4">
											{contact.map((item) => (
												<div
													key={item.name}
													className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
													<div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
														<item.icon
															className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
															aria-hidden="true"
														/>
													</div>
													<div className="flex-auto">
														<a
															href={item.href}
															className="block font-semibold text-gray-900">
															{item.name}
															<span className="absolute inset-0" />
														</a>
														<p className="mt-1 text-gray-600">
															{item.description}
														</p>
													</div>
												</div>
											))}
										</div>
										{/* <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
											{callsToAction.map((item) => (
												<a
													key={item.name}
													href={item.href}
													className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100">
													<item.icon
														className="h-5 w-5 flex-none text-gray-400"
														aria-hidden="true"
													/>
													{item.name}
												</a>
											))}
										</div> */}
									</Popover.Panel>
								</Transition>
							</Popover>
							{/* comunity */}
							{/* <Popover className="relative">
								<Popover.Button className="flex items-center gap-x-1 text-base font-semibold leading-6 text-gray-900 outline-none">
									Cộng đồng
									<ChevronDownIcon
										className="h-5 w-5 flex-none text-gray-400"
										aria-hidden="true"
									/>
								</Popover.Button>

								<Transition
									as={Fragment}
									enter="transition ease-out duration-200"
									enterFrom="opacity-0 translate-y-1"
									enterTo="opacity-100 translate-y-0"
									leave="transition ease-in duration-150"
									leaveFrom="opacity-100 translate-y-0"
									leaveTo="opacity-0 translate-y-1">
									<Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
										<div className="p-4">
											{comunity.map((item) => (
												<div
													key={item.name}
													className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
													<div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
														<item.icon
															className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
															aria-hidden="true"
														/>
													</div>
													<div className="flex-auto">
														<a
															href={item.href}
															className="block font-semibold text-gray-900">
															{item.name}
															<span className="absolute inset-0" />
														</a>
														<p className="mt-1 text-gray-600">
															{item.description}
														</p>
													</div>
												</div>
											))}
										</div>
									</Popover.Panel>
								</Transition>
							</Popover> */}
						</Popover.Group>
					) : null
				}
				<div className={classNames(`flex md:flex-1 md:justify-start  ${isSimpleHeader ? "justify-start" : "lg:justify-center"}`)}>
					<a href="/" className="-m-1.5 p-1.5">
						<span className="sr-only">NoobStore</span>
						<NextImage
							className="h-20 w-auto hover:rotate-12 transition-all duration-300 shadow-xl"
							src={LogoStore}
							objectFit="contain"
							alt=""
						/>
					</a>
				</div>
				<div className="flex md:hidden md:flex-1">
					<button
						type="button"
						className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
						onClick={() => setMobileMenuOpen(true)}>
						<span className="sr-only">Open main menu</span>
						<Bars3Icon className="h-6 w-6" aria-hidden="true" />
					</button>
				</div>
				{
					user ? (
						<div className="hidden md:flex md:flex-1 md:justify-end md:order-2">
							{
								isSimpleHeader ? (
									<a href="/cart" style={{position: 'relative'}}>
										<ShoppingBagIcon 
											className="h-6 w-6 text-gray-600 group-hover:text-indigo-600 cursor-pointer"
											aria-hidden="true" 
										/>
									
									</a>
								) : (
									<div className="flex gap-4 items-center justify-center">
										{/* <a
											href={PAGE_LINK.USER_DETAIL}
											className="text-base font-semibold leading-6 text-gray-900 flex"
										>
											<AccountCircleIcon className="text-gray-600 group-hover:text-indigo-600 cursor-pointer hover:fill-blue-500 transition-all m-auto"
												aria-hidden="true" style={{width: 32, height: 32}}  />&nbsp;
										</a> */}
										<div className="m-auto">
											<button
												onClick={handleClick}
												className="flex items-center gap-1"
											>
												{/* <AccountCircleIcon className="group text-gray-600 cursor-pointer transition-all m-auto"
												aria-hidden="true" style={{width: 32, height: 32}}  /> */}
												{
													user?.avatar ? (
														<Box position="relative" width={45} height={45}>
															<NextImage src={user?.avatar} layout="fill" objectFit="contain" alt="user avatar" className="rounded-half" />
														</Box>
													) : (
														<AccountCircleIcon className="hover:fill-blue-500" style={{width: 32, height: 32}} />
													)
												}
												&nbsp;
												<span className="hover:text-blue-500 text-base">{user?.firstName} {user?.lastName}</span>
											</button>
											<Menu
												id="basic-menu"
												anchorEl={anchorEl}
												open={open}
												onClose={handleClose}
												MenuListProps={{
													'aria-labelledby': 'basic-button',
													className: 'py-0'
												}}
												PaperProps={{
													elevation: 0,
													style: {
														overflow: 'visible',
														filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
													},
													className: '!top-20'
												}}
												transformOrigin={{ horizontal: 'right', vertical: 'top' }}
												anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
											>
												<MenuItem className="flex flex-col">
													<Link href="/account/detail">
														Thông tin tài khoản
													</Link>
												</MenuItem>
												<Divider className="w-full h-0.5" />
												<MenuItem>
													<Link href="/account/orders">
														Đơn hàng
													</Link>
												</MenuItem>
												<Divider className="w-full h-0.5" />
												<MenuItem>
													<span onClick={logout}>Đăng xuất</span>
												</MenuItem>
											</Menu>
										</div>
										<Divider />
										<IconButton className="relative p-0.5" onClick={() => toggleModalCartItem(true)}>
											<LocalMallIcon 
												className="group text-gray-600 cursor-pointer transition-all m-auto"
												aria-hidden="true" 
												style={{width: 32, height: 32}}
											/>
											&nbsp;
											{console.log("cart cart", cart)}
											<span className="absolute -top-1 -right-1 bg-red-400 w-5 h-5 rounded-xl flex justify-center items-center text-white text-xs">{cart?.totalProductQuantity === undefined || isIniting  ? <CircularProgress size={12} style={{color: '#fff'}} classes={{circle: styles.loadingCircle}} /> : cart?.totalProductQuantity || 0}</span>
										</IconButton>
									</div>
								)
							}
						</div>
					) : (
						<div className="hidden md:flex md:flex-1 md:justify-end md:order-2">
							{
								isSimpleHeader ? (
									<a href="/cart">
										<ShoppingBagIcon 
											className="h-6 w-6 text-gray-600 group-hover:text-indigo-600 cursor-pointer"
											aria-hidden="true" 
										/>
									</a>
								) : (
									<div className="flex gap-4 align-middle justify-center">
										<div className="text=base font-semibold leading-6 text-gray-900 cursor-pointer fill-blue-400 m-auto relative" onClick={() => toggleDialogLogin(!isOpenDialogLogin)}>
											<AccountCircleIcon className="hover:fill-blue-500" style={{width: 32, height: 32}} />
										</div>
										{/* <Divider style={{width: '1px', height: '100%', border: '1px solid #000'}} />
										<div className="relative">
											<LocalMallIcon className="group text-gray-600 cursor-pointer transition-all m-auto hover:fill-blue-500"
													aria-hidden="true" style={{width: 32, height: 32}}  />&nbsp;
											<span className="rounded-xl flex justify-center align-middle m-auto absolute w-5 h-5 -top-1 -right-1 bg-red-500 text-white text-sm">0</span>
										</div> */}
									</div>
								)
							}
						</div>
					)
				}
			</nav>
			<Transition appear show={mobileMenuOpen} as={Fragment}>
				<Dialog
					as="div"
					className="lg:hidden"
					open={mobileMenuOpen}
					onClose={setMobileMenuOpen}
				>
					<div className="fixed inset-0 z-10" />
					<Transition.Child as={Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0 right-95"
									enterTo="opacity-100 right-100" leave="ease-in-out duration-200" leaveFrom="opacity-100 right-100"
									leaveTo="opacity-0 right-95">
						<Dialog.Panel className="fixed inset-y-0 right-0 z-60 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 transition-all duration-300 delay-150">
						<div className="flex items-center justify-between">
							<a href="#" className="-m-1.5 p-1.5">
								<span className="sr-only">Your Company</span>
								<img
									className="h-8 w-auto"
									src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
									alt=""
								/>
							</a>
							<button
								type="button"
								className="-m-2.5 rounded-md p-2.5 text-gray-700"
								onClick={() => setMobileMenuOpen(false)}>
								<span className="sr-only">Close menu</span>
								<XMarkIcon className="h-6 w-6" aria-hidden="true" />
							</button>
						</div>
						<div className="mt-6 flow-root">
							<div className="-my-6 divide-y divide-gray-500/10">
								<div className="space-y-2 py-6">
									<Disclosure as="div" className="-mx-3">
										{({ open }) => (
											<>
												<Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
													Product
													<ChevronDownIcon
														className={classNames(
															open
																? "rotate-180"
																: "",
															"h-5 w-5 flex-none"
														)}
														aria-hidden="true"
													/>
												</Disclosure.Button>
												<Disclosure.Panel className="mt-2 space-y-2">
													{[
														// ...products,
														...callsToAction,
													].map((item) => (
														<Disclosure.Button
															key={item.name}
															as="a"
															href={item.href}
															className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">
															{item.name}
														</Disclosure.Button>
													))}
												</Disclosure.Panel>
											</>
										)}
									</Disclosure>
									<a
										href="#"
										className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
										Features
									</a>
									<a
										href="#"
										className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
										Marketplace
									</a>
									<a
										href="#"
										className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
										Company
									</a>
								</div>
								<div className="py-6">
									<a
										href="#"
										className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
										Log in
									</a>
								</div>
							</div>
						</div>
						</Dialog.Panel>
					</Transition.Child>
				</Dialog>
			</Transition>

			<DialogLogin isOpen={isOpenDialogLogin} toggleOpen={toggleDialogLogin} />
			<ModalCartItem open={isOpenModalCartItem} handleClose={() => toggleModalCartItem(false)} />
		</header>
	);
}
