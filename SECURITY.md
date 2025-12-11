# Security Guidelines

## Production Deployment Checklist

### Environment Configuration
- [ ] Copy `.env.example` to `.env` and configure with production values
- [ ] Use HTTPS URLs for `REACT_APP_API_URL` in production
- [ ] Never commit `.env` files to version control
- [ ] Use environment-specific configuration for different deployment stages

### Build and Deploy
- [ ] Run `npm audit` before each deployment
- [ ] Address all high and critical severity vulnerabilities
- [ ] Run `npm run build` to create optimized production build
- [ ] Serve the production build from the `/build` directory

### Web Server Configuration
- [ ] Enable HTTPS/TLS (use Let's Encrypt or commercial certificates)
- [ ] Configure proper security headers:
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] Disable directory listing
- [ ] Configure proper CORS policies on your API server

### API Security
- [ ] Implement authentication and authorization
- [ ] Use secure session management
- [ ] Validate and sanitize all user inputs (implemented in utils/validation.js)
- [ ] Implement rate limiting on API endpoints
- [ ] Use HTTPS for all API communications
- [ ] Implement proper CORS configuration
- [ ] Never expose sensitive data in API responses

### Authentication Token Storage
**IMPORTANT**: The current implementation stores authentication tokens in `sessionStorage`, which is vulnerable to XSS attacks. For production deployment, implement one of these alternatives:

1. **httpOnly Cookies (Recommended)**: Store tokens in httpOnly, secure cookies set by the backend
   - Requires backend API changes to set cookies
   - Immune to XSS attacks
   - Must implement CSRF protection

2. **Memory-only Storage**: Store tokens only in React state
   - More secure against XSS
   - Requires re-authentication on page refresh
   - Better user experience with refresh tokens

3. **Secure Token Storage Library**: Use a library designed for secure token storage
   - Consider libraries like `secure-web-storage`
   - Evaluate security trade-offs carefully

### Monitoring and Logging
- [ ] Set up application monitoring
- [ ] Configure security event logging
- [ ] Monitor for suspicious activity
- [ ] Set up alerts for security events
- [ ] Regularly review access logs

### Dependencies
- [ ] Keep all dependencies up to date
- [ ] Run `npm audit` regularly
- [ ] Subscribe to security advisories for critical packages
- [ ] Use Dependabot or similar tools for automated dependency updates

### Known Limitations
The following vulnerabilities exist in development dependencies (react-scripts):
- These are only present during development and do not affect production builds
- Consider upgrading to a newer version of react-scripts or migrating to a different build tool (e.g., Vite) for long-term maintenance

## Reporting Security Issues

If you discover a security vulnerability, please report it by emailing the maintainers directly. Do not open public GitHub issues for security vulnerabilities.
