/**
 * Copy for the SBI Securities pre-login home page.
 *
 * Transcribed from the Figma sources so the sections stay data-driven:
 *   desktop  Pre-Login Home Page Sprint 1        -> HomePage - Desktop  1:56196
 *   mobile   Pre-Login Home Page Sprint 1 mobile -> HomePage - Mobile   0:33272
 */

export const BRAND = {
  name: "SBI Securities",
  legalName: "SBICAP Securities Limited",
  address: "Marathon Futurex, B-wing, 12th Floor, Lower Parel East, Mumbai – 400013",
  phone: "022 6854 5555 / 022 4001 4155",
  email: "helpdesk@sbicapsec.com",
};

/* --- top nav ------------------------------------------------------------- */

export const TOP_NAV = [
  { label: "Trade & Invest", href: "#trade-and-invest" },
  { label: "Loans and Insurance", href: "#loans-and-insurance" },
  { label: "Research", href: "#research" },
  { label: "Investor Awareness", href: "#investor-awareness" },
  { label: "More", href: "#more" },
] as const;

export const SEARCH_PLACEHOLDER = "Search for Stocks, F&O, MF and More";

/* --- hero ---------------------------------------------------------------- */

export const HERO = {
  titleLead: "Smart Investing with",
  /** Cycles in place inside a 112px window — "Hero Banner Text" in Figma. */
  rotatingLines: [
    ["Free Intraday", "Trading*"],
    ["0% Interest on MTF", "for 23 days"],
    ["₹20/order for carry", "forward trades"],
  ],
  subtext: ["SBI Securities empowers every investor.", "From first SIP to full portfolio."],
  watermarkLeft: "TRADE",
  watermarkRight: "INVEST",
  form: {
    mobileLabel: "Enter Mobile no.",
    mobilePlaceholder: "Enter your mobile number",
    mobileHelp: "Enter 10 digits. We will send an OTP to it",
    nameLabel: "Enter Full Name",
    namePlaceholder: "Enter your full name",
    consent: "I agree to terms and conditions",
    submit: "Get Started",
  },
  /**
   * The mobile hero puts the name field first and labels the phone field
   * differently — Hero 2, 0:39885.
   */
  formMobile: {
    mobileLabel: "Mobile Number",
    mobilePlaceholder: "Enter your 10 digit mobile number",
    nameLabel: "Enter Full name",
    namePlaceholder: "Enter your Full name",
  },
  kpis: {
    downloads: { value: "5M+", label: "Downloads" },
    rating: { value: "4.4", label: "Ratings on Android" },
    backing: { label: "Backed by SBI" },
  },
};

/* --- market pulse -------------------------------------------------------- */

export interface TickerItem {
  name: string;
  price: string;
  change: string;
  direction: "up" | "down";
}

export const MARKET_PULSE: TickerItem[] = [
  { name: "NIFTY 50", price: "24,456.90", change: "30.00 %", direction: "up" },
  { name: "NIFTY BANK", price: "56,755.60", change: "0.58%", direction: "down" },
  { name: "BSE Sensex", price: "24,456.90", change: "28.00 %", direction: "up" },
  { name: "GIFT NIFTY", price: "56,755.60", change: "1.58%", direction: "down" },
];

/* --- explore our world (bento) ------------------------------------------- */

export const BENTO = {
  title: "Explore our world",
  subtext: "Built for traders and investors",
  /** The mobile frame words the subtext slightly differently. */
  subtextMobile: "Services built for traders and investors",
  marginTrading: {
    title: ["Margin trading at 0%", "for 23 trading days"],
    upto: "Upto",
    multiple: "4x",
    leverage: "Leverage",
    deposit: ["Your", "Deposit"],
    buyingPower: ["Buying", "Power"],
  },
  nri: { title: ["NRI Demat Account", "Investing without", "boundaries"] },
  support: {
    title: ["Get instant support", "In-person or online,", "your choice"],
    stats: [
      { value: "20+", label: ["Virtual", "Branches"] },
      { value: "130+", label: ["Physical", "Branches"] },
    ],
  },
  baskets: { title: ["Introducing research", "backed MTF Baskets"] },
};

