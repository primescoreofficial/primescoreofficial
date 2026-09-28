export interface CityInfo {
  name: string
  slug: string
  state: string
}

export const STATE_CITIES: Record<string, string[]> = {
  "RAJASTHAN": [
    "Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar",
    "Bharatpur", "Sikar", "Pali", "Sri Ganganagar", "Jhunjhunu", "Chittorgarh", "Jaisalmer", "Nagaur",
    "Beawar", "Balotra", "Barmer", "Banswara", "Baran", "Bundi", "Churu", "Dausa",
    "Dholpur", "Dungarpur", "Hanumangarh", "Jalore", "Jhalawar", "Karauli", "Pratapgarh", "Rajsamand",
    "Sawai Madhopur", "Sirohi", "Tonk", "Anupgarh", "Deeg", "Didwana-Kuchaman", "Dudu", "Gangapur City",
    "Jaipur Rural", "Jodhpur Rural", "Kotputli-Behror", "Khairthal-Tijara", "Neem Ka Thana", "Phalodi", "Salumbar", "Sanchore",
    "Shahpura", "Kekri"
  ],
  "GUJARAT": [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar",
    "Anand", "Navsari", "Morbi", "Nadiad", "Surendranagar", "Bharuch", "Mehsana", "Bhuj",
    "Porbandar", "Palanpur", "Valsad", "Vapi", "Gondal", "Veraval", "Godhra", "Patan",
    "Dahod", "Botad", "Amreli", "Deesa", "Jetpur", "Ankleshwar", "Gandhidham", "Modasa",
    "Himatnagar", "Vyara", "Ahwa"
  ],
  "MADHYA PRADESH": [
    "Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna",
    "Ratlam", "Rewa", "Katni", "Singrauli", "Burhanpur", "Khandwa", "Bhind", "Chhindwara",
    "Guna", "Shivpuri", "Vidisha", "Chhatarpur", "Damoh", "Mandsaur", "Khargone", "Neemuch",
    "Pithampur", "Narmadapuram", "Sehore", "Betul", "Seoni", "Datia", "Dhar", "Nagda",
    "Itarsi", "Shahdol", "Tikamgarh", "Balaghat", "Ashoknagar", "Barwani", "Harda", "Raisen",
    "Rajgarh", "Sheopur", "Sidhi", "Umaria", "Dindori", "Anuppur", "Alirajpur", "Maihar",
    "Mauganj", "Pandhurna", "Niwari", "Mandla"
  ],
  "MAHARASHTRA": [
    "Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Kalyan-Dombivli", "Vasai-Virar", "Chhatrapati Sambhaji Nagar",
    "Navi Mumbai", "Solapur", "Mira-Bhayandar", "Bhiwandi", "Amravati", "Nanded", "Kolhapur", "Ulhasnagar",
    "Sangli", "Malegaon", "Jalgaon", "Akola", "Latur", "Dhule", "Ahilyanagar", "Chandrapur",
    "Parbhani", "Ichalkaranji", "Jalna", "Ambarnath", "Bhusawal", "Panvel", "Badlapur", "Beed",
    "Gondia", "Satara", "Barshi", "Yavatmal", "Achalpur", "Dharashiv", "Nandurbar", "Wardha",
    "Udgir", "Hinganghat", "Ratnagiri", "Sindhudurg", "Bhandara"
  ],
  "UTTAR PRADESH": [
    "Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Bareilly",
    "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Noida", "Greater Noida", "Firozabad", "Jhansi",
    "Muzaffarnagar", "Mathura", "Ayodhya", "Budaun", "Rampur", "Shahjahanpur", "Farrukhabad", "Hapur",
    "Etawah", "Mirzapur", "Bulandshahr", "Sambhal", "Amroha", "Hardoi", "Fatehpur", "Raebareli",
    "Orai", "Sitapur", "Bahraich", "Modinagar", "Unnao", "Jaunpur", "Lakhimpur", "Hathras",
    "Banda", "Pilibhit", "Barabanki", "Khurja", "Gonda", "Mainpuri", "Lalitpur", "Deoria"
  ],
  "DELHI NCR & HARYANA": [
    "New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi", "Gurgaon", "Faridabad", "Panipat",
    "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula", "Bhiwani",
    "Sirsa", "Bahadurgarh", "Jind", "Thanesar", "Kaithal", "Rewari", "Palwal", "Hansi",
    "Narnaul", "Fatehabad", "Gohana", "Tohana"
  ],
  "KARNATAKA": [
    "Bangalore", "Mysore", "Hubli-Dharwad", "Mangalore", "Belgaum", "Gulbarga", "Davanagere", "Bellary",
    "Bijapur", "Shimoga", "Tumkur", "Raichur", "Bidar", "Hospet", "Hassan", "Gadag-Betageri",
    "Udupi", "Robertsonpet", "Bhadravati", "Chitradurga", "Kolar", "Mandya", "Chikmagalur", "Gangavati",
    "Bagalkot", "Ranebennuru"
  ],
  "TELANGANA & ANDHRA PRADESH": [
    "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda",
    "Adilabad", "Suryapet", "Siddipet", "Miryalaguda", "Visakhapatnam", "Vijayawada", "Guntur", "Nellore",
    "Kurnool", "Rajahmundry", "Tirupati", "Kadapa", "Kakinada", "Anantapur", "Vizianagaram", "Eluru",
    "Ongole", "Nandyal", "Machilipatnam", "Tenali"
  ],
  "PUNJAB & CHANDIGARH": [
    "Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur",
    "Batala", "Pathankot", "Moga", "Abohar", "Malerkotla", "Khanna", "Muktsar", "Barnala",
    "Firozpur", "Kapurthala"
  ],
  "WEST BENGAL & BIHAR": [
    "Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Malda", "Baharampur",
    "Habra", "Kharagpur", "Shantipur", "Dankuni", "Patna", "Gaya", "Bhagalpur", "Muzaffarpur",
    "Purnia", "Darbhanga", "Bihar Sharif", "Arrah", "Begusarai", "Katihar", "Munger", "Chhapra",
    "Danapur", "Saharsa", "Sasaram", "Hajipur"
  ],
  "OTHER KEY REGIONS": [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Kochi", "Thiruvananthapuram",
    "Kozhikode", "Thrissur", "Bhubaneswar", "Cuttack", "Rourkela", "Raipur", "Bilaspur", "Ranchi",
    "Jamshedpur", "Dhanbad", "Guwahati", "Dehradun", "Haridwar", "Goa"
  ]
}

// Convert a city string to a clean URL slug
export function slugifyCity(cityName: string): string {
  return cityName
    .toLowerCase()
    .replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// Convert a slug back to a clean Title Case format
export function formatCityName(slugOrName: string): string {
  const clean = slugOrName.replace(/-/g, ' ').trim()
  return clean
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Generate the unified flat array of all cities
const cityListMap = new Map<string, CityInfo>()

Object.entries(STATE_CITIES).forEach(([state, cities]) => {
  cities.forEach(cityName => {
    const slug = slugifyCity(cityName)
    if (!cityListMap.has(slug)) {
      cityListMap.set(slug, {
        name: cityName,
        slug,
        state
      })
    }
  })
})

export const ALL_CITIES: CityInfo[] = Array.from(cityListMap.values())
export const ALL_CITY_SLUGS: string[] = ALL_CITIES.map(c => c.slug)

export function getCityBySlug(slug: string): CityInfo | undefined {
  return cityListMap.get(slug.toLowerCase().trim())
}
