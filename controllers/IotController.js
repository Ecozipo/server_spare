import device from "../utils/awsDevice.js";
import { io } from "socket.io-client";
import { getPower, setPower, setId } from "../data/State.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { log } from "console";


const socket = io("ws://localhost:5000");
const prisma = new PrismaClient();

export const publishCommand = async (req, res) => {
  const state = req.body
  device.publish(
    "$aws/things/Spare/shadow/update",
    JSON.stringify(state),
    (err) => {
      if (err) {
        console.error("Error publishing message:", err);
        res.status(500).send("Error publishing message");
      } else {
        console.log("Message published successfully");
      }
    }
  );

  device.subscribe('$aws/things/Spare/shadow/get/accepted', (err, payload) => {
    if (err) console.log(err)
    console.log(payload)
    res.status(200).send(payload)
  });

};

export const subscribeData = async (req, res) => {

  try {
    setId(parseInt(2));

    console.log(getPower());
    let lastValue = getPower();

    socket.on("consommation", (data) => {
      console.log(data)
    });

    socket.on("vitesse", (data) => {
      console.log(data)
    });

    res.status(200).json({ message: { data_sent: true } });
  } catch (error) {
    console.log(error)
  }

};

export const realTime = (req, res) => {
  socket.on('realtime', (data) => {
    console.log(data)
  })
  res.status(200).json({ data_sent: true });
}

export const totalPower = async (req, res) => {
  res.status(200).json({ power: getPower() });
};

export const subscribeStateLed = async (req, res) => {
  let somme = 0;

  socket.on("state_led", (data) => {
    // console.log({data})
    setTimeout(() => {
      console.log({ power: getPower() });
    }, 1000);
  });
};
