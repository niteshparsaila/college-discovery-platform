import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// DATA SOURCING NOTES (say this in the Loom too):
//
// - Institution names, cities, countries, founding years, and brochure/admissions
//   URLs are REAL — these are actual IITs, NITs, IIMs, and foreign universities.
// - feesPerYear is a researched APPROXIMATE annual tuition figure, normalized to
//   INR so sort/filter/search behaves consistently across currencies:
//     * IITs: ~9.1L–13.9L total 4-yr B.Tech cost (JoSAA/institute circulars, 2025-26)
//       → divided across 4 years, varied per institute for realism.
//     * NITs: ~62,500–1,25,000/semester tuition band (Careers360/CollegeDekho, 2025-26).
//     * IIMs: ~17L–27.5L total 2-yr PGP/MBA fee (2026–28 batch figures) → annualized.
//     * Foreign universities: published international tuition in local currency,
//       converted at approx. USD/INR ≈ 95 (and cross-rates from that) as of Aug 2026.
//   These are PLANNING-LEVEL figures, not live official quotes — treat them the same
//   way the fee-aggregator sites they're sourced from tell candidates to: verify the
//   current circular on the institution's own site before relying on it for a real
//   admissions decision. A `feesAsOf` style caveat is worth surfacing in the UI.
// - Courses, placement stats, and reviews are SYNTHETIC — generated to exercise
//   search/filter/sort/pagination realistically, per the assignment's mock-data
//   allowance. Reviews in particular are placeholder content with generic author
//   names; they are NOT real student reviews of these institutions and shouldn't be
//   presented as such in any user-facing copy ("Sample reviews" is safer UI language
//   than implying these are verified/authentic).
// ---------------------------------------------------------------------------

type Category = 'IIT' | 'NIT' | 'IIM' | 'FOREIGN';

interface RealInstitution {
  name: string;
  city: string;
  state: string;
  country: string;
  ownershipType: 'Government' | 'Private' | 'Deemed';
  feesPerYear: number; // INR, normalized
  rating: number;
  establishedIn: number;
  brochureUrl: string;
  category: Category;
}

const LOGO_COLORS = ['#25405F', '#A3651F', '#3E5C8A', '#152B42', '#C17A2E'];

function rating(min: number, max: number) {
  return Number((Math.random() * (max - min) + min).toFixed(1));
}

