// Reprezentatywny podzbiór bazy firm - 45 firm z różnych województw
// Pełna baza 155 firm dostępna w pliku: import-full-database.sql

export interface Company {
  id: number;
  name: string;
  region: string;
  city: string;
  industry: string;
  employees?: string;
  revenue?: string;
  potential: string;
  type: string;
  lat?: number;
  lng?: number;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  description?: string;
}

export const companiesData: Company[] = [
  // DOLNOŚLĄSKIE - 6 firm
  {id: 1, name: "KGHM POLSKA MIEDŹ S.A.", region: "dolnośląskie", city: "Lubin", industry: "górnictwo", employees: "18,000", revenue: "5 mld zł", potential: "wysoki", type: "klient", lat: 51.3945, lng: 16.2015, address: "ul. M. Skłodowskiej-Curie 48, 59-301 Lubin", phone: "+48 76 74 78 200", website: "https://kghm.com", email: "kghm@kghm.com", description: "Największy producent miedzi w UE"},
  {id: 2, name: "LG ENERGY SOLUTION WROCŁAW", region: "dolnośląskie", city: "Kobierzyce", industry: "motoryzacja", employees: "10,000", potential: "wysoki", type: "klient", lat: 50.9713, lng: 16.9335, address: "ul. LG 1A, Biskupice Podgórne", phone: "+48 799 393 393", website: "https://lgensol.pl", email: "lgrekrutacja@lgensol.com", description: "Największy w Europie producent baterii do samochodów elektrycznych"},
  {id: 3, name: "VOLKSWAGEN MOTOR POLSKA", region: "dolnośląskie", city: "Polkowice", industry: "motoryzacja", employees: "1,200", potential: "wysoki", type: "klient", lat: 51.5020, lng: 16.0719},
  {id: 6, name: "PCC ROKITA S.A.", region: "dolnośląskie", city: "Brzeg Dolny", industry: "chemia", employees: "1,500", potential: "wysoki", type: "klient", lat: 51.2722, lng: 16.7089},
  {id: 8, name: "MPWiK WROCŁAW", region: "dolnośląskie", city: "Wrocław", industry: "woda", employees: "800", potential: "wysoki", type: "klient", lat: 51.1079, lng: 17.0385},
  {id: 9, name: "MERCEDES-BENZ MANUFACTURING POLAND", region: "dolnośląskie", city: "Jawor", industry: "motoryzacja", employees: "1,500", potential: "wysoki", type: "klient", lat: 51.0600, lng: 16.1670},

  // ŚLĄSKIE - 6 firm
  {id: 13, name: "ARCELORMITTAL POLAND S.A.", region: "śląskie", city: "Dąbrowa Górnicza", industry: "hutnictwo", employees: "10,000", potential: "wysoki", type: "klient", lat: 50.3519, lng: 19.1951},
  {id: 14, name: "JASTRZĘBSKA SPÓŁKA WĘGLOWA S.A.", region: "śląskie", city: "Jastrzębie-Zdrój", industry: "górnictwo", employees: "22,000", potential: "wysoki", type: "klient", lat: 49.9546, lng: 18.5782},
  {id: 15, name: "POLSKA GRUPA GÓRNICZA S.A.", region: "śląskie", city: "Katowice", industry: "górnictwo", employees: "35,000", potential: "wysoki", type: "klient", lat: 50.2649, lng: 19.0238},
  {id: 16, name: "TAURON CIEPŁO Sp. z o.o.", region: "śląskie", city: "Katowice", industry: "energetyka", employees: "2,000", potential: "wysoki", type: "klient", lat: 50.2584, lng: 19.0275},
  {id: 17, name: "STELLANTIS GLIWICE", region: "śląskie", city: "Gliwice", industry: "motoryzacja", employees: "2,600", potential: "wysoki", type: "klient", lat: 50.3085, lng: 18.6938},
  {id: 19, name: "ALSTOM KONSTAL S.A.", region: "śląskie", city: "Chorzów", industry: "kolejnictwo", employees: "2,000", potential: "wysoki", type: "klient", lat: 50.3003, lng: 18.9554},

  // OPOLSKIE - 5 firm
  {id: 22, name: "GRUPA AZOTY KĘDZIERZYN", region: "opolskie", city: "Kędzierzyn-Koźle", industry: "chemia", employees: "3,000", potential: "wysoki", type: "klient", lat: 50.3494, lng: 18.2264},
  {id: 24, name: "PGE ELEKTROWNIA OPOLE", region: "opolskie", city: "Brzezie", industry: "energetyka", employees: "1,500", potential: "wysoki", type: "klient", lat: 50.6018, lng: 17.8566},
  {id: 25, name: "GÓRAŻDŻE CEMENT S.A.", region: "opolskie", city: "Chorula", industry: "cementownie", employees: "800", potential: "wysoki", type: "klient", lat: 50.5583, lng: 18.0067},
  {id: 27, name: "ADIENT POLAND", region: "opolskie", city: "Skarbimierz", industry: "motoryzacja", employees: "600", potential: "wysoki", type: "klient", lat: 50.8442, lng: 17.4286},
  {id: 30, name: "COROPLAST POLSKA", region: "opolskie", city: "Strzelce Opolskie", industry: "motoryzacja", employees: "7,000", potential: "wysoki", type: "klient", lat: 50.5090, lng: 18.3004},

  // ŁÓDZKIE - 6 firm
  {id: 36, name: "PGE ELEKTROWNIA BEŁCHATÓW", region: "łódzkie", city: "Bełchatów", industry: "energetyka", employees: "4,393", potential: "wysoki", type: "klient", lat: 51.2667, lng: 19.3569},
  {id: 37, name: "BSH SPRZĘT GOSPODARSTWA DOMOWEGO", region: "łódzkie", city: "Łódź", industry: "AGD", employees: "8,000", potential: "wysoki", type: "klient", lat: 51.7592, lng: 19.4560},
  {id: 38, name: "HUTCHINSON POLAND", region: "łódzkie", city: "Łódź", industry: "motoryzacja", employees: "2,500", potential: "wysoki", type: "klient", lat: 51.7469, lng: 19.4498},
  {id: 40, name: "HAERING POLSKA", region: "łódzkie", city: "Piotrków Trybunalski", industry: "motoryzacja", employees: "2,500", potential: "wysoki", type: "klient", lat: 51.4055, lng: 19.7033},
  {id: 46, name: "ATLAS SP. Z O.O.", region: "łódzkie", city: "Łódź", industry: "chemia budowlana", employees: "2,000", potential: "wysoki", type: "klient", lat: 51.7592, lng: 19.4560},
  {id: 51, name: "CERAMIKA PARADYŻ", region: "łódzkie", city: "Opoczno", industry: "ceramika", employees: "1,600", potential: "wysoki", type: "klient", lat: 51.3753, lng: 20.2782},

  // MAŁOPOLSKIE - 6 firm
  {id: 55, name: "GRUPA AZOTY S.A.", region: "małopolskie", city: "Tarnów", industry: "chemia", employees: "15,609", potential: "wysoki", type: "klient", lat: 50.0121, lng: 20.9858},
  {id: 56, name: "SYNTHOS S.A.", region: "małopolskie", city: "Oświęcim", industry: "chemia", employees: "3,000", potential: "wysoki", type: "klient", lat: 50.0343, lng: 19.2098},
  {id: 61, name: "APTIV SERVICES POLAND", region: "małopolskie", city: "Kraków", industry: "motoryzacja", employees: "5,500", potential: "wysoki", type: "klient", lat: 50.0185, lng: 19.9560},
  {id: 62, name: "PHILIP MORRIS POLSKA", region: "małopolskie", city: "Kraków", industry: "tytoniowy", employees: "3,000", potential: "wysoki", type: "klient", lat: 50.0925, lng: 19.9742},
  {id: 69, name: "FAKRO Sp. z o.o.", region: "małopolskie", city: "Nowy Sącz", industry: "budownictwo", employees: "4,000", potential: "wysoki", type: "klient", lat: 49.6175, lng: 20.6978},
  {id: 73, name: "MASPEX", region: "małopolskie", city: "Wadowice", industry: "spożywczy", employees: "7,000", potential: "wysoki", type: "klient", lat: 49.8837, lng: 19.4933},

  // MAZOWIECKIE - 6 firm
  {id: 78, name: "PKN ORLEN", region: "mazowieckie", city: "Płock", industry: "chemia", employees: "22,000", potential: "wysoki", type: "klient", lat: 52.5468, lng: 19.7064},
  {id: 82, name: "MPWiK WARSZAWA", region: "mazowieckie", city: "Warszawa", industry: "woda", employees: "2,500", potential: "wysoki", type: "klient", lat: 52.2416, lng: 21.0216},
  {id: 85, name: "ELEKTROCIEPŁOWNIA SIEKIERKI", region: "mazowieckie", city: "Warszawa", industry: "energetyka", potential: "wysoki", type: "klient", lat: 52.1873, lng: 21.0533},
  {id: 89, name: "LG ELECTRONICS MŁAWA", region: "mazowieckie", city: "Mława", industry: "elektronika", employees: "2,000", potential: "wysoki", type: "klient", lat: 53.1120, lng: 20.3826},
  {id: 90, name: "MARS POLSKA", region: "mazowieckie", city: "Sochaczew", industry: "spożywczy", employees: "800", potential: "wysoki", type: "klient", lat: 52.2293, lng: 20.2384},
  {id: 92, name: "ELEKTROWNIA OSTROŁĘKA", region: "mazowieckie", city: "Ostrołęka", industry: "energetyka", potential: "wysoki", type: "klient", lat: 53.0893, lng: 21.5731},

  // PODKARPACKIE - 5 firm
  {id: 101, name: "BORG WARNER", region: "podkarpackie", city: "Rzeszów", industry: "motoryzacja", employees: "4,500", potential: "wysoki", type: "klient", lat: 50.0119, lng: 22.0138},
  {id: 102, name: "HUTA STALOWA WOLA S.A.", region: "podkarpackie", city: "Stalowa Wola", industry: "hutnictwo", employees: "2,000", potential: "wysoki", type: "klient", lat: 50.5821, lng: 22.0538},
  {id: 106, name: "WSK PZL-RZESZÓW", region: "podkarpackie", city: "Rzeszów", industry: "lotniczy", employees: "4,500", potential: "wysoki", type: "klient", lat: 50.0100, lng: 22.0300},
  {id: 109, name: "FIBRAIN", region: "podkarpackie", city: "Rogoźnica", industry: "elektronika", employees: "700", potential: "wysoki", type: "klient", lat: 50.0532, lng: 22.0160},
  {id: 110, name: "SANOK RUBBER COMPANY", region: "podkarpackie", city: "Sanok", industry: "motoryzacja", employees: "3,400", potential: "wysoki", type: "klient", lat: 49.5559, lng: 22.2056},

  // WIELKOPOLSKIE - 5 firm
  {id: 119, name: "VOLKSWAGEN POZNAŃ", region: "wielkopolskie", city: "Poznań", industry: "motoryzacja", employees: "9,500", potential: "wysoki", type: "klient", lat: 52.4600, lng: 16.9900},
  {id: 120, name: "BRIDGESTONE POZNAŃ", region: "wielkopolskie", city: "Poznań", industry: "motoryzacja", employees: "2,000", potential: "wysoki", type: "klient", lat: 52.3640, lng: 16.9950},
  {id: 124, name: "ZE PAK S.A.", region: "wielkopolskie", city: "Konin", industry: "energetyka", potential: "wysoki", type: "klient", lat: 52.2230, lng: 18.2512},
  {id: 127, name: "KIMBALL ELECTRONICS", region: "wielkopolskie", city: "Poznań", industry: "elektronika", employees: "1,800", potential: "wysoki", type: "klient", lat: 52.3705, lng: 16.8000},
  {id: 130, name: "KOMPANIA PIWOWARSKA", region: "wielkopolskie", city: "Poznań", industry: "spożywczy", employees: "1,000", potential: "wysoki", type: "klient", lat: 52.3851, lng: 16.8992},

  // PARTNERZY/HVAC - 5 firm (fioletowe piny)
  {id: 133, name: "ANG WENTYLACJA", region: "dolnośląskie", city: "Wrocław", industry: "hvac", potential: "wysoki", type: "partner", lat: 51.1079, lng: 17.0385, phone: "+48 71 756 31 10", website: "https://ang.com.pl", description: "Dystrybutor systemów HVAC i klimatyzacji"},
  {id: 138, name: "FILTRY PRZEMYSŁOWE POLSKA", region: "mazowieckie", city: "Warszawa", industry: "filtry", potential: "wysoki", type: "partner", lat: 52.2297, lng: 21.0122, website: "https://fppolska.com", description: "Dystrybutor filtrów przemysłowych"},
  {id: 142, name: "SYSTEMCOLD", region: "małopolskie", city: "Kraków", industry: "hvac", employees: "40", potential: "wysoki", type: "partner", lat: 50.0801, lng: 19.9766, website: "https://systemcold.pl", description: "Dostawca rozwiązań chłodniczych i HVAC"},
  {id: 147, name: "EKOMAL", region: "łódzkie", city: "Wieluń", industry: "lakiernie", employees: "40", potential: "wysoki", type: "partner", lat: 51.2207, lng: 18.5696, phone: "+48 43 843 31 54", website: "https://ekomal.pl", description: "Producent kabin lakierniczych z filtracją"},
  {id: 150, name: "BLF FILTRATION", region: "lubuskie", city: "Grabowiec", industry: "filtry", potential: "wysoki", type: "partner", lat: 52.0000, lng: 15.6000, phone: "+48 600 900 583", website: "https://blf.com.pl", description: "Producent filtrów procesowych"},
];
