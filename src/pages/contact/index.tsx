import TextEditor from "@/adminComponents/Texteditor";
import Breadcumb from "@/components/breadcumb";
import { Base } from "@/templates/Base";
import { useState } from "react";
import ReactQuill from "react-quill";

export default function Contact() {
	const [agreed, setAgreed] = useState(false);
	const [content, setContent] = useState("");

	return (
		<Base>
			<div className="p-6">
				<div className="max-w-3xl mx-auto text-center">
					{/* <Breadcumb mainRoot="contact" /> */}
					<h2 className="text-3xl font-bold text-gray-900">
						Liên hệ hỗ trợ
					</h2>
					<p className="mt-2 text-gray-600">
						Hãy liên hệ với chúng tôi nếu bạn cần hỗ trợ hoặc tư vấn
					</p>
				</div>

				<form className="max-w-2xl mx-auto mt-8">
					<div className="space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-semibold text-gray-900">
									Tên
								</label>
								<input
									type="text"
									className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
								/>
							</div>
							<div>
								<label className="block text-sm font-semibold text-gray-900">
									Họ
								</label>
								<input
									type="text"
									className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-900">
								Email
							</label>
							<input
								type="email"
								className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
							/>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-900">
								Số điện thoại
							</label>
							<input
								type="tel"
								className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
							/>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-900">
								Nội dung
							</label>
							<TextEditor
								value={content}
								onChange={setContent}
								placeholder="Chúng tôi luôn lắng nghe ý kiến của bạn..."
							/>
						</div>

						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								checked={agreed}
								onChange={(e) => setAgreed(e.target.checked)}
								className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
							/>
							<label className="text-sm text-gray-800">
								Đồng ý với{" "}
								<a
									href="#"
									className="text-indigo-600 font-semibold">
									quy định của shop
								</a>
							</label>
						</div>
					</div>

					<button
						type="submit"
						className="w-full mt-6 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 font-semibold">
						Gửi góp ý
					</button>
				</form>
			</div>
		</Base>
	);
}
