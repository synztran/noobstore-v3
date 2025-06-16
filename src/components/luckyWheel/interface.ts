import { Dispatch, SetStateAction } from "react";

export type PopupWarningType = "reward" | "turn" | "not_found";

export type ConditionSocialType = "FACEBOOK" | "ZALO";

export enum ENUM_MOBILE_POPUP_TYPE {
	MISSON = "MISSION",
	HISTORY = "HISTORY",
	GUILDLINE = "GUILDLINE",
}

export enum ENUM_HISTORY_BOARD_TAB {
	HISTORY_REWARD = "REWARD",
	GUILDLINE = "GUILDLINE",
	MISSION = "MISSION",
}

export enum ENUM_POPUP_SHARING_ITEM {
	FACEBOOK = "FACEBOOK",
	ZALO = "ZALO",
	TELEGRAM = "TELEGRAM",
	LINKEDIN = "LINKEDIN",
	TWITTER = "TWITTER",
	VIBER = "VIBER",
}

export enum ENUM_CONDITION_TYPE {
	SHARE = "SHARE",
	DISCOVER = "DISCOVER",
}

export interface IReward {
	index: number;
	createdBy: number;
	createdTime: string;
	itemCode: string;
	itemName: string;
	luckyWheelCode: string;
	percentage: number;
	itemUrl: string;
	backgroundColor: string;
	maxQuantity?: number;
	maxQuantityPerCustomer?: number;
	maxQuantityPerDay?: number;
	message?: string;
	reward: {
		[x: string]: string | number;
	}[];
	isActive?: boolean;
	actionName?: string;
	actionLink?: string;
}

export interface ISpinnerInfo {
	rewards: IReward[];
	radius: number;
	rotate: number | null;
	easeOut: number | null;
	angle: number | null;
	top: number | null;
	offset: number | null;
	net: number | null;
	result: IReward | null;
	spinning: boolean;
	isStop: boolean;
	luckyWheelCode: string;
	turns: number;
	description: string;
	isAcceptFreeTurn?: boolean;
	nextFreeTime?: string;
	timeToFreeTurn?: number;
	isEnableShare?: boolean;
	imageTitleWeb?: string;
	backgroundWeb?: string;
}

export interface Props {
	spinnerInfo: ISpinnerInfo;
	setSpinnerInfo: Dispatch<SetStateAction<ISpinnerInfo>>;
	setTriggerFetchTurn: Dispatch<SetStateAction<number>>;
}

export interface IResSpin {
	status: string;
	message: string;
	errorCode?: string;
	timeExcute: number;
	timeFetchAPI: number;
	data?: IReward[];
}

export interface IGetSelfWheelData {
	code: string;
	createdBy: number;
	createdTime: string;
	description: string;
	endTime: string;
	isActive: boolean;
	items: IReward[];
	lastUpdatedTime: string;
	name: string;
	scope: unknown;
	startTime: string;
	turns: number;
	isAcceptFreeTurn: boolean;
	nextFreeTime: string;
	isEnableShare: boolean;
	backgroundWeb: string;
	bannerWeb: string;
	imageTitleWeb: string;
}

export interface IGetSelfWheel {
	status: string;
	message: string;
	errorCode: string;
	data: IGetSelfWheelData[];
}

export interface ISpinnerLogData {
	accountId: number;
	createdTime: string;
	itemCode: string;
	itemImage: string;
	luckyWheelCode: string;
	message: string;
}

export interface ISpinnerLog {
	data: ISpinnerLogData[];
	total: number;
}

export interface IGetSpinnerLog {
	status: string;
	message: string;
	errorCode: string;
	data: ISpinnerLogData[];
	total: number;
}

export interface ILuckyUserData {
	accountId: number;
	createdTime: string;
	isHasGift: boolean;
	itemCode: string;
	itemImage: string;
	luckyWheelCode: string;
	message: string;
	messageHidden: string;
}
export interface IGetLuckyUserLog {
	status: string;
	message: string;
	errorCode: string;
	data: ILuckyUserData[];
	total: number;
}

export interface IWheelMissionData {
	condition: {
		actionLink: string;
		actionName: string;
		kindOfValue: string;
		minTotalValue: number;
		orderStatus: string;
		rankPoint: number;
		sellerCodes: string[];
		skus: unknown[];
		tags: unknown[];
		type: string;
		description: string;
		socialNetwork: ConditionSocialType;
	};
	processInfos: {
		isCompleted: boolean;
		target: number;
		unitName: string;
		value: number;
	}[];
	createdBy: number;
	createdTime: string;
	gamificationDetailCode: string;
	gamificationDetailID: number;
	isActive: boolean;
	lastUpdatedTime: string;
	luckyWheelCode: string;
	missionName: string;
	rewardDescription: string;
	isBlocked: boolean;
	parentMissionName: string;
}
export interface IGetWheelMission {
	status: string;
	message: string;
	errorCode: string;
	data: IWheelMissionData[];
	total: number;
}

export interface ItempPrizeElement {
	listItem: IMapRewardPosition[];
}
export interface IMapRewardPosition {
	itemX: number;
	itemY: number;
	itemW: number;
	itemH: number;
	i: number;
	itemName: string;
	itemUrl: string;
}
