import { Category } from "@/interface";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import CategoryCard from "../categoryCard";

interface Props {
	title: string;
	arrayData: Category[];
}

const CategoryBlock = ({ title, arrayData }: Props) => {
	return (
		<div className="flex flex-col my-8 gap-2">
			<div
				className="w-full text-center space-x-2 object-fill flex justify-between align-middle items-center bg-no-repeat h-20 relative"
				style={{
					backgroundImage:
						"url(/assets/images/background/simple_background.jpg)",
				}}>
				<Image
					src="/assets/images/background/simple_background.jpg"
					layout="fill"
					alt="background section"
					className="z-0"
				/>
				<span className="text-2xl font-bold" style={{ zIndex: 5 }}>
					{title}
				</span>
				<div className="group z-0 flex align-middle transition-all delay-200 cursor-pointer">
					<span className="text-2xl font-bold">Xem tất cả</span>
					<div className="w-10 relative group-hover:mr-4 transition-all delay-200 ease-linear">
						<ChevronRightIcon />
					</div>
				</div>
			</div>
			<div className="grid grid-cols-5 col-span-2 gap-2">
				{arrayData.map((item, idx) => {
					return <CategoryCard key={idx} category={item} />;
				})}
			</div>
		</div>
	);
};

export default CategoryBlock;
