import React from "react";

interface RaffleTermsContentProps {
	variant?: "full" | "summary";
	className?: string;
}

const RaffleTermsContent: React.FC<RaffleTermsContentProps> = ({
	variant = "full",
	className = "",
}) => {
	if (variant === "summary") {
		return (
			<div
				className={`prose prose-sm max-w-none space-y-3 text-gray-700 text-sm leading-relaxed ${className}`}>
				<div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
					<p className="font-semibold text-blue-900 mb-2">
						🔑 Những điểm chính:
					</p>
					<ul className="list-disc list-inside space-y-1 text-blue-800 text-xs">
						<li>
							NoobStore có quyền cuối cùng trong tất cả quyết định
						</li>
						<li>
							Makers &lt; 3 lần raffle: 100% tiền được giữ 30 ngày
						</li>
						<li>Phí dịch vụ: 10% + phí thanh toán 2-3%</li>
						<li>Giao hàng trong 14 ngày sau raffle kết thúc</li>
						<li>Nghiêm cấm: sản phẩm giả, lạm dụng, spam</li>
					</ul>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`prose prose-sm max-w-none space-y-6 text-gray-700 text-sm leading-relaxed ${className}`}>
			{/* 1. GIỚI THIỆU */}
			<section>
				<h3 className="text-base font-semibold text-gray-900 mb-3">
					1. Giới thiệu
				</h3>
				<p>
					Những điều khoản và điều kiện này ("Điều khoản") điều chỉnh
					việc sử dụng tính năng Raffle sản phẩm trên nền tảng
					NoobStore. Bằng việc tham gia vào bất kỳ raffle nào, những
					người bán hàng (Makers) và những người tham gia (Users) đồng
					ý bị ràng buộc bởi những điều khoản này.
				</p>
			</section>

			{/* 2. QUYẾT ĐỊNH CUỐI CÙNG CỦA NOOBSTORE */}
			<section>
				<h3 className="text-base font-semibold text-gray-900 mb-3">
					2. Quyết Định Cuối Cùng của NoobStore
				</h3>
				<div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
					<p className="font-semibold text-blue-900 mb-2">
						NoobStore có quyền cuối cùng và toàn quyền:
					</p>
					<ul className="list-disc list-inside space-y-2 text-blue-800">
						<li>
							Chấp thuận hoặc từ chối yêu cầu tạo raffle từ bất kỳ
							Maker nào
						</li>
						<li>
							Huỷ bỏ hoặc tạm dừng bất kỳ raffle nào nếu phát hiện
							hoạt động bất thường hoặc vi phạm
						</li>
						<li>
							Giải quyết mọi tranh chấp giữa Makers và Users liên
							quan đến raffle
						</li>
						<li>
							Thiết lập và thay đổi các quy tắc, phí và điều kiện
							của raffle bất cứ lúc nào
						</li>
						<li>
							Xác định người thắng cuối cùng trong trường hợp có
							tranh chấp hoặc sai sót
						</li>
						<li>
							Từ chối hoặc hủy raffle mà không cần giải thích hoặc
							có trách nhiệm đền bù
						</li>
					</ul>
				</div>
			</section>

			{/* 3. CHÍNH SÁCH ESCROW */}
			<section>
				<h3 className="text-base font-semibold text-gray-900 mb-3">
					3. Chính Sách Giữ Tiền (Escrow) Cho Makers Mới
				</h3>
				<div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
					<p className="font-semibold text-yellow-900 mb-3">
						Đối với Makers có ít hơn 3 lần raffle thành công trên
						NoobStore:
					</p>
					<ul className="list-disc list-inside space-y-2 text-yellow-800">
						<li>
							<span className="font-semibold">
								100% số tiền thu được
							</span>{" "}
							từ raffle sẽ được NoobStore giữ lại
						</li>
						<li>
							Tiền sẽ được giữ lại trong vòng{" "}
							<span className="font-semibold">30 ngày</span> sau
							khi raffle kết thúc để đảm bảo sản phẩm được giao
							đúng hạn và chất lượng tốt
						</li>
						<li>
							Nếu không có khiếu nại từ người tham gia trong vòng
							30 ngày, tiền sẽ được chuyển về tài khoản của Maker
						</li>
						<li>
							Nếu có khiếu nại hoặc sản phẩm không đúng/không được
							giao, NoobStore có quyền hoàn tiền cho người tham
							gia từ số tiền đã giữ
						</li>
						<li>
							Nếu tranh chấp không thể giải quyết, tiền sẽ được
							hoàn lại cho người tham gia
						</li>
					</ul>
				</div>
			</section>

			{/* 4. YÊU CẦU MAKER */}
			<section>
				<h3 className="text-base font-semibold text-gray-900 mb-3">
					4. Yêu Cầu Đối Với Makers
				</h3>
				<ul className="list-disc list-inside space-y-2">
					<li>
						<span className="font-semibold">
							Xác thực danh tính:
						</span>{" "}
						Cung cấp giấy tờ tùy thân hợp lệ và thông tin liên hệ
						chính xác
					</li>
					<li>
						<span className="font-semibold">
							Xác thực sản phẩm:
						</span>{" "}
						Mô tả chính xác, chi tiết và cung cấp hình ảnh rõ ràng
						của sản phẩm raffle
					</li>
					<li>
						<span className="font-semibold">
							Chất lượng sản phẩm:
						</span>{" "}
						Sản phẩm phải là chính hãng, trong tình trạng tốt như đã
						mô tả
					</li>
					<li>
						<span className="font-semibold">
							Thời gian giao hàng:
						</span>{" "}
						Giao sản phẩm cho người thắng trong vòng 14 ngày kể từ
						ngày raffle kết thúc
					</li>
					<li>
						<span className="font-semibold">
							Không bán hàng giả:
						</span>{" "}
						Nghiêm cấm bán các sản phẩm giả, nhái, không rõ nguồn
						gốc hoặc bị đánh cắp
					</li>
					<li>
						<span className="font-semibold">Không gây rối:</span>{" "}
						Không được lạm dụng, spam, hoặc tạo nhiều raffle không
						có giá trị để "kéo dài" lịch sử raffle
					</li>
					<li>
						<span className="font-semibold">
							Có trách nhiệm pháp lý:
						</span>{" "}
						Chịu trách nhiệm pháp lý toàn bộ đối với các sản phẩm
						được raffle
					</li>
					<li>
						<span className="font-semibold">
							Tuân thủ đạo luật:
						</span>{" "}
						Đảm bảo raffle tuân thủ các luật pháp hiện hành tại các
						quốc gia/khu vực có liên quan
					</li>
				</ul>
			</section>

			{/* 5. ĐIỀU KIỆN RAFFLE */}
			<section>
				<h3 className="text-base font-semibold text-gray-900 mb-3">
					5. Điều Kiện Raffle
				</h3>
				<ul className="list-disc list-inside space-y-2">
					<li>
						<span className="font-semibold">
							Giới hạn tham gia:
						</span>{" "}
						Chỉ những tài khoản đã xác minh mới có thể tham gia
						raffle
					</li>
					<li>
						<span className="font-semibold">
							Một lần mua = một vé số:
						</span>{" "}
						Mỗi lần mua một vé raffle, tài khoản tham gia nhận một
						số vé tương ứng
					</li>
					<li>
						<span className="font-semibold">Không gian lặp:</span>{" "}
						Người dùng có thể mua nhiều vé nhưng mỗi vé phải là giao
						dịch riêng biệt
					</li>
					<li>
						<span className="font-semibold">
							Chọn số ngẫu nhiên:
						</span>{" "}
						Người thắng sẽ được chọn bằng hệ thống ngẫu nhiên được
						xác minh bởi NoobStore
					</li>
					<li>
						<span className="font-semibold">
							Công khai kết quả:
						</span>{" "}
						Kết quả raffle sẽ được công bố công khai trên nền tảng
					</li>
					<li>
						<span className="font-semibold">
							Hạn chế thời gian:
						</span>{" "}
						Raffle phải kéo dài từ tối thiểu 3 ngày đến tối đa 30
						ngày
					</li>
				</ul>
			</section>

			{/* 6. CÁC HÀNH VI BỊ CẤMM */}
			<section>
				<h3 className="text-base font-semibold text-gray-900 mb-3">
					6. Các Hành Vi Bị Cấm
				</h3>
				<div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
					<ul className="list-disc list-inside space-y-2 text-red-800">
						<li>Lập tài khoản giả mạo hoặc spam</li>
						<li>
							Mua vé raffle cho chính mình hoặc những tài khoản có
							liên quan
						</li>
						<li>
							Sử dụng bot, tự động hóa hoặc các công cụ gian lận
							khác
						</li>
						<li>
							Tạo raffle với sản phẩm không tồn tại hoặc không thể
							giao
						</li>
						<li>
							Yêu cầu người thắng thanh toán thêm phí ẩn hoặc chi
							phí không công bố
						</li>
						<li>
							Giao dịch ngoài nền tảng để tránh phí hoặc kiểm soát
						</li>
						<li>
							Làm phát tán thông tin cá nhân của người dùng khác
						</li>
						<li>Spam, quấy rầy hoặc đe dọa</li>
						<li>
							Bất cứ hoạt động nào được xem là gian lận hoặc bất
							hợp pháp
						</li>
					</ul>
				</div>
			</section>

			{/* 7. CƠ CẤU PHÍ */}
			<section>
				<h3 className="text-base font-semibold text-gray-900 mb-3">
					7. Cơ Cấu Phí
				</h3>
				<div className="bg-gray-50 border border-gray-300 p-3 rounded">
					<div className="space-y-3">
						<div className="flex justify-between">
							<span>
								<span className="font-semibold">
									Phí dịch vụ NoobStore:
								</span>{" "}
								10% trên tổng doanh thu raffle
							</span>
							<span className="font-semibold">10%</span>
						</div>
						<div className="flex justify-between">
							<span>
								<span className="font-semibold">
									Phí thanh toán:
								</span>{" "}
								(nếu sử dụng cổng thanh toán)
							</span>
							<span className="font-semibold">2-3%</span>
						</div>
						<div className="border-t pt-3 flex justify-between">
							<span className="font-semibold">
								Tổng phí tối đa:
							</span>
							<span className="font-semibold">13%</span>
						</div>
					</div>
					<p className="text-xs text-gray-600 mt-3">
						Những Makers có lịch sử tốt (3+ raffle thành công) có
						thể nhận được chiết khấu phí lên đến 2%.
					</p>
				</div>
			</section>

			{/* 8. TRÁCH NHIỆM */}
			<section>
				<h3 className="text-base font-semibold text-gray-900 mb-3">
					8. Trách Nhiệm Và Giới Hạn
				</h3>
				<ul className="list-disc list-inside space-y-2">
					<li>
						NoobStore không chịu trách nhiệm cho bất kỳ sản phẩm bị
						hỏng, mất hoặc không được giao trong quá trình vận
						chuyển
					</li>
					<li>
						NoobStore không chịu trách nhiệm cho các tranh chấp giữa
						Makers và Users ngoài nền tảng
					</li>
					<li>
						Những Makers chịu trách nhiệm pháp lý toàn bộ đối với
						các sản phẩm raffle của họ
					</li>
					<li>
						NoobStore không bảo hành các sản phẩm raffle; đó là
						trách nhiệm của Maker
					</li>
					<li>
						NoobStore không chịu trách nhiệm cho thiệt hại do gián
						tiếp hoặc do hệ thống
					</li>
				</ul>
			</section>

			{/* 9. HỦY BỎ RAFFLE */}
			<section>
				<h3 className="text-base font-semibold text-gray-900 mb-3">
					9. Hủy Bỏ Raffle
				</h3>
				<ul className="list-disc list-inside space-y-2">
					<li>
						Makers có thể yêu cầu hủy raffle trước khi nó kết thúc,
						nhưng phải thanh toán phí hủy 10% cho NoobStore
					</li>
					<li>
						NoobStore có quyền hủy raffle bất kỳ lúc nào mà không
						cần giải thích hoặc bồi thường
					</li>
					<li>
						Nếu raffle bị hủy, tất cả tiền sẽ được hoàn lại cho
						những người tham gia
					</li>
					<li>
						Nếu Makers hủy raffle, phí hủy sẽ được trừ trước khi
						hoàn tiền
					</li>
				</ul>
			</section>

			{/* 10. TRANH CHẤP */}
			<section>
				<h3 className="text-base font-semibold text-gray-900 mb-3">
					10. Giải Quyết Tranh Chấp
				</h3>
				<ul className="list-disc list-inside space-y-2">
					<li>
						Tất cả tranh chấp phải được báo cáo cho NoobStore trong
						vòng 7 ngày kể từ ngày raffle kết thúc
					</li>
					<li>
						NoobStore sẽ điều tra và đưa ra quyết định cuối cùng
						trong vòng 14 ngày
					</li>
					<li>
						Quyết định của NoobStore là cuối cùng và có tính chất
						bắt buộc
					</li>
					<li>
						Nếu phát hiện gian lận, NoobStore có quyền tịch thu tất
						cả tiền và/hoặc khóa tài khoản
					</li>
				</ul>
			</section>

			{/* 11. RIÊNG TƯ VÀ BẢO MẬT */}
			<section>
				<h3 className="text-base font-semibold text-gray-900 mb-3">
					11. Quyền Riêng Tư Và Bảo Mật
				</h3>
				<ul className="list-disc list-inside space-y-2">
					<li>
						NoobStore sẽ bảo vệ thông tin cá nhân của người dùng
						theo chính sách riêng tư của nó
					</li>
					<li>
						Makers đồng ý rằng thông tin liên hệ của người thắng sẽ
						được chia sẻ với họ để giao hàng
					</li>
					<li>
						Những Makers không được lạm dụng hoặc chia sẻ thông tin
						cá nhân của người dùng với các bên thứ ba
					</li>
				</ul>
			</section>

			{/* 12. THAY ĐỔI ĐIỀU KHOẢN */}
			<section>
				<h3 className="text-base font-semibold text-gray-900 mb-3">
					12. Thay Đổi Điều Khoản
				</h3>
				<p>
					NoobStore có quyền thay đổi những điều khoản này bất cứ lúc
					nào. Những thay đổi sẽ có hiệu lực ngay lập tức sau khi được
					đăng tải. Việc tiếp tục sử dụng dịch vụ raffle của NoobStore
					sau những thay đổi này có nghĩa là bạn chấp thuận những thay
					đổi đó.
				</p>
			</section>

			{/* 13. LIÊN HỆ */}
			<section>
				<h3 className="text-base font-semibold text-gray-900 mb-3">
					13. Liên Hệ & Hỗ Trợ
				</h3>
				<p>
					Nếu bạn có bất kỳ câu hỏi hoặc lo ngại nào về những điều
					khoản này, vui lòng liên hệ với NoobStore Customer Support
					tại: support@noobstore.com
				</p>
			</section>

			{/* NGÀY CÓ HIỆU LỰC */}
			<section className="border-t pt-4 text-center">
				<p className="text-xs text-gray-600">
					<span className="font-semibold">Ngày có hiệu lực:</span> 28
					Tháng 01 Năm 2026
				</p>
				<p className="text-xs text-gray-500 mt-1">
					Những điều khoản này được thay đổi vào ngày 28 Tháng 01 Năm
					2026
				</p>
			</section>
		</div>
	);
};

export default RaffleTermsContent;
