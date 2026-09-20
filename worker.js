/**
 * Whitehouse Community Services Directory — Cloudflare Worker
 *
 * After uploading, set these in Worker Settings → Variables:
 *   ADMIN_PASSWORD   = your admin password (for /admin panel)
 *   COMMUNITY_CODE   = a word to share with residents e.g. "whitehouse2026"
 *
 * And in Settings → KV Namespace Bindings:
 *   SERVICES_KV      = create a KV namespace called WHITEHOUSE_SERVICES
 */

// ── Seed data ─────────────────────────────────────────────────────────────
const SEED = [
  { name: "Andrew Jones", category: "Plumbers", phone: "07845 915231", description: "Plumbing, electrical, kitchens, bathrooms" },
  { name: "Taleb Plumbing", category: "Plumbers", phone: "07786 402490" },
  { name: "Javed Plumbing", category: "Plumbers", phone: "07949 205199" },
  { name: "KDA Plumbing and Heating", category: "Plumbers", phone: "07535 244616" },
  { name: "Davidson Heating and Plumbing", category: "Plumbers", description: "Boiler servicing" },
  { name: "Rob Heating and Plumbing", category: "Plumbers", description: "Contact via Facebook" },
  { name: "Siva Heating and Plumbing", category: "Plumbers", phone: "+44 7595 659985" },
  { name: "Vimal Technician", category: "Plumbers", phone: "+44 7438 258462", description: "Plumbing, electrical, carpet" },
  { name: "Chris CNS Boiler", category: "Plumbers", phone: "+44 7946 662808" },
  { name: "Aaron", category: "Plumbers", phone: "+44 7713 018006" },
  { name: "George Boland - GB Electrical", category: "Electricians", phone: "07411 689970", description: "Whitehouse based" },
  { name: "Andrew Jones", category: "Electricians", phone: "07845 915231", description: "Electrical installs and repairs" },
  { name: "Andrew Hudson", category: "Electricians", phone: "+44 7917 612309", description: "Handyman and electrician" },
  { name: "RiverRun Decorating - Tony", category: "Decorating & Flooring", phone: "07748116331" },
  { name: "Sea Bonito Event Decoration", category: "Decorating & Flooring", phone: "07830406886", website: "https://www.instagram.com/sea_bonito_decor" },
  { name: "Costel Covaci", category: "Decorating & Flooring", phone: "0794 359 3667", description: "Specialist in engineered, laminate and LVT flooring" },
  { name: "Shenley Flooring", category: "Decorating & Flooring", description: "Vinyl and bathroom flooring" },
  { name: "Martyn", category: "Handymen & Maintenance", phone: "07772 629806", description: "Furniture assembly, garden maintenance, general home maintenance" },
  { name: "Trevor Long - The Appliance Man", category: "Handymen & Maintenance", phone: "07581017211" },
  { name: "Ashraf - Carpenter & Handyman", category: "Handymen & Maintenance", phone: "07570449055", description: "Doors, shelves, curtain rails, TV wall mounting, general woodwork. Always available." },
  { name: "Andrew Hudson", category: "Handymen & Maintenance", phone: "+44 7917 612309", description: "Handyman and electrician" },
  { name: "Harry Gardening MK", category: "Gardening & Landscaping", phone: "+44 7455 917027" },
  { name: "Glen Gardener", category: "Gardening & Landscaping", phone: "+44 7894 428946" },
  { name: "Richard Gardener", category: "Gardening & Landscaping", phone: "+44 7412 452457" },
  { name: "JLR Garden Maintenance", category: "Gardening & Landscaping", phone: "+44 7788 213772" },
  { name: "Peter Gardener", category: "Gardening & Landscaping", phone: "+44 7754 812350" },
  { name: "Pawel Window Cleaner", category: "Window Cleaning", phone: "07598 982444" },
  { name: "Top Cat Window Cleaning - Terry", category: "Window Cleaning", phone: "07947 696751" },
  { name: "Spotless Window Cleaning", category: "Window Cleaning", website: "https://spotlessmk.co.uk" },
  { name: "Roberts Window Cleaning", category: "Window Cleaning", description: "Recommended" },
  { name: "Ioana - Local Cleaner", category: "Cleaning & Car Valeting", phone: "07778664710" },
  { name: "Spotless MK", category: "Cleaning & Car Valeting", website: "https://spotlessmk.co.uk" },
  { name: "Wecasa Cleaning", category: "Cleaning & Car Valeting", website: "https://wecasa.co.uk/domestic-cleaning" },
  { name: "Cleaner Bins MK", category: "Cleaning & Car Valeting", description: "Wheelie bin cleaning" },
  { name: "MK Pure Valet", category: "Cleaning & Car Valeting", phone: "+44 7591 087655", description: "Premium car care" },
  { name: "CCM Blinds - Callum", category: "Blinds & Interiors", phone: "07702 657961", website: "https://ccmblinds.com" },
  { name: "Diya Design LTD - Dee", category: "Design Services", phone: "07903885992", email: "info@diyadesign.com", description: "Logo design, branding, website design & digital design services" },
  { name: "Karishma - GCSE Tutor", category: "Childcare & Tutors", phone: "+44 7448 610242" },
  { name: "Abirami Maths Tuition", category: "Childcare & Tutors", phone: "+44 7551 353189" },
  { name: "SENshine Tutoring - Karina Mistry", category: "Childcare & Tutors", phone: "07884939973", email: "SENshinetutoring.mk@gmail.com", description: "1:1 tutoring" },
  { name: "Ashbourne Nursery", category: "Childcare & Tutors", description: "Oxley Park. Excellent reputation." },
  { name: "Ducklings Preschool", category: "Childcare & Tutors", description: "Friendly, multiple branches." },
  { name: "Acorn Nurseries", category: "Childcare & Tutors", description: "Jubilee Wood / Cold Harbour / Shenley. Highly rated." },
  { name: "Woodlands Nursery", category: "Childcare & Tutors", description: "Downs Barn. Highly praised." },
  { name: "Hampstead Gate Nursery", category: "Childcare & Tutors", description: "Positive feedback from parents." },
  { name: "Small Wonders", category: "Childcare & Tutors", description: "Crownhill. Recommended by parents." },
  { name: "Magic Hands Andria", category: "Hair & Beauty", phone: "+44 7999 792107", description: "Mobile hair and styling" },
  { name: "Rachel's Salon Room", category: "Hair & Beauty", phone: "07512 608473", description: "Home salon" },
  { name: "Leafy - Mobile Hairdresser", category: "Hair & Beauty", phone: "07983 225616" },
  { name: "Arthi - Hair & Makeup", category: "Hair & Beauty", phone: "+44 7809 446769", description: "Hair and makeup, Great Holm" },
  { name: "360 Hair & Scalp", category: "Hair & Beauty", phone: "07707606091", website: "https://www.360hairandscalp.com", description: "Hair restoration clinic, certified trichologist" },
  { name: "Ushi's Beauty", category: "Hair & Beauty", phone: "07866 335938", description: "Waxing and threading beauty services" },
  { name: "Henna By Moxa", category: "Bridal & Henna", website: "https://www.instagram.com/hennabymoxa", description: "Recommended henna artist" },
  { name: "Bhumika - Henna Artist", category: "Bridal & Henna", description: "Local henna artist" },
  { name: "Waggy Tales Dog Daycare", category: "Pet Services", website: "https://waggytales-dogdaycare.co.uk" },
  { name: "Janey - Dog Walker & Pet Sitter", category: "Pet Services", description: "Contact via Facebook" },
  { name: "Cross Roads Kennels", category: "Pet Services", description: "Recommended" },
  { name: "Kingswood Farm Kennels", category: "Pet Services", description: "Recommended" },
  { name: "Just Idlies", category: "Food & Catering", phone: "07880 315565", description: "Catering and tiffin meals" },
  { name: "A Mocktail Fusion Ltd", category: "Food & Catering", phone: "07539 637794", description: "Event drinks, desserts, snacks" },
  { name: "Assma's Kitchen - Egyptian Food", category: "Food & Catering", phone: "07789122167" },
  { name: "Mo's Kitchen", category: "Food & Catering", phone: "07428214725", description: "Luxury catering, African cuisine, cakes & cake pops" },
  { name: "Uni Food Kitchen", category: "Food & Catering", phone: "+44 7938 893318", description: "Birthday cakes and Turkish food" },
  { name: "Rasaa - Indian Catering", category: "Food & Catering", phone: "+44 7823798524", website: "https://www.rasaaindiankitchen.com", description: "Indian grazing tables and catering services" },
  { name: "Rizwaan - Driving Instructor", category: "Driving Instructors", phone: "07399 121786" },
  { name: "Kamal - Driving Instructor", category: "Driving Instructors", phone: "+44 7903 882994" },
  { name: "Sam Gomes - Driving Instructor", category: "Driving Instructors", phone: "+44 7854 131989" },
  { name: "Leah - LM Driving", category: "Driving Instructors", phone: "+44 7599 466957" },
  { name: "Dan Woodall - Driving Instructor", category: "Driving Instructors", description: "Recommended" },
  { name: "Sonjoy Saha - Driving Instructor", category: "Driving Instructors", phone: "+44 7411309963" },
  { name: "Sandlight Travels", category: "Travel", phone: "07403 849749" },
  { name: "Wahid Archery", category: "Event Services", phone: "07472 142963", description: "Mobile archery events" },
  { name: "Sea Bonito Event Decorations", category: "Event Services", phone: "07830406886", website: "https://www.instagram.com/sea_bonito_decor" },
  { name: "Mani's Cab Service", category: "Taxis & Transport", phone: "07780 208667" },
  { name: "Andy Cushion - Man With Van", category: "Taxis & Transport", phone: "+44 7850 479650" },
  { name: "Nigel - Man With Van", category: "Taxis & Transport", phone: "+44 7973 317334" },
  { name: "Pawel Szup - Man With Van", category: "Taxis & Transport", phone: "+44 7365 815674" },
  { name: "Dan Garside - Local Locksmith", category: "Locksmiths", phone: "+44 7984 866788" },
  { name: "Lindal Security Limited", category: "Locksmiths", phone: "01908 645414", description: "Key cutting services" },
  { name: "Tobias - Physiotherapy & Fitness", category: "Health & Fitness", phone: "07880 901403" },
  { name: "Invicta Accounting - Neil", category: "Financial Services", phone: "+44 7814 497130" },
  { name: "The Mortgage Store - Agnieszka", category: "Financial Services", phone: "07956 236803", email: "agnieszkas@the-mortgagestore.co.uk", description: "Mortgages and protection" },
  { name: "STAG Wealth Management - Wojciech", category: "Financial Services", phone: "07714 713353", email: "w.symonowicz@sjpp.co.uk", website: "https://www.stagwealthmanagement.co.uk", description: "Pensions and investments" },
  { name: "Light Tax Limited - Roxana", category: "Financial Services", phone: "07916 151838", email: "roxana@light-tax.co.uk", description: "Qualified accountant" },
  { name: "D'Morj Photography", category: "Photography", phone: "+44 7471 389211" },
  { name: "PranaLight Yoga - Neha", category: "Classes & Activities", phone: "07429387008" },
  { name: "JRDA Dance Academy", category: "Classes & Activities", phone: "07554163790", website: "https://jeyaraveendran.co.uk" },
  { name: "SERI Workout - Sudheerkumar", category: "Classes & Activities", phone: "07435386463", description: "CICL mobility + Zumba designed for 30+" },
  { name: "Rang By Shreya - Art Classes", category: "Classes & Activities", phone: "+44 7901181746", website: "https://www.instagram.com/rangbyshreya", description: "Art classes for kids: STEAM, calligraphy, seasonal craft workshops" },
  { name: "Diya Design - Craft Workshops", category: "Classes & Activities", phone: "07903885992", email: "deee.idc@gmail.com", description: "STEAM designing, calligraphy, seasonal creative craft workshops" },
  { name: "RentLocal - DIY Tool Hire", category: "Hire Services", phone: "07880498050", website: "https://rentlocal.uk" },
  { name: "Twin Stitch", category: "Tailoring & Alterations", phone: "07404 461274", email: "twinstitch.mk@gmail.com", description: "Clothing alterations & stitching, kids & adult dress alterations" },
  { name: "Uktranslate Bureau - Reham", category: "Translation & Legal", phone: "07502638380", email: "info@uktbureau.uk", description: "Translation, legalisation and notarisation" },

  // ── From MK Community (Round the Roundabouts) ──────────────────────────────

  // Accountants
  { name: "Akshay", category: "Accountants", phone: "07957188531", wa: "07957188531" },
  { name: "Prashant", category: "Accountants", phone: "07714679938", wa: "07714679938" },
  { name: "Rashesh", category: "Accountants", phone: "07738280896", wa: "07738280896" },
  { name: "Jyoshna", category: "Accountants", phone: "07515018593", wa: "07515018593" },
  { name: "Mukesh - Cloud Co Group", category: "Accountants", phone: "07725839574", website: "https://cloudcogroup.com", wa: "07725839574" },
  { name: "KK Accountancy", category: "Accountants", phone: "+44 7424 188102", wa: "+44 7424 188102" },

  // Architects
  { name: "Kulvinder Obhi", category: "Architects", phone: "01908 276670" },
  { name: "Archi", category: "Architects", phone: "07760347681", wa: "07760347681" },
  { name: "Mayura Chandekar", category: "Architects", phone: "+44 7800652090", wa: "+44 7800652090" },
  { name: "Nigel - NCC Design", category: "Architects", phone: "+44 7985443343", wa: "+44 7985443343" },
  { name: "Ada", category: "Architects", phone: "07876345762", wa: "07876345762" },
  { name: "Gordon", category: "Architects", phone: "+44 7760 198174", wa: "+44 7760 198174" },
  { name: "Shashikant", category: "Architects", phone: "+44 7821 111602", wa: "+44 7821 111602" },
  { name: "Graham Carroll", category: "Architects", phone: "+44 1908 850690" },
  { name: "Bhau Kadam", category: "Architects", phone: "+44 7502 262202", wa: "+44 7502 262202" },
  { name: "Yasin", category: "Architects", phone: "+44 7470 880587", wa: "+44 7470 880587" },

  // Airport Transfers
  { name: "Chandu Bhai", category: "Airport Transfers", phone: "07528631363", wa: "07528631363", description: "Airport pickup and drop-off, WhatsApp preferred" },
  { name: "Kanubhai Patel", category: "Airport Transfers", phone: "+44 7866424417", wa: "+44 7866424417" },
  { name: "Herin", category: "Airport Transfers", phone: "+44 7438 011606", wa: "+44 7438 011606" },

  // Appliance Repair
  { name: "Ross Howard - MK Appliances", category: "Appliance Repair", phone: "+447805347082", wa: "+447805347082" },
  { name: "Roger Gavan", category: "Appliance Repair", phone: "+44 7860 661270", wa: "+44 7860 661270" },
  { name: "Lakmal - AC Fitter", category: "Appliance Repair", phone: "+44 7956 743384", wa: "+44 7956 743384", description: "Air conditioning installation and repair" },

  // Carpenters
  { name: "Ross", category: "Carpenters", phone: "07377760416", wa: "07377760416" },
  { name: "Amar Bhogal", category: "Carpenters", phone: "07498725012", wa: "07498725012" },
  { name: "Supreet", category: "Carpenters", phone: "+44 7838 607647", wa: "+44 7838 607647" },
  { name: "Anshu", category: "Carpenters", phone: "07969563641", wa: "07969563641" },
  { name: "Deedar", category: "Carpenters", phone: "07402 273384", wa: "07402 273384" },
  { name: "Harvinder", category: "Carpenters", phone: "+44 7940 757344", wa: "+44 7940 757344" },
  { name: "Srikanth Reddy", category: "Carpenters", phone: "+44 7821 637000", wa: "+44 7821 637000" },

  // Carpet & Flooring
  { name: "Jony", category: "Carpet & Flooring", phone: "+44 7440 511913", wa: "+44 7440 511913" },
  { name: "Gary", category: "Carpet & Flooring", phone: "+44 7960 169875", wa: "+44 7960 169875" },
  { name: "Ben - Carpet Fitter", category: "Carpet & Flooring", phone: "+44 7834 464820", wa: "+44 7834 464820" },

  // Gas Engineers
  { name: "Jason - Gas Engineer", category: "Gas Engineers", phone: "+44 7809 458113", wa: "+44 7809 458113" },
  { name: "Gasline UK - Nav", category: "Gas Engineers", phone: "01908 776616", description: "Gas engineer and heating specialist" },
  { name: "Marcus", category: "Gas Engineers", phone: "+44 7534 503724", wa: "+44 7534 503724" },
  { name: "Milton Keynes Heating", category: "Gas Engineers", phone: "+44 7999 624263", wa: "+44 7999 624263" },
  { name: "Nathan", category: "Gas Engineers", phone: "07723071090", wa: "07723071090" },

  // Car Garages
  { name: "Autoworx MK", category: "Car Garages", phone: "01908 310960", description: "BMW specialist garage in Milton Keynes" },
  { name: "Sky Motors", category: "Car Garages", phone: "07506984555", wa: "07506984555" },

  // Immigration & Legal
  { name: "Sujata Joshi", category: "Immigration & Legal", phone: "+44 7423821740", wa: "+44 7423821740", description: "Immigration solicitor, Milton Keynes" },
  { name: "Harmeet Singh", category: "Immigration & Legal", phone: "07868699915", wa: "07868699915", description: "Immigration solicitor, Milton Keynes" },
  { name: "Rizwan", category: "Immigration & Legal", phone: "07939345006", wa: "07939345006" },
  { name: "Sunita Gardner", category: "Immigration & Legal", phone: "07950514962", wa: "07950514962" },

  // Kitchen Fitting
  { name: "Mark Tidmarsh", category: "Kitchen Fitting", phone: "07798900897", wa: "07798900897" },
  { name: "David Punter", category: "Kitchen Fitting", phone: "07711956881", wa: "07711956881" },
  { name: "Deedar - Kitchen Fitter", category: "Kitchen Fitting", phone: "07402 273384", wa: "07402 273384" },

  // Mortgage Advisors
  { name: "Ravi", category: "Mortgage Advisors", phone: "+44 7984 987667", wa: "+44 7984 987667" },
  { name: "Hiren", category: "Mortgage Advisors", phone: "+44 7912 117082", wa: "+44 7912 117082" },
  { name: "Renuka Phadke", category: "Mortgage Advisors", phone: "+44 7862 283813", email: "renukavp3028@gmail.com", wa: "+44 7862 283813" },
  { name: "Jyoti Parimi", category: "Mortgage Advisors", phone: "+44 7889 806813", wa: "+44 7889 806813" },
  { name: "KK", category: "Mortgage Advisors", phone: "+44 7757 310104", wa: "+44 7757 310104" },
  { name: "Manmeet", category: "Mortgage Advisors", phone: "+44 7717 515527", wa: "+44 7717 515527" },
  { name: "Anoop", category: "Mortgage Advisors", phone: "+44 7737 687596", wa: "+44 7737 687596" },
  { name: "Mukesh - MK Wise Financial", category: "Mortgage Advisors", phone: "07725839574", website: "https://mkwisefinancial.com", wa: "07725839574" },

  // Notary (added to Translation & Legal)
  { name: "Mark Evans - Notary", category: "Translation & Legal", phone: "07801354727", email: "mknotary@hotmail.co.uk", description: "Notary public services in Milton Keynes" },
  { name: "Healdlaw Notary Services", category: "Translation & Legal", phone: "01908662277", description: "Notary and legal services, Milton Keynes" },
  { name: "Peter Harrison - Notary", category: "Translation & Legal", phone: "+44 7735 440594", wa: "+44 7735 440594" },

  // Pest Control
  { name: "Roger - Pest Force", category: "Pest Control", phone: "07771 966377", wa: "07771 966377" },
  { name: "John - Pest Control", category: "Pest Control", phone: "07957217050", wa: "07957217050" },

  // PC & Tech Repair
  { name: "Javaid - PC Repair", category: "PC & Tech Repair", phone: "07852933998", wa: "07852933998" },
  { name: "Rez - PC Repair", category: "PC & Tech Repair", phone: "07894442047", wa: "07894442047" },

  // Structural Engineers
  { name: "Manasa Muvvala", category: "Structural Engineers", phone: "07476201042", wa: "07476201042" },
  { name: "Parag - Node Structures", category: "Structural Engineers", phone: "+44 7896 559283", wa: "+44 7896 559283" },

  // Skip Hire
  { name: "Leo Skips", category: "Skip Hire", phone: "07749 667813", wa: "07749 667813" },

  // Tiling
  { name: "Vio - Tiling", category: "Tiling", phone: "+44 7405470492", wa: "+44 7405470492" },
  { name: "Vinny Surti", category: "Tiling", phone: "+44 7762 557541", wa: "+44 7762 557541" },

  // Priests
  { name: "Hareesh Dave", category: "Priests", phone: "+44 7794 037194", wa: "+44 7794 037194", description: "Hindu priest for ceremonies and pujas in Milton Keynes" },
  { name: "Dakshina Murthy", category: "Priests", phone: "+44 7852 294796", wa: "+44 7852 294796", description: "Hindu priest for religious ceremonies in Milton Keynes" },

  // Will Writing
  { name: "Woodfines Solicitors", category: "Will Writing", phone: "01908 202150", description: "Will writing and estate planning, Central Milton Keynes and Newport Pagnell" },

  // Health & Wellbeing
  { name: "Vijay - Physiotherapist", category: "Health & Wellbeing", phone: "07793028141", wa: "07793028141" },
  { name: "Indiya Massage - Binita", category: "Health & Wellbeing", phone: "07957629775", wa: "07957629775", description: "Professional massage therapy in Milton Keynes" },
  { name: "HarmonikCosmos by Rupalli", category: "Health & Wellbeing", phone: "+44 7831 841046", wa: "+44 7831 841046", description: "Holistic healing and spiritual practitioner in Milton Keynes" },
  { name: "Nina Saund - Dietitian", category: "Health & Wellbeing", phone: "07507113570", website: "https://www.TheBespokeDietitian.com", description: "Specialist dietitian, bespoke nutrition advice" },

  // Bike Repair
  { name: "Bike Repair MK", category: "Bike Repair", phone: "07500060016", wa: "07500060016" },

  // Bathroom Specialists
  { name: "Navdeep", category: "Bathroom Specialists", phone: "07413885464", wa: "07413885464" },
  { name: "Paul - Bathroom", category: "Bathroom Specialists", phone: "07816 676231", wa: "07816 676231" },

  // Property Maintenance
  { name: "Abhay Sarotra", category: "Property Maintenance", phone: "+44 7585 630120", wa: "+44 7585 630120" },

  // ── Additional entries to existing categories ───────────────────────────────

  // Gardening & Landscaping
  { name: "Buckingham Landscape", category: "Gardening & Landscaping", phone: "07954323711", wa: "07954323711" },
  { name: "Matt - Gardener", category: "Gardening & Landscaping", phone: "07522637373", wa: "07522637373" },
  { name: "Joe - Gardener", category: "Gardening & Landscaping", phone: "07846345472", wa: "07846345472" },
  { name: "MK Fencing", category: "Gardening & Landscaping", phone: "01908 616112", description: "Fencing, patio and paving in Milton Keynes" },
  { name: "Gary - Gardener", category: "Gardening & Landscaping", phone: "07595053165", wa: "07595053165" },
  { name: "Tame Your Garden", category: "Gardening & Landscaping", phone: "07514 784900", wa: "07514 784900" },
  { name: "Andrea - Gardener", category: "Gardening & Landscaping", phone: "07467536073", wa: "07467536073" },

  // Electricians
  { name: "Sam Punter", category: "Electricians", phone: "07867386608", wa: "07867386608" },
  { name: "Eddie", category: "Electricians", phone: "07742664081", wa: "07742664081" },
  { name: "Gufran", category: "Electricians", phone: "07534244162", wa: "07534244162" },
  { name: "Martin", category: "Electricians", phone: "07854 518150", wa: "07854 518150" },
  { name: "Claudio", category: "Electricians", phone: "07809 829927", wa: "07809 829927" },
  { name: "Richard", category: "Electricians", phone: "07855 771273", wa: "07855 771273" },
  { name: "Jamie Hayes", category: "Electricians", phone: "07534138353", wa: "07534138353" },
  { name: "Dave Sparky", category: "Electricians", phone: "+44 7850 766671", wa: "+44 7850 766671" },

  // Handymen & Maintenance
  { name: "Nyall", category: "Handymen & Maintenance", phone: "07863 127105", wa: "07863 127105" },
  { name: "Gary - Handyman", category: "Handymen & Maintenance", phone: "07766 214044", wa: "07766 214044" },
  { name: "Manu Singh", category: "Handymen & Maintenance", phone: "07413 885464", wa: "07413 885464" },
  { name: "Vinesh", category: "Handymen & Maintenance", phone: "+447762557541", wa: "+447762557541" },
  { name: "Stuart", category: "Handymen & Maintenance", phone: "+447763983844", wa: "+447763983844" },
  { name: "Arshad", category: "Handymen & Maintenance", phone: "+44 7534 266206", wa: "+44 7534 266206" },
  { name: "Romani", category: "Handymen & Maintenance", phone: "+44 7988 032654", wa: "+44 7988 032654" },

  // Plumbers / Heating
  { name: "Ben Brill", category: "Plumbers", phone: "07825 887710", wa: "07825 887710" },
  { name: "Trevor - Plumber", category: "Plumbers", phone: "07942 817699", wa: "07942 817699" },
  { name: "Daniel - Plumber", category: "Plumbers", phone: "07717218607", wa: "07717218607" },
  { name: "Jason - Plumber", category: "Plumbers", phone: "07966199709", wa: "07966199709" },
  { name: "Darren - Plumber", category: "Plumbers", phone: "07979497031", wa: "07979497031" },
  { name: "Carl - Plumber", category: "Plumbers", phone: "07719 111161", wa: "07719 111161" },
  { name: "Vijnes - Plumber", category: "Plumbers", phone: "07581578455", wa: "07581578455" },
  { name: "Keith - Plumber", category: "Plumbers", phone: "07930422421", wa: "07930422421" },
  { name: "Steve - Plumber", category: "Plumbers", phone: "07889166012", wa: "07889166012" },
  { name: "Marek - Plumber", category: "Plumbers", phone: "07442272651", wa: "07442272651" },
  { name: "Azad - Plumber", category: "Plumbers", phone: "07505 018409", wa: "07505 018409" },
  { name: "Colin - Plumber", category: "Plumbers", phone: "07554 128041", wa: "07554 128041" },
  { name: "Gregory Martin", category: "Plumbers", phone: "+44 7896 846866", wa: "+44 7896 846866" },
  { name: "MK Fair Plumber", category: "Plumbers", phone: "+44 7874 363307", wa: "+44 7874 363307" },
  { name: "AGAS Plumbing", category: "Plumbers", phone: "07727722027", wa: "07727722027" },

  // Taxis & Transport
  { name: "MR SHIFTA", category: "Taxis & Transport", phone: "07917 135649", wa: "07917 135649" },
  { name: "Paul Graham - Man & Van", category: "Taxis & Transport", phone: "07958709443", wa: "07958709443" },
  { name: "Andy - Man & Van", category: "Taxis & Transport", phone: "07969 395809", wa: "07969 395809" },
  { name: "Rashid - Man & Van", category: "Taxis & Transport", phone: "07456 666883", wa: "07456 666883" },
  { name: "Callums Removals & Transport", category: "Taxis & Transport", phone: "0800 032 2119" },
  { name: "Paul MK Man and Van", category: "Taxis & Transport", phone: "+44 7462 130119", wa: "+44 7462 130119" },
  { name: "David - Man & Van", category: "Taxis & Transport", phone: "+44 7594 671264", wa: "+44 7594 671264" },

  // Photography
  { name: "Clicks Creative", category: "Photography", phone: "07548864629", wa: "07548864629" },
  { name: "Suraj Garg", category: "Photography", phone: "+44 7810 234312", wa: "+44 7810 234312" },
  { name: "Ashish Bhatt - Picsthatspeak", category: "Photography", phone: "07825986267", wa: "07825986267" },

  // Window Cleaning
  { name: "Middleton Window Cleaning", category: "Window Cleaning", phone: "07894955629", wa: "07894955629" },
  { name: "Windows Pro Clean - Rick", category: "Window Cleaning", phone: "07481 117003", wa: "07481 117003" },
  { name: "Concept Clean", category: "Window Cleaning", phone: "01908 749 563" },
  { name: "Dim2Dazzling", category: "Window Cleaning", phone: "07394068175", wa: "07394068175" },

  // Locksmiths
  { name: "Dave Erington", category: "Locksmiths", phone: "+44 7903 953953", wa: "+44 7903 953953" },
  { name: "Chris - Locksmith", category: "Locksmiths", phone: "+44 7894 301499", wa: "+44 7894 301499" },
  { name: "Neil - Locksmith", category: "Locksmiths", phone: "+44 7912 512380", wa: "+44 7912 512380" },
  { name: "Alan Teales", category: "Locksmiths", phone: "+44 7770 375438" },

  // Driving Instructors
  { name: "Pat - Driving Instructor", category: "Driving Instructors", phone: "+44 7921766662", wa: "+44 7921766662" },
  { name: "Trudo Driving Academy", category: "Driving Instructors", phone: "01908 104096", description: "Driving academy in Milton Keynes" },

  // Childcare & Tutors
  { name: "Jugraty Ravjee - Chemistry", category: "Childcare & Tutors", phone: "07707006770", email: "enquiries@thetuitionsolution.co.uk", description: "GCSE and A-level Chemistry tutor" },
  { name: "Abhay Joshi - Physics", category: "Childcare & Tutors", phone: "+44 7835 347697", wa: "+44 7835 347697", description: "Physics tutor in Milton Keynes" },
  { name: "Elephant Connect", category: "Childcare & Tutors", phone: "+44 7825 683824", wa: "+44 7825 683824" },
  { name: "Someswara Rao Kola", category: "Childcare & Tutors", phone: "+447404118313", wa: "+447404118313" },
  { name: "Vani Mokkapati - PCM Tutor", category: "Childcare & Tutors", phone: "07438823433", email: "parimivani@gmail.com", description: "Physics, Chemistry and Maths tutor" },
  { name: "Mohan - Physics & Maths", category: "Childcare & Tutors", phone: "07894226201", wa: "07894226201" },
  { name: "Ridhima Bhatt - French", category: "Childcare & Tutors", phone: "07785737609", wa: "07785737609", description: "French tutor, Year 3 to GCSE" },
  { name: "Elevenology - Faheem", category: "Childcare & Tutors", email: "enquiries@elevenology.com", description: "11-plus and secondary subjects tuition" },

  // Food & Catering
  { name: "KMS Foods", category: "Food & Catering", phone: "+447403506318", wa: "+447403506318", description: "Tiffin and food delivery service in Milton Keynes" },
  { name: "Sattvic Foods", category: "Food & Catering", phone: "+44 1908 226008", description: "Sattvic and vegetarian food in Milton Keynes" },
  { name: "Curry Corner", category: "Food & Catering", phone: "07745319148", wa: "07745319148", description: "Home-cooked curries and tiffin service" },
  { name: "Biryani in a Box", category: "Food & Catering", phone: "01908 926606", description: "Biryani catering service in Milton Keynes" },
  { name: "Bhargavi - Catering", category: "Food & Catering", phone: "+44 7435 628081", wa: "+44 7435 628081" },
  { name: "Meals by Malik", category: "Food & Catering", phone: "+44 7541 984282", wa: "+44 7541 984282" },
  { name: "Aaha Kitchen", category: "Food & Catering", phone: "07395545945", wa: "07395545945" },
  { name: "Dua's Kitchen", category: "Food & Catering", phone: "+44 7939350407", wa: "+44 7939350407" },

  // Bridal & Henna
  { name: "Asha Mojaria - Henna", category: "Bridal & Henna", phone: "07984807128", wa: "07984807128" },
  { name: "Aditi Lakhani - Henna", category: "Bridal & Henna", phone: "07908277375", wa: "07908277375" },

  // Decorating & Flooring
  { name: "Will - Decorator", category: "Decorating & Flooring", phone: "07545562854", wa: "07545562854" },
  { name: "Frank - Decorator", category: "Decorating & Flooring", phone: "07564044199", wa: "07564044199" },
  { name: "Mayor - Decorator", category: "Decorating & Flooring", phone: "07594 271740", wa: "07594 271740" },
  { name: "Steve Ryan - Decorator", category: "Decorating & Flooring", phone: "07889 166012", wa: "07889 166012" },

  // Travel
  { name: "Smith Travels", category: "Travel", phone: "07853 907846", wa: "07853 907846" },
  { name: "Rahul Gholap - Best Choice Travels", category: "Travel", phone: "07714303106", wa: "07714303106" },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function jsonRes(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { "Content-Type": "application/json" },
  });
}
function htmlRes(html) {
  return new Response(html, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
}
function isAdmin(req, env) {
  return req.headers.get("X-Admin-Password") === env.ADMIN_PASSWORD;
}
// ── Slug helpers ───────────────────────────────────────────────────────────
function slugify(str) {
  return (str || "").toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ").trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
function makeSlug(service, allServices) {
  var base = slugify(service.name);
  var slug = base;
  var i = 2;
  while (allServices.some(function(s) { return s !== service && s.slug === slug; })) {
    slug = base + "-" + i++;
  }
  return slug;
}

async function loadServices(env) {
  var list = await env.SERVICES_KV.get("services", "json");
  var changed = false;

  if (!list) {
    // KV empty — seed fresh
    list = SEED.map(function(s, i) { return Object.assign({}, s, { id: String(i + 1) }); });
    changed = true;
  } else {
    // KV has data — merge any SEED entries not already present (preserves community submissions)
    SEED.forEach(function(seed) {
      var exists = list.some(function(s) {
        return s.name.toLowerCase() === seed.name.toLowerCase() &&
               s.category.toLowerCase() === seed.category.toLowerCase();
      });
      if (!exists) {
        list.push(Object.assign({}, seed, { id: crypto.randomUUID() }));
        changed = true;
      }
    });
  }

  // Auto-assign slugs and catSlugs; always ensure catSlug includes -milton-keynes for SEO
  list.forEach(function(s) {
    if (!s.slug) { s.slug = makeSlug(s, list); changed = true; }
    var expectedCatSlug = slugify(s.category) + "-milton-keynes";
    if (!s.catSlug || !s.catSlug.endsWith("-milton-keynes")) {
      s.catSlug = expectedCatSlug;
      changed = true;
    }
  });

  if (changed) await env.SERVICES_KV.put("services", JSON.stringify(list));
  return list;
}

function esc(s) {
  return String(s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ── Category default descriptions (used when a listing has no description) ──
const CAT_DESC = {
  "Plumbers": "Experienced plumber for boiler repairs, installations, kitchens and bathrooms in Milton Keynes.",
  "Electricians": "Qualified electrician for installations, repairs and safety certificates in Milton Keynes.",
  "Gas Engineers": "Gas Safe registered engineer for boiler servicing, installation and repairs in Milton Keynes.",
  "Handymen & Maintenance": "Reliable handyman for general home maintenance, repairs and installations in MK.",
  "Gardening & Landscaping": "Professional gardener and landscaper serving Milton Keynes and surrounding areas.",
  "Window Cleaning": "Professional window cleaning service covering Milton Keynes and surrounding areas.",
  "Cleaning & Car Valeting": "Reliable cleaning service for homes, offices and vehicles in Milton Keynes.",
  "Decorating & Flooring": "Professional decorator and flooring specialist serving Milton Keynes.",
  "Blinds & Interiors": "Blinds and interior design services for homes in Milton Keynes.",
  "Design Services": "Creative design including branding, web and digital design in Milton Keynes.",
  "Childcare & Tutors": "Qualified tutor and childcare provider in Milton Keynes.",
  "Hair & Beauty": "Professional hair and beauty services in Milton Keynes.",
  "Bridal & Henna": "Professional henna and bridal beauty services in Milton Keynes.",
  "Pet Services": "Trusted pet care, dog walking and daycare services in Milton Keynes.",
  "Food & Catering": "Home-cooked catering and food delivery services in Milton Keynes.",
  "Driving Instructors": "Qualified driving instructor offering lessons in Milton Keynes.",
  "Travel": "Travel agent specialising in flights, holidays and travel packages.",
  "Event Services": "Professional event planning and entertainment services in Milton Keynes.",
  "Taxis & Transport": "Reliable taxi and transport services in Milton Keynes.",
  "Locksmiths": "Professional locksmith for emergency lockouts and security in Milton Keynes.",
  "Health & Fitness": "Health, fitness and physiotherapy services in Milton Keynes.",
  "Financial Services": "Financial advice, accounting and mortgage services in Milton Keynes.",
  "Photography": "Professional photographer for weddings, events and portraits in Milton Keynes.",
  "Classes & Activities": "Classes and activities for all ages in Milton Keynes.",
  "Hire Services": "Tool and equipment hire in Milton Keynes.",
  "Tailoring & Alterations": "Professional tailoring and clothing alterations in Milton Keynes.",
  "Translation & Legal": "Translation, notarisation and legal document services in Milton Keynes.",
  "Accountants": "Qualified accountant for tax returns, bookkeeping and business accounts in Milton Keynes.",
  "Architects": "Qualified architect for residential and commercial projects in Milton Keynes.",
  "Airport Transfers": "Reliable airport pickup and drop-off service from Milton Keynes.",
  "Appliance Repair": "Experienced appliance engineer for washing machines, fridges and white goods in MK.",
  "Carpenters": "Skilled carpenter for bespoke joinery, doors, shelving and woodwork in Milton Keynes.",
  "Carpet & Flooring": "Carpet supply and professional fitting service in Milton Keynes.",
  "Car Garages": "Trusted car garage for servicing, MOT and repairs in Milton Keynes.",
  "Immigration & Legal": "Immigration solicitor for visas, settlement and legal advice in Milton Keynes.",
  "Kitchen Fitting": "Professional kitchen fitter for new kitchens and refurbishments in Milton Keynes.",
  "Mortgage Advisors": "Independent mortgage advisor for home purchase, remortgage and protection in MK.",
  "Pest Control": "Professional pest control for homes and businesses in Milton Keynes.",
  "PC & Tech Repair": "PC hardware repair and IT support services in Milton Keynes.",
  "Structural Engineers": "Chartered structural engineer for residential and commercial projects in MK.",
  "Skip Hire": "Skip hire for waste removal in Milton Keynes and surrounding areas.",
  "Tiling": "Professional tiler for bathrooms, kitchens and floors in Milton Keynes.",
  "Priests": "Hindu priest for religious ceremonies, pujas and events in Milton Keynes.",
  "Will Writing": "Professional will writing and estate planning services in Milton Keynes.",
  "Health & Wellbeing": "Holistic health, massage and wellbeing services in Milton Keynes.",
  "Bike Repair": "Bicycle repair and servicing in Milton Keynes.",
  "Bathroom Specialists": "Bathroom design, supply and installation in Milton Keynes.",
  "Property Maintenance": "Professional property maintenance and repairs in Milton Keynes.",
};
function getDesc(s) { return s.description || CAT_DESC[s.category] || (s.category + " service in Milton Keynes."); }

// ── WhatsApp helper ────────────────────────────────────────────────────────
function formatWA(num) {
  if (!num) return "";
  var n = String(num).replace(/[\s\-\+\(\)]/g, "");
  if (n.startsWith("07") && n.length === 11) return "44" + n.slice(1);
  if (n.startsWith("447")) return n;
  return "";  // don't generate WA link for landlines
}

// ── Page CSS (shared across service + category pages) ──────────────────────
const PAGE_CSS = ':root{--g:#2d6a4f;--gl:#40916c;--gp:#d8f3dc;--gc:#ecfdf5;--gcb:#6ee7b7;--t:#111827;--m:#6b7280;--b:#e5e7eb}'
  +'*{box-sizing:border-box;margin:0;padding:0}'
  +'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f3f4f6;color:var(--t);min-height:100vh}'
  +'header{background:linear-gradient(135deg,#1b4332,#2d6a4f);color:#fff;padding:14px 16px}'
  +'.hinner{display:flex;align-items:center;gap:8px;flex-wrap:wrap}'
  +'.hinner a{color:rgba(255,255,255,.75);text-decoration:none;font-size:.85rem}'
  +'.hinner a:hover{color:#fff}'
  +'.hinner .sep{color:rgba(255,255,255,.4);font-size:.75rem}'
  +'.page{max-width:580px;margin:0 auto;padding:20px 14px 72px}'
  +'.card{background:#fff;border-radius:14px;border:1px solid var(--b);border-left:4px solid var(--g);padding:20px;margin-bottom:12px}'
  +'.badge{display:inline-block;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--g);background:var(--gp);padding:3px 9px;border-radius:4px;margin-bottom:10px;text-decoration:none}'
  +'h1{font-size:1.45rem;font-weight:800;line-height:1.2;margin-bottom:8px}'
  +'h2{font-size:1.1rem;font-weight:700;margin-bottom:4px}'
  +'.desc{font-size:.88rem;color:var(--m);line-height:1.5;margin-bottom:14px}'
  +'.actions{display:flex;flex-direction:column;gap:8px;margin-top:10px}'
  +'.btn-call{display:flex;align-items:center;gap:10px;background:var(--gc);color:#065f46;border:1.5px solid var(--gcb);padding:13px 16px;border-radius:10px;font-size:.95rem;font-weight:700;text-decoration:none}'
  +'.btn-link{display:flex;align-items:center;gap:8px;background:#f9fafb;color:var(--m);border:1.5px solid var(--b);padding:10px 14px;border-radius:10px;font-size:.85rem;text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
  +'.btn-wa{display:flex;align-items:center;gap:10px;background:#e7fce8;color:#128c2e;border:1.5px solid #86e58a;padding:13px 16px;border-radius:10px;font-size:.95rem;font-weight:700;text-decoration:none}'
  +'.meta{margin-top:12px;font-size:.78rem;color:var(--m)}'
  +'.view-link{display:inline-block;margin-top:8px;font-size:.82rem;color:var(--g);text-decoration:none;font-weight:500}'
  +'footer{text-align:center;padding:28px 16px 20px;font-size:.75rem;color:var(--m)}'
  +'footer a{color:var(--g);text-decoration:none;font-weight:600}';

// ── Individual service page ────────────────────────────────────────────────
function servicePageHTML(s) {
  var catSlug = s.catSlug || (slugify(s.category) + "-milton-keynes");
  var canonical = "https://whitehousemk.uk/services/" + catSlug + "/" + s.slug;
  var title = esc(s.name) + " — " + esc(s.category) + " in Whitehouse, Milton Keynes";
  var desc = s.description
    ? esc(s.name) + " offers " + esc(s.description) + " in Whitehouse, Milton Keynes."
    : esc(s.name) + " — " + esc(s.category) + " in Whitehouse, Milton Keynes.";
  if (s.phone) desc += " Call " + s.phone + ".";

  var schema = { "@context":"https://schema.org","@type":"LocalBusiness",
    "name":s.name,"description":s.description||(s.category+" in Whitehouse, Milton Keynes"),
    "areaServed":"Whitehouse, Milton Keynes",
    "address":{"@type":"PostalAddress","addressLocality":"Whitehouse","addressRegion":"Milton Keynes","postalCode":"MK8","addressCountry":"GB"}
  };
  if (s.phone)   schema.telephone = s.phone;
  if (s.email)   schema.email     = s.email;
  if (s.website) schema.url       = s.website;

  var displayDesc = getDesc(s);
  var contacts = "";
  if (s.phone) {
    contacts += '<a class="btn-call" href="tel:'+s.phone.replace(/\s/g,"")+'">&#128222; Call: '+s.phone+'</a>';
    var wa = s.wa ? formatWA(s.wa) : formatWA(s.phone);
    if (wa) contacts += '<a class="btn-wa" href="https://wa.me/'+wa+'" target="_blank">&#128172; WhatsApp</a>';
  }
  if (s.email)   contacts += '<a class="btn-link" href="mailto:'+s.email+'">&#9993; '+s.email+'</a>';
  if (s.website) contacts += '<a class="btn-link" href="'+s.website+'" target="_blank" rel="noopener">&#127760; '+s.website.replace(/^https?:\/\/(www\.)?/,"").replace(/\/$/,"")+'</a>';

  return '<!DOCTYPE html><html lang="en"><head>'
    +'<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>'
    +'<title>'+title+'</title>'
    +'<meta name="description" content="'+esc(displayDesc)+'"/>'
    +'<meta name="robots" content="index,follow"/>'
    +'<link rel="canonical" href="'+canonical+'"/>'
    +'<meta property="og:title" content="'+esc(s.name)+' — '+esc(s.category)+' | Whitehouse MK"/>'
    +'<meta property="og:description" content="'+esc(displayDesc)+'"/>'
    +'<meta property="og:url" content="'+canonical+'"/>'
    +'<meta property="og:type" content="website"/>'
    +'<script type="application/ld+json">'+JSON.stringify(schema)+'<\/script>'
    +'<style>'+PAGE_CSS+'</style></head><body>'
    +'<header><div class="hinner">'
    +'<a href="/">Directory</a><span class="sep">›</span>'
    +'<a href="/services/'+catSlug+'">'+esc(s.category)+'</a><span class="sep">›</span>'
    +'<span style="color:#fff;font-size:.85rem">'+esc(s.name)+'</span>'
    +'</div></header>'
    +'<div class="page"><div class="card">'
    +'<a class="badge" href="/services/'+catSlug+'">'+esc(s.category)+'</a>'
    +'<h1>'+esc(s.name)+'</h1>'
    +'<p class="desc">'+esc(displayDesc)+'</p>'
    +(contacts?'<div class="actions">'+contacts+'</div>':'')
    +'<p class="meta">&#128205; Milton Keynes</p>'
    +'</div></div>'
    +'<footer>Listed on <a href="/">whitehousemk.uk</a> &mdash; Whitehouse Community Services Directory</footer>'
    +'</body></html>';
}

// ── Category page ──────────────────────────────────────────────────────────
function categoryPageHTML(catName, services) {
  var catSlug = slugify(catName) + "-milton-keynes";
  var canonical = "https://whitehousemk.uk/services/" + catSlug;
  var title = esc(catName) + " in Milton Keynes | Local " + esc(catName) + " Whitehouse Milton Keynes";
  var top3 = services.slice(0,3).map(function(s){return s.name;}).join(", ");
  var names5 = services.slice(0,5).map(function(s){return s.name;}).join(", ");
  var catLower = catName.toLowerCase();
  var desc = "Looking for " + catLower + " in Milton Keynes? Find " + services.length + " trusted local " + catLower + " in Whitehouse MK, recommended by residents. Including: " + names5 + ".";

  // FAQ content — auto-generated per category
  var faqs = [
    { q: "Who are the best " + catLower + " in Milton Keynes?",
      a: "Whitehouse MK Directory lists " + services.length + " trusted " + catLower + " in Milton Keynes including " + top3 + " and more — all recommended by local Whitehouse residents. You can call or WhatsApp them directly from each listing." },
    { q: "How do I find a reliable " + catName.replace(/s$/,"").toLowerCase() + " in Whitehouse MK?",
      a: "Browse the listings above and tap the phone number to call directly, or use the WhatsApp button for a quick message. All listings have been shared and recommended by residents in the Whitehouse community in Milton Keynes." },
    { q: "Are these " + catLower + " based in Milton Keynes?",
      a: "Yes — all listings on Whitehouse MK Directory serve the Whitehouse area and wider Milton Keynes. They have been personally recommended by residents in the local Whitehouse community." },
    { q: "How do I add my " + catName.replace(/s$/,"").toLowerCase() + " business to this directory?",
      a: "Tap the '+ Add your service' button at the bottom of the page, fill in your details and enter the community code shared in the Whitehouse residents group. Your listing goes live instantly and is free." }
  ];

  // Schemas
  var itemListSchema = {"@context":"https://schema.org","@type":"ItemList",
    "name":catName+" in Whitehouse MK","description":desc,"url":canonical,
    "itemListElement": services.map(function(s,i){
      return {"@type":"ListItem","position":i+1,"name":s.name,"url":"https://whitehousemk.uk/services/"+catSlug+"/"+(s.slug||slugify(s.name))};
    })
  };
  var faqSchema = {"@context":"https://schema.org","@type":"FAQPage",
    "mainEntity": faqs.map(function(f){
      return {"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}};
    })
  };
  var breadcrumbSchema = {"@context":"https://schema.org","@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"Whitehouse MK Directory","item":"https://whitehousemk.uk"},
      {"@type":"ListItem","position":2,"name":catName+" in Milton Keynes","item":canonical}
    ]
  };

  // Cards HTML
  var cards = services.map(function(s){
    var d = getDesc(s);
    var contacts = "";
    if (s.phone) {
      contacts += '<a class="btn-call" href="tel:'+s.phone.replace(/\s/g,"")+'">&#128222; '+s.phone+'</a>';
      var wa = s.wa ? formatWA(s.wa) : formatWA(s.phone);
      if (wa) contacts += '<a class="btn-wa" href="https://wa.me/'+wa+'" target="_blank">&#128172; WhatsApp</a>';
    }
    if (s.email)   contacts += '<a class="btn-link" href="mailto:'+s.email+'">&#9993; '+s.email+'</a>';
    if (s.website) contacts += '<a class="btn-link" href="'+s.website+'" target="_blank" rel="noopener">&#127760; '+s.website.replace(/^https?:\/\/(www\.)?/,"").replace(/\/$/,"")+'</a>';
    return '<div class="card">'
      +'<h2>'+esc(s.name)+'</h2>'
      +'<p class="desc">'+esc(d)+'</p>'
      +(contacts?'<div class="actions">'+contacts+'</div>':'')
      +'<a class="view-link" href="/services/'+catSlug+'/'+(s.slug||slugify(s.name))+'">View full listing ›</a>'
      +'</div>';
  }).join("");

  // FAQ accordion HTML
  var faqHTML = '<div class="faq-section"><h2>Frequently asked questions</h2>'
    + faqs.map(function(f, i){
      return '<div class="faq-item'+(i===0?' open':'')+'"><button class="faq-q" onclick="toggleFaq(this)">'
        +esc(f.q)+'<span class="farrow">&#9660;</span></button>'
        +'<div class="faq-a">'+esc(f.a)+'</div></div>';
    }).join("")
    +'</div>';

  return '<!DOCTYPE html><html lang="en"><head>'
    +'<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>'
    +'<title>'+title+'</title>'
    +'<meta name="description" content="'+esc(desc)+'"/>'
    +'<meta name="robots" content="index,follow"/>'
    +'<link rel="canonical" href="'+canonical+'"/>'
    +'<meta property="og:title" content="'+esc(catName)+' in Milton Keynes | Whitehouse MK"/>'
    +'<meta property="og:description" content="'+esc(desc)+'"/>'
    +'<meta property="og:url" content="'+canonical+'"/>'
    +'<script type="application/ld+json">'+JSON.stringify(itemListSchema)+'<\/script>'
    +'<script type="application/ld+json">'+JSON.stringify(faqSchema)+'<\/script>'
    +'<script type="application/ld+json">'+JSON.stringify(breadcrumbSchema)+'<\/script>'
    +'<style>'+PAGE_CSS
    +'.intro{background:#f0fdf4;border:1px solid #bbf7d0;border-left:4px solid var(--g);border-radius:10px;padding:14px 16px;margin-bottom:18px;font-size:.9rem;line-height:1.6;color:var(--t)}'
    +'.intro strong{color:var(--g)}'
    +'.count{font-size:.82rem;color:var(--m);margin-bottom:14px}'
    +'h1{margin-bottom:6px}'
    +'.faq-section{margin-top:28px;padding-bottom:8px}'
    +'.faq-section h2{font-size:1.05rem;font-weight:800;margin-bottom:14px;color:var(--t)}'
    +'.faq-item{background:#fff;border-radius:10px;border:1px solid var(--b);margin-bottom:8px;overflow:hidden}'
    +'.faq-q{width:100%;text-align:left;padding:14px 16px;background:none;border:none;font-size:.9rem;font-weight:600;color:var(--t);cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-family:inherit;gap:12px;-webkit-tap-highlight-color:transparent}'
    +'.farrow{font-size:.7rem;color:var(--m);flex-shrink:0;transition:transform .2s}'
    +'.faq-item.open .farrow{transform:rotate(180deg)}'
    +'.faq-a{display:none;padding:0 16px 14px;font-size:.87rem;color:var(--m);line-height:1.6;border-top:1px solid var(--b);padding-top:12px}'
    +'.faq-item.open .faq-a{display:block}'
    +'</style></head><body>'
    +'<header><div class="hinner">'
    +'<a href="/">Directory</a><span class="sep">›</span>'
    +'<span style="color:#fff;font-size:.85rem">'+esc(catName)+'</span>'
    +'</div></header>'
    +'<div class="page">'
    +'<h1>'+esc(catName)+' in Milton Keynes</h1>'
    +'<p class="count">'+services.length+' local listing'+(services.length!==1?'s':'')+' &middot; Whitehouse, Milton Keynes &middot; Recommended by residents</p>'
    +'<div class="intro">Looking for <strong>'+esc(catLower)+' in Milton Keynes</strong>? Whitehouse MK Directory has <strong>'+services.length+' trusted local '+esc(catLower)+'</strong> including '+esc(top3)+' and more &mdash; all recommended by Whitehouse residents. Call or WhatsApp directly from each listing.</div>'
    +cards
    +faqHTML
    +'</div>'
    +'<footer>Listed on <a href="/">whitehousemk.uk</a> &mdash; <a href="/about">About this directory</a></footer>'
    +'<script>function toggleFaq(btn){var item=btn.closest(".faq-item");item.classList.toggle("open");}<\/script>'
    +'</body></html>';
}

// ── About page (helps AI engines understand who curates this) ────────────────
function aboutPageHTML() {
  var schema = [
    {"@context":"https://schema.org","@type":"WebSite","name":"Whitehouse MK Directory",
      "url":"https://whitehousemk.uk","description":"A community-curated directory of trusted local services in Whitehouse, Milton Keynes."},
    {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
      {"@type":"ListItem","position":1,"name":"Whitehouse MK Directory","item":"https://whitehousemk.uk"},
      {"@type":"ListItem","position":2,"name":"About","item":"https://whitehousemk.uk/about"}
    ]}
  ];
  return '<!DOCTYPE html><html lang="en"><head>'
    +'<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>'
    +'<title>About Whitehouse MK Directory | Local Services Milton Keynes</title>'
    +'<meta name="description" content="Whitehouse MK Directory is a free, community-curated list of trusted local tradespeople and services in Whitehouse, Milton Keynes. All listings recommended by residents."/>'
    +'<meta name="robots" content="index,follow"/>'
    +'<link rel="canonical" href="https://whitehousemk.uk/about"/>'
    +'<script type="application/ld+json">'+JSON.stringify(schema[0])+'<\/script>'
    +'<script type="application/ld+json">'+JSON.stringify(schema[1])+'<\/script>'
    +'<style>'+PAGE_CSS
    +'.about{max-width:600px;margin:0 auto;padding:24px 16px 60px}'
    +'.about h1{font-size:1.4rem;font-weight:800;margin-bottom:8px}'
    +'.about h2{font-size:1rem;font-weight:700;margin:24px 0 8px;color:var(--g)}'
    +'.about p{font-size:.92rem;line-height:1.65;color:var(--t);margin-bottom:12px}'
    +'.about ul{padding-left:20px;margin-bottom:12px}'
    +'.about li{font-size:.92rem;line-height:1.65;color:var(--t);margin-bottom:4px}'
    +'.about a{color:var(--g);font-weight:600}'
    +'.tag{display:inline-block;background:var(--gp);color:var(--g);padding:3px 10px;border-radius:99px;font-size:.78rem;font-weight:600;margin-bottom:16px}'
    +'</style></head><body>'
    +'<header><div class="hinner">'
    +'<a href="/">Directory</a><span class="sep">›</span>'
    +'<span style="color:#fff;font-size:.85rem">About</span>'
    +'</div></header>'
    +'<div class="about">'
    +'<span class="tag">&#127968; Whitehouse, Milton Keynes</span>'
    +'<h1>About Whitehouse MK Directory</h1>'
    +'<p>Whitehouse MK Directory is a <strong>free, community-curated directory</strong> of trusted local tradespeople and services serving Whitehouse and the wider Milton Keynes area.</p>'
    +'<p>Every listing has been personally recommended and shared by residents in the Whitehouse community — not paid advertisements, just genuine neighbour-to-neighbour recommendations.</p>'
    +'<h2>What we cover</h2>'
    +'<p>The directory covers <strong>48 service categories</strong> including plumbers, electricians, gas engineers, accountants, tutors, caterers, architects and more — all local to Milton Keynes.</p>'
    +'<h2>How listings are added</h2>'
    +'<ul>'
    +'<li>Original listings were compiled from the Whitehouse residents WhatsApp and Facebook groups</li>'
    +'<li>Residents can <a href="/submit">add new listings</a> using the community code shared in the group</li>'
    +'<li>The directory admin can edit or remove listings at any time</li>'
    +'</ul>'
    +'<h2>Coverage area</h2>'
    +'<p>Listings serve <strong>Whitehouse, Fairfields, Crownhill, Oxley Park, Shenley, Great Holm</strong> and the wider Milton Keynes area (MK postcodes).</p>'
    +'<h2>Is it free?</h2>'
    +'<p>Yes — completely free for residents to use and for local businesses to be listed. There are no paid placements or featured listings. Every listing appears on equal footing.</p>'
    +'<h2>Contact &amp; updates</h2>'
    +'<p>To add your service, visit the <a href="/submit">Add your service</a> page. To report an incorrect listing, use the community WhatsApp group.</p>'
    +'<p style="margin-top:24px"><a href="/" style="background:var(--g);color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:.95rem">Browse all services</a></p>'
    +'</div>'
    +'<footer style="text-align:center;padding:24px 16px;font-size:.75rem;color:var(--m)">whitehousemk.uk &mdash; Whitehouse Community Services Directory, Milton Keynes</footer>'
    +'</body></html>';
}

// ── Sitemap ────────────────────────────────────────────────────────────────
async function sitemapXML(env) {
  var services = await loadServices(env);
  var cats = [...new Set(services.map(function(s){return s.category}))];
  var catUrls = cats.map(function(c){
    return '<url><loc>https://whitehousemk.uk/services/'+slugify(c)+'-milton-keynes</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>';
  }).join("");
  var svcUrls = services.map(function(s){
    var cs = s.catSlug || (slugify(s.category) + "-milton-keynes");
    return '<url><loc>https://whitehousemk.uk/services/'+cs+'/'+s.slug+'</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>';
  }).join("");
  var xml = '<?xml version="1.0" encoding="UTF-8"?>'
    +'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    +'<url><loc>https://whitehousemk.uk/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>'
    +'<url><loc>https://whitehousemk.uk/about</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>'
    +catUrls+svcUrls
    +'</urlset>';
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}

// ── API handlers ───────────────────────────────────────────────────────────
async function apiGetAll(env) {
  return jsonRes(await loadServices(env));
}

// Community submit — requires COMMUNITY_CODE, not admin password
async function apiSubmit(req, env) {
  var body = await req.json();
  if (!body.code || body.code.trim().toLowerCase() !== (env.COMMUNITY_CODE || "").trim().toLowerCase()) {
    return jsonRes({ error: "Invalid community code" }, 403);
  }
  if (!body.name || !body.category) {
    return jsonRes({ error: "Name and category are required" }, 400);
  }
  var list = await loadServices(env);
  var item = {
    id: crypto.randomUUID(),
    name: body.name,
    category: body.category,
    phone: body.phone || undefined,
    wa: body.wa || undefined,
    email: body.email || undefined,
    website: body.website || undefined,
    description: body.description || undefined,
  };
  list.push(item);
  await env.SERVICES_KV.put("services", JSON.stringify(list));
  return jsonRes(item, 201);
}

// Admin CRUD
async function apiAdminAdd(req, env) {
  if (!isAdmin(req, env)) return jsonRes({ error: "Unauthorized" }, 401);
  var b = await req.json();
  if (!b.name || !b.category) return jsonRes({ error: "name and category required" }, 400);
  var list = await loadServices(env);
  var item = Object.assign({}, b, { id: crypto.randomUUID() });
  list.push(item);
  await env.SERVICES_KV.put("services", JSON.stringify(list));
  return jsonRes(item, 201);
}
async function apiAdminUpdate(req, env, id) {
  if (!isAdmin(req, env)) return jsonRes({ error: "Unauthorized" }, 401);
  var b = await req.json();
  var list = await loadServices(env);
  var idx = list.findIndex(function (s) { return s.id === id; });
  if (idx === -1) return jsonRes({ error: "Not found" }, 404);
  list[idx] = Object.assign({}, b, { id: id });
  await env.SERVICES_KV.put("services", JSON.stringify(list));
  return jsonRes(list[idx]);
}
async function apiAdminDelete(req, env, id) {
  if (!isAdmin(req, env)) return jsonRes({ error: "Unauthorized" }, 401);
  var list = await loadServices(env);
  var next = list.filter(function (s) { return s.id !== id; });
  if (next.length === list.length) return jsonRes({ error: "Not found" }, 404);
  await env.SERVICES_KV.put("services", JSON.stringify(next));
  return new Response(null, { status: 204 });
}

// ── Content moderation ─────────────────────────────────────────────────────
const BLOCKLIST = [
  "escort","prostitut","sex work","onlyfans","cam girl","camgirl","adult service",
  "buy weed","sell weed","weed delivery","buy coke","buy cocaine","cocaine for sale",
  "drug deal","mdma","heroin","mephedron","buy pills",
  "buy gun","sell gun","buy firearm","sell knife","illegal weapon","buy ammo",
  "child porn","csam","cp for sale","lolita",
  "scam","pyramid scheme","mlm job","earn £500 from home","make money fast"
];

async function moderateContent(text, env) {
  var lower = text.toLowerCase();
  if (BLOCKLIST.some(function(w){ return lower.includes(w); }))
    return { flagged: true };
  if (!env.OPENAI_API_KEY) return { flagged: false };
  try {
    var r = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + env.OPENAI_API_KEY },
      body: JSON.stringify({ input: text })
    });
    if (!r.ok) return { flagged: false };
    var d = await r.json();
    return { flagged: !!(d.results && d.results[0] && d.results[0].flagged) };
  } catch(e) { return { flagged: false }; }
}

