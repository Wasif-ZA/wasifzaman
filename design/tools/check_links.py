import sys
import urllib.error
import urllib.request
from html.parser import HTMLParser
from urllib.parse import urldefrag, urljoin, urlparse

# usage: python check_links.py http://localhost:3000
BASE = sys.argv[1].rstrip("/")
PAGES = ["/", "/studio"]
MUST_404 = ["/nope"]
# LinkedIn answers every automated request with 999, so it cannot be checked here.
UNCHECKABLE = ("linkedin.com",)


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.ids = [], set()

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("id"):
            self.ids.add(a["id"])
        if tag == "a":
            self.links.append(a.get("href"))


def fetch(url):
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (link check)"})
    try:
        with urllib.request.urlopen(request, timeout=60) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:
        return type(e).__name__, ""


problems, skipped, pages, targets = [], set(), {}, {}
for path in PAGES:
    status, html = fetch(BASE + path)
    if status != 200:
        problems.append(f"{status} on {path}")
    page = Page()
    page.feed(html)
    pages[path] = page

link_count = anchor_count = 0
for path, page in pages.items():
    for href in page.links:
        link_count += 1
        if not href or href.strip() in ("", "#"):
            problems.append(f"empty or '#' link on {path}")
            continue
        if href.startswith("mailto:"):
            continue
        url, fragment = urldefrag(urljoin(BASE + path, href))
        parsed = urlparse(url)
        if parsed.netloc == urlparse(BASE).netloc:
            target = parsed.path or "/"
            if fragment:
                anchor_count += 1
                if target not in pages or fragment not in pages[target].ids:
                    problems.append(f"#{fragment} missing on {target} (linked from {path})")
            if target in pages:
                continue
        if any(host in parsed.netloc for host in UNCHECKABLE):
            skipped.add(url)
            continue
        targets.setdefault(url, fetch(url)[0])

for url, status in sorted(targets.items()):
    if status != 200:
        problems.append(f"{status} from {url}")

for path in MUST_404:
    status, _ = fetch(BASE + path)
    if status != 404:
        problems.append(f"expected 404 for {path}, got {status}")

print(f"pages: {', '.join(PAGES)}")
print(f"links: {link_count}, anchors: {anchor_count}, distinct targets fetched: {len(targets)}")
for url in sorted(skipped):
    print(f"not checkable by script, open by hand: {url}")
if problems:
    print("PROBLEMS:")
    for problem in problems:
        print(f"  {problem}")
    sys.exit(1)
print("OK: every link and anchor resolves")
