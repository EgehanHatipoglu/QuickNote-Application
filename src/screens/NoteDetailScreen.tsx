import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Note } from '../types';
import { Button } from '../components/Button';
import { Radius, Spacing } from '../theme';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'NoteDetail'>;

interface NoteDetailScreenProps extends Props {
  notes:    Note[];
  onDelete: (id: string) => void;
}

const CATEGORY_COLORS = (c: ReturnType<typeof useTheme>['colors']): Record<Note['category'], string> => ({
  Shopping: c.primary,
  List:     c.accent,
  Health:   c.success,
  Other:    c.warning,
});

const CATEGORY_EMOJI: Record<Note['category'], string> = {
  Shopping: '🛒', List: '📋', Health: '💊', Other: '📌',
};

function formatFullDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export const NoteDetailScreen: React.FC<NoteDetailScreenProps> = ({
  navigation, route, notes, onDelete,
}) => {
  const { colors, isDark } = useTheme();
  const note = notes.find(n => n.id === route.params.noteId);

  if (!note) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]}>
        <View style={styles.errorWrap}>
          <Text style={[styles.errorText, { color: colors.textSub }]}>Note not found.</Text>
          <Button label="Go Back" onPress={() => navigation.goBack()} style={{ marginTop: 16 }} />
        </View>
      </SafeAreaView>
    );
  }

  const tagColor    = CATEGORY_COLORS(colors)[note.category];
  const categoryStr = `${CATEGORY_EMOJI[note.category]} ${note.category}`;

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: () => { onDelete(note.id); navigation.goBack(); },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.surface}
      />

      {/* ── NavBar ── */}
      <View style={[styles.navbar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.bg }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.text }]}>Note Detail</Text>
        <TouchableOpacity
          style={[styles.editBtn, { backgroundColor: colors.primaryLight }]}
          onPress={() => navigation.navigate('EditNote', { noteId: note.id })}
        >
          <Text style={[styles.editText, { color: colors.primary }]}>✏️ Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Hero ── */}
        <View style={[styles.hero, { backgroundColor: colors.primaryLight }]}>
          <View style={[styles.catChip, { backgroundColor: tagColor }]}>
            <Text style={styles.catChipText}>{categoryStr}</Text>
          </View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>{note.title}</Text>
          <Text style={[styles.heroMeta, { color: colors.textSub }]}>
            📅 {formatFullDate(note.createdAt)}{'   •   '}{note.content.length} characters
          </Text>
        </View>

        {/* ── Content ── */}
        <View style={styles.body}>
          <Text style={[styles.contentLabel, { color: colors.textSub }]}>Note Content</Text>
          <Text style={[styles.noteText,     { color: colors.text    }]}>{note.content}</Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* ── Stats ── */}
          <View style={[styles.statsBar, { backgroundColor: colors.bg }]}>
            {[
              [note.content.split(/\s+/).filter(Boolean).length.toString(), 'Words'],
              [note.content.length.toString(),                              'Characters'],
              [Math.ceil(note.content.length / 200).toString(),            'Min read'],
            ].map(([val, label], i) => (
              <React.Fragment key={label}>
                {i > 0 && <View style={[styles.statSep, { backgroundColor: colors.border }]} />}
                <View style={styles.statItem}>
                  <Text style={[styles.statVal,   { color: colors.primary  }]}>{val}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSub  }]}>{label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          {/* ── Actions ── */}
          <Button label="🗑️  Delete Note" onPress={handleDelete} variant="danger" style={styles.btn} />
          <Button label="Share"           onPress={() => Alert.alert('Coming Soon', 'Share feature coming soon!')}     variant="ghost"  style={styles.btn} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:   { flex: 1 },
  scroll: { flex: 1 },
  errorWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.md },
  errorText: { fontSize: 16 },

  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    height: 56,
    borderBottomWidth: 1,
  },
  backBtn:  { width: 36, height: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 18, fontWeight: '500' },
  navTitle: { fontSize: 17, fontWeight: '600' },
  editBtn:  { paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radius.sm },
  editText: { fontSize: 12, fontWeight: '600' },

  hero: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    gap: 10,
  },
  catChip:     { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.full },
  catChipText: { fontSize: 11, fontWeight: '600', color: '#fff' },
  heroTitle:   { fontSize: 22, fontWeight: '700' },
  heroMeta:    { fontSize: 12 },

  body:         { padding: Spacing.md, gap: 12 },
  contentLabel: { fontSize: 13, fontWeight: '600' },
  noteText:     { fontSize: 15, lineHeight: 26 },
  divider:      { height: 1 },

  statsBar:  { flexDirection: 'row', borderRadius: Radius.md, paddingVertical: 14 },
  statItem:  { flex: 1, alignItems: 'center' },
  statVal:   { fontSize: 18, fontWeight: '700' },
  statLabel: { fontSize: 11, marginTop: 2 },
  statSep:   { width: 1, marginVertical: 4 },

  btn: { marginTop: 4 },
});
