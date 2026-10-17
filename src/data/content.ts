export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  image: string;
  category: string;
  categorySlug: string;
  source: string;
  sourceId: string;
  timeLabel: string;
  readTime: string;
};

export type Source = {
  id: string;
  name: string;
  handle: string;
  kind: "logo" | "photo";
  color: string;
  image?: string;
  mark: string;
};

export type Creator = {
  slug: string;
  name: string;
  outlet: string;
  avatar: string;
  bio: string;
};

export const sources: Record<string, Source> = {
  netflix: { id: "netflix", name: "Netflix", handle: "netflix", kind: "logo", color: "#E50914", mark: "N" },
  f1: { id: "f1", name: "Formula 1", handle: "formula_one", kind: "logo", color: "#E10600", mark: "F1" },
  bbc: { id: "bbc", name: "BBC", handle: "bbcnews", kind: "logo", color: "#111111", mark: "BBC" },
  idn: { id: "idn", name: "IDN Times", handle: "idntimes", kind: "logo", color: "#E31C23", mark: "IDN" },
  cnn: { id: "cnn", name: "CNN", handle: "cnn", kind: "logo", color: "#CC0000", mark: "CNN" },
  goal: { id: "goal", name: "Goal", handle: "goal", kind: "logo", color: "#00A651", mark: "GOAL" },
  macrumors: { id: "macrumors", name: "MacRumours", handle: "macrumours", kind: "logo", color: "#555555", mark: "MR" },
  idnnews: { id: "idnnews", name: "IDN News", handle: "idnnews", kind: "logo", color: "#D91F26", mark: "IDN" },
  apple: { id: "apple", name: "Apple", handle: "apple", kind: "logo", color: "#111111", mark: "" },
  samsung: { id: "samsung", name: "Samsung", handle: "samsung", kind: "logo", color: "#1428A0", mark: "SAMSUNG" },
  kretya: { id: "kretya", name: "Kretya", handle: "kreyastudio", kind: "logo", color: "#111111", mark: "*" },
  ecommurz: { id: "ecommurz", name: "ecommurz", handle: "ecommurz", kind: "photo", color: "#F5A524", mark: "", image: "/avatars/cat.jpg" },
  alvian: { id: "alvian", name: "Alvian", handle: "_alvian.de...", kind: "photo", color: "#2EC4B6", mark: "", image: "/avatars/alvian.jpg" },
  fitra: { id: "fitra", name: "Fitra Eri", handle: "fitra.eri", kind: "photo", color: "#E85D04", mark: "", image: "/avatars/racer.jpg" },
};

export const storyOrder = ["bbc", "ecommurz", "f1", "alvian", "goal", "apple", "samsung", "idn", "kretya", "fitra"] as const;

