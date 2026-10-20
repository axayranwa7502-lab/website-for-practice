# Contributing

Is repo me `main` branch directly protected hai — **har change PR (Pull Request) ke through hi jaayega**. `main` par direct push allowed nahi hai.

## PR Requirement (zaroori rules)

1. **Branch banao** `main` se, seedha `main` par commit mat karo.
   - Naming: `fix/...`, `feat/...`, `docs/...` (jaise `fix/hero-text`)
2. **Chhota, focused change** rakho — ek PR me ek hi kaam.
3. **PR open karo** `main` ke against, aur description me ye teen cheezein likho:
   - Kya change kiya (What)
   - Kyun kiya (Why / issue link)
   - Kaise test kiya (How)
4. **PR template fill karo** — `.github/pull_request_template.md` khud aa jaayega.
5. **Preview check karo** — PR branch ka live preview ya local `index.html` khol kar verify karo.
6. **Review ke baad hi merge** — merge ke waqt `Squash and merge` use karo.
7. **Merge ke baad branch delete karo**, aur GitHub Pages live URL par change verify karo.

## Local workflow

```bash
git checkout main
git pull origin main
git checkout -b fix/short-description

# changes karo, phir
git add .
git commit -m "fix: short description"
git push -u origin fix/short-description
```

Uske baad GitHub par PR open karo.

## Commit messages

- `feat: ...` naya feature
- `fix: ...` bug fix
- `docs: ...` documentation
- `style: ...` sirf CSS/formatting

## Note

`main` par force-push ya direct commit na karo. Agar galti se ho gaya, to revert PR banao.
