# LucidBI - AI-Powered Business Intelligence Agent

LucidBI is an **open-source, multi-step AI agent** that transforms raw business data into **clear, actionable insights** through intelligent automation.

## 🚀 Solving Real-World Business Intelligence Challenges

LucidBI addresses the critical problem of **data silos and manual analysis** that plague modern businesses. Our AI agent automates the entire BI workflow:

- **Ingest & Index Data** (structured CSV/JSON + unstructured text/feedback)
- **Intelligent Search** (TiDB vector search + SQL queries + natural language)  
- **AI-Powered Analysis** (OpenAI-driven insights + confidence scoring)
- **Automated Actions** (Slack reports + alerts + dashboard updates)

Built using **TiDB Serverless** with **Vector Search** capabilities for semantic data analysis.

## 🚀 Multi-Step AI Agent Workflow

### 1. **Data Ingestion & Indexing**
- **Structured Data**: Sales records, financial metrics, KPIs
- **Unstructured Data**: Customer feedback, reviews, text documents
- **Vector Embeddings**: Automatic semantic indexing using OpenAI embeddings
- **TiDB Storage**: Scalable storage with vector search capabilities

### 2. **Intelligent Search & Analysis**
- **Natural Language Queries**: "Show me sales performance by region"
- **SQL Generation**: AI converts natural language to optimized SQL
- **Vector Search**: Semantic similarity search for unstructured data
- **Hybrid Queries**: Combine SQL + vector search for comprehensive analysis

### 3. **AI-Powered Insights**
- **Pattern Recognition**: Identify trends and anomalies automatically
- **Confidence Scoring**: Rate reliability of insights (0-100%)
- **Actionable Recommendations**: Specific steps based on data analysis
- **Visual Summaries**: Auto-generate charts and visualizations

### 4. **Automated Actions**
- **Slack Integration**: Real-time reports and alerts
- **Email Notifications**: Scheduled insights delivery
- **Dashboard Updates**: Dynamic visualization refresh
- **Custom Webhooks**: Integration with external tools

## 🎯 Business Impact

**Problem**: Business analysts spend 80% of their time on manual data preparation, leaving only 20% for actual analysis.

**Solution**: LucidBI's AI agent handles the entire pipeline automatically, allowing analysts to focus on strategic decisions and business impact.

## ⚡ Quick Setup

### Prerequisites

- Node.js 18.17 or later
- TiDB Serverless account (free tier available)
- OpenAI API key
- Slack workspace (optional, for action triggers)

### 🎬 5-Minute Installation