// ---------------------------------------------------------------------------
// 23 IITs — tuition normalized to an annual figure derived from the ~9.1L–13.9L
// total 4-year B.Tech cost reported for 2025-26 (General/OBC-NCL/EWS category).
// ---------------------------------------------------------------------------
const IITS: RealInstitution[] = [
  { name: 'Indian Institute of Technology Bombay', city: 'Mumbai', state: 'Maharashtra', country: 'India', ownershipType: 'Government', feesPerYear: 300000, rating: rating(4.6, 4.9), establishedIn: 1958, brochureUrl: 'https://www.iitb.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Delhi', city: 'New Delhi', state: 'Delhi', country: 'India', ownershipType: 'Government', feesPerYear: 320000, rating: rating(4.6, 4.9), establishedIn: 1961, brochureUrl: 'https://home.iitd.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Madras', city: 'Chennai', state: 'Tamil Nadu', country: 'India', ownershipType: 'Government', feesPerYear: 300000, rating: rating(4.6, 4.9), establishedIn: 1959, brochureUrl: 'https://www.iitm.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Kanpur', city: 'Kanpur', state: 'Uttar Pradesh', country: 'India', ownershipType: 'Government', feesPerYear: 240000, rating: rating(4.5, 4.9), establishedIn: 1959, brochureUrl: 'https://www.iitk.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Kharagpur', city: 'Kharagpur', state: 'West Bengal', country: 'India', ownershipType: 'Government', feesPerYear: 290000, rating: rating(4.5, 4.9), establishedIn: 1951, brochureUrl: 'https://www.iitkgp.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Roorkee', city: 'Roorkee', state: 'Uttarakhand', country: 'India', ownershipType: 'Government', feesPerYear: 280000, rating: rating(4.4, 4.8), establishedIn: 2001, brochureUrl: 'https://www.iitr.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Guwahati', city: 'Guwahati', state: 'Assam', country: 'India', ownershipType: 'Government', feesPerYear: 270000, rating: rating(4.4, 4.8), establishedIn: 1994, brochureUrl: 'https://www.iitg.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Hyderabad', city: 'Hyderabad', state: 'Telangana', country: 'India', ownershipType: 'Government', feesPerYear: 275000, rating: rating(4.3, 4.7), establishedIn: 2008, brochureUrl: 'https://www.iith.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology (BHU) Varanasi', city: 'Varanasi', state: 'Uttar Pradesh', country: 'India', ownershipType: 'Government', feesPerYear: 250000, rating: rating(4.3, 4.7), establishedIn: 2012, brochureUrl: 'https://www.iitbhu.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Indore', city: 'Indore', state: 'Madhya Pradesh', country: 'India', ownershipType: 'Government', feesPerYear: 300000, rating: rating(4.2, 4.6), establishedIn: 2009, brochureUrl: 'https://www.iiti.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Gandhinagar', city: 'Gandhinagar', state: 'Gujarat', country: 'India', ownershipType: 'Government', feesPerYear: 270000, rating: rating(4.2, 4.6), establishedIn: 2008, brochureUrl: 'https://www.iitgn.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Jodhpur', city: 'Jodhpur', state: 'Rajasthan', country: 'India', ownershipType: 'Government', feesPerYear: 265000, rating: rating(4.1, 4.6), establishedIn: 2008, brochureUrl: 'https://www.iitj.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Patna', city: 'Patna', state: 'Bihar', country: 'India', ownershipType: 'Government', feesPerYear: 250000, rating: rating(4.0, 4.5), establishedIn: 2008, brochureUrl: 'https://www.iitp.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Ropar', city: 'Rupnagar', state: 'Punjab', country: 'India', ownershipType: 'Government', feesPerYear: 255000, rating: rating(4.0, 4.5), establishedIn: 2008, brochureUrl: 'https://www.iitrpr.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', country: 'India', ownershipType: 'Government', feesPerYear: 250000, rating: rating(4.0, 4.5), establishedIn: 2008, brochureUrl: 'https://www.iitbbs.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Mandi', city: 'Mandi', state: 'Himachal Pradesh', country: 'India', ownershipType: 'Government', feesPerYear: 255000, rating: rating(4.0, 4.5), establishedIn: 2009, brochureUrl: 'https://www.iitmandi.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology (ISM) Dhanbad', city: 'Dhanbad', state: 'Jharkhand', country: 'India', ownershipType: 'Government', feesPerYear: 260000, rating: rating(4.0, 4.5), establishedIn: 1926, brochureUrl: 'https://www.iitism.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Palakkad', city: 'Palakkad', state: 'Kerala', country: 'India', ownershipType: 'Government', feesPerYear: 245000, rating: rating(3.9, 4.4), establishedIn: 2015, brochureUrl: 'https://www.iitpkd.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Tirupati', city: 'Tirupati', state: 'Andhra Pradesh', country: 'India', ownershipType: 'Government', feesPerYear: 245000, rating: rating(3.9, 4.4), establishedIn: 2015, brochureUrl: 'https://www.iittp.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Dharwad', city: 'Dharwad', state: 'Karnataka', country: 'India', ownershipType: 'Government', feesPerYear: 240000, rating: rating(3.8, 4.3), establishedIn: 2016, brochureUrl: 'https://www.iitdh.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Bhilai', city: 'Bhilai', state: 'Chhattisgarh', country: 'India', ownershipType: 'Government', feesPerYear: 235000, rating: rating(3.8, 4.3), establishedIn: 2016, brochureUrl: 'https://www.iitbhilai.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Goa', city: 'Ponda', state: 'Goa', country: 'India', ownershipType: 'Government', feesPerYear: 235000, rating: rating(3.8, 4.3), establishedIn: 2016, brochureUrl: 'https://www.iitgoa.ac.in', category: 'IIT' },
  { name: 'Indian Institute of Technology Jammu', city: 'Jammu', state: 'Jammu and Kashmir', country: 'India', ownershipType: 'Government', feesPerYear: 235000, rating: rating(3.8, 4.3), establishedIn: 2016, brochureUrl: 'https://www.iitjammu.ac.in', category: 'IIT' }
];

