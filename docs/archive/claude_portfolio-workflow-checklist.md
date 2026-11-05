# Portfolio-Workflow-Checkliste

Interaktive, abhakbare Checkliste für das Hinzufügen neuer Projekte (Screenshots, Recordings, Canva-Mockups, Web-Optimierung, Sanity-Upload). Fortschritt wird direkt in der Seite gespeichert (geräteübergreifend, kein Login nötig).

**Link:** https://claude.ai/code/artifact/0a8422e7-cfd0-4966-95d7-138b3b8706f7

Diesen Link einfach direkt im Browser öffnen (nicht über Claude-in-Chrome-Automatisierung) — dann bleibt er als eigener Tab/Bookmark verfügbar, ohne im Chatverlauf suchen zu müssen.

Erstellt am 26.08.2026, zuletzt inhaltlich abgestimmt am 04.09.2026.

## Terminal-Befehle: jetzt im Repo, nicht mehr hier

Die eigentlichen Terminal-Befehle (Screenshots umbenennen, Screenshots/Mockups/Video komprimieren) sind seit 04.09.2026 **nicht mehr** hier im Doc und **nicht mehr** in der interaktiven Checkliste gepflegt, sondern als reine Markdown-Referenz direkt im Repo:

**`mitsch-website/docs/portfolio-asset-workflow.md`**

Grund: Terminal-Text von Hand zu editieren war lästig und die Befehle mussten bei jeder Struktur-Änderung an zwei/drei Stellen synchron gehalten werden. Die Repo-Datei enthält jetzt zusätzlich 7 fertige Shell-Funktionen für `~/.zshrc`, die den Projektnamen als Argument nehmen (z. B. `compress_desktop_shots mein-projekt`) — kein manuelles Editieren von Platzhaltern oder `cd` mehr nötig. Diese Datei einfach als zweiten Tab/Fenster daneben offen halten, sie ist der Single Source of Truth für den Terminal-Teil des Workflows.

## Aktuell festgelegte Ziel-Maße (Amrei-Website, iPhone-Mockup-Vorlage)
- **Desktop-Screenshot:** 1540×852px (2x der Mockup-Screen-Fläche 770×426px)
- **Handy-Screenshot:** 588×1224px (kleinere exakte Ratio-Variante von 343:714, da 686×1428px für den Bildschirm zu groß war)
- Mockup-Bilder (fertige Canva-Exporte, PNG): möglichst ~1600px auf der langen Kante anstreben (2x der Website-Anzeigegröße 800×450px), danach mit `-quality 85` zu WebP (Foto-Content mit Farbverläufen, daher höhere Qualität als bei reinen UI-Screenshots)

## Mockup-Vorlagen
Für Amrei Fiedler wurden zwei **eigene** Canva-Mockups gebaut (Frame-Element + eigener unscharfer Hintergrund), da die App-eigenen Vorlagen nicht zu 100% gepasst haben:
- Desktop: iMac-Mockup, heller Büro-Hintergrund
- Handy: Hand-hält-Phone-Mockup, freigestellter Hintergrund

Diese zwei Vorlagen können 1:1 für weitere Projekte wiederverwendet werden — nur den eingesetzten Screenshot austauschen.

## Neuer Upload-Workflow seit der Sanity-Migration (03.09.2026)
Neue Projekte laufen nicht mehr über GitHub-Repos, sondern zweigleisig:

1. **Bilder & Video → Cloudflare R2** (Dashboard, Drag & Drop, Bucket `studio-mitsch-assets`):
   - Desktop-Screenshots: `<slug>-desktop-1.webp`, `<slug>-desktop-2.webp`, … → Ordner `images/`
   - Handy-Screenshots: `<slug>-mobile-1.webp`, `<slug>-mobile-2.webp`, … → Ordner `images/`
   - Vorschaubild (Grid-Kachel): `<slug>-preview.webp` → Ordner `images/`
   - Video: `<slug>-video.mp4` → Ordner `videos/`
2. **Metadaten → Sanity Studio** (`studio-mitsch.de/studio`), neues `project`-Dokument: `title`, `slug`, `description`, `tags`, `languages`, `liveUrl`, `isVisible`.

**Wichtig:** der `slug` im Sanity-Dokument muss exakt dem `<slug>`-Präfix der R2-Dateinamen entsprechen — darüber werden Vorschaubild, Mockup-Carousel und Video automatisch gefunden, ohne dass irgendwo ein Bild-Link manuell eingetragen wird. Siehe `claude/sanity-migration-plan.md` für die technischen Details der Migration (Feld-Mapping, betroffene Dateien, Verifikations-Checkliste).

Alte, bereits bestehende Projekte laufen unverändert über GitHub weiter (Repo mit `portfolio`-Topic) — für die ändert sich nichts an diesem Ablauf, nur an der Bildquelle (auch deren Mockups liegen inzwischen auf R2 statt lokal).

## Enthält (interaktive Checkliste)
- Einmalig-Setup (Canva-Recherche, Zielmaße, Ordnerstruktur)
- Kurzer Verweis auf `docs/portfolio-asset-workflow.md` im Repo (statt eigener Terminal-Referenz, siehe oben)
- 6 erweiterbare Projekt-Karten mit je 15 Schritten (Erfassen → Resize/Kompression → Mockup → Web-Optimierung → Sanity-Upload → Verify), inkl. Web/App-Umschalter (ändert die Handy-Erfassungsschritte: responsive Ansicht vs. iOS-Simulator)

## Ordnerstruktur pro Projekt (seit 03.09.2026 Standard für alle neuen Projekte)

Jedes Projekt liegt unter `assets/portfolio/<projektname>/` mit vier festen Unterordnern:

```
assets/portfolio/<projektname>/
  1_raw/          Rohe Screenshots (*-N-desktop.png, *-N-mobile.png) + rohes Video (*.mov)
  2_processed/    Komprimierte, aber ungerahmte Screenshots (flach, *-N-desktop.webp / *-N-mobile.webp) — Zwischenstufe, wird als Bildmaterial in Canva für die Mockups verwendet
  3_mockups/      Fertige Canva-Mockup-Exporte, ungerahmte Rohgröße (*-mockup-desktop-N.png, *-mockup-mobile-N.png)
  4_web-ready/    Finale Dateien zum Hochladen nach R2 (<projektname>-desktop-N.webp, <projektname>-mobile-N.webp, <projektname>-preview.webp, <projektname>-video.mp4)
```

Diese Struktur ist auch in `docs/portfolio-asset-workflow.md` im Repo dokumentiert (dort die maßgebliche Version, hier nur zur Übersicht).

## Phase 2 (noch nicht begonnen)
Asset-Optimierung der bestehenden/alten Projekte (Bilder teils schon von dir selbst zu WebP konvertiert; Videos noch nicht re-encodiert/getrimmt). Die alten Mockup-Bilder wurden im Zuge der Sanity-Migration bereits von lokal (`public/images/`) nach Cloudflare R2 umgezogen (siehe `claude/sanity-migration-plan.md`, Schritt 6).
