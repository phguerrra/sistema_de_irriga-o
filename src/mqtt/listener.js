const mqtt = require("./client");
const prisma = require("../prisma");

mqtt.subscribe("irrigacao/+/+/status");

mqtt.on("message", async (topic, message) => {
  const status = message.toString();
  const [, userId, mangueiraId] = topic.split("/");

  console.log(
    `📥 STATUS | Mangueira ${mangueiraId}: ${status}`
  );

  try {
    // ================================
    // LIGADO → CRIA HISTÓRICO
    // ================================
    if (status === "ligado") {
      await prisma.statusMangueira.update({
        where: { mangueiraId: Number(mangueiraId) },
        data: { status: "LIGADA" }
      });

      // SEMPRE cria novo histórico
      await prisma.historico.create({
        data: {
          mangueiraId: Number(mangueiraId),
          ligadoEm: new Date()
        }
      });

      console.log("📘 Histórico CRIADO");
    }

    // ================================
    // DESLIGADO → FECHA HISTÓRICO
    // ================================
    if (status === "desligado") {
      await prisma.statusMangueira.update({
        where: { mangueiraId: Number(mangueiraId) },
        data: { status: "DESLIGADA" }
      });

      const h = await prisma.historico.findFirst({
        where: {
          mangueiraId: Number(mangueiraId),
          desligadoEm: null
        },
        orderBy: { ligadoEm: "desc" }
      });

      if (h) {
        const desligadoEm = new Date();
        const tempoLigado = Math.floor(
          (desligadoEm - h.ligadoEm) / 1000
        );

        await prisma.historico.update({
          where: { id: h.id },
          data: { desligadoEm, tempoLigado }
        });

        console.log("📕 Histórico FECHADO");
      }
    }

  } catch (err) {
    console.error("❌ Erro no listener:", err);
  }
});
