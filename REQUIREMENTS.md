# Requirements — website-for-practice

Site: https://axayranwa7502-lab.github.io/website-for-practice/

Yeh document batata hai ki site se **kya expect** kiya jata hai — abhi kya implemented hai (✅), kya partially hai (⚠️), aur aage kya plan hai (⬜).

- **Status legend:** ✅ Done · ⚠️ Partial · ⬜ Planned
- **Priority (MoSCoW):** Must · Should · Could · Won't (abhi ke scope me nahi)
- **Last updated:** 20 Oct 2026

---

## 1. Purpose & scope

Ek single-page personal practice website jo GitHub Pages par static host hoti hai, aur contact form ka data Firebase Firestore me save karti hai.

**In scope**

- Static single page: header/nav, hero, about, contact form, footer
- Contact form → Firestore (`messages` collection)
- Responsive layout (mobile + desktop)
- Accessibility basics (WCAG 2.1 AA)
- Playwright end-to-end tests + GitHub Actions CI/CD
- GitHub Pages par automatic deploy

**Out of scope (abhi)**

- Backend server / custom API
- User accounts, login, admin panel
- Payments, e-commerce
- CMS ya database se content render karna
- Multi-page routing

**Users**

| User | Kya chahiye |
| --- | --- |
| Visitor | Site ka content padhna, email/contact form se message bhejna |
| Site owner (Axay) | GitHub Pages par site live rakhna, messages Firestore Console me padhna, changes PR se merge karna |

---

## 2. Functional requirements

### FR-1 — Page shell & navigation

| ID | Requirement | Priority | Status |
| --- | --- | --- | --- |
| FR-1.1 | Page me valid HTML5 document ho: `<!DOCTYPE html>`, `lang="en"`, UTF-8 charset, responsive viewport meta | Must | ✅ |
| FR-1.2 | Ek header ho jisme site logo/home link aur nav links (About, Contact) hon | Must | ✅ |
| FR-1.3 | Nav links click par sahi section par jump ho (`#about`, `#contact`) | Must | ✅ |
| FR-1.4 | Har page ka ek unique `<title>` ho | Must | ✅ |
| FR-1.5 | Header scroll par sticky rahe aur anchor jump smooth scroll se ho | Could | ⬜ |

### FR-2 — Hero section

| ID | Requirement | Priority | Status |
| --- | --- | --- | --- |
| FR-2.1 | Hero me ek `h1`, short subtitle aur primary CTA button ho | Must | ✅ |
| FR-2.2 | CTA GitHub par naye tab me khule aur `rel="noopener"` ho (tabnabbing se bachne ke liye) | Must | ✅ |

### FR-3 — About section

| ID | Requirement | Priority | Status |
| --- | --- | --- | --- |
| FR-3.1 | `#about` section me owner ke baare me short text ho | Must | ✅ |
| FR-3.2 | Content `index.html` se hi edit ho sake — koi build step na ho | Must | ✅ |

### FR-4 — Contact details

| ID | Requirement | Priority | Status |
| --- | --- | --- | --- |
| FR-4.1 | `#contact` section me clickable `mailto:` email link ho | Must | ✅ |
| FR-4.2 | Email address plain text me bhi readable ho (copy karne ke liye) | Should | ✅ |

### FR-5 — Contact form fields & validation

| ID | Requirement | Priority | Status |
| --- | --- | --- | --- |
| FR-5.1 | Form me teen fields hon: Naam (text), Email (email), Message (textarea) — sabme visible `<label>` | Must | ✅ |
| FR-5.2 | Har field `required` ho aur `maxlength` limit ho (name 100, email 200, message 1000) | Must | ✅ |
| FR-5.3 | Browser-native validation messages use hon (form `novalidate` hai, JS se `reportValidity()` call hota hai) | Must | ✅ |
| FR-5.4 | Empty/invalid form submit ho to koi network call na jaye aur na hi success status dikhe | Must | ✅ |
| FR-5.5 | Form poora keyboard se bhar sake: Tab order = name → email → message → Send | Must | ✅ |
| FR-5.6 | Submit ke dauran Send button disable ho (double submit na ho) | Must | ✅ |
| FR-5.7 | Inline per-field error messages (native tooltip ke bajaye) | Could | ⬜ |

### FR-6 — Submission storage (Firestore)

