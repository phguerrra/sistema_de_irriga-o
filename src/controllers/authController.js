const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");

exports.register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const senha_hash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: { nome, email, senha_hash }
    });

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome },
      process.env.JWT_SECRET
    );

    res.json({ token, nome: usuario.nome });
  } catch {
    res.status(400).json({ error: "Erro ao registrar usuário" });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  const usuario = await prisma.usuario.findUnique({
    where: { email }
  });

  if (!usuario) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const ok = await bcrypt.compare(senha, usuario.senha_hash);
  if (!ok) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome },
    process.env.JWT_SECRET
  );

  res.json({ token, nome: usuario.nome });
};
