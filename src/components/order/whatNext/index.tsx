import { Box, Typography } from "@material-ui/core";
import EmailIcon from '@mui/icons-material/Email';
import Inventory2Icon from '@mui/icons-material/Inventory2';

const WhatNext = () => {
  return (
    <Box display="flex" flexDirection="column">
      <Box className="rounded-lg p-4 flex gap-4" style={{backgroundColor: '#e9e9e9'}}>
        <Box className="bg-white w-12 h-12 flex justify-center items-center rounded-2xl">
          <EmailIcon className="text-4xl m-4" />
        </Box>
        <Box>
          <Typography variant="h6">Hộp thư điện tử</Typography>
          <p className="text-gray-600">
            Chúng tôi đã gửi một email đến hộp thư của bạn. Vui lòng kiểm tra hộp thư để xem thông tin chi tiết đơn hàng.
          </p>
        </Box>
      </Box>
      <Box className="rounded-lg p-4 mt-6 flex gap-4" style={{backgroundColor: '#e9e9e9'}}>
        <Box className="bg-white w-12 h-12 flex justify-center items-center rounded-2xl">
          <Inventory2Icon className="text-4xl m-4" />
        </Box>
        <Box>
          <Typography variant="h6">Đơn hàng của bạn</Typography>
          <p className="text-gray-600">
            Bạn có thể xem chi tiết đơn hàng của mình tại trang&nbsp; 
            <a href="#" target="_blank" className="text-red-400 underline">Đơn hàng của tôi</a>
          </p>
        </Box>
      </Box>
    </Box>
  )
}

export default WhatNext