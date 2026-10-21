# Commands — Poora Project (A se Z)

Yeh document is project ke **saare commands** ek jagah rakhta hai — setup se lekar
tests, Git, GitHub push aur deploy tak. Sab commands **Windows PowerShell** ke liye
hain (jahan `bash`/macOS ka farq hai, wahan alag se likha hai).

> Project folder: `C:\Users\ACER\Downloads\website for practice`
> Repo: `https://github.com/axayranwa7502-lab/website-for-practice`
> Live site: `https://axayranwa7502-lab.github.io/website-for-practice/`
> Naya home page: `akr-infra/home.html` (purani site `index.html` alag hai)

---

## 0. Is document ko kaise use karein

1. Neeche diye gaye blocks ko **ek-ek karke** PowerShell me paste karo.
2. Har command ke saath `#` me seedha comment hai ki wo kya karta hai.
3. Pehli baar kaam karte waqt Section 1 → 2 → 3 follow karo.
4. Roz ke kaam ke liye Section 11 (Cheat sheet) kaafi hai.
5. Kuch galat ho to Section 12 (Troubleshooting) dekho.

---

## 1. Zaroori software aur version check

```powershell
# Git installed hai?
git --version

# Node.js installed hai?
node -v
npm -v

# Playwright package project me hai?
npx playwright --version

# GitHub CLI (optional, push/PR ke liye)
gh --version
```

Expected: Git 2.x, Node 20.x ya usse naya, Playwright 1.6x.

Agar `node` ya `git` "not recognized" bole, to pehle install karo:

```powershell
# winget se install (Windows 10/11)
winget install --id Git.Git -e
winget install --id OpenJS.NodeJS.LTS -e
winget install --id GitHub.cli -e

# install ke baad PowerShell band karke naya kholo, phir version check
```

Git identity (ek hi baar set karna hota hai):

```powershell
git config --global user.name "axayranwa7502-lab"
git config --global user.email "axayranwa7502@gmail.com"

# check
git config --global --list
```

---

## 2. Project kholna / setup

### 2a. Agar repo pehle se local hai (aapka case)

```powershell
cd "C:\Users\ACER\Downloads\website for practice"

# sahi folder me ho?
Get-Location
Get-ChildItem
```

### 2b. Agar kisi naye computer par clone karna ho

```powershell
cd "$HOME\Downloads"
git clone https://github.com/axayranwa7502-lab/website-for-practice.git
cd "website-for-practice"
```

### 2c. Dependencies install (tests ke liye zaroori)

```powershell
# package-lock.json ke exact versions (recommended)
npm ci

# ya normal install
npm install

# Playwright ka Chromium browser download
npx playwright install chromium
```

---

## 3. Naya home page (`akr-infra`) chalana

Teen tarike — koi ek chuno.

### 3a. Seedha browser me (sabse aasan)

```powershell
# file ko default browser me kholo
Start-Process "akr-infra\home.html"

# ya Explorer me folder kholo aur home.html par double-click
Start-Process "akr-infra"
```

### 3b. Local server se (URL waisa dikhega jaise hosting par)

```powershell
# Python wala simple server (Python installed hona chahiye)
python -m http.server 8000
# phir browser me: http://localhost:8000/akr-infra/home.html
```

```powershell
# Node wala option (Python na ho to)
npx http-server -p 8000
# phir browser me: http://localhost:8000/akr-infra/home.html
```

```powershell
# server band karna ho to usi terminal me
Ctrl + C
```

### 3c. Purani site bhi dekhni ho

```powershell
Start-Process "index.html"
# ya server se: http://localhost:8000/
```

---

## 4. Playwright tests

Project me 44 local tests hain (desktop Chromium 1280×800 + Pixel 7) aur 4 live checks
jo GitHub Pages par chalte hain.

```powershell
# saare local tests
npx playwright test

# npm script se (same cheez)
npm test

# sirf ek file
npx playwright test tests/home.spec.js

# sirf ek device
npx playwright test --project=desktop-chromium
npx playwright test --project=mobile-chromium

# naam se filter
npx playwright test -g "hero"

# browser dikhte hue (debug ke liye)
npx playwright test --headed

# step-by-step / inspector
npx playwright test --debug

# interactive UI mode
npx playwright test --ui
npm run test:ui

# HTML report kholna
npx playwright show-report
npm run report
```

### Live site checks (`RUN_LIVE`)

```powershell
# PowerShell — live checks bhi chalao (+4 tests = 48)
$env:RUN_LIVE = '1'
npx playwright test

# env variable hatao
Remove-Item Env:RUN_LIVE
```

