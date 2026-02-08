import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import {OpenWeb} from 'react-native-openweb-sdk';
import {Colors} from '../theme/colors';
import {APP_METADATA, getArchitectureInfo} from '../config/metadata';

// ── Types for customization options ────────────────────────

type ThemeOption = 'system' | 'light' | 'dark';
type SortOption = 'BEST' | 'NEWEST' | 'OLDEST';
type ActionColorOption = 'DEFAULT' | 'BRAND_COLOR';
type ActionFontOption = 'DEFAULT' | 'SEMI_BOLD';

const BRAND_COLOR_PRESETS = [
  {label: 'Blue', light: '#4A90E2', dark: '#5B9FEF'},
  {label: 'Green', light: '#4CAF50', dark: '#66BB6A'},
  {label: 'Red', light: '#F44336', dark: '#EF5350'},
  {label: 'Orange', light: '#FF9800', dark: '#FFA726'},
  {label: 'Purple', light: '#9C27B0', dark: '#AB47BC'},
  {label: 'Teal', light: '#009688', dark: '#26A69A'},
];

// ── Props ──────────────────────────────────────────────────

interface SettingsPanelProps {
  visible: boolean;
  onClose: () => void;
  spotId: string;
  postId: string;
  onSpotIdChange: (id: string) => void;
  onPostIdChange: (id: string) => void;
}

