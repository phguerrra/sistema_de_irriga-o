const mqtt = require("./client");
const prisma = require("../prisma");

mqtt.subscribe("irrigacao/+/+/status");
mqtt.subscribe("irrigacao/+/+/sensor");

mqtt.on("message", async (topic, message) => {
  const msg = message.toString();
  const [, userId, mangueiraId, tipo] = topic.split("/");
  const id = Number(mangueiraId);

  // STATUS
  if (tipo === "status") {
    await prisma.statusMangueira.update({
      where: { mangueiraId: id },
      data: {
        status: msg === "ligado" ? "LIGADA" : "DESLIGADA"
      }
    });

    if (msg === "ligado") {
      await prisma.historico.create({
        data: { mangueiraId: id, ligadoEm: new Date() }
      });
    }

    if (msg === "desligado") {
      const h = await prisma.historico.findFirst({
        where: { mangueiraId: id, desligadoEm: null },
        orderBy: { ligadoEm: "desc" }
      });

      if (h) {
        const desligadoEm = new Date();
        const tempoLigado = Math.floor((desligadoEm - h.ligadoEm) / 1000);

        await prisma.historico.update({
          where: { id: h.id },
          data: { desligadoEm, tempoLigado }
        });
      }
    }
  }

  // SENSOR
  if (tipo === "sensor") {
    await prisma.statusMangueira.update({
      where: { mangueiraId: id },
      data: { sensorStatus: msg }
    });

    console.log(`🚨 SENSOR | Mangueira ${id}: ${msg}`);
  }
});