```bash
# macOS / Linux / Git Bash
RUN_LIVE=1 npx playwright test
```

```powershell
# sirf live wali file
$env:RUN_LIVE = '1'
npx playwright test tests/live.spec.js
Remove-Item Env:RUN_LIVE
```

### Fail hone par evidence

```powershell
# screenshots, traces, videos yahan milte hain
Start-Process "test-results"
Start-Process "evidence"

# trace file browser me kholna
npx playwright show-trace "test-results\<test-name>\trace.zip"
```

### Playwright cache saaf karna (kabhi-kabhi atak jaye to)

```powershell
npx playwright install --force chromium
```

---

## 5. Git — roz ka workflow

```powershell
# kya badla, kis branch par ho
git status
git status -sb

# changes dekhna
git diff                 # unstaged
git diff --staged        # staged
git diff -- akr-infra    # sirf ek folder

# stage karna
git add akr-infra        # sirf naya home page
git add -A               # sab kuch
git add -p               # tukdon me (hunk by hunk)

# commit
git commit -m "feat: add AKR Infra home page with project gallery"

# history
git log --oneline --decorate -10
git log --oneline --graph --all -15
git log -p -- akr-infra/home.html

# kis ne kya badla (line by line)
git blame akr-infra/home.html
```

### Undo / safai

```powershell
# ek file ke changes wapas (galti se bigad gayi)
git restore index.html

# stage se wapas (file delete nahi hoti)
git restore --staged akr-infra/home.html

# last commit ka message theek karna (push se pehle)
git commit --amend --no-edit
git commit --amend -m "naya message"

# kaam temporary side me rakhna
git stash
git stash list
git stash pop
git stash drop
```

### Branch

```powershell
git branch                     # local branches
git branch -a                  # remote ke saath
git switch main                # main par jao
git switch -c feat/new-section # naya branch banao
git switch -                  # pichle branch par wapas
git branch -d feat/new-section # merge ke baad delete
git branch -D feat/new-section # force delete
```

### Remote se sync

```powershell
git remote -v
git fetch --prune                     # remote ki info update
git pull --ff-only                    # clean fast-forward pull
git pull --rebase                     # commit ke saath pull
git push                              # current branch push
git push -u origin main               # pehli baar branch set karna
```

> Note: abhi local branch `ci/live-checks` par ho. Latest kaam `main` me laane ke liye
> Section 7 dekho.

---

## 6. GitHub se jodna

Is repo me remote pehle se juda hua hai. Check karne ke liye:

```powershell
git remote -v
# origin  https://github.com/axayranwa7502-lab/website-for-practice.git (fetch)
# origin  https://github.com/axayranwa7502-lab/website-for-practice.git (push)
```

Remote na ho (ya galat ho) to:

```powershell
# naya remote jodo
git remote add origin https://github.com/axayranwa7502-lab/website-for-practice.git

# ya maujooda remote ka URL badlo
git remote set-url origin https://github.com/axayranwa7502-lab/website-for-practice.git

# remote hataana
git remote remove origin
```

### GitHub CLI se login (optional, par push aasan hota hai)

```powershell
gh auth login          # GitHub.com → HTTPS → browser se login
gh auth status         # login confirm
gh auth setup-git      # git ko gh ke credentials use karne do
```

### Naya repo banana ho (agar kabhi naya project ho)

```powershell
# current folder ko naya GitHub repo bana kar push
gh repo create my-new-repo --public --source=. --remote=origin --push

# repo browser me kholna
gh repo view --web
```

---

## 7. Push, branch aur Pull Request

### Simple push (feature branch)

```powershell
git status
git add akr-infra
git commit -m "feat: add AKR Infra home page"
git push -u origin HEAD        # branch ka naam automatic
```

### Kaam `main` me laana (PR ke through — recommended)

```powershell
# 1. apna branch push karo
git push -u origin ci/live-checks

# 2. PR banao (gh installed ho to)
gh pr create --fill --base main

# 3. PR browser me kholo
gh pr view --web

# 4. checks ka result dekho
gh pr checks

# 5. merge (review ke baad)
gh pr merge --squash --delete-branch
```

`gh` na ho to browser se: repo → **Compare & pull request** → **Create pull request** → **Merge**.

### Main ko local par update karna

```powershell
git switch main
git pull --ff-only
```

### PR ke bina direct merge (sirf apne repo me)

```powershell
git switch main
git pull --ff-only
git merge --no-ff ci/live-checks
git push
```

### Workflows (GitHub Actions) manually chalana

```powershell
gh workflow list
gh workflow run playwright.yml
gh workflow run live.yml

gh run list
gh run watch
gh run view --log
```

