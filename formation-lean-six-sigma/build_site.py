#!/usr/bin/env python3
"""
Génère un site HTML statique, autoportant et INTERACTIF à partir des modules Markdown.

Usage :  python3 build_site.py
Sortie :  docs/  (racine du dépôt — dossier servi par GitHub Pages)
            ├── index.html / ressources.html
            ├── 00-...html … 14-...html
            └── formation-complete.html (tout le parcours en un seul fichier)

Apports :
- Schémas SVG « images d'ancrage » (roue PDCA, cycle DMAIC, maison du Lean, 5S,
  loi normale, SIPOC), injectés via le jeton [[SVG:nom|légende]].
- Quiz auto-corrigés (clic = correction immédiate + score), avec repli statique.
- Suivi de progression (bouton « terminé », barre de progression) via localStorage.
CSS et JS intégrés → chaque page s'ouvre seule (file://), hors-ligne.
"""
import re
import math
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
MODULES_DIR = ROOT / "modules"
SITE_DIR = ROOT.parent / "docs"   # racine du dépôt /docs (source GitHub Pages)
README = ROOT / "README.md"
RESSOURCES = ROOT / "ressources" / "INDEX.md"

try:
    import markdown
except ImportError:
    raise SystemExit("Le module python 'markdown' est requis : pip install markdown")

MD_EXT = ["md_in_html", "tables", "fenced_code", "sane_lists", "attr_list"]

# ============================================================ SVG ============
def _pol(cx, cy, r, deg):
    a = math.radians(deg)
    return cx + r * math.cos(a), cy + r * math.sin(a)


def _seg(cx, cy, ro, ri, a1, a2):
    x1, y1 = _pol(cx, cy, ro, a1)
    x2, y2 = _pol(cx, cy, ro, a2)
    x3, y3 = _pol(cx, cy, ri, a2)
    x4, y4 = _pol(cx, cy, ri, a1)
    large = 1 if (a2 - a1) % 360 > 180 else 0
    return (f"M{x1:.1f},{y1:.1f} A{ro},{ro} 0 {large} 1 {x2:.1f},{y2:.1f} "
            f"L{x3:.1f},{y3:.1f} A{ri},{ri} 0 {large} 0 {x4:.1f},{y4:.1f} Z")


def _wheel(steps, names, colors, title, sub, vb=360):
    """Roue segmentée générique (PDCA, 5S…)."""
    n = len(steps)
    cx = cy = vb / 2
    ro, ri = vb / 2 - 12, vb / 2 - 12 - 80
    start = -90
    span = 360 / n
    parts = [f'<svg viewBox="0 0 {vb} {vb}" role="img" class="svg-anim">']
    for i in range(n):
        a1 = start + i * span
        a2 = a1 + span - 2
        mid = (a1 + a2) / 2
        parts.append(f'<path d="{_seg(cx,cy,ro,ri,a1,a2)}" fill="{colors[i]}" '
                     f'class="seg"><title>{steps[i]} — {names[i]}</title></path>')
        lx, ly = _pol(cx, cy, (ro + ri) / 2 + 12, mid)
        parts.append(f'<text x="{lx:.0f}" y="{ly:.0f}" text-anchor="middle" '
                     f'fill="#fff" font-size="26" font-weight="800" dy="2">{steps[i]}</text>')
        wx, wy = _pol(cx, cy, (ro + ri) / 2 - 22, mid)
        parts.append(f'<text x="{wx:.0f}" y="{wy:.0f}" text-anchor="middle" '
                     f'fill="#fff" font-size="11.5" font-weight="600">{names[i]}</text>')
    parts.append(f'<circle cx="{cx}" cy="{cy}" r="{ri-6}" fill="#222b38"/>')
    parts.append(f'<text x="{cx}" y="{cy-6}" text-anchor="middle" fill="#f6b400" '
                 f'font-size="30" font-weight="800">{title}</text>')
    parts.append(f'<text x="{cx}" y="{cy+18}" text-anchor="middle" fill="#cbd2db" '
                 f'font-size="12">{sub}</text>')
    # flèche de cycle
    parts.append(f'<text x="{cx}" y="26" text-anchor="middle" fill="#222b38" '
                 f'font-size="20">↻</text>')
    parts.append('</svg>')
    return "".join(parts)


def _svg_pdca():
    return _wheel(
        ["P", "D", "C", "A"],
        ["Planifier", "Dérouler (Faire)", "Contrôler (Vérifier)", "Agir (Ajuster)"],
        ["#2563eb", "#16a34a", "#d97706", "#dc2626"],
        "PDCA", "amélioration continue")


def _svg_5s():
    return _wheel(
        ["1S", "2S", "3S", "4S", "5S"],
        ["Éliminer · Seiri", "Ranger · Seiton", "Nettoyer · Seiso",
         "Standardiser · Seiketsu", "Respecter · Shitsuke"],
        ["#dc2626", "#d97706", "#0d9488", "#2563eb", "#7c3aed"],
        "5S", "poste rangé & tenu", vb=380)


def _svg_dmaic():
    cols = [("D", "Define", "Définir", "100+", "#2563eb"),
            ("M", "Measure", "Mesurer", "25–30", "#0d9488"),
            ("A", "Analyze", "Analyser", "8–10", "#d97706"),
            ("I", "Improve", "Améliorer", "3–6", "#16a34a"),
            ("C", "Control", "Maîtriser", "1–3", "#7c3aed")]
    w, h, top, gap = 132, 86, 46, 12
    p = ['<svg viewBox="0 0 760 210" role="img" class="svg-anim">']
    p.append('<text x="380" y="24" text-anchor="middle" fill="#222b38" font-size="14" '
             'font-weight="700">De 100+ variables d\'entrée (X) vers 1 à 3 X clés — '
             'logique « entonnoir »</text>')
    for i, (L, en, fr, var, c) in enumerate(cols):
        x = 14 + i * (w + gap)
        pts = (f"{x},{top} {x+w-22},{top} {x+w},{top+h/2:.0f} {x+w-22},{top+h} "
               f"{x},{top+h} {x+22},{top+h/2:.0f}")
        p.append(f'<polygon points="{pts}" fill="{c}" class="seg"/>')
        p.append(f'<text x="{x+w/2:.0f}" y="{top+34}" text-anchor="middle" fill="#fff" '
                 f'font-size="30" font-weight="800">{L}</text>')
        p.append(f'<text x="{x+w/2:.0f}" y="{top+56}" text-anchor="middle" fill="#fff" '
                 f'font-size="12.5" font-weight="600">{en}</text>')
        p.append(f'<text x="{x+w/2:.0f}" y="{top+72}" text-anchor="middle" '
                 f'fill="#eaf0ff" font-size="10.5">{fr}</text>')
        p.append(f'<text x="{x+w/2:.0f}" y="{top+h+22}" text-anchor="middle" '
                 f'fill="#5b6675" font-size="11.5">X restants : <tspan font-weight="700" '
                 f'fill="#222b38">{var}</tspan></text>')
    p.append('<path d="M720,40 q24,-22 -12,-26 M708,14 l-8,-2 6,8" fill="none" '
             'stroke="#9aa3b0" stroke-width="2"/>')
    p.append('</svg>')
    return "".join(p)


