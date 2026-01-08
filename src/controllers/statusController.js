const prisma = require("../prisma");

exports.status = async (req, res) => {
  const mangueiraId = Number(req.params.id);

  const status = await prisma.statusMangueira.findUnique({
    where: { mangueiraId }
  });

  res.json(status);
};
