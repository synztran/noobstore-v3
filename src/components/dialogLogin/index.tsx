import { postRegister } from "@/client/AuthClient";
import { useAuth } from "@/context/Auth";
import { classNames } from "@/utils/AppConfig";
import NotifyUtils from "@/utils/NotifyUtils";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import * as Yup from 'yup';
import SpinnerLoading from "../spinner";


interface Props {
  isOpen: boolean;
  toggleOpen: (value: boolean) => void;
}

enum ENUM_FORM_TYPE {
  LOGIN = "login",
  REGISTER = "register"
}

const vietnamesePhoneNumberRegex = /^(03|05|07|08|09)\d{8}$/;
const parseDateString = (_: string, originalValue: string) => {
  const parsedDate = new Date(originalValue);
  return parsedDate;
};

const DialogLogin = ({isOpen, toggleOpen}: Props) => {
  const router = useRouter();
  // const { toggleDialogLogin } = useDialogLoginAction();
  // state
  const {handleLogin}: any = useAuth();
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [onProcessing, setProcessing] = useState<boolean>(false)
  const [formType, setFormType] = useState<ENUM_FORM_TYPE>(ENUM_FORM_TYPE.LOGIN)

  // schema for formik
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Có vẻ sai định dạng rồi').required('Bạn chưa nhập email'),
    password: Yup.string().min(7, "Mật khẩu phải dài hơn 6 kí tự").required('Bạn chưa nhập mật khẩu')
  })

  const SigupSchema = Yup.object().shape({
    email: Yup.string().email('Có vẻ sai định dạng rồi ạ').required('Bạn chưa nhập email ạ'),
    password: Yup.string().min(7, "Mật khẩu phải dài hơn 6   kí tự").required('Bạn chưa nhập mật khẩu ạ'),
    confirmPassword: Yup
    .string()
    .oneOf([Yup.ref('password'), undefined], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
    phoneNumber: Yup.string().matches(vietnamesePhoneNumberRegex, "Số điện thoại không hợp lệ").required('Bạn chưa nhập số điện thoại ạ'),
    // dob: Yup
    // .date()
    // .transform(parseDateString)
    // .typeError('Invalid date format')
    // .max(new Date(), 'Date of birth cannot be in the future')
    // .test(
    //   'is-18-years-old',
    //   'You must be at least 18 years old',
    //   value => isBefore(value, subYears(new Date(), 18))
    // )
    // .required('Date of birth is required')
  })

  // func login
  const handleOnClickLogin = async (data: {
    email: string,
    password: string
  }) => {
      setProcessing(true)
      handleLogin({
          email: data.email,
          password: data.password,
          success: () => {
              router.reload();
          },
          error: () => {
            setProcessing(false)
          }
      })
  }

  const handleRegister = async (data: {
    email: string,
    password: string,
    phoneNumber: string,
    firstName: string,
    lastName: string,
  }) => {
    setProcessing(true)
    const respRegister = await postRegister(data);
    if (respRegister?.status === 'OK') { 
      NotifyUtils.success("Đăng ký thành công")
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } else {
      setProcessing(false)
      NotifyUtils.error(respRegister?.message)
    }
  }

  // handle show/hide password
  const handleViewPassword = () => {
    setIsVisible(!isVisible)
  }

  return (
    <Dialog className={`outline-none px-8 py-4 rounded-md overflow-y-auto`} open={isOpen} onClose={() => toggleOpen(!isOpen)} PaperProps={{
      style: {
        backgroundColor: '#f4f4f4',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        maxWidth: formType === ENUM_FORM_TYPE.LOGIN ? '400px' : '650px',
        borderRadius: '8px'
      }
    }}>
      {
        formType === ENUM_FORM_TYPE.LOGIN ? (
          <>
            <DialogTitle>
              <span className="font-bold text-xl">Chào mừng trở lại</span>
            </DialogTitle>
            <DialogContent>
              <Formik
                  initialValues={{
                      email: "",
                      password: "",
                  }}
                  validationSchema={LoginSchema}
                  onSubmit={(values) => {
                      handleOnClickLogin(values)
                  }}
              >
                  {({errors, touched}) => (
                    <Form className="mx-auto flex flex-col max-w-3xl gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="uppercase font-bold" style={{color: '#2c3343'}}>Email</label>
                            <Field name="email" type="email" placeholder="Email" className="h-12 rounded-sm border border-gray-400 px-4 py-2" />
                            {errors.email && touched.email ? (
                                <div className="text-red-500">{errors.email}</div>
                            ) : null}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="uppercase font-bold" style={{color: '#2c3343'}}>Mật khẩu</label>
                            <div className="relative">
                                <Field name="password" type={isVisible ? "text" : "password"} placeholder="Mật khẩu" className="h-12 rounded-sm border border-gray-400 px-4 py-2 w-full" />
                                    {errors.password && touched.password ? (
                                        <div className="text-red-500">{errors.password}</div>
                                    ) : null}
                                    <div className="absolute top-0 right-4 w-6 h-6 translate-y-1/2 z-10 cursor-pointer" onClick={handleViewPassword}>
                                        {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </div>
                            </div>
                        </div>
                        <Box width="100%" textAlign="center">
                          <button 
                            className={
                              classNames(`w-2/3 px-4 py-2 rounded-md bg-black text-white hover:bg-black hover:opacity-80`, 
                              onProcessing ? `pointer-events-none opacity-80` : '')
                            }
                            type="submit"
                            >
                            {
                              onProcessing ? <SpinnerLoading /> : "Đăng nhập"
                            } 
                          </button>
                        </Box>
                        <Box width="100%" textAlign="center" display="flex" justifyContent="center">
                          <span className="text-gray-600">
                            Tham gia với chúng tôi &nbsp;
                            <span className="uppercase underline font-bold cursor-pointer" onClick={() => setFormType(ENUM_FORM_TYPE.REGISTER)}>Đăng ký</span>
                          </span>
                        </Box>
                        <Box textAlign="center" className="text-gray-600">
                          Bằng cách đăng nhập, bạn đồng ý với các <a href="#" className="underline">Điều khoản sử dụng</a> và <a href="#" className="underline">Chính sách bảo mật</a> của NoobStore.
                        </Box>
                    </Form>
                  )}
              </Formik>
            </DialogContent>
          </>
        ) : (
          <>
            <DialogTitle>
              <span className="font-bold text-xl">Đăng ký ngay thôi</span>
            </DialogTitle>
            <DialogContent>
              <Formik
                  initialValues={{
                    email: "",
                    password: "",
                    phoneNumber: "",
                    confirmPassword: "",
                    firstName: "",
                    lastName: "",
                    // dob: "",
                  }}
                  validationSchema={SigupSchema}
                  onSubmit={(values) => {
                      handleRegister(values)
                  }}
              >
                  {({errors, touched}) => (
                    <Form className="mx-auto flex flex-col max-w-3xl gap-4">
                      <div className="flex gap-2">
                        <div className="flex flex-col w-full">
                          <label className="uppercase font-bold" style={{color: '#2c3343'}}>Tên</label>
                          <Field name="firstName" type="text" placeholder="Tên" className="h-12 rounded-sm border border-gray-400 px-4 py-2" />
                          {errors.firstName && touched.firstName ? (
                              <div className="text-red-500">{errors.firstName}</div>
                          ) : null}
                        </div>
                        <div className="flex flex-col w-full">
                          <label className="uppercase font-bold" style={{color: '#2c3343'}}>Họ</label>
                          <Field name="lastName" type="text" placeholder="Họ" className="h-12 rounded-sm border border-gray-400 px-4 py-2" />
                          {errors.lastName && touched.lastName ? (
                              <div className="text-red-500">{errors.lastName}</div>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                          <label className="uppercase font-bold" style={{color: '#2c3343'}}>Email</label>
                          <Field name="email" type="email" placeholder="Email" className="h-12 rounded-sm border border-gray-400 px-4 py-2" />
                          {errors.email && touched.email ? (
                              <div className="text-red-500">{errors.email}</div>
                          ) : null}
                      </div>
                      <div className="flex flex-col gap-1">
                          <label className="uppercase font-bold" style={{color: '#2c3343'}}>Số điện thoại</label>
                          <Field name="phoneNumber" type="text" placeholder="phone number" className="h-12 rounded-sm border border-gray-400 px-4 py-2" components={NumericInput} />
                          {errors.phoneNumber && touched.phoneNumber ? (
                              <div className="text-red-500">{errors.phoneNumber}</div>
                          ) : null}
                      </div>
                      <div className="flex flex-col gap-1">
                          <label className="uppercase font-bold" style={{color: '#2c3343'}}>Mật khẩu</label>
                          <Field name="password" type="password" placeholder="Mật khẩu" className="h-12 rounded-sm border border-gray-400 px-4 py-2" />
                          {errors.password && touched.password ? (
                              <div className="text-red-500">{errors.password}</div>
                          ) : null}
                      </div>
                      <div className="flex flex-col gap-1">
                          <label className="uppercase font-bold" style={{color: '#2c3343'}}>Nhập lại mật khẩu</label>
                          <Field name="confirmPassword" type="password" placeholder="Nhập lại Mật khẩu" className="h-12 rounded-sm border border-gray-400 px-4 py-2" />
                          {errors.confirmPassword && touched.confirmPassword ? (
                              <div className="text-red-500">{errors.confirmPassword}</div>
                          ) : null}
                      </div>
                      <Box width="100%" textAlign="center">
                            <button 
                              className={
                                classNames(`w-2/3 px-4 py-2 rounded-md bg-black text-white hover:bg-black hover:opacity-80`, 
                                onProcessing ? `pointer-events-none opacity-80` : '')
                              }
                              type="submit"
                              >
                              {
                                onProcessing ? <SpinnerLoading /> : "Đăng ký"
                              } 
                            </button>
                      </Box>
                      <Box width="100%" textAlign="center" display="flex" justifyContent="center">
                        <span className="text-gray-600">
                          <span className="uppercase underline font-bold cursor-pointer" onClick={() => setFormType(ENUM_FORM_TYPE.LOGIN)}>Đã có tài khoản?</span>
                        </span>
                      </Box>
                      <Box textAlign="center" className="text-gray-600">
                        Bằng cách đăng ký, bạn đồng ý với các <a href="#" className="underline">Điều khoản sử dụng</a> và <a href="#" className="underline">Chính sách bảo mật</a> của NoobStore.
                      </Box>
                    </Form>
                  )}
              </Formik>
            </DialogContent>
          </>
        )
      }
    </Dialog>
  )
}

export default DialogLogin;

const NumericInput = ({ field, form, ...props }:{field: any, form: any}) => {
  const handleKeyPress = (event: any) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  };

  return (
    <div>
      <input
        {...field}
        {...props}
        onKeyPress={handleKeyPress}
      />
      <ErrorMessage name={field.name} component="div" />
    </div>
  );
};