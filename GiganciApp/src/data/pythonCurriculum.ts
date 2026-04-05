export interface Lesson {
  id: string;
  title: string;
  systemPromptContext: string;
}

export const PYTHON_LESSONS: Lesson[] = [
  {
    id: 'variables',
    title: 'Zmienne i typy danych',
    systemPromptContext:
      'zmienne, typy danych: int (liczby całkowite), str (tekst), float (liczby zmiennoprzecinkowe), bool (prawda/fałsz), operator przypisania =, funkcja type()',
  },
  {
    id: 'conditionals',
    title: 'Warunki if/else',
    systemPromptContext:
      'instrukcja warunkowa if, elif, else, operatory porównania == != < > <= >=, operatory logiczne and or not, wcięcia w Pythonie',
  },
  {
    id: 'loops',
    title: 'Pętle for i while',
    systemPromptContext:
      'pętla for z range(), iteracja po elementach listy, pętla while z warunkiem, słowa kluczowe break i continue, zagnieżdżone pętle',
  },
];

export const getLesson = (id: string): Lesson | undefined =>
  PYTHON_LESSONS.find((l) => l.id === id);

export const LAST_COMPLETED_LESSON_ID = 'variables';