// ---------------------------------------------------------------------------
// 15 NITs — annual tuition normalized from the ~62,500–1,25,000/semester band.
// ---------------------------------------------------------------------------
const NITS: RealInstitution[] = [
  { name: 'National Institute of Technology Tiruchirappalli', city: 'Tiruchirappalli', state: 'Tamil Nadu', country: 'India', ownershipType: 'Government', feesPerYear: 155000, rating: rating(4.2, 4.6), establishedIn: 1964, brochureUrl: 'https://www.nitt.edu', category: 'NIT' },
  { name: 'National Institute of Technology Warangal', city: 'Warangal', state: 'Telangana', country: 'India', ownershipType: 'Government', feesPerYear: 150000, rating: rating(4.2, 4.6), establishedIn: 1959, brochureUrl: 'https://www.nitw.ac.in', category: 'NIT' },
  { name: 'National Institute of Technology Karnataka, Surathkal', city: 'Mangalore', state: 'Karnataka', country: 'India', ownershipType: 'Government', feesPerYear: 155000, rating: rating(4.2, 4.6), establishedIn: 1960, brochureUrl: 'https://www.nitk.ac.in', category: 'NIT' },
  { name: 'National Institute of Technology Rourkela', city: 'Rourkela', state: 'Odisha', country: 'India', ownershipType: 'Government', feesPerYear: 150000, rating: rating(4.1, 4.5), establishedIn: 1961, brochureUrl: 'https://www.nitrkl.ac.in', category: 'NIT' },
  { name: 'National Institute of Technology Calicut', city: 'Kozhikode', state: 'Kerala', country: 'India', ownershipType: 'Government', feesPerYear: 145000, rating: rating(4.1, 4.5), establishedIn: 1961, brochureUrl: 'https://www.nitc.ac.in', category: 'NIT' },
  { name: 'National Institute of Technology Kurukshetra', city: 'Kurukshetra', state: 'Haryana', country: 'India', ownershipType: 'Government', feesPerYear: 145000, rating: rating(4.0, 4.5), establishedIn: 1963, brochureUrl: 'https://www.nitkkr.ac.in', category: 'NIT' },
  { name: 'Motilal Nehru National Institute of Technology Allahabad', city: 'Prayagraj', state: 'Uttar Pradesh', country: 'India', ownershipType: 'Government', feesPerYear: 140000, rating: rating(4.0, 4.5), establishedIn: 1961, brochureUrl: 'https://www.mnnit.ac.in', category: 'NIT' },
  { name: 'Maulana Azad National Institute of Technology Bhopal', city: 'Bhopal', state: 'Madhya Pradesh', country: 'India', ownershipType: 'Government', feesPerYear: 140000, rating: rating(4.0, 4.4), establishedIn: 1960, brochureUrl: 'https://www.manit.ac.in', category: 'NIT' },
  { name: 'Visvesvaraya National Institute of Technology Nagpur', city: 'Nagpur', state: 'Maharashtra', country: 'India', ownershipType: 'Government', feesPerYear: 145000, rating: rating(4.0, 4.4), establishedIn: 1960, brochureUrl: 'https://www.vnit.ac.in', category: 'NIT' },
  { name: 'National Institute of Technology Durgapur', city: 'Durgapur', state: 'West Bengal', country: 'India', ownershipType: 'Government', feesPerYear: 135000, rating: rating(3.9, 4.3), establishedIn: 1960, brochureUrl: 'https://www.nitdgp.ac.in', category: 'NIT' },
  { name: 'Malaviya National Institute of Technology Jaipur', city: 'Jaipur', state: 'Rajasthan', country: 'India', ownershipType: 'Government', feesPerYear: 140000, rating: rating(4.0, 4.4), establishedIn: 1963, brochureUrl: 'https://www.mnit.ac.in', category: 'NIT' },
  { name: 'Dr B R Ambedkar National Institute of Technology Jalandhar', city: 'Jalandhar', state: 'Punjab', country: 'India', ownershipType: 'Government', feesPerYear: 135000, rating: rating(3.9, 4.3), establishedIn: 1987, brochureUrl: 'https://www.nitj.ac.in', category: 'NIT' },
  { name: 'National Institute of Technology Patna', city: 'Patna', state: 'Bihar', country: 'India', ownershipType: 'Government', feesPerYear: 130000, rating: rating(3.8, 4.2), establishedIn: 1886, brochureUrl: 'https://www.nitp.ac.in', category: 'NIT' },
  { name: 'National Institute of Technology Silchar', city: 'Silchar', state: 'Assam', country: 'India', ownershipType: 'Government', feesPerYear: 130000, rating: rating(3.8, 4.2), establishedIn: 1967, brochureUrl: 'https://www.nits.ac.in', category: 'NIT' },
  { name: 'National Institute of Technology Hamirpur', city: 'Hamirpur', state: 'Himachal Pradesh', country: 'India', ownershipType: 'Government', feesPerYear: 130000, rating: rating(3.8, 4.2), establishedIn: 1986, brochureUrl: 'https://www.nith.ac.in', category: 'NIT' }
];

