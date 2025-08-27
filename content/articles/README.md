# Articles Directory

This directory contains all articles in MDX format.

## File Structure
- Each article is a `.mdx` file named with its slug
- Articles contain frontmatter with metadata and content in markdown

## Frontmatter Schema
```yaml
---
title: "Article title"
slug: "url-friendly-slug"
category: "Article category"
publishedAt: "2024-01-01T00:00:00.000Z"
originalUrl: "https://guardian.com/article"
guardianId: "guardian-unique-id"
thumbnail: "https://image-url.com/image.jpg"
section: "world-news"
pillarName: "News"
isDeleted: false
tldr: 
  - "Key point 1"
  - "Key point 2"  
  - "Key point 3"
faqs:
  - question: "What is this about?"
    answer: "This is about..."
  - question: "Why is this important?"
    answer: "This is important because..."
---

Article content goes here in markdown format...
```