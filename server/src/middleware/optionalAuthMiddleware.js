const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");

const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true }
    });

    if (user) {
      req.user = user;
    }

    return next();
  } catch (error) {
    return next();
  }
};

module.exports = optionalAuthMiddleware;
