import express from "express"
import cors from "cors"
import io from "./utils/socketio.js"
import path, { dirname } from "path"
import cron from "node-cron"
import { saveValue, getId, getPower, setPower } from "./data/State.js"
import { analyses } from "./tasks/Analyses.js"
import UserRoute from "./routes/admin/UserRoute.js"
import AuthRoute from "./routes/AuthRoute.js"
import iotRoute from "./routes/iotRoute.js"
import ProfessionalRoute from "./routes/ProfessionalRoute.js"
import AdminAuthroute from './routes/admin/AdminAuthroute.js'
import AdminFournisseurRoute from './routes/admin/AdminFournisseurRoute.js'
import FournisseurRoute from './routes/FournisseurRoute.js'
import NotificationRoute from './routes/NotificationRoute.js'
import AdminProRoute from './routes/admin/AdminProRoute.js'
import deviceRoute from './routes/deviceRoute.js'
import DownloadRoute from './routes/download/DownloadRoute.js'
import { redisClient } from "./utils/redis.js"
import { set_relay_delta, set_relay_state } from "./data/Relais.js"
import device from "./utils/awsDevice.js"

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
            console.log("send...")
            device.emit('realtime', 'accepted', Math.floor(Math.random() * 100))
        }, 1000)

        // After connecting, you may want to publish/subscribe to topics
        device.subscribe('esp32/pzem', (error, payload) => {
            if (error) console.log(error)
            console.log(payload.toString())
        })

        device.publish('$aws/things/Spare/shadow/get', '', (err) => {
            if (!err)console.log('get published')
        })

        device.subscribe('$aws/things/Spare/shadow/get/accepted', (err, payload) => {
            if (!err) console.log("initial state acquired")
        });

        device.subscribe('$aws/things/Spare/update/delta',(err,payload)=>{
            if(!err) console.log("delta connected")
        })
        // Voir etat de connexion du client
        device.subscribe('$aws/events/presence/connected', (err, payload) => {
            if (err) console.log(err)
            console.log(payload)
        });

        device.subscribe('$aws/events/presence/disconnected', (err, payload) => {
            if (err) console.log(err)
            console.log(payload)
        });

    });


    // device.on('message', (topic, payload) => {
    //     let data = JSON.parse(payload.toString())
    //     socket.emit('consommation', data.energy)
    //     socket.emit('vitesse', data.power)
    // })

    device.on('message', (topic, payload) => {

        if (topic === '$aws/events/presence/connected') {
            console.log("client connecté")
        } 

        if (topic === '$aws/events/presence/disconnected') {
            console.log("client deconnecté")
        } 

        if (topic === 'esp32/pzem') {
            let data = JSON.parse(payload.toString())
            console.log(data)
            setPower({ power: data.power, energy: data.energy })
            device.emit('vitesse', 'esp32/pzem', data.power)
            device.emit('consommation', 'esp32/pzem', data.energy)
            // device.emit('message', "esp32/pzem", JSON.stringify(payload))
        } 

        if (topic === '$aws/things/Spare/shadow/get/accepted') {
            console.log("on est là")
            let data = (JSON.parse(payload.toString()))
            const { state } = data
            console.log(state)
            set_relay_state(state)

            const {reported} = state
            socket.emit('state',reported)
        }

        if(topic==='$aws/things/Spare/update/delta'){
            console.log("delta acquired", payload)
            set_relay_delta(payload)
        }

    })
    device.on('state_led', (topic, payload) => {
        let data = payload
        socket.emit('state_led', data)
    })

    let notificationSent = false;

    device.on('vitesse', (topic, payload) => {

        let data = parseFloat(payload)
        let marge = data * 2

        if (data >= marge && !notificationSent) {

            console.log("Alerte sur consommation");
            setNotification({
                titre: "Alerte sur consommation",
                subject: "Votre consommation est très en hausse"
            });

            notificationSent = true
        }

        if (data < marge) {
            notificationSent = false
        }
    })

    device.on('realtime',(topic,payload)=>{
        console.log(payload)
        socket.emit('realtime',payload)
    })

    device.on('consommation', (topic, payload) => {
        let data = parseFloat(payload)
        let somme = getPower() + data
        setPower(somme)
        socket.emit('consommation', data)
    })

    device.on('realtime', (topic, payload) => {
        socket.emit('realtime', payload.toString())
    })


    device.on('notification', (topic, payload) => {
        socket.emit('notification', JSON.stringify(payload))
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
app.use('/admin/pro', AdminProRoute)
app.use("/pro", ProfessionalRoute);
app.use('/device', deviceRoute);
app.use('/notification', NotificationRoute)
app.use('/download', DownloadRoute)

app.listen(3000, () => {
    console.log("Server is running on port 3000");
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
});

cron.schedule('* * * * *', () => { saveValue({ id: getId(), power: getPower() }) })
cron.schedule('* * * * *', () => { analyses() })