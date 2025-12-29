# Security Policy

## Supported Versions

We actively support the following versions of sca-extra with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security
vulnerability, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by:

1. **Email:** Send details to [security@starch.uk](mailto:security@starch.uk)
    - Include "SECURITY" in the subject line
    - Provide a clear description of the vulnerability
    - Include steps to reproduce (if applicable)
    - Suggest a fix (if you have one)

2. **GitHub Security Advisory:** Use GitHub's private vulnerability reporting
   feature
    - Go to the repository's Security tab
    - Click "Report a vulnerability"
    - Fill out the security advisory form

### What to Include

When reporting a security vulnerability, please include:

- **Description:** Clear description of the vulnerability
- **Impact:** Potential impact of the vulnerability
- **Steps to Reproduce:** Detailed steps to reproduce the issue
- **Affected Versions:** Which versions are affected
- **Suggested Fix:** If you have a suggested fix (optional but appreciated)
- **Proof of Concept:** If applicable, include a proof of concept (but be
  careful not to include exploit code)

### Response Time

- **Initial Response:** We aim to respond within 7 days
- **Status Update:** We will provide status updates within 28 days
- **Resolution:** We will work to resolve critical vulnerabilities as quickly as
  possible

## Disclosure Policy

### Timeline

1. **Report Received:** Acknowledgment within 7 days
2. **Investigation:** Initial assessment within 28 days
3. **Fix Development:** Fix developed and tested
4. **Disclosure:** Public disclosure after fix is available

### Disclosure Process

- Vulnerabilities will be disclosed after a fix is available
- We will credit the reporter (unless they prefer to remain anonymous)
- Security advisories will be published on GitHub
- Release notes will include security fixes

### Credit Policy

Security researchers who responsibly report vulnerabilities will be:

- Credited in security advisories (if desired)
- Listed in release notes (if desired)
- Acknowledged in project documentation (if desired)

## Security Best Practices

### For Contributors

- **Dependency Management:** Keep dependencies up to date
- **Code Review:** Review code for security issues
- **Input Validation:** Validate all inputs, especially file paths from user
  input
- **Script Security:** Scripts accepting file paths must use `sanitize-filename`
  package and validate paths to prevent path traversal attacks
- **File System Operations:** Use file descriptors (`fs.openSync`,
  `fs.writeFileSync` with file descriptor) instead of file paths to prevent
  time-of-check to time-of-use (TOCTOU) race conditions. Never use
  `fs.existsSync()` before opening files - open files directly and handle errors
  if they don't exist
- **Shell Command Execution:** Use `execFileSync` instead of `execSync` when
  passing dynamic paths or arguments to prevent shell command injection
  vulnerabilities
- **Error Handling:** Don't expose sensitive information in error messages
- **Secrets:** Never commit secrets, API keys, or credentials

### For Users

- **Keep Updated:** Use the latest version of sca-extra
- **Review Rules:** Review PMD rules before using in production
- **Validate Inputs:** Validate Apex code before analysis
- **Report Issues:** Report security issues responsibly

## Regular Security Audits

We do not conduct regular security audits.

## Security Updates

Security updates will be:

- Released as patch versions (e.g., 1.0.1)
- Documented in release notes
- Announced via GitHub releases
- Tagged with "security" label

## Contact

For security-related questions or concerns:

- **Email:** [security@starch.uk](mailto:security@starch.uk)
- **GitHub:** Use GitHub Security Advisory feature

Thank you for helping keep sca-extra secure!
