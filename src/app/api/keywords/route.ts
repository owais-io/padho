import { NextResponse } from 'next/server';
import { getAllKeywords, addKeyword, deleteKeyword, countKeywords } from '@/lib/db';

// GET - Fetch all keywords
export async function GET() {
  try {
    const keywords = getAllKeywords();
    const count = countKeywords();

    return NextResponse.json({
      success: true,
      keywords,
      count,
    });
  } catch (error) {
    console.error('Failed to fetch keywords:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}

// POST - Add a new keyword
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { keyword } = body;

    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Keyword is required' },
        { status: 400 }
      );
    }

    const trimmedKeyword = keyword.toLowerCase().trim();
    if (trimmedKeyword.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Keyword cannot be empty' },
        { status: 400 }
      );
    }

    const result = addKeyword(trimmedKeyword);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      id: result.id,
      keyword: trimmedKeyword,
    });
  } catch (error) {
    console.error('Failed to add keyword:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add keyword' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a keyword by ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');

    if (!idParam) {
      return NextResponse.json(
        { success: false, error: 'Keyword ID is required' },
        { status: 400 }
      );
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid keyword ID' },
        { status: 400 }
      );
    }

    const result = deleteKeyword(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Keyword deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete keyword:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete keyword' },
      { status: 500 }
    );
  }
}
