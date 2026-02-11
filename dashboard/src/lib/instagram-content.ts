// Campaign data for the Instagram "Da Zero a Comunità" campaign

export const CAMPAIGN = {
  name: 'Da Zero a Comunità',
  handle: '@evathesanctuary',
  eventDate: '2026-03-14T14:00:00',
  startDate: '2026-02-11',
  location: 'Genova',
  capacity: 25,
  goldenThread: 'Cosa ti fa sentire bella?',
  goldenThreadAppears: [
    'Street interviews',
    'Question cards',
    'Stories polls',
    'DMs',
    'Parete d\'Oro',
  ],
} as const

export interface StatCard {
  label: string
  value: string
  detail: string
}

export const OVERVIEW_STATS: StatCard[] = [
  { label: 'Serie Attive', value: '8', detail: 'La Domanda, Per Strada, Lettere, Genova, Alice, Mani, Donne, Specchio' },
  { label: 'Post Feed Pianificati', value: '28', detail: '5 settimane di contenuti' },
  { label: 'Posti Evento', value: '25', detail: 'Dimora Almayer, Centro Storico' },
  { label: 'Obiettivo Follower', value: '800+', detail: 'Al giorno dell\'evento' },
]

export const PROGRESS_LABELS = [
  '11 Feb — Il Seme',
  '18 Feb — Le Radici',
  '25 Feb — Il Fuoco',
  '4 Mar — L\'Invito',
  '14 Mar — L\'Incontro',
]

export interface CalendarDayItem {
  type: 'feed' | 'stories' | 'action' | 'reel'
  series: string
  text: string
}

export interface CalendarDay {
  date: string
  day: string
  items: CalendarDayItem[]
}

export interface CalendarWeek {
  week: number
  title: string
  subtitle: string
  dates: string
  days: CalendarDay[]
}

