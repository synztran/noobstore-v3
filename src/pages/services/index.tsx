import Breadcumb from "@/components/breadcumb"
import { BreadcumbTitle, ENUM_FILM_TYPE, ENUM_GREASE_TYPE, ENUM_SPRING_TYPE, ENUM_STABILIZER_LAYOUT, ENUM_SWITCH_TYPE, FILM_COLOR_LABEL, FILM_TYPE_LABEL, GREASE_TYPE_LABEL, KEYBOARD_LAYOUT_OPTS, SPRING_TYPE_LABEL, SPRING_WEIGHT_LABEL, SWITCH_TYPE_LABEL } from "@/components/constants"
import SimpleInputV1 from "@/components/simpleInputV1"
import SimpleSelectV1 from "@/components/simpleSelectV1"
import SimpleSelectV2 from "@/components/simpleSelectV2"
import { SERVICE_FILM_ICON, SERVICE_LUBE_ICON, SERVICE_NEW_SWITCH_ICON, SERVICE_SPRING_ICON, SERVICE_STABILIZER_ICON } from "@/constants/Images"
import { Base } from "@/templates/Base"
import { formatCurrency } from "@/utils/FormatNumber"
import { Box, Divider, Grid } from "@mui/material"
import Image from "next/image"
import { useState } from "react"


interface IService {
	switchQuantity: number
	switchType: ENUM_SWITCH_TYPE
	isLube: boolean
	isAddFilm: boolean
	filmType: ENUM_FILM_TYPE
	filmColor: string
	isProvideFilm: boolean
	isAddGrease: boolean
	greaseType: ENUM_GREASE_TYPE
	isAddStabilizer: boolean
	layout: ENUM_STABILIZER_LAYOUT
	isProvideStab: boolean
	isAddAssemble: boolean
	assebleLayout: number
	isChangeSpring: boolean
	springType: ENUM_SPRING_TYPE
	springWeight: string
	isProvideSpring: boolean
	stabilizer2u: number
	stabilizer7u: number
	stabilizer625u: number

}

const defaultValue = {
	switchQuantity: 0,
	switchType: ENUM_SWITCH_TYPE.UNKNOWN,
	isLube: false,
	isAddFilm: false,
	filmType: ENUM_FILM_TYPE.UNKNOWN,
	filmColor: "UNKNOWN",
	isProvideFilm: false,
	isAddGrease: false,
	greaseType: ENUM_GREASE_TYPE.UNKNOWN,
	isAddStabilizer: false,
	layout: ENUM_STABILIZER_LAYOUT["6.25U"],
	isProvideStab: false,
	isAddAssemble: false,
	assebleLayout: 0,
	isChangeSpring: false,
	springType: ENUM_SPRING_TYPE.UNKNOWN,
	springWeight: "UNKNOWN",
	isProvideSpring: false,
	stabilizer2u: 0,
	stabilizer7u: 0,
	stabilizer625u: 0
}

