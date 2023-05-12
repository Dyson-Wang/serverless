const vm = require("node:vm");
var { readFileSyncToData } = require('./file')

const vmFunc = (code, data) => {
    var sandbox = {
        require,
        console,
        ...data
    };

    vm.createContext(sandbox);
    return vm.runInContext(code, sandbox);
}

module.exports = vmFunc