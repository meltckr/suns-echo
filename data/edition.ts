export type Sentiment = "Strongly Positive" | "Positive" | "Mixed" | "Neutral" | "Negative" | "Strongly Negative";
export type Category = "Official" | "Players & Coaches" | "Local Media" | "National Media" | "Creators" | "Fans";

export type Source = {
  id: string;
  source: string;
  outlet: string;
  category: Category;
  date: string;
  sentiment: Sentiment;
  themes: string[];
  confidence: "High" | "Medium";
  url: string;
  evidence: string;
  quote?: string;
  quoteType?: "Direct quote" | "Paraphrase";
  speaker?: string;
  speakerRole?: string;
  quoteContext?: string;
};

export const edition = {
  series: "THE ECHO",
  title: "Aligned and Extended",
  subtitle: "How Dillon Brooks’ three-year commitment landed—and what it says about the Suns’ operating identity",
  eventDate: "August 6, 2026",
  reportingWindow: "April 28–August 6, 2026 · reaction verified through 4:30 PM Arizona",
  thesis: "The $73 million extension was received less as a reward for 20.2 points per game than as a vote for continuity. The defining number is not the total—it is three years, a term that protects Phoenix from the four-year risk the market had debated while keeping a visible identity carrier beside Devin Booker through 2029–30.",
  sourceCount: 25,
  includedCount: 25,
  reviewedCount: 62,
  confidence: "Moderate–high",
  overallDirection: "Strongly positive",
  editorialIndex: 82,
  indexNote: "Directional editorial index from the included evidence; not polling, market valuation or a public approval rating.",
  readout: "The first wave of reaction treated Phoenix’s three-year, $73 million extension with Dillon Brooks as a value agreement. That judgment was shaped by the market people had anticipated: Brooks had been eligible for four years and roughly $125 million, local discussion frequently imagined a number near or above $30 million annually, and the reported agreement instead averages about $24.3 million across the new years. The broader meaning is continuity. Mat had publicly described Brooks as part of the future; Brooks had said he wanted to retire a Sun; and the 2025–26 evidence gave both sides a basketball basis for agreement—20.2 points per game, the team’s hardest perimeter assignments, a 45-win season and a team-high 26.0 points per game in the Oklahoma City series. Local, national, creator and visible fan reaction largely converged on three ideas: the term is disciplined, the player has become a credible identity carrier, and Brian Gregory’s offseason has prioritized retainable contracts around the team’s core. The restraint is equally important. Brooks will be 34 when the extension ends. His offense reached a career high, his technical-foul profile remains part of the package, and Phoenix still lost in the first round. The deal preserves a useful standard; the next test is whether the broader roster can convert that standard into a deeper postseason result.",
  bottomLine: "This extension matters because it converts a year of cultural language into a durable personnel decision without paying the four-year price that had framed the risk. Phoenix kept the player most publicly associated with its tougher operating identity, Brooks secured long-term commitment in a place he has described as home, and the three-year term keeps the bet aligned with the present competitive window. The reaction is strongly positive because the contract appears to reward verified production while retaining some age protection. What it does not do is prove that continuity alone is enough. The ownership-level value will be measured by whether Brooks’ daily standard continues to elevate younger players, whether his offensive growth holds within a healthier lineup, and whether the Suns’ identity becomes more than a compelling regular-season story. The agreement is a disciplined act of continuity. The performance burden now shifts from defining the culture to scaling it.",
};

