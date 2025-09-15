import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.TIDB_HOST,
  port: parseInt(process.env.TIDB_PORT || '4000'),
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE,
  ssl: {
    rejectUnauthorized: true
  }
}

let connection: mysql.Connection | null = null

export async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection(dbConfig)
  }
  return connection
}

export async function executeQuery(query: string, params: any[] = []) {
  const conn = await getConnection()
  try {
    const [results] = await conn.execute(query, params)
    return results
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

export async function executeVectorSearch(
  query: string,
  embedding: number[],
  limit: number = 10
) {
  const conn = await getConnection()
  try {
    // Using TiDB's vector search capabilities
    const vectorQuery = `
      SELECT id, content, metadata, 
             VEC_COSINE_DISTANCE(embedding, ?) as distance
      FROM vector_data
      WHERE VEC_COSINE_DISTANCE(embedding, ?) < 0.8
      ORDER BY distance ASC
      LIMIT ?
    `
    const [results] = await conn.execute(vectorQuery, [JSON.stringify(embedding), JSON.stringify(embedding), limit])
    return results
  } catch (error) {
    console.error('Vector search error:', error)
    throw error
  }
}

export async function initializeDatabase() {
  const conn = await getConnection()
  
  // Create main data tables
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS business_data (
      id VARCHAR(36) PRIMARY KEY,
      source VARCHAR(255) NOT NULL,
      type ENUM('structured', 'unstructured') NOT NULL,
      content JSON NOT NULL,
      metadata JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_source (source),
      INDEX idx_type (type),
      INDEX idx_created (created_at)
    )
  `)

  // Create vector data table for semantic search
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS vector_data (
      id VARCHAR(36) PRIMARY KEY,
      content TEXT NOT NULL,
      embedding VECTOR(1536) NOT NULL,
      metadata JSON,
      business_data_id VARCHAR(36),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (business_data_id) REFERENCES business_data(id) ON DELETE CASCADE,
      VECTOR INDEX vec_idx (embedding)
    )
  `)

  // Create insights table
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS insights (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      insights JSON NOT NULL,
      confidence_score DECIMAL(3,2),
      data_sources JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_confidence (confidence_score),
      INDEX idx_created (created_at)
    )
  `)

  // Create actions/triggers table
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS actions (
      id VARCHAR(36) PRIMARY KEY,
      type ENUM('slack_report', 'dashboard_update', 'alert', 'email') NOT NULL,
      config JSON NOT NULL,
      status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
      insight_id VARCHAR(36),
      scheduled_at TIMESTAMP,
      executed_at TIMESTAMP,
      error_message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (insight_id) REFERENCES insights(id) ON DELETE CASCADE,
      INDEX idx_status (status),
      INDEX idx_type (type),
      INDEX idx_scheduled (scheduled_at)
    )
  `)
}