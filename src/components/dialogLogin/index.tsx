import { postRegister } from '@/client/AuthClient'
import { useAuth } from '@/context/Auth'
import { classNames } from '@/utils/AppConfig'
import NotifyUtils from '@/utils/NotifyUtils'
import { EnumStatusDialog } from '@/zustand/useDialogLogin'
import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PhoneIcon from '@mui/icons-material/Phone'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Dialog } from '@mui/material'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import { useState } from 'react'
import * as Yup from 'yup'
import SpinnerLoading from '../spinner'
import { Button, Checkbox } from '../ReUIComponent'

interface Props {
  isOpen: boolean
  toggleOpen: (value: boolean) => void
}

enum ENUM_FORM_TYPE {
  LOGIN = 'login',
  REGISTER = 'register',
}

const vietnamesePhoneNumberRegex = /^(03|05|07|08|09)\d{8}$/

const DialogLogin = ({ isOpen, toggleOpen }: Props) => {
  const router = useRouter()
  const { handleLogin } = useAuth() as unknown as {
    handleLogin: (data: { email: string; password: string; success: () => void; error: () => void }) => void
  }
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false)
  const [onProcessing, setProcessing] = useState<boolean>(false)
  const [formType, setFormType] = useState<ENUM_FORM_TYPE>(ENUM_FORM_TYPE.LOGIN)

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Có vẻ sai định dạng rồi').required('Bạn chưa nhập email'),
    password: Yup.string().min(7, 'Mật khẩu phải dài hơn 6 kí tự').required('Bạn chưa nhập mật khẩu'),
  })

  const SigupSchema = Yup.object().shape({
    email: Yup.string().email('Có vẻ sai định dạng rồi ạ').required('Bạn chưa nhập email ạ'),
    password: Yup.string().min(7, 'Mật khẩu phải dài hơn 6 kí tự').required('Bạn chưa nhập mật khẩu ạ'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Mật khẩu xác nhận không khớp')
      .required('Vui lòng xác nhận mật khẩu'),
    phoneNumber: Yup.string().matches(vietnamesePhoneNumberRegex, 'Số điện thoại không hợp lệ').required('Bạn chưa nhập số điện thoại ạ'),
  })

  const handleOnClickLogin = async (data: { email: string; password: string }) => {
    setProcessing(true)
    handleLogin({
      email: data.email,
      password: data.password,
      success: () => {
        router.reload()
      },
      error: () => {
        setProcessing(false)
      },
    })
  }

  const handleRegister = async (data: { email: string; password: string; phoneNumber: string; firstName: string; lastName: string }) => {
    setProcessing(true)
    const respRegister = await postRegister(data)
    if (respRegister?.status === 'OK') {
      NotifyUtils.success('Đăng ký thành công')
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } else {
      setProcessing(false)
      NotifyUtils.error(respRegister?.message)
    }
  }

  const handleViewPassword = () => {
    setIsVisible(!isVisible)
  }

  const handleViewConfirmPassword = () => {
    setIsConfirmVisible(!isConfirmVisible)
  }

  const inputClassName = 'peer block w-full px-4 pt-6 pb-2 text-base text-gray-900 bg-[#f8f6f6] border border-[#e7d6d0] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none pr-12'

  const labelClassName = 'absolute left-4  duration-300 transform -translate-y-3 scale-75 top-4 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[0.85] peer-focus:-translate-y-3 peer-focus:text-primary z-10 pointer-events-none'

  return (
    <Dialog
      open={isOpen}
      maxWidth={false}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          maxWidth: '1100px',
          width: '100%',
          margin: '16px',
          borderRadius: '16px',
          overflow: 'hidden',
        },
      }}
    >
      <div className="w-full h-auto min-h-162.5 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Visual & Welcome */}
        <div className="relative w-full md:w-1/2 bg-[#2c1e19] flex-col justify-end p-8 md:p-12 text-white group hidden md:flex">
          <div
            className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuADLy7WujwE0hPT4PgV-FXOqLQAJDQQXfhdVZ9xu420_DhoqCR3XaAVYCOni4gPck-zgpHJrI-YqskNmMKPSthJmK40FClJwdDD141LpkmcLSEcERsy1Xev953TvQ-tU3EENwGnJv16fVxvE5TVzNetX_Wf_5OnXKDWmsz8se8QRNnwPu1-9XXM48xTuZBXui_IU1d9z-vS3KlarfzHPr2G_dAqGfMGQZxT5C1F8m-IsjrnldyLlPixyvaeNVc96v2wU-HLXWdbT7wU')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-2 shadow-lg">
              <KeyboardIcon className="text-white text-3xl" />
            </div>
            <div className="text-4xl md:text-5xl font-black leading-tight tracking-tight">{formType === ENUM_FORM_TYPE.LOGIN ? 'Chào mừng trở lại.' : 'Tham gia ngay.'}</div>
            <p className="text-gray-200 text-lg md:text-base font-light leading-relaxed max-w-md">
              {formType === ENUM_FORM_TYPE.LOGIN ? 'Đăng nhập để truy cập vào thế giới bàn phím cơ và keycap artisan. Bộ sưu tập của bạn đang chờ đợi.' : 'Tạo tài khoản để khám phá thế giới bàn phím cơ và keycap artisan đẳng cấp.'}
            </p>
          </div>
        </div>

        {/* Right Side: Form Area */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-8 md:px-16 md:py-8 bg-white relative">
          {/* Close Button */}
          <Button size={'icon'} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={() => toggleOpen(Boolean(EnumStatusDialog.CLOSE))}>
            <CloseIcon />
          </Button>

          <div className="flex flex-col w-full max-w-sm mx-auto">
            {formType === ENUM_FORM_TYPE.LOGIN ? (
              <>
                {/* Login Form */}
                <div className="mb-8 text-center md:text-left">
                  <h2 className="text-gray-900 text-3xl font-bold mb-2">Đăng nhập</h2>
                  <p className="text-sm ">Nhập thông tin để truy cập tài khoản của bạn.</p>
                </div>

                <Formik initialValues={{ email: '', password: '' }} validationSchema={LoginSchema} onSubmit={(values) => handleOnClickLogin(values)}>
                  {({ errors, touched }) => (
                    <Form className="flex flex-col gap-5">
                      {/* Email Field */}
                      <div className="relative">
                        <Field name="email" type="email" placeholder=" " className={inputClassName} disabled={onProcessing} />
                        <label className={labelClassName}>Email</label>
                        <MailOutlineIcon className="absolute right-4 top-1/2 -translate-y-1/2  pointer-events-none" />
                        {errors.email && touched.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                      </div>

                      {/* Password Field */}
                      <div className="relative">
                        <Field name="password" type={isVisible ? 'text' : 'password'} placeholder=" " className={inputClassName} disabled={onProcessing} />
                        <label className={labelClassName}>Mật khẩu</label>
                        <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2  hover:text-primary transition-colors cursor-pointer" onClick={handleViewPassword}>
                          {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </button>
                        {errors.password && touched.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                      </div>

                      {/* Remember & Forgot */}
                      <div className="flex items-center justify-between text-sm mt-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <Checkbox size="md" className="border-[#e7d6d0] data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                          <span className=" group-hover:text-gray-900 transition-colors">Ghi nhớ đăng nhập</span>
                        </label>
                        <a href="#" className="text-primary font-medium hover:underline">
                          Quên mật khẩu?
                        </a>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={onProcessing}
                        className={classNames(
                          'w-full bg-primary hover:bg-[#c54e26] text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 mt-2 text-lg tracking-wide',
                          onProcessing ? 'pointer-events-none opacity-80' : ''
                        )}
                      >
                        {onProcessing ? <SpinnerLoading /> : 'Đăng nhập'}
                      </button>
                    </Form>
                  )}
                </Formik>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#e7d6d0]" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white ">Hoặc tiếp tục với</span>
                  </div>
                </div>

                {/* Social Icons */}
                <div className="flex justify-center gap-6">
                  <button className="w-12 h-12 rounded-full bg-[#f8f6f6] border border-[#e7d6d0] flex items-center justify-center text-gray-900 hover:border-primary hover:text-primary transition-colors duration-300 shadow-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                    </svg>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-[#f8f6f6] border border-[#e7d6d0] flex items-center justify-center text-gray-900 hover:border-primary hover:text-primary transition-colors duration-300 shadow-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-[#f8f6f6] border border-[#e7d6d0] flex items-center justify-center text-gray-900 hover:border-primary hover:text-primary transition-colors duration-300 shadow-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </button>
                </div>

                {/* Sign Up Link */}
                <div className="mt-8 text-center">
                  <p className=" text-sm">
                    Chưa có tài khoản?
                    <button type="button" className="text-primary font-bold hover:underline ml-1" onClick={() => setFormType(ENUM_FORM_TYPE.REGISTER)}>
                      Đăng ký
                    </button>
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Register Form */}
                <div className="mb-6 text-center md:text-left">
                  <h2 className="text-gray-900 text-3xl font-bold mb-2">Đăng ký</h2>
                  <p className="">Tạo tài khoản để bắt đầu hành trình.</p>
                </div>

                <Formik
                  initialValues={{
                    email: '',
                    password: '',
                    phoneNumber: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: '',
                  }}
                  validationSchema={SigupSchema}
                  onSubmit={(values) => handleRegister(values)}
                >
                  {({ errors, touched }) => (
                    <Form className="flex flex-col gap-4">
                      {/* Name Fields */}
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <Field name="firstName" type="text" placeholder=" " className={inputClassName} disabled={onProcessing} />
                          <label className={labelClassName}>Tên</label>
                          <PersonOutlineIcon className="absolute right-4 top-1/2 -translate-y-1/2  pointer-events-none text-xl" />
                          {errors.firstName && touched.firstName && <div className="text-red-500 text-xs mt-1">{errors.firstName}</div>}
                        </div>
                        <div className="relative flex-1">
                          <Field name="lastName" type="text" placeholder=" " className={inputClassName} disabled={onProcessing} />
                          <label className={labelClassName}>Họ</label>
                          <PersonOutlineIcon className="absolute right-4 top-1/2 -translate-y-1/2  pointer-events-none text-xl" />
                          {errors.lastName && touched.lastName && <div className="text-red-500 text-xs mt-1">{errors.lastName}</div>}
                        </div>
                      </div>

                      {/* Email Field */}
                      <div className="relative">
                        <Field name="email" type="email" placeholder=" " className={inputClassName} disabled={onProcessing} />
                        <label className={labelClassName}>Email</label>
                        <MailOutlineIcon className="absolute right-4 top-1/2 -translate-y-1/2  pointer-events-none" />
                        {errors.email && touched.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                      </div>

                      {/* Phone Field */}
                      <div className="relative">
                        <Field name="phoneNumber" type="text" placeholder=" " className={inputClassName} disabled={onProcessing} />
                        <label className={labelClassName}>Số điện thoại</label>
                        <PhoneIcon className="absolute right-4 top-1/2 -translate-y-1/2  pointer-events-none" />
                        {errors.phoneNumber && touched.phoneNumber && <div className="text-red-500 text-xs mt-1">{errors.phoneNumber}</div>}
                      </div>

                      {/* Password Field */}
                      <div className="relative">
                        <Field name="password" type={isVisible ? 'text' : 'password'} placeholder=" " className={inputClassName} disabled={onProcessing} />
                        <label className={labelClassName}>Mật khẩu</label>
                        <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2  hover:text-primary transition-colors cursor-pointer" onClick={handleViewPassword}>
                          {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </button>
                        {errors.password && touched.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                      </div>

                      {/* Confirm Password Field */}
                      <div className="relative">
                        <Field name="confirmPassword" type={isConfirmVisible ? 'text' : 'password'} placeholder=" " className={inputClassName} disabled={onProcessing} />
                        <label className={labelClassName}>Nhập lại mật khẩu</label>
                        <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2  hover:text-primary transition-colors cursor-pointer" onClick={handleViewConfirmPassword}>
                          {isConfirmVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </button>
                        {errors.confirmPassword && touched.confirmPassword && <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={onProcessing}
                        className={classNames(
                          'w-full bg-primary hover:bg-[#c54e26] text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 mt-2 text-lg tracking-wide',
                          onProcessing ? 'pointer-events-none opacity-80' : ''
                        )}
                      >
                        {onProcessing ? <SpinnerLoading /> : 'Đăng ký'}
                      </button>

                      {/* Terms */}
                      <p className=" text-xs text-center mt-2">
                        Bằng cách đăng ký, bạn đồng ý với{' '}
                        <a href="#" className="text-primary hover:underline">
                          Điều khoản sử dụng
                        </a>{' '}
                        và{' '}
                        <a href="#" className="text-primary hover:underline">
                          Chính sách bảo mật
                        </a>
                      </p>
                    </Form>
                  )}
                </Formik>

                {/* Sign In Link */}
                <div className="mt-6 text-center">
                  <p className=" text-sm">
                    Đã có tài khoản?
                    <button type="button" className="text-primary font-bold hover:underline ml-1" onClick={() => setFormType(ENUM_FORM_TYPE.LOGIN)}>
                      Đăng nhập
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default DialogLogin
