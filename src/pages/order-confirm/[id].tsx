'use client'

import UploadClient from '@/client/UploadClient'
import { Button } from '@/components/ReUIComponent'
import { NEW_MISSING_IMAGE, VIETINBANK_QR } from '@/constants/Images'
import { useAuth } from '@/context/Auth'
import { IOrderProduct, IOrdered } from '@/interface/Client/Order'
import { IAuthUser } from '@/interface/Context/auth'
import { EnumPaymentMethod, EnumPaymentStatus } from '@/interface/interface'
import { cn } from '@/lib/utils'
import useOrderQuery from '@/react-query/order/api/useOrderQueries'
import { useSubmitOrderPaymentMutation } from '@/react-query/order/api/useSubmitOrderPaymentMutation'
import { Base } from '@/templates/Base'
import { formatCurrency } from '@/utils/FormatNumber'
import NotifyUtils from '@/utils/NotifyUtils'
import { AlertTriangle, Check, CheckCircle, ChevronRight, CloudUpload, Copy, Info, QrCode, Store, Upload } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'

// ============ CONSTANTS ============
const BANK_INFO = {
  bankName: 'VietinBank',
  accountName: 'NOOBSTORE',
  accountNumber: '1234567890',
}

// ============ HELPER COMPONENTS ============