def _svg_maison():
    p = ['<svg viewBox="0 0 440 350" role="img" class="svg-anim">']
    # toit = client
    p.append('<polygon points="40,118 220,28 400,118" fill="#f6b400" class="seg"/>')
    p.append('<text x="220" y="84" text-anchor="middle" fill="#3a3320" font-size="15" '
             'font-weight="800">CLIENT</text>')
    p.append('<text x="220" y="104" text-anchor="middle" fill="#3a3320" font-size="11.5">'
             'Satisfaction Qualité · Coût · Délai</text>')
    layers = [("Outils & Systèmes", "méthodes et techniques", "#0d9488", 122),
              ("7 Concepts", "savoir-être / attitude", "#2563eb", 170),
              ("3 Principes", "état d'esprit", "#334155", 218)]
    for title, sub, c, y in layers:
        p.append(f'<rect x="60" y="{y}" width="320" height="44" rx="4" fill="{c}" class="seg"/>')
        p.append(f'<text x="220" y="{y+20}" text-anchor="middle" fill="#fff" font-size="14" '
                 f'font-weight="700">{title}</text>')
        p.append(f'<text x="220" y="{y+36}" text-anchor="middle" fill="#e8edf4" '
                 f'font-size="10.5">{sub}</text>')
    # socle
    p.append('<rect x="40" y="270" width="360" height="50" rx="4" fill="#b91c1c" class="seg"/>')
    p.append('<text x="220" y="291" text-anchor="middle" fill="#fff" font-size="13" '
             'font-weight="800">Lutte contre le MUDA (gaspillage)</text>')
    p.append('<text x="220" y="309" text-anchor="middle" fill="#ffe2e2" font-size="11">'
             '… à partir du GEMBA (le terrain)</text>')
    p.append('</svg>')
    return "".join(p)


def _svg_sipoc():
    cols = [("S", "Suppliers", "Fournisseurs", "#2563eb"),
            ("I", "Inputs", "Entrées", "#0d9488"),
            ("P", "Process", "Processus", "#f6b400"),
            ("O", "Outputs", "Sorties", "#16a34a"),
            ("C", "Customers", "Clients", "#7c3aed")]
    w, gap, y, h = 126, 22, 46, 96
    p = ['<svg viewBox="0 0 760 180" role="img" class="svg-anim">']
    for i, (L, en, fr, c) in enumerate(cols):
        x = 12 + i * (w + gap)
        dark = (L == "P")
        tcol = "#3a3320" if dark else "#fff"
        p.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="9" fill="{c}" class="seg"/>')
        p.append(f'<text x="{x+w/2:.0f}" y="{y+40}" text-anchor="middle" fill="{tcol}" '
                 f'font-size="32" font-weight="800">{L}</text>')
        p.append(f'<text x="{x+w/2:.0f}" y="{y+62}" text-anchor="middle" fill="{tcol}" '
                 f'font-size="12.5" font-weight="600">{en}</text>')
        p.append(f'<text x="{x+w/2:.0f}" y="{y+80}" text-anchor="middle" fill="{tcol}" '
                 f'font-size="11" opacity="0.92">{fr}</text>')
        if i < len(cols) - 1:
            ax = x + w + gap / 2
            p.append(f'<text x="{ax:.0f}" y="{y+h/2+6:.0f}" text-anchor="middle" '
                     f'fill="#9aa3b0" font-size="22" font-weight="700">›</text>')
    p.append('</svg>')
    return "".join(p)


def _svg_normale():
    x0, x1, base, cx, sg, H = 60, 460, 210, 260, 55, 150
    pts = []
    for i in range(0, 121):
        x = x0 + (x1 - x0) * i / 120
        y = base - H * math.exp(-0.5 * ((x - cx) / sg) ** 2)
        pts.append(f"{x:.1f},{y:.1f}")
    curve = "M" + " L".join(pts)
    # zone ±1σ
    sh = [f"{cx-sg:.1f},{base:.1f}"]
    for i in range(0, 61):
        x = (cx - sg) + (2 * sg) * i / 60
        y = base - H * math.exp(-0.5 * ((x - cx) / sg) ** 2)
        sh.append(f"{x:.1f},{y:.1f}")
    sh.append(f"{cx+sg:.1f},{base:.1f}")
    shade = "M" + " L".join(sh) + " Z"
    p = ['<svg viewBox="0 0 520 250" role="img" class="svg-anim">']
    p.append(f'<path d="{shade}" fill="#f6b400" opacity="0.30"/>')
    p.append(f'<line x1="40" y1="{base}" x2="480" y2="{base}" stroke="#9aa3b0" stroke-width="1.5"/>')
    p.append(f'<path d="{curve}" fill="none" stroke="#2563eb" stroke-width="3"/>')
    for k, lab in [(-3, "−3σ"), (-2, "−2σ"), (-1, "−1σ"), (0, "μ"),
                   (1, "+1σ"), (2, "+2σ"), (3, "+3σ")]:
        x = cx + k * sg
        yc = base - H * math.exp(-0.5 * k * k)
        p.append(f'<line x1="{x:.0f}" y1="{base}" x2="{x:.0f}" y2="{yc:.0f}" '
                 f'stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,3"/>')
        p.append(f'<text x="{x:.0f}" y="{base+18}" text-anchor="middle" fill="#3a3320" '
                 f'font-size="11" font-weight="{"800" if k==0 else "500"}">{lab}</text>')
    p.append(f'<text x="{cx}" y="64" text-anchor="middle" fill="#1d4ed8" font-size="12" '
             f'font-weight="700">~68 % à ±1σ</text>')
    p.append(f'<text x="{cx}" y="{base-150}" text-anchor="middle" fill="#5b6675" '
             f'font-size="10.5" dy="-6">~95 % à ±2σ · ~99,7 % à ±3σ</text>')
    p.append('</svg>')
    return "".join(p)


def _svg_va_nva():
    x0, w, y, h = 40, 640, 70, 46
    blocks = [("nva", 150), ("va", 12), ("nva", 170), ("va", 10),
              ("nva", 150), ("va", 12), ("nva", 96)]
    total = sum(b[1] for b in blocks)
    p = ['<svg viewBox="0 0 720 218" role="img" class="svg-anim">']
    p.append('<text x="360" y="34" text-anchor="middle" fill="#222b38" font-size="14" '
             'font-weight="700">Délai d\'écoulement d\'un processus (Lead Time)</text>')
    x = x0
    for typ, bw in blocks:
        ww = bw * w / total
        col = "#16a34a" if typ == "va" else "#cbd5e1"
        p.append(f'<rect x="{x:.1f}" y="{y}" width="{ww:.1f}" height="{h}" fill="{col}" '
                 f'stroke="#fff" stroke-width="1" class="seg"/>')
        x += ww
    p.append(f'<rect x="{x0}" y="{y}" width="{w}" height="{h}" fill="none" stroke="#94a3b8"/>')
    p.append(f'<rect x="{x0}" y="135" width="15" height="15" fill="#16a34a"/>')
    p.append(f'<text x="{x0+21}" y="147" fill="#1f2733" font-size="12.5">'
             f'<tspan font-weight="700">VA</tspan> — crée de la valeur pour le client</text>')
    p.append(f'<rect x="{x0}" y="157" width="15" height="15" fill="#cbd5e1"/>')
    p.append(f'<text x="{x0+21}" y="169" fill="#1f2733" font-size="12.5">'
             f'<tspan font-weight="700">NVA</tspan> — gaspillage à éliminer (souvent &gt; 95 % du délai)</text>')
    p.append('<text x="360" y="200" text-anchor="middle" fill="#b45309" font-size="12.5" '
             'font-weight="600">Efficacité du cycle = temps VA ÷ délai total → le Lean comprime le NVA</text>')
    p.append('</svg>')
    return "".join(p)


