/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { getFirst, isValid } from "@/client";
import PromotionClient from "@/client/PromotionClient";
import {
	LUCKYWHEEL_ARROW_SELECTOR,
	LUCKYWHEEL_BORDER,
	LUCKYWHEEL_CENTER,
} from "@/constants/Images";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Modal from "@material-ui/core/Modal";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Close from "@material-ui/icons/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
	linearProgressClasses,
	tooltipClasses,
	TooltipProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import { useAuth } from "context/Auth";
import events from "events";
import NextImage from "next/image";
import { useRouter } from "next/router";
import { RefObject, useEffect, useRef, useState } from "react";
import NotifyUtils from "utils/NotifyUtils";
import {
	ENUM_CONDITION_TYPE,
	ENUM_HISTORY_BOARD_TAB,
	IGetSelfWheelData,
	IMapRewardPosition,
	IResSpin,
	IReward,
	ISpinnerInfo,
	ISpinnerLog,
	ItempPrizeElement,
	IWheelMissionData,
	PopupWarningType,
} from "@/interface/Client/Game";
import styles from "./styles.module.css";
import GameClient from "@/client/GameClient";
import { IResponse } from "@/interface/Client/interface";

const fakeData = [
	{
		backgroundMobile:
			"https://storage.googleapis.com/thuocsi-testing/images/20230f835a32cf4b1542e8daa02b5146",
		backgroundWeb:
			"https://gcs.buymed.com/thuocsi-testing/images/20230a991464cfb7fc300de683f0e41c",
		bannerMobile:
			"https://storage.googleapis.com/thuocsi-testing/images/2023ef6869bfbb226c965472e71134ce",
		bannerMobileHalf:
			"https://storage.googleapis.com/thuocsi-testing/images/2023f66b36b13933fd904fb8034574c1",
		bannerWeb:
			"https://gcs.buymed.com/thuocsi-testing/images/202333bd17467c1352fbd59d9a122515",
		code: "PBCGKJ91",
		createdBy: 21188,
		createdTime: "2023-11-13T06:10:00.989Z",
		description: "<p>1 2 3</p>\n",
		endTime: "2026-04-30T06:07:00Z",
		gameUrl: "",
		imageTitleMobile:
			"https://storage.googleapis.com/thuocsi-testing/images/202335cb19f5965d0585436e2c36d474",
		imageTitleWeb:
			"https://gcs.buymed.com/thuocsi-testing/images/202333bd17467c1352fbd59d9a122515",
		isAcceptFreeTurn: false,
		isActive: true,
		isEnableShare: true,
		items: [
			{
				backgroundColor: "#00b46e",
				contentNotify: "",
				createdBy: 21188,
				createdTime: "2023-11-13T06:11:01.327Z",
				groupCode: "",
				index: 1,
				isActive: true,
				isApplyForEvent: false,
				itemCode: "Num_1",
				itemName: "Sirius new king",
				itemUrl:
					"https://res.cloudinary.com/debnyyphn/image/upload/v1746258929/os0r78habfrfixvevk8l.jpg",
				lastUpdatedTime: "2024-06-28T04:10:35.659Z",
				luckyWheelCode: "PBCGKJ91",
				maxQuantity: 0,
				maxQuantityPerCustomer: 0,
				maxQuantityPerDay: 0,
				percentage: 50,
				reward: [
					{
						rewardDescription: "Ophone 14 promax",
						typeReward: "OTHER",
					},
				],
				rewardDescription: "<p></p>\n",
				urlNotify: "",
				usedItemQuantity: {
					"11_3_Num_1": 1,
					"14_3_Num_1": 1,
					"14_4_Num_1": 1,
					"14_7_Num_1": 1,
					"24_3_Num_1": 2,
					"26_3_Num_1": 1,
					"27_3_Num_1": 2,
					"9_7_Num_1": 1,
				},
				usedQuantity: 10,
			},
			{
				backgroundColor: "#00b46e",
				contentNotify: "",
				createdBy: 11193,
				createdTime: "2023-11-14T09:12:19.563Z",
				groupCode: "",
				index: 5,
				isActive: true,
				isApplyForEvent: false,
				itemCode: "TGR 1",
				itemName: "Exoboi Đường tăng",
				itemUrl:
					"https://res.cloudinary.com/debnyyphn/image/upload/v1746258929/os0r78habfrfixvevk8l.jpg",
				lastUpdatedTime: "2024-06-28T04:10:20.517Z",
				luckyWheelCode: "PBCGKJ91",
				maxQuantity: 0,
				maxQuantityPerCustomer: 0,
				maxQuantityPerDay: 0,
				percentage: 0,
				reward: [],
				rewardDescription: "<p></p>\n",
				urlNotify: "",
			},
			{
				backgroundColor: "#00b46e",
				contentNotify: "",
				createdBy: 11193,
				createdTime: "2023-11-14T09:12:37.055Z",
				groupCode: "",
				index: 6,
				isActive: true,
				isApplyForEvent: false,
				itemCode: "TGR 2",
				itemName: "Otis Old king",
				itemUrl:
					"https://res.cloudinary.com/debnyyphn/image/upload/v1746258929/os0r78habfrfixvevk8l.jpg",
				lastUpdatedTime: "2024-06-28T04:10:05.523Z",
				luckyWheelCode: "PBCGKJ91",
				maxQuantity: 0,
				maxQuantityPerCustomer: 0,
				maxQuantityPerDay: 0,
				percentage: 0,
				reward: [],
				rewardDescription: "<p></p>\n",
				urlNotify: "",
			},
			{
				backgroundColor: "#00b46e",
				contentNotify: "",
				createdBy: 11193,
				createdTime: "2023-11-14T09:12:59.805Z",
				groupCode: "",
				index: 7,
				isActive: true,
				isApplyForEvent: false,
				itemCode: "TGR 3",
				itemName: "Sirius Ngộ không",
				itemUrl:
					"https://res.cloudinary.com/debnyyphn/image/upload/v1746258929/os0r78habfrfixvevk8l.jpg",
				lastUpdatedTime: "2024-06-28T04:09:52.528Z",
				luckyWheelCode: "PBCGKJ91",
				maxQuantity: 0,
				maxQuantityPerCustomer: 0,
				maxQuantityPerDay: 0,
				percentage: 0,
				reward: [],
				rewardDescription: "<p></p>\n",
				urlNotify: "",
			},
			{
				backgroundColor: "#00b46e",
				contentNotify: "",
				createdBy: 21188,
				createdTime: "2023-11-17T04:56:03.16Z",
				groupCode: "",
				index: 8,
				isActive: true,
				isApplyForEvent: false,
				itemCode: "KM",
				itemName: "Otis Street Light",
				itemUrl:
					"https://res.cloudinary.com/debnyyphn/image/upload/v1746258929/os0r78habfrfixvevk8l.jpg",
				lastUpdatedTime: "2024-06-28T04:09:42.953Z",
				luckyWheelCode: "PBCGKJ91",
				maxQuantity: 0,
				maxQuantityPerCustomer: 0,
				maxQuantityPerDay: 0,
				percentage: 0,
				reward: [],
				rewardDescription: "<p></p>\n",
				urlNotify: "",
			},
		],
		lastUpdatedTime: "2025-02-05T03:23:48.133Z",
		mainGif: "",
		mainGifMobile: "",
		mainImage: "",
		mainImageMobile: "",
		musicUrl: "",
		name: "Vòng quay siêu cấp vip pro",
		points: 0,
		rewardGif: "",
		scope: {
			customerApplyType: "ALL",
			levels: ["all"],
			provinceCodes: ["all"],
			scopes: ["all"],
		},
		startTime: "2023-11-20T06:07:00Z",
		systemDisplay: "BUYMED",
		timeToFreeTurn: 1,
		turns: 0,
		type: "LUCKY_WHEEL",
		versionUpdate: "XRYH7JQ9",
	},
];

