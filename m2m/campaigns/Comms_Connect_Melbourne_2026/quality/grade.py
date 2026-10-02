#!/usr/bin/env python3
"""Grade every visible section with a fresh, read-only editorial critic."""
import argparse
import json
import re
import subprocess
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PAGE = ROOT.parent / 'index.html'
PAGE_IDS = ('brief', 'overview', 'message', 'stand', 'scan', 'operate', 'contacts')
IDS = PAGE_IDS[:5]
DIMENSIONS = ('continuity', 'clarity', 'tightness_organisation', 'actionability', 'evidence_confidentiality')

class Sections(HTMLParser):
    def __init__(self):
        super().__init__()
        self.current = None
        self.depth = 0
        self.skip = 0
        self.content = {}
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ('script', 'style'):
            self.skip += 1
        if tag == 'section' and 'sec' in a.get('class', '').split():
            self.current = a.get('id')
            self.depth = 1
            self.content[self.current] = []
        elif self.current and tag == 'section':
            self.depth += 1
        if self.current and tag in ('h1','h2','h3','p','li','tr','aside','blockquote'):
            self.content[self.current].append('\n')
        if self.current and tag in ('td','th'):
            self.content[self.current].append(' | ')
    def handle_endtag(self, tag):
        if tag in ('script', 'style') and self.skip:
            self.skip -= 1
        if tag == 'section' and self.current:
            self.depth -= 1
            if self.depth == 0:
                self.current = None
    def handle_data(self, data):
        if self.current and not self.skip and data.strip():
            self.content[self.current].append(data.strip() + ' ')

def extract(page):
    parser = Sections()
    parser.feed(page)
    if tuple(parser.content) != PAGE_IDS:
        raise ValueError(f'Section order changed: {tuple(parser.content)}')
    return {key: re.sub(r' +', ' ', ''.join(parser.content[key])).strip() for key in IDS}

def hard_checks(page, sections):
    text = ' '.join(sections.values()).casefold()
    bad = ('nsw ambulance','nsw ses','sa water','qube forestry','dfes western australia',
           'victoria police','nsw fire rescue','queensland fire and emergency',
           'cfs south australia','santos','rfs nsw','830 units','seven emergency-service organisations')
    issues = [f'flagged customer/project text: {x}' for x in bad if x in text]
    for marker in ('noindex,nofollow', 'cc26-roster', '14–15 Oct', 'Stand 76', 'Press SUBMIT after every scan'):
        if marker not in page:
            issues.append(f'missing preserved marker: {marker}')
    if sections['brief'].count('For emergency services and other critical operators') != 1:
        issues.append('30-second opener must appear once in the brief')
    if 'For emergency services and other critical operators' in sections['message']:
        issues.append('30-second opener duplicated in message section')
    return issues

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--iteration', required=True, type=int)
    args = ap.parse_args()
    page = PAGE.read_text()
    sections = extract(page)
    issues = hard_checks(page, sections)
    receipt_dir = ROOT / 'receipts'
    receipt_dir.mkdir(exist_ok=True)
    receipt = receipt_dir / f'iteration-{args.iteration}.json'
    if issues:
        receipt.write_text(json.dumps({'pass':False,'hard_check_issues':issues},indent=2))
        print(receipt.read_text())
        raise SystemExit(2)
    rubric = (ROOT / 'RUBRIC.md').read_text()
    prompt = ("You are the independent editorial grader of a sales-leadership review draft. "
              "Use the supplied rubric exactly. Score every dimension for sections 00–04; section 05 roster and timetable are explicitly outside this pass. Do not grant 95 by default. "
              "Explain every score below 100 with a concrete short deduction tied to a phrase or location. "
              "Evaluate cross-section repetition and continuity using the whole page. "
              "Output only JSON matching the schema. Do not use tools or external sources.\n\n"
              + rubric + '\n\nVISIBLE SECTIONS:\n'
              + '\n\n'.join(f'=== {key.upper()} ===\n{value}' for key,value in sections.items()))
    model_out = receipt_dir / f'iteration-{args.iteration}-model.json'
    cmd = ['codex','exec','-C','/tmp','--skip-git-repo-check','--ephemeral','-s','read-only',
           '--output-schema',str(ROOT/'schema.json'),'--output-last-message',str(model_out),'-']
    run = subprocess.run(cmd,input=prompt,text=True,capture_output=True,timeout=300)
    if run.returncode:
        receipt.write_text(json.dumps({'pass':False,'grader_error':run.stderr[-3000:]},indent=2))
        print(receipt.read_text())
        raise SystemExit(3)
    result = json.loads(model_out.read_text())
    scores = {s['id']:s['scores'] for s in result['sections']}
    if set(scores) != set(IDS) or len(result['sections']) != len(IDS):
        raise ValueError('Missing or duplicate section scores')
    passed = all(all(scores[sid][dim] >= 95 for dim in DIMENSIONS) for sid in IDS)
    result['pass'] = passed
    result['hard_check_issues'] = []
    result['minimum_score'] = min(scores[sid][dim] for sid in IDS for dim in DIMENSIONS)
    result['section_word_counts'] = {sid:len(re.findall(r"\b[\w’'-]+\b",sections[sid])) for sid in IDS}
    receipt.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'pass':passed,'minimum_score':result['minimum_score'],'scores':scores,'receipt':str(receipt)},ensure_ascii=False))
    raise SystemExit(0 if passed else 1)

if __name__ == '__main__':
    main()