| ID | Requirement | Priority | Status |
| --- | --- | --- | --- |
| FR-6.1 | Successful submit par `messages` collection me ek document create ho | Must | ✅ |
| FR-6.2 | Document fields: `name`, `email`, `message` (trimmed strings) + `createdAt` (server timestamp) | Must | ✅ |
| FR-6.3 | Collection name `window.firebaseCollection` se override ho sake, default `messages` | Could | ✅ |
| FR-6.4 | Success par form reset ho jaye | Must | ✅ |
| FR-6.5 | Duplicate submit se duplicate document na bane (idempotency guard) | Could | ⬜ |

### FR-7 — Status feedback

| ID | Requirement | Priority | Status |
| --- | --- | --- | --- |
| FR-7.1 | Ek live region (`role="status"`, `aria-live="polite"`) me status text dikhe | Must | ✅ |
| FR-7.2 | Teen states hon: pending ("Bhej rahe hain…"), success, error | Must | ✅ |
| FR-7.3 | Error message me failure reason (Firebase error code) include ho, taaki debug ho sake | Should | ✅ |
| FR-7.4 | Status ka color alone se matlab na bataye — text bhi ho (a11y) | Must | ✅ |

### FR-8 — SDK loading

| ID | Requirement | Priority | Status |
| --- | --- | --- | --- |
| FR-8.1 | Firebase SDK sirf submit ke waqt dynamically load ho, page load par nahi | Must | ✅ |
| FR-8.2 | SDK load fail ho (offline) to retry possible ho | Must | ✅ |
| FR-8.3 | Config missing ho to clear error mile ("Firebase config missing") | Must | ✅ |

### FR-9 — Footer

| ID | Requirement | Priority | Status |
| --- | --- | --- | --- |
| FR-9.1 | Footer me copyright line ho aur wo `contentinfo` landmark ho | Must | ✅ |

### FR-10 — Layout & responsiveness

| ID | Requirement | Priority | Status |
| --- | --- | --- | --- |
| FR-10.1 | 360px se 1280px+ tak koi horizontal scroll na aaye | Must | ✅ |
| FR-10.2 | Mobile (Pixel 7) aur desktop (1280×800) dono par content usable rahe | Must | ✅ |
| FR-10.3 | Touch targets ≥ 44×44px hon | Should | ⚠️ (fields/button ✅, nav links chhote hain) |
| FR-10.4 | `prefers-reduced-motion` respect ho | Should | ⬜ |

---

## 3. Non-functional requirements

| ID | Requirement | Metric / check | Priority | Status |
| --- | --- | --- | --- | --- |
| NFR-1 | Performance — static page, koi framework/build na ho; Firebase sirf on-demand load | Page first paint par Firebase requests = 0 | Must | ✅ |
| NFR-2 | Accessibility — WCAG 2.1 AA basics | Landmarks, heading order (h1→h2), link names, contrast ≥ 4.5:1 | Must | ✅ |
| NFR-3 | Browser support — latest Chrome, Edge, Firefox, Safari | Playwright Chromium run; manual check baaki browsers par | Should | ⚠️ |
| NFR-4 | Security — repo me sirf public Firebase config ho, koi secret/private key na ho | `firebase-config.js` me sirf public values | Must | ✅ |
| NFR-5 | Firestore rules — anonymous create allowed with field/type/size validation; read/update/delete browser se allowed nahi | `firestore.rules` published in Firebase Console | Must | ✅ |
| NFR-6 | Privacy — sirf naam, email, message collect ho; koi third-party analytics/tracker na ho | Network tab me koi extra tracker request nahi | Must | ✅ |
| NFR-7 | Maintainability — no build step; README + CONTRIBUTING me setup steps documented | Naye contributor 5 min me local run kar sake | Should | ✅ |
| NFR-8 | Hosting — GitHub Pages, HTTPS, `main` branch se auto-deploy | Live URL 200 return kare | Must | ✅ |
| NFR-9 | Reliability — har push/PR par tests chalein; live site daily check ho | CI green + daily smoke test | Must | ✅ |
| NFR-10 | Observability — failed CI run ka Playwright HTML report artifact mile (14 din) | Artifact upload step | Should | ✅ |
| NFR-11 | SEO — title + description meta tags | `<meta name="description">` present | Could | ⬜ |
| NFR-12 | Spam control — bot submissions block/limit hon | Firestore rules + App Check / honeypot | Should | ⬜ |

---

## 4. Data model

`messages/{autoId}`

| Field | Type | Rule |
| --- | --- | --- |
| `name` | string | 1–100 chars |
| `email` | string | ≤ 200 chars |
| `message` | string | 1–1000 chars |
| `createdAt` | timestamp | must equal `request.time` (client timestamp accept nahi) |

