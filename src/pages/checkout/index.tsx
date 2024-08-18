import GroupRadioButton from "@/GroupRadioButton"
import { getFirst } from "@/client"
import CheckoutClient from "@/client/CheckoutClient"
import CartItemBlock from "@/components/cartItemBlock"
import { VNCity } from "@/components/constants"
import SelectWithIcon from "@/components/selectWIcon"
import { BillingAddress, CountryFlag, PaymentMethod, ShippingMethod } from "@/constants"
import { useAuth } from "@/context/Auth"
import { Base } from "@/templates/Base"
import { formatCurrency } from "@/utils/FormatNumber"
import NotifyUtils from "@/utils/NotifyUtils"
import useCart from "@/zustand/useCart"
import { Box, Button, FormGroup, FormHelperText, TextField } from "@material-ui/core"
import { Field, Form, Formik } from "formik"
import { useRouter } from "next/router"
import { useState } from "react"
import * as Yup from 'yup'
import styles from './styles.module.css'

const CheckoutPage = () => {
  const { cart } = useCart()
  const { user }: any = useAuth()
  const router = useRouter()

  const [inProgress, toggleProgress] = useState(false)

  const CheckoutSchema = Yup.object().shape({
      email: user?.email ? Yup.string() : Yup.string().email('Có vẻ sai định dạng rồi ạ').required('Vui lòng nhập địa chỉ email'),
      firstName: Yup.string().required('Vui lòng nhập họ'),
      lastName: Yup.string().required('Vui lòng nhập tên'),
      company: Yup.string(),
      address: Yup.string().required('Vui lòng nhập địa chỉ'),
      apartment: Yup.string(),
      province: Yup.string().required('Vui lòng nhập Huyện/Xã'),
      postCode: Yup.string().required('Vui lòng nhập mã bưu cục'),
      phoneNumber: Yup.string().required('Vui lòng nhập số điện thoại'),
      deliveryMethod: Yup.string(),
      paymentMethod: Yup.string(),
      billingAddress: Yup.string().required('Vui lòng chọn địa chỉ thanh toán'),
    //   billing: Yup.object().shape({
    //     firstName: Yup.string().required('Vui lòng nhập họ'),
    //     lastName: Yup.string().required('Vui lòng nhập tên'),
    //     company: Yup.string(),
    //     address: Yup.string().required('Vui lòng nhập địa chỉ'),
    //     apartment: Yup.string(),
    //     city: Yup.string(),
    //     province: Yup.string().required('Vui lòng nhập thành phố'),
    //     postCode: Yup.string().required('Vui lòng nhập mã bưu cục'),
    //     phoneNumber: Yup.string().required('Vui lòng nhập số điện thoại'),
    // })
  }) 

  const handleCheckout = async (formData: {
    email: string;
    firstName: string;
    lastName: string;
    company: string;
    address: string;
    apartment: string;
    city: {
      code: string
      isDelete: boolean
      name: string
      name_with_type: string
      slug: string
      type: string
    };
    province: string;
    postCode: string;
    phoneNumber: string;
    deliveryMethod: string;
    paymentMethod: string;
    billingAddress: string;
    country: string;
  }) => {
    let formatFormData = {
      ...cart,
      customerId: user?.customerId,
      orderInfo: {
        ...formData,
        city: formData?.city?.code
      }
    }

    console.log(formatFormData)
    toggleProgress(true)
    const respCheckout = await CheckoutClient.postCheckout(formatFormData)
    console.log("respCheckout", respCheckout)
    if (respCheckout.status === 'OK') {
      console.log("orderId", getFirst(respCheckout))
      const { orderId } = getFirst(respCheckout)
      NotifyUtils.success("Đặt hàng thành công !")
      setTimeout(() => {
        router.push({
          pathname: `/thankyou/${orderId}`,
        })
      }, 1000)
    } else {
      NotifyUtils.error(respCheckout.message || "Có lỗi xảy ra, vui lòng thử lại sau")
      toggleProgress(false)
    }
  }

  return (
    <Base isLoading={inProgress}>
      <div className="mx-w-full p-6 sm:py-6 relative z-1">
        <div className="grid grid-cols-5 divide-x-2">
          <div className="px-4 py-12 col-span-3">
              <Formik
                  initialValues={{
                      email: user?.email || "",
                      firstName: "",
                      lastName: "",
                      company: "",
                      address: "",
                      apartment: "",
                      city: {
                        code: VNCity[0]?.code || "",
                        isDelete: VNCity[0]?.isDeleted || false,
                        name: VNCity[0]?.name || "",
                        name_with_type: VNCity[0]?.name_with_type || "",
                        slug: VNCity[0]?.slug || "",
                        type: VNCity[0]?.type || "",
                      },
                      province: "",
                      postCode: "",
                      phoneNumber: "",
                      deliveryMethod: ShippingMethod[0]?.value || "",
                      paymentMethod: PaymentMethod[0]?.value || "",
                      billingAddress: BillingAddress[0]?.value || "",
                      country: CountryFlag[0]?.value || "",
                      // billing: {
                      //     firstName: "",
                      //     lastName: "",
                      //     company: "",
                      //     address: "",
                      //     apartment: "",
                      //     city: "",
                      //     province: "",
                      //     postCode: "",
                      //     phoneNumber: "",
                      // }
                  }}
                  validationSchema={CheckoutSchema}
                  onSubmit={(values) => {
                      console.log("values", values)
                      handleCheckout(values)
                  }}
                  enableReinitialize
              >
                  {({errors, touched, setFieldValue, values}) => (
                    <Form className="mx-auto flex flex-col max-w-3xl gap-2">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Thông tin liên hệ</h2>
                        {
                          !user ? (
                            <span className="text-gray-600">Đã có tài khoản? <a href="/account/login" className="underline text-black">Đăng nhập</a></span> 
                          ) : null
                        }
                      </div>
                      <FormGroup>
                        <Field value={user?.email} disabled={user?.email} name="email" type="email" placeholder="Email" className="h-12 rounded-sm border border-gray-400 px-4 py-2 disabled:bg-gray-300" />
                        <FormHelperText className="text-red-500">{errors?.email as string}</FormHelperText>
                      </FormGroup>
                      {/* <SampleCheckbox label="Nhận thông tin khuyến mãi vào email này" /> */}
                      <h2 className="text-2xl font-bold">Địa chỉ giao hàng</h2>
                      <div>
                          <label>Quốc gia</label>
                          <SelectWithIcon selectList={CountryFlag} name="country" setFieldValue={setFieldValue} />
                      </div>
                      <div className="flex gap-4">
                          <div className="flex flex-col w-1/2">
                            <FormGroup>
                              <label>Họ</label>
                              <Field name="firstName" type="text" placeholder="Họ" className="h-12 rounded-sm border border-gray-400 px-4 py-2" />
                              <FormHelperText className="text-red-500">{errors?.firstName}</FormHelperText>
                            </FormGroup>
                          </div>
                          <div className="flex flex-col w-1/2">
                            <FormGroup>
                              <label>Tên</label>
                              <Field name="lastName" type="text" placeholder="Tên" className="h-12 rounded-sm border border-gray-400 px-4 py-2" />
                              <FormHelperText className="text-red-500">{errors?.lastName}</FormHelperText>
                            </FormGroup>
                          </div>
                      </div>
                      <div className="flex flex-col w-full">
                        <FormGroup>
                          <label>Công ty</label>
                          <Field name="company" type="text" placeholder="Công ty (không bắt buộc)" className="h-12 rounded-sm border border-gray-400 px-4 py-2" />
                        </FormGroup>
                      </div>
                      <div className="flex flex-col w-full">
                        <FormGroup>
                          <label>Địa chỉ</label>
                          <Field name="address" type="text" placeholder="Địa chỉ" className="h-12 rounded-sm border border-gray-400 px-4 py-2" />
                          <FormHelperText className="text-red-500">{errors?.address}</FormHelperText>
                        </FormGroup>
                      </div>
                      <div className="flex flex-col w-full">
                        <FormGroup>
                          <label>Chung cư, căn hộ, etc. </label>
                          <Field name="apartment" type="text" placeholder="Chung cư, căn hộ, etc. (không bắt buộc)" className="h-12 rounded-sm border border-gray-400 px-4 py-2" />
                        </FormGroup>
                      </div>
                      <div className="flex gap-4">
                          <div className="flex flex-col w-1/3">
                              <label>Thành phố</label>
                              <SelectWithIcon selectList={VNCity} isIcon={false} name="city" setFieldValue={setFieldValue} />
                          </div>
                          <div className="flex flex-col w-1/3">
                            <FormGroup>
                              <label>Quận/Huyện</label>
                              <Field name="province" type="text" placeholder="Quận/Huyện" className="h-12 rounded-sm border border-gray-400 px-4 py-2" />
                              <FormHelperText className="text-red-500">{errors?.province}</FormHelperText>
                            </FormGroup>
                          </div>
                          <div className="flex flex-col w-1/3">
                            <FormGroup>
                              <label>Mã bưu cục</label>
                              <Field name="postCode" type="text" placeholder="Mã bưu cục" className="h-12 rounded-sm border border-gray-400 px-4 py-2" />
                              <FormHelperText className="text-red-500">{errors?.postCode}</FormHelperText>
                            </FormGroup>
                          </div>
                      </div>
                      <div className="flex flex-col w-full">
                        <FormGroup>
                          <label>Số điện thoại</label>
                          <Field name="phoneNumber" type="text" placeholder="Số điện thoại" className="h-12 rounded-sm border border-gray-400 px-4 py-2" />
                          <FormHelperText className="text-red-500">{errors?.phoneNumber}</FormHelperText>
                        </FormGroup>
                      </div>
                      <div className="h-6" />
                      <GroupRadioButton 
                        options={ShippingMethod} 
                        title="Hình thức vận chuyển" 
                        value={values.deliveryMethod} 
                        handleChangeValue={(e) => setFieldValue("deliveryMethod", e.target.value)} name="deliveryMethod"  
                        isBorder 
                        subTitle="Delivery times below are carrier estimates only and do not include our order processing time (1-3 business days). NOTE: Standard shipping methods such as USPS Priority Mail, USPS First Class Mail, UPS Surepost, and UPS Ground are subject to delays and not recommended for time sensitive deliveries."
                      />
                      <GroupRadioButton 
                        options={PaymentMethod} 
                        title="Phương thức thanh toán" 
                        value={values.paymentMethod} 
                        handleChangeValue={(e) => setFieldValue("paymentMethod", e.target.value)} 
                        isBorder 
                        name="paymentMethod"
                      />
                      <GroupRadioButton 
                        options={BillingAddress} 
                        title="Địa chỉ thanh toán" 
                        value={values.billingAddress} 
                        handleChangeValue={(e) => setFieldValue("billingAddress", e.target.value)} 
                        isBorder 
                        name="billingAddress"
                      />
                      <button className="w-full bg-red-500 p-4 rounded-md text-white text-xl font-bold mt-6">Đặt hàng</button>
                    </Form>
                  )}
              </Formik>
          
          </div>
          <div className="h-full px-4 py-12 col-span-2">
            <Box position="sticky" top="10rem">
            {
              cart?.products.map((item) => (
                <CartItemBlock cartItem={item} key={item.id} />
              ))
            }
            <ApplyPromoBlock />
            <BillInfo />
            </Box>
          </div>
        </div>
      </div>
    </Base>
  )
}

