import resonanceReviewData from "./resonance-review.json" with { type: "json" };
import resonanceData from "./word-resonance.json" with { type: "json" };
import resonanceLinks from "./word-resonance-links.json" with { type: "json" };

export type Sentiment = "Strongly Positive" | "Positive" | "Mixed" | "Neutral" | "Negative" | "Strongly Negative";
export type Category = "Official" | "Players & Coaches" | "Local Media" | "National Media" | "Creators" | "Fans";
export type Source = {
 id:string; source:string; outlet:string; category:Category; date:string; sentiment:Sentiment;
 themes:string[]; confidence:"High"|"Medium"; url:string; evidence:string;
 phase:"Event"|"Preview"|"Background"; quote?:string; quoteType?:"Direct quote";
 speaker?:string; speakerRole?:string; quoteContext?:string; samplePurpose?:string;
};

export const sources: Source[] = [
  {
    "id": "nba-media-day",
    "source": "Media Day schedule",
    "outlet": "NBA.com Staff",
    "category": "Official",
    "date": "Sept. 25 · Schedule",
    "phase": "Background",
    "sentiment": "Neutral",
    "themes": [
      "Event verification"
    ],
    "confidence": "High",
    "url": "https://www.nba.com/news/nba-media-days-schedule-for-all-30-teams",
    "evidence": "Official schedule lists Phoenix on September 28."
  },
  {
    "id": "suns-continuity",
    "source": "Team continuity preview",
    "outlet": "Phoenix Suns / NBA.com",
    "category": "Official",
    "date": "Sept. 26 · Preview",
    "phase": "Preview",
    "sentiment": "Neutral",
    "themes": [
      "Continuity",
      "Newcomers"
    ],
    "confidence": "Medium",
    "url": "https://www.nba.com/suns/news/how-continuity-will-help-the-phoenix-suns-strengthen-their-identity",
    "evidence": "Indexed team preview emphasizes continuity and newcomer integration."
  },
  {
    "id": "nba-williams",
    "source": "Williams injury update",
    "outlet": "NBA.com News Services",
    "category": "Official",
    "date": "Sept. 11 · Background",
    "phase": "Background",
    "sentiment": "Neutral",
    "themes": [
      "Availability"
    ],
    "confidence": "High",
    "url": "https://www.nba.com/news/phoenix-suns-mark-williams-injury",
    "evidence": "Official report confirms shoulder surgery; initial return timetable unspecified."
  },
  {
    "id": "si-roundup",
    "source": "What the Suns' key figures said at Media Day",
    "outlet": "Donnie Druin / Suns on SI",
    "category": "Players & Coaches",
    "date": "Sept. 28 · Media Day",
    "phase": "Event",
    "sentiment": "Positive",
    "themes": [
      "Daily work",
      "Preparation",
      "Leadership"
    ],
    "confidence": "High",
    "url": "https://www.si.com/nba/suns/onsi/biggest-thing-every-key-phoenix-suns-figure-said-media-day-mat-ishbia-devin-booker",
    "evidence": "On-site roundup attributes daily improvement to Gregory, sustained summer participation to Ott, and personal concentration work to Brooks.",
    "quote": "One year doesn't make your culture. One year doesn't make your identity.",
    "quoteType": "Direct quote",
    "speaker": "Brian Gregory",
    "speakerRole": "Suns general manager",
    "quoteContext": "On maintaining identity through repeated work; quoted by Donnie Druin"
  },
  {
    "id": "booker-continuity",
    "source": "Booker on returning teammates and shared summer work",
    "outlet": "Kevin Humpherys / Bright Side of the Sun",
    "category": "Players & Coaches",
    "date": "Sept. 28 · 1:55 PM Arizona",
    "phase": "Event",
    "sentiment": "Positive",
    "themes": [
      "Continuity",
      "Shared preparation"
    ],
    "confidence": "High",
    "url": "https://www.brightsideofthesun.com/general/110581/devin-booker-is-excited-for-year-12-and-the-phoenix-suns-continuity",
    "evidence": "Booker described returning to familiar teammates and the same coach, summer gatherings and recurring facility workouts.",
    "quote": "We're all on the same page.",
    "quoteType": "Direct quote",
    "speaker": "Devin Booker",
    "speakerRole": "Suns guard",
    "quoteContext": "On the returning group; quoted by Kevin Humpherys"
  },
  {
    "id": "green-nash",
    "source": "Green sought Nash's feedback on his game",
    "outlet": "Mark Bowser / Bright Side of the Sun",
    "category": "Players & Coaches",
    "date": "Sept. 28 · 4:00 PM Arizona",
    "phase": "Event",
    "sentiment": "Positive",
    "themes": [
      "Mentorship",
      "Player initiative"
    ],
    "confidence": "High",
    "url": "https://www.brightsideofthesun.com/suns-analysis/110598/jalen-green-steve-nash-mentorship-playmaking-pace-development",
    "evidence": "Green said Nash watched and critiqued workouts to help his pace and game reading. Bowser views the intent positively; improvement remains to be demonstrated."
  },
  {
    "id": "maluach-development",
    "source": "Booker's praise for Maluach finds a wider audience",
    "outlet": "Holden Sherman / Bright Side of the Sun",
    "category": "Local Media",
    "date": "Sept. 28 · 5:00 PM Arizona",
    "phase": "Event",
    "sentiment": "Strongly Positive",
    "themes": [
      "Development",
      "Player initiative",
      "Team contribution"
    ],
    "confidence": "High",
    "url": "https://www.brightsideofthesun.com/suns-news/110583/devin-booker-with-high-praise-for-khaman-maluach",
    "evidence": "Booker reported working with Maluach after the young center reached out. Gregory described physical progress; Maluach emphasized helping the team regardless of starting status."
  },
  {
    "id": "ap-resources",
    "source": "Mat addresses basketball spending and ownership plans",
    "outlet": "David Brandt / Associated Press via Arizona's Family",
    "category": "National Media",
    "date": "Sept. 28 · 1:42 PM Arizona",
    "phase": "Event",
    "sentiment": "Neutral",
    "themes": [
      "Resources",
      "Ownership commitment",
      "External scrutiny"
    ],
    "confidence": "High",
    "url": "https://www.azfamily.com/2026/09/28/suns-owner-mat-ishbia-says-mortgage-company-woes-will-have-no-effect-basketball/",
    "evidence": "Mat said mortgage-company performance would have no effect on Suns spending or fan experience.",
    "quote": "It affects zero. Absolutely zero.",
    "quoteType": "Direct quote",
    "speaker": "Mat Ishbia",
    "speakerRole": "Suns owner",
    "quoteContext": "On mortgage-company performance and basketball spending; reported by David Brandt/AP"
  },
  {
    "id": "bridges-clutchpoints",
    "source": "Mat's Bridges explanation draws scrutiny",
    "outlet": "Bailey Bassett / ClutchPoints",
    "category": "National Media",
    "date": "Sept. 28 · 12:36 PM Arizona",
    "phase": "Event",
    "sentiment": "Mixed",
    "themes": [
      "Organizational standards",
      "Public trust"
    ],
    "confidence": "Medium",
    "url": "https://clutchpoints.com/nba/phoenix-suns/mat-ishbia-sounds-off-controversial-suns-miles-bridges-trade-arrest",
    "evidence": "Bassett reports Mat’s condemnation of Bridges’ prior conduct and his stated accountability rationale. The account keeps the acquisition’s public-trust implications in view; no legal conclusion is inferred."
  },
  {
    "id": "bridges-roundtable",
    "source": "A second editorial frame on the Bridges decision",
    "outlet": "Kevin Hicks / Roundtable Sports via Yahoo",
    "category": "Creators",
    "date": "Sept. 28 · 11:51 AM Arizona",
    "phase": "Event",
    "sentiment": "Negative",
    "themes": [
      "Organizational standards",
      "Public reception"
    ],
    "confidence": "Medium",
    "url": "https://sports.yahoo.com/articles/suns-owner-defends-phoenixs-decision-185136587.html",
    "evidence": "Indexed article frames the explanation as a defense of a divisive acquisition. It covers the same exchange as ClutchPoints and supplies another editorial frame."
  },
  {
    "id": "phnx-preview",
    "source": "PHNX's expectations entering Media Day",
    "outlet": "PHNX Suns Podcast",
    "category": "Creators",
    "date": "Sept. 25 · Preview",
    "phase": "Preview",
    "sentiment": "Positive",
    "themes": [
      "Incoming expectations",
      "Offseason review"
    ],
    "confidence": "Medium",
    "url": "https://podcasts.apple.com/us/podcast/what-to-expect-from-phoenix-suns-media-day-as-2026/id1207682052?i=1000791692396",
    "evidence": "Dated pre-event episode description discusses incoming expectations. Completed PHNX reaction was not retrieved and is excluded from the reception assessment."
  },
  {
    "id": "booker-culture",
    "source": "Booker's Media Day shoe collaboration reaches a specialist audience",
    "outlet": "Zach Harris / Sole Retriever",
    "category": "Creators",
    "date": "Sept. 28 · Media Day",
    "phase": "Event",
    "sentiment": "Positive",
    "themes": [
      "Player identity",
      "Cultural reach"
    ],
    "confidence": "High",
    "url": "https://www.soleretriever.com/news/articles/futura-nike-book-2-media-day-preview",
    "evidence": "Specialist coverage reports Booker's Futura collaboration debut at Media Day. The source gives no confirmed release date."
  },
  {
    "id": "fan-media-day",
    "source": "One public Suns Media Day discussion",
    "outlet": "r/suns public megathread",
    "category": "Fans",
    "date": "Sept. 28 · Discussion",
    "phase": "Event",
    "sentiment": "Mixed",
    "themes": [
      "Enthusiasm",
      "Role questions",
      "Broadcast access"
    ],
    "confidence": "Medium",
    "url": "https://www.reddit.com/r/suns/comments/1wsj8c9/megathread_phoenix_suns_media_day_2026_10am_start/",
    "evidence": "Visible discussion mixes anticipation and development interest with role disagreement and broadcast-access difficulties. One thread counts once and supplies no representative fan measure."
  },
  {
    "id": "official-gregory-2026",
    "source": "Returning staff and the Williams assessment",
    "outlet": "Phoenix Suns · Brian Gregory official interview",
    "category": "Players & Coaches",
    "date": "Sept. 28 · Official interview",
    "phase": "Event",
    "sentiment": "Neutral",
    "themes": [
      "Continuity",
      "Availability"
    ],
    "confidence": "High",
    "url": "https://www.youtube.com/watch?v=RSBrE1yhI8o",
    "evidence": "Gregory said 12 of the 15 season-ending players and every coach return (2:24–2:44). On Williams, several months are needed before a reliable return-to-play assessment (10:30–11:26); no return date was supplied. Attributed paraphrase; automated captions."
  },
  {
    "id": "official-kennard-2026",
    "source": "Kennard describes his first month with Ighodaro",
    "outlet": "Phoenix Suns · Luke Kennard official interview",
    "category": "Players & Coaches",
    "date": "Sept. 28 · Official interview",
    "phase": "Event",
    "sentiment": "Positive",
    "themes": [
      "Newcomer integration",
      "Shared work"
    ],
    "confidence": "High",
    "url": "https://www.youtube.com/watch?v=bobwPedrkAE",
    "evidence": "Kennard described about a month of work with Ighodaro (6:12–6:48) and early group gatherings that helped him discuss preferred shooting situations (9:33–10:28). Attributed paraphrase; automated captions."
  },
  {
    "id": "official-ighodaro-2026",
    "source": "Ighodaro describes competition and mutual help",
    "outlet": "Phoenix Suns · Oso Ighodaro official interview",
    "category": "Players & Coaches",
    "date": "Sept. 28 · Official interview",
    "phase": "Event",
    "sentiment": "Positive",
    "themes": [
      "Mutual help",
      "Shared work"
    ],
    "confidence": "High",
    "url": "https://www.youtube.com/watch?v=K49VkSpNWxs",
    "evidence": "Ighodaro described an immediate working connection with Kennard (2:37–2:58) and exchanging pointers with Maluach even on opposing pickup teams (3:56–4:27). Attributed paraphrase; automated captions."
  },
  {
    "id": "official-maluach-2026",
    "source": "Maluach explains what he sought from Booker",
    "outlet": "Phoenix Suns · Khaman Maluach official interview",
    "category": "Players & Coaches",
    "date": "Sept. 28 · Official interview",
    "phase": "Event",
    "sentiment": "Positive",
    "themes": [
      "Player initiative",
      "Mutual help"
    ],
    "confidence": "High",
    "url": "https://www.youtube.com/watch?v=U5ne7o2_oXY",
    "evidence": "Maluach described seeking Booker’s guidance on responding to defensive pressure (2:18–3:08) and asking Ighodaro what he sees during plays and practices (4:13–4:48). Attributed paraphrase; automated captions."
  },
  {
    "id": "official-dunn-2026",
    "source": "Dunn is both learner and helper",
    "outlet": "Phoenix Suns · Ryan Dunn official interview",
    "category": "Players & Coaches",
    "date": "Sept. 28 · Official interview",
    "phase": "Event",
    "sentiment": "Positive",
    "themes": [
      "Player learning",
      "Development"
    ],
    "confidence": "High",
    "url": "https://www.youtube.com/watch?v=N25bp5CHnNo",
    "evidence": "Dunn described seeking defensive advice from experienced teammates and helping younger players (2:12–2:46). His development assessments are teammate observations. Attributed paraphrase; automated captions."
  },
  {
    "id": "official-bridges-2026",
    "source": "Bridges describes joining and helping the group",
    "outlet": "Phoenix Suns · Miles Bridges official interview",
    "category": "Players & Coaches",
    "date": "Sept. 28 · Official interview",
    "phase": "Event",
    "sentiment": "Neutral",
    "themes": [
      "Newcomer integration",
      "Veteran guidance"
    ],
    "confidence": "High",
    "url": "https://www.youtube.com/watch?v=gcBL9yhoSzI",
    "evidence": "Bridges described young teammates as receptive to his corrections in open gym (4:58–5:25). His account of basketball integration leaves broader public-accountability questions open. Attributed paraphrase; automated captions."
  },
  {
    "id": "official-fleming-2026",
    "source": "Fleming explains his development experience",
    "outlet": "Phoenix Suns · Rasheer Fleming official interview",
    "category": "Players & Coaches",
    "date": "Sept. 28 · Official interview",
    "phase": "Event",
    "sentiment": "Positive",
    "themes": [
      "Development infrastructure",
      "Valley Suns"
    ],
    "confidence": "High",
    "url": "https://www.youtube.com/watch?v=Y2YeiZj7BVw",
    "evidence": "Fleming credited film study with earlier recognition and communication (3:16–3:52) and his Valley Suns experience with greater control as the game slowed for him (5:26–5:40). Attributed paraphrase; automated captions."
  },
  {
    "id": "official-peat-2026",
    "source": "Peat describes the advice he receives",
    "outlet": "Phoenix Suns · Koa Peat official interview",
    "category": "Players & Coaches",
    "date": "Sept. 28 · Official interview",
    "phase": "Event",
    "sentiment": "Positive",
    "themes": [
      "Veteran guidance",
      "Newcomer integration"
    ],
    "confidence": "High",
    "url": "https://www.youtube.com/watch?v=BmpZfQPWw_s",
    "evidence": "Peat described specific advice from Bridges on driving to the basket and handling contact and off-court conversations with Brooks (6:06–6:36). He also described younger teammates staying after workouts to talk (4:57–5:12). Attributed paraphrase; automated captions."
  },
  {
    "id": "morning-booker-maluach-cilley",
    "source": "Suns' Devin Booker recalls conversation that led to ongoing trust with Khaman Maluach",
    "outlet": "Hayden Cilley / ClutchPoints, syndicated by Yahoo Sports",
    "category": "Local Media",
    "date": "Sept. 28 · 7:38 PM Arizona (Yahoo)",
    "phase": "Event",
    "sentiment": "Positive",
    "themes": [
      "Development"
    ],
    "confidence": "High",
    "url": "https://sports.yahoo.com/articles/suns-devin-booker-recalls-conversation-023803901.html",
    "evidence": "On-site report repeats Booker's account of Maluach initiating workouts and adds Maluach's explanation that Booker can teach him how to respond to coverages from a player's perspective. Kennard and Spencer are also reported as identifying Maluach as a possible breakout player."
  },
  {
    "id": "morning-rankin-bridges",
    "source": "What Suns' Mat Ishbia, Devin Booker think about Miles Bridges trade",
    "outlet": "Duane Rankin / The Arizona Republic, syndicated by Yahoo Sports",
    "category": "Local Media",
    "date": "Sept. 28 · 6:50 PM Arizona (Yahoo)",
    "phase": "Event",
    "sentiment": "Mixed",
    "themes": [
      "Ownership",
      "Public expectations"
    ],
    "confidence": "High",
    "url": "https://sports.yahoo.com/articles/suns-mat-ishbia-devin-booker-015045207.html",
    "evidence": "Rankin reports Mat's basketball rationale and condemnation of Bridges' prior conduct. Booker separately describes the size, versatility, transition play and passing he expects Bridges to add. The report also includes Mat's explanation of the draft-pick exchange and confidence in developing young players."
  },
  {
    "id": "morning-duffy-maluach",
    "source": "Khaman Maluach arguably the biggest winner from Suns media day festivities",
    "outlet": "Luke Duffy / Valley of the Suns",
    "category": "Creators",
    "date": "Sept. 28 · 2:48 PM Arizona",
    "phase": "Event",
    "sentiment": "Positive",
    "themes": [
      "Development"
    ],
    "confidence": "High",
    "url": "https://valleyofthesuns.com/khaman-maluach-arguably-biggest-winner-suns-media-day-festivities",
    "evidence": "Duffy interprets Gregory's public support and Booker's summer work with Maluach as increased confidence in the young center. His optimism is qualified by concern about readiness and the need for continued development."
  },
  {
    "id": "morning-duffy-ownership",
    "source": "Mat Ishbia opens media day by confirming he will be staying in Phoenix long-term",
    "outlet": "Luke Duffy / Valley of the Suns",
    "category": "Creators",
    "date": "Sept. 28 · 3:45 PM Arizona",
    "phase": "Event",
    "sentiment": "Mixed",
    "themes": [
      "Ownership",
      "Public expectations"
    ],
    "confidence": "High",
    "url": "https://valleyofthesuns.com/mat-ishbia-opens-media-day-confirming-will-staying-phoenix-long-term",
    "evidence": "Duffy welcomes Mat's long-term commitment but argues that spending willingness must be accompanied by better roster-building judgment. This shows that the ownership assurance can be received positively while its implications remain contested."
  }
];

