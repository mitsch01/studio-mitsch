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

## Ablauf für ein neues Projekt

Angenommen der Projektname (= späterer Sanity-`slug`) ist `mein-projekt`:

1. Im Ordner mit den frischen Desktop-Screenshots: `raw_rename mein-projekt desktop`
2. Im Ordner mit den frischen Handy-Screenshots: `raw_rename mein-projekt mobile`
3. `compress_desktop_shots mein-projekt`
4. `compress_mobile_shots mein-projekt`
5. Canva-Mockups bauen (Screenshots aus `2_processed/` verwenden), Export nach `3_mockups/`
6. `compress_desktop_mockup mein-projekt`
7. `compress_mobile_mockup mein-projekt`
8. `compress_video mein-projekt` (falls Video vorhanden, rohes `.mov` vorher in `1_raw/` legen)
9. `make_preview mein-projekt`
10. Kompletten Inhalt von `4_web-ready/` nach Cloudflare R2 hochladen (Bilder + Vorschau → `images/`, Video → `videos/`)
11. Metadaten in Sanity Studio eintragen, `slug` = `mein-projekt`

Danach jeder Schritt einfach per Funktionsaufruf mit dem Projektnamen, ohne irgendwo Text im Terminal von Hand zu ändern.