/* --- IPOs ---------------------------------------------------------------- */

export const IPO_TABS = ["Open IPOs", "Upcoming IPOs", "Listed IPOs"] as const;

export interface Ipo {
  name: string;
  status: string;
  dateRange: string;
  priceBand: string;
  issueSize: string;
  minInvestment: string;
  minInvestmentUnit: string;
  listingNote: string;
  listingDate: string;
  /** Frame 2147226080 0:58806 — the 360 card leads with the close deadline. */
  closingNote: string;
  closingDate: string;
}

export const IPOS: Ipo[] = Array.from({ length: 6 }, () => ({
  name: "Metallic Technoforge Ltd.",
  status: "Open",
  dateRange: "21-26 July 2026",
  priceBand: "₹72 - ₹77",
  issueSize: "167cr",
  minInvestment: "13,800",
  minInvestmentUnit: "/100 Shares",
  listingNote: "This IPO will list on",
  listingDate: "28 July 2026",
  closingNote: "Application closes on",
  closingDate: "26 July 2026",
}));

/* --- fund it, protect it ------------------------------------------------- */

export const OFFERINGS_TABS = ["Loans", "Insurance"] as const;

export interface Offering {
  slug: string;
  title: string;
  lede: string;
  /** Regular run that opens the second line, ahead of the emphasised claim. */
  highlightLead?: string;
  highlight: string;
  cta: string;
  /** The mobile frames label the same button differently — 0:58537 reads
      "Explore" where the desktop card (0:63417) reads "Get Started". */
  ctaMobile: string;
  /**
   * Mobile leads with a different card: Container 0:58395 runs Education,
   * Home, Car where the desktop Loans List (0:63312) runs Home, Education,
   * Car. Applied as a CSS order below 767 so the DOM keeps the desktop run.
   */
  mobileOrder: number;
  /** Illustration exported from Figma, under /figma/offerings. */
  art: string;
  /**
   * Same illustration with the desktop frame's background plate stripped out.
   * The wide export bakes a slice of Other Offerings' lilac-to-blush ground
   * into the artboard, which lines up at 1440 and shows as a mismatched panel
   * once the 328-wide mobile tile rescales it — below 767 the transparent copy
   * lets the section's own gradient run straight through, as 0:97932 does.
   */
  artMobile?: string;
}

export const LOANS: Offering[] = [
  {
    slug: "home-loan",
    mobileOrder: 2,
    art: "/figma/offerings/home-loan.svg",
    artMobile: "/figma/offerings/mobile/home-loan.svg",
    title: "Home Loan",
    lede: "Turn your dream home into reality.",
    highlightLead: "Interest starts from ",
    highlight: "7.25% p.a.",
    cta: "Get Started",
    ctaMobile: "Explore",
  },
  {
    slug: "education-loan",
    mobileOrder: 1,
    art: "/figma/offerings/education-loan.svg",
    artMobile: "/figma/offerings/mobile/education-loan.svg",
    title: "Education Loan",
    lede: "Because your ambitions shouldn't wait.",
    highlightLead: "Study in ",
    highlight: "India and abroad.",
    cta: "Get Started",
    ctaMobile: "Explore",
  },
  {
    slug: "car-loan",
    mobileOrder: 3,
    art: "/figma/offerings/car-loan.svg",
    artMobile: "/figma/offerings/mobile/car-loan.svg",
    title: "Car Loan",
    lede: "Drive home your dream car.",
    highlightLead: "Up to ",
    highlight: "100% financing.",
    cta: "Get Started",
    ctaMobile: "Explore",
  },
];

