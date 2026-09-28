import type {
  BankReceipt, DayTour, DestinationCategory, Experience, Notification,
  PackageDay, Payment, Pkg, Plan, Review,
} from "./types";

/* ============================= 12 EXPERIENCES ============================= */
export const EXPERIENCES: Experience[] = [
  {
    id: "yoga", name: "Yoga & Meditation", icon: "flower-2", blurb: "Sunrise flow above the mist",
    description: "Cliff-top shalas in Weligama, monastery mornings in Kandy and silent retreats in the hills. Mats, teachers and slow breakfasts included — you just breathe."
  },
  {
    id: "shopping", name: "Shopping", icon: "shopping-bag", blurb: "Gems, batik, tea & spice markets",
    description: "From Colombo's chic boutiques to Galle Fort's artisan lanes — Ceylon sapphires, handloom sarees, cinnamon and single-estate tea, with our guides steering you to fair-price, certified sellers."
  },
  {
    id: "cuisine", name: "Cuisine", icon: "utensils", blurb: "Hopper mornings, crab nights",
    description: "Cook with a village auntie, crack into lagoon crab in Negombo, chase the perfect egg hopper and learn why Sri Lankan rice & curry is never just one curry."
  },
  {
    id: "whale-watching", name: "Whale Watching", icon: "waves", blurb: "Blue whales off Mirissa",
    description: "November–April mornings depart Mirissa harbour into the deep channel where blue whales cruise. Naturalist on board, breakfast box in hand."
  },
  {
    id: "hot-air-ballooning", name: "Hot Air Ballooning", icon: "send", blurb: "Dawn over the Cultural Triangle",
    description: "Lift off with the sun near Dambulla and drift over tank systems and temple tops — Sigiriya Rock rising through the mist below you."
  },
  {
    id: "wildlife-safaris", name: "Wildlife Safaris", icon: "binoculars", blurb: "Leopard country, elephant gatherings",
    description: "Yala's leopard density, Udawalawe's guaranteed elephants, Wilpattu's quiet villus — private jeeps with trackers who read the bush like a newspaper."
  },
  {
    id: "snorkeling", name: "Snorkeling", icon: "fish", blurb: "Turtle bays and coral gardens",
    description: "Float with green turtles at Polhena's sheltered lagoon and over coral at Pigeon Island off Trincomalee. Calm, shallow, unforgettable."
  },
  {
    id: "surfing", name: "Surfing", icon: "surfing", blurb: "Beginner beach breaks to reefs",
    description: "Weligama's gentle sand bottom for first waves; Arugam Bay's famous right-hand point for the confident. Boards, instructors and tuk-tuk shuttles arranged."
  },
  {
    id: "hiking", name: "Hiking", icon: "mountain", blurb: "Ella Rock to Adam's Peak",
    description: "Little Adam's Peak at golden hour, Horton Plains' World's End at dawn, and the 2am pilgrim climb of Adam's Peak — graded to your legs."
  },
  {
    id: "tea-train", name: "Tea Country Train Ride", icon: "train-front", blurb: "The most beautiful rail line on earth",
    description: "Kandy to Ella through tea gardens and cloud forest — reserved observation seats, doors open, wind in your hair. We time it for the light."
  },
  {
    id: "rafting", name: "White Water Rafting", icon: "life-buoy", blurb: "Grade 3 rapids at Kitulgala",
    description: "The Kelani River's jungle rapids — safe, splashy and ridiculously fun, with riverside lunch after. Minimum age 10; guides are certified lifesavers."
  },
  {
    id: "ayurveda", name: "Ayurveda", icon: "leaf", blurb: "Three thousand years of healing",
    description: "Consult a registered Ayurvedic doctor, then surrender to herbal steam, warm oil shirodhara and garden pharmacies. Half-day taster or full retreat week."
  },
];