// ── Projects Board API ─────────────────────────────────────────────────────
const PROJECTS_KV_KEY = "projects_v1";

async function loadProjects(env) {
  return (await env.SERVICES_KV.get(PROJECTS_KV_KEY, "json")) || [];
}
async function saveProjects(env, list) {
  await env.SERVICES_KV.put(PROJECTS_KV_KEY, JSON.stringify(list));
}

async function apiGetProjects(req, env) {
  var list = await loadProjects(env);
  var open = list.filter(function(p){ return p.status !== "closed"; });
  return jsonRes(open.map(function(p){
    return { id:p.id, title:p.title, category:p.category, description:p.description,
      budget:p.budget, timeline:p.timeline, contactName:p.contactName,
      contactPhone:p.contactPhone, contactEmail:p.contactEmail,
      status:p.status, createdAt:p.createdAt,
      responseCount:(p.responses||[]).length };
  }));
}

async function apiCreateProject(req, env) {
  var body = await req.json();
  if (!body.title || !body.category)
    return jsonRes({ error: "Title and category are required" }, 400);
  var mod = await moderateContent(body.title + " " + (body.description||""), env);
  if (mod.flagged)
    return jsonRes({ error: "Content not allowed — please keep posts relevant to legitimate jobs and services." }, 422);
  var list = await loadProjects(env);
  var project = {
    id: crypto.randomUUID(),
    title: body.title.trim(),
    category: body.category,
    description: (body.description||"").trim(),
    budget: body.budget || "Not specified",
    timeline: body.timeline || "Flexible",
    contactName: (body.contactName||"").trim(),
    contactPhone: (body.contactPhone||"").trim(),
    contactEmail: (body.contactEmail||"").trim(),
    status: "open",
    createdAt: new Date().toISOString(),
    responses: [],
  };
  list.unshift(project);
  await saveProjects(env, list);
  var out = Object.assign({}, project); delete out.responses;
  return jsonRes(out, 201);
}

