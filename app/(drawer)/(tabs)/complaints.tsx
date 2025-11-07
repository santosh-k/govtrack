import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Header from '@/components/Header';

const COLORS = {
  background: '#F5F5F5',
  cardBackground: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textLight: '#9E9E9E',
  primary: '#2196F3',
  border: '#E0E0E0',
  searchBg: '#F8F8F8',

  // Status colors
  statusOpen: '#F44336',
  statusInProgress: '#2196F3',
  statusResolved: '#4CAF50',
  statusClosed: '#757575',

  // SLA colors
  slaBreached: '#D32F2F',
  slaNearing: '#FF9800',
  slaOnTrack: '#4CAF50',

  // Filter chip colors
  chipActive: '#2196F3',
  chipInactive: '#E0E0E0',
};

interface Complaint {
  id: string;
  category: string;
  department: string;
  location: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  sla: 'Breached' | 'Nearing' | 'On Track';
  createdAt: string;
}

const SAMPLE_COMPLAINTS: Complaint[] = [
  {
    id: 'C-2023-4513',
    category: 'Pothole Repair Request',
    department: 'Roads & Infrastructure - Zone West',
    location: 'Connaught Place, New Delhi',
    status: 'Open',
    sla: 'Breached',
    createdAt: '2023-12-01',
  },
  {
    id: 'C-2023-4514',
    category: 'Street Light Not Working',
    department: 'Electrical Services - Zone North',
    location: 'Karol Bagh Market Road',
    status: 'In Progress',
    sla: 'Nearing',
    createdAt: '2023-12-02',
  },
  {
    id: 'C-2023-4515',
    category: 'Water Supply Issue',
    department: 'Water & Sanitation - Zone East',
    location: 'Laxmi Nagar, Block C',
    status: 'Resolved',
    sla: 'On Track',
    createdAt: '2023-12-03',
  },
  {
    id: 'C-2023-4516',
    category: 'Garbage Collection Delay',
    department: 'Waste Management - Zone South',
    location: 'Greater Kailash Part 2',
    status: 'In Progress',
    sla: 'On Track',
    createdAt: '2023-12-04',
  },
  {
    id: 'C-2023-4517',
    category: 'Illegal Construction Report',
    department: 'Building & Planning - Zone Central',
    location: 'Nehru Place Commercial Complex',
    status: 'Open',
    sla: 'Breached',
    createdAt: '2023-12-05',
  },
  {
    id: 'C-2023-4518',
    category: 'Traffic Signal Malfunction',
    department: 'Traffic Management - Zone West',
    location: 'ITO Crossing, Central Delhi',
    status: 'Closed',
    sla: 'On Track',
    createdAt: '2023-12-06',
  },
  {
    id: 'C-2023-4519',
    category: 'Park Maintenance Required',
    department: 'Parks & Gardens - Zone North',
    location: 'Lodhi Garden, Main Entrance',
    status: 'In Progress',
    sla: 'Nearing',
    createdAt: '2023-12-07',
  },
];

type FilterType = 'All' | 'Open' | 'In Progress' | 'Resolved' | 'Breached';

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

function FilterChip({ label, isActive, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[styles.filterChip, isActive && styles.filterChipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface ComplaintCardProps {
  complaint: Complaint;
  onPress: () => void;
}

function ComplaintCard({ complaint, onPress }: ComplaintCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return COLORS.statusOpen;
      case 'In Progress':
        return COLORS.statusInProgress;
      case 'Resolved':
        return COLORS.statusResolved;
      case 'Closed':
        return COLORS.statusClosed;
      default:
        return COLORS.textSecondary;
    }
  };

  const getSlaColor = (sla: string) => {
    switch (sla) {
      case 'Breached':
        return COLORS.slaBreached;
      case 'Nearing':
        return COLORS.slaNearing;
      case 'On Track':
        return COLORS.slaOnTrack;
      default:
        return COLORS.textSecondary;
    }
  };

  return (
    <TouchableOpacity
      style={styles.complaintCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Top Row - ID and Badges */}
      <View style={styles.cardTopRow}>
        <Text style={styles.complaintId}>ID: {complaint.id}</Text>
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, { backgroundColor: getStatusColor(complaint.status) }]}>
            <Text style={styles.badgeText}>{complaint.status}</Text>
          </View>
          <View style={[styles.badge, styles.slaBadge, { backgroundColor: getSlaColor(complaint.sla) }]}>
            <Text style={styles.badgeText}>SLA: {complaint.sla}</Text>
          </View>
        </View>
      </View>

      {/* Middle Section - Details */}
      <View style={styles.cardMiddleSection}>
        <Text style={styles.complaintCategory} numberOfLines={2}>
          {complaint.category}
        </Text>
        <Text style={styles.complaintDepartment} numberOfLines={1}>
          {complaint.department}
        </Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color={COLORS.primary} />
          <Text style={styles.complaintLocation} numberOfLines={1}>
            {complaint.location}
          </Text>
        </View>
      </View>

      {/* Bottom Section - Action Button */}
      <View style={styles.cardBottomSection}>
        <TouchableOpacity style={styles.viewDetailsButton} onPress={onPress} activeOpacity={0.8}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function ComplaintsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  // Filter and search logic
  const filteredComplaints = useMemo(() => {
    let filtered = SAMPLE_COMPLAINTS;

    // Apply filter
    if (activeFilter !== 'All') {
      if (activeFilter === 'Breached') {
        filtered = filtered.filter((c) => c.sla === 'Breached');
      } else {
        filtered = filtered.filter((c) => c.status === activeFilter);
      }
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.id.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query) ||
          c.department.toLowerCase().includes(query) ||
          c.location.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, activeFilter]);

  const handleComplaintPress = (complaint: Complaint) => {
    router.push({
      pathname: '/(drawer)/complaint-details',
      params: { id: complaint.id },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cardBackground} />
      <Header title="Complaints" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by ID or Category..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.6}>
              <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <FilterChip
            label="All"
            isActive={activeFilter === 'All'}
            onPress={() => setActiveFilter('All')}
          />
          <FilterChip
            label="Status: Open"
            isActive={activeFilter === 'Open'}
            onPress={() => setActiveFilter('Open')}
          />
          <FilterChip
            label="Status: In Progress"
            isActive={activeFilter === 'In Progress'}
            onPress={() => setActiveFilter('In Progress')}
          />
          <FilterChip
            label="Status: Resolved"
            isActive={activeFilter === 'Resolved'}
            onPress={() => setActiveFilter('Resolved')}
          />
          <FilterChip
            label="SLA: Breached"
            isActive={activeFilter === 'Breached'}
            onPress={() => setActiveFilter('Breached')}
          />
        </ScrollView>
      </View>

      {/* Complaints List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onPress={() => handleComplaintPress(complaint)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={80} color={COLORS.textLight} />
            <Text style={styles.emptyStateText}>No complaints found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.searchBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 0,
  },
  filterContainer: {
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 12,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.chipInactive,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.chipActive,
    borderColor: COLORS.chipActive,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: COLORS.cardBackground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  complaintCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  complaintId: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  slaBadge: {
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.cardBackground,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  cardMiddleSection: {
    marginBottom: 16,
  },
  complaintCategory: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  complaintDepartment: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  complaintLocation: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textSecondary,
    flex: 1,
  },
  cardBottomSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});
