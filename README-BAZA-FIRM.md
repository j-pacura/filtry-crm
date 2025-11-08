# 🏭 Baza Firm - FiltersPro CRM

## 📊 Stan obecny

- ✅ **45 firm** reprezentatywnych już w bazie (`src/data/companiesData.ts`)
- 🎯 **Cel: 155 firm** - pełna baza potencjalnych klientów i partnerów

---

## 🚀 JAK DODAĆ POZOSTAŁE 110 FIRM

### Opcja A: Edycja pliku `companiesData.ts` (RĘCZNIE)

1. Otwórz: `src/data/companiesData.ts`
2. Dodaj pozostałe firmy z Twojej listy (ŁÓDZKIE, MAŁOPOLSKIE, MAZOWIECKIE, PODKARPACKIE, WIELKOPOLSKIE, PARTNERZY)
3. **UWAGA**: Napraw duplikaty ID:
   - ~~id: 22~~ (drugi Hutchinson) → zmień na **id: 156**
   - ~~id: 133~~ (drugi - Przędziownia) → zmień na **id: 157**
   - ~~id: 151~~ (drugi - Filtrakon) → zmień na **id: 158**
   - ~~id: 152~~ (drugi - SM-FILTER) → zmień na **id: 159**

### Opcja B: Import przez Supabase (AUTOMATYCZNY)

1. Zaktualizuj `companiesData.ts` z pełną bazą 155 firm
2. Uruchom import:
   ```bash
   npx tsx import-companies.ts
   ```

### Opcja C: SQL bezpośrednio w Supabase

1. Wejdź do Supabase Dashboard → SQL Editor
2. Wklej SQL INSERT dla wszystkich firm
3. Wykonaj zapytanie

---

## 📍 Format danych firmy

```typescript
{
  id: 1,
  name: "KGHM POLSKA MIEDŹ S.A.",
  region: "dolnośląskie",
  city: "Lubin",
  industry: "górnictwo",
  employees: "18,000",
  revenue: "5 mld zł",
  potential: "wysoki", // wysoki | średni | niski
  type: "klient", // klient | potencjalny klient | partner
  lat: 51.3945, // ⚠️ WYMAGANE dla mapy!
  lng: 16.2015, // ⚠️ WYMAGANE dla mapy!
  address: "ul. M. Skłodowskiej-Curie 48, 59-301 Lubin",
  phone: "+48 76 74 78 200",
  website: "https://kghm.com",
  email: "kghm@kghm.com",
  description: "Największy producent miedzi w UE"
}
```

---

## 🎨 Typy firm i kolory pinów na mapie

- **`type: "klient"`** lub **`"potencjalny klient"`** → 🔵 **Niebieski pin**
- **`type: "partner"`** → 🟣 **Fioletowy pin**

---

## 📋 Lista firm do dodania (pozostałe ~110)

### ŁÓDZKIE (pozostałe ~14)
- PGE ELEKTROWNIA BEŁCHATÓW ✅ (już dodane)
- BSH ✅
- HUTCHINSON POLAND ✅
- ABB ✅
- HAERING POLSKA ✅
- CLARIANT POLSKA
- ARIADNA S.A.
- TOMTEX S.A.
- BARRY CALLEBAUT ✅
- TAT-POL
- ATLAS ✅
- KELMET
- TOMA
- INDESIT/WHIRLPOOL
- DELL PRODUCTS
- CERAMIKA PARADYŻ ✅
- PHILIPS LIGHTING
- TUBĄDZIN
- GLASS-PRODUKT

### MAŁOPOLSKIE (pozostałe ~14)
- GRUPA AZOTY TARNÓW ✅
- SYNTHOS OŚWIĘCIM ✅
- ARCELORMITTAL KRAKÓW
- NPA SKAWINA
- SELVITA
- BIOMED
- APTIV ✅
- PHILIP MORRIS ✅
- TAURON SIERSZA
- ELEKTROWNIA SKAWINA
- KPT Kraków
- COMARCH DATA CENTER
- BEYOND.PL
- POLCOM DATA CENTER
- FAKRO ✅
- NEWAG
- CAN-PACK
- TELE-FONIKA Kable
- MASPEX ✅
- IGLOO (chłodnictwo)
- LEGBUD GARGULA