export const spinContainer = new events.EventEmitter();
function getRandomInt(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

// const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const subTitleOOT =
	"Bạn đã hết lượt quay, hãy làm nhiệm vụ để nhận thêm lượt quay nhé.";
const PAGE_DEFAULT = 1;

const LoaderContainer = (
	<div className={clsx(styles.historyReward_loading)}>
		<CircularProgress size="32px" color="primary" />
	</div>
);

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: 20,
	borderRadius: 10,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor:
			theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 0,
		backgroundColor: theme.palette.mode === "light" ? "#F29763" : "#F29763",
	},
}));

const domainTs = "";

const defaultvalueSpinnerLog = {
	data: [],
	total: 0,
};

const LuckyWheelPrizeTooltip = styled(
	({ className, ...props }: TooltipProps) => (
		// eslint-disable-next-line react/no-children-prop
		(<Tooltip
			classes={{ popper: className }}
			children={props.children}
			title={props.title as string}
		/>)
	)
)(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.white,
		boxShadow: "0px 4px 4px 0px #0000001F;",
	},
}));

const drawReward = (
	ctx: CanvasRenderingContext2D,
	PI: number,
	sweep: number,
	img: HTMLImageElement,
	itemW: number,
	itemH: number,
	itemX: number,
	itemY: number,
	text: string,
	cx: number,
	cy: number,
	radius: number,
	angle: number,
	arcsweep: number,
	color: string
) => {
	ctx.save();
	// Reward
	ctx.translate(cx * 2, cy * 2);
	ctx.rotate(angle);
	ctx.beginPath();
	// Stroke
	ctx.lineWidth = 5;
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	ctx.lineTo(0, 0);
	ctx.arc(0, 0, radius, 0, arcsweep);
	ctx.closePath();
	ctx.strokeStyle = "transparent";
	ctx.stroke();
	// Background
	ctx.fillStyle = color ?? "#fff"; // color bg
	ctx.fill();
	// Item
	ctx.rotate(PI / 2 + sweep / 2);
	ctx?.drawImage(img, itemX, itemY, itemW, itemH);
	// restore the context to its original state
	ctx.restore();
};

