import { HOME_LEFT_BANNER } from "@/constants/Images";
import { Box, Button, Grid } from "@mui/material";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./styles.module.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { classNames } from "@/utils/AppConfig";

const title = `Welcome to  Noobstore`;
const description =
  "Discover the world of mechanical keyboards with Noobstore. We offer a wide range of mechanical keyboards, keycaps, and services to elevate your typing experience. Our quality products and exceptional service make us stand out in the industry.";

const SplitBannerWithCenterSlide = () => {
  return (
    <div className={classNames(styles.splitBannerContainer || "", "grid")}>
      <LeftSide title={title} description={description} />
      <Central />
      <RightSide />
    </div>
  );
};

export default SplitBannerWithCenterSlide;

const LeftSide = ({ title = "", description = "" }) => {
  return (
    <div className={classNames(styles.leftSideContainer || "", "grid ")}>
      <span className={styles.textTitle}>{title}</span>
      <span className="text-lg max-w-sm">{description}</span>
      <Button className={styles.buttonShopNow}>Shop now</Button>
    </div>
  );
};

const Central = () => {
  return (
    <div className={styles.centralSideContainer}>
      <Swiper
        navigation={true}
        pagination={true}
        modules={[Navigation, Pagination]}
        className={styles.swiper}
      >
        <SwiperSlide className="relative">
          <Image
            src={HOME_LEFT_BANNER}
            alt="placeholder"
            className="object-cover"
            fill
            sizes="100vw"
          />
          <span className="z-1 text-white text-xl font-bold absolute bottom-10">
            Bottom text
          </span>
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src={HOME_LEFT_BANNER}
            alt="placeholder"
            className="object-cover"
            fill
            sizes="100vw"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

const RightSide = () => {
  return (
    <Grid item xs={12} md={6}>
      <Box className="relative h-full">
        <Image
          src={HOME_LEFT_BANNER}
          alt="placeholder"
          className="object-cover"
          fill
          sizes="100vw"
        />
      </Box>
    </Grid>
  );
};
