import BillInformation from "@/components/BillInformation";
import CartItemBlock from "@/components/cartItemBlock";
import { IOrderProduct } from "@/interface/Client/Order";
import useOrderQuery from "@/react-query/order/api/useOrderQueries";
import { Box } from "@mui/material";
import React from "react";

const ProductsInformation: React.FC<{ orderId: string }> = ({ orderId }) => {
  const { data: orderInfo, isPending } = useOrderQuery(orderId as string);
  if (isPending) return null;
  return (
    <div className="pl-10 pt-20 col-span-4">
      <div className="h-full col-span-2">
        <Box position="sticky" top="80px">
          {orderInfo?.products?.map((item: IOrderProduct, index: number) => (
            <CartItemBlock cartItem={item} key={index} />
          ))}
          <BillInformation orderInfo={orderInfo as any} />
        </Box>
      </div>
    </div>
  );
};

export default ProductsInformation;
