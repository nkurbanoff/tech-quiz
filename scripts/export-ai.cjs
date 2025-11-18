#!/usr/bin/env node
/*
  Export compact AI-friendly files from monolithic *-questions.json
  Output: exports/ai/
    - <topic>-questions-only.jsonl : { id, question, options }
    - <topic>-answers.jsonl        : { id, correct }
    - <topic>-explanations.jsonl   : { id, explanation }
    - manifest.json                : list of topics and counts
*/
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const INPUT_DIR = path.join(ROOT, 'public', 'data');
const OUT_DIR = path.join(ROOT, 'exports', 'ai');

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function writeJsonl(p, arr) {
  const data = arr.map(o => JSON.stringify(o)).join('\n') + '\n';
  fs.writeFileSync(p, data, 'utf8');
}

function main() {
  ensureDir(OUT_DIR);
  const files = fs.readdirSync(INPUT_DIR).filter(f => /-questions\.json$/i.test(f));
  if (files.length === 0) {
    console.error('No *-questions.json found in', INPUT_DIR);
    process.exit(1);
  }
  const manifest = { generatedAt: new Date().toISOString(), topics: [] };

  for (const f of files) {
    const full = path.join(INPUT_DIR, f);
    const raw = fs.readFileSync(full, 'utf8');
    let parsed;
    try { parsed = JSON.parse(raw); } catch (e) {
      console.error('Parse error:', f, e.message); process.exit(1);
    }
    const topic = parsed.category || f.replace(/-questions\.json$/i, '');
    const questions = Array.isArray(parsed.questions) ? parsed.questions : [];

    const qOnly = questions.map(q => ({ id: q.id, question: q.question, options: q.options }));
    const ans = questions.map(q => ({ id: q.id, correct: q.correct }));
    const expl = questions.map(q => ({ id: q.id, explanation: q.explanation ?? '' }));

    const tp = path.join(OUT_DIR, `${topic}-questions-only.jsonl`);
    const ta = path.join(OUT_DIR, `${topic}-answers.jsonl`);
    const te = path.join(OUT_DIR, `${topic}-explanations.jsonl`);

    writeJsonl(tp, qOnly);
    writeJsonl(ta, ans);
    writeJsonl(te, expl);

    manifest.topics.push({ id: topic, total: questions.length, files: {
      questionsOnly: path.relative(OUT_DIR, tp).replace(/\\/g, '/'),
      answers: path.relative(OUT_DIR, ta).replace(/\\/g, '/'),
      explanations: path.relative(OUT_DIR, te).replace(/\\/g, '/')
    }});
  }

  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  console.log('AI export generated at', path.relative(ROOT, OUT_DIR));
}

main();
