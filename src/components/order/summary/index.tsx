import { LabelPaymentMethod } from "@/constants"
import { IOrder } from "@/interface"
import DateUtils from "@/utils/DateUtils"
import { formatCurrency } from "@/utils/FormatNumber"
import { Box } from "@material-ui/core"
import ReceiptIcon from '@mui/icons-material/Receipt'
import { useMemo } from "react"

interface Props {
  order: IOrder
}

const OrderSummary = ({order}: Props) => {
  const { orderInfo } = order || {}
  const manualOrderQuantity = useMemo(() => {
    if (order.products) {
      return order.products.reduce((acc, product) => acc + product.quantity, 0)
    }

    return 0
  }, [orderInfo])

  return (
    <Box className="rounded-lg flex p-4 gap-4" style={{backgroundColor: '#e9e9e9'}}>
      <Box className="bg-white w-12 h-12 flex justify-center items-center rounded-2xl">
        <ReceiptIcon className="text-2xl" />
      </Box>
      <Box>
        <Box className="flex flex-col">
          <span className="text-gray-600">Số lượng sản phẩm</span>
          <span>{order.totalQuantity || manualOrderQuantity}</span>
        </Box>
        <Box className="flex flex-col">
          <span className="text-gray-600">Ngày đặt hàng</span>
          <span>{order.orderedAt === "" ? DateUtils.formatDate(new Date(), "dd/mm/yyyy hh:mm") : order.orderedAt}</span>
        </Box>
        <Box className="flex flex-col">
          <span className="text-gray-600">Tổng thanh toán</span>
          <span>{formatCurrency(order.totalPrice)}</span>
        </Box>
        <Box className="flex flex-col">
          <span className="text-gray-600">Phương thức thanh toán</span>
          <span>{LabelPaymentMethod?.[orderInfo?.paymentMethod] ?? "Không xác định"}</span>
        </Box>
      </Box>
    </Box>
  )
}

export default OrderSummary