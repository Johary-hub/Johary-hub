#!/usr/bin/env python3
"""
Génère un site HTML statique autoportant à partir des modules Markdown.

Usage :  python3 build_site.py
Sortie :  formation-lean-six-sigma/site/
            ├── index.html                (accueil = README)
            ├── ressources.html           (= ressources/INDEX.md)
            ├── 00-...html … 14-...html    (un fichier par module)
            └── formation-complete.html   (TOUT le parcours en un seul fichier)

Le CSS est intégré dans chaque page → chaque fichier s'ouvre seul (file://),
hors-ligne, et le site se publie tel quel sur GitHub Pages.
"""
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
MODULES_DIR = ROOT / "modules"
SITE_DIR = ROOT / "site"
README = ROOT / "README.md"
RESSOURCES = ROOT / "ressources" / "INDEX.md"

try:
    import markdown
except ImportError:
    raise SystemExit("Le module python 'markdown' est requis : pip install markdown")

MD_EXT = ["md_in_html", "tables", "fenced_code", "sane_lists", "attr_list"]

# ---------------------------------------------------------------- CSS ---------
CSS = r"""
:root{
  --ink:#1f2733; --muted:#5b6675; --line:#e6e8ec; --bg:#f5f6f8;
  --slate:#222b38; --gold:#f6b400; --gold-soft:#fff7e0;
  --obj:#2563eb; --prereq:#64748b; --content:#0ea5a4;
  --tools:#0d9488; --action:#16a34a; --key:#d97706; --quiz:#7c3aed; --src:#64748b;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);
  font-family:system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  line-height:1.65;font-size:16px}
a{color:var(--obj);text-decoration:none}
a:hover{text-decoration:underline}
.topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;
  justify-content:space-between;gap:12px;padding:10px 18px;background:var(--slate);
  color:#fff;border-bottom:3px solid var(--gold)}
.topbar a{color:#fff}
.brand{font-weight:700;font-size:18px}
.topnav a{display:inline-block;padding:6px 10px;border-radius:8px;font-size:14px}
.topnav a:hover{background:rgba(255,255,255,.12);text-decoration:none}
.layout{display:flex;gap:0;align-items:flex-start;max-width:1180px;margin:0 auto}
.sidebar{position:sticky;top:58px;flex:0 0 270px;height:calc(100vh - 58px);
  overflow-y:auto;padding:18px 14px;background:#fff;border-right:1px solid var(--line)}
.sidebar .side-home{display:block;font-weight:700;margin-bottom:8px}
.side-group{margin:14px 0 6px;font-size:12px;text-transform:uppercase;
  letter-spacing:.06em;color:var(--muted);font-weight:700}
.sidebar a.side-link{display:flex;align-items:center;gap:9px;padding:7px 9px;
  border-radius:9px;color:var(--ink);font-size:14px}
.sidebar a.side-link:hover{background:var(--bg);text-decoration:none}
.sidebar a.side-link.active{background:var(--gold-soft);font-weight:600}
.badge{flex:0 0 24px;width:24px;height:24px;border-radius:50%;background:var(--slate);
  color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;
  justify-content:center}
.side-link.active .badge{background:var(--gold);color:#1f2733}
.side-extra{display:block;margin-top:12px;padding:7px 9px;border-radius:9px;
  color:var(--ink);font-size:14px}
.side-extra:hover{background:var(--bg);text-decoration:none}
.content{flex:1 1 auto;min-width:0;padding:26px clamp(18px,4vw,46px) 80px;
  max-width:880px}
.content h1{font-size:30px;line-height:1.25;margin:.2em 0 .6em;
  padding-bottom:.3em;border-bottom:2px solid var(--gold)}
.content h3{font-size:19px;margin:1.3em 0 .4em}
.content h4{font-size:16px;margin:1.1em 0 .3em}
.card{background:#fff;border:1px solid var(--line);border-left:5px solid var(--line);
  border-radius:12px;padding:14px 20px;margin:16px 0;
  box-shadow:0 1px 2px rgba(16,24,40,.04)}
.card>h2{margin:.1em 0 .5em;font-size:21px;display:flex;gap:.4em;align-items:baseline}
.card.sec-obj{border-left-color:var(--obj)}
.card.sec-prereq{border-left-color:var(--prereq);background:#fbfbfc}
.card.sec-content{border-left-color:var(--content)}
.card.sec-tools{border-left-color:var(--tools)}
.card.sec-action{border-left-color:var(--action);background:#f2fbf5}
.card.sec-action>h2{color:#15803d}
.card.sec-key{border-left-color:var(--key);background:#fffaf0}
.card.sec-key>h2{color:#b45309}
.card.sec-quiz{border-left-color:var(--quiz);background:#faf7ff}
.card.sec-quiz>h2{color:#6d28d9}
.card.sec-src{border-left-color:var(--src);background:#fbfbfc;font-size:.95em}
blockquote{margin:14px 0;padding:10px 16px;background:var(--gold-soft);
  border-left:4px solid var(--gold);border-radius:0 8px 8px 0;color:#3a3320}
blockquote p{margin:.4em 0}
table{width:100%;border-collapse:collapse;margin:14px 0;font-size:14.5px;
  display:block;overflow-x:auto}
th,td{border:1px solid var(--line);padding:8px 11px;text-align:left;vertical-align:top}
thead th{background:var(--slate);color:#fff;font-weight:600}
tbody tr:nth-child(even){background:#fafbfc}
code{background:#eef1f4;padding:.12em .4em;border-radius:5px;font-size:.9em;
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
pre{background:#0f172a;color:#e2e8f0;padding:14px 16px;border-radius:10px;
  overflow-x:auto;line-height:1.45}
pre code{background:none;color:inherit;padding:0;font-size:13px;white-space:pre}
ul,ol{padding-left:1.4em}
li{margin:.25em 0}
hr{border:none;border-top:1px solid var(--line);margin:26px 0}
details{margin:12px 0;border:1px solid var(--line);border-radius:10px;overflow:hidden;
  background:#fff}
summary{cursor:pointer;padding:11px 15px;font-weight:600;background:#f3eefc;
  list-style:none;color:#6d28d9}
summary::-webkit-details-marker{display:none}
summary::before{content:"▸ ";font-weight:700}
details[open] summary::before{content:"▾ "}
details[open] summary{border-bottom:1px solid var(--line)}
details>*:not(summary){padding-left:15px;padding-right:15px}
details>ol,details>ul{padding-left:2.2em}
.pager{display:flex;justify-content:space-between;gap:12px;margin-top:34px;
  padding-top:18px;border-top:1px solid var(--line)}
.pager a{flex:1;padding:12px 16px;border:1px solid var(--line);border-radius:10px;
  background:#fff}
.pager a:hover{border-color:var(--gold);text-decoration:none}
.pager .nx{text-align:right}
.pager small{display:block;color:var(--muted);font-size:12px}
.hero{background:linear-gradient(135deg,#222b38,#384355);color:#fff;border-radius:16px;
  padding:30px 32px;margin:6px 0 22px;border:1px solid #2c3543}
.hero h1{border:none;color:#fff;margin:0 0 .3em}
.hero .tag{display:inline-block;background:var(--gold);color:#1f2733;font-weight:700;
  font-size:12px;padding:4px 10px;border-radius:999px;letter-spacing:.04em}
.hero p{color:#d7dbe2;margin:.5em 0 0;max-width:60ch}
/* single-file version */
.module-block{scroll-margin-top:64px;border-top:3px dashed var(--line);
  margin-top:40px;padding-top:8px}
.module-block:first-of-type{border-top:none}
.toc-back{font-size:13px;color:var(--muted)}
@media(max-width:900px){
  .layout{flex-direction:column}
  .sidebar{position:static;height:auto;flex-basis:auto;width:100%;
    border-right:none;border-bottom:1px solid var(--line)}
  .content{max-width:none}
}
@media print{
  .topbar,.sidebar,.pager,.topnav{display:none!important}
  .content{max-width:none;padding:0}
  .card{break-inside:avoid;box-shadow:none}
  details[open] *{display:revert}
  details{border:1px solid #ccc}
}
"""

