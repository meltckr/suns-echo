export type Sentiment = "Strongly Positive" | "Positive" | "Mixed" | "Neutral" | "Negative" | "Strongly Negative";
export type Category = "Official" | "Players & Coaches" | "Local Media" | "National Media" | "Creators" | "Fans";
export type Source = {
 id:string; source:string; outlet:string; category:Category; date:string; sentiment:Sentiment;
 themes:string[]; confidence:"High"|"Medium"; url:string; evidence:string;
 phase:"Event"|"Preview"|"Background"; quote?:string; quoteType?:"Direct quote";
 speaker?:string; speakerRole?:string; quoteContext?:string;
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
    "id": "williams-gregory",
    "source": "Gregory expects Williams to miss several months",
    "outlet": "Kellan Olson reporting / HoopsHype via Yahoo",
    "category": "Local Media",
    "date": "Sept. 28 · 10:50 AM Arizona",
    "phase": "Event",
    "sentiment": "Neutral",
    "themes": [
      "Availability",
      "Young-player opportunity"
    ],
    "confidence": "Medium",
    "url": "https://sports.yahoo.com/articles/suns-gm-brian-gregory-expects-175059788.html",
    "evidence": "Secondary relay attributes a several-month absence to Gregory. Original Olson post and any updated timetable remain in the morning verification queue."
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
    "evidence": "Mat said mortgage-company performance would have no effect on Suns spending or fan experience. AP also reported his intention to buy an additional 14% of the team; completion is unverified.",
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
    "evidence": "Coverage relays Mat's condemnation of Bridges' prior conduct and his stated accountability rationale. Its basketball-fit discussion accompanies continued concern about the acquisition. Recording verification remains pending."
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
    "evidence": "Public episode description previews the day and discusses national rankings. This is incoming context. The completed recap remains in the morning queue."
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
  }
];

export const edition = {
  "basePath": process.env.NEXT_PUBLIC_ECHO_BASE_PATH ?? "/suns-echo",
  "editorialFinal": false,
  "releaseAuthorized": false,
  "series": "THE ECHO",
  "number": "002",
  "title": "In the Same Building",
  "subtitle": "Phoenix Suns Media Day in perspective: the shared direction, the individual stories and the questions carrying into camp.",
  "eventDate": "September 28, 2026",
  "reportingWindow": "September 28 · evening working edition · morning refresh September 29",
  "generatedLabel": "Working edition · September 28, 2026 · America/Phoenix",
  "statusLabel": "Review draft · morning reporting update pending",
  "thesis": "The most useful connection across Media Day is the relationship between a stated standard and specific accounts of preparation. Several Suns described shared work and individual initiative. The public response also brought availability and organizational trust into the picture ownership carries into camp.",
  "sourceCount": 14,
  "includedCount": 14,
  "reviewedCount": 14,
  "confidence": "Provisional · reporting still developing",
  "overallDirection": "Constructive basketball signals; mixed wider reception",
  "editorialIndex": null as number | null,
  "indexNote": "Qualitative working read. Numeric scoring remains open while reporting develops. Four records supply dated preview or background context; ten concern the event.",
  "dominantSignalNote": "The clearest overlap is shared preparation. External coverage attaches different expectations to development, resource commitment and organizational standards.",
  "readoutSourceIds": [
    "booker-continuity",
    "si-roundup",
    "maluach-development",
    "green-nash",
    "ap-resources",
    "bridges-clutchpoints",
    "williams-gregory",
    "nba-williams"
  ],
  "readoutParagraphs": [
    "Booker described a young teammate reaching out to arrange a workout. That detail gives the day a useful center. Maluach was seeking access to an established player, and Booker was making room for the work. Read beside Green's account of learning with Nash, it suggests a group beginning to use the experience available inside the organization.",
    "Leadership's descriptions point toward the same activity. Gregory emphasized that identity requires repetition. Ott described unusually sustained summer participation. Booker spoke about familiar teammates, the returning coach and time together. My read is that continuity is becoming easier to describe through specific examples. That gives ownership a clearer way to recognize progress as camp begins.",
    "The day also traveled through several distinct public stories. Local development coverage put attention on Maluach and Green. The AP dispatch led with Mat's assurance about spending. Other reports scrutinized the Bridges decision and the standards used to explain it. Williams' reported absence gave the basketball optimism an immediate practical condition. Each audience carried a different piece of the same day.",
    "That is where a broad ownership view adds value. It connects the internal accounts of preparation with the expectations those accounts create outside the building. Tomorrow's completed reporting will sharpen the reception read, especially the major local recaps and the original interview context."
  ],
  "readout": "Several Suns principals described compatible priorities around shared preparation and development. Early outside coverage emphasized different subjects, including resources, availability and organizational standards. The overnight update will complete the reception read.",
  "bottomLine": "The day made the Suns' direction more specific. Leadership discussed the conditions for progress; players described work they had undertaken. Ownership can carry those examples into camp alongside the questions the public is already asking. Shared preparation is a useful starting point. Its next evidence will come through the team's readiness, development and response to the season's demands."
};

