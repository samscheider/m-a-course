# M&A Course — Sale and Purchase Agreement (SPA) and the Full Deal Lifecycle

A self-study, browser-based interactive course on Mergers and Acquisitions (M&A) for a non-lawyer building fluency to work alongside M&A lawyers.

**Jurisdictional focus:** United Kingdom (English law), United States (Delaware), European Union.

## Live site

Hosted on GitHub Pages — see the repository's Pages URL (configured in repository Settings → Pages).

## What's here

The repository contains a static-site interactive course in two sections:

### Core M&A practitioner course (Modules 00–18)

| # | Module |
|---|--------|
| 00 | Foundations for Non-Lawyers |
| 01 | Corporate Law Essentials |
| 02 | The M&A Landscape & Process |
| 03 | Pre-Signing Documents |
| 04 | Due Diligence |
| 05 | Valuation & Deal Economics |
| 06 | Deal Structures |
| 07 | The SPA: Structure, Recitals & Definitions |
| 08 | Conditions Precedent & Regulatory Clearances |
| 09 | Interim Period & MAC/MAE |
| 10 | Closing Mechanics |
| 11 | Purchase Price Mechanisms |
| 12 | Representations & Warranties |
| 13 | The Indemnification Regime |
| 14 | Warranty & Indemnity Insurance |
| 15 | Ancillary Transaction Documents |
| 16 | Governing Law & Dispute Resolution |
| 17 | Post-Closing Matters & Integration |
| 18 | Public M&A & Specialized Transactions |

### Boutique AI law firm — operator complement (Modules P1–P5)

| # | Module |
|---|--------|
| P1 | Drafting Decoder |
| P2 | Industry Deep-Dives — Financial Services & Tech |
| P3 | Negotiation Playbook |
| P4 | Origination & Business Development |
| P5 | AI Companion — What AI Changes Module-by-Module |

## Practice modes

- **Flashcards** with self-graded spaced-repetition
- **Multiple-choice quizzes** with carefully-built distractors
- **Clause-spotting / scenarios** with model answers

Progress (read-status, flashcard schedule, quiz scores, scenarios completed) is stored in the browser's localStorage.

## Local development

Open `course/index.html` in any browser — no build step required, no server required. Content is shipped as `.js` files setting `window.*` globals so the site works double-clicked from `file://`.

To rebuild data files from fragments (after editing per-module fragments):

```bash
bash build-data.sh
```

## Repository layout

```
course/
├── index.html              Landing page (two sections: core + practitioner)
├── modules/                19 core modules + 5 practitioner-complement modules
├── practice/               Flashcards, quiz, scenarios pages
├── reference/              Glossary
├── data/                   Auto-built master data files (glossary, flashcards, quiz, scenarios)
└── assets/                 CSS + shared JS
.github/workflows/pages.yml GitHub Pages deployment workflow (publishes course/ to Pages)
```

## Source material

The core 19 modules are seeded by *Session 7 — Introduction to SPA and legal documents in M&A transactions*, an ESCP Business School lecture authored by Accuracy and Ughi e Nunziante (Academic Year 2025–2026). The course extends well beyond the source deck; the 5 practitioner-complement modules are independent additions.

## Disclaimer

Educational material only. Not legal advice. Verify any specific legal conclusion with qualified counsel before acting.
