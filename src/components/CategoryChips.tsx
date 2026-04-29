import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Radius } from '../theme';
import { Note } from '../types';
import { useTheme } from '../context/ThemeContext';

const CATEGORIES: { label: string; emoji: string; value: Note['category'] }[] = [
  { label: 'Shopping', emoji: '🛒', value: 'Shopping' },
  { label: 'List',     emoji: '📋', value: 'List'     },
  { label: 'Health',   emoji: '💊', value: 'Health'   },
  { label: 'Other',    emoji: '📌', value: 'Other'    },
];

interface CategoryChipsProps {
  selected: Note['category'];
  onSelect: (cat: Note['category']) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({ selected, onSelect }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {CATEGORIES.map(cat => {
        const active = selected === cat.value;
        return (
          <TouchableOpacity
            key={cat.value}
            style={[
              styles.chip,
              { backgroundColor: active ? colors.primary : colors.bg },
              !active && { borderWidth: 1, borderColor: colors.border },
            ]}
            onPress={() => onSelect(cat.value)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, { color: active ? '#fff' : colors.textSub }]}>
              {cat.emoji} {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:     { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full },
  chipText: { fontSize: 12, fontWeight: '500' },
});
