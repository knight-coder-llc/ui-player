import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Layout } from '../Layout';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import Tooltip from '@material-ui/core/Tooltip';
import Duration, { format } from './Duration'
import { add, subtract, isNil, equals } from 'ramda';
import { ffmpegTranscodeFile } from '../../utils';
import logo from '../../assets/AVlogo-2.png';
import sampleVideo from '../../assets/videos/steele-will-final-audio-video.mov';
import originalVideo from '../../assets/videos/steele-will-original-audio-video.mov';
import ReplayIcon from '@material-ui/icons/Replay';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import StopIcon from '@material-ui/icons/Stop';
import { isMobile } from 'react-device-detect';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    rewind: {
        webkitTransform: 'rotate(180deg)',
        mozTransform: 'rotate(180deg)',
        msTransform: 'rotate(180deg)',
        oTransform: 'rotate(180deg)',
        transform: 'rotate(180deg)',
    },
    toggles: {
        marginRight: theme.spacing(1.5)
    },
    backdrop: {
        background: '#000',
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      },
  }));

let timerId;

export const Player = () => {
    const classes = useStyles();

    // initialize context variables.
    const [playing, setPlaying] = useState(false);
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [audiotrack, setAudioTrack] = useState(0);
    const [trackUpdated, setTrackUpdate] = useState(false);
    
    const handlePlay = () => (setPlaying(true));
   
    const handleAudioTrackChange = async (e, track) => { 
        if(track !== null) {
            setAudioTrack(track);
            setTrackUpdate(true);
        } 
     }

    const handleDuration = (duration) => (setDuration(duration));
    const handleProgress =  (state) => {
        setPlayed(state.played);
    }

    const playerRef = useRef(null);

    return  <Layout>
        
                <div className={classes.root} id="videoContainer" >
                   
                    <Grid className="player-wrapper" >
                    <Grid item>
                        <ReactPlayer 
                            ref={playerRef}
                            className="react-player"
                            url={(audiotrack > 0) ? sampleVideo : originalVideo}
                            controls={true} 
                            width="100%" 
                            playing={playing}
                            progressInterval={1000}
                            onReady={() => {
                                if(trackUpdated) {
                                    const seconds = (duration * played);
                                    playerRef.current.seekTo(seconds);
                                    setTrackUpdate(false);
                                }
                            }}
                            onPlay={handlePlay}
                            onDuration={handleDuration}
                            onProgress={handleProgress} />       
                    </Grid>
                    
                    </Grid>
                    <ButtonGroup color="primary" aria-label="toggle button group" id="controls">
                        <ToggleButtonGroup  exclusive value={audiotrack} onChange={handleAudioTrackChange} >
                            <ToggleButton value={0}  className={classes.toggles}>Original Audio</ToggleButton>
                            <ToggleButton value={1} >Final Audio</ToggleButton>    
                        </ToggleButtonGroup>
                    </ButtonGroup>
                   
                </div>
                
            </Layout>
}