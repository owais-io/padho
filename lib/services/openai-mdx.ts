import OpenAI from 'openai';
import { contentManager } from './contentManager';
import { generateSlug } from '../utils';
import type { GuardianArticle } from './guardian';

export interface OpenAISummaryResponse {
  summary: string;
  tldr: string[];
  faqs: Array<{ question: string; answer: string }>;
  heading: string;
  category: string;
}

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
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
- heading: Create an engaging headline. The headline should clearly show the India connection and appeal to Indian readers.
- category: Maximum 3 words describing the category (prefer India-focused categories.)

CRITICAL REQUIREMENTS:
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
`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional news summarizer for Indian readers. Always focus on India's perspective. Respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000,
      });

      const responseContent = completion.choices[0]?.message?.content;

      if (!responseContent) {
        throw new Error('No response from OpenAI');
      }

      const parsedResponse: OpenAISummaryResponse = JSON.parse(responseContent);

      // Validate the response structure
      if (!parsedResponse.summary || !parsedResponse.tldr || !parsedResponse.faqs || !parsedResponse.heading || !parsedResponse.category) {
        throw new Error('Invalid response structure from OpenAI');
      }

      // Validate array lengths
      if (!Array.isArray(parsedResponse.tldr) || parsedResponse.tldr.length !== 3) {
        throw new Error('TLDR must be an array of exactly 3 items');
      }

      if (!Array.isArray(parsedResponse.faqs) || parsedResponse.faqs.length !== 5) {
        throw new Error('FAQs must be an array of exactly 5 items');
      }

      // Validate FAQ structure
      for (const faq of parsedResponse.faqs) {
        if (!faq.question || !faq.answer) {
          throw new Error('Each FAQ must have both question and answer fields');
        }
      }

      return parsedResponse;
    } catch (error) {
      console.error('Error with OpenAI API:', error);
      
      if (error instanceof SyntaxError) {
        console.error('Failed to parse OpenAI response as JSON');
      }
      
      throw new Error('Failed to generate summary with OpenAI');
    }
  }

  // Create MDX file from Guardian article and AI summary
  async createMDXArticle(guardianArticle: GuardianArticle, summaryData: OpenAISummaryResponse): Promise<string> {
    try {
      // Generate unique slug
      let baseSlug = generateSlug(summaryData.heading);
      let finalSlug = baseSlug;
      let counter = 1;

      // Ensure slug uniqueness by checking existing files
      while (await contentManager.getArticleBySlug(finalSlug)) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Create article object
      const article = {
        title: summaryData.heading,
        slug: finalSlug,
        category: summaryData.category,
        publishedAt: guardianArticle.webPublicationDate,
        originalUrl: guardianArticle.webUrl,
        guardianId: guardianArticle.id,
        thumbnail: guardianArticle.fields?.thumbnail,
        section: guardianArticle.sectionName,
        pillarName: guardianArticle.pillarName,
        isDeleted: false,
        tldr: summaryData.tldr,
        faqs: summaryData.faqs,
        content: summaryData.summary
      };

      // Save as MDX file
      await contentManager.saveArticle(article);

      console.log(`✅ Created MDX article with slug: ${finalSlug}`);
      return finalSlug;

    } catch (error) {
      console.error('Error creating MDX article:', error);
      throw new Error('Failed to create MDX article');
    }
  }
}

// Export convenience function
export async function createMDXArticle(guardianArticle: GuardianArticle, summaryData: OpenAISummaryResponse): Promise<string> {
  const openAIService = new OpenAIService();
  return await openAIService.createMDXArticle(guardianArticle, summaryData);
}