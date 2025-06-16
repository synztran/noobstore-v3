import { MP3_SPLIT_SOULBER } from "@/constants/Images";
import { MP3_MAN_OF_THE_YEAR } from "@/constants/Images";
import { MP3_IMPRESS_ME } from "@/constants/Images";
import { MP3_SIMPLE } from "@/constants/Images";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface ISong {
	id: number;
	name: string;
	artist: string;
	url: string;
	duration?: string;
}

interface IInitialState {
	currentSong: ISong | null;
	songs: ISong[];
	isPlaying: boolean;
}

interface IActions {
	setCurrentSong: (payload: ISong) => void;
	setPlaying: (payload: boolean) => void;
}

const initialState = {
	currentSong: null,
	isPlaying: false,
	songs: [
		{
			id: 1,
			name: "攬佬SKAI ISYOURGOD/AR劉夫陽",
			artist: "太合音樂 Taihe Music-精選",
			url: MP3_SIMPLE,
		},
		{
			id: 2,
			name: "Impress Me",
			artist: "DOOV",
			url: MP3_IMPRESS_ME,
		},
		{
			id: 3,
			name: "Man of the Year",
			artist: "Khantrast",
			url: MP3_MAN_OF_THE_YEAR,
		},
		{
			id: 4,
			name: "Split Soulber",
			artist: "VSoul",
			url: MP3_SPLIT_SOULBER,
		},
	],
};

type States = IInitialState & {
	actions: IActions;
};

const useMusicPlayer = create<States>()(
	devtools((set, _) => ({
		...initialState,
		actions: {
			setCurrentSong: (currentSong: ISong) => set({ currentSong }),
			setPlaying: (isPlaying: boolean) => set({ isPlaying }),
		},
	}))
);

export const useMusicPlayerAction = () =>
	useMusicPlayer((state) => state.actions);

export default useMusicPlayer;
