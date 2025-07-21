interface Props {
	salePricePercent: number;
}

const SaleTag = ({ salePricePercent }: Props) => {
	return (
		<div className="absolute bottom-0 right-0">
			<span className="text-white text-sm font-bold">
				{salePricePercent}%
			</span>
		</div>
	);
};

export default SaleTag;
