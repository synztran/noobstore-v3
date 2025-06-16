import BannerWithCentralText from "@/components/BannerWithCentralText";
import OurShopCollection from "@/components/OurProduct";
import QuickCategoryWithText from "@/components/QuickCategoryWithText";
import TextLeftBannerRight from "@/components/TextLeftBannerRight";
import SplitBannerWithCenterSlide from "@/components/splitBannerWithCenterSlide";
import { Container } from "@material-ui/core";

const LandingPage = ({}) => {
	return (
        // <div className="grid">
        // </div>
        <Container className="grid" maxWidth="xl">
            <SplitBannerWithCenterSlide />
            <QuickCategoryWithText />
            <TextLeftBannerRight />
            <BannerWithCentralText />
            <OurShopCollection />
            {/* <CategoryCard category={temp} />
				// <CategoryBlock title="Hàng mới về" arrayData={tempArray} /> */}
        </Container>
    );
};

export default LandingPage;
