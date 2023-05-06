const vm = require("node:vm");
var { readFileSyncToData } = require('./file')

const vmFunc = (code) => {
    var sandbox = {
        require,
        console
    };

    vm.createContext(sandbox);
    return vm.runInContext(code, sandbox);
}

module.exports = vmFunc