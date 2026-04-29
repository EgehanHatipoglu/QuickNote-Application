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

type Props = NativeStackScreenProps<RootStackParamList, 'AddNote'>;

interface AddNoteScreenProps extends Props {
  onSave: (note: Note) => void;
}

const MAX_CONTENT = 500;

export const AddNoteScreen: React.FC<AddNoteScreenProps> = ({ navigation, onSave }) => {
  const { colors, isDark } = useTheme();
  const [title,    setTitle]    = useState('');
  const [content,  setContent]  = useState('');
  const [category, setCategory] = useState<Note['category']>('Shopping');

  const handleSave = () => {
    if (!title.trim()) { Alert.alert('Missing Title',   'Please give your note a title.'); return; }
    if (!content.trim()) { Alert.alert('Missing Content', 'Please add some content.'); return; }
    onSave({ id: Date.now().toString(), title: title.trim(), content: content.trim(), category, createdAt: new Date() });
    navigation.goBack();
  };

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      Alert.alert('Discard Note?', 'You have unsaved changes. Discard them?', [
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
          <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.bg }]} onPress={handleCancel}>
            <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: colors.text }]}>New Note</Text>
          <TouchableOpacity style={[styles.saveChip, { backgroundColor: colors.primaryLight }]} onPress={handleSave}>
            <Text style={[styles.saveChipText, { color: colors.primary }]}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Category */}
          <Text style={[styles.label, { color: colors.textSub }]}>Category</Text>
          <CategoryChips selected={category} onSelect={setCategory} />

          {/* Title */}
          <Text style={[styles.label, { color: colors.textSub, marginTop: Spacing.md }]}>Title</Text>
          <TextInput
            style={[styles.titleInput, { backgroundColor: colors.bg, borderColor: colors.primary, color: colors.text }]}
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
            placeholder="Write your shopping list, reminders, or anything here..."
            placeholderTextColor={colors.textMuted}
            value={content}
            onChangeText={t => t.length <= MAX_CONTENT && setContent(t)}
            multiline
            textAlignVertical="top"
          />
          <Text style={[styles.charCount, { color: colors.textMuted }, content.length > MAX_CONTENT * 0.9 && { color: colors.accent }]}>
            {content.length} / {MAX_CONTENT}
          </Text>

          {/* Actions */}
          <Button label="💾  Save Note" onPress={handleSave}  style={styles.btn} />
          <Button label="Cancel"        onPress={handleCancel} variant="ghost" style={styles.btn} />
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

  navbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, height: 56, borderBottomWidth: 1,
  },
  backBtn:      { width: 36, height: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  backIcon:     { fontSize: 18, fontWeight: '500' },
  navTitle:     { fontSize: 17, fontWeight: '600' },
  saveChip:     { paddingHorizontal: 16, paddingVertical: 7, borderRadius: Radius.sm },
  saveChipText: { fontSize: 13, fontWeight: '600' },

  label:        { fontSize: 12, fontWeight: '500', marginBottom: 6 },
  titleInput:   { borderRadius: Radius.md, borderWidth: 1.5, paddingHorizontal: 14, height: 52, fontSize: 15, fontWeight: '500' },
  contentInput: { borderRadius: Radius.lg, padding: 14, height: 200, fontSize: 14, lineHeight: 22 },
  charCount:    { fontSize: 11, textAlign: 'right', marginTop: 4 },
  btn:          { marginTop: Spacing.sm },
});