const ServicePage = () => {
	const [services, setServices] = useState<IService>(defaultValue);
	const [servicesPrice, setPrice] = useState<{
		filmPrice: number,
		greasePrice: number,
		springPrice: number,
	}>({
		filmPrice: 150000,
		greasePrice: 150000,
		springPrice: 150000,
	})
	const [orderInfo, serOrderInfo] = useState({
		total: 0,
		shipping: 0,
		discount: 0,
		subTotal: 0,
		tax: 0
	})

	const switchServiceAddon = {
		switchQuantity: services.switchQuantity,
		switchType: SWITCH_TYPE_LABEL[services.switchType],
		
	}

	const filmServiceAdddon = {
		isFilm: services.isAddFilm ? "Có" : "Không",
		filmType: FILM_TYPE_LABEL[services.filmType],
		filmColor: FILM_COLOR_LABEL[services.filmColor],
		// isProvideFilm: services.isProvideFilm ? "Có" : "Không",
	}

	const greaseServiceAddon = {
		isLube: services.isLube ? "Có" : "Không",
		greaseType: GREASE_TYPE_LABEL[services.greaseType],
	}

	const springServiceAddon = {
		isChangeSpring: services.isChangeSpring ? "Có" : "Không",
		springType: SPRING_TYPE_LABEL[services.springType],
		springWeight: SPRING_WEIGHT_LABEL[services.springWeight],
		// isProvideSpring: services.isProvideSpring ? "Có" : "Không",
	}

	const handleValidation = (e: any) => {
		let value = e.target.value;
		const onlyNums = value.replace(/[^0-9]/g, '');
    if (onlyNums.length < 4) {
			setServices(prev => ({
				...prev,
				switchQuantity: parseInt(onlyNums)
			}))
    }
  };

  return (
    <Base>
			<div className="mx-w-full p-6 sm:py-6 lg:px-8 relative z-1">
				<Breadcumb
					mainRoot={BreadcumbTitle["services"]}
				/>
				<Grid container className="my-4 h-full" style={{flexWrap: 'nowrap'}}> 
					{/* service info */}
					<Grid item xs={12} sm={8} md={8} className="min-h-screen pr-2">
						<Box className="bg-red-300">
							<Box className="bg-gray-300 h-14 p-4">
								<span className="text-xl text-center font-bold capitalize">Thông tin dịch vụ</span>
							</Box>
						</Box>
						<Box>
							{/* switch */}
							<Box className="bg-white rounded-md shadow-lg p-2">
								<HeadLabel title="Switch" icon={SERVICE_NEW_SWITCH_ICON} />
								<Grid item container spacing={2} className="mt-4">
									<Grid item md={12} className="flex flex-nowrap space-x-4">
										<Grid item md={6}>
											<SimpleInputV1 
												label="Số lượng switch" 
												onChange={handleValidation} 
												type="number"  
												inputProps={{
													maxLength: 3
												}}
												min={0}
												onInput = {(e: any) =>{
													e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)
											}}
											/>
										</Grid>
										<Grid item md={6}>
											<SimpleSelectV1
												label="Loại switch"
												options={Object.keys(SWITCH_TYPE_LABEL).map((key) => ({
													value: key,
													label: SWITCH_TYPE_LABEL[key as unknown as ENUM_SWITCH_TYPE]
												}))}
												defaultValue={services.switchType}
												onChange={(e) => {setServices(prev => ({
													...prev,
													switchType: e.target.value as unknown as ENUM_SWITCH_TYPE
												}))}}								
											/>
										</Grid>
									</Grid>
								</Grid>
							</Box>
							{/* lube */}
							<Box className="mt-2 bg-white rounded-md shadow-lg p-2">
								<HeadLabel title="Lube" icon={SERVICE_LUBE_ICON} size={32} />
								<Grid item md={12} className="flex flex-nowrap space-x-4">
									<Grid item md={6}>
										<SimpleSelectV1
											label="Bạn có lube switch không ?"
											options={[
												{value: "true", label: "Có"},
												{value: "false", label: "Không"}
											]}
											defaultValue={services.isLube ? "true" : "false"}
											onChange={(e) => {
												// clear state when switch to false
												if (e.target.value === "false") {
													setServices(prev => ({
														...prev,
														isLube: false,
														greaseType: ENUM_GREASE_TYPE.UNKNOWN
													}))
												} else {
													setServices(prev => ({
														...prev,
														isLube: e.target.value === "true" ? true : false
													}))
												}
											}}								
										/>
									</Grid>
									<Grid item md={6}>
										{
											services.isLube ? (
												<SimpleSelectV2
													id="greaseType"
													label="Loại grease"
													options={Object.keys(GREASE_TYPE_LABEL).map((key) => ({
														value: key,
														label: GREASE_TYPE_LABEL[key as unknown as ENUM_GREASE_TYPE]
													}))}
													value={services.greaseType}
													onChange={(e) => {
														setServices(prev => ({
															...prev,
															greaseType: e.target.value as unknown as ENUM_GREASE_TYPE
														}))
													}}
													variant="outlined"
												/>
											) : null
										}
									</Grid>
								</Grid>
							</Box>
							{/* film */}
							<Box className="mt-2 bg-white rounded-md shadow-lg p-2">
								<HeadLabel title="Film" icon={SERVICE_FILM_ICON} />
								<Grid item md={12} className="flex flex-nowrap space-x-4">
									<Grid item md={3}>
										<SimpleSelectV1
											label="Bạn có dùng film không ?"
											options={[
												{value: "true", label: "Có"},
												{value: "false", label: "Không"}
											]}
											defaultValue={services.isAddFilm ? "true" : "false"}
											onChange={(e) => {
												if (e.target.value === "false") {
													setServices(prev => ({
														...prev,
														isAddFilm: false,
														filmType: ENUM_FILM_TYPE.UNKNOWN,
														filmColor: "UNKNOWN",
														isProvideFilm: false
													}))
												} else {
													setServices(prev => ({
														...prev,
														isAddFilm: e.target.value === "true" ? true : false
													}))
												}
											}}								
										/>
									</Grid>
									<Grid item md={3}>
										<SimpleSelectV2
											id="isProvideFilm"
											label="Bạn có mua film không ?"
											options={[
												{value: "true", label: "Có"},
												{value: "false", label: "Không"}
											]}
											defaultValue={services.isProvideFilm ? "true" : "false"}
											value={services.isProvideFilm ? "true" : "false"}
											onChange={(e) => {setServices(prev => ({
												...prev,
												isProvideFilm: e.target.value === "true" ? true : false
											}))}}								
										/>
									</Grid>
									<Grid item md={3}>
										{
											services.isAddFilm ? (
												<SimpleSelectV2
													id="filmType"
													label="Loại film"
													options={Object.keys(FILM_TYPE_LABEL).map((key) => ({
														value: key,
														label: FILM_TYPE_LABEL[key as unknown as ENUM_FILM_TYPE]
													}))}
													defaultValue={services.filmType}
													onChange={(e) => {
														setServices(prev => ({
															...prev,
															filmType: e.target.value as unknown as ENUM_FILM_TYPE
														}))
													}}
												/>
											) : null
										}
									</Grid>
									<Grid item md={3}>
										{
											services.isAddFilm ? (
												<SimpleSelectV2
													id="filmColor"
													label="Màu film"
													options={Object.keys(FILM_COLOR_LABEL).map((key) => ({
														value: key,
														label: FILM_COLOR_LABEL[key as unknown as string]
													}))}
													defaultValue={services.filmColor}
													onChange={(e) => {
														setServices(prev => ({
															...prev,
															filmColor: e.target.value as unknown as string
														}))
													}}
												/>
											) : null
										}
									</Grid>
								</Grid>
							</Box>
							{/* spring */}
							<Box className="mt-2 bg-white rounded-md shadow-lg p-2">
								<HeadLabel title="Spring" icon={SERVICE_SPRING_ICON} />
								<Grid item md={12} className="flex flex-nowrap space-x-4">
									<Grid item md={3}>
										<SimpleSelectV1
											label="Bạn có thay lò xo không ?"
											options={[
												{value: "true", label: "Có"},
												{value: "false", label: "Không"}
											]}
											defaultValue={services.isChangeSpring ? "true" : "false"}
											onChange={(e) => {
												if (e.target.value === 'false') {
													setServices(prev => ({
														...prev,
														isChangeSpring: false,
														springType: ENUM_SPRING_TYPE.UNKNOWN,
														springWeight: "UNKNOWN",
														isProvideSpring: false
													}))
												} else {
													setServices(prev => ({
														...prev,
														isChangeSpring: e.target.value === "true" ? true : false
													}))
												}
											}}								
										/>
									</Grid>
									<Grid item md={3}>
										{
											services.isChangeSpring ? (
												<SimpleSelectV2
													id="isProvideSpring"
													label="Bạn có mua lò xo không ?"
													options={[
														{value: "true", label: "Có"},
														{value: "false", label: "Không"}
													]}
													defaultValue={services.isProvideSpring ? "true" : "false"}
													value={services.isProvideSpring ? "true" : "false"}
													onChange={(e) => {setServices(prev => ({
														...prev,
														isProvideSpring: e.target.value === "true" ? true : false
													}))}}								
												/>
											) : null
										}
									</Grid>
									<Grid item md={3}>
										{
											services.isChangeSpring ? (
												<SimpleSelectV2
													id="springType"
													label="Loại lò xo"
													options={Object.keys(SPRING_TYPE_LABEL).map((key) => ({
														value: key,
														label: SPRING_TYPE_LABEL[key as unknown as ENUM_SPRING_TYPE]
													}))}
													defaultValue={services.springType}
													value={services.springType}
													onChange={(e) => {
														setServices(prev => ({
															...prev,
															springType: e.target.value as unknown as ENUM_SPRING_TYPE
														}))
													}}
												/>
											) : null
										}
									</Grid>
									<Grid item md={3}>
										{
											services.isChangeSpring ? (
												<SimpleSelectV2
													label="Lực lò xo"
													options={Object.keys(SPRING_WEIGHT_LABEL).map((key) => ({
														value: key,
														label: SPRING_WEIGHT_LABEL[key as unknown as string]
													}))}
													defaultValue={services.springWeight}
													value={services.springWeight}
													onChange={(e) => {
														setServices(prev => ({
															...prev,
															springWeight: e.target.value as unknown as string
														}))
													}}
												/>
											) : null
										}
									</Grid>
								</Grid>
							</Box>
							{/* stabilizer */}
							<Box className="mt-2 bg-white rounded-md shadow-lg p-2">
								<HeadLabel title="Stabilizer" icon={SERVICE_STABILIZER_ICON} />
								<Grid item md={12} className="flex flex-nowrap space-x-4">
									<Grid item md={3}>
										<SimpleSelectV1
											label="Layout của phím ?"
											options={KEYBOARD_LAYOUT_OPTS}
											defaultValue={services.assebleLayout}
											// value={services.assebleLayout}
											onChange={(e) => {
												if (e.target.value === 'false') {
													setServices(prev => ({
														...prev,
														isChangeSpring: false,
														springType: ENUM_SPRING_TYPE.UNKNOWN,
														springWeight: "UNKNOWN",
													}))
												} else {
													setServices(prev => ({
														...prev,
														isChangeSpring: e.target.value === "true" ? true : false
													}))
												}
											}}								
										/>
									</Grid>
									<Grid item md={3}>
										<SimpleSelectV1
											label="Bạn có mua lò xo không ?"
											options={[
												{value: "true", label: "Có"},
												{value: "false", label: "Không"}
											]}
											defaultValue={services.isProvideSpring ? "true" : "false"}
											onChange={(e) => {setServices(prev => ({
												...prev,
												isProvideSpring: e.target.value === "true" ? true : false
											}))}}								
										/>
									</Grid>
									<Grid item md={3} style={{opacity: services.isChangeSpring ? 1 : 0}}>
										<SimpleSelectV2
											label="Loại lò xo"
											options={Object.keys(SPRING_TYPE_LABEL).map((key) => ({
												value: key,
												label: SPRING_TYPE_LABEL[key as unknown as ENUM_SPRING_TYPE]
											}))}
											defaultValue={services.springType}
											value={services.springType}
											onChange={(e) => {
												setServices(prev => ({
													...prev,
													springType: e.target.value as unknown as ENUM_SPRING_TYPE
												}))
											}}
										/>
									</Grid>
									<Grid item md={3} style={{opacity: services.isChangeSpring ? 1 : 0}}>
										<SimpleSelectV2
											label="Lực lò xo"
											options={Object.keys(SPRING_WEIGHT_LABEL).map((key) => ({
												value: key,
												label: SPRING_WEIGHT_LABEL[key as unknown as string]
											}))}
											defaultValue={services.springWeight}
											value={services.springWeight}
											onChange={(e) => {
												setServices(prev => ({
													...prev,
													springWeight: e.target.value as unknown as string
												}))
											}}
										/>
									</Grid>
								</Grid>
							</Box>
						</Box>
					</Grid>
					{/* order info */}
					<Grid item xs={12} sm={4} md={4} className="h-full border border-black" style={{marginLeft: '.5rem'}}>
						<Box className="bg-gray-300 h-14 p-4">
							<span className="text-xl text-center font-bold capitalize">Thông in hoá đơn</span>
						</Box>
						<Box bgcolor="#fff" padding={2}>
							<Box>
								{
									services.switchQuantity > 0 ? (
										<ServiceOptions title="Switch" addOn={switchServiceAddon} icon={SERVICE_NEW_SWITCH_ICON} />
									) : null
								}
								{/* { services.switchQuantity > 0 ? <Divider /> : null} */}
								{
									services.isLube ? (
										<ServiceOptions title="Lube" addOn={greaseServiceAddon} icon={SERVICE_LUBE_ICON} price={servicesPrice.greasePrice} iconWidth={32} iconHeight={32} />
									) : null
								}
								{/* { services.isLube ? <Divider /> : null} */}
								{
									services.isAddFilm ? (
										<ServiceOptions title="Film" addOn={filmServiceAdddon} icon={SERVICE_FILM_ICON} price={services.isProvideFilm ? servicesPrice.filmPrice : 0} />
									) : null
								}
								{/* { services.isAddFilm ? <Divider /> : null} */}
								{
									services.isChangeSpring ? (
										<ServiceOptions title="Spring" addOn={springServiceAddon} icon={SERVICE_SPRING_ICON} price={services.isProvideSpring ? servicesPrice.springPrice : 0} iconHeight={32} />
									) : null
								}
							</Box>
							{/* <OrderSummary {...services} /> */}
							<Divider />
							<ServiceOrder orderInfo={orderInfo}  />
							<ServiceButtonGroup />
						</Box>
					</Grid>
				</Grid>
			</div>
		</Base>
  )
}

