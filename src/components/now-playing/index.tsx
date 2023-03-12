import React, { useMemo, useState } from "react";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import { useAppContext } from "@/contexts";
import { removePlaylist } from "@/contexts/appAction";
import "react-h5-audio-player/lib/styles.css";

const NowPlaying = () => {
  const { appState, appDispatch } = useAppContext();
  const { playlist } = appState;

  const [currentTrack, setTrackIndex] = useState(0);

  const current = useMemo(
    () => playlist?.[currentTrack],
    [playlist, currentTrack]
  );

  const handleClickNext = () => {
    if (!playlist) return;

    const next = currentTrack < playlist.length - 1 ? currentTrack + 1 : 0;
    setTrackIndex(next);
  };

  const handleEnd = () => {
    if (!playlist) return;

    const next = currentTrack < playlist.length - 1 ? currentTrack + 1 : 0;
    setTrackIndex(next);
  };

  const ref = React.useRef<AudioPlayer>(null);

  return (
    <AudioPlayer
      header={current?.title}
      ref={ref}
      style={{
        position: "absolute",
        bottom: 0,
        width: "240px",
        boxShadow: "none"
      }}
      volume={0.5}
      src={current?.src}
      customControlsSection={[RHAP_UI.MAIN_CONTROLS, RHAP_UI.VOLUME_CONTROLS]}
      onClickNext={handleClickNext}
      onEnded={handleEnd}
    />
  );
};

export default NowPlaying;