export const audioBrief = {
  title: "The Echo ownership brief",
  label: "Two-minute audio",
  src: "/suns-echo/audio/the-echo-suns-001-aligned-and-extended.mp3",
  paragraphs: [
    "Mat, here is the two-minute ownership read from this Suns edition of The Echo.",
    "The reaction to Dillon Brooks’ three-year, seventy-three-million-dollar extension is strongly positive, but the revealing detail is the term, not the total. The public debate had been framed by a possible four-year deal worth roughly one hundred twenty-five million dollars. Phoenix stopped at three new years and about twenty-four-point-three million annually. That reads as commitment with age protection.",
    "The agreement also closes a loop the organization had already opened. You said publicly that Dillon was part of the future. Dillon said he wanted to retire a Sun. In between, he averaged a career-high twenty-point-two points, took the hardest perimeter assignments, helped anchor a forty-five-win identity shift and led Phoenix with twenty-six points per game in the Oklahoma City series.",
    "Local and national coverage, creator reaction and the visible fan sample largely converged on the same interpretation: Phoenix kept an identity carrier at a number below the market many expected. The phrase team-friendly appeared repeatedly. So did praise for Brian Gregory’s broader pattern of retaining useful players on manageable terms.",
    "The restraint matters. This is a same-day, curated reaction sample, not polling. The club had not yet published a full announcement or fresh player-and-coach reaction by the reporting cutoff. Brooks will be thirty-four when the extension ends. His scoring reached a career high that must now hold within a healthier lineup, and the team still has to move beyond a first-round exit.",
    "The ownership takeaway is straightforward. This is a disciplined continuity decision. It preserves a daily standard the organization values without taking the full four-year risk. The next signal is whether that standard scales—into younger-player development, cleaner collective execution and a deeper postseason result.",
    "Dominate.",
  ],
};

export const audienceSignals = [
  { label: "Overall", direction: "Strongly positive", score: 82, note: "Term discipline and continuity aligned" },
  { label: "Local media", direction: "Positive", score: 80, note: "Value, age and flexibility led the frame" },
  { label: "National media", direction: "Positive", score: 78, note: "Production and identity supported the deal" },
  { label: "Players & staff", direction: "Strongly positive", score: 91, note: "Prior intent was unusually explicit" },
  { label: "Creators", direction: "Strongly positive", score: 86, note: "Value framing led same-day coverage" },
  { label: "Fans", direction: "Strongly positive / mixed", score: 79, note: "Broad approval with age and ceiling friction" },
];

export const distribution = [
  { category: "Official", count: 4 },
  { category: "Players & coaches", count: 4 },
  { category: "Local media", count: 5 },
  { category: "National media", count: 5 },
  { category: "Creators", count: 3 },
  { category: "Fans", count: 4 },
];

export const themes = [
  { name: "Three years changed the risk conversation", momentum: "Rising", strength: "High", groups: "Media · creators · fans", evidence: "The reported $73 million total averages about $24.3 million across the new years and stops before a fourth extension season.", relevance: "Phoenix retained the player without accepting the maximum length that had driven age-based concern." },
  { name: "Continuity became a transaction", momentum: "Rising", strength: "High", groups: "Ownership · player · local media", evidence: "Mat’s public expectation that Brooks would stay and Brooks’ stated wish to retire in Phoenix now have contractual weight through 2029–30.", relevance: "The organization followed through on a visible commitment, reinforcing credibility around its identity language." },
  { name: "Production gave the culture case proof", momentum: "Stable", strength: "High", groups: "Official data · national media · teammates", evidence: "Brooks averaged 20.2 points in the regular season and a team-high 26.0 in the first round while retaining primary defensive responsibility.", relevance: "The agreement is supported by behavior and output, not personality alone." },
  { name: "Brian Gregory’s contract pattern is part of the story", momentum: "Rising", strength: "Medium", groups: "Local media · creators · Suns fans", evidence: "Reaction connected Brooks’ deal to the earlier retention of Collin Gillespie, Jordan Goodwin and Mark Williams on multi-year agreements.", relevance: "Roster continuity is becoming legible as an operating approach rather than a sequence of isolated moves." },
  { name: "The villain label became an owned asset", momentum: "Stable", strength: "Medium", groups: "National media · fans · Brooks", evidence: "Coverage still used the villain frame, but Phoenix audiences largely translated it into edge, work and competitive personality.", relevance: "A polarizing national identity can create local affinity when the daily standard underneath it is credible." },
  { name: "The ceiling question did not disappear", momentum: "Stable", strength: "Medium", groups: "Skeptical fans · analysts", evidence: "The strongest counter-frame asked whether Phoenix is preserving a 45-win, first-round core rather than materially raising its postseason ceiling.", relevance: "Continuity is useful only if development, health and roster fit turn it into additional competitive range." },
];

