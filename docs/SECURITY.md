# Security Policy

## Supported Versions

We provide security updates for the following versions of Unio:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Unio seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do NOT** open a public GitHub issue

Security vulnerabilities should be reported privately to protect users until a fix is available.

### 2. Email the security team

Please email security concerns to: **meet.sonawane2015@gmail.com**

Include the following information in your report:

- **Type of vulnerability** (e.g., XSS, SQL injection, authentication bypass)
- **Affected component** (backend, frontend, API, etc.)
- **Steps to reproduce** the vulnerability
- **Potential impact** of the vulnerability
- **Suggested fix** (if you have one)

### 3. What to expect

- **Acknowledgment**: You will receive an acknowledgment within 48 hours
- **Initial Assessment**: We will provide an initial assessment within 7 days
- **Updates**: We will keep you informed of our progress
- **Resolution**: Once resolved, we will notify you and credit you (if desired) in our security advisories

### 4. Disclosure Policy

- We will work with you to understand and resolve the issue quickly
- We will not disclose the vulnerability publicly until a fix is available
- Once a fix is released, we may publish a security advisory
- We will credit you for the discovery (unless you prefer to remain anonymous)

## Security Best Practices

When using Unio, please follow these security best practices:

1. **Keep your API keys secure**: Never commit API keys to version control
2. **Use environment variables**: Store sensitive configuration in environment variables
3. **Keep dependencies updated**: Regularly update your dependencies to receive security patches
4. **Use HTTPS**: Always use HTTPS in production environments
5. **Rotate keys regularly**: Periodically rotate your API keys and tokens
6. **Monitor usage**: Regularly review your usage logs for suspicious activity

## Known Security Considerations

- **API Key Storage**: API keys are encrypted at rest using AES-256 encryption
- **Authentication**: We use Supabase for secure authentication and session management
- **CORS**: Configure CORS appropriately for your deployment environment
- **Rate Limiting**: Consider implementing rate limiting for production deployments

## Security Updates

Security updates will be released as patches to the current stable version. We recommend:

- Subscribing to security advisories on GitHub
- Keeping your deployment updated with the latest patches
- Reviewing release notes for security-related changes

Thank you for helping keep Unio and its users safe!
