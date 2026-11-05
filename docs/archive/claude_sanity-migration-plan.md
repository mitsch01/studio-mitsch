# Sanity-basierte Projekt-Komponente (1:1 zur GitHub-Komponente) + Mockup-Umzug auf Cloudflare R2

## Umsetzungsmodus

Mitsch möchte die Dateien selbst ändern (Lernen durch Machen). Claude schlägt pro Schritt konkreten Code vor und erklärt ihn, sie setzt ihn selbst in ihrem Editor ein. Es wird strikt entlang der Nummerierung unten (1 → 6) vorgegangen, Schritt für Schritt, nicht alles auf einmal.

## Context

Aktuell werden alle Portfolio-Projekte auf studio-mitsch.de live über die GitHub-API geladen (`RepoGallery.tsx` auf der Startseite, `ProjectDetail.tsx` unter `/project/[project-name]`), abgesichert durch zwei Next.js-API-Routen, die den `GITHUB_TOKEN` serverseitig halten. Neue Projekte sollen künftig direkt im schon vorhandenen Sanity Studio gepflegt werden, ohne dass dafür weiterhin ein GitHub-Repo mit `portfolio`-Topic angelegt werden muss. Die GitHub-Anbindung soll dabei **nicht abgebaut**, sondern nur nicht mehr aktiv für neue Projekte genutzt werden — bestehende Projekte laufen unverändert darüber weiter.

Zusätzlich liegen die Mockup-Bilder (Desktop-/Mobile-Screens, Preview-Bild) aller Projekte aktuell noch lokal in `public/images/` (91 Dateien) und werden über eine Next.js-Route per Dateisystem-Check ausgeliefert. Videos laufen bereits über Cloudflare R2 (`NEXT_PUBLIC_R2_PUBLIC_URL`, Bucket `studio-mitsch-assets`, Prefix `videos/`). Die Bilder sollen nach demselben Muster auf R2 umziehen — das betrifft **beide** Datenquellen gleichermaßen, da beide dieselbe `ProjectGallery`-Komponente zur Anzeige nutzen.

Entscheidungen aus Rückfrage an Mitsch:
- Neue Sanity-Projekte und bestehende GitHub-Projekte erscheinen **in einem gemeinsamen Grid** auf der Startseite (nicht zwei getrennte Bereiche).
- Die Einzelseiten-Route `/project/[project-name]` (inkl. `ProjectDetail.tsx`) wird **komplett abgeschafft** — Projektdetails gibt es nur noch über das Modal auf der Startseite, für alte wie neue Projekte.

## Betroffene Dateien (Ist-Zustand, bereits gelesen)

- `components/RepoGallery.tsx` — Grid + Modal, holt Daten via `fetch("/api/github/repos")` / `fetch(\`/api/github/repos/${repo.name}\`)`
- `components/ProjectDetail.tsx` + `app/[locale]/project/[project-name]/page.tsx` — wird entfernt
- `app/api/github/repos/route.ts`, `app/api/github/repos/[name]/route.ts` — bleiben unverändert bestehen
- `components/ProjectGallery.tsx` — zeigt Desktop-/Mobile-Mockup-Carousel + Video, wird von beiden Quellen genutzt, holt Bilder via `fetch("/api/check-images?...")`
- `app/api/check-images/route.ts` — liest aktuell `public/images/` per `fs.existsSync` in einer Schleife bis 11
- `lib/r2.ts` — fertiger `S3Client` für R2, bereits mit Zugangsdaten aus `.env.local` (`CLOUDFLARE_R2_ENDPOINT`, `CLOUDFLARE_R2_ACCESS_KEY_ID`, `CLOUDFLARE_R2_SECRET_ACCESS_KEY`)
- `sanity/schemaTypes/project.ts` — existiert bereits, aber mit anderen Feldern (`title`, `slug`, `description`, `coverImage`, `tags`, `liveUrl`, `order`, `isVisible`) als die GitHub-Repo-Form
- `sanity/client.ts` — fertiger `next-sanity`-Client
- `next.config.ts` — `images.remotePatterns` enthält bisher nur `cdn.sanity.io`