export const watchColumns = {
  positive: [
    "The three-year term avoids the fourth season that drove the clearest age concern.",
    "Brooks’ public desire to stay and the organization’s intent were aligned before negotiation became final.",
    "Production, defensive responsibility and teammate testimony all support the identity case.",
  ],
  questions: [
    "The precise year-by-year structure, options and protections were not public at the reporting cutoff.",
    "Brooks’ 20.2-point season was a career high; sustainability inside a healthier lineup remains untested.",
    "A strong culture story and a 45-win season still ended in a first-round sweep.",
  ],
  watch: [
    "Whether Phoenix confirms the agreement and adds fresh organizational or player language.",
    "Whether Brooks’ offensive role becomes more efficient as Booker, Green and the full group share the floor.",
    "Whether his standard transfers into visible growth from the younger core and better postseason execution.",
  ],
};

export const implications = [
  { n: "01", title: "The organization followed through", body: "Public intent from ownership and the player was converted into a completed agreement. That consistency carries cultural value beyond the contract itself." },
  { n: "02", title: "The term is the discipline", body: "Three new years keep Brooks inside the present window while limiting the age exposure that made a four-year extension harder to defend." },
  { n: "03", title: "The Durant return gained another layer of durability", body: "A player initially discussed as part of the trade return is now secured as a productive, identifiable piece of the Suns’ next phase." },
  { n: "04", title: "Culture now carries a measurable performance burden", body: "The organization has preserved the standard-setter. The next question is whether that standard produces development, availability and postseason growth." },
  { n: "05", title: "The agreement leaves room for constructive tension", body: "Strong approval should not erase age, role and ceiling questions. Those are not arguments against the deal; they are the conditions by which its value will be judged." },
];

