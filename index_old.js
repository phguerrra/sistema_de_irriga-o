// ======================================================
// IMPORTAÇÕES
// ======================================================
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mqtt = require("mqtt");
const { PrismaClient } = require("@prisma/client");
const path = require("path");

// ======================================================
// CONFIG
// ======================================================
const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET;

// ======================================================
// MQTT
// ======================================================
const mqttClient = mqtt.connect(process.env.MQTT_BROKER);

mqttClient.on("connect", () => {
    console.log("📡 Conectado ao broker MQTT");
    mqttClient.subscribe("irrigacao/+/+/status");
});

mqttClient.on("message", async (topic, message) => {
    try {
        const payload = message.toString(); // ligado | desligado
        const [, , mangueiraId] = topic.split("/");

        console.log(`📥 Status recebido mangueira ${mangueiraId}: ${payload}`);

        await prisma.statusMangueira.upsert({
            where: { mangueiraId: Number(mangueiraId) },
            update: { status: payload },
            create: {
                mangueiraId: Number(mangueiraId),
                status: payload
            }
        });
    } catch (err) {
        console.error("Erro MQTT:", err);
    }
});

// ======================================================
// SERVIR FRONTEND
// ======================================================
app.use(express.static(path.join(__dirname, "public")));

// ======================================================
// MIDDLEWARE JWT
// ======================================================
function authenticateToken(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "Token faltando" });

    const token = auth.replace("Bearer ", "");

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Token inválido" });
        req.user = user;
        next();
    });
}

// ======================================================
// AUTENTICAÇÃO
// ======================================================
app.post("/api/register", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        const hash = await bcrypt.hash(senha, 10);

        const usuario = await prisma.usuario.create({
            data: { nome, email, senha_hash: hash }
        });

        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome },
            SECRET
        );

        res.json({ token, nome: usuario.nome });
    } catch {
        res.status(400).json({ error: "Email já usado" });
    }
});

app.post("/api/login", async (req, res) => {
    const { email, senha } = req.body;

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(401).json({ error: "Credenciais inválidas" });

    const ok = await bcrypt.compare(senha, usuario.senha_hash);
    if (!ok) return res.status(401).json({ error: "Senha incorreta" });

    const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome },
        SECRET
    );

    res.json({ token, nome: usuario.nome });
});

// ======================================================
// MANGUEIRAS
// ======================================================
app.get("/api/mangueiras", authenticateToken, async (req, res) => {
    const mangueiras = await prisma.mangueira.findMany({
        where: { usuarioId: req.user.id }
    });
    res.json(mangueiras);
});

app.post("/api/mangueiras", authenticateToken, async (req, res) => {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ error: "Nome obrigatório" });

    const mangueira = await prisma.mangueira.create({
        data: {
            nome,
            usuarioId: req.user.id
        }
    });

    res.json(mangueira);
});

// ======================================================
// STATUS ATUAL
// ======================================================
app.get("/api/status/:id", authenticateToken, async (req, res) => {
    const mangueiraId = Number(req.params.id);

    const status = await prisma.statusMangueira.findUnique({
        where: { mangueiraId }
    });

    res.json({
        status: status?.status || "desligado"
    });
});

// ======================================================
// LIGAR MANGUEIRA (MQTT + HISTÓRICO)
// ======================================================
app.post("/on/:mangueira", authenticateToken, async (req, res) => {
    const mangueiraId = Number(req.params.mangueira);
    const userId = req.user.id;

    const topic = `irrigacao/${userId}/${mangueiraId}/cmd`;

    // envia comando MQTT
    mqttClient.publish(topic, "ON");

    // salva histórico
    await prisma.historico.create({
        data: {
            mangueiraId,
            ligadoEm: new Date()
        }
    });

    res.json({ ok: true });
});

// ======================================================
// DESLIGAR MANGUEIRA (MQTT + FECHA HISTÓRICO)
// ======================================================
app.post("/off/:mangueira", authenticateToken, async (req, res) => {
    const mangueiraId = Number(req.params.mangueira);
    const userId = req.user.id;

    const topic = `irrigacao/${userId}/${mangueiraId}/cmd`;

    // envia comando MQTT
    mqttClient.publish(topic, "OFF");

    const ultimo = await prisma.historico.findFirst({
        where: {
            mangueiraId,
            desligadoEm: null
        },
        orderBy: { ligadoEm: "desc" }
    });

    if (ultimo) {
        const desligadoEm = new Date();
        const tempoSegundos =
            Math.floor((desligadoEm - ultimo.ligadoEm) / 1000);

        await prisma.historico.update({
            where: { id: ultimo.id },
            data: {
                desligadoEm,
                tempoLigado: tempoSegundos
            }
        });
    }

    res.json({ ok: true });
});

// ======================================================
// HISTÓRICO DA MANGUEIRA
// ======================================================
app.get("/api/mangueiras/:id/historico", authenticateToken, async (req, res) => {
    const mangueiraId = Number(req.params.id);

    const historico = await prisma.historico.findMany({
        where: { mangueiraId },
        orderBy: { ligadoEm: "desc" }
    });

    res.json(historico);
});

// ======================================================
// START
// ======================================================
app.listen(3000, () => {
    console.log("🚀 API rodando em http://localhost:3000");
});
