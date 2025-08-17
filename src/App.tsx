import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, Filter, Eye, Globe, Mail, Plus, MapPin, Users, TrendingUp, 
  Building, Phone, Star, ArrowUpDown, Download, BarChart3, PieChart,
  Target, Zap, ExternalLink, X, CheckCircle, AlertCircle,
  Calendar, DollarSign, Briefcase, Map, Database, Settings, Home
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';

// TUTAJ WKLEJ POZOSTAŁE DANE - po const companies = [
const companies = [
            {id: 1, name: "KGHM POLSKA MIEDŹ S.A.", region: "dolnośląskie", city: "Lubin", industry: "górnictwo", employees: "18,000", revenue: "5 mld zł", potential: "wysoki", type: "klient", lat: 51.3945, lng: 16.2015, address: "ul. M. Skłodowskiej-Curie 48, 59-301 Lubin", phone: "+48 76 74 78 200", website: "https://kghm.com", email: "kghm@kghm.com", description: "Największy producent miedzi w UE, prowadzi wydobycie rud miedzi"},
            {id: 2, name: "LG ENERGY SOLUTION WROCŁAW", region: "dolnośląskie", city: "Kobierzyce", industry: "motoryzacja", employees: "10,000", revenue: "brak informacji", potential: "wysoki", type: "klient", lat: 50.9713, lng: 16.9335, address: "ul. LG 1A, Biskupice Podgórne", phone: "+48 799 393 393", website: "https://lgensol.pl", email: "lgrekrutacja@lgensol.com", description: "Największy w Europie producent baterii do samochodów elektrycznych"},
            {id: 3, name: "VOLKSWAGEN MOTOR POLSKA", region: "dolnośląskie", city: "Polkowice", industry: "motoryzacja", employees: "1,200", revenue: "5,6 mld zł", potential: "wysoki", type: "klient", lat: 51.5020, lng: 16.0719, address: "ul. Strefowa 1, 59-101 Polkowice", phone: "+48 76 847 77 00", website: "https://volkswagen-motor.pl", email: "info@volkswagen-motor.pl", description: "Zakład Volkswagena produkujący silniki do samochodów osobowych"},
            {id: 4, name: "TOYOTA MOTOR MANUFACTURING POLAND", region: "dolnośląskie", city: "Jelcz-Laskowice", industry: "motoryzacja", employees: "2,500", revenue: "brak informacji", potential: "wysoki", type: "klient", lat: 51.0389, lng: 17.3458, address: "ul. Japońska 6, 55-220 Jelcz-Laskowice", phone: "+48 71 302 00 00", website: "https://toyotapl.com", email: "rekrutacja@toyotapl.com", description: "Fabryka Toyoty produkująca silniki i komponenty do aut osobowych"},
            {id: 5, name: "PGE ELEKTROWNIA TURÓW", region: "dolnośląskie", city: "Bogatynia", industry: "energetyka", employees: "250", revenue: "brak informacji", potential: "wysoki", type: "klient", lat: 50.9144, lng: 14.9564, address: "ul. Młodych Energetyków 12, 59-920 Bogatynia", phone: "+48 75 773 49 00", website: "https://gkpge.pl", email: "elektrowniaturow@gkpge.pl", description: "Duża elektrownia węglowa wchodząca w skład Grupy PGE"},
            {id: 6, name: "PCC ROKITA S.A.", region: "dolnośląskie", city: "Brzeg Dolny", industry: "chemia", employees: "1,500", revenue: "1.5 mld zł", potential: "wysoki", type: "klient", lat: 51.2722, lng: 16.7089, address: "ul. Sienkiewicza 4, 56-120 Brzeg Dolny", phone: "+48 71 794 2000", website: "https://pcc.rokita.pl", email: "zakupy.rokita@pcc.eu", description: "Producent chemikaliów przemysłowych i specjalistycznych"},
            {id: 7, name: "HASCO-LEK S.A.", region: "dolnośląskie", city: "Wrocław", industry: "farmacja", employees: "500", revenue: "brak informacji", potential: "wysoki", type: "klient", lat: 51.1353, lng: 16.9800, address: "ul. Żmigrodzka 242E, 51-131 Wrocław", phone: "+48 71 352 95 22", website: "https://hasco-lek.pl", email: "hasco@hasco-lek.pl", description: "Polska firma farmaceutyczna, producent leków i suplementów diety"},
            {id: 8, name: "MPWiK WROCŁAW", region: "dolnośląskie", city: "Wrocław", industry: "woda", employees: "800", revenue: "brak informacji", potential: "wysoki", type: "klient", lat: 51.1079, lng: 17.0385, address: "ul. Na Grobli 14/16, 50-421 Wrocław", phone: "+48 71 340 95 00", website: "https://mpwik.wroc.pl", email: "bok@mpwik.wroc.pl", description: "Miejskie przedsiębiorstwo wodociągowe obsługujące Wrocław"},
            {id: 9, name: "MERCEDES-BENZ MANUFACTURING POLAND", region: "dolnośląskie", city: "Jawor", industry: "motoryzacja", employees: "1,500", revenue: "brak informacji", potential: "wysoki", type: "potencjalny partner biznesowy", lat: 51.0600, lng: 16.1670, address: "ul. Gottlieba Daimlera 5, 59-400 Jawor", phone: "+48 735 253 990", website: "https://mercedes-benz-jawor.com.pl", email: "sekretariatmbmpl@mercedes-benz.com", description: "Nowoczesna fabryka Mercedes-Benz produkująca silniki i baterie do aut elektrycznych"},
            {id: 10, name: "CCC S.A.", region: "dolnośląskie", city: "Polkowice", industry: "obuwie", employees: "15,600", revenue: "10 mld zł", potential: "wysoki", type: "potencjalny partner biznesowy", lat: 51.5037, lng: 16.0684, address: "ul. Strefowa 6, 59-101 Polkowice", phone: "+48 76 845 84 00", website: "https://ccc.eu", email: "ccc@ccc.eu", description: "Największa polska firma obuwnicza prowadząca jedną z największych sieci sprzedaży w Europie Środkowo-Wschodniej"},
            {id: 11, name: "AB S.A.", region: "dolnośląskie", city: "Magnice", industry: "dystrybucja IT", employees: "1,000", revenue: "15 mld zł", potential: "wysoki", type: "potencjalny partner biznesowy", lat: 50.9985, lng: 16.9555, address: "ul. Europejska 4, 55-040 Magnice", phone: "+48 71 393 76 00", website: "https://www.ab.pl", email: "sekretariat@ab.pl", description: "Największy w Polsce i jeden z czołowych w Europie dystrybutorów sprzętu IT i elektroniki"},
            {id: 12, name: "PFLEIDERER GROUP S.A.", region: "dolnośląskie", city: "Wrocław", industry: "przemysł drzewny", employees: "3,300", revenue: "2,5 mld zł", potential: "wysoki", type: "potencjalny partner biznesowy", lat: 51.1136, lng: 16.9909, address: "ul. Strzegomska 42AB, 53-611 Wrocław", phone: "+48 71 747 10 00", website: "https://www.pfleiderer.com", email: "poczta@pfleiderer.pl", description: "Wiodący europejski producent materiałów drewnopochodnych dla meblarstwa i budownictwa"},
            {id: 13, name: "ARCELORMITTAL POLAND S.A.", region: "śląskie", city: "Dąbrowa Górnicza", industry: "hutnictwo", employees: "10,000", revenue: "8 mld zł", potential: "wysoki", type: "klient", lat: 50.3519, lng: 19.1951, address: "Al. Józefa Piłsudskiego 92, 41-308 Dąbrowa Górnicza", phone: "+48 32 776 66 66", website: "https://poland.arcelormittal.com", email: "info.poland@arcelormittal.com", description: "Największy producent stali w Polsce, część globalnej grupy ArcelorMittal"},
            {id: 14, name: "JASTRZĘBSKA SPÓŁKA WĘGLOWA S.A.", region: "śląskie", city: "Jastrzębie-Zdrój", industry: "górnictwo", employees: "22,000", revenue: "6-8 mld zł", potential: "wysoki", type: "klient", lat: 49.9546, lng: 18.5782, address: "Aleja Jana Pawła II 4, 44-330 Jastrzębie-Zdrój", phone: "+48 32 756 43 00", website: "https://jsw.pl", email: "centrala@jsw.pl", description: "Największy producent węgla koksowego w UE, spółka notowana na GPW"},
            {id: 15, name: "POLSKA GRUPA GÓRNICZA S.A.", region: "śląskie", city: "Katowice", industry: "górnictwo", employees: "35,000", revenue: "brak informacji", potential: "wysoki", type: "klient", lat: 50.2649, lng: 19.0238, address: "ul. Powstańców 30, 40-039 Katowice", phone: "+48 32 757 22 11", website: "https://pgg.pl", email: "centrala@pgg.pl", description: "Największa spółka górnicza w Polsce, posiada kilkanaście kopalń na Śląsku"},
            {id: 16, name: "TAURON CIEPŁO Sp. z o.o.", region: "śląskie", city: "Katowice", industry: "energetyka", employees: "2,000", revenue: "brak informacji", potential: "wysoki", type: "klient", lat: 50.2584, lng: 19.0275, address: "ul. Grażyńskiego 49, 40-126 Katowice", phone: "+48 32 258 40 01", website: "https://cieplo.tauron.pl", email: "tc.dyspozytor@tauron.pl", description: "Spółka Grupy TAURON dostarczająca ciepło systemowe w aglomeracji śląsko-zagłębiowskiej"},
            {id: 17, name: "STELLANTIS GLIWICE (dawniej Opel)", region: "śląskie", city: "Gliwice", industry: "motoryzacja", employees: "2,600", revenue: "brak informacji", potential: "wysoki", type: "klient", lat: 50.3085, lng: 18.6938, address: "ul. Adama Opla 1, 44-121 Gliwice", phone: "+48 32 270 70 00", website: "https://stellantis.com", email: "rekrutacja@stellantis.com", description: "Fabryka samochodów dostawczych koncernu Stellantis, wcześniej Opel Manufacturing"},
            {id: 18, name: "LOTOS KOLEJ Sp. z o.o. (Oddział Śląski)", region: "śląskie", city: "Czechowice-Dziedzice", industry: "transport/energetyka", employees: "brak informacji", revenue: "brak informacji", potential: "średni", type: "potencjalny partner biznesowy", lat: 49.9081, lng: 19.0046, address: "ul. Traugutta 1, 43-502 Czechowice-Dziedzice", phone: "+48 32 215 21 00", website: "https://lotoskolej.pl", email: "info@lotoskolej.pl", description: "Przewoźnik kolejowy należący do Grupy LOTOS, obsługujący transport paliw i chemikaliów"},
            {id: 19, name: "ALSTOM KONSTAL S.A.", region: "śląskie", city: "Chorzów", industry: "kolejnictwo", employees: "2,000", revenue: "brak informacji", potential: "wysoki", type: "potencjalny partner biznesowy", lat: 50.3003, lng: 18.9554, address: "ul. Metalowców 9, 41-500 Chorzów", phone: "+48 32 241 60 00", website: "https://www.alstom.com", email: "kontakt.pl@alstom.com", description: "Producent taboru kolejowego i tramwajów, część globalnej grupy Alstom"},
            {id: 20, name: "FIAT POWERTRAIN TECHNOLOGIES (FPT)", region: "śląskie", city: "Bielsko-Biała", industry: "motoryzacja", employees: "2,000", revenue: "brak informacji", potential: "wysoki", type: "potencjalny partner biznesowy", lat: 49.8224, lng: 19.0476, address: "ul. Partyzantów 44, 43-300 Bielsko-Biała", phone: "+48 33 813 10 00", website: "https://www.fptindustrial.com", email: "info.poland@fpt.com", description: "Fabryka silników i układów napędowych koncernu Stellantis (marka FPT Industrial)"},
            {id: 21, name: "PRZEDSIĘBIORSTWO PRZEMYSŁU SPOŻYWCZEGO MOKATE S.A.", region: "śląskie", city: "Żory", industry: "spożywcza", employees: "1,500", revenue: "brak informacji", potential: "średni", type: "potencjalny partner biznesowy", lat: 50.0457, lng: 18.7002, address: "ul. Strażacka 48, 44-240 Żory", phone: "+48 32 434 91 00", website: "https://mokate.com", email: "office@mokate.com", description: "Znany polski producent kawy, herbaty i wyrobów instant, obecny na wielu rynkach eksportowych"},
            {id: 22, name: "PRZEDSIĘBIORSTWO PRODUKCYJNE HUTCHINSON POLAND", region: "śląskie", city: "Żywiec", industry: "motoryzacja", employees: "1,200", revenue: "brak informacji", potential: "średni", type: "potencjalny partner biznesowy", lat: 49.6820, lng: 19.2083, address: "ul. Leśnianka 73, 34-300 Żywiec", phone: "+48 33 861 22 00", website: "https://www.hutchinson.com", email: "info.pl@hutchinson.com", description: "Zakład koncernu Hutchinson produkujący uszczelki i elementy gumowe dla motoryzacji"},
            {id: 23, name: "GRUPA AZOTY KĘDZIERZYN", region: "opolskie", city: "Kędzierzyn-Koźle", industry: "chemia", employees: "3,000", revenue: "4-5 mld zł", potential: "wysoki", type: "klient", lat: 50.3494, lng: 18.2264, address: "ul. Mostowa 30A, 47-220 Kędzierzyn-Koźle", phone: "+48 77 481 20 00", website: "https://zak.grupaazoty.com", email: "zak@grupaazoty.com", description: "Produkcja nawozów azotowych i plastyfikatorów, część Grupy Azoty"},
            {id: 24, name: "BRENNTAG POLSKA", region: "opolskie", city: "Kędzierzyn-Koźle", industry: "chemia", employees: "150", revenue: "brak informacji", potential: "wysoki", type: "klient", lat: 50.3424, lng: 18.1464, address: "ul. J. Bema 21, 47-224 Kędzierzyn-Koźle", phone: "+48 77 472 15 00", website: "https://brenntag.pl", email: "biuro@brenntag.pl", description: "Dystrybutor i producent chemikaliów przemysłowych"},
            {id: 25, name: "PGE ELEKTROWNIA OPOLE", region: "opolskie", city: "Brzezie", industry: "energetyka", employees: "1,500", revenue: "brak informacji", potential: "wysoki", type: "klient", lat: 50.6018, lng: 17.8566, address: "Brzezie k. Opola, 46-021", phone: "+48 77 423 50 50", website: "https://elopole.pl", email: "sekretariat.elopole@gkpge.pl", description: "Jedna z największych elektrowni w Polsce, moc zainstalowana 3342 MW"},
            {id: 26, name: "GÓRAŻDŻE CEMENT S.A.", region: "opolskie", city: "Chorula", industry: "cementownie", employees: "800", revenue: "brak informacji", potential: "wysoki", type: "klient", lat: 50.5583, lng: 18.0067, address: "ul. Cementowa 1, 47-316 Chorula", phone: "+48 77 777 81 01", website: "https://gorazdze.pl", email: "biuro@gorazdze.pl", description: "Największy producent cementu w Polsce, część Heidelberg Materials"},
            {id: 27, name: "ADIENT POLAND", region: "opolskie", city: "Skarbimierz", industry: "motoryzacja", employees: "600", revenue: "brak informacji", potential: "wysoki", type: "klient", lat: 50.8442, lng: 17.4286, address: "ul. Motoryzacyjna 1, 49-318 Skarbimierz", phone: "+48 77 404 65 00", website: "https://www.adient.com", email: "info.pl@adient.com", description: "Producent siedzeń samochodowych, dostawca dla największych koncernów motoryzacyjnych"},
            {id: 28, name: "NUTRICIA (DANONE)", region: "opolskie", city: "Opole", industry: "spożywczy", employees: "500", revenue: "brak informacji", potential: "wysoki", type: "klient", lat: 50.6751, lng: 17.9213, address: "ul. Marka z Jemielnicy 1, 45-952 Opole", phone: "+48 77 400 69 00", website: "https://danone.pl", email: "kontakt@danone.com", description: "Producent żywności dla niemowląt i dzieci, część Grupy Danone"},
            {id: 29, name: "HUTA MAŁAPANEW S.A.", region: "opolskie", city: "Ozimek", industry: "hutnictwo", employees: "400", revenue: "brak informacji", potential: "wysoki", type: "klient", lat: 50.6794, lng: 18.2135, address: "ul. Kolejowa 1, 46-040 Ozimek", phone: "+48 77 401 85 10", website: "https://hutamalapanew.com.pl", email: "biuro@hutamalapanew.com.pl", description: "Najstarsza huta w Polsce, producent odlewów i konstrukcji stalowych"},
            {id: 30, name: "NM POLSKA (VELUX)", region: "opolskie", city: "Namysłów", industry: "okna i elementy drewniane", employees: "800", revenue: "brak informacji", potential: "średni", type: "klient", lat: 51.0759, lng: 17.7216, address: "ul. Oleśnicka 12, 46-100 Namysłów", phone: "+48 77 410 41 00", website: "https://velux.pl", email: "kontakt@velux.pl", description: "Producent okien dachowych i komponentów drewnianych, część Grupy Velux"},
            {id: 31, name: "COROPLAST POLSKA", region: "opolskie", city: "Strzelce Opolskie", industry: "motoryzacja (wiązki elektryczne)", employees: "7,000", revenue: "brak informacji", potential: "wysoki", type: "klient", lat: 50.5090, lng: 18.3004, address: "ul. Ciepłownicza 8, 47-100 Strzelce Opolskie", phone: "+48 77 549 55 00", website: "https://coroplast-group.com", email: "info.pl@coroplast.com", description: "Producent wiązek elektrycznych i taśm technicznych dla motoryzacji"},
            {id: 32, name: "LHOIST OPOLWAP S.A.", region: "opolskie", city: "Tarnów Opolski", industry: "górnictwo (wapień)", employees: "377", revenue: "brak informacji", potential: "średni", type: "klient", lat: 50.5735, lng: 17.9318, address: "ul. Wapiennicza 7, 46-050 Tarnów Opolski", phone: "+48 77 451 62 00", website: "https://lhoist.com", email: "info.pl@lhoist.com", description: "Producent wapna i kamienia wapiennego, część Grupy Lhoist"},
            {id: 33, name: "WODOCIĄGI I KANALIZACJA OPOLE", region: "opolskie", city: "Opole", industry: "woda", employees: "300", revenue: "brak informacji", potential: "wysoki", type: "klient", lat: 50.6751, lng: 17.9213, address: "ul. Oleska 64, 45-222 Opole", phone: "+48 77 443 55 00", website: "https://wikopole.com.pl", email: "wik@wikopole.com.pl", description: "Operator wodociągów i kanalizacji w Opolu"},
            {id: 34, name: "WEISS TECHNIK POLSKA Sp. z o.o.", region: "opolskie", city: "Opole", industry: "technika klimatyzacyjna", employees: "brak informacji", revenue: "brak informacji", potential: "średni", type: "potencjalny partner biznesowy", lat: 50.6751, lng: 17.9213, address: "ul. Wspólna 6, 45-837 Opole", phone: "+48 77 456 85 00", website: "https://weiss-technik.pl", email: "info@weiss-technik.pl", description: "Producent urządzeń do testów klimatycznych i systemów wentylacyjnych dla przemysłu"},
            {id: 35, name: "MULTISERWIS Sp. z o.o.", region: "opolskie", city: "Kędzierzyn-Koźle", industry: "usługi przemysłowe", employees: "2,500", revenue: "brak informacji", potential: "wysoki", type: "potencjalny partner biznesowy", lat: 50.3445, lng: 18.2050, address: "ul. Szkolna 15, 47-225 Kędzierzyn-Koźle", phone: "+48 77 405 35 00", website: "https://multiserwis.com.pl", email: "biuro@multiserwis.com.pl", description: "Firma inżynieryjna świadcząca usługi dla energetyki, chemii i przemysłu ciężkiego, część Bilfinger SE"},
            {id: 36, name: "MONDELEZ POLSKA PRODUCTION Sp. z o.o.", region: "opolskie", city: "Skarszewy/Opole", industry: "spożywcza", employees: "1,000+", revenue: "brak informacji", potential: "wysoki", type: "potencjalny partner biznesowy", lat: 50.6751, lng: 17.9213, address: "ul. Powstańców Warszawskich 7, 45-086 Opole", phone: "+48 77 456 22 00", website: "https://pl.mondelezinternational.com", email: "kontakt.pl@mdlz.com", description: "Producent wyrobów cukierniczych i przekąsek (m.in. Milka, Oreo), część globalnej grupy Mondelez"},
            {id: 37, name: "PGE ELEKTROWNIA BEŁCHATÓW", region: "łódzkie", city: "Bełchatów", industry: "energetyka", employees: "4,393", potential: "wysoki", type: "klient", lat: 51.2667, lng: 19.3569, address: "ul. Wola Grzymalina 3, 97-400 Bełchatów", phone: "+48 44 735 44 44", website: "https://elbelchatow.pgegiek.pl", description: "Największa elektrownia węglowa w Europie, część PGE"},
            {id: 38, name: "BSH SPRZĘT GOSPODARSTWA DOMOWEGO", region: "łódzkie", city: "Łódź", industry: "AGD", employees: "8,000", potential: "wysoki", type: "klient", lat: 51.7592, lng: 19.4560, address: "ul. Papiernicza 1, 92-312 Łódź", phone: "+48 42 272 85 01", website: "https://www.bsh-group.com/pl", email: "kontakt@bshg.com", description: "Producent sprzętu AGD marek Bosch, Siemens i Gaggenau"},
            {id: 39, name: "HUTCHINSON POLAND", region: "łódzkie", city: "Łódź", industry: "motoryzacja", employees: "2,500", potential: "wysoki", type: "klient", lat: 51.7469, lng: 19.4498, address: "ul. Kurczaki 130, 93-331 Łódź", phone: "+48 42 685 54 00", website: "https://www.hutchinson.com", description: "Producent uszczelnień, przewodów i elementów gumowych dla motoryzacji"},
            {id: 40, name: "ABB SP. Z O.O.", region: "łódzkie", city: "Łódź", industry: "energetyka i automatyka", employees: "brak informacji", potential: "wysoki", type: "klient", lat: 51.7977, lng: 19.4376, address: "ul. Aleksandrowska 67/93, 91-205 Łódź", phone: "+48 22 222 3 777", website: "https://new.abb.com/pl", email: "contact.center@pl.abb.com", description: "Światowy lider w automatyce i technologiach energetycznych"},
            {id: 41, name: "HAERING POLSKA", region: "łódzkie", city: "Piotrków Trybunalski", industry: "motoryzacja", employees: "2,500", potential: "wysoki", type: "klient", lat: 51.4055, lng: 19.7033, address: "ul. Niska 14, 97-300 Piotrków Trybunalski", phone: "+48 44 648 89 00", website: "https://anton-haering.com", description: "Producent precyzyjnych komponentów dla branży automotive"},
            {id: 42, name: "CLARIANT POLSKA", region: "łódzkie", city: "Konstantynów Łódzki", industry: "chemia", employees: "400", potential: "wysoki", type: "klient", lat: 51.7478, lng: 19.3256, address: "ul. Innowacyjna 2, 95-050 Konstantynów Łódzki", phone: "+48 42 279 08 00", website: "https://www.clariant.com", email: "info.poland@clariant.com", description: "Producent specjalistycznych chemikaliów i barwników"},
            {id: 43, name: "ARIADNA S.A.", region: "łódzkie", city: "Łódź", industry: "tekstylia", employees: "300", potential: "wysoki", type: "klient", lat: 51.7847, lng: 19.4707, address: "ul. Niciarniana 2/6, 92-320 Łódź", phone: "+48 42 253 58 10", website: "https://ariadna.com.pl", email: "sprzedaz@ariadna.com.pl", description: "Producent nici i włókienniczych wyrobów przemysłowych"},
            {id: 44, name: "TOMTEX S.A.", region: "łódzkie", city: "Tomaszów Mazowiecki", industry: "tekstylia", employees: "250", potential: "wysoki", type: "klient", lat: 51.5315, lng: 20.0087, address: "ul. Włókiennicza 12/18, 97-200 Tomaszów Mazowiecki", phone: "+48 44 723 39 41", website: "https://tomtex.com.pl", email: "tomtex@tomtex.com.pl", description: "Producent tkanin i włóknin technicznych"},
            {id: 45, name: "BARRY CALLEBAUT", region: "łódzkie", city: "Łódź", industry: "spożywczy", employees: "13,000 (globalnie), 400 w Polsce", potential: "wysoki", type: "klient", lat: 51.8180, lng: 19.4270, address: "Nowy Józefów 36, 94-406 Łódź", phone: "+48 42 208 77 00", website: "https://www.barry-callebaut.com", email: "info_pl@barry-callebaut.com", description: "Światowy producent czekolady i kakao, zakład produkcyjny w Łodzi"},
            {id: 46, name: "TAT-POL SP. Z O.O.", region: "łódzkie", city: "Działoszyn", industry: "spożywczy", employees: "brak informacji", potential: "średni", type: "klient", lat: 51.1178, lng: 18.8651, address: "ul. Wojska Polskiego 9-11, 98-355 Działoszyn", phone: "+48 43 841 32 45", website: "https://fructos.pl", email: "biuro@fructos.pl", description: "Producent syropów glukozowych i maltodekstryn"},
            {id: 47, name: "ATLAS SP. Z O.O.", region: "łódzkie", city: "Łódź / Piotrków Trybunalski", industry: "chemia budowlana", employees: "2,000", revenue: "1.3 mld zł", potential: "wysoki", type: "klient", lat: 51.7592, lng: 19.4560, address: "ul. Kilińskiego 2, 90-421 Łódź", phone: "+48 42 631 89 00", website: "https://atlas.com.pl", email: "atlas@atlas.com.pl", description: "Największy polski producent chemii budowlanej"},
            {id: 48, name: "KELMET", region: "łódzkie", city: "Łódź", industry: "metalurgia", employees: "brak informacji", potential: "średni", type: "klient", lat: 51.7468, lng: 19.4963, address: "ul. Gminna 5, 91-342 Łódź", phone: "+48 42 648 88 98", website: "https://kelmet.pl", email: "handlowy@kelmet.pl", description: "Producent elementów metalowych i konstrukcji stalowych"},
            {id: 49, name: "TOMA SP. Z O.O.", region: "łódzkie", city: "Tomaszów Mazowiecki", industry: "chemia", employees: "90", potential: "średni", type: "klient", lat: 51.5315, lng: 20.0087, address: "ul. Majowa 87/91, 97-200 Tomaszów Mazowiecki", phone: "+48 44 724 33 55", website: "https://toma.com.pl", email: "info@toma.com.pl", description: "Producent płynów technicznych i chemii gospodarczej"},
            {id: 50, name: "INDESIT COMPANY POLSKA (WHIRLPOOL)", region: "łódzkie", city: "Łódź", industry: "AGD", employees: "3,000", potential: "wysoki", type: "potencjalny partner biznesowy", lat: 51.7355, lng: 19.4858, address: "ul. Lodowa 88, 93-232 Łódź", phone: "+48 42 645 30 00", website: "https://whirlpool.pl", email: "biuro@whirlpool.com", description: "Producent sprzętu AGD marek Whirlpool i Indesit"},
            {id: 51, name: "DELL PRODUCTS POLAND", region: "łódzkie", city: "Łódź", industry: "elektronika", employees: "1,500", potential: "wysoki", type: "potencjalny partner biznesowy", lat: 51.7592, lng: 19.4560, address: "ul. Piotrkowska 276, 90-361 Łódź", phone: "+48 42 634 33 00", website: "https://dell.com/pl", email: "kontakt@dell.com", description: "Zakład montażu i centrum logistyczne DELL w Łodzi"},
            {id: 52, name: "CERAMIKA PARADYŻ", region: "łódzkie", city: "Opoczno", industry: "ceramika", employees: "1,600", potential: "wysoki", type: "potencjalny partner biznesowy", lat: 51.3753, lng: 20.2782, address: "ul. Piotrkowska 61, 26-300 Opoczno", phone: "+48 44 755 41 00", website: "https://paradyz.com", email: "info@paradyz.com", description: "Jeden z największych producentów płytek ceramicznych w Polsce"},
            {id: 53, name: "PHILIPS LIGHTING POLAND", region: "łódzkie", city: "Pabianice", industry: "elektrotechnika", employees: "1,200", potential: "wysoki", type: "potencjalny partner biznesowy", lat: 51.6642, lng: 19.3548, address: "ul. Warszawska 75, 95-200 Pabianice", phone: "+48 42 214 51 00", website: "https://signify.com", email: "kontakt.pl@signify.com", description: "Produkcja systemów oświetleniowych (Signify, dawniej Philips Lighting)"},
            {id: 54, name: "TUBĄDZIN Sp. z o.o.", region: "łódzkie", city: "Łódź", industry: "ceramika budowlana", employees: "brak informacji", potential: "wysoki", type: "potencjalny partner biznesowy", lat: 51.7590, lng: 19.4399, address: "ul. Cegielniana 7, 95-055 Łódź", phone: "brak informacji", website: "https://tubadzin.pl", email: "brak informacji", description: "Producent wielkoformatowych płytek ceramicznych – lider rozwiązań designu ceramiki budowlanej"},
            {id: 55, name: "GLASS-PRODUKT Sp. z o.o.", region: "łódzkie", city: "Tomaszów Mazowiecki", industry: "maszyny przemysłowe", employees: "brak informacji", potential: "średni", type: "potencjalny partner biznesowy", lat: 51.5315, lng: 20.0087, address: "brak informacji", phone: "brak informacji", website: "brak informacji", email: "brak informacji", description: "Producent automatycznych systemów transportu materiałów w przemyśle (wspomniany jako lokalny producent sprzętu specjalistycznego)"},
            {id: 56, name: "GRUPA AZOTY S.A.", region: "małopolskie", city: "Tarnów", industry: "chemia", employees: "15,609", revenue: "13 mld zł", potential: "wysoki", type: "klient", lat: 50.0121, lng: 20.9858, address: "ul. Kwiatkowskiego 8, 33-101 Tarnów", phone: "+48 14 637 37 37", website: "https://grupaazoty.com", email: "sekretariat@grupaazoty.com", description: "Jeden z największych koncernów chemicznych w Europie – nawozy, tworzywa sztuczne, chemia przemysłowa."},
            {id: 57, name: "SYNTHOS S.A.", region: "małopolskie", city: "Oświęcim", industry: "chemia", employees: "3,000", revenue: "7 mld zł", potential: "wysoki", type: "klient", lat: 50.0343, lng: 19.2098, address: "ul. Chemików 1, 32-600 Oświęcim", phone: "+48 33 847 41 00", website: "https://synthosgroup.com", email: "biuro@synthosgroup.com", description: "Producent kauczuków syntetycznych, polistyrenów i tworzyw."},
            {id: 58, name: "ARCELORMITTAL KRAKÓW", region: "małopolskie", city: "Kraków", industry: "hutnictwo", employees: "3,500", potential: "wysoki", type: "klient", lat: 50.0833, lng: 19.8491, address: "ul. Ujastek 1, 31-752 Kraków", phone: "+48 12 644 42 00", website: "https://poland.arcelormittal.com", email: "biuro@arcelormittal.com", description: "Oddział ArcelorMittal Poland – stal, wyroby hutnicze."},
            {id: 59, name: "NPA SKAWINA", region: "małopolskie", city: "Skawina", industry: "metalurgia", employees: "800", potential: "wysoki", type: "klient", lat: 49.9753, lng: 19.8269, address: "ul. Piłsudskiego 23, 32-050 Skawina", phone: "+48 12 276 20 61", website: "https://npa.pl", email: "oferty@npa.pl", description: "Produkcja walcówki aluminiowej i drutów dla energetyki."},
            {id: 60, name: "SELVITA S.A.", region: "małopolskie", city: "Kraków", industry: "biotechnologia", employees: "600", potential: "wysoki", type: "klient", lat: 50.0647, lng: 19.9450, address: "ul. Bobrzyńskiego 14, 30-348 Kraków", phone: "+48 12 297 47 00", website: "https://selvita.com", email: "selvita@selvita.com", description: "Firma CRO – badania kliniczne, biotechnologia i farmacja."},
            {id: 61, name: "BIOMED", region: "małopolskie", city: "Kraków", industry: "farmacja", employees: "400", potential: "wysoki", type: "klient", lat: 50.0265, lng: 19.9260, address: "Al. Sosnowa 8, 30-224 Kraków", phone: "+48 12 37 69 344", website: "https://biomed.pl", email: "bdu@biomed.pl", description: "Producent szczepionek, probiotyków i preparatów medycznych."},
            {id: 62, name: "APTIV SERVICES POLAND", region: "małopolskie", city: "Kraków", industry: "motoryzacja", employees: "5,500", potential: "wysoki", type: "klient", lat: 50.0185, lng: 19.9560, address: "ul. Podgórki Tynieckie 2, 30-399 Kraków", phone: "+48 12 252 20 00", website: "https://aptiv.com/pl", email: "krakow.office@aptiv.com", description: "Centrum inżynieryjne i produkcja systemów elektronicznych dla motoryzacji."},
            {id: 63, name: "PHILIP MORRIS POLSKA", region: "małopolskie", city: "Kraków", industry: "tytoniowy", employees: "3,000", potential: "wysoki", type: "klient", lat: 50.0925, lng: 19.9742, address: "Al. Jana Pawła II 196, 31-982 Kraków", phone: "+48 12 646 46 46", website: "https://pmi.com", email: "kontakt@pmi.com", description: "Największy producent wyrobów tytoniowych w Polsce."},
            {id: 64, name: "TAURON WYTWARZANIE - SIERSZA", region: "małopolskie", city: "Trzebinia", industry: "energetyka", employees: "222", potential: "wysoki", type: "klient", lat: 50.1594, lng: 19.4697, address: "32-541 Trzebinia", phone: "+48 32 711 72 19", website: "https://tauron-wytwarzanie.pl", email: "tw.si-sekretariat@tauron-wytwarzanie.pl", description: "Elektrownia TAURON Wytwarzanie – jednostka Siersza."},
            {id: 65, name: "ELEKTROWNIA SKAWINA", region: "małopolskie", city: "Skawina", industry: "energetyka", employees: "350", potential: "wysoki", type: "klient", lat: 49.9753, lng: 19.8269, address: "ul. Piłsudskiego 10, 32-050 Skawina", phone: "+48 12 277 00 00", website: "https://repolska.pl", email: "info@repolska.pl", description: "Nowoczesna elektrownia gazowo-węglowa – część CEZ Polska."},
            {id: 66, name: "KRAKOWSKI PARK TECHNOLOGICZNY", region: "małopolskie", city: "Kraków", industry: "it", employees: "200", potential: "wysoki", type: "klient", lat: 50.0185, lng: 19.8942, address: "ul. Podole 60, 30-394 Kraków", phone: "+48 12 640 19 40", website: "https://kpt.krakow.pl", email: "biuro@kpt.krakow.pl", description: "Specjalna strefa ekonomiczna i inkubator technologiczny."},
            {id: 67, name: "COMARCH DATA CENTER", region: "małopolskie", city: "Kraków", industry: "it", employees: "6,500", potential: "wysoki", type: "klient", lat: 50.0903, lng: 19.9856, address: "ul. prof. Michała Życzkowskiego 21, 31-864 Kraków", phone: "+48 12 646 10 00", website: "https://comarch.com", email: "info@comarch.com", description: "Jeden z największych polskich producentów oprogramowania i dostawca usług IT."},
            {id: 68, name: "BEYOND.PL", region: "małopolskie", city: "Kraków", industry: "it", employees: "150", potential: "wysoki", type: "klient", lat: 50.0647, lng: 19.9450, address: "ul. Wadowicka 6, 30-415 Kraków", phone: "+48 61 667 48 90", website: "https://beyond.pl", email: "office@beyond.pl", description: "Centrum danych i usługi chmurowe dla biznesu."},
            {id: 69, name: "POLCOM DATA CENTER", region: "małopolskie", city: "Skawina", industry: "it", employees: "300", potential: "wysoki", type: "klient", lat: 49.9753, lng: 19.8269, address: "ul. Krakowska 43, 32-050 Skawina", phone: "+48 12 276 60 00", website: "https://polcom.com.pl", email: "kontakt@polcom.com.pl", description: "Dostawca usług data center i cloud computing."},
            {id: 70, name: "FAKRO Sp. z o.o.", region: "małopolskie", city: "Nowy Sącz", industry: "budownictwo", employees: "4,000", potential: "wysoki", type: "klient", lat: 49.6175, lng: 20.6978, address: "ul. Węgierska 144a, 33-300 Nowy Sącz", phone: "+48 18 444 07 00", website: "https://www.fakro.pl", email: "fakro@fakro.pl", description: "Jeden z największych producentów okien dachowych i schodów strychowych na świecie."},
            {id: 71, name: "NEWAG S.A.", region: "małopolskie", city: "Nowy Sącz", industry: "kolejnictwo", employees: "2,200", potential: "wysoki", type: "klient", lat: 49.6231, lng: 20.6994, address: "ul. Wyspiańskiego 3, 33-300 Nowy Sącz", phone: "+48 18 544 70 00", website: "https://www.newag.pl", email: "sekretariat@newag.pl", description: "Producent lokomotyw, elektrycznych zespołów trakcyjnych i pojazdów szynowych."},
            {id: 72, name: "CAN-PACK S.A.", region: "małopolskie", city: "Kraków", industry: "opakowania", employees: "1,800", potential: "wysoki", type: "klient", lat: 50.0907, lng: 19.9794, address: "ul. Marii Konopnickiej 29, 30-302 Kraków", phone: "+48 12 662 40 00", website: "https://www.canpack.com", email: "contact@canpack.com", description: "Międzynarodowy producent puszek aluminiowych i opakowań metalowych."},
            {id: 73, name: "TELE-FONIKA Kable S.A.", region: "małopolskie", city: "Myślenice", industry: "elektrotechnika", employees: "3,500", potential: "wysoki", type: "klient", lat: 49.8417, lng: 19.9366, address: "ul. Hipolita Cegielskiego 1, 32-400 Myślenice", phone: "+48 12 37 37 100", website: "https://www.tfkable.com", email: "office@tfkable.com", description: "Jeden z największych w Europie producentów przewodów i kabli energetycznych."},
            {id: 74, name: "MASPEX", region: "małopolskie", city: "Wadowice", industry: "spożywczy", employees: "7,000", revenue: "5 mld zł", potential: "wysoki", type: "klient", lat: 49.8837, lng: 19.4933, address: "ul. Legionów 37, 34-100 Wadowice", phone: "+48 33 873 61 00", website: "https://maspex.com", email: "biuro@maspex.com", description: "Jeden z największych producentów żywności w Europie Środkowej (Tymbark, Kubuś, Lubella)."},
            {id: 75, name: "IGLOO Sp. z o.o.", region: "małopolskie", city: "Nowy Wiśnicz", industry: "chłodnictwo przemysłowe", employees: "brak informacji", potential: "średni", type: "potencjalny partner biznesowy", lat: 49.8700, lng: 20.4935, address: "Stary Wiśnicz 289, 32-720 Nowy Wiśnicz", phone: "+48 14 662 19 10", website: "https://igloo.pl", email: "info@igloo.pl", description: "Polski producent urządzeń chłodniczych, agregatów i pomp ciepła od 1986 roku"},
            {id: 76, name: "LEGBUD GARGULA", region: "małopolskie", city: "Wojnicz", industry: "metalurgia / stolarka", employees: "brak informacji", potential: "średni", type: "potencjalny partner biznesowy", lat: 49.7990, lng: 20.7420, address: "ul. Wolicka 8, 32-830 Wojnicz", phone: "+48 14 679 09 00", website: "https://legbudgargula.com/pl", email: "handlowy@legbudgargula.com", description: "Producent bram, ogrodzeń, garaży i stolarki aluminiowej dla domu i przemysłu"},
            {id: 77, name: "PKN ORLEN", region: "mazowieckie", city: "Płock", industry: "chemia", employees: "22,000", revenue: "131 mld zł", potential: "wysoki", type: "klient", lat: 52.5468, lng: 19.7064, address: "ul. Chemików 7, 09-411 Płock", phone: "+48 24 365 00 00", website: "https://www.orlen.pl", description: "Największy koncern petrochemiczny w Europie Środkowo-Wschodniej"},
            {id: 78, name: "POLFA WARSZAWA", region: "mazowieckie", city: "Warszawa", industry: "farmacja", employees: "1,200", revenue: "180 mln EUR", potential: "wysoki", type: "klient", lat: 52.2241, lng: 20.9820, address: "ul. Karolkowa 22/24, 01-207 Warszawa", phone: "+48 22 691 39 00", website: "https://www.polfawarszawa.pl", email: "biuro@polfawarszawa.pl"},
            {id: 79, name: "POLFA TARCHOMIN", region: "mazowieckie", city: "Warszawa", industry: "farmacja", employees: "900", potential: "wysoki", type: "klient", lat: 52.3020, lng: 20.9810, address: "ul. Fleminga 2, 03-176 Warszawa", phone: "+48 22 326 94 00", website: "https://www.polfatarchomin.com.pl", email: "kontakt@polfatarchomin.pl"},
            {id: 80, name: "GEDEON RICHTER POLSKA", region: "mazowieckie", city: "Grodzisk Mazowiecki", industry: "farmacja", employees: "900", potential: "wysoki", type: "klient", lat: 52.1053, lng: 20.6337, address: "ul. Powstańców Warszawy 110, 05-825 Grodzisk Mazowiecki", phone: "+48 22 755 96 00", website: "https://www.gedeonrichter.pl"},
            {id: 81, name: "MPWiK WARSZAWA", region: "mazowieckie", city: "Warszawa", industry: "woda", employees: "2,500", potential: "wysoki", type: "klient", lat: 52.2416, lng: 21.0216, address: "pl. Starynkiewicza 5, 02-015 Warszawa", phone: "+48 22 445 50 00", website: "https://www.mpwik.com.pl", description: "Oczyszczalnia Czajka - największa w Europie"},
            {id: 82, name: "POLSKA GRUPA ENERGETYCZNA", region: "mazowieckie", city: "Warszawa", industry: "energetyka", employees: "40,000", potential: "wysoki", type: "klient", lat: 52.2320, lng: 20.9850, address: "ul. Mysia 2, 00-496 Warszawa", phone: "+48 22 340 11 77", website: "https://www.gkpge.pl"},
            {id: 83, name: "PGNiG", region: "mazowieckie", city: "Warszawa", industry: "energetyka", employees: "25,000", potential: "wysoki", type: "klient", lat: 52.2297, lng: 21.0122, address: "ul. Marcina Kasprzaka 25, 01-224 Warszawa", phone: "+48 22 589 40 00", website: "https://www.pgnig.pl"},
            {id: 84, name: "ELEKTROCIEPŁOWNIA SIEKIERKI", region: "mazowieckie", city: "Warszawa", industry: "energetyka", potential: "wysoki", type: "klient", lat: 52.1873, lng: 21.0533, address: "ul. Augustówka 30, 02-981 Warszawa", phone: "+48 22 345 60 00", website: "https://www.pgnigtermika.pl", description: "Moc 622 MW – największa elektrociepłownia w Polsce"},
            {id: 85, name: "CIECH S.A.", region: "mazowieckie", city: "Warszawa", industry: "chemia", revenue: "1.2 mld EUR", potential: "wysoki", type: "klient", lat: 52.2285, lng: 21.0117, address: "ul. Wspólna 62, 00-684 Warszawa", phone: "+48 22 639 10 80", website: "https://ciechgroup.com"},
            {id: 86, name: "SYNTHOS S.A.", region: "mazowieckie", city: "Warszawa", industry: "chemia", potential: "wysoki", type: "klient", lat: 52.2297, lng: 21.0122, address: "ul. Książęca 4, 00-498 Warszawa", phone: "+48 22 451 10 00", website: "https://www.synthosgroup.com"},
            {id: 87, name: "OPEL MANUFACTURING POLAND (dawniej GM)", region: "mazowieckie", city: "Warszawa", industry: "motoryzacja", employees: "750", potential: "wysoki", type: "klient", lat: 52.1800, lng: 20.9500, address: "ul. Krasnobrodzka 5, 03-214 Warszawa", phone: "+48 22 576 20 00", website: "https://www.opel.pl"},
            {id: 88, name: "LG ELECTRONICS MŁAWA", region: "mazowieckie", city: "Mława", industry: "elektronika", employees: "2,000", potential: "wysoki", type: "klient", lat: 53.1120, lng: 20.3826, address: "ul. LG Electronics 7, 06-500 Mława", phone: "+48 23 654 96 00", website: "https://www.lge.com/pl"},
            {id: 89, name: "MARS POLSKA", region: "mazowieckie", city: "Sochaczew", industry: "spożywczy", employees: "800", potential: "wysoki", type: "klient", lat: 52.2293, lng: 20.2384, address: "ul. Żelazna 9, 96-500 Sochaczew", phone: "+48 46 863 40 00", website: "https://poland.mars.com"},
            {id: 90, name: "MONDELEZ POLSKA", region: "mazowieckie", city: "Warszawa", industry: "spożywczy", employees: "1,500", potential: "wysoki", type: "klient", lat: 52.1672, lng: 20.9673, address: "ul. Domaniewska 49, 02-672 Warszawa", phone: "+48 22 332 32 00", website: "https://pl.mondelezinternational.com"},
            {id: 91, name: "ELEKTROWNIA OSTROŁĘKA", region: "mazowieckie", city: "Ostrołęka", industry: "energetyka", potential: "wysoki", type: "klient", lat: 53.0893, lng: 21.5731, address: "ul. Energetyków 7, 07-410 Ostrołęka", phone: "+48 29 765 40 00", website: "https://www.enea.pl", description: "Nowa elektrownia gazowa 750 MW"},
            {id: 92, name: "ŻYWIEC ZDRÓJ (Danone)", region: "mazowieckie", city: "Warszawa", industry: "spożywczy", employees: "500", potential: "wysoki", type: "klient", lat: 52.1804, lng: 21.0039, address: "ul. Bobrowiecka 8, 00-728 Warszawa", phone: "+48 22 563 98 00", website: "https://www.zywiec-zdroj.pl"},
            {id: 93, name: "MICHELIN POLSKA – Biuro Handlowe", region: "mazowieckie", city: "Warszawa", industry: "motoryzacja", employees: "300", potential: "średni", type: "klient", lat: 52.1804, lng: 21.0039, address: "ul. Bobrowiecka 8, 00-728 Warszawa", phone: "+48 22 563 97 00", website: "https://www.michelin.pl"},
            {id: 94, name: "HENKEL POLSKA", region: "mazowieckie", city: "Warszawa", industry: "chemia", employees: "1,000", potential: "wysoki", type: "klient", lat: 52.2231, lng: 21.0181, address: "ul. Domaniewska 41, 02-672 Warszawa", phone: "+48 22 565 90 00", website: "https://www.henkel.pl"},
            {id: 95, name: "PROCTER & GAMBLE DS. POLSKA", region: "mazowieckie", city: "Warszawa", industry: "chemia / FMCG", employees: "1,500", potential: "wysoki", type: "klient", lat: 52.2249, lng: 21.0105, address: "ul. Zabraniecka 20, 03-872 Warszawa", phone: "+48 22 879 60 00", website: "https://pl.pg.com"},
            {id: 96, name: "POLSKI KONCERN NAFTOWY LOTOS (Biuro)", region: "mazowieckie", city: "Warszawa", industry: "energetyka", employees: "200 (Warszawa)", potential: "średni", type: "klient", lat: 52.2297, lng: 21.0122, address: "ul. Piękna 24/26A, 00-549 Warszawa", phone: "+48 22 333 70 00", website: "https://www.lotos.pl"},
            {id: 97, name: "DAIKIN AIRCONDITIONING POLAND", region: "mazowieckie", city: "Warszawa", industry: "HVAC", employees: "300", potential: "średni", type: "klient", lat: 52.1766, lng: 21.0011, address: "ul. 1 Sierpnia 8, 02-134 Warszawa", phone: "+48 22 319 75 00", website: "https://www.daikin.pl"},
            {id: 98, name: "SCHNEIDER ELECTRIC POLSKA", region: "mazowieckie", city: "Warszawa", industry: "elektrotechnika", employees: "500", potential: "wysoki", type: "klient", lat: 52.1800, lng: 20.9980, address: "ul. Konstruktorska 12, 02-673 Warszawa", phone: "+48 22 511 84 00", website: "https://www.se.com/pl"},
            {id: 99, name: "SIEMENS POLSKA", region: "mazowieckie", city: "Warszawa", industry: "elektrotechnika / automatyka", employees: "1,200", potential: "wysoki", type: "klient", lat: 52.2004, lng: 21.0035, address: "ul. Żupnicza 11, 03-821 Warszawa", phone: "+48 22 870 92 00", website: "https://www.siemens.pl"},
            {id: 100, name: "BORG WARNER", region: "podkarpackie", city: "Rzeszów", industry: "motoryzacja", employees: "4,500", potential: "wysoki", type: "klient", lat: 50.0119, lng: 22.0138, address: "ul. Hetmańska 120, 35-078 Rzeszów", phone: "+48 17 860 90 00", website: "https://www.borgwarner.com", description: "Produkcja turbosprężarek dla motoryzacji"},
            {id: 101, name: "HUTA STALOWA WOLA S.A.", region: "podkarpackie", city: "Stalowa Wola", industry: "hutnictwo / zbrojeniówka", employees: "2,000", potential: "wysoki", type: "klient", lat: 50.5821, lng: 22.0538, address: "ul. Kasprzyckiego 8, 37-450 Stalowa Wola", phone: "+48 15 813 40 00", website: "https://www.hsw.pl", description: "Producent ciężkiego sprzętu wojskowego i maszyn budowlanych"},
            {id: 102, name: "ZAKŁADY CHEMICZNE SIARKOPOL TARNOBRZEG", region: "podkarpackie", city: "Tarnobrzeg", industry: "chemia", employees: "800", potential: "wysoki", type: "klient", lat: 50.5730, lng: 21.6791, address: "ul. Chemiczna 2, 39-400 Tarnobrzeg", phone: "+48 15 823 66 00", website: "https://zchsiarkopol.pl", description: "Producent nawozów siarkowych i chemikaliów przemysłowych"},
            {id: 103, name: "RAFINERIA JASŁO", region: "podkarpackie", city: "Jasło", industry: "chemia / petrochemia", employees: "350", potential: "wysoki", type: "klient", lat: 49.7449, lng: 21.4726, address: "ul. 3 Maja 101, 38-200 Jasło", phone: "+48 13 443 77 00", website: "http://www.rafineria-jaslo.pl", description: "Producent asfaltów i produktów ropopochodnych"},
            {id: 104, name: "RAFINERIA JEDLICZE (Orlen Południe)", region: "podkarpackie", city: "Jedlicze", industry: "chemia / rafineria", employees: "280", potential: "wysoki", type: "klient", lat: 49.7153, lng: 21.6490, address: "ul. Trzecieskiego 16, 38-460 Jedlicze", phone: "+48 13 448 01 00", website: "https://www.orlenpoludnie.pl", description: "Rafineria produkująca komponenty paliwowe i biokomponenty"},
            {id: 105, name: "WSK PZL-RZESZÓW (Pratt & Whitney)", region: "podkarpackie", city: "Rzeszów", industry: "lotniczy", employees: "4,500", potential: "wysoki", type: "klient", lat: 50.0100, lng: 22.0300, address: "ul. Hetmańska 120, 35-078 Rzeszów", phone: "+48 17 865 11 11", website: "https://pwc.com", description: "Produkcja silników lotniczych i komponentów"},
            {id: 106, name: "MTU AERO ENGINES POLSKA", region: "podkarpackie", city: "Rzeszów", industry: "lotniczy", employees: "1,000", potential: "wysoki", type: "klient", lat: 50.0080, lng: 22.0190, address: "ul. Jasionka 949, 36-002 Jasionka", phone: "+48 17 785 00 00", website: "https://www.mtu.de", description: "Producent i serwis komponentów silników lotniczych"},
            {id: 107, name: "ULTRATECH", region: "podkarpackie", city: "Sędziszów Małopolski", industry: "lotniczy / obróbka precyzyjna", employees: "500", potential: "wysoki", type: "klient", lat: 50.0716, lng: 21.7042, address: "ul. Fabryczna 10, 39-120 Sędziszów Młp.", phone: "+48 17 221 70 00", website: "https://ultratech.com.pl", description: "Producent części lotniczych i narzędzi precyzyjnych"},
            {id: 108, name: "FIBRAIN", region: "podkarpackie", city: "Rogoźnica", industry: "elektronika / telekomunikacja", employees: "700", potential: "wysoki", type: "klient", lat: 50.0532, lng: 22.0160, address: "Rogoźnica 312, 36-060 Głogów Małopolski", phone: "+48 17 866 08 00", website: "https://www.fibrain.pl", description: "Producent światłowodów i systemów telekomunikacyjnych"},
            {id: 109, name: "SANOK RUBBER COMPANY", region: "podkarpackie", city: "Sanok", industry: "motoryzacja / guma", employees: "3,400", potential: "wysoki", type: "klient", lat: 49.5559, lng: 22.2056, address: "ul. Przemyska 70, 38-500 Sanok", phone: "+48 13 465 32 00", website: "https://sanokrubber.com", description: "Producent wyrobów gumowych i uszczelnień dla przemysłu motoryzacyjnego"},
            {id: 110, name: "VOLKSWAGEN POZNAŃ", region: "wielkopolskie", city: "Poznań", industry: "motoryzacja", employees: "9,500", potential: "wysoki", type: "klient", lat: 52.4600, lng: 16.9900, address: "ul. Warszawska 349, 62-080 Przeźmierowo", phone: "brak informacji", website: "https://volkswagen-poznan.pl", email: "brak informacji", description: "Fabryka samochodów dostawczych producenta Volkswagen"},
            {id: 111, name: "BRIDGESTONE POZNAŃ", region: "wielkopolskie", city: "Poznań", industry: "motoryzacja (opony)", employees: "2,000", potential: "wysoki", type: "klient", lat: 52.3640, lng: 16.9950, address: "ul. Bałtycka 65, 61-017 Poznań", phone: "brak informacji", website: "https://www.bridgestone-poznan.pl", email: "brak informacji", description: "Fabryka opon produkująca ponad 500 typów, jedna z największych w Europie"},
            {id: 112, name: "DELPHARM POZNAŃ", region: "wielkopolskie", city: "Poznań", industry: "farmacja", employees: "brak informacji", potential: "wysoki", type: "klient", lat: 52.4064, lng: 16.9252, address: "ul. Grunwaldzka 189, 60-322 Poznań", phone: "+48 61 86 01 200", website: "https://www.delpharm.com", email: "contact@delpharm.com", description: "Zakład produkcji leków (tabletki, kapsułki, softgels, kremy)"},
            {id: 113, name: "BIOFARM SP. Z O.O.", region: "wielkopolskie", city: "Poznań", industry: "farmacja", employees: "brak informacji", potential: "wysoki", type: "klient", lat: 52.4064, lng: 16.9252, address: "brak informacji", phone: "brak informacji", website: "https://biofarm.pl", email: "brak informacji", description: "Polska firma farmaceutyczna, producent leków OTC"},
            {id: 114, name: "FARMAPOL SP. Z O.O.", region: "wielkopolskie", city: "Poznań", industry: "farmacja", employees: "brak informacji", potential: "wysoki", type: "klient", lat: 52.4064, lng: 16.9252, address: "brak informacji", phone: "brak informacji", website: "https://farmapol.pl", email: "brak informacji", description: "Producent leków i suplementów diety"},
            {id: 115, name: "ZE PAK S.A.", region: "wielkopolskie", city: "Konin", industry: "energetyka", employees: "brak informacji", potential: "wysoki", type: "klient", lat: 52.2230, lng: 18.2512, address: "brak informacji", phone: "brak informacji", website: "https://zepak.com.pl", email: "brak informacji", description: "Operator elektrowni: Pątnów, Konin i Adamów"},
            {id: 116, name: "ELEKTROWNIA PĄTNÓW", region: "wielkopolskie", city: "Konin", industry: "energetyka", employees: "brak informacji", potential: "wysoki", type: "klient", lat: 52.3100, lng: 18.2700, address: "brak informacji", phone: "brak informacji", website: "brak informacji", email: "brak informacji", description: "Elektrownia o mocy zainstalowanej ok. 1 718 MW (1244+474)"},
            {id: 117, name: "CARRIER MANUFACTURING POLAND", region: "wielkopolskie", city: "Gniezno", industry: "HVAC", employees: "500", potential: "wysoki", type: "klient", lat: 52.5349, lng: 17.5827, address: "brak informacji", phone: "brak informacji", website: "brak informacji", email: "brak informacji", description: "Produkcja klimatyzatorów i urządzeń chłodniczych"},
            {id: 118, name: "KIMBALL ELECTRONICS", region: "wielkopolskie", city: "Poznań", industry: "elektronika", employees: "1,800", potential: "wysoki", type: "klient", lat: 52.3705, lng: 16.8000, address: "brak informacji", phone: "brak informacji", website: "brak informacji", email: "brak informacji", description: "Produkcja komponentów elektronicznych i obudów"},
            {id: 119, name: "AMAZON FULFILLMENT", region: "wielkopolskie", city: "Poznań", industry: "logistyka", employees: "6,000", potential: "średni", type: "klient", lat: 52.3300, lng: 16.8800, address: "brak informacji", phone: "brak informacji", website: "https://amazon.jobs", email: "brak informacji", description: "Centrum logistyczne i magazynowe Amazon"},
            {id: 120, name: "NIVEA POLSKA (BEIERSDORF)", region: "wielkopolskie", city: "Poznań", industry: "kosmetyki", employees: "600", potential: "wysoki", type: "klient", lat: 52.4200, lng: 16.9800, address: "brak informacji", phone: "brak informacji", website: "https://www.beiersdorf.pl", email: "brak informacji", description: "Producent kosmetyków pielęgnacyjnych – marka NIVEA"},
            {id: 121, name: "KOMPANIA PIWOWARSKA", region: "wielkopolskie", city: "Poznań", industry: "spożywczy", employees: "1,000", potential: "wysoki", type: "klient", lat: 52.3851, lng: 16.8992, address: "brak informacji", phone: "brak informacji", website: "https://kompaniapiwowarska.pl", email: "brak informacji", description: "Producent piwa, część grupy Asahi Europe"},
            {id: 122, name: "WRIGLEY POLAND", region: "wielkopolskie", city: "Poznań", industry: "spożywczy", employees: "500", potential: "wysoki", type: "klient", lat: 52.3600, lng: 16.9600, address: "brak informacji", phone: "brak informacji", website: "https://www.mars.com", email: "brak informacji", description: "Producent gum do żucia i słodyczy, część Mars, Incorporated"},
            {id: 123, name: "ANG WENTYLACJA", region: "dolnośląskie", city: "Wrocław", industry: "hvac", potential: "wysoki", type: "partner", lat: 51.1079, lng: 17.0385, phone: "+48 71 756 31 10", website: "https://ang.com.pl", email: "sprzedaz@ang.com.pl", description: "Dystrybutor systemów HVAC i klimatyzacji"},
            {id: 124, name: "KLIMA-VENTA", region: "dolnośląskie", city: "Wrocław", industry: "hvac", employees: "30", potential: "średni", type: "partner", lat: 51.1308, lng: 17.0780, address: "ul. Ślężna 86", phone: "+48 71 336 95 85", website: "https://klima-venta.pl", email: "info@klima-venta.pl", description: "Sprzedaż i montaż systemów klimatyzacji i wentylacji"},
            {id: 125, name: "PRO-VENT SYSTEMY WENTYLACYJNE", region: "opolskie", city: "Krapkowice", industry: "hvac", potential: "wysoki", type: "partner", lat: 50.4747, lng: 17.9651, address: "ul. Posiłkowa 4a", phone: "+48 77 44 044 98", website: "https://pro-vent.pl", email: "biuro@pro-vent.pl", description: "Producent central wentylacyjnych i rekuperatorów"},
            {id: 126, name: "WIECZOREK P.P.U.H.", region: "opolskie", city: "Opole", industry: "hvac", potential: "średni", type: "partner", lat: 50.6751, lng: 17.9213, phone: "+48 77 500 08 05", website: "https://wieczorek.opole.pl", email: "info@wieczorek.opole.pl", description: "Dostawca i serwis urządzeń HVAC"},
            {id: 127, name: "JANEX SERWIS", region: "opolskie", city: "Opole", industry: "filtry", potential: "wysoki", type: "partner", lat: 50.6751, lng: 17.9213, address: "ul. Budowlanych 5A", phone: "+48 660 884 100", email: "janexserwis2@gmail.com", description: "Dystrybutor filtrów PZL Sędziszów, Filtron"},
            {id: 128, name: "FILTRY PRZEMYSŁOWE POLSKA", region: "mazowieckie", city: "Warszawa", industry: "filtry", potential: "wysoki", type: "partner", lat: 52.2297, lng: 21.0122, website: "https://fppolska.com", description: "Dystrybutor filtrów przemysłowych, przedstawiciel Global Filters"},
            {id: 129, name: "SFM FILTRY", region: "mazowieckie", city: "Warszawa", industry: "filtry", potential: "wysoki", type: "partner", lat: 52.2297, lng: 21.0122, website: "https://sfm.pl", description: "Producent i dostawca filtrów, 40 lat doświadczenia"},
            {id: 130, name: "RUBIX POLAND", region: "mazowieckie", city: "Warszawa", industry: "MRO/dystrybucja", potential: "wysoki", type: "partner", lat: 52.2297, lng: 21.0122, website: "https://rubix.com", description: "Dystrybutor komponentów MRO, w tym filtrów i akcesoriów"},
            {id: 131, name: "HVAC SERVICE SP. Z O.O.", region: "mazowieckie", city: "Warszawa", industry: "hvac", employees: "150", potential: "wysoki", type: "partner", lat: 52.2297, lng: 21.0122, website: "https://hvacservice.pl", description: "Specjalista w instalacjach HVAC i filtracji powietrza"},
            {id: 132, name: "SYSTEMCOLD", region: "małopolskie", city: "Kraków", industry: "hvac", employees: "40", potential: "wysoki", type: "partner", lat: 50.0801, lng: 19.9766, address: "os. Strusia 1a", website: "https://systemcold.pl", description: "Dostawca rozwiązań chłodniczych i HVAC"},
            {id: 133, name: "CARLINE", region: "małopolskie", city: "Kraków", industry: "hvac", employees: "45", potential: "wysoki", type: "partner", lat: 50.0459, lng: 19.9644, address: "ul. Torowa 7C", website: "https://carline.com.pl", description: "Systemy wentylacji, klimatyzacji i chłodnictwa"},
            {id: 134, name: "WIENKRA/SEVRA", region: "małopolskie", city: "Kraków", industry: "hvac", potential: "wysoki", type: "partner", lat: 50.0683, lng: 19.9428, address: "ul. Kotlarska 34", website: "https://klimatyzacja.pl/sevra", description: "Dystrybutor systemów klimatyzacji i rekuperacji"},
            {id: 135, name: "GRUPA CSV", region: "małopolskie", city: "Kraków", industry: "lakiernie", potential: "wysoki", type: "partner", lat: 50.0740, lng: 19.9211, address: "ul. Jasnogórska 23", website: "https://csv.pl", description: "Dystrybutor technologii lakierniczych i filtracji powietrza"},
            {id: 136, name: "ABC COLOREX", region: "małopolskie", city: "Kraków", industry: "lakiernie", potential: "wysoki", type: "partner", lat: 50.0647, lng: 19.9450, address: "ul. Gryczana 30A", website: "https://colorex.pl", description: "Producent i dystrybutor farb, systemów lakierniczych i filtrów"},
            {id: 137, name: "EKOMAL", region: "łódzkie", city: "Wieluń", industry: "lakiernie", employees: "40", potential: "wysoki", type: "partner", lat: 51.2207, lng: 18.5696, address: "Urbanice 13C", phone: "+48 43 843 31 54", website: "https://ekomal.pl", email: "sprzedaz@ekomal.pl", description: "Producent kabin i urządzeń lakierniczych z filtracją powietrza"},
            {id: 138, name: "BIOWER", region: "śląskie", city: "Mikołów", industry: "woda", employees: "25", potential: "wysoki", type: "partner", lat: 50.1709, lng: 18.9031, address: "Gliwicka 131", phone: "+48 534 832 531", website: "https://biower.pl", email: "biuro@biower.pl", description: "Producent i dostawca oczyszczalni biologicznych i filtrów do wody"},
            {id: 139, name: "EKO-BIO", region: "dolnośląskie", city: "Wrocław", industry: "woda", employees: "25", potential: "średni", type: "partner", lat: 51.1079, lng: 17.0385, website: "https://dolnoslaskie.oczyszczalnia.net", description: "Dostawca przydomowych oczyszczalni ścieków i filtrów"},
            {id: 140, name: "BLF FILTRATION", region: "lubuskie", city: "Grabowiec", industry: "filtry procesowe", employees: "brak informacji", potential: "wysoki", type: "partner", lat: 52.0000, lng: 15.6000, address: "Grabowiec 41B, 66-014 Grabowiec", phone: "+48 600 900 583", website: "https://blf.com.pl", email: "info@blf.com.pl", description: "Producent filtrów procesowych: kasety, worki, kartridże, filtry odpyłowe dla różnych branż"},
            {id: 141, name: "INSTAL-FILTER S.A.", region: "opolskie", city: "Kędzierzyn-Koźle", industry: "filtracja przemysłowa", employees: "brak informacji", potential: "wysoki", type: "partner", lat: 50.3500, lng: 18.2264, address: "Kędzierzyn-Koźle, Polska", phone: "brak informacji", website: "https://instalfilter.com", email: "biuro@instalfilter.com", description: "Producent i montażysta instalacji odpylania i filtracji przemysłowej"},
            {id: 142, name: "MANN+HUMMEL Filtration Technology Poland", region: "wielkopolskie", city: "Gostyń", industry: "filtry motoryzacyjne i przemysłowe", employees: "1,800", potential: "wysoki", type: "partner", lat: 51.8797, lng: 17.0126, address: "Gostyń, Polska", phone: "brak informacji", website: "https://mann-hummel.com", email: "brak informacji", description: "Producent filtrów kabinowych, paliwowych, przemysłowych; część globalnej grupy MANN+HUMMEL"},
            {id: 143, name: "Filtrakon", region: "śląskie", city: "Łaziska Górne", industry: "filtry do wody i cieczy", potential: "wysoki", type: "partner", lat: 50.0310, lng: 18.8380, address: "ul. Łąkowa 11, 43-173 Łaziska Górne", phone: "+48 32 411 03 41", website: "https://filtrowanie.com.pl", email: "biuro@filtrowanie.com.pl", description: "Producent filtrów przemysłowych do wody, cieczy, stacji uzdatniania"},
            {id: 144, name: "SM-FILTER", region: "łódzkie", city: "Kutno", industry: "filtry kasetowe powietrza", potential: "wysoki", type: "partner", lat: 52.2310, lng: 19.3640, address: "ul. Grunwaldzka 3, 99-300 Kutno", phone: "+48 24 362 79 20", website: "https://www.sm-filter.pl", email: "biuro@sm-filter.pl", description: "Producent filtrów kasetowych klas EU2-EU9 dla wentylacji przemysłowej"},
            {id: 145, name: "EXMOT – Technologia Filtracji", region: "mazowieckie", city: "Warszawa", industry: "filtry przemysłowe", potential: "wysoki", type: "partner", lat: 52.2297, lng: 21.0122, address: "Warszawa, Polska", phone: "brak informacji", website: "https://exmot.pl", email: "brak informacji", description: "Polski producent filtrów i wkładów filtracyjnych (strona firmowa)"},
            {id: 146, name: "Filtertech", region: "mazowieckie", city: "Łomianki", industry: "technologie filtracyjne", potential: "wysoki", type: "partner", lat: 52.312, lng: 20.860, address: "ul. Kolejowa 16, 05-092 Łomianki", phone: "(22) 751 38 82", website: "https://filtertech.com.pl", email: "chemtech@filtertech.com.pl", description: "Dostawca filtrów: separacja gazów, filtracja membranowa, CMF i inne"},
            {id: 147, name: "Envi-Filter", region: "mazowieckie", city: "Warszawa", industry: "filtry przemysłowe", potential: "wysoki", type: "partner", lat: 52.2297, lng: 21.0122, address: "Warszawa, Polska", phone: "brak informacji", website: "https://envi-filter.com", email: "brak informacji", description: "Dostawca wysokiej jakości filtrów powietrza, projektowanych w Polsce dla Europy"},
            {id: 148, name: "AUTOSAN S.A.", region: "podkarpackie", city: "Sanok", industry: "motoryzacja", employees: "500", potential: "wysoki", type: "potencjalny partner biznesowy", lat: 49.5585, lng: 22.2111, address: "ul. Lipińskiego 109, 38-500 Sanok", phone: "+48 13 465 11 00", website: "https://www.autosan.pl", description: "Producent autobusów i pojazdów specjalnych"},
            {id: 149, name: "POLIMARKY", region: "podkarpackie", city: "Mielec", industry: "chemia / tworzywa sztuczne", employees: "400", potential: "wysoki", type: "potencjalny partner biznesowy", lat: 50.2850, lng: 21.4440, address: "ul. Wojska Polskiego 3, 39-300 Mielec", phone: "+48 17 788 80 00", website: "https://www.polimarky.pl", description: "Producent polipropylenu i granulatów tworzyw sztucznych"},
            {id: 150, name: "ML SYSTEM S.A.", region: "podkarpackie", city: "Zaczernie k. Rzeszowa", industry: "energetyka / fotowoltaika", employees: "350", potential: "wysoki", type: "potencjalny partner biznesowy", lat: 50.1060, lng: 21.9990, address: "Zaczernie 190G, 36-062 Zaczernie", phone: "+48 17 888 26 02", website: "https://www.mlsystem.pl", description: "Producent paneli fotowoltaicznych i technologii PV"},
            {id: 151, name: "FAKRO PP Sp. z o.o.", region: "podkarpackie", city: "Nowy Sącz / Jasło", industry: "budowlana", employees: "3,300", potential: "wysoki", type: "potencjalny partner biznesowy", lat: 49.7460, lng: 21.4726, address: "ul. Węgierska 144a, 33-300 Nowy Sącz (oddział Jasło)", phone: "+48 18 444 07 00", website: "https://www.fakro.pl", description: "Producent okien dachowych i akcesoriów budowlanych"},
            {id: 152, name: "STOMIL SANOK Wytwórnia Pasów", region: "podkarpackie", city: "Sanok", industry: "guma / przemysł ciężki", employees: "300", potential: "średni", type: "potencjalny partner biznesowy", lat: 49.5580, lng: 22.2090, address: "ul. Przemyska 70, 38-500 Sanok", phone: "+48 13 465 32 00", website: "https://sanokrubber.com", description: "Producent taśm i pasów gumowych dla przemysłu"},
            {id: 153, name: "DWORY-CHEM (dawniej Organika-Sarzyna)", region: "podkarpackie", city: "Nowa Sarzyna", industry: "chemia", employees: "600", potential: "wysoki", type: "potencjalny partner biznesowy", lat: 50.3160, lng: 22.3860, address: "ul. Chemików 1, 37-310 Nowa Sarzyna", phone: "+48 17 240 71 00", website: "https://www.ciechgroup.com", description: "Zakład chemiczny produkujący żywice i środki ochrony roślin"},
            {id: 154, name: "LOT AMS Rzeszów", region: "podkarpackie", city: "Jasionka", industry: "lotniczy / serwis", employees: "250", potential: "średni", type: "potencjalny partner biznesowy", lat: 50.1130, lng: 22.0260, address: "Jasionka 942, 36-002 Jasionka", phone: "+48 17 852 00 00", website: "https://lotams.com", description: "Serwis samolotów, część LOT Aircraft Maintenance Services"},
            {id: 155, name: "ALIMA-GERBER (Nestlé)", region: "podkarpackie", city: "Rzeszów", industry: "spożywcza", employees: "500", potential: "wysoki", type: "potencjalny partner biznesowy", lat: 50.0370, lng: 21.9990, address: "ul. Przemysłowa 2, 35-105 Rzeszów", phone: "+48 17 852 91 00", website: "https://www.nestle.pl", description: "Produkcja żywności dla dzieci – marka Gerber, zakład Nestlé"}

];

const CRMApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedPotential, setSelectedPotential] = useState('');
  const [selectedModal, setSelectedModal] = useState(null);
  const [reportCompanies, setReportCompanies] = useState([]);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [mapView, setMapView] = useState<{ center: [number, number]; zoom: number }>({
    center: [52.1, 19.4], // środek PL
    zoom: 6
  });
  // Filtry i dane
  const regions = [...new Set(companies.map(c => c.region))].filter(Boolean);
  const industries = [...new Set(companies.map(c => c.industry))].filter(Boolean);

  const filteredCompanies = useMemo(() => {
    let filtered = companies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (company.description && company.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRegion = !selectedRegion || company.region === selectedRegion;
      const matchesIndustry = !selectedIndustry || company.industry === selectedIndustry;
      const matchesPotential = !selectedPotential || company.potential === selectedPotential;
      
      return matchesSearch && matchesRegion && matchesIndustry && matchesPotential;
    });

    if (sortField) {
      filtered.sort((a, b) => {
        let aVal = a[sortField] || '';
        let bVal = b[sortField] || '';
        
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        
        if (sortDirection === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [searchTerm, selectedRegion, selectedIndustry, selectedPotential, sortField, sortDirection]);

  const clients = filteredCompanies.filter(c => c.type === 'klient');
  const partners = filteredCompanies.filter(c => c.type === 'partner');

  // Statystyki dla dashboard
  const stats = {
    totalClients: companies.filter(c => c.type === 'klient').length,
    totalPartners: companies.filter(c => c.type === 'partner').length,
    highPotential: companies.filter(c => c.potential === 'wysoki').length,
    regionsData: regions.map(region => ({
      region,
      count: companies.filter(c => c.region === region).length
    })),
    industriesData: industries.slice(0, 5).map(industry => ({
      industry,
      count: companies.filter(c => c.industry === industry).length
    })),
    potentialData: [
      { name: 'Wysoki', value: companies.filter(c => c.potential === 'wysoki').length, color: '#10b981' },
      { name: 'Średni', value: companies.filter(c => c.potential === 'średni').length, color: '#f59e0b' },
      { name: 'Niski', value: companies.filter(c => c.potential === 'niski').length, color: '#ef4444' }
    ]
  };

  const getPotentialBadge = (potential) => {
    const colors = {
      'wysoki': 'bg-gradient-to-r from-green-500 to-emerald-600',
      'średni': 'bg-gradient-to-r from-yellow-500 to-orange-600', 
      'niski': 'bg-gradient-to-r from-red-500 to-rose-600'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${colors[potential] || 'bg-gray-500'}`}>
        {potential || 'brak'}
      </span>
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const addToReport = (company) => {
    if (!reportCompanies.find(c => c.id === company.id)) {
      setReportCompanies([...reportCompanies, company]);
    }
  };

  const removeFromReport = (companyId) => {
    setReportCompanies(reportCompanies.filter(c => c.id !== companyId));
  };

  const generateEmail = (company) => {
    const subject = `Współpraca - ${company.name}`;
    const body = `Dzień dobry,\n\nPiszę w sprawie potencjalnej współpracy w zakresie filtrów przemysłowych.\n\nPozdrawiam`;
    window.open(`mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  // Komponenty
  const Navigation = () => (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Filter className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              FiltersPro CRM
            </h1>
          </div>
          
          <div className="flex space-x-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'clients', label: 'Klienci', icon: Building },
              { id: 'partners', label: 'Partnerzy', icon: Users },
              { id: 'map', label: 'Mapa', icon: Map },
              { id: 'strategy', label: 'Strategia', icon: Target }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {reportCompanies.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">Raport: {reportCompanies.length}</span>
              <button className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm hover:shadow-lg transition-all duration-200">
                <Download className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );

  const CompanyModal = ({ company, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{company.name}</h2>
            <div className="flex items-center space-x-3">
              {getPotentialBadge(company.potential)}
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                company.type === 'klient' 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              }`}>
                {company.type === 'klient' ? 'Klient' : 'Partner'}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Lokalizacja</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>{company.city}, {company.region}</span>
                  </div>
                  {company.address && (
                    <p className="text-sm text-gray-400 pl-6">{company.address}</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Branża</h3>
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm border border-indigo-500/30">
                  {company.industry}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {company.employees && (
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Pracownicy</h3>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-400" />
                    <span className="text-white">{company.employees}</span>
                  </div>
                </div>
              )}

              {company.revenue && (
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Przychody</h3>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-yellow-400" />
                    <span className="text-white">{company.revenue}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {company.description && (
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Opis</h3>
              <p className="text-gray-300 leading-relaxed">{company.description}</p>
            </div>
          )}

          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Kontakt</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {company.phone && (
                <a href={`tel:${company.phone}`} className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Zadzwoń</span>
                </a>
              )}
              {company.email && (
                <button onClick={() => generateEmail(company)} className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Email</span>
                </button>
              )}
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">Strona</span>
                </a>
              )}
            </div>
          </div>

          <button 
            onClick={() => addToReport(company)}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Dodaj do raportu</span>
          </button>
        </div>
      </div>
    </div>
  );

  const FiltersBar = () => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Szukaj firm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">Wszystkie regiony</option>
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>

        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">Wszystkie branże</option>
          {industries.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>

        <select
          value={selectedPotential}
          onChange={(e) => setSelectedPotential(e.target.value)}
          className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">Wszystkie potencjały</option>
          <option value="wysoki">Wysoki</option>
          <option value="średni">Średni</option>
          <option value="niski">Niski</option>
        </select>

        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Filtruj</span>
        </button>
      </div>
    </div>
  );

  const CompanyTable = ({ companies, title }) => (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">{title} ({companies.length})</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Akcje</th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center space-x-1">
                  <span>Firma</span>
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('industry')}>
                <div className="flex items-center space-x-1">
                  <span>Branża</span>
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Lokalizacja</th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Wielkość</th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('potential')}>
                <div className="flex items-center space-x-1">
                  <span>Potencjał</span>
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Email</th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Telefon</th>
              <th className="px-4 py-3 text-left text-gray-300 font-semibold">Działania</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr key={company.id} className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${index % 2 === 0 ? 'bg-gray-800/20' : ''}`}>
                <td className="px-4 py-3">
                  <button
                    onClick={() => addToReport(company)}
                    className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                    title="Dodaj do raportu"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-white">{company.name}</div>
                  <div className="text-sm text-gray-400">{company.city}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs border border-indigo-500/30">
                    {company.industry}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-300">
                  <div>{company.city}</div>
                  <div className="text-sm text-gray-400">{company.region}</div>
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {company.employees || 'brak danych'}
                </td>
                <td className="px-4 py-3">
                  {getPotentialBadge(company.potential)}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {company.email || '-'}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {company.phone || '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedModal(company)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      title="Zobacz szczegóły"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        title="Otwórz stronę"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    {company.email && (
                      <button
                        onClick={() => generateEmail(company)}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        title="Wyślij email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Główne widoki
  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Klienci</p>
              <p className="text-3xl font-bold">{stats.totalClients}</p>
            </div>
            <Building className="w-10 h-10 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Partnerzy</p>
              <p className="text-3xl font-bold">{stats.totalPartners}</p>
            </div>
            <Users className="w-10 h-10 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Wysoki potencjał</p>
              <p className="text-3xl font-bold">{stats.highPotential}</p>
            </div>
            <Star className="w-10 h-10 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">W raporcie</p>
              <p className="text-3xl font-bold">{reportCompanies.length}</p>
            </div>
            <Database className="w-10 h-10 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Firmy według regionów</h3>
          <ResponsiveContainer width="100%" height={300}>
           <BarChart data={stats.regionsData}>
  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
  <XAxis dataKey="region" stroke="#9CA3AF" />
  <YAxis stroke="#9CA3AF" />
  <RechartsTooltip
    contentStyle={{
      backgroundColor: '#1F2937',
      border: '1px solid '#374151',
      borderRadius: '8px',
      color: '#F9FAFB'
    }}
  />
  <Bar dataKey="count" fill="url(#colorGradient)" />
  <defs>
    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9}/>
      <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.9}/>
    </linearGradient>
  </defs>
</BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Potencjał sprzedażowy</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
  <Pie
    data={stats.potentialData}
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={120}
    paddingAngle={5}
    dataKey="value"
  >
    {stats.potentialData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={entry.color} />
    ))}
  </Pie>
  <RechartsTooltip
    contentStyle={{
      backgroundColor: '#1F2937',
      border: '1px solid #374151',
      borderRadius: '8px',
      color: '#F9FAFB'
    }}
  />
</RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
const RestoreView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: false });
  }, []); // tylko raz po mount
  return null;
};

