import { NextRequest, NextResponse } from "next/server";
import { db } from '~/src/store/store';

export async function GET() {
  const users = await db.users.all();
  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const { name, email } = await request.json();

  if (!name || !email) {
    return NextResponse.json({ error: 'Missing name or email' }, { status: 400 });
  }

  const user = await db.users.add({ name, email });
  return NextResponse.json({ user });
}
