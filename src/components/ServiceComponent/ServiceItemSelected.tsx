import React from "react";
import { EnumBackendServiceType } from "@/interface/Client/Service";
import { formatCurrency } from "@/utils/FormatNumber";

import { IResponseBackendTask } from "@/interface/Client/Service";
import {
	mappingLabelServiceFromBackend,
	mappingLabelServiceType,
	mappingServiceName,
} from "@/constants";
import { Divider } from "@mui/material";

const ServiceItemSelected: React.FC<{ task: IResponseBackendTask }> = ({
	task,
}) => {
	if (!task) return null;

	if (task.serviceType === EnumBackendServiceType.KEYBOARD) {
		return (
			<div key={task.taskId} className="p-4">
				<div className="flex justify-between items-center">
					<div className="flex items-center justify-start gap-2">
						<span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded min-w-[80px] text-center">
							{mappingLabelServiceType[task.serviceType]}
						</span>
						<div className="font-bold capitalize">
							{task.keyboardService?.keyboard.name}&nbsp;(
							{task?.keyboardService?.services?.length})
						</div>
					</div>
					<span className="text-sm">
						Tổng:{" "}
						{formatCurrency(task?.keyboardService?.totalPrice || 0)}
					</span>
				</div>
				{/* <div className="space-y-2">
					{task.keyboardService?.services?.map(
						(serviceItem, index) => (
							<div
								key={index}
								className="flex justify-between items-center bg-gray-50 p-2 rounded">
								<span className="text-sm">
									{
										mappingLabelServiceFromBackend[
											serviceItem.name
										]
									}
								</span>
								<span className="font-semibold text-green-600">
									{formatCurrency(serviceItem.price)}
								</span>
							</div>
						)
					)}
				</div> */}
			</div>
		);
	}

	if (task.serviceType === EnumBackendServiceType.SWITCH) {
		return (
			<div key={task.taskId} className="p-4">
				<div className="flex items-center justify-between">
					<div className="flex gap-2 items-center">
						<span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded min-w-[80px] text-center">
							{mappingLabelServiceType[task.serviceType]}
						</span>
						<h4 className="font-semibold capitalize">
							{task.switchService?.switchType?.toLowerCase()}
							&nbsp;({task.switchService?.services?.length})
						</h4>
					</div>

					<span className="text-sm">
						Tổng:{" "}
						{formatCurrency(task?.switchService?.totalPrice || 0)}
					</span>
				</div>

				{/* <div className="space-y-2">
					{task.switchService?.services?.map((serviceItem, index) => (
						<div
							key={index}
							className="flex justify-between items-center bg-gray-50 p-2 rounded">
							<span className="text-sm">
								{
									mappingLabelServiceFromBackend[
										serviceItem.name
									]
								}
							</span>
							<span className="font-semibold text-green-600">
								{formatCurrency(serviceItem.price)}
							</span>
						</div>
					))}
				</div> */}
			</div>
		);
	}

	if (task.serviceType === EnumBackendServiceType.STABILIZER) {
		return (
			<div key={task.taskId} className="p-4">
				<div className="flex items-center justify-between">
					<div className="flex gap-2 items-center">
						<span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded min-w-[80px] text-center">
							{mappingLabelServiceType[task.serviceType]}
						</span>
						<h4 className="font-semibold capitalize">
							{task.stabilizerService?.totalPrice}
							&nbsp;({task.stabilizerService?.services?.length})
						</h4>
					</div>

					<span className="text-sm">
						Tổng:{" "}
						{formatCurrency(task?.switchService?.totalPrice || 0)}
					</span>
				</div>
			</div>
		);
	}

	return <></>;
};

export default ServiceItemSelected;
