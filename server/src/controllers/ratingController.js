const prisma = require("../utils/prisma");

const createRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const value = Number(rating);

    if (!storeId || Number.isNaN(value) || value < 1 || value > 5) {
      return res.status(400).json({ message: "Rating must be a number between 1 and 5." });
    }

    const existing = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId: req.user.id,
          storeId
        }
      }
    });

    if (existing) {
      return res.status(409).json({ message: "You already rated this store." });
    }

    const newRating = await prisma.rating.create({
      data: {
        rating: value,
        userId: req.user.id,
        storeId
      }
    });

    return res.status(201).json({ message: "Rating added", rating: newRating });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const value = Number(rating);

    if (Number.isNaN(value) || value < 1 || value > 5) {
      return res.status(400).json({ message: "Rating must be a number between 1 and 5." });
    }

    const existing = await prisma.rating.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ message: "Rating not found" });
    }

    const updated = await prisma.rating.update({
      where: { id },
      data: { rating: value }
    });

    return res.status(200).json({ message: "Rating updated", rating: updated });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createRating,
  updateRating
};
