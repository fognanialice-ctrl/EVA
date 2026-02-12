export type CardSeriesId = 'domanda' | 'lettera' | 'genova' | 'poll' | 'slider' | 'tot' | 'qbox'

export type CardInteractive = 'poll' | 'slider' | 'tot' | 'qbox'

export type CardColorStyleId = 'cream' | 'terracotta' | 'night' | 'burgundy'

export interface CardColorConfig {
  id: CardColorStyleId
  name: string
  bg: string
  accent: string
  text: string
  labelColor: string
  watermarkColor: string
  interactiveBg: string
  interactiveText: string
  swatchGradient: string
}

export interface CardPreset {
  text: string
  caption?: string
  optionA?: string
  optionB?: string
  emoji?: string
}

export interface CardSeriesConfig {
  id: CardSeriesId
  label: string
  tabLabel: string
  italic: boolean
  interactive?: CardInteractive
  presets: CardPreset[]
}

export const CARD_COLOR_CONFIGS: Record<CardColorStyleId, CardColorConfig> = {
  cream: {
    id: 'cream',
    name: 'Crema',
    bg: '#FAF7F2',
    accent: '#C67A5C',
    text: '#1A1714',
    labelColor: '#C67A5C',
    watermarkColor: '#9A8E86',
    interactiveBg: '#E8E2DA',
    interactiveText: '#1A1714',
    swatchGradient: 'linear-gradient(135deg, #FAF7F2, #F3EEE7)',
  },
  terracotta: {
    id: 'terracotta',
    name: 'Terracotta',
    bg: '#C67A5C',
    accent: '#FAF7F2',
    text: '#FAF7F2',
    labelColor: 'rgba(250,247,242,0.7)',
    watermarkColor: 'rgba(250,247,242,0.3)',
    interactiveBg: 'rgba(250,247,242,0.2)',
    interactiveText: '#FAF7F2',
    swatchGradient: 'linear-gradient(135deg, #C67A5C, #b06a4e)',
  },
  night: {
    id: 'night',
    name: 'Notte',
    bg: '#080C12',
    accent: '#B59A5B',
    text: '#FAF7F2',
    labelColor: '#B59A5B',
    watermarkColor: 'rgba(250,247,242,0.15)',
    interactiveBg: 'rgba(250,247,242,0.1)',
    interactiveText: '#FAF7F2',
    swatchGradient: 'linear-gradient(135deg, #080C12, #141a24)',
  },
  burgundy: {
    id: 'burgundy',
    name: 'Borgogna',
    bg: '#6B2D3E',
    accent: '#B59A5B',
    text: '#FAF7F2',
    labelColor: '#B59A5B',
    watermarkColor: 'rgba(250,247,242,0.2)',
    interactiveBg: 'rgba(250,247,242,0.15)',
    interactiveText: '#FAF7F2',
    swatchGradient: 'linear-gradient(135deg, #6B2D3E, #4a1f2b)',
  },
}

