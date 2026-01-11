import { NEW_MISSING_IMAGE } from "@/constants/Images";
import { Drawer, IconButton } from "@mui/material";
import { Pause, Play, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { convertToPlayerTimer } from "..";
import useMusicPlayer, {
  ISong,
  useMusicPlayerAction,
} from "@/zustand/useMusicPlayer";

interface IProps {
  open: boolean;
  onClose: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const MusicPlayList: React.FC<IProps> = ({ open, onClose, audioRef }) => {
  const { songs, currentSong } = useMusicPlayer();
  const { setCurrentSong, setPlaying } = useMusicPlayerAction();
  const [songsWithTimeline, setSongsWithTimeline] = useState<
    ({ id: number; name: string; artist: string; url: string } & {
      duration: string;
    })[]
  >([]);

  const handlePlaySong = (song: ISong) => {
    if (currentSong?.id === song.id) return;
    setCurrentSong(song);
    onClose();
    setPlaying(true);
  };

  useEffect(() => {
    const loadAudioMetadata = async (
      song: (typeof songs)[0],
      index: number
    ) => {
      const audio = new Audio(song.url);

      return new Promise<typeof song & { duration: string }>((resolve) => {
        audio.addEventListener("loadedmetadata", () => {
          const stringDuration = convertToPlayerTimer(audio.duration);
          resolve({
            ...song,
            duration: stringDuration,
            id: index + 1,
          });
        });
      });
    };

    const loadSongs = async () => {
      const result = await Promise.all(songs.map(loadAudioMetadata));
      setSongsWithTimeline(result);
    };

    loadSongs();
  }, [songs]);

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      disableScrollLock
      classes={{
        paper:
          "max-w-[max(480px,30vw)] ml-auto border border-black rounded-lg shadow-lg bottom-[63px] right-[10%]",
      }}
      BackdropComponent={() => <div className="bg-transparent" />}
    >
      <div className="flex items-center justify-between p-4 sticky top-0">
        <span className="text-lg font-semibold">Danh sách phát</span>
        <div className="flex items-center gap-2">
          <IconButton
            className="!p-0.5 bg-gray-600 hover:bg-gray-700"
            onClick={onClose}
          >
            <X className="text-white" />
          </IconButton>
        </div>
      </div>
      <div className="min-h-[200px] py-2 px-6 overflow-y-auto">
        {songsWithTimeline?.length ? (
          <div>
            {songsWithTimeline?.map((song) => (
              <div
                key={song.id}
                className="flex items-center gap-2 group cursor-pointer hover:bg-gray-300 px-2 py-1"
                onClick={() => handlePlaySong(song)}
              >
                <div className="relative w-[32px] h-[32px]">
                  <Image
                    src={NEW_MISSING_IMAGE}
                    alt="music icon"
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                  {song.id === currentSong?.id ? (
                    <IconButton className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 !p-0.5 bg-black rounded-full hover:bg-black">
                      <Pause className="w-5 h-5 p-0.5 fill-white" />
                    </IconButton>
                  ) : (
                    <IconButton className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 !p-0.5 hidden group-hover:block bg-black rounded-full hover:bg-gray-700">
                      <Play className="w-5 h-5 p-0.5 fill-white" />
                    </IconButton>
                  )}
                </div>
                <div className="flex flex-col text-sm">
                  <span className="text-gray-500 truncate">{song?.name}</span>
                  <span className="truncate">{song?.artist}</span>
                </div>
                <div className="text-base text-gray-500 ml-auto">
                  {song?.duration}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>Không có bài hát nào trong danh sách phát</div>
        )}
      </div>
    </Drawer>
  );
};

export default MusicPlayList;
