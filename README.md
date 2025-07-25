```md
# 🧬 NEET OS — AI-Powered Study Dashboard for NEET UG

**NEET OS** is a futuristic, AI-integrated web dashboard designed for students preparing for the **NEET UG** medical entrance exam.  
Built with advanced analytics, intelligent study planning, and a distraction-free UI — it transforms how aspirants track, plan, and improve their performance.

---

## 🚀 Features

### 🧠 AI Integration

- Smart Weekly Study Plan based on your recent performance
- Instant “What Should I Study Now?” suggestions from your activity
- Topic-based MCQ Generator (NEET-style questions)
- AI Tutor (in development) to explain concepts

### 📊 Performance Dashboard

- Streak heatmap calendar to build discipline
- XP Level System to gamify learning
- AI-generated insights on strong & weak subjects
- Visual test analytics & completion tracking

### 🧪 Test Modes

- Daily Challenge (new questions each day)
- Timed Tests with auto-submit
- Complete test history stored via Supabase

### 🎯 Clean & Minimal UI

- Modern black-and-white theme for focus
- Grid-based layout with precise alignment
- Fully mobile-responsive
- Crextio-inspired design structure

---

## 📷 Preview

> _(Insert screenshot or demo video here)_  
> Example: `![Preview](./public/preview.png)`

---

## ⚙️ Tech Stack

| Layer     | Tech Used                                |
| --------- | ---------------------------------------- |
| Frontend  | Next.js, React, TypeScript, Tailwind CSS |
| Backend   | Supabase (Postgres, Auth)                |
| AI Models | Groq (LLaMA3), OpenRouter-ready          |
| Hosting   | Vercel                                   |

---

## 📂 Folder Structure

neet-os/
├── app/ # App routes (Next.js)
│ └── dashboard/ # Main dashboard layout
│ └── api/ai/ # Custom AI endpoints
├── components/ # Reusable UI + logic
├── context/ # Supabase Auth context
├── lib/ # Supabase & AI utilities
├── public/ # Static assets (icons, images)
└── types/ # TypeScript types
```

---

## 🔧 Getting Started Locally

### 1. Clone the Repo

```bash
git clone https://github.com/ravisinghdev/neet-prep.git
cd neet-prep
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Add Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

### 4. Start the Dev Server

```bash
npm run dev
```

Then visit: [http://localhost:3000](http://localhost:3000)

---

## 🧠 AI API Routes

| Endpoint            | Description                          |
| ------------------- | ------------------------------------ |
| `/api/ai/plan`      | Generates weekly study plan          |
| `/api/ai/recommend` | Suggests what to study now           |
| `/api/ai/mcq`       | Generates 5 MCQs from a topic        |
| `/api/ai/tutor`     | AI concept explainer _(coming soon)_ |

All APIs are fully typed and powered by Groq's LLaMA3 models.

---

## 🗺 Roadmap

- [x] Dashboard with XP, heatmap, and badges
- [x] AI study plan, test analysis, and MCQs
- [ ] AI concept explainer (voice + image support)
- [ ] Leaderboard + PWA offline mode
- [ ] In-app mock test series and doubt portal

---

## 🧑‍💻 Contributing

1. Fork this repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push and open a PR

Contributions, feedback, and suggestions are welcome!

---

## 📄 License

MIT License — feel free to use, remix, and improve.
Built with 💙 by [Ravi Singh](https://github.com/ravisinghdev)

---

## 💡 Tip for NEET Aspirants

> “You don’t need to study harder — you need to study smarter.”
> NEET OS helps you do exactly that.
> Consistency + AI = Results.

```

---

✅ Paste this into a file named `README.md` at your project root.

Let me know if you'd like:
- A Hindi version
- GitHub badges (stars, forks, license)
- Demo GIF/preview generator

Happy shipping 🚀
```
# neet-os