const LuckyWheelContainer = (): JSX.Element => {
	const router = useRouter();
	const { user }: any = useAuth();

	const [spinnerInfo, setSpinnerInfo] = useState<ISpinnerInfo>({
		rewards: [],
		luckyWheelCode: "",
		radius: 340, // PIXEL
		rotate: 0, // DEGREES
		easeOut: 0, // SECONDS
		angle: 0, // RADIANSs
		top: null, // INDEX
		offset: null, // RADIANS
		net: null, // RADIANS
		result: null, // INDEX
		spinning: false,
		isStop: true, // is RotateStop ?
		turns: 0,
		description: "",
		isAcceptFreeTurn: false,
		nextFreeTime: "",
		backgroundWeb: "",
		imageTitleWeb: "",
	});

	const [spinnerLog, setSpinnerLog] = useState<ISpinnerLog>(
		defaultvalueSpinnerLog
	);

	const [historyBoardTab, setHistoryBoardTab] = useState(
		ENUM_HISTORY_BOARD_TAB.MISSION
	);
	const [rewardIdxMap, setRewardIdxMap] = useState(new Map<string, number>());

	const [isOpenPopup, setOpenPopup] = useState({
		outOfTurn: false,
		outOfReward: false,
		notFound: false,
		gotPrize: false,
	});

	const [triggerFetchTurn, setTriggerFetchTurn] = useState(0);
	const [historyReward, setHistoryReward] = useState({
		isFetching: false,
		isHasMore: true,
		isLoading: false,
	});

	const [pageScroll, setPageScroll] = useState(PAGE_DEFAULT);

	const [spinnerMission, setSpinnerMission] = useState<IWheelMissionData[]>(
		[]
	);
	const [isNextFreeSpin, setNextFreeSpin] = useState(false);
	const [shouldScroll, setShouldScroll] = useState(false);
	const [gamificationDetailID, setGamificationDetailID] = useState<number>();
	const [isEffectOOT, setEffectOOT] = useState(false);
	const [isShowSharing, setShowSharing] = useState(false);
	const [redirectLink, setRedirectLink] = useState(domainTs);
	const [isLoadingWheel, setLoadingWheel] = useState(true);
	const [mapRewardPosition, setMapRewardPosition] = useState<
		IMapRewardPosition[]
	>([]);

	const btnSpinRef = useRef<HTMLDivElement>(null);
	const btnSpinHeadRef = useRef<HTMLDivElement>(null);
	const didMountRef = useRef(false);
	const spinnerInfoRef = useRef(spinnerInfo);

	const renderWheel = () => {
		// determine number/size of sectors that need to created
		const numOptions = spinnerInfo.rewards.length || 0;
		const centralAngle = 360 * (1 / numOptions) * (Math.PI / 180);

		setSpinnerInfo((prev: any) => ({ ...prev, angle: centralAngle }));
		// get index of starting position of selector
		topPosition(numOptions, centralAngle);
		// dynamically generate sectors from state list
		for (let i = 0; i < numOptions; i += 1) {
			renderSector();
		}
	};

	const renderBorder = () => {
		const canvas = document.getElementById(
			"border-wheel"
		) as HTMLCanvasElement;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			const cw = canvas.width;
			const ch = canvas.height;
			const backgroundWheel = new Image();
			backgroundWheel.src = LUCKYWHEEL_BORDER;

			if (ctx) {
				backgroundWheel.onload = () => {
					ctx.clearRect(0, 0, cw, ch);
					ctx.drawImage(
						backgroundWheel,
						cw - 397.5,
						ch - 395,
						cw - 5,
						ch - 10
					);
				};
			}
		}
	};

	const renderSelector = () => {
		const canvas = document.getElementById(
			"selector-wheel"
		) as HTMLCanvasElement;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			const cw = canvas.width;
			const ch = canvas.height;
			const selectorWheel = new Image();
			selectorWheel.src = LUCKYWHEEL_ARROW_SELECTOR;
			if (ctx) {
				selectorWheel.onload = () => {
					ctx.clearRect(0, 0, cw, ch);
					ctx.drawImage(selectorWheel, cw / 2 - 14, 0, 30, 87);
				};
			}
		}
	};

	const renderCenterWheel = () => {
		const canvas = document.getElementById(
			"center-wheel"
		) as HTMLCanvasElement;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			const cw = canvas.width;
			const ch = canvas.height;
			const backgroundWheel = new Image();
			backgroundWheel.src = LUCKYWHEEL_CENTER;

			if (ctx) {
				backgroundWheel.onload = () => {
					ctx.clearRect(0, 0, cw, ch);
					ctx.shadowColor = "black";
					ctx.shadowBlur = 22;
					ctx.drawImage(
						backgroundWheel,
						cw / 2 - 25,
						ch / 2 - 25,
						cw / 8,
						ch / 8
					); // 400
				};
			}
		}
	};

	const renderSector = () => {
		const canvas = document.getElementById("wheel") as HTMLCanvasElement;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			const cw = canvas.width * 2;
			const ch = canvas.height * 2;

			const { PI } = Math;
			const PI2 = PI * 2;
			const rewardCount = spinnerInfo.rewards.length;
			const sweep = PI2 / rewardCount;

			const cx = cw / 8;
			const cy = ch / 8;
			const { radius } = spinnerInfo;
			if (ctx) {
				initDrawReward(ctx, PI, sweep, cx, cy, radius);
			}
		}
	};

	const topPosition = (num: number, angle: number) => {
		// find position of arrow selector
		// set starting index and angle offset based on list length
		// works upto 12 options
		let topSpot: number | null = null;
		let degreesOff: number | null = null;

		if (num <= 3) {
			if (num === 2) {
				// with set 90deg wheel
				topSpot = num;
				degreesOff = Math.PI / 2;
			}
			if (num === 3) {
				// with set 90deg wheel
				topSpot = num;
				degreesOff = (2 * Math.PI) / 3;
			}
		} else {
			topSpot = num;
			degreesOff = 0;
		}

		setSpinnerInfo((prev: any) => ({
			...prev,
			top: topSpot as number,
			offset: degreesOff,
		}));
	};

	const loadImage = (image: HTMLImageElement) => {
		return new Promise((resolve, reject) => {
			// eslint-disable-next-line no-param-reassign
			image.onload = () => resolve(image);
			// eslint-disable-next-line no-param-reassign
			image.onerror = (err) => reject(err);
		});
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const initDrawReward = async (
		ctx: CanvasRenderingContext2D,
		PI: number,
		sweep: number,
		cx: number,
		cy: number,
		radius: number | null
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	): Promise<any> => {
		const rewardCount = spinnerInfo.rewards.length;
		const arrRewardPosition: IMapRewardPosition[] = [];
		for (let i = 0; i < rewardCount; i++) {
			const reward = spinnerInfo.rewards[i];
			if (!reward) return;
			const {
				itemName: name,
				itemUrl: imageUrl,
				backgroundColor: bgc = "#fff",
			} = reward;
			console.log(spinnerInfo.rewards[i]);
			console.log(name, imageUrl, bgc);
			const image = new Image();
			image.src = imageUrl;
			console.log(image.src);
			try {
				// eslint-disable-next-line no-await-in-loop
				await loadImage(image);
			} catch (err) {
				console.error("Image loading faild", err);
			}

			// Init parameter for image on wheel
			let imageItemW = 0;
			let imageItemH = 0;
			let imageItemX = 0;
			let imageItemY = 0;

			// item is square
			if (image.naturalWidth === image.naturalHeight) {
				if (rewardCount > 9) {
					// item wheelPrizes more than 9, width & height of prize is 116
					imageItemW = 116;
					imageItemH = 116;
					imageItemX = -(radius as number) + 280; // center position between x & y of a piece prize
					imageItemY = -(radius as number) + 10; // distance from center of wheel
				} else {
					// item wheelPrizes less than 9, width & height of prize is 128
					imageItemW = 128;
					imageItemH = 128;
					imageItemX = -(radius as number) + 280; // center position between x & y of a piece prize
					imageItemY = -(radius as number) + 15; // distance from center of wheel
				}
			}

			// case imagePrize upload not is square
			if (image.naturalWidth !== image.naturalHeight) {
				if (rewardCount >= 10) {
					// item wheelPrizes more than 9, width is 128, height is 64
					imageItemW = 128;
					imageItemH = 64;
					imageItemX = -(radius as number) + 275; // center position between x & y of a piece prize
					imageItemY = -(radius as number) + 20; // distance from center of wheel
				} else if (rewardCount > 6 && rewardCount < 10) {
					// item wheelPrizes between 6 and 10, make image bigger when prize have fewer prize, width is 148, height is 84
					imageItemW = 148;
					imageItemH = 84;
					imageItemX = -(radius as number) + 265; // center position between x & y of a piece prize
					imageItemY = -(radius as number) + 20; // distance from center of wheel
				} else {
					// item wheelPrizes less than 6, make image bigger when prize have fewer prize, width is 204, height is 102
					imageItemW = 204;
					imageItemH = 102;
					imageItemX = -(radius as number) + 240; // center position between x & y of a piece prize
					imageItemY = -(radius as number) + 20; // distance from center of wheel
				}
			}

			// TODO: render tempPosition then use tooltip to display detail of prize, withou addEvent mousemove
			const calcPosition = (
				image: HTMLImageElement,
				imageItemW: number,
				imageItemH: number
			) => {
				if (image.naturalWidth === image.naturalHeight) {
					if (rewardCount >= 10) {
						// case have more than 10 prize, x & y will count from fist base half of circle +- n, make circle all item is around center wheel
						// then mutiply by angle of each prize, Math.cos for x and Math.sin for y
						// plus with w & h of prize then plus error rate
						return {
							x:
								(265 / 2 + 1) * Math.cos(sweep * i) +
								imageItemW +
								25,
							y:
								(265 / 2 + 1) * Math.sin(sweep * i) +
								imageItemH +
								25,
						};
					}
					// in case less than 10 items, w & h of prize is bigger, So need adjust a base  and eror rate
					return {
						x:
							(250 / 2 + 3) * Math.cos(sweep * i) +
							imageItemW +
							10,
						y:
							(250 / 2 + 3) * Math.sin(sweep * i) +
							imageItemH +
							10,
					};
				}

				return {
					x: 0,
					y: 0,
				};
			};

			if (image) {
				arrRewardPosition.push({
					itemX: calcPosition(image, imageItemW, imageItemH)?.x ?? 0,
					itemY: calcPosition(image, imageItemW, imageItemH)?.y ?? 0,
					itemW: imageItemW / 2,
					itemH: imageItemH / 2,
					i,
					itemName: name,
					itemUrl: imageUrl,
				});
			}

			drawReward(
				ctx,
				PI,
				sweep,
				image,
				imageItemW,
				imageItemH,
				imageItemX,
				imageItemY,
				name,
				cx,
				cy,
				radius as number,
				sweep * i,
				sweep,
				bgc
			);
		}
		setMapRewardPosition(arrRewardPosition);
	};

	const spin = async () => {
		// TODO: Get detail reward
		if (!spinnerInfo.luckyWheelCode) {
			NotifyUtils.error(
				"Không tìm thấy thông tin vòng quay, vui lòng thử lại !"
			);
			return;
		}

		let resSpin: IResSpin;
		const currentDate = new Date();
		let nextTimeDate;

		if (spinnerInfo.nextFreeTime) {
			nextTimeDate = new Date(spinnerInfo?.nextFreeTime);
		}

		const isFreeSpin =
			currentDate.getTime() > (nextTimeDate as Date)?.getTime();

		if (spinnerInfo.isAcceptFreeTurn && isFreeSpin) {
			// free spin
			resSpin = await GameClient.postSpinWheel({
				wheelCode: spinnerInfo.luckyWheelCode,
				isFree: true,
			});
		} else {
			resSpin = await GameClient.postSpinWheel({
				wheelCode: spinnerInfo.luckyWheelCode,
			});
		}

		if (resSpin && resSpin.data) {
			activeButtonSpin();
			const reward = resSpin.data[0];
			if (!reward) {
				return;
			}
			const { index, itemCode } = reward;
			let idx;
			if (rewardIdxMap.get(itemCode)) {
				idx =
					(spinnerInfo.top as number) -
					(rewardIdxMap.get(itemCode) ?? index); // idx will start at 0
			} else {
				// keep allow rotate, accept wrong place spin on, but make sure display correct reward
				idx = null;
			}

			// TODO: specify will base on value from API by id
			let specifySpin = 0;
			const fullRots = Math.floor(Math.random() * 5) + 5; // Full spins the wheel should turn (min = 5, max = 10)
			if (idx === null) {
				specifySpin = fullRots * 360;
			} else {
				const arcLength = (2 * Math.PI) / spinnerInfo.rewards.length;
				const rotMax = arcLength * idx + arcLength - arcLength / 5; // reduce 20% width replace for wrong rate
				const rotMin =
					arcLength * (idx + 1) - arcLength + arcLength / 5; // add 20% width replace for wrong rate
				specifySpin =
					fullRots * 360 + getRandomInt(rotMin, rotMax) * RAD_TO_DEG;
			}

			setSpinnerInfo((prev: any) => ({
				...prev,
				rotate: specifySpin,
				easeOut: 4,
				spinning: true,
				isStop: false,
				turns: isFreeSpin ? prev.turns : prev.turns - 1,
			}));

			// calcalute result after wheel stops spinning
			setTimeout(() => {
				if (!resSpin?.data?.[0]) return;
				const formatData: IReward = {
					index: resSpin.data[0].index || 0,
					createdBy: resSpin.data[0].createdBy || 0,
					createdTime:
						resSpin.data[0].createdTime || new Date().toISOString(),
					itemCode: resSpin.data[0].itemCode || "",
					itemName: resSpin.data[0].itemName || "",
					luckyWheelCode: resSpin.data[0].luckyWheelCode || "",
					percentage: resSpin.data[0].percentage || 0,
					itemUrl: resSpin.data[0].itemUrl || "",
					backgroundColor: resSpin.data[0].backgroundColor || "#fff",
					reward: resSpin.data[0].reward || [],
					message: resSpin.message,
					maxQuantity: resSpin.data[0].maxQuantity,
					maxQuantityPerCustomer:
						resSpin.data[0].maxQuantityPerCustomer,
					maxQuantityPerDay: resSpin.data[0].maxQuantityPerDay,
					isActive: resSpin.data[0].isActive,
					actionName: resSpin.data[0].actionName,
					actionLink: resSpin.data[0].actionLink,
				};
				getResult(formatData);
			}, 4000);
		} else {
			// empty turn wheel
			switch (resSpin.errorCode) {
				case "NOT_ENOUGH_ITEM": {
					setOpenPopup((prev) => ({ ...prev, outOfReward: true }));
					break;
				}
				case "NOT_FOUND": {
					setOpenPopup((prev) => ({ ...prev, notFound: true }));
					break;
				}
				default: {
					// remove popup only show effect and change tab
					setHistoryBoardTab(ENUM_HISTORY_BOARD_TAB.MISSION);
					setEffectOOT(true);
					break;
				}
			}
			inActiveBtnSpin();
		}
	};

	const getResult = (reward: IReward) => {
		// set state variable to display result
		setSpinnerInfo((prev: any) => ({
			...prev,
			result: reward,
			isStop: true,
		}));

		setTriggerFetchTurn((prev) => prev + 1);

		setOpenPopup((prev) => ({
			...prev,
			gotPrize: true,
		}));
	};

	const reset = () => {
		// reset wheel and result
		setSpinnerInfo((prev: any) => ({
			...prev,
			rotate: 0,
			easeOut: 0,
			result: null,
			spinning: false,
		}));
	};

	const handleResetPopupPrize = () => {
		// reset wheel and result
		setSpinnerInfo((prev: any) => ({
			...prev,
			rotate: 0,
			easeOut: 0,
			result: null,
			spinning: false,
		}));

		inActiveBtnSpin();

		setOpenPopup((prev) => ({
			...prev,
			gotPrize: false,
		}));
	};

	const handleClosePopup = () => {
		setOpenPopup({
			gotPrize: false,
			outOfReward: false,
			outOfTurn: false,
			notFound: false,
		});
	};

	const handleReloadPage = () => {
		router.reload();
	};

	const handlePopupSharing = () => {
		if (router.pathname === "/khuyenmai") {
			setRedirectLink(`https://thuocsi.vn/lucky-wheel`);
		} else {
			setRedirectLink(`https://thuocsi.vn${router.pathname}`);
		}
		setShowSharing(!isShowSharing);
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleScrollToBottom = (e: any) => {
		const bottom =
			Math.abs(
				e.target.scrollHeight -
					e.target.scrollTop -
					e.target.clientHeight
			) <= 10;
		if (bottom) {
			if (
				spinnerLog &&
				(!spinnerLog?.data ||
					spinnerLog.total <= 20 ||
					spinnerLog?.data.length >= spinnerLog?.total)
			) {
				setHistoryReward({
					...historyReward,
					isHasMore: false,
				});
			}
			if (historyReward.isHasMore && !historyReward.isLoading) {
				setPageScroll((prev) => prev + 1);
			}
		}
	};

	const activeButtonSpin = () => {
		if (btnSpinHeadRef && btnSpinHeadRef.current) {
			btnSpinHeadRef?.current?.classList.add(
				styles.btnSpin_active as string
			);
		}
	};

	const inActiveBtnSpin = () => {
		if (btnSpinHeadRef && btnSpinHeadRef.current) {
			btnSpinHeadRef?.current?.classList.remove(
				styles.btnSpin_active as string
			);
		}
	};

	const reRenderMission = async () => {
		// const selfWheelMissionRes: IGetWheelMission =
		// 	await getMissionSelfLuckyWheel({
		// 		luckyWheelCode: spinnerInfo.luckyWheelCode,
		// 	});
		// if (isValid(selfWheelMissionRes)) {
		// 	const { data }: IGetWheelMission = selfWheelMissionRes;
		// 	if (data) {
		// 		setSpinnerMission(data.filter((item) => item.isActive));
		// 	}
		// }
	};

	const handleFindMoreTurn = () => {
		setHistoryBoardTab(ENUM_HISTORY_BOARD_TAB.MISSION);
		setEffectOOT(true);
		setOpenPopup({
			gotPrize: false,
			outOfReward: false,
			outOfTurn: false,
			notFound: false,
		});
	};

	useEffect(() => {
		// get wheel and wheel's log
		(async () => {
			// const selfWheelRes: IGetSelfWheelData;
			// } = await PromotionClient.getLuckyWheel();

			if (true) {
				// const {
				// 	code,
				// 	rewards,
				// 	turns,
				// 	description,
				// 	nextFreeTime,
				// 	isAcceptFreeTurn,
				// 	isEnableShare,
				// 	imageTitleWeb,
				// 	backgroundWeb,
				//   // }: IGetSelfWheelData | null = selfWheelRes.data[0] || null;
				// }: IGetSelfWheelData | null = fakeData[0];

				const {
					nextFreeTime,
					items,
					code,
					description,
					isAcceptFreeTurn,
					isEnableShare,
					imageTitleWeb,
					backgroundWeb,
					turns,
				} = fakeData[0] as IGetSelfWheelData;

				// const selfLogRes: IGetLuckyUserLog = await getLogSelfLuckyWheel(
				// 	{ luckyWheelCode: code, limit: PAGE_DEFAULT * 20 }
				// );

				// const selfWheelMissionRes: IGetWheelMission =
				// 	await getMissionSelfLuckyWheel({ luckyWheelCode: code });

				if (!items || items.length === 0) {
					setLoadingWheel(false);
					return;
				}

				const currentDate = new Date();
				const wheelNextFreeTime = new Date(nextFreeTime as string);
				const checkNextFreeTime =
					currentDate.getTime() >= wheelNextFreeTime.getTime();

				setSpinnerInfo((prev: any) => ({
					...prev,
					luckyWheelCode: code,
					turns: checkNextFreeTime ? turns + 1 : turns,
					rewards:
						items
							?.filter((item: any) => item.isActive)
							.sort((a: any, b: any) => a.index - b.index) || [],
					description,
					nextFreeTime,
					isAcceptFreeTurn,
					isEnableShare,
					imageTitleWeb: imageTitleWeb || "",
					// getLinkProxyCDN(imageTitleWeb) || LUCKYWHEEL_TITLE,
					backgroundWeb: backgroundWeb || "",
					// getLinkProxyCDN(backgroundWeb) ||
					// LUCKYWHEEL_DEFAULT_BACKGROUND,
				}));

				const newSpinnerIdxMap = new Map(
					items
						?.filter((item: any) => item.isActive)
						.sort((a: any, b: any) => a.index - b.index)
						?.map((child: any, idx: any) => [
							child.itemCode,
							idx + 1,
						])
				);

				setRewardIdxMap(newSpinnerIdxMap);

				// if (isValid(selfLogRes)) {
				// 	const { data, total }: IGetSpinnerLog = selfLogRes;

				// 	if (data && total && total > 0) {
				// 		setSpinnerLog(selfLogRes);
				// 	}
				// }

				// if (isValid(selfWheelMissionRes)) {
				// 	const { data }: IGetWheelMission = selfWheelMissionRes;

				// 	if (data) {
				// 		setSpinnerMission(data.filter((item) => item.isActive));
				// 	}
				// }
			}
			setLoadingWheel(false);
		})();
	}, [triggerFetchTurn, isNextFreeSpin]);

	useEffect(() => {
		// render wheel part
		if (spinnerInfo?.rewards?.length > 0) {
			renderWheel();
			renderBorder();
			renderSelector();
			renderCenterWheel();
		}
	}, [spinnerInfo.rewards]);

	// useEffect(() => {
	// 	if (didMountRef.current) {
	// 		(async () => {
	// 			if (pageScroll !== 1) {
	// 				setHistoryReward({ ...historyReward, isLoading: true });
	// 				const selfLogRes: IGetSpinnerLog =
	// 					await getLogSelfLuckyWheel({
	// 						luckyWheelCode: spinnerInfo.luckyWheelCode,
	// 						limit: pageScroll * 20,
	// 					});
	// 				if (
	// 					selfLogRes.status === "NOT_FOUND" ||
	// 					!historyReward.isHasMore
	// 				) {
	// 					setHistoryReward({
	// 						...historyReward,
	// 						isHasMore: false,
	// 						isLoading: false,
	// 					});
	// 				} else if (historyReward.isHasMore) {
	// 					if (spinnerLog && spinnerLog.data) {
	// 						setSpinnerLog((prev) => ({
	// 							...prev,
	// 							data: [...getData(selfLogRes)],
	// 							total: selfLogRes.total,
	// 						}));
	// 						setHistoryReward({
	// 							...historyReward,
	// 							isLoading: false,
	// 						});
	// 					}
	// 				}
	// 			}
	// 		})();
	// 	} else {
	// 		didMountRef.current = true;
	// 	}
	// 	return () => {
	// 		setHistoryReward({
	// 			isFetching: false,
	// 			isHasMore: true,
	// 			isLoading: false,
	// 		});
	// 	};
	// }, [pageScroll]);

	useEffect(() => {
		const intervalFreeSpin = setInterval(() => {
			const currentDate = new Date();
			if (
				currentDate.getTime() >=
				new Date(
					spinnerInfoRef?.current?.nextFreeTime as string
				).getTime()
			) {
				setNextFreeSpin(true);
			} else {
				setNextFreeSpin(false);
			}
		}, 1000);

		return () => {
			clearInterval(intervalFreeSpin);
		};
	}, []);

	useEffect(() => {
		spinnerInfoRef.current = spinnerInfo;
	}, [spinnerInfo]);

	useEffect(() => {
		spinContainer.on("misson", () => {
			setHistoryBoardTab(ENUM_HISTORY_BOARD_TAB.MISSION);
		});
		spinContainer.on("history", () => {
			setHistoryBoardTab(ENUM_HISTORY_BOARD_TAB.HISTORY_REWARD);
		});
		spinContainer.on("guideline", () => {
			setHistoryBoardTab(ENUM_HISTORY_BOARD_TAB.GUILDLINE);
		});
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShouldScroll(true);
		}, 3000); // Adjust the delay time as needed

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		const parentEle = document.getElementById("spinnerWrapper");
		if (parentEle) {
			parentEle.scrollLeft = 350;
		}
	}, [shouldScroll]);

	useEffect(() => {
		if (isEffectOOT) {
			setTimeout(() => {
				setEffectOOT(false);
			}, 5000);
		}
	}, [isEffectOOT]);

	const TitleTooltip = ({
		name,
		url,
	}: {
		name: string;
		url: string;
	}): JSX.Element => {
		return (
            <Box className={styles.tooltipPrizeWrapper}>
                <Box className={styles.tooltipImageWrapper}>
					<NextImage src={url} alt={name} className="object-contain" fill sizes="100vw" />
				</Box>
                <Typography variant="body2" className={styles.tooltipPrizeText}>
					{name}
				</Typography>
            </Box>
        );
	};

	const TempPrizeElement = (props: ItempPrizeElement) => {
		const { listItem } = props;

		const containerDegree = () => {
			switch (listItem.length) {
				case 12:
					return -90 + 15;
				case 11:
					return -90 + 16;
				case 10:
					return -90 + 17;
				case 9:
					return -90 + 20;
				case 8:
					return -90 + 23;
				case 7:
					return -90 + 26;
				case 6:
					return -90 + 31;
				case 5:
					return -90 + 37;
				case 4:
					return -90 + 46;
				case 3:
					return -90 + 61;
				case 1:
					return -90 + 181;
				default:
					return 0;
			}
		};

		return (
			<Box
				style={{
					position: "absolute",
					height: spinnerInfo?.radius,
					width: spinnerInfo?.radius,
					translate: "-50% -50%",
					rotate: containerDegree() + "deg",
					top: "50%",
					left: "50%",
				}}>
				{listItem
					?.sort((a, b) => a.i - b.i)
					?.map((item, idx) => (
						<LuckyWheelPrizeTooltip
							key={`prize_${item.i}`}
							title={
								<TitleTooltip
									name={item.itemName}
									url={item.itemUrl}
									key={item.i}
								/>
							}
							style={{ backgroundColor: "#fff" }}
							arrow>
							<div
								id={`tempPrizePostion_${item.i}`}
								style={{
									width: item.itemW,
									height: item.itemH,
									top: item.itemY,
									left: item.itemX,
									rotate: `${
										-90 +
										item.i *
											(360 / spinnerInfo.rewards?.length)
									}deg`,
									zIndex: 1,
									// border: '1px solid red',
								}}
								className={styles.tempPrizePosition}
								data-name={item.itemName}
								data-url={item.itemUrl}
							/>
						</LuckyWheelPrizeTooltip>
					))}
			</Box>
		);
	};

	if (!user) {
		return <div />;
	}

	if (spinnerInfo && spinnerInfo.rewards?.length === 0) {
		if (!isLoadingWheel) {
			return (
				<Box
					width="100%"
					height={200}
					display="flex"
					alignItems="center"
					justifyContent="center">
					<Typography
						variant="body1"
						style={{
							color: "#000",
							fontFamily: "ggsr",
							fontSize: 18,
							textAlign: "center",
						}}>
						Vòng quay hiện tại chưa diễn ra. Vui lòng thử lại sau.
					</Typography>
				</Box>
			);
		}
		return <div />;
	}

	return (
        <div id="spinnerWrapper" className={styles.spinnerReward_wrapper}>
            <Grid
				container
				className={styles.luckyWheel_container}
				// style={{
				// 	backgroundImage: `url(${spinnerInfo.backgroundWeb})`,
				// }}
			>
				{/* title */}
				<Grid
					item
					sm={3}
					md={3}
					className={styles.sectionWheelTitle_container}>
					<div
						className={styles.wheelTitle_imageWrapper}
						// style={{
						// 	backgroundImage: `url(${spinnerInfo.imageTitleWeb})`,
						// }}
					/>
					{/* <CountDownLuckyUser code={spinnerInfo.luckyWheelCode} /> */}
				</Grid>
				{/* wheel */}
				<Grid item sm={5} md={5}>
					<Box
						style={{
							position: "relative",
							width: "400px",
							borderRadius: "12px",
							margin: "0 auto",
						}}>
						<Box className={styles.drawCanvas_container}>
							<div
								id="spin_1"
								className={styles.luckyWheel_central}
							/>
							<div className={styles.luckyWheel_borderWheel} />
							<div className={styles.luckyWheel_selector} />
							<canvas
								className={styles.canvasContainer}
								id="wheel"
								width="800"
								height="800"
								style={{
									WebkitTransform: `rotate(${
										(spinnerInfo.rotate as number) - 90
									}deg)`,
									WebkitTransition: `-webkit-transform ${spinnerInfo.easeOut}s ease-out`,
									zIndex: 0,
									width: "100%",
								}}
							/>
							{/* {isEffectOOT && (
								<ArrowAnimation
									isWhite
									classes={styles.positionArrowEffect}
								/>
							)} */}
							{!spinnerInfo.spinning ? (
								<TempPrizeElement
									listItem={mapRewardPosition}
								/>
							) : null}
						</Box>
						<ButtonSpin
							spin={spin}
							reset={reset}
							btnSpinHeadRef={btnSpinHeadRef}
							btnSpinRef={btnSpinRef}
							isSpinning={spinnerInfo.spinning}
							isStop={spinnerInfo.isStop}
							turns={spinnerInfo.turns}
						/>
					</Box>
				</Grid>
				{/* historyReward */}
				<Box className={styles.boxHistoryReward}>
					<Box
						style={{
							position: "relative",
							height: "100%",
							width: "100%",
						}}>
						<Grid
							item
							sm={4}
							md={4}
							className={styles.historyBoard}
							id="spin_4">
							<Grid container className={styles.boardTab}>
								<Grid
									item
									sm={4}
									md={4}
									className={clsx(
										styles.missionTab,
										historyBoardTab ===
											ENUM_HISTORY_BOARD_TAB.MISSION &&
											styles.active
									)}
									onClick={() =>
										setHistoryBoardTab(
											ENUM_HISTORY_BOARD_TAB.MISSION
										)
									}>
									{/* <ImageFallbackStatic
										src={LUCKYWHEEL_MISSION_ICON}
										alt="mission icon"
										width={29}
										height={40}
										style={{
											userSelect: "none",
											pointerEvents: "none",
										}}
									/> */}
									<Typography
										style={{
											textAlign: "center",
										}}>
										Nhiệm vụ
									</Typography>
								</Grid>
								<Grid
									item
									sm={4}
									md={4}
									className={clsx(
										styles.historyReward,
										historyBoardTab ===
											ENUM_HISTORY_BOARD_TAB.HISTORY_REWARD &&
											styles.active
									)}
									onClick={() =>
										setHistoryBoardTab(
											ENUM_HISTORY_BOARD_TAB.HISTORY_REWARD
										)
									}>
									{/* <ImageFallbackStatic
										src={LUCKYWHEEL_TIME_ICON}
										alt="mission icon"
										width={32}
										height={40}
										style={{
											userSelect: "none",
											pointerEvents: "none",
										}}
									/> */}
									<Typography
										style={{
											textAlign: "center",
										}}>
										Lịch sử
									</Typography>
								</Grid>
								<Grid
									item
									sm={4}
									md={4}
									className={clsx(
										styles.guildLine,
										historyBoardTab ===
											ENUM_HISTORY_BOARD_TAB.GUILDLINE &&
											styles.active
									)}
									onClick={() =>
										setHistoryBoardTab(
											ENUM_HISTORY_BOARD_TAB.GUILDLINE
										)
									}>
									{/* <ImageFallbackStatic
										src={LUCKYWHEEL_GUILDLINE_ICON}
										alt="guidline icon"
										width={60}
										height={40}
										style={{
											userSelect: "none",
											pointerEvents: "none",
										}}
									/> */}
									<Typography
										style={{
											textAlign: "center",
										}}>
										Hướng dẫn
									</Typography>
								</Grid>
							</Grid>
							{historyBoardTab ===
								ENUM_HISTORY_BOARD_TAB.HISTORY_REWARD &&
								spinnerLog &&
								spinnerLog.total > 0 && (
									<Box
										className={clsx(styles.boardContainer)}>
										{historyReward.isLoading &&
											LoaderContainer}
										<Box
											className={
												styles.boardContainer_childList
											}
											onScroll={handleScrollToBottom}>
											{spinnerLog?.data?.map((item) => (
												<Grid
													key={item.itemCode}
													container
													className={
														styles.boardItem_container
													}>
													<Grid
														item
														md={3}
														className={
															styles.boardItem_imageWrapper
														}>
														<NextImage
                                                            // src={getLinkProxyCDN(
                                                            // 	item.itemImage ??
                                                            // 		""
                                                            // )}
                                                            src={
																item.itemImage ??
																""
															}
                                                            width={80}
                                                            height={40}
                                                            alt=""
                                                            style={{
                                                                maxWidth: "100%",
                                                                height: "auto"
                                                            }} />
													</Grid>
													<Grid item md={9}>
														<Typography
															variant="body2"
															className={
																styles.boardItem_itemName
															}>
															{" "}
															{item?.message
																?.replace(
																	"Nhận được",
																	""
																)
																.replace(
																	"từ vòng quay may mắn",
																	""
																)}
														</Typography>
														<span
															className={
																styles.boardItem_created
															}>
															{/* {format(
																new Date(
																	item.createdTime
																),
																"HH:mm dd/MM/yyyy"
															)} */}
														</span>
													</Grid>
												</Grid>
											))}
										</Box>
									</Box>
								)}
							{historyBoardTab ===
								ENUM_HISTORY_BOARD_TAB.GUILDLINE && (
								<Box className={clsx(styles.boardGuildLine)}>
									<Box
										className={
											styles.historyBoard_guildContainer
										}>
										<div
											className={
												styles.historyBoard_guildLineText
											}
											dangerouslySetInnerHTML={{
												__html: spinnerInfo.description,
											}}
										/>
									</Box>
								</Box>
							)}
							{historyBoardTab ===
								ENUM_HISTORY_BOARD_TAB.MISSION && (
								<Box
									className={clsx(
										styles.boardContainer,
										isEffectOOT && styles.glowOnEffect
									)}>
									<Box
										className={
											styles.boardContainer_childList
										}>
										{spinnerMission
											?.filter((item) => item.isActive)
											?.map((item) => (
												<Box
													key={item.createdTime}
													className={
														styles.boardMissionItem_container
													}>
													<Box>
														<Typography
															variant="body2"
															className={
																styles.boardMissionItem_itemName
															}>
															{" "}
															{item.missionName}
														</Typography>

														<div
															className={
																styles.boardItemMission_content
															}
															dangerouslySetInnerHTML={{
																__html:
																	item
																		?.condition
																		?.description ||
																	"",
															}}
														/>

														<Box
															className={clsx(
																item
																	?.processInfos
																	?.length >
																	0 &&
																	styles.processBar_container
															)}>
															{item.processInfos &&
																item.processInfos?.map(
																	(process) =>
																		process.target !==
																			1 && (
																			<Box
																				style={{
																					display:
																						"flex",
																					flexDirection:
																						"column",
																					gap: 4,
																				}}>
																				<Typography
																					style={{
																						color: "#000",
																					}}
																					variant="body2">
																					{
																						process.unitName
																					}
																				</Typography>
																				<Box
																					sx={{
																						width: "100%",
																						mr: 1,
																						position:
																							"relative",
																					}}>
																					<BorderLinearProgress
																						variant="determinate"
																						value={
																							process.value /
																								process.target >
																							1
																								? 100
																								: (process.value /
																										process.target) *
																								  100
																						}
																					/>
																					<span
																						style={{
																							position:
																								"absolute",
																							top: 0,
																							left: "50%",
																							transform:
																								"translate(-50%, -5%)",
																							fontSize:
																								"14px",
																							fontFamily:
																								"ggsr",
																							lineHeight:
																								"22px",
																						}}>
																						{/* {`${formatNumber(process.value)}/${formatNumber(process.target)}`} */}
																					</span>
																				</Box>
																			</Box>
																		)
																)}
														</Box>
													</Box>
													{item?.processInfos &&
													item?.processInfos.filter(
														(item) =>
															item.isCompleted
													)?.length !==
														item?.processInfos
															?.length ? (
														<Box
															style={{
																marginLeft:
																	"auto",
															}}>
															{item?.condition
																.actionName && (
																<Box
																	style={{
																		marginLeft:
																			"auto",
																	}}>
																	<Button
																		onClick={async () => {
																			setGamificationDetailID(
																				item.gamificationDetailID
																			);
																			if (
																				item
																					.condition
																					.type ===
																				ENUM_CONDITION_TYPE.SHARE
																			) {
																				// case sharing post
																				setRedirectLink(
																					item
																						?.condition
																						?.actionLink
																				);
																				setShowSharing(
																					true
																				);
																			}
																		}}
																		className={clsx(
																			item.isBlocked
																				? styles.boardMission_disablesBtn
																				: styles.boardMissinItem_btn
																		)}>
																		{item.isBlocked ? (
																			<span
																				style={{
																					display:
																						"flex",
																					alignItems:
																						"center",
																					gap: "8px",
																				}}>
																				Chưa
																				mở
																				khoá{" "}
																				<NextImage
                                                                                    // src={
                                                                                    // 	LUCKYWHEEL_BLOCKED_ICON
                                                                                    // }
                                                                                    src={
																						""
																					}
                                                                                    width={
																						15
																					}
                                                                                    height={
																						20
																					}
                                                                                    alt=""
                                                                                    style={{
                                                                                        maxWidth: "100%",
                                                                                        height: "auto"
                                                                                    }} />{" "}
																			</span>
																		) : (
																			item
																				.condition
																				.actionName
																		)}
																	</Button>
																</Box>
															)}
														</Box>
													) : (
														<Box
															style={{
																marginLeft:
																	"auto",
																display: "flex",
																alignItems:
																	"center",
																color: "#797979",
																gap: 4,
															}}>
															<CheckCircleOutlineIcon />{" "}
															Đã hoàn thành
														</Box>
													)}
													{item?.isBlocked &&
														item?.parentMissionName !==
															"" && (
															<Typography
																style={{
																	color: "#D55D2A",
																	fontSize: 12,
																}}>
																Hoàn thành nhiệm
																vụ{" "}
																<span
																	style={{
																		color: "#000",
																	}}>
																	{
																		item?.parentMissionName
																	}
																</span>{" "}
																để mở khoá
															</Typography>
														)}
												</Box>
											))}
									</Box>
								</Box>
							)}
						</Grid>
					</Box>
				</Box>

				{spinnerInfo.isEnableShare && (
					<Box
						className={styles.sharingContainer}
						onClick={() => handlePopupSharing()}>
						<Box style={{ padding: "6px 0 0", height: 40 }}>
							{/* <ImageFallbackStatic
								src={LUCKYWHEEL_SHARE_ICON}
								alt="share icon"
								width={32}
								height={32}
							/> */}
						</Box>
						Chia sẻ
					</Box>
				)}

				<PopupWarning
					open={isOpenPopup.outOfTurn}
					handleClose={handleClosePopup}
					title="Hết lượt quay"
					subTitle={subTitleOOT}
					buttonText="Tìm thêm lượt"
					type="turn"
					handleFindMoreTurn={handleFindMoreTurn}
				/>

				<PopupWarning
					open={isOpenPopup.outOfReward}
					handleClose={handleClosePopup}
					title="Không thể tin được !"
					buttonText="Tôi đã hiểu"
					type="reward"
					handleFindMoreTurn={handleFindMoreTurn}
				/>

				<PopupWarning
					open={isOpenPopup.notFound}
					handleClose={handleReloadPage}
					title="Vòng quay không khả dụng !"
					buttonText="Tải lại trang"
					subTitle="Vui lòng tải lại trang."
					type="not_found"
					handleFindMoreTurn={handleFindMoreTurn}
				/>

				<PopupGotPrize
					open={isOpenPopup.gotPrize}
					handleClose={handleResetPopupPrize}
					reward={spinnerInfo?.result}
				/>

				{/* <PopupSharing
					open={isShowSharing}
					handleClose={handlePopupSharing}
					listItem={[
						ENUM_POPUP_SHARING_ITEM.FACEBOOK,
						ENUM_POPUP_SHARING_ITEM.ZALO,
					]}
					luckyWheelCode={spinnerInfo.luckyWheelCode}
					gamificationDetailID={gamificationDetailID}
					redirectLink={redirectLink}
					reRenderMission={reRenderMission}
				/> */}
			</Grid>
        </div>
    );
};

