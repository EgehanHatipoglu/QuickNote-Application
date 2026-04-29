import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Alert,
} from 'react-native';
import { Radius, Shadow, Spacing } from '../theme';
import { Note } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NoteCardProps {
  note:      Note;
  onPress:   () => void;
  onDelete?: (id: string) => void;
}

const CAT_COLORS = (c: ReturnType<typeof useTheme>['colors']): Record<Note['category'], string> => ({
  Shopping: c.primary,
  List:     c.accent,
  Health:   c.success,
  Other:    c.warning,
});

function formatDate(date: Date): string {
  const now  = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  if (diff === 1) return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  return `${diff} days ago`;
}

const SWIPE_THRESHOLD  = 72;   // px to reveal the panel
const DELETE_WIDTH     = 80;   // width of delete panel
const DISMISS_DISTANCE = 400;  // fly-out distance for confirmed delete

export const NoteCard: React.FC<NoteCardProps> = ({ note, onPress, onDelete }) => {
  const { colors, isDark } = useTheme();
  const tagColor = CAT_COLORS(colors)[note.category];

  // ── Animation state ────────────────────────────────────────────
  const translateX = useRef(new Animated.Value(0)).current;
  const isRevealed = useRef(false);

  // ── Snap helpers ───────────────────────────────────────────────
  const snapOpen  = () => Animated.spring(translateX, { toValue: -DELETE_WIDTH, useNativeDriver: true, overshootClamping: true }).start(() => { isRevealed.current = true; });
  const snapClose = () => Animated.spring(translateX, { toValue: 0,             useNativeDriver: true, overshootClamping: true }).start(() => { isRevealed.current = false; });

  // ── Confirmed delete — fly card out then call callback ─────────
  const confirmDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel', onPress: snapClose },
        {
          text: 'Delete', style: 'destructive',
          onPress: () => {
            Animated.timing(translateX, {
              toValue: -DISMISS_DISTANCE,
              duration: 240,
              useNativeDriver: true,
            }).start(() => onDelete?.(note.id));
          },
        },
      ],
    );
  };

  // ── PanResponder ───────────────────────────────────────────────
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 6 && Math.abs(gs.dy) < Math.abs(gs.dx),

      onPanResponderMove: (_, gs) => {
        if (!onDelete) return;
        const base = isRevealed.current ? -DELETE_WIDTH : 0;
        const next = base + gs.dx;
        // Clamp: don't slide right of origin, don't slide too far left
        translateX.setValue(Math.min(0, Math.max(-DELETE_WIDTH - 20, next)));
      },

      onPanResponderRelease: (_, gs) => {
        if (!onDelete) return;
        if (gs.dx < -SWIPE_THRESHOLD) {
          snapOpen();
        } else {
          snapClose();
        }
      },

      onPanResponderTerminate: () => snapClose(),
    }),
  ).current;

  // ── Swipe-button opacity hint ──────────────────────────────────
  const deleteOpacity = translateX.interpolate({
    inputRange:  [-DELETE_WIDTH, -10, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const cardShadow = isDark ? {} : Shadow.card;

  return (
    <View style={styles.outer}>
      {/* ── Delete panel (sits behind card) ── */}
      {onDelete && (
        <Animated.View
          style={[styles.deletePanel, { backgroundColor: '#FF4060', opacity: deleteOpacity }]}
        >
          <TouchableOpacity style={styles.deletePanelBtn} onPress={confirmDelete}>
            <Text style={styles.deletePanelIcon}>🗑️</Text>
            <Text style={styles.deletePanelLabel}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* ── Swipeable card ── */}
      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...(onDelete ? pan.panHandlers : {})}
      >
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.surface }, cardShadow]}
          onPress={() => {
            if (isRevealed.current) { snapClose(); return; }
            onPress();
          }}
          activeOpacity={0.85}
        >
          {/* Colored left tag */}
          <View style={[styles.tag, { backgroundColor: tagColor }]} />

          {/* Content */}
          <View style={styles.content}>
            <Text style={[styles.title,   { color: colors.text    }]} numberOfLines={1}>{note.title}</Text>
            <Text style={[styles.preview, { color: colors.textSub }]} numberOfLines={1}>{note.content}</Text>
            <Text style={[styles.time,    { color: colors.textMuted }]}>{formatDate(note.createdAt)}</Text>
          </View>

          {/* Arrow */}
          <View style={[styles.arrowWrap, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.arrow, { color: colors.primary }]}>›</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    marginHorizontal: Spacing.md,
    marginBottom: 12,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  deletePanel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: DELETE_WIDTH,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deletePanelBtn: { alignItems: 'center', gap: 2 },
  deletePanelIcon:  { fontSize: 20 },
  deletePanelLabel: { fontSize: 11, color: '#fff', fontWeight: '700' },

  card: {
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  tag: { width: 4, height: 52, borderRadius: 4, marginRight: 12 },
  content: { flex: 1, gap: 4 },
  title:   { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  preview: { fontSize: 13, marginBottom: 2 },
  time:    { fontSize: 11 },
  arrowWrap: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  arrow: { fontSize: 18, fontWeight: '700', lineHeight: 22 },
});
