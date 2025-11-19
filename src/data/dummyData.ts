import { Article, Category } from '@/lib/types';

export const categories: Category[] = [
  { id: '1', name: 'World', slug: 'world', articleCount: 45 },
  { id: '2', name: 'Politics', slug: 'politics', articleCount: 38 },
  { id: '3', name: 'Technology', slug: 'technology', articleCount: 52 },
  { id: '4', name: 'Science', slug: 'science', articleCount: 29 },
  { id: '5', name: 'Environment', slug: 'environment', articleCount: 33 },
  { id: '6', name: 'Sport', slug: 'sport', articleCount: 41 },
  { id: '7', name: 'Culture', slug: 'culture', articleCount: 27 },
  { id: '8', name: 'Business', slug: 'business', articleCount: 35 },
  { id: '9', name: 'Health', slug: 'health', articleCount: 23 },
  { id: '10', name: 'Education', slug: 'education', articleCount: 18 },
  { id: '11', name: 'Travel', slug: 'travel', articleCount: 16 },
  { id: '12', name: 'Food', slug: 'food', articleCount: 14 },
  { id: '13', name: 'Fashion', slug: 'fashion', articleCount: 12 },
  { id: '14', name: 'Art', slug: 'art', articleCount: 19 },
];

export const dummyArticles: Article[] = [
  {
    id: '1',
    title: 'Climate Change Summit Reaches Historic Agreement',
    summary: 'World leaders unite at COP29 to establish unprecedented climate targets. The agreement includes binding emissions reductions, renewable energy investments, and support for developing nations. This marks a significant step forward in global climate action, with commitments spanning the next decade.',
    imageUrl: 'https://media.guim.co.uk/c8f2c8f1b9e9b7a5f1e5c8d7f3a1b2c4d5e6f7g8/0_0_4000_2400/4000.jpg',
    category: 'Environment',
    publishedDate: '2024-11-18',
    guardianUrl: 'https://theguardian.com/environment/climate-summit-agreement'
  },
  {
    id: '2',
    title: 'Breakthrough in Quantum Computing Announced',
    summary: 'Scientists achieve quantum supremacy with new 1000-qubit processor. This revolutionary development promises to transform cryptography, drug discovery, and artificial intelligence. The quantum computer solved complex problems in minutes that would take classical computers thousands of years to complete.',
    imageUrl: 'https://media.guim.co.uk/d9e3d9e2c0f0c8b6f2f6d9e8f4b2c3d4e5f6g7h9/0_0_3800_2280/3800.jpg',
    category: 'Technology',
    publishedDate: '2024-11-17',
    guardianUrl: 'https://theguardian.com/technology/quantum-computing-breakthrough'
  },
  {
    id: '3',
    title: 'Global Economic Recovery Shows Strong Momentum',
    summary: 'International markets surge as inflation rates stabilize worldwide. Central banks coordinate policy responses while unemployment figures reach pre-pandemic levels. Economists predict sustained growth across major economies, driven by technology sector innovations and green energy investments.',
    imageUrl: 'https://media.guim.co.uk/e0f4e0f3d1g1d9c7g3g7e0f9g5c3d4e5f6g7h8i0/0_0_4200_2520/4200.jpg',
    category: 'Business',
    publishedDate: '2024-11-16',
    guardianUrl: 'https://theguardian.com/business/economic-recovery-momentum'
  },
  {
    id: '4',
    title: 'Revolutionary Gene Therapy Cures Rare Disease',
    summary: 'Medical breakthrough offers hope for millions suffering from genetic disorders. Clinical trials show 95% success rate in treating previously incurable conditions. The innovative CRISPR-based treatment targets specific genetic mutations, providing long-term solutions rather than temporary symptom management.',
    imageUrl: 'https://media.guim.co.uk/f1g5f1g4e2h2e0d8h4h8f1g0h6d4e5f6g7h8i9j1/0_0_3600_2160/3600.jpg',
    category: 'Science',
    publishedDate: '2024-11-15',
    guardianUrl: 'https://theguardian.com/science/gene-therapy-breakthrough'
  },
  {
    id: '5',
    title: 'World Cup Qualifiers Produce Stunning Upsets',
    summary: 'Underdogs triumph in dramatic qualification matches across multiple confederations. Defending champions face elimination while emerging teams secure historic berths. The tournament promises unprecedented diversity with first-time qualifiers from three continents bringing fresh talent to the world stage.',
    imageUrl: 'https://media.guim.co.uk/g2h6g2h5f3i3f1e9i5i9g2h1i7e5f6g7h8i9j0k2/0_0_4000_2400/4000.jpg',
    category: 'Sport',
    publishedDate: '2024-11-14',
    guardianUrl: 'https://theguardian.com/sport/world-cup-qualifiers-upsets'
  },
  {
    id: '6',
    title: 'Ancient Civilization Discovered in Amazon',
    summary: 'Archaeological expedition uncovers sophisticated pre-Columbian society deep in Brazilian rainforest. Advanced irrigation systems, ceremonial structures, and intricate artwork reveal complex urban planning from 800 years ago. This discovery challenges existing theories about Amazonian indigenous civilizations.',
    imageUrl: 'https://media.guim.co.uk/h3i7h3i6g4j4g2f0j6j0h3i2j8f6g7h8i9j0k1l3/0_0_3800_2280/3800.jpg',
    category: 'World',
    publishedDate: '2024-11-13',
    guardianUrl: 'https://theguardian.com/world/amazon-civilization-discovery'
  },
  {
    id: '7',
    title: 'AI Ethics Framework Adopted by Tech Giants',
    summary: 'Major technology companies unite to establish comprehensive artificial intelligence guidelines. The framework addresses bias prevention, transparency requirements, and human oversight protocols. Industry leaders commit to regular audits and public reporting, marking a new era of responsible AI development.',
    imageUrl: 'https://media.guim.co.uk/i4j8i4j7h5k5h3g1k7k1i4j3k9g7h8i9j0k1l2m4/0_0_4200_2520/4200.jpg',
    category: 'Technology',
    publishedDate: '2024-11-12',
    guardianUrl: 'https://theguardian.com/technology/ai-ethics-framework'
  },
  {
    id: '8',
    title: 'Renewable Energy Reaches Global Milestone',
    summary: 'Solar and wind power now account for 40% of worldwide electricity generation. Investment in clean energy infrastructure surpasses fossil fuel spending for the third consecutive year. This transition accelerates as battery storage technology improves, making renewable sources increasingly reliable.',
    imageUrl: 'https://media.guim.co.uk/j5k9j5k8i6l6i4h2l8l2j5k4l0h8i9j0k1l2m3n5/0_0_3600_2160/3600.jpg',
    category: 'Environment',
    publishedDate: '2024-11-11',
    guardianUrl: 'https://theguardian.com/environment/renewable-energy-milestone'
  },
  {
    id: '9',
    title: 'Space Mission Discovers Water on Mars',
    summary: 'NASA rover confirms liquid water presence beneath Martian surface. Subsurface reservoirs contain enough water to support future human missions. The discovery revolutionizes Mars colonization plans and provides crucial insights into the planet\'s geological history and potential for life.',
    imageUrl: 'https://media.guim.co.uk/k6l0k6l9j7m7j5i3m9m3k6l5m1i9j0k1l2m3n4o6/0_0_4000_2400/4000.jpg',
    category: 'Science',
    publishedDate: '2024-11-10',
    guardianUrl: 'https://theguardian.com/science/mars-water-discovery'
  },
  {
    id: '10',
    title: 'Global Education Initiative Launches',
    summary: 'UN announces ambitious program to provide quality education to 100 million children worldwide. The initiative combines digital learning platforms, local teacher training, and infrastructure development. Funding comes from international partnerships, targeting underserved communities across Africa, Asia, and Latin America.',
    imageUrl: 'https://media.guim.co.uk/l7m1l7m0k8n8k6j4n0n4l7m6n2j0k1l2m3n4o5p7/0_0_3800_2280/3800.jpg',
    category: 'Education',
    publishedDate: '2024-11-09',
    guardianUrl: 'https://theguardian.com/education/global-education-initiative'
  },
  {
    id: '11',
    title: 'Revolutionary Cancer Treatment Shows Promise',
    summary: 'Immunotherapy breakthrough demonstrates remarkable success in late-stage trials. The treatment harnesses the body\'s immune system to target cancer cells specifically. Patients show significant tumor reduction with minimal side effects, offering hope for previously terminal diagnoses.',
    imageUrl: 'https://media.guim.co.uk/m8n2m8n1l9o9l7k5o1o5m8n7o3k1l2m3n4o5p6q8/0_0_4200_2520/4200.jpg',
    category: 'Health',
    publishedDate: '2024-11-08',
    guardianUrl: 'https://theguardian.com/health/cancer-treatment-breakthrough'
  },
  {
    id: '12',
    title: 'Digital Currency Adoption Accelerates Globally',
    summary: 'Central banks worldwide expedite digital currency rollouts as cashless transactions surge. Enhanced security protocols and user-friendly interfaces drive public acceptance. The transition promises reduced transaction costs, improved financial inclusion, and more efficient monetary policy implementation.',
    imageUrl: 'https://media.guim.co.uk/n9o3n9o2m0p0m8l6p2p6n9o8p4l2m3n4o5p6q7r9/0_0_3600_2160/3600.jpg',
    category: 'Business',
    publishedDate: '2024-11-07',
    guardianUrl: 'https://theguardian.com/business/digital-currency-adoption'
  },
  {
    id: '13',
    title: 'Ocean Cleanup Project Achieves Major Victory',
    summary: 'Marine conservation efforts remove 50 tons of plastic waste from Pacific garbage patch. Advanced collection systems operate autonomously, powered entirely by solar energy. The project demonstrates scalable solutions for ocean pollution, inspiring similar initiatives in Atlantic and Indian Oceans.',
    imageUrl: 'https://media.guim.co.uk/o0p4o0p3n1q1n9m7q3q7o0p9q5m3n4o5p6q7r8s0/0_0_4000_2400/4000.jpg',
    category: 'Environment',
    publishedDate: '2024-11-06',
    guardianUrl: 'https://theguardian.com/environment/ocean-cleanup-victory'
  },
  {
    id: '14',
    title: 'Film Festival Celebrates Emerging Directors',
    summary: 'International cinema showcase highlights diverse storytelling from upcoming filmmakers worldwide. Independent productions explore contemporary social issues through innovative narrative techniques. The festival platform provides networking opportunities and distribution deals, supporting the next generation of creative talent.',
    imageUrl: 'https://media.guim.co.uk/p1q5p1q4o2r2o0n8r4r8p1q0r6n4o5p6q7r8s9t1/0_0_3800_2280/3800.jpg',
    category: 'Culture',
    publishedDate: '2024-11-05',
    guardianUrl: 'https://theguardian.com/culture/film-festival-emerging-directors'
  },
  {
    id: '15',
    title: 'Elections Reshape Political Landscape',
    summary: 'Democratic participation reaches record highs across multiple nations this election cycle. Voter turnout surpasses previous records as citizens engage actively in democratic processes. Results indicate shifting political priorities toward climate action, economic equality, and technological governance.',
    imageUrl: 'https://media.guim.co.uk/q2r6q2r5p3s3p1o9s5s9q2r1s7o5p6q7r8s9t0u2/0_0_4200_2520/4200.jpg',
    category: 'Politics',
    publishedDate: '2024-11-04',
    guardianUrl: 'https://theguardian.com/politics/elections-political-landscape'
  },
  {
    id: '16',
    title: 'Mental Health App Reaches 10 Million Users',
    summary: 'Digital wellness platform demonstrates significant impact on user mental health outcomes. Clinical studies validate app effectiveness in treating anxiety and depression. The platform combines AI-powered therapy sessions with human counselor support, making mental healthcare more accessible globally.',
    imageUrl: 'https://media.guim.co.uk/r3s7r3s6q4t4q2p0t6t0r3s2t8p6q7r8s9t0u1v3/0_0_3600_2160/3600.jpg',
    category: 'Health',
    publishedDate: '2024-11-03',
    guardianUrl: 'https://theguardian.com/health/mental-health-app-milestone'
  },
  {
    id: '17',
    title: 'Sustainable Fashion Week Showcases Innovation',
    summary: 'Designers present eco-friendly collections using recycled materials and ethical production methods. Fashion industry leaders commit to carbon neutrality by 2030. The showcase features biodegradable fabrics, circular design principles, and fair-trade manufacturing partnerships.',
    imageUrl: 'https://media.guim.co.uk/s4t8s4t7r5u5r3q1u7u1s4t3u9q7r8s9t0u1v2w4/0_0_4000_2400/4000.jpg',
    category: 'Fashion',
    publishedDate: '2024-11-02',
    guardianUrl: 'https://theguardian.com/fashion/sustainable-fashion-week'
  },
  {
    id: '18',
    title: 'Culinary Innovation Transforms Restaurant Industry',
    summary: 'Chefs embrace laboratory-grown ingredients and molecular gastronomy techniques. Plant-based alternatives achieve taste and texture indistinguishable from traditional proteins. The culinary revolution addresses sustainability concerns while maintaining exceptional dining experiences.',
    imageUrl: 'https://media.guim.co.uk/t5u9t5u8s6v6s4r2v8v2t5u4v0r8s9t0u1v2w3x5/0_0_3800_2280/3800.jpg',
    category: 'Food',
    publishedDate: '2024-11-01',
    guardianUrl: 'https://theguardian.com/food/culinary-innovation-transformation'
  },
  {
    id: '19',
    title: 'Virtual Reality Transforms Medical Training',
    summary: 'Healthcare education adopts immersive VR simulations for surgical training and patient care scenarios. Medical students practice complex procedures in risk-free virtual environments. The technology improves learning outcomes while reducing training costs and eliminating practice-related patient risks.',
    imageUrl: 'https://media.guim.co.uk/u6v0u6v9t7w7t5s3w9w3u6v5w1s9t0u1v2w3x4y6/0_0_4200_2520/4200.jpg',
    category: 'Technology',
    publishedDate: '2024-10-31',
    guardianUrl: 'https://theguardian.com/technology/vr-medical-training'
  },
  {
    id: '20',
    title: 'Art Exhibition Explores Digital Creativity',
    summary: 'Contemporary gallery showcases AI-generated artwork and NFT collections from international artists. The exhibition examines the intersection of technology and artistic expression. Visitors interact with responsive installations that adapt to audience participation, blurring traditional art boundaries.',
    imageUrl: 'https://media.guim.co.uk/v7w1v7w0u8x8u6t4x0x4v7w6x2t0u1v2w3x4y5z7/0_0_3600_2160/3600.jpg',
    category: 'Art',
    publishedDate: '2024-10-30',
    guardianUrl: 'https://theguardian.com/art/digital-creativity-exhibition'
  },
  {
    id: '21',
    title: 'Adventure Tourism Embraces Sustainability',
    summary: 'Eco-conscious travelers seek authentic experiences while minimizing environmental impact. Tour operators develop carbon-neutral expeditions and wildlife conservation programs. The industry shift promotes responsible tourism, supporting local communities while preserving natural ecosystems.',
    imageUrl: 'https://media.guim.co.uk/w8x2w8x1v9y9v7u5y1y5w8x7y3u1v2w3x4y5z6a8/0_0_4000_2400/4000.jpg',
    category: 'Travel',
    publishedDate: '2024-10-29',
    guardianUrl: 'https://theguardian.com/travel/sustainable-adventure-tourism'
  },
  {
    id: '22',
    title: 'Olympic Training Revolutionized by Technology',
    summary: 'Athletes utilize advanced biomechanics analysis and AI-powered performance optimization. Wearable devices monitor training loads while virtual coaching provides real-time feedback. These innovations help athletes achieve peak performance while reducing injury risks.',
    imageUrl: 'https://media.guim.co.uk/x9y3x9y2w0z0w8v6z2z6x9y8z4v2w3x4y5z6a7b9/0_0_3800_2280/3800.jpg',
    category: 'Sport',
    publishedDate: '2024-10-28',
    guardianUrl: 'https://theguardian.com/sport/olympic-training-technology'
  },
  {
    id: '23',
    title: 'Urban Agriculture Feeds Growing Cities',
    summary: 'Vertical farms and rooftop gardens supply fresh produce to metropolitan populations. Hydroponic systems use 95% less water while producing higher yields than traditional farming. Urban agriculture reduces food transportation costs and ensures year-round local food security.',
    imageUrl: 'https://media.guim.co.uk/y0z4y0z3x1a1x9w7a3a7y0z9a5w3x4y5z6a7b8c0/0_0_4200_2520/4200.jpg',
    category: 'Environment',
    publishedDate: '2024-10-27',
    guardianUrl: 'https://theguardian.com/environment/urban-agriculture-cities'
  },
  {
    id: '24',
    title: 'Robotic Surgery Achieves New Precision',
    summary: 'Advanced surgical robots perform microsurgery with unprecedented accuracy. Surgeons operate remotely using haptic feedback technology. Patient recovery times decrease significantly while surgical success rates reach new highs across multiple medical specialties.',
    imageUrl: 'https://media.guim.co.uk/z1a5z1a4y2b2y0x8b4b8z1a0b6x4y5z6a7b8c9d1/0_0_3600_2160/3600.jpg',
    category: 'Health',
    publishedDate: '2024-10-26',
    guardianUrl: 'https://theguardian.com/health/robotic-surgery-precision'
  },
  {
    id: '25',
    title: 'Cryptocurrency Market Reaches Maturity',
    summary: 'Digital asset regulation provides market stability and investor confidence. Institutional adoption accelerates as traditional banks integrate cryptocurrency services. The mature market demonstrates reduced volatility while maintaining innovation in decentralized finance applications.',
    imageUrl: 'https://media.guim.co.uk/a2b6a2b5z3c3z1y9c5c9a2b1c7y5z6a7b8c9d0e2/0_0_4000_2400/4000.jpg',
    category: 'Business',
    publishedDate: '2024-10-25',
    guardianUrl: 'https://theguardian.com/business/cryptocurrency-market-maturity'
  },
  {
    id: '26',
    title: 'Deep Sea Exploration Reveals New Species',
    summary: 'Marine biologists discover hundreds of previously unknown organisms in ocean trenches. Advanced submersibles equipped with AI-powered cameras catalog biodiversity in extreme environments. These findings expand understanding of life\'s adaptability and potential pharmaceutical applications.',
    imageUrl: 'https://media.guim.co.uk/b3c7b3c6a4d4a2z0d6d0b3c2d8z6a7b8c9d0e1f3/0_0_3800_2280/3800.jpg',
    category: 'Science',
    publishedDate: '2024-10-24',
    guardianUrl: 'https://theguardian.com/science/deep-sea-new-species'
  },
  {
    id: '27',
    title: 'Music Streaming Platforms Support Independent Artists',
    summary: 'Digital music services launch initiatives to promote emerging talent and fair revenue sharing. New algorithms prioritize discovery of independent musicians over mainstream releases. The platform changes democratize music distribution, enabling artists to reach global audiences directly.',
    imageUrl: 'https://media.guim.co.uk/c4d8c4d7b5e5b3a1e7e1c4d3e9a7b8c9d0e1f2g4/0_0_4200_2520/4200.jpg',
    category: 'Culture',
    publishedDate: '2024-10-23',
    guardianUrl: 'https://theguardian.com/culture/music-streaming-independent-artists'
  },
  {
    id: '28',
    title: 'Smart Cities Initiative Reduces Energy Consumption',
    summary: 'IoT sensors and AI optimization cut municipal energy usage by 30% across pilot cities. Smart traffic systems reduce congestion while intelligent lighting adapts to real-time needs. The comprehensive approach demonstrates scalable solutions for urban sustainability challenges.',
    imageUrl: 'https://media.guim.co.uk/d5e9d5e8c6f6c4b2f8f2d5e4f0b8c9d0e1f2g3h5/0_0_3600_2160/3600.jpg',
    category: 'Technology',
    publishedDate: '2024-10-22',
    guardianUrl: 'https://theguardian.com/technology/smart-cities-energy-reduction'
  },
  {
    id: '29',
    title: 'Global Peace Summit Addresses Regional Conflicts',
    summary: 'International leaders gather to mediate disputes and establish diplomatic frameworks. Peacekeeping initiatives focus on economic cooperation and cultural exchange programs. The summit produces concrete commitments for conflict prevention and humanitarian assistance.',
    imageUrl: 'https://media.guim.co.uk/e6f0e6f9d7g7d5c3g9g3e6f5g1c9d0e1f2g3h4i6/0_0_4000_2400/4000.jpg',
    category: 'Politics',
    publishedDate: '2024-10-21',
    guardianUrl: 'https://theguardian.com/politics/global-peace-summit'
  },
  {
    id: '30',
    title: 'Space-Based Solar Power Becomes Reality',
    summary: 'Orbital power stations beam clean energy to Earth using microwave transmission. The technology overcomes atmospheric limitations of ground-based solar arrays. Successful demonstration proves viability for large-scale clean energy generation, revolutionizing renewable power infrastructure.',
    imageUrl: 'https://media.guim.co.uk/f7g1f7g0e8h8e6d4h0h4f7g6h2d0e1f2g3h4i5j7/0_0_3800_2280/3800.jpg',
    category: 'Science',
    publishedDate: '2024-10-20',
    guardianUrl: 'https://theguardian.com/science/space-solar-power-reality'
  }
];

export const getTopCategories = (): Category[] => {
  return categories.slice(0, 10);
};

export const getRemainingCategories = (): Category[] => {
  return categories.slice(10);
};

export const getArticlesByCategory = (categorySlug: string): Article[] => {
  return dummyArticles.filter(article => 
    article.category.toLowerCase() === categorySlug.toLowerCase()
  );
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(cat => cat.slug === slug);
};