export default ServicePage

const mapKeyName = {
	switchQuantity: 'Số lượng',
	switchType: 'Loại switch',
	isLube: 'Lube',
	isFilm: 'Film',
	filmType: 'Loại film',
	filmColor: 'Màu film',
	isProvideFilm: 'Mua film',
	isGrease: 'Sử dụng grease',
	greaseType: 'Loại grease',
	isAddStabilizer: 'Thêm stabilizer',
	layout: 'Layout',
	isProvideStab: 'Mua stabilizer',
	isAddAssemble: 'Thêm assemble',
	assebleLayout: 'Layout',
	isChangeSpring: 'Thay spring',
	springType: 'Loại spring',
	springWeight: 'Lực nhấn',
	isProvideSpring: 'Mua spring',
}

interface IFlexibleInterface {
	[key: string]: any;
}

const OrderSummary = ({...services}: IService) => {
	return (
		<Box>
			<Box>
				<span className="text-lg">Đơn hàng</span>
			</Box>
			<Box>
				<OrderSummaryGridStructure quantity={services.switchQuantity} title={SWITCH_TYPE_LABEL[services.switchType] + ' loại switch'} />
				{
					services.isLube  ? (
						<OrderSummaryGridStructure quantity={services.switchQuantity} title={GREASE_TYPE_LABEL[services.greaseType] + ' lube'} />
					) : null
				}
				{
					services.isAddFilm ? (
						<OrderSummaryGridStructure quantity={services.switchQuantity} title={FILM_TYPE_LABEL[services.filmType] + ' film'} />
					) : null
				}
				{
					services.isChangeSpring ? (
						<OrderSummaryGridStructure quantity={services.switchQuantity} title={SPRING_TYPE_LABEL[services.springType] + ' spring'} />
					) : null
				}
			</Box>
		</Box>
	)
}