interface IButtonSpin {
	spin: () => void;
	reset: () => void;
	btnSpinRef: RefObject<HTMLDivElement>;
	btnSpinHeadRef: RefObject<HTMLDivElement>;
	isSpinning: boolean;
	isStop: boolean;
	turns: number;
}

const ButtonSpin = ({
	spin,
	reset,
	btnSpinRef,
	btnSpinHeadRef,
	isSpinning,
	isStop,
	turns,
}: IButtonSpin) => (
	<div
		ref={btnSpinRef}
		className={clsx(
			styles.btnSpin_container,
			!isStop && styles.btnSpin_containerDisabled
		)}
		onClick={isSpinning ? reset : spin}>
		<div id="spin_2" style={{ position: "relative" }}>
			<div ref={btnSpinHeadRef} className={styles.btnSpin_head}>
				<span
					style={{
						justifyContent: "center",
						alignItems: "center",
						display: "flex",
						width: "100%",
						color: "#fff",

						fontSize: turns === 0 ? "26px" : "32px",
						textTransform: "uppercase",
						userSelect: "none",
						textShadow: "1px 3px #00000066",
					}}>
					{turns === 0 ? "Thêm lượt" : "Quay"}
				</span>
			</div>
			<div className={styles.btnSpin_bottom}>
				<span
					style={{
						justifyContent: "center",
						alignItems: "flex-end",
						display: "flex",
						width: "100%",
						color: "#fff",

						position: "absolute",
						bottom: "5px",
						userSelect: "none",
					}}>
					{!turns ? "Còn 0 lượt" : `Còn ${turns || 0} lượt`}
				</span>
			</div>
		</div>
	</div>
);

