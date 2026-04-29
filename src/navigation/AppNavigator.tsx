import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList, Note } from '../types';
import { HomeScreen }       from '../screens/HomeScreen';
import { AddNoteScreen }    from '../screens/AddNoteScreen';
import { EditNoteScreen }   from '../screens/EditNoteScreen';
import { NoteDetailScreen } from '../screens/NoteDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  notes:    Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({ notes, setNotes }) => {
  const handleSave = (note: Note) => {
    setNotes(prev => [note, ...prev]);
  };

  const handleUpdate = (updated: Note) => {
    setNotes(prev => prev.map(n => (n.id === updated.id ? updated : n)));
  };

  const handleDelete = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <SafeAreaProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home">
          {props => (
            <HomeScreen {...props} notes={notes} onDelete={handleDelete} />
          )}
        </Stack.Screen>

        <Stack.Screen name="AddNote">
          {props => <AddNoteScreen {...props} onSave={handleSave} />}
        </Stack.Screen>

        <Stack.Screen name="EditNote">
          {props => (
            <EditNoteScreen {...props} notes={notes} onUpdate={handleUpdate} />
          )}
        </Stack.Screen>

        <Stack.Screen name="NoteDetail">
          {props => (
            <NoteDetailScreen {...props} notes={notes} onDelete={handleDelete} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </SafeAreaProvider>
  );
};
