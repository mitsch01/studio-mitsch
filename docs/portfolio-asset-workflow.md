# Portfolio-Asset-Workflow (Terminal-Referenz)

Referenz für das Vorbereiten neuer Portfolio-Projekte (Screenshots, Mockups, Video) für den Upload nach Cloudflare R2 + Sanity. Zuletzt aktualisiert: 04.09.2026.

Diese Datei bewusst als reine Markdown-Referenz im Repo abgelegt (statt in der interaktiven Checkliste), damit sie sich nicht bei jeder Struktur-Änderung mit anpassen muss und du sie einfach rechts daneben offen haben kannst.

## Ordnerstruktur pro Projekt

Jedes Projekt liegt unter `assets/portfolio/<projektname>/`:

```
assets/portfolio/<projektname>/
  1_raw/          Rohe Screenshots (*-N-desktop.png, *-N-mobile.png) + rohes Video (*.mov)
  2_processed/    Komprimierte, ungerahmte Screenshots (Bildmaterial für die Canva-Mockups)
  3_mockups/      Fertige Canva-Mockup-Exporte, ungerahmte Rohgröße
  4_web-ready/    Finale Dateien für den R2-Upload (<projektname>-desktop-N.webp, -mobile-N.webp, -preview.webp, -video.mp4)
```

## Einmaliges Setup: Shell-Funktionen

Diese 7 Funktionen einmal in deine `~/.zshrc` einfügen (Terminal danach neu starten oder `source ~/.zshrc`). Jede Funktion nimmt den Projektnamen als Argument und springt selbst in den richtigen Unterordner — kein manuelles `cd` und kein Editieren von Platzhaltern mehr nötig.

```bash
PORTFOLIO_BASE="/Volumes/uLLA4/Coding/Projects/studio-mitsch/assets/portfolio"

# 1) Frische Screenshots EINES Gerätetyps aus dem aktuellen Ordner nummerieren
#    und direkt nach 1_raw/ verschieben.
#    Aufruf im Ordner mit den frischen Screenshots (z.B. Downloads):
#    raw_rename amrei-fiedler-illustration desktop
raw_rename() {
  local projekt="$1" typ="$2"
  if [[ -z "$projekt" || -z "$typ" ]]; then
    echo "Nutzung: raw_rename <projektname> <desktop|mobile>"
    return 1
  fi
  local ziel="$PORTFOLIO_BASE/$projekt/1_raw"
  local i=1
  while IFS= read -r f; do
    mv -- "$f" "${ziel}/${projekt}-${i}-${typ}.png"
    i=$((i+1))
  done < <(find . -maxdepth 1 -name "*.png" -exec stat -f "%B %N" {} \; | sort -n | cut -d' ' -f2-)
}

# 2) Desktop-Screenshots komprimieren (1_raw -> 2_processed)
compress_desktop_shots() {
  local projekt="$1"
  if [[ -z "$projekt" ]]; then echo "Nutzung: compress_desktop_shots <projektname>"; return 1; fi
  (
    cd "$PORTFOLIO_BASE/$projekt/1_raw" || return 1
    mkdir -p ../2_processed
    for f in *-desktop.png; do
      magick "$f" -resize 1540x852 -quality 82 "../2_processed/${f%.png}.webp"
    done
  )
}

# 3) Handy-Screenshots komprimieren (1_raw -> 2_processed)
compress_mobile_shots() {
  local projekt="$1"
  if [[ -z "$projekt" ]]; then echo "Nutzung: compress_mobile_shots <projektname>"; return 1; fi
  (
    cd "$PORTFOLIO_BASE/$projekt/1_raw" || return 1
    mkdir -p ../2_processed
    for f in *-mobile.png; do
      magick "$f" -resize 588x1224 -quality 82 "../2_processed/${f%.png}.webp"
    done
  )
}

# 4) Desktop-Mockup komprimieren (3_mockups -> 4_web-ready)
#    Nummeriert nach Erstellungszeit neu durch (1,2,3,...), statt die Nummer
#    aus dem Dateinamen zu lesen -- Canva exportiert oft denselben Basisnamen
#    mehrfach, macOS haengt dann "(0)", "(1)", ... an, was sich nicht sauber
#    parsen laesst.
compress_desktop_mockup() {
  local projekt="$1"
  if [[ -z "$projekt" ]]; then echo "Nutzung: compress_desktop_mockup <projektname>"; return 1; fi
  (
    cd "$PORTFOLIO_BASE/$projekt/3_mockups" || return 1
    mkdir -p ../4_web-ready
    local i=1 f
    while IFS= read -r f; do
      magick "$f" -quality 85 "../4_web-ready/${projekt}-desktop-${i}.webp"
      i=$((i+1))
    done < <(find . -maxdepth 1 -name "*desktop*.png" -exec stat -f "%B %N" {} \; | sort -n | cut -d' ' -f2-)
  )
}

# 5) Handy-Mockup komprimieren (3_mockups -> 4_web-ready)
compress_mobile_mockup() {
  local projekt="$1"
  if [[ -z "$projekt" ]]; then echo "Nutzung: compress_mobile_mockup <projektname>"; return 1; fi
  (
    cd "$PORTFOLIO_BASE/$projekt/3_mockups" || return 1
    mkdir -p ../4_web-ready
    local i=1 f
    while IFS= read -r f; do
      magick "$f" -quality 85 "../4_web-ready/${projekt}-mobile-${i}.webp"
      i=$((i+1))
    done < <(find . -maxdepth 1 -name "*mobile*.png" -exec stat -f "%B %N" {} \; | sort -n | cut -d' ' -f2-)
  )
}

# 6) Video komprimieren (1_raw -> 4_web-ready)
compress_video() {
  local projekt="$1"
  if [[ -z "$projekt" ]]; then echo "Nutzung: compress_video <projektname>"; return 1; fi
  (
    cd "$PORTFOLIO_BASE/$projekt/1_raw" || return 1
    mkdir -p ../4_web-ready
    for f in *.mov; do
      ffmpeg -i "$f" -vf "scale=1540:-2" -c:v libx264 -crf 23 -preset medium -an "../4_web-ready/${projekt}-video.mp4"
    done
  )
}

# 7) Vorschaubild für die Grid-Kachel erzeugen (2_processed -> 4_web-ready)
make_preview() {
  local projekt="$1"
  if [[ -z "$projekt" ]]; then echo "Nutzung: make_preview <projektname>"; return 1; fi
  (
    cd "$PORTFOLIO_BASE/$projekt/2_processed" || return 1
    cp "$(ls *-desktop.webp | sort | head -1)" "../4_web-ready/${projekt}-preview.webp"
  )
}
```

