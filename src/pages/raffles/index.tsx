import {
	ChevronLeft,
	ChevronRight,
	Search,
	Star,
	TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { Button } from "@/components/ReUIComponent/Button";
import { Base } from "@/templates/Base";
import { RaffleCard } from "./RaffleCard";
import { RaffleFilters } from "./RaffleFilters";

// Mock data
const FEATURED_RAFFLES = [
	{
		id: 1,
		title: "McWhale: The Deep Dive",
		artist: "Dwarf Factory",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAB76T7e6kDhJNaxfXNXuwCgUjIEUD3f3sc8TYS8Te5UvmaQ2Ph_m9AVUTUdLCQ1rt7H8BwZSGq7Zu8MHi8El8V2NLHQmJmYEn23_Pnqar4Sa56Ie_s3NJ9NCYSh5_Qf1-br4JxYL0XLz-CbqZLI-bJlPD3ixrtFGzoeHBVeZZmknrKWaz4C44yLwirwVImgpQnb0FxSK-gjOX3D7BrBJ3BbCqO8ToyuKbyKMmssPCDGacp77ReeBUVcKcBjwM12S5RG-vMsRmkNWke",
		timeLeft: "2h 15m",
		price: 45.0,
		featured: true,
	},
	{
		id: 2,
		title: "Zed: Project Void",
		artist: "Archetype",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWdDQ_NpS4Ex8S7k5wF0w4mbEm_FkhpK__Jm-qyYIPgyW8iSg2ZGEjnsza8vaH617PG5QFtL8ShnUf-IL0A1UhH0SrKy6dJREWgXIhHSaXsK2LW9WTzK1R57epeCCWCqL5n7Nq9xgfQlj1RfP3PZMVpVpV_apjwdjw-ct3YI_O8SRtLxpfMdJEgWuvee_l05Celd9kk-jfNQxjASjWq9hltT2DncV6WsiscIWS-TNgCp_4qKP7Aa4RXFV7jFkgDy4w8fAL0djT9xDf",
		timeLeft: "5h 30m",
		price: 65.0,
		featured: true,
	},
];

const LIVE_RAFFLES = [
	{
		id: 3,
		title: "Obsidian Skull",
		artist: "Project Key",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCx9KhiUvF5q6DP_ZgnkGUhWjUpuZHZZzbImhvttcR5Br7rI-Q0hjyVuSrsgSjtcVqYVZWB_GaCt8F-tSDGfwGgfuv7Q9RXRmHoFPyS2oCSeSMMRHd_1ZfYha_S1bR8g02GSojcnmhQZ5Ro2oO-Nc6nu51ZjetZl2_1vae7cIUeALaBoCPFVKB84KV41GD5w9NzfDC3d4PLHCVoJAdU2uabAti_OO0YGoQsS8EPVXolLtG0VbLbXB2l9g1cITcLuxxN9iiRckwnEA68",
		timeLeft: "45m",
		price: 55.0,
		aspect: "tall",
		status: "Hot",
	},
	{
		id: 4,
		title: "Nebula Fragment",
		artist: "Jelly Key",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcXIpSLbyc6doul4OEKzJsE1lzz4k0V-sPIVPZzQFiRhVCGKE1GQR-M5RA66geDndQG9mI9rWtS1QEsiy6AHnZP_boTcpUUMdI44H81VD_HWS4kEw9VywXvE1CsmshUp8Z2QGekG_PD4DkNs2HeygMibmp3Qe_o8kIUf0ODOkZVFfrsUMLp7v9LCXLDC7svwtwLUhs46XHI719jv5Vf8vMHQNAXjbcfPPi8M5KNpC567KrdyoWSZTpPLZ6RwAVKvxG1UUd-YMgjuZz",
		timeLeft: "12h",
		price: 50.0,
		aspect: "square",
	},
	{
		id: 5,
		title: "Lucky Cat",
		artist: "B.O.B Handcraft",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBb2nOwjwrcuwcQVBDtrIKg-Ue1EUPvGGyGfWUvVWNirPicCkCZomVW46k0Osec_HtAOaSTAJWuiAFGS03h2n1Fc2pIJKFk-gakgQ_sTopyYa0M5vv7HPye9HcM5ZPTipXpKEkV7XTKPpzmfgitMzlg9TN8GS0ogx3sihN5kUBv0aCKyRtrKJWq530U1gn4xOOe49_RLz1pMbdtEF-3oyLwGCu01SNDZC8vg4nzY-iGf8m84ng4dG3eykDdEpF-OUfHmzyI0Sh5SxvZ",
		timeLeft: "1d 4h",
		price: 40.0,
		aspect: "wide",
		isNew: true,
	},
	{
		id: 6,
		title: "Mecha-01",
		artist: "Gaff Caps",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJcPxxA8CXu-2l1ywpH0arit25YUQo9gVQVQ_4RfnKpEuOIY3YWcewqs3X5sM1BRIDh11G58et86SnslQ-tfxdPWNOYwsefQI33tbfINx6ejZirD4mmO2ZKj61Eh208uvVLh1P03LfrFvnxd1DxkKas8J2kT2ZYu9rCuJy-OevgwboiUpuwcvhvMI0FhF-PF9WV_hEJ9D1zWOK0DxAeR_h1fyLuS2k1aLA6X1TiclDSdR7loDlWK4XWvob8hLq5umvY3pmu-PBOuc9",
		timeLeft: "8h",
		price: 70.0,
		aspect: "tall",
	},
	{
		id: 7,
		title: "Dragon Keeper",
		artist: "Dwarf Factory",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBb2nOwjwrcuwcQVBDtrIKg-Ue1EUPvGGyGfWUvVWNirPicCkCZomVW46k0Osec_HtAOaSTAJWuiAFGS03h2n1Fc2pIJKFk-gakgQ_sTopyYa0M5vv7HPye9HcM5ZPTipXpKEkV7XTKPpzmfgitMzlg9TN8GS0ogx3sihN5kUBv0aCKyRtrKJWq530U1gn4xOOe49_RLz1pMbdtEF-3oyLwGCu01SNDZC8vg4nzY-iGf8m84ng4dG3eykDdEpF-OUfHmzyI0Sh5SxvZ",
		timeLeft: "6h 30m",
		price: 85.0,
		isNew: true,
	},
	{
		id: 8,
		title: "Crystal Paradise",
		artist: "Jelly Key",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWdDQ_NpS4Ex8S7k5wF0w4mbEm_FkhpK__Jm-qyYIPgyW8iSg2ZGEjnsza8vaH617PG5QFtL8ShnUf-IL0A1UhH0SrKy6dJREWgXIhHSaXsK2LW9WTzK1R57epeCCWCqL5n7Nq9xgfQlj1RfP3PZMVpVpV_apjwdjw-ct3YI_O8SRtLxpfMdJEgWuvee_l05Celd9kk-jfNQxjASjWq9hltT2DncV6WsiscIWS-TNgCp_4qKP7Aa4RXFV7jFkgDy4w8fAL0djT9xDf",
		timeLeft: "18h",
		price: 95.0,
	},
	{
		id: 9,
		title: "Sakura Bloom",
		artist: "B.O.B Handcraft",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAB76T7e6kDhJNaxfXNXuwCgUjIEUD3f3sc8TYS8Te5UvmaQ2Ph_m9AVUTUdLCQ1rt7H8BwZSGq7Zu8MHi8El8V2NLHQmJmYEn23_Pnqar4Sa56Ie_s3NJ9NCYSh5_Qf1-br4JxYL0XLz-CbqZLI-bJlPD3ixrtFGzoeHBVeZZmknrKWaz4C44yLwirwVImgpQnb0FxSK-gjOX3D7BrBJ3BbCqO8ToyuKbyKMmssPCDGacp77ReeBUVcKcBjwM12S5RG-vMsRmkNWke",
		timeLeft: "3h",
		price: 60.0,
		status: "Hot",
	},
	{
		id: 10,
		title: "Ocean Waves",
		artist: "Project Key",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCx9KhiUvF5q6DP_ZgnkGUhWjUpuZHZZzbImhvttcR5Br7rI-Q0hjyVuSrsgSjtcVqYVZWB_GaCt8F-tSDGfwGgfuv7Q9RXRmHoFPyS2oCSeSMMRHd_1ZfYha_S1bR8g02GSojcnmhQZ5Ro2oO-Nc6nu51ZjetZl2_1vae7cIUeALaBoCPFVKB84KV41GD5w9NzfDC3d4PLHCVoJAdU2uabAti_OO0YGoQsS8EPVXolLtG0VbLbXB2l9g1cITcLuxxN9iiRckwnEA68",
		timeLeft: "2d",
		price: 72.0,
	},
	{
		id: 11,
		title: "Sunset Dreams",
		artist: "Archetype",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJcPxxA8CXu-2l1ywpH0arit25YUQo9gVQVQ_4RfnKpEuOIY3YWcewqs3X5sM1BRIDh11G58et86SnslQ-tfxdPWNOYwsefQI33tbfINx6ejZirD4mmO2ZKj61Eh208uvVLh1P03LfrFvnxd1DxkKas8J2kT2ZYu9rCuJy-OevgwboiUpuwcvhvMI0FhF-PF9WV_hEJ9D1zWOK0DxAeR_h1fyLuS2k1aLA6X1TiclDSdR7loDlWK4XWvob8hLq5umvY3pmu-PBOuc9",
		timeLeft: "14h",
		price: 78.0,
	},
	{
		id: 12,
		title: "Midnight Star",
		artist: "Gaff Caps",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcXIpSLbyc6doul4OEKzJsE1lzz4k0V-sPIVPZzQFiRhVCGKE1GQR-M5RA66geDndQG9mI9rWtS1QEsiy6AHnZP_boTcpUUMdI44H81VD_HWS4kEw9VywXvE1CsmshUp8Z2QGekG_PD4DkNs2HeygMibmp3Qe_o8kIUf0ODOkZVFfrsUMLp7v9LCXLDC7svwtwLUhs46XHI719jv5Vf8vMHQNAXjbcfPPi8M5KNpC567KrdyoWSZTpPLZ6RwAVKvxG1UUd-YMgjuZz",
		timeLeft: "11h",
		price: 48.0,
	},
];

export default function RafflesPage() {
	const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
	const [selectedSculptTypes, setSelectedSculptTypes] = useState<string[]>(
		[],
	);
	const [filterEndingSoon, setFilterEndingSoon] = useState(false);
	const [filterRecentlyAdded, setFilterRecentlyAdded] = useState(false);
	const [filterWaitlist, setFilterWaitlist] = useState(false);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
	const [carouselIndex, setCarouselIndex] = useState(0);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState("Kết Thúc Sớm");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 6;

	const handleClearFilters = () => {
		setSelectedArtists([]);
		setSelectedSculptTypes([]);
		setFilterEndingSoon(false);
		setFilterRecentlyAdded(false);
		setFilterWaitlist(false);
		setPriceRange([0, 100]);
		setSearchQuery("");
		setCurrentPage(1);
	};

	const handleCarouselNext = () => {
		setCarouselIndex((prev) => (prev + 1) % FEATURED_RAFFLES.length);
	};

	const handleCarouselPrev = () => {
		setCarouselIndex((prev) =>
			prev === 0 ? FEATURED_RAFFLES.length - 1 : prev - 1,
		);
	};

	const currentFeatured = FEATURED_RAFFLES[carouselIndex];

	// Filter and sort logic
	const filteredAndSortedRaffles = useMemo(() => {
		let filtered = LIVE_RAFFLES.filter((raffle) => {
			// Search filter
			const matchesSearch =
				raffle.title
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				raffle.artist.toLowerCase().includes(searchQuery.toLowerCase());

			// Price filter
			const matchesPrice =
				raffle.price >= priceRange[0] && raffle.price <= priceRange[1];

			// Artist filter (multiple selection)
			const matchesArtist =
				selectedArtists.length === 0 ||
				selectedArtists.includes(raffle.artist);

			// Sculpt type filter (multiple selection) - we'd need to add to raffle data
			const matchesSculptType = selectedSculptTypes.length === 0;

			// Time filter
			const matchesEndingSoon =
				!filterEndingSoon ||
				(raffle.timeLeft && parseInt(raffle.timeLeft) < 120); // Less than 2 hours

			const matchesRecentlyAdded =
				!filterRecentlyAdded || ("isNew" in raffle && raffle.isNew);
			const matchesWaitlist = !filterWaitlist; // Can be extended

			return (
				matchesSearch &&
				matchesPrice &&
				matchesArtist &&
				matchesSculptType &&
				matchesEndingSoon &&
				matchesRecentlyAdded &&
				matchesWaitlist
			);
		});

		// Sorting logic
		const sorted = [...filtered].sort((a, b) => {
			switch (sortBy) {
				case "Giá: Thấp đến Cao":
					return a.price - b.price;
				case "Giá: Cao đến Thấp":
					return b.price - a.price;
				case "Mới Nhất":
					return b.id - a.id;
				case "Kết Thúc Sớm":
				default:
					// Simple approximation - items with shorter time left come first
					const timeA = parseInt(a.timeLeft);
					const timeB = parseInt(b.timeLeft);
					return timeA - timeB;
			}
		});

		return sorted;
	}, [
		searchQuery,
		selectedArtists,
		selectedSculptTypes,
		priceRange,
		filterEndingSoon,
		filterRecentlyAdded,
		filterWaitlist,
		sortBy,
	]);

	// Pagination
	const totalPages = Math.ceil(
		filteredAndSortedRaffles.length / itemsPerPage,
	);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedRaffles = filteredAndSortedRaffles.slice(
		startIndex,
		startIndex + itemsPerPage,
	);

	const handlePageChange = (page: number) => {
		setCurrentPage(Math.max(1, Math.min(page, totalPages)));
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<Base>
			<div className="min-h-screen bg-gray-50">
				{/* Hot & Popular Carousel Section */}
				<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
							<TrendingUp size={24} className="text-red-500" />
							Nóng & Phổ Biến
						</h2>
						<div className="flex gap-2">
							<button
								onClick={handleCarouselPrev}
								className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white transition-colors">
								<ChevronLeft size={16} />
							</button>
							<button
								onClick={handleCarouselNext}
								className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white transition-colors">
								<ChevronRight size={16} />
							</button>
						</div>
					</div>

					{/* Carousel Container */}
					<div className="relative w-full h-80 rounded-2xl overflow-hidden group bg-gray-100">
						{/* Background Image */}
						<Image
							src={
								currentFeatured?.image ||
								FEATURED_RAFFLES[0]!.image
							}
							alt={
								currentFeatured?.title ||
								FEATURED_RAFFLES[0]!.title
							}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-105"
						/>

						{/* Overlay Gradients */}
						<div className="absolute inset-0 bg-linear-to-t from-gray-50 via-gray-50/40 to-transparent"></div>

						{/* Trending Badge */}
						<div className="absolute top-6 left-6 bg-blue-500/10 backdrop-blur-md border border-blue-500/30 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
							<TrendingUp size={14} className="animate-pulse" />
							Xu Hướng Hiện Tại
						</div>

						{/* Content Area */}
						<div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
							<div className="space-y-2 max-w-2xl">
								<div className="text-blue-600 font-medium tracking-wide text-sm">
									{currentFeatured?.artist ||
										FEATURED_RAFFLES[0]!.artist}
								</div>
								<h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
									{currentFeatured?.title ||
										FEATURED_RAFFLES[0]!.title}
								</h1>
								<p className="text-gray-600 text-sm md:text-base max-w-md line-clamp-2">
									Xổ số phiên bản giới hạn với keycap thủ công
									độc quyền. Đừng bỏ lỡ cơ hội sở hữu một tác
									phẩm nghệ thuật có thể sưu tập.
								</p>
							</div>
							<div className="flex flex-col gap-3 min-w-60 text-right md:text-left">
								<div className="flex items-center gap-2 text-sm text-gray-600 justify-end md:justify-start">
									<ChevronRight
										size={16}
										className="text-blue-600"
									/>
									<span>
										Kết thúc trong{" "}
										<span className="text-gray-900 font-mono font-bold">
											{currentFeatured?.timeLeft ||
												FEATURED_RAFFLES[0]!.timeLeft}
										</span>
									</span>
								</div>
								<Button
									variant="primary"
									className="px-6 py-3 font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
									Enter Raffle
									<ChevronRight size={16} />
								</Button>
							</div>
						</div>
					</div>

					{/* Carousel Indicators */}
					<div className="flex items-center justify-center gap-3 pt-4">
						{FEATURED_RAFFLES.map((_, index) => (
							<button
								key={index}
								onClick={() => setCarouselIndex(index)}
								className={`transition-all ${
									index === carouselIndex
										? "w-12 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
										: "w-3 h-1.5 bg-gray-400/40 rounded-full hover:bg-gray-600/60"
								}`}
							/>
						))}
					</div>
				</section>

				{/* Main Content */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8">
					{/* Sidebar */}
					<RaffleFilters
						selectedArtists={selectedArtists}
						setSelectedArtists={setSelectedArtists}
						selectedSculptTypes={selectedSculptTypes}
						setSelectedSculptTypes={setSelectedSculptTypes}
						filterEndingSoon={filterEndingSoon}
						setFilterEndingSoon={setFilterEndingSoon}
						filterRecentlyAdded={filterRecentlyAdded}
						setFilterRecentlyAdded={setFilterRecentlyAdded}
						filterWaitlist={filterWaitlist}
						setFilterWaitlist={setFilterWaitlist}
						priceRange={priceRange}
						setPriceRange={setPriceRange}
						onClearFilters={handleClearFilters}
					/>

					{/* Main Content Area */}
					<main className="flex-1 min-w-0">
						{/* Featured Section */}
						<section className="mb-12">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
									<Star
										size={18}
										className="text-yellow-400"
									/>{" "}
									Nghệ Sĩ Nổi Bật
								</h2>
								<a
									href="#"
									className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
									Xem Tất Cả Nổi Bật
								</a>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{FEATURED_RAFFLES.map((raffle) => (
									<RaffleCard
										key={raffle.id}
										raffle={raffle}
										isFeatured
									/>
								))}
							</div>
						</section>

						{/* Live Raffles Section */}
						<section>
							<div className="flex items-center justify-between gap-4 mb-6">
								<div className="flex-1 relative">
									<Search
										size={18}
										className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
									/>
									<input
										type="text"
										placeholder="Tìm kiếm xổ số..."
										value={searchQuery}
										onChange={(e) => {
											setSearchQuery(e.target.value);
											setCurrentPage(1);
										}}
										className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
									/>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<span className="text-gray-600">
										Sắp xếp:
									</span>
									<select
										value={sortBy}
										onChange={(e) => {
											setSortBy(e.target.value);
											setCurrentPage(1);
										}}
										className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer transition-all">
										<option>Kết Thúc Sớm</option>
										<option>Giá: Thấp đến Cao</option>
										<option>Giá: Cao đến Thấp</option>
										<option>Mới Nhất</option>
									</select>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max mb-8">
								{paginatedRaffles.length > 0 ? (
									paginatedRaffles.map((raffle) => (
										<div
											key={raffle.id}
											className={`${
												"aspect" in raffle &&
												raffle.aspect === "tall"
													? "md:row-span-2"
													: ""
											}`}>
											<RaffleCard raffle={raffle} />
										</div>
									))
								) : (
									<div className="col-span-full flex justify-center items-center py-12">
										<p className="text-gray-500 text-center">
											Không tìm thấy xổ số nào phù hợp với
											tiêu chí của bạn
										</p>
									</div>
								)}
							</div>

							{/* Pagination Controls */}
							{totalPages > 1 && (
								<div className="flex items-center justify-center gap-2 mt-8">
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											handlePageChange(currentPage - 1)
										}
										disabled={currentPage === 1}>
										Trang Trước
									</Button>

									<div className="flex items-center gap-1">
										{Array.from({ length: totalPages }).map(
											(_, i) => (
												<button
													key={i + 1}
													onClick={() =>
														handlePageChange(i + 1)
													}
													className={`min-w-10 h-10 rounded-lg font-medium transition-colors ${
														currentPage === i + 1
															? "bg-blue-500 text-white"
															: "bg-gray-100 text-gray-900 hover:bg-gray-200"
													}`}>
													{i + 1}
												</button>
											),
										)}
									</div>

									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											handlePageChange(currentPage + 1)
										}
										disabled={currentPage === totalPages}>
										Trang Sau
									</Button>
								</div>
							)}
						</section>
					</main>
				</div>
			</div>
		</Base>
	);
}
