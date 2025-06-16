import { createPopper } from "@popperjs/core";
import Link from "next/link";
import React from "react";

const IndexDropdown = () => {
	// dropdown props
	const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
	const btnDropdownRef = React.createRef<HTMLAnchorElement>();
	const popoverDropdownRef = React.createRef<HTMLDivElement>();
	const openDropdownPopover = () => {
		createPopper(
			btnDropdownRef.current as HTMLElement,
			popoverDropdownRef.current as HTMLElement,
			{
				placement: "bottom-start",
			}
		);
		setDropdownPopoverShow(true);
	};
	const closeDropdownPopover = () => {
		setDropdownPopoverShow(false);
	};
	return (
		<div>
			<a
				className="hover:text-slate-500 text-slate-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
				href="#pablo"
				ref={btnDropdownRef}
				onClick={(e) => {
					e.preventDefault();
					dropdownPopoverShow
						? closeDropdownPopover()
						: openDropdownPopover();
				}}>
				Demo Pages
			</a>
			<div
				ref={popoverDropdownRef}
				className={
					(dropdownPopoverShow ? "block " : "hidden ") +
					"bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
				}>
				<span
					className={
						"text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-slate-400"
					}>
					Admin Layout
				</span>
				<Link href="/admin/dashboard">
					<span
						// href="#pablo"
						className={
							"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-slate-700"
						}>
						Dashboard
					</span>
				</Link>
				<Link href="/admin/settings">
					<span
						// href="#pablo"
						className={
							"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-slate-700"
						}>
						Settings
					</span>
				</Link>
				<Link href="/admin/tables">
					<span
						// href="#pablo"
						className={
							"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-slate-700"
						}>
						Tables
					</span>
				</Link>
				<Link href="/admin/maps">
					<span
						// href="#pablo"
						className={
							"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-slate-700"
						}>
						Maps
					</span>
				</Link>
				<div className="h-0 mx-4 my-2 border border-solid border-slate-100" />
				<span
					className={
						"text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-slate-400"
					}>
					Auth Layout
				</span>
				<Link href="/auth/login">
					<span
						// href="#pablo"
						className={
							"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-slate-700"
						}>
						Login
					</span>
				</Link>
				<Link href="/auth/register">
					<span
						// href="#pablo"
						className={
							"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-slate-700"
						}>
						Register
					</span>
				</Link>
				<div className="h-0 mx-4 my-2 border border-solid border-slate-100" />
				<span
					className={
						"text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-slate-400"
					}>
					No Layout
				</span>
				<Link href="/landing">
					<span
						// href="#pablo"
						className={
							"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-slate-700"
						}>
						Landing
					</span>
				</Link>
				<Link href="/profile">
					<span
						// href="#pablo"
						className={
							"text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-slate-700"
						}>
						Profile
					</span>
				</Link>
			</div>
		</div>
	);
};

export default IndexDropdown;
