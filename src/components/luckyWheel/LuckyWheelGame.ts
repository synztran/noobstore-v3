import { IReward } from "./interface";

export class LuckyWheelGame {
	private rewards: IReward[] = [];
	private history: IReward[] = [];
	private currentRotation: number = 0;
	private isSpinning: boolean = false;
	private turns: number = 0;
	private onSpinComplete?: (reward: IReward | null) => void;
	private onHistoryUpdate?: (history: IReward[]) => void;

	constructor(
		initialRewards: IReward[],
		initialTurns: number = 0,
		onSpinComplete?: (reward: IReward) => void,
		onHistoryUpdate?: (history: IReward[]) => void
	) {
		this.rewards = initialRewards;
		this.turns = initialTurns;
		this.onSpinComplete = onSpinComplete;
		this.onHistoryUpdate = onHistoryUpdate;
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

	public addTurns(amount: number): void {
		this.turns += amount;
	}

	public addToHistory(reward: IReward | null): void {
		if (reward) {
			this.history = [...this.history, reward];
			this.onHistoryUpdate?.(this.history);
		}
	}

	public spin(): { rotation: number; reward: IReward | null } | null {
		if (this.isSpinning || this.turns <= 0) {
			return null;
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
			(r) => r.itemCode === selectedReward?.itemCode
		);
		const baseRotation = 360 * 5; // 5 full rotations
		const targetRotation = (360 / this.rewards.length) * rewardIndex;
		const finalRotation = baseRotation + targetRotation;

		this.currentRotation = finalRotation;
		this.isSpinning = false;

		// Add to history and notify
		this.addToHistory(selectedReward || null);
		this.onSpinComplete?.(selectedReward || null);

		return {
			rotation: finalRotation,
			reward: selectedReward || null,
		};
	}

	public reset(): void {
		this.currentRotation = 0;
		this.isSpinning = false;
	}
}