export const INSURANCE: Offering[] = [
  {
    slug: "life-insurance",
    mobileOrder: 1,
    art: "/figma/offerings/life-insurance.svg",
    title: "Life Insurance",
    lede: "Protect what matters most.",
    highlight: "Cover your family's future.",
    cta: "Get Started",
    ctaMobile: "Explore",
  },
  {
    slug: "health-insurance",
    mobileOrder: 2,
    art: "/figma/offerings/health-insurance.svg",
    title: "Health Insurance",
    lede: "Care without the cost worry.",
    highlight: "Cashless hospital network.",
    cta: "Get Started",
    ctaMobile: "Explore",
  },
  {
    slug: "term-insurance",
    mobileOrder: 3,
    art: "/figma/offerings/term-insurance.svg",
    title: "Term Insurance",
    lede: "High cover, low premium.",
    highlight: "Secure them for the long run.",
    cta: "Get Started",
    ctaMobile: "Explore",
  },
];

/* --- invest with a purpose ----------------------------------------------- */

export interface PurposeCard {
  slug: string;
  title: string;
  lede: string;
  points: string[];
  cta: string;
}

export const PURPOSE = {
  title: "Invest with a purpose",
  subtext: "SBI Securities helps you build a plan and the wealth to match it.",
  cards: [
    {
      slug: "retirement",
      title: "Retirement planning",
      lede: "Start early, retire rich.",
      points: ["Systematic retirement investment plans", "Tax-efficient wealth accumulation"],
      cta: "Plan My Retirement",
    },
    {
      slug: "wealth",
      title: "Wealth creation",
      lede: "Grow your money with a disciplined strategy",
      points: ["Equity, mutual funds, and more", "Expert-curated portfolios"],
      cta: "Explore Strategy",
    },
    {
      slug: "education",
      title: "Fund your education",
      lede: "Give your child the best education",
      points: ["Start a SIP as low as ₹500/month", "Goal-based investment tracker"],
      cta: "Start SIP",
    },
    {
      slug: "home",
      title: "Buy a home",
      lede: "Your dream home is closer than you think",
      points: ["Tailored savings and investment mix", "Home loan guidance included"],
      cta: "Get Started",
    },
  ] satisfies PurposeCard[],
};

/* --- next-gen platform --------------------------------------------------- */

export const PLATFORM_TABS = ["Mobile Application", "Trading terminal"] as const;

/**
 * The Smart Animate the right-hand panel runs when a step is picked, read off
 * the ON_CLICK reactions on the step Containers in the Product variant set
 * (0:24215):
 *
 *   Mobile Application  SMART_ANIMATE 1.0221s GENTLE  (I0:41591;6390:65988/91)
 *   Trading terminal    SMART_ANIMATE 0.1278s GENTLE  (I0:41595;6241:191237/40)
 *
 * The set is keyed `Device / Screen / Steps / Step Name`. **`Step Name` is the
 * step** — the Containers link to it — while `Steps=1|2|3` is a sub-animation
 * that plays inside one panel on near-zero AFTER_TIMEOUT delays (0.001s, 0.2s)
 * and is not the step change. Its own edges (0.3s EASE_IN, 1s EASE_OUT) are
 * easy to mistake for the transition; they are not.
 *
 * GENTLE is a spring. On a cross-fade its overshoot would push opacity past 1,
 * where it clamps and then dips back — a visible flicker — so the curve below
 * is the spring's rise and settle made monotonic. The durations are verbatim.
 *
 * Smart Animate matches layers by name; the phone mockup and the candlestick
 * field keep their position across steps, so with each panel flattened to one
 * export the honest translation is a cross-fade — what stays put in Figma also
 * stays put here, because it is in the same place in both images.
 */
export const PLATFORM_PANEL_TRANSITION: Record<
  string,
  { durationMs: number; easing: string }
> = {
  "Mobile Application": {
    durationMs: 1022,
    easing: "cubic-bezier(0.25, 0.9, 0.35, 1)",
  },
  "Trading terminal": {
    durationMs: 128,
    easing: "cubic-bezier(0.25, 0.9, 0.35, 1)",
  },
};

export interface PlatformStep {
  title: string;
  body: string;
}

