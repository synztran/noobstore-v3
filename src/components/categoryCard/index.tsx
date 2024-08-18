import { formatCurrency } from "@/utils/FormatNumber";
import { Category } from "interface";
import NextImage from "next/image";
import Link from "next/link";
import { CategoryStatus } from "../constants";
import Tag from "../tags";

interface Props {
	category: Category;
}

const CategoryCard = ({ category }: Props) => {
	const {
		pic_profile,
		category_name,
		slug,
		type,
		status_gb,
		min_price,
		max_price,
		description,
		sale_price,
		is_active
	} = category || {};

	if (!is_active) return null;

	return (
		<div className="max-w-lg relative p-4 border border-solid border-gray-400 shadow-lg hover:shadow-xl xs:w-full h-max">
			<Link href={`/product/${slug}`}>
				<div className="w-full h-88 relative overflow-hidden">
					<NextImage
						src={pic_profile?.path}
						layout="fill"
						alt="product image"
						className="hover:scale-105 transition-all opacity-0 duration-500 delay-150 object-contain"
						onLoadingComplete={(image) => image.classList.remove("opacity-0")}
					/>
				</div>
			</Link>
			
			<div className="w-full pt-4">
				<div className="font-bold text-lg">{category_name}</div>
				<div className="text-gray-600" style={{minHeight: 24}}>{description || ''}</div>
				<div className="mt-2">
					<div className="w-full my-4" style={{background: 'rgba(0, 0, 0, 0.12)', height: '1px'}} />
					<div className="flex justify-between items-center">
						{
							sale_price > 0 ? (
								<div className="font-bold text-xl">
									<span className="text-xl text-red-500">{formatCurrency(sale_price)}</span>&nbsp;<span className="line-through text-sm text-gray-500">{formatCurrency(min_price)}</span>
								</div>	
							) : (
								<div className="font-bold text-xl" style={{ color: "#256f6e" }}>
									{formatCurrency(min_price)}
								</div>	
							)
						}
						<div>
							<Tag text={CategoryStatus[status_gb]} status={status_gb} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CategoryCard;
