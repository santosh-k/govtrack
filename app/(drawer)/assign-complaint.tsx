import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const COLORS = {
  background: '#F5F5F5',
  cardBackground: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textLight: '#9E9E9E',
  primary: '#FF9800',
  success: '#4CAF50',
  border: '#E0E0E0',
  divider: '#EEEEEE',
  disabled: '#F5F5F5',
  disabledText: '#BDBDBD',
};

// Mock hierarchical data
const MOCK_DATA = {
  circles: [
    { id: '1', name: 'North Delhi Circle' },
    { id: '2', name: 'South Delhi Circle' },
    { id: '3', name: 'East Delhi Circle' },
  ],
  divisions: {
    '1': [
      { id: '1-1', name: 'Civil Lines Division', circleId: '1' },
      { id: '1-2', name: 'Karol Bagh Division', circleId: '1' },
    ],
    '2': [
      { id: '2-1', name: 'Saket Division', circleId: '2' },
      { id: '2-2', name: 'Defence Colony Division', circleId: '2' },
    ],
    '3': [
      { id: '3-1', name: 'Patparganj Division', circleId: '3' },
      { id: '3-2', name: 'Mayur Vihar Division', circleId: '3' },
    ],
  },
  subDivisions: {
    '1-1': [
      { id: '1-1-1', name: 'SD-1 Civil Lines', divisionId: '1-1' },
      { id: '1-1-2', name: 'SD-2 Civil Lines', divisionId: '1-1' },
    ],
    '1-2': [
      { id: '1-2-1', name: 'SD-1 Karol Bagh', divisionId: '1-2' },
    ],
    '2-1': [
      { id: '2-1-1', name: 'SD-1 Saket', divisionId: '2-1' },
    ],
    '2-2': [
      { id: '2-2-1', name: 'SD-1 Defence Colony', divisionId: '2-2' },
    ],
    '3-1': [
      { id: '3-1-1', name: 'SD-1 Patparganj', divisionId: '3-1' },
      { id: '3-1-2', name: 'SD-2 Patparganj', divisionId: '3-1' },
    ],
    '3-2': [
      { id: '3-2-1', name: 'SD-1 Mayur Vihar', divisionId: '3-2' },
    ],
  },
  departments: [
    { id: 'd1', name: 'Public Works Department' },
    { id: 'd2', name: 'Water Supply' },
    { id: 'd3', name: 'Electrical Maintenance' },
    { id: 'd4', name: 'Road Maintenance' },
  ],
  designations: {
    d1: [
      { id: 'des1', name: 'Executive Engineer', departmentId: 'd1' },
      { id: 'des2', name: 'Assistant Engineer', departmentId: 'd1' },
      { id: 'des3', name: 'Junior Engineer', departmentId: 'd1' },
    ],
    d2: [
      { id: 'des4', name: 'Chief Engineer', departmentId: 'd2' },
      { id: 'des5', name: 'Senior Engineer', departmentId: 'd2' },
    ],
    d3: [
      { id: 'des6', name: 'Electrical Engineer', departmentId: 'd3' },
      { id: 'des7', name: 'Technician', departmentId: 'd3' },
    ],
    d4: [
      { id: 'des8', name: 'Road Engineer', departmentId: 'd4' },
      { id: 'des9', name: 'Supervisor', departmentId: 'd4' },
    ],
  },
  users: {
    des1: [
      { id: 'u1', name: 'Rajesh Kumar', designationId: 'des1', designation: 'Executive Engineer' },
      { id: 'u2', name: 'Priya Sharma', designationId: 'des1', designation: 'Executive Engineer' },
    ],
    des2: [
      { id: 'u3', name: 'Er Sabir Ali', designationId: 'des2', designation: 'Assistant Engineer' },
      { id: 'u4', name: 'Amit Patel', designationId: 'des2', designation: 'Assistant Engineer' },
    ],
    des3: [
      { id: 'u5', name: 'Neha Singh', designationId: 'des3', designation: 'Junior Engineer' },
    ],
    des4: [
      { id: 'u6', name: 'Suresh Reddy', designationId: 'des4', designation: 'Chief Engineer' },
    ],
    des5: [
      { id: 'u7', name: 'Kavita Desai', designationId: 'des5', designation: 'Senior Engineer' },
    ],
    des6: [
      { id: 'u8', name: 'Ravi Verma', designationId: 'des6', designation: 'Electrical Engineer' },
    ],
    des7: [
      { id: 'u9', name: 'Ankit Gupta', designationId: 'des7', designation: 'Technician' },
    ],
    des8: [
      { id: 'u10', name: 'Deepak Yadav', designationId: 'des8', designation: 'Road Engineer' },
    ],
    des9: [
      { id: 'u11', name: 'Sanjay Mishra', designationId: 'des9', designation: 'Supervisor' },
    ],
  },
};

