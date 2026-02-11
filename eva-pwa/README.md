# EVA Community — PWA

La tua app community, pronta per essere pubblicata.

## Come funziona

Questa è una Progressive Web App (PWA). I tuoi membri possono:
- Aprire il link dal telefono
- Toccare "Aggiungi alla Home" 
- Usarla come un'app nativa — senza App Store

## Pubblicare GRATIS su Vercel

### Primo metodo: drag & drop (più semplice)

1. Vai su **vercel.com** e crea un account gratuito
2. Clicca "Add New" → "Project"
3. Scegli "Upload" e trascina la cartella `eva-pwa`
4. Vercel ti darà un link tipo `eva-pwa.vercel.app`
5. Puoi collegare un dominio personalizzato (es. `app.evacommunity.it`)

### Secondo metodo: con GitHub

1. Crea un account GitHub
2. Crea un nuovo repository e carica i file
3. Collega il repository a Vercel
4. Ogni modifica su GitHub aggiorna automaticamente l'app

## Struttura dei file

```
eva-pwa/
├── index.html          ← L'app completa
├── manifest.json       ← Configurazione PWA (nome, icone, colori)
├── sw.js               ← Service Worker (funziona offline)
├── icons/
│   ├── icon-192.svg
│   ├── icon-512.svg
│   ├── icon-maskable-192.svg
│   └── icon-maskable-512.svg
└── README.md           ← Questo file
```

## Personalizzazioni

### Cambiare i colori
Modifica le variabili CSS in `index.html` dentro il tag `<style>`:
```css
:root {
  --terracotta: #C4704B;
  --olive: #7A8B6F;
  --gold: #C9A96E;
  /* etc. */
}
```

### Aggiungere eventi
Modifica l'array `events` nel tag `<script>` di `index.html`.

### Aggiungere risorse
Modifica l'array `resources` nel tag `<script>`.

## Prossimi passi

Per trasformare questo prototipo in un'app completa con dati reali, servirà:
- **Un backend** per gestire utenti, prenotazioni e post (Supabase è gratuito e semplice)
- **Autenticazione** per il login dei membri
- **Pagamenti** per la membership (Stripe)

Tutto questo può essere aggiunto gradualmente — Claude Code può aiutarti passo per passo.

## Dominio personalizzato

Su Vercel puoi collegare gratuitamente un dominio:
1. Compra un dominio (es. su Namecheap, ~€10/anno)
2. Nelle impostazioni del progetto Vercel → "Domains"
3. Aggiungi il tuo dominio e segui le istruzioni DNS

---

*Fatto con ♥ per EVA Community — Genova*
