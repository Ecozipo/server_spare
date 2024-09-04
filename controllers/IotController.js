import device from "./deviceController.js";

export const publishCommand = async (req, res) => {
    const message = req.body; // Assuming the message is in the request body
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
    const topic = req.body
    console.log(topic)
    // device.subscribe(topic, (err, payload) => {
    //     if (err) {
    //         console.error('Error subscribing to topic:', err);
    //         res.status(500).send('Error subscribing to topic');
    //     } else {
    //         console.log(payload);
    //         res.status(200).json(payload);
    //     }
    // });

};