export const edition = {
  "basePath": process.env.NEXT_PUBLIC_ECHO_BASE_PATH ?? "/suns-echo",
  "editorialFinal": true,
  "releaseAuthorized": false,
  "series": "THE ECHO",
  "number": "002",
  "title": "In the Same Building",
  "subtitle": "What the Suns said, what people heard and what camp needs to answer.",
  "eventDate": "September 28, 2026",
  "reportingWindow": "September 28 event · review completed September 29 · word sample September 28–29",
  "generatedLabel": "Review edition · September 29, 2026 · America/Phoenix",
  "statusLabel": "Two-part review edition · release held for approval",
  "thesis": "The clearest sign of continuity was one player helping another compete. Media Day made those relationships visible, while coverage of Bridges and ownership commitments brought a second set of expectations into view.",
  "lockedCopy": [
  {
    "text": "Mat, the best moment from Media Day wasn't at a podium. It was Oso Ighodaro talking about pickup games with Khaman Maluach. They were on opposite teams, fighting for the same minutes, and Oso kept giving him pointers anyway. Maluach said he'd go to Oso after plays and ask what he saw.",
    "sourceIds": [
      "official-ighodaro-2026",
      "official-maluach-2026"
    ]
  },
  {
    "text": "That's what continuity actually looks like. Twelve of the fifteen players from the end of last season are back, and so is every coach. The young guys know who to ask. Maluach goes to Booker. Kennard works with Oso. Fleming credits film study and his time with the Valley Suns.",
    "sourceIds": [
      "official-gregory-2026",
      "official-maluach-2026",
      "official-kennard-2026",
      "official-fleming-2026"
    ]
  },
  {
    "text": "Fans noticed. They loved what they heard about Maluach. What they didn't love was trying to watch. People went looking for a stream and couldn't find one.",
    "sourceIds": [
      "fan-media-day"
    ]
  },
  {
    "text": "Three things to watch in camp. First, Williams: Gregory says it'll be months before there's a real read on his return. Second, how fast the young centers grow into that gap. Third, the Bridges decision, because people will keep measuring it against the standards you laid out.",
    "sourceIds": [
      "official-gregory-2026",
      "morning-rankin-bridges"
    ]
  },
  {
    "text": "My one call: next Media Day, one official stream, pinned everywhere. The fans showed up. Make it easy for them to get in.",
    "sourceIds": [
      "fan-media-day"
    ]
  },
  {
    "text": "Dominate.",
    "sourceIds": []
  }
],
  "sourceCount": 25,
  "includedCount": 25,
  "reviewedCount": 25,
  "confidence": "Attributed reporting · scope and gaps disclosed",
  "overallDirection": "Constructive basketball signals; mixed wider reception",
  "editorialIndex": null as number | null,
  "indexNote": "Qualitative assessment of 25 source records. Four provide preview or background context. Records describe coverage and attributed statements; they do not measure public approval.",
  "dominantSignalNote": "Players named the people helping them improve. Coverage also asked how basketball decisions fit the standards and commitments ownership described.",
  "readoutSourceIds": [
    "si-roundup",
    "morning-booker-maluach-cilley",
    "official-ighodaro-2026",
    "official-maluach-2026",
    "official-kennard-2026",
    "official-gregory-2026",
    "official-fleming-2026",
    "official-peat-2026",
    "booker-continuity",
    "green-nash",
    "ap-resources",
    "morning-rankin-bridges",
    "morning-duffy-ownership",
    "morning-duffy-maluach"
  ],
  "readoutParagraphs": [
    "Peat described Bridges’ advice on driving to the basket and handling contact. He also described conversations with Brooks. Fleming credited film study and the Valley Suns with helping him recognize the game earlier. These players could name the help they received. That makes the development story more useful than a general promise that everyone is improving.",
    "Maluach gave another example. He went to Booker for help handling defensive pressure. Ott’s account of summer gym participation adds the coach’s view. Together, these accounts describe players using the summer to prepare, with experienced teammates available to help.",
    "The wider coverage asked different questions. Hayden Cilley reported on Booker’s work with Maluach. Duane Rankin examined the Bridges decision and the standards Mat described. David Brandt’s AP report emphasized spending commitment. Luke Duffy welcomed that commitment while questioning basketball judgment. Each tells ownership something different about how the day was heard."
  ],
  "readout": "The players described how they are helping each other. Camp will show how that preparation holds up. Fans also gave ownership a clear access problem to fix.",
  "bottomLine": "The strongest story was the help players could name. Camp now gives those accounts a test. The clearest ownership action is simpler: make the next Media Day easy for fans to watch."

};

