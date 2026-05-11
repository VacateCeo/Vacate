# Vacate 🏀
**D2/D3 College Basketball Transfer Portal & Recruiting Hub**

A full-stack web application connecting Division II and Division III basketball players with college coaches. Players self-report their profiles to get discovered. Coaches browse verified listings for free.

🔗 **Live App:** vacate-iaj48ifme-vacateceos-projects.vercel.app

---

## The Problem

D1 recruiting platforms like 247Sports and On3 dominate the market but almost completely ignore D2 and D3 basketball. Thousands of players at this level have no centralized place to get exposure to coaches, and coaches have no easy way to find underserved talent.

## The Solution

Vacate is a self-reported player database specifically built for D2/D3 basketball. Players submit their own profiles for free. Coaches browse verified listings filtered by position and division. No paywalls. No gatekeeping.

---

## Features

- Player submission form with name, school, position, division, height, weight, wingspan, GPA, stats, and highlight film link
- Manual verification — every profile reviewed before going live
- Position and division filters for coaches
- Individual player profile pages with shareable URLs
- Email alert signups for coaches and scouts
- D2/D3 news feed pulled daily from NCAA.com
- GitHub Actions automation running scraper every morning at 8am ET

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Python |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |
| Automation | GitHub Actions |
| Data Source | NCAA API |

---

## Project Structure

```
Vacate/
├── .github/workflows/scraper.yml
├── database/db.py
├── frontend/src/
│   ├── App.jsx
│   ├── PlayerList.jsx
│   ├── PlayerProfile.jsx
│   ├── SubmitForm.jsx
│   └── SignupForm.jsx
└── scraper/scraper.py
```

---

## Local Setup

Clone the repo, create a virtual environment, install dependencies, add your Supabase credentials to a `.env` file, run `python scraper/scraper.py`, then `cd frontend` and `npm run dev`.

---

## What I Learned

- Designing and querying a relational database for a real use case
- Building a full data pipeline from scraping to storage to display
- Setting up CI/CD with GitHub Actions for automated daily tasks
- Deploying a full-stack app with environment variable management
- Identifying a real market gap and building a product around it

---

## Roadmap

- Admin dashboard for player approvals
- Women's basketball support
- Coach accounts with paid tier
- Custom domain

---

*Built by Brandon Nguyen — May 2026*
