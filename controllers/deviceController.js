import awsIot from 'aws-iot-device-sdk';
import express from 'express';

const app = express()

const device = awsIot.device({
    keyPath: "config/credentials/81e5e6a3a666ef15c189137f854e262068c25f1af24258a82c73a56e15ce7800-private.pem.key",
    certPath: 'config/credentials/81e5e6a3a666ef15c189137f854e262068c25f1af24258a82c73a56e15ce7800-certificate.pem.crt',
    caPath: 'config/credentials/AmazonRootCA1.pem',
    clientId: 'Node',
    host: 'a27g25yfuax5ui-ats.iot.us-east-1.amazonaws.com'
});
device.on('connect', function () {
    console.log('Connected to AWS IoT Core');
    // After connecting, you may want to publish/subscribe to topics
    device.subscribe('esp32/pzem', (err, paylod, hafa) => {
        if (err) console.log(err)
        console.log(paylod)
        device.emit("message", "esp32/pzem", JSON.stringify(paylod))
    });
    device.publish('esp32/pub', JSON.stringify({ key: 'value' }));
});

device.on('message', function (topic, payload) {
    console.log('message', topic, payload.toString());
});

app.post('/publish', (req, res) => {
    const message = req.body;

    device.publish('esp32/led', JSON.stringify(message), (err) => {
        if (err) {
            console.error('Error publishing message:', err);
            res.status(500).send('Error publishing message');
        } else {
            console.log('Message published successfully');
            res.sendStatus(200);
        }
    });
});

export default device