export const PLATFORM = {
  title: "Next-gen Investment Platform",
  subtext: "Trade, invest, and grow — all in one place.",
  /**
   * Each tab has its own three steps and its own panel — Sprint 2 0:64498 for
   * Mobile Application, 0:66732 for Trading terminal.
   *
   * The Figma note on that fold asks for the panel to change as each step is
   * selected too ("the three steps will auto-scroll and will update the
   * displayed image when any step is clicked"), but a second note says "the
   * images for each step will be updated once approved" and the file ships one
   * panel per tab. The three slots per tab therefore point at the same export
   * until the per-step artwork lands; swap them in here as it does.
   */
  panels: {
    "Mobile Application": [
      "/figma/platform/app-panel.png",
      "/figma/platform/app-panel.png",
      "/figma/platform/app-panel.png",
    ],
    "Trading terminal": [
      "/figma/platform/terminal-panel.png",
      "/figma/platform/terminal-panel.png",
      "/figma/platform/terminal-panel.png",
    ],
  } as Record<string, string[]>,
  steps: {
    "Mobile Application": [
      {
        title: "Real-time position tracking",
        body: "Monitor open positions, live P&L, price movements, quantities, and order status in real time, all from one unified view.",
      },
      {
        title: "Instant UPI funding",
        body: "Add funds instantly through UPI and get your trading account ready to place orders without waiting for manual processing.",
      },
      {
        title: "Research calls",
        body: "Get expert market insights and actionable stock recommendations to support smarter trading decisions.",
      },
    ],
    "Trading terminal": [
      {
        title: "4x E-Margin",
        body: "Trade with up to 4x margin on eligible stocks, giving you greater buying power and flexibility with less upfront capital.",
      },
      {
        title: "After Market Orders",
        body: "Place buy or sell orders outside regular market hours and have them queued for execution when the market opens.",
      },
      {
        title: "Screeners",
        body: "Find the right stocks faster with powerful filters and custom criteria to identify opportunities based on your trading strategy.",
      },
    ],
  } as Record<string, PlatformStep[]>,
};

/* --- analysis you can trust ---------------------------------------------- */

export const RESEARCH_TABS = ["Fundamental Research", "Technical Research"] as const;

export interface ResearchReport {
  title: string;
  kind: string;
  date: string;
}

export const RESEARCH: ResearchReport[] = [
  { title: "SSL Morning Update", kind: "Morning Report", date: "28 July 2026" },
  { title: "Macro Trends Monthly Economic Report", kind: "Monthly Report", date: "26 July 2026" },
  {
    title: "Thematic Report - Rockstars of 4QFY26 Result",
    kind: "Thematic Report",
    date: "17 July 2026",
  },
  { title: "SBI Securities Weekly Wrap", kind: "Weekly Report", date: "10 July 2026" },
];

/* --- daily market digest ------------------------------------------------- */

export interface NewsItem {
  title: string;
  timestamp: string;
}

export const NEWS = {
  title: "Your Daily Market Digest",
  subtext: "Stay on top of the markets",
  lead: {
    title: "Eternal Q1 Net Profit Jumps Nearly Four-Fold to Rs 92 Cr",
    timestamp: "Jul 29, 2026 06:45 PM IST",
  },
  items: [
    {
      title: "RBI Announces Rs 20,000 Crore Government Securities Buyback on July 28",
      timestamp: "Jul 28 2026 06:45 PM IST",
    },
    {
      title:
        "INR vs USD Rate, July 24, 2026: Rupee Rises 22 Paise to 96.51 Against US Dollar in Early Trade",
      timestamp: "Jul 24, 2026 06:45 PM IST",
    },
    {
      title:
        "Nasdaq Slips 0.22% to 25,781.58 as Oil Surges Past $94 and Big Tech Earnings Loom; Dow Defies Weakness with 0.40% Gain",
      timestamp: "Jul 22, 2026 06:45 PM IST",
    },
  ] satisfies NewsItem[],
};