## Feld-Mapping (GitHub-Repo → Sanity `project`)

| GitHub-Feld (im Frontend genutzt) | Sanity-Feld | Anmerkung |
|---|---|---|
| `name` (auch für Bild-/Video-Dateinamen-Konvention) | `slug.current` | muss exakt der Dateinamens-Konvention entsprechen, z. B. `mein-projekt` |
| `description` | `description` | unverändert übernehmbar |
| `html_url` ("View on GitHub"-Link) | `liveUrl` | Linktext wird zu "View Project" |
| `topics` | `tags` | bereits vorhanden, nur andere Bezeichnung |
| `created_at` | `_createdAt` (Sanity-Systemfeld, automatisch) | kein eigenes Feld nötig |
| `updated_at` | `_updatedAt` (Sanity-Systemfeld, automatisch) | kein eigenes Feld nötig |
| `languages` (separater GitHub-Call) | **neu:** `languages` (array of string) | muss manuell im Studio gepflegt werden, da Sanity keine Sprachstatistik hat |

`coverImage`, `order`, `isVisible` bleiben im Schema erhalten (ungenutzt von der neuen Logik, aber nicht störend). Auf ein zusätzliches `type` (web/app)-Feld wird bewusst verzichtet, um exakt bei den bestehenden Feldern zu bleiben — kann bei Bedarf später ergänzt werden.

## Implementierung

### 1. Sanity-Schema erweitern
`sanity/schemaTypes/project.ts`: neues Feld `languages` (`type: 'array', of: [{type: 'string'}]`) ergänzen. Keine Breaking Changes an bestehenden Feldern.

### 2. Datenzugriff
Neue Datei `sanity/queries/projects.ts` mit zwei GROQ-Helpern über den bestehenden `client` aus `sanity/client.ts`:
- `getSanityProjects()` — alle `isVisible == true`, sortiert nach `_createdAt desc`
- `getSanityProjectBySlug(slug)` — einzelnes Dokument

Beide mappen das Sanity-Dokument direkt auf dieselbe Form, die `RepoGallery`/`ProjectGallery` heute von GitHub bekommen (`name`, `description`, `html_url`, `topics`, `created_at`, `updated_at`), plus `languages` und `source: "sanity"`.

### 3. Neue API-Routen (parallel zu den GitHub-Routen, diese bleiben unangetastet)
- `app/api/sanity/projects/route.ts` — GET, liefert Array im GitHub-kompatiblen Shape (inkl. `source: "sanity"`)
- `app/api/sanity/projects/[slug]/route.ts` — GET, liefert `{ project, languages }` wie die bestehende GitHub-Detail-Route (inkl. `source: "sanity"` im `project`)

Die GitHub-Routen werden ebenfalls um `source: "github"` in ihrer Antwort ergänzt (minimaler, rückwärtskompatibler Zusatz), damit die zusammengeführte Liste weiß, welche Detail-Route sie beim Öffnen eines Projekts ansprechen muss.

### 4. `RepoGallery.tsx` zu einer gemeinsamen Komponente erweitern
- `fetchRepos` lädt **beide** Listen parallel (`Promise.all` von `/api/github/repos` und `/api/sanity/projects`), führt sie zusammen und sortiert nach `created_at` absteigend.
- React-Key wechselt von `repo.id` auf `` `${item.source}-${item.name}` `` (robuster, da IDs aus zwei Systemen sonst kollidieren könnten).
- `openProject` ruft je nach `item.source` entweder die GitHub- oder die Sanity-Detail-Route auf.
- Preview-Bild-`src` wechselt von lokalem Pfad auf die R2-URL (siehe Punkt 6).
- Rest der Komponente (Modal, Rendering von Tags/Sprachen/Daten, `transformString`, `renderInlineMarkdown`) bleibt unverändert — genau das ist der 1:1-Charakter der Umsetzung.
- Datei wird sinnvollerweise in `PortfolioGallery.tsx` umbenannt (Import in `app/[locale]/page.tsx` entsprechend anpassen), da sie nicht mehr nur "Repos" zeigt.