/* ============================= 12 DAY TOURS ============================= */
export const DAY_TOURS: DayTour[] = [
  {
    id: "dt1", slug: "colombo", name: "Colombo City Pulse", tagline: "Colonial streets, seaside sunsets",
    description: "Old anymore meets new money: Gangaramaya Temple, Pettah market chaos, Independence Square and a sunset walk on Galle Face Green with isso wade in hand.",
    duration: "Full day · 8 hrs", cities: ["Colombo"], stops: [{ city: "Colombo", x: 58, y: 196 }]
  },
  {
    id: "dt2", slug: "kandy", name: "Kandy Heritage Day", tagline: "Temple of the Tooth & the lake",
    description: "The hill capital in a day — the sacred Temple of the Tooth Relic, the Royal Botanic Gardens at Peradeniya, a Kandyan dance show and tea with a view over the lake.",
    duration: "Full day · 9 hrs", cities: ["Kandy", "Peradeniya"], stops: [{ city: "Kandy", x: 98, y: 172 }, { city: "Peradeniya", x: 92, y: 178 }]
  },
  {
    id: "dt3", slug: "anuradhapura", name: "Anuradhapura Ancient Kingdom", tagline: "2,300 years under the Bo tree",
    description: "Cycle between dagobas the size of hills in Sri Lanka's first capital — the sacred Sri Maha Bodhi, Ruwanwelisaya's white dome and the tanks that fed a civilization.",
    duration: "Full day · 10 hrs", cities: ["Anuradhapura", "Mihintale"], stops: [{ city: "Anuradhapura", x: 92, y: 78 }, { city: "Mihintale", x: 104, y: 74 }]
  },
  {
    id: "dt4", slug: "little-england", name: "Little England (Nuwara Eliya)", tagline: "Tea, roses & colonial cottages",
    description: "Mist over Victorian rooftops: a working tea factory with tasting, Pedro Estate fields, Lake Gregory boat ride and strawberries fresh from the farm.",
    duration: "Full day · 9 hrs", cities: ["Nuwara Eliya", "Pedro Estate"], stops: [{ city: "Nuwara Eliya", x: 102, y: 202 }, { city: "Pedro Estate", x: 108, y: 198 }]
  },
  {
    id: "dt5", slug: "sigiriya-pidurangala", name: "Dambulla + Pidurangala – Sigiriya", tagline: "Two rocks, one golden day",
    description: "Climb Pidurangala at sunrise to watch Sigiriya light up, then scale the Lion Rock fortress itself and finish inside Dambulla's golden cave temples.",
    duration: "Full day · 11 hrs", cities: ["Pidurangala", "Sigiriya", "Dambulla"],
    stops: [{ city: "Pidurangala", x: 110, y: 118 }, { city: "Sigiriya", x: 108, y: 116 }, { city: "Dambulla", x: 104, y: 112 }]
  },
  {
    id: "dt6", slug: "sinharaja", name: "Sinharaja Rainforest Walk", tagline: "UNESCO jungle, waterfall swim",
    description: "A guided trek through the island's last great rainforest — endemic birds, purple-faced langurs and a cold waterfall pool to finish. Leeches included at no extra cost (socks provided!).",
    duration: "Full day · 8 hrs", cities: ["Sinharaja (Kudawa)"], stops: [{ city: "Sinharaja", x: 68, y: 234 }]
  },
  {
    id: "dt7", slug: "yala", name: "Yala Safari Day", tagline: "Leopard odds, best on the island",
    description: "Dawn entry with packed breakfast, a tracker who knows every leopard by name, elephants at waterholes and a lagoon-side lunch before the afternoon drive.",
    duration: "Full day · 10 hrs", cities: ["Yala National Park"], stops: [{ city: "Yala", x: 142, y: 258 }]
  },
  {
    id: "dt8", slug: "galle-madu", name: "Galle Fort + Madu River", tagline: "Dutch ramparts and mangrove tunnels",
    description: "Morning on the Madu River gliding through cinnamon islets and fish-spa mangroves, then a slow afternoon inside Galle Fort — lighthouse, ramparts, gelato.",
    duration: "Full day · 9 hrs", cities: ["Balapitiya (Madu River)", "Galle"],
    stops: [{ city: "Madu River", x: 56, y: 256 }, { city: "Galle", x: 58, y: 268 }]
  },
  {
    id: "dt9", slug: "wilpattu", name: "Wilpattu Wild Day", tagline: "Sri Lanka's largest, quietest park",
    description: "The villu (natural lake) circuit where leopards laze in the open and sloth bears forage — Wilpattu is for those who like their safaris without a jeep convoy.",
    duration: "Full day · 10 hrs", cities: ["Wilpattu National Park"], stops: [{ city: "Wilpattu", x: 70, y: 102 }]
  },
  {
    id: "dt10", slug: "mirissa-whale", name: "Mirissa Whale Watching", tagline: "Blue whales before breakfast",
    description: "6am departure into the continental shelf, naturalist-guided, responsibly distanced — blues, fins and spinner dolphins, back in time for a beach afternoon.",
    duration: "Half day · 5 hrs", cities: ["Mirissa"], stops: [{ city: "Mirissa", x: 72, y: 274 }]
  },
  {
    id: "dt11", slug: "madu-turtle", name: "Madu River + Turtle Hatchery", tagline: "Mangroves and baby turtles",
    description: "A gentle river safari plus a conservation hatchery at Kosgoda — hold a three-day-old hatchling and (season permitting) release one at dusk. Family favourite.",
    duration: "Full day · 7 hrs", cities: ["Balapitiya", "Kosgoda"],
    stops: [{ city: "Madu River", x: 56, y: 256 }, { city: "Kosgoda", x: 54, y: 246 }]
  },
  {
    id: "dt12", slug: "tea-cinnamon", name: "Handunugoda Tea & Cinnamon", tagline: "The estate behind virgin white tea",
    description: "Walk the only coastal tea estate, learn why virgin white tea never touches a hand, then peel real cinnamon with a grower and take home oils pressed that morning.",
    duration: "Half day · 5 hrs", cities: ["Ahangama (Handunugoda)"], stops: [{ city: "Handunugoda", x: 66, y: 271 }]
  },
];

/* ============================= 8 DESTINATION CATEGORIES ============================= */
export const CATEGORIES: DestinationCategory[] = [
  {
    id: "heritage", name: "Heritage", blurb: "Fortresses, stupas and stone lions",
    places: [
      { name: "Sigiriya Rock Fortress", blurb: "The 5th-century sky palace — frescoes, mirror wall and lion paws.", rating: 4.9 },
      { name: "Dambulla Cave Temple", blurb: "Five golden caves of murals and 150+ Buddhas.", rating: 4.8 },
      { name: "Polonnaruwa", blurb: "The medieval capital best explored by bicycle.", rating: 4.7 },
    ]
  },
  {
    id: "wildlife", name: "Wildlife", blurb: "Leopards, elephants and everything between",
    places: [
      { name: "Yala National Park", blurb: "Planet Earth's densest leopard population.", rating: 4.9 },
      { name: "Wilpattu National Park", blurb: "The largest park — quiet villus, sloth bears.", rating: 4.7 },
      { name: "Udawalawe National Park", blurb: "Elephant sightings, guaranteed.", rating: 4.7 },
      { name: "Sinharaja Forest", blurb: "The last great rainforest — a living ark.", rating: 4.6 },
    ]
  },
  {
    id: "beaches", name: "Beaches", blurb: "Golden arcs on two coasts, two seasons",
    places: [
      { name: "Mirissa", blurb: "Whale mornings, palm-hill sunsets.", rating: 4.8 },
      { name: "Polhena", blurb: "A protected lagoon where turtles swim between your feet.", rating: 4.8 },
      { name: "Trincomalee", blurb: "East-coast powder and Pigeon Island coral.", rating: 4.7 },
      { name: "Arugam Bay", blurb: "The right-hand point break — surf village soul.", rating: 4.7 },
    ]
  },
  {
    id: "adventure", name: "Adventure", blurb: "Rapids, zip-lines and rock faces",
    places: [
      { name: "Kitulgala", blurb: "White-water HQ — rafting, canyoning, jungle falls.", rating: 4.6 },
      { name: "Ella (Zip-line)", blurb: "Fly the Flying Ravana over tea valleys.", rating: 4.5 },
      { name: "Haputale", blurb: "Cliff-edge trails above the clouds.", rating: 4.5 },
    ]
  },
  {
    id: "eco", name: "Eco", blurb: "Low-footprint, high-wonder",
    places: [
      { name: "Sinharaja", blurb: "Guided rainforest immersion, strictly leave-no-trace.", rating: 4.6 },
      { name: "Knuckles Range", blurb: "Cloud-forest ridgelines and village homestays.", rating: 4.6 },
      { name: "Madu River Wetlands", blurb: "Mangrove labyrinth, cinnamon islets.", rating: 4.5 },
    ]
  },
  {
    id: "cultural-triangle", name: "Cultural Triangle", blurb: "The ancient heartland",
    places: [
      { name: "Anuradhapura", blurb: "The first kingdom under the sacred Bo tree.", rating: 4.7 },
      { name: "Sigiriya", blurb: "The rock that anchors the triangle.", rating: 4.9 },
      { name: "Dambulla", blurb: "Golden caves on the pilgrim road.", rating: 4.8 },
      { name: "Polonnaruwa", blurb: "Gal Vihara's serene stone Buddhas.", rating: 4.7 },
    ]
  },
  {
    id: "hill-country", name: "Hill Country", blurb: "Tea-green ridges and cool air",
    places: [
      { name: "Ella Rock", blurb: "The valley's big hike with a bigger view.", rating: 4.8 },
      { name: "Adam's Peak", blurb: "The 2am pilgrimage climb for sunrise.", rating: 4.8 },
      { name: "Pidurutalagala", blurb: "The island's rooftop at 2,524 m.", rating: 4.5 },
      { name: "Nuwara Eliya", blurb: "Little England — tea estates and roses.", rating: 4.6 },
    ]
  },
  {
    id: "south-coast", name: "South Coast", blurb: "The classic postcard strip",
    places: [
      { name: "Galle Fort", blurb: "Living Dutch ramparts over the Indian Ocean.", rating: 4.8 },
      { name: "Mirissa", blurb: "The south's sweetheart bay.", rating: 4.8 },
      { name: "Polhena", blurb: "The turtle lagoon.", rating: 4.8 },
      { name: "Tangalle", blurb: "Wide, wild and wonderfully empty.", rating: 4.6 },
    ]
  },
];

