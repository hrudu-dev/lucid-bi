# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of LucidBI seriously. If you discover a security vulnerability, we appreciate your help in disclosing it to us in a responsible manner.

### How to Report

Please report security vulnerabilities by emailing **security@lucidbi.com** (or create an issue with the `security` label if no email is available).

**Please do not report security vulnerabilities through public GitHub issues.**

### What to Include

When reporting a vulnerability, please include:

- A clear description of the vulnerability
- Steps to reproduce the issue
- Potential impact of the vulnerability
- Any suggested fixes (if you have them)
- Your contact information for follow-up

### Response Timeline

- **Initial Response**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Investigation**: We will investigate and validate the reported vulnerability within 5-7 business days
- **Resolution**: We aim to resolve critical vulnerabilities within 30 days
- **Disclosure**: We will coordinate with you on the disclosure timeline

### Security Best Practices

When deploying LucidBI:

1. **Environment Variables**: Always use environment variables for sensitive configuration
2. **Database Security**: Ensure your TiDB instance has proper access controls
3. **API Keys**: Rotate OpenAI and other API keys regularly
4. **Authentication**: Implement proper authentication for production deployments
5. **HTTPS**: Always use HTTPS in production environments
6. **Input Validation**: Validate all user inputs and SQL queries
7. **Access Control**: Implement role-based access control for sensitive data

### Known Security Considerations

- **SQL Injection**: The application uses AI to generate SQL queries. Always validate and sanitize generated queries
- **Data Exposure**: Be cautious about what data is included in AI prompts to avoid leaking sensitive information
- **Rate Limiting**: Implement rate limiting for API endpoints to prevent abuse
- **Audit Logging**: Enable comprehensive logging for security monitoring

### Dependencies

We regularly update dependencies to address security vulnerabilities. Please ensure you're using the latest version and run:

```bash
npm audit
```

### Contact

For security-related questions or concerns, please contact:
- Email: security@lucidbi.com
- GitHub: Create an issue with the `security` label

Thank you for helping keep LucidBI and our users secure!