export type OwnershipBriefItem = { title: string; body: string; sourceIds: string[] };
export const ownershipBrief: { findings: OwnershipBriefItem[]; tension: OwnershipBriefItem; next: OwnershipBriefItem[] } = {
  "findings": [
    {
      "title": "Players can name who helps them",
      "body": "Peat described Bridges’ advice on driving to the basket and handling contact. He also described conversations with Brooks. Fleming credited film study and the Valley Suns. The help is specific enough to follow as the season begins.",
      "sourceIds": ["official-peat-2026", "official-fleming-2026"]
    },
    {
      "title": "The summer work had a purpose",
      "body": "Maluach sought Booker’s help handling defensive pressure. Ott described sustained summer gym participation. Players and coach gave examples of how the group used its time together.",
      "sourceIds": ["official-maluach-2026", "si-roundup"]
    },
    {
      "title": "Williams’ absence puts the young centers in focus",
      "body": "Gregory said it will take several months to assess when Williams can return. The younger centers enter camp with more attention on their readiness. Williams’ return date is still unknown.",
      "sourceIds": [
        "official-gregory-2026",
        "morning-duffy-maluach"
      ]
    }
  ],
  "tension": {
    "title": "The Bridges decision still carries questions",
    "body": "Rankin reported Booker’s basketball case for Bridges alongside Mat’s condemnation of prior conduct. The decision will continue to draw questions about how the organization applies its standards.",
    "sourceIds": [
      "morning-rankin-bridges",
      "bridges-clutchpoints",
      "bridges-roundtable"
    ]
  },
  "next": [
    {
      "title": "How the young centers respond",
      "body": "Follow what Ighodaro and Maluach describe learning, and what current reporting establishes about their readiness.",
      "sourceIds": [
        "official-ighodaro-2026",
        "official-maluach-2026",
        "official-gregory-2026"
      ]
    },
    {
      "title": "How newcomers settle into camp",
      "body": "Look for specific follow-up accounts from Kennard, Peat and Fleming about communication, guidance and preparation.",
      "sourceIds": [
        "official-kennard-2026",
        "official-peat-2026",
        "official-fleming-2026"
      ]
    },
    {
      "title": "What follows the public commitments",
      "body": "Follow what happens after Mat’s statements about standards and spending.",
      "sourceIds": [
        "morning-rankin-bridges",
        "ap-resources",
        "morning-duffy-ownership"
      ]
    }
  ]
};

