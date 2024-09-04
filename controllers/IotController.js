import device from "./deviceController.js";
import io from "../utils/socketio.js";

export const publishCommand = async (req, res) => {
    const message = req.body;
    device.publish('esp32/led', JSON.stringify(message), (err) => {
        if (err) {
            console.error('Error publishing message:', err);
            res.status(500).send('Error publishing message');
        } else {
            console.log('Message published successfully', JSON.stringify(message));
            res.status(200).json(message);
        }
    });

};

export const subscribeData = async (req, res) => {
    io.on('connection',(data)=>{
        console.log(data)
    })
};
