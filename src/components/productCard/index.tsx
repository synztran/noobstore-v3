import { useAuth } from "@/context/Auth";
import useQueryData from "@/hook/useQueries";
import { Category, EnumProductType, IOption, Product } from "@/interface";
import { classNames } from "@/utils/AppConfig";
import { formatCurrency } from "@/utils/FormatNumber";
import NotifyUtils from "@/utils/NotifyUtils";
import { useCartAction } from "@/zustand/useCart";
import { useDialogLoginAction } from "@/zustand/useDialogLogin";
import useStoreProductDetail from "@/zustand/useProductDetail";
import { Button, CircularProgress } from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InputQuantity from "../InputQuatity";
import ItemSelectGroupBlock from "../ItemSelectGroupBlock";
import SliderSyncing from "../SliderSyncing";
import CollapseText from "../collapse";
import RatingComponent from "./rating";
import styles from './styles.module.css';

const fakeProduct = {
	name: "Basic Tee 6-Pack",
	price: "$192",
	href: "#",
	breadcrumbs: [
		{ id: 1, name: "Men", href: "#" },
		{ id: 2, name: "Clothing", href: "#" },
	],
	images: [
		{
			src: "https://tailwindui.com/img/ecommerce-images/product-page-02-secondary-product-shot.jpg",
			alt: "Two each of gray, white, and black shirts laying flat.",
			id: 0,
		},
		{
			src: "https://tailwindui.com/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg",
			alt: "Model wearing plain black basic tee.",
			id: 1,
		},
		{
			src: "https://tailwindui.com/img/ecommerce-images/product-page-02-tertiary-product-shot-02.jpg",
			alt: "Model wearing plain gray basic tee.",
			id: 2,
		},
		{
			src: "https://tailwindui.com/img/ecommerce-images/product-page-02-featured-product-shot.jpg",
			alt: "Model wearing plain white basic tee.",
			id: 3,
		},
	],
	colors: [
		{ name: "White", class: "bg-white", selectedClass: "ring-gray-400" },
		{ name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
		{ name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
	],
	sizes: [
		{ name: "XXS", inStock: false },
		{ name: "XS", inStock: true },
		{ name: "S", inStock: true },
		{ name: "M", inStock: true },
		{ name: "L", inStock: true },
		{ name: "XL", inStock: true },
		{ name: "2XL", inStock: true },
		{ name: "3XL", inStock: true },
	],
	description:
		'The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.',
	highlights: [
		"Hand cut and sewn locally",
		"Dyed with our proprietary colors",
		"Pre-washed & pre-shrunk",
		"Ultra-soft 100% cotton",
	],
	details:
		'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
};
const reviews = { href: "#", average: 4, totalCount: 117 };

interface Props {
	category: Category;
	products: Product[];
}

const ProductCard = ({ category, products }: Props) => {
	const router = useRouter();
	const { addToCart } = useCartAction();
	const { user }: any = useAuth(); 
	const { pic_list, collapse_content, category_id } = category || {}
	const [selectedOpt, setSelectedOpt] = useState<IOption>({
		index: '',
		label: '',
		value: '',
		quantity: 0,
		productType: EnumProductType.ETC,
		price: 0,
		productName: '',
		productId: '',
		sellerName: ''
	});

	const [itemsOptions, setItemsOptions] = useState<IOption[]>([]);
	const [triggerResetQuantity, toggleResetQuantity] = useState(0);
	const { currentQuantity } = useStoreProductDetail()
	const [loadingAddToCart, setLoadingAddToCart] = useState(false);
	const {toggleDialogLogin} = useDialogLoginAction();
	const { cartQuery } = useQueryData();


	const handleAddToCart = async (product: any) => {
		try {
			setLoadingAddToCart(true)
			const cartBody = {
				productId: product.productId,
				productName: product.productName,
				type: product.type,
				sellerName: category.author,
				quantity: currentQuantity,
				price: product.price,
				page: router.pathname,
				cartId: user?.cartId,
				categoryId: category.category_id
			}
			const resp = await addToCart(cartBody)
			console.log(resp)
			if (resp.status === 'OK') {
				NotifyUtils.success('Sản phẩm đã được thêm vào giỏ hàng');
				cartQuery.refetch();
			} else {
				switch(resp.code) {
					case 404: {
						NotifyUtils.error('Vui lòng đăng nhập để mua hàng');
						toggleDialogLogin(true);
						break;
					}
					default: {
						NotifyUtils.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
						break;
					}
				}
			}
			setLoadingAddToCart(false)
		} catch(err) {
			console.log(err)
		}
	}

	useEffect(()	=> {
		if (products) {
			const options = products.map((product) => {
				return {
					index: product.product_id,
					label: product.product_name,
					value: product.product_id,
					quantity: product.quantity,
					productType: product.product_part,
					price: product.price,
					productName: product.product_name,
					productId: product.product_id,
					sellerName: category.author
				}
			})

			setItemsOptions(options)
		}
	}, [products])

	return (
		<div className="">
			<div className="grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-3 pt-6">
				{/* Image gallery */}
				<div className="mb-auto max-w-2xl sm:px-6 lg:max-w-full lg:col-span-2 lg:gap-x-8 lg:px-8">
					<div className="lg:grid lg:grid-cols-1 lg:gap-y-8">
						<SliderSyncing imageList={pic_list?.map((pic) => ({
							src: pic.url,
							alt: "",
							id: pic.id
						}))} />
					</div>
				</div>

				{/* Product info */}
				<div className="mx-auto max-w-full p-4 lg:col-span-1 lg:border lg:border-gray-400 lg:bg-white rounded-md">
					<div className="mb-4">
						<h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
							{category?.category_name}
						</h1>
						<p className="uppercase text-sm text-gray-600" style={{letterSpacing: '1px'}}>{category?.description}</p>
						<p className="text-xl tracking-tight text-black font-bold mt-2">
							{
								selectedOpt?.index === '' ? (
									<>{formatCurrency(category?.min_price)} - {formatCurrency(category?.max_price)}</>
								) : (
									formatCurrency(selectedOpt?.price)
								)
							}
						</p>
					</div>
					{/* Options */}
					<div className="mt-4 lg:row-span-1 lg:mt-0">
						<RatingComponent star={3}	reviewer={3} readonly /> 
						<ItemSelectGroupBlock options={itemsOptions} setSelectedOpt={setSelectedOpt} toggleResetQuantity={toggleResetQuantity} />
						{
							selectedOpt?.quantity > 0 ? (
								<InputQuantity triggerResetQuantity={triggerResetQuantity} />
							) : null
						}
						<div className="mt-4 flex flex-col gap-4">
							{
								selectedOpt?.quantity === 0 ? (
									<div className="flex items-center gap-2 font-bold uppercase">
										<span className={classNames("block relative rounded-2xl w-2 h-2 bg-red-400")} />
										Sản phẩm hết hàng
									</div>
								) : (
									<div className="flex items-center gap-2 font-bold uppercase">
										<span className={classNames("block relative rounded-2xl w-2 h-2 bg-green-400",styles.pulseIn || '')} />
										Sản phẩm còn hàng
									</div>
								)
							}
							<Button
								className={classNames(
									"flex w-full items-center justify-center rounded-md border-2 border-solid border-red-400 bg-transparent px-8 py-3 text-base font-medium text-red-400 focus:ring-2 disabled:opacity-50", 
									selectedOpt?.index === '' ? "cursor-not-allowed opacity-50 select-none pointer-events-none" : "",
									selectedOpt?.quantity === 0 ? "cursor-not-allowed opacity-50 select-none pointer-events-none" : "",
								)}
								onClick={() => handleAddToCart(selectedOpt)}
								disabled={loadingAddToCart}	
							>
								{
									loadingAddToCart ? (
										<CircularProgress size={24} style={{color: 'rgb(248 113 113)'}} />
									) : (
										<span className="text-red-400 font-bold flex items-center gap-2 text-sm" style={{letterSpacing: '1px'}}>
											Thêm vào giỏ hàng 
											{
												selectedOpt?.price > 0 ? (
													<>
														<span className="block relative rounded-2xl w-2 h-2 bg-red-400" />
														{formatCurrency(selectedOpt?.price * currentQuantity) ?? ''}
													</>
												)	: null
											}
										</span>
									)
								}
							</Button>
						</div>
					</div>

					<div className="lg:col-span-2 lg:col-start-1 mt-2">
						<div>
							<h3 className="sr-only">Description</h3>
						</div>
						{/* <div className="mt-4">
							<CollapseText
								title="Highlights"
								content={
									<div>
										<ul
											role="list"
											className="list-disc space-y-2 pl-4 text-sm">
											{fakeProduct.highlights.map(
												(highlight) => (
													<li
														key={highlight}
														className="text-gray-400">
														<span className="text-gray-600">
															{highlight}
														</span>
													</li>
												)
											)}
										</ul>
									</div>
								}
							/>
						</div> */}
						{
							collapse_content ? (
								<div>
									{
										collapse_content?.map(({content, title}, idx) => (
											<CollapseText
												key={idx}
												title={title}
												content={content}
											/>
										))
									}
								</div>
							) : null
						}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
