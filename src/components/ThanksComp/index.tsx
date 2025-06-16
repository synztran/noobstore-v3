import React from "react";
import OrderInformation from "./OrderInformation";
import ProductsInformation from "./ProductsInformation";
import useOrderQuery from "@/react-query/order/api/useOrderQueries";
import Custom404 from "@/pages/404";

const ThanksComp: React.FC<{ orderId: string }> = ({ orderId }) => {
	const { data: orderData } = useOrderQuery(orderId as string);

	if (Object.keys(orderData || {}).length === 0) return <Custom404 />;

	return (
		<div className="grid grid-cols-9 divide-x-2 h-full">
			<OrderInformation orderId={orderId} />
			<ProductsInformation orderId={orderId} />
		</div>
	);
};

export default ThanksComp;
