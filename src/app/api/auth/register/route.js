import prisma from "../../../../lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: { name, email, password },
    });

    return Response.json(newUser, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
