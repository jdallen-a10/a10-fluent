# a10-fluent
An A10 Thunder to Fluentd proxy server

<img src="A10-logo-blue-2020.png" width=300px>&nbsp;&nbsp;&nbsp;&nbsp;<img src="fluent.png" width=300px><br>
<br>

This program/Docker Container will take in the logging output from an [A10 Thunder](https://www.a10networks.com/) device, and "push" it over to a [fluentd](https://www.fluentd.org/) server.<br>
<br>

## Installation
You can either just run the ``fluentproxy.js`` program, or build a Docker container.  Either way, you will need to create a ``config.json`` file in order to configure the program.<br>
<br>
The ``config.json`` file looks like this:

```
{
  "debug": 0,
  "showstart": true,
  "lable": "a10",
  "port": 5514,
  "timeout": 3.0,
  "reconnect": 60000,
  "fluent_ip": "172.17.0.3",
  "fluent_port": 24224
}
```

**debug** is a value (0 - 10) to set for debugging information to be printed out. Anything above a '7' is pretty verbose.<br>
**showstart** is a boolean that prints out and pushes to fluentd a message about the a10-fluent starting.<br>
**lable** is the lable used for the records pushed to fluentd.  In this example, they would show up as ``debug.a10``<br>
**port** is the local port to listen to for log messages from the A10 Thunder device(s).<br>
**timeout** is the timeout value for connecting to the defined ``fluentd`` node. It defaults to 3 seconds.<br>
**reconnect** is how long the program waits to try and reconnect to fluentd. it defaults to 60 seconds.<br>
**fluent_ip** is the IP address or FQDN of the ``fluentd`` node. It defaults to ``0.0.0.0``<br>
**fluent_port** is the IP Port to use when connecting to the ``fluentd`` node. It defaults to ``24224``<br>

## Thunder Configuration
There are two lines you need to add to the Thunder configuration:

```
!
logging syslog information
!
logging host {IP of node/container running the program} use-mgmt-port port {port}
!
```

The ``{port}`` value needs to be the same value from the ``port:`` line of your ``config.json`` file. The ``use-mgmt-port`` parameter is optional. Use it if your ``a10-fluent`` program is running on the same subnet or network that the A10 Thunder device has its Management port connected to. Otherwise it will try and connect using a Data Port.<br>
This will stop logging on the Thunder in favor of logging on the a10-fluent/fluentd solution.<br>
<br>

## Building the Docker Continer
The ``build_container.sh`` file has an example of how to create the a10-fluent Docker container.<br>

## Running the Docker Container

```
docker run -d --restart=always \
  --name=a10fluent \
  -p 5514:5514 \
  -p 5514:5514/udp \
  -v $(pwd)/config.json:/proxy/config.json \
  a10networks/a10-fluent:latest
```

Keep in mind that the port commands need to match what you have in your ``config.json`` file for the ''port'' option.<br>
<br>

