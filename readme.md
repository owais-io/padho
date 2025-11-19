# Padho.net - Modern News Website

A modern, minimalist news aggregation website built with Next.js 14 and Tailwind CSS, featuring AI-powered article summaries from The Guardian API.

## 🚀 Features

- **Modern Design**: Clean, minimal, and aesthetic user interface
- **Mobile-First**: Responsive design optimized for mobile devices
- **Zigzag Timeline**: Unique article layout in a zigzag timeline pattern
- **AI Summaries**: 60-80 word summaries powered by Ollama (local AI)
- **Category Navigation**: Browse articles by specific categories
- **Load More**: Progressive loading with 10 articles at a time
- **Summary Modal**: Elegant modal to display article summaries
- **Guardian Integration**: Direct links to original Guardian articles

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React
- **Images**: Next.js Image optimization
- **Fonts**: System fonts (optimized for performance)

## 📱 Pages

1. **Homepage** (`/`): Featured articles in zigzag timeline layout
2. **Categories** (`/categories`): Grid view of all available categories
3. **Category Pages** (`/category/[slug]`): Articles filtered by specific category

## 🎨 Design Features

### Header
- Modern logo with gradient effect
- Top 10 categories in navigation
- "View More" dropdown for additional categories
- Mobile-responsive hamburger menu

### Footer
- Brand information and description
- Quick links to important pages
- Contact information
- Elegant design with consistent branding

### Article Cards
- High-quality image display
- Category badges
- Publication dates
- Title with hover effects
- "Read Summary" and "Original Article" buttons

### Timeline Layout
- CSS Grid-based zigzag pattern
- Responsive design that adapts to screen sizes
- Staggered article positioning on larger screens
- Mobile-first single column layout

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── category/[slug]/   # Dynamic category pages
│   ├── categories/        # Categories listing page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── not-found.tsx      # 404 page
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ArticleCard.tsx    # Individual article cards
│   ├── Footer.tsx         # Site footer
│   ├── Header.tsx         # Site header
│   ├── LoadMoreButton.tsx # Load more functionality
│   ├── SummaryModal.tsx   # Article summary modal
│   └── Timeline.tsx       # Zigzag timeline layout
├── data/                  # Data and content
│   └── dummyData.ts       # Sample articles and categories
└── lib/                   # Utilities and types
    └── types.ts           # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies
```bash
npm install
```

2. Run the development server
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 📊 Sample Data

The project includes 30 dummy articles across 14 categories:
- World, Politics, Technology, Science, Environment
- Sport, Culture, Business, Health, Education
- Travel, Food, Fashion, Art

Each article includes:
- Unique ID and title
- AI-generated 60-80 word summary
- Guardian-style image URL
- Category classification
- Publication date
- Original Guardian URL

## 🎯 Integration Points

### Guardian API Integration
When implementing real data, replace dummy data with:
- Guardian API endpoints
- Real article fetching
- Dynamic content loading
- Search functionality

### Ollama AI Integration
For AI summaries, integrate with:
- Local Ollama instance
- Article text processing
- Summary generation (60-80 words)
- Content caching

## 🔧 Customization

### Colors & Branding
Update colors in `tailwind.config.js`:
```javascript
colors: {
  primary: { /* Your primary color palette */ },
  accent: { /* Your accent color palette */ }
}
```

### Typography
System fonts are configured for optimal performance. To add custom fonts:
1. Update `tailwind.config.js`
2. Import fonts in `layout.tsx`
3. Update CSS variables

### Layout Modifications
- Modify timeline spacing in `globals.css`
- Adjust card layouts in `ArticleCard.tsx`
- Customize responsive breakpoints

## 📱 Responsive Design

- **Mobile**: Single column timeline, optimized touch interactions
- **Tablet**: Two-column zigzag with appropriate spacing
- **Desktop**: Full zigzag pattern with enhanced visual hierarchy
- **Large Screens**: Maximum width containers for optimal readability

## 🔍 SEO Features

- Optimized meta tags and descriptions
- Open Graph and Twitter Card support
- Semantic HTML structure
- Image alt tags and proper heading hierarchy
- Sitemap generation for categories

## ⚡ Performance Features

- Next.js Image optimization
- Static site generation for categories
- Progressive loading with "Load More"
- Optimized bundle size
- System fonts for fast loading

## 🎨 UI Components

### Reusable Components
- `ArticleCard`: Displays article information with actions
- `Timeline`: Manages article layout and loading states
- `SummaryModal`: Full-screen modal for article summaries
- `LoadMoreButton`: Handles pagination with loading states
- `Header`: Navigation with responsive menu
- `Footer`: Site information and links

### Interactive Elements
- Hover effects on cards and buttons
- Smooth transitions and animations
- Modal with backdrop blur
- Dropdown menus with animations
- Mobile-friendly touch interactions

## 🚀 Deployment

The project is ready for deployment on:
- **Vercel**: Optimized for Next.js
- **Netlify**: Static site hosting
- **Docker**: Containerized deployment
- **Traditional hosting**: With Node.js support

### Environment Variables
When deploying with real data:
```
GUARDIAN_API_KEY=your_guardian_api_key
OLLAMA_ENDPOINT=your_ollama_instance_url
DATABASE_URL=your_database_connection
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- The Guardian for their excellent journalism and API
- Tailwind CSS for the utility-first styling approach
- Lucide React for the beautiful icons
- Next.js team for the amazing framework