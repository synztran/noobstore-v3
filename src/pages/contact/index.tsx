import Breadcumb from "@/components/breadcumb";
import { Base } from "@/templates/Base";
import { classNames } from "@/utils/AppConfig";
import { Switch } from "@headlessui/react";
import { useState } from "react";

export default function Contact() {
	const [agreed, setAgreed] = useState(false);

	return (
		<Base>
			<div className="bg-white px-6 py-6 sm:py-6 lg:px-8 relative z-10">
				<div className="mx-auto max-w-3xl text-center">
					<Breadcumb mainRoot="contact" />
					<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						Liên hệ hỗ trợ
					</h2>
					<p className="mt-2 text-lg leading-8 text-gray-600">
						Hãy liên hệ với chúng tối, nếu như bạn cần hỗ trợ hoặc
						tư vấn về các vấn đề liên quan đến sản phẩm hoặc về chất
						lượng dịch vụ của shop
					</p>
				</div>
				<form
					action="#"
					method="POST"
					className="mx-auto mt-8 max-w-2xl sm:mt-8">
					<div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
						<div>
							<label
								htmlFor="first-name"
								className="block text-sm font-semibold leading-6 text-gray-900">
								Tên
							</label>
							<div className="mt-2.5">
								<input
									type="text"
									name="first-name"
									id="first-name"
									autoComplete="given-name"
									className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>
						<div>
							<label
								htmlFor="last-name"
								className="block text-sm font-semibold leading-6 text-gray-900">
								Họ
							</label>
							<div className="mt-2.5">
								<input
									type="text"
									name="last-name"
									id="last-name"
									autoComplete="family-name"
									className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>
						<div className="sm:col-span-2">
							<label
								htmlFor="company"
								className="block text-sm font-semibold leading-6 text-gray-900">
								Công ty
							</label>
							<div className="mt-2.5">
								<input
									type="text"
									name="company"
									id="company"
									autoComplete="organization"
									className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>
						<div className="sm:col-span-2">
							<label
								htmlFor="email"
								className="block text-sm font-semibold leading-6 text-gray-900">
								Email
							</label>
							<div className="mt-2.5">
								<input
									type="email"
									name="email"
									id="email"
									autoComplete="email"
									className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>
						<div className="sm:col-span-2">
							<label
								htmlFor="phone-number"
								className="block text-sm font-semibold leading-6 text-gray-900">
								Số điện thoại
							</label>
							<div className="relative mt-2.5">
								<div className="absolute inset-y-0 left-0 flex items-center">
									<label
										htmlFor="country"
										className="sr-only">
										Country
									</label>
									<select
										id="country"
										name="country"
										className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-2 text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm disabled:text-gray-800"
										disabled>
										<option>+84</option>
									</select>
								</div>
								<input
									type="tel"
									name="phone-number"
									id="phone-number"
									autoComplete="tel"
									className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>
						<div className="sm:col-span-2">
							<label
								htmlFor="message"
								className="block text-sm font-semibold leading-6 text-gray-900">
								Nội dung
							</label>
							<div className="mt-2.5">
								<textarea
									name="message"
									id="message"
									rows={4}
									className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									defaultValue={""}
								/>
							</div>
						</div>
						<Switch.Group
							as="div"
							className="flex gap-x-4 sm:col-span-2">
							<div className="flex h-6 items-center">
								<Switch
									checked={agreed}
									onChange={setAgreed}
									className={classNames(
										agreed
											? "bg-indigo-600"
											: "bg-gray-200",
										"flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
									)}>
									<span className="sr-only">
										Agree to policies
									</span>
									<span
										aria-hidden="true"
										className={classNames(
											agreed
												? "translate-x-3.5"
												: "translate-x-0",
											"h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"
										)}
									/>
								</Switch>
							</div>
							<Switch.Label className="text-md leading-6 text-gray-800">
								Nếu được bật, đồng nghĩa đồng ý với{" "}
								<a
									href="#"
									className="font-semibold text-indigo-600">
									những quy định của shop
								</a>
								.
							</Switch.Label>
						</Switch.Group>
					</div>
					<div className="mt-10">
						<button
							type="submit"
							className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
							Gửi ngay để cùng nhau trao đổi
						</button>
					</div>
				</form>
			</div>
		</Base>
	);
}
