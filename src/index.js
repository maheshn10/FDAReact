import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// import { Provider } from 'react-redux';
// import store from './store/store';

// import Routes from './components/Routes/Routes';

const app = document.getElementById('app-root');

ReactDOM.render(<App />, app);
