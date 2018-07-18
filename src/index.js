import React from 'react';
import ReactDOM from 'react-dom';
import './antd-mobile.css';
import './index.css';
import './config.js';
import App from './App';
import { HashRouter as Router } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(<Router><App /></Router>, document.getElementById('root'));
registerServiceWorker();
