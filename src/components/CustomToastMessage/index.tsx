interface CustomToastMessageProps {
	productName?: string;
	categoryName?: string;
	productId?: string;
	serviceBookingId?: string;
}

const SuccessRemoveItem: React.FC<CustomToastMessageProps> = ({
	productName,
}: CustomToastMessageProps) => {
	return (
		<div>
			Sảm phẩm <strong className="text-green-400">{productName}</strong>{" "}
			đã được xóa khỏi giỏ hàng
		</div>
	);
};

const SuccessAddItem: React.FC<CustomToastMessageProps> = ({
	productName,
	categoryName,
}: CustomToastMessageProps) => {
	return (
		<div>
			Sảm phẩm{" "}
			<strong className="text-green-400">
				{categoryName} - {productName}
			</strong>{" "}
			đã được thêm vào giỏ hàng
		</div>
	);
};

const SuccessCreateCategory: React.FC<CustomToastMessageProps> = ({
	categoryName,
}: CustomToastMessageProps) => {
	return (
		<div>
			Danh mục <strong className="text-green-400">{categoryName}</strong>{" "}
			đã được tạo thành công
		</div>
	);
};

const SuccessDeleteProduct: React.FC<CustomToastMessageProps> = ({
	productName,
	productId,
}: CustomToastMessageProps) => {
	return (
		<div>
			Sảm phẩm{" "}
			<strong className="text-green-400">
				{productName || productId}
			</strong>{" "}
			đã được xóa thành công
		</div>
	);
};

const SuccessSubmitPayment: React.FC<CustomToastMessageProps> = ({
	serviceBookingId,
}: CustomToastMessageProps) => {
	return (
		<div>
			Mã dịch vụ{" "}
			<strong className="text-green-400">{serviceBookingId}</strong> đã
			gửi thanh toán thành công. Vui lòng chờ xác nhận từ hệ thống
		</div>
	);
};

const SuccessRaffleJoin: React.FC<
	CustomToastMessageProps
> = ({} // serviceBookingId,
: CustomToastMessageProps) => {
	return <div>Bạn đã tham gia raffle thành công. Chúc bạn may mắn!</div>;
};

export {
	SuccessAddItem,
	SuccessCreateCategory,
	SuccessDeleteProduct,
	SuccessRemoveItem,
	SuccessSubmitPayment,
	SuccessRaffleJoin,
};
