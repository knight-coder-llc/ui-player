import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Layout } from '../Layout';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        alignItems: 'center',
        paddingLeft: '15px',
        paddingRight: '15px',
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
  }));

  
export const Player = () => {
    const classes = useStyles();
    return  <Layout>
                <div className={classes.root}> 
                    <Typography component="div">
                        <Box textAlign="center"  fontWeight={500} m={1} fontSize="h4.fontSize" lineHeight={2} color={'black'}>
                            UI-Player
                        </Box>
                    </Typography>
                    <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' controls={false} width="100%" height="100%"/>
                    <ReactPlayer 
                    url="https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3" width="400px"
                    height="10px"
                    playing={false}
                    controls={false} />
                    <ButtonGroup color="primary" aria-label="outlined primary button group">
                        <Button>Stop</Button>
                        <Button>Play</Button>
                        <Button>FullScreen</Button>
                    </ButtonGroup>
                    <ButtonGroup color="primary" aria-label="outlined primary button group">
                        <Button>Original</Button>
                        <Button>High Definition</Button>
                    </ButtonGroup>
                </div>
            </Layout>
}