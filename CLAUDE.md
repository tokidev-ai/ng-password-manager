# Project Instructions

## Git workflow

- **Never run `git commit` until the user explicitly gives permission.** Implementing
  code and staging changes is fine; committing is not, until the user says so.
- **Never run `git push` until the user explicitly gives permission**, separate from
  commit permission.
- **After implementing each issue/ticket, stop and ask the user to validate it**
  (e.g., review the change, run/try the feature) before moving on to the next issue
  or committing.
- **If any staged or committed file appears to contain a secret/token** (API key,
  access token, private key, password, Firebase service-account credentials, `.env`
  contents, etc.), **do not push**. Stop and tell the user what was found and where,
  and let them decide how to proceed.

## References

- Plan: [docs/password-manager-plan.md](docs/password-manager-plan.md)
- Tickets: [docs/password-manager-tickets.md](docs/password-manager-tickets.md)
- GitHub issues: https://github.com/tokidev-ai/ng-password-manager/issues