export const articles: Article[] = [
  {
    slug: "where-to-watch-john-wick-chapter-4",
    title: "Where To Watch 'John Wick: Chapter 4'",
    excerpt:
      "There's been no official announcement regarding John Wick: Chapter 4's streaming release. However, given it's a Lionsgate film, John Wick: Chapter 4 will eventually be released on Starz...",
    body: [
      "There's been no official announcement regarding John Wick: Chapter 4's streaming release. However, given it's a Lionsgate film, John Wick: Chapter 4 will eventually be released on Starz — the studio's traditional pay-one window — after its theatrical and digital-purchase run.",
      "The fourth chapter sent Keanu Reeves' assassin through Osaka, Berlin, and a brutal dawn in Paris. Fans looking to rewatch the continental shootouts at home have been waiting for a clear streaming date ever since the film left cinemas.",
      "Until that window opens, the title is widely available to rent or buy on major digital storefronts. A physical 4K release is already on shelves for collectors who want the IMAX sequences in the highest bitrate.",
      "When the Starz debut lands, it typically follows a 45-to-90-day gap after digital. That would put a subscription premiere in late spring or early summer, depending on the final rights calendar.",
      "If you want it tonight, renting remains the fastest path. If you can wait, keep an eye on Starz and the Lionsgate-branded channels that often pick the film up in the months after.",
    ],
    image: "/images/john-wick.jpg",
    category: "Movies",
    categorySlug: "movies",
    source: "Netflix",
    sourceId: "netflix",
    timeLabel: "12 minutes ago",
    readTime: "4 min read",
  },
  {
    slug: "verstappen-backs-alonso",
    title: "'He deserves a lot more' Verstappen backs Alonso",
    excerpt:
      'Max Verstappen believes his fellow two-time world champion Fernando Alonso "deserves a lot more" victories in Formula 1 and has backed the Spaniard...',
    body: [
      'Max Verstappen believes his fellow two-time world champion Fernando Alonso "deserves a lot more" victories in Formula 1 and has backed the Spaniard to keep fighting at the front.',
      "The Dutchman, speaking after a tight practice session, said Alonso's racecraft and longevity still set a standard in the paddock. 'He is an animal in the car. People forget how good he is on a Sunday.'",
      "Alonso has been vocal about wanting a car capable of regular podiums. Verstappen's comments land as a rare public nod from the sport's dominant champion to a rival a generation ahead of him.",
      "Team principals around the garage treated the remarks as both respect and a warning: Alonso, given the right package, remains a threat on any circuit that rewards precision over peak power.",
    ],
    image: "/images/f1.jpg",
    category: "Sport",
    categorySlug: "sport",
    source: "Formula 1",
    sourceId: "f1",
    timeLabel: "3 hours ago",
    readTime: "8 min read",
  },
  {
    slug: "liverpool-hammer-leeds",
    title: "Liverpool hammer Leeds for first win in five games",
    excerpt:
      "Mohamed Salah and Diogo Jota both scored twice as Liverpool claimed a first league win in five games by inflicting a second successive home hammering on...",
    body: [
      "Mohamed Salah and Diogo Jota both scored twice as Liverpool claimed a first league win in five games by inflicting a second successive home hammering on Leeds United.",
      "The visitors arrived under pressure after a barren run. They left with a scoreline that quieted the week-long debate about midfield balance and finishing.",
      "Salah's movement across the box created the first two, while Jota's finishing from cut-backs made the result look routine by the hour mark. Leeds had spells of possession but rarely a shot of conviction.",
      "Jurgen Klopp called it 'a professional away night' and declined to declare a corner turned. Five games without a win had been long enough. One hammering, he said, is a start — not a season.",
    ],
    image: "/images/football.jpg",
    category: "Sport",
    categorySlug: "sport",
    source: "BBC",
    sourceId: "bbc",
    timeLabel: "12 hours ago",
    readTime: "8 min read",
  },
  {
    slug: "papua-hunt-for-kidnapped-nz-pilot",
    title: "Papua: At least one killed in hunt for kidnapped NZ pilot",
    excerpt:
      "At least one Indonesian soldier has been killed in a rebel attack while searching for a kidnapped New Zealand pilot in the Papua region, officials say...",
    body: [
      "At least one Indonesian soldier has been killed in a rebel attack while searching for a kidnapped New Zealand pilot in the Papua region, officials say.",
      "The pilot was taken in the highlands after a landing on a remote airstrip. Search units have been moving village to village under difficult weather and limited radio cover.",
      "Local officials asked residents to share information and warned that armed groups have used the terrain to stage ambushes on approaching columns.",
      "Wellington has been briefed throughout. Diplomats described the situation as grave but said they were working with Jakarta on a path that prioritises the pilot's safety over a rapid, risky extraction.",
    ],
    image: "/images/jungle.jpg",
    category: "Crime",
    categorySlug: "crime",
    source: "IDN Times",
    sourceId: "idn",
    timeLabel: "April 17, 2023",
    readTime: "8 min read",
  },
  {
    slug: "jeremy-bowen-israel-unclear-road-ahead",
    title: "Jeremy Bowen: Israel's unclear road ahead",
    excerpt:
      "Tensions between Israel and the Palestinians are on the rise once more, with hopes of peace and a two-state solution as far away as ever...",
    body: [
      "Tensions between Israel and the Palestinians are on the rise once more, with hopes of peace and a two-state solution as far away as ever.",
      "Jeremy Bowen, reporting from the region, describes a political map where every off-ramp looks blocked. Daily incidents along contested roads have become a grim rhythm rather than a crisis with a clock.",
      "Regional mediators still talk about a horizon. On the ground, families measure the week in checkpoints, sirens, and funerals. The diplomatic language has not caught up with that arithmetic.",
      "Bowen argues that without a political project both publics can see, security policy alone will keep reproducing the same week, with a different date on the copy.",
    ],
    image: "/images/jerusalem.jpg",
    category: "Middle East",
    categorySlug: "middle-east",
    source: "BBC",
    sourceId: "bbc",
    timeLabel: "April 15, 2023",
    readTime: "8 min read",
  },
  {
    slug: "ukraine-silence-along-southern-front",
    title: "Ukraine's silence along southern front fuels counteroffensive",
    excerpt:
      "Zaporizhzhia, Ukraine/CNN — Miles of empty fields where you might expect a build-up of armor. Tank tracks that emerge in the mud from nowhere...",
    body: [
      "Zaporizhzhia, Ukraine/CNN — Miles of empty fields where you might expect a build-up of armor. Tank tracks that emerge in the mud from nowhere, then vanish into tree lines.",
      "The quiet is the story. Commanders have spent weeks shaping a southern front that looks empty from the air and crowded with intention on the ground.",
      "Analysts watching commercial satellite passes say the absence of obvious staging areas is itself a tactic: disperse, decoy, and move at night. The counteroffensive is being read in the silence between strikes.",
      "Villagers describe convoys that pass without headlights and the sudden appearance of engineers on roads that were craters the day before. What looks still is, they say, only waiting.",
    ],
    image: "/images/tank.jpg",
    category: "War",
    categorySlug: "war",
    source: "CNN",
    sourceId: "cnn",
    timeLabel: "10 hours ago",
    readTime: "8 min read",
  },
  {
    slug: "taylor-swift-eras-message-to-women",
    title: "Taylor Swift is sending a powerful message to women on the Eras Tour",
    excerpt:
      'My first stirrings of discomfort at Taylor Swift\'s show in Las Vegas hit after the infectious beat faded from fan-favorite "Cruel Summer," the...',
    body: [
      'My first stirrings of discomfort at Taylor Swift\'s show in Las Vegas hit after the infectious beat faded from fan-favorite "Cruel Summer," the lights dropped, and a stadium of people started shouting a lyric about being the problem — together, and on purpose.',
      "The Eras Tour is a greatest-hits machine, but it is also a three-hour argument that a woman can occupy every version of herself in public: the diary, the revenge, the joke, the boss, the wreck.",
      "Friendship bracelets in the queue are not merchandise so much as a folk craft. Strangers trade them the way people used to trade mixtapes. The show makes that intimacy industrial-scale without quite breaking it.",
      "Critics who came for the spectacle leave talking about the politics of the set list — which songs she stands still for, which ones she lets the crowd sing until the vocal is gone. The message is not subtle. It does not need to be.",
    ],
    image: "/images/concert.jpg",
    category: "Entertainment",
    categorySlug: "entertainment",
    source: "CNN",
    sourceId: "cnn",
    timeLabel: "5 hours ago",
    readTime: "10 min read",
  },
  {
    slug: "inside-qatar-city-of-the-future",
    title: "Inside Qatar's 'city of the future'",
    excerpt:
      "A purpose-built city on the edge of Doha is trying to prototype how the Gulf lives, works and cools itself in a hotter century.",
    body: [
      "A purpose-built city on the edge of Doha is trying to prototype how the Gulf lives, works and cools itself in a hotter century.",
      "Trams, shaded walkways, and a cooling network under the pavements are the pitch. The skyline at night looks like a render that accidentally got built.",
      "Residents still argue about whether a city can be invented this quickly without feeling like a campus. Planners argue that waiting for organic growth is a luxury in 45-degree summers.",
      "For visitors, the draw is the spectacle: stadium light on glass, water that holds the skyline, and a bet that the next decade of Gulf urbanism will look more like this than like a highway lined with malls.",
    ],
    image: "/images/qatar.jpg",
    category: "Travel",
    categorySlug: "travel",
    source: "BBC News",
    sourceId: "bbc",
    timeLabel: "20 hours ago",
    readTime: "4 min read",
  },
  {
    slug: "wrexham-secures-promotion",
    title: "Wrexham secures promotion in front of a packed Racecourse",
    excerpt:
      "The Hollywood-backed club closed the deal on promotion with a night the terraces had been waiting years to shout through.",
    body: [
      "The Hollywood-backed club closed the deal on promotion with a night the terraces had been waiting years to shout through.",
      "It was not a gimmick result. Wrexham controlled the midfield, took their chances, and ran the clock like a side that has learned how to close.",
      "Owners in the stands tried to look like they do this every week. They do not. The town does, and it sounded like it.",
      "Promotion is a business event as much as a football one. The documentary cameras will find a story. The supporters already had one.",
    ],
    image: "/images/soccer.jpg",
    category: "Sport",
    categorySlug: "sport",
    source: "Goal",
    sourceId: "goal",
    timeLabel: "22 hours ago",
    readTime: "6 min read",
  },
  {
    slug: "iphone-15-rumors-2023",
    title: "All the rumors about the iPhone 15, expected in 2023",
    excerpt:
      "Apple in September 2022 released the iPhone 14 and iPhone 14 and 14 Pro models, but we've been hearing rumors about the iPhone 15 since well before the latest iPhones became available for purchase.",
    body: [
      "Apple in September 2022 released the iPhone 14 and iPhone 14 and 14 Pro models, but we've been hearing rumors about the iPhone 15 since well before the latest iPhones became available for purchase.",
      "The most persistent leaks point to a USB-C port across the line, a more curved chassis on Pro models, and a bump in the main camera's sensor size. None of this is official. All of it is treated as fact in comment sections.",
      "Supply-chain notes from Asia describe a production ramp that looks familiar: glass, aluminum, and a late-summer lock-in of colors. Titanium has entered the rumor mill for the Pro, which would be a first for the phone if it holds.",
      "For buyers sitting out the 14, the question is the usual one: is the 15 a refinement year or a port-and-camera year. Early indications say both, which is how Apple likes its Septembers.",
    ],
    image: "/images/iphone.jpg",
    category: "Technology",
    categorySlug: "technology",
    source: "MacRumours",
    sourceId: "macrumors",
    timeLabel: "5 hours ago",
    readTime: "10 min read",
  },
  {
    slug: "rio-de-janeiro-marvellous-city-digital",
    title: "Rio de Janeiro: The 'Marvellous City' welcomes digital nomads",
    excerpt:
      "Coworking spaces are spreading from Ipanema to downtown as the city pitches itself as a longer stay, not just a postcard.",
    body: [
      "Coworking spaces are spreading from Ipanema to downtown as the city pitches itself as a longer stay, not just a postcard.",
      "Visa rules have loosened just enough that a three-month laptop winter is now a product. Cafes that used to frown at plugs now print the Wi-Fi on the receipt.",
      "Locals are split. Tourism money is welcome. Rents in the south zone are not a postcard. The mayor's office talks about 'digital hospitality' as if it were a utility.",
      "If the bet works, Rio gets a shoulder-season economy. If it does not, it gets another layer of short-term stays on streets that already know the pattern.",
    ],
    image: "/images/rio.jpg",
    category: "Travel",
    categorySlug: "travel",
    source: "IDN News",
    sourceId: "idnnews",
    timeLabel: "10 hours ago",
    readTime: "8 min read",
  },
  {
    slug: "chatgpt-generative-ai-hiring",
    title: "ChatGPT: How generative AI could change hiring as we know it",
    excerpt:
      "Managers are already using chat tools to write job posts, screen answers, and draft rejection mail. The interview is next.",
    body: [
      "Managers are already using chat tools to write job posts, screen answers, and draft rejection mail. The interview is next.",
      "Recruiters describe a week where every candidate sounds fluent and every application is a little too complete. Distinguishing a person from a prompt is becoming a skill of its own.",
      "Some firms have banned generated take-home tests. Others have leaned in, asking applicants to use the tools on purpose and then explain the judgment they added.",
      "The hiring market always copies its tools. This time the tool can talk. HR departments that treat that as a novelty will spend a year cleaning up the process they accidentally automated.",
    ],
    image: "/images/office-woman.jpg",
    category: "Work",
    categorySlug: "work",
    source: "BBC News",
    sourceId: "bbc",
    timeLabel: "11 hours ago",
    readTime: "18 min read",
  },
  {
    slug: "twitter-fake-disney-verified",
    title: "Twitter gives fake Disney account verified status",
    excerpt:
      "A parody handle mimicking the studio's tone was handed a checkmark, then used it to announce a film that does not exist.",
    body: [
      "A parody handle mimicking the studio's tone was handed a checkmark, then used it to announce a film that does not exist.",
      "The post spread far enough that entertainment desks had to run a denial. The platform's paid verification had, in this case, verified the joke.",
      "Disney did not find it funny. The company asked for a takedown. The account's owner called it a stress test of a product that sells trust by the month.",
      "Blue checks used to mean a newsroom had confirmed a person. Now they mean someone paid. The gap between those two sentences is the story.",
    ],
    image: "/images/phone.jpg",
    category: "Technology",
    categorySlug: "technology",
    source: "CNN",
    sourceId: "cnn",
    timeLabel: "12 hours ago",
    readTime: "9 min read",
  },
  {
    slug: "shakespeare-first-edition-1623-display",
    title: "First edition Shakespeare text from 1623 goes on display",
    excerpt:
      "A First Folio, the book that kept half the plays from vanishing, is under glass again — this time for a public that mostly met the words on a screen.",
    body: [
      "A First Folio, the book that kept half the plays from vanishing, is under glass again — this time for a public that mostly met the words on a screen.",
      "Curators talk about paper, ink, and the compositors who guessed at a line. Visitors talk about Hamlet. Both are looking at the same object.",
      "Only a few hundred copies survive. This one has a known trail through private libraries and a gap in the 18th century that still bothers the catalogue.",
      "The exhibition is quiet on purpose. People lean in. That is the whole design: a 400-year-old page, a rope, and enough light to read a word without fading it.",
    ],
    image: "/images/shakespeare.jpg",
    category: "Culture",
    categorySlug: "culture",
    source: "CNN",
    sourceId: "cnn",
    timeLabel: "13 hours ago",
    readTime: "6 min read",
  },
  {
    slug: "fruit-producers-nets-future-farming",
    title: "Fruit producers turn to nets for better crops of future farming",
    excerpt:
      "Shade nets, hail nets, and insect mesh are moving from specialty kits to the default roof of an orchard.",
    body: [
      "Shade nets, hail nets, and insect mesh are moving from specialty kits to the default roof of an orchard.",
      "Growers say a changing hail calendar and a thirstier summer made uncovered rows a gamble. The net is not pretty. The fruit is.",
      "Researchers tracking colour and sugar say some varieties actually prefer the filtered light. Others lose the blush that buyers expect. Farming is becoming a lighting problem.",
      "Co-ops are bulk-buying the fabric. Insurers are quietly adjusting premiums for covered blocks. The future of the orchard, for now, looks like a white tent on a green hill.",
    ],
    image: "/images/fruit.jpg",
    category: "Business",
    categorySlug: "business",
    source: "BBC",
    sourceId: "bbc",
    timeLabel: "9 hours ago",
    readTime: "6 min read",
  },
  {
    slug: "low-employee-engagement-managers",
    title: "Low employee engagement? Managers can help turn it around",
    excerpt:
      "Surveys keep showing the same slump. The teams that reverse it are not the ones with a new values poster.",
    body: [
      "Surveys keep showing the same slump. The teams that reverse it are not the ones with a new values poster.",
      "Managers who hold a weekly one-to-one, close a loop they opened, and protect a calendar from fake urgency see scores move. It is unfashionable because it is slow.",
      "HR suites love a dashboard. Staff love a boss who remembers the thing they asked for last Tuesday. Those are not the same product.",
      "The research is blunt: engagement is a local weather system. You can buy a platform. You cannot buy the weather. You can, however, stop creating storms on purpose.",
    ],
    image: "/images/office.jpg",
    category: "Business",
    categorySlug: "business",
    source: "BBC",
    sourceId: "bbc",
    timeLabel: "17 hours ago",
    readTime: "12 min read",
  },
  {
    slug: "chelsea-star-plea-american-billionaire",
    title: "'We need to stop': Chelsea star's plea to American billionaire",
    excerpt:
      "A dressing-room voice asked the owners to slow the churn — of players, of staff, of the idea of what the club is.",
    body: [
      "A dressing-room voice asked the owners to slow the churn — of players, of staff, of the idea of what the club is.",
      "The quote was not a revolt. It was fatigue, spoken into a microphone after a match that felt like the third new project of the season.",
      "American ownership groups have treated the squad as a liquid market. The player who spoke treated it as a locker room that still has to run on Tuesday.",
      "Supporters heard both things at once: ambition, and a warning that a club can be bought faster than it can be believed in.",
    ],
    image: "/images/tennis-man.jpg",
    category: "Sport",
    categorySlug: "sport",
    source: "Goal",
    sourceId: "goal",
    timeLabel: "3 hours ago",
    readTime: "10 min read",
  },
  {
    slug: "emma-raducanu-former-coach-left",
    title: "Emma Raducanu's former coach Dmitry Tursunov says he left on his own terms",
    excerpt:
      "The coach described a split that looked abrupt from the outside and considered from the inside.",
    body: [
      "The coach described a split that looked abrupt from the outside and considered from the inside.",
      "Tursunov said the calendar, the travel, and the need for a stable inner circle all argued for a cleaner break than rumours allowed.",
      "Raducanu has changed coaches more than once since a US Open that arrived early and heavy. Each change becomes a referendum. He declined to sit for that.",
      "What he would say: she still has a first-strike game that troubles anyone on a given day. What he would not say: the rest of the internet's theory of her career.",
    ],
    image: "/images/tennis-woman.jpg",
    category: "Sport",
    categorySlug: "sport",
    source: "BBC",
    sourceId: "bbc",
    timeLabel: "12 hours ago",
    readTime: "8 min read",
  },
  {
    slug: "gadget-labs-fold-phones",
    title: "Foldables leave the novelty aisle",
    excerpt:
      "A third year of hinge reliability data is finally turning foldable phones from a demo into a default for a small, loud group of buyers.",
    body: [
      "A third year of hinge reliability data is finally turning foldable phones from a demo into a default for a small, loud group of buyers.",
      "Repair shops still grimace. Reviewers still drop them on purpose. The crease is still a crease. And yet, the people who live on two apps at once are not going back.",
      "Carriers have started bundling them without a wink. That is the tell. Novelty ends when the subsidy begins.",
    ],
    image: "/images/phone.jpg",
    category: "Technology",
    categorySlug: "technology",
    source: "IDN News",
    sourceId: "idnnews",
    timeLabel: "1 day ago",
    readTime: "7 min read",
  },
  {
    slug: "startup-markets-quiet-quarter",
    title: "Markets go quiet, startups go boring on purpose",
    excerpt:
      "Founders are pitching cash flow again. Investors are pretending they never loved a slide that said blitzscale.",
    body: [
      "Founders are pitching cash flow again. Investors are pretending they never loved a slide that said blitzscale.",
      "The useful companies in this cohort look almost dull: vertical software, a real customer, a sales team that takes notes. Dull is a compliment this year.",
      "There is still money. It is just asking better questions, and leaving the room when the answers are a vibe.",
    ],
    image: "/images/office.jpg",
    category: "Business",
    categorySlug: "business",
    source: "BBC",
    sourceId: "bbc",
    timeLabel: "2 days ago",
    readTime: "9 min read",
  },
];

