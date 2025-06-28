import TextEditor from "@/adminComponents/Texteditor";
import CategoryClient from "@/client/CategoryClient";
import UploadImage from "@/components/InputComponents/UploadImage";
import { MapCategoryStatus, RCategoryType } from "@/constants";
import { HTTP_STATUS } from "@/constants/Enums/https";
import {
	EnumCategorySaleType,
	EnumCategoryType,
	EnumSaleStatus,
	ICategory,
} from "@/interface/interface";
import Admin from "@/layoutAdmin/Admin";
import useCategoryQuery from "@/react-query/shop/api/useCategoryQueries";
import { classNames } from "@/utils/AppConfig";
import { formatCurrency } from "@/utils/FormatNumber";
import NotifyUtils from "@/utils/NotifyUtils";
import { Button, Chip, Collapse, IconButton } from "@material-ui/core";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReplyIcon from "@mui/icons-material/Reply";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import { useFormik } from "formik";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as yup from "yup";
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
	DroppableProvided,
	DraggableProvided,
	DroppableStateSnapshot,
	DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { Edit, Plus } from "lucide-react";
import { Trash2 } from "lucide-react";

const tableColumns: {
	id: string;
	label: string;
	styles?: React.CSSProperties;
}[] = [
	{
		id: "categoryId",
		label: "#",
	},
	{
		id: "categoryName",
		label: "Name",
	},
	{
		id: "description",
		label: "Description",
	},
	{
		id: "isActive",
		label: "Active - Status",
	},
	{
		id: "price",
		label: "Price - Quantity",
	},
	{
		id: "actions",
		label: "Actions",
	},
];

