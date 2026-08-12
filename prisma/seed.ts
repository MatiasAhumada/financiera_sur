import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const email = "admin@del-sur.local";
  const password = "del-sur-admin-2026";
  const salt = randomBytes(16).toString("hex");
  const passwordHash = `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
  await prisma.adminUser.upsert({
    where: { email },
    update: { name: "Admin User", passwordHash },
    create: {
      email,
      name: "Admin User",
      passwordHash,
    },
  });

  console.log("Seed completed successfully");
  console.log(`Admin creado: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
