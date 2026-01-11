import React, { useMemo } from "react";
import ProductBlock from "./ProductBlock";
import { GROUP_IMAGE_1 } from "@/constants/Images";
import useProductBlockLimit from "@/hook/useScreen";

export interface ProductItem {
  id: string | number;
  brand: string;
  name: string;
  price: number;
  image: string;
  rating: { stars: number; reviews: number };
  reviews: number;
  quantity: number;
  tags?: { label: string; styles?: { [x: string]: string } }[];
}

interface IProps {
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  action?: React.ReactNode;
  items: ProductItem[];
  id: string;
  icon?: React.ReactNode;
}

const fakeItems: ProductItem[] = [
  {
    id: 1,
    brand: "Kinetic Labs",
    name: "Gecko Silent Linear",
    price: 14000000,
    image: GROUP_IMAGE_1,
    reviews: 24,
    quantity: 4,
    rating: { stars: 5, reviews: 24 },
  },
  {
    id: 2,
    brand: "Kinetic Labs",
    name: "Gecko Silent Linear",
    price: 6000,
    image: "/images/karina65.webp",
    rating: { stars: 5, reviews: 24 },
    reviews: 24,
    quantity: 4,
  },
  {
    id: 3,
    brand: "Kinetic Labs",
    name: "Gecko Silent Linear",
    price: 7500,
    image: "/images/tgr_910.webp",
    rating: { stars: 5, reviews: 24 },
    reviews: 24,
    quantity: 4,
  },
  {
    id: 4,
    brand: "Kinetic Labs",
    name: "Gecko Silent Linear",
    price: 8000,
    image: "/images/filco.webp",
    rating: { stars: 5, reviews: 24 },
    reviews: 24,
    quantity: 4,
    tags: [
      {
        label: "PRO",
        styles: {
          background: "linear-gradient(90deg, #6d28d9 0%, #a78bfa 100%)",
          color: "#fff",
          border: "none",
        },
      },
      { label: "Free shipping" },
    ],
  },
  // {
  // 	id: 5,
  // 	brand: "Kinetic Labs",
  // 	name: "Gecko Silent Linear",
  // 	price: 8000,
  // 	image: "/images/filco.webp",
  // 	rating: { stars: 5, reviews: 24 },
  // 	reviews: 24,
  // 	quantity: 4,
  // 	tags: [
  // 		{
  // 			label: "PRO",
  // 			styles: {
  // 				background:
  // 					"linear-gradient(90deg, #6d28d9 0%, #a78bfa 100%)",
  // 				color: "#fff",
  // 				border: "none",
  // 			},
  // 		},
  // 		{ label: "Free shipping" },
  // 	],
  // },
];

const HomeProductBlock: React.FC<IProps> = ({
  title,
  subTitle,
  action,
  items,
  id,
  icon,
}) => {
  const { limitHomeProductBlock = 5 } = useProductBlockLimit();
  console.log("limitHomeProductBlock", limitHomeProductBlock);

  const data = useMemo(() => {
    if (!limitHomeProductBlock) return [];
    return fakeItems?.slice(0, limitHomeProductBlock);
  }, [limitHomeProductBlock]);

  return (
    <div className="w-full rounded-xl shadow-none" id={id}>
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="flex items-center gap-2">
          {icon ?? null}
          <div className="font-semibold text-xl text-black">{title}.</div>
          {subTitle && (
            <div className="text-gray-600 text-lg font-normal">{subTitle}</div>
          )}
        </div>
        <div>
          {action ? (
            action
          ) : (
            <button className="text-xs px-3 py-1 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition">
              Khám phá thêm
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 lg:grid-cols-5 gap-4 mt-3 py-2">
        {fakeItems.map((item, idx) => (
          <ProductBlock isFirst={idx === 0} product={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default HomeProductBlock;
