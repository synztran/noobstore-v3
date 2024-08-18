import DiscordIcon from "@/icons/discord";
import FacebookIcon from "@/icons/facebook";
import KeyboardIcon from "@/icons/keyboard";
import KeysetIcon from "@/icons/keyset";
import vnmkLogo from "@/icons/vnmk";
import { EnumPaymentMethod } from "@/interface";
import { PhoneIcon, PlayCircleIcon } from "@heroicons/react/20/solid";
import {
	ArchiveBoxIcon,
	ArrowPathIcon,
	ChartPieIcon,
	CursorArrowRaysIcon,
	FingerPrintIcon,
	FolderPlusIcon,
	UserGroupIcon
} from "@heroicons/react/24/outline";
import { FLAGS_VIETNAM, MOMO_VERTICAL_LOGO } from "./Images";

export const categories = [
	{
		name: "Hàng có sẵn",
		description: "Get a better understanding of your traffic",
		href: "#",
		icon: ArchiveBoxIcon,
	},
	{
		name: "Groupbuy",
		description: "Speak directly to your customers",
		href: "#",
		icon: UserGroupIcon,
	},
	{
		name: "Keyset",
		description: "Your customers’ data will be safe and secure",
		href: "#",
		icon: KeysetIcon,
	},
	{
		name: "Keyboard",
		description: "Connect with third-party tools",
		href: "#",
		icon: KeyboardIcon,
	},
	{
		name: "Phụ kiện",
		description: "Build strategic funnels that will convert",
		href: "#",
		icon: FolderPlusIcon,
	},
];

export const news = [
	{
		name: "Trạng thái Groupbuy",
		description: "Get a better understanding of your traffic",
		href: "#",
		icon: ChartPieIcon,
	},
	{
		name: "Quy định Groupbuy",
		description: "Speak directly to your customers",
		href: "#",
		icon: CursorArrowRaysIcon,
	},
	{
		name: "Keyset",
		description: "Your customers’ data will be safe and secure",
		href: "#",
		icon: FingerPrintIcon,
	},
	{
		name: "Keyboard",
		description: "Connect with third-party tools",
		href: "#",
		icon: FingerPrintIcon,
	},
	{
		name: "Trạng thái đơn hàng",
		description: "Kiểm tra đơn hàng của bạn tại đây",
		href: "#",
		icon: ArrowPathIcon,
	},
];

export const contact = [
	{
		name: "Câu chuyện về chúng tôi",
		description: "Biết thêm về chúng tôi",
		href: "#",
		icon: ChartPieIcon,
	},
	{
		name: "Liên hệ hỗ trợ",
		description: "Bạn cần hỗ trợ, liên hệ ngay",
		href: "/contact",
		icon: CursorArrowRaysIcon,
	},
	{
		name: "Địa chỉ",
		description: "Bạn cần tìm địa chỉ mua hàng",
		href: "/location",
		icon: CursorArrowRaysIcon,
	},
];

export const comunity = [
	{
		name: "VNMK",
		description: "Hội nhóm bàn phím cơ Việt Nam",
		href: "#",
		icon: vnmkLogo,
	},
	{
		name: "Discord",
		description: "Kênh discord của shop",
		href: "#",
		icon: DiscordIcon,
	},
	{
		name: "Facebook",
		description: "Facebook của shop",
		href: "https://facebook.com/noobassembly",
		icon: FacebookIcon,
  },
];

export const callsToAction = [
	{ name: "Watch demo", href: "#", icon: PlayCircleIcon },
	{ name: "Contact sales", href: "#", icon: PhoneIcon },
]

export const services = [
	{
		name: "Assemble",
		href: "/services",
		icon: KeyboardIcon,
	},
	{
		name: 'Tư vấn',
		href: "https://facebook.com/noobassembly",
		icon: FacebookIcon,
		isNewPage: true
	}
]

export const CountryFlag = [
  {
    id: 0,
    name: "Việt Nam",
    imageUrl: FLAGS_VIETNAM,
		value: "vietnam",
  }
]

export const ShippingMethod = [
  {
    id: 0,
    name: "Giao hàng tiêu chuẩn",
    value: "STANDARD",
		// textRight: "35.000đ"
  },
  // {
  //   id: 1,
  //   name: "Giao hàng nhanh",
  //   value: "express",
  // },
  // {
  //   id: 2,
  //   name: "Giao hàng trong ngày",
  //   value: "same_day",
  // }
]

export const PaymentMethod = [
  {
    id: 0,
    name: "Thanh toán khi nhận hàng",
    value: "CASH_ON_DELIVERY",
  },
  {
    id: 2,
    name: "Thanh toán qua ví Momo",
    value: "MOMO",
    imagesRight: [MOMO_VERTICAL_LOGO]
  },
  {
    id: 3,
    name: "Thanh toán qua ngân hàng nội địa",
    value: "ATM",
    disabled: true
  }
]

export const BillingAddress = [
  {
    id: 0,
    name: "Giống như địa chỉ giao hàng",
    value: "same_address",
  },
  // {
  //   id: 1,
  //   name: "Sử dụng một địa chỉ khác",
  //   value: "different_address",
	// 	isHaveCollapse: true,
	// 	collapseType: ENUM_CHECKOUT_COLLAPSE_TYPE.NEW_ADDRESS
  // }
]

export const LabelPaymentMethod: Record<EnumPaymentMethod, string> = {
	[EnumPaymentMethod.CASH_ON_DELIVERY]: "Thanh toán khi nhận hàng",
	[EnumPaymentMethod.MOMO]: "Thanh toán qua ví Momo",
	[EnumPaymentMethod.ZALO_PAY]: "Thanh toán qua ZaloPay",
	[EnumPaymentMethod.BANK_TRANSFER]: "Thanh toán qua ngân hàng"
}