/* ============================= PACKAGES ============================= */
const pd = (day: number, place: string, x: number, y: number, title: string, description: string, experiences: string[], specialty: string): PackageDay =>
  ({ day, place, x, y, title, description, experiences, specialty });

export const PACKAGES: Pkg[] = [
  {
    id: "pkg1", slug: "best-of-sri-lanka", name: "Best of Sri Lanka", collection: "round_tour",
    summary: "The greatest-hits loop: rock fortresses, temple towns, tea country by rail, a leopard safari and three golden beach days to finish.",
    days: 10, nights: 9, pricePP: 1450,
    itinerary: [
      pd(1, "Colombo", 58, 196, "Ayubowan — island arrival", "Land, exhale, and meet your driver-guide. Sunset walk on Galle Face Green and your first hopper dinner.", ["cuisine"], "Colombo's seaside promenade"),
      pd(2, "Sigiriya", 108, 116, "The Lion Rock", "Climb the 5th-century sky fortress at golden hour, then village lunch with a local family.", ["hiking"], "UNESCO sky palace"),
      pd(3, "Kandy", 98, 172, "Temple of the Tooth", "Drums at the evening ceremony, the sacred relic temple, and a slow loop around the lake.", ["shopping", "cuisine"], "Living Buddhist heritage"),
      pd(4, "Nuwara Eliya", 102, 202, "Into the tea hills", "A working tea factory and tasting in Little England; roses, mist and a fireplace dinner.", ["tea-train"], "Ceylon tea at its source"),
      pd(5, "Ella", 120, 216, "The famous train ride", "Reserved seats on the tea-country line — doors open, valleys rolling past — then Nine Arches at dusk.", ["tea-train", "hiking"], "World's most beautiful rail journey"),
      pd(6, "Ella", 118, 220, "Little Adam's Peak", "Sunrise hike above the gap, zip-line for the brave, café-hop the strip in the afternoon.", ["hiking"], "Ella Gap viewpoint"),
      pd(7, "Udawalawe", 110, 246, "Elephant country", "Morning safari among 500+ elephants and the orphaned-calves transit home.", ["wildlife-safaris"], "Guaranteed elephant sightings"),
      pd(8, "Mirissa", 72, 274, "Whale morning", "Blue whales before breakfast, then coconut-hill sunset and dinner on the sand.", ["whale-watching", "surfing"], "Blue-whale channel"),
      pd(9, "Galle", 58, 268, "Dutch fort afternoon", "Lighthouse, ramparts and artisan lanes inside the fort — hands-on batik if you like.", ["shopping", "cuisine"], "Living 17th-century fort"),
      pd(10, "Colombo", 58, 196, "Departure day", "Last-minute gems or spa hour, then to the airport — leaving as family.", [], "Smooth, timed transfer"),
    ]
  },
  {
    id: "pkg2", slug: "sri-lanka-family-adventure", name: "Sri Lanka Family Adventure", collection: "family",
    summary: "Built for small legs and big imaginations: gentle safaris, baby-turtle releases, calm lagoons and train windows wide open.",
    days: 12, nights: 11, pricePP: 1680,
    itinerary: [
      pd(1, "Colombo", 58, 196, "Easy arrival", "Slow first day — pool time and a tuk-tuk food safari the kids will rate 10/10.", ["cuisine"], "Kid-proof pacing"),
      pd(2, "Dambulla", 104, 112, "Golden caves", "Monkeys on the stairs, golden Buddhas inside — history that feels like a treasure hunt.", [], "Kid-friendly temple run"),
      pd(3, "Sigiriya", 108, 116, "Climb the lion's paws", "Pidurangala's easier summit for families, plus a bullock-cart and canoe village tour.", ["hiking"], "Adventure without the crowds"),
      pd(4, "Kandy", 98, 172, "Tooth Temple & drums", "Evening ceremony, then the botanic gardens' giant bamboo and bat trees.", [], "Space to run wild"),
      pd(5, "Nuwara Eliya", 102, 202, "Strawberry farms", "Pedal boats on Lake Gregory, strawberry picking and high-tea sandwiches.", ["cuisine"], "Farm-to-mouth fun"),
      pd(6, "Ella", 120, 216, "All aboard!", "The tea train with door-seat bravado (grown-ups on lookout), plus the flying fox for teens.", ["tea-train"], "The train is the destination"),
      pd(7, "Udawalawe", 110, 246, "Elephant day", "Safari jeeps with boosters, then feeding time at the elephant transit home.", ["wildlife-safaris"], "Elephants at arm's length"),
      pd(8, "Sinharaja", 68, 234, "Jungle detectives", "An easy ranger-led walk hunting lizards and giant squirrels — waterfall swim after.", ["hiking"], "Rainforest classroom"),
      pd(9, "Kosgoda", 54, 246, "Baby turtles", "Hold a day-old hatchling and release one at sunset — core memory guaranteed.", [], "Conservation hatchery"),
      pd(10, "Polhena", 66, 276, "Turtle lagoon", "Snorkel the sheltered reef where turtles graze between swimmers.", ["snorkeling"], "Safe, shallow, magical"),
      pd(11, "Mirissa", 72, 274, "Whales & beach", "Marine biologist on board for the whale trip; sandcastle championships after.", ["whale-watching"], "Educational + exciting"),
      pd(12, "Colombo", 58, 196, "Homeward", "Souvenir run and airport transfer — already planning the next visit.", [], "Door-to-door ease"),
    ]
  },
  {
    id: "pkg3", slug: "cultural-highlights-beach-bliss", name: "Cultural Highlights & Beach Bliss", collection: "round_tour",
    summary: "Five days deep in the ancient kingdoms, then four doing absolutely nothing beautifully on the east coast.",
    days: 9, nights: 8, pricePP: 1290,
    itinerary: [
      pd(1, "Colombo", 58, 196, "Arrival", "Rest and reset after the flight.", [], "Gentle start"),
      pd(2, "Anuradhapura", 92, 78, "The first kingdom", "Cycle the sacred city — Bo tree, giant dagobas and 2,300 years of devotion.", [], "UNESCO holy city"),
      pd(3, "Polonnaruwa", 124, 122, "The medieval capital", "Gal Vihara's serene stone Buddhas and king-sized ruins by bicycle.", [], "Best-preserved ruins"),
      pd(4, "Sigiriya", 108, 116, "Sky fortress", "Sunrise climb, frescoes, and an afternoon ayurvedic massage to recover.", ["ayurveda", "hiking"], "Eighth-wonder vibes"),
      pd(5, "Kandy", 98, 172, "Hill capital", "Tooth Temple at ceremony time and a cultural dance show.", ["cuisine"], "The sacred relic"),
      pd(6, "Trincomalee", 138, 90, "To the east coast", "Switch mountains for powder sand; evening at Koneswaram cliff temple.", [], "Two-coasts contrast"),
      pd(7, "Trincomalee", 140, 92, "Pigeon Island", "Snorkel coral gardens with reef sharks (the harmless kind) and turtles.", ["snorkeling"], "Best east-coast reef"),
      pd(8, "Trincomalee", 138, 94, "Beach day", "Do nothing. Do it well.", [], "Pure beach bliss"),
      pd(9, "Colombo", 58, 196, "Departure", "East-coast breakfast, then the cross-country drive home with a driver who tells great stories.", [], "Scenic transfer"),
    ]
  },
  {
    id: "pkg4", slug: "family-adventure-beach-escape", name: "Family Adventure & Beach Escape", collection: "family",
    summary: "One week of action, one of nothing: safari jeeps, easy hikes and train rides balanced with pool-and-beach time the whole family craves.",
    days: 8, nights: 7, pricePP: 1190,
    itinerary: [
      pd(1, "Colombo", 58, 196, "Arrival + pool", "Jet-lag defeated by pool pizza.", [], "Land soft"),
      pd(2, "Kitulgala", 80, 190, "Rapids day (kids 10+)", "Grade-3 rafting and a waterfall jump for the brave; jungle lunch by the river.", ["rafting"], "Safest thrills in Asia"),
      pd(3, "Kandy", 98, 172, "Temple & gardens", "Drums, the Tooth Temple and giant fig trees.", [], "Culture kept fun"),
      pd(4, "Ella", 120, 216, "Train + Little Adam's Peak", "The famous rail ride then an easy family summit for sunset.", ["tea-train", "hiking"], "Two icons, one day"),
      pd(5, "Udawalawe", 110, 246, "Elephant safari", "Morning game drive, then south to the beach.", ["wildlife-safaris"], "Elephants guaranteed"),
      pd(6, "Mirissa", 72, 274, "Beach day", "Sandcastles, coconuts, surfing lesson for anyone keen.", ["surfing"], "The south's best bay"),
      pd(7, "Galle", 58, 268, "Fort wander + Madu River", "Ramparts and gelato, then mangrove boat safari.", ["cuisine"], "History that tastes good"),
      pd(8, "Colombo", 58, 196, "Departure", "Sunset beach before the flight if time allows.", [], "Smooth send-off"),
    ]
  },
  {
    id: "pkg5", slug: "sri-lankas-big-five-with-kids", name: "Sri Lanka's Big Five with Kids", collection: "wildlife",
    summary: "Leopard, elephant, sloth bear, blue whale and wild buffalo — the island's Big Five, tracked with naturalists who make it a game for kids.",
    days: 7, nights: 6, pricePP: 1050,
    itinerary: [
      pd(1, "Colombo", 58, 196, "Arrival", "Explorer kits for the kids: binoc cards, checklists, safari journals.", [], "Big Five briefing"),
      pd(2, "Wilpattu", 70, 102, "Sloth bear country", "The quiet giant of parks — villus, bears and maybe a leopard lazing by a lake.", ["wildlife-safaris"], "Crowd-free safari"),
      pd(3, "Sigiriya", 108, 116, "Rock + ranger evening", "Climb the rock, then a naturalist talk on tonight's mammals.", ["hiking"], "History + habitat"),
      pd(4, "Udawalawe", 110, 246, "Elephant 101", "Hundreds of elephants, plus the transit home's youngest residents.", ["wildlife-safaris"], "Elephant behaviour class"),
      pd(5, "Yala", 142, 258, "Leopard day", "Dawn and dusk drives in the world's best leopard territory.", ["wildlife-safaris"], "Highest leopard density on earth"),
      pd(6, "Mirissa", 72, 274, "Giants of the sea", "Blue whales off the shelf — the ocean half of the Big Five.", ["whale-watching"], "Largest animal that ever lived"),
      pd(7, "Colombo", 58, 196, "Certificates & departure", "Junior Big Five certificates for anyone who spotted them all.", [], "Bragging rights sealed"),
    ]
  },
  {
    id: "pkg6", slug: "honeymoon-island-romance", name: "Honeymoon Tours — Island Romance", collection: "honeymoon",
    summary: "Private plunge pools, cliff-side dinners, hot-air balloons at dawn and a villa where the ocean is your front yard.",
    days: 10, nights: 9, pricePP: 1890,
    itinerary: [
      pd(1, "Colombo", 58, 196, "Champagne arrival", "Fast-track through the airport, roses in the car, rooftop dinner above the city.", ["cuisine"], "Zero-friction start"),
      pd(2, "Dambulla", 104, 112, "Balloon at dawn", "Drift over the Cultural Triangle as the sun ignites Sigiriya — breakfast where you land.", ["hot-air-ballooning"], "Sunrise from 1,000 ft"),
      pd(3, "Sigiriya", 108, 116, "Two rocks, two of you", "Private sunrise climb of Pidurangala, then couples' ayurveda ritual.", ["ayurveda", "hiking"], "The photo of the trip"),
      pd(4, "Kandy", 98, 172, "Lakeside evening", "Blessing at the Tooth Temple, then dinner over the water.", [], "A blessing to travel on"),
      pd(5, "Nuwara Eliya", 102, 202, "Tea-estate suite", "High tea among the bushes, fireplace evening in a planter's bungalow.", ["tea-train"], "Sleep inside a tea estate"),
      pd(6, "Ella", 120, 216, "The rail journey", "Observation car, just you two and a valley of green.", ["tea-train"], "The slowest, best hours"),
      pd(7, "Yala", 142, 258, "Luxury tented safari", "Leopards by day, lantern-lit bush dinner by night.", ["wildlife-safaris"], "Safari, but make it couture"),
      pd(8, "Mirissa", 72, 274, "Private whale catamaran", "Skip the crowd — your own boat into the blue-whale channel.", ["whale-watching"], "Blue whales, just us"),
      pd(9, "Galle", 58, 268, "Rampart sunset + spa", "Couples' spa, then a private table on the fort walls as the lighthouse comes on.", ["ayurveda", "shopping"], "The fort at dusk"),
      pd(10, "Colombo", 58, 196, "Farewell, for now", "Breakfast on the beach before the flight home.", [], "See you for the anniversary"),
    ]
  },
  {
    id: "pkg7", slug: "honeymoon-tea-and-sea", name: "Honeymoon Tours — Tea & Sea", collection: "honeymoon",
    summary: "A week split between misty tea-estate suites and a castaway east-coast beach — slow, private, delicious.",
    days: 8, nights: 7, pricePP: 1590,
    itinerary: [
      pd(1, "Colombo", 58, 196, "Arrival", "Roses, rooftop, rest.", [], "Soft landing"),
      pd(2, "Nuwara Eliya", 102, 202, "Into the clouds", "Tea factory private tasting and a planter's bungalow for two.", ["tea-train"], "Bungalow in the bushes"),
      pd(3, "Ella", 120, 216, "Nine Arches at dawn", "The bridge with no crowds, then the famous train back the other way.", ["tea-train", "hiking"], "That photo, minus people"),
      pd(4, "Trincomalee", 138, 90, "East coast villa", "Your own slice of bay — dinner with feet in the sand.", [], "Castaway luxury"),
      pd(5, "Trincomalee", 140, 92, "Pigeon Island for two", "Private snorkel charter over the coral gardens.", ["snorkeling"], "Reef without the flotilla"),
      pd(6, "Trincomalee", 138, 94, "Whale & cliff temple", "Blue whales in the morning, Koneswaram at sunset.", ["whale-watching"], "Oceans and gods"),
      pd(7, "Trincomalee", 136, 91, "Do-nothing day", "Hammock, book, repeat. Ayurvedic massage at four.", ["ayurveda", "yoga"], "Masterful inactivity"),
      pd(8, "Colombo", 58, 196, "Departure", "Slow coastal drive south, airport, tears, promises to return.", [], "Until next time"),
    ]
  },
  {
    id: "pkg8", slug: "ancient-kingdoms-round-tour", name: "Round Tours — Ancient Kingdoms Grand Loop", collection: "round_tour",
    summary: "The definitive two weeks: every UNESCO site, both coasts, two safaris and enough stories to dine out on for years.",
    days: 14, nights: 13, pricePP: 2200,
    itinerary: [
      pd(1, "Colombo", 58, 196, "Arrival", "Welcome dinner and the trip ahead over a map.", [], "The grand loop begins"),
      pd(2, "Anuradhapura", 92, 78, "First kingdom", "Sacred city by bicycle.", [], "2,300 years"),
      pd(3, "Wilpattu", 70, 102, "Wild north-west", "Sloth bears between ancient lakes.", ["wildlife-safaris"], "Jungle + archaeology"),
      pd(4, "Sigiriya", 108, 116, "The rock", "Sunrise summit + village lunch.", ["hiking"], "The icon"),
      pd(5, "Polonnaruwa", 124, 122, "Medieval capital", "Stone Buddhas and royal baths.", [], "Golden age ruins"),
      pd(6, "Trincomalee", 138, 90, "East escape", "Beach afternoon after the ruins.", [], "Ruins to reefs"),
      pd(7, "Kandy", 98, 172, "Tooth Temple", "Ceremony drums at dusk.", ["cuisine"], "The sacred heart"),
      pd(8, "Nuwara Eliya", 102, 202, "Tea hills", "Factory, roses, fireplace.", ["tea-train"], "Little England"),
      pd(9, "Ella", 120, 216, "The famous train", "Observation seats through the highlands.", ["tea-train", "hiking"], "The ride itself"),
      pd(10, "Yala", 142, 258, "Leopard day", "Dawn + dusk drives.", ["wildlife-safaris"], "Big-cat capital"),
      pd(11, "Sinharaja", 68, 234, "Rainforest walk", "Waterfall swim to finish.", ["hiking"], "The living ark"),
      pd(12, "Galle", 58, 268, "Fort afternoon", "Ramparts and rooftop dinner.", ["shopping", "cuisine"], "The walled city"),
      pd(13, "Mirissa", 72, 274, "Whale finale", "Blue whales, then a free beach afternoon.", ["whale-watching", "surfing"], "The biggest goodbye"),
      pd(14, "Colombo", 58, 196, "Departure", "Last-minute shopping and the flight home.", [], "Leave as family"),
    ]
  },
];