interface IPopupWarning {
	open: boolean;
	handleClose: () => void;
	title?: string;
	subTitle?: string;
	buttonText?: string;
	type?: PopupWarningType;
	isMobile?: boolean;
	handleFindMoreTurn: () => void;
}

const style = {
	position: "absolute" as const,
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	borderRadius: "8px",
	boxShadow: 24,
	p: "20px",
};

const PopupWarning = ({
	open,
	handleClose,
	title,
	subTitle,
	buttonText,
	type,
	isMobile,
	handleFindMoreTurn,
}: IPopupWarning) => (
	<Modal open={open}>
		<Box sx={style} style={{ outline: 0 }}>
			<Box
				style={{
					position: "absolute",
					right: 8,
					top: 8,
					display: "flex",
					justifyContent: "flex-end",
					alignItems: "center",
					color: "#c0c0c0",
					cursor: "pointer",
				}}
				onClick={handleClose}>
				<Close
					style={{
						stroke: "#c0c0c0",
						strokeWidth: 1,
					}}
				/>
			</Box>
			<Box>
				<Box
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						textAlign: "center",
						gap: 4,
					}}>
					{/* <ImageFallbackStatic
						src={LUCKWHEEL_ICON_WARNING}
						alt="warning icon"
						width={40}
						height={40}
					/> */}
					<Typography variant="h6" style={{ lineHeight: "26px" }}>
						{title}
					</Typography>
				</Box>
				{type === "reward" ? (
					<Typography
						className={styles.popupWarning_subTitle}
						variant="body2">
						Bạn đã sở hữu toàn bộ phần thưởng! <br /> Mong bạn sẽ
						tiếp tục ủng hộ các chương trình tiếp theo đến từ
						thuocsi.vn
					</Typography>
				) : (
					<Typography
						className={styles.popupWarning_subTitle}
						variant="body2">
						{subTitle}
					</Typography>
				)}
			</Box>
			<Box style={{ textAlign: "center", marginTop: "12px" }}>
				<Button
					onClick={() =>
						type === "turn" ? handleFindMoreTurn() : handleClose()
					}
					className={styles.btnClosePopup}>
					{buttonText ?? "Đóng"}
				</Button>
			</Box>
		</Box>
	</Modal>
);