## Kompletter Ablauf: Neues Projekt von Anfang bis Online

Schritt-für-Schritt-Anleitung, einmal von oben nach unten durchgehen — am Ende ist das Projekt live im Portfolio. Ersetze überall `<projektname>` durch den tatsächlichen Namen (= späterer Sanity-`slug`, z. B. `thank-god-its-tuesday`). Vorbedingung: die Shell-Funktionen oben sind einmalig in `~/.zshrc` eingerichtet (siehe "Einmaliges Setup").

### 0. Ordner anlegen

```bash
BASE="/Volumes/uLLA4/Coding/Projects/studio-mitsch/assets/portfolio"
mkdir -p "$BASE/<projektname>"/{1_raw,2_processed,3_mockups,4_web-ready}
ls "$BASE/<projektname>"
```
Erwartet: `1_raw`, `2_processed`, `3_mockups`, `4_web-ready`.

### 1. Screenshots & Video erfassen

- **Desktop:** Browser-DevTools, Responsive Mode (`Cmd+Shift+M`), Viewport auf **1540×852px**. Screenshot pro Ansicht über die DevTools-Command-Palette (`Cmd+Shift+P` → „Capture screenshot“) — schneidet exakt den Viewport.
- **Handy (Web-Projekt):** gleiches Vorgehen, Viewport **588×1224px**. (Bei App-Projekten stattdessen iOS-Simulator, `Cmd+S` zum Screenshot, danach auf 588×1224px skalieren.)
- **Video:** QuickTime-Recording (Desktop) bzw. `xcrun simctl io booted recordVideo aufnahme.mov` (iOS-Simulator, App-Projekte).
- Alle Desktop-Screenshots landen zunächst in einem eigenen, sonst leeren Ordner (z. B. neuer Ordner auf dem Desktop) — noch nicht in `1_raw/`. Gleiches für die Handy-Screenshots, in einem zweiten Ordner.

