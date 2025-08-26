import {
	MP3_IMPRESS_ME,
	MP3_MAN_OF_THE_YEAR,
	MP3_SIMPLE,
	MP3_SPLIT_SOULBER,
	NEW_MISSING_IMAGE,
} from "@/constants/Images";
import { IconButton, Slider, Tooltip, Zoom } from "@mui/material";
import {
	ListVideo,
	Pause,
	Play,
	SkipBack,
	SkipForward,
	Volume2,
	VolumeXIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import useMusicPlayer, { useMusicPlayerAction } from "@/zustand/useMusicPlayer";
import MusicPlayList from "./PlayList";

interface IProps {
	songs?: {
		id: number;
		name: string;
		artist: string;
		url: string;
	}[];
	isAutoPlay?: boolean;
}

export const convertToPlayerTimer = (time: number) => {
	if (isNaN(time) || time === null) return "00:00";
	const minutes = Math.floor(time / 60);
	const seconds = Math.round(time % 60);
	return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const MusicPlayer: React.FC<IProps> = ({ isAutoPlay = false }) => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const { songs, currentSong, isPlaying } = useMusicPlayer();
	const { setCurrentSong, setPlaying } = useMusicPlayerAction();
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(100);
	const [openPlaylist, setOpenPlaylist] = useState(false);

	const togglePlay = async () => {
		const audio = audioRef.current;
		console.log("audio", audio, isPlaying);
		if (!audio || !currentSong || !audio.src) return;
		if (isPlaying) {
			audio.pause();
			setPlaying(false);
		} else {
			audio.play().catch((e) => {
				console.log("err", e);
			});
			setPlaying(true);
		}
	};

	const handleSeek = (_: Event, value: number | number[]) => {
		const audio = audioRef.current;
		if (audio) {
			audio.currentTime = Number(value);
		}
	};

	useEffect(() => {
		if (currentSong === null) {
			setCurrentSong(songs[0]!);
		}

		const audio = audioRef.current;
		if (!audio) return;
		const setAudioData = () => {
			setDuration(Math.round(audio.duration));
			setCurrentTime(Math.round(audio.currentTime));
			if (isPlaying) {
				audio.play();
			}
		};

		const setAudioTime = () => {
			const currentTime = Math.round(audio.currentTime);
			setCurrentTime(currentTime);
		};

		const togglePlayPause = () => setPlaying(!audio.paused);
		audio.addEventListener("loadeddata", setAudioData);
		audio.addEventListener("timeupdate", setAudioTime);
		audio.addEventListener("play", togglePlayPause);
		audio.addEventListener("pause", togglePlayPause);
		audio.addEventListener("ended", () => {
			setPlaying(false);
			setCurrentTime(0);
		});

		return () => {
			audio.removeEventListener("loadeddata", setAudioData);
			audio.removeEventListener("timeupdate", setAudioTime);
			audio.removeEventListener("play", togglePlayPause);
			audio.removeEventListener("pause", togglePlayPause);
			audio.removeEventListener("ended", () => {
				setPlaying(false);
				setCurrentTime(0);
			});
		};
	}, [currentSong]);

	return (
		<div className="fixed bottom-0 left-0 right-0 z-[1201] w-full bg-white drop-shadow-lg">
			<div className="container mx-auto w-full grid grid-cols-5 px-40 py-2 gap-4">
				<div className="col-span-3 grid grid-cols-[100px_1fr_32px] w-full items-center gap-4">
					<div className="flex gap-2 col-span-1 items-center">
						<IconButton className="!p-1" disabled>
							<SkipBack className="w-5 h-5" />
						</IconButton>
						<IconButton
							onClick={togglePlay}
							className="!p-1"
							disabled={!currentSong}>
							<div>
								{isPlaying ? (
									<Pause className="w-5 h-5" />
								) : (
									<Play className="w-5 h-5" />
								)}
							</div>
						</IconButton>
						<IconButton className="!p-1" disabled>
							<SkipForward className="w-5 h-5" />
						</IconButton>
					</div>
					<div className="flex items-center col-span-1 gap-4">
						<span>{convertToPlayerTimer(currentTime)}</span>
						<audio
							ref={audioRef}
							src={currentSong?.url}
							preload="auto"
						/>
						<Slider
							aria-label="player-time"
							defaultValue={0}
							valueLabelDisplay="auto"
							valueLabelFormat={convertToPlayerTimer(currentTime)}
							max={duration}
							value={currentTime}
							onChange={handleSeek}
							onMouseDown={() => {
								if (audioRef.current) {
									audioRef.current.pause();
								}
							}}
							onMouseUp={() => {
								if (audioRef.current) {
									audioRef.current.play();
								}
							}}
							sx={{
								"& .MuiSlider-thumb": {
									backgroundColor: "#718096",
									"&:hover, &.Mui-focusVisible": {
										boxShadow:
											"0px 0px 0px 8px rgb(255 255 255 / 16%)",
									},
									"&:after": {
										padding: "0.125rem",
										width: 24,
										height: 24,
									},
									"&.Mui-active": {
										boxShadow:
											"0px 0px 0px 7px rgb(255 255 255 / 16%)",
									},
								},
								"& .MuiSlider-track": {
									backgroundColor: "#f87171",
									borderColor: "transparent",
								},
								"& .MuiSlider-rail": {
									backgroundColor: "rgb(227 143 143)",
								},
							}}
						/>
						<span>{convertToPlayerTimer(duration)}</span>
					</div>
					<div className="flex items-center justify-center">
						<Tooltip
							TransitionComponent={Zoom}
							className="transition-all duration-150 delay-150"
							title={
								<VolumeControl
									audioRef={audioRef}
									volume={volume}
									setVolume={setVolume}
								/>
							}
							placement="top"
							arrow
							sx={{
								"& .MuiTooltip-tooltip": {
									marginBottom: "8px",
								},
							}}>
							<div>
								{volume === 0 ? (
									<VolumeXIcon className="cursor-pointer relative w-5 h-5" />
								) : (
									<Volume2 className="cursor-pointer relative w-5 h-5" />
								)}
							</div>
						</Tooltip>
					</div>
				</div>
				<div className="col-span-2 grid grid-cols-[32px_auto_auto] items-center gap-2 w-full">
					<div className="relative w-full h-full">
						<Image
							src={NEW_MISSING_IMAGE}
							alt="music icon"
							fill
							sizes="100vw"
							className="object-cover"
						/>
					</div>
					<div className="flex flex-col text-sm">
						<span className="text-gray-500 truncate">
							{currentSong?.name}
						</span>
						<span className="truncate">{currentSong?.artist}</span>
					</div>
					<div className="flex items-center gap-2">
						{/* <Heart /> */}
						<IconButton
							onClick={() => setOpenPlaylist(!openPlaylist)}
							className="!p-0.5">
							<ListVideo />
						</IconButton>
					</div>
				</div>
			</div>
			<MusicPlayList
				open={openPlaylist}
				onClose={() => setOpenPlaylist(false)}
				audioRef={audioRef}
			/>
		</div>
	);
};

export default MusicPlayer;

const VolumeControl = ({
	audioRef,
	volume,
	setVolume,
}: {
	audioRef: React.RefObject<HTMLAudioElement>;
	volume: number;
	setVolume: (volume: number) => void;
}) => {
	const { currentSong } = useMusicPlayer();
	const handleChangeVolumn = (volumn: number) => {
		setVolume(volumn);
		if (audioRef.current) {
			audioRef.current.volume = volumn / 100;
		}
	};

	return (
		<Slider
			className="min-h-[100px] mb-4 mt-5"
			aria-label="volume-control"
			orientation="vertical"
			getAriaValueText={() => volume.toString()}
			valueLabelDisplay="off"
			value={volume}
			max={100}
			min={0}
			onChange={(_, value) => handleChangeVolumn(value as number)}
			disabled={!currentSong}
			sx={{
				"& .MuiSlider-thumb": {
					backgroundColor: "#fff",
					"&:hover, &.Mui-focusVisible": {
						boxShadow: "0px 0px 0px 8px rgb(255 255 255 / 16%)",
					},
					"&:after": {
						padding: "0.125rem",
						width: 24,
						height: 24,
					},
					"&.Mui-active": {
						boxShadow: "0px 0px 0px 7px rgb(255 255 255 / 16%)",
					},
				},
				"& .MuiSlider-track": {
					backgroundColor: "#f87171",
					borderColor: "transparent",
				},
				"& .MuiSlider-rail": {
					backgroundColor: "rgb(227 143 143)",
				},
			}}
		/>
	);
};
