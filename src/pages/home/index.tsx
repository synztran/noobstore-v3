import BannerWithCentralText from "@/components/BannerWithCentralText";
import HomeBanner from "@/components/HomeBanner";
import OurShopCollection from "@/components/OurProduct";
import QuickCategoryWithText from "@/components/QuickCategoryWithText";
import TextLeftBannerRight from "@/components/TextLeftBannerRight";
// import SplitBannerWithCenterSlide from   "@/components/splitBannerWithCenterSlide";
// import { Container } from "@material-ui/core";
// import { Home } from "lucide-react";
import { Base } from "@/templates/Base";
import TitleWithMenuQuickAccess from "@/components/home/TitleWithMenuQuickAccess";
import BannerTagPriceName from "@/components/home/BannerTagPriceName";
import CategoryWithTitleAndAction from "@/components/CategoryWithTitleAndAction";
import CommunitySharingPost from "@/components/CommunitySharingPost";
import GuildAndTutorials from "@/components/GuildAndTutorials";
import GridLayoutBlock from "@/components/GridLayoutBlock";
import StrongPoint from "@/components/StrongPoint";
import HomeProductBlock from "@/components/HomeProductBlock";

const HomePage = ({}) => {
	return (
		<Base>
			<div className="flex flex-col gap-12 my-8">
				<TitleWithMenuQuickAccess />
				<BannerTagPriceName />
				<CategoryWithTitleAndAction title="Keyboards" items={[]} />
				<CommunitySharingPost
					title="Community Sharing"
					posts={[]}
					onStartBuilding={() => {}}
					onSeeMore={() => {}}
				/>
				<GuildAndTutorials />
				<GridLayoutBlock images={[]} />
				<StrongPoint />
				<HomeProductBlock
					title="Bàn phím"
					subTitle="Đa dạng layout từ 60% lên đến TKL"
					items={[]}
					id="keyboards"
				/>
				<HomeProductBlock
					title="Switches"
					subTitle="Linear, clicky, tactile, kể cả silent"
					items={[]}
					id="switches"
				/>
				<HomeProductBlock
					title="Keycaps"
					subTitle="Linear, clicky, tactile, kể cả silent"
					items={[]}
					id="keycaps"
				/>
				<HomeProductBlock
					title="Deskmats"
					subTitle="Linear, clicky, tactile, kể cả silent"
					items={[]}
					id="deskmats"
				/>
				<HomeProductBlock
					title="Dịch vụ bàn phím"
					subTitle="Linear, clicky, tactile, kể cả silent"
					items={[]}
					id="services"
				/>
				{/* <HomeBanner />
				<QuickCategoryWithText />
				<TextLeftBannerRight />
				<BannerWithCentralText />
				<OurShopCollection /> */}
			</div>
		</Base>
	);
};

export default HomePage;
