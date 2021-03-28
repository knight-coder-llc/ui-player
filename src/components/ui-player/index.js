import React, { useEffect, useState, useRef } from 'react';
import { findDOMNode } from 'react-dom';
import ReactPlayer from 'react-player';
import { Layout } from '../Layout';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import BottomDrawer from '../Drawer';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import StopIcon from '@material-ui/icons/Stop';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import Tooltip from '@material-ui/core/Tooltip';
import Duration, { format } from './Duration'
import screenfull from 'screenfull';
import { add, subtract, isNil } from 'ramda';
import { ffmpegTranscodeFile } from '../../utils';
import logo from '../../assets/AVlogo-2.png';
import sampleVideo from '../../assets/videos/steel-will-sample-dual-mix.mov';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { motion } from 'framer-motion';
import { Message } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
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
    }
  }));

let timerId;

export const Player = () => {
    const classes = useStyles();
    // initialize context variables.
    const [volumeLevel, setVolumeLevel] = useState(1);
    const [playing, setPlaying] = useState(false);
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [url, setUrl] = useState(null);
    const [seeking, setSeeking] = useState(false);
    const [audiotrack, setAudioTrack] = useState(1);
    const [trackUpdated, setTrackUpdate] = useState(false);
    const [videoSrc, setVideoSrc] = useState(sampleVideo);
    const [originalSrc, setOriginalVideoSrc] = useState(null);

    useEffect(async () => {
        if(isNil(originalSrc)) {
            const original = await ffmpegTranscodeFile(sampleVideo);
            setOriginalVideoSrc(original);
        }
        
        return () => {

        }
    }, []);

    // UI Player control handlers.
    const handlePlayPause = () => (setPlaying(!playing));
    const handlePlay = () => (setPlaying(true));
    const handleStop = () => {
        setUrl(null);
        setPlaying(false);
        setPlayed(0);

        playerRef.current.seekTo(parseFloat(0));
    };
    const handleVolumeChange = (e, newValue) => (setVolumeLevel(parseFloat(newValue)));
    const handleClickFullscreen = () => {
        screenfull.request(findDOMNode(playerRef.current));
    }
    
    const handleSeekMouseDown = e => {
        const direction = e.target.closest('button').getAttribute('id');
        setSeeking(true);
        timerId = setTimeout(() => {
            if(direction !== 'rewind') {
                handleSeekChange(add(played,0.09))
            } else {
                handleSeekChange(subtract(played,0.09))
            }      
        }, 100);
        
    }
    
    const handleSeekChange = interval => {
        setPlayed(parseFloat(interval));
    }
    
    const handleSeekMouseUp = e => {
        if(seeking) {
            playerRef.current.seekTo(parseFloat(duration * played));
            clearTimeout(timerId);
            setSeeking(false);
        }   
    }

    const handleAudioTrackChange = async (e, track) => { 
        if(track !== null) {
            setAudioTrack(track);
            if(track > 0) {
                setVideoSrc(sampleVideo);
            } else {
                setVideoSrc(originalSrc);
            }
            setTrackUpdate(true);
        } 
     }

    const handleDuration = (duration) => (setDuration(duration));
    const handleProgress =  (state) => {
        if (!seeking) {
            setPlayed(state.played)
        }
    }

    const playerRef = useRef(null);

    return  <Layout>
                <div className={classes.root} id="videoContainer" >
                    <Typography component="div" >
                        <Box fontWeight={500} m={1} fontSize="h6.fontSize" lineHeight={2} color="white">
                            <img src={logo} />
                        </Box>
                    </Typography>
                    <Grid className="player-wrapper" >
                    {
                        (!isNil(originalSrc)) ?   <Grid item>
                                        
                                        <ReactPlayer 
                                            ref={playerRef}
                                            className="react-player"
                                            url={videoSrc}
                                            controls={false} 
                                            width="100%" 
                                            height="100%" 
                                            volume={volumeLevel}
                                            playing={playing}
                                            progressInterval={500}
                                            onReady={() => {
                                                if(trackUpdated) {
                                                    const seconds = (duration * played);
                                                    
                                                    playerRef.current.seekTo(seconds);
                                                    setTrackUpdate(false);
                                                }
                                            }}
                                            onPlay={handlePlay}
                                            onDuration={handleDuration}
                                            onProgress={handleProgress}
                                            onSeek={e => console.log('onSeeking??', e)}/>
                                        
                                    </Grid> : 
                                    <Grid item height={'100%'} style={{display: 'flex', justifyContent:'center',     marginTop: '-35vh'}}>
                                        <motion.div 
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                loop: Infinity,
                                                ease: "linear",
                                                duration: 1
                                            }}
                                        >
                                           <AutorenewIcon style={{fontSize: '5rem', color:'#fff'}} /> 
                                        </motion.div>
                                    </Grid>
                    }
                    </Grid>
                    <ButtonGroup color="primary" aria-label="toggle button group">
                    
                        <ToggleButtonGroup  exclusive value={audiotrack} onChange={handleAudioTrackChange} >
                            <ToggleButton value={0}  className={classes.toggles}>Original Audio</ToggleButton>
                            <ToggleButton value={1} >Final Audio</ToggleButton>    
                        </ToggleButtonGroup>
                    </ButtonGroup>
                    <Grid>
                        <Typography component="div" >
                            <Box fontWeight={500} m={1} fontSize="h6.fontSize" lineHeight={2} color="white">
                                <Duration seconds={duration * (1 - played)} /> / <Duration seconds={duration } />
                            </Box>
                        </Typography>
                    </Grid>
                    
                    <ButtonGroup color="primary" aria-label="contained primary button group" id="controls" >
                    
                        <Grid container spacing={2}>
                            <Grid item>
                                <Tooltip title="stop" arrow>
                                    <Button color="primary" variant="contained" onClick={handleStop} size="large"><StopIcon/></Button>
                                </Tooltip>
                                
                            </Grid>
                            <Grid item>
                                <Tooltip title="rewind" arrow>
                                    <Button 
                                        className={classes.rewind} 
                                        id="rewind"
                                        color="primary" 
                                        size="large"
                                        variant="contained"
                                        value={played}
                                        onMouseDown={handleSeekMouseDown}
                                        onChange={handleSeekChange}
                                        onMouseUp={handleSeekMouseUp} 
                                        >
                                            <DoubleArrowIcon/>
                                    </Button>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Tooltip title="play/pause" arrow>
                                    <Button color="primary" variant="contained" onClick={handlePlayPause} size="large"> {!playing ? <PlayCircleFilledIcon/> : <PauseCircleFilledIcon />}</Button>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Tooltip title="forward" arrow>
                                    <Button 
                                        id="fastforward" 
                                        color="primary" 
                                        variant="contained"
                                        size="large"
                                        value={played}
                                        onMouseDown={handleSeekMouseDown}
                                        onChange={handleSeekChange}
                                        onMouseUp={handleSeekMouseUp}
                                        >
                                        <DoubleArrowIcon/>
                                    </Button>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Tooltip title="fullscreen" arrow>
                                    <Button color="primary" variant="contained" onClick={handleClickFullscreen} size="large"><FullscreenIcon/></Button>
                                </Tooltip>
                            </Grid>
                            {/* <Grid item>
                                <BottomDrawer />
                            </Grid> */}
                        </Grid>
                        
                        
                    </ButtonGroup>
                    <ButtonGroup style={{width: '40%', color: '#fff'}} className="controls">
                        {/* <Typography id="continuous-slider" gutterBottom>
                            Volume
                        </Typography> */}
                        <Grid container spacing={2} >
                            <Grid item>
                                <VolumeDown />
                            </Grid>
                            <Grid item xs >
                                <Slider value={volumeLevel} onChange={handleVolumeChange} min={0} max={1} step={0.01} aria-labelledby="continuous-slider" />
                            </Grid>
                            <Grid item>
                                <VolumeUp />
                            </Grid>
                            
                        </Grid>
                    </ButtonGroup>
                    
                </div>
            </Layout>
}