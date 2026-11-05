# Studio Mitsch – Schritteplan Marketing & Akquise

Stand: 5. November 2026
Ziel: erste Aufträge ab November 2026, mit Kanälen, die schnell wirken.
Kapazität: 2–4 Fokusstunden pro Tag neben der Ausbildung.
Ausführliche Fassung: Claude Doc „Studio Mitsch – Marketing-Strategie & Angebotspakete“

## Arbeitsweise mit Claude

- Immer nur ein Schritt pro Nachricht, der nächste erst nach Bestätigung
- Bei Listen erst den Überblick, dann Punkt für Punkt
- Lernen durch Selbermachen: Claude erklärt und reviewt, setzt nur auf ausdrückliche Bitte selbst um

---

## Überblick: 8 Punkte

| # | Punkt | Status |
|---|---|---|
| 1 | Kernangebot festlegen | ✅ erledigt |
| 2 | Website auf Kunden ausrichten | 🟡 Sofort-Teil live, Rest später |
| 3 | Warmes Netzwerk aktivieren | 🟡 Stufe A läuft, Stufe B als Nächstes |
| 4 | Referenzen sichtbar machen | ⬜ offen |
| 5 | Lokale Sichtbarkeit in Hamburg | ⬜ offen |
| 6 | Gezielte Kaltakquise | ⬜ offen |
| 7 | Saisonaler Aufhänger („Website fit fürs neue Jahr“) | ⬜ offen |
| 8 | Wochenroutine (fester Akquise-Block) | ⬜ offen |

---

## 1. Kernangebot ✅

Kalkulation: 70 €/Std. Alle Preise Endpreise (Kleinunternehmerin, § 19 UStG). Ansprache: du.

**Paket 1: Website-Check – 129 €**
Kurzbericht (PDF) mit Ampel zu Ladezeit, Barrierefreiheit, SEO, technischer Qualität und KI-Agenten (Lighthouse „Agentic Browsing“), Top 5 Maßnahmen, 15 Min. Besprechung. Bericht in 5 Werktagen. Wird bei Relaunch innerhalb von 4 Wochen voll angerechnet.

**Paket 2: Website-Relaunch – ab 1.400 €**
- One-Pager 1.400 € (bis 6 Sektionen, 2 Wochen ab Inhalten)
- Kleine Website 2.300 € (bis 5 Unterseiten, 3–4 Wochen ab Inhalten)
- Optional: Sanity CMS +600 € / +900 €, Domain (do.de) & Hosting (Vercel) einrichten 90 €
- Zahlung 50 % bei Auftrag, 50 % bei Livegang
- Verträge für Domain und Hosting laufen auf den Namen des Kunden

**Paket 3: Website-Pflege – ab 49 €/Monat**
- Basis 49 €/Monat (mit CMS): Updates, Monitoring, vierteljährlicher Lighthouse-Check
- Plus 99 €/Monat (ohne CMS): zusätzlich Änderungen bis 1 Std./Monat
- Stundenkontingent: 5 Std. für 330 €, 12 Monate gültig
- Mindestlaufzeit 3 Monate, Reaktionszeit 2 Werktage
- Beim Relaunch: 3 Monate Basis inklusive
- Testphase: den nächsten 3–5 Kunden anbieten, dann Preis oder Form prüfen

---

## 2. Website auf Kunden ausrichten 🟡

**Sofort – erledigt:**
- Skill-Balken und Tool-Liste entfernt
- Leistungs-Sektion mit den 3 Paketen ist live
- Figma-Entwurf: Datei „Studio-Mitsch“, Frames „Leistungen – Desktop“ und „Leistungen – Mobile“

**Später, parallel zur Akquise:**
- Neue Seitenstruktur aus Kundensicht
- Hero-Text auf Kunden ausrichten
- Projekte als Referenzen statt Technik-Demos (hängt mit Punkt 4 zusammen)

