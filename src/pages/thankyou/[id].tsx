import { getFirst } from "@/client";
import CheckoutClient from "@/client/CheckoutClient";
import OrderSummary from "@/components/order/summary";
import WhatNext from "@/components/order/whatNext";
import { GIF_SUCCESS_1, GIF_SUCCESS_1_STATIC } from "@/constants/Images";
import { SHOP_URL } from "@/constants/path";
import { IOrder } from "@/interface";
import { Base } from "@/templates/Base";
import NotifyUtils from "@/utils/NotifyUtils";
import { Box, Divider, Grid, Paper, Typography } from "@material-ui/core";
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const ThankYouPage = () => {
  const router = useRouter();
  const { id: orderId } = router.query

  const [order, setOrder] = useState<IOrder | null>(null)
  const gifRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    // This function reloads the GIF to ensure it plays only once
    const playGifOnce = () => {
      if (gifRef.current) {
        const gif = gifRef.current;
        const src = GIF_SUCCESS_1_STATIC;
        gif.src = '';
        gif.src = src;
      }
    };

    // Play the GIF once when the component mounts
    setTimeout(() => {
      playGifOnce();
    }, 1 * 800)
  }, []);

  useEffect(() => {
    (async() => {
      if (orderId) {
        const respOrder = await CheckoutClient.getOrderDetail(orderId as string)
        if (respOrder.status === 'OK') {
          setOrder(getFirst(respOrder))
        } else {
          NotifyUtils.error(respOrder.message || "Có lỗi xảy ra")
        }
      }
    })()
  }, [orderId])

  if (!order) return null

  return (
    <Base>
      <Box display="flex" position="relative" className="min-h-inherit items-center">
        <Paper className="container shadow-lg px-20 pt-4 pb-8 m-4" style={{width: '90%'}}>
          <Box display="flex" alignItems="center" flexDirection="column">
            <Image ref={gifRef} src={GIF_SUCCESS_1} width={120} height={120} alt="success gif" unoptimized />
            <Typography variant="h3" className="">Đặt hàng thành công!</Typography>
          </Box>
          <Divider className="my-4" />
          <Grid container spacing={4} className="flex justify-center">
            <Grid item md={5} className="flex flex-col gap-4">
              <Typography variant="h5" className="text-center font-bold">Thông tin đơn hàng</Typography>
              <OrderSummary order={order} />
            </Grid>
            <Grid item md={6} className="flex flex-col gap-4">
              <Typography variant="h5" className="text-center font-bold">Tiếp theo thì sao ?</Typography>
              <WhatNext />
            </Grid>
          </Grid>
          <Divider className="my-4" />
          <Box className="text-center">
            <Typography variant="body1" className="text-center mt-4">
              Cảm ơn bạn đã mua hàng tại cửa hàng chúng tôi! Để tiếp tục mua hàng, vui lòng click vào đây
            </Typography>
            <Box className="animate-bounce w-6 h-6 mx-auto mt-2">
              <ExpandCircleDownIcon />  
            </Box> 
            <Link href={SHOP_URL} className="text-red-400 text-lg" >Tiếp tục mua hàng</Link>
          </Box>
        </Paper>
      </Box>
    </Base>
  );
}

export default ThankYouPage;