interface Selection {
  id: string;
  name: string;
  designation?: string;
}

type StepStatus = 'disabled' | 'active' | 'completed';

interface StepItemProps {
  number: number;
  title: string;
  status: StepStatus;
  selectedValue?: string;
  onPress: () => void;
}

function StepItem({ number, title, status, selectedValue, onPress }: StepItemProps) {
  const isDisabled = status === 'disabled';
  const isActive = status === 'active';
  const isCompleted = status === 'completed';

  return (
    <TouchableOpacity
      style={[styles.stepItem, isDisabled && styles.stepItemDisabled]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <View style={styles.stepLeft}>
        <View
          style={[
            styles.stepNumber,
            isActive && styles.stepNumberActive,
            isCompleted && styles.stepNumberCompleted,
            isDisabled && styles.stepNumberDisabled,
          ]}
        >
          {isCompleted ? (
            <Ionicons name="checkmark" size={18} color={COLORS.cardBackground} />
          ) : (
            <Text
              style={[
                styles.stepNumberText,
                isActive && styles.stepNumberTextActive,
                isDisabled && styles.stepNumberTextDisabled,
              ]}
            >
              {number}
            </Text>
          )}
        </View>
        <View style={styles.stepContent}>
          <Text
            style={[
              styles.stepTitle,
              isActive && styles.stepTitleActive,
              isDisabled && styles.stepTitleDisabled,
            ]}
          >
            {title}
          </Text>
          {isCompleted && selectedValue && (
            <Text style={styles.stepValue}>{selectedValue}</Text>
          )}
          {!isCompleted && !isDisabled && (
            <Text style={styles.stepPlaceholder}>Tap to select</Text>
          )}
        </View>
      </View>
      {!isDisabled && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isActive ? COLORS.primary : COLORS.textSecondary}
        />
      )}
    </TouchableOpacity>
  );
}

