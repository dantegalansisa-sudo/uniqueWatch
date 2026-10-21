export type L = { en: string; es: string };

export type Condition = 'unworn' | 'excellent' | 'very-good';
export type Set = 'full-set' | 'box-only' | 'watch-only';

export interface Watch {
  slug: string;
  brand: string;
  model: string;
  nickname?: string;
  ref: string;
  year: number;
  price: number | null; // null → price on request
  condition: Condition;
  set: Set;
  img: string;
  wrist?: string;
  tone: string; // soft card backdrop
  ink: string; // deep accent for typography on the card
  tag?: L;
  specs: {
    case: string;
    material: string;
    dial: string;
    movement: string;
    caliber: string;
    power: string;
    water: string;
    bracelet: string;
    crystal: string;
  };
  description: L;
}

export const BRANDS = [
  'Rolex',
  'Patek Philippe',
  'Audemars Piguet',
  'Cartier',
  'Richard Mille',
  'Omega',
  'Breitling',
] as const;

export const WATCHES: Watch[] = [
  {
    slug: 'cartier-santos-dumont-rose-gold',
    brand: 'Cartier',
    model: 'Santos-Dumont',
    nickname: 'Double Tour',
    ref: 'WGSA0021',
    year: 2024,
    price: 14850,
    condition: 'unworn',
    set: 'full-set',
    img: '/img/w/santos-dumont.webp',
    wrist: '/img/m/woman-cartier.webp',
    tone: '#ECE4D8',
    ink: '#5B4632',
    tag: { en: 'Signature piece', es: 'Pieza firma' },
    specs: {
      case: '43.5 × 31.4 mm',
      material: '18k rose gold',
      dial: 'Silvered opaline, Roman numerals',
      movement: 'Manual winding',
      caliber: '430 MC',
      power: '38 hours',
      water: '30 m',
      bracelet: 'Taupe calfskin, double-tour, ardillon buckle',
      crystal: 'Sapphire',
    },
    description: {
      en: 'Born from Louis Cartier’s friendship with aviator Alberto Santos-Dumont, this is the wristwatch that started it all. A softened rose-gold case, a sapphire cabochon crown and a double-tour strap that wraps the wrist twice — quiet, sculptural, unmistakable.',
      es: 'Nacido de la amistad entre Louis Cartier y el aviador Alberto Santos-Dumont, es el reloj de pulsera que lo empezó todo. Caja en oro rosa, corona con cabujón de zafiro y una correa de doble vuelta que abraza la muñeca dos veces — silencioso, escultural, inconfundible.',
    },
  },
  {
    slug: 'rolex-submariner-date-two-tone-blue',
    brand: 'Rolex',
    model: 'Submariner Date',
    nickname: 'Bluesy',
    ref: '126613LB',
    year: 2023,
    price: 16950,
    condition: 'excellent',
    set: 'full-set',
    img: '/img/w/submariner.webp',
    wrist: '/img/m/wrist-blue.webp',
    tone: '#DCE3EE',
    ink: '#1F3558',
    tag: { en: 'Just in', es: 'Recién llegado' },
    specs: {
      case: '41 mm',
      material: 'Oystersteel & 18k yellow gold',
      dial: 'Royal blue, Chromalight',
      movement: 'Automatic',
      caliber: 'Rolex 3235',
      power: '70 hours',
      water: '300 m',
      bracelet: 'Oyster, Glidelock clasp',
      crystal: 'Sapphire, Cyclops lens',
    },
    description: {
      en: 'The “Bluesy” — Rolesor two-tone with a royal blue Cerachrom bezel that shifts from navy to electric in the sun. Serviced condition, crisp case lines, complete with box, warranty card and hang tags.',
      es: 'El “Bluesy” — Rolesor bicolor con bisel Cerachrom azul real que cambia de marino a eléctrico bajo el sol. Caja con líneas nítidas, completo con estuche, tarjeta de garantía y etiquetas.',
    },
  },
  {
    slug: 'rolex-daytona-panda-white',
    brand: 'Rolex',
    model: 'Cosmograph Daytona',
    nickname: 'Panda',
    ref: '126500LN',
    year: 2024,
    price: 31500,
    condition: 'unworn',
    set: 'full-set',
    img: '/img/w/daytona.webp',
    wrist: '/img/m/man-beige.webp',
    tone: '#E8E6E1',
    ink: '#1D1C1A',
    tag: { en: 'Most wanted', es: 'El más buscado' },
    specs: {
      case: '40 mm',
      material: 'Oystersteel',
      dial: 'White lacquer, black counters',
      movement: 'Automatic chronograph',
      caliber: 'Rolex 4131',
      power: '72 hours',
      water: '100 m',
      bracelet: 'Oyster, Oysterlock clasp',
      crystal: 'Sapphire',
    },
    description: {
      en: 'The new-generation Daytona with the 4131 calibre and refined, thinner lugs. White lacquer dial, black Cerachrom tachymeter — the “Panda” is the most requested Rolex we source. Unworn, stickers on.',
      es: 'El Daytona de nueva generación con calibre 4131 y asas más finas. Esfera lacada blanca y bisel taquimétrico Cerachrom negro — el “Panda” es el Rolex más solicitado. Sin usar, con plásticos.',
    },
  },
  {
    slug: 'patek-philippe-nautilus-5711-blue',
    brand: 'Patek Philippe',
    model: 'Nautilus',
    ref: '5711/1A-010',
    year: 2020,
    price: 128000,
    condition: 'excellent',
    set: 'full-set',
    img: '/img/w/nautilus.webp',
    wrist: '/img/m/man-navy.webp',
    tone: '#D9E1EA',
    ink: '#1C2E46',
    tag: { en: 'Discontinued', es: 'Descontinuado' },
    specs: {
      case: '40 mm',
      material: 'Stainless steel',
      dial: 'Blue gradient, horizontal embossing',
      movement: 'Automatic',
      caliber: '26-330 S C',
      power: '45 hours',
      water: '120 m',
      bracelet: 'Integrated steel, fold-over clasp',
      crystal: 'Sapphire, display caseback',
    },
    description: {
      en: 'Gérald Genta’s porthole, in its most iconic form. The 5711/1A blue dial was retired in 2021 and remains the benchmark of the integrated-bracelet sports watch. Full set with Patek Philippe Certificate of Origin.',
      es: 'El ojo de buey de Gérald Genta en su forma más icónica. La esfera azul 5711/1A se retiró en 2021 y sigue siendo la referencia del reloj deportivo de brazalete integrado. Juego completo con Certificado de Origen Patek Philippe.',
    },
  },
  {
    slug: 'audemars-piguet-royal-oak-15510st-blue',
    brand: 'Audemars Piguet',
    model: 'Royal Oak Selfwinding',
    ref: '15510ST.OO.1320ST.06',
    year: 2023,
    price: 46500,
    condition: 'excellent',
    set: 'full-set',
    img: '/img/w/royal-oak.webp',
    tone: '#DDE2E8',
    ink: '#22344E',
    specs: {
      case: '41 mm',
      material: 'Stainless steel',
      dial: 'Blue “Grande Tapisserie”',
      movement: 'Automatic',
      caliber: 'AP 4302',
      power: '70 hours',
      water: '50 m',
      bracelet: 'Integrated steel, AP folding clasp',
      crystal: 'Sapphire, display caseback',
    },
    description: {
      en: 'Eight hexagonal screws, an octagonal bezel and the Grande Tapisserie dial — the 1972 icon, refined. Hand-finished brushed and polished surfaces in excellent condition, with AP box and warranty card.',
      es: 'Ocho tornillos hexagonales, bisel octogonal y esfera Grande Tapisserie — el ícono de 1972, refinado. Superficies cepilladas y pulidas a mano en excelente estado, con estuche AP y tarjeta de garantía.',
    },
  },
  {
    slug: 'richard-mille-rm-011-skeleton',
    brand: 'Richard Mille',
    model: 'RM 011 Felipe Massa',
    ref: 'RM011 NTPT',
    year: 2021,
    price: null,
    condition: 'excellent',
    set: 'full-set',
    img: '/img/w/rm-skeleton.webp',
    tone: '#E5E2E7',
    ink: '#201D24',
    tag: { en: 'By appointment', es: 'Con cita' },
    specs: {
      case: '50 × 40.1 mm',
      material: 'NTPT carbon',
      dial: 'Skeletonized, flyback chronograph',
      movement: 'Automatic flyback chronograph',
      caliber: 'RMAC1',
      power: '55 hours',
      water: '50 m',
      bracelet: 'White rubber strap',
      crystal: 'Sapphire, anti-reflective',
    },
    description: {
      en: 'A racing machine for the wrist: skeletonized flyback chronograph with annual calendar, housed in featherweight NTPT carbon. Offered privately — pricing and provenance shared on request through our concierge.',
      es: 'Una máquina de carreras para la muñeca: cronógrafo flyback esqueletado con calendario anual, en carbono NTPT ultraligero. Venta privada — precio y procedencia disponibles a petición con nuestro concierge.',
    },
  },
  {
    slug: 'rolex-day-date-40-olive-green',
    brand: 'Rolex',
    model: 'Day-Date 40',
    nickname: 'Olive',
    ref: '228238',
    year: 2022,
    price: 52900,
    condition: 'excellent',
    set: 'full-set',
    img: '/img/w/day-date.webp',
    wrist: '/img/m/hand.webp',
    tone: '#DFE6DC',
    ink: '#24391F',
    specs: {
      case: '40 mm',
      material: '18k yellow gold',
      dial: 'Olive green sunburst',
      movement: 'Automatic',
      caliber: 'Rolex 3255',
      power: '70 hours',
      water: '100 m',
      bracelet: 'President, concealed Crownclasp',
      crystal: 'Sapphire, Cyclops lens',
    },
    description: {
      en: 'The “President”. Solid 18k yellow gold with the olive-green sunburst dial and fluted bezel — the watch of heads of state, in its most expressive colour. Full set, 2022 warranty card.',
      es: 'El “President”. Oro amarillo macizo de 18k con esfera verde oliva y bisel estriado — el reloj de jefes de estado en su color más expresivo. Juego completo, tarjeta de garantía 2022.',
    },
  },
  {
    slug: 'cartier-tank-louis-cartier-yellow-gold',
    brand: 'Cartier',
    model: 'Tank Louis Cartier',
    ref: 'WGTA0011',
    year: 2023,
    price: 11200,
    condition: 'very-good',
    set: 'box-only',
    img: '/img/w/tank.webp',
    wrist: '/img/m/woman-white.webp',
    tone: '#EBDFD2',
    ink: '#4A2E1C',
    specs: {
      case: '33.7 × 25.5 mm',
      material: '18k yellow gold',
      dial: 'Silvered, Roman numerals',
      movement: 'Manual winding',
      caliber: '1917 MC',
      power: '38 hours',
      water: '30 m',
      bracelet: 'Brown alligator, ardillon buckle',
      crystal: 'Sapphire',
    },
    description: {
      en: 'Inspired by the tanks of 1917, refined by Louis Cartier himself. Brancards, railway minute track, blued steel sword hands and a sapphire cabochon — the most elegant rectangle in watchmaking.',
      es: 'Inspirado en los tanques de 1917 y refinado por el propio Louis Cartier. Brancards, minutería tipo ferrocarril, agujas de acero azulado y cabujón de zafiro — el rectángulo más elegante de la relojería.',
    },
  },
  {
    slug: 'cartier-santos-de-cartier-large-steel',
    brand: 'Cartier',
    model: 'Santos de Cartier',
    ref: 'WSSA0018',
    year: 2023,
    price: 7450,
    condition: 'excellent',
    set: 'full-set',
    img: '/img/w/santos.webp',
    wrist: '/img/m/woman-cartier.webp',
    tone: '#E6E5E1',
    ink: '#2A2A28',
    specs: {
      case: '39.8 mm',
      material: 'Stainless steel',
      dial: 'Silvered opaline, Roman numerals',
      movement: 'Automatic',
      caliber: '1847 MC',
      power: '42 hours',
      water: '100 m',
      bracelet: 'Steel with QuickSwitch & SmartLink',
      crystal: 'Sapphire',
    },
    description: {
      en: 'Exposed screws, a square case and an integrated bracelet you can resize without tools. A modern classic that moves from boardroom to beach without a second thought.',
      es: 'Tornillos visibles, caja cuadrada y brazalete integrado ajustable sin herramientas. Un clásico moderno que pasa de la sala de juntas a la playa sin pensarlo dos veces.',
    },
  },
  {
    slug: 'omega-seamaster-diver-300m-blue',
    brand: 'Omega',
    model: 'Seamaster Diver 300M',
    ref: '210.30.42.20.03.001',
    year: 2024,
    price: 5250,
    condition: 'unworn',
    set: 'full-set',
    img: '/img/w/seamaster.webp',
    wrist: '/img/m/man-navy.webp',
    tone: '#D7E0EA',
    ink: '#1A3050',
    specs: {
      case: '42 mm',
      material: 'Stainless steel',
      dial: 'Blue laser-engraved waves',
      movement: 'Automatic, Master Chronometer',
      caliber: 'Omega 8800',
      power: '55 hours',
      water: '300 m',
      bracelet: 'Steel, diver extension',
      crystal: 'Sapphire, display caseback',
    },
    description: {
      en: 'The diver of choice for a certain British agent. METAS-certified Master Chronometer, ceramic bezel and laser-engraved wave dial. Unworn with Omega card dated 2024.',
      es: 'El reloj de buceo elegido por cierto agente británico. Master Chronometer certificado METAS, bisel cerámico y esfera con olas grabadas a láser. Sin usar, tarjeta Omega fechada 2024.',
    },
  },
  {
    slug: 'breitling-navitimer-b01-43-blue',
    brand: 'Breitling',
    model: 'Navitimer B01 Chronograph 43',
    ref: 'AB0138211C1A1',
    year: 2022,
    price: 7900,
    condition: 'excellent',
    set: 'full-set',
    img: '/img/w/navitimer.webp',
    tone: '#DEE2EC',
    ink: '#1D2A4A',
    specs: {
      case: '43 mm',
      material: 'Stainless steel',
      dial: 'Blue, contrasting cream counters',
      movement: 'Automatic chronograph',
      caliber: 'Breitling B01',
      power: '70 hours',
      water: '30 m',
      bracelet: 'Seven-row steel',
      crystal: 'Sapphire, display caseback',
    },
    description: {
      en: 'Since 1952, the pilot’s instrument: circular slide rule bezel, in-house B01 chronograph and the AOPA wings. A legitimate tool, finished like jewellery.',
      es: 'Desde 1952, el instrumento del piloto: regla de cálculo circular, cronógrafo B01 de manufactura y las alas AOPA. Una herramienta auténtica, terminada como joya.',
    },
  },
];

export const bySlug = (slug?: string) => WATCHES.find((w) => w.slug === slug);

export const fmtPrice = (n: number | null) =>
  n == null
    ? null
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

// Estimated monthly payment for financing badges (Affirm via Stripe, 12 mo, illustrative)
export const monthly = (n: number | null) => (n == null ? null : fmtPrice(Math.ceil(n / 12)));
