import { IReward } from "./interface";

export class LuckyWheel {
	private rewards: IReward[] = [];
	private history: IReward[] = [];
	private rotate: number = 0;
	private isSpinning: boolean = false;
	private turns: number = 0;
	private isFreeTurn: boolean = false;
	private duration: number = 4; // seconds
	private onSpinComplete?: (reward: IReward | null) => void;
	private onHistoryUpdate?: (history: IReward[]) => void;

	constructor(
		initialRewards: IReward[],
		initialTurns: number = 0,
		isFreeTurn: boolean = false,
		onSpinComplete?: (reward: IReward) => void,
		onHistoryUpdate?: (history: IReward[]) => void
	) {
		this.rewards = initialRewards;
		this.turns = initialTurns;
		this.onSpinComplete = onSpinComplete;
		this.onHistoryUpdate = onHistoryUpdate;
		this.duration = 4;
		this.isFreeTurn = isFreeTurn;
	}

	public getRewards(): IReward[] {
		return this.rewards;
	}

	public getHistory(): IReward[] {
		return this.history;
	}

	public getTurns(): number {
		return this.turns;
	}

	public getIsFreeTurn(): boolean {
		return this.isFreeTurn;
	}

	public getRotate(): number {
		return this.rotate;
	}

	public getDuration(): number {
		return this.duration;
	}

	public getIsSpinning(): boolean {
		return this.isSpinning;
	}

	public addTurns(amount: number): void {
		this.turns += amount;
	}

	public addToHistory(reward: IReward | null): void {
		if (reward) {
			this.history = [...this.history, reward];
			this.onHistoryUpdate?.(this.history);
		}
	}

	public spin(): Promise<{
		rotation: number;
		duration: number;
		reward: IReward | null;
	} | null> {
		if (this.isSpinning || this.turns <= 0) {
			return Promise.resolve(null);
		}

		this.isSpinning = true;
		this.turns--;

		// Calculate random reward based on percentages
		const totalPercentage = this.rewards.reduce(
			(sum, reward) => sum + reward.percentage,
			0
		);

		const random = Math.random() * totalPercentage;
		let currentSum = 0;
		let selectedReward: IReward | null = null;

		for (const reward of this.rewards) {
			currentSum += reward.percentage;
			if (random <= currentSum) {
				selectedReward = reward;
				break;
			}
		}

		if (!selectedReward) {
			selectedReward = this.rewards[0] || null;
		}

		// Calculate rotation
		const rewardIndex = this.rewards.findIndex(
			(r) => r.code === selectedReward?.code
		);
		const baseRotation = 360 * 5; // 5 full rotations
		const targetRotation = (360 / this.rewards.length) * rewardIndex;
		const finalRotation = baseRotation + targetRotation;

		this.rotate = finalRotation;
		this.isSpinning = false;

		// Add to history and notify
		this.addToHistory(selectedReward || null);
		this.onSpinComplete?.(selectedReward || null);
		return Promise.resolve({
			rotation: finalRotation,
			duration: this.duration,
			reward: selectedReward || null,
		});
	}

	public reset(): void {
		this.rotate = 0;
		this.isSpinning = false;
	}
}

export class WheelRenderer {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private rewards: IReward[];
	private radius: number;
	private rotate: number = 0;
	private duration: number = 4;
	private isSpinning: boolean = false;

	constructor(
		canvas: HTMLCanvasElement,
		rewards: IReward[],
		radius: number = 340
	) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d")!;
		this.rewards = rewards;
		this.radius = radius;
	}

	private loadImage(src: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.onerror = reject;
			img.src = src;
		});
	}

	private drawReward(
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
	) {
		ctx.save();
		ctx.translate(cx * 2, cy * 2);
		ctx.rotate(angle);
		ctx.beginPath();
		ctx.lineWidth = 5;
		ctx.lineJoin = "round";
		ctx.lineCap = "round";
		ctx.lineTo(0, 0);
		ctx.arc(0, 0, radius, 0, arcsweep);
		ctx.closePath();
		ctx.strokeStyle = "transparent";
		ctx.stroke();
		ctx.fillStyle = color ?? "#fff";
		ctx.fill();
		ctx.rotate(PI / 2 + sweep / 2);
		ctx.drawImage(img, itemX, itemY, itemW, itemH);
		ctx.restore();
	}

	public async renderWheel() {
		const numOptions = this.rewards.length;
		const centralAngle = 360 * (1 / numOptions) * (Math.PI / 180);
		const PI = Math.PI;
		const PI2 = PI * 2;
		const sweep = PI2 / numOptions;
		const cw = this.canvas.width;
		const ch = this.canvas.height;
		console.log(cw, ch);
		const cx = this.canvas.width / 2;
		const cy = this.canvas.height / 2;
		console.log(cx, cy);

		for (let i = 0; i < numOptions; i++) {
			const reward = this.rewards[i];
			if (!reward) continue;

			const { name, image, bgColor = "#fff" } = reward;
			const prizeImage = await this.loadImage(image);

			// Calculate image dimensions based on number of rewards
			let imageItemW = 0;
			let imageItemH = 0;
			let imageItemX = 0;
			let imageItemY = 0;

			if (prizeImage.naturalWidth === prizeImage.naturalHeight) {
				if (numOptions > 9) {
					imageItemW = 116;
					imageItemH = 116;
					imageItemX = -this.radius + 280;
					imageItemY = -this.radius + 10;
				} else {
					imageItemW = 128;
					imageItemH = 128;
					imageItemX = -this.radius + 280;
					imageItemY = -this.radius + 15;
				}
			} else {
				if (numOptions >= 10) {
					imageItemW = 128;
					imageItemH = 64;
					imageItemX = -this.radius + 275;
					imageItemY = -this.radius + 20;
				} else if (numOptions > 6 && numOptions < 10) {
					imageItemW = 148;
					imageItemH = 84;
					imageItemX = -this.radius + 265;
					imageItemY = -this.radius + 20;
				} else {
					imageItemW = 204;
					imageItemH = 102;
					imageItemX = -this.radius + 240;
					imageItemY = -this.radius + 20;
				}
			}

			this.drawReward(
				this.ctx,
				PI,
				sweep,
				prizeImage,
				imageItemW,
				imageItemH,
				imageItemX,
				imageItemY,
				name,
				cx,
				cy,
				this.radius,
				sweep * i,
				sweep,
				bgColor
			);
		}
	}

	public rotateAction(degrees: number, duration: number = 4) {
		this.rotate = degrees;
		this.duration = duration;
		this.isSpinning = true;
		this.canvas.style.transform = `rotate(${degrees - 90}deg)`;
		this.canvas.style.transition = `transform ${duration}s ease-out`;

		// Reset spinning state after animation completes
		setTimeout(() => {
			this.isSpinning = false;
		}, duration * 1000);
	}

	public resetAction() {
		this.rotate = 0;
		this.duration = 0;
		this.isSpinning = false;
		this.canvas.style.transform = "rotate(-90deg)";
		this.canvas.style.transition = "none";
	}

	public getRotate(): number {
		return this.rotate;
	}

	public getDuration(): number {
		return this.duration;
	}

	public getIsSpinning(): boolean {
		return this.isSpinning;
	}
}
