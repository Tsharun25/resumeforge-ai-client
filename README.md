# CareerPilot AI

CareerPilot AI is a Bangladesh-focused job application and career platform. Its core Job Application Studio turns verified candidate information and a target job description into a truthful ATS-friendly resume, evidence-gap report, cover letter, and recruiter message.

## Core Modules

- Authentication with JWT login, register, protected dashboard routes, and persistent sessions.
- Job-specific resume optimization with match score, keyword evidence, live preview, saved resumes, PDF export, and premium templates.
- Truthful cover letter and recruiter-message generation with credit-based usage.
- Freelancer Toolkit for Upwork profiles, Fiverr gigs, proposals, and LinkedIn bios.
- Idea Radar for career, freelancing, online income, and creator growth ideas.
- Live Trend Radar for Reels, TikTok, Shorts, and social content planning. It combines Google Trends Trending Now RSS, current web/news search, and optional YouTube video statistics; every report includes source links and observation times.
- Billing and manual payment request flow with admin approval tools.

## Tech Stack

- React, Vite, Tailwind CSS
- React Router, Axios, React Hot Toast, Lucide React
- Node.js, Express, MongoDB, JWT
- OpenAI Responses API with structured output for core job-application tools

## Local Development

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The client expects the backend API URL from `VITE_API_BASE_URL` or `VITE_API_URL`. If neither is provided, feature pages that define their own API base use `http://localhost:5000/api`.

The server supports OpenAI and Gemini. Use `AI_PROVIDER=openai`, `AI_PROVIDER=gemini`, or `AI_PROVIDER=auto`; then configure the matching API key and model. AI failures return an error and refund the reserved CareerPilot credit, and production users are never charged for mock fallback content. The included defaults are `gpt-5.6-terra` and `gemini-2.5-flash-lite`.

Gemini free-tier traffic is governed by Google's current terms and may be used to improve Google products. Keep this disclosure visible in the Privacy Policy, minimize personal data sent to the model, and review provider terms before accepting real customer data.

For direct YouTube metrics in Live Trend Radar, enable YouTube Data API v3 in Google Cloud and set `YOUTUBE_API_KEY` on the server. Without that optional key, the report still uses Google Trends and live web search, and the interface clearly marks direct YouTube metrics as unavailable.

## Production Notes

The client and server are intentionally kept in separate repositories so the frontend can deploy cleanly to Vercel while the API can deploy independently.

Before accepting customer payments, complete every required item in [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md).

Keep the existing `resumeforge_token` and `resumeforge_user` localStorage keys unless you also add a migration, because changing them directly will log out existing users.