/* ============================= REVIEWS (mock TripAdvisor ingestion) ============================= */
export const REVIEWS: Review[] = [
  {
    id: "r1", source: "tripadvisor", author: "Clara H.", country: "Germany", rating: 5, date: "2026-08-30", featured: true,
    text: "Nimal rebuilt our whole itinerary around our toddler and it was flawless. The human review is REAL — a person WhatsApped us every evening. Best travel money we've ever spent."
  },
  {
    id: "r2", source: "tripadvisor", author: "James & Priya", country: "Australia", rating: 5, date: "2026-08-18", featured: true,
    text: "The deposit/final-balance split made budgeting so clear. Receipt upload was painless and our bank transfer was verified within a day. Yala leopard sighting on day one!"
  },
  {
    id: "r3", source: "tripadvisor", author: "Sophie M.", country: "France", rating: 5, date: "2026-07-29", featured: true,
    text: "We customized the Island Explorer and the team told us honestly which of our ideas were too rushed. That honesty is why you should book them. Ella at sunrise… no words."
  },
  {
    id: "r4", source: "tripadvisor", author: "Tom B.", country: "United Kingdom", rating: 4, date: "2026-07-12", featured: true,
    text: "Slight delay confirming one hotel, but they flagged it early and offered a better alternative. Communication via WhatsApp was constant. Would absolutely book again."
  },
  {
    id: "r5", source: "tripadvisor", author: "Elena G.", country: "Spain", rating: 5, date: "2026-06-21", featured: false,
    text: "Solo traveller and felt completely looked after. My planner suggested group safari days to save money — who does that? Five stars."
  },
  {
    id: "r6", source: "tripadvisor", author: "The Novak Family", country: "Netherlands", rating: 5, date: "2026-06-02", featured: false,
    text: "Big Five with Kids package: our 8-year-old got her 'junior naturalist certificate' and hasn't stopped talking about the baby turtles. Worth every euro."
  },
  {
    id: "r7", source: "tripadvisor", author: "Marco R.", country: "Italy", rating: 4, date: "2026-05-19", featured: false,
    text: "Train through tea country was the highlight of our honeymoon. Bank transfer option saved us a chunk vs card fees. Clear refund policy gave us confidence to book early."
  },
  {
    id: "r8", source: "tripadvisor", author: "Hannah & Luke", country: "United States", rating: 5, date: "2026-05-01", featured: false,
    text: "Hot air balloon over Sigiriya at dawn, then breakfast in a field. The pay结构 was transparent from the first email. Incredible team."
  },
];

