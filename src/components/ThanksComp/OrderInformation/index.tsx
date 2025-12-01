import { useAuth } from "@/context/Auth";
import useOrderQuery from "@/react-query/order/api/useOrderQueries";
import { Button } from "@material-ui/core";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";
import OrderMapComp from "./map";
import OrderDetail from "./orderDetail";
import { IAuthUser } from "@/interface/Context/auth";
import { Logo } from "@/templates/Logo";
import {
	EnumOrderStatus,
	EnumPaymentMethod,
	EnumPaymentStatus,
} from "@/interface/interface";
import { VNCity } from "@/constants";

const OrderInformation: React.FC<{ orderId: string }> = ({ orderId }) => {
	const { data: orderInfo } = useOrderQuery(orderId as string);
	const { user } = useAuth() as unknown as { user: IAuthUser };

	return (
		<div className="flex flex-col gap-4 pt-20 pr-10 col-span-5">
			<Link href="/">
				<Logo />
			</Link>
			<div className="flex gap-2 items-center">
				<div className="border-2 border-black rounded-full w-12 h-12 flex justify-center items-center">
					<Check size={32} className="text-green-500" />
				</div>
				<div className="flex flex-col justify-between">
					<span className="text-base">
						Đơn hàng{" "}
						<strong className="text-lg">
							#{(orderId as string)?.replace("ORDER-", "")}
						</strong>
					</span>
					<span className="text-lg">
						Cảm ơn,{" "}
						<strong className="text-xl">
							{user?.firstName.substring(0, 1).toUpperCase() +
								user?.firstName.substring(1)}
						</strong>
						!
					</span>
				</div>
			</div>
			<OrderMapComp
				orderStatus={orderInfo?.orderStatus || EnumOrderStatus.PENDING}
				address={orderInfo?.orderInfo?.address || ""}
				city={
					VNCity.find(
						(city) => city.code === orderInfo?.orderInfo?.city
					)?.name || ""
				}
				paymentStatus={
					orderInfo?.paymentStatus || EnumPaymentStatus.PENDING
				}
				paymentMethod={
					orderInfo?.orderInfo?.paymentMethod ||
					EnumPaymentMethod.CASH_ON_DELIVERY
				}
			/>
			<OrderDetail />
			<div className="flex justify-between items-center">
				<span className="text-sm">
					Bạn cần hỗ trợ?&nbsp;
					<Link href="/contact">Liên hệ ngay</Link>
				</span>
				<Button className="bg-black text-white px-4 py-2 hover:opacity-80 hover:bg-black hover:scale-105 transition-all duration-300 font-bold">
					Tiếp tục mua hàng
				</Button>
			</div>
			<div className="inline-flex justify-between text-xs border-t-2 border-[#d9d9d9] py-4">
				<Link href="#">Chính sách hoàn tiền</Link>
				<Link href="#">Chính sách vận chuyển</Link>
				<Link href="#">Chính sách bảo mật</Link>
				<Link href="#">Điều khoản dịch vụ</Link>
			</div>
		</div>
	);
};

export default OrderInformation;
