import db from '../../../db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const offset = (page - 1) * limit;

  const data = await db.selectAdvocates().from(limit, offset);
  return Response.json(data);
}
