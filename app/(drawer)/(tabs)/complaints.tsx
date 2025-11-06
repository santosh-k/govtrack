import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';

const COLORS = {
  primary: '#2196F3', // Blue
  background: '#FDFDFD',
  text: '#1A1A1A',
  textSecondary: '#666666',
  white: '#FFFFFF',
};

export default function ComplaintsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <Header title="Complaints" />

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="document-text-outline" size={80} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Complaints Screen</Text>
        <Text style={styles.description}>
          This is a placeholder for the Complaints section.
          {'\n\n'}
          Future features will include viewing, submitting, and tracking complaints.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