export const sources: Source[] = [
  { id:"espn-charania", source:"Brooks agrees to three-year, $73 million extension", outlet:"ESPN / Shams Charania", category:"Official", date:"Aug. 6", sentiment:"Positive", themes:["Contract terms","Continuity","Identity"], confidence:"High", url:"https://www.espn.com/contributor/shams-charania/db563bf7c10cf", evidence:"Primary announcement reporting: three years, $73 million, through 2029–30; terms attributed to agent Mike George." },
  { id:"suns-roster", source:"Phoenix Suns roster", outlet:"Phoenix Suns / NBA.com", category:"Official", date:"Aug. 6", sentiment:"Neutral", themes:["Team status","Player identity"], confidence:"High", url:"https://www.nba.com/suns/roster", evidence:"Official team roster confirms Brooks as a Phoenix guard-forward." },
  { id:"suns-game-notes", source:"2025–26 Phoenix Suns game notes", outlet:"Phoenix Suns / NBA.com", category:"Official", date:"Apr. 2026", sentiment:"Neutral", themes:["Season production","Team record"], confidence:"High", url:"https://www.nba.com/gamenotes/suns.pdf", evidence:"Official season line: 56 games, 20.2 points, 3.6 rebounds and 1.8 assists per game." },
  { id:"nba-player", source:"Dillon Brooks player profile", outlet:"NBA.com", category:"Official", date:"Aug. 6", sentiment:"Neutral", themes:["Career record","Defensive recognition"], confidence:"High", url:"https://www.nba.com/player/1628415/dillon-brooks/bio", evidence:"Official career profile, including 2023 All-Defensive Second Team recognition." },

  { id:"brooks-players-tribune", source:"No Way in Hell They Wanna See Us", outlet:"The Players’ Tribune", category:"Players & Coaches", date:"Apr. 7", sentiment:"Strongly Positive", themes:["Commitment","Phoenix affinity","Competitive identity"], confidence:"High", url:"https://www.theplayerstribune.com/dillon-brooks-nba-basketball-phoenix-suns", evidence:"Brooks’ first-person statement supplied the clearest public commitment before the extension.", quote:"I want to retire a Sun.", quoteType:"Direct quote", speaker:"Dillon Brooks", speakerRole:"Phoenix Suns forward", quoteContext:"On his desired future in Phoenix" },
  { id:"brooks-road-trippin", source:"Brooks reflects on his first Suns season", outlet:"Road Trippin’ / Yahoo Sports", category:"Players & Coaches", date:"July 25", sentiment:"Strongly Positive", themes:["Belonging","Coaches","Fans"], confidence:"High", url:"https://sports.yahoo.com/articles/dillon-brooks-sends-strong-message-200556552.html", evidence:"Brooks described Phoenix as a second opportunity and praised his working environment.", quote:"I think it was a dream come true. Love the coaches, love my players, and the fans are exquisite.", quoteType:"Direct quote", speaker:"Dillon Brooks", speakerRole:"Phoenix Suns forward", quoteContext:"On his first season in Phoenix" },
  { id:"gillespie-espn", source:"How Brooks helped turn around Phoenix", outlet:"ESPN", category:"Players & Coaches", date:"Jan. 15", sentiment:"Strongly Positive", themes:["Work ethic","Peer influence","Daily standard"], confidence:"High", url:"https://www.espn.com/nba/story/_/id/47602565/dillon-brooks-phoenix-suns-dillon-villain-nba", evidence:"Teammate testimony connected Brooks’ influence to observable daily work.", quote:"He’s in the gym more than anybody that I know.", quoteType:"Direct quote", speaker:"Collin Gillespie", speakerRole:"Phoenix Suns guard", quoteContext:"On Brooks’ work habits" },
  { id:"ishbia-intent", source:"Ownership’s public extension intent", outlet:"Arizona Sports / Suns on SI", category:"Players & Coaches", date:"May 1", sentiment:"Strongly Positive", themes:["Ownership intent","Leadership","Continuity"], confidence:"High", url:"https://www.si.com/nba/suns/onsi/phoenix-suns-exploring-dillon-brooks-decision", evidence:"Mat publicly made retention the expected outcome months before the agreement.", quote:"I expect Dillon Brooks to be here. We want Dillon Brooks to be here.", quoteType:"Direct quote", speaker:"Mat Ishbia", speakerRole:"Phoenix Suns owner", quoteContext:"On Brooks’ future with the organization" },

  { id:"si-extension", source:"Why Brooks’ three-year extension was a win", outlet:"Sports Illustrated", category:"Local Media", date:"Aug. 6", sentiment:"Strongly Positive", themes:["Contract value","Career season","Continuity"], confidence:"Medium", url:"https://www.si.com/nba/suns", evidence:"Same-day story supplied by Mel framed the extension as deserved after Brooks averaged 20.2 points in his first Suns season." },
  { id:"bright-side-finance", source:"The financial impact of a Brooks extension", outlet:"Bright Side of the Sun", category:"Local Media", date:"Apr. 30", sentiment:"Mixed", themes:["Age curve","Flexibility","Extension range"], confidence:"High", url:"https://www.brightsideofthesun.com/suns-rumors/103693/dillon-brooks-extension-suns-offseason-salary-cap-marc-stein-report/", evidence:"Pre-deal analysis established the core tension: reward the identity shift without limiting future flexibility." },
  { id:"bright-side-next-move", source:"Suns Reacts: the next big move isn’t a trade", outlet:"Bright Side of the Sun", category:"Local Media", date:"July 21", sentiment:"Mixed", themes:["Age","Maximum extension","Roster planning"], confidence:"High", url:"https://www.brightsideofthesun.com/suns-roster/108033/miles-bridges-dillon-brooks-contract-extension-options-salary-cap-analysis", evidence:"Local coverage highlighted the four-year, roughly $125 million ceiling and concern about the final season of a longer deal." },
  { id:"arizona-sports-offseason", source:"How Phoenix’s offseason moves were viewed", outlet:"Arizona Sports", category:"Local Media", date:"July 8", sentiment:"Positive", themes:["Team-friendly contracts","Roster continuity","Flexibility"], confidence:"High", url:"https://arizonasports.com/nba/phoenix-suns/2026-phoenix-suns-offseason-how-moves-viewed-so-far", evidence:"Local cap and roster discussion placed Brooks’ expected extension inside a broader pattern of manageable multi-year agreements." },
  { id:"cronkite-continuity", source:"Suns commit to depth, youth and culture", outlet:"Cronkite News", category:"Local Media", date:"July 13", sentiment:"Positive", themes:["Organizational direction","Continuity","Development"], confidence:"High", url:"https://cronkitenews.azpbs.org/2026/07/13/phoenix-suns-commit-depth-youth-culture/", evidence:"Independent local reporting documented the organization’s continuity and development priorities before the Brooks deal." },

  { id:"si-villain", source:"The NBA’s biggest villain gets a deserved extension", outlet:"Sports Illustrated / Apple News", category:"National Media", date:"Aug. 6", sentiment:"Strongly Positive", themes:["National framing","Villain identity","Reward"], confidence:"Medium", url:"https://www.si.com/nba", evidence:"User-supplied Apple News capture shows national headline framing the extension as deserved and Brooks as the league’s most visible villain." },
  { id:"espn-turnaround", source:"How the NBA’s biggest villain helped turn around two franchises", outlet:"ESPN", category:"National Media", date:"Jan. 15", sentiment:"Positive", themes:["Culture","Competitive identity","Reputation"], confidence:"High", url:"https://www.espn.com/nba/story/_/id/47602565/dillon-brooks-phoenix-suns-dillon-villain-nba", evidence:"National feature established Brooks’ cross-franchise reputation for setting competitive and work standards." },
  { id:"espn-best-moves", source:"Phoenix’s Brooks trade ranked among best recent deals", outlet:"ESPN", category:"National Media", date:"Mar. 2026", sentiment:"Positive", themes:["Trade value","Production","Culture"], confidence:"High", url:"https://www.espn.com/nba/story/_/id/48241616/nba-2025-2026-best-worst-moves-finals-trades-extensions", evidence:"ESPN included Phoenix’s acquisition among the league’s better recent moves because of on-court and cultural impact." },
  { id:"nba-athletic-friendship", source:"Inside the Booker–Brooks friendship", outlet:"The Athletic / NBA.com", category:"National Media", date:"Mar. 2026", sentiment:"Positive", themes:["Core relationship","Team identity","Continuity"], confidence:"High", url:"https://www.nba.com/news/the-athletic-inside-the-booker-brooks-friendship-a-bond-powering-the-surprising-suns", evidence:"National coverage documented a productive Booker–Brooks relationship behind Phoenix’s surprise season." },
  { id:"cbs-brooks-value", source:"Phoenix’s identity without Brooks", outlet:"CBS Sports", category:"National Media", date:"Feb. 2026", sentiment:"Positive", themes:["Identity","Availability","Offensive burden"], confidence:"High", url:"https://www.cbssports.com/nba/news/jalen-green-dillon-brooks-suns-get-buckets/", evidence:"Coverage described Brooks as central to Phoenix’s season while warning that replacing his production and edge was difficult." },

  { id:"locked-on-suns", source:"Absolute steal: Phoenix extends Brooks", outlet:"Locked On Suns", category:"Creators", date:"Aug. 6", sentiment:"Strongly Positive", themes:["Value","Leadership","Shot selection"], confidence:"Medium", url:"https://www.youtube.com/@LockedOnSuns", evidence:"Same-day 30-minute episode called the contract near-perfect value while preserving questions about shot selection and long-term fit." },
  { id:"phnx-extension-debate", source:"Should Phoenix extend Brooks?", outlet:"PHNX Suns Podcast", category:"Creators", date:"May 26", sentiment:"Mixed", themes:["Market value","Retirement goal","Roster fit"], confidence:"High", url:"https://podcasts.apple.com/us/podcast/should-phoenix-suns-extend-dillon-brooks-jalen-green/id1207682052?i=1000771392173", evidence:"Specialist local podcast established the extension debate and the stated goal for Brooks to finish his career in Phoenix." },
  { id:"valley-of-suns", source:"A future Brooks extension should not scare Phoenix", outlet:"Valley of the Suns", category:"Creators", date:"May 2026", sentiment:"Positive", themes:["Age risk","Role value","Continuity"], confidence:"Medium", url:"https://valleyofthesuns.com/future-dillon-brooks-extension-no-reason-scare-suns", evidence:"Creator analysis argued that role, fit and market context could justify an extension despite age concerns." },

  { id:"reddit-suns", source:"Suns community extension thread", outlet:"r/suns", category:"Fans", date:"Aug. 6", sentiment:"Strongly Positive", themes:["Team-friendly value","Leadership","Age"], confidence:"Medium", url:"https://www.reddit.com/r/suns/comments/1vgqbdl/shams_phoenix_suns_forward_dillon_brooks_has/", evidence:"Large same-day home-fan thread was heavily approving, with recurring praise for term and price plus some age and ceiling concern.", quote:"Nice team friendly deal. Got less than 25M. Job well done by Brian Gregory and co.", quoteType:"Direct quote" },
  { id:"reddit-nba", source:"League-wide extension thread", outlet:"r/nba", category:"Fans", date:"Aug. 6", sentiment:"Positive", themes:["League value","Output","Contract surprise"], confidence:"Medium", url:"https://www.reddit.com/r/nba/comments/1vgqan7/charania_phoenix_suns_forward_dillon_brooks_has/", evidence:"Broad NBA community reaction leaned toward value, with the most visible frame describing the deal as inexpensive relative to output.", quote:"Very cheap for his output.", quoteType:"Direct quote" },
  { id:"reddit-suns-restraint", source:"Skeptical Suns fan counter-frame", outlet:"r/suns", category:"Fans", date:"Aug. 6", sentiment:"Mixed", themes:["Team ceiling","Continuity risk","Asset path"], confidence:"Medium", url:"https://www.reddit.com/r/suns/comments/1vgqbdl/shams_phoenix_suns_forward_dillon_brooks_has/", evidence:"A minority counter-frame questioned whether Phoenix is locking in a middle-tier core because its draft position limits alternatives.", quote:"Big picture, we have a mid team and we have worked to lock that team in.", quoteType:"Direct quote" },
  { id:"reddit-nbatalk", source:"General NBA discussion", outlet:"r/NBATalk", category:"Fans", date:"Aug. 6", sentiment:"Positive", themes:["Culture","Defense","Playoff production"], confidence:"Medium", url:"https://www.reddit.com/r/NBATalk/comments/1vgqcwn/breaking_dillon_brooks_stays_with_the_phoenix_suns/", evidence:"Small same-day thread emphasized Brooks’ defensive tone and 26-point playoff average while calling the price reasonable.", quote:"Cheap deal.", quoteType:"Direct quote" },
];

export const methodology = {
  searched: "Official Suns and NBA properties; ESPN reporting and research; player-authored and interview material; Arizona Sports, Cronkite News and Phoenix specialist coverage; Sports Illustrated, CBS Sports, The Athletic and NBA.com; PHNX, Locked On Suns and Valley of the Suns; public Reddit communities; and public search indexes for X, Instagram, TikTok and YouTube.",
  selection: "Items were included when they added a verified term, statistic, complete direct quotation, distinct framing or audience signal. Announcement-day reaction was separated from earlier statements of intent. Duplicate aggregation, invented article URLs and inaccessible claims without a stable trail were excluded.",
  sentiment: "Each item was classified by its evaluation of the extension, Brooks’ retained value or the Suns’ direction—not by general approval of the player. Mixed items contain meaningful support and material age, role, cost or ceiling concern.",
  limitations: "The sample is curated and nonrepresentative. This is a same-day report: the Suns had not published a full official announcement or fresh player-and-coach reaction by the cutoff. Precise annual salary structure, options and protections were not public. Direct access to X, Instagram and TikTok was limited, so engagement totals were not used. The two user-supplied Sports Illustrated captures informed the national-frame read but did not substitute for independent reporting.",
};
