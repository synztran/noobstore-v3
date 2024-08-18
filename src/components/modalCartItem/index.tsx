import useQueryData from "@/hook/useQueries";
import { ICartProduct } from "@/interface/global-interface";
import { formatCurrency } from "@/utils/FormatNumber";
import useCart, { useCartAction } from "@/zustand/useCart";
import { Box, Button, CircularProgress, Divider, IconButton, Modal, Typography } from "@material-ui/core";
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import InputQuantity from "../InputQuatity";

interface Props {
  open: boolean;
  handleClose: () => void;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  minHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
};

const ModalCartItem = ({ open, handleClose }: Props) => {
  const { cart } = useCart();
  const router = useRouter();
  const { removeItemCart } = useCartAction();
  const { cartQuery } = useQueryData()
  const [isRemoving, setRemoving] = useState(false)

  const handleRemoveItemCart = async(productId: string) => {
    setRemoving(true)
    removeItemCart({
      cartId: cart?.cartId,
      productId
    })
    cartQuery.refetch()
    setRemoving(false)
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Box position="relative" display="flex" alignItems="center"  justifyContent="space-between" padding="16px">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Giỏ hàng
          </Typography>
          <IconButton className="p-0.5" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box padding="20px 8px" display="flex" flexDirection="column" gridGap={16} width="100%" minHeight="100%" maxHeight="100%" flex={1} className={`${cart?.products?.length === 0 ? "justify-center align-middle" : ""}`} style={{overflowY: 'auto'}}>
          {
            cart?.products?.length > 0 ? (
              cart?.products.map((item: ICartProduct) => (
                <>
                  <Box key={item?.productId} display="flex" gridGap={8}>
                    <Link href={item?.slug ? `/product/${item.slug}` : ""}>
                      <Box position="relative"> 
                        <Image src={item?.image} width={160} height={80} alt="product" />
                      </Box>
                    </Link>
                    <Box>
                      <Link href={item?.slug ? `/product/${item.slug}` : ""}>
                        <Typography className="text-md">{item.categoryName || ''}</Typography>
                      </Link>
                      <Typography className="text-sm" style={{color: '#656461'}}>{item.productName}</Typography>
                      <Typography className="text-md">{formatCurrency(item?.price)}</Typography>
                      <InputQuantity quantity={item?.quantity} productId={item?.productId} />
                    </Box>
                    <Box marginLeft="auto">
                      {
                        isRemoving ? (
                          <CircularProgress size={12} color="primary" />
                        ) : (
                          <IconButton onClick={() => handleRemoveItemCart(item.productId)}>
                            <DeleteOutlineOutlinedIcon />
                          </IconButton>
                        )
                      }
                    </Box>
                  </Box>
                  <Divider />
                </>
              ))
            ) : (
              <Box>
                <Typography variant="body1">Giỏ hàng trống</Typography>
              </Box>
            )
          }
        </Box>
        <Box width="100%" padding={2} borderTop="1px solid #e9e9e9">
        <span className="text-sm text-gray-600"><strong className="text-sm">Phí vận chuyển</strong> sẽ được tính toán ở bước kế tiếp</span><br/>
        <span className="text-sm  text-gray-600">Đơn hàng từ <strong className="text-sm">{formatCurrency(2000000)}</strong> sẽ được miễn phí vận chuyện nội thành Hồ Chí Mình từ shop</span>
        </Box>
        <Box width="100%">
          <Button fullWidth className="p-4 bg-red-400 font-bold hover:bg-red-500 rounded-none" onClick={handleCheckout}>
          <span className="text-white"> Thanh toán {formatCurrency(cart?.totalPrice || 0)}</span>
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default ModalCartItem