import Image from "next/image";

const CollectionArray = [
	{
		idx: 1,
		imageUrl: "/assets/images/collection/keeb.jpg",
		text: "Bàn phím",
	},
	{
		idx: 2,
		imageUrl: "/assets/images/collection/keyset.jpeg",
		text: "Keycap",
	},
	{
		idx: 3,
		imageUrl: "/assets/images/collection/deskmat.jpg",
		text: "Deskmat",
	},
	{
		idx: 4,
		imageUrl: "/assets/images/collection/switches.jpeg",
		text: "Switch",
	},
	{
		idx: 5,
		imageUrl: "/assets/images/collection/artisan.jpeg",
		text: "Artisan",
	},
];

const CategoryCollection = () => {
	// const [data, setData] = useState([]);

	// useEffect(() => {
	// 	(async () => {
	// 		const resp = await CategoryClient.getAllCategory();
	// 	})();
	// }, []);

	return (
		<div className="flex flex-col gap-10">
			<div className="font-bold text-3xl uppercase w-full text-center">
				Danh mục sẵn hàng
			</div>
			<div className=" grid grid-cols-5 gap-4">
				{CollectionArray?.sort((a, b) => a.idx - b.idx)?.map(
					(item, index) => (
						<div key={index}>
							<div className="relative w-full h-48 overflow-hidden">
								<Image
									className="hover:scale-105 transition duration-500 delay-150 object-cover"
									src={item.imageUrl}
									alt={item.text}
									layout="fill"
									objectFit="contain"
								/>
							</div>
							<p
								className="text-center font-bold text-xl pt-4"
								style={{ color: "#216463" }}>
								{item.text}
							</p>
						</div>
					)
				)}
			</div>
		</div>
	);
};

export default CategoryCollection;
