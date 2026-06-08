# CareerPilot AI

CareerPilot AI is a full-stack AI career platform for students, job seekers, freelancers, and content creators. It combines resume building, cover letter generation, freelancer profile tools, idea validation, and trending content advice in one dashboard.

## Core Modules

- Authentication with JWT login, register, protected dashboard routes, and persistent sessions.
- AI resume builder with live preview, saved resumes, PDF export, and premium templates.
- Cover letter and resume content generation with credit-based usage.
- Freelancer Toolkit for Upwork profiles, Fiverr gigs, proposals, and LinkedIn bios.
- Idea Radar for career, freelancing, online income, and creator growth ideas.
- Trending Advice for Reels, TikTok, Shorts, and social content planning.
- Billing and manual payment request flow with admin approval tools.

## Tech Stack

- React, Vite, Tailwind CSS
- React Router, Axios, React Hot Toast, Lucide React
- Node.js, Express, MongoDB, JWT
- OpenAI-ready backend with mock fallback behavior for local development

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

## Production Notes

The client and server are intentionally kept in separate repositories so the frontend can deploy cleanly to Vercel while the API can deploy independently.

Keep the existing `resumeforge_token` and `resumeforge_user` localStorage keys unless you also add a migration, because changing them directly will log out existing users.