const ServiceOptions = ({title = '', icon, addOn = {}, price = 0, iconWidth = 40, iconHeight = 40}: {
	title: string
	icon?: string
	addOn: IFlexibleInterface,
	price?: number
	iconWidth?: number
	iconHeight?: number
}) => {
	return (
		<Box className="py-2">
			<div className=" flex justify-between items-center mb-2">
				<div className="flex items-center">
					<Box className="w-12 h-12 bg-white border border-gray-300 flex items-center justify-center shadow-md rounded-sm">
						<Image src={icon as string} alt={title} width={iconWidth} height={iconHeight} style={{minHeight: iconHeight < 40 ? 32 : 40}} />
					</Box>
					<strong className="text-lg ml-2">{title}</strong>
				</div>
				{price ? (
					<div>
						<span className="text-lg">{formatCurrency(price)}</span>
					</div> 
					) : null
				}
			</div>
			{
				Object.keys(addOn).map((key, index) => {
					return (
						<Box>
							<Box key={index} className="flex justify-between items-center ml-4">
								<span>{mapKeyName[key as keyof typeof mapKeyName]}</span>
								<span>{addOn[key]}</span>
							</Box>
						</Box>
					)
				})
			}
		</Box>
	)
}

const ServiceOrder = ({
	orderInfo
}: {
	orderInfo: {
		total: number,
		shipping: number,
		discount: number,
		subTotal: number,
		tax: number
	}
}) => {
	return (
		<Box className="">
			<Box className="py-4">
				<div className="flex justify-between items-center pl-4 py-1">
					<span className="text-md">Tạm tính</span>
					<span className="text-md">{formatCurrency(orderInfo.subTotal)}</span>
				</div>
				<div className="flex justify-between items-center pl-4 py-1">
					<span>Thuế</span>
					<span className="text-md">{formatCurrency(orderInfo.discount)}</span>
				</div>
			</Box>
			<Divider className="ml-4" />
			<div className="flex justify-between items-center pl-4 py-4	">
				<strong className="text-lg">Tổng tiền</strong>
				<span className="text-lg font-bold">{formatCurrency(orderInfo.total)}</span>
			</div>
		</Box>
	)
}

const HeadLabel = ({title = '', icon, size = 40}: {title: string, icon: string, size?: number}) => {
	return (
		<div className="h-14 pb-2 flex gap-2 items-center">
			<Image src={icon} width={size} height={size} alt="icon" />
			<span className="text-xl text-center font-bold capitalize">{title}</span>
		</div>
	)
}

const ServiceButtonGroup = () => {
	return (
		<Box className="mt-4 flex justify-end w-full">
			<button className="bg-yellow-300 text-black py-2 px-4 rounded-sm w-full">Thanh toán</button>
		</Box>
	)
}

const OrderSummaryGridStructure = ({quantity, title, price}: {quantity: number, title: any, price?: number}) => (
	<Grid container className="flex items-center">
		<Grid item md={1} className="text-sm">x{quantity || 0}</Grid>
		<Grid item md={8}>{title}</Grid>
		<Grid item md={3}>{price}</Grid>
	</Grid>
)