export type ResonanceAudience = "fans" | "media" | "both";
export type ResonanceTheme = "Roster moves" | "Team identity" | "Player development" | "Ownership" | "Season outlook" | "Culture";
export type ResonancePhrase = {
  phrase: string; audience: ResonanceAudience; entity: string; theme: ResonanceTheme;
  sentiment: number; volume: "high" | "medium" | "low"; evidence: string; source: string;
};

export const resonanceReview = resonanceReviewData;
export type ResonanceTopic = (typeof resonanceReview.topics)[number];
export type ResonanceSide = "fans" | "media";
export type ResonanceReading = ResonanceTopic[ResonanceSide];
export const wordResonance = resonanceData as ResonancePhrase[];
export const resonanceThemes: ResonanceTheme[] = ["Roster moves", "Team identity", "Player development", "Ownership", "Season outlook", "Culture"];
export const resonanceCopy = {
  title: "Word Resonance",
  introduction: "Compare what fans said with what the articles emphasized. Select a phrase to read the exact language and its source.",
  caveat: resonanceReview.caveat,
  sample: `${resonanceReview.denominators.mediaArticles} articles and ${resonanceReview.denominators.verbatimFanComments} captured comment texts from five supplied social posts and two indexed r/suns threads. ${resonanceReview.denominators.codedFanComments} comments enter topic scores; ${resonanceReview.denominators.uncodedFanComments} have explicit exclusions. AI-assisted editorial coding. Indexed text lacks platform comment IDs, authors and exact timestamps; a captured comment does not establish a unique respondent.`,
  filters: "Fans shows topics with captured comments; Media shows topics mentioned in articles; Both requires evidence from each. Fan and media judgments stay separate. Article mentions include reported statements; only journalists’ own framing enters media sentiment.",
};
export const resonanceSourceLinks: Record<string, string> = resonanceLinks;
export const resonanceFanLedger: Source[] = resonanceReview.sources.filter(source => source.kind === "fans" && !sources.some(record => record.url === source.url)).map(source => ({
  id: `resonance-${source.id}`, source: source.title,
  outlet: source.collection === "supplied" ? "Supplied Instagram/Facebook comments" : "r/suns · indexed public comments",
  category: "Fans", date: `${source.published} · Word Resonance`, phase: "Event",
  sentiment: (() => {
    const evidence = resonanceReview.topics.flatMap(topic => topic.fans.evidence).filter(item => item.sourceId === source.id);
    const positive = evidence.some(item => item.code > 0), negative = evidence.some(item => item.code < 0);
    return positive && negative ? "Mixed" : positive ? "Positive" : negative ? "Negative" : "Neutral";
  })(), themes: ["Word Resonance", "Fan sample"], confidence: "Medium", url: source.url,
  evidence: `${source.commentCount} distinct comment texts; ${source.collection === "supplied" ? "supplied sample" : "public indexed capture"}.`,
  samplePurpose: `Word Resonance input · ${source.commentCount} comments · ${source.collection === "supplied" ? "supplied; not independently retrieved" : "indexed text; no platform comment IDs"}. The row classifies the captured source language; per-topic scores appear in the map.`,
}));
export const ledgerSources: Source[] = [...sources.map(source => {
  const fanSource = resonanceReview.sources.find(record => record.kind === "fans" && record.url === source.url);
  return fanSource ? { ...source, samplePurpose: `Also feeds Word Resonance · ${fanSource.commentCount} indexed comments; no platform comment IDs.` } : source;
}), ...resonanceFanLedger];
export const reportParts = [
  { id: "readout", title: "Media Day review", description: "September 28, 2026 · 25 source records · eight official interviews" },
  { id: "word-resonance", title: "Word Resonance", description: `${resonanceReview.topics.length} phrase groups · separate fan and media readings` },
];