/* ============================= SEEDED PLANS / PAYMENTS / RECEIPTS ============================= */
export const SEED_PLANS: Plan[] = [
  {
    id: "p1", ref: "RGT-2026-1001", owner: true, type: "custom", tourist: "Emma Johnson", country: "United Kingdom",
    currency: "GBP", start: "2026-11-10", end: "2026-11-19", pax: { adults: 2, children: 0, infants: 0 }, star: 4,
    experiences: ["hiking", "snorkeling", "tea-train"], places: ["Ella", "Nuwara Eliya", "Polhena"],
    mustVisit: "Pidurangala at sunrise", budgetPPMin: 700, budgetPPMax: 1100,
    contact: { methods: ["email", "whatsapp"], phone: "+44 7700 900123" },
    notes: "Vegetarian meals for one of us. We love photo stops — relaxed pacing please.",
    status: "awaiting_tour_deposit", claimedBy: "Nimal Perera", total: 2100, deposit: 500,
    depositDue: "2026-10-05", finalDue: null, amountsLocked: false, declaredBy: "Nimal Perera",
    finalMethod: null, createdAt: "2026-09-18", versions: ["Tourist original request", "Planner final version (agreed via WhatsApp)"]
  },
  {
    id: "p2", ref: "RGT-2026-1002", owner: false, type: "package_asis", packageId: "pkg1", pkgName: "Best of Sri Lanka",
    tourist: "Lars Schmidt", country: "Germany", currency: "EUR", start: "2026-12-20", end: "2026-12-29",
    pax: { adults: 2, children: 1, infants: 0 }, star: 4, experiences: [], places: [], mustVisit: "",
    budgetPPMin: 1334, budgetPPMax: 1334, contact: { methods: ["email"], phone: "" }, notes: "Two adults + one 9-year-old.",
    status: "submitted", claimedBy: null, total: null, deposit: null, depositDue: null, finalDue: null,
    amountsLocked: false, finalMethod: null, createdAt: "2026-09-22", versions: ["Package booked as-is (10 Days · 9 Nights)"]
  },
  {
    id: "p3", ref: "RGT-2026-1003", owner: true, type: "custom", tourist: "Emma Johnson", country: "United Kingdom",
    currency: "GBP", start: "2026-10-02", end: "2026-10-09", pax: { adults: 2, children: 0, infants: 0 }, star: 5,
    experiences: ["whale-watching", "ayurveda"], places: ["Mirissa", "Galle"], mustVisit: "",
    budgetPPMin: 650, budgetPPMax: 990, contact: { methods: ["email", "whatsapp"], phone: "+44 7700 900123" },
    notes: "Anniversary trip — a special dinner one night would be amazing.",
    status: "awaiting_final_balance", claimedBy: "Nimal Perera", total: 1980, deposit: 500,
    depositDue: null, finalDue: "2026-09-28", amountsLocked: true, declaredBy: "Nimal Perera",
    finalMethod: null, createdAt: "2026-09-05", versions: ["Tourist original request", "Planner final version (agreed by email)"]
  },
  {
    id: "p4", ref: "RGT-2026-1004", owner: false, type: "custom", tourist: "Oliver Brown", country: "Australia",
    currency: "AUD", start: "2026-12-01", end: "2026-12-11", pax: { adults: 4, children: 2, infants: 0 }, star: 4,
    experiences: ["wildlife-safaris"], places: ["Yala", "Mirissa"], mustVisit: "", budgetPPMin: 450, budgetPPMax: 640,
    contact: { methods: ["email", "whatsapp"], phone: "+61 498 765 432" },
    notes: "One child uses a wheelchair — step-free rooms please.",
    status: "bank_transfer_pending", claimedBy: "Sithum Fernando", total: 3100, deposit: 800,
    depositDue: null, finalDue: "2026-10-01", amountsLocked: true, declaredBy: "Sithum Fernando",
    finalMethod: "bank", createdAt: "2026-09-10", versions: ["Tourist original request", "Planner final version (agreed by email)"]
  },
  {
    id: "p5", ref: "RGT-2026-1005", owner: false, type: "package_customized", packageId: "pkg3", pkgName: "Cultural Highlights & Beach Bliss",
    tourist: "Sophie Martin", country: "France", currency: "EUR", start: "2026-10-15", end: "2026-10-23",
    pax: { adults: 3, children: 1, infants: 0 }, star: 4, experiences: ["snorkeling"], places: ["Trincomalee"],
    mustVisit: "Add one extra beach day", budgetPPMin: 450, budgetPPMax: 700,
    contact: { methods: ["email", "imessage"], phone: "+33 6 12 34 56 78" },
    notes: "We swapped one cultural day for an extra Trincomalee beach day.",
    status: "in_discussion", claimedBy: "Sithum Fernando", total: null, deposit: null, depositDue: null, finalDue: null,
    amountsLocked: false, finalMethod: null, createdAt: "2026-09-21", versions: ["Customized from Cultural Highlights & Beach Bliss"]
  },
  {
    id: "p6", ref: "RGT-2026-1006", owner: false, type: "custom", tourist: "Marco Rossi", country: "Italy",
    currency: "EUR", start: "2026-10-05", end: "2026-10-12", pax: { adults: 2, children: 0, infants: 0 }, star: 3,
    experiences: ["surfing"], places: ["Mirissa"], mustVisit: "", budgetPPMin: 300, budgetPPMax: 550,
    contact: { methods: ["email"], phone: "" }, notes: "",
    status: "on_hold", prevStatus: "in_discussion", holdReason: "No reply to 3 emails since Sep 8.",
    claimedBy: "Nimal Perera", total: null, deposit: null, depositDue: null, finalDue: null,
    amountsLocked: false, finalMethod: null, createdAt: "2026-09-05", versions: ["Tourist original request"]
  },
];

