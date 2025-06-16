import Breadcumb from "@/components/breadcumb";
import FilterSection from "@/components/filter";
import ModalPostProduct from "@/components/sellerComponent/modalPostProduct";
import UsedProductCard from "@/components/usedProductCard";
import { BreadcumbTitle } from "@/constants";
import { IUsedProduct } from "@/interface/interface";
import useUsedProductQuery from "@/react-query/products/api/useUsedProductQueries";
import { Base } from "@/templates/Base";
import { CircularProgress } from "@material-ui/core";
import { Alert } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

const announceDefault =
	"Đây là những sản phẩm đã qua sử dụng. Hình ảnh chi tiết và thông tin được cung cấp bởi người bán. Hãy kiểm tra kỹ trước khi mua hàng. Nếu bạn lo lắng về sản phẩm, hãy liên hệ với chúng tôi để được hỗ trợ.";

const UsedPage: React.FC = () => {
	const [isOpenSellProduct, setOpenSellProduct] = useState(false);
	const router = useRouter();
	const { status } = router.query;

	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
	const { data: usedProductList, isLoading } = useUsedProductQuery({
		status: status as string,
	});

	const toogleSellProduct = () => {
		setOpenSellProduct(!isOpenSellProduct);
	};

	return (
		<Base>
			<div className="mx-w-full py-6 relative z-1">
				<Breadcumb
					mainRoot={
						BreadcumbTitle[
							router.pathname.replace("/", "")
						] as string
					}
				/>
				<Alert className="!shadow-md" severity="info">
					{announceDefault}
				</Alert>
				<article className="flex gap-x-4 mt-4">
					<FilterSection
						isMobileOpen={mobileFiltersOpen}
						setMobileOpen={setMobileFiltersOpen}
						isAllowToSell
						toggleSellProduct={toogleSellProduct}
					/>
					{isLoading ? (
						<div className="flex justify-center items-center w-full h-96">
							<CircularProgress size={32} />
						</div>
					) : null}
					{!isLoading && usedProductList?.length === 0 ? (
						<div className="flex justify-center items-center w-full h-96">
							<div>Không có dữ liệu</div>
						</div>
					) : null}
					{!isLoading &&
					usedProductList &&
					usedProductList?.length > 0 ? (
						<div className="grid gap-x-4 gap-y-4 grid-cols-4 md:grid-cols-3 lg:grid-cols-3 w-full">
							{usedProductList?.map(
								(child: IUsedProduct, index: number) => (
									<UsedProductCard
										usedProduct={child}
										key={index}
									/>
								)
							)}
						</div>
					) : null}
				</article>
				<ModalPostProduct
					open={isOpenSellProduct}
					handleClose={toogleSellProduct}
				/>
			</div>
		</Base>
	);
};

export default UsedPage;
