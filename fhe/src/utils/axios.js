import axios from "axios";
import fingerprintjs from '@fingerprintjs/fingerprintjs'

const instance = axios.create({
    baseURL: 'http://127.0.0.1:3000',
    // baseURL: 'http://8.130.24.65:3000',
    timeout: 10000,
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

export const getMain = async () => {
    try {
        const res = await instance.get('/main');
        return res.data;
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
export const getUserNamespace = async (browsertoken) => {
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
export const postUserNamespace = async (namespace, browsertoken) => {
    try {
        const res = await instance.post('/namespace', {
            namespace: namespace
        }, {
            headers: { Authorization: browsertoken }
        })
        return res.data;
    } catch (err) {
        return {status: 'axios fail', message: 'error'};
    }
};

// 删除函数
export const delUserNamespace = async (namespace, browsertoken) => {
    try {
        const res = await instance.post(`/delns`, {
            namespace
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

// function list
export const getUserFunction = async (browsertoken) => {
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
export const postUserFunction = async (data, browsertoken) => {
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
export const delUserFunction = async (funcname, namespace, browsertoken) => {
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
export const getUserFunctionConfig = async (funcname, namespace, browsertoken) => {
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
export const postModUserFunctionConfig = async (data, browsertoken) => {
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

// test db
export const postTestUserDB = async (data, browsertoken) => {
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

//
export const postModUserDB = async (data, browsertoken) => {
    try {
        const res = await instance.post('/dbmod', data, {
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