export const SEED_PAYMENTS: Payment[] = [
  { id: "pay1", ref: "RCPT-5001", planRef: "RGT-2026-1003", type: "tour_deposit", method: "gateway", amount: 500, currency: "GBP", status: "succeeded", date: "2026-09-12" },
  { id: "pay2", ref: "RCPT-5002", planRef: "RGT-2026-1004", type: "tour_deposit", method: "gateway", amount: 800, currency: "AUD", status: "succeeded", date: "2026-09-14" },
  { id: "pay3", ref: "RCPT-5003", planRef: "RGT-2026-1004", type: "final_balance", method: "bank_transfer", amount: 2300, currency: "AUD", status: "pending", date: "2026-09-22", receiptId: "br1" },
];

export const SEED_RECEIPTS: BankReceipt[] = [
  {
    id: "br1", ref: "BR-2026-0007", planRef: "RGT-2026-1004", paymentRef: "RCPT-5003", fileName: "anz-transfer-receipt.pdf",
    uploadedBy: "tourist", status: "pending", version: 1, createdAt: "2026-09-22"
  },
];

export const SEED_NOTIFICATIONS: Notification[] = [
  { id: "n1", forRole: "staff", title: "New package booking", body: "RGT-2026-1002 (Best of Sri Lanka, as-is) submitted by Lars Schmidt — contact to declare deposit.", t: "2026-09-22 09:41", read: false },
  { id: "n2", forRole: "staff", title: "Bank receipt awaiting review", body: "BR-2026-0007 for RGT-2026-1004 — A$2,300.00 Final Balance.", t: "2026-09-22 16:20", read: false },
  { id: "n3", forRole: "tourist", title: "Your plan is confirmed 🎉", body: "RGT-2026-1001 — pay your Tour Booking Deposit of £500.00 by 05 Oct to start bookings.", t: "2026-09-19 11:02", read: false },
  { id: "n4", forRole: "tourist", title: "Deposit received", body: "RGT-2026-1003 — £500.00 confirmed. Your Final Balance of £1,480.00 is now payable.", t: "2026-09-12 14:05", read: false },
];

