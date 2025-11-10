import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { DrawerActions, useNavigation } from '@react-navigation/native';

const COLORS = {
  background: '#F8F9FA',
  cardBackground: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textLight: '#9E9E9E',
  primary: '#FF9800',
  border: '#E8E8E8',

  // Status accent colors
  orange: '#FF9800',
  blue: '#2196F3',
  green: '#4CAF50',
  purple: '#9C27B0',
  teal: '#00ACC1',
  grey: '#757575',
  red: '#F44336',
};

type QuickFilter = 'today' | 'week' | 'month' | 'custom';

interface StatCardProps {
  title: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  accentColor: string;
  filterType: string;
  onPress: () => void;
}

function StatCard({ title, value, icon, accentColor, onPress }: StatCardProps) {
  return (
    <TouchableOpacity
      style={styles.statCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Colored left accent bar */}
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

      <View style={styles.cardContent}>
        {/* Icon */}
        <View style={[styles.iconWrapper, { backgroundColor: `${accentColor}10` }]}>
          <Ionicons name={icon} size={32} color={accentColor} />
        </View>

        {/* Number and Label */}
        <View style={styles.statsInfo}>
          <Text style={styles.statNumber}>{value.toLocaleString()}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ComplaintDashboardScreen() {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState<QuickFilter>('month');
  const [dateRange, setDateRange] = useState('01 Jan - 31 Jan');

  // Simulated stats - would come from API based on selected filter
  const stats = {
    total: 1247,
    pending: 342,
    inProgress: 156,
    completed: 689,
    assignedByYou: 89,
    completedByYou: 54,
    closed: 60,
  };

  const handleFilterChange = (filter: QuickFilter) => {
    if (filter === 'custom') {
      handleCustomDateRange();
      return;
    }

    setSelectedFilter(filter);
    // Update date range display based on filter
    const today = new Date();
    switch (filter) {
      case 'today':
        const todayStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        setDateRange(todayStr);
        break;
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        setDateRange(`${weekStart.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${weekEnd.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`);
        break;
      case 'month':
        setDateRange('01 Jan - 31 Jan');
        break;
    }
  };

  const handleStatCardPress = (filterType: string, title: string) => {
    // Navigate to complaints list with pre-applied filter and title
    router.push({
      pathname: '/complaints-list',
      params: {
        filter: filterType,
        title: title,
        fromDashboard: 'true',
      },
    });
  };

  const handleCustomDateRange = () => {
    // TODO: Open date picker modal
    console.log('Open date picker');
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cardBackground} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={openDrawer}
          activeOpacity={0.6}
        >
          <Ionicons name="menu" size={28} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Complaints Dashboard</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Horizontal Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterPillsContainer}
        style={styles.filterPillsScroll}
      >
        <TouchableOpacity
          style={[
            styles.filterPill,
            selectedFilter === 'today' && styles.filterPillActive,
          ]}
          onPress={() => handleFilterChange('today')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterPillText,
              selectedFilter === 'today' && styles.filterPillTextActive,
            ]}
          >
            Today
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterPill,
            selectedFilter === 'week' && styles.filterPillActive,
          ]}
          onPress={() => handleFilterChange('week')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterPillText,
              selectedFilter === 'week' && styles.filterPillTextActive,
            ]}
          >
            This Week
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterPill,
            selectedFilter === 'month' && styles.filterPillActive,
          ]}
          onPress={() => handleFilterChange('month')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterPillText,
              selectedFilter === 'month' && styles.filterPillTextActive,
            ]}
          >
            This Month
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, styles.customRangePill]}
          onPress={() => handleFilterChange('custom')}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={18} color={COLORS.textSecondary} />
          <Text style={styles.filterPillText}>{dateRange}</Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Complaints"
            value={stats.total}
            icon="documents-outline"
            accentColor={COLORS.orange}
            filterType="all"
            onPress={() => handleStatCardPress('all', 'All Complaints')}
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            icon="time-outline"
            accentColor={COLORS.orange}
            filterType="pending"
            onPress={() => handleStatCardPress('pending', 'Pending Complaints')}
          />

          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon="sync-outline"
            accentColor={COLORS.blue}
            filterType="inProgress"
            onPress={() => handleStatCardPress('inProgress', 'In Progress Complaints')}
          />

          <StatCard
            title="Completed"
            value={stats.completed}
            icon="checkmark-circle-outline"
            accentColor={COLORS.green}
            filterType="completed"
            onPress={() => handleStatCardPress('completed', 'Completed Complaints')}
          />

          <StatCard
            title="Assigned by You"
            value={stats.assignedByYou}
            icon="person-add-outline"
            accentColor={COLORS.purple}
            filterType="assignedByYou"
            onPress={() => handleStatCardPress('assignedByYou', 'Assigned by You')}
          />

          <StatCard
            title="Completed by You"
            value={stats.completedByYou}
            icon="checkmark-done-outline"
            accentColor={COLORS.teal}
            filterType="completedByYou"
            onPress={() => handleStatCardPress('completedByYou', 'Completed by You')}
          />

          <StatCard
            title="Closed"
            value={stats.closed}
            icon="close-circle-outline"
            accentColor={COLORS.grey}
            filterType="closed"
            onPress={() => handleStatCardPress('closed', 'Closed Complaints')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  menuButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  headerSpacer: {
    width: 44,
  },
  filterPillsScroll: {
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterPillsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  filterPill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: COLORS.orange,
    borderColor: COLORS.orange,
  },
  customRangePill: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterPillTextActive: {
    color: COLORS.cardBackground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    width: '47%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  accentBar: {
    width: 6,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  cardContent: {
    paddingLeft: 18,
    paddingRight: 16,
    paddingVertical: 20,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsInfo: {
    gap: 4,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -1,
    lineHeight: 42,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