export const CALENDAR_DATA: CalendarWeek[] = [
  {
    week: 1,
    title: 'Il Seme',
    subtitle: 'Establish the visual world. Plant curiosity. First 50-100 followers.',
    dates: '11–17 Febbraio',
    days: [
      { date: '11 Feb', day: 'Mar', items: [
        { type: 'feed', series: 'Lancio', text: "Profilo live. Primo post: foto Genova + 'Qualcosa sta nascendo.'" },
        { type: 'stories', series: 'Intro', text: "3 Stories: vista finestra, tazza calda, 'Ciao, sono Alice.'" },
        { type: 'action', series: 'DM', text: 'DM a 20 donne conosciute' },
      ]},
      { date: '12 Feb', day: 'Mer', items: [
        { type: 'feed', series: 'La Domanda', text: '#1 — Prima domanda' },
        { type: 'stories', series: 'Lo Specchio', text: "Poll: 'Ti dedichi qualcosa di bello ogni giorno?'" },
        { type: 'action', series: 'Growth', text: 'Follow 30-50 account genovesi' },
      ]},
      { date: '13 Feb', day: 'Gio', items: [
        { type: 'stories', series: 'Alice Parla', text: 'Clip preview del Reel #1' },
      ]},
      { date: '14 Feb', day: 'Ven', items: [
        { type: 'reel', series: 'Alice Parla', text: "#1: 'Perché ho creato EVA'" },
        { type: 'stories', series: 'Behind', text: "'Sto filmando qualcosa in centro...'" },
      ]},
      { date: '15 Feb', day: 'Sab', items: [
        { type: 'feed', series: 'Genova', text: '#1 — Beautiful location shot' },
        { type: 'action', series: 'Filming', text: 'Filmare 4-6 interviste per strada (batch #1)' },
      ]},
      { date: '16 Feb', day: 'Dom', items: [
        { type: 'feed', series: 'Lettere', text: "#1 — Prima lettera 'Alla donna stanca'" },
        { type: 'stories', series: 'Lo Specchio', text: "Quiet Sunday: libro, tè, 'Come stai oggi? Davvero.'" },
      ]},
      { date: '17 Feb', day: 'Lun', items: [
        { type: 'stories', series: 'Lo Specchio', text: 'Engagement quotidiano' },
      ]},
    ],
  },
  {
    week: 2,
    title: 'Le Radici',
    subtitle: 'Start street interviews. Build engagement loops. 200+ followers.',
    dates: '18–24 Febbraio',
    days: [
      { date: '18 Feb', day: 'Lun', items: [
        { type: 'feed', series: 'La Domanda', text: '#2' },
        { type: 'stories', series: 'Lo Specchio', text: 'Question box: risposte alla domanda della settimana scorsa' },
        { type: 'action', series: 'Growth', text: 'Condividere EVA in 2-3 gruppi WhatsApp' },
      ]},
      { date: '19 Feb', day: 'Mar', items: [
        { type: 'reel', series: 'Per Strada', text: '#1 — Primo Reel intervista!' },
        { type: 'stories', series: 'Behind', text: 'Reazioni, behind the scenes' },
      ]},
      { date: '20 Feb', day: 'Mer', items: [
        { type: 'feed', series: 'Mani', text: '#1 — Prima foto mani' },
        { type: 'stories', series: 'Lo Specchio', text: 'This or That' },
      ]},
      { date: '21 Feb', day: 'Gio', items: [
        { type: 'stories', series: 'Alice Parla', text: "#2: 'Cosa NON è EVA' (4-5 clips)" },
      ]},
      { date: '22 Feb', day: 'Ven', items: [
        { type: 'reel', series: 'Per Strada', text: '#2 — Seconda intervista' },
        { type: 'stories', series: 'Lo Specchio', text: 'Slider + risposte' },
      ]},
      { date: '23 Feb', day: 'Sab', items: [
        { type: 'feed', series: 'La Domanda', text: '#3' },
        { type: 'action', series: 'Filming', text: 'Filmare 4-6 interviste (batch #2)' },
      ]},
      { date: '24 Feb', day: 'Dom', items: [
        { type: 'feed', series: 'Genova', text: '#2' },
        { type: 'stories', series: 'Lo Specchio', text: "Soft Sunday: 'Una cosa che mi ha nutrito questa settimana...'" },
      ]},
    ],
  },
  {
    week: 3,
    title: 'Il Fuoco',
    subtitle: 'Reveal the event. Introduce partners. Build elegant FOMO. 400+ followers.',
    dates: '25 Feb – 3 Marzo',
    days: [
      { date: '25 Feb', day: 'Lun', items: [
        { type: 'reel', series: 'Per Strada', text: '#3' },
        { type: 'stories', series: 'Lo Specchio', text: 'Condividere risposte della settimana' },
      ]},
      { date: '26 Feb', day: 'Mar', items: [
        { type: 'feed', series: 'Lettere', text: '#2' },
        { type: 'stories', series: 'Lo Specchio', text: "'Se potessi passare un pomeriggio con 25 donne in un palazzo storico...'" },
      ]},
      { date: '27 Feb', day: 'Mer', items: [
        { type: 'feed', series: 'THE REVEAL', text: "'14 marzo. Genova. 25 donne. La Bellezza che Nutre.'" },
        { type: 'stories', series: 'Evento', text: "Full sequence: cos'è l'evento, come partecipare, WhatsApp" },
        { type: 'action', series: 'Partners', text: 'Condividere con partner, chiedere repost' },
      ]},
      { date: '28 Feb', day: 'Gio', items: [
        { type: 'feed', series: 'La Domanda', text: '#4' },
        { type: 'stories', series: 'Alice Parla', text: "#3: 'La storia del nome EVA'" },
      ]},
      { date: '1 Mar', day: 'Ven', items: [
        { type: 'feed', series: 'Le Donne', text: '#1 — Primo partner (Martina Geroni)' },
        { type: 'stories', series: 'Partners', text: 'Behind the scenes del mondo della partner' },
        { type: 'action', series: 'Partners', text: 'Cross-post con partner' },
      ]},
      { date: '2 Mar', day: 'Sab', items: [
        { type: 'reel', series: 'Per Strada', text: '#4' },
        { type: 'stories', series: 'Lo Specchio', text: "Question box: 'Cosa ti piacerebbe trovare in uno spazio per donne?'" },
      ]},
      { date: '3 Mar', day: 'Dom', items: [
        { type: 'feed', series: 'Mani', text: '#2' },
        { type: 'stories', series: 'Lo Specchio', text: 'Risposte round-up' },
      ]},
    ],
  },
  {
    week: 4,
    title: "L'Invito",
    subtitle: 'Fill the 25 spots. Deepen connection. Create anticipation. 600+ followers.',
    dates: '4–10 Marzo',
    days: [
      { date: '4 Mar', day: 'Lun', items: [
        { type: 'feed', series: 'Le Donne', text: '#2 — La Strega del Castello' },
        { type: 'stories', series: 'Countdown', text: 'Countdown inizia (10 giorni)' },
        { type: 'action', series: 'DM', text: "DM personali a follower attive: 'Ti ci vedi?'" },
      ]},
      { date: '5 Mar', day: 'Mar', items: [
        { type: 'feed', series: 'La Domanda', text: '#5' },
        { type: 'stories', series: 'Evento', text: "Risposte da donne che hanno RSVP'd" },
      ]},
      { date: '6 Mar', day: 'Mer', items: [
        { type: 'reel', series: 'Per Strada', text: '#5 — La migliore' },
        { type: 'stories', series: 'Alice Parla', text: "#4: 'Il 14 marzo — cosa sto preparando'" },
      ]},
      { date: '7 Mar', day: 'Gio', items: [
        { type: 'feed', series: 'Lettere', text: '#3' },
        { type: 'stories', series: 'Lo Specchio', text: "'Mancano 7 giorni. Cosa vorresti sentirti dire?'" },
      ]},
      { date: '8 Mar', day: 'Ven', items: [
        { type: 'feed', series: 'Le Donne', text: '#3 — Teaps' },
        { type: 'stories', series: 'Teaser', text: 'Dettagli preparazione: card, penne, fiori, tè' },
      ]},
      { date: '9 Mar', day: 'Sab', items: [
        { type: 'feed', series: 'Genova', text: "#3 — Il quartiere dell'evento" },
        { type: 'stories', series: 'Walk', text: "'Walking to the venue' — caruggi, luce, porte" },
      ]},
      { date: '10 Mar', day: 'Dom', items: [
        { type: 'feed', series: 'La Domanda', text: '#6 — La più profonda' },
        { type: 'stories', series: 'Countdown', text: "'Tra 4 giorni.'" },
      ]},
    ],
  },
  {
    week: 5,
    title: "L'Incontro",
    subtitle: 'Final momentum. Day-of content. Post-event glow.',
    dates: '11–16+ Marzo',
    days: [
      { date: '11 Mar', day: 'Lun', items: [
        { type: 'reel', series: 'Per Strada', text: '#6 — Ultima intervista' },
        { type: 'stories', series: 'Countdown', text: "'Questa settimana.'" },
        { type: 'action', series: 'DM', text: 'Last call DMs a donne indecise' },
      ]},
      { date: '12 Mar', day: 'Mar', items: [
        { type: 'feed', series: 'Lettere', text: "#4: 'Alla donna che verrà sabato'" },
        { type: 'stories', series: 'Prep', text: 'Fiori, card, venue in preparazione' },
      ]},
      { date: '13 Mar', day: 'Mer', items: [
        { type: 'stories', series: 'Alice', text: "'Domani. Non ci credo. Vi aspetto.'" },
      ]},
      { date: '14 Mar', day: 'SAB', items: [
        { type: 'stories', series: 'EVENTO', text: 'Stories in tempo reale: lo spazio, le donne, la Parete d\'Oro' },
        { type: 'action', series: 'Evento', text: "Un'amica designata filma/fotografa i momenti chiave" },
      ]},
      { date: '15 Mar', day: 'Dom', items: [
        { type: 'feed', series: 'Post-evento', text: 'Prima immagine: la Parete d\'Oro piena di risposte' },
        { type: 'stories', series: 'Gratitudine', text: 'Volti delle donne (con permesso). La magia.' },
      ]},
      { date: '16 Mar', day: 'Lun+', items: [
        { type: 'feed', series: 'Post-evento', text: "Carousel: 'Cosa è successo il 14 marzo'" },
        { type: 'action', series: 'DM', text: 'DM di ringraziamento a ogni partecipante' },
      ]},
    ],
  },
]