export const creators: Creator[] = [
  {
    slug: "alex-young",
    name: "Alex Young",
    outlet: "BBC News",
    avatar: "/avatars/alex.jpg",
    bio: "Alex covers sport, work, and the quieter politics of institutions for BBC News. His reporting on clubs and companies tends to start in the room, not the presser.",
  },
  {
    slug: "joe-alen",
    name: "Joe Alen",
    outlet: "CNN",
    avatar: "/avatars/joe.jpg",
    bio: "Joe Alen is a CNN correspondent focused on culture, technology, and the way platforms rewrite public life. He treats a rumor as a lead, not a headline.",
  },
  {
    slug: "alexa-timber",
    name: "Alexa Timber",
    outlet: "Formula 1",
    avatar: "/avatars/alexa.jpg",
    bio: "Alexa Timber reports from the paddock with a mechanic's ear and a driver's sense of timing. She writes the sport as a craft, not only a championship.",
  },
  {
    slug: "asley-star",
    name: "Asley Star",
    outlet: "Goal",
    avatar: "/avatars/asley.jpg",
    bio: "Asley Star writes football from the terrace up — promotion nights, dressing-room friction, and the business that follows a goal.",
  },
  {
    slug: "maya-chen",
    name: "Maya Chen",
    outlet: "IDN Times",
    avatar: "/avatars/maya.jpg",
    bio: "Maya Chen reports on travel, cities, and the people who move through them. She is based between Jakarta and the road.",
  },
  {
    slug: "marcus-hale",
    name: "Marcus Hale",
    outlet: "MacRumours",
    avatar: "/avatars/marcus.jpg",
    bio: "Marcus Hale tracks consumer technology with a supply-chain notebook and a distrust of launch-day adjectives.",
  },
];

