import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/lib/store/store';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ userId: string }> }
) {
  const params = await props.params;
  const userId = params.userId;

  if (!userId) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  const user = await db.users.byId(Number(userId));
  return NextResponse.json({ user });
}
