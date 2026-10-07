import json
import re
import subprocess
import sys
import time

# usage: python click_test.py http://localhost:3000
B = r"C:\Users\User\.claude\skills\gstack\browse\dist\browse.exe"
BASE = sys.argv[1].rstrip("/")

STATE = """JSON.stringify((() => {
  const id = decodeURIComponent(location.hash.slice(1));
  const target = id ? document.getElementById(id) : null;
  const h1 = document.querySelector('h1');
  return { path: location.pathname, hash: location.hash, h1: h1 ? h1.getAttribute('aria-label') || h1.innerText.replace(/\\s+/g, ' ').trim() : '', found: !!target, top: target ? Math.round(target.getBoundingClientRect().top) : null };
})())"""

LINKS = """JSON.stringify([...new Set([...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => (h.startsWith('/') || h.startsWith('#')) && !h.endsWith('.pdf')))])"""

failures = 0
total = 0


def browse(*args):
    return subprocess.run([B, *args], capture_output=True, text=True, timeout=120).stdout


def js(expression):
    match = re.search(r"(\{.*\}|\[.*\])", browse("js", expression), re.S)
    return json.loads(match.group(1)) if match else None


def open_page(path, settle=1.5):
    browse("goto", BASE + path)
    browse("wait", "--networkidle")
    time.sleep(settle)


def check(label, start, href, state):
    global failures, total
    total += 1
    path, _, fragment = href.partition("#")
    path = path or start
    problems = []
    if state is None:
        problems.append("could not read the page")
    else:
        if state["path"] != path:
            problems.append(f"ended on {state['path']}")
        if fragment:
            if not state["found"]:
                problems.append(f"#{fragment} not on the page")
            elif not -20 <= state["top"] <= 220:
                problems.append(f"#{fragment} sits {state['top']}px from the top of the screen")
        elif not state["h1"] or "not found" in state["h1"].lower():
            problems.append(f"heading is '{state['h1']}'")
    if problems:
        failures += 1
        print(f"FAIL {label}: {href} -> {', '.join(problems)}")
    else:
        detail = f"#{fragment} at {state['top']}px" if fragment else state["h1"][:50]
        print(f"PASS {label}: {href} -> {detail}")


def click(href):
    js(
        "JSON.stringify((() => { const a = [...document.querySelectorAll('a[href]')].find(el => el.getAttribute('href') === %s); if (a) a.click(); return { clicked: !!a }; })())"
        % json.dumps(href)
    )
    time.sleep(3)
    return js(STATE)


for width in ["1440x900", "390x844"]:
    browse("viewport", width)
    for start in ["/", "/studio"]:
        open_page(start)
        for href in js(LINKS) or []:
            open_page(start)
            check(f"{width} click on {start}", start, href, click(href))

browse("viewport", "1440x900")
for page, anchor in [("/studio", "packages")]:
    open_page(f"{page}#{anchor}", settle=3)
    check("fresh visit", page, f"{page}#{anchor}", js(STATE))

ICONS = "JSON.stringify([...document.querySelectorAll('nav[aria-label=Desktop] button')].map(b => b.lastElementChild.textContent.trim()))"
OPENED = """JSON.stringify((() => {
  const code = document.getElementById('code');
  const bar = code && code.querySelector('[role=status] span');
  return { visible: !!code && getComputedStyle(code).display !== 'none', file: bar ? bar.textContent : '' };
})())"""

for width in ["1440x900", "390x844"]:
    browse("viewport", width)
    open_page("/")
    for label in js(ICONS) or []:
        open_page("/")
        js(
            "JSON.stringify((() => { const b = [...document.querySelectorAll('nav[aria-label=Desktop] button')].find(x => x.lastElementChild.textContent.trim() === %s); b.click(); return {}; })())"
            % json.dumps(label)
        )
        time.sleep(1)
        state = js(OPENED) or {}
        want = "about/experience.md" if label == "Experience" else re.sub(r"[^a-z0-9]+", "-", label.lower()) + "/README.md"
        total += 1
        if state.get("visible") and state.get("file") == want:
            print(f"PASS {width} icon {label} -> {want}")
        else:
            failures += 1
            print(f"FAIL {width} icon {label} -> {state}, wanted {want}")

print(f"\n{total - failures} of {total} link checks passed")
sys.exit(1 if failures else 0)
