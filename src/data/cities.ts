export interface CityInfo {
  name: string
  slug: string
  state: string
}

export const STATE_CITIES: Record<string, string[]> = {
  "ANDAMAN AND NICOBAR ISLANDS": [
    "Port Blair", "Diglipur", "Garacharma", "Bambooflat", "Mayabunder", "Rangat"
  ],
  "ANDHRA PRADESH": [
    "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kadapa",
    "Kakinada", "Anantapur", "Vizianagaram", "Eluru", "Ongole", "Nandyal", "Machilipatnam", "Tenali",
    "Proddatur", "Chittoor", "Hindupur", "Bhimavaram", "Madanapalle", "Guntakal", "Srikakulam", "Dharmavaram",
    "Gudivada", "Narasaraopet", "Tadipatri", "Tadepalligudem", "Chilakaluripet", "Yemmiganur"
  ],
  "ARUNACHAL PRADESH": [
    "Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Bomdila", "Tezu", "Roing",
    "Namsai", "Changlang", "Aalo"
  ],
  "ASSAM": [
    "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon",
    "Karimganj", "Sivasagar", "Goalpara", "Barpeta", "Dhubri", "North Lakhimpur", "Diphu", "Lumding",
    "Mangaldai", "Haflong", "Golaghat", "Kokrajhar"
  ],
  "BIHAR": [
    "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah",
    "Begusarai", "Katihar", "Munger", "Chhapra", "Danapur", "Saharsa", "Sasaram", "Hajipur",
    "Dehri", "Bettiah", "Motihari", "Bagaha", "Siwan", "Kishanganj", "Jamalpur", "Buxar",
    "Jehanabad", "Aurangabad", "Nawada", "Madhubani", "Samastipur", "Sitamarhi", "Bhabua", "Gopalganj"
  ],
  "CHANDIGARH": [
    "Chandigarh"
  ],
  "CHHATTISGARH": [
    "Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Jagdalpur", "Raigarh", "Ambikapur",
    "Durg", "Dhamtari", "Mahasamund", "Chirmiri", "Bhatapara", "Kanker", "Kawardha", "Bemetara",
    "Kondagaon", "Balod"
  ],
  "DADRA AND NAGAR HAVELI AND DAMAN AND DIU": [
    "Daman", "Diu", "Silvassa", "Naroli"
  ],
  "DELHI": [
    "New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi", "Central Delhi",
    "North East Delhi", "North West Delhi", "South East Delhi", "South West Delhi", "Shahdara",
    "Dwarka", "Rohini", "Saket", "Connaught Place", "Karol Bagh", "Lajpat Nagar", "Janakpuri"
  ],
  "GOA": [
    "Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Canacona", "Pernem"
  ],
  "GUJARAT": [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar",
    "Anand", "Navsari", "Morbi", "Nadiad", "Surendranagar", "Bharuch", "Mehsana", "Bhuj",
    "Porbandar", "Palanpur", "Valsad", "Vapi", "Gondal", "Veraval", "Godhra", "Patan",
    "Dahod", "Botad", "Amreli", "Deesa", "Jetpur", "Ankleshwar", "Gandhidham", "Modasa",
    "Himatnagar", "Vyara", "Ahwa", "Wankaner", "Bardoli", "Keshod", "Dhoraji", "Una"
  ],
  "HARYANA": [
    "Gurgaon", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal",
    "Sonipat", "Panchkula", "Bhiwani", "Sirsa", "Bahadurgarh", "Jind", "Thanesar", "Kaithal",
    "Rewari", "Palwal", "Hansi", "Narnaul", "Fatehabad", "Gohana", "Tohana", "Narwana",
    "Charkhi Dadri", "Manesar", "Pehowa", "Saha"
  ],
  "HIMACHAL PRADESH": [
    "Shimla", "Dharamshala", "Solan", "Mandi", "Kullu", "Manali", "Baddi", "Nahan",
    "Hamirpur", "Una", "Bilaspur", "Chamba", "Paonta Sahib", "Kangra", "Sundernagar", "Palampur"
  ],
  "JAMMU AND KASHMIR": [
    "Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua", "Sopore", "Udhampur", "Rajouri",
    "Poonch", "Kupwara", "Pulwama", "Samba", "Ganderbal", "Budgam", "Bandipora", "Kulgam", "Shopian", "Reasi"
  ],
  "JHARKHAND": [
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Deoghar", "Phusro", "Hazaribagh", "Giridih",
    "Ramgarh", "Medininagar", "Chaibasa", "Gumla", "Dumka", "Godda", "Sahibganj", "Pakur",
    "Chatra", "Simdega", "Jhumri Telaiya", "Chakradharpur"
  ],
  "KARNATAKA": [
    "Bangalore", "Mysore", "Hubli-Dharwad", "Mangalore", "Belgaum", "Gulbarga", "Davanagere", "Bellary",
    "Bijapur", "Shimoga", "Tumkur", "Raichur", "Bidar", "Hospet", "Hassan", "Gadag-Betageri",
    "Udupi", "Robertsonpet", "Bhadravati", "Chitradurga", "Kolar", "Mandya", "Chikmagalur", "Gangavati",
    "Bagalkot", "Ranebennuru", "Karwar", "Sirsi", "Haveri", "Yadgir", "Chamarajanagar", "Ramanagara", "Gokak"
  ],
  "KERALA": [
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Kannur", "Alappuzha", "Palakkad",
    "Kottayam", "Malappuram", "Manjeri", "Thalassery", "Ponnani", "Vatakara", "Kanhangad", "Payyanur",
    "Kasaragod", "Kalpetta", "Thodupuzha", "Pathanamthitta", "Changanassery", "Kayamkulam"
  ],
  "LADAKH": [
    "Leh", "Kargil", "Diskit", "Padum"
  ],
  "LAKSHADWEEP": [
    "Kavaratti", "Agatti", "Andrott", "Amini", "Minicoy"
  ],
  "MADHYA PRADESH": [
    "Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna",
    "Ratlam", "Rewa", "Katni", "Singrauli", "Burhanpur", "Khandwa", "Bhind", "Chhindwara",
    "Guna", "Shivpuri", "Vidisha", "Chhatarpur", "Damoh", "Mandsaur", "Khargone", "Neemuch",
    "Pithampur", "Narmadapuram", "Sehore", "Betul", "Seoni", "Datia", "Dhar", "Nagda",
    "Itarsi", "Shahdol", "Tikamgarh", "Balaghat", "Ashoknagar", "Barwani", "Harda", "Raisen",
    "Rajgarh", "Sheopur", "Sidhi", "Umaria", "Dindori", "Anuppur", "Alirajpur", "Maihar",
    "Mauganj", "Pandhurna", "Niwari", "Mandla", "Shajapur", "Agar Malwa", "Sarni"
  ],
  "MAHARASHTRA": [
    "Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Kalyan-Dombivli", "Vasai-Virar", "Chhatrapati Sambhaji Nagar",
    "Navi Mumbai", "Solapur", "Mira-Bhayandar", "Bhiwandi", "Amravati", "Nanded", "Kolhapur", "Ulhasnagar",
    "Sangli", "Malegaon", "Jalgaon", "Akola", "Latur", "Dhule", "Ahilyanagar", "Chandrapur",
    "Parbhani", "Ichalkaranji", "Jalna", "Ambarnath", "Bhusawal", "Panvel", "Badlapur", "Beed",
    "Gondia", "Satara", "Barshi", "Yavatmal", "Achalpur", "Dharashiv", "Nandurbar", "Wardha",
    "Udgir", "Hinganghat", "Ratnagiri", "Sindhudurg", "Bhandara", "Buldhana", "Washim", "Gadchiroli", "Palghar", "Karad"
  ],
  "MANIPUR": [
    "Imphal", "Churachandpur", "Thoubal", "Bishnupur", "Ukhrul", "Senapati", "Kakching", "Tamenglong"
  ],
  "MEGHALAYA": [
    "Shillong", "Tura", "Jowai", "Nongpoh", "Baghmara", "Williamnagar", "Resubelpara", "Mairang"
  ],
  "MIZORAM": [
    "Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Lawngtlai", "Saiha", "Hnahthial"
  ],
  "NAGALAND": [
    "Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Mon", "Phek", "Chumoukedima"
  ],
  "ODISHA": [
    "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak",
    "Baripada", "Jharsuguda", "Jeypore", "Bargarh", "Rayagada", "Bolangir", "Angul", "Dhenkanal",
    "Kendrapara", "Paradeep", "Jajpur", "Koraput"
  ],
  "PUDUCHERRY": [
    "Puducherry", "Karaikal", "Mahe", "Yanam", "Oulgaret"
  ],
  "PUNJAB": [
    "Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur",
    "Batala", "Pathankot", "Moga", "Abohar", "Malerkotla", "Khanna", "Muktsar", "Barnala",
    "Firozpur", "Kapurthala", "Rajpura", "Mansa", "Fazilka", "Sangrur", "Faridkot", "Nawanshahr", "Tarn Taran", "Zirakpur"
  ],
  "RAJASTHAN": [
    "Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar",
    "Bharatpur", "Sikar", "Pali", "Sri Ganganagar", "Jhunjhunu", "Chittorgarh", "Jaisalmer", "Nagaur",
    "Beawar", "Balotra", "Barmer", "Banswara", "Baran", "Bundi", "Churu", "Dausa",
    "Dholpur", "Dungarpur", "Hanumangarh", "Jalore", "Jhalawar", "Karauli", "Pratapgarh", "Rajsamand",
    "Sawai Madhopur", "Sirohi", "Tonk", "Anupgarh", "Deeg", "Didwana-Kuchaman", "Dudu", "Gangapur City",
    "Jaipur Rural", "Jodhpur Rural", "Kotputli-Behror", "Khairthal-Tijara", "Neem Ka Thana", "Phalodi", "Salumbar", "Sanchore",
    "Shahpura", "Kekri"
  ],
  "SIKKIM": [
    "Gangtok", "Namchi", "Geyzing", "Mangan", "Ravangla", "Rangpo", "Singtam"
  ],
  "TAMIL NADU": [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode", "Tirunelveli",
    "Vellore", "Thoothukudi", "Dindigul", "Thanjavur", "Ranipet", "Sivakasi", "Karur", "Udhagamandalam",
    "Hosur", "Nagercoil", "Kanchipuram", "Kumbakonam", "Cuddalore", "Tiruvannamalai", "Pollachi", "Rajapalayam",
    "Pudukkottai", "Ambur", "Nagapattinam", "Villupuram", "Paramakudi", "Arakkonam", "Tiruvallur"
  ],
  "TELANGANA": [
    "Hyderabad", "Secunderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar",
    "Nalgonda", "Adilabad", "Suryapet", "Siddipet", "Miryalaguda", "Jagtial", "Nirmal", "Mancherial",
    "Kothagudem", "Kamareddy", "Bodhan", "Palwancha", "Vikarabad", "Medak", "Gadwal"
  ],
  "TRIPURA": [
    "Agartala", "Dharmanagar", "Udaipur", "Kailashahar", "Belonia", "Khowai", "Teliamura", "Ambassa", "Sabroom"
  ],
  "UTTAR PRADESH": [
    "Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Bareilly",
    "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Noida", "Greater Noida", "Firozabad", "Jhansi",
    "Muzaffarnagar", "Mathura", "Ayodhya", "Budaun", "Rampur", "Shahjahanpur", "Farrukhabad", "Hapur",
    "Etawah", "Mirzapur", "Bulandshahr", "Sambhal", "Amroha", "Hardoi", "Fatehpur", "Raebareli",
    "Orai", "Sitapur", "Bahraich", "Modinagar", "Unnao", "Jaunpur", "Lakhimpur", "Hathras",
    "Banda", "Pilibhit", "Barabanki", "Khurja", "Gonda", "Mainpuri", "Lalitpur", "Deoria",
    "Azamgarh", "Basti", "Ballia", "Ghazipur", "Sultanpur", "Kasganj", "Bijnor", "Shamli", "Amethi", "Bhadohi"
  ],
  "UTTARAKHAND": [
    "Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Nainital",
    "Pithoragarh", "Almora", "Mussoorie", "Kotdwar", "Ramnagar", "Tehri", "Chamoli", "Uttarkashi", "Bageshwar"
  ],
  "WEST BENGAL": [
    "Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Malda", "Baharampur",
    "Habra", "Kharagpur", "Shantipur", "Dankuni", "Ranaghat", "Haldia", "Krishnanagar", "Nabadwip",
    "Midnapore", "Jalpaiguri", "Balurghat", "Basirhat", "Bankura", "Darjeeling", "Purulia", "Cooch Behar",
    "Raiganj", "Alipurduar", "Barasat", "Bangaon", "Chinsurah", "Bishnupur"
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
