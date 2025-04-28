import prisma from './lib/prisma';

async function main() {
  await prisma.user.create({
    data: {
      name: "rajanBaasdasl",
      email: "yuvraassdasdasj@example.com",
      password: "supersecurehashedpassword",
    },
  });
}

main()
  