def _svg_7muda():
    items = [("1", "Surproduction", "#dc2626"), ("2", "Stocks", "#d97706"),
             ("3", "Transport", "#0d9488"), ("4", "Attente", "#2563eb"),
             ("5", "Mouvements", "#7c3aed"), ("6", "Sur-processus", "#0ea5a4"),
             ("7", "Défauts", "#db2777")]
    cx, cy, R, n = 360, 205, 168, 7
    p = ['<svg viewBox="0 0 720 430" role="img" class="svg-anim">']
    for i in range(n):
        x, y = _pol(cx, cy, R, -90 + i * 360 / n)
        p.append(f'<line x1="{cx}" y1="{cy}" x2="{x:.0f}" y2="{y:.0f}" stroke="#dfe3e8" stroke-width="2"/>')
    for i, (num, lab, col) in enumerate(items):
        x, y = _pol(cx, cy, R, -90 + i * 360 / n)
        p.append(f'<rect x="{x-78:.0f}" y="{y-23:.0f}" width="156" height="46" rx="9" fill="{col}" class="seg"/>')
        p.append(f'<text x="{x:.0f}" y="{y+5:.0f}" text-anchor="middle" fill="#fff" '
                 f'font-size="13" font-weight="700">{num}. {lab}</text>')
    p.append(f'<circle cx="{cx}" cy="{cy}" r="66" fill="#222b38"/>')
    p.append(f'<text x="{cx}" y="{cy-3}" text-anchor="middle" fill="#f6b400" font-size="22" font-weight="800">7 MUDA</text>')
    p.append(f'<text x="{cx}" y="{cy+18}" text-anchor="middle" fill="#cbd2db" font-size="11">les gaspillages</text>')
    p.append('</svg>')
    return "".join(p)


def _svg_ishikawa():
    sy = 190
    p = ['<svg viewBox="0 0 720 360" role="img" class="svg-anim">']
    p.append(f'<line x1="60" y1="{sy}" x2="545" y2="{sy}" stroke="#334155" stroke-width="3"/>')
    p.append(f'<polygon points="545,{sy-9} 566,{sy} 545,{sy+9}" fill="#334155"/>')
    p.append('<rect x="567" y="158" width="146" height="64" rx="8" fill="#222b38" class="seg"/>')
    p.append('<text x="640" y="184" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">EFFET</text>')
    p.append('<text x="640" y="203" text-anchor="middle" fill="#cbd2db" font-size="11">(le problème)</text>')
    top = [("Main-d'œuvre", "#2563eb", 180), ("Méthode", "#0d9488", 315), ("Milieu", "#7c3aed", 450)]
    bot = [("Moyen (Machine)", "#d97706", 250), ("Matière", "#16a34a", 385)]
    for lab, col, sx in top:
        lcx, lcy = sx - 70, 58
        p.append(f'<line x1="{lcx+42}" y1="{lcy+16}" x2="{sx}" y2="{sy}" stroke="{col}" stroke-width="2.5"/>')
        p.append(f'<rect x="{lcx-66}" y="{lcy-16}" width="132" height="32" rx="6" fill="{col}" class="seg"/>')
        p.append(f'<text x="{lcx}" y="{lcy+5}" text-anchor="middle" fill="#fff" font-size="11.5" font-weight="700">{lab}</text>')
    for lab, col, sx in bot:
        lcx, lcy = sx - 70, 312
        p.append(f'<line x1="{lcx+42}" y1="{lcy-16}" x2="{sx}" y2="{sy}" stroke="{col}" stroke-width="2.5"/>')
        p.append(f'<rect x="{lcx-66}" y="{lcy-16}" width="132" height="32" rx="6" fill="{col}" class="seg"/>')
        p.append(f'<text x="{lcx}" y="{lcy+5}" text-anchor="middle" fill="#fff" font-size="11.5" font-weight="700">{lab}</text>')
    p.append('<text x="115" y="34" fill="#5b6675" font-size="12">Les 5 familles de causes (5M) →</text>')
    p.append('</svg>')
    return "".join(p)


def _svg_cts():
    def box(x, y, w, h, col, l1, l2, tc="#fff", sc="#eef2f7"):
        return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="9" fill="{col}" class="seg"/>'
                f'<text x="{x+w/2:.0f}" y="{y+25}" text-anchor="middle" fill="{tc}" font-size="12.5" font-weight="700">{l1}</text>'
                f'<text x="{x+w/2:.0f}" y="{y+43}" text-anchor="middle" fill="{sc}" font-size="11.5">{l2}</text>')

    def link(x1, y1, x2, y2):
        return (f'<path d="M{x1},{y1} C{(x1+x2)//2},{y1} {(x1+x2)//2},{y2} {x2},{y2}" '
                f'fill="none" stroke="#b6bdc7" stroke-width="2"/>')
    p = ['<svg viewBox="0 0 720 320" role="img" class="svg-anim">']
    for t, x in [("BESOIN (générique)", 110), ("DRIVER / CRITÈRE QUALITÉ", 360), ("CTS (mesurable + seuils)", 610)]:
        p.append(f'<text x="{x}" y="26" text-anchor="middle" fill="#5b6675" font-size="11" font-weight="700">{t}</text>')
    p.append(link(192, 159, 270, 99))
    p.append(link(192, 159, 270, 229))
    p.append(link(450, 99, 520, 99))
    p.append(link(450, 229, 520, 229))
    p.append(box(28, 128, 164, 62, "#f6b400", "Besoin client (VoC)", "« être livré vite »", "#3a3320", "#6b5a1e"))
    p.append(box(270, 70, 180, 58, "#2563eb", "Délai de livraison", "critère qualité"))
    p.append(box(270, 200, 180, 58, "#2563eb", "Fiabilité produit", "critère qualité"))
    p.append(box(520, 70, 180, 58, "#16a34a", "≤ 48 h (98 % cmd)", "CTS mesurable"))
    p.append(box(520, 200, 180, 58, "#16a34a", "&lt; 1 % de défauts", "CTS mesurable"))
    p.append('</svg>')
    return "".join(p)


def _svg_triangle():
    A, B, C = (280, 56), (78, 314), (482, 314)
    p = ['<svg viewBox="0 0 560 372" role="img" class="svg-anim">']
    p.append(f'<polygon points="{A[0]},{A[1]} {B[0]},{B[1]} {C[0]},{C[1]}" '
             f'fill="#fff7e0" stroke="#f6b400" stroke-width="4"/>')
    p.append('<text x="280" y="222" text-anchor="middle" fill="#b45309" font-size="13" font-weight="700">L\'écart au standard</text>')
    p.append('<text x="280" y="242" text-anchor="middle" fill="#b45309" font-size="13" font-weight="700">saute aux yeux → action</text>')

    def vbox(cx, cy, col, l1, l2):
        return (f'<rect x="{cx-105}" y="{cy-26}" width="210" height="52" rx="9" fill="{col}" class="seg"/>'
                f'<text x="{cx}" y="{cy-4}" text-anchor="middle" fill="#fff" font-size="12.5" font-weight="700">{l1}</text>'
                f'<text x="{cx}" y="{cy+14}" text-anchor="middle" fill="#eef2f7" font-size="11">{l2}</text>')
    p.append(vbox(280, 40, "#0d9488", "Standard opératoire", "la bonne façon de faire"))
    p.append(vbox(120, 344, "#2563eb", "Standard de management", "la bonne façon de piloter"))
    p.append(vbox(440, 344, "#7c3aed", "Management visuel", "rend l'écart visible"))
    for x, y in (A, B, C):
        p.append(f'<circle cx="{x}" cy="{y}" r="6" fill="#222b38"/>')
    p.append('</svg>')
    return "".join(p)


