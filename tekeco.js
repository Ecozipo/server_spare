import express from "express";
import cors from "cors";
import UserRoute from "./routes/admin/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import iotRoute from "./routes/iotRoute.js";
import ProfessionalRoute from "./routes/ProfessionalRoute.js";
import AdminAuthroute from './routes/admin/AdminAuthroute.js'
import io from "./utils/socketio.js";
import device from "./controllers/deviceController.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Socket.IO connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    device.on('connect', function () {
        console.log('Connected to AWS IoT Core');
        // After connecting, you may want to publish/subscribe to topics
        device.publish('esp32/pub', JSON.stringify({ key: 'value' }));
    });

    device.on('message',(topic,payload)=>{
        socket.emit('mqtt_message',JSON.parse(payload.toString()))
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

app.use("/user", UserRoute);
app.use("/auth", AuthRoute);
app.use("/iot", iotRoute);
app.use('/admin/auth', AdminAuthroute);
app.use("/pro", ProfessionalRoute);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