export const alignment: {id:string;title:string;status:string;reading:string;evidence:{speaker:string;role:string;statement:string;kind:"Reported statement"|"Direct quote";sourceId:string}[];meaning:string;watch:string}[] = [
  {
    id: "shared-work", title: "Familiarity gave the group a head start", status: "Gregory · Ott · Booker",
    reading: "Gregory, Ott and Booker all pointed to the value of having familiar teammates and coaches back together.",
    evidence: [
      {speaker:"Brian Gregory",role:"General manager",statement:"Twelve of the 15 players who finished last season and every coach return.",kind:"Reported statement",sourceId:"official-gregory-2026"},
      {speaker:"Jordan Ott",role:"Head coach",statement:"Summer gym participation was unusually sustained in his NBA experience.",kind:"Reported statement",sourceId:"si-roundup"},
      {speaker:"Devin Booker",role:"Guard",statement:"Familiar teammates and the returning coach gave the group a shared starting point.",kind:"Reported statement",sourceId:"booker-continuity"}
    ],
    meaning: "Ott added something useful: players were spending time in the gym together over the summer. They were using the head start.",
    watch: "Camp will show how quickly the group can build on the work it describes."
  },
  {
    id:"newcomer-work", title:"Kennard and Ighodaro described the same connection", status:"Kennard · Ighodaro",
    reading:"Both players described early work together. Each could explain how the relationship began.",
    evidence:[
      {speaker:"Luke Kennard",role:"Guard",statement:"He spent about a month working with teammates and developing a playing connection with Ighodaro.",kind:"Reported statement",sourceId:"official-kennard-2026"},
      {speaker:"Oso Ighodaro",role:"Center",statement:"Their two-man work felt natural on the first live day and continued during the month.",kind:"Reported statement",sourceId:"official-ighodaro-2026"}
    ],
    meaning:"Kennard was new to the team, but he and Ighodaro had already spent about a month working together. Both described how that connection developed.",
    watch:"Follow what Kennard says about communication and preparation once formal team work begins."
  },
  {
    id:"development",title:"Players went looking for experienced help",status:"Green · Booker · Maluach",
    reading:"Green sought Nash’s feedback. Maluach approached Booker. These are separate examples of players asking for help.",
    evidence:[
      {speaker:"Jalen Green",role:"Guard",statement:"Nash watched and critiqued workouts to help his pace and reading of the game.",kind:"Reported statement",sourceId:"green-nash"},
      {speaker:"Devin Booker",role:"Guard",statement:"Maluach reached out and the two worked together during the offseason.",kind:"Reported statement",sourceId:"maluach-development"},
      {speaker:"Khaman Maluach",role:"Center",statement:"He sought Booker’s guidance on responding to defensive pressure.",kind:"Reported statement",sourceId:"official-maluach-2026"}
    ],
    meaning:"The players went looking for advice. Green wanted Nash’s view of his workouts; Maluach wanted Booker’s help dealing with defensive pressure.",
    watch:"Look for follow-up accounts of what they learned and where it appears during camp."
  },
  {
    id:"resources",title:"Mat and Ott connected support with preparation",status:"Mat · Ott",
    reading:"Mat described his commitment to spending. Ott described the resources available for the summer’s work.",
    evidence:[
      {speaker:"Mat Ishbia",role:"Owner",statement:"Mortgage-company performance would have no effect on basketball spending or fan experience.",kind:"Reported statement",sourceId:"ap-resources"},
      {speaker:"Jordan Ott",role:"Head coach",statement:"Ownership resources and staff time supported the summer’s preparation.",kind:"Reported statement",sourceId:"si-roundup"}
    ],
    meaning:"Mat said the team’s spending would be protected. Ott described what that support made available for the summer’s work.",
    watch:"Future reporting can show how those resources continue to support preparation."
  }
];

