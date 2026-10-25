/* Road to Italy — Universities database
   Each university image is loaded from images/universities/<id>.jpg
   (if the file is missing, an elegant fallback card is shown automatically).
   Programs are indicative: always confirm the current offer on each university's official site. */

const REGIONS = { north: 'Northern Italy', central: 'Central Italy', south: 'South & Islands' };

const UNIVERSITIES = [
  /* ===================== TOP / FEATURED ===================== */
  {
    id: 'padua', featured: true, region: 'north', name: 'University of Padua', ar: 'جامعة بادوفا', city: 'Padua', founded: 1222,
    tags: ['Computer Science', 'Data Engineering', 'Cybersecurity', 'AI'],
    about: 'One of the oldest and most prestigious universities in Europe and consistently ranked among Italy\'s best. Padua offers a strong research environment, a lively student city, and a wide range of English-taught programs with flexible online application procedures.',
    features: ['Founded in 1222 — among the oldest universities in the world', 'Top-ranked in Italy for research and teaching', 'Many English-taught master\'s programs', 'Student-friendly city close to Venice', 'Regional scholarships (DSU) available'],
    bachelor: ['Computer Engineering', 'Information Engineering', 'Statistics', 'Economics', 'Biology', 'Psychology'],
    master: ['Computer Science', 'Cybersecurity', 'Data Science', 'Artificial Intelligence (Computer Engineering)', 'ICT for Internet and Multimedia', 'Control Systems Engineering']
  },
  {
    id: 'polimi', featured: true, region: 'north', name: 'Politecnico di Milano', ar: 'بوليتكنيك ميلانو', city: 'Milan', founded: 1863,
    tags: ['Computer Engineering', 'AI', 'Data Analytics', 'Cloud'],
    about: 'Italy\'s leading technical university and one of the best engineering schools in the world. Strong partnerships with major tech companies (Google, IBM, Microsoft) open doors to internships and jobs after graduation.',
    features: ['Top engineering, architecture and design university in Italy', 'Strong industry links with global companies', 'Extensive English-taught offer at BSc and MSc levels', 'Located in Italy\'s economic capital', 'Modern labs and a large international community'],
    bachelor: ['Computer Science and Engineering', 'Electronic Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Architecture', 'Design'],
    master: ['Computer Science and Engineering', 'Artificial Intelligence', 'Data Science / Analytics', 'Cloud Computing', 'Telecommunication Engineering', 'Management Engineering']
  },
  {
    id: 'sapienza', featured: true, region: 'central', name: 'Sapienza University of Rome', ar: 'جامعة سابينزا روما', city: 'Rome', founded: 1303,
    tags: ['AI', 'Data Science', 'Cybersecurity', 'Software Engineering'],
    about: 'The largest university in Europe by number of students, offering a broad academic catalogue and strong research. Located in the capital, it combines an international atmosphere with many regional scholarships that can fully cover tuition for international students.',
    features: ['Largest university in Europe', 'Huge variety of courses and research opportunities', 'Capital-city life with major institutions and companies', 'Regional scholarships for international students', 'Well-known AI and cybersecurity research groups'],
    bachelor: ['Computer Engineering', 'Computer Science (Informatica)', 'Mechanical Engineering', 'Economics', 'Medicine & Surgery (English track)', 'Architecture'],
    master: ['Artificial Intelligence and Robotics', 'Data Science', 'Cybersecurity', 'Engineering in Computer Science', 'Software Engineering', 'Communication Engineering']
  },
  {
    id: 'bologna', featured: true, region: 'north', name: 'University of Bologna', ar: 'جامعة بولونيا', city: 'Bologna', founded: 1088,
    tags: ['AI', 'Computer Engineering', 'Advanced Data Science'],
    about: 'The oldest university in the Western world and a name recognized worldwide. Bologna attracts thousands of international students and stands out for the quality of its research and its AI laboratories.',
    features: ['Founded in 1088 — oldest university in the Western world', 'Excellent balance of research and practical application', 'Thousands of international students', 'Vibrant, affordable student city', 'Strong AI and data labs'],
    bachelor: ['Computer Science', 'Engineering (Electronics, Energy, Mechanics)', 'Economics & Management', 'Political Sciences', 'Agri-food Sciences'],
    master: ['Artificial Intelligence', 'Computer Science', 'Data Science', 'Computer Engineering', 'Automation Engineering', 'Digital Transformation Management']
  },
  /* ===================== OTHER MAJOR ===================== */
  {
    id: 'polito', featured: false, region: 'north', name: 'Politecnico di Torino', ar: 'بوليتكنيك تورينو', city: 'Turin', founded: 1859,
    tags: ['Computer Engineering', 'Data Science', 'Information Systems', 'Embedded Systems'],
    about: 'The oldest technical university in Italy, known for close ties with major industry (automotive, aerospace, ICT). An excellent choice for developers and engineers seeking applied programs and well-equipped labs.',
    features: ['Deep engineering and technical focus', 'Close collaboration with industry', 'Advanced labs with the latest computing technologies', 'Many English-taught programs', 'Lower living costs than Milan'],
    bachelor: ['Computer Engineering', 'Electronic Engineering', 'Mechanical Engineering', 'Automotive Engineering', 'Aerospace Engineering', 'Architecture'],
    master: ['Computer Engineering', 'Data Science and Engineering', 'ICT for Smart Societies', 'Embedded Systems', 'Cybersecurity', 'Automotive Engineering']
  },
  {
    id: 'unimi', featured: false, region: 'north', name: 'University of Milan', ar: 'جامعة ميلانو', city: 'Milan', founded: 1924,
    tags: ['Computer Science', 'Biotechnology', 'Quantum Computing'],
    about: 'A leading public research institution in Italy\'s economic capital. It combines quality teaching with innovation and offers wide professional opportunities with tech start-ups and big companies.',
    features: ['Top public research university in Milan', 'Strong ties with start-ups and industry', 'Excellent life-science and computing research', 'Rich cultural and professional environment', 'Wide English-taught master\'s offer'],
    bachelor: ['Computer Science', 'Mathematics', 'Physics', 'Biotechnology', 'Economics'],
    master: ['Computer Science (Cloud Systems)', 'Data Science for Economics', 'Quantum Computing & Information', 'Human-Centered AI', 'Biotechnology']
  },
  {
    id: 'pisa', featured: false, region: 'central', name: 'University of Pisa', ar: 'جامعة بيزا', city: 'Pisa', founded: 1343,
    tags: ['Computer Engineering', 'AI', 'Embedded Systems'],
    about: 'A historic university (home of Galileo Galilei) with a very strong academic standing in pure sciences and mathematics. Its computing programs are solid both theoretically and practically.',
    features: ['Birthplace of Galileo — historic academic prestige', 'Top Italian university in computer science', 'Strong mathematics and theory foundation', 'Compact, student-focused city', 'Excellent AI and data research'],
    bachelor: ['Computer Science', 'Computer Engineering', 'Mathematics', 'Physics', 'Electronic Engineering'],
    master: ['Computer Science', 'Artificial Intelligence', 'Data Science & Business Informatics', 'Embedded Computing Systems', 'Cybersecurity', 'Robotics and Automation']
  },
  {
    id: 'federico2', featured: false, region: 'south', name: 'University of Naples Federico II', ar: 'جامعة نابولي فيديريكو الثاني', city: 'Naples', founded: 1224,
    tags: ['Computer Engineering', 'Data Science', 'Distributed Systems'],
    about: 'One of the oldest public universities in the world, offering a reputable education at very affordable study and living costs, with particular strength in its engineering schools.',
    features: ['Founded in 1224 by Emperor Frederick II', 'Very reasonable living costs', 'Strong engineering schools', 'Large and diverse student community', 'English-taught options at master\'s level'],
    bachelor: ['Computer Engineering', 'Telecommunications Engineering', 'Mechanical Engineering', 'Aerospace Engineering', 'Computer Science'],
    master: ['Computer Engineering', 'Data Science', 'Automation & Robotics', 'Cybersecurity', 'Telecommunication Engineering']
  },

  /* ===================== NORTH ===================== */
  {
    id: 'trento', featured: false, region: 'north', name: 'University of Trento', ar: 'جامعة ترينتو', city: 'Trento', founded: 1962,
    tags: ['AI', 'Cognitive Science'],
    about: 'A research-driven university in the Alps, regularly among the top in Italy for quality of teaching and student services. Particularly distinguished in AI and cognitive-science research.',
    features: ['Top-ranked mid-size university in Italy', 'Excellent AI and cognitive science research', 'High-quality student services', 'Safe, green, mountain city', 'Strong international outlook'],
    bachelor: ['Computer Science', 'Information Engineering', 'Mathematics', 'Physics'],
    master: ['Artificial Intelligence Systems', 'Computer Science', 'Cognitive Science', 'Data Science', 'Cybersecurity']
  },
  {
    id: 'genoa', featured: false, region: 'north', name: 'University of Genoa', ar: 'جامعة جنوة', city: 'Genoa', founded: 1481,
    tags: ['Robotics', 'Computer Engineering', 'Naval Engineering'],
    about: 'A regional leader in robotics and marine/naval engineering, hosting renowned research partners and offering practical, industry-relevant programs.',
    features: ['Leading robotics research in Italy', 'Unique naval and marine engineering offer', 'Seaside city with a lower cost of living', 'Close links to the Italian Institute of Technology'],
    bachelor: ['Computer Engineering', 'Computer Science', 'Naval Engineering', 'Mechanical Engineering'],
    master: ['Robotics Engineering', 'Computer Engineering', 'Data Science', 'Naval Architecture & Marine Engineering', 'Cybersecurity']
  },
  {
    id: 'pavia', featured: false, region: 'north', name: 'University of Pavia', ar: 'جامعة بافيا', city: 'Pavia', founded: 1361,
    tags: ['Computer Engineering', 'Medicine', 'AI'],
    about: 'A historic collegiate university distinguished in computer engineering and medicine, with a famous system of residential colleges for students.',
    features: ['Historic university founded in 1361', 'Unique residential college system', 'Strong engineering and medical schools', 'Close to Milan'],
    bachelor: ['Computer Engineering', 'Electronic & Computer Engineering', 'Medicine & Surgery (English)', 'Biotechnology'],
    master: ['Computer Engineering', 'Electronic Engineering', 'Artificial Intelligence', 'Data Science']
  },
  {
    id: 'bicocca', featured: false, region: 'north', name: 'University of Milano-Bicocca', ar: 'جامعة ميلانو بيكوكا', city: 'Milan', founded: 1998,
    tags: ['Data Science', 'Informatics'],
    about: 'A young, dynamic university in Milan with strong programs in data analysis and informatics.',
    features: ['Modern campus in Milan', 'Strong data science and informatics', 'Close links with companies', 'English-taught master\'s options'],
    bachelor: ['Computer Science', 'Statistics', 'Mathematics', 'Biotechnology'],
    master: ['Data Science', 'Computer Science', 'Artificial Intelligence', 'Economics, Management & Data']
  },
  {
    id: 'verona', featured: false, region: 'north', name: 'University of Verona', ar: 'جامعة فيرونا', city: 'Verona', founded: 1982,
    tags: ['Computer Science', 'Medical Bioinformatics'],
    about: 'Known for medical bioinformatics and a friendly, human-scale university experience in a beautiful historic city.',
    features: ['Excellent bioinformatics research', 'Beautiful, safe historic city', 'Modern and well-organized', 'Good student services'],
    bachelor: ['Computer Science', 'Bioinformatics', 'Applied Mathematics', 'Economics'],
    master: ['Computer Science & Engineering', 'Medical Bioinformatics', 'Mathematics', 'Data Science']
  },
  {
    id: 'cafoscari', featured: false, region: 'north', name: 'Ca\' Foscari University of Venice', ar: 'جامعة كافوسكاري (البندقية)', city: 'Venice', founded: 1868,
    tags: ['Data Science', 'Computer Science', 'Economics'],
    about: 'A pioneer in combining data science with economics and management, in one of the world\'s most iconic cities.',
    features: ['Prestigious in economics, languages and data', 'Study in Venice', 'Strong international network', 'Many English-taught master\'s degrees'],
    bachelor: ['Computer Science', 'Economics & Management', 'Languages & Civilizations'],
    master: ['Computer Science (Artificial Intelligence)', 'Data Analytics for Business', 'Economics', 'Management']
  },
  {
    id: 'brescia', featured: false, region: 'north', name: 'University of Brescia', ar: 'جامعة بريشا', city: 'Brescia', founded: 1982,
    tags: ['IT', 'Engineering'],
    about: 'Strong in information-systems and telecommunications engineering, in an industrial heartland of northern Italy.',
    features: ['Industry-oriented engineering', 'Strong ties with local manufacturing', 'Affordable cost of living', 'Close to Milan and Verona'],
    bachelor: ['Industrial Engineering', 'Information Technology Engineering', 'Civil Engineering'],
    master: ['Communication Technologies & Multimedia', 'Industrial Automation', 'Computer Engineering']
  },
  {
    id: 'bergamo', featured: false, region: 'north', name: 'University of Bergamo', ar: 'جامعة بيرغامو', city: 'Bergamo', founded: 1968,
    tags: ['Industrial Engineering', 'Applied CS'],
    about: 'Focuses on industrial engineering and applied computer science with a practical, company-oriented approach.',
    features: ['Applied, practical teaching', 'Close to Milan', 'Welcoming mid-size city', 'Good internship network'],
    bachelor: ['Computer Engineering', 'Mechanical Engineering', 'Management Engineering'],
    master: ['Computer Engineering', 'Management Engineering', 'Mechanical Engineering']
  },
  {
    id: 'insubria', featured: false, region: 'north', name: 'University of Insubria', ar: 'جامعة إنسوبريا', city: 'Varese / Como', founded: 1998,
    tags: ['Computer Science', 'Mathematics'],
    about: 'A multi-campus university near Lake Como and Lake Maggiore with solid programs in computer science and mathematics.',
    features: ['Beautiful lakeside campuses', 'Small classes', 'Close to Milan and Switzerland', 'Good value for money'],
    bachelor: ['Computer Science', 'Mathematics', 'Physics'],
    master: ['Computer Science', 'Mathematics', 'Data Analytics']
  },
  {
    id: 'upo', featured: false, region: 'north', name: 'University of Eastern Piedmont', ar: 'جامعة بييمونتي أورينتالي', city: 'Alessandria / Novara', founded: 1998,
    tags: ['IT', 'Sciences'],
    about: 'A multi-site university focused on technological innovation and pure sciences.',
    features: ['Modern, flexible programs', 'Close to Turin and Milan', 'Lower living costs', 'Small, supportive classes'],
    bachelor: ['Computer Science', 'Biotechnology', 'Chemistry'],
    master: ['Computer Science & Engineering', 'Applied Mathematics', 'Biotechnology']
  },
  {
    id: 'trieste', featured: false, region: 'north', name: 'University of Trieste', ar: 'جامعة ترييستي', city: 'Trieste', founded: 1924,
    tags: ['Data Science', 'AI'],
    about: 'A strong research hub in data science and AI, surrounded by internationally renowned scientific institutes.',
    features: ['Strong research ecosystem (SISSA, ICTP, etc.)', 'High-quality science education', 'International scientific community', 'Beautiful coastal city'],
    bachelor: ['Computer Engineering', 'Mathematics', 'Physics'],
    master: ['Data Science & Artificial Intelligence', 'Computer Engineering', 'Physics', 'Applied Mathematics']
  },
  {
    id: 'udine', featured: false, region: 'north', name: 'University of Udine', ar: 'جامعة أوديني', city: 'Udine', founded: 1978,
    tags: ['IoT', 'Computer Science', 'Multimedia'],
    about: 'Distinguished in the Internet of Things and multimedia technologies, offering a close-knit study environment.',
    features: ['IoT & multimedia expertise', 'Friendly, safe city', 'Low student-to-teacher ratio', 'Close to Austria and Slovenia'],
    bachelor: ['Computer Science', 'Electronic Engineering', 'Mechanical Engineering'],
    master: ['Computer Science', 'Electronic Engineering', 'Internet of Things Engineering']
  },
  {
    id: 'bolzano', featured: false, region: 'north', name: 'Free University of Bozen-Bolzano', ar: 'جامعة بولزانو', city: 'Bolzano', founded: 1997,
    tags: ['Software Engineering', 'Trilingual'],
    about: 'A unique trilingual (Italian, German, English) university with a strong software engineering and computer science program.',
    features: ['Trilingual education', 'Excellent facilities and student-to-staff ratio', 'High quality of life in the Alps', 'Strong international profile'],
    bachelor: ['Computer Science', 'Economics & Management', 'Design & Arts'],
    master: ['Software Engineering', 'Computer Science (Data Science)', 'Management & Technology']
  },
  {
    id: 'ferrara', featured: false, region: 'north', name: 'University of Ferrara', ar: 'جامعة فيرارا', city: 'Ferrara', founded: 1391,
    tags: ['Electronic Engineering', 'Computer Science'],
    about: 'A historic university with advanced programs in electronic engineering and informatics in a UNESCO-listed city.',
    features: ['Historic UNESCO city', 'Very affordable living', 'Strong science and engineering', 'Bicycle-friendly town'],
    bachelor: ['Computer Engineering', 'Electronic Engineering', 'Physics'],
    master: ['Electronic Engineering', 'Computer Engineering', 'Physics']
  },
  {
    id: 'unimore', featured: false, region: 'north', name: 'University of Modena and Reggio Emilia', ar: 'جامعة مودينا وريجيو إميليا (UNIMORE)', city: 'Modena / Reggio Emilia', founded: 1175,
    tags: ['Automotive', 'AI'],
    about: 'Located in the "Motor Valley" with strong links to the automotive industry and a growing AI offer.',
    features: ['Close to Ferrari, Lamborghini, Maserati', 'Strong industry partnerships', 'Excellent engineering schools', 'Affordable living'],
    bachelor: ['Computer Engineering', 'Mechanical Engineering', 'Automotive Engineering'],
    master: ['Artificial Intelligence Engineering', 'Computer Engineering', 'Mechatronics Engineering', 'Advanced Automotive Engineering']
  },
  {
    id: 'parma', featured: false, region: 'north', name: 'University of Parma', ar: 'جامعة بارما', city: 'Parma', founded: 1117,
    tags: ['IT', 'Telecom Engineering'],
    about: 'A historic university with solid IT and telecommunications engineering programs, in the foodie capital of Italy.',
    features: ['Historic university', 'Great quality of life', 'Strong engineering and food-science programs', 'Affordable'],
    bachelor: ['Computer Engineering', 'Electronic Engineering', 'Food Science'],
    master: ['Communication Engineering', 'Computer Engineering', 'Electronic Engineering']
  },

  /* ===================== CENTRAL ===================== */
  {
    id: 'florence', featured: false, region: 'central', name: 'University of Florence', ar: 'جامعة فلورنسا', city: 'Florence', founded: 1321,
    tags: ['AI', 'Computer Engineering'],
    about: 'Long-established programs in computer engineering and AI inside Italy\'s cultural capital.',
    features: ['Study in Renaissance Florence', 'Strong engineering and architecture', 'Rich cultural life', 'Large international community'],
    bachelor: ['Computer Engineering', 'Computer Science', 'Mechanical Engineering', 'Architecture'],
    master: ['Computer Engineering', 'Artificial Intelligence', 'Data Science', 'Electronic Engineering']
  },
  {
    id: 'siena', featured: false, region: 'central', name: 'University of Siena', ar: 'جامعة سيينا', city: 'Siena', founded: 1240,
    tags: ['AI', 'Applied Math', 'Automation'],
    about: 'A leading small university for AI and applied mathematics, with a medieval-town atmosphere.',
    features: ['Strong AI and applied mathematics', 'Beautiful medieval town', 'Small classes', 'Safe and student-focused'],
    bachelor: ['Computer Science', 'Mathematics', 'Biotechnology'],
    master: ['Artificial Intelligence', 'Applied Mathematics', 'Automation Engineering']
  },
  {
    id: 'tovergata', featured: false, region: 'central', name: 'Rome Tor Vergata', ar: 'روما تور فيرغاتا', city: 'Rome', founded: 1982,
    tags: ['ICT', 'Internet Engineering'],
    about: 'Very strong in Internet engineering and telecommunications, with an international master\'s offer.',
    features: ['Excellent ICT and telecom engineering', 'Modern campus in Rome', 'Good scholarship possibilities', 'International environment'],
    bachelor: ['Computer Engineering', 'Electronic Engineering', 'Medicine & Surgery (English)'],
    master: ['Internet Engineering', 'ICT & Internet Engineering', 'Computer Engineering', 'Electronics Engineering']
  },
  {
    id: 'romatre', featured: false, region: 'central', name: 'Roma Tre University', ar: 'جامعة روما تري', city: 'Rome', founded: 1992,
    tags: ['Computer Engineering'],
    about: 'The newest of Rome\'s public universities, with a growing focus on computer engineering.',
    features: ['Modern and dynamic', 'Located in Rome', 'Good computer-engineering reputation', 'Flexible programs'],
    bachelor: ['Computer Science & Engineering', 'Mechanical Engineering', 'Civil Engineering'],
    master: ['Computer Engineering', 'Mechanical Engineering', 'Electronic Engineering']
  },
  {
    id: 'perugia', featured: false, region: 'central', name: 'University of Perugia', ar: 'جامعة بيروجيا', city: 'Perugia', founded: 1308,
    tags: ['IT', 'Computer Engineering'],
    about: 'Known for information engineering and computer science, in a lively student city in Umbria.',
    features: ['Historic university', 'Highly international city', 'Low cost of living', 'Good engineering teaching'],
    bachelor: ['Computer Science', 'Computer Engineering', 'Electronic Engineering'],
    master: ['Computer Science', 'Computer & Automation Engineering', 'Electronic Engineering']
  },
  {
    id: 'laquila', featured: false, region: 'central', name: 'University of L\'Aquila', ar: 'جامعة الكويلا', city: 'L\'Aquila', founded: 1952,
    tags: ['Computer Science', 'Math'],
    about: 'One of Italy\'s strongest in computer science and mathematics, with an active international program.',
    features: ['Top computer science and math', 'Strong research (Gran Sasso Science Institute nearby)', 'Very generous scholarships', 'Low living costs'],
    bachelor: ['Computer Science', 'Mathematics', 'Physics', 'Information Engineering'],
    master: ['Computer Science', 'Mathematics', 'Telecommunication Engineering']
  },
  {
    id: 'camerino', featured: false, region: 'central', name: 'University of Camerino', ar: 'جامعة كاميرينو', city: 'Camerino', founded: 1336,
    tags: ['Computer Science', 'Tech'],
    about: 'A small, international-friendly university with excellent computer science programs.',
    features: ['Small classes and personal attention', 'Highly international', 'Affordable housing', 'Generous scholarships'],
    bachelor: ['Computer Science', 'Biology', 'Chemistry'],
    master: ['Computer Science', 'Biology', 'Chemistry']
  },
  {
    id: 'marche', featured: false, region: 'central', name: 'Marche Polytechnic University', ar: 'جامعة ماركي المتعددة التكنولوجية', city: 'Ancona', founded: 1969,
    tags: ['IT', 'Biomedical Engineering'],
    about: 'Combines biomedical engineering and information technology in a seaside region.',
    features: ['Biomedical engineering strength', 'Seaside city', 'Affordable', 'Active engineering labs'],
    bachelor: ['Computer & Automation Engineering', 'Biomedical Engineering', 'Electronic Engineering'],
    master: ['Biomedical Engineering', 'Computer & Automation Engineering', 'Electronic Engineering']
  },
  {
    id: 'urbino', featured: false, region: 'central', name: 'University of Urbino', ar: 'جامعة أوربينو', city: 'Urbino', founded: 1506,
    tags: ['Applied IT'],
    about: 'A historic university offering specialized applied informatics programs within a UNESCO-listed Renaissance town.',
    features: ['UNESCO World Heritage town', 'Small, community-like setting', 'Affordable', 'Applied-focus programs'],
    bachelor: ['Applied Informatics', 'Economics', 'Communication Sciences'],
    master: ['Applied Computer Science', 'Business Economics']
  },
  {
    id: 'chieti', featured: false, region: 'central', name: 'University of Chieti-Pescara (G. d\'Annunzio)', ar: 'جامعة كييتي-بيسكارا', city: 'Chieti / Pescara', founded: 1965,
    tags: ['Advanced Sciences', 'Tech'],
    about: 'Focuses on sciences and advanced technologies, near the Adriatic coast.',
    features: ['Adriatic seaside', 'Good science programs', 'Low living cost', 'Active student life'],
    bachelor: ['Computer Science', 'Biotechnology', 'Economics'],
    master: ['Computer Science', 'Biotechnology', 'Business Management']
  },
  {
    id: 'teramo', featured: false, region: 'central', name: 'University of Teramo', ar: 'جامعة تيرامو', city: 'Teramo', founded: 1993,
    tags: ['Communications Tech'],
    about: 'Known for communications and media technology programs in a calm, affordable setting.',
    features: ['Small, welcoming university', 'Affordable living', 'Communication and media focus'],
    bachelor: ['Communication Sciences', 'Political Sciences', 'Law'],
    master: ['Media & Communication', 'International Relations']
  },
  {
    id: 'tuscia', featured: false, region: 'central', name: 'University of Tuscia', ar: 'جامعة توشا', city: 'Viterbo', founded: 1979,
    tags: ['Security', 'Engineering'],
    about: 'Offers security and systems-oriented engineering programs in a quiet historic city close to Rome.',
    features: ['Close to Rome', 'Calm, affordable city', 'Strong agriculture & environment programs'],
    bachelor: ['Computer Science', 'Agricultural Sciences', 'Biology'],
    master: ['Cybersecurity & Systems', 'Agricultural Sciences', 'Biology']
  },
  {
    id: 'cassino', featured: false, region: 'central', name: 'University of Cassino', ar: 'جامعة كاسينو', city: 'Cassino', founded: 1979,
    tags: ['Telecommunications', 'CS'],
    about: 'Focuses on telecommunications engineering and software for industrial environments.',
    features: ['Industry-oriented engineering', 'Between Rome and Naples', 'Low cost of living'],
    bachelor: ['Industrial Engineering', 'Information & Communication Engineering'],
    master: ['Telecommunications Engineering', 'Computer Engineering', 'Mechanical Engineering']
  },
  {
    id: 'foreigners', featured: false, region: 'central', name: 'Universities for Foreigners (Siena / Perugia)', ar: 'جامعات الأجانب (سيينا / بيروجيا)', city: 'Siena / Perugia', founded: 1917,
    tags: ['Language Tech', 'Languages'],
    about: 'Specialized in Italian language, culture and language-technology programs for international students.',
    features: ['Ideal for learning Italian', 'Strong international community', 'Specialized language programs'],
    bachelor: ['Italian Language & Culture', 'Intercultural Communication'],
    master: ['Language Technologies', 'Teaching Italian as a Foreign Language']
  },

  /* ===================== SOUTH & ISLANDS ===================== */
  {
    id: 'unical', featured: false, region: 'south', name: 'University of Calabria (UNICAL)', ar: 'جامعة كالابريا', city: 'Rende (Cosenza)', founded: 1972,
    tags: ['AI', 'Computer Science'],
    about: 'Considered the best in the South for AI research, set on a large, modern campus-style university.',
    features: ['Top southern university for AI', 'Large green campus with on-site housing', 'Very low living costs', 'Many scholarships'],
    bachelor: ['Computer Science', 'Computer Engineering', 'Mathematics'],
    master: ['Artificial Intelligence & Computer Science', 'Computer Engineering', 'Cybersecurity']
  },
  {
    id: 'salerno', featured: false, region: 'south', name: 'University of Salerno', ar: 'جامعة ساليرنو', city: 'Fisciano (Salerno)', founded: 1968,
    tags: ['Computer Engineering', 'Data Science'],
    about: 'Strong in data science and computer engineering on a modern, campus-style university.',
    features: ['Large modern campus', 'Strong engineering and CS', 'Close to Naples and the Amalfi Coast', 'Low living costs'],
    bachelor: ['Computer Science', 'Computer Engineering', 'Mathematics'],
    master: ['Computer Science', 'Computer Engineering', 'Data Science', 'Cybersecurity']
  },
  {
    id: 'bari', featured: false, region: 'south', name: 'University of Bari Aldo Moro', ar: 'جامعة باري ألدو مورو', city: 'Bari', founded: 1925,
    tags: ['Computer Science', 'IT'],
    about: 'Comprehensive programs in computer science and IT in one of southern Italy\'s major cities.',
    features: ['Comprehensive course catalogue', 'Mediterranean port city', 'Affordable cost of living'],
    bachelor: ['Computer Science', 'Mathematics', 'Physics', 'Economics'],
    master: ['Computer Science', 'Data Science', 'Mathematics', 'Physics']
  },
  {
    id: 'polibari', featured: false, region: 'south', name: 'Politecnico di Bari', ar: 'بوليتكنيك باري', city: 'Bari', founded: 1990,
    tags: ['Computer Engineering', 'Telecom'],
    about: 'A rigorous engineering institution specializing in computer and telecommunications engineering.',
    features: ['Pure technical university', 'Strong engineering reputation in the South', 'Affordable'],
    bachelor: ['Computer & Automation Engineering', 'Electronic Engineering', 'Mechanical Engineering'],
    master: ['Computer Engineering', 'Telecommunication Engineering', 'Automation Engineering']
  },
  {
    id: 'catania', featured: false, region: 'south', name: 'University of Catania', ar: 'جامعة كاتانيا', city: 'Catania (Sicily)', founded: 1434,
    tags: ['Computer Science', 'Data'],
    about: 'An important technology hub in Sicily for data science and software development.',
    features: ['Sicilian tech hub', 'Historic university', 'Very affordable', 'Sunny Mediterranean lifestyle'],
    bachelor: ['Computer Science', 'Computer Engineering', 'Mathematics'],
    master: ['Computer Science', 'Data Science', 'Computer Engineering']
  },
  {
    id: 'palermo', featured: false, region: 'south', name: 'University of Palermo', ar: 'جامعة باليرمو', city: 'Palermo (Sicily)', founded: 1806,
    tags: ['AI', 'Engineering'],
    about: 'Combines artificial intelligence with traditional engineering programs in Sicily\'s capital.',
    features: ['Capital of Sicily', 'Rich culture and cuisine', 'Very low living cost', 'Wide engineering offer'],
    bachelor: ['Computer Engineering', 'Mechanical Engineering', 'Computer Science'],
    master: ['Computer Engineering', 'Artificial Intelligence (Data Engineering)', 'Cybersecurity']
  },
  {
    id: 'messina', featured: false, region: 'south', name: 'University of Messina', ar: 'جامعة ميسينا', city: 'Messina (Sicily)', founded: 1548,
    tags: ['Data Science', 'Systems Engineering'],
    about: 'Focuses on data science and distributed systems engineering.',
    features: ['Strait of Messina location', 'Low living costs', 'Small to mid-size classes'],
    bachelor: ['Computer Science', 'Engineering', 'Mathematics'],
    master: ['Data Science', 'Computer Science', 'Engineering & Technology']
  },
  {
    id: 'cagliari', featured: false, region: 'south', name: 'University of Cagliari', ar: 'جامعة كالياري', city: 'Cagliari (Sardinia)', founded: 1606,
    tags: ['Computer Science', 'ICT'],
    about: 'Strong in IT and communications on the island of Sardinia.',
    features: ['Beach-city student life', 'Strong ICT research', 'Affordable living'],
    bachelor: ['Computer Science', 'Computer Engineering', 'Electronic Engineering'],
    master: ['Computer Science', 'Computer Engineering', 'Telecommunication Engineering']
  },
  {
    id: 'sassari', featured: false, region: 'south', name: 'University of Sassari', ar: 'جامعة ساساري', city: 'Sassari (Sardinia)', founded: 1562,
    tags: ['Science', 'IT'],
    about: 'Offers programs in technological innovation and sciences in northern Sardinia.',
    features: ['Historic university', 'Very affordable', 'Close to Sardinian beaches'],
    bachelor: ['Computer Science', 'Natural Sciences', 'Agriculture'],
    master: ['Computer Science', 'Environmental Sciences']
  },
  {
    id: 'foggia', featured: false, region: 'south', name: 'University of Foggia', ar: 'جامعة فوجيا', city: 'Foggia', founded: 1999,
    tags: ['Biotechnology', 'Digital Innovation'],
    about: 'Distinguished in biotechnology and digital innovation with a modern, friendly setup.',
    features: ['Modern programs', 'Very low living costs', 'Small class sizes'],
    bachelor: ['Biotechnology', 'Agri-food Sciences', 'Economics'],
    master: ['Biotechnology', 'Food Technology']
  },
  {
    id: 'salento', featured: false, region: 'south', name: 'University of Salento', ar: 'جامعة ساليتو', city: 'Lecce', founded: 1955,
    tags: ['Computer Engineering'],
    about: 'Excellent facilities for computer and systems engineering in the beautiful city of Lecce.',
    features: ['Baroque "Florence of the South"', 'Excellent facilities', 'Low cost of living'],
    bachelor: ['Computer Engineering', 'Mechanical Engineering', 'Mathematics'],
    master: ['Computer Engineering', 'Mechanical Engineering', 'Mathematics']
  },
  {
    id: 'basilicata', featured: false, region: 'south', name: 'University of Basilicata', ar: 'جامعة بازيليكاتا', city: 'Potenza / Matera', founded: 1982,
    tags: ['IT', 'Engineering'],
    about: 'Applied programs in information technology and engineering in a quiet, affordable region.',
    features: ['Matera — UNESCO city', 'Very affordable', 'Small and personal'],
    bachelor: ['Computer Engineering', 'Civil Engineering', 'Architecture'],
    master: ['Computer Engineering', 'Civil Engineering']
  },
  {
    id: 'vanvitelli', featured: false, region: 'south', name: 'Università della Campania "Luigi Vanvitelli"', ar: 'جامعة كامبانيا لويجي فانفيتيلي', city: 'Caserta / Naples', founded: 1991,
    tags: ['Data Analytics', 'Informatics'],
    about: 'Specialized in data analytics and informatics, with a modern, flexible academic offer.',
    features: ['Modern programs', 'Near Naples', 'Affordable'],
    bachelor: ['Computer Engineering', 'Architecture', 'Medicine & Surgery'],
    master: ['Computer Engineering', 'Data Analytics', 'Architecture']
  },
  {
    id: 'parthenope', featured: false, region: 'south', name: 'University of Naples Parthenope', ar: 'جامعة نابولي بارثينوب', city: 'Naples', founded: 1919,
    tags: ['Applied CS', 'Maritime Tech'],
    about: 'A maritime and technology-oriented university offering applied computer science programs.',
    features: ['Maritime and technology focus', 'Seafront location', 'Affordable'],
    bachelor: ['Computer Science', 'Naval Sciences', 'Economics'],
    master: ['Applied Computer Science', 'Data Science for Management']
  },
  {
    id: 'sannio', featured: false, region: 'south', name: 'University of Sannio', ar: 'جامعة سانيو', city: 'Benevento', founded: 1998,
    tags: ['Computer Engineering', 'Communications'],
    about: 'Advanced computer engineering and communications programs in a small, quiet city.',
    features: ['Strong engineering focus', 'Small and personal', 'Very low living costs'],
    bachelor: ['Computer Engineering', 'Electronic Engineering', 'Energy Engineering'],
    master: ['Computer Engineering', 'Telecommunication Engineering']
  },
  {
    id: 'orientale', featured: false, region: 'south', name: 'University of Naples L\'Orientale', ar: 'جامعة لوريينتالي', city: 'Naples', founded: 1732,
    tags: ['Bioinformatics', 'Languages'],
    about: 'Specialized programs in languages and cultures, with niche offerings that link technology and language studies.',
    features: ['Oldest school of Oriental studies in Europe', 'Strong in languages and area studies', 'Cultural capital of the South'],
    bachelor: ['Languages & Cultures', 'Political Sciences'],
    master: ['Language Technologies', 'International Relations']
  }
];

/* Shared helpers ------------------------------------------------------------ */
const WHATSAPP_NUMBER = '201027058317';  // +20 10 2705 8317
function initialsOf(name) {
  return name.replace(/[^A-Za-z ]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !/^(of|the|for|and|della|di)$/i.test(w)).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'IT';
}
function imageHTML(u, cls) {
  const fallback = `<div class='uni-fallback'><span>${initialsOf(u.name)}</span><small>${u.city}</small></div>`;
  return `<div class="${cls || ''} uni-img-wrap"><img src="images/universities/${u.id}.jpg" alt="${u.name}" loading="lazy" onerror="this.parentNode.innerHTML=this.parentNode.dataset.fb" ></div>`.replace('uni-img-wrap">', `uni-img-wrap" data-fb="${fallback.replace(/"/g, '&quot;')}">`);
}
