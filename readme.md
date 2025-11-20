# padho.net - AI-Powered South Asian News Simplification

An automated news aggregation and transformation system that leverages local large language models (LLMs) to convert complex Guardian articles about India and Pakistan into accessible, simplified summaries. This project demonstrates practical application of open-source AI models for natural language processing and content transformation focused on South Asian news.

## 🎯 Project Overview

This application uses **Ollama** with the **gpt-oss:20b model** (20 billion parameters) to automatically:
- Fetch curated articles from The Guardian Open Platform API (India/Pakistan/Modi focus)
- Transform complex news article titles into clear, accessible language
- Generate concise 60-80 word summaries from full articles
- Process content locally without relying on external APIs (privacy-first approach)
- Deploy the transformed content as a static website with beautiful timeline layout

**Live Demo:** [padho.net](https://padho.net) *(Coming soon - 70% deployment complete)*

## 🤖 AI Architecture

### Model Selection & Reasoning

**Model:** gpt-oss:20b (20 billion parameter open-source model)
- **Why this model:** Balances quality and computational efficiency for local deployment
- **Size:** ~14GB
- **Parameters:** 20 billion
- **Inference time:** 2-5 minutes per article on consumer hardware
- **Runs locally:** No data sent to external APIs, ensuring privacy and cost-efficiency

### AI Processing Pipeline

The system demonstrates a complete AI-driven content transformation workflow:

```
1. Input: Guardian article (title + body text) filtered for India/Pakistan content
       ↓
2. Prompt Engineering: Custom instruction set for Ollama
       ↓
3. LLM Processing: gpt-oss:20b analyzes and transforms content
       ↓
4. Output Parsing: Structured extraction (title + summary)
       ↓
5. Storage: SQLite database + MDX file generation
       ↓
6. Deployment: Static site generation with AWS S3 + CloudFront
```

## 📊 Data Flow

### Complete Content Pipeline

**Phase 1: Fetching**
```
Guardian API → /api/guardian → Filter (India/Modi/Pakistan) →
Duplicate Check → articles table
```

**Phase 2: Processing**
```
Admin selects articles → /api/process →
Fetch full content → Ollama AI (2-5 min) →
Transform title + Generate summary → summaries table →
Delete from articles table
```

**Phase 3: Deployment**
```
Admin deploys summary → /api/deploy →
Generate MDX file → content/articles/[slug].mdx →
Delete from summaries table
```

**Phase 4: Publishing**
```
Git commit + push → GitHub Actions →
npm run build → Static export (out/) →
AWS S3 sync → CloudFront invalidation →
Live on padho.net
```

## 📁 Project Structure

```
padho/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions workflow for AWS deployment
├── src/
│   ├── app/
│   │   ├── admin/               # Admin panel for article processing (not deployed)
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── articles/        # CRUD for articles staging table
│   │   │   ├── deploy/          # MDX file generation
│   │   │   ├── guardian/        # Guardian API integration
│   │   │   ├── process/         # Ollama AI processing endpoint ⭐
│   │   │   └── summaries/       # Summary management
│   │   ├── categories/          # All categories page
│   │   ├── category/[slug]/     # Dynamic category pages
│   │   ├── summaries/           # Summaries management page (not deployed)
│   │   │   └── page.tsx
│   │   ├── globals.css          # Global styles + timeline CSS
│   │   ├── layout.tsx           # Root layout with Header/Footer
│   │   └── page.tsx             # Homepage with zigzag timeline
│   ├── components/
│   │   ├── ArticleCard.tsx      # Article cards for timeline
│   │   ├── Footer.tsx           # Site footer
│   │   ├── Header.tsx           # Navigation header with categories
│   │   ├── LoadMoreButton.tsx   # Progressive loading (10 articles at a time)
│   │   ├── SummaryModal.tsx     # Modal for AI-generated summaries
│   │   └── Timeline.tsx         # Zigzag timeline layout
│   └── lib/
│       ├── db.ts                # SQLite database operations
│       ├── mdx.ts               # MDX file parsing and operations
│       ├── ollama.ts            # Ollama AI integration ⭐ CORE AI LOGIC
│       └── types.ts             # TypeScript interfaces
├── content/
│   └── articles/                # Generated MDX files (AI-processed content)
│       └── *.mdx               # 16 articles currently deployed
├── scripts/
│   └── post-build.js            # Removes /admin and /summaries from export
├── articles.db                  # SQLite database (110KB)
├── DEPLOYMENT_STATE.md          # AWS deployment status tracker
└── package.json
```

**Key AI File:** `src/lib/ollama.ts` - Contains all AI processing logic

## 🚦 Getting Started

### Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **Ollama** - [Download](https://ollama.com/download)
3. **Guardian API Key** - [Get free key](https://open-platform.theguardian.com/access/)
4. **Minimum 16GB RAM** (recommended for running 20B parameter model)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/owais-io/padho.git
   cd padho
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Ollama and download the AI model:**
   ```bash
   # Pull the 20B parameter model (~14GB download)
   ollama pull gpt-oss:20b

   # Verify Ollama is running
   ollama list
   ```

4. **Configure environment variables:**

   Create `.env.local`:
   ```env
   GUARDIAN_API_KEY=your_guardian_api_key_here
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Access the application:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Admin Panel: [http://localhost:3000/admin](http://localhost:3000/admin)
   - Summaries: [http://localhost:3000/summaries](http://localhost:3000/summaries)

### Database

The repository includes a pre-configured SQLite database (`articles.db`) with schema and sample data. No additional database setup required.

**Database Schema:**
- **articles** - Staging table for Guardian articles
- **fetched_article_ids** - Persistent tracking to prevent duplicate fetching
- **summaries** - AI-processed articles ready for deployment

### Processing Articles with AI

1. **Ensure Ollama is running locally**
   ```bash
   ollama serve
   ```

2. **Navigate to Admin Panel**
   - Go to [http://localhost:3000/admin](http://localhost:3000/admin)

3. **Fetch Articles from Guardian**
   - Click "Fetch Articles from Guardian API"
   - Select date range (from date and to date)
   - System automatically filters for articles about India, Modi, or Pakistan
   - Duplicate prevention ensures no re-fetching

4. **Process Selected Articles**
   - Select articles to process
   - Click "Add to Processing Queue"
   - Click "Start Processing" to begin AI transformation
   - **Each article takes 2-5 minutes** to process
   - The 20B model analyzes content and generates transformations
   - Progress is shown in real-time with status updates

5. **Review Summaries**
   - Navigate to [http://localhost:3000/summaries](http://localhost:3000/summaries)
   - Review AI-generated summaries
   - Click "Deploy" to create MDX files

6. **View Live Content**
   - Deployed articles appear on the homepage timeline
   - Categories are automatically updated
   - Progressive loading (10 articles at a time)

### Build for Production

```bash
# Build static site
npm run build

# Preview locally
npx serve out
```

Static HTML pages are generated in the `out/` directory with `/admin` and `/summaries` excluded.

---

## 🎨 AI Prompt Customization

The AI prompt is the core instruction set that guides how the LLM processes articles. Customizing it allows you to change the output characteristics.

### Location

**File:** `src/lib/ollama.ts`

### Current Prompt Design

The prompt is engineered to:
- Simplify complex language for general audiences
- Generate 60-80 word summaries
- Transform titles to be more accessible
- Maintain factual accuracy while improving clarity
- Use conversational tone suitable for everyday readers

### Customization Steps

1. **Open the AI service file:**
   ```bash
   src/lib/ollama.ts
   ```

2. **Locate the prompt in the `processArticleWithOllama()` function**

3. **Modify the prompt template:**
   ```typescript
   const prompt = `[Your custom instructions here]

   // Key customization areas:
   // - Tone: formal, casual, technical, academic
   // - Length: 40-50, 60-80, 100-120 words
   // - Focus: technical details, human impact, policy implications
   // - Audience: general public, experts, students

   ...`;
   ```

4. **Example: Academic/Research Focus**
   ```typescript
   const prompt = `You are an academic research assistant analyzing news articles.

   Transform this Guardian article:

   1. REWRITE THE TITLE: Make it precise and research-oriented
   2. SUMMARIZE: Provide a 100-120 word analytical summary focusing on:
      - Key findings and data points
      - Methodological aspects if mentioned
      - Implications for the field
      - Research gaps or questions raised

   Format your response EXACTLY like this:
   TITLE: [transformed title]
   SUMMARY: [analytical summary]

   Original Title: ${title}
   Article Content: ${bodyText}`;
   ```

5. **Example: Technical/Data-Focused**
   ```typescript
   const prompt = `You are a data analyst processing news content.

   Transform this article with emphasis on:
   - Quantitative data and statistics
   - Technical terminology (preserve, don't simplify)
   - Methodological rigor
   - Evidence-based conclusions

   Provide a 80-100 word technical summary...`;
   ```

6. **Test your changes:**
   - Process 3-5 sample articles
   - Evaluate output quality
   - Iterate on prompt design
   - Compare results across prompt variations

7. **Important constraints:**
   - **Maintain format:** `TITLE: ... SUMMARY: ...`
   - This format is parsed by the response parser
   - If changing format, update the parser accordingly

### Prompt Engineering Best Practices

1. **Be specific:** Clear instructions yield better results
2. **Use examples:** Show the model what you want
3. **Set constraints:** Word count, tone, focus areas
4. **Iterative refinement:** Test and improve incrementally
5. **Format consistency:** Maintain parseable output structure

---

## 🌐 Deployment

This project uses **AWS S3 + CloudFront** with automatic CI/CD from GitHub Actions.

### Live Site

🌐 **[padho.net](https://padho.net)** - Production deployment (70% complete)

### Deployment Features

- ✅ GitHub Actions workflow for automated deployment
- ✅ Admin and summaries pages excluded from production (post-build script)
- ✅ AWS S3 bucket configured for static hosting
- ✅ CloudFront distribution for global CDN delivery
- ✅ Custom domain with SSL certificate (ACM)
- ✅ Route 53 nameservers propagated
- ⏳ Pending: A records and IAM user configuration

### Current Deployment Status

According to `DEPLOYMENT_STATE.md` (last updated 2025-01-20):

**Status:** 70% Complete - AWS infrastructure ready, pending final configuration (~45 min to complete)

**Pending Steps:**
1. Create Route 53 A records pointing to CloudFront
2. Create IAM user for GitHub Actions
3. Add GitHub secrets (4 secrets)
4. Push code to GitHub to trigger first deployment
5. Verify deployment works

### GitHub Actions Workflow

The `.github/workflows/deploy.yml` workflow automatically:
1. Triggers on push to main branch
2. Checks out code
3. Sets up Node.js 18
4. Installs dependencies (`npm ci`)
5. Builds static export (`npm run build`)
6. Executes post-build script (removes `/admin` and `/summaries`)
7. Syncs to S3 with cache headers
8. Invalidates CloudFront cache
9. Displays deployment summary

### Environment Variables & Secrets

**Required GitHub Secrets:**
- `AWS_ACCESS_KEY_ID` - IAM user access key
- `AWS_SECRET_ACCESS_KEY` - IAM user secret key
- `S3_BUCKET_NAME` - S3 bucket name
- `CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution ID

**Local Environment:**
```env
GUARDIAN_API_KEY=your_guardian_api_key_here
```

### Alternative Deployment Options

This static Next.js export can be deployed to:
- **AWS S3 + CloudFront** (current, recommended for control)
- **Vercel** - Zero-config deployment
- **Netlify** - Simple static hosting
- **GitHub Pages** - Free static hosting
- **Any static host** - Upload the `out/` folder

---

## 🔬 Technical Highlights

### AI/ML Components

1. **Local LLM Inference**
   - Runs entirely on local hardware
   - No API costs or rate limits
   - Complete data privacy
   - Reproducible results
   - 20 billion parameter model for quality

2. **Prompt Engineering**
   - Custom-designed instruction sets
   - Optimized for article summarization
   - Structured output parsing (TITLE: ... SUMMARY: ...)
   - Iteratively refined for quality

3. **Content Transformation Pipeline**
   - Automated title simplification
   - Summary generation with length constraints (60-80 words)
   - Batch processing capability
   - Sequential queue system (one at a time)
   - Error handling and fallback mechanisms

### Development Stack

- **AI/ML:** Ollama (gpt-oss:20b - 20B parameters)
- **Framework:** Next.js 14.2.33 (App Router)
- **Language:** TypeScript 5.3.3
- **Database:** SQLite (better-sqlite3)
- **Content:** MDX (@next/mdx + gray-matter)
- **Styling:** Tailwind CSS 3.3.6 with custom South Asian theme
- **Icons:** Lucide React
- **Deployment:** AWS S3 + CloudFront + Route 53
- **CI/CD:** GitHub Actions

### Frontend Features

1. **Timeline Layout**
   - Zigzag design with CSS Grid
   - Progressive loading (10 articles at a time)
   - Mobile-first responsive design

2. **Design System**
   - South Asian color palette (emerald green, saffron orange, terracotta, gold)
   - Warm neutral backgrounds (cream tones)
   - System fonts for performance
   - Smooth animations and transitions

3. **Content Organization**
   - Dynamic category pages
   - Top categories in header navigation
   - Dropdown for additional categories
   - Category badges on articles

4. **User Experience**
   - Modal for AI-generated summaries
   - Links to original Guardian articles
   - High-quality images with lazy loading
   - Fast static page load times

### Backend Architecture

1. **API Routes**
   - `/api/guardian` - Fetch and filter Guardian articles
   - `/api/articles` - Manage staging database
   - `/api/process` - Ollama AI processing
   - `/api/summaries` - Manage processed summaries
   - `/api/deploy` - Generate MDX files

2. **Database Design**
   - Three-table architecture
   - Persistent duplicate tracking
   - Efficient queries with proper indexing

3. **Build System**
   - Static site generation (SSG)
   - Post-build script for security (removes admin pages)
   - Image optimization
   - Trailing slashes for S3/CloudFront routing

---

## 📚 Key Learnings & Insights

### AI Model Selection

Working with the 20B parameter model provided insights into:
- Trade-offs between model size and inference speed
- Quality improvements from larger parameter counts
- Hardware requirements for local LLM deployment (minimum 16GB RAM)
- Practical considerations for production use (2-5 min per article)

### Prompt Engineering

Iterative prompt development demonstrated:
- Importance of clear, specific instructions
- Impact of output format specifications (structured parsing)
- Value of constraint-based generation (word counts)
- Balance between creativity and consistency
- Adapting tone for target audience (South Asian news readers)

### Content Curation

Building a curated news platform revealed:
- Effective filtering strategies (keyword-based)
- Duplicate prevention mechanisms
- Queue-based processing for resource management
- Separation of staging and production content

### AWS Infrastructure

Deploying to AWS demonstrated:
- S3 static hosting configuration
- CloudFront CDN setup for global delivery
- Route 53 DNS management
- Certificate Manager for SSL
- IAM security best practices
- GitHub Actions integration with AWS

---

## 🎯 Future Enhancements

Potential areas for expansion:
- [ ] Multi-model comparison (testing different LLMs)
- [ ] Fine-tuning on South Asian news corpus
- [ ] Sentiment analysis integration
- [ ] Topic clustering and auto-categorization
- [ ] Multi-language support (Urdu, Hindi translations)
- [ ] Quality metrics and evaluation framework
- [ ] A/B testing different prompt strategies
- [ ] RSS feed generation
- [ ] Search functionality
- [ ] User comments and engagement features
- [ ] Newsletter subscription system

---

## 👨‍💻 Author

**Your Name** - Developer & AI Enthusiast
- Website: [owais.io](https://owais.io)
- LinkedIn: [Connect on LinkedIn](https://linkedin.com/in/owais-io)
- GitHub: [@owais-io](https://github.com/owais-io)

## 🤝 Development

This project was built with **AI-assisted coding** using [Claude Code](https://claude.com/claude-code), demonstrating how AI can accelerate software development while maintaining code quality and best practices.

---

## 🙏 Acknowledgments

- **The Guardian Open Platform** - For providing comprehensive news API
- **Ollama** - For making local LLM inference accessible
- **Next.js Team** - For excellent static site generation capabilities

---

Built as a demonstration of practical AI/ML application in news aggregation and content transformation using open-source models, focused on South Asian current affairs.