// Section Card wrapper
const SectionCard = ({ children, className, hasGradient }: { children: React.ReactNode; className?: string; hasGradient?: boolean }) => (
  <section className={cn('bg-white rounded-xl p-6 shadow-sm border border-slate-100 relative overflow-hidden', className)}>
    {hasGradient && <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-purple-500 to-primary" />}
    {children}
  </section>
)

// Breadcrumb Component
const Breadcrumb = () => (
  <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
    <Link href="/cart" className="hover:text-primary cursor-pointer">
      Giỏ hàng
    </Link>
    <ChevronRight className="w-4 h-4" />
    <Link href="/checkout" className="hover:text-primary cursor-pointer">
      Thanh toán
    </Link>
    <ChevronRight className="w-4 h-4" />
    <span className="font-medium text-slate-900">Xác nhận đơn hàng</span>
  </div>
)

// Order Header Component
interface OrderHeaderProps {
  orderId: string
  isPaymentChecking?: boolean
}

const OrderHeader = ({ orderId, isPaymentChecking }: OrderHeaderProps) => (
  <div className="flex items-center gap-4">
    <div className="bg-green-100 text-green-600 p-3 rounded-full flex items-center justify-center">
      <CheckCircle className="w-8 h-8" />
    </div>
    <div>
      <h1 className="text-lg lg:text-xl font-black tracking-tight text-slate-900">{isPaymentChecking ? `Thanh toán đang được xác minh - Đơn hàng #${orderId?.replace('ORDER-', '')}` : `Đơn hàng #${orderId?.replace('ORDER-', '')} đã được đặt thành công`}</h1>
      <p className="text-slate-500 text-sm mt-1">{isPaymentChecking ? 'Chúng tôi đã nhận được thông báo thanh toán. Đội ngũ đang xác minh giao dịch của bạn.' : 'Cảm ơn bạn đã mua hàng. Vui lòng hoàn tất thanh toán bên dưới.'}</p>
    </div>
  </div>
)

// Payment Verification In Progress Section
const PaymentVerificationSection = () => (
  <SectionCard className="p-8 flex flex-col items-center text-center">
    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-yellow-400 via-orange-400 to-yellow-400" />
    <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-6">
      <div className="flex items-center gap-1 animate-pulse">
        <div className="w-3 h-3 bg-yellow-600 rounded-full" />
        <div className="w-3 h-3 bg-yellow-600 rounded-full" />
        <div className="w-3 h-3 bg-yellow-600 rounded-full" />
      </div>
    </div>
    <h2 className="text-2xl font-bold text-slate-900 mb-3">Đang xác minh thanh toán</h2>
    <p className="text-slate-600 max-w-md mb-8">Giao dịch của bạn đang được đội ngũ tài chính xác minh. Quá trình này thường mất từ 1-2 giờ trong giờ làm việc.</p>
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-full border border-slate-200">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Đang kiểm tra...</span>
      </div>
      <p className="text-xs text-slate-400 italic">Tự động cập nhật trạng thái mỗi 60 giây</p>
    </div>
  </SectionCard>
)

// Info Badge Card
interface InfoBadgeProps {
  label: string
  value: string
  badge?: string
  isMono?: boolean
  onCopy?: () => void
}

const InfoBadge = ({ label, value, badge, isMono, onCopy }: InfoBadgeProps) => (
  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</label>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={cn('text-lg font-bold text-slate-900', isMono && 'font-mono')}>{value}</span>
        {badge && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">{badge}</span>}
      </div>
      {onCopy && (
        <button onClick={onCopy} className="text-slate-400 hover:text-primary transition-colors" title="Copy">
          <Copy className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
)

// Transfer Memo Section
interface TransferMemoProps {
  orderId: string
}

const TransferMemo = ({ orderId }: TransferMemoProps) => {
  const memoText = `Thanh toan DH ${orderId?.replace('ORDER-', '')}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(memoText)
    NotifyUtils.success('Đã sao chép nội dung chuyển khoản!')
  }

  return (
    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
      <label className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2 flex items-center gap-1">
        <AlertTriangle className="w-4 h-4" />
        Nội dung chuyển khoản (Bắt buộc)
      </label>
      <div className="flex gap-2">
        <div className="flex-1 p-3 bg-white border border-yellow-200 rounded-lg text-slate-900 text-sm font-bold font-mono tracking-wide">{memoText}</div>
        <button onClick={handleCopy} className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap">
          Sao chép
        </button>
      </div>
      <p className="text-xs text-yellow-700/80 mt-2 leading-relaxed">* Vui lòng điền chính xác nội dung này khi chuyển khoản để hệ thống có thể tự động xác minh thanh toán của bạn.</p>
    </div>
  )
}

// Scan To Pay Section
interface ScanToPaySectionProps {
  orderId: string
  totalPrice: number
}

const ScanToPaySection = ({ orderId, totalPrice }: ScanToPaySectionProps) => {
  const handleCopyOrderId = async () => {
    await navigator.clipboard.writeText(orderId?.replace('ORDER-', '') || '')
    NotifyUtils.success('Đã sao chép mã đơn hàng!')
  }

  return (
    <SectionCard hasGradient>
      <div className="text-xl font-bold flex items-center gap-3 text-slate-900 mb-4">
        <QrCode className="w-6 h-6 text-primary" />
        Quét mã để thanh toán
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* QR Code */}
        <div className="flex flex-col items-center gap-4 w-2/5">
          <div className="p-4 bg-white rounded-xl shadow-md border border-slate-200 relative group w-full h-96">
            <div className="absolute inset-0 bg-primary/5 rounded-xl pointer-events-none" />
            <div className="relative w-full h-full aspect-auto overflow-hidden">
              <Image alt="Payment QR Code" src={VIETINBANK_QR} layout="fill" objectFit="cover" className="scale-125 top-12!" />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap flex items-center gap-1 align-middle">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs">Chuyển khoản ngân hàng</span>
            </div>
          </div>
          <p className="text-sm text-center text-slate-500 max-w-60">Mở ứng dụng ngân hàng và quét mã QR này để thực hiện chuyển khoản.</p>
        </div>

        {/* Payment Info */}
        <div className="w-3/5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoBadge label="Số tiền" value={formatCurrency(totalPrice)} badge="VND" isMono />
            <InfoBadge label="Mã đơn hàng" value={`#${orderId?.replace('ORDER-', '')}`} isMono onCopy={handleCopyOrderId} />
          </div>

          <TransferMemo orderId={orderId} />
        </div>
      </div>
    </SectionCard>
  )
}

// Upload Proof Section
interface UploadProofSectionProps {
  uploadedFile: File | null
  onFileChange: (file: File | null) => void
}

const UploadProofSection = ({ uploadedFile, onFileChange }: UploadProofSectionProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        NotifyUtils.error('Kích thước file không được vượt quá 5MB')
        return
      }
      onFileChange(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0] || null
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        NotifyUtils.error('Kích thước file không được vượt quá 5MB')
        return
      }
      onFileChange(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <SectionCard>
      <h2 className="text-xl font-bold flex items-center gap-3 text-slate-900 mb-2">
        <Upload className="w-6 h-6 text-primary" />
        Tải lên bằng chứng thanh toán
      </h2>
      <p className="text-slate-500 text-sm mb-6">Vui lòng tải lên ảnh chụp màn hình giao dịch thành công để đẩy nhanh quá trình xác minh.</p>

      <div className="w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-primary transition-all group relative overflow-hidden"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 pointer-events-none" />
          <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
            {uploadedFile ? (
              <>
                <div className="mb-3 p-3 rounded-full bg-green-100 text-green-500">
                  <Check className="w-8 h-8" />
                </div>
                <p className="text-sm text-slate-600 font-medium">{uploadedFile.name}</p>
                <p className="text-xs text-slate-500 mt-1">Nhấp để thay đổi file</p>
              </>
            ) : (
              <>
                <div className="mb-3 p-3 rounded-full bg-slate-100 text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                  <CloudUpload className="w-8 h-8" />
                </div>
                <p className="mb-1 text-sm text-slate-600 font-medium">
                  <span className="font-bold text-primary">Nhấp để tải lên</span> hoặc kéo thả
                </p>
                <p className="text-xs text-slate-500">PNG, JPG hoặc GIF (Tối đa 5MB)</p>
              </>
            )}
          </div>
          <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      </div>

      <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-slate-900">Thời gian xác minh</p>
          <p className="text-slate-600 mt-0.5">Thanh toán thường được xác minh trong vòng 1-2 giờ trong giờ làm việc. Bạn sẽ nhận được email xác nhận khi được duyệt.</p>
        </div>
      </div>
    </SectionCard>
  )
}

// Price Row Helper
const PriceRow = ({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-slate-500">{label}</span>
    <span className={cn('font-medium text-slate-900', valueClassName)}>{value}</span>
  </div>
)

// Order Summary Item
const OrderSummaryItem = ({ item }: { item: IOrderProduct }) => {
  console.log('item', item)
  const thumbnail = item?.productOptions?.[0]?.thumbnail?.path || item?.thumbnail?.path || NEW_MISSING_IMAGE
  const productOptions = item?.productOptions || []
  const variantText = productOptions
    .map((opt) => opt.name)
    .filter(Boolean)
    .join(', ')

  return (
    <div className="flex gap-4 items-start">
      <div className="w-16 h-16 rounded-lg bg-slate-100 relative">
        <Image alt={item.productName || 'Product'} className="w-full h-full" src={thumbnail} fill objectFit="cover" />
        <span className="absolute -top-2 -right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full backdrop-blur-sm">{item.quantity}</span>
      </div>
      <div className="flex flex-col flex-1 gap-1">
        <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{item.categoryName}</h3>
        {variantText && (
          <p className="text-xs text-slate-500">
            {item.productName}: {variantText}
          </p>
        )}
        <p className="text-sm font-semibold text-slate-900 mt-1">{formatCurrency(item.totalPrice)}</p>
      </div>
    </div>
  )
}

// Order Summary Sidebar
interface OrderSummarySidebarProps {
  order: IOrdered | undefined
  email?: string
}

const OrderSummarySidebar = ({ order, email }: OrderSummarySidebarProps) => {
  const products = order?.products || []
  const totalProductPrice = products.reduce((sum, p) => sum + p.totalPrice, 0)
  const shippingFee = order?.fees?.shipping || 0
  const taxFee = order?.fees?.tax || 0
  const totalPrice = order?.totalPrice || 0

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Đơn hàng của bạn</h2>
        <span className="px-2 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-500">{order?.totalQuantity || 0} sản phẩm</span>
      </div>

      {/* Cart Items */}
      <div className="flex flex-col gap-4 mb-6 max-h-100 pr-2">
        {products.map((item, index) => (
          <div key={item.productId || index} className={cn(index > 0 && 'pt-4 border-t border-slate-100')}>
            <OrderSummaryItem item={item} />
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="flex flex-col gap-3 py-4 border-t border-slate-100">
        <PriceRow label="Tạm tính" value={formatCurrency(totalProductPrice)} />
        <PriceRow label="Phí vận chuyển" value={shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)} />
        {taxFee > 0 && <PriceRow label="Thuế" value={formatCurrency(taxFee)} />}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center py-4 border-t border-dashed border-slate-300">
        <span className="text-lg font-bold text-slate-900">Tổng cộng</span>
        <div className="flex items-end flex-col">
          <span className="text-2xl font-black text-primary">{formatCurrency(totalPrice)}</span>
        </div>
      </div>

      {/* Email Notice */}
      {email && (
        <div className="p-4 bg-slate-50 rounded-lg text-xs text-slate-500 leading-relaxed">
          Email xác nhận đã được gửi đến <span className="text-slate-900 font-medium">{email}</span>. Nếu bạn không nhận được, vui lòng kiểm tra thư mục spam.
        </div>
      )}
    </div>
  )
}

// ============ MAIN COMPONENT ============
const OrderConfirmPage = () => {
  const router = useRouter()
  const { id: orderId } = router.query
  const { user } = useAuth() as unknown as { user: IAuthUser | null }

  const { data: order, isPending } = useOrderQuery(orderId as string, {
    enabled: !!orderId,
    refetchInterval: (query) => {
      // Auto-refetch every 60 seconds when payment is being checked
      const orderData = query.state.data
      if (orderData?.paymentStatus === EnumPaymentStatus.CHECKING && orderData?.transitionId?.length) {
        return 60000 // 60 seconds
      }
      return false
    },
  })

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const { mutate: submitOrderPayment, isPending: isSubmitting } = useSubmitOrderPaymentMutation()

  const handleConfirmTransfer = useCallback(async () => {
    try {
      let paymentAttachment

      // Upload file if present
      if (uploadedFile) {
        const formData = new FormData()
        formData.append('file', uploadedFile)
        const uploadResponse = await UploadClient.postUploadImage(formData)
        if (uploadResponse.status === 'OK' && uploadResponse.data) {
          paymentAttachment = uploadResponse.data
        }
      }

      // Submit payment confirmation
      submitOrderPayment({
        payload: {
          orderId: orderId as string,
          paymentAttachment,
        },
      })
    } catch (error) {
      NotifyUtils.error('Có lỗi xảy ra khi tải lên file, vui lòng thử lại sau')
    }
  }, [orderId, uploadedFile, submitOrderPayment])

  // Check payment status conditions
  const isBankTransfer = order?.paymentMethod === EnumPaymentMethod.BANK_TRANSFER
  const isPaymentChecking = order?.paymentStatus === EnumPaymentStatus.CHECKING && order?.transitionId && order.transitionId.length > 0

  if (!orderId) return null
  if (order?.paymentStatus === EnumPaymentStatus.PAID && order?.paymentMethod) {
    router.push(`/thankyou/${orderId}`)
    NotifyUtils.warn('Đơn hàng của bạn đã được thanh toán. Chuyển hướng đến trang cảm ơn...')
    return null
  }

  return (
    <Base isLoading={isPending}>
      <main className="grow w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column - Main Content */}
          <div className="flex-1 w-full lg:w-[65%] flex flex-col gap-8">
            {/* Breadcrumb & Header */}
            <div className="flex flex-col gap-2">
              <Breadcrumb />
              <OrderHeader orderId={orderId as string} isPaymentChecking={isPaymentChecking} />
            </div>

            {/* Bank Transfer Payment Sections */}
            {isBankTransfer && isPaymentChecking ? (
              // Payment submitted and under verification
              <>
                <PaymentVerificationSection />
                <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
                  <Link href="/">
                    <Button variant="outline" className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 hover:border-primary text-slate-700 font-bold text-lg rounded-xl shadow-sm transition-all flex justify-center items-center gap-2">
                      Quay lại cửa hàng
                      <Store className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </>
            ) : isBankTransfer ? (
              // Bank transfer - waiting for payment upload
              <>
                <ScanToPaySection orderId={orderId as string} totalPrice={order?.totalPrice || 0} />
                <UploadProofSection uploadedFile={uploadedFile} onFileChange={setUploadedFile} />

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
                  <Button
                    onClick={handleConfirmTransfer}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Tôi đã chuyển khoản'}
                    <CheckCircle className="w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : (
              // Other payment methods - order confirmed
              <SectionCard>
                <div className="text-center py-8">
                  <div className="bg-green-100 text-green-600 p-4 rounded-full inline-flex items-center justify-center mb-4">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Đơn hàng đã được xác nhận!</h2>
                  <p className="text-slate-500 mb-6">Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.</p>
                  <Link href="/">
                    <Button className="px-6 py-3">Tiếp tục mua sắm</Button>
                  </Link>
                </div>
              </SectionCard>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-[35%]">
            <div className="sticky top-24 space-y-6">
              <OrderSummarySidebar order={order} email={user?.email} />

              {/* Bank Transfer Badges */}
              {isBankTransfer && (
                <div className="flex justify-center gap-4 grayscale opacity-40">
                  <div className="h-8 px-3 bg-slate-300 rounded flex items-center justify-center text-[10px] font-bold text-slate-500">SWIFT</div>
                  <div className="h-8 px-3 bg-slate-300 rounded flex items-center justify-center text-[10px] font-bold text-slate-500">IBAN</div>
                  <div className="h-8 px-3 bg-slate-300 rounded flex items-center justify-center text-[10px] font-bold text-slate-500">WIRE</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </Base>
  )
}

export default OrderConfirmPage