// ── Component ──────────────────────────────────────────────

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  visible,
  onClose,
  spotId,
  postId,
  onSpotIdChange,
  onPostIdChange,
}) => {
  const [themeMode, setThemeMode] = useState<ThemeOption>('system');
  const [sortOption, setSortOption] = useState<SortOption>('BEST');
  const [actionColor, setActionColor] = useState<ActionColorOption>('DEFAULT');
  const [actionFont, setActionFont] = useState<ActionFontOption>('DEFAULT');
  const [selectedBrandColor, setSelectedBrandColor] = useState<number | null>(
    null,
  );

  const customizations = OpenWeb.manager.customizations;

  // ── Theme ──

  const applyTheme = useCallback(
    (mode: ThemeOption) => {
      setThemeMode(mode);
      try {
        if (mode === 'system') {
          customizations.setThemeEnforcement({type: 'none'});
        } else {
          customizations.setThemeEnforcement({
            type: 'theme',
            theme: {type: mode},
          });
        }
      } catch (e: any) {
        console.warn('[Settings] Theme error:', e?.message);
      }
    },
    [customizations],
  );

  // ── Sorting ──

  const applySort = useCallback(
    (option: SortOption) => {
      setSortOption(option);
      try {
        customizations.setSortingInitialOption({
          type: 'useSortOption',
          sortOption: {type: option},
        });
      } catch (e: any) {
        console.warn('[Settings] Sort error:', e?.message);
      }
    },
    [customizations],
  );

  // ── Comment Actions ──

  const applyActionColor = useCallback(
    (color: ActionColorOption) => {
      setActionColor(color);
      try {
        customizations.setCommentActionsColor({type: color});
      } catch (e: any) {
        console.warn('[Settings] Action color error:', e?.message);
      }
    },
    [customizations],
  );

  const applyActionFont = useCallback(
    (font: ActionFontOption) => {
      setActionFont(font);
      try {
        customizations.setCommentActionsFontStyle({type: font});
      } catch (e: any) {
        console.warn('[Settings] Action font error:', e?.message);
      }
    },
    [customizations],
  );

  // ── Brand Color ──

  const applyBrandColor = useCallback(
    (index: number) => {
      setSelectedBrandColor(index);
      const preset = BRAND_COLOR_PRESETS[index];
      try {
        customizations.setCustomizedTheme({
          brandColor: {lightColor: preset.light, darkColor: preset.dark},
        });
        Alert.alert(
          'Brand Color Applied',
          `${preset.label} brand color set. Reload the conversation to see changes.`,
        );
      } catch (e: any) {
        console.warn('[Settings] Brand color error:', e?.message);
      }
    },
    [customizations],
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* SDK Configuration */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SDK Configuration</Text>

            <Text style={styles.inputLabel}>Spot ID</Text>
            <TextInput
              style={styles.input}
              value={spotId}
              onChangeText={onSpotIdChange}
              placeholder="Enter Spot ID"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.inputLabel}>Post ID</Text>
            <TextInput
              style={styles.input}
              value={postId}
              onChangeText={onPostIdChange}
              placeholder="Enter Post ID"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Theme */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Theme</Text>
            <Text style={styles.sectionDescription}>
              Controls light/dark appearance of SDK views.
            </Text>
            <SegmentedControl<ThemeOption>
              options={[
                {value: 'system', label: 'System'},
                {value: 'light', label: 'Light'},
                {value: 'dark', label: 'Dark'},
              ]}
              selected={themeMode}
              onSelect={applyTheme}
            />
          </View>

          {/* Sorting */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Default Sort Order</Text>
            <Text style={styles.sectionDescription}>
              Initial sort strategy for comment threads.
            </Text>
            <SegmentedControl<SortOption>
              options={[
                {value: 'BEST', label: 'Best'},
                {value: 'NEWEST', label: 'Newest'},
                {value: 'OLDEST', label: 'Oldest'},
              ]}
              selected={sortOption}
              onSelect={applySort}
            />
          </View>

          {/* Comment Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comment Actions</Text>

            <Text style={styles.optionLabel}>Button Color</Text>
            <SegmentedControl<ActionColorOption>
              options={[
                {value: 'DEFAULT', label: 'Default'},
                {value: 'BRAND_COLOR', label: 'Brand Color'},
              ]}
              selected={actionColor}
              onSelect={applyActionColor}
            />

            <Text style={[styles.optionLabel, {marginTop: 12}]}>
              Button Font
            </Text>
            <SegmentedControl<ActionFontOption>
              options={[
                {value: 'DEFAULT', label: 'Default'},
                {value: 'SEMI_BOLD', label: 'Semi Bold'},
              ]}
              selected={actionFont}
              onSelect={applyActionFont}
            />
          </View>

          {/* Brand Color */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Brand Color</Text>
            <Text style={styles.sectionDescription}>
              Sets the primary brand color used in SDK UI elements.
            </Text>
            <View style={styles.colorGrid}>
              {BRAND_COLOR_PRESETS.map((preset, index) => (
                <TouchableOpacity
                  key={preset.label}
                  style={[
                    styles.colorSwatch,
                    {backgroundColor: preset.light},
                    selectedBrandColor === index && styles.colorSwatchSelected,
                  ]}
                  onPress={() => applyBrandColor(index)}>
                  <Text style={styles.colorSwatchLabel}>{preset.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* App Metadata */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Information</Text>
            <View style={styles.metadataCard}>
              <MetadataRow
                label="Version"
                value={`${APP_METADATA.version} (${APP_METADATA.build})`}
              />
              <MetadataRow label="RN Version" value={APP_METADATA.rnVersion} />
              <MetadataRow label="Platform" value={Platform.OS} />
              <MetadataRow label="Architecture" value={getArchitectureInfo()} />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

// ── Reusable Sub-components ────────────────────────────────

interface SegmentedOption<T> {
  value: T;
  label: string;
}

function SegmentedControl<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: SegmentedOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  return (
    <View style={styles.segmented}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt.value}
          style={[
            styles.segmentedItem,
            selected === opt.value && styles.segmentedItemActive,
          ]}
          onPress={() => onSelect(opt.value)}>
          <Text
            style={[
              styles.segmentedLabel,
              selected === opt.value && styles.segmentedLabelActive,
            ]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const MetadataRow: React.FC<{label: string; value: string}> = ({
  label,
  value,
}) => (
  <View style={styles.metadataRow}>
    <Text style={styles.metadataLabel}>{label}</Text>
    <Text style={styles.metadataValue}>{value}</Text>
  </View>
);

// ── Styles ─────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  closeButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  closeText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 10,
    lineHeight: 18,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: Colors.surfaceAlt,
    color: Colors.text,
  },

  // Segmented control
  segmented: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 3,
  },
  segmentedItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentedItemActive: {
    backgroundColor: Colors.primary,
  },
  segmentedLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  segmentedLabelActive: {
    color: Colors.white,
    fontWeight: '600',
  },

  // Color swatches
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorSwatch: {
    width: 72,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: Colors.text,
  },
  colorSwatchLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },

  // Metadata
  metadataCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  metadataLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  metadataValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
