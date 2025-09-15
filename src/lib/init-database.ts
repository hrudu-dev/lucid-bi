import { executeQuery } from './database'

// SQL statements to create required tables
const createTablesSQL = [
  // Business data table for storing various data types
  `
  CREATE TABLE IF NOT EXISTS business_data (
    id VARCHAR(255) PRIMARY KEY,
    source VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    content JSON NOT NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_source (source),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
  )
  `,
  
  // Insights table for AI-generated insights
  `
  CREATE TABLE IF NOT EXISTS insights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    insights JSON NOT NULL,
    confidence_score INT DEFAULT 0,
    data_sources JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_confidence (confidence_score),
    INDEX idx_created_at (created_at)
  )
  `,
  
  // Users table for authentication (optional, for future use)
  `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
  )
  `,
  
  // Sessions table for user sessions
  `
  CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_expires (expires_at),
    INDEX idx_user (user_id)
  )
  `
]

// Sample data for testing
const sampleInserts = [
  // Sample business data
  `
  INSERT IGNORE INTO business_data (id, source, type, content, metadata) VALUES
  ('sales_2024_q1', 'sales', 'financial', '{"revenue": 150000, "units_sold": 1200, "quarter": "Q1", "year": 2024}', '{"region": "North America", "team": "Sales Team A"}'),
  ('sales_2024_q2', 'sales', 'financial', '{"revenue": 180000, "units_sold": 1450, "quarter": "Q2", "year": 2024}', '{"region": "North America", "team": "Sales Team A"}'),
  ('customer_feedback_1', 'feedback', 'text', '{"feedback": "Great product, very satisfied with the quality and service."}', '{"customer_id": "c001", "rating": 5}'),
  ('customer_feedback_2', 'feedback', 'text', '{"feedback": "Good product but delivery was delayed."}', '{"customer_id": "c002", "rating": 3}'),
  ('marketing_campaign_1', 'marketing', 'campaign', '{"campaign_name": "Summer Sale", "budget": 50000, "clicks": 15000, "conversions": 850}', '{"platform": "digital", "duration": "30 days"}')
  `,
  
  // Sample insights
  `
  INSERT IGNORE INTO insights (id, title, description, insights, confidence_score, data_sources) VALUES
  (1, 'Q2 Revenue Growth Analysis', 'Significant revenue increase observed in Q2 2024', '{"growth_rate": 20, "key_drivers": ["increased_marketing", "seasonal_demand"], "recommendations": ["expand_team", "increase_inventory"]}', 85, '["sales_2024_q1", "sales_2024_q2"]'),
  (2, 'Customer Satisfaction Trends', 'Analysis of customer feedback patterns', '{"avg_rating": 4.0, "sentiment": "positive", "key_issues": ["delivery_delays"], "recommendations": ["improve_logistics"]}', 78, '["customer_feedback_1", "customer_feedback_2"]'),
  (3, 'Marketing Campaign Performance', 'Summer Sale campaign effectiveness review', '{"roi": 34, "conversion_rate": 5.67, "cost_per_conversion": 58.82, "recommendations": ["increase_budget", "target_optimization"]}', 92, '["marketing_campaign_1"]')
  `
]

export async function initializeDatabase() {
  console.log('🔧 Initializing database tables...')
  
  try {
    // Create tables
    for (const sql of createTablesSQL) {
      await executeQuery(sql.trim())
      console.log('✅ Table created successfully')
    }
    
    // Insert sample data
    for (const sql of sampleInserts) {
      await executeQuery(sql.trim())
      console.log('✅ Sample data inserted successfully')
    }
    
    console.log('🎉 Database initialization completed successfully!')
    return { success: true, message: 'Database initialized successfully' }
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function checkTablesExist() {
  try {
    const tables = ['business_data', 'insights', 'users', 'sessions']
    const results = []
    
    for (const table of tables) {
      const result = await executeQuery(`SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = ?`, [process.env.TIDB_DATABASE, table]) as any[]
      results.push({
        table,
        exists: result[0]?.count > 0
      })
    }
    
    return results
  } catch (error) {
    console.error('Error checking tables:', error)
    return []
  }
}