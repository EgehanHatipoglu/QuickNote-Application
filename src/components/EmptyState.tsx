import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Radius, Spacing } from '../theme';
import { useTheme } from '../context/ThemeContext';

export const EmptyState: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Illustration */}
      <View style={[styles.circle, { backgroundColor: colors.primaryLight }]}>
        <View style={[styles.notebook, { backgroundColor: colors.primary }]}>
          <View style={styles.line} />
          <View style={[styles.line, { width: 28 }]} />
          <View style={[styles.line, { width: 32 }]} />
        </View>
      </View>

      <Text style={[styles.title,    { color: colors.text    }]}>No Notes Yet</Text>
      <Text style={[styles.subtitle, { color: colors.textSub }]}>
        Add your shopping notes here.{'\n'}Tap{' '}
        <Text style={[styles.plus, { color: colors.primary }]}>+</Text>
        {' '}to get started!
      </Text>

      <View style={[styles.hintChip, { backgroundColor: colors.primaryLight }]}>
        <Text style={[styles.hintText, { color: colors.primary }]}>Create your first note →</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingTop: 40, paddingHorizontal: Spacing.xl,
  },
  circle: {
    width: 130, height: 130, borderRadius: 65,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg,
  },
  notebook: {
    width: 56, height: 64, borderRadius: 8,
    paddingHorizontal: 10, justifyContent: 'center', gap: 8,
  },
  line: { width: 36, height: 4, backgroundColor: '#fff', borderRadius: 2 },
  title:    { fontSize: 22, fontWeight: '600', marginBottom: Spacing.sm, textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.lg },
  plus:     { fontWeight: '700', fontSize: 16 },
  hintChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: Radius.full },
  hintText: { fontSize: 13, fontWeight: '500' },
});