// ---------------------------------------------------------------------------
// 14 IIMs — annual figure derived from ~17L–27.5L total 2-year PGP/MBA fee
// (2026–28 batch figures where available).
// ---------------------------------------------------------------------------
const IIMS: RealInstitution[] = [
  { name: 'Indian Institute of Management Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', country: 'India', ownershipType: 'Government', feesPerYear: 1375000, rating: rating(4.6, 4.9), establishedIn: 1961, brochureUrl: 'https://www.iima.ac.in', category: 'IIM' },
  { name: 'Indian Institute of Management Bangalore', city: 'Bengaluru', state: 'Karnataka', country: 'India', ownershipType: 'Government', feesPerYear: 1300000, rating: rating(4.5, 4.9), establishedIn: 1973, brochureUrl: 'https://www.iimb.ac.in', category: 'IIM' },
  { name: 'Indian Institute of Management Calcutta', city: 'Kolkata', state: 'West Bengal', country: 'India', ownershipType: 'Government', feesPerYear: 1350000, rating: rating(4.5, 4.9), establishedIn: 1961, brochureUrl: 'https://www.iimcal.ac.in', category: 'IIM' },
  { name: 'Indian Institute of Management Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', country: 'India', ownershipType: 'Government', feesPerYear: 1100000, rating: rating(4.3, 4.7), establishedIn: 1984, brochureUrl: 'https://www.iiml.ac.in', category: 'IIM' },
  { name: 'Indian Institute of Management Kozhikode', city: 'Kozhikode', state: 'Kerala', country: 'India', ownershipType: 'Government', feesPerYear: 1025000, rating: rating(4.2, 4.6), establishedIn: 1996, brochureUrl: 'https://www.iimk.ac.in', category: 'IIM' },
  { name: 'Indian Institute of Management Indore', city: 'Indore', state: 'Madhya Pradesh', country: 'India', ownershipType: 'Government', feesPerYear: 1075000, rating: rating(4.2, 4.6), establishedIn: 1996, brochureUrl: 'https://www.iimidr.ac.in', category: 'IIM' },
  { name: 'Indian Institute of Management Shillong', city: 'Shillong', state: 'Meghalaya', country: 'India', ownershipType: 'Government', feesPerYear: 950000, rating: rating(4.0, 4.4), establishedIn: 2007, brochureUrl: 'https://www.iimshillong.ac.in', category: 'IIM' },
  { name: 'Indian Institute of Management Rohtak', city: 'Rohtak', state: 'Haryana', country: 'India', ownershipType: 'Government', feesPerYear: 900000, rating: rating(3.9, 4.3), establishedIn: 2010, brochureUrl: 'https://www.iimrohtak.ac.in', category: 'IIM' },
  { name: 'Indian Institute of Management Ranchi', city: 'Ranchi', state: 'Jharkhand', country: 'India', ownershipType: 'Government', feesPerYear: 875000, rating: rating(3.9, 4.3), establishedIn: 2010, brochureUrl: 'https://www.iimranchi.ac.in', category: 'IIM' },
  { name: 'Indian Institute of Management Raipur', city: 'Raipur', state: 'Chhattisgarh', country: 'India', ownershipType: 'Government', feesPerYear: 900000, rating: rating(3.9, 4.3), establishedIn: 2010, brochureUrl: 'https://www.iimraipur.ac.in', category: 'IIM' },
  { name: 'Indian Institute of Management Tiruchirappalli', city: 'Tiruchirappalli', state: 'Tamil Nadu', country: 'India', ownershipType: 'Government', feesPerYear: 875000, rating: rating(3.9, 4.3), establishedIn: 2011, brochureUrl: 'https://www.iimtrichy.ac.in', category: 'IIM' },
  { name: 'Indian Institute of Management Udaipur', city: 'Udaipur', state: 'Rajasthan', country: 'India', ownershipType: 'Government', feesPerYear: 875000, rating: rating(3.8, 4.3), establishedIn: 2011, brochureUrl: 'https://www.iimu.ac.in', category: 'IIM' },
  { name: 'Indian Institute of Management Kashipur', city: 'Kashipur', state: 'Uttarakhand', country: 'India', ownershipType: 'Government', feesPerYear: 865000, rating: rating(3.8, 4.2), establishedIn: 2011, brochureUrl: 'https://www.iimkashipur.ac.in', category: 'IIM' },
  { name: 'Indian Institute of Management Bodh Gaya', city: 'Bodh Gaya', state: 'Bihar', country: 'India', ownershipType: 'Government', feesPerYear: 850000, rating: rating(3.7, 4.2), establishedIn: 2015, brochureUrl: 'https://www.iimbg.ac.in', category: 'IIM' }
];