export const alignment: {id:string;title:string;status:string;reading:string;evidence:{speaker:string;role:string;statement:string;kind:"Reported statement"|"Direct quote";sourceId:string}[];meaning:string;watch:string}[] = [
  {
    "id": "shared-work",
    "title": "Continuity is being expressed through work",
    "status": "Three named principals",
    "reading": "Gregory, Ott and Booker approached the subject at different levels and described compatible priorities.",
    "evidence": [
      {
        "speaker": "Brian Gregory",
        "role": "General manager",
        "statement": "Maintaining identity requires repeated daily improvement.",
        "sourceId": "si-roundup",
        "kind": "Reported statement"
      },
      {
        "speaker": "Jordan Ott",
        "role": "Head coach",
        "statement": "Summer gym participation was unusually sustained in his NBA experience.",
        "sourceId": "si-roundup",
        "kind": "Reported statement"
      },
      {
        "speaker": "Devin Booker",
        "role": "Guard",
        "statement": "Familiar teammates and the returning coach gave the group a shared starting point.",
        "sourceId": "booker-continuity",
        "kind": "Reported statement"
      }
    ],
    "meaning": "The accounts make the continuity message easier to evaluate. Ownership has examples of preparation to follow as the group moves into camp.",
    "watch": "Whether the preparation described becomes visible readiness once team activities begin."
  },
  {
    "id": "development",
    "title": "Players are taking initiative to learn",
    "status": "Two distinct player examples",
    "reading": "Green's work with Nash and Maluach's outreach to Booker describe two separate relationships around improvement.",
    "evidence": [
      {
        "speaker": "Jalen Green",
        "role": "Guard",
        "statement": "Nash observed and critiqued workouts to help his pace and reading of the game.",
        "sourceId": "green-nash",
        "kind": "Reported statement"
      },
      {
        "speaker": "Devin Booker",
        "role": "Guard",
        "statement": "Maluach reached out and the two worked together during the offseason.",
        "sourceId": "maluach-development",
        "kind": "Reported statement"
      },
      {
        "speaker": "Khaman Maluach",
        "role": "Center",
        "statement": "His stated priority is helping the team regardless of starting status.",
        "sourceId": "maluach-development",
        "kind": "Reported statement"
      }
    ],
    "meaning": "There is reported initiative at different career stages. Green sought experienced feedback; Maluach sought a working relationship with the team's established guard.",
    "watch": "How those relationships develop, with progress assessed through current reporting and demonstrated work."
  },
  {
    "id": "resources",
    "title": "Ownership support connects with the coach's account",
    "status": "Two named principals",
    "reading": "Mat described resource commitment. Ott credited the support available for preparation.",
    "evidence": [
      {
        "speaker": "Mat Ishbia",
        "role": "Owner",
        "statement": "Mortgage-company performance would have no effect on basketball spending or fan experience.",
        "sourceId": "ap-resources",
        "kind": "Reported statement"
      },
      {
        "speaker": "Jordan Ott",
        "role": "Head coach",
        "statement": "Ownership resources and staff time supported the summer's preparation.",
        "sourceId": "si-roundup",
        "kind": "Reported statement"
      }
    ],
    "meaning": "The owner and coach described the support relationship consistently. The ownership implication is the connection between resources supplied and opportunities the group uses.",
    "watch": "Continue separating stated financial commitment from verified transactions and operating results."
  }
];

export const sectionCopy = {
  "voices": {
    "title": "The language behind the shared direction",
    "copy": "Selected complete short quotations as reported from Media Day. Each identifies the speaker, context and original reporting page. Recording checks remain in the morning update.",
    "interpretation": "These statements concern the September 28 event. The alignment section compares the attributed remarks with concrete accounts of activity and keeps the strength of each connection visible."
  },
  "local": {
    "title": "Development makes the day concrete",
    "copy": "Local coverage gave the preparation story specific people and circumstances. Maluach's progress drew attention; Williams' recovery kept availability in view."
  },
  "national": {
    "title": "The wider audience heard different stories",
    "copy": "The retrieved AP dispatch emphasized spending commitment. The Bridges coverage focused on organizational judgment and trust. This is a developing selection of coverage."
  },
  "creators": {
    "title": "The specialist conversation is still taking shape",
    "copy": "The shoe collaboration reached a culture audience. PHNX's dated preview supplies incoming context; its completed recap will be added during the morning update."
  },
  "fans": {
    "title": "Interest, questions and the experience of watching",
    "copy": "One public thread supplies an indicative view of the discussion. Enthusiasm appeared alongside role questions and difficulties locating or watching the broadcast."
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
    "direction": "Morning recap pending",
    "score": null,
    "note": "Preview context is dated and separated from event response."
  },
  {
    "label": "Public discussion",
    "direction": "Mixed in one thread",
    "score": null,
    "note": "Indicative comments supply no estimate of wider fan opinion."
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
    "strength": "Two examples",
    "groups": "Green, Nash, Booker, Maluach",
    "evidence": "The reported mentoring relationships connect available experience with player initiative.",
    "relevance": "The work described gives ownership a view into how development opportunities are being used."
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
    "groups": "ClutchPoints, Roundtable",
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
    "Several principals described shared preparation.",
    "Distinct player accounts show initiative to learn.",
    "Maluach's development attracted constructive coverage."
  ],
  "questions": [
    "What the completed local recaps add to the reception read.",
    "Whether original recordings change the context of selected remarks.",
    "What current official reporting establishes about Williams' recovery."
  ],
  "watch": [
    "How the summer accounts carry into camp readiness.",
    "Whether newer players describe compatible priorities in full interviews.",
    "How replays and interview distribution serve interested supporters."
  ]
};