export const recoveryReport = {
  development: [
    {title:"Peat was getting advice after workouts, too",body:"Peat described Bridges’ advice on driving to the basket and handling contact, along with conversations with Brooks. Younger teammates stayed after workouts to talk. The help continued after the workout ended.",sourceIds:["official-peat-2026"]},
    {title:"Fleming could explain what had changed",body:"Fleming said film study helped him recognize plays earlier and communicate sooner. His time with the Valley Suns helped the game slow down for him. Those are specific improvements he could describe himself.",sourceIds:["official-fleming-2026"]},
    {title:"Dunn was learning and helping",body:"Dunn asked experienced teammates for defensive advice. He also helped younger players. He was passing along what he knew while continuing to learn himself.",sourceIds:["official-dunn-2026"]}
  ],
  coverage: [
    {title:"Maluach’s development drew attention",body:"Hayden Cilley’s on-site report added detail to Booker’s work with Maluach. Luke Duffy treated the young center as a Media Day winner while questioning his readiness. The attention is encouraging; the question for camp is what Maluach can do with that preparation.",sourceIds:["morning-booker-maluach-cilley","morning-duffy-maluach"]},
    {title:"Bridges brought questions about accountability",body:"Duane Rankin reported why Booker wanted Bridges on the team and why Mat condemned Bridges’ prior conduct. Bailey Bassett and Kevin Hicks emphasized different parts of that same exchange. The basketball case and the questions about conduct both became part of the coverage.",sourceIds:["morning-rankin-bridges","bridges-clutchpoints","bridges-roundtable"]},
    {title:"Mat’s spending promise became national news",body:"David Brandt’s AP report focused on Mat’s assurance about basketball spending and the fan experience. Duffy welcomed that promise but questioned the roster decisions. He supported the willingness to spend while remaining doubtful about how the team was being built.",sourceIds:["ap-resources","morning-duffy-ownership"]},
    {title:"Booker reached a different audience through his shoes",body:"Zach Harris reported the Futura collaboration Booker wore at Media Day. It is a reminder that people encounter the Suns through player identity as well as basketball coverage. That report supplied no confirmed release date.",sourceIds:["booker-culture"]}
  ],
  fans: [
    {title:"Maluach drew enthusiasm",body:"The comments we collected about Maluach leaned positive. Fans liked what they heard about his development and wanted to see him play. In the articles, teammates supplied some of the praise.",topicId:"maluach",evidenceIds:["indexed-1wsm1rd-0fc5fff30f0bb79d"]},
    {title:"Finding the coverage drew frustration",body:"People asked where to watch, complained about the missing YouTube stream and helped each other find interviews. Some appreciated the recaps. The practical problem is clear: fans who wanted to follow the day had trouble finding the coverage.",topicId:"broadcast",evidenceIds:["indexed-1wsj8c9-9adb80b2fcdcd359"]},
    {title:"Fans disagreed about the roster",body:"Some comments welcomed the additions. Others questioned the team’s size, health and chances this season. A fan could be excited about Maluach and still have doubts about the team.",topicId:"roster",evidenceIds:["indexed-1wsj8c9-bd60a35ee8c8316a","fan_seed_005-comment-2"]}
  ],
  ownership: [
    {title:"Make it easy to watch",body:"People were asking where to watch and helping each other find interviews. They wanted to hear from the team. Making those interviews easy to find is part of taking care of the fans who showed up.",sourceIds:["fan-media-day"]},
    {title:"Players could explain how the help worked",body:"Peat named the advice he received. Fleming described what film study changed. Kennard explained his work with Ighodaro. For ownership, those accounts are a useful way to see what players are getting out of the people and time available to them.",sourceIds:["official-peat-2026","official-fleming-2026","official-kennard-2026"]},
    {title:"The Bridges questions will follow the team",body:"Reporters connected the Bridges decision to what Mat said about accountability. Future decisions will be judged against that explanation. People can like the basketball fit and still question the decision.",sourceIds:["morning-rankin-bridges","bridges-clutchpoints"]}
  ],
  camp: [
    {title:"When will there be a clearer answer on Williams?",body:"Gregory said it would take several months before there was a reliable answer about Williams’ return. There is no confirmed return date. Follow the team’s updates as camp continues.",sourceIds:["official-gregory-2026","nba-williams"]},
    {title:"What are the young centers learning?",body:"Maluach and Ighodaro described their summer work. During camp, look for what they say is getting easier and where they still need help. Their interviews and practice reporting can give us a clearer picture of how ready they are.",sourceIds:["official-maluach-2026","official-ighodaro-2026","official-gregory-2026"]},
    {title:"How are newcomers settling in?",body:"Kennard, Peat and Fleming described useful help at Media Day. As practices begin, follow what they say about understanding teammates and getting advice. That will tell us more about how the returning group is helping them settle in.",sourceIds:["official-kennard-2026","official-peat-2026","official-fleming-2026"]},
    {title:"What happens after Mat’s promises?",body:"Mat spoke about accountability and spending. Follow the decisions that come next and how he explains them. Those decisions will give people more to judge than the Media Day statements alone.",sourceIds:["morning-rankin-bridges","ap-resources","morning-duffy-ownership"]}
  ]
};

