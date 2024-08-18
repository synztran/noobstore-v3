import { LANDING_PAGE_KEYBOARD_IMG, LANDING_PAGE_KEYSET_IMG } from "@/constants/Images";
import { classNames } from "@/utils/AppConfig";
import Image from "next/image";
import styles from './styles.module.css';

const slogan = "Timeless Appeal"
const title = "Shop Our Collections"
const desc = 'Discover our curated collections of mechanical keyboards, keycaps, and services. Each collection is designed to elevate your typing experience and reflect your unique style.'

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
		text: "Deskmat",
	},
	{
		idx: 4,
		imageUrl: "/assets/images/collection/switches.jpeg",
		text: "Switch",
	},
  {
		idx: 5,
		imageUrl: "/assets/images/collection/switches.jpeg",
		text: "Switch",
	},
  {
		idx: 6,
		imageUrl: "/assets/images/collection/switches.jpeg",
		text: "Switch",
	},
];

const OurShopCollection = () => {
  return (
    <div className="py-20">
      <div className="flex flex-col max-w-2xl m-auto justify-center align-middle mb-16">
        <span className="text-sm text-blue-800 font-bold text-center">{slogan}</span>
        <span className="text-3xl font-bold text-center py-4">{title}</span>
        <span className="text-center">{desc}</span>
      </div>
      <QuickCategory /> 
    </div>
  )
}

export default OurShopCollection

const QuickCategory = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-3 gap-8">
        {CollectionArray?.sort((a, b) => a.idx - b.idx)?.map(
          (item, index) => (
            <div key={index} className="cursor-pointer">
              <div className={classNames("relative w-full h-80 overflow-hidden", styles.collectionImage || '')}>
                <Image
                  className={classNames("transition duration-500 delay-150")}
                  src={item.imageUrl}
                  alt={item.text}
                  layout="fill"
                  objectFit="cover"
                />
                <div className={classNames("z-10 absolute w-full h-full opacity-0 transition-all duration-500 delay-100", styles.overlay || '')} />
                <p
                  className={classNames("transition-all duration-300 delay-100 text-center text-xl pt-4 z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold opacity-0", styles.textImage || '')}>
                  {item.text}
                </p>
              </div>
            
            </div>
          )
        )}
      </div>
    </div>
  )
}