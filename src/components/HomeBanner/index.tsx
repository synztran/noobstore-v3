import React from "react";

const backgroundImage =
	"https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1500&q=80"; // Example image, replace with your own

const HomeBanner = () => {
	return (
		<div
			className="relative -top-8 w-full min-h-[400px] md:min-h-[600px] flex items-center justify-center rounded-2xl overflow-hidden"
			style={{
				backgroundImage: `url(${backgroundImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}>
			<div className="absolute inset-0 bg-black/50 z-0" />
			<div className="relative z-10 text-center px-4">
				<h1 className="text-3xl md:text-6xl font-bold text-white mb-4">
					Welcome to Noobstore
				</h1>
				<p className="text-lg md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
					Discover the world of mechanical keyboards with Noobstore.
					We offer a wide range of mechanical keyboards, keycaps, and
					services to elevate your typing experience.
				</p>
				<button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow-lg transition">
					Shop Now
				</button>
			</div>
		</div>
	);
};

export default HomeBanner;