interface IPopupGotPrize {
	open: boolean;
	handleClose: () => void;
	reward: IReward | null;
}

const PopupGotPrize = ({ open, handleClose, reward }: IPopupGotPrize) => {
	const router = useRouter();
	const RenderFireWork = () => {
		const numberFireWord = new Set([1, 2, 3]);
		return (
			<Box>
				{Array.from(numberFireWord, (child) => (
					<div key={child} className={styles.fireWork_effect} />
				))}
			</Box>
		);
	};

	const highLightSplitText = (text: string, start: string, end: string) => {
		if (!text) return text;
		let startIndex = text.indexOf(start);
		const endIndex = text.lastIndexOf(end);

		if (startIndex === -1 || endIndex === -1) {
			return text;
		}

		startIndex += start.length;

		if (startIndex > endIndex) {
			return text;
		}

		return text.substring(startIndex, endIndex);
	};

	const textHightLight =
		highLightSplitText(
			reward?.message as string,
			"<strong>",
			"</strong>"
		) ?? reward?.message;

	return (
        <Modal open={open}>
            <Box sx={style} style={{ outline: 0 }}>
				{reward?.reward && reward.reward.length > 0 && RenderFireWork()}
				<Box>
					{reward?.itemUrl && (
						<Box
							style={{
								position: "relative",
								width: "100%",
								height: "50px",
							}}>
							<NextImage src={reward.itemUrl} alt="" className="object-contain" fill sizes="100vw" />
						</Box>
					)}
					<Typography
						className={styles.popupGotPrize_subTitle}
						variant="body2">
						<div
							style={{ fontSize: "16px" }}
							dangerouslySetInnerHTML={{
								__html:
									reward?.message?.replace(
										`<strong>${textHightLight}</strong>`,
										`<span style="color: #09884D;font-family: 'ggsm'">${textHightLight}</span>`
									) ?? "",
							}}
						/>
					</Typography>
				</Box>
				<Box
					style={{
						textAlign: "center",
						marginTop: "12px",
						display: "flex",
						gap: 12,
						width: "100%",
						justifyContent: "center",
					}}>
					{reward?.actionName && reward?.actionLink && (
						<Button
							onClick={() => router.push(reward.actionLink || "")}
							className={styles.btnPopupUsing}>
							{reward.actionName || "Sử dụng ngay"}
						</Button>
					)}
					<Button
						onClick={handleClose}
						className={styles.btnPopupReset}>
						Tiếp tục
					</Button>
				</Box>
			</Box>
        </Modal>
    );
};
interface ICountDownLuckyUser {
	code: string;
}