// ---------------------------------------------------------------------------
// 15 foreign universities — published international tuition converted to INR
// at approx. cross-rates off USD/INR ≈ 95 (Aug 2026). Figures are tuition only,
// not cost of attendance (no housing/living costs included).
// ---------------------------------------------------------------------------
const FOREIGN: RealInstitution[] = [
  { name: 'Massachusetts Institute of Technology', city: 'Cambridge', state: 'Massachusetts', country: 'United States', ownershipType: 'Private', feesPerYear: 5700000, rating: rating(4.7, 4.9), establishedIn: 1861, brochureUrl: 'https://www.mit.edu', category: 'FOREIGN' },
  { name: 'Stanford University', city: 'Stanford', state: 'California', country: 'United States', ownershipType: 'Private', feesPerYear: 5500000, rating: rating(4.7, 4.9), establishedIn: 1885, brochureUrl: 'https://www.stanford.edu', category: 'FOREIGN' },
  { name: 'Harvard University', city: 'Cambridge', state: 'Massachusetts', country: 'United States', ownershipType: 'Private', feesPerYear: 5600000, rating: rating(4.7, 4.9), establishedIn: 1636, brochureUrl: 'https://www.harvard.edu', category: 'FOREIGN' },
  { name: 'University of Oxford', city: 'Oxford', state: 'England', country: 'United Kingdom', ownershipType: 'Private', feesPerYear: 4500000, rating: rating(4.6, 4.9), establishedIn: 1096, brochureUrl: 'https://www.ox.ac.uk', category: 'FOREIGN' },
  { name: 'University of Cambridge', city: 'Cambridge', state: 'England', country: 'United Kingdom', ownershipType: 'Private', feesPerYear: 4400000, rating: rating(4.6, 4.9), establishedIn: 1209, brochureUrl: 'https://www.cam.ac.uk', category: 'FOREIGN' },
  { name: 'Imperial College London', city: 'London', state: 'England', country: 'United Kingdom', ownershipType: 'Private', feesPerYear: 4200000, rating: rating(4.5, 4.9), establishedIn: 1907, brochureUrl: 'https://www.imperial.ac.uk', category: 'FOREIGN' },
  { name: 'ETH Zurich', city: 'Zurich', state: 'Zurich', country: 'Switzerland', ownershipType: 'Government', feesPerYear: 160000, rating: rating(4.5, 4.9), establishedIn: 1855, brochureUrl: 'https://ethz.ch', category: 'FOREIGN' },
  { name: 'National University of Singapore', city: 'Singapore', state: 'Singapore', country: 'Singapore', ownershipType: 'Government', feesPerYear: 2485000, rating: rating(4.4, 4.8), establishedIn: 1905, brochureUrl: 'https://www.nus.edu.sg', category: 'FOREIGN' },
  { name: 'University of Toronto', city: 'Toronto', state: 'Ontario', country: 'Canada', ownershipType: 'Government', feesPerYear: 4080000, rating: rating(4.3, 4.7), establishedIn: 1827, brochureUrl: 'https://www.utoronto.ca', category: 'FOREIGN' },
  { name: 'University of British Columbia', city: 'Vancouver', state: 'British Columbia', country: 'Canada', ownershipType: 'Government', feesPerYear: 3400000, rating: rating(4.2, 4.7), establishedIn: 1908, brochureUrl: 'https://www.ubc.ca', category: 'FOREIGN' },
  { name: 'University of Melbourne', city: 'Melbourne', state: 'Victoria', country: 'Australia', ownershipType: 'Government', feesPerYear: 2914000, rating: rating(4.2, 4.7), establishedIn: 1853, brochureUrl: 'https://www.unimelb.edu.au', category: 'FOREIGN' },
  { name: 'Technical University of Munich', city: 'Munich', state: 'Bavaria', country: 'Germany', ownershipType: 'Government', feesPerYear: 55000, rating: rating(4.3, 4.7), establishedIn: 1868, brochureUrl: 'https://www.tum.de', category: 'FOREIGN' },
  { name: 'National Taiwan University', city: 'Taipei', state: 'Taipei', country: 'Taiwan', ownershipType: 'Government', feesPerYear: 335000, rating: rating(4.0, 4.5), establishedIn: 1928, brochureUrl: 'https://www.ntu.edu.tw', category: 'FOREIGN' },
  { name: 'University of Tokyo', city: 'Tokyo', state: 'Tokyo', country: 'Japan', ownershipType: 'Government', feesPerYear: 342000, rating: rating(4.3, 4.8), establishedIn: 1877, brochureUrl: 'https://www.u-tokyo.ac.jp', category: 'FOREIGN' },
  { name: 'University of Hong Kong', city: 'Hong Kong', state: 'Hong Kong', country: 'Hong Kong', ownershipType: 'Government', feesPerYear: 3040000, rating: rating(4.1, 4.6), establishedIn: 1911, brochureUrl: 'https://www.hku.hk', category: 'FOREIGN' }
];