export interface ContentItem {
  text: string
  meta: string[]
}

export interface ContentSeries {
  name: string
  freq: string
  items: ContentItem[]
}

export const CONTENT_SERIES: ContentSeries[] = [
  {
    name: 'La Domanda',
    freq: '2x/settimana',
    items: [
      { text: "Qual è l'ultima cosa che hai fatto solo perché ti andava — senza spiegarlo a nessuno?", meta: ['Sett. 1', '12 Feb', 'Card Generator'] },
      { text: 'Se dovessi descrivere come ti senti adesso con un profumo, quale sarebbe?', meta: ['Sett. 2', '18 Feb'] },
      { text: "Quando è stata l'ultima volta che ti sei guardata allo specchio e ti sei piaciuta?", meta: ['Sett. 2', '23 Feb'] },
      { text: "C'è una donna nella tua vita che ti ha insegnato cos'è la bellezza senza mai parlarne?", meta: ['Sett. 3', '28 Feb'] },
      { text: 'Cosa faresti questo sabato se non dovessi rendere conto a nessuno?', meta: ['Sett. 4', '5 Mar'] },
      { text: 'Quale parte di te hai smesso di ascoltare?', meta: ['Sett. 4', '10 Mar'] },
      { text: "Qual è il gesto più bello che qualcuno ha fatto per te e che non hai mai raccontato?", meta: ['Extra'] },
      { text: "Se potessi regalare un'ora a te stessa — un'ora perfetta — come sarebbe?", meta: ['Extra'] },
      { text: 'Cosa ti fa sentire bella? E non intendo esteticamente.', meta: ["Il Filo d'Oro"] },
    ],
  },
  {
    name: 'Per Strada — Domande Intervista',
    freq: '1-2x/settimana',
    items: [
      { text: 'Cosa ti fa sentire bella? E non intendo esteticamente.', meta: ["Il Filo d'Oro", 'Domanda principale'] },
      { text: "C'è un momento nella tua giornata che è solo tuo?", meta: ['Reel 30-90s'] },
      { text: 'Se la bellezza fosse un suono, come suonerebbe per te?', meta: ['Reel 30-90s'] },
      { text: "Qual è il consiglio più bello che ti ha dato una donna?", meta: ['Reel 30-90s'] },
      { text: 'Quando ti senti più viva?', meta: ['Reel 30-90s'] },
      { text: 'Cosa diresti alla te di dieci anni fa?', meta: ['Reel 30-90s'] },
      { text: 'Se potessi insegnare una cosa a tutte le donne, quale sarebbe?', meta: ['Reel 30-90s'] },
    ],
  },
  {
    name: 'Lettere a una donna che non conosco',
    freq: '1x/settimana',
    items: [
      { text: "Alla donna che stasera sta scrollando il telefono\nperché non ha più energia per nient'altro:\n\nsei stanca perché dai tanto.\nNon perché sei rotta.\n\nC'è differenza.", meta: ['Sett. 1', '16 Feb', 'Card Generator'] },
      { text: "Alla donna che ha smesso di dedicarsi cose belle\nperché c'era sempre qualcosa di più urgente:\n\nNiente è più urgente di te.\nNiente.", meta: ['Sett. 3', '26 Feb'] },
      { text: "Alla donna che non sa se è abbastanza:\n\nSei così abbastanza\nche la stanza cambia quando entri.\nE forse non te ne accorgi.\nMa le altre donne sì.", meta: ['Sett. 4', '7 Mar'] },
      { text: "Alla donna che verrà sabato:\n\nnon devi essere pronta.\nNon devi sapere cosa aspettarti.\nDevi solo venire come sei.\n\nNoi ti aspettiamo.\nCon tè caldo e domande belle.\nE la luce giusta.", meta: ['Sett. 5', '12 Mar'] },
    ],
  },
  {
    name: 'Alice Parla — Temi',
    freq: '1x/settimana',
    items: [
      { text: "Perché ho creato EVA — l'origine, la mela, la scelta. Raw, onesta, 90 secondi.", meta: ['Sett. 1', '14 Feb', 'Reel'] },
      { text: 'Cosa NON è EVA — non un workshop, non un circle, non un sales funnel. Un esperimento.', meta: ['Sett. 2', '21 Feb', 'Stories 4-5 clips'] },
      { text: 'La storia del nome — Eva, la donna che ha scelto. Perché riscriviamo quella storia.', meta: ['Sett. 3', '28 Feb', 'Stories'] },
      { text: "Il 14 marzo — cosa sto preparando. Come sarà. L'invito.", meta: ['Sett. 4', '6 Mar', 'Stories'] },
    ],
  },
  {
    name: 'Le Donne di EVA — Partner',
    freq: 'Ultime 2 settimane',
    items: [
      { text: "C'è una donna a Genova che trasforma l'argilla in qualcosa che vuoi tenere tra le mani per sempre. — Martina Geroni, Ceramista", meta: ['Sett. 3', '1 Mar'] },
      { text: "C'è una farmacia di famiglia che è diventata un laboratorio di profumi. La donna che la guida si chiama Caterina. — La Strega del Castello", meta: ['Sett. 4', '4 Mar'] },
      { text: 'Due ragazzi che hanno trasformato una tazza di tè in un atto di cura. Il 14 marzo, la cura è per voi. — Teaps', meta: ['Sett. 4', '8 Mar'] },
    ],
  },
]

