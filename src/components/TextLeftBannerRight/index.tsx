import { HOME_LEFT_BANNER } from "@/constants/Images";
import { classNames } from "@/utils/AppConfig";
import Image from "next/image";

const content = [
  {
    idx: 1,
    slogan: "Discover Sophistication",
    title: "Mechanical Keyboards",
    description: "At Noobstore, we offer a wide range of mechanical keyboards that deliver the ultimate typing experience. Our keyboards are designed with precision and care to provide you with unparalleled comfort, speed, and accuracy.",
    buttonText: "contact us",
    link: "/contact",
    imagePosition: "right"
  },
  {
    idx: 2,
    slogan: "Gateway to Premium Selections",
    title: "Keyboard Accessories",
    description: "Enhance your keyboard with our collection of keycaps and accessories. Our range of keycaps provides a unique and personalized touch to your keyboard, while our accessories help to enhance your typing experience.",
    buttonText: "shop now",
    link: "/shop",
    imagePosition: "left"
  }
]

const TextLeftBannerRight = () => {
  return (
    <div className="flex py-20 gap-36 flex-col">
      {
        content.map((item) => (
          <div className={classNames("flex gap-4 pt-0", item.imagePosition === 'right' ? "" : "flex-row-reverse")}>
            <Content {...item} />
            <Banner />
          </div>
        ))
      }
    </div>
  )
}

export default TextLeftBannerRight;

const Content = ({
  idx,
  slogan = '',
  title = '',
  description = '',
  buttonText = '',
  link = ''
}: {
  idx: number,
  slogan: string,
  title: string,
  description: string,
  buttonText?: string,
  link?: string
}) => {
  return (
    <div className="w-1/2 flex flex-col gap-4">
      <div className="text-5xl">{idx < 10 ? "0"+idx : idx}</div>
      <div className="text-sm text-blue-800 font-bold mt-8">{slogan}</div>
      <div className="text-3xl font-bold">{title}</div>
      <div className="text-md">{description}</div>
      {
        buttonText && link ? (
          <a href={link} className="px-5 py-2 uppercase bg-blue-500 max-w-max rounded-sm text-white font-bold tracking-widest hover:-translate-y-3 transition-all duration-300 ease-in">
            {buttonText}
          </a>
        ) : null
      }
    </div>
  )
}

const Banner = () => {
  return (
    <div className="rounded-md relative w-1/2" style={{height: 550}}>
      <Image src={HOME_LEFT_BANNER} layout="fill" objectFit="cover" alt="deskmat" className="rounded-md" />
    </div>
  )
}