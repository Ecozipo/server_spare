import express from "express"
import cors from "cors"
import io from "./utils/socketio.js"
import path, { dirname } from "path"
import cron from "node-cron"
import { saveValue, getPower, setPower, writecsv } from "./data/State.js"
import { analyses } from "./tasks/Analyses.js"
import UserRoute from "./routes/admin/UserRoute.js"
import AssistanceRoute from "./routes/admin/AssistanceRoute.js"
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
import ConsommationRoute from './routes/ConsommationRoute.js'
import StatsRoute from './routes/StatsRoute.js'
import typeDeviceRoute from './routes/admin/TypeDeviceRoute.js'
import StoreRoute from './routes/store/StoreRoute.js'
import { getAssistances } from "./tasks/Assistance.js"
import { redisClient } from "./utils/redis.js"
import { get_relay_state, set_relay_delta, set_relay_state } from "./data/Relais.js"
import device from "./utils/awsDevice.js"
import Abonnement from './routes/Abonnement.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// injectData()
// Socket.IO connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);


    device.on('connect', function () {
        console.log('Connected to AWS IoT Core');

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
            device.emit('client_connected','$aws/events/presence/connected',payload)
        } 

        if (topic === '$aws/events/presence/disconnected') {
            device.emit('client_disconnected','$aws/events/presence/disconnected',payload)
        } 

        if (topic === 'esp32/pzem') {
            let data = JSON.parse(payload.toString())
            const { power, energy, freq, pf, debit, tank } = data
            // console.log({ power, energy, freq, pf })
            // writecsv(data)
            device.emit('vitesse', 'esp32/pzem', power)
            device.emit('consommation', 'esp32/pzem', energy)
            device.emit('frequence','esp32/pzem',freq)
            device.emit('facteur-puissance','esp32/pzem',pf)
            device.emit('debit','esp32/pzem',debit)
            devic.emit('tank','esp32/pzem',tank)

            setPower({power,energy})
            // device.emit('message', "esp32/pzem", JSON.stringify(payload))
        } 

        if (topic === '$aws/things/Spare/shadow/get/accepted') {
            console.log("on est là")
            let data = (JSON.parse(payload.toString()))
            const { state } = data
            // console.log(state)
            set_relay_state(state)
            const {reported} = state
            socket.emit('state',reported)
        }

        if(topic==='$aws/things/Spare/update/delta'){
            console.log("delta acquired", payload)
            set_relay_delta(payload)
        }

    })
    device.on('client_connected',(topic,payload)=>{
        console.log(payload)
        socket.emit("client_connected",payload)
    })
    device.on('client_disconnected',(topic,payload)=>{
        console.log(payload)
        socket.emit("client_disconnected",payload)
    })

    device.on('state_led', (topic, payload) => {
        let data = payload
        socket.emit('state_led', data)
    })

    let notificationSent = false;

    device.on('vitesse', (topic, payload) => {

        let data = parseFloat(payload)

        socket.emit('vitesse',data)
    })

    device.on('realtime',(topic,payload)=>{
        socket.emit('realtime',payload)
    })

    device.on('consommation', (topic, payload) => {
        let data = parseFloat(payload)
        socket.emit('consommation', data)
    })

    device.on('frequence',(topic,payload)=>{
        let data = parseFloat(payload)
        console.log({freq:data})
        socket.emit('frequence',data)
    })

    device.on('facteur-puissance',(topic,payload)=>{
        let data = parseFloat(payload)
        console.log({pf:data})
        socket.emit('facteur-puissance',data)
    })

    device.on('debit',(topic,payload)=>{
        let data = parseFloat(payload)
        // console.log({pf:data})
        socket.emit('debit',data)
    })

    device.on('tank',(topic,payload)=>{
        let data = parseFloat(payload)
        socket.emit('tank',data)
    })

    device.on('notification', (topic, payload) => {
        socket.emit('notification', payload)
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

app.use('/admin/pro', AdminProRoute)
app.use('/admin/auth', AdminAuthroute)
app.use('/admin/shops', AdminFournisseurRoute)
app.use("/auth", AuthRoute)
app.use('/assistance', AssistanceRoute)
app.use('/stats',ConsommationRoute)
app.use('/device', deviceRoute)
app.use('/download', DownloadRoute)
app.use("/iot", iotRoute)
app.use('/notification', NotificationRoute)
app.use("/pro", ProfessionalRoute)
app.use('/shops', FournisseurRoute)
app.use('/store',StoreRoute)
app.get('/state',(req,res)=>{
    const {reported} = get_relay_state()
    res.status(200).json(reported)
})
app.use("/stat", StatsRoute);
app.use('/devicetype',typeDeviceRoute)
app.use("/user", UserRoute);
app.use("/abonnement",Abonnement)

app.listen(3000, () => {
    console.log("Server is running on port 3000");
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
});

cron.schedule('0 * * * *', () => { saveValue(getPower()) })
cron.schedule('* * * * *', () => { analyses() })
// cron.schedule(`${Math.floor(Math.random()*60)} ${Math.floor(Math.random()*24)} * * *`, () => { getAssistances() })
cron.schedule('*/5 * * * *', () => { getAssistances() })