export default CheckoutPage

const ApplyPromoBlock = () => {
  const [code, setCode] = useState("")
  const [error, setError] = useState({
    status: true,
    message: ""
  })
  const handleApplyPromo = () => {
    if (code && code !== '') {
      setError({
        status: false,
        message: "Mã giảm giá hoặc thẻ quả tặng không tồn tại"
      })
    } else {
      setError({
        status: true,
        message: ""
      })
    }

  }
  return (
    <Box display="flex" gridGap={8} alignItems="center">
      <TextField 
        variant="outlined" 
        size="small" 
        fullWidth
        placeholder="Mã giảm giá hoặc thẻ quà tặng"
        className={`${styles.applyVoucherInput}`}
        onChange={(e) => setCode(e.target.value)}
        error={!error.status}
        helperText={error.message}
      />
      <Button className="rounded-md border-2 border-white border-solid flex-1 min-w-28 min-h-14 bg-red-500 hover:bg-red-400" onClick={handleApplyPromo}>
       <span className="normal-case text-white"> Áp dụng</span>
      </Button>
    </Box>
  )
}

const BillInfo = () => {
  const { cart }:any = useCart()
  const finalPrice = cart?.totalPrice + (cart?.fee?.shipping || 0) - 0
  return (
    <div className="flex flex-col gap-2 mt-6">
      <div className="flex justify-between">
        <span>Tạm tính</span>
        <span>{formatCurrency(cart?.totalPrice)}</span>
      </div>
      <div className="flex justify-between">
        <span>Phí vận chuyển</span>
        <span>{formatCurrency(cart?.fee?.shipping || 0)}</span>
      </div>
      {
        false ? (
          <div className="flex justify-between">
            <span>Giảm giá</span>
            <span>{formatCurrency(0)}</span>
          </div>
        ) : null
      }
      <div className="flex justify-between">
        <span className="text-lg font-bold">Tổng cộng</span>
        <span className="text-lg font-bold">{formatCurrency(finalPrice || 0)}</span>
      </div>
    </div>
  )
}