const ALL_REAL: RealInstitution[] = [...IITS, ...NITS, ...IIMS, ...FOREIGN];

const COURSE_TEMPLATES_ENGINEERING = [
  { name: 'B.Tech Computer Science', degreeLevel: 'UG', durationYears: 4 },
  { name: 'B.Tech Electrical Engineering', degreeLevel: 'UG', durationYears: 4 },
  { name: 'B.Tech Mechanical Engineering', degreeLevel: 'UG', durationYears: 4 },
  { name: 'B.Tech Civil Engineering', degreeLevel: 'UG', durationYears: 4 },
  { name: 'M.Tech Data Science', degreeLevel: 'PG', durationYears: 2 },
  { name: 'M.Tech Artificial Intelligence', degreeLevel: 'PG', durationYears: 2 }
];

const COURSE_TEMPLATES_MANAGEMENT = [
  { name: 'MBA / PGP', degreeLevel: 'PG', durationYears: 2 },
  { name: 'Executive MBA', degreeLevel: 'PG', durationYears: 1 },
  { name: 'PhD in Management', degreeLevel: 'Doctoral', durationYears: 4 }
];

const COURSE_TEMPLATES_FOREIGN = [
  { name: 'Bachelor of Science in Computer Science', degreeLevel: 'UG', durationYears: 4 },
  { name: 'Bachelor of Engineering', degreeLevel: 'UG', durationYears: 4 },
  { name: 'Master of Science in Computer Science', degreeLevel: 'PG', durationYears: 2 },
  { name: 'Master of Business Administration', degreeLevel: 'PG', durationYears: 2 },
  { name: 'PhD in Engineering', degreeLevel: 'Doctoral', durationYears: 5 }
];

const RECRUITERS = [
  'TCS, Infosys, Wipro', 'Amazon, Flipkart, Deloitte', 'Google, Microsoft, Adobe',
  'HDFC Bank, ICICI, Axis', 'Accenture, Capgemini, Cognizant', 'Reliance, Tata, Mahindra',
  'McKinsey, BCG, Bain', 'Goldman Sachs, JPMorgan, Morgan Stanley', 'Meta, Apple, Netflix'
];

