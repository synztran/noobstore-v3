import React from "react";
import { Package, CreditCard, PencilRuler, CalendarClock } from "lucide-react";

const strongPoints = [
	{
		icon: (
			<div className="flex items-center gap-4">
				<Package className="w-7 h-7 text-purple-500" />
				<strong className="text-lg">Đóng gói</strong>
			</div>
		),
		title: (
			<>
				Tất cả đơn hàng đều được{" "}
				<span className="text-purple-500 font-medium">
					đóng gói với{" "}
					<span role="img" aria-label="love">
						💜
					</span>
				</span>{" "}
				và vận chuyển từ{" "}
				<a
					href="https://facebook.com/noobassembly"
					target="_blank"
					rel="noopener noreferrer"
					className="text-purple-500 underline">
					NoobStore
				</a>{" "}
				kho hàng tại{" "}
				<span className="text-purple-500">Hồ Chí Minh</span>.
			</>
		),
	},
	{
		icon: (
			<div className="flex items-center gap-4">
				<CalendarClock className="w-7 h-7 text-blue-500" />
				<strong className="text-lg">Vận chuyển</strong>
			</div>
		),
		title: (
			<>
				<span className="text-blue-600 font-medium">
					Chúng tôi vận chuyển
				</span>{" "}
				hầu hết đơn hàng trong vòng{" "}
				<span className="text-blue-600 font-medium">
					24-48 giờ đối với nội thành
				</span>{" "}
				và luôn bao gồm bảo hiểm với các đơn hàng đi ngoại thành.
			</>
		),
	},
	{
		icon: (
			<div className="flex items-center gap-4">
				<CreditCard className="w-7 h-7 text-green-500" />
				<strong className="text-lg">Thanh toán</strong>
			</div>
		),
		title: (
			<>
				<span className="text-green-600 font-medium">
					Nhiều phương thức thanh toán
				</span>{" "}
				có sẵn tại trang thanh toán và{" "}
				<span className="text-green-600 font-medium">
					không lãi suất
				</span>{" "}
				kế hoạch trả góp có sẵn.
			</>
		),
	},
	{
		icon: (
			<div className="flex items-center gap-4">
				<PencilRuler className="w-7 h-7 text-pink-500" />
				<strong className="text-lg">Tùy chỉnh</strong>
			</div>
		),
		title: (
			<>
				<span className="text-pink-600 font-medium">"Build"</span> cho
				mình chiếc bàn phím mơ ước hoặc{" "}
				<span className="text-pink-600 font-medium">"Customize"</span>{" "}
				những chiếc có sẵn
			</>
		),
	},
];

const StrongPoint: React.FC = () => {
	return (
		<div className="w-full">
			<div className="mb-4">
				<span className="font-semibold text-xl text-black">
					Tại sao chọn chúng tôi?{" "}
				</span>
				<span className="text-gray-700 text-xl font-normal">
					Thêm nhiều lý do để mua sắm với chúng tôi.
				</span>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 gap-2">
				{strongPoints.map((point, idx) => (
					<div
						key={idx}
						className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 min-h-[120px]">
						<div>{point.icon}</div>
						<div className="text-sm text-gray-700">
							{point.title}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default StrongPoint;
