import { mappingRaffleTimelineStatus } from "@/constants";
import { TResponseRaffleEntry } from "@/interface/Context/auth";
import { EnumRafflePaymentStepStatus } from "@/interface/interface";
import { CircularProgress } from "@mui/material";
import { Check } from "lucide-react";
// TODO: Replace MUI system styles with Tailwind CSS

interface IProps {
	raffle: TResponseRaffleEntry;
	classNames?: string;
}
const STATUS_COLOR: Record<EnumRafflePaymentStepStatus, string> = {
	PENDING: "bg-gray-200 text-gray-700",
	IN_PROCESS: "bg-yellow-100 text-yellow-800",
	CANCELLED: "bg-red-100 text-red-700",
	COMPLETED: "bg-green-100 text-green-800",
};

function formatDateTime(iso?: string) {
	if (!iso) return "";
	try {
		const d = new Date(iso);
		const date = d.toLocaleDateString("vi-VN", { dateStyle: "medium" });
		const time = d.toLocaleTimeString("vi-VN", { timeStyle: "short" });
		return `${date} - ${time}`;
	} catch (e) {
		return iso;
	}
}

const RafflePaidTimeline = ({ raffle, classNames = "" }: IProps) => {
	if (!raffle || !raffle.timeline || raffle.timeline.length === 0) {
		return null;
	}
	return (
		<ol className="relative space-y-2 overflow-y-auto pr-2 flex-1 min-h-0 h-full">
			{raffle?.timeline.map((step, idx) => {
				const isCompleted =
					step.status === EnumRafflePaymentStepStatus.COMPLETED;
				const isCurrent = step.isCurrent;

				return (
					<li
						key={step.id}
						className={`relative flex w-full`}
						style={{
							opacity:
								step.status ===
								EnumRafflePaymentStepStatus.PENDING
									? 0.4
									: 1,
						}}>
						{/* vertical connector below each item (thin) */}
						<div className="flex flex-col w-2/12 items-center gap-2">
							<div
								className={`min-h-10 flex items-center justify-center w-10 h-10 rounded-full ring-8 ring-white text-lg font-bold ${
									isCompleted
										? "bg-green-500 text-white"
										: isCurrent
											? "bg-blue-500 text-white"
											: "bg-gray-300 text-gray-700"
								}`}>
								{isCompleted ? (
									<Check className="stroke-white stroke-[5px]" />
								) : null}

								{isCurrent && !isCompleted ? (
									<CircularProgress
										size={18}
										classes={{
											circle: "!stroke-white !stroke-[5px]",
										}}
									/>
								) : null}
								{!isCompleted && !isCurrent ? step.id : null}
							</div>
							{step.id !== raffle?.timeline?.length ? (
								<div
									className={`w-1 min-h-10 h-full rounded-md ${
										isCompleted
											? "bg-green-400"
											: "bg-gray-200"
									}`}
								/>
							) : null}
						</div>

						<div className="w-10/12">
							<div className="flex flex-col gap-2">
								<div className="flex justify-between items-start min-h-10 gap-4">
									<div className="flex flex-col">
										<h4 className="font-semibold text-sm line-clamp-2">
											{step.title}
										</h4>
										{step.timestamp ? (
											<div
												className="text-xs text-gray-500 leading-4
                        ">
												{formatDateTime(step.timestamp)}
											</div>
										) : null}
									</div>
									<div
										className={`px-2 py-0.5 w-fit h-fit rounded-md text-sm font-semibold whitespace-nowrap ${
											STATUS_COLOR[step.status]
										}`}>
										{
											mappingRaffleTimelineStatus[
												step.status
											]
										}
									</div>
								</div>

								<p className="text-sm text-gray-600 leading-[1.2]">
									{step.message ? (
										<div className="space-y-2">
											<div className="flex items-center gap-1 justify-between">
												<span className="bg-gray-200 px-2 py-1 rounded-sm font-semibold">
													Maker
												</span>
												<span className="text-xs">
													{formatDateTime(
														step.metadata
															?.updatedAt,
													)}
												</span>
											</div>
											<div>{step.message}</div>
										</div>
									) : (
										<span
											className={`${isCurrent || step.status === EnumRafflePaymentStepStatus.COMPLETED ? "" : "sr-only"}`}>
											{step.description}
										</span>
									)}
								</p>
							</div>

							{/* {step.imageUrl ? (
                  <div className="mt-2 w-40 h-24 relative rounded overflow-hidden border">
                    <Image
                      src={step.imageUrl}
                      alt={step.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : null} */}
						</div>
					</li>
				);
			})}
		</ol>
	);
};

export default RafflePaidTimeline;