def _svg_types_donnees():
    def box(cx, y, w, h, col, l1, l2, tc="#fff", sc="#eef2f7"):
        s = (f'<rect x="{cx-w/2:.0f}" y="{y}" width="{w}" height="{h}" rx="9" fill="{col}" class="seg"/>'
             f'<text x="{cx}" y="{y+24}" text-anchor="middle" fill="{tc}" font-size="13" font-weight="700">{l1}</text>')
        if l2:
            s += f'<text x="{cx}" y="{y+42}" text-anchor="middle" fill="{sc}" font-size="11">{l2}</text>'
        return s

    def link(x1, y1, x2, y2):
        return (f'<path d="M{x1},{y1} C{x1},{(y1+y2)//2} {x2},{(y1+y2)//2} {x2},{y2}" '
                f'fill="none" stroke="#b6bdc7" stroke-width="2"/>')
    p = ['<svg viewBox="0 0 720 330" role="img" class="svg-anim">']
    p.append(link(360, 60, 170, 118))
    p.append(link(360, 60, 540, 118))
    p.append(link(540, 176, 430, 228))
    p.append(link(540, 176, 632, 228))
    p.append(box(360, 18, 220, 42, "#222b38", "TYPE DE DONNÉE", ""))
    p.append(box(170, 118, 212, 58, "#2563eb", "Par ATTRIBUT", "catégories · pas d'ordre"))
    p.append(box(540, 118, 212, 58, "#0d9488", "VARIABLE", "axe numérique · mesurable"))
    p.append('<text x="540" y="206" text-anchor="middle" fill="#5b6675" font-size="10.5">2 découpages indépendants → 2 étiquettes</text>')
    p.append(box(430, 228, 176, 58, "#16a34a", "Intervalle ↔ Ratio", "selon le sens du zéro"))
    p.append(box(632, 228, 156, 58, "#7c3aed", "Continue ↔ Discrète", "selon les valeurs"))
    p.append('</svg>')
    return "".join(p)


def _svg_paradigme():
    nodes = [("Paradigme", "croyance · règle · habitude", 300, 66, "#7c3aed"),
             ("Perception", "ce que je vois (ou pas)", 474, 188, "#2563eb"),
             ("Comportement", "ce que je fais", 300, 310, "#0d9488"),
             ("Résultats", "ce que j'obtiens", 126, 188, "#d97706")]
    p = ['<svg viewBox="0 0 600 392" role="img" class="svg-anim">']
    for i in range(4):
        ax, ay = nodes[i][2], nodes[i][3]
        bx, by = nodes[(i + 1) % 4][2], nodes[(i + 1) % 4][3]
        ang = math.atan2(by - ay, bx - ax)
        sx, sy = ax + math.cos(ang) * 88, ay + math.sin(ang) * 34
        ex, ey = bx - math.cos(ang) * 88, by - math.sin(ang) * 34
        adeg = math.degrees(math.atan2(ey - sy, ex - sx))
        p.append(f'<line x1="{sx:.0f}" y1="{sy:.0f}" x2="{ex:.0f}" y2="{ey:.0f}" stroke="#9aa3b0" stroke-width="2.5"/>')
        p.append(f'<polygon points="0,-5 11,0 0,5" fill="#9aa3b0" transform="translate({ex:.0f},{ey:.0f}) rotate({adeg:.0f})"/>')
    for l1, l2, x, y, col in nodes:
        p.append(f'<rect x="{x-90:.0f}" y="{y-26:.0f}" width="180" height="52" rx="10" fill="{col}" class="seg"/>')
        p.append(f'<text x="{x}" y="{y-4}" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">{l1}</text>')
        p.append(f'<text x="{x}" y="{y+13}" text-anchor="middle" fill="#eef2f7" font-size="10.5">{l2}</text>')
    p.append('<text x="300" y="184" text-anchor="middle" fill="#7c3aed" font-size="12.5" font-weight="800">BOUCLE QUI</text>')
    p.append('<text x="300" y="201" text-anchor="middle" fill="#7c3aed" font-size="12.5" font-weight="800">SE RENFORCE</text>')
    p.append('<text x="300" y="384" text-anchor="middle" fill="#b45309" font-size="11.5" font-weight="600">Changer durablement = sortir du paradigme (regard extérieur, reformuler)</text>')
    p.append('</svg>')
    return "".join(p)


def _svg_nemoto():
    ax, ay = 350, 34
    p = ['<svg viewBox="0 0 700 372" role="img" class="svg-anim">']

    def edge(y):
        t = (y - ay) / (300 - ay)
        return ax + (110 - ax) * t, ax + (590 - ax) * t
    l1, r1 = edge(120)
    l2, r2 = edge(212)
    p.append(f'<polygon points="{ax},{ay} {l1:.0f},120 {r1:.0f},120" fill="#334155" class="seg"/>')
    p.append(f'<polygon points="{l1:.0f},120 {r1:.0f},120 {r2:.0f},212 {l2:.0f},212" fill="#2563eb" class="seg"/>')
    p.append(f'<polygon points="{l2:.0f},212 {r2:.0f},212 590,300 110,300" fill="#16a34a" class="seg"/>')
    p.append('<text x="350" y="103" text-anchor="middle" fill="#fff" font-size="11.5" font-weight="700">TOP MANAGEMENT</text>')
    p.append('<text x="350" y="117" text-anchor="middle" fill="#cdd6e2" font-size="10">Vision &amp; sens</text>')
    p.append('<text x="350" y="165" text-anchor="middle" fill="#fff" font-size="12.5" font-weight="700">Management intermédiaire</text>')
    p.append('<text x="350" y="182" text-anchor="middle" fill="#dbe5ff" font-size="10.5">Objectifs &amp; standards · fait le pont</text>')
    p.append('<text x="350" y="254" text-anchor="middle" fill="#fff" font-size="12.5" font-weight="700">Opérationnels</text>')
    p.append('<text x="350" y="271" text-anchor="middle" fill="#dcfce7" font-size="10.5">Création de valeur (Gemba) · remontent les idées</text>')
    p.append('<line x1="56" y1="70" x2="56" y2="296" stroke="#64748b" stroke-width="2.5"/>')
    p.append('<polygon points="0,-5 10,0 0,5" fill="#64748b" transform="translate(56,296) rotate(90)"/>')
    p.append('<text x="42" y="186" fill="#475569" font-size="11" font-weight="600" transform="rotate(-90 42 186)" text-anchor="middle">Top-Down : déployer la vision</text>')
    p.append('<line x1="644" y1="296" x2="644" y2="70" stroke="#64748b" stroke-width="2.5"/>')
    p.append('<polygon points="0,-5 10,0 0,5" fill="#64748b" transform="translate(644,70) rotate(-90)"/>')
    p.append('<text x="658" y="186" fill="#475569" font-size="11" font-weight="600" transform="rotate(90 658 186)" text-anchor="middle">Bottom-Up : remonter les idées</text>')
    p.append('</svg>')
    return "".join(p)


def _svg_sdca_pdca():
    pts = [(90, 288), (170, 243), (290, 243), (370, 198), (490, 198), (570, 153), (660, 153)]
    p = ['<svg viewBox="0 0 700 348" role="img" class="svg-anim">']
    p.append('<line x1="64" y1="40" x2="64" y2="312" stroke="#94a3b8" stroke-width="2"/>')
    p.append('<line x1="64" y1="312" x2="672" y2="312" stroke="#94a3b8" stroke-width="2"/>')
    p.append('<text x="22" y="178" fill="#475569" font-size="12" font-weight="600" transform="rotate(-90 22 178)" text-anchor="middle">Performance</text>')
    p.append('<text x="370" y="336" fill="#475569" font-size="12" font-weight="600" text-anchor="middle">Temps →</text>')
    for a, b in [(0, 1), (2, 3), (4, 5)]:
        x1, y1 = pts[a]
        x2, y2 = pts[b]
        ang = math.degrees(math.atan2(y2 - y1, x2 - x1))
        p.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#2563eb" stroke-width="5"/>')
        p.append(f'<polygon points="0,-6 12,0 0,6" fill="#2563eb" transform="translate({x2},{y2}) rotate({ang:.0f})"/>')
        p.append(f'<text x="{(x1+x2)//2-14}" y="{(y1+y2)//2}" text-anchor="end" fill="#1d4ed8" font-size="12" font-weight="700">PDCA ↑</text>')
    for a, b in [(1, 2), (3, 4), (5, 6)]:
        x1, y1 = pts[a]
        x2, y2 = pts[b]
        mx = (x1 + x2) // 2
        p.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#0d9488" stroke-width="5"/>')
        p.append(f'<text x="{mx}" y="{y1-9}" text-anchor="middle" fill="#0f766e" font-size="11.5" font-weight="700">SDCA = cale</text>')
        p.append(f'<polygon points="{mx-11},{y1+3} {mx+11},{y1+3} {mx},{y1+16}" fill="#f6b400"/>')
    p.append('<text x="368" y="28" text-anchor="middle" fill="#222b38" font-size="12.5" font-weight="700">« Pas de standard, pas d\'amélioration » — on monte (PDCA), on cale (SDCA)</text>')
    p.append('</svg>')
    return "".join(p)


