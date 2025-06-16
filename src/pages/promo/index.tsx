import DynamicLuckyWheel from "@/components/DynamicLuckyWheel";
import { IReward } from "@/components/DynamicLuckyWheel/interface";
import LuckyWheelContainer from "@/components/luckyWheel";
import { Base } from "@/templates/Base";
import { Container } from "@mui/material";

const rewards: IReward[] = [
	{
		bgColor: "#00b46e",
		index: 1,
		isActive: true,
		code: "Num_1",
		name: "Sirius new king",
		image: "https://res.cloudinary.com/debnyyphn/image/upload/v1746258929/os0r78habfrfixvevk8l.jpg",
		wheelCode: "PBCGKJ91",
		maxQuantity: 0,
		maxQuantityPerCustomer: 0,
		maxQuantityPerDay: 0,
		percentage: 50,
	},
	{
		bgColor: "#00b46e",

		index: 5,
		isActive: true,

		code: "TGR 1",
		name: "Exoboi Đường tăng",
		image: "https://res.cloudinary.com/debnyyphn/image/upload/v1746258929/os0r78habfrfixvevk8l.jpg",

		wheelCode: "PBCGKJ91",
		maxQuantity: 0,
		maxQuantityPerCustomer: 0,
		maxQuantityPerDay: 0,
		percentage: 0,
		reward: [],
	},
	{
		bgColor: "#00b46e",

		index: 6,
		isActive: true,

		code: "TGR 2",
		name: "Otis Old king",
		image: "https://res.cloudinary.com/debnyyphn/image/upload/v1746258929/os0r78habfrfixvevk8l.jpg",

		wheelCode: "PBCGKJ91",
		maxQuantity: 0,
		maxQuantityPerCustomer: 0,
		maxQuantityPerDay: 0,
		percentage: 0,
		reward: [],
	},
	{
		bgColor: "#00b46e",

		index: 7,
		isActive: true,

		code: "TGR 3",
		name: "Sirius Ngộ không",
		image: "https://res.cloudinary.com/debnyyphn/image/upload/v1746258929/os0r78habfrfixvevk8l.jpg",

		wheelCode: "PBCGKJ91",
		maxQuantity: 0,
		maxQuantityPerCustomer: 0,
		maxQuantityPerDay: 0,
		percentage: 0,
		reward: [],
	},
	{
		bgColor: "#00b46e",

		index: 8,
		isActive: true,

		code: "KM",
		name: "Otis Street Light",
		image: "https://res.cloudinary.com/debnyyphn/image/upload/v1746258929/os0r78habfrfixvevk8l.jpg",

		wheelCode: "PBCGKJ91",
		maxQuantity: 0,
		maxQuantityPerCustomer: 0,
		maxQuantityPerDay: 0,
		percentage: 0,
		reward: [],
	},
];

export default function PromotionPage() {
	return (
		<Base>
			<div style={{ backgroundColor: "#f4f7fc" }}>
				<Container maxWidth="lg" className="py-[20px] px-0">
					{/* <LuckyWheelContainer /> */}
					<DynamicLuckyWheel rewards={rewards} turns={10} />
				</Container>
			</div>
		</Base>
	);
}