// const CountDownLuckyUser = ({ code }: ICountDownLuckyUser) => {
// 	const [luckyUserList, setLuckyUserList] = useState<string[]>([]);
// 	const [offset] = useState(0);
// 	const [opacity, setOpacity] = useState(false);
// 	const [currentLuckyUser, setCurrentLuckyUser] = useState<string[]>([]); // display 4 for web
// 	const [currentIdx, setCurrentIdx] = useState(0);
// 	const luckyUserListRef = useRef(luckyUserList);
// 	const currentIdxRef = useRef(currentIdx);
// 	const offsetRef = useRef(offset);

// 	const filterLuckyUsers = async () => {
// 		setOpacity(false);
// 		const luckyUserTarget: string[] = [];

// 		if (currentIdxRef.current < luckyUserListRef.current.length) {
// 			for (
// 				let i = currentIdxRef.current;
// 				i < currentIdxRef.current + 4;
// 				i += 1
// 			) {
// 				luckyUserTarget.push(luckyUserListRef.current[i]);
// 			}
// 		}

// 		setTimeout(() => {
// 			if (currentIdxRef.current > luckyUserListRef.current.length) {
// 				setOpacity(false);
// 				setCurrentLuckyUser([]);
// 			} else {
// 				setOpacity(true);
// 				setCurrentLuckyUser(luckyUserTarget);
// 				setCurrentIdx((prev) => prev + 4); // 4 user per time
// 			}
// 		}, 500);
// 	};

