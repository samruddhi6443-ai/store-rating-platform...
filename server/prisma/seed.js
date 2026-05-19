const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const stores = [
  {
    name: "Harbor & Hearth Market",
    email: "harbor.harth@example.com",
    address: "214 Seaside Avenue, Harbor City",
    imageUrl:
      "https://images.unsplash.com/photo-1501696461447-0e9a1a45e5e4?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Northgate Grocery",
    email: "northgate.grocery@example.com",
    address: "89 Pine Street, Northgate",
    imageUrl:
      "https://images.unsplash.com/photo-1506976785307-8732e854adf3?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Riverbend Pantry",
    email: "riverbend.pantry@example.com",
    address: "45 Riverwalk Road, Bridgeview",
    imageUrl:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Sunset Corner Store",
    email: "sunset.corner@example.com",
    address: "102 Sunset Blvd, Westhaven",
    imageUrl:
      "https://images.unsplash.com/photo-1501776192219-1c2a7fca7b24?auto=format&fit=crop&w=1200&q=80"
  }
];

async function main() {
  const ownerPassword = await bcrypt.hash("OwnerPass123!", 10);
  const userPassword = await bcrypt.hash("UserPass123!", 10);

  const owner = await prisma.user.upsert({
    where: { email: "owner@demo.com" },
    update: {},
    create: {
      name: "Demo Store Owner Account",
      email: "owner@demo.com",
      password: ownerPassword,
      address: "12 Market Street, Harbor City",
      role: "STORE_OWNER"
    }
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "user@demo.com" },
    update: {},
    create: {
      name: "Demo Shopper Account",
      email: "user@demo.com",
      password: userPassword,
      address: "8 Riverside Lane, Bridgeview",
      role: "USER"
    }
  });

  for (const storeData of stores) {
    const store = await prisma.store.upsert({
      where: { email: storeData.email },
      update: {
        name: storeData.name,
        address: storeData.address,
        imageUrl: storeData.imageUrl,
        ownerId: owner.id
      },
      create: {
        ...storeData,
        ownerId: owner.id
      }
    });

    await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId: demoUser.id,
          storeId: store.id
        }
      },
      update: {
        rating: 4
      },
      create: {
        rating: 4,
        userId: demoUser.id,
        storeId: store.id
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
