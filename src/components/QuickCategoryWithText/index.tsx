import { LANDING_PAGE_KEYBOARD_IMG, LANDING_PAGE_KEYSET_IMG } from "@/constants/Images";
import Image from "next/image";

const title = "Elevate Your Typing Experience"
const subTitle = "Discover our showcase of premium mechanical keyboards, keycaps, and services. Each piece is meticulously crafted to elevate your typing experience and reflect your unique style."
const slogan = "Discover Excellence"

const CollectionArray = [
	{
		idx: 1,
		imageUrl: LANDING_PAGE_KEYBOARD_IMG,
		text: "Bàn phím",
	},
	{
		idx: 2,
		imageUrl: LANDING_PAGE_KEYSET_IMG,
		text: "Keycap",
	},
	{
		idx: 3,
		imageUrl: "/assets/images/collection/deskmat.jpg",
		text: "Service",
	},
	{
		idx: 4,
		imageUrl: "/assets/images/collection/switches.jpeg",
		text: "Switch",
	},
];

const QuickCategoryWithText = () => {
  return (
    <div className="py-20">
      <BlockText slogan={slogan} subTitle={subTitle} title={title} />
      <QuickCategory />
    </div>
  );
};

export default QuickCategoryWithText;

const BlockText = ({
  title = '',
  subTitle = '',
  slogan = '',
} : {
  title: string;
  subTitle: string;
  slogan: string;
}) => {
  return (
    <div className="py-20 flex flex-col gap-4 justify-center align-middle w-1/2 mx-auto">
      <div style={{color: "#154B9B"}} className="text-sm w-full text-center">{slogan}</div>
      <div className="w-full text-center text-2xl font-bold">{title}</div>
      <div className="w-full text-center">{subTitle}</div>
    </div>
  );
}

const QuickCategory = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-4 gap-4">
        {CollectionArray?.sort((a, b) => a.idx - b.idx)?.map(
          (item, index) => (
            <div key={index} className="cursor-pointer">
              <div className="relative w-full h-64 overflow-hidden">
                <Image
                  className="hover:scale-105 transition duration-500 delay-150 object-cover"
                  src={item.imageUrl}
                  alt={item.text}
                  layout="fill"
                  objectFit="cover"
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
  )
}