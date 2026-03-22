import { getFirst } from '@/client'
import { Button, Checkbox } from '@/components/ReUIComponent'
import SelectWithIcon from '@/components/selectWIcon'
import { BillingAddress, CountryFlag, PaymentMethod, ShippingMethod, VNCity } from '@/constants'
import { NEW_MISSING_IMAGE } from '@/constants/Images'
import { useAuth } from '@/context/Auth'
import { IDataPostCheckout } from '@/interface/Client/Checkout'
import { IResponse } from '@/interface/Client/interface'
import { IOrderProduct } from '@/interface/Client/Order'
import { cn } from '@/lib/utils'
import useCartQuery from '@/react-query/cart/api/useCartQueries'
import { useCheckoutMutation } from '@/react-query/order/api/useCheckoutMutation'
import { Base } from '@/templates/Base'
import { formatCurrency } from '@/utils/FormatNumber'
import { Field, Form, Formik, FormikErrors } from 'formik'
import { ArrowRight, Building2, ChevronRight, CreditCard, Lock, Wallet } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import * as Yup from 'yup'

// ============ TYPES ============
interface CheckoutFormValues {
  email: string
  firstName: string
  lastName: string
  company: string
  address: string
  apartment: string
  city: { code: string; isDelete: boolean; name: string; name_with_type: string; slug: string; type: string }
  province: string
  postCode: string
  phoneNumber: string
  deliveryMethod: string
  paymentMethod: string
  billingAddress: string
  country: string
}

interface ShippingMethodType {
  id: number
  name: string
  value: string
  price: number
  textRight?: string
}

// ============ CONSTANTS ============
const DELIVERY_NOTE = 'Thời gian giao hàng dưới đây chỉ là ước tính của hãng vận chuyển và không bao gồm thời gian xử lý đơn hàng của chúng tôi (1-3 ngày làm việc).'

const PaymentIcons: Record<string, React.ReactNode> = {
  CASH_ON_DELIVERY: <CreditCard className="w-6 h-6" />,
  MOMO: <span className="font-bold text-[10px] tracking-tighter">MoMo</span>,
  ATM: <Building2 className="w-5 h-5" />,
  BANK_TRANSFER: <Building2 className="w-5 h-5" />,
  ZALO_PAY: <span className="font-bold text-[10px] tracking-tighter">Zalo</span>,
  PAYPAL: <span className="font-bold italic text-lg">PP</span>,
}

const PaymentBgColors: Record<string, string> = {
  CASH_ON_DELIVERY: 'bg-white text-slate-900',
  MOMO: 'bg-[#A50064] text-white',
  ATM: 'bg-white text-slate-900',
  BANK_TRANSFER: 'bg-white text-slate-900',
  ZALO_PAY: 'bg-[#0068FF] text-white',
  PAYPAL: 'bg-white text-[#003087]',
}

// ============ REUSABLE COMPONENTS ============

// Section Header with numbered badge
interface SectionHeaderProps {
  step: number
  title: string
  rightElement?: React.ReactNode
}

const SectionHeader = ({ step, title, rightElement }: SectionHeaderProps) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-bold flex items-center gap-3 text-slate-900">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">{step}</span>
      {title}
    </h2>
    {rightElement}
  </div>
)

// Form Field with label and error
interface FormFieldProps {
  name: string
  label: string
  placeholder?: string
  type?: string
  required?: boolean
  disabled?: boolean
  value?: string
  error?: string
  className?: string
}

const FormField = ({ name, label, placeholder, type = 'text', required, disabled, value, error, className }: FormFieldProps) => (
  <label className={cn('flex flex-col gap-1.5', className)}>
    <span className="text-sm font-medium text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </span>
    <Field name={name} type={type} placeholder={placeholder} disabled={disabled} value={value} className="w-full rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary px-4 py-3 placeholder:text-slate-400 disabled:bg-slate-200" />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </label>
)

// Section Card wrapper
const SectionCard = ({ children, className }: { children: React.ReactNode; className?: string }) => <section className={cn('bg-white rounded-xl p-6 shadow-sm border border-slate-100', className)}>{children}</section>

