# website-for-practice

Meri pehli practice website, GitHub Pages par hosted.

## Live

https://axayranwa7502-lab.github.io/website-for-practice/

## Local me kaise chalaaye

Bas `index.html` ko browser me khol lo.

## Tech

- HTML
- CSS

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