1. **Clone and Install**
   ```bash
   git clone https://github.com/hrudu-dev/lucid-bi.git
   cd lucid-bi
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   **Configure your environment:**
   ```env
   # TiDB Serverless (get from TiDB Cloud console)
   TIDB_HOST=gateway01.us-west-2.prod.aws.tidbcloud.com
   TIDB_PORT=4000
   TIDB_USER=your-username.root
   TIDB_PASSWORD=your-password
   TIDB_DATABASE=lucid_bi

   # OpenAI API (get from OpenAI platform)
   OPENAI_API_KEY=sk-your-openai-key
   
   # Slack (optional - for action triggers)
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   SLACK_CHANNEL_ID=C1234567890
   ```

3. **Start the Application**
   ```bash
   npm run dev
   ```

4. **Access the Dashboard** 
   - Open [http://localhost:3000](http://localhost:3000)
   - Database tables are created automatically
   - Use the **Demo Data Loader** to populate sample datasets
   - Try natural language queries like "Show me top performing products"

### 🎥 Demo Flow

1. **Load Demo Data**: Click "Load Data" for Sales, Customer Feedback, or Financial KPIs
2. **Natural Language Query**: Ask "What are the revenue trends by region?"
3. **AI Processing**: Watch as LucidBI converts to SQL and analyzes
4. **Instant Insights**: Get charts, metrics, and actionable recommendations
5. **Automated Actions**: Set up Slack alerts for key metrics

## 📊 **Technical Architecture**

### **TiDB Serverless Integration**
- **Vector Search**: Semantic similarity search using OpenAI embeddings stored as VECTOR(1536) columns
- **Hybrid Queries**: Combine SQL filtering with vector similarity for precise results
- **Auto-Scaling**: Serverless compute scales based on query complexity
- **Global Distribution**: Multi-region deployment for low latency

### **AI-First Design**
- **OpenAI GPT-4**: Natural language to SQL conversion + insight generation
- **Confidence Scoring**: AI rates its own recommendations (0-100%)
- **Context Awareness**: AI maintains context across multi-step workflows
- **Embedding Pipeline**: Automatic vectorization of unstructured data

### **Modern Frontend Stack**
- **Next.js 14**: React framework with App Router for optimal performance
- **TypeScript**: Type-safe development with full IntelliSense
- **Tailwind + shadcn/ui**: Beautiful, accessible component system
- **Recharts**: Interactive visualizations with real-time updates

### **Production Architecture**
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Frontend  │    │  Next.js API │    │    TiDB     │
│   React     │────│    Routes    │────│  Serverless │
│   TypeScript│    │   (Auth)     │    │   +Vector   │
└─────────────┘    └──────────────┘    └─────────────┘
       │                   │                   │
       │                   ├──────────────────┐│
       │                   │     OpenAI       ││
       │                   │   Embeddings     ││
       │                   └──────────────────┘│
       │                                       │
       └────────── Slack Integration ──────────┘
```

## 📋 API Endpoints

### Data Management
- `POST /api/data` - Ingest new data
- `GET /api/data` - Retrieve data with filters

### Query Engine  
- `POST /api/query` - Execute SQL queries
- `GET /api/query` - Get sample queries

### AI Insights
- `POST /api/insights` - Generate AI insights
- `GET /api/insights` - Retrieve insights

### Actions & Triggers
- `POST /api/actions` - Create new actions
- `GET /api/actions` - List all actions

### Demo Data
- `POST /api/demo-data` - Load sample datasets
- `GET /api/demo-data` - Available demo datasets

## 🗄️ Data Sources

LucidBI supports multiple data source types:

### Structured Data
- CSV files
- JSON data
- Database exports
- API responses

### Unstructured Data  
- Text documents
- PDFs
- Web content
- Social media posts

## 🗃️ Database Schema

### Core Tables

**business_data**
- Stores all ingested business data
- Supports both structured and unstructured content
- Metadata tracking for source attribution

**vector_data**
- Vector embeddings for semantic search
- Links to business_data for context
- Optimized for similarity queries

**insights**
- AI-generated insights and recommendations
- Confidence scoring
- Source data tracking

**actions**
- Automated actions and triggers
- Scheduling and execution tracking
- Error handling and retry logic

## 🛠️ Development

### Project Structure
```
lucid-bi/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   └── page.tsx      # Main dashboard
│   ├── components/       # React components
│   │   ├── dashboard/    # Dashboard components
│   │   └── ui/          # shadcn/ui components
│   ├── lib/             # Utility functions
│   │   ├── database.ts  # Database connection
│   │   └── ai.ts        # AI service integration
│   ├── services/        # External services
│   │   └── slack.ts     # Slack integration
│   └── types/           # TypeScript definitions
├── public/              # Static assets
└── ...
```

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](https://github.com/hrudu-dev/lucid-bi/wiki)
- 🐛 [Report Issues](https://github.com/hrudu-dev/lucid-bi/issues)
- 💬 [Discussions](https://github.com/hrudu-dev/lucid-bi/discussions)

## 🗺️ Roadmap

- [ ] Multi-tenant support
- [ ] Advanced visualization widgets
- [ ] Real-time data streaming
- [ ] Mobile app
- [ ] Plugin system
- [ ] Advanced ML models
- [ ] Data governance tools

---

Built with ❤️ for the open-source community