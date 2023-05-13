import axios from "axios";
import fingerprintjs from '@fingerprintjs/fingerprintjs'

const browsertoken = window.localStorage.getItem('browsertoken');

const instance = axios.create({
    baseURL: 'http://127.0.0.1:3000',
    timeout: 1000,
})

// browsertoken
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

// random
export const getRandomFuncName = async () => {
    try {
        const res = await instance.get('/randomfuncname')
        return res.data;
    } catch (error) {
        console.log(error)
    }

}

// namespace list
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

// 创建namespace
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

// function list
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

// 创建function
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

// 删除函数
export const delUserFunction = async (funcname, namespace) => {
    try {
        const res = await instance.post(`/delfunc`, {
            funcname, namespace
        }, {
            headers: {
                Authorization: browsertoken
            }
        });
        return res.data;
    } catch (err) {
        return console.log(err);
    }
};

// 获取函数详情
export const getUserFunctionConfig = async (funcname, namespace) => {
    try {
        const res = await instance.get(`/config/${namespace}/${funcname}`, {
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

// 修改函数详情
export const postModUserFunctionConfig = async (data) => {
    try {
        const res = await instance.post('/modfunc', data, {
            headers: {
                Authorization: browsertoken
            }
        })
        return res.data;
    } catch (err) {
        return console.log(err);
    }
};

export const postTestUserDB = async (data) => {
    try {
        const res = await instance.post('/dbtest', data, {
            headers: {
                Authorization: browsertoken
            }
        })
        return res.data;
    } catch (err) {
        return console.log(err)
    }
}

export default instance;