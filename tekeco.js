import express from "express"
import cors from "cors"
import io from "./utils/socketio.js"
import path, { dirname } from "path"
import cron from "node-cron"
import moment from "moment-timezone"
import { saveValue, getId, getPower, setPower } from "./data/State.js"
import device from './utils/awsDevice.js'
import UserRoute from "./routes/admin/UserRoute.js"
import AuthRoute from "./routes/AuthRoute.js"
import iotRoute from "./routes/iotRoute.js"
import ProfessionalRoute from "./routes/ProfessionalRoute.js"
import AdminAuthroute from './routes/admin/AdminAuthroute.js'
import AdminFournisseurRoute from './routes/admin/AdminFournisseurRoute.js'
import FournisseurRoute from './routes/FournisseurRoute.js'
import deviceRoute from './routes/deviceRoute.js'
import { redisClient } from "./utils/redis.js"

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Socket.IO connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    device.on('connect', function () {
        console.log('Connected to AWS IoT Core');
        setInterval(() => {
            device.emit('realtime', 'accepted', Math.floor(Math.random() * 100))
        }, 1000)

        // After connecting, you may want to publish/subscribe to topics
        device.subscribe('esp32/pzem', (error, payload) => {
            if (error) console.log(error)
            console.log(payload.toString())
            let data = JSON.stringify(payload)
            console.log(data)
            device.emit('vitesse', 'esp32/pzem', data.power)
            device.emit('consommation', 'esp32/pzem', data.energy)
            device.emit('message', "esp32/pzem", JSON.stringify(payload))
        })

        device.subscribe('$aws/things/Spare/shadow/get/accepted', (err, payload) => {
            if (err) console.log(err)
            // console.log(payload)
            device.emit("state_led", "accepted", JSON.stringify(payload))
        });

    });


    device.on('message', (topic, payload) => {
        let data = JSON.parse(payload.toString())
        socket.emit('consommation', data.energy)
        socket.emit('vitesse', data.power)
    })

    device.on('vitesse', (topic, payload) => {
        let data = parseFloat(payload)
        socket.emit('vitesse', data)
    })

    device.on('consommation', (topic, payload) => {
        let data = parseFloat(payload)
        socket.emit('consommation', data)
    })

    device.on('realtime', (topic, payload) => {
        socket.emit('realtime', payload.toString())
    })

    device.on('state_led', (topic, payload) => {


        let data = JSON.parse(payload.toString())
        socket.emit('state_led', JSON.parse(payload.toString()))

    })

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });

    redisClient.on('connect', () => {
        console.log('Redis connected');
    });
});

// Serve static files from the 'assets' folder
app.use('/assets', express.static(path.resolve(dirname('assets'), 'assets',)));

app.use("/user", UserRoute);
app.use("/auth", AuthRoute);
app.use("/iot", iotRoute);
app.use('/admin/auth', AdminAuthroute);
app.use('/admin/shops', AdminFournisseurRoute);
app.use('/shops', FournisseurRoute)
app.use("/pro", ProfessionalRoute);
app.use('/device', deviceRoute);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
});


//-----------Save value in database by cron-node------

// cron.schedule('* * * * *', async () => {
//     console.log("Cron job running at:")
//     const now = moment().tz('Indian/Antananarivo').format('HH:mm:ss')
//     console.log(now.toString())
//     const temps = now.split(":")

//     temps.forEach((element, index) => {
//         temps[index] = parseInt(element)
//     })

//     if (temps[0] === 2 && temps[1] === 49 && temps[2] === 0) {
//         const finished = await saveValue({ id: getId(), power: getPower() })
//         console.log(finished)
//     }
//     //
// })

cron.schedule('* * * * *', () => { saveValue({ id: getId(), power: getPower() }) })