async function apiRespondToProject(req, env, id) {
  var body = await req.json();
  if (!body.type || !["bid","suggestion"].includes(body.type))
    return jsonRes({ error: "type must be bid or suggestion" }, 400);
  if (!body.name) return jsonRes({ error: "Name is required" }, 400);
  var mod = await moderateContent(body.name + " " + (body.note||""), env);
  if (mod.flagged)
    return jsonRes({ error: "Content not allowed — please keep responses relevant and respectful." }, 422);
  var list = await loadProjects(env);
  var idx = list.findIndex(function(p){ return p.id === id; });
  if (idx === -1) return jsonRes({ error: "Project not found" }, 404);
  if (list[idx].status === "closed") return jsonRes({ error: "This project is closed" }, 410);
  if (!list[idx].responses) list[idx].responses = [];
  list[idx].responses.push({ id:crypto.randomUUID(), type:body.type, name:body.name.trim(),
    phone:(body.phone||"").trim(), note:(body.note||"").trim(), createdAt:new Date().toISOString() });
  await saveProjects(env, list);
  return jsonRes({ ok:true, responseCount:list[idx].responses.length }, 201);
}

async function apiAdminGetProjects(req, env) {
  if (!isAdmin(req, env)) return jsonRes({ error: "Unauthorized" }, 401);
  return jsonRes(await loadProjects(env));
}