export const TOURIST = {
  name: "Emma Johnson",
  email: "emma.johnson@example.co.uk",
  country: "United Kingdom",
  currency: "GBP" as const,
  lang: "English",
  phone: "+44 7700 900123",
  contactMethods: ["email", "whatsapp"],
};

/* ============================= GALLERY (consent-based) ============================= */
import type { GalleryPhoto, BlogPost } from "@/lib/types";

export const SEED_GALLERY: GalleryPhoto[] = [
  {
    id: "g1", url: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop",
    caption: "Nine Arches Bridge, wrapped in tea country mist", place: "Ella, Hill Country", consentBy: "James & Priya (AU)", addedBy: "Nimal Perera", createdAt: "2026-08-20"
  },
  {
    id: "g2", url: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=1200&auto=format&fit=crop",
    caption: "Sunrise from Lion Rock — worth the 5am alarm", place: "Sigiriya, Cultural Triangle", consentBy: "Clara H. (DE)", addedBy: "Nimal Perera", createdAt: "2026-08-11"
  },
  {
    id: "g3", url: "https://images.unsplash.com/photo-1728455470905-156f4278056a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    caption: "Leopard at golden hour in Block 1", place: "Yala National Park", consentBy: "James & Priya (AU)", addedBy: "Sithum Fernando", createdAt: "2026-08-19"
  },
  {
    id: "g4", url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1200&auto=format&fit=crop",
    caption: "Stilt fishermen at sunset, just like the postcards", place: "Mirissa, South Coast", consentBy: "Sophie M. (FR)", addedBy: "Nimal Perera", createdAt: "2026-07-30"
  },
  {
    id: "g5", url: "https://images.unsplash.com/photo-1580889240912-c39ecefd3d95?q=80&w=1200&auto=format&fit=crop",
    caption: "Temple of the Tooth at dusk", place: "Kandy, Central Province", consentBy: "Elena G. (ES)", addedBy: "Sithum Fernando", createdAt: "2026-06-22"
  },
  {
    id: "g6", url: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?q=80&w=1200&auto=format&fit=crop",
    caption: "Galle Fort lighthouse at golden hour", place: "Galle Fort, Southern Province", consentBy: "Tom B. (UK)", addedBy: "Amaya Silva", createdAt: "2026-07-13"
  },
  {
    id: "g7", url: "https://images.unsplash.com/photo-1499848144902-af767f6d0c7f?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    caption: "Tea pluckers on the morning rounds, Little England", place: "Nuwara Eliya", consentBy: "The Novak Family (NL)", addedBy: "Nimal Perera", createdAt: "2026-06-03"
  },
  {
    id: "g8", url: "https://images.unsplash.com/photo-1719450589784-c2c36ccf8e5b?q=80&w=1075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    caption: "Blue whales off the continental shelf drop", place: "Mirissa Whale Belt", consentBy: "Marco R. (IT)", addedBy: "Sithum Fernando", createdAt: "2026-05-20"
  },
];

