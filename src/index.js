import React from 'react';
import ReactDOM from 'react-dom';

import {Player} from './components/ui-player';

function component() {
    const element = document.createElement('div');
    element.id = "comp-player";
    
    return element;
}

document.body.appendChild(component());
ReactDOM.render(<Player />, document.getElementById('comp-player'));
