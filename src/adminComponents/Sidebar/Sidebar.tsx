import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import NotificationDropdown from "@/adminComponents/Dropdowns/NotificationDropdown";
import UserDropdown from "@/adminComponents/Dropdowns/UserDropdown";
import { ArrowLeftToLine } from "lucide-react";

export default function Sidebar() {
	const [isCollapsed, setIsCollapsed] = React.useState(false);
	const router = useRouter();
	return (
		<nav
			className={`left-0 block relative top-0 bottom-0 overflow-y-auto flex-row flex-nowrap overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative ${
				isCollapsed ? "w-16" : "w-64"
			} z-10 py-4 px-2 transition-all duration-300`}>
			<div className="flex-col items-stretch min-h-full flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
				<div className="flex items-center justify-between">
					{/* Brand */}
					<Link href="/" className={isCollapsed ? "hidden" : ""}>
						<span className="block text-left pb-2 text-slate-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0">
							NoobStore CMS
						</span>
					</Link>
					<button
						className="cursor-pointer text-black opacity-50 px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
						type="button"
						onClick={() => setIsCollapsed((prev) => !prev)}>
						<ArrowLeftToLine />
					</button>
				</div>

				{/* Collapse */}
				<div
					className={
						"flex flex-col items-stretch opacity-100 relative mt-4 shadow-none h-auto items-center flex-1 rounded " +
						(isCollapsed ? "w-16" : "w-64")
					}>
					{/* Divider */}
					<hr className="my-4 min-w-full" />
					{/* Heading */}
					<h6 className="min-w-full text-slate-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
						Admin Layout Pages
					</h6>
					{/* Navigation */}

					<ul className="flex-col min-w-full flex flex-col list-none">
						<li className="items-center">
							<Link href="/admin/dashboard">
								<span
									className={
										"text-xs uppercase py-3 font-bold block flex items-center " +
										(router.pathname.indexOf(
											"/admin/dashboard"
										) !== -1
											? "text-sky-500 hover:text-sky-600"
											: "text-slate-700 hover:text-slate-500")
									}>
									<i className="fas fa-tv text-sm" />
									<span
										className={
											isCollapsed ? "hidden" : "ml-2"
										}>
										Dashboard
									</span>
								</span>
							</Link>
						</li>

						<li className="items-center">
							<Link href="/admin/settings">
								<span
									className={
										"text-xs uppercase py-3 font-bold block " +
										(router.pathname.indexOf(
											"/admin/settings"
										) !== -1
											? "text-sky-500 hover:text-sky-600"
											: "text-slate-700 hover:text-slate-500")
									}>
									<i
										className={
											"fas fa-tools mr-2 text-sm " +
											(router.pathname.indexOf(
												"/admin/settings"
											) !== -1
												? "opacity-75"
												: "text-slate-300")
										}></i>{" "}
									Settings
								</span>
							</Link>
						</li>

						<li className="items-center">
							<Link href="/admin/tables">
								<span
									className={
										"text-xs uppercase py-3 font-bold block " +
										(router.pathname.indexOf(
											"/admin/tables"
										) !== -1
											? "text-sky-500 hover:text-sky-600"
											: "text-slate-700 hover:text-slate-500")
									}>
									<i
										className={
											"fas fa-table mr-2 text-sm " +
											(router.pathname.indexOf(
												"/admin/tables"
											) !== -1
												? "opacity-75"
												: "text-slate-300")
										}></i>{" "}
									Tables
								</span>
							</Link>
						</li>

						<li className="items-center">
							<Link href="/admin/maps">
								<span
									className={
										"text-xs uppercase py-3 font-bold block " +
										(router.pathname.indexOf(
											"/admin/maps"
										) !== -1
											? "text-sky-500 hover:text-sky-600"
											: "text-slate-700 hover:text-slate-500")
									}>
									<i
										className={
											"fas fa-map-marked mr-2 text-sm " +
											(router.pathname.indexOf(
												"/admin/maps"
											) !== -1
												? "opacity-75"
												: "text-slate-300")
										}></i>{" "}
									Maps
								</span>
							</Link>
						</li>
						<li className="items-center">
							<Link href="/admin/categories">
								<span
									className={
										"text-xs uppercase py-3 font-bold block " +
										(router.pathname.indexOf(
											"/admin/categories"
										) !== -1
											? "text-sky-500 hover:text-sky-600"
											: "text-slate-700 hover:text-slate-500")
									}>
									<i
										className={
											"fas fa-map-marked mr-2 text-sm " +
											(router.pathname.indexOf(
												"/admin/maps"
											) !== -1
												? "opacity-75"
												: "text-slate-300")
										}></i>{" "}
									Danh mục
								</span>
							</Link>
						</li>
						<li className="items-center">
							<Link href="/admin/products">
								<span
									className={
										"text-xs uppercase py-3 font-bold block " +
										(router.pathname.indexOf(
											"/admin/categories"
										) !== -1
											? "text-sky-500 hover:text-sky-600"
											: "text-slate-700 hover:text-slate-500")
									}>
									<i
										className={
											"fas fa-map-marked mr-2 text-sm " +
											(router.pathname.indexOf(
												"/admin/maps"
											) !== -1
												? "opacity-75"
												: "text-slate-300")
										}></i>{" "}
									Sản phẩm
								</span>
							</Link>
						</li>
						<li className="items-center">
							<Link href="/admin/productOptions">
								<span
									className={
										"text-xs uppercase py-3 font-bold block " +
										(router.pathname.indexOf(
											"/admin/categories"
										) !== -1
											? "text-sky-500 hover:text-sky-600"
											: "text-slate-700 hover:text-slate-500")
									}>
									<i
										className={
											"fas fa-map-marked mr-2 text-sm " +
											(router.pathname.indexOf(
												"/admin/maps"
											) !== -1
												? "opacity-75"
												: "text-slate-300")
										}></i>{" "}
									Tùy chọn sản phẩm
								</span>
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}