/* ============================= BLOG POSTS ============================= */
export const SEED_BLOGS: BlogPost[] = [
  {
    id: "b1", slug: "sigiriya-sunrise-guide", title: "Climbing Sigiriya at Sunrise: The Honest Guide",
    excerpt: "Gates open at 5am, the rock glows by 6. Here's exactly when to climb, which entrance to use, and why Pidurangala might be the better photo.",
    image: "https://images.unsplash.com/photo-1588254121916-072b8ed4e9f6?q=80&w=1600&auto=format&fit=crop",
    location: { name: "Sigiriya Rock Fortress", region: "Cultural Triangle", x: 108, y: 116 },
    content: [
      "Sigiriya is the one place in Sri Lanka where arriving early genuinely changes everything. Gates open at 5:00am, and by 6:30 the flat top of Lion Rock is bathed in a soft amber light that lasts maybe twenty minutes — miss it and you're climbing in full tropical sun with the bus tours.",
      "Our honest routing: enter through the western gate, move fast past the garden terraces, and tackle the spiral staircases before the heat. The frescoes (the famous cloud maidens) are politely roped off but still extraordinary — the scale of the 5th-century paintwork surviving 1,500 years of monsoon is hard to overstate.",
      "Photo secret from our guides: if you want Sigiriya *in* your photo rather than *from* it, climb Pidurangala Rock next door in the afternoon instead. It's a fraction of the price (around $3 vs $30), ten minutes up a boulder scramble, and the silhouette of Lion Rock at golden hour is the single best frame on the island.",
      "Practical notes: 1,200 steps to the summit, no shade on the metal staircases, monkeys on the lower ramps (hold your snacks). Water is sold at the gate, none beyond it. Allow three hours door to door if you linger at the Lions Paws — and you should linger at the Lions Paws.",
    ],
    author: "The Ruga Tours Team", date: "2026-08-25", readMins: 6, published: true, createdBy: "Amaya Silva", updatedAt: "2026-08-25"
  },

  {
    id: "b2", slug: "ella-by-scenic-train", title: "The Kandy–Ella Train: Seat Sides, Times & Booking Tricks",
    excerpt: "Seven hours of tea-infused magic through the hill country — but which side of the train should you sit on? One of our planners rode it 40 times so you don't have to guess.",
    image: "https://images.unsplash.com/photo-1531124480002-1b2a8323fcc4?q=80&w=1600&auto=format&fit=crop",
    location: { name: "Kandy → Ella", region: "Hill Country", x: 98, y: 172 },
    content: [
      "Everyone calls it the most beautiful train ride in the world, and for once the hype is actually underselling it. The Kandy–Ella line climbs 1,400 metres through tea estates, cloud forest and 46 tunnels — but the experience depends wildly on where you sit and which departure you take.",
      "Rule one: sit on the RIGHT side if you're travelling Kandy→Ella. The famous valley panoramas — the Great Western range, the drops toward Udawalawe — open up on the right for most of the second half. Coming back? Flip it. Rule two: the stretch between Haputale and Ella, not the famous Nine Arches itself, is where the train moves slowest and the tea grows closest to the windows. Hands out, phones ready.",
      "Booking is where most travellers stumble. Reserved seats open exactly 30 days ahead and the observation saloon sells out in minutes on weekends. Our team's trick: book Kandy→Nanu Oya as one segment and Nanu Oya→Ella as the next — often available when the through-ticket shows sold out. Second class reserved is honestly better than first for photos: windows open, glass doesn't.",
      "Expect the vendors. Chai in clay cups for 50 LKR, spicy vadai wrapped in yesterday's newspaper (trust us), pineapple slices dusted with salt and pepper at every stop. The rhythm of the vendors is half the charm — this is a moving village, not a shuttle.",
      "Ruga travelers: we pre-book all rail segments in your day-by-day plan and brief your driver to meet you at the station staircase. Seven hours sound long. It never is.",
    ],
    author: "The Ruga Tours Team", date: "2026-08-10", readMins: 8, published: true, createdBy: "Amaya Silva", updatedAt: "2026-09-01"
  },

  {
    id: "b3", slug: "safari-yala-vs-wilpattu", title: "Yala or Wilpattu? Our Safari Honesty File",
    excerpt: "One has the world's densest leopard population. The other has it to yourself. We run safaris in both — here's who should go where, and when.",
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=1600&auto=format&fit=crop",
    location: { name: "Yala vs Wilpattu", region: "National Parks", x: 142, y: 258 },
    content: [
      "Ask a hundred people online and you'll get a hundred rankings of Sri Lanka's parks. Having run families through both Yala and Wilpattu for years, our answer is simpler: it's not which park is 'best' — it's which park is best for *you* on *your* dates.",
      "Yala Block 1 holds the highest recorded leopard density anywhere on Earth. The cats are habituated, relaxed, and photographed from twenty metres most mornings. The trade-off is fame: in high season (February to July) you'll share a sighting with a circle of twelve jeeps. Go early, go with a driver who reads alarm calls instead of following the convoy, and you'll still have magic.",
      "Wilpattu is the architect's park — naema villus (natural sand-rimmed lakes), cathedral-like forest, and maybe four other vehicles all day. Leopard odds are lower per hour but the sightings are *yours*. It's also the better park from May to October when Yala's Block 1 closes, and the seas off its west boundary are gentler for kids' beaches afterwards.",
      "Our verdict in one line each: first safari, want the photo, short trip — choose Yala. Repeat visitor, hate crowds, or travelling May–Sept — choose Wilpattu. Have four days? Do both; they're three hours apart and the contrast is the lesson.",
      "Practicals: gates open 6am, private jeeps are worth every rupee over shared ones, and pack a buff or scarf — the morning dust is no myth. And if a leopard crosses the track in front of you at dawn, stay off the camera for one full minute first. Some frames belong in your head.",
    ],
    author: "The Ruga Tours Team", date: "2026-07-15", readMins: 7, published: true, createdBy: "Nimal Perera", updatedAt: "2026-07-15"
  },

  {
    id: "b4", slug: "south-coast-with-kids", title: "DUST: The Honest South Coast Family Budget Post",
    excerpt: "What a week on the south coast with two kids actually costs — tuk-tuks, turtle hatcheries, and the one splurge we'd repeat every time.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
    location: { name: "Mirissa & Galle", region: "South Coast", x: 72, y: 274 },
    content: [
      "DRAFT — pricing table still being verified by Sithum with 2026 season rates.",
      "Skim of the plan: split the week between Mirissa (calm swim beach, whale morning) and Galle (Fort walk, ice creams at Pedlar's St). Kids under 8 do better with one structured morning + free afternoons, so we budget activities on alternate days.",
      "Placeholder — insert tuk-tuk tariff card and hatchery ethics note. Tuk-tuk rule of thumb: 350–500 LKR per in-town hop, always agree before you sit. Hatcheries: only the ones that release hatchlings the same night; we note the two kosma we trust.",
      "Splurge item: private dawn whale-watching boat (family of 4 ~ 28,000 LKR) — the value is leaving at 5:30 to get thirty quiet minutes before the flotilla. Would repeat every time.",
    ],
    author: "The Ruga Tours Team", date: "2026-09-18", readMins: 5, published: false, createdBy: "Amaya Silva", updatedAt: "2026-09-18"
  },

  {
    id: "b5", slug: "kandy-evening-rituals", title: "An Evening in Kandy: Drums, Temples & Kottu",
    excerpt: "Between the last drum at the Temple of the Tooth and the first kottu chop at Muslim Hotel — how we spend the streets of our hometown.",
    image: "https://images.unsplash.com/photo-1580889140912-c39ecefd3d95?q=80&w=1600&auto=format&fit=crop",
    location: { name: "Kandy", region: "Central Province", x: 98, y: 172 },
    content: [
      "Kandy is where most of our team grew up, so this one is personal. Tourists do the sacred city in three hours between the Temple and a gem shop. We do it in one whole evening, on foot, following the drums.",
      "Start at 5:15pm on the Temple's east steps — the evening puja drums (the hewisi orchestra) begin as the lotus scent hits and the white-clothed families stream in. You are allowed to be there. Be quiet, dress white if you can, and watch the island's heart do its daily work.",
      "Twilight is for the lake — the loop path takes forty minutes and the fruit bats launch from the giant trees one after the other, like smoke signals. Skip nothing on the food front: hot ulundu vadai at the stall by the fish market; kottu at Muslim Hotel where the choppingboard rhythm is percussion in its own right.",
      "Ends at 8pm on the upper terrace of the old market with a faluda, watching the Temple's gold go dark over the water. Every guest who's ever done this evening with us says the same thing on the way back: *'Now I get what you meant about family.'*",
    ],
    author: "The Ruga Tours Team", date: "2026-06-30", readMins: 5, published: true, createdBy: "Nimal Perera", updatedAt: "2026-06-30"
  },
];
