import { useAuth } from "@/context/Auth";
import { IAuthUser } from "@/interface/Context/auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Divider } from "@mui/material";
import { Button } from "@/components/ReUIComponent/Button";
import { Field, Form, Formik } from "formik";
import { BlocksIcon, VerifiedIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import * as Yup from "yup";

const AccountInfo: React.FC = () => {
  const { user } = useAuth() as unknown as { user: IAuthUser };
  // const iconVerifyStyle = verifyIconStyle();
  const PersonalSchema = Yup.object().shape({
    firstName: Yup.string().required("Vui lòng nhập tên"),
    lastName: Yup.string().required("Vui lòng nhập họ"),
    phoneNumber: Yup.string().required("Vui lòng nhập số điện thoại"),
    dob: Yup.string().required("Vui lòng nhập ngày sinh"),
  });
  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-2">Thông tin cá nhân</h2>
      <div className="flex-initial w-3/4 pl-4 pt-5">
        <Formik
          initialValues={{
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            phoneNumber: user?.phoneNumber || "",
            dob: "",
            gender: 0,
            email: user?.email || "",
          }}
          validationSchema={PersonalSchema}
          onSubmit={(values) => {
            console.log("values", values);
          }}
          enableReinitialize
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col max-w-3xl gap-4">
              <UserAvatar avatar={user?.avatar || ""} />
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 w-1/2">
                  <label htmlFor="lastName">Họ</label>
                  <Field
                    name="lastName"
                    type="text"
                    placeholder="Họ"
                    className="h-12 rounded-sm border border-gray-400 px-4 py-2 disabled:bg-gray-300"
                    disabled
                  />
                  {errors.lastName && touched.lastName ? (
                    <div className="text-red-400">
                      {errors?.lastName as string}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                  <label htmlFor="firstName">Tên</label>
                  <Field
                    name="firstName"
                    type="text"
                    placeholder="Tên"
                    className="h-12 rounded-sm border border-gray-400 px-4 py-2 disabled:bg-gray-300"
                    disabled
                  />
                  {errors.firstName && touched.firstName ? (
                    <div className="text-red-400">
                      {errors.firstName as string}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="email">Email</label>
                <Field
                  name="email"
                  type="text"
                  placeholder="Địa chỉ email"
                  className="h-12 rounded-sm border border-gray-400 px-4 py-2 disabled:bg-gray-300"
                  disabled
                />
                {errors.phoneNumber && touched.phoneNumber ? (
                  <div className="text-red-400">{errors.email as string}</div>
                ) : null}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="phoneNumber">Số điện thoại</label>
                <Field
                  name="phoneNumber"
                  type="text"
                  placeholder="Số điện thoại"
                  className="h-12 rounded-sm border border-gray-400 px-4 py-2"
                />
                {errors.phoneNumber && touched.phoneNumber ? (
                  <div className="text-red-400">
                    {errors.phoneNumber as string}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="phoneNumber">Trạng thái</label>
                <div className="flex items-center gap-8">
                  <div
                    className={`rounded-sm ${
                      user?.verified ? "bg-green-600" : "bg-red-600"
                    } p-2 text-white flex items-center gap-2 font-bold`}
                  >
                    {user?.verified ? (
                      <VerifiedIcon className="stroke-white" />
                    ) : null}
                    {user?.verified ? (
                      "Tài khoản đã xác thực"
                    ) : (
                      <BlocksIcon className="!fill-white" />
                    )}
                    &nbsp;
                  </div>
                  {!user?.verified ? (
                    <>
                      <Divider orientation="vertical" flexItem />
                      <Button className="normal-case bg-blue-400 px-6 hover:bg-blue-500">
                        <span className="text-white font-bold">Xác thực</span>
                      </Button>
                    </>
                  ) : null}
                </div>
                <div className="flex justify-between items-center"></div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

const UserAvatar = ({ avatar }: { avatar: string }) => {
  return (
    <div className="w-full">
      <span>Ảnh đại diện</span>
      <div className="flex gap-4 items-center">
        <div className="w-20 h-20 rounded-half relative">
          {avatar && avatar !== "" ? (
            <Image
              src={avatar}
              alt="avatar"
              className="object-contain rounded-full"
              fill
              sizes="100vw"
            />
          ) : (
            <AccountCircleIcon
              className="group text-gray-600 cursor-pointer transition-all m-auto"
              aria-hidden="true"
              style={{ width: 100, height: 100 }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