export interface HashtagSet {
  label: string
  tags: string
}

export const HASHTAG_SETS: HashtagSet[] = [
  { label: 'Set A — Locale + Brand', tags: '#genova #donneitaliane #bellezzachenutre #evathesanctuary #donnechescelgono' },
  { label: 'Set B — Città + Comunità', tags: '#genovacity #comunitàfemminile #bellezzaautentica #evagenova #genovacentrostorico' },
  { label: 'Set C — Misto', tags: '#genova #donnegenovesi #bellezzachenutre #evathesanctuary #comunitàfemminile' },
  { label: 'Set D — Evento', tags: '#evathesanctuary #evagenova #genova #bellezzachenutre #14marzo #donnechescelgono' },
]

export interface DMTemplate {
  label: string
  text: string
}

export const DM_TEMPLATES: DMTemplate[] = [
  { label: 'Benvenuto — Nuova follower', text: "Ciao [nome], grazie di essere qui. Se hai voglia, dimmi: cosa ti ha portata qui?" },
  { label: 'Risposta a commento/poll', text: "Grazie per quello che hai scritto. Mi ha colpita. Ti va di raccontarmi di più?" },
  { label: 'Ringraziamento per condivisione', text: "Ho visto che hai condiviso il nostro post — grazie di cuore. Cosa ti ha colpita?" },
  { label: 'Invito soft all\'evento', text: "Stiamo organizzando qualcosa di speciale a Genova il 14 marzo. Un pomeriggio per 25 donne. Ti ci vedi?" },
  { label: 'Dettagli evento completi', text: "Il 14 marzo, dalle 14 alle 19, in una dimora storica nel centro di Genova. Tè, ceramica, profumi, tarocchi, e soprattutto: connessione. È gratuito. Se vuoi saperne di più, scrivimi su WhatsApp: +39 348 5284327" },
]

