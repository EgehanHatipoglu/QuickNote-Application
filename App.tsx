import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/context/ThemeContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { Note } from './src/types';

// ── Seed data — remove for production ─────────────────────────────
const SEED_NOTES: Note[] = [
  {
    id: '1',
    title: 'Grocery List',
    content:
      '• Milk (2 liters)\n• Bread (whole wheat)\n• Yogurt (500g)\n• Orange juice\n• Cheese (cheddar)\n• Tomatoes (1 kg)\n• Cucumber\n• Apples (red)',
    category: 'Shopping',
    createdAt: new Date(Date.now() - 1000 * 60 * 90),
  },
  {
    id: '2',
    title: 'Dinner Ingredients',
    content: 'Chicken breast, garlic, tomatoes, onion, olive oil, oregano, lemon',
    category: 'List',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 27),
  },
  {
    id: '3',
    title: 'Pharmacy Run',
    content: 'Vitamin D (1000IU), Omega-3, Magnesium, Cough syrup',
    category: 'Health',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50),
  },
];

export default function App() {
  const [notes, setNotes] = useState<Note[]>(SEED_NOTES);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppNavigator notes={notes} setNotes={setNotes} />
      </NavigationContainer>
    </ThemeProvider>
  );
}
