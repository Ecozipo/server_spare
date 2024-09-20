import device from "../utils/awsDevice.js";
import { io } from "socket.io-client";
import { getPower, setPower, setId } from "../data/State.js";
// import { redisClient } from "../utils/redis.js";
// import { createClient } from "redis";

const socket = io('ws://localhost:5000')
// let redisClient = createClient();

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
    const token = req.headers.authorization.split(" ")[1];

    const { id } = jwt.decode(token).utilisateur

    const utilisateur = await prisma.utilisateur.findUnique({ where: { id: parseInt(id) } })

    if (!utilisateur) {
        res.status(500).send({ errorMessage: "Utilisateur introuvable" })
    }
    setId(parseInt(id))

    console.log(getPower())
    let lastValue = getPower()

    socket.on("send_stats", (data) => {
        console.log("listening to data")
        if (data.power) {
            setPower(parseInt(data.power) + lastValue)
        }
        res.status(200).json({ power: getPower() })
        console.log(data)
    })
};


export const totalPower = async (req, res) => {
    res.status(200).json({ power: getPower() })
}

export const subscribeStateLed = async (req, res) => {
    let somme = 0;

    socket.on("state_led", (data) => {
        // console.log({data})
        setTimeout(() => {
            console.log({power: getPower()})
        }, 1000)
    })
};
