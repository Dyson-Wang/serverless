const vm = require("node:vm");

const vmFunc = (code, data, maxruntime) => {
    var sandbox = {
        ...global,
        glob: {
            ...data
        },
        require: (pkgname)=>{
            if(pkgname.includes('os')) return undefined
            return require(pkgname);
        },
        process: undefined
    };

    vm.createContext(sandbox);
    return vm.runInNewContext(code, sandbox, {
        timeout: maxruntime,
        microtaskMode: 'afterEvaluate'
    });
}
module.exports = vmFunc