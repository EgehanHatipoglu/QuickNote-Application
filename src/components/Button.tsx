import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet,
  ViewStyle, TextStyle, ActivityIndicator,
} from 'react-native';
import { Radius, Shadow } from '../theme';
import { useTheme } from '../context/ThemeContext';

type Variant = 'primary' | 'ghost' | 'danger';

interface ButtonProps {
  label:    string;
  onPress:  () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?:  boolean;
  style?:    ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label, onPress, variant = 'primary', disabled = false, loading = false, style,
}) => {
  const { colors, isDark } = useTheme();

  const containerStyles: ViewStyle[] = [styles.base];
  const textStyles: TextStyle[]      = [styles.baseText];

  switch (variant) {
    case 'primary':
      containerStyles.push({ backgroundColor: colors.primary, ...(isDark ? {} : Shadow.button) } as ViewStyle);
      textStyles.push({ color: '#fff' });
      break;
    case 'ghost':
      containerStyles.push({ backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border });
      textStyles.push({ color: colors.textSub, fontWeight: '500' as const });
      break;
    case 'danger':
      containerStyles.push({ backgroundColor: colors.dangerBg });
      textStyles.push({ color: colors.accent, fontWeight: '600' as const });
      break;
  }

  if (disabled) containerStyles.push(styles.disabled);
  if (style)    containerStyles.push(style as ViewStyle);

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={onPress}
      activeOpacity={0.82}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.primary} />
      ) : (
        <Text style={textStyles}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base:     { height: 52, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  disabled: { opacity: 0.45 },
  baseText: { fontSize: 15, fontWeight: '600' as const },
});
