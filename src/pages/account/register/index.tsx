import NotifyUtils from '@/utils/NotifyUtils';
import AuthClient from 'client/AuthClient';
import { PAGE_LINK } from "components/constants";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { Base } from "templates/Base";
import * as Yup from 'yup';

const LoginPage = ():JSX.Element => {
    const router = useRouter();

    const SigupSchema = Yup.object().shape({
        firstName: Yup.string().min(2, 'Tên hơi ngắn ây ạ').max(50, "Tên dài quá rồi ạ").required('Bạn chưa nhập tên ạ'),
        lastName: Yup.string().min(2, "Họ hơi ngắn ấy ạ").max(50, "Họ dài quá rồi ạ").required('Bạn chưa nhập họ ạ'),
        email: Yup.string().email('Có vẻ sai định dạng rồi ạ').required('Bạn chưa nhập email ạ'),
        password: Yup.string().min(6, "Mật khẩu phải dài hơn 6 kí tự").required('Bạn chưa nhập mật khẩu ạ'),
        passwordConfirm: Yup.string().oneOf([Yup.ref('password')], 'Mật khẩu không khớp ạ').required('Bạn chưa nhập lại mật khẩu ạ')
    })

    const handleRegister = async (data: {
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        passwordConfirm: string
    }) => {
        const respRegister = await AuthClient.postRegister(data);
        if (respRegister?.status === 'OK') { 
            NotifyUtils.success('Đăng ký thành công');
        } else {
            NotifyUtils.error('Đăng ký thất bại. Vui lòng thử lại');
        }
    }

  return (
    <Base>
        <div className="mx-w-full p-6 sm:py-6 lg:px-8 relative z-1 mx-auto">
            <h2 className="text-center text-3xl">Đăng ký ngay !</h2>
            <Formik
                initialValues={{
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    passwordConfirm: ""
                }}
                validationSchema={SigupSchema}
                onSubmit={(values) => {
                    console.log(values)
                    handleRegister(values)
                }}
            >
                {({errors, touched}) => (
                    <Form className="mx-auto flex flex-col max-w-3xl gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="uppercase font-bold" style={{color: '#2c3343'}}>Tên</label>
                            <Field name="firstName" type="text" placeholder="Tên" className="h-12 rounded-sm border border-gray-400 px-4 py-2" />
                            {errors.firstName && touched.firstName ? (
                                <div className="text-red-500">{errors.firstName}</div>
                            ) : null}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="uppercase font-bold" style={{color: '#2c3343'}}>Họ</label>
                            <Field name="lastName" type="text" placeholder="Họ" className="h-12 rounded-sm border border-gray-400 px-4 py-2" />
                            {errors.lastName && touched.lastName ? (
                                <div className="text-red-500">{errors.lastName}</div>
                            ) : null}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="uppercase font-bold" style={{color: '#2c3343'}}>Email</label>
                            <Field name="email" type="email" placeholder="Email" className="h-12 rounded-sm border border-gray-400 px-4 py-2" />
                            {errors.email && touched.email ? (
                                <div className="text-red-500">{errors.email}</div>
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
                            <Field name="passwordConfirm" type="password" placeholder="Nhập lại Mật khẩu" className="h-12 rounded-sm border border-gray-400 px-4 py-2" />
                            {errors.passwordConfirm && touched.passwordConfirm ? (
                                <div className="text-red-500">{errors.passwordConfirm}</div>
                            ) : null}
                        </div>
                        <div className="flex gap-4">
                            <button className="max-w-max px-4 py-2 rounded-sm bg-black text-white" onClick={() => router.push(PAGE_LINK.LOGIN)} >Đăng nhập ngay</button>
                            <button className="max-w-max px-4 py-2 rounded-sm border border-black" type="submit">Đăng ký</button>
                        </div>
                    </Form>
                )}

            </Formik>
        </div>
    </Base>
  );
}

export default LoginPage