// ============ SECTION COMPONENTS ============

// Shipping Address Section
interface ShippingAddressSectionProps {
  user: { email: string } | null
  values: CheckoutFormValues
  errors: FormikErrors<CheckoutFormValues>
  setFieldValue: (field: string, value: unknown) => void
  validCity: Array<{ code: string; isDeleted: boolean; name: string; nameWithType: string; slug: string; type: string }>
  saveInfo: boolean
  onSaveInfoChange: (checked: boolean) => void
}

const ShippingAddressSection = ({ user, values, errors, setFieldValue, validCity, saveInfo, onSaveInfoChange }: ShippingAddressSectionProps) => (
  <SectionCard>
    <SectionHeader
      step={1}
      title="Địa chỉ giao hàng"
      rightElement={
        !user && (
          <span className="text-sm text-slate-500">
            Đã có tài khoản?{' '}
            <a href="/account/login" className="text-primary font-medium hover:underline">
              Đăng nhập
            </a>
          </span>
        )
      }
    />

    {/* Email */}
    <div className="mb-4">
      <FormField name="email" label="Email" placeholder="email@example.com" type="email" disabled={!!user?.email} value={user?.email || values.email} error={errors?.email} />
    </div>

    {/* First Name / Last Name */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <FormField name="firstName" label="Họ" placeholder="Nguyễn" required error={errors?.firstName} />
      <FormField name="lastName" label="Tên" placeholder="Văn A" required error={errors?.lastName} />
    </div>

    {/* Company */}
    <div className="mb-4">
      <FormField name="company" label="Công ty" placeholder="Tên công ty (không bắt buộc)" />
    </div>

    {/* Street Address */}
    <div className="mb-4">
      <FormField name="address" label="Địa chỉ" placeholder="123 Đường ABC, Phường XYZ" required error={errors?.address} />
    </div>

    {/* Apartment */}
    <div className="mb-4">
      <FormField name="apartment" label="Chung cư, căn hộ, etc." placeholder="Số căn hộ, tầng (không bắt buộc)" />
    </div>

    {/* City / Province / PostCode */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div className="flex flex-col gap-1.5 col-span-2">
        <span className="text-sm font-medium text-slate-700">Thành phố</span>
        <SelectWithIcon selectList={validCity} isIcon={false} name="city" setFieldValue={setFieldValue} />
      </div>
      <FormField name="province" label="Quận/Huyện" placeholder="Quận 1" required error={errors?.province} className="col-span-1" />
      <FormField name="postCode" label="Mã bưu cục" placeholder="700000" className="col-span-1" />
    </div>

    {/* Phone */}
    <div className="mb-4">
      <FormField name="phoneNumber" label="Số điện thoại" placeholder="0901234567" required error={errors?.phoneNumber} />
    </div>

    {/* Country */}
    {/* <div className="mb-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700">Quốc gia</span>
        <SelectWithIcon selectList={CountryFlag} name="country" setFieldValue={setFieldValue} />
      </label>
    </div> */}

    {/* Save Info Checkbox */}
    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
      <Checkbox id="save-info" size="lg" checked={saveInfo} onCheckedChange={(checked) => onSaveInfoChange(checked as boolean)} />
      <label htmlFor="save-info" className="text-sm text-slate-600 cursor-pointer">
        Lưu thông tin này cho lần sau
      </label>
    </div>
  </SectionCard>
)

// Shipping Method Section
interface ShippingMethodSectionProps {
  value: string
  onChange: (value: string, method: ShippingMethodType) => void
}

const ShippingMethodSection = ({ value, onChange }: ShippingMethodSectionProps) => (
  <SectionCard>
    <SectionHeader step={2} title="Hình thức vận chuyển" />
    <p className="text-sm text-slate-500 mb-4">{DELIVERY_NOTE}</p>
    <div className="flex flex-col gap-3">
      {ShippingMethod.map((method) => (
        <label key={method.id} className={cn('relative flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/50', value === method.value ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white')}>
          <div className="flex items-center gap-4">
            <input type="radio" name="deliveryMethod" value={method.value} checked={value === method.value} onChange={() => onChange(method.value, method as ShippingMethodType)} className="text-primary border-slate-300 focus:ring-primary w-5 h-5" />
            <div className="flex flex-col">
              <span className="font-bold text-slate-900">{method.name}</span>
              <span className="text-sm text-slate-500">{method.value === 'STANDARD' ? '3-7 ngày làm việc' : '1-2 ngày làm việc'}</span>
            </div>
          </div>
          <span className="font-bold text-slate-900">{method.price === 0 ? 'Miễn phí' : formatCurrency(method.price)}</span>
        </label>
      ))}
    </div>
  </SectionCard>
)

// Payment Method Section
interface PaymentMethodSectionProps {
  value: string
  onChange: (value: string) => void
}

const PaymentMethodSection = ({ value, onChange }: PaymentMethodSectionProps) => (
  <SectionCard>
    <SectionHeader step={3} title="Phương thức thanh toán" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {PaymentMethod.filter((m) => !m.disabled).map((method) => (
        <label key={method.id} className={cn('relative flex items-center p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm hover:border-primary/50', value === method.value ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white')}>
          <input type="radio" name="paymentMethod" value={method.value} checked={value === method.value} onChange={() => onChange(method.value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary border-slate-300 focus:ring-primary w-5 h-5" />
          <div className="flex items-center gap-4 pr-8">
            <div className={cn('flex items-center justify-center w-12 h-12 rounded-lg shadow-sm border border-slate-100', PaymentBgColors[method.value] || 'bg-white text-slate-900')}>{PaymentIcons[method.value] || <Wallet className="w-5 h-5" />}</div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900">{method.name}</span>
              <span className="text-sm text-slate-500">
                {method.value === 'CASH_ON_DELIVERY' && 'Trả tiền khi nhận'}
                {method.value === 'MOMO' && 'Thanh toán qua ví'}
                {method.value === 'BANK_TRANSFER' && 'Chuyển khoản trực tiếp'}
              </span>
            </div>
          </div>
        </label>
      ))}
    </div>
    <div className="mt-6 pt-4 border-t border-slate-100">
      <p className="text-sm text-slate-500">Sau khi nhấn "Đặt hàng", bạn sẽ được chuyển đến trang thanh toán để hoàn tất đơn hàng.</p>
    </div>
  </SectionCard>
)

// Order Summary Section
interface OrderSummaryProps {
  cart: { products: IOrderProduct[]; totalPrice: number } | undefined
  isPending: boolean
  deliveryMethod: ShippingMethodType
}

const OrderSummary = ({ cart, isPending, deliveryMethod }: OrderSummaryProps) => {
  const totalPrice = (cart?.totalPrice || 0) + (deliveryMethod?.price || 0)

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Đơn hàng của bạn</h2>

      {/* Cart Items */}
      <div className="flex flex-col gap-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
        {isPending ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          cart?.products.map((item: IOrderProduct, index: number) => <CheckoutCartItem key={item.productId || index} item={item} />)
        )}
      </div>

      {/* Promo Code */}
      <ApplyPromoBlock />

      {/* Price Breakdown */}
      <div className="flex flex-col gap-3 py-4 border-t border-slate-100">
        <PriceRow label="Tạm tính" value={formatCurrency(cart?.totalPrice || 0)} />
        <PriceRow label="Phí vận chuyển" value={deliveryMethod?.price === 0 ? 'Miễn phí' : formatCurrency(deliveryMethod?.price || 0)} valueClassName="text-primary" />
        <PriceRow label="Thuế" value={formatCurrency(0)} />
      </div>

      {/* Total */}
      <div className="flex justify-between items-center py-4 border-t border-dashed border-slate-300 mb-6">
        <span className="text-lg font-bold text-slate-900">Tổng cộng</span>
        <div className="flex items-end flex-col">
          <span className="text-2xl font-black text-primary">{formatCurrency(totalPrice)}</span>
          <span className="text-xs text-slate-500">VND</span>
        </div>
      </div>

      {/* Place Order Button */}
      <Button type="submit" form="checkout-form" className="w-full bg-primary hover:bg-blue-600 text-white font-bold text-lg py-4 h-auto rounded-xl shadow-lg shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99]">
        Đặt hàng
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>

      <div className="flex justify-center items-center gap-2 mt-4 text-slate-400 text-xs">
        <Lock className="w-4 h-4" />
        Giao dịch được mã hoá an toàn
      </div>
    </div>
  )
}

// Price Row helper
const PriceRow = ({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-slate-500">{label}</span>
    <span className={cn('font-medium text-slate-900', valueClassName)}>{value}</span>
  </div>
)

// Checkout Cart Item Component
const CheckoutCartItem = ({ item }: { item: IOrderProduct }) => {
  const { categoryName = '', productName = '', quantity = 0, productOptions = [], totalPrice = 0 } = item || {}

  if (!productOptions.length) return null

  return (
    <>
      {productOptions.map((opt, index) => (
        <div key={`${item.productId}-${index}`} className={cn('flex gap-4 items-start', index > 0 && 'pt-4 border-t border-slate-100')}>
          <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100 relative">
            <Image src={opt?.thumbnail?.path || NEW_MISSING_IMAGE} alt={opt?.thumbnail?.alt || productName} className="w-full h-full object-cover" fill sizes="80px" />
            <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full backdrop-blur-sm">x{quantity}</span>
          </div>
          <div className="flex flex-col flex-1 gap-1">
            <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{categoryName || productName}</h3>
            <p className="text-xs text-slate-500">Phiên bản: {opt.name}</p>
            <p className="text-sm font-semibold text-slate-900 mt-1">{formatCurrency(totalPrice)}</p>
          </div>
        </div>
      ))}
    </>
  )
}

// Apply Promo Code Block
const ApplyPromoBlock = () => {
  const [code, setCode] = useState('')
  const [error, setError] = useState({ status: true, message: '' })

  const handleApplyPromo = () => {
    if (code) {
      setError({ status: false, message: 'Mã giảm giá hoặc thẻ quà tặng không tồn tại' })
    } else {
      setError({ status: true, message: '' })
    }
  }

  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Mã giảm giá"
          className={cn('flex-1 rounded-lg border bg-slate-50 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary px-4 py-3 placeholder:text-slate-400', !error.status ? 'border-red-500' : 'border-slate-200')}
        />
        <Button variant="secondary" onClick={handleApplyPromo} disabled={!code} className="bg-slate-900 text-white px-4 py-3 h-auto rounded-lg text-sm font-medium hover:bg-slate-800 disabled:bg-slate-300">
          Áp dụng
        </Button>
      </div>
      {!error.status && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  )
}

// ============ MAIN COMPONENT ============

const CheckoutPage = () => {
  const router = useRouter()
  const { data: cart, isPending } = useCartQuery()
  const { user } = useAuth() as unknown as { user: { customerId: number; email: string } }
  const { mutate: checkoutMutate, isPending: isSubmitCheckout } = useCheckoutMutation()
  const [deliveryMethod, setDeliveryMethod] = useState<ShippingMethodType>(ShippingMethod[0] as ShippingMethodType)
  const [saveInfo, setSaveInfo] = useState(false)
  const [inProgress, toggleProgress] = useState(false)

  const validCity = useMemo(() => {
    return VNCity?.filter((item) => item.isDeleted === false).sort((a, b) => {
      if (a.code === '79' || a.code === '01') return -1
      if (b.code === '79' || b.code === '01') return 1
      return 0
    })
  }, [])

  const CheckoutSchema = Yup.object().shape({
    email: user?.email ? Yup.string() : Yup.string().email('Có vẻ sai định dạng rồi ạ').required('Vui lòng nhập địa chỉ email'),
    firstName: Yup.string().required('Vui lòng nhập họ'),
    lastName: Yup.string().required('Vui lòng nhập tên'),
    company: Yup.string(),
    address: Yup.string().required('Vui lòng nhập địa chỉ'),
    apartment: Yup.string(),
    province: Yup.string().required('Vui lòng nhập Huyện/Xã'),
    phoneNumber: Yup.string().required('Vui lòng nhập số điện thoại'),
    deliveryMethod: Yup.string(),
    paymentMethod: Yup.string(),
    billingAddress: Yup.string().required('Vui lòng chọn địa chỉ thanh toán'),
  })

  const handleCheckout = async (formData: CheckoutFormValues) => {
    const formatFormData: IDataPostCheckout = {
      orderInfo: { ...formData, city: formData?.city?.code },
      cart: {
        ...cart,
        customerId: user?.customerId,
        cartId: cart?.cartId as string,
        products: cart?.products || [],
        services: cart?.services || [],
        usedProducts: cart?.usedProducts || [],
        fees: cart?.fees || { shipping: deliveryMethod?.price || 0, tax: 0, handling: 0, voucherCode: '', voucherDiscount: 0 },
        totalPrice: cart?.totalPrice || 0,
        updatedAt: cart?.updatedAt || '',
        totalProductQuantity: cart?.totalProductQuantity || 0,
      },
      paymentMethod: formData.paymentMethod,
      deliveryMethod: deliveryMethod.value,
    }

    toggleProgress(true)
    checkoutMutate(
      { payload: formatFormData },
      {
        onSuccess: (resp: IResponse<any>) => {
          if (resp.status === 'OK') {
            const { orderId } = getFirst(resp) || {}
            const redirectPath = formData.paymentMethod === 'BANK_TRANSFER' ? `/order-confirm/${orderId}` : `/thankyou/${orderId}`
            setTimeout(() => router.push({ pathname: redirectPath }), 1000)
          }
        },
      }
    )
  }

  const initialValues: CheckoutFormValues = {
    email: user?.email || '',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: {
      code: validCity[0]?.code || '',
      isDelete: validCity[0]?.isDeleted || false,
      name: validCity[0]?.name || '',
      name_with_type: validCity[0]?.nameWithType || '',
      slug: validCity[0]?.slug || '',
      type: validCity[0]?.type || '',
    },
    province: '',
    postCode: '',
    phoneNumber: '',
    deliveryMethod: ShippingMethod[0]?.value || '',
    paymentMethod: PaymentMethod[0]?.value || '',
    billingAddress: BillingAddress[0]?.value || '',
    country: CountryFlag[0]?.value || '',
  }

  return (
    <Base isLoading={inProgress}>
      <main className="grow w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column - Forms */}
          <div className="flex-1 w-full lg:w-[65%] flex flex-col gap-8">
            {/* Breadcrumb & Title */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span className="hover:text-primary cursor-pointer">Giỏ hàng</span>
                <ChevronRight className="w-4 h-4" />
                <span className="font-medium text-slate-900">Thanh toán</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">Thanh toán</h1>
              <p className="text-slate-500">Hoàn tất đơn hàng của bạn.</p>
            </div>

            <Formik initialValues={initialValues} validationSchema={CheckoutSchema} onSubmit={handleCheckout} enableReinitialize>
              {({ errors, setFieldValue, values }) => (
                <Form id="checkout-form" className="flex flex-col gap-8">
                  <ShippingAddressSection user={user} values={values} errors={errors} setFieldValue={setFieldValue} validCity={validCity} saveInfo={saveInfo} onSaveInfoChange={setSaveInfo} />

                  <ShippingMethodSection
                    value={values.deliveryMethod}
                    onChange={(value, method) => {
                      setFieldValue('deliveryMethod', value)
                      setDeliveryMethod(method)
                    }}
                  />

                  <PaymentMethodSection value={values.paymentMethod} onChange={(value) => setFieldValue('paymentMethod', value)} />
                </Form>
              )}
            </Formik>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-[35%]">
            <div className="sticky top-24 space-y-6">
              <OrderSummary cart={cart} isPending={isPending} deliveryMethod={deliveryMethod} />
            </div>
          </div>
        </div>
      </main>
    </Base>
  )
}

export default CheckoutPage