// 	const fetchLuckyUser = async () => {
// 		const selfLogOtherRes = await getLogSelfLuckyWheel({
// 			luckyWheelCode: code,
// 			limit: 20,
// 			offset: 0,
// 			type: "OTHER",
// 		});

// 		if (isValid(selfLogOtherRes)) {
// 			const { data }: IGetLuckyUserLog = selfLogOtherRes;

// 			if (data) {
// 				setLuckyUserList(data.map((item) => item.messageHidden));
// 				filterLuckyUsers();
// 			}
// 		}
// 	};

// 	useEffect(() => {
// 		fetchLuckyUser();
// 		const intervalFetchList = setInterval(async () => {
// 			const luckyUserResp: IGetLuckyUserLog = await getLogSelfLuckyWheel({
// 				luckyWheelCode: code,
// 				limit: 20,
// 				offset: offsetRef.current,
// 				type: "OTHER",
// 			});

// 			if (isValid(luckyUserResp)) {
// 				const listMessage = getData(luckyUserResp).map(
// 					(item: ILuckyUserData) => item.messageHidden
// 				);
// 				setLuckyUserList((prev) => [...prev, ...listMessage]);
// 			}
// 		}, 100 * 1000);

// 		const intervalFadeEffect = setInterval(async () => {
// 			filterLuckyUsers();
// 		}, 25 * 1000);

// 		return () => {
// 			clearInterval(intervalFetchList);
// 			clearInterval(intervalFadeEffect);
// 		};
// 	}, []);

// 	useEffect(() => {
// 		// Using ref for updating value in interval
// 		luckyUserListRef.current = luckyUserList;
// 		currentIdxRef.current = currentIdx;
// 		offsetRef.current = offset;
// 	}, [luckyUserList, currentIdx, offset]);

// 	return (
// 		<NoSsr>
// 			<Box
// 				display="flex"
// 				justifyContent="center"
// 				style={{
// 					transition: "0.8s linear",
// 					overflow: "hidden",
// 				}}>
// 				<Box
// 					className={clsx(
// 						styles.luckyUser_container,
// 						currentLuckyUser.length === 0 &&
// 							styles.luckyUser_containerHidden
// 					)}>
// 					<Box
// 						className={clsx(
// 							opacity ? styles.show : styles.hide,
// 							styles.luckyUser_messageContent
// 						)}>
// 						{currentLuckyUser?.map((item, index) => (
// 							<p
// 								key={index}
// 								className={styles.luckyUser_messageContent}>
// 								{item}
// 							</p>
// 						))}
// 					</Box>
// 				</Box>
// 			</Box>
// 		</NoSsr>
// 	);
// };

export default LuckyWheelContainer;
