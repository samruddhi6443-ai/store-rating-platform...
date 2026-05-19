const prisma = require("../utils/prisma");

const getOwnerDashboard = async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      where: { ownerId: req.user.id },
      include: {
        ratings: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });

    const formatted = stores.map((store) => {
      const total = store.ratings.reduce((sum, item) => sum + item.rating, 0);
      const average = store.ratings.length ? total / store.ratings.length : 0;

      return {
        id: store.id,
        name: store.name,
        averageRating: Number(average.toFixed(2)),
        ratings: store.ratings.map((item) => ({
          id: item.id,
          rating: item.rating,
          user: item.user
        }))
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getOwnerDashboard
};