/* --- learn before you invest --------------------------------------------- */

export const LEARN_TABS = [
  "First time investors",
  "Active Traders",
  "Global Investors",
  "Women Investors",
] as const;

export interface Lesson {
  title: string;
  duration: string;
  /** Blogs card 0:66075 — the 360 frame sets a date under the title. */
  date: string;
  /**
   * A YouTube link or a video file (.mp4, .webm) plays in a popup; any other
   * web link opens in a new tab. Without one the card has no Play button.
   */
  videoUrl?: string;
  /** English captions (.vtt) for a video file. YouTube carries its own. */
  captionsUrl?: string;
  /** A transcript file visitors can download from the video popup. */
  transcriptUrl?: string;
}

/* TEST VIDEO, NOT SBI CONTENT: Big Buck Bunny, an open film by the Blender
   Foundation. Replace each lesson's videoUrl with its real link before
   release. */
const TEST_VIDEO_URL = "https://www.youtube.com/watch?v=aqz-KE-bpKQ";

export const LESSONS: Lesson[] = [
  { title: "Why our brain sees patterns that don't exist", duration: "12:45", date: "02 July 2025", videoUrl: TEST_VIDEO_URL },
  { title: "Why stories influence investors more than numbers", duration: "12:28", date: "02 July 2025", videoUrl: TEST_VIDEO_URL },
  { title: "You thought you had figured the market out.", duration: "12:28", date: "02 July 2025", videoUrl: TEST_VIDEO_URL },
  { title: "Free advice is the most expensive advice", duration: "12:28", date: "02 July 2025", videoUrl: TEST_VIDEO_URL },
  { title: "Why our brain sees patterns that don't exist", duration: "12:45", date: "02 July 2025", videoUrl: TEST_VIDEO_URL },
  { title: "Why stories influence investors more than numbers", duration: "12:28", date: "02 July 2025", videoUrl: TEST_VIDEO_URL },
];

/* --- testimonials -------------------------------------------------------- */

export interface Testimonial {
  quote: string;
  author: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I would like to thank the SBI Securities team for the awesome trading platform and easy-to-read reports. Their regular research inputs help in making diligent and timely calls for my investments. Well done😊",
    author: "Vishal",
  },
  {
    quote:
      "The research calls have been consistently useful and the app is quick even on a busy market day. Order execution has never let me down.",
    author: "Anita",
  },
  {
    quote:
      "Opening the demat account took minutes and the support team walked me through my first trade patiently. Exactly what a first-time investor needs.",
    author: "Rahul",
  },
  {
    quote:
      "Brokerage is transparent and the margin facility is genuinely useful. Being backed by SBI gives me the confidence to invest more.",
    author: "Meera",
  },
];

/* --- pricing ------------------------------------------------------------- */

export interface Plan {
  name: string;
  price: string;
  priceNote?: string;
  features: string[];
  accent: "suvidha" | "prozero" | "women";
}

export const PLANS: Plan[] = [
  {
    name: "SUVIDHA",
    price: "₹0",
    accent: "suvidha",
    features: [
      "Free Account Opening",
      "0.50% Delivery of the Order Value",
      "0.50% E-margin",
      "₹20 per order on Intraday",
    ],
  },
  {
    name: "PRO ZERO",
    price: "₹99",
    priceNote: "+ GST",
    accent: "prozero",
    features: [
      "Free Intraday Brokerage",
      "0.20% Delivery of the Order Value",
      "0.40% E-margin",
      "₹20 per order on Intraday",
    ],
  },
  {
    name: "Women Plan",
    price: "₹0",
    accent: "women",
    features: [
      "Free AOC, Exclusive plan for women",
      "0.20% Delivery of the Order Value",
      "0.50% E-margin",
      "FREE ETF",
    ],
  },
];

/* --- FAQ ----------------------------------------------------------------- */

