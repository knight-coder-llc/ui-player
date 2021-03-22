import React, { useState, useRef } from 'react';
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
import Duration from './Duration'
import screenfull from 'screenfull';
import { add, subtract } from 'ramda';
import sampleVideo from '../../assets/videos/steel-will-sample-dual-mix.mov';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        alignItems: 'center',
        // paddingLeft: '15px',
        // paddingRight: '15px',
        display: 'flex',
        // height: '100%',
        // width: '100%',
        // color: '#3f51b5',
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
    const [volumeLevel, setVolumeLevel] = React.useState(0.08);
    const [playing, setPlaying] = React.useState(false);
    const [played, setPlayed] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [url, setUrl] = React.useState(null);
    const [seeking, setSeeking] = React.useState(false);
    const [audiotrack, setAudioTrack] = useState('original')

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
        screenfull.request(findDOMNode(playerRef.current))
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
            playerRef.current.seekTo(parseFloat(played));
            clearTimeout(timerId);
            setSeeking(false);
        }   
    }

    const handleAudioTrackChange = (e, track) => { 
        setAudioTrack(track)
     }

    const handleDuration = (duration) => (setDuration(duration));
    const handleProgress =  (state) => {
        if (!seeking) {
            setPlayed(state.played)
        }
    }
    const playerRef = useRef(null);

    return  <Layout>
                <div className={classes.root}>
                    <Typography component="div" >
                        <Box fontWeight={500} m={1} fontSize="h6.fontSize" lineHeight={2} color="white">
                            Free Video Player 1.0.0
                        </Box>
                    </Typography>
                    <Grid className="player-wrapper" >
                        <Grid item>
                            <ReactPlayer 
                                ref={playerRef}
                                className="react-player"
                                url={sampleVideo}
                                controls={false} 
                                width="100%" 
                                height="100%" 
                                volume={volumeLevel}
                                playing={playing}
                                onPlay={handlePlay}
                                onDuration={handleDuration}
                                onProgress={handleProgress}
                                onSeek={e => console.log('onSeeking??', e)}/>
                                
                        </Grid>
                    </Grid>
                    <ButtonGroup color="primary" aria-label="toggle button group">
                        <ToggleButtonGroup  exclusive value={audiotrack} onChange={handleAudioTrackChange} >
                            <ToggleButton value="original"  className={classes.toggles}>Original Audio</ToggleButton>
                            <ToggleButton value="final" >Final Audio</ToggleButton>    
                        </ToggleButtonGroup>
                    </ButtonGroup>
                    <Grid>
                        <Duration seconds={duration * (1 - played)} /> / <Duration seconds={duration } />
                    </Grid>
                    
                    <ButtonGroup color="primary" aria-label="contained primary button group" >
                    
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
                            <Grid item>
                                <BottomDrawer />
                            </Grid>
                        </Grid>
                        
                        
                    </ButtonGroup>
                    <ButtonGroup style={{width: '40%'}}>
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