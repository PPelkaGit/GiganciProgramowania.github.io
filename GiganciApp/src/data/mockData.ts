export type UserRole = 'student' | 'parent' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  level?: number;
  xp?: number;
  streak?: number;
}

export const MOCK_USERS: Record<UserRole, User> = {
  student: {
    id: 's1',
    name: 'Kacper Nowak',
    email: 'kacper@giganci.pl',
    role: 'student',
    level: 7,
    xp: 3240,
    streak: 12,
  },
  parent: {
    id: 'p1',
    name: 'Anna Kowalska',
    email: 'anna@giganci.pl',
    role: 'parent',
  },
  teacher: {
    id: 't1',
    name: 'Pan Tomasz',
    email: 'tomasz@giganci.pl',
    role: 'teacher',
  },
};

export const SCHEDULE_DATA = [
  {
    id: '1',
    subject: 'Python dla dzieci',
    time: '10:00',
    endTime: '11:30',
    room: 'Sala A',
    teacher: 'Pan Tomasz',
    color: '#6C3CE1',
    day: 0, // Monday
    isOnline: false,
  },
  {
    id: '2',
    subject: 'Scratch – Animacje',
    time: '14:00',
    endTime: '15:00',
    room: 'Online',
    teacher: 'Pani Marta',
    color: '#059669',
    day: 0,
    isOnline: true,
  },
  {
    id: '3',
    subject: 'AI i Uczenie Maszynowe',
    time: '09:00',
    endTime: '10:30',
    room: 'Sala B',
    teacher: 'Pan Tomasz',
    color: '#DC2626',
    day: 2, // Wednesday
    isOnline: false,
  },
  {
    id: '4',
    subject: 'Web Design – HTML/CSS',
    time: '12:00',
    endTime: '13:30',
    room: 'Sala A',
    teacher: 'Pani Kasia',
    color: '#F59E0B',
    day: 2,
    isOnline: false,
  },
  {
    id: '5',
    subject: 'Game Dev z Unity',
    time: '15:00',
    endTime: '17:00',
    room: 'Sala C',
    teacher: 'Pan Marek',
    color: '#3B82F6',
    day: 4, // Friday
    isOnline: false,
  },
];

export const COURSES = [
  {
    id: 'c1',
    title: 'Python dla Początkujących',
    subtitle: 'Podstawy programowania',
    description: 'Naucz się Pythona od zera! Idealne dla dzieci 8-12 lat.',
    progress: 65,
    totalLessons: 24,
    completedLessons: 16,
    hours: 12,
    difficulty: 'beginner',
    color: '#6C3CE1',
    icon: '🐍',
    enrolled: true,
    tags: ['Python', 'Coding', 'Basics'],
  },
  {
    id: 'c2',
    title: 'Scratch - Twórz Gry',
    subtitle: 'Programowanie wizualne',
    description: 'Twórz własne gry i animacje w Scratchu.',
    progress: 40,
    totalLessons: 18,
    completedLessons: 7,
    hours: 9,
    difficulty: 'beginner',
    color: '#F59E0B',
    icon: '🎮',
    enrolled: true,
    tags: ['Scratch', 'Games', 'Visual'],
  },
  {
    id: 'c3',
    title: 'AI i Uczenie Maszynowe',
    subtitle: 'Sztuczna inteligencja',
    description: 'Odkryj tajniki AI i naucz komputery myśleć.',
    progress: 20,
    totalLessons: 30,
    completedLessons: 6,
    hours: 18,
    difficulty: 'intermediate',
    color: '#DC2626',
    icon: '🤖',
    enrolled: true,
    tags: ['AI', 'ML', 'Python'],
  },
  {
    id: 'c4',
    title: 'Web Design - HTML/CSS',
    subtitle: 'Tworzenie stron www',
    description: 'Stwórz swoją pierwszą stronę internetową.',
    progress: 0,
    totalLessons: 20,
    completedLessons: 0,
    hours: 10,
    difficulty: 'beginner',
    color: '#059669',
    icon: '🌐',
    enrolled: false,
    tags: ['HTML', 'CSS', 'Web'],
  },
  {
    id: 'c5',
    title: 'Game Dev z Unity',
    subtitle: 'Tworzenie gier 3D',
    description: 'Zaprojektuj i stwórz swoją pierwszą grę 3D.',
    progress: 0,
    totalLessons: 36,
    completedLessons: 0,
    hours: 24,
    difficulty: 'advanced',
    color: '#3B82F6',
    icon: '🕹️',
    enrolled: false,
    tags: ['Unity', 'C#', '3D'],
  },
];