async function apiAdminCloseProject(req, env, id) {
  if (!isAdmin(req, env)) return jsonRes({ error: "Unauthorized" }, 401);
  var list = await loadProjects(env);
  var idx = list.findIndex(function(p){ return p.id === id; });
  if (idx === -1) return jsonRes({ error: "Not found" }, 404);
  list[idx].status = "closed";
  await saveProjects(env, list);
  return jsonRes({ ok:true });
}

async function apiReportProject(req, env, id) {
  var list = await loadProjects(env);
  var idx = list.findIndex(function(p){ return p.id === id; });
  if (idx === -1) return jsonRes({ error: "Not found" }, 404);
  if (list[idx].status === "closed") return jsonRes({ ok:true });
  list[idx].reportCount = (list[idx].reportCount || 0) + 1;
  list[idx].reported = true;
  await saveProjects(env, list);
  return jsonRes({ ok:true });
}

// ── Shared CSS variables (used across all pages) ───────────────────────────
const CSS_VARS = `
  :root{--g:#2d6a4f;--gl:#40916c;--gp:#d8f3dc;--gc:#ecfdf5;--gcb:#6ee7b7;--t:#111827;--m:#6b7280;--b:#e5e7eb;--bg:#f3f4f6}
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--t);min-height:100vh}
  .btn{display:inline-block;padding:12px 20px;border-radius:10px;border:none;font-size:1rem;font-weight:600;cursor:pointer;text-decoration:none;text-align:center;transition:all .15s;-webkit-tap-highlight-color:transparent}
  .btn-green{background:var(--g);color:#fff}
  .btn-green:active{background:var(--gl)}
  .btn-outline{background:#fff;color:var(--g);border:1.5px solid var(--g)}
`;