export const WHATSAPP_BRIDGE = {
  principle: 'Instagram attrae. WhatsApp converte.',
  cta: 'Ogni post sull\'evento finisce con: "Scrivimi su WhatsApp"',
  note: 'Non un link tree, non un form — una persona.',
  number: '+39 348 5284327 (Alice)',
}

export interface MetricRow {
  label: string
  values: string[]
}

export const METRIC_ROWS: MetricRow[] = [
  { label: 'Follower', values: ['50-100', '200-300', '400-500', '600-800'] },
  { label: 'Views Reel (media)', values: ['200-500', '500-1K', '1K-3K', '2K-5K'] },
  { label: 'RSVP Evento', values: ['0', '3-5', '10-15', '20-25'] },
  { label: 'Conversazioni DM', values: ['10-20', '30-50', '50-80', '80-100'] },
]

export interface TimeEstimate {
  label: string
  text: string
}

export const TIME_ESTIMATES: TimeEstimate[] = [
  { label: 'Domenica', text: 'Pianifica la settimana. Scrivi caption. Crea 2-3 card di testo.' },
  { label: '1-2 Pomeriggi', text: 'Filma interviste per strada (4-6 per sessione) + foto Genova/Mani.' },
  { label: 'Ogni Giorno (10 min)', text: 'Posta Stories, rispondi ai DM, interagisci con altri account.' },
  { label: 'Totale', text: '~5-7 ore / settimana' },
]

