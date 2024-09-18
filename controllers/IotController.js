import device from "../utils/awsDevice.js";
import { io } from "socket.io-client";


const socket = io('ws://localhost:5000')

export const publishCommand = async (req, res) => {
    const state = req.body;
    // device.publish('esp32/led', JSON.stringify(message), (err) => {
    //     if (err) {
    //         console.error('Error publishing message:', err);
    //         res.status(500).send('Error publishing message');
    //     } else {
    //         console.log('Message published successfully', JSON.stringify(message));
    //         res.status(200).json(message);
    //     }
    // });

    device.publish('$aws/things/Spare/shadow/update', JSON.stringify(state), (err) => {
        if (err) {
            console.error('Error publishing message:', err);
            res.status(500).send('Error publishing message');
        } else {
            console.log('Message published successfully');
            res.sendStatus(200);
        }
    });

};

export const subscribeData = async (req, res) => {
    let power = 0;
    console.log(power)
    socket.on("send_stats", (data) => {
        console.log("listening to data")
        if (data.power) {
            power += data.power
        }
        res.status(200).json({ power })
        console.log(data)
    })
};


export const totalPower = async (req, res) => {
    let power = 0;

}

export const subscribeStateLed = async (req, res) => {
    socket.on("state_led", (data) => {
        console.log("state of the leds")
        console.log(data)
        // res.status(200).json(data)
    })
};