### 5. Alte Detail-Route entfernen
- `app/[locale]/project/[project-name]/page.tsx` löschen
- `components/ProjectDetail.tsx` löschen
- Sicherstellen, dass keine internen Links mehr auf `/project/...` verweisen (kurze Grep-Kontrolle über `app` und `components`)

### 6. Mockup-Bilder auf Cloudflare R2 umziehen
- Alle Projekt-Mockup-Dateien aus `public/images/` (Muster `*-desktop-*.webp`, `*-mobile-*.webp`, `*-preview.webp` — **nicht** die generischen UI-Assets wie Cursor-Icons oder `header-*.webp`) in den bestehenden R2-Bucket hochladen, unter neuem Prefix `images/` (parallel zu `videos/`). Technisch: Dateien vom Mac in die Cloud-Workspace stagen, dort mit einem kleinen Skript (Node/`@aws-sdk/client-s3`, gleiche Zugangsdaten wie `lib/r2.ts`) hochladen.
- `app/api/check-images/route.ts` umbauen: statt `fs.existsSync`-Schleife über `public/images` eine `ListObjectsV2`-Abfrage auf den R2-Bucket (Prefix `images/${projectName}-desktop-` bzw. `images/${projectName}-mobile-`) mit dem bereits vorhandenen `r2`-Client aus `lib/r2.ts`. Response-Form `{ desktopImages, mobileImages }` bleibt exakt gleich, nur mit R2-URLs (`${NEXT_PUBLIC_R2_PUBLIC_URL}/images/...`) statt lokalen Pfaden — `ProjectGallery.tsx` braucht dadurch **keine** Änderung. Nebeneffekt: die feste Obergrenze von 11 Bildern entfällt, da die Bucket-Liste die tatsächliche Anzahl liefert.
- Preview-Bild-Referenz in `PortfolioGallery.tsx` (Punkt 4) auf `${NEXT_PUBLIC_R2_PUBLIC_URL}/images/${item.name}-preview.webp` umstellen.
- `next.config.ts`: `images.remotePatterns` um den R2-Hostname (`pub-dfcf020ca5ff4b9a957e138d4326bb45.r2.dev`) ergänzen, sonst blockiert Next/Image die externen Bild-URLs.
- Erst nach erfolgreicher Live-Prüfung: die migrierten Dateien aus `public/images/` im Repo löschen (reduziert Repo-/Deploy-Größe spürbar). Dieser Schritt erfolgt bewusst zuletzt, als Cleanup nach Verifikation, nicht vorab.

## Verifikation
1. **Sanity-Testprojekt anlegen**: ein Beispielprojekt im Studio (`studio-mitsch.de/studio`) mit allen Feldern befüllen, inkl. `slug`, `languages`, und passenden R2-Mockup-Dateien (Namenskonvention beachten).
2. **Lokal/Preview prüfen**: Startseite lädt, gemeinsames Grid zeigt GitHub- **und** Sanity-Projekte, Reihenfolge nach Datum stimmt.
3. **Modal-Test**: für je ein GitHub- und ein Sanity-Projekt das Modal öffnen — Beschreibung, Tags, Sprachen, Datum, Link, Mockup-Carousel und Video müssen korrekt erscheinen.
4. **R2-Bilder-Check**: Netzwerk-Tab prüfen, dass Mockup-Bilder von der R2-URL geladen werden (nicht mehr `/images/...` lokal), Status 200/206.
5. **Route-Entfernung bestätigen**: `/project/irgendein-projekt` liefert jetzt 404 (Route existiert nicht mehr), keine toten internen Links mehr vorhanden.
6. **Build-Check**: `npm run build` lokal fehlerfrei, bevor auf Vercel deployed wird.
