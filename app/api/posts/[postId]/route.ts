import { NextRequest, NextResponse } from "next/server";
import { db } from '~/src/store/store';

export async function GET(request: NextRequest, props: { params: Promise<{ postId: string }> }) {
  const params = await props.params;
  const postId = params.postId;

  if (!postId) {
    return NextResponse.json({ error: 'Missing post id' }, { status: 400 });
  }

  const post = await db.posts.byId(Number(postId));
  return NextResponse.json({ post });
}
