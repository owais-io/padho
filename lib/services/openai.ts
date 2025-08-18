// lib/services/openai.ts - Updated with slug generation

import OpenAI from 'openai'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface OpenAISummaryResponse {
  summary: string
  tldr: string[]
  faqs: Array<{ question: string; answer: string }>
  heading: string
  category: string
}

// ← ADD THIS UTILITY FUNCTION
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

export class OpenAIService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    })
  }

  async summarizeArticle(bodyText: string): Promise<OpenAISummaryResponse> {
    const prompt = `
Analyze the following article and provide a structured summary response for an Indian audience:

Article to summarize:
${bodyText}

Please provide your response as a JSON object with this structure:
- summary: Rephrase the article in approximately 500 words. Use 3rd person format. Use simple vocabulary. Maintain a conversational, ChatGPT-like tone. Focus on how this news impacts or relates to India and Indians.
- tldr: Array of exactly 3 key points that highlight the India connection and importance for Indian readers
- faqs: Array of exactly 5 FAQ objects with "question" and "answer" fields that Indian readers would want to know
- heading: Create an engaging headline that MUST mention "India" or "Indian" prominently. The headline should clearly show the India connection and appeal to Indian readers.
- category: Maximum 3 words describing the category (prefer India-focused categories like "India Politics", "India Sports", "India Economy", etc.)

CRITICAL REQUIREMENTS:
- The HEADING must include "India" or "Indian" or "Delhi" or "Mumbai" or other Indian cities/states
- Focus the entire summary on India's perspective and how it affects Indians
- Make the content relevant and engaging for Indian audience
- Use simple, accessible language that Indian readers prefer
- Ensure the India connection is clear throughout

Important guidelines:
- Summary should be around 500 words with India focus
- Use 3rd person perspective throughout
- Keep vocabulary simple and accessible
- Maintain a conversational, ChatGPT-like tone
- Create exactly 3 TLDR bullet points emphasizing India angle
- Generate exactly 5 relevant FAQs from Indian perspective
- Category should be maximum 3 words, preferably India-focused
- HEADLINE IS MOST IMPORTANT: Must clearly mention India connection
`

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional news summarizer for Indian readers. Always focus on India's perspective and ensure headlines mention India prominently. Respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }, // This ensures JSON response
        temperature: 0.7,
        max_tokens: 2000,
      })

      const responseContent = completion.choices[0]?.message?.content

      if (!responseContent) {
        throw new Error('No response from OpenAI')
      }

      // Parse the JSON response (should already be clean JSON)
      const parsedResponse: OpenAISummaryResponse = JSON.parse(responseContent)

      // Validate the response structure
      if (!parsedResponse.summary || !parsedResponse.tldr || !parsedResponse.faqs || !parsedResponse.heading || !parsedResponse.category) {
        throw new Error('Invalid response structure from OpenAI')
      }

      // Validate array lengths
      if (!Array.isArray(parsedResponse.tldr) || parsedResponse.tldr.length !== 3) {
        throw new Error('TLDR must be an array of exactly 3 items')
      }

      if (!Array.isArray(parsedResponse.faqs) || parsedResponse.faqs.length !== 5) {
        throw new Error('FAQs must be an array of exactly 5 items')
      }

      // Validate FAQ structure
      for (const faq of parsedResponse.faqs) {
        if (!faq.question || !faq.answer) {
          throw new Error('Each FAQ must have both question and answer fields')
        }
      }

      // Additional validation: Check if heading mentions India
      const heading = parsedResponse.heading.toLowerCase()
      const indiaKeywords = ['india', 'indian', 'delhi', 'mumbai', 'kolkata', 'chennai', 'bangalore', 'hyderabad', 'pune', 'ahmedabad', 'modi', 'new delhi']
      const hasIndiaConnection = indiaKeywords.some(keyword => heading.includes(keyword))
      
      if (!hasIndiaConnection) {
        console.warn('Heading does not mention India prominently:', parsedResponse.heading)
        // You could optionally throw an error or modify the heading here
      }

      return parsedResponse
    } catch (error) {
      console.error('Error with OpenAI API:', error)
      
      // If it's a JSON parsing error, log the raw response for debugging
      if (error instanceof SyntaxError) {
        console.error('Failed to parse OpenAI response. Raw response:', completion?.choices[0]?.message?.content)
      }
      
      throw new Error('Failed to generate summary with OpenAI')
    }
  }

  // ← ADD THIS NEW METHOD FOR CREATING SUMMARIES WITH SLUGS
  async createOpenAiSummary(articleId: string, summaryData: OpenAISummaryResponse): Promise<any> {
    try {
      // Generate base slug from heading
      let baseSlug = generateSlug(summaryData.heading)
      let finalSlug = baseSlug
      let counter = 1

      // Ensure slug uniqueness
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

      // Create the summary with the unique slug
      const createdSummary = await prisma.openAiSummary.create({
        data: {
          guardianArticleId: articleId,
          summary: summaryData.summary,
          tldr: summaryData.tldr,
          faqs: summaryData.faqs,
          heading: summaryData.heading,
          category: summaryData.category,
          slug: finalSlug // ← ADD THE SLUG HERE
        }
      })

      console.log(`✅ Created summary with slug: ${finalSlug}`)
      return createdSummary

    } catch (error) {
      console.error('Error creating OpenAI summary:', error)
      throw new Error('Failed to create OpenAI summary in database')
    }
  }
}

// ← EXPORT A CONVENIENCE FUNCTION FOR EXTERNAL USE
export async function createOpenAiSummary(articleId: string, summaryData: OpenAISummaryResponse) {
  const openAIService = new OpenAIService()
  return await openAIService.createOpenAiSummary(articleId, summaryData)
}