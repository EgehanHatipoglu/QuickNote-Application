import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Note } from '../types';
import { NoteCard }   from '../components/NoteCard';
import { EmptyState } from '../components/EmptyState';
import { Radius, Shadow, Spacing } from '../theme';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface HomeScreenProps extends Props {
  notes:    Note[];
  onDelete: (id: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, notes, onDelete }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return notes;
    return notes.filter(
      n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q),
    );
  }, [notes, search]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bg}
      />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSub }]}>Hello 👋</Text>
          <Text style={[styles.appTitle, { color: colors.text }]}>QuickNote</Text>
        </View>
        <View style={styles.headerRight}>
          {/* Dark mode toggle */}
          <TouchableOpacity
            style={[styles.themeBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={toggleTheme}
            activeOpacity={0.8}
          >
            <Text style={styles.themeBtnIcon}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>E</Text>
          </View>
        </View>
      </View>

      {/* ── Search ── */}
      <View style={[styles.searchWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search notes..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={[styles.clearBtn, { color: colors.textMuted }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Section header ── */}
      {notes.length > 0 && (
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>My Notes</Text>
          <View style={[styles.countBadge, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.countText, { color: colors.primary }]}>{notes.length}</Text>
          </View>
        </View>
      )}

      {/* ── List ── */}
      {notes.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={() => navigation.navigate('NoteDetail', { noteId: item.id })}
              onDelete={onDelete}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.noResults}>
              <Text style={[styles.noResultsText, { color: colors.textMuted }]}>
                No notes match "{search}"
              </Text>
            </View>
          }
        />
      )}

      {/* ── FAB ── */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }, Shadow.fab]}
        onPress={() => navigation.navigate('AddNote')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  greeting:  { fontSize: 13, marginBottom: 2 },
  appTitle:  { fontSize: 26, fontWeight: '700' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  themeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  themeBtnIcon: { fontSize: 18 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 17, fontWeight: '700', color: '#fff' },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon:  { fontSize: 15, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14 },
  clearBtn:    { fontSize: 14, padding: 4 },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    gap: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
  countBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 26,
    alignItems: 'center',
  },
  countText: { fontSize: 12, fontWeight: '700' },

  listContent: { paddingTop: 4, paddingBottom: 100 },
  noResults:   { alignItems: 'center', marginTop: 60 },
  noResultsText: { fontSize: 14 },

  fab: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: { fontSize: 28, color: '#fff', lineHeight: 34 },
});
