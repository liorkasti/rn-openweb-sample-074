import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import {APP_METADATA, getArchitectureInfo} from '../config/metadata';
// Real SDK components
import {
  OpenWeb,
  OpenWebConversation,
  OpenWebPreConversation,
} from 'react-native-openweb-sdk';

export const HomeScreen = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isConversationVisible, setIsConversationVisible] = useState(false);
  // SDK data comes from these inputs
  const [spotId, setSpotId] = useState('sp_eCIlROSD');
  const [postId, setPostId] = useState('sdk1');

  // Initialize SDK with spotId
  React.useEffect(() => {
    if (spotId) {
      OpenWeb.manager.setSpotId(spotId);
    }
  }, [spotId]);

  const handlePreConversationTap = () => {
    setIsConversationVisible(true);
  };

  const handleCloseConversation = () => {
    setIsConversationVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <Text style={styles.title}>OpenWeb SDK POC</Text>
          <Text style={styles.subtitle}>React Native 0.74.3</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OpenWeb Conversation</Text>
          <Text style={styles.sectionText}>
            This POC demonstrates OpenWeb SDK integration with React Native
            0.74.3, supporting both Old (Paper) and New (Fabric/TurboModules)
            architectures.
          </Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Spot ID</Text>
          <TextInput
            style={styles.input}
            value={spotId}
            onChangeText={setSpotId}
            placeholder="Enter Spot ID"
            placeholderTextColor="#999"
          />
          <Text style={styles.inputLabel}>Post ID</Text>
          <TextInput
            style={styles.input}
            value={postId}
            onChangeText={setPostId}
            placeholder="Enter Post ID"
            placeholderTextColor="#999"
          />
        </View>

        <OpenWebPreConversation
          postId={postId}
          style={styles.preConversation}
          onOpenConversationFlow={() => handlePreConversationTap()}
        />

        <View style={styles.metadata}>
          <Text style={styles.metadataTitle}>App Metadata</Text>
          <Text style={styles.metadataText}>
            Version: {APP_METADATA.version} ({APP_METADATA.build})
          </Text>
          <Text style={styles.metadataText}>
            RN Version: {APP_METADATA.rnVersion}
          </Text>
          <Text style={styles.metadataText}>Platform: {Platform.OS}</Text>
          <Text style={styles.metadataText}>
            Architecture: {getArchitectureInfo()}
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={isConversationVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseConversation}>
        <OpenWebConversation
          postId={postId}
          style={{flex: 1}}
          onConversationDismissed={handleCloseConversation}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E8F4FF',
  },
  metadata: {
    margin: 16,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  metadataTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  metadataText: {
    fontSize: 14,
    marginBottom: 6,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  section: {
    margin: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  inputSection: {
    margin: 16,
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#333',
  },
  preConversation: {
    margin: 16,
    minHeight: 200,
  },
});
