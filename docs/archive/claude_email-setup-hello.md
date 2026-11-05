# E-Mail-Setup hello@studio-mitsch.de

Stand: 25.08.2026

## Ziel
hello@studio-mitsch.de soll für alle Mails genutzt werden (Empfang + Versand), professioneller als reine Gmail-Adresse. Zielpostfach: studiomitsch@gmail.com.

## Umgesetztes Setup (kostenlos)
- **Empfang:** E-Mail-Weiterleitung bei do.de (Kundenmenü → E-Mail-Routing) eingerichtet: hello@studio-mitsch.de → studiomitsch@gmail.com. Status: Aktiv.
  - Dabei wurde ein bereits bestehender MX-Record auf Root-Domain überschrieben, der auf Resends "Enable Receiving"-Funktion zeigte (inbound-smtp.eu-west-1.amazonaws.com). Diese Resend-Inbound-Funktion war im Code nirgends angebunden (kein Webhook-Handler dafür im Repo gefunden) und konnte daher gefahrlos ersetzt werden. Resends Versandfunktion (send.studio-mitsch.de Subdomain, DKIM/SPF) bleibt davon unberührt.
- **Versand ("Senden als"):** Resend SMTP (smtp.resend.com, Port 587, User "resend", Passwort = separater Resend API-Key mit Sending-Only-Berechtigung) als externe Adresse in Gmail hinterlegt (Einstellungen → Konten und Import → E-Mail senden als). Funktioniert.
- **Apple Mail:** "Senden als"-Alias wird von Apple Mail nicht automatisch übernommen. Fix: In Mail-Einstellungen → Accounts → Gmail-Konto → E-Mail-Adresse-Dropdown → "E-Mail-Adressen bearbeiten" → per "+" hello@studio-mitsch.de manuell als zusätzliche Adresse hinzufügen. Danach im "Von:"-Feld auswählbar. Umgesetzt und funktioniert.

## Bekanntes Risiko / Re-Check nötig
Google stellt laut mehreren Quellen (Android Authority u.a., Stand August 2026) die "Senden als"-Funktion für Drittanbieter-/externe Adressen bei regulären (Nicht-Workspace-)Gmail-Konten **ab Januar 2027** ein — betrifft Web und Mobile. Das aktuelle Setup (Resend-SMTP als externe Adresse in Gmail, davon abgeleitet auch der Apple-Mail-Alias) würde dann nicht mehr funktionieren.

Entscheidung (25.08.2026): Erstmal beim aktuellen kostenlosen Setup bleiben, Thema vor/bis Januar 2027 erneut aufgreifen. Falls sich bis dahin keine gleichwertige kostenlose Alternative zeigt, Fallback-Optionen:
- Echtes Postfach mit eigenem SMTP/IMAP kaufen (z.B. kleines Mail-Paket bei do.de, wenige Euro/Monat), dann in Apple Mail als eigenständiges Konto (nicht als Gmail-Alias) einrichten.
- Alternativ prüfen, ob Zoho Mail o.ä. bis dahin wieder kostenlosen SMTP/IMAP-Zugang anbietet (Stand August 2026: Free-Plan ist Webmail/App-only, kein IMAP/SMTP mehr).

## Reminder
Vor Januar 2027 nochmal aktiv nachfragen/recherchieren, ob Google die Änderung wie angekündigt umsetzt und ob es dann eine neue kostenlose Lösung gibt.
