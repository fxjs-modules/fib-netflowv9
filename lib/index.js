var vm = require('vm');

var sbox = new vm.SandBox({
    util: require('util'),
    tty: require('tty'),
    events: require('events'),
    dgram: require('dgram'),
    clone: require('util').clone
});

module.exports = sbox.require('node-netflowv9', __filename);