Browser se: repo → **Actions** → left me workflow → **Run workflow**.

---

## 8. GitHub Pages deploy

Site static hai — koi build step nahi. Pages `main` branch ke root se serve hota hai.

```powershell
# 1. main par jao aur latest lo
git switch main
git pull --ff-only

# 2. apne changes main me lao (PR ya merge se)
# 3. push
git push

# 4. 1-2 minute baad live site check karo
Invoke-WebRequest "https://axayranwa7502-lab.github.io/website-for-practice/" -UseBasicParsing |
  Select-Object StatusCode
```

Browser me Pages settings:

```powershell
gh api "repos/axayranwa7502-lab/website-for-practice/pages" | ConvertFrom-Json |
  Select-Object html_url, status, build_type
```

Ya seedha browser: **Settings → Pages**.

Naya page (`akr-infra`) live URL par aise khulega:

```
https://axayranwa7502-lab.github.io/website-for-practice/akr-infra/home.html
```

---

## 9. Firebase (contact form) — optional

Contact form Firestore me message bhejta hai. Rules deploy karne ke liye:

```powershell
# Firebase CLI install
npm install -g firebase-tools

# login + project check
firebase login
firebase projects:list

# project folder me init (pehli baar)
firebase init firestore

# sirf rules deploy
firebase deploy --only firestore:rules

# deploy ka status
firebase deploy --only firestore:rules --debug
```

Rules publish na hone par form me error aata hai:
`Missing or insufficient permissions` — tab upar wala deploy command chalao.

---

## 10. Safai (cleanup)

Root me naye home page ki purani copies padi hain — inhe delete karna hai
(final files `akr-infra\` ke andar hain):

```powershell
# pehle dekh lo ki files hain
Get-ChildItem home.html, home.css, home.js

# phir delete (Recycle Bin me jayengi nahi — dhyan se)
Remove-Item home.html, home.css, home.js
```

Test/build ke temporary folders (gitignored, safe to delete):

```powershell
Remove-Item -Recurse -Force test-results, playwright-report, blob-report -ErrorAction SilentlyContinue
```

---

## 11. Cheat sheet — roz ke 8 commands

```powershell
cd "C:\Users\ACER\Downloads\website for practice"   # 1. folder
Start-Process "akr-infra\home.html"                  # 2. page dekho
npx playwright test                                  # 3. tests
git status                                           # 4. kya badla
git add -A                                           # 5. stage
git commit -m "message"                              # 6. commit
git push                                             # 7. push
gh run list                                          # 8. CI dekho
```

---

## 12. Troubleshooting

| Problem | Command / Fix |
|---|---|
| `git` / `node` not recognized | PowerShell restart karo, ya `winget install` se install karo |
| `npx playwright` not found | `npm ci` phir `npx playwright install chromium` |
| Browser missing / launch error | `npx playwright install --force chromium` |
| Tests fail, "file not found" | `cd` sahi folder me hai? `Get-Location` se check karo |
| `$env:RUN_LIVE` kaam nahi kiya (cmd.exe) | `set RUN_LIVE=1` use karo, ya PowerShell kholo |
| Push par username/password maange | `gh auth login` + `gh auth setup-git` (PAT me `repo` scope) |
| `Updates were rejected` | `git pull --rebase` phir `git push` |
| `lf will be replaced by crlf` warning | Ignore kar sakte ho — Windows par normal |
| Port 8000 already in use | `python -m http.server 8001` (dusra port) |
| Pages par 404 | 1-2 min wait, phir Settings → Pages me branch `main` / root check karo |
| Form me `Missing or insufficient permissions` | `firebase deploy --only firestore:rules` |
| Accidental commit undo | `git reset --soft HEAD~1` (changes safe rahenge) |

---

## 13. Command index

| Kaam | Command |
|---|---|
| Folder change | `cd "C:\Users\ACER\Downloads\website for practice"` |
| Page kholna | `Start-Process "akr-infra\home.html"` |
| Local server | `python -m http.server 8000` |
| Dependencies | `npm ci` |
| Tests | `npx playwright test` |
| Live tests | `$env:RUN_LIVE='1'; npx playwright test` |
| Report | `npx playwright show-report` |
| Status | `git status` |
| Stage | `git add -A` |
| Commit | `git commit -m "message"` |
| Push | `git push` |
| Pull | `git pull --ff-only` |
| Branch | `git switch -c feat/x` |
| PR | `gh pr create --fill` |
| CI status | `gh run list` |
| Pages check | `gh api repos/axayranwa7502-lab/website-for-practice/pages` |
| Firebase rules | `firebase deploy --only firestore:rules` |

---

_Last updated: 20 Oct 2026_
