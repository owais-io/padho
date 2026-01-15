import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'gpt-oss:20b';

const contentDirectory = path.join(process.cwd(), 'content', 'articles');

interface MDXFrontmatter {
  title: string;
  summary: string;
  section: string;
  category?: string;
  imageUrl: string;
  publishedAt: string;
  guardianId: string;
}

// Generate category from summary using Ollama
async function generateCategoryFromSummary(title: string, summary: string): Promise<string> {
  const prompt = `Based on this news article title and summary, provide a descriptive category in 1-3 words that captures the specific topic. Be specific, not generic.

Examples of good categories: "Iran Protests", "Cricket World Cup", "Climate Policy", "Tech Layoffs", "Middle East Conflict", "Athlete Activism", "Immigration Policy", "Public Health", "Indian Fashion", "Pakistan Politics".

Title: ${title}

Summary: ${summary}

Respond with ONLY the category name (1-3 words), nothing else.`;

  console.log(`🔗 [Category Gen] Calling Ollama API with model: ${MODEL_NAME}`);
  const startTime = Date.now();

  const response = await fetch(OLLAMA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      prompt: prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`);
  }

  const data = await response.json();
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`⏱️  [Category Gen] Ollama responded in ${elapsed}s`);

  let category = data.response.trim();

  // Clean up the category - remove quotes, ensure max 3 words
  category = category.replace(/^["']|["']$/g, '').trim();
  const words = category.split(/\s+/);
  if (words.length > 3) {
    category = words.slice(0, 3).join(' ');
  }

  return category || 'News';
}

// Get all MDX files without category
function getFilesWithoutCategory(): { filename: string; frontmatter: MDXFrontmatter; content: string }[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const files = fs.readdirSync(contentDirectory).filter(f => f.endsWith('.mdx'));
  const filesWithoutCategory: { filename: string; frontmatter: MDXFrontmatter; content: string }[] = [];

  for (const filename of files) {
    const filePath = path.join(contentDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContents);
    const frontmatter = data as MDXFrontmatter;

    // Check if category is missing or empty
    if (!frontmatter.category || frontmatter.category.trim() === '') {
      filesWithoutCategory.push({ filename, frontmatter, content });
    }
  }

  return filesWithoutCategory;
}

// Update MDX file with new category
function updateMDXWithCategory(filename: string, frontmatter: MDXFrontmatter, content: string, category: string): void {
  const filePath = path.join(contentDirectory, filename);

  // Add category to frontmatter
  const updatedFrontmatter = {
    ...frontmatter,
    category,
  };

  // Reconstruct the file
  const newFileContents = matter.stringify(content, updatedFrontmatter);
  fs.writeFileSync(filePath, newFileContents, 'utf-8');
}

// GET - Get status of files without category
export async function GET() {
  try {
    const filesWithoutCategory = getFilesWithoutCategory();

    console.log(`📊 [Category Gen] Status check: ${filesWithoutCategory.length} files without category`);

    return NextResponse.json({
      success: true,
      count: filesWithoutCategory.length,
      files: filesWithoutCategory.map(f => ({
        filename: f.filename,
        title: f.frontmatter.title,
      })),
    });
  } catch (error) {
    console.error('❌ [Category Gen] Error getting files without category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get files' },
      { status: 500 }
    );
  }
}

// POST - Process one file at a time (for resumability)
export async function POST() {
  try {
    const filesWithoutCategory = getFilesWithoutCategory();

    if (filesWithoutCategory.length === 0) {
      console.log('✅ [Category Gen] All files have categories - nothing to process');
      return NextResponse.json({
        success: true,
        done: true,
        message: 'All files have categories',
        remaining: 0,
      });
    }

    // Process only the first file
    const file = filesWithoutCategory[0];

    console.log(`\n📂 [Category Gen] Processing ${filesWithoutCategory.length} remaining files`);
    console.log(`📄 [Category Gen] File: ${file.filename}`);
    console.log(`📰 [Category Gen] Title: ${file.frontmatter.title}`);
    console.log(`🤖 [Category Gen] Generating category from summary...`);

    // Generate category from summary
    const category = await generateCategoryFromSummary(
      file.frontmatter.title,
      file.frontmatter.summary
    );

    console.log(`✨ [Category Gen] Generated category: "${category}"`);

    // Update the file
    updateMDXWithCategory(file.filename, file.frontmatter, file.content, category);

    console.log(`💾 [Category Gen] Updated file with new category`);
    console.log(`📊 [Category Gen] Remaining: ${filesWithoutCategory.length - 1} files\n`);

    return NextResponse.json({
      success: true,
      done: false,
      processed: {
        filename: file.filename,
        title: file.frontmatter.title,
        category,
      },
      remaining: filesWithoutCategory.length - 1,
    });
  } catch (error) {
    console.error('❌ [Category Gen] Error generating category:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate category' },
      { status: 500 }
    );
  }
}