SVGS = {
    "roue-pdca": _svg_pdca(), "cinq-s": _svg_5s(), "cycle-dmaic": _svg_dmaic(),
    "maison-lean": _svg_maison(), "sipoc": _svg_sipoc(), "loi-normale": _svg_normale(),
    "va-nva": _svg_va_nva(), "sept-muda": _svg_7muda(), "ishikawa": _svg_ishikawa(),
    "arbre-cts": _svg_cts(), "triangle-or": _svg_triangle(),
    "types-donnees": _svg_types_donnees(), "paradigme": _svg_paradigme(),
    "nemoto": _svg_nemoto(), "sdca-pdca": _svg_sdca_pdca(),
}

# ============================================================ CSS ============
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
.side-link.is-done .badge{background:var(--action)}
.side-link .chk{margin-left:auto;color:var(--action);font-weight:800}
.side-extra{display:block;margin-top:12px;padding:7px 9px;border-radius:9px;
  color:var(--ink);font-size:14px}
.side-extra:hover{background:var(--bg);text-decoration:none}
.content{flex:1 1 auto;min-width:0;padding:26px clamp(18px,4vw,46px) 90px;max-width:880px}
.content h1{font-size:30px;line-height:1.25;margin:.2em 0 .6em;
  padding-bottom:.3em;border-bottom:2px solid var(--gold)}
.content h3{font-size:19px;margin:1.3em 0 .4em}
.content h4{font-size:16px;margin:1.1em 0 .3em}
.card{background:#fff;border:1px solid var(--line);border-left:5px solid var(--line);
  border-radius:12px;padding:14px 20px;margin:16px 0;box-shadow:0 1px 2px rgba(16,24,40,.04)}
