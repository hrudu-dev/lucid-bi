#!/usr/bin/env node

// Simple script to initialize the database
// Run with: node scripts/init-db.js

const path = require('path');
const { config } = require('dotenv');

// Load environment variables
config({ path: path.resolve(__dirname, '../.env.local') });

const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.TIDB_HOST,
  port: parseInt(process.env.TIDB_PORT || '4000'),
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE,
  ssl: {
    rejectUnauthorized: true
  }
};

console.log('🔧 Initializing database...');
console.log('Database config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user ? `${dbConfig.user.substring(0, 10)}...` : 'undefined',
  database: dbConfig.database,
  hasPassword: !!dbConfig.password
});

async function executeQuery(query, params = []) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [results] = await connection.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function initializeDatabase() {
  try {
    console.log('🚀 Creating tables...');
    
    // Business data table
    await executeQuery(`
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
    `);
    console.log('✅ business_data table created');
    
    // Insights table
    await executeQuery(`
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
    `);
    console.log('✅ insights table created');
    
    // Insert sample data
    console.log('📊 Inserting sample data...');
    
    // Sample business data
    await executeQuery(`
      INSERT IGNORE INTO business_data (id, source, type, content, metadata) VALUES
      ('sales_2024_q1', 'sales', 'financial', '{"revenue": 150000, "units_sold": 1200, "quarter": "Q1", "year": 2024}', '{"region": "North America", "team": "Sales Team A"}'),
      ('sales_2024_q2', 'sales', 'financial', '{"revenue": 180000, "units_sold": 1450, "quarter": "Q2", "year": 2024}', '{"region": "North America", "team": "Sales Team A"}'),
      ('customer_feedback_1', 'feedback', 'text', '{"feedback": "Great product, very satisfied with the quality and service."}', '{"customer_id": "c001", "rating": 5}'),
      ('customer_feedback_2', 'feedback', 'text', '{"feedback": "Good product but delivery was delayed."}', '{"customer_id": "c002", "rating": 3}'),
      ('marketing_campaign_1', 'marketing', 'campaign', '{"campaign_name": "Summer Sale", "budget": 50000, "clicks": 15000, "conversions": 850}', '{"platform": "digital", "duration": "30 days"}')
    `);
    console.log('✅ Sample business data inserted');
    
    // Sample insights
    await executeQuery(`
      INSERT IGNORE INTO insights (id, title, description, insights, confidence_score, data_sources) VALUES
      (1, 'Q2 Revenue Growth Analysis', 'Significant revenue increase observed in Q2 2024', '{"growth_rate": 20, "key_drivers": ["increased_marketing", "seasonal_demand"], "recommendations": ["expand_team", "increase_inventory"]}', 85, '["sales_2024_q1", "sales_2024_q2"]'),
      (2, 'Customer Satisfaction Trends', 'Analysis of customer feedback patterns', '{"avg_rating": 4.0, "sentiment": "positive", "key_issues": ["delivery_delays"], "recommendations": ["improve_logistics"]}', 78, '["customer_feedback_1", "customer_feedback_2"]'),
      (3, 'Marketing Campaign Performance', 'Summer Sale campaign effectiveness review', '{"roi": 34, "conversion_rate": 5.67, "cost_per_conversion": 58.82, "recommendations": ["increase_budget", "target_optimization"]}', 92, '["marketing_campaign_1"]')
    `);
    console.log('✅ Sample insights inserted');
    
    console.log('🎉 Database initialization completed successfully!');
    
    // Verify tables
    const tables = await executeQuery(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ? AND table_name IN ('business_data', 'insights')
    `, [process.env.TIDB_DATABASE]);
    
    console.log('📋 Tables created:', tables.map(t => t.table_name || t.TABLE_NAME));
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();