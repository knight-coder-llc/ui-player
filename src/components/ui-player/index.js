import React, { useState, useRef } from 'react';
import { findDOMNode } from 'react-dom';
import ReactPlayer from 'react-player';
import { Layout } from '../Layout';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import BottomDrawer from '../Drawer';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import StopIcon from '@material-ui/icons/Stop';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import screenfull from 'screenfull';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        alignItems: 'center',
        paddingLeft: '15px',
        paddingRight: '15px',
        display: 'flex',
        height: '100%',
        width: '100%',
        color: '#3f51b5',
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
    }
  }));

  
export const Player = () => {
    const classes = useStyles();
    // initialize context variables.
    const [volumeLevel, setVolumeLevel] = React.useState(30.0);
    const [playing, setPlaying] = React.useState(false);
    const [duration, setDuration] = React.useState(0);
    const [url, setUrl] = React.useState(null);
    
    // UI Player control handlers.
    const handlePlayPause = () => (setPlaying(!playing));
    const handlePlay = () => (setPlaying(true));
    const handleStop = () => {
        setUrl(null);
        setPlaying(false);
    };
    const handleVolumeChange = (e, newValue) => (setVolumeLevel(parseFloat(newValue)));
    const handleClickFullscreen = () => {
        screenfull.request(findDOMNode(playerRef.current))
    }

    const playerRef = useRef(null);

    return  <Layout>
                <div className={classes.root}> 
                    <Typography component="div">
                        <Box fontWeight={500} m={1} fontSize="h6.fontSize" lineHeight={2} >
                            Free Video Player 1.0.0
                        </Box>
                    </Typography>
                    <ReactPlayer 
                        ref={playerRef}
                        url='https://www.youtube.com/watch?v=ysz5S6PUM-U' 
                        controls={false} 
                        width="100%" 
                        height="100%" 
                        volume={volumeLevel}
                        playing={playing}/>
                    <ReactPlayer 
                        url="https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3" width="400px"
                        height="10px"
                        playing={false}
                        controls={false} />
                    <ButtonGroup color="primary" aria-label="outlined primary button group">
                        <Grid container spacing={4}>
                            <Grid item>
                                <Button color="primary" variant="outlined">Original Audio</Button>
                            </Grid>
                            <Grid item>
                                <Button color="primary" variant="outlined" onClick={handleStop}><StopIcon/></Button>
                                <Button className={classes.rewind} color="primary" variant="outlined"><DoubleArrowIcon/></Button>
                                <Button color="primary" variant="outlined" onClick={handlePlay}> <PlayCircleFilledIcon/></Button>
                                <Button id="fastforward" color="primary" variant="outlined"><DoubleArrowIcon/></Button>
                                <Button color="primary" variant="outlined" onClick={handleClickFullscreen}><FullscreenIcon/></Button>
                                <Typography id="continuous-slider" gutterBottom>
                                    Volume
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <VolumeDown />
                                    </Grid>
                                    <Grid item xs>
                                        <Slider value={volumeLevel} onChange={handleVolumeChange} aria-labelledby="continuous-slider" />
                                    </Grid>
                                    <Grid item>
                                        <VolumeUp />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Button color="primary" variant="outlined">Final Audio</Button>
                            </Grid>
                        </Grid>
                    </ButtonGroup>
                    <ButtonGroup color="primary" aria-label="outlined primary button group">
                        
                        <BottomDrawer />
                    </ButtonGroup>
                </div>
            </Layout>
}