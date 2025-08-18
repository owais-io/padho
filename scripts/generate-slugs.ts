// scripts/generate-slugs.tsx

import { PrismaClient } from '@prisma/client'
import { generateSlug } from '../lib/utils'

const prisma = new PrismaClient()

async function generateSlugsForExistingArticles() {
  console.log('Starting slug generation for existing articles...')
  
  // Get all articles without slugs
  const articlesWithoutSlugs = await prisma.openAiSummary.findMany({
    where: {
      OR: [
        { slug: null },
        { slug: '' }
      ]
    },
    select: {
      id: true,
      heading: true,
      slug: true
    }
  })

  console.log(`Found ${articlesWithoutSlugs.length} articles without slugs`)

  let processed = 0
  let errors = 0

  for (const article of articlesWithoutSlugs) {
    try {
      let baseSlug = generateSlug(article.heading)
      let finalSlug = baseSlug
      let counter = 1

      // Check for duplicate slugs and append number if needed
      while (true) {
        const existingSlug = await prisma.openAiSummary.findUnique({
          where: { slug: finalSlug }
        })

        if (!existingSlug) {
          break // Slug is unique
        }

        finalSlug = `${baseSlug}-${counter}`
        counter++
      }

      // Update the article with the new slug
      await prisma.openAiSummary.update({
        where: { id: article.id },
        data: { slug: finalSlug }
      })

      processed++
      console.log(`✅ Generated slug for "${article.heading}": ${finalSlug}`)
      
    } catch (error) {
      errors++
      console.error(`❌ Error generating slug for "${article.heading}":`, error)
    }
  }

  console.log(`\n✅ Slug generation complete!`)
  console.log(`📊 Processed: ${processed}`)
  console.log(`❌ Errors: ${errors}`)
  
  await prisma.$disconnect()
}

// Run the script
generateSlugsForExistingArticles()
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