export const sectionCopy = {
  "voices": {
    "title": "The language behind the shared direction",
    "copy": "Short quotations reproduced as attributed by the named reporters. The official interviews used elsewhere are timestamped paraphrases of automated captions.",
    "interpretation": "These statements concern the September 28 event. The alignment section compares the attributed remarks with concrete accounts of activity and keeps the strength of each connection visible."
  },
  "local": {
    "title": "Development makes the day concrete",
    "copy": "Later original reporting sharpened the Booker–Maluach relationship and added Booker’s account of Bridges’ basketball fit. Gregory’s official interview supplies the more precise Williams assessment."
  },
  "national": {
    "title": "The wider audience heard different stories",
    "copy": "The retrieved AP dispatch emphasized spending commitment. Nationally distributed acquisition coverage raised organizational judgment and trust. Syndication is counted once per original report."
  },
  "creators": {
    "title": "Commitment and confidence received different readings",
    "copy": "Duffy welcomed the ownership commitment while questioning competitive judgment. His Maluach analysis was positive with conditions. Shoe coverage reached a different audience; PHNX’s preview remains dated context."
  },
  "fans": {
    "title": "Interest, questions and the experience of watching",
    "copy": "The review’s original megathread brought together enthusiasm, role questions and broadcast difficulties. Word Resonance below expands the captured fan pool with a second thread and the supplied social comments."
  }
};

export const audienceSignals: {label:string;direction:string;score:number|null;note:string}[] = [
  {
    "label": "Principals",
    "direction": "Shared preparation",
    "score": null,
    "note": "Named statements support several compatible priorities."
  },
  {
    "label": "Local coverage",
    "direction": "Development interest",
    "score": null,
    "note": "Specific player examples draw constructive attention."
  },
  {
    "label": "National coverage",
    "direction": "Several separate frames",
    "score": null,
    "note": "Resources and standards scrutiny lead different reports."
  },
  {
    "label": "Creators",
    "direction": "Conditional and mixed",
    "score": null,
    "note": "Completed Duffy commentary separates commitment from confidence in competitive results."
  },
  {
    "label": "Public discussion",
    "direction": "Mixed sampled discussion",
    "score": null,
    "note": "The review uses its original megathread; Word Resonance combines two r/suns threads with five supplied social posts."
  }
];

export const distribution = (["Official","Players & Coaches","Local Media","National Media","Creators","Fans"] as Category[]).map(category=>({category,count:sources.filter(source=>source.category===category).length}));

export const fanThemes = [
  {
    "title": "Basketball returning",
    "body": "Some visible participants welcomed the return of Suns activity and interviews."
  },
  {
    "title": "Development interest",
    "body": "The discussion included interest in younger players and Green's work with Nash."
  },
  {
    "title": "Open role questions",
    "body": "Participants disagreed about how players would fit together. Those views remain fan discussion."
  },
  {
    "title": "Finding the coverage",
    "body": "Some participants reported trouble locating or watching the stream. Others pointed to available interviews and replays."
  }
];

export const themes = [
  {
    "name": "Familiarity gains a practical meaning",
    "momentum": "Recurring",
    "strength": "Attributed",
    "groups": "Gregory, Ott, Booker",
    "evidence": "The principals described preparation as an ongoing obligation, with shared summer activity giving it context.",
    "relevance": "Specific accounts make the organization's stated direction easier to recognize and revisit."
  },
  {
    "name": "Experience is being used across generations",
    "momentum": "Emerging",
    "strength": "Named relationships",
    "groups": "Green, Nash, Booker, Maluach, Ighodaro, Kennard",
    "evidence": "Player accounts describe sought feedback, reciprocal help and early work with newcomers.",
    "relevance": "Ownership can follow the relationships through which the group uses experience."
  },
  {
    "name": "Availability shapes the next phase",
    "momentum": "Current",
    "strength": "Reported",
    "groups": "Gregory reporting, local coverage",
    "evidence": "Williams' absence remains part of the starting conditions for camp.",
    "relevance": "The preparation story sits alongside an availability question requiring current, attributed updates."
  },
  {
    "name": "Resources became a national story",
    "momentum": "Circulating",
    "strength": "Attributed",
    "groups": "Mat, Associated Press",
    "evidence": "AP made spending commitment the center of its Media Day dispatch.",
    "relevance": "The broader audience is evaluating ownership assurances as well as the basketball group."
  },
  {
    "name": "Standards carry public expectations",
    "momentum": "Contested",
    "strength": "Two frames",
    "groups": "Rankin, ClutchPoints, Roundtable, Duffy",
    "evidence": "The Bridges exchange circulated through coverage concerned with organizational judgment.",
    "relevance": "The standards described inside the organization will also be evaluated through decisions and public explanations."
  },
  {
    "name": "Player identity reaches beyond the game",
    "momentum": "Specialist",
    "strength": "One report",
    "groups": "Booker, sneaker coverage",
    "evidence": "Booker's collaboration created an additional Media Day story for a specialist audience.",
    "relevance": "The day carries several audiences, each encountering a different aspect of the franchise."
  }
];

