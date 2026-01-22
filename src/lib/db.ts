import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'articles.db');
const db = new Database(dbPath);

// Create articles table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    type TEXT,
    sectionId TEXT,
    sectionName TEXT,
    webPublicationDate TEXT,
    webTitle TEXT,
    webUrl TEXT,
    pillarId TEXT,
    pillarName TEXT,
    thumbnail TEXT,
    trailText TEXT,
    byline TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create fetched_article_ids table to track all fetched article IDs
// This table persists IDs even when articles are deleted, to prevent duplicate fetching
db.exec(`
  CREATE TABLE IF NOT EXISTS fetched_article_ids (
    id TEXT PRIMARY KEY,
    fetchedAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Migrate summaries table to remove foreign key constraint
// Check if old table exists and migrate if needed
const tableInfo = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='summaries'").get() as { sql: string } | undefined;

if (tableInfo && tableInfo.sql.includes('FOREIGN KEY')) {
  // Old table with foreign key exists - migrate it
  db.exec(`
    -- Create new table without foreign key
    CREATE TABLE summaries_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guardianId TEXT UNIQUE NOT NULL,
      transformedTitle TEXT NOT NULL,
      summary TEXT NOT NULL,
      section TEXT,
      imageUrl TEXT,
      publishedDate TEXT,
      processedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Copy data from old table
    INSERT INTO summaries_new (id, guardianId, transformedTitle, summary, section, imageUrl, publishedDate, processedAt)
    SELECT id, guardianId, transformedTitle, summary, section, imageUrl, publishedDate, processedAt
    FROM summaries;

    -- Drop old table
    DROP TABLE summaries;

    -- Rename new table
    ALTER TABLE summaries_new RENAME TO summaries;
  `);
} else if (!tableInfo) {
  // Table doesn't exist - create it fresh
  db.exec(`
    CREATE TABLE summaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guardianId TEXT UNIQUE NOT NULL,
      transformedTitle TEXT NOT NULL,
      summary TEXT NOT NULL,
      section TEXT,
      imageUrl TEXT,
      publishedDate TEXT,
      processedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
// If table exists without FK, do nothing

// Add category column to summaries table if it doesn't exist
const categoryColumnExists = db.prepare("SELECT name FROM pragma_table_info('summaries') WHERE name='category'").get();
if (!categoryColumnExists) {
  db.exec(`ALTER TABLE summaries ADD COLUMN category TEXT`);
}

// Create keywords table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS keywords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword TEXT UNIQUE NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Seed default keywords if table is empty
const keywordCount = db.prepare('SELECT COUNT(*) as count FROM keywords').get() as { count: number };
if (keywordCount.count === 0) {
  const defaultKeywords = [
    // Core countries
    'india', 'modi', 'pakistan',
    // Major cities
    'kashmir', 'delhi', 'mumbai', 'islamabad', 'karachi', 'lahore',
    'bengaluru', 'bangalore', 'hyderabad', 'chennai', 'kolkata', 'peshawar',
    // States and regions
    'punjab', 'bangladesh', 'gujarat', 'kerala', 'rajasthan', 'tamil nadu', 'balochistan',
    // Political leaders and parties
    'gandhi', 'bjp', 'congress', 'imran khan', 'sharif', 'bhutto',
    'rss', 'hindutva', 'amit shah', 'rahul gandhi', 'partition', 'nehru',
    // Religious and cultural
    'hindu', 'muslim', 'sikh', 'taj mahal',
    // Security and conflict
    'border', 'terrorism', 'nuclear', 'militant', 'taliban', 'afghanistan',
    'pulwama', 'kargil', 'ceasefire', 'drone',
    // Sports
    'cricket', 'kohli', 'tendulkar', 'ipl',
    // Business and economy
    'bollywood', 'rupee', 'tata', 'reliance', 'adani', 'ambani',
    // Regional neighbors
    'china', 'nepal', 'sri lanka',
    // Geographic and environmental
    'monsoon', 'ganges', 'ganga', 'indus', 'himalaya',
    // Iran related
    'iran', 'tehran', 'iranian', 'khamenei', 'rouhani', 'raisi',
    'persian', 'shiite', 'shia', 'hormuz', 'isfahan', 'mashhad', 'persian gulf',
    // Afghanistan related
    'kabul', 'kandahar', 'afghan', 'panjshir', 'herat', 'mazar',
    // China related
    'beijing', 'shanghai', 'xi jinping', 'tibet', 'taiwan', 'hong kong',
    'uyghur', 'xinjiang', 'ladakh', 'pla',
    // Sri Lanka related
    'colombo', 'sinhalese', 'tamil tigers', 'rajapaksa', 'gotabaya', 'kandy'
  ];

  const insertKeyword = db.prepare('INSERT OR IGNORE INTO keywords (keyword) VALUES (?)');
  const insertMany = db.transaction((keywords: string[]) => {
    for (const keyword of keywords) {
      insertKeyword.run(keyword);
    }
  });
  insertMany(defaultKeywords);
}

export interface Article {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  pillarId?: string;
  pillarName?: string;
  thumbnail?: string;
  trailText?: string;
  byline?: string;
  createdAt?: string;
}

export interface Summary {
  id: number;
  guardianId: string;
  transformedTitle: string;
  summary: string;
  section: string | null;
  category: string | null;
  imageUrl: string | null;
  publishedDate: string | null;
  processedAt: string;
}

export interface Keyword {
  id: number;
  keyword: string;
  createdAt: string;
}

// Insert or update article
export function saveArticle(article: any) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO articles (
      id, type, sectionId, sectionName, webPublicationDate,
      webTitle, webUrl, pillarId, pillarName, thumbnail, trailText, byline
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  return stmt.run(
    article.id,
    article.type,
    article.sectionId,
    article.sectionName,
    article.webPublicationDate,
    article.webTitle,
    article.webUrl,
    article.pillarId || null,
    article.pillarName || null,
    article.fields?.thumbnail || null,
    article.fields?.trailText || null,
    article.fields?.byline || null
  );
}

// Save multiple articles and track their IDs
export function saveArticles(articles: any[]) {
  const insert = db.transaction((articles) => {
    for (const article of articles) {
      saveArticle(article);
      // Also track the article ID
      trackFetchedArticleId(article.id);
    }
  });

  return insert(articles);
}

// Get all articles
export function getAllArticles(): Article[] {
  const stmt = db.prepare('SELECT * FROM articles ORDER BY webPublicationDate DESC');
  return stmt.all() as Article[];
}

// Get article by ID
export function getArticleById(id: string): Article | undefined {
  const stmt = db.prepare('SELECT * FROM articles WHERE id = ?');
  return stmt.get(id) as Article | undefined;
}

// Delete article by ID
export function deleteArticle(id: string) {
  const stmt = db.prepare('DELETE FROM articles WHERE id = ?');
  return stmt.run(id);
}

// Delete multiple articles by IDs
export function deleteArticles(ids: string[]) {
  const placeholders = ids.map(() => '?').join(',');
  const stmt = db.prepare(`DELETE FROM articles WHERE id IN (${placeholders})`);
  return stmt.run(...ids);
}

// Count total articles
export function countArticles(): number {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM articles');
  const result = stmt.get() as { count: number };
  return result.count;
}

// ===== Fetched Article ID Tracking Functions =====

// Track a fetched article ID (persists even if article is deleted)
export function trackFetchedArticleId(id: string) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO fetched_article_ids (id) VALUES (?)
  `);
  return stmt.run(id);
}

// Check if an article ID has been fetched before
export function isArticleFetched(id: string): boolean {
  const stmt = db.prepare('SELECT id FROM fetched_article_ids WHERE id = ?');
  const result = stmt.get(id);
  return result !== undefined;
}

// Check multiple article IDs and return only new (unfetched) IDs
export function filterNewArticleIds(ids: string[]): string[] {
  if (ids.length === 0) return [];

  const placeholders = ids.map(() => '?').join(',');
  const stmt = db.prepare(`
    SELECT id FROM fetched_article_ids WHERE id IN (${placeholders})
  `);
  const fetchedIds = stmt.all(...ids) as { id: string }[];
  const fetchedIdSet = new Set(fetchedIds.map(row => row.id));

  return ids.filter(id => !fetchedIdSet.has(id));
}

// Get count of all fetched article IDs (including deleted articles)
export function countFetchedArticleIds(): number {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM fetched_article_ids');
  const result = stmt.get() as { count: number };
  return result.count;
}

// ===== Summary (Processed Articles) Functions =====

// Save a processed summary
export function saveSummary(data: {
  guardianId: string;
  transformedTitle: string;
  summary: string;
  section?: string;
  category?: string;
  imageUrl?: string;
  publishedDate?: string;
}) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO summaries (
      guardianId, transformedTitle, summary, section, category, imageUrl, publishedDate
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  return stmt.run(
    data.guardianId,
    data.transformedTitle,
    data.summary,
    data.section || null,
    data.category || null,
    data.imageUrl || null,
    data.publishedDate || null
  );
}

// Get all summaries
export function getAllSummaries(): Summary[] {
  const stmt = db.prepare('SELECT * FROM summaries ORDER BY publishedDate DESC');
  return stmt.all() as Summary[];
}

// Get summary by Guardian ID
export function getSummaryByGuardianId(guardianId: string): Summary | undefined {
  const stmt = db.prepare('SELECT * FROM summaries WHERE guardianId = ?');
  return stmt.get(guardianId) as Summary | undefined;
}

// Check if article has been processed
export function isArticleProcessed(guardianId: string): boolean {
  const stmt = db.prepare('SELECT id FROM summaries WHERE guardianId = ?');
  const result = stmt.get(guardianId);
  return result !== undefined;
}

// Delete summary
export function deleteSummary(guardianId: string) {
  const stmt = db.prepare('DELETE FROM summaries WHERE guardianId = ?');
  return stmt.run(guardianId);
}

// Count total summaries
export function countSummaries(): number {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM summaries');
  const result = stmt.get() as { count: number };
  return result.count;
}

// ===== Keyword Management Functions =====

// Get all keywords
export function getAllKeywords(): Keyword[] {
  const stmt = db.prepare('SELECT * FROM keywords ORDER BY keyword ASC');
  return stmt.all() as Keyword[];
}

// Get all keyword strings (for filtering)
export function getKeywordStrings(): string[] {
  const stmt = db.prepare('SELECT keyword FROM keywords ORDER BY keyword ASC');
  const results = stmt.all() as { keyword: string }[];
  return results.map(row => row.keyword);
}

// Add a new keyword
export function addKeyword(keyword: string): { success: boolean; id?: number; error?: string } {
  try {
    const stmt = db.prepare('INSERT INTO keywords (keyword) VALUES (?)');
    const result = stmt.run(keyword.toLowerCase().trim());
    return { success: true, id: result.lastInsertRowid as number };
  } catch (err: any) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return { success: false, error: 'Keyword already exists' };
    }
    return { success: false, error: err.message };
  }
}

// Delete a keyword by ID
export function deleteKeyword(id: number): { success: boolean; error?: string } {
  try {
    const stmt = db.prepare('DELETE FROM keywords WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      return { success: false, error: 'Keyword not found' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// Count total keywords
export function countKeywords(): number {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM keywords');
  const result = stmt.get() as { count: number };
  return result.count;
}

export default db;
