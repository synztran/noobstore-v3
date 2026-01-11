import {
  EnumProductType,
  ICategory,
  ICollapseContent,
  IProduct,
  IProductOption,
} from "@/interface/interface";
import { useAddToCartMutation } from "@/react-query/cart/api/useAddToCartMutation";
import { classNames } from "@/utils/AppConfig";
import { formatCurrency } from "@/utils/FormatNumber";
import useStoreProductDetail, {
  useStoreProductDetailAction,
} from "@/zustand/useProductDetail";
import { Box, CircularProgress } from "@mui/material";
import { Button } from "@/components/ReUIComponent/Button";
import { Dispatch, SetStateAction, useMemo } from "react";
import CollapseText from "../collapse";
import InputQuantity from "../InputQuatity";
import ItemSelectGroupBlock from "../ItemSelectGroupBlock";
import RatingComponent from "../productCard/rating";
import styles from "./styles.module.css";
import ProductReviews from "../ProductReviews";

interface Props {
  products: IProduct[];
  category: ICategory;
  productOptions: Record<EnumProductType, IProductOption[]>;
  selectedOpt: Record<EnumProductType, IProductOption[]>;
  setSelectedOpt: Dispatch<
    SetStateAction<Record<EnumProductType, IProductOption[]>>
  >;
}