export default function Categories() {
	const [open, setOpen] = useState<boolean>(false);
	const [targetEdit, setTargetEdit] = useState<ICategory | null>(null);

	const {
		data: categoryList,
		isLoading,
		refetch,
	} = useCategoryQuery({
		isValidate: false,
		status: "",
	});

	const formik = useFormik({
		initialValues: {
			categoryId: targetEdit?.categoryId || "",
			categoryName: targetEdit?.categoryName || "",
			description: targetEdit?.description || "",
			isActive: targetEdit?.isActive || false,
			minPrice: targetEdit?.minPrice || 0,
			maxPrice: targetEdit?.maxPrice || 0,
			saleType: targetEdit?.saleType || EnumCategorySaleType.ABSOLUTE,
			saleValue: targetEdit?.salePrice || 0,
			content: targetEdit?.content || "",
			tax: targetEdit?.tax || 0,
			handle: targetEdit?.handle || 0,
			thumbnail: {
				path: targetEdit?.thumbnail?.path || "",
				size: targetEdit?.thumbnail?.size || 0,
			},
			status: targetEdit?.status || EnumSaleStatus.INSTOCK,
			type: targetEdit?.type || EnumCategoryType.KEYBOARD,
			collapseContent: targetEdit?.collapseContent || [],
		} as ICategory,
		validationSchema,
		enableReinitialize: true,
		onSubmit: (values) => {
			if (targetEdit) {
				handleUpdate(values);
			} else {
				handleCreate(values);
			}
		},
	});

	const handleCreate = async (payload: ICategory) => {
		const signal = new AbortController().signal;
		const response = await CategoryClient.postCreateCategory({
			body: payload,
			signal: signal,
		});

		if (response.status === HTTP_STATUS.Ok) {
			NotifyUtils.success("Tạo mới thành công");
			formik.resetForm();
			setOpen(false);
			await refetch();
		} else {
			NotifyUtils.error("Tạo mới thất bại");
		}
	};

	const handleUpdate = async (payload: ICategory) => {
		const signal = new AbortController().signal;
		const response = await CategoryClient.postUpdateCategory({
			body: payload,
			signal: signal,
		});

		if (response.status === HTTP_STATUS.Ok) {
			NotifyUtils.success("Cập nhật thành công");
			formik.resetForm();
			setOpen(false);
			await refetch();
		} else {
			NotifyUtils.error("Cập nhật thất bại");
		}
	};

	const handleEdit = (category: ICategory) => {
		console.log("category", category);
		setTargetEdit(category);
		setOpen(true);
	};

	const handleCloseModal = () => {
		setOpen(false);
		setTargetEdit(null);
	};

	return (
		<>
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold mb-4">Categories</h1>
				<Button variant="contained" onClick={() => setOpen(true)}>
					+ Thêm mới
				</Button>
			</div>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							{tableColumns.map((column) => (
								<TableCell
									key={column.id}
									style={column?.styles}>
									<div className="font-bold">
										{column.label}
									</div>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={3}>Loading...</TableCell>
							</TableRow>
						) : null}
						{categoryList?.map((category) => (
							<TableRow key={category.categoryId}>
								<TableCell>
									<div className="flex flex-col gap-2">
										<div>
											<span className="font-bold">
												ID:
											</span>{" "}
											{category.categoryId}
										</div>
										<div>
											<span className="font-bold">
												Slug:
											</span>{" "}
											{category.slug}
										</div>
										<div></div>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex flex-col gap-2">
										<span>{category.categoryName}</span>
										<Link
											target="_blank"
											href={`/shop/${category.slug}`}
											className="hover:underline">
											<span className="flex gap-2 items-center">
												Shop link
												<ReplyIcon
													className="!w-6 !h-6"
													style={{
														transform: "scaleX(-1)",
													}}
												/>
											</span>
										</Link>
									</div>
								</TableCell>
								<TableCell>{category.description}</TableCell>
								<TableCell>
									<Switch checked={category.isActive} />
									<Chip
										label={
											MapCategoryStatus[
												category.status as EnumSaleStatus
											]?.label
										}
										className={classNames(
											MapCategoryStatus[
												category.status as EnumSaleStatus
											]?.color
										)}
									/>
								</TableCell>
								<TableCell>
									<PriceBlock
										min={category.minPrice}
										max={category.maxPrice}
										handle={category.handle}
										tax={category.tax}
										sale={category.salePrice || 0}
									/>
								</TableCell>
								<TableCell>
									<IconButton
										onClick={() => handleEdit(category)}>
										<Edit />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<CategoryForm
				formik={formik}
				targetEdit={targetEdit}
				open={open}
				onClose={handleCloseModal}
				onSubmit={() => console.log(1)}
			/>
		</>
	);
}

Categories.layout = Admin;

const ExpanCollapse = ({ children }: { children: React.ReactChild }) => {
	const [open, setOpen] = useState(false);
	return (
		<div className="flex flex-col justify-center">
			<Collapse in={open}>{children}</Collapse>
			<IconButton
				className={classNames(
					"p-0 max-w-max mx-auto",
					open ? "rotate-180" : ""
				)}
				onClick={() => setOpen(!open)}>
				<ExpandMoreIcon />
			</IconButton>
		</div>
	);
};

const PriceBlock = ({
	min,
	max,
	sale,
	handle,
	tax,
}: {
	min: number;
	max: number;
	sale: number;
	handle: number;
	tax: number;
}) => {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col">
				<span className="font-bold">Min - Max:</span>{" "}
				{formatCurrency(min)} - {formatCurrency(max)}
			</div>
			{sale ? (
				<div className="flex">
					<span className="font-bold">Sale:</span>&nbsp;
					{formatCurrency(sale)}
				</div>
			) : null}
			{handle ? (
				<div className="flex">
					<span className="font-bold">Handle:</span>&nbsp;
					{handle}%
				</div>
			) : null}
			{tax ? (
				<div className="flex">
					<span className="font-bold">Tax:</span>&nbsp;
					{tax}%
				</div>
			) : null}
		</div>
	);
};

const validationSchema = yup.object({
	categoryName: yup.string().required("Category name is required"),
	description: yup.string().required("Description is required"),
	isActive: yup.boolean().required("Active status is required"),
	minPrice: yup
		.number()
		.required("Minimum price is required")
		.min(0, "Minimum price must be greater than or equal to 0"),
	maxPrice: yup
		.number()
		.required("Maximum price is required")
		.min(
			yup.ref("minPrice"),
			"Maximum price must be greater than or equal to minimum price"
		),
});

const CategoryForm = ({
	open,
	onClose,
	onSubmit,
	targetEdit,
	formik,
}: {
	open: boolean;
	onClose: () => void;
	onSubmit: (values: ICategory) => void;
	targetEdit: ICategory | null;
	formik: any;
}) => {
	const syncImageToFormik = (file: { publicUrl: string; size: number }) => {
		formik.setFieldValue("thumbnail", [
			...(formik.values.thumbnail || []),
			{
				path: file.publicUrl,
				size: file.size,
			},
		]);
		formik.setFieldValue(
			"thumbnail",
			formik.values.thumbnail?.[0] || {
				path: "",
				size: 0,
			}
		);
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			PaperProps={{
				className: "!max-w-[60vw]",
			}}>
			<DialogTitle className="!text-2xl">
				{targetEdit ? "Cập nhật category" : "Tạo mới category"}
			</DialogTitle>
			<form onSubmit={formik.handleSubmit}>
				<DialogContent className="!py-0 px-4">
					<TextField
						fullWidth
						margin="normal"
						id="categoryName"
						name="categoryName"
						label="Tên category"
						value={formik.values.categoryName}
						onChange={formik.handleChange}
						error={
							formik.touched.categoryName &&
							Boolean(formik.errors.categoryName)
						}
						helperText={
							formik.touched.categoryName &&
							formik.errors.categoryName
						}
					/>
					<TextField
						fullWidth
						margin="normal"
						id="description"
						name="description"
						label="Mô tả ngắn"
						value={formik.values.description}
						onChange={formik.handleChange}
						error={
							formik.touched.description &&
							Boolean(formik.errors.description)
						}
						helperText={
							formik.touched.description &&
							formik.errors.description
						}
					/>
					<div className="flex gap-4">
						<div className="relative w-full">
							<TextField
								fullWidth
								margin="normal"
								id="minPrice"
								name="minPrice"
								label="Giá thấp nhất"
								type="number"
								value={formik.values.minPrice}
								onChange={formik.handleChange}
								error={
									formik.touched.minPrice &&
									Boolean(formik.errors.minPrice)
								}
								helperText={
									formik.touched.minPrice &&
									formik.errors.minPrice
								}
							/>
							<span className="absolute -bottom-4 left-1 text-green-600">
								{formatCurrency(formik.values.minPrice)}
							</span>
						</div>
						<div className="relative w-full">
							<TextField
								fullWidth
								margin="normal"
								id="maxPrice"
								name="maxPrice"
								label="Giá cao nhất"
								type="number"
								value={formik.values.maxPrice}
								onChange={formik.handleChange}
								error={
									formik.touched.maxPrice &&
									Boolean(formik.errors.maxPrice)
								}
								helperText={
									formik.touched.maxPrice &&
									formik.errors.maxPrice
								}
							/>
							<span className="absolute -bottom-4 left-0 text-green-600">
								{formatCurrency(formik.values.maxPrice)}
							</span>
						</div>
					</div>
					<SaleTypeSelector formik={formik} />
					<FeesInput formik={formik} />
					<CollapseContentEditor formik={formik} />
					{/* <ConfigQuantity formik={formik} /> */}
					<div className="flex gap-4 mt-4 items-center">
						<div className="flex flex-col mt-2 border max-w-max px-2 relative min-w-[15vw] w-full h-[56px] rounded-[4px]">
							<label className="absolute -top-3 left-2 bg-white px-2 text-xs text-[rgba(0,0,0,0.6)]">
								Trạng thái hiện thị
							</label>
							<div className="flex gap-2 items-center mt-2">
								<Switch
									id="isActive"
									name="isActive"
									checked={formik.values.isActive}
									onChange={formik.handleChange}
								/>
								<label htmlFor="isActive" className="">
									{formik.values.isActive ? "Bật" : "Tắt"}
								</label>
							</div>
						</div>
						<div className="w-full">
							<CategoryTypeSelector formik={formik} />
						</div>
					</div>
					<TextEditor
						id="content"
						label="Nội dung chi tiết"
						value={formik.values.content}
						onChange={(value) =>
							formik.setFieldValue("content", value)
						}
						placeholder="Nội dung chi tiết"
						onBlur={() => formik.setFieldTouched("content", true)}
						errorMessage={
							formik.touched.content ? formik.errors.content : ""
						}
						maxContent={500}
					/>
					<UploadImage
						handleSyncData={syncImageToFormik}
						thumbnailUploaded={[formik.values.thumbnail?.path]}
						label="Ảnh sản phẩm đại diện"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} color="secondary">
						Cancel
					</Button>
					<Button type="submit" color="primary">
						{targetEdit ? "Update" : "Create"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

const SaleTypeSelector = ({ formik }: { formik: any }) => {
	return (
		<div className="flex items-center gap-4 mt-4">
			<TextField
				select
				fullWidth
				margin="normal"
				id="saleType"
				name="saleType"
				label="Loại giảm giá"
				value={formik.values.saleType}
				onChange={(e) => {
					formik.handleChange("saleType")(e);
					formik.setFieldValue("saleValue", 0);
				}}
				SelectProps={{
					native: true,
				}}>
				<option value={EnumCategorySaleType.NONE}>
					Không giảm giá
				</option>
				<option value={EnumCategorySaleType.ABSOLUTE}>
					Giảm trực tiếp vào sản phẩm
				</option>
				<option value={EnumCategorySaleType.PERCENT}>
					Giảm theo phần trăm
				</option>
			</TextField>
			{formik.values.saleType !== EnumCategorySaleType.NONE ? (
				<div className="relative w-full">
					<TextField
						fullWidth
						margin="normal"
						id="saleValue"
						name="saleValue"
						label="Giá trị giảm giá"
						type="number"
						value={formik.values.saleValue}
						onChange={formik.handleChange}
					/>
					<span className="absolute -bottom-4 left-1 text-green-600">
						{formik.values.saleType ===
						EnumCategorySaleType.ABSOLUTE
							? formatCurrency(formik.values.saleValue)
							: formik.values.saleType ===
							  EnumCategorySaleType.PERCENT
							? `${formik.values.saleValue}%`
							: "N/A"}
					</span>
				</div>
			) : null}
		</div>
	);
};

const FeesInput = ({ formik }: { formik: any }) => {
	return (
		<div className="flex gap-4 mt-2">
			<div className="relative w-full">
				<TextField
					fullWidth
					margin="normal"
					id="handle"
					name="handle"
					label="Phí xử lý đơn hàng"
					type="number"
					value={formik.values.handle}
					onChange={formik.handleChange}
					error={
						formik.touched.handle && Boolean(formik.errors.handle)
					}
					helperText={formik.touched.handle && formik.errors.handle}
				/>
				<span className="absolute -bottom-4 left-1 text-green-600">
					{formik.values.handle}%
				</span>
			</div>
			<div className="relative w-full">
				<TextField
					fullWidth
					margin="normal"
					id="tax"
					name="tax"
					label="Thuế"
					type="number"
					value={formik.values.tax}
					onChange={formik.handleChange}
					error={formik.touched.tax && Boolean(formik.errors.tax)}
					helperText={formik.touched.tax && formik.errors.tax}
				/>
				<span className="absolute -bottom-4 left-1 text-green-600">
					{formik.values.tax}%
				</span>
			</div>
		</div>
	);
};

const ConfigQuantity = ({ formik }: { formik: any }) => {
	return (
		<div className="flex gap-4 mt-4">
			<div className="relative w-full">
				<TextField
					fullWidth
					margin="normal"
					id="quantity"
					name="quantity"
					label="Số lượng"
					type="number"
					value={formik.values.quantity ?? 0}
					onChange={formik.handleChange}
					error={
						formik.touched.quantity &&
						Boolean(formik.errors.quantity)
					}
					helperText={
						formik.touched.quantity && formik.errors.quantity
					}
				/>
			</div>
			<div className="relative w-full">
				<TextField
					fullWidth
					margin="normal"
					id="limitPerCustomer"
					name="limitPerCustomer"
					label="Giới hạn mỗi khách hàng"
					type="number"
					value={formik.values.limitPerCustomer ?? 0}
					onChange={formik.handleChange}
					error={
						formik.touched.limitPerCustomer &&
						Boolean(formik.errors.limitPerCustomer)
					}
					helperText={
						formik.touched.limitPerCustomer &&
						formik.errors.limitPerCustomer
					}
				/>
			</div>
		</div>
	);
};

const CategoryTypeSelector = ({ formik }: { formik: any }) => {
	return (
		<TextField
			select
			fullWidth
			margin="normal"
			id="type"
			name="type"
			label="Loại category"
			value={formik.values.type}
			onChange={formik.handleChange}
			SelectProps={{
				native: true,
			}}>
			{Object.entries(RCategoryType)?.map(([key, value]) => (
				<option key={key} value={key}>
					{value}
				</option>
			))}
		</TextField>
	);
};

const CollapseContentEditor = ({ formik }: { formik: any }) => {
	console.log("content collapse", formik.values.collapseContent);
	const addNewEditor = () => {
		const newContent = [...(formik.values.collapseContent || [])];
		newContent.push({ title: "", content: "" });
		formik.setFieldValue("collapseContent", newContent);
	};

	const removeEditor = (index: number) => {
		const newContent = [...(formik.values.collapseContent || [])];
		newContent.splice(index, 1);
		formik.setFieldValue("collapseContent", newContent);
	};

	const onDragEnd = (result: DropResult) => {
		if (!result.destination || typeof result.destination.index !== "number")
			return;

		const items = Array.from(formik.values.collapseContent);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem as number);

		formik.setFieldValue("collapseContent", items);
	};

	return (
		<div className="space-y-4 mt-8">
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="editors">
					{(
						provided: DroppableProvided,
						snapshot: DroppableStateSnapshot
					) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}>
							{formik.values.collapseContent.map(
								(
									item: { title: string; content: string },
									index: number
								) => (
									<Draggable
										key={index}
										draggableId={`editor-${index}`}
										index={index}>
										{(
											provided: DraggableProvided,
											snapshot: DraggableStateSnapshot
										) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												className="relative mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
												<div
													{...provided.dragHandleProps}
													className="absolute top-2 left-2 cursor-move">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round">
														<line
															x1="8"
															y1="6"
															x2="21"
															y2="6"
														/>
														<line
															x1="8"
															y1="12"
															x2="21"
															y2="12"
														/>
														<line
															x1="8"
															y1="18"
															x2="21"
															y2="18"
														/>
														<line
															x1="3"
															y1="6"
															x2="3.01"
															y2="6"
														/>
														<line
															x1="3"
															y1="12"
															x2="3.01"
															y2="12"
														/>
														<line
															x1="3"
															y1="18"
															x2="3.01"
															y2="18"
														/>
													</svg>
												</div>
												<div className="pl-8">
													<TextField
														fullWidth
														margin="normal"
														label="Tiêu đề"
														value={item.title || ""}
														onChange={(e) => {
															const newContent = [
																...(formik
																	.values
																	.collapseContent ||
																	[]),
															];
															newContent[index] =
																{
																	...(typeof newContent[
																		index
																	] ===
																		"object" &&
																	newContent[
																		index
																	] !== null
																		? newContent[
																				index
																		  ]
																		: {
																				title: "",
																				content:
																					"",
																		  }),
																	title: e
																		.target
																		.value,
																};
															formik.setFieldValue(
																"collapseContent",
																newContent
															);
														}}
													/>
													<TextEditor
														value={
															item.content || ""
														}
														onChange={(content) => {
															const newContent = [
																...(formik
																	.values
																	.collapseContent ||
																	[]),
															];
															newContent[index] =
																{
																	...(typeof newContent[
																		index
																	] ===
																		"object" &&
																	newContent[
																		index
																	] !== null
																		? newContent[
																				index
																		  ]
																		: {
																				title: "",
																				content:
																					"",
																		  }),
																	content,
																};
															formik.setFieldValue(
																"collapseContent",
																newContent
															);
														}}
													/>
												</div>
												<IconButton
													className="absolute p-1 -top-3 -right-3 bg-white border !border-black rounded-full text-red-400"
													onClick={() =>
														removeEditor(index)
													}
													size="small">
													<Trash2 />
												</IconButton>
											</div>
										)}
									</Draggable>
								)
							)}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
			<Button
				variant="contained"
				onClick={addNewEditor}
				startIcon={<Plus />}>
				Thêm nội dung
			</Button>
		</div>
	);
};
