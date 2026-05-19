const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma");
const {
  validateEmail,
  validateName,
  validateAddress,
  validatePassword
} = require("../utils/validators");
const { buildSearchFilter, buildSort } = require("../utils/query");

const getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count()
    ]);

    return res.status(200).json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!validateName(name)) {
      return res.status(400).json({ message: "Name must be 20-60 characters." });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email." });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message: "Password must be 8-16 chars, include one uppercase and one special character."
      });
    }

    if (!validateAddress(address)) {
      return res.status(400).json({ message: "Address must be 400 characters or less." });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role: role || "USER"
      },
      select: { id: true, name: true, email: true, role: true }
    });

    return res.status(201).json({ message: "User created", user });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const listUsers = async (req, res) => {
  try {
    const { search, sort, order, role } = req.query;
    const searchFilter = buildSearchFilter(search, ["name", "email", "address"]);
    const validRoles = ["ADMIN", "USER", "STORE_OWNER"];
    const roleFilter = role && validRoles.includes(role) ? { role } : undefined;
    const where = searchFilter && roleFilter
      ? { AND: [searchFilter, roleFilter] }
      : searchFilter || roleFilter;
    const orderBy = buildSort(sort, order, ["name", "email", "role", "createdAt"]);

    const users = await prisma.user.findMany({
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true
      }
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "STORE_OWNER") {
      return res.status(200).json({ user });
    }

    const stores = await prisma.store.findMany({
      where: { ownerId: user.id },
      include: { ratings: { select: { rating: true } } }
    });

    const storeSummaries = stores.map((store) => {
      const ratingCount = store.ratings.length;
      const ratingTotal = store.ratings.reduce((sum, rating) => sum + rating.rating, 0);
      const averageRating = ratingCount ? ratingTotal / ratingCount : 0;
      return {
        id: store.id,
        name: store.name,
        ratingCount,
        averageRating: Number(averageRating.toFixed(2))
      };
    });

    const allRatings = storeSummaries.reduce(
      (sum, store) => sum + store.averageRating,
      0
    );
    const ownerAverage = storeSummaries.length
      ? Number((allRatings / storeSummaries.length).toFixed(2))
      : 0;

    return res.status(200).json({
      user,
      ownerSummary: {
        storeCount: storeSummaries.length,
        averageRating: ownerAverage,
        stores: storeSummaries
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId, imageUrl } = req.body;

    if (!validateName(name)) {
      return res.status(400).json({ message: "Name must be 20-60 characters." });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email." });
    }

    if (!validateAddress(address)) {
      return res.status(400).json({ message: "Address must be 400 characters or less." });
    }

    const owner = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner || owner.role !== "STORE_OWNER") {
      return res.status(400).json({ message: "Owner must be a valid STORE_OWNER user." });
    }

    const store = await prisma.store.create({
      data: { name, email, address, ownerId, imageUrl },
      include: { owner: { select: { id: true, name: true, email: true } } }
    });

    return res.status(201).json({ message: "Store created", store });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const listStores = async (req, res) => {
  try {
    const { search, sort, order } = req.query;
    const where = buildSearchFilter(search, ["name", "email", "address"]);
    const orderBy = buildSort(sort, order, ["name", "email", "createdAt"]);

    const stores = await prisma.store.findMany({
      where,
      orderBy,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        ratings: { select: { rating: true } }
      }
    });

    const formatted = stores.map((store) => {
      const ratingCount = store.ratings.length;
      const ratingTotal = store.ratings.reduce((sum, rating) => sum + rating.rating, 0);
      const averageRating = ratingCount ? ratingTotal / ratingCount : 0;
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner: store.owner,
        imageUrl: store.imageUrl,
        createdAt: store.createdAt,
        averageRating: Number(averageRating.toFixed(2)),
        ratingCount
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getDashboard,
  createUser,
  listUsers,
  getUserDetails,
  createStore,
  listStores
};
