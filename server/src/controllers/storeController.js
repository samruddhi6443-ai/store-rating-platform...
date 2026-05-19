const prisma = require("../utils/prisma");
const { buildSearchFilter, buildSort } = require("../utils/query");

const listStores = async (req, res) => {
  try {
    const { search, sort, order } = req.query;
    const where = buildSearchFilter(search, ["name", "email", "address"]);
    const orderBy = buildSort(sort, order, ["name", "email", "createdAt"]);

    const stores = await prisma.store.findMany({
      where,
      orderBy,
      include: {
        ratings: {
          select: { id: true, rating: true, userId: true }
        }
      }
    });

    const formatted = stores.map((store) => {
      const myRating = req.user
        ? store.ratings.find((rating) => rating.userId === req.user.id)
        : null;
      const ratingCount = store.ratings.length;
      const ratingTotal = store.ratings.reduce((sum, rating) => sum + rating.rating, 0);
      const averageRating = ratingCount ? ratingTotal / ratingCount : 0;
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        imageUrl: store.imageUrl,
        createdAt: store.createdAt,
        averageRating: Number(averageRating.toFixed(2)),
        ratingCount,
        myRating: myRating ? myRating.rating : null,
        myRatingId: myRating ? myRating.id : null
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  listStores
};