Allowed keys sirf yeh chaar. Client se read/update/delete blocked — messages sirf Firebase Console me dekhe jate hain.

---

## 5. CI/CD requirements

| ID | Requirement | Status |
| --- | --- | --- |
| CI-1 | Har push/PR par `main` ke liye Playwright suite chale (`playwright.yml`) | ✅ |
| CI-2 | Tests desktop Chromium 1280×800 + Pixel 7 dono projects par chalein | ✅ |
| CI-3 | Daily live-site smoke test chale (`live.yml`, 03:30 UTC) aur manually bhi trigger ho sake | ✅ |
| CI-4 | Failed run ka HTML report artifact ke roop me mile (14 din retention) | ✅ |
| CI-5 | Changes PR se merge hon, direct `main` push na ho | ✅ |

---

## 6. Acceptance criteria (key scenarios)

**AC-1 — Message successfully save hota hai**

```gherkin
Given main contact form par hoon
When main valid naam, email aur message bhar ke Send dabata hoon
Then button disable ho jata hai aur status "Bhej rahe hain…" dikhata hai
And Firestore ke messages collection me ek naya document banta hai
And form reset hota hai aur success status dikhta hai
```

**AC-2 — Empty form submit nahi hota**

```gherkin
Given form ke saare fields khaali hain
When main Send dabata hoon
Then koi Firestore write nahi hoti
And status region khaali rehta hai
```

**AC-3 — Network fail par user ko pata chale**

```gherkin
Given internet band hai
When main valid form submit karta hoon
Then error status dikhta hai with reason
And Send button dobara enable ho jata hai
And main dobara try kar sakta hoon
```

**AC-4 — Accessibility baseline**

```gherkin
Given page load hua hai
Then ek h1 aur do h2 sahi order me hain
And header, nav, main, footer landmarks present hain
And har link ka accessible name aur href hai
And muted text ka contrast ratio >= 4.5:1 hai
```

**AC-5 — Mobile par layout tootta nahi**

```gherkin
Given Pixel 7 viewport (412x915)
When page render hota hai
Then horizontal scroll nahi aata
And form viewport ke andar rehta hai
```

---

## 7. Future requirements (backlog)

| ID | Requirement | Priority | Notes |
| --- | --- | --- | --- |
| FR-F1 | Messages padhne ke liye simple admin view (Firebase Auth + protected route) | Should | Abhi Console se padhte hain |
| FR-F2 | Spam protection: honeypot field + Firebase App Check + rate limit | Should | Rules already size-validate karte hain |
| FR-F3 | Naya message aane par email notification (Cloud Function + email provider) | Could | Function deploy chahiye |
| FR-F4 | Language toggle (Hinglish ↔ English) | Could | `lang` attribute bhi toggle ho |
| FR-F5 | Dark mode (`prefers-color-scheme` + manual toggle) | Could | Contrast dono themes me test ho |
| FR-F6 | Projects/blog section with MD files | Could | Build step aa sakta hai — tab decision lena hoga |
| FR-F7 | Per-field inline validation messages (FR-5.7) | Could | Native tooltip se better UX |
| FR-F8 | Privacy-friendly analytics (page views only) | Could | NFR-6 se conflict na ho |
| FR-F9 | `prefers-reduced-motion` support (FR-10.4) | Should | Smooth scroll disable ho |
| FR-F10 | Firefox + WebKit Playwright projects | Should | NFR-3 cover karne ke liye |
| FR-F11 | SEO: meta description + Open Graph tags | Could | Link share preview ke liye |

---

## 8. Traceability — requirement ↔ test

| Requirement | Test file |
| --- | --- |
| FR-1, FR-2, FR-9 | `tests/home.spec.js` |
| FR-1.2, FR-1.3, FR-10.1 | `tests/navigation.spec.js` |
| FR-5, FR-7, FR-10.2 | `tests/contact-form.spec.js` |
| NFR-2, FR-2.2 | `tests/a11y.spec.js` |
| NFR-8, NFR-9 | `tests/live.spec.js` (`RUN_LIVE=1`) |

Test commands:

```powershell
npm install
npx playwright install chromium
npx playwright test                       # local suite
$env:RUN_LIVE='1'; npx playwright test    # + live GitHub Pages checks
```

---

## 9. Change log

| Date | Change |
| --- | --- |
| 20 Oct 2026 | Pehla version — current features, NFRs, CI/CD, backlog |