export const MESSAGES = [
  {
    id: 'm1',
    sender: 'Pan Tomasz',
    senderRole: 'teacher',
    preview: 'Pamiętajcie o jutrzejszych zadaniach domowych z Pythona!',
    time: '10:30',
    unread: 2,
    avatar: '👨‍🏫',
  },
  {
    id: 'm2',
    sender: 'Giganci Programowania',
    senderRole: 'school',
    preview: 'Nowy kurs AI startuje w poniedziałek! Zapisz się teraz.',
    time: 'Wczoraj',
    unread: 1,
    avatar: '🏫',
  },
  {
    id: 'm3',
    sender: 'Pani Marta',
    senderRole: 'teacher',
    preview: 'Świetna robota na ostatnich zajęciach ze Scratcha!',
    time: 'Wt',
    unread: 0,
    avatar: '👩‍🏫',
  },
  {
    id: 'm4',
    sender: 'Klasa Python A',
    senderRole: 'group',
    preview: 'Kacper: Kto robi zadanie 5 z pętlami?',
    time: 'Pon',
    unread: 5,
    avatar: '👥',
  },
];

export const ACHIEVEMENTS = [
  { id: 'a1', title: 'Pierwszy kod!', icon: '🏆', earned: true },
  { id: 'a2', title: '7 dni z rzędu', icon: '🔥', earned: true },
  { id: 'a3', title: 'Pythonista', icon: '🐍', earned: true },
  { id: 'a4', title: 'Game Master', icon: '🎮', earned: false },
  { id: 'a5', title: 'AI Explorer', icon: '🤖', earned: false },
];

export const CHILDREN = [
  {
    id: 'ch1',
    name: 'Kacper Nowak',
    age: 11,
    level: 7,
    xp: 3240,
    streak: 12,
    attendance: 92,
    courses: ['Python dla Początkujących', 'Scratch - Twórz Gry', 'AI i Uczenie Maszynowe'],
    nextClass: 'Python - Piątek 10:00',
    avatar: '🧑‍💻',
  },
  {
    id: 'ch2',
    name: 'Zosia Nowak',
    age: 8,
    level: 3,
    xp: 840,
    streak: 5,
    attendance: 88,
    courses: ['Scratch - Twórz Gry'],
    nextClass: 'Scratch - Środa 14:00',
    avatar: '👩‍💻',
  },
];

export const PAYMENTS = [
  {
    id: 'pay1',
    description: 'Kurs Python - Kwiecień 2025',
    amount: 299,
    currency: 'PLN',
    status: 'paid',
    date: '2025-04-01',
    child: 'Kacper Nowak',
  },
  {
    id: 'pay2',
    description: 'Kurs Scratch - Kwiecień 2025',
    amount: 199,
    currency: 'PLN',
    status: 'paid',
    date: '2025-04-01',
    child: 'Zosia Nowak',
  },
  {
    id: 'pay3',
    description: 'Kurs Python - Maj 2025',
    amount: 299,
    currency: 'PLN',
    status: 'pending',
    date: '2025-05-01',
    child: 'Kacper Nowak',
  },
  {
    id: 'pay4',
    description: 'Kurs AI - Maj 2025',
    amount: 349,
    currency: 'PLN',
    status: 'pending',
    date: '2025-05-01',
    child: 'Kacper Nowak',
  },
];

export const TEACHER_STUDENTS = [
  { id: 'ts1', name: 'Kacper Nowak', age: 11, attendance: 92, grade: 5, course: 'Python A', avatar: '🧑' },
  { id: 'ts2', name: 'Maja Wiśniewska', age: 10, attendance: 98, grade: 5, course: 'Python A', avatar: '👧' },
  { id: 'ts3', name: 'Aleksander Kowalski', age: 12, attendance: 78, grade: 4, course: 'Python A', avatar: '👦' },
  { id: 'ts4', name: 'Natalia Wójcik', age: 11, attendance: 95, grade: 5, course: 'Python A', avatar: '👧' },
  { id: 'ts5', name: 'Piotr Zieliński', age: 13, attendance: 85, grade: 3, course: 'AI', avatar: '👦' },
  { id: 'ts6', name: 'Emilia Szymańska', age: 12, attendance: 91, grade: 4, course: 'AI', avatar: '👧' },
];
