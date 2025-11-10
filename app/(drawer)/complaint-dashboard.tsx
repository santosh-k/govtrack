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
  background: '#F5F5F5',
  cardBackground: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textLight: '#9E9E9E',
  primary: '#FF9800',
  border: '#E0E0E0',
  divider: '#EEEEEE',

  // Status colors
  red: '#F44336',
  orange: '#FF9800',
  blue: '#2196F3',
  green: '#4CAF50',
  purple: '#9C27B0',
  teal: '#009688',
  grey: '#757575',
};

type QuickFilter = 'today' | 'week' | 'month';

interface StatCardProps {
  title: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  filterType: string;
  onPress: () => void;
}

function StatCard({ title, value, icon, color, onPress }: StatCardProps) {
  return (
    <TouchableOpacity
      style={styles.statCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.statValue}>{value.toLocaleString()}</Text>
      <Text style={styles.statLabel}>{title}</Text>
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

  const handleStatCardPress = (filterType: string) => {
    // Navigate to complaints list with pre-applied filter
    router.push({
      pathname: '/complaints-list',
      params: { filter: filterType },
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Bar */}
        <View style={styles.filterBar}>
          {/* Quick Filters */}
          <View style={styles.quickFilters}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedFilter === 'today' && styles.filterChipActive,
              ]}
              onPress={() => handleFilterChange('today')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === 'today' && styles.filterChipTextActive,
                ]}
              >
                Today
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedFilter === 'week' && styles.filterChipActive,
              ]}
              onPress={() => handleFilterChange('week')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === 'week' && styles.filterChipTextActive,
                ]}
              >
                This Week
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedFilter === 'month' && styles.filterChipActive,
              ]}
              onPress={() => handleFilterChange('month')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === 'month' && styles.filterChipTextActive,
                ]}
              >
                This Month
              </Text>
            </TouchableOpacity>
          </View>

          {/* Custom Date Range Button */}
          <TouchableOpacity
            style={styles.dateRangeButton}
            onPress={handleCustomDateRange}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.dateRangeText}>{dateRange}</Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Complaints"
            value={stats.total}
            icon="documents-outline"
            color={COLORS.primary}
            filterType="all"
            onPress={() => handleStatCardPress('all')}
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            icon="time-outline"
            color={COLORS.orange}
            filterType="pending"
            onPress={() => handleStatCardPress('pending')}
          />

          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon="sync-outline"
            color={COLORS.blue}
            filterType="inProgress"
            onPress={() => handleStatCardPress('inProgress')}
          />

          <StatCard
            title="Completed"
            value={stats.completed}
            icon="checkmark-circle-outline"
            color={COLORS.green}
            filterType="completed"
            onPress={() => handleStatCardPress('completed')}
          />

          <StatCard
            title="Assigned by You"
            value={stats.assignedByYou}
            icon="person-add-outline"
            color={COLORS.purple}
            filterType="assignedByYou"
            onPress={() => handleStatCardPress('assignedByYou')}
          />

          <StatCard
            title="Completed by You"
            value={stats.completedByYou}
            icon="checkmark-done-outline"
            color={COLORS.teal}
            filterType="completedByYou"
            onPress={() => handleStatCardPress('completedByYou')}
          />

          <StatCard
            title="Closed"
            value={stats.closed}
            icon="close-circle-outline"
            color={COLORS.grey}
            filterType="closed"
            onPress={() => handleStatCardPress('closed')}
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
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  menuButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  filterBar: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  quickFilters: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: COLORS.cardBackground,
  },
  dateRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateRangeText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    width: '47%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
