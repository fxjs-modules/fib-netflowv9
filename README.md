netflow
==============

NetFlow Version 5 library for Fibjs

## install

    npm install @fxjs/netflow

## Usage

The usage of the netflowv9 collector library is very very simple. You just have to do something like this:


    let Collector = require('@fxjs/netflow');

    let co = new Collector(3000, function(flow) {
        console.log(flow);
    })
    co.run((err) => { console.error(err); })

or you can use it as event provider:

    let co = new Collector({port: 3000}).on('data',function(flow) {
        console.log(flow);
    });
    co.run()


The flow will be presented in a format very similar to this:


    { header:
      { version: 9,
         count: 25,
         uptime: 2452864139,
         seconds: 1401951592,
         sequence: 254138992,
         sourceId: 2081 },
      rinfo:
      { address: '15.21.21.13',
         family: 'IPv4',
         port: 29471,
         size: 1452 },
      packet: Buffer <00 00 00 00 ....>
      flow: [
      { in_pkts: 3,
         in_bytes: 144,
         ipv4_src_addr: '15.23.23.37',
         ipv4_dst_addr: '16.16.19.165',
         input_snmp: 27,
         output_snmp: 16,
         last_switched: 2452753808,
         first_switched: 2452744429,
         l4_src_port: 61538,
         l4_dst_port: 62348,
         out_as: 0,
         in_as: 0,
         bgp_ipv4_next_hop: '16.16.1.1',
         src_mask: 32,
         dst_mask: 24,
         protocol: 17,
         tcp_flags: 0,
         src_tos: 0,
         direction: 1,
         fw_status: 64,
         flow_sampler_id: 2 } } ]


There will be one callback for each packet, which may contain more than one flow.

Additionally, you can use the collector to listen for template updates:

    var collector = new Collector({port: 3000});
    collector.on('data', function(data) {
        console.log(data);
    });
    collector.run()

Currently we support netflow version 5.

## Options

You can initialize the collector with either callback function only or a group of options within an object.

The following options are available during initialization:

**port** - defines the port where our collector will listen to.

    new Collector({ port: 5000, cb: function (flow) { console.log(flow) } })

Or

    new Collector(5000, function (flow) { console.log(flow) })

**host** - binds to a particular host on the local interfaces.

    new Collector({ port: 5000, host: '0.0.0.0', cb: function (flow) { console.log(flow) } })

**type** - defines to what socket type we will bind to. Default is udp4. You can change it to udp6 is you like.

    new Collector(5000, { socketType: 'udp6', cb: function (flow) { console.log(flow) } })

**recvBufferSize** - defines the udp socket recvBuffer default 256kbytes.

## Multiple collectors

The module allows you to define multiple collectors at the same time.
For example:

    var Collector = require('@fxjs/netflow');

    new Collector(5555, function(flow) { // Collector 1 listening on port 5555
        console.log(flow);
    }).run();

    new Collector(6666, function(flow) { // Collector 2 listening on port 6666
        console.log(flow);
    }).run();