import { Check, Filter, Search } from "lucide-react";
import { useState } from "react";

interface RaffleFiltersProps {
	selectedArtists: string[];
	setSelectedArtists: (artists: string[]) => void;
	selectedSculptTypes: string[];
	setSelectedSculptTypes: (types: string[]) => void;
	filterEndingSoon: boolean;
	setFilterEndingSoon: (value: boolean) => void;
	filterRecentlyAdded: boolean;
	setFilterRecentlyAdded: (value: boolean) => void;
	filterWaitlist: boolean;
	setFilterWaitlist: (value: boolean) => void;
	priceRange: [number, number];
	setPriceRange: (range: [number, number]) => void;
	onClearFilters: () => void;
}

const ARTISTS = [
	"Jelly Key",
	"Dwarf Factory",
	"Artkey Universe",
	"S-Craft Studio",
	"Archetype",
];

const SCULPT_TYPES = ["Animal", "Robot", "Skull", "Food", "Abstract"];

export const RaffleFilters = ({
	selectedArtists,
	setSelectedArtists,
	selectedSculptTypes,
	setSelectedSculptTypes,
	filterEndingSoon,
	setFilterEndingSoon,
	filterRecentlyAdded,
	setFilterRecentlyAdded,
	filterWaitlist,
	setFilterWaitlist,
	priceRange,
	setPriceRange,
	onClearFilters,
}: RaffleFiltersProps) => {
	const [artistSearch, setArtistSearch] = useState("");
	return (
		<aside className="w-full lg:w-64 shrink-0">
			<div className="sticky top-24 space-y-8">
				{/* Filters */}
				<div>
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
							<Filter size={16} /> Bộ Lọc
						</h3>
						{(filterEndingSoon ||
							filterRecentlyAdded ||
							filterWaitlist ||
							selectedArtists.length > 0 ||
							selectedSculptTypes.length > 0 ||
							priceRange[0] > 0 ||
							priceRange[1] < 100) && (
							<button
								onClick={onClearFilters}
								className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors">
								Xóa
							</button>
						)}
					</div>
					<div className="space-y-2">
						<label className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer group transition-colors">
							<div
								className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
									filterEndingSoon
										? "border-blue-500 bg-blue-500"
										: "border-gray-300 bg-white group-hover:border-blue-400"
								}`}>
								{filterEndingSoon && (
									<Check size={16} className="text-white" />
								)}
							</div>
							<input
								type="checkbox"
								checked={filterEndingSoon}
								onChange={(e) =>
									setFilterEndingSoon(e.target.checked)
								}
								className="hidden"
							/>
							<span className="ml-3 text-gray-600 group-hover:text-gray-800 transition-colors">
								Kết Thúc Sớm
							</span>
							<span className="ml-auto text-xs text-gray-500">
								4
							</span>
						</label>
						<label className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer group transition-colors">
							<div
								className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
									filterRecentlyAdded
										? "border-blue-500 bg-blue-500"
										: "border-gray-300 bg-white group-hover:border-blue-400"
								}`}>
								{filterRecentlyAdded && (
									<Check size={16} className="text-white" />
								)}
							</div>
							<input
								type="checkbox"
								checked={filterRecentlyAdded}
								onChange={(e) =>
									setFilterRecentlyAdded(e.target.checked)
								}
								className="hidden"
							/>
							<span className="ml-3 text-gray-600 group-hover:text-gray-800 transition-colors">
								Được Thêm Gần Đây
							</span>
						</label>
						<label className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer group transition-colors">
							<div
								className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
									filterWaitlist
										? "border-blue-500 bg-blue-500"
										: "border-gray-300 bg-white group-hover:border-blue-400"
								}`}>
								{filterWaitlist && (
									<Check size={16} className="text-white" />
								)}
							</div>
							<input
								type="checkbox"
								checked={filterWaitlist}
								onChange={(e) =>
									setFilterWaitlist(e.target.checked)
								}
								className="hidden"
							/>
							<span className="ml-3 text-gray-600 group-hover:text-gray-800 transition-colors">
								Danh Sách Chờ
							</span>
						</label>
					</div>
				</div>

				{/* Price Range Filter */}
				<div>
					<h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">
						Giá
					</h3>
					<div className="space-y-3">
						<div className="flex gap-2">
							<input
								type="number"
								min="0"
								value={priceRange[0]}
								onChange={(e) =>
									setPriceRange([
										Math.max(
											0,
											Math.min(
												parseInt(e.target.value) || 0,
												priceRange[1],
											),
										),
										priceRange[1],
									])
								}
								placeholder="Min"
								className="w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
							/>
							<input
								type="number"
								max="100"
								value={priceRange[1]}
								onChange={(e) =>
									setPriceRange([
										priceRange[0],
										Math.max(
											priceRange[0],
											Math.min(
												parseInt(e.target.value) || 100,
												100,
											),
										),
									])
								}
								placeholder="Max"
								className="w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
							/>
						</div>
						<input
							type="range"
							min="0"
							max="100"
							value={priceRange[0]}
							onChange={(e) =>
								setPriceRange([
									Math.min(
										parseInt(e.target.value),
										priceRange[1],
									),
									priceRange[1],
								])
							}
							className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
						/>
						<input
							type="range"
							min="0"
							max="100"
							value={priceRange[1]}
							onChange={(e) =>
								setPriceRange([
									priceRange[0],
									Math.max(
										priceRange[0],
										parseInt(e.target.value),
									),
								])
							}
							className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
						/>
						<div className="text-xs text-gray-500 flex justify-between">
							<span>${priceRange[0]}</span>
							<span>${priceRange[1]}</span>
						</div>
					</div>
				</div>

				{/* Artist Filter */}
				<div>
					<h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">
						Nghệ Sĩ
					</h3>
					<div className="relative mb-3">
						<Search
							size={16}
							className="absolute left-3 top-2.5 text-gray-400"
						/>
						<input
							type="text"
							placeholder="Tìm nghệ sĩ..."
							value={artistSearch}
							onChange={(e) => setArtistSearch(e.target.value)}
							className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
						/>
					</div>
					<div className="space-y-1 h-40 overflow-y-auto pr-2 mb-3">
						{ARTISTS.filter((artist) =>
							artist
								.toLowerCase()
								.includes(artistSearch.toLowerCase()),
						).map((artist) => (
							<button
								key={artist}
								onClick={() => {
									if (selectedArtists.includes(artist)) {
										setSelectedArtists(
											selectedArtists.filter(
												(a) => a !== artist,
											),
										);
									} else {
										setSelectedArtists([
											...selectedArtists,
											artist,
										]);
									}
								}}
								className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
									selectedArtists.includes(artist)
										? "bg-blue-500/10 border-l-2 border-blue-500 text-gray-900 font-medium"
										: "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
								}`}>
								{artist}
							</button>
						))}
					</div>
					{selectedArtists.length > 0 && (
						<div className="pt-3 border-t border-gray-200">
							<p className="text-xs text-gray-500 mb-2">
								Đã chọn:
							</p>
							<div className="flex flex-wrap gap-2">
								{selectedArtists.map((artist) => (
									<div
										key={artist}
										className="inline-flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
										{artist}
										<button
											onClick={() =>
												setSelectedArtists(
													selectedArtists.filter(
														(a) => a !== artist,
													),
												)
											}
											className="ml-1 hover:opacity-75 transition-opacity">
											×
										</button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Sculpt Type Tags */}
				<div>
					<h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">
						Loại Tác
					</h3>
					<div className="space-y-2">
						<div className="flex flex-wrap gap-2">
							{SCULPT_TYPES.map((type) => (
								<button
									key={type}
									onClick={() => {
										if (
											selectedSculptTypes.includes(type)
										) {
											setSelectedSculptTypes(
												selectedSculptTypes.filter(
													(t) => t !== type,
												),
											);
										} else {
											setSelectedSculptTypes([
												...selectedSculptTypes,
												type,
											]);
										}
									}}
									className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
										selectedSculptTypes.includes(type)
											? "bg-blue-500/10 border border-blue-500 text-blue-600"
											: "bg-gray-100 border border-gray-200 text-gray-600 hover:border-blue-500/50 hover:text-gray-800"
									}`}>
									{type}
								</button>
							))}
						</div>
						{selectedSculptTypes.length > 0 && (
							<div className="pt-2 border-t border-gray-200">
								<p className="text-xs text-gray-500 mb-2">
									Đã chọn:
								</p>
								<div className="flex flex-wrap gap-2">
									{selectedSculptTypes.map((type) => (
										<div
											key={type}
											className="inline-flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
											{type}
											<button
												onClick={() =>
													setSelectedSculptTypes(
														selectedSculptTypes.filter(
															(t) => t !== type,
														),
													)
												}
												className="ml-1 hover:opacity-75 transition-opacity">
												×
											</button>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</aside>
	);
};
