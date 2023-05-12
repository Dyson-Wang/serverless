import axios from "axios";
import fingerprintjs from '@fingerprintjs/fingerprintjs'

const browsertoken = window.localStorage.getItem('browsertoken');

const instance = axios.create({
    baseURL: 'http://127.0.0.1:3000',
    timeout: 1000,
})

export const login = async () => {
    try {
        const { visitorId } = await fingerprintjs.load().then(fp => fp.get())
        const res = await instance.post('/login', {
            browserid: visitorId
        })
        return { browserid: visitorId, browsertoken: res.data.token };
    } catch (err) {
        return console.log(err);
    }
};

export const getRandomFuncName = async () => {
    try {
        const res = await instance.get('/randomfuncname')
        return res.data;
    } catch (error) {
        console.log(error)
    }

}

export const getUserNamespace = async () => {
    try {
        const res = await instance.get('/namespace', {
            headers: {
                Authorization: browsertoken
            }
        });
        res.data.map((e, i) => {
            Object.defineProperty(e, 'key', {
                value: i
            });
        });
        return res.data;
    } catch (err) {
        return console.log(err);
    }
};

export const postUserNamespace = async (namespace) => {
    try {
        const res = await instance.post('/namespace', {
            namespace: namespace
        }, {
            headers: { Authorization: browsertoken }
        })
        return res;
    } catch (err) {
        return console.log(err);
    }
};

export const getUserFunction = async () => {
    try {
        const res = await instance.get('/funclist', {
            headers: {
                Authorization: browsertoken
            }
        });
        res.data.map((e, i) => {
            Object.defineProperty(e, 'key', {
                value: i
            });
        });
        return res.data;
    } catch (err) {
        return console.log(err);
    }
};

export const postUserFunction = async (data) => {
    try {

        const res = await instance.post('/addfunc', data, {
            headers: {
                Authorization: browsertoken
            }
        })
        return res.data;
    } catch (err) {
        return console.log(err);
    }
};

export const getNamespaceFunction = async (namespace) => {
    try {
        const res = await instance.get(`/namespace/${namespace}`, {
            headers: {
                Authorization: browsertoken
            }
        });
        res.data.map((e, i) => {
            Object.defineProperty(e, 'key', {
                value: i
            });
        });
        return res.data;
    } catch (err) {
        return console.log(err);
    }
};

export default instance;