PAGE = """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<style>{css}</style>
</head>
<body>
<header class="topbar">
  <a class="brand" href="index.html">🟡 LSS Yellow Belt</a>
  <div class="topnav">{topnav}</div>
</header>
<div class="layout">
  <aside class="sidebar">{sidebar}</aside>
  <main class="content">
{content}
  </main>
</div>
</body>
</html>
"""

# ----------------------------------------------------------- helpers ----------
def md_to_html(text):
    """Convertit du Markdown (avec <details> contenant du Markdown) en HTML."""
    text = text.replace("<details>", '<details markdown="1">')
    text = text.replace("<summary>", '<summary markdown="span">')
    html = markdown.markdown(text, extensions=MD_EXT)
    return html


def fix_links(html):
    """Réécrit les liens internes .md -> .html et ouvre les liens externes."""
    html = re.sub(r'href="(?:\.\./)?ressources/INDEX\.md"', 'href="ressources.html"', html)
    html = re.sub(r'href="(?:modules/)?(\d{2}-[a-z0-9\-]+)\.md"', r'href="\1.html"', html)
    # liens externes -> nouvel onglet
    html = re.sub(r'<a href="(https?://[^"]+)"',
                  r'<a target="_blank" rel="noopener" href="\1"', html)
    return html


SECTION_CLASS = [
    ("Objectifs", "sec-obj"), ("Prérequis", "sec-prereq"),
    ("Contenu", "sec-content"), ("Outils", "sec-tools"),
    ("Application directe", "sec-action"), ("À retenir", "sec-key"),
    ("retenir", "sec-key"), ("Quiz", "sec-quiz"), ("Sources", "sec-src"),
]


