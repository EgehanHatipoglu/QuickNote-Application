import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView,
  StatusBar, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Note } from '../types';
import { Button }        from '../components/Button';
import { CategoryChips } from '../components/CategoryChips';
import { Radius, Spacing } from '../theme';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'EditNote'>;

interface EditNoteScreenProps extends Props {
  notes:    Note[];
  onUpdate: (note: Note) => void;
}

const MAX_CONTENT = 500;

export const EditNoteScreen: React.FC<EditNoteScreenProps> = ({
  navigation, route, notes, onUpdate,
}) => {
  const { colors, isDark } = useTheme();
  const original = notes.find(n => n.id === route.params.noteId);

  // Pre-populate from the existing note
  const [title,    setTitle]    = useState(original?.title    ?? '');
  const [content,  setContent]  = useState(original?.content  ?? '');
  const [category, setCategory] = useState<Note['category']>(original?.category ?? 'Shopping');

  if (!original) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]}>
        <View style={styles.errorWrap}>
          <Text style={[styles.errorText, { color: colors.textSub }]}>Note not found.</Text>
          <Button label="Go Back" onPress={() => navigation.goBack()} style={{ marginTop: 16 }} />
        </View>
      </SafeAreaView>
    );
  }

  const isDirty =
    title.trim()   !== original.title   ||
    content.trim() !== original.content ||
    category       !== original.category;

  const handleSave = () => {
    if (!title.trim())   { Alert.alert('Missing Title',   'Please give your note a title.');   return; }
    if (!content.trim()) { Alert.alert('Missing Content', 'Please add some content to your note.'); return; }

    onUpdate({
      ...original,
      title:    title.trim(),
      content:  content.trim(),
      category,
    });
    // Go back to detail screen (it will reflect the update via notes prop)
    navigation.goBack();
  };

  const handleCancel = () => {
    if (isDirty) {
      Alert.alert('Discard Changes?', 'You have unsaved changes. Discard them?', [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
      ]);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* ── NavBar ── */}
        <View style={[styles.navbar, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.bg }]}
            onPress={handleCancel}
          >
            <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: colors.text }]}>Edit Note</Text>
          <TouchableOpacity
            style={[styles.saveChip, { backgroundColor: isDirty ? colors.primaryLight : colors.bg }]}
            onPress={handleSave}
            disabled={!isDirty}
          >
            <Text style={[styles.saveChipText, { color: isDirty ? colors.primary : colors.textMuted }]}>
              Update
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Unchanged-note hint ── */}
          {!isDirty && (
            <View style={[styles.hintBanner, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.hintText, { color: colors.primary }]}>
                ✏️  Make changes to enable the Update button
              </Text>
            </View>
          )}

          {/* Category */}
          <Text style={[styles.label, { color: colors.textSub }]}>Category</Text>
          <CategoryChips selected={category} onSelect={setCategory} />

          {/* Title */}
          <Text style={[styles.label, { color: colors.textSub, marginTop: Spacing.md }]}>Title</Text>
          <TextInput
            style={[styles.titleInput, {
              backgroundColor: colors.bg,
              borderColor: isDirty ? colors.primary : colors.border,
              color: colors.text,
            }]}
            placeholder="Give your note a title..."
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            maxLength={80}
            returnKeyType="next"
          />

          {/* Content */}
          <Text style={[styles.label, { color: colors.textSub, marginTop: Spacing.md }]}>Content</Text>
          <TextInput
            style={[styles.contentInput, { backgroundColor: colors.bg, color: colors.text }]}
            placeholder="Write your note here..."
            placeholderTextColor={colors.textMuted}
            value={content}
            onChangeText={t => t.length <= MAX_CONTENT && setContent(t)}
            multiline
            textAlignVertical="top"
          />
          <Text style={[styles.charCount, { color: colors.textMuted },
            content.length > MAX_CONTENT * 0.9 && { color: colors.accent }]}>
            {content.length} / {MAX_CONTENT}
          </Text>

          {/* Actions */}
          <Button label="💾  Update Note" onPress={handleSave}  disabled={!isDirty} style={styles.btn} />
          <Button label="Cancel"          onPress={handleCancel} variant="ghost"    style={styles.btn} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:          { flex: 1 },
  flex:          { flex: 1 },
  scroll:        { flex: 1 },
  scrollContent: { padding: Spacing.md, paddingBottom: 40, gap: 8 },
  errorWrap:     { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.md },
  errorText:     { fontSize: 16 },

  navbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, height: 56, borderBottomWidth: 1,
  },
  backBtn:      { width: 36, height: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  backIcon:     { fontSize: 18, fontWeight: '500' },
  navTitle:     { fontSize: 17, fontWeight: '600' },
  saveChip:     { paddingHorizontal: 16, paddingVertical: 7, borderRadius: Radius.sm },
  saveChipText: { fontSize: 13, fontWeight: '600' },

  hintBanner: { borderRadius: Radius.md, padding: 12, marginBottom: 4 },
  hintText:   { fontSize: 12, fontWeight: '500', textAlign: 'center' },

  label:        { fontSize: 12, fontWeight: '500', marginBottom: 6 },
  titleInput:   { borderRadius: Radius.md, borderWidth: 1.5, paddingHorizontal: 14, height: 52, fontSize: 15, fontWeight: '500' },
  contentInput: { borderRadius: Radius.lg, padding: 14, height: 200, fontSize: 14, lineHeight: 22 },
  charCount:    { fontSize: 11, textAlign: 'right', marginTop: 4 },
  btn:          { marginTop: Spacing.sm },
});
