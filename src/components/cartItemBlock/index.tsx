import { formatCurrency } from "@/utils/FormatNumber";
import Image from "next/image";

interface Props {
    cartItem: any;
}

const CartItemBlock = ({cartItem}: Props) => {
    const {categoryName = '', productName = '', price = 0, quantity = 0, image = ''} = cartItem || {};

    return(
        <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
                <div className="w-20 h-20 relative border border-gray-300 rounded-md">
                    <Image src={image} layout="fill" objectFit="contain" alt="cart item image" className="p-1" />
                    <div className="absolute w-6 h-6 -top-2.5 -right-2.5 text-center border border-gray-400 rounded-full bg-gray-300 font-bold text-sm select-none">{quantity}</div>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold">{categoryName}</span>
                    <p className="text-xs">{productName}</p>
                </div>
            </div>
            <div className="flex">
                <span className="text-sm">{formatCurrency(price)}</span>
            </div>

        </div>
    )
}

export default CartItemBlock