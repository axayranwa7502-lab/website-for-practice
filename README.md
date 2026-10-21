# website-for-practice

[![Playwright Tests](https://github.com/axayranwa7502-lab/website-for-practice/actions/workflows/playwright.yml/badge.svg)](https://github.com/axayranwa7502-lab/website-for-practice/actions/workflows/playwright.yml)
[![Live site checks](https://github.com/axayranwa7502-lab/website-for-practice/actions/workflows/live.yml/badge.svg)](https://github.com/axayranwa7502-lab/website-for-practice/actions/workflows/live.yml)

Meri pehli practice website, GitHub Pages par hosted.

## Live

https://axayranwa7502-lab.github.io/website-for-practice/

## Local me kaise chalaaye

Bas `index.html` ko browser me khol lo.

## Tech

- HTML
- CSS
- Firebase (Firestore) — contact form messages

## Contact form → Firestore

Form submit hone par data `messages` collection me jata hai.

- `firebase-config.js` — Firebase project config (public values, koi secret nahi)
- `firestore.rules` — Firestore security rules (Console → Firestore → Rules me paste karo)
- Firebase SDK sirf submit ke waqt load hota hai, isliye page fast rehta hai

Data dekhne ke liye: Firebase Console → Firestore Database → `messages`.
Agar "Missing or insufficient permissions" aaye to rules publish karna baaki hai.

## Tests (Playwright)

Site ke liye end-to-end tests `tests/` folder me hain — desktop (Chromium 1280×800) aur mobile (Pixel 7) dono par chalte hain.

```powershell
npm install
npx playwright install chromium

npx playwright test                       # 44 local tests
$env:RUN_LIVE='1'; npx playwright test    # + 4 live GitHub Pages checks = 48
npx playwright show-report                # HTML report
```

Coverage: content/text, links & mailto, CSS theme, hover, anchor navigation, keyboard order, responsive layout (no horizontal scroll), aur accessibility basics (landmarks, heading order, link names, WCAG AA contrast).

Screenshots + run logs local `evidence/` folder me hain (gitignored — repo me push nahi hote).
