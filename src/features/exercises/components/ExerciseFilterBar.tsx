import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { AppInput } from '@/components/ui/AppInput';
import {
  ExerciseCategory,
  ExerciseEquipment,
  ExerciseDifficulty,
  ExerciseFilterOptions,
} from '@/domain/models/exercise.model';

interface ExerciseFilterBarProps {
  filters: ExerciseFilterOptions;
  onFilterChange: (filters: ExerciseFilterOptions) => void;
}

export const ExerciseFilterBar: React.FC<ExerciseFilterBarProps> = ({
  filters,
  onFilterChange,
}) => {
  const categories: { id: ExerciseCategory | 'all'; label: string }[] = [
    { id: 'no_equipment', label: 'No Equipment' },
    { id: 'push', label: 'Push' },
    { id: 'pull', label: 'Pull' },
    { id: 'legs', label: 'Legs' },
    { id: 'core', label: 'Core' },
    { id: 'skills', label: 'Skills' },
    { id: 'all', label: 'All' },
  ];

  const equipmentOptions: { id: ExerciseEquipment | 'all'; label: string }[] = [
    { id: 'none', label: 'No Equipment (Default)' },
    { id: 'pull_up_bar', label: 'Pull-up Bar' },
    { id: 'all', label: 'All Equipment' },
  ];

  const difficulties: { id: ExerciseDifficulty | 'all'; label: string }[] = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ];

  const currentCategory = filters.category ?? 'no_equipment';
  const currentEquipment = filters.equipment ?? 'none';
  const currentDifficulty = filters.difficulty ?? 'all';

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <AppInput
        placeholder="Search exercises, cues, or target muscles..."
        value={filters.searchQuery ?? ''}
        onChangeText={(text) => onFilterChange({ ...filters, searchQuery: text })}
        testID="exercise-search-input"
        containerStyle={styles.searchContainer}
      />

      {/* Equipment Selector */}
      <View style={styles.sectionHeader}>
        <AppText variant="caption" color={colors.textSecondary} style={styles.sectionTitle}>
          EQUIPMENT FILTER
        </AppText>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {equipmentOptions.map((opt) => {
          const isSelected = currentEquipment === opt.id;
          return (
            <Pressable
              key={opt.id}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onFilterChange({ ...filters, equipment: opt.id })}
              testID={`equipment-filter-${opt.id}`}
            >
              <AppText
                variant="caption"
                color={isSelected ? '#FFFFFF' : colors.text}
                style={[styles.chipText, isSelected && styles.chipTextSelected]}
              >
                {opt.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Category Selector */}
      <View style={styles.sectionHeader}>
        <AppText variant="caption" color={colors.textSecondary} style={styles.sectionTitle}>
          CATEGORIES
        </AppText>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {categories.map((cat) => {
          const isSelected = currentCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              style={[
                styles.categoryChip,
                isSelected && styles.categoryChipSelected,
                cat.id === 'no_equipment' && !isSelected && styles.categoryChipNoEquipment,
              ]}
              onPress={() => onFilterChange({ ...filters, category: cat.id })}
              testID={`category-filter-${cat.id}`}
            >
              <AppText
                variant="caption"
                color={isSelected ? '#FFFFFF' : cat.id === 'no_equipment' ? colors.primaryDeep : colors.text}
                style={[styles.chipText, isSelected && styles.chipTextSelected]}
              >
                {cat.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Difficulty Filter */}
      <View style={styles.sectionHeader}>
        <AppText variant="caption" color={colors.textSecondary} style={styles.sectionTitle}>
          DIFFICULTY
        </AppText>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {difficulties.map((diff) => {
          const isSelected = currentDifficulty === diff.id;
          return (
            <Pressable
              key={diff.id}
              style={[styles.smallChip, isSelected && styles.smallChipSelected]}
              onPress={() => onFilterChange({ ...filters, difficulty: diff.id })}
              testID={`difficulty-filter-${diff.id}`}
            >
              <AppText
                variant="caption"
                color={isSelected ? '#FFFFFF' : colors.textSecondary}
                style={[styles.chipText, isSelected && styles.chipTextSelected]}
              >
                {diff.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  searchContainer: {
    marginBottom: spacing.xs,
  },
  sectionHeader: {
    marginTop: spacing.xs,
    marginBottom: spacing.xxs,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  chipRow: {
    gap: spacing.xs,
    paddingVertical: 2,
    marginBottom: spacing.xs,
  },
  chip: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary, // #8B70D6
    borderColor: colors.primary,
  },
  categoryChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipNoEquipment: {
    backgroundColor: colors.primaryLavender, // Lavender accent for No Equipment
    borderColor: colors.primary,
  },
  categoryChipSelected: {
    backgroundColor: colors.primaryDeep, // #6E55B8
    borderColor: colors.primaryDeep,
  },
  smallChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  smallChipSelected: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  chipText: {
    fontWeight: '600',
    fontSize: 12,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
