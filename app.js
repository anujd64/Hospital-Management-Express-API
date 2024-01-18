const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
var serviceAccount = require("./serviceAccountKey.json");

const app = express();
app.use(bodyParser.json());

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

const messaging = admin.messaging();

app.post('/api/emergency', async (req, res) => {
  const emergencyData = req.body;
  const patientId = emergencyData.patientId;
  const doctorId = emergencyData.doctorId;
  const patientName = emergencyData.patientName;
  const bedNo = emergencyData.bedNo;
  const doctorsDeviceToken = emergencyData.deviceToken;



  const payload = {
    notification: {
      title: "Emergency Alert",
      body: `${patientName} has declared an emergency. \nBed No.: ${bedNo}`,
    },
    data: {
      patientId: patientId,
      doctorId: doctorId,
    },
  };


  try {
    await messaging.sendToDevice(doctorsDeviceToken, payload);
    res.status(200).send({ message: "Notification sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error sending notification." });
  }
});

app.listen(3000, () => console.log('Server listening on port 3000'));
