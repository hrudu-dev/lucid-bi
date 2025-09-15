import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder-key-for-build',
})

export interface AnalysisResult {
  insights: string[]
  recommendations: string[]
  confidence: number
  sqlQueries?: string[]
  charts?: ChartConfig[]
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'area'
  data: any[]
  title: string
  xAxis?: string
  yAxis?: string
}

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'placeholder-key-for-build') {
    throw new Error('OpenAI API key is not configured')
  }
  
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    })
    return response.data[0].embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw error
  }
}

export async function generateSQLQuery(
  question: string,
  schema: string
): Promise<string> {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'placeholder-key-for-build') {
    throw new Error('OpenAI API key is not configured')
  }
  
  try {
    const prompt = `
Given the following database schema:
${schema}

Generate a SQL query to answer this question: ${question}

Return only the SQL query without any explanations.
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
    })

    return response.choices[0].message.content?.trim() || ''
  } catch (error) {
    console.error('Error generating SQL query:', error)
    throw error
  }
}

export async function analyzeData(
  data: any[],
  context: string
): Promise<AnalysisResult> {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'placeholder-key-for-build') {
    throw new Error('OpenAI API key is not configured')
  }
  
  try {
    const prompt = `
Analyze the following business data and provide insights:

Context: ${context}
Data: ${JSON.stringify(data, null, 2)}

Please provide:
1. Key insights (3-5 bullet points)
2. Actionable recommendations (3-5 bullet points)
3. Confidence score (0-1)
4. Suggested chart types and configurations

Format your response as JSON with the following structure:
{
  "insights": ["insight1", "insight2", ...],
  "recommendations": ["rec1", "rec2", ...],
  "confidence": 0.85,
  "charts": [
    {
      "type": "bar",
      "title": "Chart Title",
      "data": [...],
      "xAxis": "field1",
      "yAxis": "field2"
    }
  ]
}
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')
    return result as AnalysisResult
  } catch (error) {
    console.error('Error analyzing data:', error)
    throw error
  }
}

export async function generateReport(
  insights: AnalysisResult,
  metadata: any
): Promise<string> {
  try {
    const prompt = `
Generate a comprehensive business intelligence report based on these insights:

Insights: ${JSON.stringify(insights, null, 2)}
Metadata: ${JSON.stringify(metadata, null, 2)}

Create a well-formatted markdown report with:
1. Executive Summary
2. Key Findings
3. Recommendations
4. Data Sources
5. Methodology Notes

Keep it professional and actionable.
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
    })

    return response.choices[0].message.content || ''
  } catch (error) {
    console.error('Error generating report:', error)
    throw error
  }
}