export default function AssignComplaintScreen() {
  const params = useLocalSearchParams();
  // const complaintId = params.complaintId as string; // Will be used for API calls

  const [circle, setCircle] = useState<Selection | null>(null);
  const [division, setDivision] = useState<Selection | null>(null);
  const [subDivision, setSubDivision] = useState<Selection | null>(null);
  const [department, setDepartment] = useState<Selection | null>(null);
  const [designation, setDesignation] = useState<Selection | null>(null);
  const [user, setUser] = useState<Selection | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle selection from searchable screen - FIXED
  useEffect(() => {
    if (params.selectedItem && params.selectedField) {
      const item = JSON.parse(params.selectedItem as string);
      const field = params.selectedField as string;

      switch (field) {
        case 'circle':
          setCircle(item);
          setDivision(null);
          setSubDivision(null);
          setDepartment(null);
          setDesignation(null);
          setUser(null);
          break;
        case 'division':
          setDivision(item);
          setSubDivision(null);
          setDepartment(null);
          setDesignation(null);
          setUser(null);
          break;
        case 'subDivision':
          setSubDivision(item);
          setDepartment(null);
          setDesignation(null);
          setUser(null);
          break;
        case 'department':
          setDepartment(item);
          setDesignation(null);
          setUser(null);
          break;
        case 'designation':
          setDesignation(item);
          setUser(null);
          break;
        case 'user':
          setUser(item);
          break;
      }
    }
  }, [params.selectedItem, params.selectedField]);

  const handleCircleSelect = () => {
    router.push({
      pathname: '/searchable-selection',
      params: {
        title: 'Select Circle',
        items: JSON.stringify(MOCK_DATA.circles),
        field: 'circle',
      },
    });
  };

  const handleDivisionSelect = () => {
    if (!circle) return;
    const divisions = (MOCK_DATA.divisions as any)[circle.id] || [];
    router.push({
      pathname: '/searchable-selection',
      params: {
        title: 'Select Division',
        items: JSON.stringify(divisions),
        field: 'division',
      },
    });
  };

  const handleSubDivisionSelect = () => {
    if (!division) return;
    const subDivisions = (MOCK_DATA.subDivisions as any)[division.id] || [];
    router.push({
      pathname: '/searchable-selection',
      params: {
        title: 'Select Sub-Division',
        items: JSON.stringify(subDivisions),
        field: 'subDivision',
      },
    });
  };

  const handleDepartmentSelect = () => {
    router.push({
      pathname: '/searchable-selection',
      params: {
        title: 'Select Department',
        items: JSON.stringify(MOCK_DATA.departments),
        field: 'department',
      },
    });
  };

  const handleDesignationSelect = () => {
    if (!department) return;
    const designations = (MOCK_DATA.designations as any)[department.id] || [];
    router.push({
      pathname: '/searchable-selection',
      params: {
        title: 'Select Designation',
        items: JSON.stringify(designations),
        field: 'designation',
      },
    });
  };

  const handleUserSelect = () => {
    if (!designation) return;
    const users = (MOCK_DATA.users as any)[designation.id] || [];
    router.push({
      pathname: '/searchable-selection',
      params: {
        title: 'Select User',
        items: JSON.stringify(users),
        field: 'user',
      },
    });
  };

  const handleAssign = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    router.back();
    router.setParams({
      assignedUser: user?.name,
      assignedDesignation: user?.designation,
      showAssignmentToast: 'true',
    });
  };

  // Determine step statuses
  const getStepStatus = (stepNumber: number): StepStatus => {
    switch (stepNumber) {
      case 1:
        return circle ? 'completed' : 'active';
      case 2:
        if (!circle) return 'disabled';
        return division ? 'completed' : 'active';
      case 3:
        if (!division) return 'disabled';
        return subDivision ? 'completed' : 'active';
      case 4:
        if (!subDivision) return 'disabled';
        return department ? 'completed' : 'active';
      case 5:
        if (!department) return 'disabled';
        return designation ? 'completed' : 'active';
      case 6:
        if (!designation) return 'disabled';
        return user ? 'completed' : 'active';
      default:
        return 'disabled';
    }
  };

  const isAssignButtonEnabled = user !== null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cardBackground} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.6}
        >
          <Ionicons name="arrow-back" size={28} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Assign Complaint</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Steps Card */}
        <View style={styles.card}>
          <StepItem
            number={1}
            title="Select Circle"
            status={getStepStatus(1)}
            selectedValue={circle?.name}
            onPress={handleCircleSelect}
          />
          <View style={styles.stepSeparator} />

          <StepItem
            number={2}
            title="Select Division"
            status={getStepStatus(2)}
            selectedValue={division?.name}
            onPress={handleDivisionSelect}
          />
          <View style={styles.stepSeparator} />

          <StepItem
            number={3}
            title="Select Sub-Division"
            status={getStepStatus(3)}
            selectedValue={subDivision?.name}
            onPress={handleSubDivisionSelect}
          />
          <View style={styles.stepSeparator} />

          <StepItem
            number={4}
            title="Select Department"
            status={getStepStatus(4)}
            selectedValue={department?.name}
            onPress={handleDepartmentSelect}
          />
          <View style={styles.stepSeparator} />

          <StepItem
            number={5}
            title="Select Designation"
            status={getStepStatus(5)}
            selectedValue={designation?.name}
            onPress={handleDesignationSelect}
          />
          <View style={styles.stepSeparator} />

          <StepItem
            number={6}
            title="Select User"
            status={getStepStatus(6)}
            selectedValue={user?.name}
            onPress={handleUserSelect}
          />
        </View>

        {/* Comment Card */}
        <View style={styles.card}>
          <Text style={styles.commentLabel}>Comment (Optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Add any notes or instructions..."
            placeholderTextColor={COLORS.textLight}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={comment}
            onChangeText={setComment}
          />
        </View>

        {/* Spacer for button */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Assign Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.assignButton, !isAssignButtonEnabled && styles.assignButtonDisabled]}
          onPress={handleAssign}
          disabled={!isAssignButtonEnabled || isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.assignButtonText}>Assign</Text>
          )}
        </TouchableOpacity>
      </View>
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
  backButton: {
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
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  stepItemDisabled: {
    opacity: 0.5,
  },
  stepLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.disabled,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  stepNumberActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepNumberCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  stepNumberDisabled: {
    backgroundColor: COLORS.disabled,
    borderColor: COLORS.divider,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  stepNumberTextActive: {
    color: COLORS.cardBackground,
  },
  stepNumberTextDisabled: {
    color: COLORS.disabledText,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  stepTitleActive: {
    color: COLORS.primary,
  },
  stepTitleDisabled: {
    color: COLORS.disabledText,
  },
  stepValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  stepPlaceholder: {
    fontSize: 13,
    fontWeight: '400',
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  stepSeparator: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginLeft: 56,
  },
  commentLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
    minHeight: 100,
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 90,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  assignButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  assignButtonDisabled: {
    backgroundColor: COLORS.disabledText,
    opacity: 0.5,
  },
  assignButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
