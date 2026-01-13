const prisma = require("../prisma");
const mqtt = require("../mqtt/client");

// ================================
// LISTAR
// ================================
exports.listar = async (req, res) => {
  const userId = req.user.id;

  const mangueiras = await prisma.mangueira.findMany({
    where: { usuarioId: userId }
  });

  res.json(mangueiras);
};

// ================================
// CRIAR
// ================================
exports.criar = async (req, res) => {
  const userId = req.user.id;
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "Nome obrigatório" });
  }

  const mangueira = await prisma.mangueira.create({
    data: {
      nome,
      usuarioId: userId
    }
  });

  await prisma.statusMangueira.create({
    data: {
      mangueiraId: mangueira.id,
      status: "DESLIGADA"
    }
  });

  res.json(mangueira);
};

// ================================
// LIGAR (MODELO ANTIGO)
// ================================
exports.ligar = async (req, res) => {
  const mangueiraId = Number(req.params.mangueira);
  const userId = req.user.id;

  const status = await prisma.statusMangueira.findUnique({
    where: { mangueiraId }
  });

  if (status.sensorStatus === "falha") {
    return res.status(403).json({
      error: "Irrigação bloqueada: sensor em FALHA"
    });
  }

  const topic = `irrigacao/${userId}/${mangueiraId}/cmd`;
  mqtt.publish(topic, JSON.stringify({ action: "on" }));

  res.json({ ok: true });
};


// ================================
// DESLIGAR (MODELO ANTIGO)
// ================================
exports.desligar = async (req, res) => {
  const mangueiraId = Number(req.params.mangueira);
  const userId = req.user.id;

  const topic = `irrigacao/${userId}/${mangueiraId}/cmd`;
  console.log("📤 MQTT OFF:", topic);

  mqtt.publish(topic, JSON.stringify({ action: "off" }));

  await prisma.statusMangueira.update({
    where: { mangueiraId },
    data: { status: "DESLIGANDO" }
  });

  res.json({ ok: true });
};


// ================================
// HISTÓRICO
// ================================
exports.historico = async (req, res) => {
  const mangueiraId = Number(req.params.id);

  const historico = await prisma.historico.findMany({
    where: { mangueiraId },
    orderBy: { ligadoEm: "desc" }
  });

  res.json(historico);
};
