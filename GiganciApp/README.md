# Giganci Programowania – Aplikacja Mobilna (POC)

> React Native / Expo · iOS/Android · PL/EN/ES/DE

## O projekcie

Proof-of-concept aplikacji mobilnej dla szkoły programowania i AI **Giganci Programowania** dla dzieci i młodzieży w wieku 6-15 lat.

## Role użytkowników

| Rola | Kolor | Główne funkcje |
|------|-------|----------------|
| 🧑‍💻 **Uczeń** | Fioletowy | Dashboard z XP/poziomami, plan zajęć, kursy, wiadomości |
| 👨‍👩‍👧 **Rodzic** | Zielony | Postępy dziecka, frekwencja, płatności, wiadomości od nauczycieli |
| 👨‍🏫 **Nauczyciel** | Czerwony | Zarządzanie klasą, lista uczniów, szybkie akcje |

## Ekrany (mock data)

### Uczeń
- **Dashboard** – Pozdrowienie, statystyki XP/Streak/Level, plan dnia, postęp kursów, osiągnięcia
- **Plan zajęć** – Timeline z wyborem dnia tygodnia, dołączanie do zajęć online
- **Kursy** – Karty kursów z postępem, filtry, gamifikacja
- **Wiadomości** – Lista konwersacji z wyszukiwaniem, badge'e
- **Profil** – Statystyki, wybór języka (PL/EN/ES/DE), ustawienia

### Rodzic
- **Dashboard** – Karty dzieci, frekwencja, alert płatności, szybkie akcje
- **Płatności** – Historia, statusy (zapłacone/oczekuje), pobieranie faktur

### Nauczyciel
- **Dashboard** – Statystyki klasy, plan dnia, lista uczniów, szybkie akcje

## Uruchomienie

```bash
cd GiganciApp
npm install
npx expo start
```

Następnie zeskanuj QR kod aplikacją **Expo Go** na telefonie.

## Stack technologiczny

- **React Native** z **Expo** (SDK 55)
- **TypeScript** – pełne typowanie
- **React Navigation** – nawigacja tab + stack
- **i18next** – wielojęzyczność (PL/EN/ES/DE)
- **expo-linear-gradient** – gradienty UI
- **Mock data** – gotowe dane demo bez backendu

## Struktura projektu

```
GiganciApp/
├── src/
│   ├── theme/          # Kolory, typografia, odstępy
│   ├── i18n/           # Tłumaczenia PL/EN/ES/DE
│   ├── context/        # AppContext (auth, język)
│   ├── data/           # Mock data
│   ├── components/     # Card, Button, ProgressBar, Avatar
│   ├── navigation/     # AppNavigator (tabs per role)
│   └── screens/
│       ├── auth/       # RoleSelect, Login
│       ├── student/    # Dashboard, Schedule, Courses, Messages, Profile
│       ├── parent/     # Dashboard, Payments
│       └── teacher/    # Dashboard
└── App.tsx
```

## Design System

- **Brand color**: `#6C3CE1` (fioletowy)
- **Font weights**: 400/600/700/800
- **Border radius**: 8/12/16/24/999
- Karty z cieniami, gradienty nagłówków, badge'e statusów
