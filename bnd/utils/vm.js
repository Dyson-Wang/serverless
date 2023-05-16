const vm = require("node:vm");

const vmFunc = (code, data, maxruntime) => {
    var sandbox = {
        glob: {
            ...data
        },
        require: (pkgname)=>{
            if(pkgname.includes('os')) return undefined
            return require(pkgname);
        }
    };

    vm.createContext(sandbox);
    return vm.runInNewContext(code, sandbox, {
        timeout: maxruntime,
        microtaskMode: 'afterEvaluate'
    });
}

module.exports = vmFunc