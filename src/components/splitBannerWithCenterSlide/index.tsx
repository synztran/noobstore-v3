import { HOME_LEFT_BANNER } from "@/constants/Images";
import { Box, ButtonBase, Grid } from "@material-ui/core";
import Image from "next/image";
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from "swiper/react";
import styles from './styles.module.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const title = `Welcome to  Noobstore`
const description = 'Discover the world of mechanical keyboards with Noobstore. We offer a wide range of mechanical keyboards, keycaps, and services to elevate your typing experience. Our quality products and exceptional service make us stand out in the industry.'

const SplitBannerWithCenterSlide = () => {
  return (
    <Grid container className={styles.splitBannerContainer}>
      <LeftSide title={title} description={description} />
      <Central />
      <RightSide />
    </Grid>
  )
}

export default SplitBannerWithCenterSlide

const LeftSide = ({
  title = '',
  description = '',
}) => {
  return (
    <Grid item xs={12} md={6} className={styles.leftSideContainer}>
      <span className={styles.textTitle}>{title}</span>
      <span className="text-lg max-w-sm">{description}</span>
      <ButtonBase className={styles.buttonShopNow}>
        Shop now
      </ButtonBase>
    </Grid>
  )  
}

const Central = () => {
  return (
    <Box className={styles.centralSideContainer}>
      <Swiper 
        navigation={true} 
        pagination={true} 
        modules={[ Navigation, Pagination ]} 
        className={styles.swiper}
      >
        <SwiperSlide className="relative">
          <Image src={HOME_LEFT_BANNER} objectFit="cover" layout="fill" alt="placeholder" />
          <span className="z-1 text-white text-xl font-bold absolute bottom-10">Bottom text</span>
        </SwiperSlide>
        <SwiperSlide>
          <Image src={HOME_LEFT_BANNER} objectFit="cover" layout="fill" alt="placeholder" />
        </SwiperSlide>
      </Swiper>
    </Box>
  )
}

const RightSide = () => {
  return (
    <Grid item xs={12} md={6}>
      <Box className="relative h-full" >
        <Image src={HOME_LEFT_BANNER} objectFit="cover" layout="fill" alt="placeholder" />
      </Box>
    </Grid>
  )
}