def classify(h2_html):
    for needle, cls in SECTION_CLASS:
        if needle.lower() in h2_html.lower():
            return cls
    return ""


def wrap_sections(html):
    """Enveloppe chaque <h2>…(jusqu'au prochain h2) dans une <section class=card …>."""
    parts = re.split(r'(<h2\b[^>]*>.*?</h2>)', html, flags=re.S)
    out = [parts[0]]
    i = 1
    while i < len(parts):
        h2 = parts[i]
        body = parts[i + 1] if i + 1 < len(parts) else ""
        cls = classify(h2)
        out.append(f'<section class="card {cls}">{h2}{body}</section>')
        i += 2
    return "".join(out)


def parse_title(md_text, fallback):
    m = re.search(r'^#\s+(.*)$', md_text, flags=re.M)
    return m.group(1).strip() if m else fallback


def short_label(title):
    """'Module 13 — Les Types de données' -> ('13', 'Les Types de données')."""
    m = re.match(r'\s*Module\s+(\d+)\s*[—\-–]\s*(.*)', title)
    if m:
        return m.group(1), m.group(2).strip()
    return "•", title


# ----------------------------------------------------------- build ------------
def main():
    SITE_DIR.mkdir(exist_ok=True)
    module_files = sorted(MODULES_DIR.glob("[0-9][0-9]-*.md"))
    modules = []
    for mf in module_files:
        md = mf.read_text(encoding="utf-8")
        title = parse_title(md, mf.stem)
        num, label = short_label(title)
        modules.append({
            "file": mf, "slug": mf.stem, "title": title,
            "num": num, "label": label, "md": md,
        })

    def sidebar_html(active_slug):
        rows = ['<nav><a class="side-home" href="index.html">🏠 Accueil du parcours</a>']
        groups = [("Démarrage", ["00"]),
                  ("Séquence 1 — Fondamentaux", [f"{i:02d}" for i in range(1, 9)]),
                  ("Séquence 3 — Résolution de problèmes", [f"{i:02d}" for i in range(9, 15)])]
        for gname, nums in groups:
            rows.append(f'<div class="side-group">{gname}</div>')
            for m in modules:
                if m["slug"][:2] in nums:
                    active = " active" if m["slug"] == active_slug else ""
                    rows.append(
                        f'<a class="side-link{active}" href="{m["slug"]}.html">'
                        f'<span class="badge">{m["num"]}</span>'
                        f'<span>{m["label"]}</span></a>')
        rows.append('<a class="side-extra" href="ressources.html">📂 Ressources &amp; modèles</a>')
        rows.append('<a class="side-extra" href="formation-complete.html">📖 Tout en un fichier</a>')
        rows.append("</nav>")
        return "".join(rows)

    # ---- pages de module
    for idx, m in enumerate(modules):
        body = wrap_sections(fix_links(md_to_html(m["md"])))
        prev_m = modules[idx - 1] if idx > 0 else None
        next_m = modules[idx + 1] if idx < len(modules) - 1 else None
        topnav = ""
        if prev_m:
            topnav += f'<a href="{prev_m["slug"]}.html">← Préc.</a>'
        if next_m:
            topnav += f'<a href="{next_m["slug"]}.html">Suiv. →</a>'
        pager = ['<nav class="pager">']
        pager.append(
            f'<a href="{prev_m["slug"]}.html"><small>← Module précédent</small>'
            f'{prev_m["num"]} · {prev_m["label"]}</a>' if prev_m else "<span></span>")
        pager.append(
            f'<a class="nx" href="{next_m["slug"]}.html"><small>Module suivant →</small>'
            f'{next_m["num"]} · {next_m["label"]}</a>' if next_m else "<span></span>")
        pager.append("</nav>")
        content = body + "\n" + "".join(pager)
        page = PAGE.format(title=m["title"] + " — LSS Yellow Belt", css=CSS,
                           topnav=topnav, sidebar=sidebar_html(m["slug"]),
                           content=content)
        (SITE_DIR / f'{m["slug"]}.html').write_text(page, encoding="utf-8")

    # ---- index (README)
    readme_html = wrap_sections(fix_links(md_to_html(README.read_text(encoding="utf-8"))))
    index_page = PAGE.format(
        title="Accueil — Formation Lean Six Sigma Yellow Belt", css=CSS,
        topnav='<a href="formation-complete.html">📖 Tout en un fichier</a>',
        sidebar=sidebar_html(None), content=readme_html)
    (SITE_DIR / "index.html").write_text(index_page, encoding="utf-8")

    # ---- ressources
    res_html = wrap_sections(fix_links(md_to_html(RESSOURCES.read_text(encoding="utf-8"))))
    res_page = PAGE.format(title="Ressources — LSS Yellow Belt", css=CSS,
                           topnav='<a href="index.html">🏠 Accueil</a>',
                           sidebar=sidebar_html(None), content=res_html)
    (SITE_DIR / "ressources.html").write_text(res_page, encoding="utf-8")

    # ---- fichier unique (tout le parcours)
    toc = ['<div class="hero"><span class="tag">PARCOURS COMPLET</span>'
           '<h1>Formation Lean Six Sigma — Yellow Belt</h1>'
           '<p>Tous les modules réunis dans une seule page, à suivre hors-ligne. '
           'Utilisez le sommaire ci-dessous pour naviguer.</p></div>',
           '<h2>Sommaire</h2><ol>']
    blocks = []
    for m in modules:
        anchor = "mod-" + m["slug"][:2]
        toc.append(f'<li><a href="#{anchor}">{m["num"]} · {m["label"]}</a></li>')
        body = wrap_sections(fix_links(md_to_html(m["md"])))
        blocks.append(
            f'<section id="{anchor}" class="module-block">'
            f'<p class="toc-back"><a href="#top">↑ Retour au sommaire</a></p>'
            f'{body}</section>')
    toc.append("</ol>")
    full_content = '<a id="top"></a>' + "".join(toc) + "".join(blocks)
    full_page = PAGE.format(
        title="Formation Lean Six Sigma Yellow Belt — parcours complet", css=CSS,
        topnav='<a href="index.html">🏠 Version site</a>',
        sidebar=sidebar_html(None), content=full_content)
    (SITE_DIR / "formation-complete.html").write_text(full_page, encoding="utf-8")

    print(f"OK — {len(modules)} modules + index + ressources + fichier unique")
    print(f"Sortie : {SITE_DIR}")


if __name__ == "__main__":
    main()