const REVIEW_TITLES = [
  'Great faculty and infrastructure', 'Good placements but heavy workload',
  'Decent value for the fees', 'Strong alumni network', 'Campus life could be better',
  'Excellent labs and research opportunities', 'Placement cell is very active',
  'Solid academics, average hostel facilities'
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function slugify(name: string, index: number) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${index}`;
}

function overviewFor(inst: RealInstitution): string {
  const kind =
    inst.category === 'IIT' ? 'a premier engineering and technology institute'
    : inst.category === 'NIT' ? 'a national engineering institute'
    : inst.category === 'IIM' ? 'a premier graduate management institute'
    : 'a leading international university';

  return `${inst.name} is ${kind} located in ${inst.city}, ${inst.country}, established in ${inst.establishedIn}. It offers undergraduate and postgraduate programs known for their ${
    pick(['research output', 'industry partnerships', 'faculty quality', 'alumni network', 'placement record'])
  } and a competitive, selective admissions process. Fee figures shown are approximate annual tuition, normalized to INR for comparison — verify the current published fee circular on the institution's own site before making an admissions decision.`;
}

async function main() {
  console.log('Clearing existing data...');
  await prisma.review.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.savedComparison.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.college.deleteMany();

  console.log(`Seeding ${ALL_REAL.length} real institutions...`);

  for (let i = 0; i < ALL_REAL.length; i++) {
    const inst = ALL_REAL[i];

    const college = await prisma.college.create({
      data: {
        slug: slugify(inst.name, i),
        name: inst.name,
        city: inst.city,
        state: inst.state,
        country: inst.country,
        ownershipType: inst.ownershipType,
        feesPerYear: inst.feesPerYear,
        rating: inst.rating,
        establishedIn: inst.establishedIn,
        overview: overviewFor(inst),
        brochureUrl: inst.brochureUrl,
        logoColor: pick(LOGO_COLORS)
      }
    });

    const templates =
      inst.category === 'IIM' ? COURSE_TEMPLATES_MANAGEMENT
      : inst.category === 'FOREIGN' ? COURSE_TEMPLATES_FOREIGN
      : COURSE_TEMPLATES_ENGINEERING;

    const numCourses = randInt(2, Math.min(4, templates.length));
    const shuffled = [...templates].sort(() => Math.random() - 0.5).slice(0, numCourses);
    for (const template of shuffled) {
      await prisma.course.create({
        data: {
          collegeId: college.id,
          name: template.name,
          degreeLevel: template.degreeLevel,
          durationYears: template.durationYears,
          feesPerYear: Math.round(inst.feesPerYear * (0.85 + Math.random() * 0.3)),
          seats: randInt(30, 240)
        }
      });
    }

    for (const year of [2023, 2024]) {
      const base =
        inst.category === 'IIT' ? randInt(1200000, 3500000)
        : inst.category === 'IIM' ? randInt(1500000, 3800000)
        : inst.category === 'FOREIGN' ? randInt(2500000, 9000000)
        : randInt(700000, 1800000); // NIT

      await prisma.placement.create({
        data: {
          collegeId: college.id,
          year,
          averagePackage: base,
          medianPackage: Math.round(base * 0.85),
          highestPackage: Math.round(base * (2 + Math.random() * 2)),
          placementRate: Number(randInt(70, 99).toFixed(0)),
          topRecruiters: pick(RECRUITERS)
        }
      });
    }

    const numReviews = randInt(0, 6);
    for (let r = 0; r < numReviews; r++) {
      await prisma.review.create({
        data: {
          collegeId: college.id,
          authorName: pick(['Aarav S.', 'Priya K.', 'Rohan M.', 'Ananya T.', 'Vikram P.', 'Sneha R.']),
          rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
          course: pick(templates).name,
          title: pick(REVIEW_TITLES),
          body: 'The overall experience has been positive, with helpful faculty and reasonably good infrastructure. Placement support was available for most students, though outcomes varied by branch/specialization. (Sample review — placeholder content, not a verified student submission.)'
        }
      });
    }
  }

  console.log(`Seed complete: ${ALL_REAL.length} real institutions created (${IITS.length} IITs, ${NITS.length} NITs, ${IIMS.length} IIMs, ${FOREIGN.length} foreign universities).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
