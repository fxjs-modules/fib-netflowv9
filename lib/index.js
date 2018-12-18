const EventEmitter = require('events');
const dgram = require('dgram')
const util = require('util')
const nf5decoder = require('./decode/nf5')

function NetflowDecoder(port, opts) {
    let _port = port,
        _opts = opts
    if (util.isObject(port)) {
        _port = port.port
        _opts = port
    }
    if(util.isFunction(opts))
        _opts = {
            cb: opts
        }
    _opts = _opts || {}
    let _host = _opts.host
    this.server = dgram.createSocket({
        type: _opts.type || 'udp4',
        reuseAddr: _opts.reuseAddr || true,
        recvBufferSize: _opts.recvBufferSize || 256 * 1024
    })
    this.server.on('message', (msg, rinfo) => {
        let startTime = Date.now()
        let o = nf5decoder(msg, rinfo)
        let duration = Date.now() - startTime
        if (o && o.flows.length > 0) {
            o.rinfo = rinfo;
            o.packet = msg;
            o.decodeMs = duration;
            if (_opts.cb)
                _opts.cb(o);
            else
                this.emit('data', o);
        }
    })
    this.server.onclose = (e) => {
        this.onclose(e)
    }
    this.server.onerror = (e) => {
        this.onerror(e)
    }
    this.run = (fn) => {
        this.server.bind(_port, _host)
        if (fn) {
            this.onclose = fn
            this.onerror = fn
        }
    }
    this.stop = () => {
        this.server.close()
    }
}
util.inherits(NetflowDecoder, EventEmitter)
module.exports = NetflowDecoder