// ── Public directory page ──────────────────────────────────────────────────
const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Whitehouse Community Services Directory | Milton Keynes</title>
<meta name="description" content="Find trusted local tradespeople, tutors, cleaners, caterers and more in Whitehouse, Milton Keynes. Recommended by your neighbours."/>
<meta name="robots" content="index,follow"/>
<link rel="canonical" href="https://whitehousemk.uk/"/>
<meta property="og:title" content="Whitehouse Community Services | Milton Keynes"/>
<meta property="og:description" content="Find trusted local services in Whitehouse, MK — recommended by your neighbours."/>
<meta property="og:url" content="https://whitehousemk.uk/"/>
<meta property="og:type" content="website"/>
<style>
${CSS_VARS}
header{background:linear-gradient(135deg,#1b4332 0%,#2d6a4f 100%);color:#fff;padding:20px 16px 18px;text-align:center}
header h1{font-size:1.45rem;font-weight:800;letter-spacing:-.02em;line-height:1.2}
header p{margin-top:4px;font-size:.82rem;opacity:.8}
.sb{background:var(--gl);padding:10px 14px;position:sticky;top:0;z-index:20;box-shadow:0 2px 8px rgba(0,0,0,.15)}
.sb input{width:100%;max-width:640px;display:block;margin:0 auto;padding:11px 16px 11px 40px;border:none;border-radius:10px;font-size:.95rem;outline:none;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%239ca3af' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.156a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z'/%3E%3C/svg%3E") no-repeat 13px center}
/* Filter bar */
.fbar{display:flex;align-items:center;gap:10px;padding:10px 14px;background:#fff;border-bottom:1px solid var(--b)}
.csel{flex:1;display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:10px;border:1.5px solid var(--b);background:#fff;font-size:.9rem;font-weight:500;cursor:pointer;color:var(--t);-webkit-tap-highlight-color:transparent;text-align:left;gap:8px}
.csel.on{border-color:var(--g);color:var(--g);background:var(--gp)}
.csel .arr{font-size:.7rem;opacity:.5;flex-shrink:0}
.ri{font-size:.78rem;color:var(--m);font-weight:500;white-space:nowrap}
/* Bottom sheet */
.sov{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:100;display:flex;align-items:flex-end;opacity:0;pointer-events:none;transition:opacity .2s}
.sov.open{opacity:1;pointer-events:all}
.sheet{background:#fff;border-radius:20px 20px 0 0;width:100%;max-height:78vh;overflow-y:auto;transform:translateY(100%);transition:transform .3s cubic-bezier(.32,.72,0,1)}
.sov.open .sheet{transform:translateY(0)}
.shd{display:flex;align-items:center;justify-content:space-between;padding:16px 16px 12px;border-bottom:1px solid var(--b);position:sticky;top:0;background:#fff;z-index:1}
.shd strong{font-size:1rem}
.shcl{background:none;border:none;font-size:1.3rem;cursor:pointer;color:var(--m);line-height:1;padding:4px 6px;-webkit-tap-highlight-color:transparent}
.call-btn{display:block;margin:12px 14px 8px;padding:13px;border-radius:10px;border:1.5px solid var(--b);text-align:center;font-size:.9rem;font-weight:600;cursor:pointer;background:#fff;color:var(--t);-webkit-tap-highlight-color:transparent;width:calc(100% - 28px)}
.call-btn.on{background:var(--g);color:#fff;border-color:var(--g)}
.cgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:4px 14px 32px}
.citem{padding:13px 8px;border-radius:10px;border:1.5px solid var(--b);text-align:center;font-size:.82rem;font-weight:500;cursor:pointer;background:#fff;color:var(--t);line-height:1.3;-webkit-tap-highlight-color:transparent}
.citem.on{background:var(--g);color:#fff;border-color:var(--g)}
.grid{display:flex;flex-direction:column;gap:10px;padding:6px 12px 100px;max-width:680px;margin:0 auto}
@media(min-width:600px){.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));max-width:960px;padding:12px 20px 80px}}
.card{background:#fff;border:1px solid var(--b);border-left:3px solid var(--g);border-radius:12px;padding:14px 14px 12px;display:flex;flex-direction:column;gap:5px}
.cat{display:inline-block;font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--g);background:var(--gp);padding:2px 7px;border-radius:4px}
.nm{font-size:1.05rem;font-weight:700;line-height:1.25;color:var(--t);text-decoration:none;display:block}
.nm:hover{color:var(--g)}
.ds{font-size:.82rem;color:var(--m);line-height:1.45}
.acts{display:flex;flex-wrap:wrap;gap:7px;margin-top:6px}
.bc{display:inline-flex;align-items:center;gap:6px;background:var(--gc);color:#065f46;border:1px solid var(--gcb);padding:8px 14px;border-radius:8px;font-size:.88rem;font-weight:600;text-decoration:none}
.bc:active{background:#d1fae5}
.bw{display:inline-flex;align-items:center;gap:6px;background:#e7fce8;color:#128c2e;border:1px solid #86e58a;padding:8px 14px;border-radius:8px;font-size:.88rem;font-weight:600;text-decoration:none}
.bw:active{background:#c8f5ca}
.bl{display:inline-flex;align-items:center;gap:5px;background:#f9fafb;color:var(--m);border:1px solid var(--b);padding:8px 12px;border-radius:8px;font-size:.82rem;text-decoration:none;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sm{text-align:center;padding:60px 20px;color:var(--m)}
.sm p:first-child{font-size:2rem;margin-bottom:8px}
/* Floating add button */
.fab{position:fixed;bottom:24px;right:20px;z-index:50;display:flex;align-items:center;gap:8px;background:var(--g);color:#fff;padding:13px 20px;border-radius:999px;font-size:.92rem;font-weight:700;text-decoration:none;box-shadow:0 4px 16px rgba(45,106,79,.45);-webkit-tap-highlight-color:transparent}
.fab:active{background:#1b4332}
footer{text-align:center;font-size:.72rem;color:var(--m);padding:16px 20px 28px;border-top:1px solid var(--b)}
</style>
</head>
<body>
<header>
  <h1>Whitehouse Community Services</h1>
  <p>Milton Keynes &middot; Local trades and services recommended by your neighbours</p>
</header>
<div class="sb"><input type="search" id="s" placeholder="Search by name, service, or keyword..." autocomplete="off"/></div>
<div class="fbar">
  <button class="csel" id="csel"><span id="clbl">All Categories</span><span class="arr">&#9660;</span></button>
  <span class="ri" id="ri"></span>
</div>
<div class="sov" id="sov">
  <div class="sheet">
    <div class="shd"><strong>Browse by category</strong><button class="shcl" id="shcl">&#10005;</button></div>
    <button class="call-btn" id="call-btn-all">All Categories</button>
    <div class="cgrid" id="cgrid"></div>
  </div>
</div>
<a href="/projects" style="display:flex;align-items:center;justify-content:space-between;background:#f5f3ff;border:1.5px solid #ddd6fe;border-radius:12px;padding:13px 16px;margin:10px 12px 2px;max-width:680px;margin-left:auto;margin-right:auto;text-decoration:none;-webkit-tap-highlight-color:transparent">
  <div>
    <div style="font-size:.88rem;font-weight:700;color:#6d28d9">📋 Jobs Board</div>
    <div style="font-size:.78rem;color:#7c3aed;margin-top:2px">Post a job · Get bids from local trades</div>
  </div>
  <span style="color:#a78bfa;font-size:1.1rem">→</span>
</a>
<div class="grid" id="g"></div>
<a class="fab" href="/submit">+ Add your service</a>
<footer>Whitehouse Community Directory &middot; Last updated April 2026</footer>
<script>
var ALL="All",data=[],state={q:"",cat:ALL};
function norm(s){return(s||"").toLowerCase()}
function slugify(s){return(s||"").toLowerCase().replace(/[^a-z0-9\s]/g," ").trim().replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"")}
var CAT_DESC={"Plumbers":"Experienced plumber for boiler repairs, installations, kitchens and bathrooms in MK.","Electricians":"Qualified electrician for installations, repairs and safety certificates in MK.","Gas Engineers":"Gas Safe registered engineer for boiler servicing and repairs in Milton Keynes.","Handymen & Maintenance":"Reliable handyman for home maintenance, repairs and installations in MK.","Gardening & Landscaping":"Professional gardener and landscaper in Milton Keynes.","Window Cleaning":"Professional window cleaning in Milton Keynes.","Cleaning & Car Valeting":"Reliable cleaning service for homes and vehicles in Milton Keynes.","Decorating & Flooring":"Professional decorator and flooring specialist in Milton Keynes.","Blinds & Interiors":"Blinds and interior design services in Milton Keynes.","Design Services":"Creative design including branding and web design in Milton Keynes.","Childcare & Tutors":"Qualified tutor and childcare provider in Milton Keynes.","Hair & Beauty":"Professional hair and beauty services in Milton Keynes.","Bridal & Henna":"Professional henna and bridal beauty services in Milton Keynes.","Pet Services":"Trusted pet care and dog walking in Milton Keynes.","Food & Catering":"Home-cooked catering and food delivery in Milton Keynes.","Driving Instructors":"Qualified driving instructor in Milton Keynes.","Travel":"Travel agent for flights and holidays from Milton Keynes.","Event Services":"Professional event services in Milton Keynes.","Taxis & Transport":"Reliable taxi and transport in Milton Keynes.","Locksmiths":"Professional locksmith for emergencies in Milton Keynes.","Health & Fitness":"Health, fitness and physiotherapy in Milton Keynes.","Financial Services":"Financial advice and mortgage services in Milton Keynes.","Photography":"Professional photographer in Milton Keynes.","Classes & Activities":"Classes and activities for all ages in Milton Keynes.","Hire Services":"Tool and equipment hire in Milton Keynes.","Tailoring & Alterations":"Professional tailoring and alterations in Milton Keynes.","Translation & Legal":"Translation and legal document services in Milton Keynes.","Accountants":"Qualified accountant for tax and bookkeeping in Milton Keynes.","Architects":"Qualified architect for residential and commercial projects in MK.","Airport Transfers":"Airport pickup and drop-off from Milton Keynes.","Appliance Repair":"Appliance engineer for white goods repair in Milton Keynes.","Carpenters":"Skilled carpenter for joinery and woodwork in Milton Keynes.","Carpet & Flooring":"Carpet supply and fitting in Milton Keynes.","Car Garages":"Car garage for servicing and repairs in Milton Keynes.","Immigration & Legal":"Immigration solicitor for visas and legal advice in MK.","Kitchen Fitting":"Professional kitchen fitter in Milton Keynes.","Mortgage Advisors":"Independent mortgage advisor in Milton Keynes.","Pest Control":"Professional pest control in Milton Keynes.","PC & Tech Repair":"PC and IT repair services in Milton Keynes.","Structural Engineers":"Structural engineer for residential projects in MK.","Skip Hire":"Skip hire for waste removal in Milton Keynes.","Tiling":"Professional tiler for bathrooms and kitchens in MK.","Priests":"Hindu priest for ceremonies and pujas in Milton Keynes.","Will Writing":"Will writing and estate planning in Milton Keynes.","Health & Wellbeing":"Holistic health and wellbeing services in Milton Keynes.","Bike Repair":"Bicycle repair and servicing in Milton Keynes.","Bathroom Specialists":"Bathroom design and installation in Milton Keynes.","Property Maintenance":"Property maintenance and repairs in Milton Keynes."};
function waLink(s){var n=(s.wa||s.phone||"").replace(/[\\s\\-\\+\\(\\)]/g,"");if(n.startsWith("07")&&n.length===11)n="44"+n.slice(1);else if(!n.startsWith("447"))return"";return n;}
function card(s){
  var d=s.description||(CAT_DESC[s.category]||"");
  var a="";
  if(s.phone){
    a+='<a class="bc" href="tel:'+s.phone.replace(/\\s/g,"")+'">&#128222; '+s.phone+"</a>";
    var wa=waLink(s);
    if(wa)a+='<a class="bw" href="https://wa.me/'+wa+'" target="_blank">&#128172; WhatsApp</a>';
  }
  if(s.email)a+='<a class="bl" href="mailto:'+s.email+'">&#9993; '+s.email+"</a>";
  if(s.website)a+='<a class="bl" href="'+s.website+'" target="_blank" rel="noopener">&#127760; '+s.website.replace(/^https?:\\/\\/(www\\.)?/,"").replace(/\\/$/,"")+"</a>";
  return'<div class="card">'
    +'<span class="cat">'+s.category+"</span>"
    +'<a class="nm" href="/services/'+(s.catSlug||slugify(s.category))+'/'+(s.slug||slugify(s.name))+'">'+s.name+'</a>'
    +(d?'<div class="ds">'+d+"</div>":"")
    +(a?'<div class="acts">'+a+"</div>":"")
    +"</div>";
}
function render(){
  var q=norm(state.q);
  var f=data.filter(function(s){
    if(state.cat!==ALL&&s.category!==state.cat)return false;
    if(!q)return true;
    return norm(s.name).includes(q)||norm(s.category).includes(q)||norm(s.description).includes(q)||norm(s.phone).includes(q)||norm(s.email).includes(q);
  });
  document.getElementById("ri").textContent=f.length===data.length?data.length+" services listed":f.length+" result"+(f.length!==1?"s":"");
  var g=document.getElementById("g");
  if(!f.length){g.innerHTML='<div class="sm"><p>&#128269;</p><p>No results for <strong>'+state.q+"</strong></p></div>";return}
  g.innerHTML=f.map(card).join("");
}
function selCat(cat){
  state.cat=cat;
  document.getElementById("clbl").textContent=cat===ALL?"All Categories":cat;
  document.getElementById("csel").className="csel"+(cat!==ALL?" on":"");
  document.getElementById("call-btn-all").className="call-btn"+(cat===ALL?" on":"");
  document.getElementById("cgrid").querySelectorAll(".citem").forEach(function(b){
    b.className="citem"+(b.dataset.c===cat?" on":"");
  });
  document.getElementById("sov").classList.remove("open");
  render();
}
function buildFilters(){
  var cats=[...new Set(data.map(function(s){return s.category}))].sort();
  var grid=document.getElementById("cgrid");
  grid.innerHTML=cats.map(function(cat){
    return'<button class="citem'+(cat===state.cat?" on":"")+'" data-c="'+cat+'">'+cat+"</button>";
  }).join("");
  grid.querySelectorAll(".citem").forEach(function(b){
    b.addEventListener("click",function(){selCat(b.dataset.c)});
  });
  document.getElementById("call-btn-all").className="call-btn"+(state.cat===ALL?" on":"");
}
document.getElementById("csel").addEventListener("click",function(){document.getElementById("sov").classList.add("open")});
document.getElementById("shcl").addEventListener("click",function(){document.getElementById("sov").classList.remove("open")});
document.getElementById("sov").addEventListener("click",function(e){if(e.target===this)this.classList.remove("open")});
document.getElementById("call-btn-all").addEventListener("click",function(){selCat(ALL)});
async function init(){
  document.getElementById("g").innerHTML='<div class="sm"><p>&#9203;</p><p>Loading...</p></div>';
  var r=await fetch("/api/services");
  data=await r.json();
  buildFilters();render();
}
document.getElementById("s").addEventListener("input",function(e){state.q=e.target.value;render()});
init();
</script>
</body>
</html>`;

// ── Projects Board page ────────────────────────────────────────────────────
const PROJECTS_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Jobs Board | Whitehouse Community MK</title>
<meta name="description" content="Post a home job and invite bids from trusted local tradespeople in Whitehouse, Milton Keynes."/>
<style>
${CSS_VARS}
header{background:linear-gradient(135deg,#1b4332,#2d6a4f);color:#fff;padding:18px 16px 16px}
.hrow{display:flex;align-items:center;gap:10px;max-width:720px;margin:0 auto}
.hrow a{color:rgba(255,255,255,.75);text-decoration:none;font-size:.85rem;flex-shrink:0}
.hrow h1{font-size:1.25rem;font-weight:800;flex:1;text-align:center}
.htag{text-align:center;font-size:.8rem;opacity:.75;margin-top:3px}
.wrap{max-width:680px;margin:0 auto;padding:14px 12px 110px}
.empty{text-align:center;padding:60px 20px;color:var(--m)}
.empty p:first-child{font-size:2.2rem;margin-bottom:8px}
/* Project card */
.pcard{background:#fff;border:1px solid var(--b);border-left:4px solid #7c3aed;border-radius:12px;padding:15px;margin-bottom:12px}
.pcard-top{display:flex;align-items:flex-start;gap:10px;margin-bottom:8px}
.catbadge{display:inline-block;font-size:.64rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#7c3aed;background:#f5f3ff;padding:2px 8px;border-radius:4px;white-space:nowrap}
.ptitle{font-size:1rem;font-weight:700;color:var(--t);line-height:1.3;flex:1}
.pmeta{font-size:.8rem;color:var(--m);line-height:1.6;margin-bottom:10px}
.pmeta span{margin-right:14px}
.pmeta .mval{color:var(--t);font-weight:500}
.pdesc{font-size:.84rem;color:var(--m);line-height:1.5;margin-bottom:10px}
.pactions{display:flex;gap:8px;flex-wrap:wrap}
.pactions button{flex:1;min-width:120px;padding:10px 12px;border-radius:8px;border:none;font-size:.85rem;font-weight:600;cursor:pointer;-webkit-tap-highlight-color:transparent}
.btn-apply{background:#7c3aed;color:#fff}
.btn-apply:active{background:#6d28d9}
.btn-suggest{background:#f5f3ff;color:#7c3aed;border:1.5px solid #ddd6fe !important}
.btn-suggest:active{background:#ede9fe}
.pfoot{font-size:.72rem;color:var(--m);margin-top:10px;display:flex;justify-content:space-between}
/* FAB */
.fab{position:fixed;bottom:24px;right:20px;z-index:50;display:flex;align-items:center;gap:8px;background:#7c3aed;color:#fff;padding:13px 20px;border-radius:999px;font-size:.92rem;font-weight:700;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(124,58,237,.4);-webkit-tap-highlight-color:transparent}
.fab:active{background:#6d28d9}
/* Overlay + modal */
.ov{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:flex-end;opacity:0;pointer-events:none;transition:opacity .2s}
.ov.open{opacity:1;pointer-events:all}
.modal{background:#fff;border-radius:20px 20px 0 0;width:100%;max-height:90vh;overflow-y:auto;transform:translateY(100%);transition:transform .3s cubic-bezier(.32,.72,0,1);padding:20px 16px 40px}
.ov.open .modal{transform:translateY(0)}
.mhdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.mhdr h2{font-size:1.05rem;font-weight:800}
.mclose{background:none;border:none;font-size:1.3rem;cursor:pointer;color:var(--m);line-height:1;padding:4px 6px;-webkit-tap-highlight-color:transparent}
/* Steps */
.step{display:none}
.step.active{display:block}
.step-label{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--m);margin-bottom:14px}
label.fl{display:block;font-size:.88rem;font-weight:600;margin-bottom:6px;color:var(--t)}
input.fi,textarea.fi,select.fi{width:100%;padding:11px 13px;border:1.5px solid var(--b);border-radius:9px;font-size:.95rem;font-family:inherit;outline:none;color:var(--t);background:#fff;-webkit-appearance:none}
input.fi:focus,textarea.fi:focus,select.fi:focus{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,.1)}
textarea.fi{resize:vertical;min-height:80px}
.fi-group{margin-bottom:14px}
/* Suggestion chip */
.sug-chip{display:inline-flex;align-items:center;gap:6px;background:#f5f3ff;color:#7c3aed;border:1.5px solid #ddd6fe;padding:5px 10px;border-radius:999px;font-size:.8rem;font-weight:600;margin:6px 0 10px;cursor:pointer;-webkit-tap-highlight-color:transparent}
.sug-chip.matched{background:#7c3aed;color:#fff;border-color:#7c3aed}
/* Grid options */
.opt-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px}
.opt{padding:11px 8px;border-radius:9px;border:1.5px solid var(--b);text-align:center;font-size:.83rem;font-weight:500;cursor:pointer;background:#fff;color:var(--t);-webkit-tap-highlight-color:transparent;transition:all .15s}
.opt.on{background:#7c3aed;color:#fff;border-color:#7c3aed}
/* Progress */
.prog{display:flex;gap:6px;margin-bottom:20px}
.prog-dot{flex:1;height:4px;border-radius:2px;background:var(--b);transition:background .2s}
.prog-dot.done{background:#7c3aed}
.nav-row{display:flex;gap:10px;margin-top:18px}
.nav-row button{flex:1;padding:13px;border-radius:10px;font-size:.95rem;font-weight:700;cursor:pointer;border:none;-webkit-tap-highlight-color:transparent}
.btn-next{background:#7c3aed;color:#fff}
.btn-next:disabled{opacity:.5;cursor:not-allowed}
.btn-back{background:var(--bg);color:var(--t)}
/* Contact reveal */
.contact-box{background:#ecfdf5;border:1.5px solid #6ee7b7;border-radius:10px;padding:13px 14px;margin-top:10px}
.contact-box p{font-size:.88rem;color:#065f46;font-weight:600}
.contact-box a{color:#065f46;text-decoration:none;font-size:.95rem;font-weight:700}
.contact-badge{font-size:.72rem;color:var(--m);margin-bottom:8px}
footer{text-align:center;font-size:.72rem;color:var(--m);padding:14px 20px 20px;border-top:1px solid var(--b)}
footer a{color:var(--g);text-decoration:none;font-weight:600}
</style>
</head>
<body>
<header>
  <div class="hrow"><a href="/">← Directory</a><h1>Jobs Board</h1><span style="width:70px"></span></div>
  <p class="htag">Post a home job &middot; Get bids from local trades &middot; Community suggestions welcome</p>
</header>

<div class="wrap" id="wrap">
  <div class="empty"><p>⏳</p><p>Loading jobs…</p></div>
</div>

<button class="fab" id="postfab">+ Post a Job</button>

<!-- ── Post Job Modal ── -->
<div class="ov" id="post-ov">
  <div class="modal">
    <div class="mhdr"><h2 id="post-title">Post a Job</h2><button class="mclose" id="post-close">✕</button></div>
    <div class="prog" id="prog">
      <div class="prog-dot done" id="pd0"></div>
      <div class="prog-dot" id="pd1"></div>
      <div class="prog-dot" id="pd2"></div>
    </div>

    <!-- Step 1: What's the job -->
    <div class="step active" id="s1">
      <div class="step-label">Step 1 of 3 — What's the job?</div>
      <div class="fi-group">
        <label class="fl" for="p-title">Give it a short title</label>
        <input class="fi" id="p-title" type="text" placeholder="e.g. Fitted wardrobe in master bedroom" maxlength="120"/>
      </div>
      <div class="fi-group">
        <label class="fl" for="p-desc">Any more detail? <span style="font-weight:400;color:var(--m)">(optional)</span></label>
        <textarea class="fi" id="p-desc" placeholder="Dimensions, materials, access, anything helpful…" rows="3"></textarea>
      </div>
      <div id="cat-suggest-wrap" style="display:none">
        <div style="font-size:.8rem;color:var(--m);margin-bottom:4px">Suggested category:</div>
        <span class="sug-chip matched" id="cat-chip" onclick="confirmCat()"></span>
        <div style="font-size:.75rem;color:var(--m);margin-top:2px">Tap to confirm, or choose below</div>
      </div>
      <div class="fi-group" style="margin-top:10px">
        <label class="fl" for="p-cat">Category</label>
        <select class="fi" id="p-cat"><option value="">-- choose category --</option></select>
      </div>
      <div class="nav-row">
        <button class="btn-next nav-row" style="flex:1" id="s1-next" onclick="goStep(2)" disabled>Next →</button>
      </div>
    </div>

    <!-- Step 2: Budget + timeline -->
    <div class="step" id="s2">
      <div class="step-label">Step 2 of 3 — Budget &amp; timeline</div>
      <div class="fi-group">
        <label class="fl">Approximate budget</label>
        <div class="opt-grid" id="budget-opts">
          <div class="opt" data-v="Under £100">Under £100</div>
          <div class="opt" data-v="£100 – £500">£100 – £500</div>
          <div class="opt" data-v="£500 – £1,000">£500 – £1,000</div>
          <div class="opt" data-v="£1,000 – £2,500">£1,000 – £2,500</div>
          <div class="opt" data-v="£2,500+">£2,500+</div>
          <div class="opt" data-v="Not sure yet">Not sure yet</div>
        </div>
      </div>
      <div class="fi-group">
        <label class="fl">When do you need this done?</label>
        <div class="opt-grid" id="timeline-opts">
          <div class="opt" data-v="As soon as possible">ASAP</div>
          <div class="opt" data-v="Within 1 month">Within 1 month</div>
          <div class="opt" data-v="1 – 3 months">1 – 3 months</div>
          <div class="opt" data-v="Just exploring">Just exploring</div>
        </div>
      </div>
      <div class="nav-row">
        <button class="btn-back" onclick="goStep(1)">← Back</button>
        <button class="btn-next" id="s2-next" onclick="goStep(3)" disabled>Next →</button>
      </div>
    </div>

    <!-- Step 3: Contact -->
    <div class="step" id="s3">
      <div class="step-label">Step 3 of 3 — Your contact details</div>
      <p style="font-size:.83rem;color:var(--m);margin-bottom:14px">Tradespeople will use these to get in touch.</p>
      <div class="fi-group">
        <label class="fl" for="p-cname">Your name</label>
        <input class="fi" id="p-cname" type="text" placeholder="First name is fine" maxlength="80"/>
      </div>
      <div class="fi-group">
        <label class="fl" for="p-cphone">Phone / WhatsApp</label>
        <input class="fi" id="p-cphone" type="tel" placeholder="07…" maxlength="20"/>
      </div>
      <div class="fi-group">
        <label class="fl" for="p-cemail">Email <span style="font-weight:400;color:var(--m)">(optional)</span></label>
        <input class="fi" id="p-cemail" type="email" placeholder="you@example.com" maxlength="100"/>
      </div>
      <div id="post-err" style="font-size:.83rem;color:#dc2626;margin-bottom:8px;display:none"></div>
      <div class="nav-row">
        <button class="btn-back" onclick="goStep(2)">← Back</button>
        <button class="btn-next" id="post-submit" onclick="submitProject()" disabled>Post Job &#127881;</button>
      </div>
    </div>

    <!-- Success -->
    <div class="step" id="s5">
      <div style="text-align:center;padding:24px 0">
        <div style="font-size:3rem;margin-bottom:12px">🎉</div>
        <h2 style="font-size:1.2rem;margin-bottom:8px">Job posted!</h2>
        <p style="font-size:.88rem;color:var(--m);line-height:1.5">Tradespeople and residents can now see your job and express interest.</p>
        <button onclick="closePost();reload()" style="margin-top:20px;padding:13px 24px;background:#7c3aed;color:#fff;border:none;border-radius:10px;font-size:.95rem;font-weight:700;cursor:pointer;width:100%">View Jobs Board</button>
      </div>
    </div>

  </div>
</div>

<!-- ── Apply / Suggest Modal ── -->
<div class="ov" id="resp-ov">
  <div class="modal">
    <div class="mhdr"><h2 id="resp-title">Express Interest</h2><button class="mclose" id="resp-close">✕</button></div>

    <!-- Response form -->
    <div id="resp-form">
      <div id="resp-contact-wrap" style="margin-bottom:16px"></div>
      <div class="fi-group">
        <label class="fl" for="r-name" id="r-name-label">Your name</label>
        <input class="fi" id="r-name" type="text" placeholder="Your name" maxlength="80"/>
      </div>
      <div class="fi-group">
        <label class="fl" for="r-phone">Your phone / WhatsApp</label>
        <input class="fi" id="r-phone" type="tel" placeholder="07…" maxlength="20"/>
      </div>
      <div class="fi-group">
        <label class="fl" for="r-note" id="r-note-label">Brief note <span style="font-weight:400;color:var(--m)">(optional)</span></label>
        <textarea class="fi" id="r-note" rows="2" placeholder="Anything you'd like them to know…"></textarea>
      </div>
      <div id="resp-err" style="font-size:.83rem;color:#dc2626;margin-bottom:8px;display:none"></div>
      <div class="nav-row">
        <button class="btn-next" id="resp-submit" onclick="submitResp()" style="flex:1">Submit</button>
      </div>
    </div>

    <!-- Success -->
    <div id="resp-success" style="display:none;text-align:center;padding:24px 0">
      <div style="font-size:2.5rem;margin-bottom:12px">✅</div>
      <h2 style="font-size:1.1rem;margin-bottom:8px" id="resp-success-msg">Thanks!</h2>
      <p style="font-size:.85rem;color:var(--m);line-height:1.5">The homeowner can now see your details and will be in touch.</p>
      <button onclick="closeResp()" style="margin-top:18px;padding:12px 22px;background:#7c3aed;color:#fff;border:none;border-radius:10px;font-size:.92rem;font-weight:700;cursor:pointer;width:100%">Done</button>
    </div>

  </div>
</div>

<footer>Part of <a href="/">Whitehouse Community Directory</a> &middot; Milton Keynes</footer>

<script>
// ── Category keyword map for smart suggestions ────────────────────────────
var KEYWORDS = {
  "Carpenters":["wardrobe","shelf","shelves","cabinet","joinery","carpenter","wood","bespoke furniture","fitted"],
  "Plumbers":["plumb","pipe","tap","water","boiler","leak","radiator","heating","shower","tank","cylinder"],
  "Electricians":["electric","wiring","socket","fuse","light","lights","circuit","plug","consumer unit","rewire"],
  "Gas Engineers":["gas","boiler service","combi","central heating","gas safe"],
  "Gardening & Landscaping":["garden","lawn","mow","hedge","tree","patio","driveway","fence","landscap","turf"],
  "Cleaning & Car Valeting":["clean","hoover","vacuum","mop","dust","valet","pressure wash"],
  "Decorating & Flooring":["paint","decor","wallpaper","plaster","render","decorat"],
  "Carpet & Flooring":["carpet","flooring","laminate","vinyl","hardwood","engineered","lvt","underlay"],
  "Window Cleaning":["window clean","glass clean"],
  "Bathroom Specialists":["bathroom","toilet","shower","bath","ensuite"],
  "Tiling":["tile","tiling","grout"],
  "Handymen & Maintenance":["handyman","assemble","odd job","maintenance","fix","repair","hang","mount"],
  "Kitchen Fitting":["kitchen","units","worktop","countertop","kitchen fit"],
  "Roofing":["roof","gutter","fascia","soffit","felt"],
  "Pest Control":["pest","mice","rat","wasp","ant","bed bug","cockroach"],
  "Painting":["paint","gloss","emulsion"],
  "Locksmiths":["lock","key","door lock","deadbolt"],
  "Skip Hire":["skip","rubbish","waste","clearance","junk"],
};

var ALL_CATS=["Accountants","Airport Transfers","Appliance Repair","Architects","Bathroom Specialists","Bike Repair","Blinds & Interiors","Bridal & Henna","Car Garages","Carpenters","Carpet & Flooring","Childcare & Tutors","Classes & Activities","Cleaning & Car Valeting","Decorating & Flooring","Design Services","Driving Instructors","Electricians","Event Services","Financial Services","Food & Catering","Gardening & Landscaping","Gas Engineers","Hair & Beauty","Handymen & Maintenance","Health & Fitness","Health & Wellbeing","Hire Services","Immigration & Legal","Kitchen Fitting","Locksmiths","Mortgage Advisors","PC & Tech Repair","Pest Control","Pet Services","Photography","Plumbers","Priests","Property Maintenance","Skip Hire","Structural Engineers","Tailoring & Alterations","Taxis & Transport","Tiling","Translation & Legal","Travel","Will Writing","Window Cleaning"];

function suggestCategory(text){
  var t=text.toLowerCase();
  var best=null,bestScore=0;
  for(var cat in KEYWORDS){
    var words=KEYWORDS[cat];
    for(var i=0;i<words.length;i++){
      if(t.includes(words[i])&&words[i].length>bestScore){bestScore=words[i].length;best=cat}
    }
  }
  return best;
}

// ── State ──────────────────────────────────────────────────────────────────
var curStep=1,pBudget="",pTimeline="",curProjectId="",curRespType="bid";

// ── Init: populate category select ────────────────────────────────────────
(function(){
  var sel=document.getElementById("p-cat");
  ALL_CATS.forEach(function(c){sel.innerHTML+="<option value='"+c+"'>"+c+"</option>"});
})();

// ── Category suggestion ────────────────────────────────────────────────────
document.getElementById("p-title").addEventListener("input",checkStep1);
document.getElementById("p-cat").addEventListener("change",checkStep1);

function checkStep1(){
  var title=document.getElementById("p-title").value.trim();
  var cat=document.getElementById("p-cat").value;
  // auto-suggest
  if(title.length>3){
    var sug=suggestCategory(title);
    if(sug){
      document.getElementById("cat-suggest-wrap").style.display="block";
      document.getElementById("cat-chip").textContent="📌 "+sug;
      document.getElementById("cat-chip").dataset.cat=sug;
      if(!cat||cat===sug){document.getElementById("p-cat").value=sug}
    } else { document.getElementById("cat-suggest-wrap").style.display="none"; }
  }
  document.getElementById("s1-next").disabled=!(title&&document.getElementById("p-cat").value);
}
function confirmCat(){
  var c=document.getElementById("cat-chip").dataset.cat;
  if(c)document.getElementById("p-cat").value=c;
  checkStep1();
}

// ── Budget + timeline options ──────────────────────────────────────────────
document.getElementById("budget-opts").addEventListener("click",function(e){
  var d=e.target.closest(".opt");if(!d)return;
  document.querySelectorAll("#budget-opts .opt").forEach(function(x){x.className="opt"});
  d.className="opt on"; pBudget=d.dataset.v; checkStep2();
});
document.getElementById("timeline-opts").addEventListener("click",function(e){
  var d=e.target.closest(".opt");if(!d)return;
  document.querySelectorAll("#timeline-opts .opt").forEach(function(x){x.className="opt"});
  d.className="opt on"; pTimeline=d.dataset.v; checkStep2();
});
function checkStep2(){document.getElementById("s2-next").disabled=!(pBudget&&pTimeline);}

// ── Contact step validation ────────────────────────────────────────────────
document.getElementById("p-cname").addEventListener("input",checkStep3);
document.getElementById("p-cphone").addEventListener("input",checkStep3);
function checkStep3(){
  var ok=document.getElementById("p-cname").value.trim()&&document.getElementById("p-cphone").value.trim();
  document.getElementById("post-submit").disabled=!ok;
}

// ── Step navigation ────────────────────────────────────────────────────────
function goStep(n){
  document.getElementById("s"+curStep).className="step";
  curStep=n;
  document.getElementById("s"+curStep).className="step active";
  document.getElementById("post-title").textContent=["","What's the job?","Budget & timeline","Your details","","Done"][n]||"Post a Job";
  for(var i=0;i<3;i++)document.getElementById("pd"+i).className="prog-dot"+(i<n?" done":"");
}

// ── Submit project ─────────────────────────────────────────────────────────
async function submitProject(){
  var btn=document.getElementById("post-submit");
  btn.textContent="Posting…";btn.disabled=true;
  var body={
    title:document.getElementById("p-title").value.trim(),
    category:document.getElementById("p-cat").value,
    description:document.getElementById("p-desc").value.trim(),
    budget:pBudget,timeline:pTimeline,
    contactName:document.getElementById("p-cname").value.trim(),
    contactPhone:document.getElementById("p-cphone").value.trim(),
    contactEmail:document.getElementById("p-cemail").value.trim()
  };
  try{
    var r=await fetch("/api/projects",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    if(r.status===422){var d=await r.json();document.getElementById("post-err").textContent=d.error||"Content not allowed.";document.getElementById("post-err").style.display="block";return}
    if(!r.ok)throw new Error();
    goStep(5);
  }catch(e){document.getElementById("post-err").textContent="Something went wrong — please try again.";document.getElementById("post-err").style.display="block"}
  finally{btn.textContent="Post Job 🎉";btn.disabled=false}
}

// ── Open/close modals ──────────────────────────────────────────────────────
document.getElementById("postfab").addEventListener("click",function(){
  curStep=1;goStep(1);pBudget="";pTimeline="";
  document.getElementById("p-title").value="";document.getElementById("p-desc").value="";
  document.getElementById("p-cat").value="";document.getElementById("p-cname").value="";
  document.getElementById("p-cphone").value="";document.getElementById("p-cemail").value="";
  document.getElementById("post-err").style.display="none";
  document.getElementById("cat-suggest-wrap").style.display="none";
  document.querySelectorAll(".opt").forEach(function(x){x.className="opt"});
  document.getElementById("s1-next").disabled=true;
  document.getElementById("post-ov").className="ov open";
  setTimeout(function(){document.getElementById("p-title").focus()},350);
});
function closePost(){document.getElementById("post-ov").className="ov"}
document.getElementById("post-close").addEventListener("click",closePost);
document.getElementById("post-ov").addEventListener("click",function(e){if(e.target===this)closePost()});

function openResp(projectId,type,posterContact){
  curProjectId=projectId;curRespType=type;
  document.getElementById("resp-form").style.display="block";
  document.getElementById("resp-success").style.display="none";
  document.getElementById("r-name").value="";document.getElementById("r-phone").value="";
  document.getElementById("r-note").value="";document.getElementById("resp-err").style.display="none";
  if(type==="bid"){
    document.getElementById("resp-title").textContent="Express Interest";
    document.getElementById("r-name-label").textContent="Your name";
    document.getElementById("r-note-label").innerHTML='Brief note <span style="font-weight:400;color:var(--m)">(optional)</span>';
    document.getElementById("r-note").placeholder="e.g. available weekends, can start next week…";
    document.getElementById("resp-submit").textContent="Express Interest";
  } else {
    document.getElementById("resp-title").textContent="Suggest Someone";
    document.getElementById("r-name-label").textContent="Their name";
    document.getElementById("r-note-label").innerHTML='Why are you recommending them?';
    document.getElementById("r-note").placeholder="e.g. did our kitchen last year, excellent work…";
    document.getElementById("resp-submit").textContent="Submit Suggestion";
  }
  // Show poster contact if we have it
  var cw=document.getElementById("resp-contact-wrap");
  if(posterContact&&posterContact.phone){
    var wa=posterContact.phone.replace(/[\\s\\-\\+\\(\\)]/g,"");
    if(wa.startsWith("07")&&wa.length===11)wa="44"+wa.slice(1);
    cw.innerHTML='<div class="contact-box"><div class="contact-badge">📋 Homeowner contact</div>'
      +'<p>'+posterContact.name+'</p>'
      +'<a href="tel:'+posterContact.phone+'">📞 '+posterContact.phone+'</a>'
      +(wa.startsWith("44")?'&nbsp;&nbsp;<a href="https://wa.me/'+wa+'" target="_blank">💬 WhatsApp</a>':"")
      +'</div>';
  } else {
    cw.innerHTML='<div style="background:#fff9e6;border:1.5px solid #fde68a;border-radius:9px;padding:10px 12px;font-size:.83rem;color:#92400e;margin-bottom:6px">&#128222; Submit your details and the homeowner contact will be shared with you.</div>';
  }
  document.getElementById("resp-ov").className="ov open";
  setTimeout(function(){document.getElementById("r-name").focus()},350);
}
function closeResp(){document.getElementById("resp-ov").className="ov"}
document.getElementById("resp-close").addEventListener("click",closeResp);
document.getElementById("resp-ov").addEventListener("click",function(e){if(e.target===this)closeResp()});

// ── Submit response ────────────────────────────────────────────────────────
async function submitResp(){
  var btn=document.getElementById("resp-submit");
  btn.textContent="Sending…";btn.disabled=true;
  var body={type:curRespType,name:document.getElementById("r-name").value.trim(),
    phone:document.getElementById("r-phone").value.trim(),
    note:document.getElementById("r-note").value.trim()};
  try{
    var r=await fetch("/api/projects/"+curProjectId+"/respond",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    if(r.status===422){var d=await r.json();document.getElementById("resp-err").textContent=d.error||"Content not allowed.";document.getElementById("resp-err").style.display="block";return}
    if(!r.ok)throw new Error();
    document.getElementById("resp-form").style.display="none";
    document.getElementById("resp-success").style.display="block";
    document.getElementById("resp-success-msg").textContent=curRespType==="bid"?"Interest submitted!":"Suggestion submitted!";
    reload();
  }catch(e){document.getElementById("resp-err").textContent="Something went wrong — please try again.";document.getElementById("resp-err").style.display="block"}
  finally{btn.textContent=curRespType==="bid"?"Express Interest":"Submit Suggestion";btn.disabled=false}
}

// ── Render projects ────────────────────────────────────────────────────────
var projects=[];

function timeAgo(iso){
  var d=new Date(iso),now=new Date(),diff=Math.floor((now-d)/60000);
  if(diff<60)return diff+"m ago";
  if(diff<1440)return Math.floor(diff/60)+"h ago";
  return Math.floor(diff/1440)+"d ago";
}

function renderProjects(){
  var w=document.getElementById("wrap");
  if(!projects.length){
    w.innerHTML='<div class="empty"><p>&#128203;</p><p style="font-weight:700;margin-bottom:6px">No open jobs yet</p><p style="font-size:.85rem">Be the first to post one — tap + Post a Job</p></div>';
    return;
  }
  w.innerHTML=projects.map(function(p){
    var hasContact=p.contactPhone;
    return '<div class="pcard">'
      +'<div class="pcard-top"><span class="catbadge">'+p.category+'</span></div>'
      +'<div class="ptitle">'+esc(p.title)+'</div>'
      +(p.description?'<div class="pdesc">'+esc(p.description)+'</div>':"")
      +'<div class="pmeta">'
      +'<span>&#x1F4B0; <span class="mval">'+p.budget+'</span></span>'
      +'<span>&#x1F5D3; <span class="mval">'+p.timeline+'</span></span>'
      +(p.contactName?'<span>&#x1F464; <span class="mval">'+esc(p.contactName)+'</span></span>':"")
      +'</div>'
      +(hasContact?'<div class="contact-box"><div class="contact-badge">Homeowner contact</div>'
        +'<a href="tel:'+p.contactPhone+'">&#128222; '+p.contactPhone+'</a>'
        +'</div>':"")
      +'<div class="pactions">'
      +'<button class="btn-apply" data-pid="'+p.id+'" data-type="bid" data-cname="'+esc(p.contactName||'')+'" data-cphone="'+esc(p.contactPhone||'')+'">&#x1F44B; Interested</button>'
      +'<button class="btn-suggest" data-pid="'+p.id+'" data-type="suggestion">&#x1F4A1; Know someone?</button>'
      +'</div>'
      +'<div style="text-align:right;margin-top:4px"><button class="btn-report" data-pid="'+p.id+'" data-type="report" style="background:none;border:none;font-size:.72rem;color:#9ca3af;cursor:pointer;padding:2px 4px">&#9872; Report</button></div>'
      +'<div class="pfoot"><span>'+p.responseCount+' interest'+(p.responseCount===1?'':'s')+'</span><span>'+timeAgo(p.createdAt)+'</span></div>'
      +'</div>';
  }).join("");
}
// Event delegation for project action buttons
document.addEventListener("click",function(e){
  var btn=e.target.closest("[data-pid]");
  if(!btn)return;
  var pid=btn.dataset.pid,type=btn.dataset.type;
  if(type==="report"){
    if(!confirm("Report this post as inappropriate or illegal?"))return;
    fetch("/api/projects/"+pid+"/report",{method:"POST"})
      .then(function(){btn.textContent="Reported";btn.disabled=true;btn.style.color="#ef4444";});
    return;
  }
  var contact=(type==="bid"&&btn.dataset.cphone)?{name:btn.dataset.cname,phone:btn.dataset.cphone}:null;
  openResp(pid,type,contact);
});

function esc(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}

async function load(){
  try{
    var r=await fetch("/api/projects");
    projects=await r.json();
    renderProjects();
  }catch(e){document.getElementById("wrap").innerHTML='<div class="empty"><p>⚠️</p><p>Could not load jobs</p></div>'}
}
function reload(){setTimeout(load,300)}
load();
</script>
</body>
</html>`;

// ── Community submit page ──────────────────────────────────────────────────
const SUBMIT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Add your service - Whitehouse Directory</title>
<style>
${CSS_VARS}
.page{max-width:520px;margin:0 auto;padding:24px 16px 60px}
.back{display:inline-flex;align-items:center;gap:6px;color:var(--g);text-decoration:none;font-size:.88rem;font-weight:500;margin-bottom:20px}
.hero{background:linear-gradient(135deg,#1b4332,#2d6a4f);border-radius:14px;padding:24px 20px;color:#fff;margin-bottom:28px;text-align:center}
.hero h1{font-size:1.35rem;font-weight:800;margin-bottom:6px}
.hero p{font-size:.88rem;opacity:.85;line-height:1.5}
.card{background:#fff;border-radius:14px;padding:24px 20px;border:1px solid var(--b)}
.fi{margin-bottom:18px}
.fi label{display:block;font-size:.88rem;font-weight:600;margin-bottom:6px;color:var(--t)}
.fi label span{color:var(--m);font-weight:400}
.fi input,.fi select,.fi textarea{width:100%;padding:12px 14px;border:1.5px solid var(--b);border-radius:10px;font-size:1rem;outline:none;font-family:inherit;color:var(--t);background:#fff}
.fi input:focus,.fi select:focus,.fi textarea:focus{border-color:var(--gl)}
.fi textarea{resize:vertical;min-height:80px}
.fi .hint{font-size:.78rem;color:var(--m);margin-top:5px;line-height:1.4}
.code-box{background:#fffbeb;border:1.5px solid #fcd34d;border-radius:10px;padding:14px;margin-bottom:18px}
.code-box p{font-size:.85rem;color:#92400e;line-height:1.5}
.code-box strong{display:block;margin-bottom:4px;font-size:.9rem}
.submit-btn{width:100%;padding:14px;font-size:1rem;font-weight:700;background:var(--g);color:#fff;border:none;border-radius:10px;cursor:pointer;margin-top:4px;-webkit-tap-highlight-color:transparent}
.submit-btn:active{background:#1b4332}
.submit-btn:disabled{background:var(--m);cursor:not-allowed}
#success{display:none;text-align:center;padding:40px 20px}
#success .tick{font-size:3.5rem;margin-bottom:12px}
#success h2{font-size:1.3rem;font-weight:800;color:var(--g);margin-bottom:8px}
#success p{font-size:.9rem;color:var(--m);margin-bottom:24px;line-height:1.5}
#error-msg{display:none;background:#fee2e2;border:1px solid #fca5a5;border-radius:8px;padding:12px 14px;font-size:.88rem;color:#991b1b;margin-bottom:16px}
</style>
</head>
<body>
<div class="page">
  <a class="back" href="/">&#8592; Back to directory</a>

  <div class="hero">
    <h1>Add your service</h1>
    <p>Help your Whitehouse neighbours find you.<br/>Your listing goes live immediately.</p>
  </div>

  <div id="form-view">
    <div class="card">
      <div id="error-msg"></div>

      <div class="fi">
        <label>Your name or business name *</label>
        <input type="text" id="f-name" placeholder="e.g. Joe's Plumbing or Sarah - Mobile Hairdresser" autocomplete="name"/>
      </div>

      <div class="fi">
        <label>Category *</label>
        <input type="text" id="f-cat" list="cat-list" placeholder="e.g. Plumbers, Cleaners, Tutors..."/>
        <datalist id="cat-list"></datalist>
        <div class="hint">Type or choose from the list. You can create a new category too.</div>
      </div>

      <div class="fi">
        <label>Phone number <span>(recommended)</span></label>
        <input type="tel" id="f-phone" placeholder="07700 900123" autocomplete="tel"/>
      </div>

      <div class="fi">
        <label>WhatsApp number <span>(optional — if different from phone)</span></label>
        <input type="tel" id="f-wa" placeholder="07700 900123"/>
        <div class="hint">Leave blank if your WhatsApp is the same as your phone number above.</div>
      </div>

      <div class="fi">
        <label>Email <span>(optional)</span></label>
        <input type="email" id="f-email" placeholder="hello@example.com" autocomplete="email"/>
      </div>

      <div class="fi">
        <label>Website or Instagram <span>(optional)</span></label>
        <input type="url" id="f-web" placeholder="https://..."/>
      </div>

      <div class="fi">
        <label>What do you offer? <span>(optional)</span></label>
        <textarea id="f-desc" placeholder="Briefly describe your services, any specialisms, availability..."></textarea>
      </div>

      <div class="code-box">
        <strong>&#128274; Community code required</strong>
        <p>This directory is for Whitehouse residents. Enter the community code shared in the Whitehouse Facebook/WhatsApp group to submit.</p>
      </div>

      <div class="fi">
        <label>Community code *</label>
        <input type="text" id="f-code" placeholder="Enter the code..." autocomplete="off" autocorrect="off" autocapitalize="none"/>
      </div>

      <button class="submit-btn" id="submit-btn">Add my service to the directory</button>
    </div>
  </div>

  <div id="success">
    <div class="tick">&#9989;</div>
    <h2>You're on the directory!</h2>
    <p>Your listing is now live and your Whitehouse neighbours can find you straight away.</p>
    <a href="/" class="btn btn-green" style="display:inline-block;padding:13px 28px;border-radius:10px;text-decoration:none;font-weight:700">View the directory</a>
  </div>
</div>
<script>
async function loadCats(){
  try{
    var r=await fetch("/api/services");
    var data=await r.json();
    var cats=[...new Set(data.map(function(s){return s.category}))].sort();
    var dl=document.getElementById("cat-list");
    dl.innerHTML=cats.map(function(c){return"<option value='"+c+"'>"}).join("");
  }catch(e){}
}
loadCats();

document.getElementById("submit-btn").addEventListener("click",async function(){
  var name=document.getElementById("f-name").value.trim();
  var cat=document.getElementById("f-cat").value.trim();
  var phone=document.getElementById("f-phone").value.trim();
  var wa=document.getElementById("f-wa").value.trim();
  var email=document.getElementById("f-email").value.trim();
  var web=document.getElementById("f-web").value.trim();
  var desc=document.getElementById("f-desc").value.trim();
  var code=document.getElementById("f-code").value.trim();
  var err=document.getElementById("error-msg");
  err.style.display="none";

  if(!name){err.textContent="Please enter your name or business name.";err.style.display="block";document.getElementById("f-name").focus();return}
  if(!cat){err.textContent="Please choose a category.";err.style.display="block";document.getElementById("f-cat").focus();return}
  if(!phone&&!email){err.textContent="Please add at least a phone number or email so people can contact you.";err.style.display="block";return}
  if(!code){err.textContent="Please enter the community code.";err.style.display="block";document.getElementById("f-code").focus();return}

  var btn=document.getElementById("submit-btn");
  btn.textContent="Submitting...";
  btn.disabled=true;

  try{
    var res=await fetch("/api/submit",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({name:name,category:cat,phone:phone||undefined,wa:wa||undefined,email:email||undefined,website:web||undefined,description:desc||undefined,code:code})
    });
    if(res.status===403){err.textContent="That community code is incorrect. Check the Whitehouse group for the right code.";err.style.display="block";btn.textContent="Add my service to the directory";btn.disabled=false;return}
    if(!res.ok)throw new Error();
    document.getElementById("form-view").style.display="none";
    document.getElementById("success").style.display="block";
    window.scrollTo(0,0);
  }catch(e){
    err.textContent="Something went wrong. Please try again.";
    err.style.display="block";
    btn.textContent="Add my service to the directory";
    btn.disabled=false;
  }
});
</script>
</body>
</html>`;

// ── Admin panel page ───────────────────────────────────────────────────────
const ADMIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Admin - Whitehouse Directory</title>
<style>
${CSS_VARS}
#ls{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
.lb{background:#fff;border:1px solid var(--b);border-radius:12px;padding:40px 36px;width:100%;max-width:380px;box-shadow:0 4px 24px rgba(0,0,0,.07)}
.lb h1{font-size:1.3rem;color:var(--g);margin-bottom:6px}
.lb p{font-size:.85rem;color:var(--m);margin-bottom:24px}
.lb label{display:block;font-size:.85rem;font-weight:500;margin-bottom:6px}
.lb input{width:100%;padding:10px 12px;border:1.5px solid var(--b);border-radius:7px;font-size:1rem;outline:none;margin-bottom:16px}
.lb input:focus{border-color:var(--gl)}
.le{font-size:.82rem;color:#dc2626;margin-bottom:12px;display:none}
#app{display:none}
header{background:var(--g);color:#fff;padding:14px 20px;display:flex;align-items:center;justify-content:space-between}
header h1{font-size:1.1rem;font-weight:700}
header .hr{display:flex;gap:10px;align-items:center}
header a{color:rgba(255,255,255,.8);text-decoration:none;font-size:.85rem}
.tb{padding:14px 20px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;border-bottom:1px solid var(--b);background:#fff}
.tb input{flex:1;min-width:180px;padding:8px 12px;border:1.5px solid var(--b);border-radius:7px;font-size:.9rem;outline:none}
.tb input:focus{border-color:var(--gl)}
.st{font-size:.82rem;color:var(--m);margin-left:auto;white-space:nowrap}
.btn2{padding:8px 16px;border-radius:7px;border:none;font-size:.85rem;font-weight:500;cursor:pointer}
.bp{background:var(--g);color:#fff}
.bp:hover{background:var(--gl)}
.bd{background:#fee2e2;color:#dc2626}
.bg2{background:transparent;color:var(--m);border:1.5px solid var(--b)}
.bg2:hover{border-color:var(--gl);color:var(--g)}
.bs{padding:5px 10px;font-size:.78rem}
.tw{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:.87rem}
thead th{background:#f3f4f6;text-align:left;padding:10px 14px;font-weight:600;font-size:.78rem;text-transform:uppercase;letter-spacing:.04em;color:var(--m);border-bottom:1px solid var(--b);white-space:nowrap}
tbody tr{border-bottom:1px solid var(--b)}
tbody tr:hover{background:#fafafa}
td{padding:10px 14px;vertical-align:middle}
.nc{font-weight:500}
.cc span{background:var(--gp);color:var(--g);font-size:.72rem;font-weight:600;padding:2px 7px;border-radius:4px}
.mc{color:var(--m);font-size:.82rem;line-height:1.5}
.ac{white-space:nowrap;display:flex;gap:6px}
.ov{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
.ov.hidden{display:none}
.mo{background:#fff;border-radius:12px;padding:28px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto}
.mo h2{font-size:1.1rem;margin-bottom:20px}
.fi{margin-bottom:14px}
.fi label{display:block;font-size:.82rem;font-weight:500;margin-bottom:5px}
.fi input,.fi textarea{width:100%;padding:9px 11px;border:1.5px solid var(--b);border-radius:7px;font-size:.9rem;outline:none;font-family:inherit}
.fi input:focus,.fi textarea:focus{border-color:var(--gl)}
.fi textarea{resize:vertical;min-height:72px}
.ma{display:flex;gap:10px;justify-content:flex-end;margin-top:20px}
.cb{background:#fff;border-radius:10px;padding:24px;max-width:360px;width:100%}
.cb h3{margin-bottom:10px}
.cb p{font-size:.88rem;color:var(--m);margin-bottom:20px}
.ca{display:flex;gap:10px;justify-content:flex-end}
.es{text-align:center;padding:60px 20px;color:var(--m)}
.atab{background:none;border:none;border-bottom:3px solid transparent;padding:10px 18px;font-size:.88rem;font-weight:600;cursor:pointer;color:var(--m)}
.atab.active{color:var(--g);border-bottom-color:var(--g)}
.jcard{background:#fff;border:1.5px solid var(--b);border-radius:10px;padding:14px 16px;margin-bottom:12px}
.jcard.flagged{border-color:#fca5a5;background:#fff7f7}
.jcard-title{font-weight:700;font-size:.95rem;margin-bottom:4px}
.jcard-meta{font-size:.8rem;color:var(--m);margin-bottom:8px}
.jcard-contact{font-size:.82rem;background:#f0fdf4;border:1px solid var(--gp);border-radius:7px;padding:8px 10px;margin-bottom:8px}
.jcard-flag{color:#dc2626;font-weight:700;font-size:.8rem;margin-bottom:6px}
#toast{position:fixed;bottom:24px;right:24px;background:#1b1b1b;color:#fff;padding:10px 18px;border-radius:8px;font-size:.88rem;opacity:0;transition:opacity .2s;pointer-events:none;z-index:200}
#toast.show{opacity:1}
</style>
</head>
<body>
<div id="ls">
  <div class="lb">
    <h1>Whitehouse Directory</h1>
    <p>Admin panel &mdash; enter your password to continue</p>
    <label>Password</label>
    <input type="password" id="pw" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" autofocus/>
    <div class="le" id="le">Incorrect password. Try again.</div>
    <button class="btn2 bp" style="width:100%" id="lbtn">Sign in</button>
  </div>
</div>
<div id="app">
  <header>
    <h1>Whitehouse Admin</h1>
    <div class="hr">
      <a href="/">View site</a>
      <button class="btn2 bg2 bs" id="lo" style="color:#fff;border-color:rgba(255,255,255,.4)">Log out</button>
    </div>
  </header>
  <div class="tb" style="border-bottom:2px solid var(--b);padding-bottom:0;gap:0">
    <button class="atab active" id="tab-dir" onclick="switchTab('dir')">Directory</button>
    <button class="atab" id="tab-jobs" onclick="switchTab('jobs')">Jobs Board <span id="flagged-badge" style="display:none;background:#dc2626;color:#fff;font-size:.7rem;padding:1px 6px;border-radius:10px;margin-left:4px"></span></button>
  </div>

  <!-- Directory tab -->
  <div id="pane-dir">
    <div class="tb">
      <input type="search" id="as" placeholder="Search services..."/>
      <button class="btn2 bp" id="ab">+ Add service</button>
      <span class="st" id="st"></span>
    </div>
    <div class="tw">
      <table>
        <thead><tr><th>Name</th><th>Category</th><th>Contact</th><th>Description</th><th></th></tr></thead>
        <tbody id="tbody"></tbody>
      </table>
      <div class="es" id="es" style="display:none">No services found.</div>
    </div>
  </div>

  <!-- Jobs Board tab -->
  <div id="pane-jobs" style="display:none;padding:16px">
    <p style="font-size:.83rem;color:var(--m);margin-bottom:14px">Open jobs posted by residents. &#x1F6A9; = flagged by community.</p>
    <div id="jobs-list"></div>
  </div>
</div>
<div class="ov hidden" id="mo">
  <div class="mo">
    <h2 id="mt">Add service</h2>
    <div class="fi"><label>Name *</label><input type="text" id="fn" placeholder="e.g. Joe's Plumbing"/></div>
    <div class="fi"><label>Category *</label><input type="text" id="fc" list="cl" placeholder="e.g. Plumbers"/><datalist id="cl"></datalist></div>
    <div class="fi"><label>Phone</label><input type="tel" id="fp" placeholder="07700 900123"/></div>
    <div class="fi"><label>WhatsApp <span style="font-weight:400;color:#6b7280">(if different from phone)</span></label><input type="tel" id="fwa" placeholder="07700 900123"/></div>
    <div class="fi"><label>Email</label><input type="email" id="fe" placeholder="hello@example.com"/></div>
    <div class="fi"><label>Website</label><input type="url" id="fw" placeholder="https://example.com"/></div>
    <div class="fi"><label>Description</label><textarea id="fd" placeholder="What they offer..."></textarea></div>
    <div class="ma">
      <button class="btn2 bg2" id="mc">Cancel</button>
      <button class="btn2 bp" id="ms">Save</button>
    </div>
  </div>
</div>
<div class="ov hidden" id="co">
  <div class="cb">
    <h3>Delete service?</h3>
    <p id="cm">This cannot be undone.</p>
    <div class="ca">
      <button class="btn2 bg2" id="cc">Cancel</button>
      <button class="btn2 bd" id="cd">Delete</button>
    </div>
  </div>
</div>
<div id="toast"></div>
<script>
var pw="",svcs=[],editId=null,delId=null,aq="";
function esc(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function toast(m){var e=document.getElementById("toast");e.textContent=m;e.classList.add("show");setTimeout(function(){e.classList.remove("show")},3000)}
async function tryLogin(p){var r=await fetch("/api/services",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Password":p},body:JSON.stringify({__check:true})});return r.status!==401}
document.getElementById("lbtn").addEventListener("click",login);
document.getElementById("pw").addEventListener("keydown",function(e){if(e.key==="Enter")login()});
async function login(){
  var p=document.getElementById("pw").value;if(!p)return;
  var b=document.getElementById("lbtn");b.textContent="Signing in...";b.disabled=true;
  if(await tryLogin(p)){pw=p;document.getElementById("ls").style.display="none";document.getElementById("app").style.display="block";load()}
  else{document.getElementById("le").style.display="block";b.textContent="Sign in";b.disabled=false}
}
document.getElementById("lo").addEventListener("click",function(){location.reload()});
async function load(){var r=await fetch("/api/services");svcs=await r.json();table()}
function cats(){return[...new Set(svcs.map(function(s){return s.category}))].sort()}
function table(){
  var q=aq.toLowerCase();
  var f=svcs.filter(function(s){return!q||(s.name||"").toLowerCase().includes(q)||(s.category||"").toLowerCase().includes(q)||(s.description||"").toLowerCase().includes(q)});
  document.getElementById("st").textContent=f.length+" of "+svcs.length+" services";
  var tb=document.getElementById("tbody"),es=document.getElementById("es");
  if(!f.length){tb.innerHTML="";es.style.display="block";return}
  es.style.display="none";
  tb.innerHTML=f.map(function(s){
    var c=[s.phone,s.email,s.website].filter(Boolean).join("<br>");
    return"<tr>"
      +"<td class='nc'>"+esc(s.name)+"</td>"
      +"<td class='cc'><span>"+esc(s.category)+"</span></td>"
      +"<td class='mc'>"+(c||"-")+"</td>"
      +"<td class='mc'>"+(s.description?esc(s.description):"-")+"</td>"
      +"<td class='ac'>"
        +"<button class='btn2 bg2 bs' onclick='openEdit(\""+s.id+"\")'>Edit</button>"
        +"<button class='btn2 bd bs' onclick='openDel(\""+s.id+"\")'>Delete</button>"
      +"</td></tr>";
  }).join("");
}
document.getElementById("as").addEventListener("input",function(e){aq=e.target.value;table()});
document.getElementById("ab").addEventListener("click",function(){openEdit(null)});
document.getElementById("mc").addEventListener("click",closeMo);
document.getElementById("mo").addEventListener("click",function(e){if(e.target===e.currentTarget)closeMo()});
function openEdit(id){
  editId=id;
  var s=id?svcs.find(function(x){return x.id===id}):null;
  document.getElementById("mt").textContent=id?"Edit service":"Add service";
  document.getElementById("fn").value=s&&s.name||"";
  document.getElementById("fc").value=s&&s.category||"";
  document.getElementById("fp").value=s&&s.phone||"";
  document.getElementById("fwa").value=s&&s.wa||"";
  document.getElementById("fe").value=s&&s.email||"";
  document.getElementById("fw").value=s&&s.website||"";
  document.getElementById("fd").value=s&&s.description||"";
  var dl=document.getElementById("cl");
  dl.innerHTML=cats().map(function(c){return"<option value='"+esc(c)+"'>"}).join("");
  document.getElementById("mo").classList.remove("hidden");
  document.getElementById("fn").focus();
}
function closeMo(){document.getElementById("mo").classList.add("hidden");editId=null}
document.getElementById("ms").addEventListener("click",async function(){
  var nm=document.getElementById("fn").value.trim(),ct=document.getElementById("fc").value.trim();
  if(!nm||!ct){toast("Name and category are required");return}
  var pay={name:nm,category:ct,phone:document.getElementById("fp").value.trim()||undefined,wa:document.getElementById("fwa").value.trim()||undefined,email:document.getElementById("fe").value.trim()||undefined,website:document.getElementById("fw").value.trim()||undefined,description:document.getElementById("fd").value.trim()||undefined};
  var b=document.getElementById("ms");b.textContent="Saving...";b.disabled=true;
  try{
    var r=editId
      ?await fetch("/api/services/"+editId,{method:"PUT",headers:{"Content-Type":"application/json","X-Admin-Password":pw},body:JSON.stringify(pay)})
      :await fetch("/api/services",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Password":pw},body:JSON.stringify(pay)});
    if(r.status===401){toast("Session expired");location.reload();return}
    if(!r.ok)throw new Error();
    await load();closeMo();toast(editId?"Service updated":"Service added");
  }catch(e){toast("Something went wrong")}
  finally{b.textContent="Save";b.disabled=false}
});
function openDel(id){
  delId=id;
  var s=svcs.find(function(x){return x.id===id});
  document.getElementById("cm").textContent="Delete \""+(s&&s.name||"this service")+"\"? This cannot be undone.";
  document.getElementById("co").classList.remove("hidden");
}

// ── Jobs Board tab ────────────────────────────────────────────────────────
var jobs=[];
function switchTab(t){
  document.getElementById("pane-dir").style.display=t==="dir"?"block":"none";
  document.getElementById("pane-jobs").style.display=t==="jobs"?"block":"none";
  document.getElementById("tab-dir").className="atab"+(t==="dir"?" active":"");
  document.getElementById("tab-jobs").className="atab"+(t==="jobs"?" active":"");
  if(t==="jobs"&&!jobs.length)loadJobs();
}
async function loadJobs(){
  var r=await fetch("/api/admin/projects",{headers:{"X-Admin-Password":pw}});
  jobs=await r.json();
  renderJobs();
}
function renderJobs(){
  var open=jobs.filter(function(j){return j.status!=="closed";});
  var flagged=open.filter(function(j){return j.reported;});
  var badge=document.getElementById("flagged-badge");
  if(flagged.length){badge.textContent=flagged.length+" flagged";badge.style.display="inline";}
  else badge.style.display="none";
  var el=document.getElementById("jobs-list");
  if(!open.length){el.innerHTML='<p style="color:var(--m);font-size:.88rem">No open jobs.</p>';return;}
  // Sort: flagged first
  open.sort(function(a,b){return (b.reported?1:0)-(a.reported?1:0);});
  el.innerHTML=open.map(function(j){
    var contacts=([j.contactName,j.contactPhone,j.contactEmail].filter(Boolean).join(" · "))||"None";
    return'<div class="jcard'+(j.reported?" flagged":"")+'">'
      +(j.reported?'<div class="jcard-flag">&#x1F6A9; Flagged by community ('+j.reportCount+' report'+(j.reportCount===1?"":"s")+')</div>':"")
      +'<div class="jcard-title">'+esc(j.title)+'</div>'
      +'<div class="jcard-meta">'+esc(j.category)+' &nbsp;·&nbsp; '+esc(j.budget)+' &nbsp;·&nbsp; '+esc(j.timeline)+'</div>'
      +(j.description?'<div style="font-size:.83rem;color:var(--m);margin-bottom:6px">'+esc(j.description)+'</div>':"")
      +'<div class="jcard-contact">&#x1F4DE; '+esc(contacts)+'</div>'
      +'<div style="font-size:.78rem;color:var(--m);margin-bottom:8px">'+((j.responses||[]).length)+' response(s) &nbsp;·&nbsp; posted '+new Date(j.createdAt).toLocaleDateString("en-GB")+'</div>'
      +'<button onclick="adminCloseJob(\''+j.id+'\')" style="background:#fee2e2;color:#dc2626;border:none;border-radius:6px;padding:6px 12px;font-size:.8rem;cursor:pointer">Remove post</button>'
      +'</div>';
  }).join("");
}
async function adminCloseJob(id){
  if(!confirm("Remove this job post? It will no longer be visible to residents."))return;
  var r=await fetch("/api/admin/projects/"+id+"/close",{method:"POST",headers:{"X-Admin-Password":pw}});
  if(r.ok){jobs=[];await loadJobs();toast("Job post removed");}
  else toast("Something went wrong");
}
document.getElementById("cc").addEventListener("click",function(){document.getElementById("co").classList.add("hidden");delId=null});
document.getElementById("cd").addEventListener("click",async function(){
  if(!delId)return;
  var b=document.getElementById("cd");b.textContent="Deleting...";b.disabled=true;
  try{
    var r=await fetch("/api/services/"+delId,{method:"DELETE",headers:{"X-Admin-Password":pw}});
    if(r.status===401){toast("Session expired");location.reload();return}
    document.getElementById("co").classList.add("hidden");delId=null;
    await load();toast("Service deleted");
  }catch(e){toast("Something went wrong")}
  finally{b.textContent="Delete";b.disabled=false}
});
</script>
</body>
</html>`;

// ── 404 page ───────────────────────────────────────────────────────────────
function notFoundHTML(title, msg) {
  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>'
    +'<title>'+title+' | Whitehouse MK</title>'
    +'<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f3f4f6;color:#111827;min-height:100vh;display:flex;flex-direction:column}'
    +'header{background:linear-gradient(135deg,#1b4332,#2d6a4f);color:#fff;padding:14px 16px}'
    +'header a{color:rgba(255,255,255,.8);text-decoration:none;font-size:.88rem}'
    +'.body{flex:1;display:flex;align-items:center;justify-content:center;padding:40px 20px;text-align:center}'
    +'.box{background:#fff;border-radius:14px;padding:40px 32px;max-width:400px;border:1px solid #e5e7eb}'
    +'.num{font-size:3rem;font-weight:800;color:#2d6a4f;margin-bottom:8px}'
    +'h1{font-size:1.2rem;margin-bottom:10px}'
    +'p{font-size:.9rem;color:#6b7280;line-height:1.5}'
    +'p a{color:#2d6a4f;font-weight:600}'
    +'</style></head><body>'
    +'<header><a href="/">&#8592; Whitehouse Community Directory</a></header>'
    +'<div class="body"><div class="box"><div class="num">404</div><h1>'+title+'</h1><p>'+msg+'</p></div></div>'
    +'</body></html>';
}

// ── Router ─────────────────────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    var url = new URL(request.url);
    var path = url.pathname;
    var method = request.method;

    if (path === "/" || path === "")               return htmlRes(INDEX_HTML);
    if (path === "/projects" || path === "/projects/") return htmlRes(PROJECTS_HTML);
    if (path === "/submit" || path === "/submit/") return htmlRes(SUBMIT_HTML);
    if (path === "/admin"  || path === "/admin/")  return htmlRes(ADMIN_HTML);
    if (path === "/about"  || path === "/about/")  return htmlRes(aboutPageHTML());
    if (path === "/sitemap.xml")                   return sitemapXML(env);
    if (path === "/robots.txt")                    return new Response("User-agent: *\nAllow: /\nSitemap: https://whitehousemk.uk/sitemap.xml", { headers: { "Content-Type": "text/plain" } });

    // Normalise path — strip trailing slash for matching
    var normPath = path.replace(/\/$/, "") || "/";

    // Category pages: /services/plumbers-milton-keynes
    var cp = normPath.match(/^\/services\/([^/]+)$/);
    if (cp) {
      var allSvcs = await loadServices(env);
      var catSlugReq = cp[1];
      // 301 redirect old URLs (/services/plumbers) to new (/services/plumbers-milton-keynes)
      if (!catSlugReq.endsWith("-milton-keynes")) {
        var redirectCatSlug = catSlugReq + "-milton-keynes";
        var hasRedirectMatch = allSvcs.some(function(s){ return s.catSlug === redirectCatSlug; });
        if (hasRedirectMatch) {
          return new Response(null, { status: 301, headers: { Location: "/services/" + redirectCatSlug } });
        }
      }
      var catMatch = allSvcs.filter(function(s){ return s.catSlug === catSlugReq; });
      if (catMatch.length) return htmlRes(categoryPageHTML(catMatch[0].category, catMatch));
      return htmlRes(notFoundHTML("Category not found", "We couldn't find that category. <a href='/'>Browse all services</a>"));
    }

    // Individual service pages: /services/plumbers-milton-keynes/andrew-jones
    // Match on slug only — category prefix is for SEO display, not routing
    var sp = normPath.match(/^\/services\/([^/]+)\/([^/]+)$/);
    if (sp) {
      var allSvcs2 = await loadServices(env);
      var catSlugReq2 = sp[1];
      var slugReq = sp[2];
      var svc = allSvcs2.find(function(s){
        return s.slug === slugReq || slugify(s.name) === slugReq;
      });
      if (!svc) return htmlRes(notFoundHTML("Service not found", "We couldn't find that listing. <a href='/'>Browse all services</a>"));
      // 301 redirect if old-style catSlug in URL (no -milton-keynes)
      if (!catSlugReq2.endsWith("-milton-keynes")) {
        var correctCatSlug = svc.catSlug || (slugify(svc.category) + "-milton-keynes");
        return new Response(null, { status: 301, headers: { Location: "/services/" + correctCatSlug + "/" + slugReq } });
      }
      return htmlRes(servicePageHTML(svc));
    }

    if (path === "/api/services") {
      if (method === "GET")  return apiGetAll(env);
      if (method === "POST") return apiAdminAdd(request, env);
    }
    if (path === "/api/submit" && method === "POST") {
      return apiSubmit(request, env);
    }

    var m = path.match(/^\/api\/services\/([^/]+)$/);
    if (m) {
      if (method === "PUT")    return apiAdminUpdate(request, env, m[1]);
      if (method === "DELETE") return apiAdminDelete(request, env, m[1]);
    }

    // Projects API
    if (path === "/api/projects") {
      if (method === "GET")  return apiGetProjects(request, env);
      if (method === "POST") return apiCreateProject(request, env);
    }
    var pm = path.match(/^\/api\/projects\/([^/]+)\/respond$/);
    if (pm && method === "POST") return apiRespondToProject(request, env, pm[1]);
    var prm = path.match(/^\/api\/projects\/([^/]+)\/report$/);
    if (prm && method === "POST") return apiReportProject(request, env, prm[1]);
    if (path === "/api/admin/projects") {
      if (method === "GET") return apiAdminGetProjects(request, env);
    }
    var pcm = path.match(/^\/api\/admin\/projects\/([^/]+)\/close$/);
    if (pcm && method === "POST") return apiAdminCloseProject(request, env, pcm[1]);

    return new Response("Not found", { status: 404 });
  },
};
