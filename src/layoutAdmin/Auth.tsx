// components

import FooterSmall from "@/adminComponents/Footers/FooterSmall";
import Navbar from "@/adminComponents/Navbars/AuthNavbar.js";

export default function Auth({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Navbar />
			<main>
				<section className="relative w-full h-full py-40 min-h-screen">
					<div
						className="absolute top-0 w-full h-full bg-slate-800 bg-no-repeat bg-full"
						style={{
							backgroundImage: "url('/img/register_bg_2.png')",
						}}></div>
					{children}
					<FooterSmall absolute />
				</section>
			</main>
		</div>
	);
}