export const watchColumns = {
  "positive": [
    "Reciprocal accounts of Ighodaro–Maluach help.",
    "Kennard and Ighodaro describe their early work together.",
    "Peat and Fleming identify specific sources of guidance."
  ],
  "questions": [
    "Williams’ eventual return date remains unknown.",
    "Camp and games have yet to establish the effect of summer preparation."
  ],
  "watch": [
    "Whether newcomer integration remains visible in camp reporting.",
    "How the group responds as availability and competition test preparation.",
    "How ownership commitments and standards are evaluated over time."
  ]
};

export const implications = [
  {
    "n": "01",
    "title": "Reciprocal accounts make alignment credible",
    "body": "Two players describing the same working relationship give ownership a stronger basis for judgment. Keep those named connections visible as the season supplies new evidence."
  },
  {
    "n": "02",
    "title": "Access to experience is an organizational asset",
    "body": "Peat’s veteran conversations and Fleming’s development account show how support reaches a player. Their descriptions give ownership a way to follow the experience newcomers actually have."
  },
  {
    "n": "03",
    "title": "Public confidence has several foundations",
    "body": "Preparation, spending commitment and organizational standards attract different questions. Track the evidence behind each separately; progress in one area cannot establish the others."
  }
];

export const methodology = {
  "searched": "Official Suns interview recordings and caption exports, original local reporting, AP wire coverage, nationally distributed digital reporting, completed specialist commentary, dated preview listings and one public Suns discussion. Morning discovery-only episode leads remain excluded.",
  "selection": "25 source records are included: 21 event records and four preview/background records. Eight are official player or leadership interviews. AP syndications count once; Yahoo-hosted originals retain their author. Separate articles can describe the same exchange and do not become independent confirmations of that event. Duffy’s two pieces remain one commentator’s perspective.",
  "sentiment": "Labels describe the framing of each record. Qualitative audience readings are editorial interpretations. No numeric approval score or representative fan percentage is estimated.",
  "resonance": `${resonanceCopy.caveat} ${resonanceCopy.sample} ${resonanceCopy.filters} Green indicates positive language, red negative and gray neutral or mixed. Unscored opinions are labeled separately. Fan volume counts distinct captured comments: 1–4 low, 5–14 medium, 15+ high. Media volume counts articles: 1 low, 2 medium, 3+ high. Scores average coded excerpts within each unit, then average scored units per audience. Topic selection is editorial; articles may mention multiple topics and are not independent confirmation. This separate phrase dataset does not change the 25-record Media Day source ledger.`,
  "limitations": "Official newcomer evidence is attributed paraphrase of automated captions, with timestamps and links. Workouts are participants’ accounts. Completed PHNX/Bourguet reaction and a broader national basketball assessment were not retrieved; indexed-only sources are identified. The review’s original fan thread is indicative; Word Resonance adds partial indexed captures from two threads and supplied posts, with access limits disclosed. Williams’ return date remains unknown. The hero uses current official Media Day photographs with rendered camera movement."
};

export const audioBrief = {
  "ready": true,
  "title": "In the Same Building",
  "label": "Audio",
  "src": `${edition.basePath}/audio/the-echo-suns-002-media-day-2026-09-29-v9.mp3`,
  "transcript": `${edition.basePath}/content/audio-brief-transcript.txt`,
  "paragraphs": [
    "Mat, the best moment from Media Day wasn't at a podium. It was Oso Ighodaro talking about pickup games with Khaman Maluach. They were on opposite teams, fighting for the same minutes, and Oso kept giving him pointers anyway. Maluach said he'd go to Oso after plays and ask what he saw.",
    "That's what continuity actually looks like. Twelve of the fifteen players from the end of last season are back, and so is every coach. The young guys know who to ask. Maluach goes to Booker. Kennard works with Oso. Fleming credits film study and his time with the Valley Suns.",
    "Fans noticed. They loved what they heard about Maluach. What they didn't love was trying to watch. People went looking for a stream and couldn't find one.",
    "Three things to watch in camp. First, Williams: Gregory says it'll be months before there's a real read on his return. Second, how fast the young centers grow into that gap. Third, the Bridges decision, because people will keep measuring it against the standards you laid out.",
    "My one call: next Media Day, one official stream, pinned everywhere. The fans showed up. Make it easy for them to get in.",
    "Dominate."
  ]
};

export const heroMedia = {
  ready: true,
  landscape: `${edition.basePath}/assets/media/media-day-2026-09-28-1920x1080-v3.mp4`,
  portrait: `${edition.basePath}/assets/media/media-day-2026-09-28-1080x1920-v3.mp4`,
  poster: `${edition.basePath}/assets/media/media-day-2026-09-28-poster-v3.webp`,
  portraitPoster: `${edition.basePath}/assets/media/media-day-2026-09-28-portrait-poster-v3.webp`,
  alt: "Phoenix Suns players at September 28, 2026 Media Day. Official Phoenix Suns photographs, arranged with purple and orange depth and slow camera motion.",
};

export const cinematicDivider = {
  landscape: `${edition.basePath}/assets/media/media-day-2026-09-28-sting-1920x1080-v3.mp4`,
  portrait: `${edition.basePath}/assets/media/media-day-2026-09-28-sting-1080x1920-v3.mp4`,
  poster: `${edition.basePath}/assets/media/media-day-2026-09-28-sting-1920x1080-v3-poster.webp`,
  portraitPoster: `${edition.basePath}/assets/media/media-day-2026-09-28-sting-1080x1920-v3-poster.webp`,
};