.card>h2{margin:.1em 0 .5em;font-size:21px}
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
table{width:100%;border-collapse:collapse;margin:14px 0;font-size:14.5px;display:block;overflow-x:auto}
th,td{border:1px solid var(--line);padding:8px 11px;text-align:left;vertical-align:top}
thead th{background:var(--slate);color:#fff;font-weight:600}
tbody tr:nth-child(even){background:#fafbfc}
code{background:#eef1f4;padding:.12em .4em;border-radius:5px;font-size:.9em;
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
pre{background:#0f172a;color:#e2e8f0;padding:14px 16px;border-radius:10px;overflow-x:auto;line-height:1.45}
pre code{background:none;color:inherit;padding:0;font-size:13px;white-space:pre}
ul,ol{padding-left:1.4em}
li{margin:.25em 0}
hr{border:none;border-top:1px solid var(--line);margin:26px 0}
/* ---- figures SVG ---- */
.svg-fig{margin:18px 0;padding:16px;background:#fff;border:1px solid var(--line);
  border-radius:14px;text-align:center;box-shadow:0 1px 3px rgba(16,24,40,.05)}
.svg-fig svg{max-width:min(100%,560px);height:auto}
.svg-fig figcaption{margin-top:8px;color:var(--muted);font-size:13.5px;font-style:italic}
.svg-anim .seg{transition:transform .15s ease,filter .15s ease;transform-origin:center;cursor:default}
.svg-anim:hover .seg{filter:saturate(1.05)}
.svg-anim .seg:hover{filter:brightness(1.08)}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.svg-fig{animation:fadeUp .5s ease both}
@media (prefers-reduced-motion:reduce){.svg-fig,.svg-anim .seg{animation:none!important;transition:none!important;opacity:1!important}}
/* ---- quiz interactif ---- */
.quiz{margin:8px 0}
.quiz-top{display:flex;align-items:center;justify-content:space-between;gap:10px;
  margin-bottom:10px;flex-wrap:wrap}
.quiz-score{font-weight:700;color:#6d28d9;background:#f1e9ff;padding:4px 12px;border-radius:999px}
.quiz-reset{border:1px solid var(--line);background:#fff;border-radius:8px;padding:5px 10px;
  cursor:pointer;font-size:13px;color:var(--muted)}
.quiz-reset:hover{border-color:var(--quiz);color:var(--quiz)}
.quiz-list{list-style:none;padding:0;counter-reset:q}
.quiz .q{background:#fff;border:1px solid var(--line);border-radius:11px;padding:14px 16px;margin:12px 0}
.quiz .q-text{font-weight:600;margin:0 0 10px}
.quiz .q-text::before{counter-increment:q;content:"Q" counter(q) ". ";color:var(--quiz);font-weight:800}
.quiz .opts{display:flex;flex-direction:column;gap:8px}
.quiz .opt{display:block;width:100%;text-align:left;border:1.5px solid var(--line);background:#fff;
  border-radius:9px;padding:9px 13px;cursor:pointer;font-size:14.5px;color:var(--ink);
  transition:border-color .12s,background .12s}
.quiz .opt:hover{border-color:#c7b3f0;background:#faf7ff}
.quiz .opt b{color:var(--quiz);margin-right:4px}
.quiz .q.answered .opt{cursor:default}
.quiz .opt.correct{border-color:var(--action);background:#eafaf0}
.quiz .opt.correct b{color:var(--action)}
.quiz .opt.wrong{border-color:#dc2626;background:#fdecec}
.quiz .opt.wrong b{color:#dc2626}
.quiz .q-exp{margin:10px 0 0;padding:9px 12px;background:#f6f8fa;border-left:3px solid var(--action);
  border-radius:0 8px 8px 0;font-size:13.5px;color:#33404f}
.quiz .q-static details{border:1px solid var(--line);border-radius:9px}
.quiz .q-static summary{cursor:pointer;padding:8px 12px;color:var(--quiz);font-weight:600}
.quiz-final{margin-top:12px;font-weight:800;color:var(--action);font-size:16px}
/* details génériques (repli) */
details{margin:12px 0;border:1px solid var(--line);border-radius:10px;overflow:hidden;background:#fff}
summary{cursor:pointer;padding:11px 15px;font-weight:600;background:#f3eefc;list-style:none;color:#6d28d9}
summary::-webkit-details-marker{display:none}
summary::before{content:"▸ ";font-weight:700}
details[open] summary::before{content:"▾ "}
details[open] summary{border-bottom:1px solid var(--line)}
details>*:not(summary){padding-left:15px;padding-right:15px}
details>ol,details>ul{padding-left:2.2em}
/* ---- progression ---- */
.mod-toolbar{display:flex;justify-content:flex-end;margin:0 0 6px}
.btn-done{border:1.5px solid var(--action);background:#fff;color:var(--action);font-weight:700;
  border-radius:999px;padding:8px 16px;cursor:pointer;font-size:14px;transition:.15s}
.btn-done:hover{background:#eafaf0}
.btn-done.on{background:var(--action);color:#fff}
.progress-panel{background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px 18px;margin:0 0 18px}
.progress-panel .ptext{font-weight:700;font-size:14px}
.progress-panel .bar{height:12px;background:#eef1f4;border-radius:999px;overflow:hidden;margin:8px 0 10px}
.progress-panel .bar>i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--gold),#16a34a);
  transition:width .4s ease}
.btn-reset{border:1px solid var(--line);background:#fff;border-radius:8px;padding:5px 12px;cursor:pointer;
  font-size:13px;color:var(--muted)}
.btn-reset:hover{border-color:#dc2626;color:#dc2626}
/* ---- pager + back-to-top ---- */
.pager{display:flex;justify-content:space-between;gap:12px;margin-top:34px;padding-top:18px;border-top:1px solid var(--line)}
.pager a{flex:1;padding:12px 16px;border:1px solid var(--line);border-radius:10px;background:#fff}
.pager a:hover{border-color:var(--gold);text-decoration:none}
.pager .nx{text-align:right}
.pager small{display:block;color:var(--muted);font-size:12px}
#totop{position:fixed;right:18px;bottom:18px;width:44px;height:44px;border-radius:50%;border:none;
  background:var(--slate);color:#fff;font-size:20px;cursor:pointer;opacity:0;pointer-events:none;
  transition:opacity .2s;box-shadow:0 3px 10px rgba(0,0,0,.2);z-index:30}
#totop.show{opacity:.9;pointer-events:auto}
.hero{background:linear-gradient(135deg,#222b38,#384355);color:#fff;border-radius:16px;
  padding:30px 32px;margin:6px 0 22px;border:1px solid #2c3543}
.hero h1{border:none;color:#fff;margin:0 0 .3em}
.hero .tag{display:inline-block;background:var(--gold);color:#1f2733;font-weight:700;font-size:12px;
  padding:4px 10px;border-radius:999px;letter-spacing:.04em}
.hero p{color:#d7dbe2;margin:.5em 0 0;max-width:60ch}
.module-block{scroll-margin-top:64px;border-top:3px dashed var(--line);margin-top:40px;padding-top:8px}
.module-block:first-of-type{border-top:none}
.toc-back{font-size:13px;color:var(--muted)}
@media(max-width:900px){
  .layout{flex-direction:column}
  .sidebar{position:static;height:auto;flex-basis:auto;width:100%;border-right:none;border-bottom:1px solid var(--line)}
  .content{max-width:none}
}
@media print{
  .topbar,.sidebar,.pager,.topnav,.mod-toolbar,#totop,.quiz-reset{display:none!important}
  .content{max-width:none;padding:0}
  .card{break-inside:avoid;box-shadow:none}
  .quiz .q-exp{display:block!important}
}
"""

# ============================================================ JS =============
JS_CODE = r"""
(function(){
  var KEY='lss-progress-v1';
  function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
  function save(o){try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}}
  function applySidebar(){var d=load();document.querySelectorAll('.side-link').forEach(function(a){
    var s=a.getAttribute('data-slug');var c=a.querySelector('.chk');
    if(c)c.textContent=d[s]?'✓':'';a.classList.toggle('is-done',!!d[s]);});}
  function applyPanel(){var p=document.querySelector('.progress-panel');if(!p)return;
    var links=document.querySelectorAll('.side-link');var total=links.length;var d=load();var done=0;
    links.forEach(function(a){if(d[a.getAttribute('data-slug')])done++;});
    var pct=total?Math.round(done/total*100):0;var bar=p.querySelector('.bar>i');if(bar)bar.style.width=pct+'%';
    var t=p.querySelector('.ptext');if(t)t.textContent=done+' / '+total+' modules terminés ('+pct+'%)';}
  function wireDone(){var b=document.querySelector('.btn-done');if(!b)return;var s=b.getAttribute('data-slug');
    function upd(){var d=load();b.classList.toggle('on',!!d[s]);
      b.textContent=d[s]?'✓ Module terminé':'Marquer ce module comme terminé';}
    b.addEventListener('click',function(){var d=load();d[s]=!d[s];save(d);upd();applySidebar();applyPanel();});upd();}
  function wireReset(){var r=document.querySelector('.btn-reset');if(!r)return;
    r.addEventListener('click',function(){if(confirm('Réinitialiser votre progression ?')){save({});applySidebar();applyPanel();}});}
  function wireQuiz(){document.querySelectorAll('[data-quiz]').forEach(function(quiz){
    var qs=quiz.querySelectorAll('.q:not(.q-static)');var total=qs.length;var answered=0,score=0;
    var scoreEl=quiz.querySelector('.quiz-score');var fin=quiz.querySelector('.quiz-final');
    function upd(){if(scoreEl)scoreEl.textContent='Score : '+score+' / '+total;}
    qs.forEach(function(q){var correct=q.getAttribute('data-correct');
      q.querySelectorAll('.opt').forEach(function(btn){btn.addEventListener('click',function(){
        if(q.classList.contains('answered'))return;q.classList.add('answered');
        var good=btn.getAttribute('data-key')===correct;
        if(good){btn.classList.add('correct');score++;}
        else{btn.classList.add('wrong');var cb=q.querySelector('.opt[data-key="'+correct+'"]');if(cb)cb.classList.add('correct');}
        var e=q.querySelector('.q-exp');if(e)e.hidden=false;answered++;upd();
        if(answered===total&&fin){fin.hidden=false;
          fin.textContent=(score===total?'🏆 Parfait ! ':'✅ Terminé — ')+score+' / '+total;}});});});
    var rst=quiz.querySelector('.quiz-reset');
    if(rst)rst.addEventListener('click',function(){answered=0;score=0;
      qs.forEach(function(q){q.classList.remove('answered');
        q.querySelectorAll('.opt').forEach(function(b){b.classList.remove('correct','wrong');});
        var e=q.querySelector('.q-exp');if(e)e.hidden=true;});if(fin)fin.hidden=true;upd();});
    upd();});}
  function wireTop(){var b=document.getElementById('totop');if(!b)return;
    b.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
    window.addEventListener('scroll',function(){b.classList.toggle('show',window.scrollY>500);});}
  document.addEventListener('DOMContentLoaded',function(){
    applySidebar();applyPanel();wireDone();wireReset();wireQuiz();wireTop();});
})();
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
<button id="totop" title="Haut de page">↑</button>
<script>{script}</script>
</body>
</html>
"""

# ========================================================= helpers ===========
def md_to_html(text):
    text = text.replace("<details>", '<details markdown="1">')
    text = text.replace("<summary>", '<summary markdown="span">')
    return markdown.markdown(text, extensions=MD_EXT)


def md_inline(s):
    h = markdown.markdown(s.strip(), extensions=["tables"]).strip()
    if h.startswith("<p>") and h.endswith("</p>"):
        h = h[3:-4]
    return h


def inject_svgs(md_text):
    def repl(m):
        name, cap = m.group(1), (m.group(2) or "").strip()
        svg = SVGS.get(name)
        if not svg:
            return m.group(0)
        figcap = f"<figcaption>{cap}</figcaption>" if cap else ""
        return f"\n\n<figure class=\"svg-fig\">{svg}{figcap}</figure>\n\n"
    return re.sub(r"\[\[SVG:([a-z0-9\-]+)(?:\|([^\]]*))?\]\]", repl, md_text)


def insert_after_anchor(md, anchor, token):
    """Insère un jeton SVG juste après la 1re ligne contenant `anchor`."""
    lines = md.split("\n")
    for i, line in enumerate(lines):
        if anchor in line:
            lines.insert(i + 1, "\n" + token + "\n")
            break
    return "\n".join(lines)


def fix_links(html):
    html = re.sub(r'href="(?:\.\./)?ressources/INDEX\.md"', 'href="ressources.html"', html)
    html = re.sub(r'href="(?:modules/)?(\d{2}-[a-z0-9\-]+)\.md"', r'href="\1.html"', html)
    html = re.sub(r'<a href="(https?://[^"]+)"', r'<a target="_blank" rel="noopener" href="\1"', html)
    return html


SECTION_CLASS = [
    ("Objectifs", "sec-obj"), ("Prérequis", "sec-prereq"), ("Contenu", "sec-content"),
    ("Outils", "sec-tools"), ("Application directe", "sec-action"),
    ("À retenir", "sec-key"), ("retenir", "sec-key"), ("Quiz", "sec-quiz"), ("Sources", "sec-src"),
]


def classify(h2_html):
    for needle, cls in SECTION_CLASS:
        if needle.lower() in h2_html.lower():
            return cls
    return ""


def wrap_sections(html):
    parts = re.split(r'(<h2\b[^>]*>.*?</h2>)', html, flags=re.S)
    out = [parts[0]]
    i = 1
    while i < len(parts):
        h2 = parts[i]
        body = parts[i + 1] if i + 1 < len(parts) else ""
        out.append(f'<section class="card {classify(h2)}">{h2}{body}</section>')
        i += 2
    return "".join(out)


def build_quiz(md):
    """Extrait le quiz et renvoie (md_avec_slot, html_quiz) ou (md, None) en repli."""
    m = re.search(r'(^##\s*📝\s*Quiz de validation.*?)(?=^\#\#\s|\Z)', md, flags=re.S | re.M)
    if not m:
        return md, None
    block = m.group(1)
    dm = re.search(r'<details>(.*?)</details>', block, flags=re.S)
    answers, justif = {}, {}
    if dm:
        for am in re.finditer(r'^\s*(\d+)\.\s*\*\*(.+?)\*\*\s*(?:—|-|–)?\s*(.*)$',
                              dm.group(1), flags=re.M):
            answers[int(am.group(1))] = am.group(2).strip()
            justif[int(am.group(1))] = am.group(3).strip()
    qpart = block[:dm.start()] if dm else block
    questions, cur = [], None
    for line in qpart.splitlines():
        qm = re.match(r'^\s*(\d+)\.\s+(.*)$', line)
        if qm and not line.lstrip().startswith('-'):
            if cur:
                questions.append(cur)
            cur = {'n': int(qm.group(1)), 'text': qm.group(2).strip(), 'opts': []}
            continue
        om = re.match(r'^\s*-\s+(.*)$', line)
        if om and cur is not None:
            seg = om.group(1)
            marks = list(re.finditer(r'([a-dA-D])\)\s*', seg))
            for i, mk in enumerate(marks):
                start = mk.end()
                end = marks[i + 1].start() if i + 1 < len(marks) else len(seg)
                txt = re.sub(r'\s*·\s*$', '', seg[start:end].strip())
                cur['opts'].append({'key': mk.group(1).lower(), 'text': txt})
            continue
        if cur is not None and line.strip() and not line.lstrip().startswith('#') \
                and not line.strip().startswith('*('):
            cur['text'] += ' ' + line.strip()
    if cur:
        questions.append(cur)
    if not questions:
        return md, None
    interactive = 0
    for q in questions:
        tok = (answers.get(q['n']) or '').strip().lower()
        if not q['opts'] and (re.search(r'vrai\s*ou\s*faux', q['text'], re.I)
                              or tok in ('vrai', 'faux')):
            q['opts'] = [{'key': 'vrai', 'text': 'Vrai'}, {'key': 'faux', 'text': 'Faux'}]
        correct = None
        lm = re.match(r'^([a-d])\b', tok)
        if lm:
            correct = lm.group(1)
        elif tok.startswith('vrai'):
            correct = 'vrai'
        elif tok.startswith('faux'):
            correct = 'faux'
        if correct and any(o['key'] == correct for o in q['opts']):
            q['correct'] = correct
            q['exp'] = justif.get(q['n'], '')
            interactive += 1
        else:
            q['static'] = True
            q['exp'] = justif.get(q['n'], '')
    if interactive == 0:
        return md, None
    quiz_html = render_quiz(questions)
    heading = re.match(r'^(##\s*📝\s*Quiz de validation[^\n]*\n)', block).group(1)
    md2 = md[:m.start()] + heading + '\n<div id="quiz-slot"></div>\n\n' + md[m.end():]
    return md2, quiz_html


def render_quiz(questions):
    out = ['<div class="quiz" data-quiz>',
           '<div class="quiz-top"><span class="quiz-score"></span>',
           '<button type="button" class="quiz-reset">↺ Recommencer</button></div>',
           '<ol class="quiz-list">']
    for q in questions:
        if q.get('static'):
            exp = md_inline(q['exp']) if q['exp'] else 'Voir le support source.'
            out.append(f'<li class="q q-static"><div class="q-text">{md_inline(q["text"])}</div>'
                       f'<details><summary>Voir la réponse</summary><div>{exp}</div></details></li>')
            continue
        out.append(f'<li class="q" data-correct="{q["correct"]}">'
                   f'<div class="q-text">{md_inline(q["text"])}</div><div class="opts">')
        for o in q['opts']:
            if o['key'] in ('vrai', 'faux'):
                label = o['text']
            else:
                label = f'<b>{o["key"]})</b> {md_inline(o["text"])}'
            out.append(f'<button type="button" class="opt" data-key="{o["key"]}">{label}</button>')
        exp = md_inline(q['exp']) if q['exp'] else ''
        out.append(f'</div><div class="q-exp" hidden>{exp}</div></li>')
    out.append('</ol><p class="quiz-final" hidden></p></div>')
    return "".join(out)


def parse_title(md_text, fallback):
    m = re.search(r'^#\s+(.*)$', md_text, flags=re.M)
    return m.group(1).strip() if m else fallback


def short_label(title):
    m = re.match(r'\s*Module\s+(\d+)\s*[—\-–]\s*(.*)', title)
    if m:
        return m.group(1), m.group(2).strip()
    return "•", title


# Schéma d'ancrage à injecter par module (jeton placé après « ## 📚 Contenu »)
MODULE_SVG = {
    "01-lean-6sigma-lean-six-sigma": ("loi-normale",
        "La loi normale : ~68 % des valeurs à ±1σ, ~95 % à ±2σ, ~99,7 % à ±3σ. "
        "Le « niveau sigma » mesure la capacité d'un processus."),
    "03-fondements-du-lean": ("maison-lean",
        "Le Lean comme système : du socle (lutte contre le Muda, sur le Gemba) "
        "jusqu'à la satisfaction Client (Qualité · Coût · Délai)."),
    "07-5s": ("cinq-s",
        "Les 5S : un cycle en 5 étapes pour un poste rangé, propre et tenu dans la durée."),
    "09-resolution-probleme-qqoqccp-ishikawa": ("roue-pdca",
        "La roue de Deming (PDCA) : Planifier → Dérouler → Contrôler → Agir, en boucle d'amélioration continue."),
    "10-dmaic": ("cycle-dmaic",
        "La démarche DMAIC : 5 phases en « entonnoir », de 100+ variables d'entrée vers les 1 à 3 X clés."),
    "12-sipoc": ("sipoc",
        "Le SIPOC : Fournisseurs → Entrées → Processus → Sorties → Clients — la vue d'ensemble d'un processus."),
    "14-statistiques-descriptives": ("loi-normale",
        "La loi normale : ~68 % des valeurs à ±1σ, ~95 % à ±2σ, ~99,7 % à ±3σ autour de la moyenne."),
    "04-paradigmes": ("paradigme",
        "Le paradigme s'auto-renforce : il filtre la perception, oriente le comportement et "
        "produit des résultats qui le confirment. Changer durablement, c'est en sortir."),
    "05-management-lean-nemoto": ("nemoto",
        "Le diagramme de Nemoto relie les 3 niveaux : la direction porte la vision, l'encadrement "
        "fait le pont (objectifs & standards), les opérationnels créent la valeur et remontent les idées."),
    "06-standards-standardisation": ("sdca-pdca",
        "Standardiser avant d'améliorer : chaque SDCA « cale » le palier atteint, chaque PDCA "
        "fait monter d'un cran (escalier performance / temps)."),
    "13-types-de-donnees": ("types-donnees",
        "La classification des données : par attribut (catégories) ou variable (numérique) ; "
        "une variable se lit sur deux axes indépendants — intervalle/ratio et continue/discrète."),
}

# Schémas placés en ligne, juste après le sous-titre de section : (ancre, nom_svg, légende)
MODULE_SVG_INLINE = {
    "02-muda-mura-muri-gemba": [
        ("### 1. Valeur", "va-nva",
         "VA vs NVA : sur le délai d'écoulement, la valeur ajoutée n'est souvent qu'une "
         "infime part ; le Lean comprime le NVA."),
        ("### 3. Les 7 MUDA", "sept-muda",
         "Les 7 MUDA (gaspillages) — la surproduction génère tous les autres."),
    ],
    "09-resolution-probleme-qqoqccp-ishikawa": [
        ("### 4. Le diagramme", "ishikawa",
         "Le diagramme d'Ishikawa (causes-effet, « arête de poisson ») : on remonte les "
         "causes par les 5M jusqu'à l'effet."),
    ],
    "11-voc-cts": [
        ("### 7. L", "arbre-cts",
         "L'arbre des CTS : traduire un besoin client (VoC) en exigence mesurable "
         "(Driver → CTS avec seuils)."),
    ],
    "08-management-visuel": [
        ("### 4. Le Triangle", "triangle-or",
         "Le Triangle d'Or : relier standard opératoire, standard de management et "
         "management visuel pour que tout écart déclenche une action."),
    ],
}

# ========================================================= build =============
def main():
    SITE_DIR.mkdir(exist_ok=True)
    (SITE_DIR / ".nojekyll").write_text("")  # désactive Jekyll sur GitHub Pages
    module_files = sorted(MODULES_DIR.glob("[0-9][0-9]-*.md"))
    modules = []
    for mf in module_files:
        md = mf.read_text(encoding="utf-8")
        title = parse_title(md, mf.stem)
        num, label = short_label(title)
        modules.append({"slug": mf.stem, "title": title, "num": num, "label": label, "md": md})

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
                        f'<a class="side-link{active}" data-slug="{m["slug"]}" href="{m["slug"]}.html">'
                        f'<span class="badge">{m["num"]}</span><span>{m["label"]}</span>'
                        f'<span class="chk"></span></a>')
        rows.append('<a class="side-extra" href="ressources.html">📂 Ressources &amp; modèles</a>')
        rows.append('<a class="side-extra" href="formation-complete.html">📖 Tout en un fichier</a>')
        rows.append("</nav>")
        return "".join(rows)

    def render_module_body(m):
        md = m["md"]
        md, quiz_html = build_quiz(md)
        if m["slug"] in MODULE_SVG:
            name, cap = MODULE_SVG[m["slug"]]
            md = md.replace("## 📚 Contenu\n", f"## 📚 Contenu\n\n[[SVG:{name}|{cap}]]\n", 1)
        for anchor, name, cap in MODULE_SVG_INLINE.get(m["slug"], []):
            md = insert_after_anchor(md, anchor, f"[[SVG:{name}|{cap}]]")
        md = inject_svgs(md)
        html = fix_links(md_to_html(md))
        if quiz_html:
            html = html.replace('<div id="quiz-slot"></div>', quiz_html)
        return wrap_sections(html)

    # pages de module
    for idx, m in enumerate(modules):
        body = render_module_body(m)
        prev_m = modules[idx - 1] if idx > 0 else None
        next_m = modules[idx + 1] if idx < len(modules) - 1 else None
        topnav = ""
        if prev_m:
            topnav += f'<a href="{prev_m["slug"]}.html">← Préc.</a>'
        if next_m:
            topnav += f'<a href="{next_m["slug"]}.html">Suiv. →</a>'
        toolbar = (f'<div class="mod-toolbar"><button class="btn-done" '
                   f'data-slug="{m["slug"]}">Marquer ce module comme terminé</button></div>')
        pager = ['<nav class="pager">']
        pager.append(f'<a href="{prev_m["slug"]}.html"><small>← Module précédent</small>'
                     f'{prev_m["num"]} · {prev_m["label"]}</a>' if prev_m else "<span></span>")
        pager.append(f'<a class="nx" href="{next_m["slug"]}.html"><small>Module suivant →</small>'
                     f'{next_m["num"]} · {next_m["label"]}</a>' if next_m else "<span></span>")
        pager.append("</nav>")
        content = toolbar + body + "".join(pager)
        page = PAGE.format(title=m["title"] + " — LSS Yellow Belt", css=CSS, script=JS_CODE,
                           topnav=topnav, sidebar=sidebar_html(m["slug"]), content=content)
        (SITE_DIR / f'{m["slug"]}.html').write_text(page, encoding="utf-8")

    # accueil (README) + panneau de progression
    readme_html = wrap_sections(fix_links(md_to_html(README.read_text(encoding="utf-8"))))
    panel = ('<div class="progress-panel"><div class="ptext">Votre progression</div>'
             '<div class="bar"><i></i></div><button class="btn-reset">Réinitialiser ma progression</button></div>')
    index_page = PAGE.format(title="Accueil — Formation Lean Six Sigma Yellow Belt", css=CSS,
                             script=JS_CODE, topnav='<a href="formation-complete.html">📖 Tout en un fichier</a>',
                             sidebar=sidebar_html(None), content=panel + readme_html)
    (SITE_DIR / "index.html").write_text(index_page, encoding="utf-8")

    # ressources
    res_html = wrap_sections(fix_links(md_to_html(RESSOURCES.read_text(encoding="utf-8"))))
    res_page = PAGE.format(title="Ressources — LSS Yellow Belt", css=CSS, script=JS_CODE,
                           topnav='<a href="index.html">🏠 Accueil</a>',
                           sidebar=sidebar_html(None), content=res_html)
    (SITE_DIR / "ressources.html").write_text(res_page, encoding="utf-8")

    # fichier unique (tout le parcours)
    toc = ['<div class="hero"><span class="tag">PARCOURS COMPLET</span>'
           '<h1>Formation Lean Six Sigma — Yellow Belt</h1>'
           '<p>Tous les modules réunis dans une seule page, à suivre hors-ligne. '
           'Schémas, quiz interactifs et navigation par sommaire.</p></div>',
           '<h2>Sommaire</h2><ol>']
    blocks = []
    for m in modules:
        anchor = "mod-" + m["slug"][:2]
        toc.append(f'<li><a href="#{anchor}">{m["num"]} · {m["label"]}</a></li>')
        blocks.append(f'<section id="{anchor}" class="module-block">'
                      f'<p class="toc-back"><a href="#top">↑ Sommaire</a></p>'
                      f'{render_module_body(m)}</section>')
    toc.append("</ol>")
    full_content = '<a id="top"></a>' + "".join(toc) + "".join(blocks)
    full_page = PAGE.format(title="Formation Lean Six Sigma Yellow Belt — parcours complet",
                            css=CSS, script=JS_CODE, topnav='<a href="index.html">🏠 Version site</a>',
                            sidebar=sidebar_html(None), content=full_content)
    (SITE_DIR / "formation-complete.html").write_text(full_page, encoding="utf-8")

    print(f"OK — {len(modules)} modules + index + ressources + fichier unique")
    print(f"SVG injectés dans : {', '.join(sorted(MODULE_SVG))}")
    print(f"Sortie : {SITE_DIR}")


if __name__ == "__main__":
    main()