### MAZOWIECKIE (pozostałe ~18)
- PKN ORLEN ✅
- POLFA WARSZAWA
- POLFA TARCHOMIN
- GEDEON RICHTER
- MPWiK WARSZAWA ✅
- PGE (centrala)
- PGNiG
- ELEKTROCIEPŁOWNIA SIEKIERKI ✅
- CIECH S.A.
- SYNTHOS (biuro)
- OPEL MANUFACTURING
- LG ELECTRONICS MŁAWA ✅
- MARS POLSKA ✅
- MONDELEZ
- ELEKTROWNIA OSTROŁĘKA ✅
- ŻYWIEC ZDRÓJ
- MICHELIN (biuro)
- HENKEL
- PROCTER & GAMBLE
- LOTOS (biuro)
- DAIKIN
- SCHNEIDER ELECTRIC
- SIEMENS

### PODKARPACKIE (pozostałe ~13)
- BORG WARNER ✅
- HUTA STALOWA WOLA ✅
- ZCH SIARKOPOL
- RAFINERIA JASŁO
- RAFINERIA JEDLICZE
- WSK PZL-RZESZÓW ✅
- MTU AERO ENGINES
- ULTRATECH
- FIBRAIN ✅
- SANOK RUBBER ✅
- AUTOSAN
- POLIMARKY
- ML SYSTEM (fotowoltaika)
- FAKRO PP
- STOMIL SANOK
- DWORY-CHEM
- LOT AMS
- ALIMA-GERBER (Nestlé)

### WIELKOPOLSKIE (pozostałe ~8)
- VW POZNAŃ ✅
- BRIDGESTONE ✅
- DELPHARM
- BIOFARM
- FARMAPOL
- ZE PAK ✅
- ELEKTROWNIA PĄTNÓW
- CARRIER MANUFACTURING
- KIMBALL ELECTRONICS ✅
- AMAZON FULFILLMENT
- NIVEA/BEIERSDORF
- KOMPANIA PIWOWARSKA ✅
- WRIGLEY
- CIECH Żerków
- PRZĘDZIOWNIA POLANEX

### PARTNERZY/HVAC/FILTRY (pozostałe ~20)
- ANG WENTYLACJA ✅
- KLIMA-VENTA
- PRO-VENT
- WIECZOREK P.P.U.H.
- JANEX SERWIS
- FILTRY PRZEMYSŁOWE POLSKA ✅
- SFM FILTRY
- RUBIX POLAND
- HVAC SERVICE
- SYSTEMCOLD ✅
- CARLINE
- WIENKRA/SEVRA
- GRUPA CSV
- ABC COLOREX
- EKOMAL ✅
- BIOWER
- EKO-BIO
- BLF FILTRATION ✅
- INSTAL-FILTER
- MANN+HUMMEL
- Filtrakon (id: 158!)
- SM-FILTER (id: 159!)
- EXMOT
- Filtertech
- Envi-Filter

---

## ⚠️ WAŻNE DUPLIKATY ID DO NAPRAWY

Podczas dodawania firm, **zmień te ID**:

```typescript
// BYŁO (duplikat):
{id: 22, name: "PRZEDSIĘBIORSTWO PRODUKCYJNE HUTCHINSON POLAND", ...}

// MA BYĆ:
{id: 156, name: "PRZEDSIĘBIORSTWO PRODUKCYJNE HUTCHINSON POLAND", ...}

// Analogicznie:
id: 133 → 157 (PRZĘDZIOWNIA POLANEX)
id: 151 → 158 (Filtrakon)
id: 152 → 159 (SM-FILTER)
```

---

## 🧪 Test po dodaniu

1. Uruchom: `npm run dev`
2. Otwórz: `http://localhost:5173`
3. Kliknij zakładkę **"Mapa"**
4. Sprawdź czy:
   - ✅ Wszystkie firmy są zaznaczone
   - ✅ Niebieski pin = klienci
   - ✅ Fioletowy pin = partnerzy
   - ✅ Tooltip pokazuje nazwę firmy
   - ✅ Kliknięcie w pin otwiera szczegóły

---

## 📞 Wsparcie

Jeśli potrzebujesz pomocy:
1. Sprawdź console przeglądarki (F12)
2. Sprawdź console terminala
3. Sprawdź logi Supabase

