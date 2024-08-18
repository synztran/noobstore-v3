import SpinnerLoading from "@/components/spinner";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { PAGE_LINK } from "components/constants";
import { useAuth } from "context/Auth/index";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Base } from "templates/Base";

import * as Yup from 'yup';

const RegisterPage = ():JSX.Element => {
    const router = useRouter();
    const {isAuthenticated}: any = useAuth();
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [onProcessing, setProcessing] = useState<boolean>(false)
    const { handleLogin }: any = useAuth();

    const SigupSchema = Yup.object().shape({
        email: Yup.string().email('Có vẻ sai định dạng rồi ạ').required('Bạn chưa nhập email ạ'),
        password: Yup.string().min(7, "Mật khẩu phải dài hơn 6   kí tự").required('Bạn chưa nhập mật khẩu ạ')
    })

    const handleOnClickLogin = async (data: {
        email: string,
        password: string
    }) => {
        handleLogin({
            email: data.email,
            password: data.password,
            success: () => {
                router.push(PAGE_LINK.HOME)
            },
            callback: () => {
                setProcessing(false)
            }
        })
    }

    const handleViewPassword = () => {
        setIsVisible(!isVisible)
    }

    useEffect(() => {
       if (isAuthenticated) {
           router.push(PAGE_LINK.ACCOUNT)
       }
    }, [isAuthenticated])

    if (isAuthenticated) {
        return <></>
    }

    return (
        <Base>
            <div className="mx-w-full p-6 sm:py-6 lg:px-8 relative z-1 mx-auto">
                <h2 className="text-center text-3xl">Đăng nhập ngay !</h2>
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    validationSchema={SigupSchema}
                    onSubmit={(values) => {
                        console.log("values", values)
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
                                            {isVisible ? <EyeIcon /> : <EyeSlashIcon />}
                                        </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className="max-w-max px-4 py-2 rounded-sm bg-black text-white select-none" onClick={() => router.push(PAGE_LINK.REGISTER)} disabled={onProcessing}>{
                                    onProcessing ? <SpinnerLoading /> : "Đăng ký ngay"
                                }</button>
                                <button className="max-w-max px-4 py-2 rounded-sm border border-black select-none" type="submit" disabled={onProcessing}>{
                                    onProcessing ? <SpinnerLoading /> : "Đăng nhập"
                                }</button>
                            </div>
                        </Form>
                    )}

                </Formik>
            </div>
        </Base>
    );
}

export default RegisterPage
