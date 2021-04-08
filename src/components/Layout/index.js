import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { styled } from '@material-ui/core/styles';
import { compose, spacing, palette } from '@material-ui/system';
import backgroundImg from '../../assets/background.jpg';
import './index.css';

const Box = styled('div')(compose(spacing, palette));

export const Layout = ({children}) => (
    <React.Fragment>
      <CssBaseline />
        { children }
    </React.Fragment>
)