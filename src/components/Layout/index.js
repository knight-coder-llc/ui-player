import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { styled } from '@material-ui/core/styles';
import { compose, spacing, palette } from '@material-ui/system';
import './index.css';

const Box = styled('div')(compose(spacing, palette));

export const Layout = ({children}) => (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" >
      { children }
        {/* <Box style={{
            backgroundImage: 'linear-gradient(to top, #00c6fb 0%, #005bea 100%)',
            // backgroundImage: 'linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)',
            borderRadius: '7%', 
            boxShadow: '0 2.8px 2.2px rgba(0, 0, 0, 0.034),0 6.7px 5.3px rgba(0, 0, 0, 0.048),0 12.5px 10px rgba(0, 0, 0, 0.06),0 22.3px 17.9px rgba(0, 0, 0, 0.072),0 41.8px 33.4px rgba(0, 0, 0, 0.086),0 100px 80px rgba(0, 0, 0, 0.12)'}} 
            color="white" 
            bgcolor="#dedede" 
            p={1}>
            { children }
        </Box>  */}
      </Container>
    </React.Fragment>
)