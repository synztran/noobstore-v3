import BannerWithCentralText from "@/components/BannerWithCentralText";
import OurShopCollection from "@/components/OurProduct";
import QuickCategoryWithText from "@/components/QuickCategoryWithText";
import TextLeftBannerRight from "@/components/TextLeftBannerRight";
import SplitBannerWithCenterSlide from "@/components/splitBannerWithCenterSlide";
import { Container } from "@material-ui/core";
import { Category, EnumSaleType } from "interface";

export const temp: Category = {
	category_id: "ETC20",
	category_url_name: "c3-tangerine-switches",
	category_name: "C3 Switch Pack",
	author: "Equalz",
	manufacturing: "Equalz",
	proxy_host: "NoobStore",
	status: 2,
	type: 2,
	date_start: "2021-03-20T17:00:00.000Z",
	date_end: "2022-03-20T17:00:00.000Z",
	date_payment: "2022-03-20T17:00:00.000Z",
	min_price: 65500,
	max_price: 75500,
	tax: 0,
	handle: 0,
	specs: "",
	pic_profile: {
		path: "/uploads/IMG_7006.JPG",
		size: 513060,
	},
	product_belong: "67g, 62g",
	pic_list: [],
	sale_type: EnumSaleType.NORMAL,
};

const tempArray: Category[] = [
	{
		category_id: "ETC20",
		category_url_name: "c3-tangerine-switches",
		category_name: "C3 Switch Pack",
		author: "Equalz",
		manufacturing: "Equalz",
		proxy_host: "NoobStore",
		status_gb: 2,
		type: 2,
		date_start: "2021-03-20T17:00:00.000Z",
		date_end: "2022-03-20T17:00:00.000Z",
		date_payment: "2022-03-20T17:00:00.000Z",
		min_price: 65500,
		max_price: 75500,
		tax: 0,
		handle: 0,
		specs: "",
		pic_profile: {
			path: "/uploads/IMG_7006.JPG",
			size: 513060,
		},
		product_belong: "67g, 62g",
		pic_list: [],
		sale_type: EnumSaleType.NORMAL,
	},
	{
		category_id: "ETC20",
		category_url_name: "c3-tangerine-switches",
		category_name: "C3 Switch Pack",
		author: "Equalz",
		manufacturing: "Equalz",
		proxy_host: "NoobStore",
		status_gb: 2,
		type: 2,
		date_start: "2021-03-20T17:00:00.000Z",
		date_end: "2022-03-20T17:00:00.000Z",
		date_payment: "2022-03-20T17:00:00.000Z",
		min_price: 65500,
		max_price: 75500,
		tax: 0,
		handle: 0,
		specs: "",
		pic_profile: {
			path: "/uploads/IMG_7006.JPG",
			size: 513060,
		},
		product_belong: "67g, 62g",
		pic_list: [],
		sale_type: EnumSaleType.NORMAL,
	},
	{
		category_id: "ETC20",
		category_url_name: "c3-tangerine-switches",
		category_name: "C3 Switch Pack",
		author: "Equalz",
		manufacturing: "Equalz",
		proxy_host: "NoobStore",
		status_gb: 2,
		type: 2,
		date_start: "2021-03-20T17:00:00.000Z",
		date_end: "2022-03-20T17:00:00.000Z",
		date_payment: "2022-03-20T17:00:00.000Z",
		min_price: 65500,
		max_price: 75500,
		tax: 0,
		handle: 0,
		specs: "",
		pic_profile: {
			path: "/uploads/IMG_7006.JPG",
			size: 513060,
		},
		product_belong: "67g, 62g",
		pic_list: [],
		sale_type: EnumSaleType.NORMAL,
	},
	{
		category_id: "ETC20",
		category_url_name: "c3-tangerine-switches",
		category_name: "C3 Switch Pack",
		author: "Equalz",
		manufacturing: "Equalz",
		proxy_host: "NoobStore",
		status_gb: 2,
		type: 2,
		date_start: "2021-03-20T17:00:00.000Z",
		date_end: "2022-03-20T17:00:00.000Z",
		date_payment: "2022-03-20T17:00:00.000Z",
		min_price: 65500,
		max_price: 75500,
		tax: 0,
		handle: 0,
		specs: "",
		pic_profile: {
			path: "/uploads/IMG_7006.JPG",
			size: 513060,
		},
		product_belong: "67g, 62g",
		pic_list: [],
		sale_type: EnumSaleType.NORMAL,
	},
	{
		category_id: "ETC20",
		category_url_name: "c3-tangerine-switches",
		category_name: "C3 Switch Pack",
		author: "Equalz",
		manufacturing: "Equalz",
		proxy_host: "NoobStore",
		status_gb: 2,
		type: 2,
		date_start: "2021-03-20T17:00:00.000Z",
		date_end: "2022-03-20T17:00:00.000Z",
		date_payment: "2022-03-20T17:00:00.000Z",
		min_price: 65500,
		max_price: 75500,
		tax: 0,
		handle: 0,
		specs: "",
		pic_profile: {
			path: "/uploads/IMG_7006.JPG",
			size: 513060,
		},
		product_belong: "67g, 62g",
		pic_list: [],
		sale_type: EnumSaleType.NORMAL,
	},
];

const LandingPage = ({}) => {
	return (
		<div className="grid">
			<Container maxWidth="xl">
				<SplitBannerWithCenterSlide />
				<QuickCategoryWithText />
				<TextLeftBannerRight />
				<BannerWithCentralText />
				<OurShopCollection />
				{/* <CategoryCard category={temp} />
				<CategoryBlock title="Hàng mới về" arrayData={tempArray} /> */}
			</Container>
		</div>
	);
};

export default LandingPage;
