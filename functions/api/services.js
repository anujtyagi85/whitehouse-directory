// Seed data — baked in so the first page load auto-populates the KV store
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
  { name: "George Boland – GB Electrical", category: "Electricians", phone: "07411 689970", description: "Whitehouse based" },
  { name: "Andrew Jones", category: "Electricians", phone: "07845 915231", description: "Electrical installs and repairs" },
  { name: "Andrew Hudson", category: "Electricians", phone: "+44 7917 612309", description: "Handyman and electrician" },
  { name: "RiverRun Decorating – Tony", category: "Decorating & Flooring", phone: "07748116331" },
  { name: "Sea Bonito Event Decoration", category: "Decorating & Flooring", phone: "07830406886", website: "https://www.instagram.com/sea_bonito_decor" },
  { name: "Costel Covaci", category: "Decorating & Flooring", phone: "0794 359 3667", description: "Specialist in engineered, laminate and LVT flooring" },
  { name: "Shenley Flooring", category: "Decorating & Flooring", description: "Vinyl and bathroom flooring" },
  { name: "Martyn", category: "Handymen & Maintenance", phone: "07772 629806", description: "Furniture assembly, garden maintenance, general home maintenance" },
  { name: "Trevor Long – The Appliance Man", category: "Handymen & Maintenance", phone: "07581017211" },
  { name: "Ashraf – Carpenter & Handyman", category: "Handymen & Maintenance", phone: "07570449055", description: "Doors, shelves, curtain rails, TV wall mounting, general woodwork. Always available." },
  { name: "Andrew Hudson", category: "Handymen & Maintenance", phone: "+44 7917 612309", description: "Handyman and electrician" },
  { name: "Harry Gardening MK", category: "Gardening & Landscaping", phone: "+44 7455 917027" },
  { name: "Glen Gardener", category: "Gardening & Landscaping", phone: "+44 7894 428946" },
  { name: "Richard Gardener", category: "Gardening & Landscaping", phone: "+44 7412 452457" },
  { name: "JLR Garden Maintenance", category: "Gardening & Landscaping", phone: "+44 7788 213772" },
  { name: "Peter Gardener", category: "Gardening & Landscaping", phone: "+44 7754 812350" },
  { name: "Pawel Window Cleaner", category: "Window Cleaning", phone: "07598 982444" },
  { name: "Top Cat Window Cleaning – Terry", category: "Window Cleaning", phone: "07947 696751" },
  { name: "Spotless Window Cleaning", category: "Window Cleaning", website: "https://spotlessmk.co.uk" },
  { name: "Roberts Window Cleaning", category: "Window Cleaning", description: "Recommended" },
  { name: "Ioana – Local Cleaner", category: "Cleaning & Car Valeting", phone: "07778664710" },
  { name: "Spotless MK", category: "Cleaning & Car Valeting", website: "https://spotlessmk.co.uk" },
  { name: "Wecasa Cleaning", category: "Cleaning & Car Valeting", website: "https://wecasa.co.uk/domestic-cleaning" },
  { name: "Cleaner Bins MK", category: "Cleaning & Car Valeting", description: "Wheelie bin cleaning" },
  { name: "MK Pure Valet", category: "Cleaning & Car Valeting", phone: "+44 7591 087655", description: "Premium car care" },
  { name: "CCM Blinds – Callum", category: "Blinds & Interiors", phone: "07702 657961", website: "https://ccmblinds.com" },
  { name: "Diya Design LTD – Dee", category: "Design Services", phone: "07903885992", email: "info@diyadesign.com", description: "Logo design, branding, website design & digital design services" },
  { name: "Karishma – GCSE Tutor", category: "Childcare & Tutors", phone: "+44 7448 610242" },
  { name: "Abirami Maths Tuition", category: "Childcare & Tutors", phone: "+44 7551 353189" },
  { name: "SENshine Tutoring – Karina Mistry", category: "Childcare & Tutors", phone: "07884939973", email: "SENshinetutoring.mk@gmail.com", description: "1:1 tutoring" },
  { name: "Ashbourne Nursery", category: "Childcare & Tutors", description: "Oxley Park. Excellent reputation." },
  { name: "Ducklings Preschool", category: "Childcare & Tutors", description: "Friendly, multiple branches." },
  { name: "Acorn Nurseries", category: "Childcare & Tutors", description: "Jubilee Wood / Cold Harbour / Shenley. Highly rated." },
  { name: "Woodlands Nursery", category: "Childcare & Tutors", description: "Downs Barn. Highly praised." },
  { name: "Hampstead Gate Nursery", category: "Childcare & Tutors", description: "Positive feedback from parents." },
  { name: "Small Wonders", category: "Childcare & Tutors", description: "Crownhill. Recommended by parents." },
  { name: "Magic Hands Andria", category: "Hair & Beauty", phone: "+44 7999 792107", description: "Mobile hair and styling" },
  { name: "Rachel's Salon Room", category: "Hair & Beauty", phone: "07512 608473", description: "Home salon" },
  { name: "Leafy – Mobile Hairdresser", category: "Hair & Beauty", phone: "07983 225616" },
  { name: "Arthi – Hair & Makeup", category: "Hair & Beauty", phone: "+44 7809 446769", description: "Hair and makeup, Great Holm" },
  { name: "360 Hair & Scalp", category: "Hair & Beauty", phone: "07707606091", website: "https://www.360hairandscalp.com", description: "Hair restoration clinic, certified trichologist" },
  { name: "Ushi's Beauty", category: "Hair & Beauty", phone: "07866 335938", description: "Waxing and threading beauty services" },
  { name: "Henna By Moxa", category: "Bridal & Henna", website: "https://www.instagram.com/hennabymoxa", description: "Recommended henna artist" },
  { name: "Bhumika – Henna Artist", category: "Bridal & Henna", description: "Local henna artist" },
  { name: "Waggy Tales Dog Daycare", category: "Pet Services", website: "https://waggytales-dogdaycare.co.uk" },
  { name: "Janey – Dog Walker & Pet Sitter", category: "Pet Services", description: "Contact via Facebook" },
  { name: "Cross Roads Kennels", category: "Pet Services", description: "Recommended" },
  { name: "Kingswood Farm Kennels", category: "Pet Services", description: "Recommended" },
  { name: "Just Idlies", category: "Food & Catering", phone: "07880 315565", description: "Catering and tiffin meals" },
  { name: "A Mocktail Fusion Ltd", category: "Food & Catering", phone: "07539 637794", description: "Event drinks, desserts, snacks" },
  { name: "Assma's Kitchen – Egyptian Food", category: "Food & Catering", phone: "07789122167" },
  { name: "Mo's Kitchen", category: "Food & Catering", phone: "07428214725", description: "Luxury catering, African cuisine, cakes & cake pops" },
  { name: "Uni Food Kitchen", category: "Food & Catering", phone: "+44 7938 893318", description: "Birthday cakes and Turkish food" },
  { name: "Rasaa – Indian Catering", category: "Food & Catering", phone: "+44 7823798524", website: "https://www.rasaaindiankitchen.com", description: "Indian grazing tables and catering services" },
  { name: "Rizwaan – Driving Instructor", category: "Driving Instructors", phone: "07399 121786" },
  { name: "Kamal – Driving Instructor", category: "Driving Instructors", phone: "+44 7903 882994" },
  { name: "Sam Gomes – Driving Instructor", category: "Driving Instructors", phone: "+44 7854 131989" },
  { name: "Leah – LM Driving", category: "Driving Instructors", phone: "+44 7599 466957" },
  { name: "Dan Woodall – Driving Instructor", category: "Driving Instructors", description: "Recommended" },
  { name: "Sonjoy Saha – Driving Instructor", category: "Driving Instructors", phone: "+44 7411309963" },
  { name: "Sandlight Travels", category: "Travel", phone: "07403 849749" },
  { name: "Wahid Archery", category: "Event Services", phone: "07472 142963", description: "Mobile archery events" },
  { name: "Sea Bonito Event Decorations", category: "Event Services", phone: "07830406886", website: "https://www.instagram.com/sea_bonito_decor" },
  { name: "Mani's Cab Service", category: "Taxis & Transport", phone: "07780 208667" },
  { name: "Andy Cushion – Man With Van", category: "Taxis & Transport", phone: "+44 7850 479650" },
  { name: "Nigel – Man With Van", category: "Taxis & Transport", phone: "+44 7973 317334" },
  { name: "Pawel Szup – Man With Van", category: "Taxis & Transport", phone: "+44 7365 815674" },
  { name: "Dan Garside – Local Locksmith", category: "Locksmiths", phone: "+44 7984 866788" },
  { name: "Lindal Security Limited", category: "Locksmiths", phone: "01908 645414", description: "Key cutting services" },
  { name: "Tobias – Physiotherapy & Fitness", category: "Health & Fitness", phone: "07880 901403" },
  { name: "Invicta Accounting – Neil", category: "Financial Services", phone: "+44 7814 497130" },
  { name: "The Mortgage Store – Agnieszka", category: "Financial Services", phone: "07956 236803", email: "agnieszkas@the-mortgagestore.co.uk", description: "Mortgages and protection" },
  { name: "STAG Wealth Management – Wojciech", category: "Financial Services", phone: "07714 713353", email: "w.symonowicz@sjpp.co.uk", website: "https://www.stagwealthmanagement.co.uk", description: "Pensions and investments" },
  { name: "Light Tax Limited – Roxana", category: "Financial Services", phone: "07916 151838", email: "roxana@light-tax.co.uk", description: "Qualified accountant" },
  { name: "D'Morj Photography", category: "Photography", phone: "+44 7471 389211" },
  { name: "PranaLight Yoga – Neha", category: "Classes & Activities", phone: "07429387008" },
  { name: "JRDA Dance Academy", category: "Classes & Activities", phone: "07554163790", website: "https://jeyaraveendran.co.uk" },
  { name: "SERI Workout – Sudheerkumar", category: "Classes & Activities", phone: "07435386463", description: "CICL mobility + Zumba designed for 30+" },
  { name: "Rang By Shreya – Art Classes", category: "Classes & Activities", phone: "+44 7901181746", website: "https://www.instagram.com/rangbyshreya", description: "Art classes for kids: STEAM, calligraphy, seasonal craft workshops" },
  { name: "Diya Design – Craft Workshops", category: "Classes & Activities", phone: "07903885992", email: "deee.idc@gmail.com", description: "STEAM designing, calligraphy, seasonal creative craft workshops" },
  { name: "RentLocal – DIY Tool Hire", category: "Hire Services", phone: "07880498050", website: "https://rentlocal.uk" },
  { name: "Twin Stitch", category: "Tailoring & Alterations", phone: "07404 461274", email: "twinstitch.mk@gmail.com", description: "Clothing alterations & stitching, kids & adult dress alterations" },
  { name: "Uktranslate Bureau – Reham", category: "Translation & Legal", phone: "07502638380", email: "info@uktbureau.uk", description: "Translation, legalisation and notarisation" },
];

async function getServices(kv) {
  let services = await kv.get("services", "json");
  if (!services) {
    services = SEED.map((s, i) => ({ ...s, id: String(i + 1) }));
    await kv.put("services", JSON.stringify(services));
  }
  return services;
}

function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestGet({ env }) {
  const services = await getServices(env.SERVICES_KV);
  return Response.json(services);
}

export async function onRequestPost({ request, env }) {
  if (request.headers.get("X-Admin-Password") !== env.ADMIN_PASSWORD) {
    return unauthorized();
  }
  const body = await request.json();
  if (!body.name || !body.category) {
    return new Response(JSON.stringify({ error: "name and category are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const services = await getServices(env.SERVICES_KV);
  const newService = { ...body, id: crypto.randomUUID() };
  services.push(newService);
  await env.SERVICES_KV.put("services", JSON.stringify(services));
  return Response.json(newService, { status: 201 });
}
