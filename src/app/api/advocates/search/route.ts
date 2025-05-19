import db from '../../../../db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('searchterm');
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const offset = (page - 1) * limit;

  if (!searchTerm) {
    return Response.json(
      { error: 'Search term is required' },
      { status: 400 }
    );
  }

  const data = await db.queryAdvocates(searchTerm, limit, offset);
  return Response.json(data);
}
