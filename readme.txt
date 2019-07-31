#node.js for pzem module by chao imkhong

1.install 2019-07-10-raspbian-buster-lite.img for rpizero
2.install node.js and npm
   wget https://nodejs.org/dist/latest-v11.x/node-v11.15.0-linux-armv6l.tar.gz 
   tar -xzf node-v6.11.1-linux-armv6l.tar.gz
   cd node-v6.11.1-linux-armv6l/
   cd node-v8.9.0-linux-armv6l
   sudo cp -R * /usr/local/

3.install express serial socket.io
  cd /home/pi
  npm install express --save
  npm install serialport --unsafe-perm
  sudo npm install socket.io

4.run app.js for web server
  node app.js

5.run pzem.js for read data from pzem module
  node pzem.js 


