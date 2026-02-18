import DialogLogin from "@/components/dialogLogin";
import HeaderUserSetting from "@/components/HeaderUserSetting";
import ModalCartItem from "@/components/modalCartItem";
import PopupLogOut from "@/components/PopupLogout";
import { callsToAction, contact, news, services } from "@/constants";
import {
	CHECKOUT_URL,
	SERVICES_DETAIL_URL,
	THANKS_URL,
} from "@/constants/path";
import { useAuth } from "@/context/Auth";
import { IAuthUser } from "@/interface/Context/auth";
import useCartQuery from "@/react-query/cart/api/useCartQueries";
import { classNames } from "@/utils/AppConfig";
import useDialogLogin, {
	EnumStatusDialog,
	useDialogLoginAction,
} from "@/zustand/useDialogLogin";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
	Bars3Icon,
	ShoppingBagIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { CircularProgress, Divider, IconButton } from "@mui/material";
import { ShoppingCart, User2 } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useRef, useState } from "react";
import LogoStore from "../../public/assets/icons/logo.png";
import styles from "./styles.module.css";

export default function Header() {
	const router = useRouter();
	const { user, logout, isAuthenticated } = useAuth() as unknown as {
		user: IAuthUser;
		logout: () => void;
		isAuthenticated: boolean;
	};
	const { data: cart, isLoading: isIniting } = useCartQuery({
		enabled: isAuthenticated || true,
	});
	const { isOpenDialogLogin } = useDialogLogin();
	const { toggleDialogLogin } = useDialogLoginAction();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [isOpenModalCartItem, toggleModalCartItem] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [openPopupLogout, setOpenPopupLogout] = useState(false);

	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		setOpenPopupLogout(!openPopupLogout);
	};

	const isSimpleHeader = [
		CHECKOUT_URL,
		THANKS_URL,
		SERVICES_DETAIL_URL,
	].includes(router.pathname);
	const isHideHeader = [THANKS_URL].includes(router.pathname);

	if (isHideHeader) return null;

	return (
		<header
			className="backdrop-blur-md sticky top-0 z-50 bg-[rgba(255,255,255,0.7)] px-6 h-[120px]"
			id="header">
			<nav
				className={`container mx-0 flex items-center justify-between p-3 max-w-full h-full ${
					isSimpleHeader ? "px-12" : ""
				}`}
				aria-label="Global">
				<div
					className={classNames(
						`flex md:flex-1 md:justify-start  ${
							isSimpleHeader
								? "justify-start"
								: "lg:justify-start"
						}`,
					)}>
					<Link
						href="/"
						className="-m-1.5 p-1.5 hover:rotate-6 transition-all duration-300">
						<span className="sr-only">NoobStore</span>
						<NextImage
							src={LogoStore}
							width={145}
							height={45}
							alt="NoobStore"
							quality={100}
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="rounded-md"
						/>
					</Link>
				</div>
				{!isSimpleHeader ? (
					<Popover.Group className="hidden flex-1 md:flex md:flex-2 md:justify-center md:gap-x-6 md:order-1 lg:order-none">
						<Link
							href="/shop"
							className={classNames(
								`text-2xl font-semibold leading-6 text-gray-900`,
								styles.bbEffect ?? "",
							)}>
							Shop
						</Link>
						{/* <Link
							href="/used"
							className={classNames(
								`text-lg font-semibold leading-6 text-gray-900`,
								styles.bbEffect ?? ""
							)}>
							Shop 2nd
						</Link> */}
						{/* service */}
						<Popover className="relative">
							{({ open, close }) => {
								const buttonRef =
									useRef<HTMLButtonElement>(null);
								return (
									<div
										onMouseEnter={() => {
											if (!open && buttonRef.current) {
												buttonRef.current.click();
											}
										}}
										onMouseLeave={() => {
											if (open) close();
										}}>
										<Popover.Button
											ref={buttonRef}
											className={`flex items-center gap-x-1 text-2xl font-semibold leading-6 text-gray-900 outline-none ${styles.bbEffect}`}>
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
													{services.map(
														(item: any) => (
															<div
																key={item.name}
																className="group relative flex items-center gap-x-6 rounded-lg p-2 text-sm leading-6 hover:bg-gray-200">
																<div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-200 group-hover:bg-white">
																	{item.icon && (
																		<item.icon
																			className="h-6 w-6 text-gray-900 group-hover:text-indigo-600"
																			aria-hidden="true"
																		/>
																	)}
																</div>
																<div className="flex-auto">
																	<Link
																		href={
																			item.href
																		}
																		className="block font-semibold text-gray-900">
																		{
																			item.name
																		}
																		<span className="absolute inset-0" />
																	</Link>
																	<p className="mt-1 text-gray-900">
																		{
																			item.description
																		}
																	</p>
																</div>
															</div>
														),
													)}
												</div>
											</Popover.Panel>
										</Transition>
									</div>
								);
							}}
						</Popover>
						{/* news */}
						<Popover className="relative">
							{({ open, close }) => {
								const buttonRef =
									useRef<HTMLButtonElement>(null);
								return (
									<div
										onMouseEnter={() => {
											if (!open && buttonRef.current) {
												buttonRef.current.click();
											}
										}}
										onMouseLeave={() => {
											if (open) close();
										}}>
										<Popover.Button
											ref={buttonRef}
											className={`flex items-center gap-x-1 text-2xl font-semibold leading-6 text-gray-900 outline-none ${styles.bbEffect}`}>
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
															className="group relative flex items-center gap-x-6 rounded-lg p-2 text-sm leading-6 hover:bg-gray-200">
															<div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-200 group-hover:bg-white">
																<item.icon
																	className="h-6 w-6 text-gray-900 group-hover:text-indigo-600"
																	aria-hidden="true"
																/>
															</div>
															<div className="flex-auto">
																<Link
																	href={
																		item.href
																	}
																	className="block font-semibold text-gray-900">
																	{item.name}
																	<span className="absolute inset-0" />
																</Link>
																<p className="mt-1 text-gray-900">
																	{
																		item.description
																	}
																</p>
															</div>
														</div>
													))}
												</div>
											</Popover.Panel>
										</Transition>
									</div>
								);
							}}
						</Popover>
						{/* contact */}
						<Popover className="relative">
							{({ open, close }) => {
								const buttonRef =
									useRef<HTMLButtonElement>(null);
								return (
									<div
										onMouseEnter={() => {
											if (!open && buttonRef.current) {
												buttonRef.current.click();
											}
										}}
										onMouseLeave={() => {
											if (open) close();
										}}>
										<Popover.Button
											ref={buttonRef}
											className={`flex items-center gap-x-1 text-2xl font-semibold leading-6 text-gray-900 outline-none ${styles.bbEffect}`}>
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
												<div className="p-2">
													{contact.map((item) => (
														<div
															key={item.name}
															className="group relative flex items-center gap-x-6 rounded-lg p-2 text-sm leading-6 hover:bg-gray-200">
															<div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-200 group-hover:bg-white">
																<item.icon
																	className="h-6 w-6 text-gray-900 group-hover:text-indigo-600"
																	aria-hidden="true"
																/>
															</div>
															<div className="flex-auto">
																<Link
																	href={
																		item.href
																	}
																	className="block font-semibold text-gray-900">
																	{item.name}
																	<span className="absolute inset-0" />
																</Link>
																<p className="mt-1 text-gray-900">
																	{
																		item.description
																	}
																</p>
															</div>
														</div>
													))}
												</div>
											</Popover.Panel>
										</Transition>
									</div>
								);
							}}
						</Popover>
					</Popover.Group>
				) : null}
				<div className="flex md:hidden md:flex-1">
					<button
						type="button"
						className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
						onClick={() => setMobileMenuOpen(true)}>
						<span className="sr-only">Open main menu</span>
						<Bars3Icon className="h-6 w-6" aria-hidden="true" />
					</button>
				</div>
				{user ? (
					<div className="hidden md:flex md:flex-1 md:justify-end md:order-2">
						{isSimpleHeader ? (
							<Link href="/cart" style={{ position: "relative" }}>
								<ShoppingCart
									className="h-6 w-6 text-gray-900 group-hover:text-indigo-600 cursor-pointer"
									aria-hidden="true"
								/>
							</Link>
						) : (
							<div className="flex gap-4 items-center justify-center">
								<HeaderUserSetting />
								<Divider
									orientation="vertical"
									className="my-1"
								/>
								<IconButton
									className="relative p-1 !bg-gray-200"
									onClick={() => toggleModalCartItem(true)}>
									<ShoppingCart
										className="group text-gray-900 cursor-pointer transition-all m-auto"
										aria-hidden="true"
										style={{ width: 24, height: 24 }}
									/>
									<span className="absolute -top-1.5 -right-1.5 bg-red-400 w-5 h-5 rounded-xl flex justify-center items-center text-white text-xs">
										{cart?.totalProductQuantity ===
											undefined || isIniting ? (
											<CircularProgress
												size={12}
												style={{ color: "#fff" }}
												classes={{
													circle: styles.loadingCircle,
												}}
											/>
										) : (
											cart?.totalProductQuantity || 0
										)}
									</span>
								</IconButton>
							</div>
						)}
					</div>
				) : (
					<div className="hidden md:flex md:flex-1 md:justify-end md:order-2">
						{isSimpleHeader ? (
							<Link href="/cart">
								<ShoppingBagIcon
									className="h-6 w-6 text-gray-900 group-hover:text-indigo-600 cursor-pointer"
									aria-hidden="true"
								/>
							</Link>
						) : (
							<div className="flex gap-4 align-middle justify-center">
								<div
									className="text=base font-semibold leading-6 text-gray-900 cursor-pointer fill-blue-400 m-auto relative"
									onClick={() =>
										toggleDialogLogin(
											isOpenDialogLogin
												? Boolean(
														EnumStatusDialog.CLOSE,
													)
												: Boolean(
														EnumStatusDialog.OPEN,
													),
										)
									}>
									<User2
										className="hover:fill-blue-500"
										style={{ width: 32, height: 32 }}
									/>
								</div>
							</div>
						)}
					</div>
				)}
			</nav>
			<Transition appear show={mobileMenuOpen} as={Fragment}>
				<Dialog
					as="div"
					className="lg:hidden"
					open={mobileMenuOpen}
					onClose={setMobileMenuOpen}>
					<div className="fixed inset-0 z-10" />
					<Transition.Child
						as={Fragment}
						enter="ease-in-out duration-300"
						enterFrom="opacity-0 right-95"
						enterTo="opacity-100 right-100"
						leave="ease-in-out duration-200"
						leaveFrom="opacity-100 right-100"
						leaveTo="opacity-0 right-95">
						<Dialog.Panel className="fixed inset-y-0 right-0 z-60 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 transition-all duration-300 delay-150">
							<div className="flex items-center justify-between">
								<Link href="/" className="-m-1.5 p-1.5">
									<span className="sr-only">
										Your Company
									</span>
									<img
										className="h-11 w-auto"
										src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
										alt=""
									/>
								</Link>
								<button
									type="button"
									className="-m-2.5 rounded-md p-2.5 text-gray-700"
									onClick={() => setMobileMenuOpen(false)}>
									<span className="sr-only">Close menu</span>
									<XMarkIcon
										className="h-6 w-6"
										aria-hidden="true"
									/>
								</button>
							</div>
							<div className="mt-6 flow-root">
								<div className="-my-6 divide-y divide-gray-500/10">
									<div className="space-y-2 py-6">
										<Disclosure as="div" className="-mx-3">
											{({ open }) => (
												<div>
													<Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-lg font-semibold leading-7 text-gray-900 hover:bg-gray-50">
														Product
														<ChevronDownIcon
															className={classNames(
																open
																	? "rotate-180"
																	: "",
																"h-5 w-5 flex-none",
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
												</div>
											)}
										</Disclosure>
										<Link
											href="#"
											className="-mx-3 block rounded-lg px-3 py-2 text-lg font-semibold leading-7 text-gray-900 hover:bg-gray-50">
											Features
										</Link>
										<Link
											href="#"
											className="-mx-3 block rounded-lg px-3 py-2 text-lg font-semibold leading-7 text-gray-900 hover:bg-gray-50">
											Marketplace
										</Link>
										<Link
											href="#"
											className="-mx-3 block rounded-lg px-3 py-2 text-lg font-semibold leading-7 text-gray-900 hover:bg-gray-50">
											Company
										</Link>
									</div>
									<div className="py-6">
										<Link
											href="#"
											className="-mx-3 block rounded-lg px-3 py-2.5 text-lg font-semibold leading-7 text-gray-900 hover:bg-gray-50"
											onClick={() =>
												toggleDialogLogin(
													Boolean(
														EnumStatusDialog.OPEN,
													),
												)
											}>
											Log in
										</Link>
									</div>
								</div>
							</div>
						</Dialog.Panel>
					</Transition.Child>
				</Dialog>
			</Transition>
			<DialogLogin
				isOpen={Boolean(isOpenDialogLogin)}
				toggleOpen={() =>
					toggleDialogLogin(Boolean(!isOpenDialogLogin))
				}
			/>
			<ModalCartItem
				open={isOpenModalCartItem}
				handleClose={() => toggleModalCartItem(false)}
			/>
			<PopupLogOut
				open={openPopupLogout}
				handleClose={() => setOpenPopupLogout(false)}
			/>
		</header>
	);
}
