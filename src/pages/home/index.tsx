import CategoryWithTitleAndAction from "@/components/CategoryWithTitleAndAction";
import CommunitySharingPost from "@/components/CommunitySharingPost";
import GridLayoutBlock from "@/components/GridLayoutBlock";
import GuildAndTutorials from "@/components/GuildAndTutorials";
import BannerTagPriceName from "@/components/home/BannerTagPriceName";
import TitleWithMenuQuickAccess from "@/components/home/TitleWithMenuQuickAccess";
import HomeProductBlock from "@/components/HomeProductBlock";
import RaffleBlockV2 from "@/components/RaffleBlockV2";
import StrongPoint from "@/components/StrongPoint";
// import useRaffleFeaturedQueries from "@/react-query/raffles/api/useRaffleDetailQueries";
import useRafflesQuery from "@/react-query/raffles/api/useRafflesQueries";
import { Base } from "@/templates/Base";

const HomePage = ({}) => {
	const { data: raffleFeaturedData, isPending: isLoadingFeaturedRaffle } =
		useRafflesQuery({
			params: { featuredOnly: true },
			enabled: true,
		});
	return (
		<Base>
			<div className="flex flex-col gap-12 my-8">
				<TitleWithMenuQuickAccess />
				{/* <RaffleBlock
					raffleData={raffleFeaturedData?.[0]}
					isLoading={isLoadingFeaturedRaffle}
				/> */}
				<RaffleBlockV2
					raffleData={raffleFeaturedData?.[0]}
					isLoading={isLoadingFeaturedRaffle}
				/>
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