export const FAQS = [
  {
    question: "Why should I choose SBI Securities over other trading platforms?",
    answer:
      "Beyond the trust of the SBI name, the platform is built for a seamless trading experience a user-friendly app, real-time watchlists, fast order execution, margin and brokerage transparency, and dedicated research and advisory support. It combines the reliability of a legacy institution with the convenience of a modern digital trading platform.",
  },
  {
    question: "Is my money and data safe with SBI Securities?",
    answer:
      "Your funds stay in your own bank account and your securities in your own demat account. The platform is SEBI regulated and every session runs over bank-grade encryption.",
  },
  {
    question: "What can I invest in through SBI Securities?",
    answer:
      "Equity, IPOs, derivatives, ETFs, mutual funds, equity SIPs, corporate FDs, 54EC bonds and NPS — all from a single demat account.",
  },
  {
    question: "Does SBI Securities offer flexible brokerage plans?",
    answer:
      "Yes. Choose SUVIDHA for zero account opening, PRO ZERO for free intraday brokerage at ₹99 + GST, or the Women Plan for a free account with exclusive pricing.",
  },
];

/* --- sticky nudge -------------------------------------------------------- */

export const STICKY_NUDGE = {
  title: "Smart investing starts here",
  mobilePlaceholder: "Enter your mobile number",
  namePlaceholder: "Enter your full name",
  cta: "Get Started",
};

/* --- footer -------------------------------------------------------------- */

export const FOOTER_CTA = {
  title: "Stop Scrolling, Start investing!",
  body: "Watch your money grow. Download the app now and start taking control of your money today.",
  cta: "Download Now",
};

export interface FooterColumn {
  title: string;
  links: string[];
}

export const FOOTER_PRIMARY: FooterColumn[] = [
  {
    title: "TRADE & INVEST",
    links: [
      "Equity",
      "IPO",
      "Derivative",
      "Margin Trading Facility",
      "Equity SIP",
      "ETF",
      "Corporate FDs",
      "54EC Bonds",
      "Mutual Fund",
      "NPS",
    ],
  },
  {
    title: "OPEN DEMAT ACCOUNT",
    links: [
      "Open Demat Account",
      "NRI Demat Account",
      "Corporate Demat Account",
      "Women's Demat Account",
      "Brokerage Plans",
      "Account Opening Process",
    ],
  },
];

/** Five columns; two of them stack a second heading underneath. */
export const FOOTER_SECONDARY: FooterColumn[][] = [
  [
    {
      title: "CALCULATORS",
      links: [
        "MF Returns Calculator",
        "SIP Calculator",
        "Lumpsum Calculator",
        "Step-up SIP Calculator",
        "SWP Calculator",
        "FD Calculator",
        "NPS Calculator",
        "Home Loan EMI Calculator",
        "Car Loan EMI Calculator",
        "CAGR Calculator",
        "Loan EMI Calculator",
        "RD Calculator",
        "Retirement Calculator",
      ],
    },
  ],
  [
    {
      title: "MARKETS",
      links: [
        "Nifty 50",
        "Sensex",
        "Bank Nifty",
        "FinNifty",
        "Midcap",
        "Smallcap",
        "Gift Nifty",
        "Global Markets",
      ],
    },
    { title: "LOANS", links: ["Home Loan", "Car Loan", "Education Loan"] },
  ],
  [
    {
      title: "LEARNING CENTRE",
      links: [
        "Investor Awareness Program",
        "Blogs",
        "News",
        "Research Reports",
        "Holiday Calendar",
        "Downloads",
      ],
    },
    { title: "INSURANCES", links: ["Home Loan", "Car Loan", "Education Loan"] },
  ],
  [
    {
      title: "SUPPORT & COMPANY",
      links: [
        "About us",
        "Contact us",
        "Careers",
        "In the Media",
        "Branch Locator",
        "CSR",
        "Security tips",
        "Disclaimer",
        "Privacy Policy",
        "Cookies Policy",
        "DND Policy",
        "Terms & Conditions",
      ],
    },
  ],
  [
    {
      title: "USEFUL LINKS",
      links: [
        "Budget 2026",
        "SBI Realty",
        "Recovery Module",
        "Block Online Access",
        "Request for Proposal",
        "Disclosures",
        "Announcements",
        "Investor Charter",
        "Investor Awareness",
        "SCORES",
        "ODR Portal",
      ],
    },
  ],
];

