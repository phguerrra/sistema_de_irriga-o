const mqtt = require("mqtt");

const client = mqtt.connect(process.env.MQTT_BROKER);

client.on("connect", () => {
  console.log("📡 MQTT conectado");
});

client.on("error", err => {
  console.error("❌ MQTT erro:", err);
});

module.exports = client;