export default function ProductInfoBlock({
  products,
  category,
  productOptions,
  selectedOpt,
  setSelectedOpt,
}: Props) {
  const { currentQuantity, triggerResetQuantity } = useStoreProductDetail();
  const { toggleResetQuantity } = useStoreProductDetailAction();
  const handleAddToCart = useAddToCartMutation();
  const { collapseContent, rating } = category || {};

  // sum of basePrice and selectedOption price
  const totalPriceCurrentOpt = useMemo(() => {
    const basePrice = products?.reduce((acc, product) => {
      return acc + (product.salePrice || product.basePrice || 0);
    }, 0);

    const selectedPrice = selectedOpt
      ? Object.values(selectedOpt)?.reduce((acc, options) => {
          return (
            acc +
            options.reduce((optAcc, option) => optAcc + (option.price || 0), 0)
          );
        }, 0)
      : 0;

    return basePrice + selectedPrice;
  }, [products, selectedOpt]);

  const maxQuantityCurrentOpt = useMemo(() => {
    const totalProduct = products && products?.length; // total product in category
    const quantityAllProductOpt =
      selectedOpt &&
      Object.entries(selectedOpt)?.map(([_, option]) => {
        const dataOption = option?.[0];
        return dataOption?.quantity || undefined;
      });

    if (totalProduct === quantityAllProductOpt?.length) {
      return Math.min(
        ...quantityAllProductOpt?.filter(
          (item): item is number => item !== undefined
        )
      );
    }

    return null;
  }, [selectedOpt, products]);

  const productsWithSelectedOpt: IProductOption[] = useMemo(() => {
    if (
      Object.keys(selectedOpt)?.length === 0 ||
      Object.keys(selectedOpt)?.length < products?.length
    )
      return [];

    return (
      products.map((product) => ({
        productId: product.productId,
        productName: product.productName,
        replaceProductName: product?.replaceProductName,
        price: product?.salePrice || product?.basePrice,
        categoryId: product?.categoryId,
        productPart: product?.productPart,
        productOptions: selectedOpt?.[product?.productPart] || [],
        quantity: currentQuantity || 0,
      })) || []
    );
  }, [selectedOpt, products, currentQuantity]);

  console.log("productOptions", productOptions);
  console.log("totalPriceCurrentOpt", totalPriceCurrentOpt);
  console.log("selectedOpt", selectedOpt);

  return (
    <>
      <div className="relative mt-2">
        <span className="text-[22px] font-bold tracking-tight text-gray-900">
          {category?.categoryName}
        </span>
        <div className="flex items-center gap-2">
          <RatingComponent
            star={rating?.star || 0}
            reviewer={rating?.rateMessages?.length || 0}
            readonly
            isShowComment={false}
          />
          <div className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
            <span>Hồ Chí Minh, Việt Nam</span>
          </div>
        </div>
        {/* <p
					className="uppercase text-sm text-gray-600"
					style={{ letterSpacing: "1px" }}>
					{category?.description}
				</p> */}
        <p className="text-2xl tracking-tight font-bold mt-2 text-[#ec97b2]">
          {totalPriceCurrentOpt > 0
            ? formatCurrency(totalPriceCurrentOpt)
            : `${formatCurrency(category.minPrice)} ${
                category.maxPrice > 0
                  ? `- ${formatCurrency(category.maxPrice)}`
                  : ""
              }`}
        </p>
      </div>
      {/* Options */}
      <div className="mt-2 lg:row-span-1 lg:mt-0 flex flex-col gap-4">
        {products &&
          products?.map((product) => (
            <ItemSelectGroupBlock
              key={product.productId}
              product={product}
              productOptions={productOptions[product.productPart]}
              selectedOpt={selectedOpt}
              setSelectedOpt={setSelectedOpt}
              toggleResetQuantity={toggleResetQuantity}
            />
          ))}
        <Box
          className="flex items-center gap-2 mt-4"
          visibility={maxQuantityCurrentOpt != null ? "visible" : "hidden"}
        >
          <InputQuantity
            triggerResetQuantity={triggerResetQuantity}
            maxQuantity={maxQuantityCurrentOpt || 0}
          />
          {maxQuantityCurrentOpt && maxQuantityCurrentOpt < 10 ? (
            <span className="text-sm text-gray-600">
              Còn lại {maxQuantityCurrentOpt} sản phẩm
            </span>
          ) : null}
        </Box>
        <div className="mt-4 flex flex-col gap-4">
          <div>
            {Object.keys(selectedOpt)?.length > 0 ? (
              <>
                {maxQuantityCurrentOpt === 0 ? (
                  <div className="flex items-center gap-2 font-bold uppercase">
                    <span
                      className={classNames(
                        "block relative rounded-2xl w-2 h-2 bg-red-400"
                      )}
                    />
                    Sản phẩm hết hàng
                  </div>
                ) : (
                  <div className="flex items-center gap-2 font-bold uppercase">
                    <span
                      className={classNames(
                        "block relative rounded-2xl w-2 h-2 bg-green-400",
                        styles.pulseIn || ""
                      )}
                    />
                    Sản phẩm còn hàng
                  </div>
                )}
              </>
            ) : null}
          </div>
          <Button
            className={classNames(
              "flex w-full items-center justify-center rounded-md border-2 border-solid border-red-400 bg-transparent px-auto py-3 text-base font-medium text-red-400 focus:ring-2 disabled:opacity-[0.5]",
              maxQuantityCurrentOpt === null
                ? "cursor-not-allowed opacity-50 select-none pointer-events-none"
                : "",
              maxQuantityCurrentOpt === 0
                ? "cursor-not-allowed opacity-50 select-none pointer-events-none"
                : ""
            )}
            onClick={() =>
              handleAddToCart.mutate({
                payload: {
                  products: productsWithSelectedOpt || [],
                },
              })
            }
            disabled={
              handleAddToCart.isPending ||
              productsWithSelectedOpt?.length < products?.length
            }
          >
            {handleAddToCart.isPending ? (
              <CircularProgress
                size={24}
                style={{ color: "rgb(248 113 113)" }}
              />
            ) : (
              <span
                className="text-red-400 font-bold flex items-center gap-2 text-sm max-md:flex-col max-md:gap-0"
                style={{ letterSpacing: "1px" }}
              >
                {productsWithSelectedOpt?.length < products?.length ? (
                  <span>Vui lòng chọn option</span>
                ) : (
                  <>
                    Thêm vào giỏ hàng
                    {totalPriceCurrentOpt > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="block relative rounded-2xl w-2 h-2 bg-red-400" />
                        {formatCurrency(
                          totalPriceCurrentOpt * currentQuantity
                        ) ?? ""}
                      </div>
                    ) : null}
                  </>
                )}
              </span>
            )}
          </Button>
        </div>
      </div>
      <div className="lg:col-span-2 lg:col-start-1 mt-2">
        <div>
          <h3 className="sr-only">Description</h3>
        </div>
        <CollapseContents collapseContent={collapseContent || []} />
      </div>
    </>
  );
}

export function CollapseContents({
  collapseContent,
}: {
  collapseContent: ICollapseContent[];
}) {
  if (!collapseContent || collapseContent.length === 0) return null;
  return (
    <div className="lg:col-span-2 lg:col-start-1 mt-2">
      <div>
        <h3 className="sr-only">Description</h3>
      </div>
      {collapseContent ? (
        <>
          {collapseContent?.map(({ content, title }, idx) => (
            <CollapseText
              key={idx}
              title={title}
              content={content}
              id={`collapse-${idx}`}
            />
          ))}
        </>
      ) : null}
    </div>
  );
}
