import { NextResponse } from "next/server";
import { db } from '~/src/store/store';

export async function GET() {
  const posts = await db.posts.all();
  return NextResponse.json({ posts });
}
