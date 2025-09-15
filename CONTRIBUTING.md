# Contributing to LucidBI

We welcome contributions from the community! LucidBI is built to solve real-world business intelligence challenges through AI-powered automation.

## 🚀 Quick Start for Contributors

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/lucid-bi.git`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and fill in your credentials
5. Start development server: `npm run dev`

### Project Structure
```
src/
├── app/                 # Next.js App Router
│   ├── api/            # Backend API routes  
│   └── page.tsx        # Frontend pages
├── components/         # React components
│   ├── dashboard/      # Main dashboard components
│   └── ui/            # Reusable UI components
├── lib/               # Utility functions
│   ├── database.ts    # TiDB integration
│   └── ai.ts          # OpenAI services
├── services/          # External integrations
└── types/             # TypeScript definitions
```

## 🎯 How to Contribute

### 🐛 Bug Reports
- Use GitHub Issues with the "bug" label
- Include steps to reproduce
- Provide environment details (Node.js version, OS, etc.)

### 💡 Feature Requests  
- Open an issue with the "enhancement" label
- Describe the use case and expected behavior
- Consider if it fits the core BI automation mission

### 🔧 Code Contributions

#### Areas We Need Help
1. **New Data Sources**: Connectors for databases, APIs, file formats
2. **Visualization Types**: Additional chart types and dashboard widgets  
3. **AI Enhancements**: Better prompt engineering, new AI models
4. **Integrations**: More external tools (Teams, Discord, webhooks)
5. **Performance**: Query optimization, caching, real-time updates

#### Development Guidelines
- **TypeScript**: Use strict typing throughout
- **Component Structure**: Follow the existing pattern in `/components`
- **API Design**: RESTful endpoints with proper error handling
- **Database**: Use the established patterns in `/lib/database.ts`
- **Testing**: Add tests for new features (we use Jest)

### 🏗️ Architecture Decisions

#### Why TiDB Serverless?
- **Vector Search**: Native support for embeddings and semantic search
- **Scalability**: Auto-scaling for variable workloads  
- **MySQL Compatibility**: Familiar SQL syntax with modern features
- **Global Distribution**: Low latency worldwide

#### Why Next.js + React?
- **Full-Stack**: API routes + frontend in one framework
- **Performance**: Server-side rendering + static generation
- **Developer Experience**: Hot reload, TypeScript support
- **Ecosystem**: Rich component libraries (shadcn/ui, Recharts)

#### Why OpenAI?
- **Reliability**: Proven performance for business applications
- **Embedding Quality**: Best-in-class text embeddings
- **JSON Mode**: Structured responses for consistent parsing
- **Function Calling**: Perfect for SQL generation workflows

## 📝 Code Style

### Frontend Components
```tsx
// Use proper TypeScript interfaces
interface ComponentProps {
  data: BusinessData[]
  onUpdate: (id: string) => void
}

// Destructure props clearly  
export function Component({ data, onUpdate }: ComponentProps) {
  // Use consistent naming
  const [isLoading, setIsLoading] = useState(false)
  
  return (
    <div className="space-y-4">
      {/* Use semantic HTML and Tailwind classes */}
    </div>
  )
}
```

### API Routes
```typescript
export async function POST(request: NextRequest) {
  try {
    const { field } = await request.json()
    
    // Validate input
    if (!field) {
      return NextResponse.json(
        { success: false, error: 'Field required' },
        { status: 400 }
      )
    }
    
    // Process with proper error handling
    const result = await processData(field)
    
    return NextResponse.json({
      success: true,
      data: result
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Processing failed' },
      { status: 500 }
    )
  }
}
```

### Database Queries
```typescript
// Use parameterized queries to prevent SQL injection
const query = `
  SELECT bd.*, vd.content
  FROM business_data bd
  LEFT JOIN vector_data vd ON bd.id = vd.business_data_id  
  WHERE bd.source = ? AND bd.created_at > ?
  ORDER BY bd.created_at DESC
  LIMIT ?
`

const results = await executeQuery(query, [source, dateFilter, limit])
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash  
npm run test:integration
```

### E2E Tests (Coming Soon)
```bash
npm run test:e2e
```

## 📦 Pull Request Process

1. **Branch Naming**: `feature/description` or `fix/description`
2. **Commits**: Use conventional commits (`feat:`, `fix:`, `docs:`)
3. **Testing**: Ensure all tests pass
4. **Documentation**: Update README if needed
5. **Review**: Wait for maintainer review before merging

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature  
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Integration tests pass

## Screenshots (if applicable)
Include before/after screenshots for UI changes
```

## 🌟 Recognition

Contributors who make significant improvements will be:
- Added to the README contributors section
- Mentioned in release notes
- Invited to join the core team (for ongoing contributors)

## 📞 Getting Help

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: GitHub Issues for bugs and feature requests  
- **Email**: For security issues, email directly to maintainers

---

Thank you for helping make LucidBI better for the entire business intelligence community! 🚀