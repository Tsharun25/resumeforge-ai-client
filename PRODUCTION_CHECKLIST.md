# CareerPilot AI Production Checklist

## Required before accepting payments

- Configure at least one funded or free-tier AI provider and run one successful request for every AI module.
- If Gemini free tier is used, review Google's data-use terms and keep the user disclosure current.
- Enable YouTube Data API v3 for the server key and verify search plus video statistics.
- Set the production `VITE_API_BASE_URL` and server `CLIENT_URL`.
- Configure only verified payment numbers and bank details in the client deployment environment.
- Confirm the admin account can approve and reject a payment request.
- Submit a real small payment and verify plan activation, credit allocation, renewal, and expiry.
- Review the Privacy, Terms, Refund, and Support pages with the final business contact details.

## Deployment verification

- Open `/api/health` and confirm HTTP 200, database ready, and required providers configured.
- Confirm HTTPS is active on both client and API domains.
- Test registration, login, expired token logout, and mobile navigation.
- Test the Free, Starter, and Pro limits with separate accounts.
- Verify failed AI requests refund CareerPilot credits.
- Verify duplicate payment transaction IDs are rejected.
- Confirm `.env` files and API keys are not tracked by Git.
- Run `npm run lint`, `npm run build`, `npm audit`, and server syntax checks.

## First-customer readiness

- Add a monitored support email or WhatsApp contact.
- Define an admin payment-review response target.
- Prepare three sample outputs: job application pack, freelancer proposal, and live trend report.
- Add privacy-safe product analytics for signup, first successful generation, credit exhaustion, and upgrade conversion.
- Back up MongoDB and document the restore procedure.
- Monitor API errors, latency, AI spend, and payment approval failures.
