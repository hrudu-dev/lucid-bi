import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import { generateEmbedding } from '@/lib/ai'
import { v4 as uuidv4 } from 'uuid'

// Demo data for hackathon - showcasing different business scenarios
const DEMO_DATA_SETS = {
  sales: [
    { product: "Product A", revenue: 15000, quarter: "Q1", region: "North America" },
    { product: "Product B", revenue: 22000, quarter: "Q1", region: "Europe" },
    { product: "Product A", revenue: 18000, quarter: "Q2", region: "North America" },
    { product: "Product C", revenue: 12000, quarter: "Q2", region: "Asia" },
    { product: "Product B", revenue: 25000, quarter: "Q2", region: "Europe" },
  ],
  customer_feedback: [
    "The product quality is excellent, but delivery was slow",
    "Great customer service experience, very responsive team",
    "Price point is competitive, would recommend to others",
    "User interface could be improved for better usability",
    "Overall satisfaction is high, will purchase again"
  ],
  financial_metrics: [
    { metric: "Revenue Growth", value: 15.2, period: "2024-Q2", target: 12.0 },
    { metric: "Customer Acquisition Cost", value: 45.50, period: "2024-Q2", target: 50.00 },
    { metric: "Churn Rate", value: 3.2, period: "2024-Q2", target: 5.0 },
    { metric: "Profit Margin", value: 22.8, period: "2024-Q2", target: 20.0 }
  ]
}

export async function POST(request: NextRequest) {
  try {
    const { dataSet } = await request.json()
    
    if (!dataSet || !DEMO_DATA_SETS[dataSet as keyof typeof DEMO_DATA_SETS]) {
      return NextResponse.json(
        { success: false, error: 'Invalid dataset specified' },
        { status: 400 }
      )
    }

    const selectedData = DEMO_DATA_SETS[dataSet as keyof typeof DEMO_DATA_SETS]
    const results = []

    for (const item of selectedData) {
      const dataId = uuidv4()
      
      // Determine if data is structured or unstructured
      const isUnstructured = typeof item === 'string'
      const content = isUnstructured ? item : item
      const type = isUnstructured ? 'unstructured' : 'structured'
      
      // Insert business data
      const insertDataQuery = `
        INSERT INTO business_data (id, source, type, content, metadata, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `
      
      await executeQuery(insertDataQuery, [
        dataId,
        `demo_${dataSet}`,
        type,
        JSON.stringify(content),
        JSON.stringify({ dataset: dataSet, demo: true })
      ])

      // Generate embeddings for unstructured data
      if (isUnstructured) {
        try {
          const contentString = typeof content === 'string' ? content : JSON.stringify(content)
          const embedding = await generateEmbedding(contentString)
          const vectorId = uuidv4()
          
          const insertVectorQuery = `
            INSERT INTO vector_data (id, content, embedding, metadata, business_data_id, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
          `
          
          await executeQuery(insertVectorQuery, [
            vectorId,
            contentString,
            JSON.stringify(embedding),
            JSON.stringify({ dataset: dataSet, demo: true }),
            dataId
          ])
        } catch (embeddingError) {
          console.warn('Failed to generate embedding for demo data:', embeddingError)
        }
      }

      results.push({ id: dataId, type, content })
    }

    return NextResponse.json({
      success: true,
      data: {
        message: `Successfully loaded ${results.length} records from ${dataSet} dataset`,
        records: results.length,
        dataset: dataSet
      }
    })
    
  } catch (error) {
    console.error('Demo data loading error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load demo data' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        availableDatasets: Object.keys(DEMO_DATA_SETS),
        description: "Load demo datasets to showcase LucidBI capabilities",
        datasets: {
          sales: "Quarterly sales data with revenue metrics by product and region",
          customer_feedback: "Unstructured customer feedback for sentiment analysis",
          financial_metrics: "Key financial KPIs with targets and actuals"
        }
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get demo data info' },
      { status: 500 }
    )
  }
}