import Image from "next/image";

interface Props {
	imageUrl: string;
	title: string;
	subTitle: string;
	redirect: string;
}

const SectionCategory = ({
	imageUrl = "",
	title = "",
	subTitle = "",
	redirect,
}: Props) => {
	return (
		<div className="w-full h-36 relative">
			<Image src={imageUrl} layout="fill" alt={title} />
			<div className="absolute top-1/2 left-1/2 translate-x-1/2 trans">
				<span>{title}</span>
				<span>{subTitle}</span>
			</div>
			<button>Mua ngay</button>
		</div>
	);
};

export default SectionCategory;
