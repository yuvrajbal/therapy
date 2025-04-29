import prisma from './lib/prisma';

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword"
    }
  });
  console.log('User created:', user);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      transcript: "payload.transcript",
      summary: "payload.summary ||" 
    }
  });
  console.log('Session created:', session);
}

main()
  