export const CARD_SERIES: CardSeriesConfig[] = [
  {
    id: 'domanda',
    label: 'LA DOMANDA',
    tabLabel: 'La Domanda',
    italic: true,
    presets: [
      { text: "Qual è l'ultima cosa che hai fatto solo perché ti andava — senza spiegarlo a nessuno?", caption: "A volte le cose più belle sono quelle che facciamo senza un motivo.\n\nTi va di dirmelo? Anche solo a te stessa.\n\n#evathesanctuary #genova #donnechescelgono #bellezzachenutre #donneitaliane" },
      { text: "Se dovessi descrivere come ti senti adesso con un profumo, quale sarebbe?", caption: "Non cercare la risposta giusta. Cerca quella vera.\n\nSe ti va, scrivimelo nei commenti. O in un messaggio. O sussurralo al vento.\n\n#evathesanctuary #genovacity #bellezzaautentica #comunitàfemminile #evagenova" },
      { text: "Quando è stata l'ultima volta che ti sei guardata allo specchio e ti sei piaciuta?", caption: "Non per come apparivi. Per come eri.\n\nRaccontamelo, se ti va.\n\n#evathesanctuary #genova #donnechescelgono #bellezzachenutre #donnegenovesi" },
      { text: "C'è una donna nella tua vita che ti ha insegnato cos'è la bellezza senza mai parlarne?", caption: "Dedicale un pensiero. Anche adesso.\n\nSe vuoi, taggala qui sotto. O scrivile.\n\n#evathesanctuary #genova #donneitaliane #bellezzachenutre #comunitàfemminile" },
      { text: "Cosa faresti questo sabato se non dovessi rendere conto a nessuno?", caption: "Non quello che dovresti fare. Quello che vuoi.\n\nScrivimelo. Lo custodisco.\n\n#evathesanctuary #genovacity #donnechescelgono #bellezzaautentica #evagenova" },
      { text: "Quale parte di te hai smesso di ascoltare?", caption: "Forse è ora di riaccendere quel volume.\n\nTi aspetto nei messaggi. O qui sotto. Come preferisci.\n\n#evathesanctuary #genova #donneitaliane #bellezzachenutre #donnechescelgono" },
      { text: "Qual è il gesto più bello che qualcuno ha fatto per te e che non hai mai raccontato?", caption: "Certe cose si tengono strette. Ma a volte fa bene dirle.\n\nTi ascolto.\n\n#evathesanctuary #genova #bellezzachenutre #comunitàfemminile #donnegenovesi" },
      { text: "Se potessi regalare un'ora a te stessa — un'ora perfetta — come sarebbe?", caption: "Un'ora. Solo tua. Nessun dovere.\n\nDescrivimela.\n\n#evathesanctuary #genovacity #bellezzaautentica #donnechescelgono #evagenova" },
      { text: "Cosa ti fa sentire bella? E non intendo esteticamente.", caption: "La domanda che conta.\n\nRispondimi. Anche in un messaggio privato.\n\n#evathesanctuary #genova #bellezzachenutre #donneitaliane #donnechescelgono" },
    ],
  },
  {
    id: 'lettera',
    label: 'LETTERE A UNA DONNA CHE NON CONOSCO',
    tabLabel: 'Lettere',
    italic: false,
    presets: [
      { text: "Alla donna che stasera sta scrollando il telefono\nperché non ha più energia per nient'altro:\n\nsei stanca perché dai tanto.\nNon perché sei rotta.\n\nC'è differenza.", caption: "Se la conosci, mandagliela.\nSe sei tu, tienila.\n\n#evathesanctuary #genova #donneitaliane #bellezzachenutre #comunitàfemminile" },
      { text: "Alla donna che ha smesso di dedicarsi cose belle\nperché c'era sempre qualcosa di più urgente:\n\nNiente è più urgente di te.\nNiente.", caption: "Salvala per quando ne hai bisogno.\nO mandala a chi ne ha bisogno adesso.\n\n#evathesanctuary #genovacity #donnechescelgono #bellezzaautentica #evagenova" },
      { text: "Alla donna che non sa se è abbastanza:\n\nSei così abbastanza\nche la stanza cambia quando entri.\nE forse non te ne accorgi.\nMa le altre donne sì.", caption: "Lo pensavo e l'ho scritto.\nForse qualcuna ha bisogno di leggerlo stasera.\n\n#evathesanctuary #genova #donneitaliane #bellezzachenutre #donnechescelgono" },
      { text: "Alla donna che verrà sabato:\n\nnon devi essere pronta.\nNon devi sapere cosa aspettarti.\nDevi solo venire come sei.\n\nNoi ti aspettiamo.\nCon tè caldo e domande belle.\nE la luce giusta.", caption: "Sabato 14 marzo. Genova.\nL'incontro più bello dell'anno.\n\nScrivimi se vuoi esserci.\n\n#evathesanctuary #evagenova #genova #bellezzachenutre #14marzo" },
    ],
  },
  {
    id: 'genova',
    label: 'GENOVA CHE NUTRE',
    tabLabel: 'Genova',
    italic: false,
    presets: [
      { text: "Luce di febbraio sui tetti.", caption: "Genova.\n\n#genova #genovacity #evathesanctuary" },
      { text: "Via Garibaldi, le cinque del pomeriggio.", caption: "#genova #genovacentrostorico #evathesanctuary" },
      { text: "Il mare di Genova quando non lo guarda nessuno.", caption: "#genova #genovacity #evathesanctuary #bellezzaautentica" },
      { text: "Caffè. Silenzio. Centro storico.", caption: "#genova #genovacentrostorico #evathesanctuary" },
      { text: "I colori di Genova, tra la pietra.", caption: "#genova #genovacity #evathesanctuary #bellezzachenutre" },
      { text: "Mercato Orientale, mattina presto.", caption: "#genova #genovacity #evathesanctuary" },
    ],
  },
  {
    id: 'poll',
    label: 'LO SPECCHIO',
    tabLabel: 'Poll',
    italic: false,
    interactive: 'poll',
    presets: [
      { text: "Oggi ti sei dedicata qualcosa di bello?", optionA: "Sì", optionB: "Non ancora" },
      { text: "Stasera esci o resti con te stessa?", optionA: "Esco", optionB: "Resto" },
      { text: "L'ultima volta che hai detto 'no' a qualcosa che non sentivi?", optionA: "Ieri", optionB: "Non me lo ricordo" },
    ],
  },
  {
    id: 'slider',
    label: 'LO SPECCHIO',
    tabLabel: 'Slider',
    italic: false,
    interactive: 'slider',
    presets: [
      { text: "Quanto ti sei ascoltata oggi?", emoji: "❤️" },
      { text: "Quanto ti senti viva in questo momento?", emoji: "🔥" },
      { text: "Quanto sei stata gentile con te stessa oggi?", emoji: "🌸" },
    ],
  },
  {
    id: 'tot',
    label: 'LO SPECCHIO',
    tabLabel: 'This or That',
    italic: false,
    interactive: 'tot',
    presets: [
      { text: "Cosa scegli?", optionA: "Caffè in silenzio", optionB: "Caffè con un'amica" },
      { text: "Cosa scegli?", optionA: "Mare d'inverno", optionB: "Caruggi al tramonto" },
      { text: "Cosa scegli?", optionA: "Un libro e il divano", optionB: "Una passeggiata senza meta" },
      { text: "Cosa scegli?", optionA: "Dire tutto", optionB: "Tenere qualcosa per sé" },
    ],
  },
  {
    id: 'qbox',
    label: 'LO SPECCHIO',
    tabLabel: 'Question Box',
    italic: false,
    interactive: 'qbox',
    presets: [
      { text: "Dimmi una cosa bella che è successa oggi. Anche piccola." },
      { text: "Cosa ti ha nutrito questa settimana?" },
      { text: "Cosa diresti alla te di stamattina?" },
      { text: "Se potessi passare un pomeriggio con 25 donne in un palazzo storico di Genova..." },
    ],
  },
]

export const CARD_SERIES_MAP: Record<CardSeriesId, CardSeriesConfig> = Object.fromEntries(
  CARD_SERIES.map(s => [s.id, s])
) as Record<CardSeriesId, CardSeriesConfig>
