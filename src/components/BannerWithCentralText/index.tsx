import { LANDING_PAGE_KEYBOARD_IMG } from "@/constants/Images"
import Image from "next/image"

const title = "Keyboard Services"
const desc = "Keep your keyboard in top condition with our maintenance and cleaning services. Our experts provide professional and reliable services to ensure that your keyboard is always in optimal condition."
const buttonText = 'CHECK OUT OUR SERVICE'

const BannerWithCentralText = () => {
  return (
    <div className="relative h-96">
      <Image src={LANDING_PAGE_KEYBOARD_IMG} alt="banner" layout="fill" objectFit="cover" />
      <div className="flex flex-col justify-center z-10 relative max-w-2xl h-full m-auto items-start">
        <span className="text-3xl text-white font-bold">{title}</span>
        <span className="text-md text-white font-bold">{desc}</span>
        <button className="px-4 py-2 bg-blue-500 uppercase text-white font-bold tracking-wider mt-6 rounded-sm hover:-translate-y-4 transition-all ease-in-out duration-300">{buttonText}</button>
      </div>
    </div>
  )
}

export default BannerWithCentralText