export const creatorArticleMap: Record<string, string[]> = {
  "alex-young": ["liverpool-hammer-leeds", "jeremy-bowen-israel-unclear-road-ahead", "chatgpt-generative-ai-hiring", "fruit-producers-nets-future-farming", "low-employee-engagement-managers", "emma-raducanu-former-coach-left"],
  "joe-alen": ["ukraine-silence-along-southern-front", "taylor-swift-eras-message-to-women", "twitter-fake-disney-verified", "shakespeare-first-edition-1623-display"],
  "alexa-timber": ["verstappen-backs-alonso"],
  "asley-star": ["wrexham-secures-promotion", "chelsea-star-plea-american-billionaire"],
  "maya-chen": ["papua-hunt-for-kidnapped-nz-pilot", "rio-de-janeiro-marvellous-city-digital", "inside-qatar-city-of-the-future"],
  "marcus-hale": ["iphone-15-rumors-2023", "gadget-labs-fold-phones"],
};

export const homepage = {
  hero: "where-to-watch-john-wick-chapter-4",
  latest: [
    "verstappen-backs-alonso",
    "liverpool-hammer-leeds",
    "papua-hunt-for-kidnapped-nz-pilot",
    "jeremy-bowen-israel-unclear-road-ahead",
  ],
  mustReadLeft: "ukraine-silence-along-southern-front",
  mustReadCenter: "taylor-swift-eras-message-to-women",
  mustReadRight: ["inside-qatar-city-of-the-future", "wrexham-secures-promotion"],
  editorsHero: "iphone-15-rumors-2023",
  editorsGrid: [
    "rio-de-janeiro-marvellous-city-digital",
    "chatgpt-generative-ai-hiring",
    "twitter-fake-disney-verified",
    "shakespeare-first-edition-1623-display",
  ],
  business: ["fruit-producers-nets-future-farming", "low-employee-engagement-managers"],
  sport: ["chelsea-star-plea-american-billionaire", "emma-raducanu-former-coach-left"],
  creators: ["alex-young", "joe-alen", "alexa-timber", "asley-star"],
};