export interface ChecklistWeek {
  week: number
  title: string
  dates: string
  items: string[]
}

export const CHECKLIST_WEEKS: ChecklistWeek[] = [
  {
    week: 1,
    title: 'Il Seme',
    dates: '11-17 Feb',
    items: [
      'Profilo live: foto, bio, link in bio → eva.community',
      "Primo post: foto Genova + 'Qualcosa sta nascendo.'",
      "3 Stories: vista dalla finestra, tazza calda, 'Ciao, sono Alice.'",
      "DM a 20 donne: 'Ho creato una cosa. Ti va di seguirla?'",
      'Follow 30-50 account: donne genovesi, attività locali',
      'La Domanda #1 — card + Stories con sticker domanda',
      "Alice Parla #1: 'Perché ho creato EVA' (Reel)",
      'Genova che Nutre #1 (location shot)',
      'Lettere #1: prima lettera',
      'Filmare batch #1 interviste per strada (4-6 donne)',
      'Creare Highlights: CHI, DOMANDE, GENOVA',
    ],
  },
  {
    week: 2,
    title: 'Le Radici',
    dates: '18-24 Feb',
    items: [
      'La Domanda #2',
      'Per Strada #1: primo Reel intervista',
      'Mani #1: prima foto mani',
      "Alice Parla #2: 'Cosa NON è EVA' (Stories)",
      'Per Strada #2: seconda intervista',
      'La Domanda #3',
      'Genova che Nutre #2',
      'Condividere EVA in 2-3 gruppi WhatsApp',
      'Filmare batch #2 interviste (4-6 donne)',
      'Creare Highlight: DONNE',
    ],
  },
  {
    week: 3,
    title: 'Il Fuoco',
    dates: '25 Feb - 3 Mar',
    items: [
      'Per Strada #3',
      'Lettere #2',
      "THE REVEAL: '14 marzo. Genova. 25 donne.' — post + Stories completa",
      'La Domanda #4',
      "Alice Parla #3: 'La storia del nome EVA'",
      'Le Donne di EVA #1: primo partner',
      'Per Strada #4',
      'Mani #2',
      'Cross-post con partner',
      'Creare Highlight: 14 MARZO',
    ],
  },
  {
    week: 4,
    title: "L'Invito",
    dates: '4-10 Mar',
    items: [
      'Le Donne di EVA #2: secondo partner',
      'Countdown nelle Stories (10 giorni)',
      "DM personali a follower attive: 'Ti ci vedi?'",
      'La Domanda #5',
      'Per Strada #5 (la migliore — salvata per questa settimana)',
      "Alice Parla #4: 'Il 14 marzo — cosa sto preparando'",
      'Lettere #3',
      'Le Donne di EVA #3: terzo partner',
      "Genova che Nutre #3: quartiere dell'evento",
      'La Domanda #6 (la più profonda)',
    ],
  },
  {
    week: 5,
    title: "L'Incontro",
    dates: '11-14+ Mar',
    items: [
      'Per Strada #6: ultima intervista',
      "Lettere #4: 'Alla donna che verrà sabato'",
      "Alice to camera: 'Domani. Vi aspetto.'",
      "Designare un'amica per foto/video durante l'evento",
      "EVENTO: Stories in tempo reale — lo spazio, le donne, la Parete d'Oro",
      "Post post-evento: la Parete d'Oro piena di risposte",
      'Stories di gratitudine + volti delle donne (con permesso)',
      "Carousel: 'Cosa è successo il 14 marzo'",
      'DM di ringraziamento a ogni partecipante',
    ],
  },
]
