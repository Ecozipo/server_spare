
import awsIot, { device } from 'aws-iot-device-sdk';
import io from './socketio';

let device = {}

io.on('connection',(socket)=>{
     device = awsIot.device({
        keyPath: "config/credentials/81e5e6a3a666ef15c189137f854e262068c25f1af24258a82c73a56e15ce7800-private.pem.key",
        certPath: 'config/credentials/81e5e6a3a666ef15c189137f854e262068c25f1af24258a82c73a56e15ce7800-certificate.pem.crt',
        caPath: 'config/credentials/AmazonRootCA1.pem',
        clientId: socket.id,
        host: 'a27g25yfuax5ui-ats.iot.us-east-1.amazonaws.com'
    });

    console.log('device created successfully')
})

export default device