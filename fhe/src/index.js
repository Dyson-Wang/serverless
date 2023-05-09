import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import instance from './utils/axios';
import store from './utils/redux.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

    root.render(
        <Provider store={store}>
            <App />
        </Provider>
    );