### 2. Screenshots nummerieren + nach `1_raw/` verschieben

Im Ordner mit den frischen **Desktop**-Screenshots:
```bash
raw_rename <projektname> desktop
```
Im Ordner mit den frischen **Handy**-Screenshots:
```bash
raw_rename <projektname> mobile
```
Beide verschieben die Dateien direkt (nummeriert nach Aufnahmezeit) nach `1_raw/`.

### 3. Video nach `1_raw/` legen

Kein Funktionsaufruf nötig, Dateiname ist egal (Endung muss `.mov` sein):
```bash
mv dein-video.mov "/Volumes/uLLA4/Coding/Projects/studio-mitsch/assets/portfolio/<projektname>/1_raw/"
```

### 4. Screenshots komprimieren (`1_raw/` → `2_processed/`)

```bash
cd "/Volumes/uLLA4/Coding/Projects/studio-mitsch/assets/portfolio/<projektname>/1_raw"
compress_desktop_shots <projektname>
compress_mobile_shots <projektname>
```
Kontrolle — Anzahl `.webp`-Dateien sollte der Anzahl Screenshots in `1_raw/` entsprechen:
```bash
ls "../2_processed"
```

### 5. Canva-Mockups bauen

Mit den bestehenden Vorlagen (Desktop: iMac-Mockup, Handy: Hand-hält-Phone-Mockup) die Screenshots aus `2_processed/` einsetzen, Export als PNG direkt nach `3_mockups/`.

### 6. Mockups komprimieren (`3_mockups/` → `4_web-ready/`)

```bash
cd "/Volumes/uLLA4/Coding/Projects/studio-mitsch/assets/portfolio/<projektname>/3_mockups"
compress_desktop_mockup <projektname>
compress_mobile_mockup <projektname>
```
Die Funktionen nummerieren automatisch neu durch (1, 2, 3, …) unabhängig davon, wie Canva die Export-Dateien intern benennt.

### 7. Video komprimieren (`1_raw/` → `4_web-ready/`)

```bash
cd "/Volumes/uLLA4/Coding/Projects/studio-mitsch/assets/portfolio/<projektname>/1_raw"
compress_video <projektname>
```

### 8. Vorschaubild erzeugen (`2_processed/` → `4_web-ready/`)

```bash
cd "/Volumes/uLLA4/Coding/Projects/studio-mitsch/assets/portfolio/<projektname>/2_processed"
make_preview <projektname>
```

### 9. Kontrolle: `4_web-ready/` vollständig?

```bash
ls "/Volumes/uLLA4/Coding/Projects/studio-mitsch/assets/portfolio/<projektname>/4_web-ready"
```
Erwartet: `<projektname>-desktop-1.webp` … `-N.webp`, `<projektname>-mobile-1.webp` … `-N.webp`, `<projektname>-preview.webp`, `<projektname>-video.mp4` — alle durchnummeriert ohne Lücken oder Klammer-Reste wie `(0)`.

### 10. Upload nach Cloudflare R2

Im R2-Dashboard, Bucket `studio-mitsch-assets`, kompletten Inhalt von `4_web-ready/` per Drag & Drop hochladen:
- alle `.webp`-Dateien (Desktop, Mobile, Preview) → Ordner `images/`
- die `.mp4` → Ordner `videos/`

Dateinamen bleiben exakt so, wie sie in `4_web-ready/` heißen.

### 11. Sanity-Dokument anlegen

In Sanity Studio (`studio-mitsch.de/studio`), neues `project`-Dokument:
- `title`: Anzeigename für die Karte
- `slug`: **exakt** `<projektname>` (muss 1:1 zum Datei-Präfix in R2 passen — sonst werden Vorschaubild/Mockup-Carousel/Video nicht gefunden)
- `description`: Projekttext
- `tags`: verwendete Technologien/Skills
- `languages`: verwendete Tools bzw. Tech-Stack
- `liveUrl`: Link zum Projekt, falls live erreichbar
- `isVisible`: `true`, sobald alles passt

### 12. Live prüfen

- Startseite laden, neues Projekt taucht im Grid auf
- Modal öffnen: Desktop- + Mobile-Mockup-Carousel, Video, Beschreibung, Tags, Link — alles korrekt?
- Netzwerk-Tab: Bilder/Video laden von der R2-URL (Status 200)

Fertig — Projekt ist online.