export const STOCK_INDEX_LETTERS = [
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  "0-9",
  "All",
];

export const STOCK_LINKS = [
  "Nifty 50 Stocks Overview",
  "Essential Resources for Nifty 50",
  "Nifty Stocks Sorted by Sector",
  "Nifty Stocks Organized by Value",
  "Price-Based Nifty Stock List",
  "Top Trending Nifty Stocks",
  "Nifty Stocks Categorized by Cap",
  "Nifty Stocks Ordered by Volume",
  "Nifty Stocks Arranged by Returns",
  "Nifty Stocks Listed by Performance",
  "Current Trending Nifty Stocks",
  "Nifty Stocks Grouped by Industry",
  "Nifty Stocks Classified by Yield",
  "Nifty Stocks Sorted by Market Cap",
  "Nifty Stocks Listed by Price Move",
  "Trending Nifty Stocks",
  "Nifty Stocks Categorized by Theme",
  "Nifty Stocks Arranged by Weight",
  "Nifty Stocks Sorted by Turnover",
  "Nifty Stocks Organized by Index",
  "Trending Nifty Stocks",
  "Nifty Stocks Grouped by Segment",
  "Nifty Stocks Classified by Beta",
  "Nifty Stocks Sorted by Delivery",
  "Nifty Stocks Listed by PE Ratio",
];

export const FOOTER_LEGAL = {
  registration: ["AMFI Registered Mutual Fund Distributor", "CIN: U65999MH2005PLC155485"],
  trading:
    "Equities: Trading through SBICAP Securities Limited I Website: www.sbisecurities.in SEBI Registration No.: Stock Broker: INZ000200032 | DP Registration No.: IN-DP-314-2017 | Research Analyst : INH000000602 | IRDAI Corporate Agency Reg. No. CA0103; AMFI Reg. No. ARN-0011 (Date of initial registration: 19th August 2005 and valid upto 18th February 2027); PFRDA Reg. No. POP26092018. In case of any grievances please write to complaints@sbicapsec.com DP related grievance can be sent to :dp.grievance@sbicapsec.com | NPS related grievance can be sent to : Npsgrievance@sbicapsec.com | Compliance officer - Mr.Srijith Menon , email -compliance@sbicapsec.com; Tel No.- 022 - 69316510",
  authorization:
    "SBICAP Securities Limited is authorized by the Insurance Regulatory and Development Authority of India to act as a Corporate Agent from 01- April- 2025 to 31-March 2028 for procuring or soliciting insurance business of Life, General and Health under license number CA0103, Category: Composite. SBICAP Securities Ltd. does not underwrite the risk or act as an insurer. The advertisement contains only an indication of the cover offered. For more details on risk factors, terms, conditions and exclusions, please read the sales brochure carefully before concluding a sale. SBI Logo displayed belongs to State Bank of India and used by SBICAP Securities Limited under license. Personal information as submitted by you will be shared with SBICAP and insurer in order to complete your application. By continuing, you provide your consent for the above and authorize SBICAP Securities representatives to contact you through call, SMS, WhatsApp or E-mail for providing assistance towards the application process.",
  warning:
    "BEWARE OF SPURIOUS PHONE CALLS AND FICTITIOUS /FRAUDULENT OFFERSIRDAI is not involved in activities like selling insurance policies, announcing bonus or investment of premiums. Public receiving such phone calls are requested to lodge a police complaint. To read more, please click here - IRDAI Public Notice",
  copyright:
    "Copyright © 2024. All rights Reserved. SBICAP Securities Limited.Site is best viewed in edge browser, Firefox 38+, Chrome 50+ at 1366x768 pixel resolution. Windows 10 and above",
};
