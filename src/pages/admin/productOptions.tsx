import NewProductOption from "@/adminComponents/Form/Product/newProductOption";
import { EnumProductOptStatus } from "@/interface/interface";
import Admin from "@/layoutAdmin/Admin";
import { useDeleteProductOptionMutation } from "@/react-query/products/api/useDeleteProductOptionMutation";
import useProductOptionsQuery from "@/react-query/products/api/useProductOptionsQueries";
import { formatCurrency } from "@/utils/FormatNumber";
import {
	Button,
	Paper,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

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
		id: "price",
		label: "Giá sản phẩm",
	},
	{
		id: "belongTo",
		label: "Thuộc sản phẩm",
	},
	{
		id: "isActive",
		label: "Trạng thái - Số lượng",
	},
	// {
	// 	id: "price",
	// 	label: "Giá - Tồn",
	// },
	{
		id: "actions",
		label: "Thao tác",
	},
];

export default function ProductOptions() {
	const [open, setOpen] = useState<boolean>(false);
	const { data: productOptions, isLoading } = useProductOptionsQuery({});
	const deleteProductOptionMutation = useDeleteProductOptionMutation();

	const handleDeleteProduct = (id: string) => {
		deleteProductOptionMutation.mutate({
			payload: {
				productOptionId: id,
			},
		});
	};
	return (
		<>
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold mb-4">Product Option</h1>
				<Button variant="contained" onClick={() => setOpen(true)}>
					+ Tạo mới
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
						{productOptions?.map((product) => (
							<TableRow key={product?.id}>
								<TableCell>
									<div className="flex flex-col gap-2">
										<div>
											<span className="font-bold">
												ID:
											</span>{" "}
											{product?.id}
										</div>
										<div>
											<span className="font-bold">
												Tên SP:
											</span>{" "}
											{product?.name}
										</div>
										<div>
											<span className="font-bold">
												Product Part:
											</span>{" "}
											<span className="bg-gray-600 p-1 rounded-md text-white">
												{product?.productPart}
											</span>
										</div>
										<div>
											<strong>Mô tả:</strong>
											<div
												dangerouslySetInnerHTML={{
													__html: product?.description,
												}}
											/>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex flex-col gap-2">
										{/* <span>{product?.name}</span> */}
										<div>
											<span className="font-bold">
												Giá:
											</span>{" "}
											{formatCurrency(
												product?.price || 0
											)}
										</div>
										<div>
											<span className="font-bold">
												Giá KM:
											</span>{" "}
											<strong className="text-red-500 text-base">
												{formatCurrency(
													product?.salePrice || 0
												)}
											</strong>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex flex-col gap-2">
										{/* <span>{product?.name}</span> */}
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center justify-between">
										<strong className="">Trạng thái</strong>
										<div className="flex items-center justify-center">
											<span>Hết hàng</span>
											<Switch
												checked={
													product?.status ===
													EnumProductOptStatus.INSTOCK
												}
												className="text-center"
											/>
											<span>Còn hàng</span>
										</div>
									</div>
									<div className="flex justify-between items-center">
										<strong>Tồn: </strong>
										<span className="border border-gray-600 px-2 text-xl rounded-sm">
											{product?.quantity}
										</span>
									</div>
								</TableCell>
								<TableCell className="">
									<div className="flex gap-4">
										<Button className="p-0 min-w-5">
											<Edit2 className="!w-5 !h-5" />
										</Button>
										<Button
											className="p-0 min-w-5"
											onClick={() =>
												handleDeleteProduct(
													product?.id as string
												)
											}>
											<Trash2 className="!w-5 !h-5 text-red-400" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<NewProductOption open={open} onClose={() => setOpen(!open)} />
		</>
	);
}

ProductOptions.layout = Admin;