export const navLinks = [
  { label: "Gündem", slug: "gundem" },
  { label: "Türkiye", slug: "turkiye" },
  { label: "Dünya", slug: "dunya" },
  { label: "Para", slug: "para" },
  { label: "Spor", slug: "spor" },
  { label: "Teknoloji", slug: "teknoloji" },
  { label: "Kültür", slug: "kultur" },
  { label: "Yaşam", slug: "yasam" },
  { label: "Eğlence", slug: "eglence" },
] as const;

export const footerColumns = [
  {
    title: "Gündem",
    links: [
      { label: "Gündem", slug: "gundem" },
      { label: "Türkiye", slug: "turkiye" },
      { label: "Dünya", slug: "dunya" },
      { label: "Son Haberler", slug: "son-haberler" },
    ],
  },
  {
    title: "Ekonomi & Para",
    links: [
      { label: "Piyasalar & Para", slug: "para" },
      { label: "Finans & Borsa", slug: "para" },
      { label: "Ekonomi Haberleri", slug: "para" },
    ],
  },
  {
    title: "Teknoloji",
    links: [
      { label: "Teknoloji Gelişmeleri", slug: "teknoloji" },
      { label: "Yapay Zeka", slug: "teknoloji" },
      { label: "Mobil & Donanım", slug: "teknoloji" },
    ],
  },
  {
    title: "Yaşam & Spor",
    links: [
      { label: "Spor Dünyası", slug: "spor" },
      { label: "Kültür & Sanat", slug: "kultur" },
      { label: "Yaşam", slug: "yasam" },
      { label: "Eğlence", slug: "eglence" },
    ],
  },
] as const;

