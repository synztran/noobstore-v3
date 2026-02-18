import { ChevronRight, Star } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ReUIComponent/Button";

interface Product {
	id: number;
	title: string;
	artist: string;
	image: string;
	timeLeft: string;
	price: number;
	aspect?: string;
	status?: string;
	isNew?: boolean;
}

interface TopicSectionProps {
	title: string;
	icon?: React.ReactNode;
	description?: string;
	backgroundImage: string;
	products: Product[];
	backgroundColor?: string;
	textColor?: string;
	accentColor?: string;
	onProductClick?: (product: Product) => void;
	onViewAll?: () => void;
}

export const TopicSection = ({
	title,
	icon,
	description,
	backgroundImage,
	products,
	backgroundColor = "from-orange-50 to-amber-50",
	textColor = "text-gray-900",
	accentColor = "text-orange-600",
	onProductClick,
	onViewAll,
}: TopicSectionProps) => {
	return (
		<section className={`mb-16`}>
			{/* Header with Background */}
			<div
				className={`relative rounded-2xl overflow-hidden mb-8 h-48 flex items-end p-8 md:p-12 bg-linear-to-r ${backgroundColor}`}>
				{/* Background Image */}
				<Image
					src={backgroundImage}
					alt={title}
					fill
					className="object-cover opacity-20 absolute inset-0"
				/>

				{/* Content */}
				<div className="relative z-10">
					<div className="flex items-center gap-3 mb-2">
						{icon && <div className="text-4xl">{icon}</div>}
						<h2 className={`text-3xl font-bold ${textColor}`}>
							{title}
						</h2>
					</div>
					{description && (
						<p
							className={`text-sm md:text-base max-w-2xl ${accentColor}`}>
							{description}
						</p>
					)}
				</div>
			</div>

			{/* Products Grid with Header */}
			<div className="flex items-center justify-between mb-6 px-2">
				<h3
					className={`text-xl font-bold ${textColor} flex items-center gap-2`}>
					<Star size={20} className={accentColor} />
					Sản Phẩm Nổi Bật
				</h3>
				<button
					onClick={onViewAll}
					className={`text-sm ${accentColor} hover:underline font-medium transition-colors`}>
					Xem Tất Cả
				</button>
			</div>

			{/* Products Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
				{products.map((product) => (
					<div
						key={product.id}
						onClick={() => onProductClick?.(product)}
						className={`group relative bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer`}>
						<div
							className={`relative overflow-hidden ${
								product.aspect === "tall"
									? "aspect-4/5"
									: product.aspect === "wide"
										? "aspect-4/3"
										: "aspect-square"
							}`}>
							<Image
								src={product.image}
								alt={product.title}
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>

							{product.isNew && (
								<div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">
									Mới
								</div>
							)}
							{product.status && (
								<div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">
									{product.status}
								</div>
							)}
						</div>

						<div className="p-5">
							<div className="flex justify-between items-start mb-2">
								<div>
									<h3
										className={`text-lg font-bold ${textColor} group-hover:${accentColor} transition-colors`}>
										{product.title}
									</h3>
									<p className="text-sm text-gray-600">
										{product.artist}
									</p>
								</div>
								<div
									className={`bg-blue-500/10 ${accentColor} px-2 py-1 rounded text-xs font-bold`}>
									${product.price.toFixed(2)}
								</div>
							</div>

							<div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
								<div className="flex items-center gap-1 text-gray-600 text-xs font-semibold">
									<ChevronRight size={12} /> Còn{" "}
									{product.timeLeft}
								</div>
								<Button
									variant="outline"
									size="sm"
									className="text-xs font-bold uppercase tracking-wider">
									Tham Gia
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};
