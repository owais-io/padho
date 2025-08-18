// Create: lib/utils.ts

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    // Limit length to 100 characters
    .substring(0, 100)
    .replace(/-+$/, '') // Remove trailing hyphens again after substring
}

// Example: "Breaking News: India Wins Cricket Match!" 
// Becomes: "breaking-news-india-wins-cricket-match"