import React, { useEffect, useState } from "react";
import { Base } from "@/templates/Base";
import {
	Box,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Divider,
	Container,
	List,
	ListItem,
	ListItemText,
	Chip,
	Card,
	CardContent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PolicyIcon from "@mui/icons-material/Policy";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BuildIcon from "@mui/icons-material/Build";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SecurityIcon from "@mui/icons-material/Security";

const PolicyPage = () => {
	const [expanded, setExpanded] = useState<string | false>("product-policy");
	const [effectiveDate, setEffectiveDate] = useState<string>("");

	useEffect(() => {
		// Compute on client to avoid SSR/CSR mismatch due to timezone/locale
		setEffectiveDate(new Date().toLocaleDateString("vi-VN"));
	}, []);

	const handleChange =
		(panel: string) =>
		(event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : false);
		};

	const PolicySection = ({
		id,
		title,
		icon,
		children,
	}: {
		id: string;
		title: string;
		icon: React.ReactNode;
		children: React.ReactNode;
	}) => (
		<Accordion
			expanded={expanded === id}
			onChange={handleChange(id)}
			className="mb-4 shadow-md">
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				className="bg-gray-50 hover:bg-gray-100">
				<div className="flex items-center gap-3">
					{icon}
					<Typography variant="h6" className="font-semibold">
						{title}
					</Typography>
				</div>
			</AccordionSummary>
			<AccordionDetails className="bg-white">{children}</AccordionDetails>
		</Accordion>
	);

	const PolicySubSection = ({
		title,
		children,
	}: {
		title: string;
		children: React.ReactNode;
	}) => (
		<div className="mb-6">
			<Typography
				variant="h6"
				className="font-semibold mb-3 text-blue-800">
				{title}
			</Typography>
			{children}
		</div>
	);

	return (
		<Base>
			<Container maxWidth="lg" className="py-8">
				{/* Header */}
				<Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
					<CardContent className="text-center py-8">
						<div className="flex justify-center mb-4">
							<PolicyIcon style={{ fontSize: 60 }} />
						</div>
						<Typography
							variant="h3"
							className="font-bold mb-4 text-white">
							Chính Sách NoobStore
						</Typography>
						<Typography
							variant="h6"
							className="opacity-100 text-gray-200">
							Quy định và chính sách toàn diện cho sản phẩm, dịch
							vụ và hoạt động trung gian
						</Typography>
						<div className="flex flex-wrap justify-center gap-2 mt-4">
							<Chip
								label="Sản phẩm"
								className="bg-white text-blue-600"
							/>
							<Chip
								label="Dịch vụ"
								className="bg-white text-blue-600"
							/>
							<Chip
								label="Giao hàng"
								className="bg-white text-blue-600"
							/>
							<Chip
								label="Trung gian"
								className="bg-white text-blue-600"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Product Sales/Purchase Policy */}
				<PolicySection
					id="product-policy"
					title="Chính Sách Mua Bán Sản Phẩm"
					icon={<ShoppingCartIcon className="text-green-600" />}>
					<div className="space-y-6">
						<PolicySubSection title="1. Quy Định Mua Hàng">
							<List className="space-y-2">
								<ListItem className="bg-gray-50 rounded-lg">
									<ListItemText
										primary="Xác thực thông tin"
										secondary="Khách hàng phải cung cấp thông tin chính xác (họ tên, số điện thoại, địa chỉ) khi đặt hàng."
									/>
								</ListItem>
								<ListItem className="bg-gray-50 rounded-lg">
									<ListItemText
										primary="Thanh toán"
										secondary="Chấp nhận thanh toán qua chuyển khoản, COD, thẻ tín dụng. Đơn hàng chỉ được xử lý sau khi thanh toán thành công."
									/>
								</ListItem>
								<ListItem className="bg-gray-50 rounded-lg">
									<ListItemText
										primary="Xác nhận đơn hàng"
										secondary="NoobStore sẽ xác nhận đơn hàng trong vòng 2-4 giờ làm việc qua email hoặc điện thoại."
									/>
								</ListItem>
							</List>
						</PolicySubSection>

						<PolicySubSection title="2. Chính Sách Đổi Trả">
							<div className="grid md:grid-cols-2 gap-4">
								<Card className="border-l-4 border-green-500">
									<CardContent>
										<Typography
											variant="h6"
											className="text-green-600 mb-2">
											✅ Được đổi trả
										</Typography>
										<List dense>
											<ListItem>
												<ListItemText primary="Sản phẩm lỗi từ nhà sản xuất" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Giao sai sản phẩm" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Sản phẩm bị hư hỏng trong vận chuyển" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Trong vòng 7 ngày với sản phẩm chưa sử dụng" />
											</ListItem>
										</List>
									</CardContent>
								</Card>
								<Card className="border-l-4 border-red-500">
									<CardContent>
										<Typography
											variant="h6"
											className="text-red-600 mb-2">
											❌ Không được đổi trả
										</Typography>
										<List dense>
											<ListItem>
												<ListItemText primary="Sản phẩm đã qua sử dụng" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Keycap custom theo yêu cầu" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Sản phẩm sale/clearance" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Quá thời hạn đổi trả" />
											</ListItem>
										</List>
									</CardContent>
								</Card>
							</div>
						</PolicySubSection>

						<PolicySubSection title="3. Bảo Hành Sản Phẩm">
							<div className="bg-blue-50 p-4 rounded-lg">
								<Typography variant="body1" className="mb-3">
									<strong>Thời gian bảo hành:</strong>
								</Typography>
								<div className="grid md:grid-cols-3 gap-4">
									<div className="text-center">
										<Typography
											variant="h4"
											className="text-blue-600 font-bold">
											12
										</Typography>
										<Typography>
											tháng cho bàn phím
										</Typography>
									</div>
									<div className="text-center">
										<Typography
											variant="h4"
											className="text-blue-600 font-bold">
											6
										</Typography>
										<Typography>
											tháng cho switch
										</Typography>
									</div>
									<div className="text-center">
										<Typography
											variant="h4"
											className="text-blue-600 font-bold">
											3
										</Typography>
										<Typography>
											tháng cho keycap
										</Typography>
									</div>
								</div>
							</div>
						</PolicySubSection>
					</div>
				</PolicySection>

				{/* Service Policy */}
				<PolicySection
					id="service-policy"
					title="Chính Sách Dịch Vụ"
					icon={<BuildIcon className="text-blue-600" />}>
					<div className="space-y-6">
						<PolicySubSection title="1. Dịch Vụ Keyboard Custom">
							<List className="space-y-2">
								<ListItem className="bg-blue-50 rounded-lg">
									<ListItemText
										primary="Mod switch (lube, film, spring)"
										secondary="Thời gian: 3-7 ngày làm việc. Bảo hành 30 ngày cho chất lượng mod."
									/>
								</ListItem>
								<ListItem className="bg-blue-50 rounded-lg">
									<ListItemText
										primary="Build keyboard hoàn chỉnh"
										secondary="Thời gian: 5-10 ngày làm việc. Bảo hành 90 ngày cho chất lượng build."
									/>
								</ListItem>
								<ListItem className="bg-blue-50 rounded-lg">
									<ListItemText
										primary="Solder/Desolder switch"
										secondary="Thời gian: 2-5 ngày làv việc. Bảo hành 60 ngày cho chất lượng hàn."
									/>
								</ListItem>
							</List>
						</PolicySubSection>

						<PolicySubSection title="2. Quy Trình Nhận Dịch Vụ">
							<div className="flex flex-col md:flex-row gap-4">
								{[
									{
										step: "1",
										title: "Tư vấn",
										desc: "Trao đổi yêu cầu và báo giá",
									},
									{
										step: "2",
										title: "Nhận hàng",
										desc: "Kiểm tra và xác nhận tình trạng",
									},
									{
										step: "3",
										title: "Thực hiện",
										desc: "Tiến hành dịch vụ theo yêu cầu",
									},
									{
										step: "4",
										title: "Giao trả",
										desc: "Kiểm tra và giao hàng cho khách",
									},
								].map((item) => (
									<Card
										key={item.step}
										className="flex-1 text-center">
										<CardContent>
											<div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold">
												{item.step}
											</div>
											<Typography
												variant="h6"
												className="font-semibold mb-1">
												{item.title}
											</Typography>
											<Typography
												variant="body2"
												className="text-gray-600">
												{item.desc}
											</Typography>
										</CardContent>
									</Card>
								))}
							</div>
						</PolicySubSection>

						<PolicySubSection title="3. Trách Nhiệm Dịch Vụ">
							<div className="grid md:grid-cols-2 gap-6">
								<Card className="border-l-4 border-green-500">
									<CardContent>
										<Typography
											variant="h6"
											className="text-green-600 mb-3">
											🏪 Trách nhiệm NoobStore
										</Typography>
										<List dense>
											<ListItem>
												<ListItemText primary="Thực hiện đúng yêu cầu đã thỏa thuận" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Bảo đảm chất lượng dịch vụ" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Giao hàng đúng hẹn" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Bảo mật thông tin khách hàng" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Hỗ trợ kỹ thuật sau dịch vụ" />
											</ListItem>
										</List>
									</CardContent>
								</Card>
								<Card className="border-l-4 border-orange-500">
									<CardContent>
										<Typography
											variant="h6"
											className="text-orange-600 mb-3">
											👤 Trách nhiệm khách hàng
										</Typography>
										<List dense>
											<ListItem>
												<ListItemText primary="Cung cấp thông tin chính xác" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Thanh toán đúng hạn" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Kiểm tra sản phẩm khi nhận" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Tuân thủ hướng dẫn sử dụng" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Thông báo kịp thời nếu có vấn đề" />
											</ListItem>
										</List>
									</CardContent>
								</Card>
							</div>
						</PolicySubSection>
					</div>
				</PolicySection>

				{/* Delivery Policy */}
				<PolicySection
					id="delivery-policy"
					title="Chính Sách Giao Hàng & Thời Gian"
					icon={<LocalShippingIcon className="text-purple-600" />}>
					<div className="space-y-6">
						<PolicySubSection title="1. Phương Thức Giao Hàng">
							<div className="grid md:grid-cols-2 gap-4">
								{[
									{
										title: "Tự giao và tự nhận",
										price: "Miễn phí",
										desc: "Khách hàng tự mang đến và tự nhận tại cửa hàng",
										time: "Tức thì",
									},
									{
										title: "Tự giao, NoobStore trả hàng",
										price: "50,000đ",
										desc: "Khách tự mang đến, NoobStore giao trả tận nơi",
										time: "6-12 giờ sau hoàn thành",
									},
									{
										title: "NoobStore lấy hàng, tự nhận",
										price: "50,000đ",
										desc: "NoobStore đến lấy, khách tự đến nhận",
										time: "2-4 giờ lấy hàng",
									},
									{
										title: "NoobStore giao và nhận",
										price: "90,000đ",
										desc: "NoobStore đến lấy và giao trả tận nơi",
										time: "2-4 giờ lấy, 6-12 giờ trả",
									},
								].map((method, index) => (
									<Card key={index} className="border">
										<CardContent>
											<Typography
												variant="h6"
												className="font-semibold mb-2">
												{method.title}
											</Typography>
											<div className="flex justify-between items-center mb-2">
												<Chip
													classes={{
														label: "!text-white",
													}}
													label={method.price}
													color={
														method.price ===
														"Miễn phí"
															? "success"
															: "primary"
													}
													size="small"
												/>
												<Typography
													variant="body2"
													className="text-gray-600">
													{method.time}
												</Typography>
											</div>
											<Typography variant="body2">
												{method.desc}
											</Typography>
										</CardContent>
									</Card>
								))}
							</div>
						</PolicySubSection>

						<PolicySubSection title="2. Khu Vực Phục Vụ">
							<div className="bg-green-50 p-4 rounded-lg">
								<Typography
									variant="h6"
									className="text-green-600 mb-3">
									📍 Khu vực tiêu chuẩn (trong bán kính 50km)
								</Typography>
								<Typography className="mb-3">
									TP. Hồ Chí Minh và các quận/huyện lân cận.
									Phí giao hàng theo bảng giá chuẩn.
								</Typography>
								<Typography
									variant="h6"
									className="text-orange-600 mb-3">
									⚠️ Khu vực mở rộng (ngoài 50km)
								</Typography>
								<Typography>
									Có thể phục vụ với phí phụ trội và thời gian
									giao hàng lâu hơn. Liên hệ để được tư vấn cụ
									thể.
								</Typography>
							</div>
						</PolicySubSection>

						<PolicySubSection title="3. Tùy Chọn Bổ Sung">
							<List className="space-y-2">
								<ListItem className="bg-gray-50 rounded-lg">
									<ListItemText
										primary="🛡️ Bảo hiểm gói hàng (+10,000đ)"
										secondary="Đảm bảo an toàn cho gói hàng trong quá trình vận chuyển"
									/>
								</ListItem>
								<ListItem className="bg-gray-50 rounded-lg">
									<ListItemText
										primary="🚪 Giao nhận tận tay (+60,000đ)"
										secondary="Giao đến tận cửa, ngoại trừ chung cư có quy định riêng"
									/>
								</ListItem>
								<ListItem className="bg-gray-50 rounded-lg">
									<ListItemText
										primary="⚡ Giao hàng nhanh (+50,000đ)"
										secondary="2-4 giờ thay vì 6-12 giờ sau khi đơn hàng hoàn tất"
									/>
								</ListItem>
							</List>
						</PolicySubSection>
					</div>
				</PolicySection>

				{/* Middleman/Intermediary Policy */}
				<PolicySection
					id="middleman-policy"
					title="Chính Sách Dịch Vụ Trung Gian"
					icon={<SupportAgentIcon className="text-red-600" />}>
					<div className="space-y-6">
						<PolicySubSection title="1. Dịch Vụ Trung Gian Mua Hàng">
							<div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-4">
								<Typography
									variant="h6"
									className="text-yellow-700 mb-2">
									⚡ Dịch vụ đặc biệt
								</Typography>
								<Typography>
									NoobStore hỗ trợ khách hàng mua sản phẩm từ
									các nguồn khác (nước ngoài, các shop khác)
									khi sản phẩm không có sẵn hoặc có giá tốt
									hơn.
								</Typography>
							</div>

							<div className="grid md:grid-cols-3 gap-4">
								<Card className="text-center">
									<CardContent>
										<Typography
											variant="h4"
											className="text-blue-600 font-bold mb-2">
											5-10%
										</Typography>
										<Typography
											variant="h6"
											className="mb-2">
											Phí dịch vụ
										</Typography>
										<Typography
											variant="body2"
											className="text-gray-600">
											Tính trên giá trị đơn hàng (tối
											thiểu 100,000đ)
										</Typography>
									</CardContent>
								</Card>
								<Card className="text-center">
									<CardContent>
										<Typography
											variant="h4"
											className="text-green-600 font-bold mb-2">
											7-21
										</Typography>
										<Typography
											variant="h6"
											className="mb-2">
											Ngày xử lý
										</Typography>
										<Typography
											variant="body2"
											className="text-gray-600">
											Tùy theo nguồn hàng và phương thức
											vận chuyển
										</Typography>
									</CardContent>
								</Card>
								<Card className="text-center">
									<CardContent>
										<Typography
											variant="h4"
											className="text-purple-600 font-bold mb-2">
											100%
										</Typography>
										<Typography
											variant="h6"
											className="mb-2">
											Đảm bảo
										</Typography>
										<Typography
											variant="body2"
											className="text-gray-600">
											Hoàn tiền nếu không thể mua được
											hàng
										</Typography>
									</CardContent>
								</Card>
							</div>
						</PolicySubSection>

						<PolicySubSection title="2. Quy Trình Dịch Vụ Trung Gian">
							<div className="space-y-4">
								{[
									{
										step: 1,
										title: "Yêu cầu báo giá",
										desc: "Khách hàng cung cấp thông tin sản phẩm cần mua",
										color: "blue",
									},
									{
										step: 2,
										title: "Tư vấn & báo giá",
										desc: "NoobStore tìm hiểu và báo giá chi tiết",
										color: "green",
									},
									{
										step: 3,
										title: "Xác nhận & thanh toán",
										desc: "Khách hàng thanh toán 100% trước khi đặt hàng",
										color: "orange",
									},
									{
										step: 4,
										title: "Thực hiện đặt hàng",
										desc: "NoobStore tiến hành đặt hàng từ nguồn",
										color: "purple",
									},
									{
										step: 5,
										title: "Theo dõi & cập nhật",
										desc: "Thông báo tiến độ định kỳ cho khách hàng",
										color: "pink",
									},
									{
										step: 6,
										title: "Nhận & giao hàng",
										desc: "Kiểm tra và giao hàng cho khách hàng",
										color: "indigo",
									},
								].map((item) => (
									<div
										key={item.step}
										className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
										<div
											className={`w-8 h-8 bg-${item.color}-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0`}>
											{item.step}
										</div>
										<div>
											<Typography
												variant="h6"
												className="font-semibold mb-1">
												{item.title}
											</Typography>
											<Typography
												variant="body2"
												className="text-gray-600">
												{item.desc}
											</Typography>
										</div>
									</div>
								))}
							</div>
						</PolicySubSection>

						<PolicySubSection title="3. Điều Khoản Đặc Biệt">
							<div className="grid md:grid-cols-2 gap-4">
								<Card className="border-l-4 border-red-500">
									<CardContent>
										<Typography
											variant="h6"
											className="text-red-600 mb-3">
											⚠️ Rủi ro & Giới hạn
										</Typography>
										<List dense>
											<ListItem>
												<ListItemText primary="Không chịu trách nhiệm về chất lượng sản phẩm từ nguồn thứ 3" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Thời gian có thể thay đổi do yếu tố ngoại cảnh" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Không áp dụng đối với hàng cấm, hàng nguy hiểm" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Phí phát sinh (thuế, phí vận chuyển) do khách chịu" />
											</ListItem>
										</List>
									</CardContent>
								</Card>
								<Card className="border-l-4 border-green-500">
									<CardContent>
										<Typography
											variant="h6"
											className="text-green-600 mb-3">
											✅ Cam kết dịch vụ
										</Typography>
										<List dense>
											<ListItem>
												<ListItemText primary="Tư vấn minh bạch về giá và thời gian" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Cập nhật tiến độ thường xuyên" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Hoàn tiền 100% nếu không mua được" />
											</ListItem>
											<ListItem>
												<ListItemText primary="Hỗ trợ warranty theo chính sách nhà sản xuất" />
											</ListItem>
										</List>
									</CardContent>
								</Card>
							</div>
						</PolicySubSection>
					</div>
				</PolicySection>

				{/* General Terms */}
				<PolicySection
					id="general-terms"
					title="Điều Khoản Chung"
					icon={<SecurityIcon className="text-gray-600" />}>
					<div className="space-y-6">
						<PolicySubSection title="1. Quyền và Nghĩa vụ">
							<div className="bg-blue-50 p-4 rounded-lg">
								<Typography variant="body1" className="mb-3">
									<strong>NoobStore có quyền:</strong>
								</Typography>
								<List dense>
									<ListItem>
										<ListItemText primary="• Từ chối phục vụ khách hàng vi phạm quy định" />
									</ListItem>
									<ListItem>
										<ListItemText primary="• Thay đổi chính sách với thông báo trước 7 ngày" />
									</ListItem>
									<ListItem>
										<ListItemText primary="• Thu thập thông tin cần thiết để cung cấp dịch vụ" />
									</ListItem>
								</List>

								<Typography
									variant="body1"
									className="mb-3 mt-4">
									<strong>Khách hàng có quyền:</strong>
								</Typography>
								<List dense>
									<ListItem>
										<ListItemText primary="• Được thông tin đầy đủ về sản phẩm/dịch vụ" />
									</ListItem>
									<ListItem>
										<ListItemText primary="• Khiếu nại và được giải quyết thỏa đáng" />
									</ListItem>
									<ListItem>
										<ListItemText primary="• Bảo mật thông tin cá nhân" />
									</ListItem>
								</List>
							</div>
						</PolicySubSection>

						<PolicySubSection title="2. Giải Quyết Tranh Chấp">
							<Typography className="mb-3">
								Mọi tranh chấp sẽ được giải quyết theo thứ tự ưu
								tiên:
							</Typography>
							<div className="space-y-2">
								<div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
									<div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
										1
									</div>
									<Typography>
										Thương lượng trực tiếp giữa NoobStore và
										khách hàng
									</Typography>
								</div>
								<div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
									<div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
										2
									</div>
									<Typography>
										Hòa giải qua bên thứ ba (nếu cần)
									</Typography>
								</div>
								<div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
									<div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
										3
									</div>
									<Typography>
										Giải quyết theo pháp luật Việt Nam
									</Typography>
								</div>
							</div>
						</PolicySubSection>

						<PolicySubSection title="3. Liên Hệ & Hỗ Trợ">
							<Card className="bg-gradient-to-r from-blue-50 to-purple-50">
								<CardContent>
									<div className="grid md:grid-cols-2 gap-4">
										<div>
											<Typography
												variant="h6"
												className="font-semibold mb-3">
												📞 Thông tin liên hệ
											</Typography>
											<div className="space-y-2">
												<Typography>
													• Hotline: 1900 xxxx
												</Typography>
												<Typography>
													• Email:
													support@noobstore.com
												</Typography>
												<Typography>
													• Địa chỉ: [Địa chỉ cửa
													hàng]
												</Typography>
												<Typography>
													• Giờ làm việc: 8:00 - 22:00
													(T2-CN)
												</Typography>
											</div>
										</div>
										<div>
											<Typography
												variant="h6"
												className="font-semibold mb-3">
												💬 Hỗ trợ trực tuyến
											</Typography>
											<div className="space-y-2">
												<Typography>
													• Live chat trên website
												</Typography>
												<Typography>
													• Facebook Messenger
												</Typography>
												<Typography>
													• Zalo OA
												</Typography>
												<Typography>
													• Telegram Bot
												</Typography>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</PolicySubSection>
					</div>
				</PolicySection>

				{/* Footer */}
				<Card className="mt-8 bg-gray-100">
					<CardContent className="text-center">
						<Typography variant="body2" className="text-gray-600">
							Chính sách này có hiệu lực từ ngày{" "}
							{effectiveDate || ""} và có thể được cập nhật theo
							thời gian.
							<br />
							Phiên bản mới nhất luôn được đăng tải tại
							noobstore.com/policy
						</Typography>
					</CardContent>
				</Card>
			</Container>
		</Base>
	);
};

export default PolicyPage;