const TrackView: React.FC<{ onChange: (center: [number, number], zoom: number) => void }> = ({ onChange }) => {
  useMapEvents({
    moveend: (e) => {
      const m = e.target;
      const c = m.getCenter();
      onChange([c.lat, c.lng], m.getZoom());
    },
    zoomend: (e) => {
      const m = e.target;
      const c = m.getCenter();
      onChange([c.lat, c.lng], m.getZoom());
    },
  });
  return null;
};
 const MapView = () => {
  // mniejsze piny, minimalnie większe przy dużym zbliżeniu
  const pinRadius = mapView.zoom >= 10 ? 7 : 5
  const showLabelsFromZoom = 9 // od jakiego zoomu stałe etykiety

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Mapa firm</h2>

      <FiltersBar />

      <div className="relative rounded-xl overflow-hidden" style={{ height: '600px' }}>
  <MapContainer
    center={mapView.center}
    zoom={mapView.zoom}
    scrollWheelZoom
    style={{ height: '100%', width: '100%' }}
  >
    <RestoreView center={mapView.center} zoom={mapView.zoom} />
    <TrackView onChange={(center, zoom) => setMapView({ center, zoom })} />

    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />

    {filteredCompanies
      .filter((c) => typeof c.lat === 'number' && typeof c.lng === 'number')
      .map((c) => (
        <CircleMarker
          key={c.id}
          center={[c.lat, c.lng]}
          pathOptions={{ color: c.type === 'klient' ? '#3B82F6' : '#A855F7' }}
          radius={mapView.zoom >= 10 ? 7 : 5}
          eventHandlers={{ click: () => setSelectedModal(c) }}
        >
          <Tooltip direction="top" offset={[0, -8]}>
            <div style={{ fontWeight: 600 }}>{c.name}</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>
              {c.city}{c.region ? `, ${c.region}` : ''}
            </div>
            {c.potential && (
              <div style={{ fontSize: 12, opacity: 0.85 }}>Potencjał: {c.potential}</div>
            )}
          </Tooltip>

          {mapView.zoom >= 9 && (
            <Tooltip permanent direction="bottom" offset={[0, 10]} className="marker-label">
              {c.name}
            </Tooltip>
          )}

          <Popup>
            <div style={{ minWidth: 180 }}>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {c.city}{c.region ? `, ${c.region}` : ''}
              </div>
              <div style={{ marginTop: 6 }}>
                <button
                  onClick={() => setSelectedModal(c)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: '#2563EB',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Szczegóły
                </button>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
  </MapContainer>
</div>
    </div>
  )
}

  const StrategyView = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Narzędzia strategiczne</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Systemy CRM</h3>
            <div className="space-y-3">
              {[
                { name: 'Salesforce', url: 'https://salesforce.com' },
                { name: 'HubSpot', url: 'https://hubspot.com' },
                { name: 'Pipedrive', url: 'https://pipedrive.com' },
                { name: 'Zoho CRM', url: 'https://zoho.com/crm' }
              ].map(tool => (
                <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors group">
                  <span className="text-gray-300 group-hover:text-white">{tool.name}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Bazy firm</h3>
            <div className="space-y-3">
              {[
                { name: 'Panorama Firm', url: 'https://panoramafirm.pl' },
                { name: 'Bisnode', url: 'https://bisnode.pl' },
                { name: 'KRS Online', url: 'https://krs-online.com.pl' },
                { name: 'Europages', url: 'https://europages.pl' }
              ].map(tool => (
                <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors group">
                  <span className="text-gray-300 group-hover:text-white">{tool.name}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-400" />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Analizy rynku</h3>
            <div className="space-y-3">
              {[
                { name: 'GUS', url: 'https://stat.gov.pl' },
                { name: 'PAIH', url: 'https://paih.gov.pl' },
                { name: 'PARP', url: 'https://parp.gov.pl' },
                { name: 'BGK', url: 'https://bgk.pl' }
              ].map(tool => (
                <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors group">
                  <span className="text-gray-300 group-hover:text-white">{tool.name}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-400" />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border border-orange-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Marketing</h3>
            <div className="space-y-3">
              {[
                { name: 'LinkedIn Sales Navigator', url: 'https://business.linkedin.com/sales-solutions' },
                { name: 'Mailchimp', url: 'https://mailchimp.com' },
                { name: 'SEMrush', url: 'https://semrush.com' },
                { name: 'Calendly', url: 'https://calendly.com' }
              ].map(tool => (
                <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors group">
                  <span className="text-gray-300 group-hover:text-white">{tool.name}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-orange-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Wskazówki strategiczne</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Target className="w-5 h-5 text-blue-400 mt-1" />
              <div>
                <h4 className="font-semibold text-white">Segmentacja klientów</h4>
                <p className="text-gray-300 text-sm">Grupuj klientów według branży i potencjału sprzedażowego</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-yellow-400 mt-1" />
              <div>
                <h4 className="font-semibold text-white">Automatyzacja</h4>
                <p className="text-gray-300 text-sm">Wykorzystaj CRM do automatyzacji procesów sprzedażowych</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BarChart3 className="w-5 h-5 text-green-400 mt-1" />
              <div>
                <h4 className="font-semibold text-white">Analiza danych</h4>
                <p className="text-gray-300 text-sm">Regularnie analizuj konwersje i ROI z różnych źródeł</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Trendy branżowe</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h4 className="font-semibold text-blue-400 mb-2">Zielona transformacja</h4>
              <p className="text-gray-300 text-sm">Rosnące zapotrzebowanie na filtry ekologiczne w przemyśle</p>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <h4 className="font-semibold text-purple-400 mb-2">Digitalizacja</h4>
              <p className="text-gray-300 text-sm">Inteligentne systemy filtracji z IoT i monitoringiem</p>
            </div>
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <h4 className="font-semibold text-green-400 mb-2">Regulacje EU</h4>
              <p className="text-gray-300 text-sm">Nowe normy emisji wymagają zaawansowanych filtrów</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && <DashboardView />}
        
        {activeTab === 'clients' && (
          <div>
            <FiltersBar />
            <CompanyTable companies={clients} title="Klienci" />
          </div>
        )}
        
        {activeTab === 'partners' && (
          <div>
            <FiltersBar />
            <CompanyTable companies={partners} title="Partnerzy biznesowi" />
          </div>
        )}
        
        {activeTab === 'map' && <MapView />}
        {activeTab === 'strategy' && <StrategyView />}
      </div>

      {selectedModal && (
        <CompanyModal 
          company={selectedModal} 
          onClose={() => setSelectedModal(null)} 
        />
      )}
    </div>
  );
};

export default CRMApp;