**Technik-Notizen:**
- Projekt liegt jetzt auf der internen Platte: `~/Projects/studio-mitsch/mitsch-website`
- Ursache der Build-Probleme: langsames externes Laufwerk (halb geschriebene Pakete in `node_modules`)
- Build-Warnungen behoben: middleware → proxy, `@sanity/image-url` Named Export, Stripe-Webhook
- Umsetzung der Sektion läuft in Claude Code (Übergabe-Datei `docs/handoff-leistungen.md`)

---

## 3. Warmes Netzwerk aktivieren 🟡

**Ablauf:** Kontaktliste → Nachricht → Versenden und einmal nachfassen

**Nachrichten-Aufbau (4–6 Sätze):**
persönlicher Einstieg → konkreter Anlass → Angebot in einem Satz → niedrigschwelliger nächster Schritt (Telefonat, unverbindlicher Blick) → kurze Empfehlungsbitte

**Stufe A – konkreter Bedarf:**
- Amrei: Umzug Strapi → Sanity (Kosten bei Render entfallen, kein Server mehr). Medien liegen auf Cloudflare R2, Videos können dort bleiben. Aufwand ca. 8–12 Std. Sonderpreis, weil Miriam das jetzige System gewählt hat. → Nachricht raus
- Katti: CMS einbauen. Früherer Preis (1.800 €) durch Auftakttreffen und mehr Abstimmung gerechtfertigt. → Nachricht raus
- Nina: Website-Check, Multiplikatorin, eventuell private Website → Nachricht raus
- Paulina: kein Verkaufsversuch (sparsam, Seite gepflegt). Im Atelier ansprechen mit Alt-Text-Tipp und konkreter Empfehlungsbitte.

**Stufe B – Website-Check anbieten und Empfehlungen (als Nächstes):**
Kevin (Computerdoktor) und Sven (Schnittraum) zuerst, dafür feste Empfehlungsabsprache überlegen. Dann Torben, L’Quan, Sandra, Café Albatros, Dr. Gähler. Sistahh zusätzlich um ein Testimonial bitten (für Punkt 4).

**Stufe C – später, nicht für November:**
Tilemann-Hort, Schule Richardstraße, Klosterschule, Lola Rogge Schule, Hamburg Musical Company, TH Eilbeck. Institutionen entscheiden langsam; nur vorziehen, wenn eine Entscheiderin persönlich bekannt ist.

**Gruppenchats:** höchstens ein lockerer Beitrag, nur wenn dort üblich. Bekannte Eltern lieber direkt anschreiben.

---

## Offene To-dos

- [ ] **Mi, 11. November:** bei Amrei, Katti und Nina nachfassen, falls keine Antwort kam
- [ ] **Nächste Woche:** Paulina im Atelier ansprechen (vorher prüfen, ob Adobe Portfolio Alt-Texte unterstützt)
- [ ] Sonderpreis für Amrei festlegen, bevor ihr telefoniert
- [ ] Stufe B starten: Kevin und Sven
- [ ] Paket 2 ergänzen: „inklusive Auftaktgespräch (bis 30 Min.)“, weitere Termine nach Aufwand; auf Website und in Sanity nachziehen
- [ ] Website-Check einmal an einer echten Seite testen und Zeit stoppen
- [ ] Aktuellen Preis von Vercel Pro prüfen (Hobby-Plan nur für nicht-kommerzielle Nutzung)
- [ ] Übergabe-Checkliste: Sanity und Vercel in der Datenschutzerklärung des Kunden nennen
- [ ] Später: Rest des Website-Relaunchs (Struktur, Hero-Text, Referenzen)

---

## Gelernt

- Lighthouse in Chrome DevTools: Inkognito, DevTools angedockt, während des Laufs nichts anklicken. Bei NO_FCP-Fehler als Gegencheck PageSpeed Insights.
- Lighthouse-Werte nie roh weitergeben, sondern übersetzen: Was heißt das für diese Kundin?
- Nicht die ganze Analyse gratis herausgeben: ein Befund als Aufhänger, der Rest ist der bezahlte Check.
- Kostenersparnis nur als Argument nutzen, wenn die Rechnung für den Kunden aufgeht.
- Abstimmungszeit ist ein echter Kostenfaktor und gehört in den Paketumfang.