export const communityPosts = [
  {
    id: "c1",
    author: "Alex Young",
    avatar: "/avatars/alex.jpg",
    handle: "alex.young",
    time: "2 hours ago",
    title: "Is the Eras Tour a news story or a culture one?",
    body: "We keep filing Swift under entertainment, but the economics of that tour are a labour story, a city story, and a women's story. Curious how other desks are splitting it.",
    replies: 48,
    likes: 312,
  },
  {
    id: "c2",
    author: "Maya Chen",
    avatar: "/avatars/maya.jpg",
    handle: "maya.chen",
    time: "5 hours ago",
    title: "Digital nomad visas are quietly rewriting shoulder season",
    body: "Rio's coworking boom looks fun in photos. The rent conversation in the comments is the actual piece. If you are reporting this, talk to the barista, not the mayor.",
    replies: 19,
    likes: 141,
  },
  {
    id: "c3",
    author: "Joe Alen",
    avatar: "/avatars/joe.jpg",
    handle: "joe.alen",
    time: "8 hours ago",
    title: "Paid checkmarks and the Disney parody",
    body: "A fake studio account with a purchased badge moved a fake film. That is not a moderation anecdote. That is a product decision with a press cycle attached.",
    replies: 76,
    likes: 508,
  },
  {
    id: "c4",
    author: "Asley Star",
    avatar: "/avatars/asley.jpg",
    handle: "asley.star",
    time: "1 day ago",
    title: "Wrexham's promotion night, without the documentary voiceover",
    body: "The cameras will find a tidy arc. The Racecourse was messier and better. Promotion stories still belong to the people who stood there in League Two.",
    replies: 33,
    likes: 220,
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function getCreator(slug: string) {
  return creators.find((c) => c.slug === slug);
}

export function articlesByCategory(slug: string) {
  const key = slug.toLowerCase();
  return articles.filter(
    (a) =>
      a.categorySlug === key ||
      a.category.toLowerCase() === key ||
      a.category.toLowerCase().replace(/\s+/g, "-") === key,
  );
}

export function articlesBySource(sourceId: string) {
  return articles.filter((a) => a.sourceId === sourceId);
}

export function articlesByCreator(slug: string) {
  const ids = creatorArticleMap[slug] ?? [];
  return ids.map((id) => getArticle(id)).filter((a): a is Article => Boolean(a));
}

export function relatedArticles(article: Article, limit = 4) {
  return articles.filter((a) => a.slug !== article.slug && a.categorySlug === article.categorySlug).slice(0, limit);
}

export function searchArticles(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return articles;
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.source.toLowerCase().includes(q) ||
      a.body.some((p) => p.toLowerCase().includes(q)),
  );
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const categoryLabel: Record<string, string> = {
  gundem: "Gündem",
  turkiye: "Türkiye",
  dunya: "Dünya",
  para: "Para",
  spor: "Spor",
  teknoloji: "Teknoloji",
  kultur: "Kültür",
  yasam: "Yaşam",
  eglence: "Eğlence",
  movies: "Sinema",
  sport: "Spor",
  sports: "Spor",
  crime: "Asayiş",
  "middle-east": "Orta Doğu",
  war: "Dünya",
  entertainment: "Eğlence",
  travel: "Seyahat",
  technology: "Teknoloji",
  work: "İş Dünyası",
  culture: "Kültür",
  business: "Para",
  stories: "Hikayeler",
  latest: "Son Haberler",
  "must-read": "Mutlaka Okuyun",
  "editors-pick": "Editörün Seçtikleri",
};
