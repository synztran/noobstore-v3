import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { IOrderProduct } from "@/interface/Client/Order";
import { formatCurrency } from "@/utils/FormatNumber";
import Image from "next/image";

interface Props {
	cartItem: IOrderProduct;
}

const CartItemBlock = ({ cartItem }: Props) => {
	const {
		categoryName = "",
		productName = "",
		price = 0,
		quantity = 0,
		thumbnail = "",
		productOptions = [],
		totalPrice = 0,
	} = cartItem || {};

	return (
		<div className="flex justify-between items-center mb-4">
			<div className="flex gap-4 items-center">
				<div className="w-20 h-20 relative border border-gray-300 rounded-md">
					<Image
						src={thumbnail || NEW_MISSING_IMAGE}
						alt="cart item image"
						className="p-1 object-cover rounded-md"
						loading="lazy"
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
					<div className="absolute w-6 h-6 -top-2.5 -right-2.5 text-center border border-gray-400 rounded-full bg-[rgba(114,114,114,0.9)] font-bold text-sm select-none text-white flex justify-center items-center">
						{quantity}
					</div>
				</div>
				<div className="flex flex-col">
					<span className="text-base font-bold">
						{categoryName} - {productName}
					</span>
					<div className="inline-block text-sm">
						<span>
							{productOptions
								?.map((option) => option.name)
								.join(", ")}
						</span>
					</div>
				</div>
			</div>
			<div className="flex">
				<span className="text-base font-semibold">
					{formatCurrency(totalPrice)}
				</span>
			</div>
		</div>
	);
};

export default CartItemBlock;