export const implications = [
  {
    "n": "01",
    "title": "Ownership has a more specific preparation story",
    "body": "Shared work is easier to follow when principals describe what they actually did. Those accounts give camp reporting a useful starting point."
  },
  {
    "n": "02",
    "title": "Alignment has several levels of support",
    "body": "The daily-work theme has three named principals. Mentorship and resource support rest on narrower sets of examples. Keep those differences visible."
  },
  {
    "n": "03",
    "title": "One event produces several public narratives",
    "body": "Development, resources, organizational standards and player identity reached different audiences. Reading them together gives ownership a fuller picture of the day."
  },
  {
    "n": "04",
    "title": "Young-player opportunity carries immediate attention",
    "body": "Maluach's preparation is already drawing coverage as the center situation develops. Continue judging progress through current accounts and demonstrated readiness."
  },
  {
    "n": "05",
    "title": "The morning reporting cycle can change emphasis",
    "body": "Completed local recaps and full interview context may strengthen a theme or reveal a gap. The final edition will incorporate that reporting before its narration is produced."
  }
];

export const methodology = {
  "searched": "Fresh Suns/NBA information, original local articles, named-reporter relays, AP wire reporting, national digital coverage, specialist publications, creator episode listings and public Reddit discussion. Discovery and preview items stay in the research record.",
  "selection": "Fourteen unique reporting pages are included: ten event records and four preview/background records. The same AP story across hosts counts once. Two Bridges articles supply distinct editorial frames of the same exchange. One fan thread counts once. Included records reviewed here are the only counted review total.",
  "sentiment": "Labels describe each record's framing. Neutral includes descriptive availability or financial reporting; mixed includes support with material concern. Numeric scores remain open while overnight coverage develops. No public approval percentage is estimated.",
  "limitations": "This review draft awaits completed local recaps, official recording checks and broader national basketball reaction. Indexed-only material and secondary relays are identified. Statements about summer activity are attributed accounts. The fan thread is indicative. Planned ownership acquisition is not confirmed complete. Hero photography is from the Suns' official September 28 Media Day post; the camera motion is a rendered treatment of still photographs."
};

export const audioBrief = {
  "ready": false,
  "title": "In the Same Building",
  "label": "Two-minute ownership brief",
  "src": `${edition.basePath}/audio/the-echo-suns-002-media-day-2026-09-29-v1.mp3`,
  "transcript": `${edition.basePath}/content/audio-brief-transcript.txt`,
  "paragraphs": [
    "Mat, the most useful connection across Media Day is between the standard people described and the work they said they had done.",
    "One detail gives that connection a human shape. Booker described Maluach reaching out to arrange a workout. Green described learning with Nash. Those are two different players using experience available around the organization.",
    "Leadership's accounts point in a compatible direction. Gregory emphasized daily improvement. Ott described unusually sustained summer participation. Booker talked about the value of returning to familiar teammates and the same coach. My read is that continuity is becoming easier to recognize through specific examples.",
    "The alignment section keeps the evidence visible. Shared preparation has several named principals behind it. Mentorship has distinct player examples. Ownership support connects with the coach's account of the resources available for the work.",
    "The wider conversation carried other parts of the day. Development coverage put attention on Maluach and Green. AP emphasized your spending assurance. The Bridges reporting kept organizational standards under scrutiny. Williams' availability remains a practical condition for the next phase.",
    "Those different stories are useful to ownership when they're read together. They show where the group's self-description connects with public expectations, and where further evidence is still needed.",
    "The morning reporting update will complete that picture. The next watch is how the preparation people described appears in camp readiness and continued development.",
    "Dominate."
  ]
};

export const heroMedia = {
  ready: true,
  landscape: `${edition.basePath}/assets/media/media-day-2026-09-28-1920x1080-v1.mp4`,
  portrait: `${edition.basePath}/assets/media/media-day-2026-09-28-1080x1920-v1.mp4`,
  poster: `${edition.basePath}/assets/media/media-day-2026-09-28-poster-v1.webp`,
  portraitPoster: `${edition.basePath}/assets/media/media-day-2026-09-28-portrait-poster-v1.webp`,
  alt: "Phoenix Suns players at September 28, 2026 Media Day. Official Phoenix Suns photographs, arranged with purple and orange depth and slow camera motion.",
};
