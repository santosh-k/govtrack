import React, { useState } from 'react';
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
  ActivityIndicator,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const COLORS = {
  primary: '#FF851B', // Saffron/Orange
  background: '#FDFDFD',
  text: '#1A1A1A',
  textSecondary: '#666666',
  white: '#FFFFFF',
  border: '#E0E0E0',
  inputBorder: '#CCCCCC',
  inputBorderActive: '#FF851B',
  profileBg: '#E3F2FD',
  profileBorder: '#2196F3',
  error: '#D32F2F',
  success: '#4CAF50',
};

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
  placeholder?: string;
  multiline?: boolean;
  error?: string;
  keyboardType?: 'default' | 'email-address';
}

function InputField({
  label,
  value,
  onChangeText,
  icon,
  placeholder,
  multiline,
  error,
  keyboardType = 'default'
}: InputFieldProps) {
  return (
    <View style={styles.inputGroup}>
      <View style={styles.inputHeader}>
        <Ionicons name={icon} size={20} color={COLORS.profileBorder} style={styles.inputIcon} />
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      <TextInput
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          error && styles.inputError
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        keyboardType={keyboardType}
      />
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

export default function EditProfileScreen() {
  const params = useLocalSearchParams();

  const [fullName, setFullName] = useState(params.fullName as string || '');
  const [email, setEmail] = useState(params.email as string || '');
  const [designation, setDesignation] = useState(params.designation as string || '');
  const [department, setDepartment] = useState(params.department as string || '');
  const [address, setAddress] = useState(params.address as string || '');

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const slideAnim = React.useRef(new Animated.Value(100)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {
      fullName: '',
      email: '',
    };

    let isValid = true;

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    slideAnim.setValue(100);
    opacityAnim.setValue(0);

    // Slide up and fade in
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss after 3 seconds and navigate back
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowToast(false);
        setToastMessage('');
        router.back();
      });
    }, 3000);
  };

  const handleSave = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Show loading state
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Saving profile data:', {
        fullName, email, designation, department, address
      });

      setIsLoading(false);
      showSuccessToast('Profile updated successfully');
    }, 1500);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        {/* Left: Back Arrow */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.6}
        >
          <Ionicons name="arrow-back" size={28} color={COLORS.text} />
        </TouchableOpacity>

        {/* Center: Title */}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        {/* Right: Empty space for balance */}
        <View style={styles.headerSpacer} />
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Picture Section */}
          <View style={styles.profilePictureSection}>
            <View style={styles.profilePicture}>
              <Ionicons name="person" size={48} color={COLORS.profileBorder} />
            </View>
            <TouchableOpacity style={styles.changePhotoButton} activeOpacity={0.7}>
              <Ionicons name="camera" size={16} color={COLORS.primary} />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Edit Form */}
          <View style={styles.formSection}>
            <InputField
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              icon="person-outline"
              placeholder="Enter your full name"
              error={errors.fullName}
            />
            <InputField
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              icon="mail-outline"
              placeholder="Enter your email"
              keyboardType="email-address"
              error={errors.email}
            />
            <InputField
              label="Designation"
              value={designation}
              onChangeText={setDesignation}
              icon="briefcase-outline"
              placeholder="Enter your designation"
            />
            <InputField
              label="Department"
              value={department}
              onChangeText={setDepartment}
              icon="business-outline"
              placeholder="Enter your department"
            />
            <InputField
              label="Residential Address"
              value={address}
              onChangeText={setAddress}
              icon="location-outline"
              placeholder="Enter your residential address"
              multiline={true}
            />
          </View>

          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Success Toast */}
      {showToast && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={styles.toastContent}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        </Animated.View>
      )}
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
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profilePictureSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.profileBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: COLORS.profileBorder,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primary,
    marginLeft: 6,
  },
  formSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  inputGroup: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    marginLeft: 28,
  },
  inputMultiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 28,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.error,
    marginLeft: 6,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    zIndex: 1000,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toastText: {
    fontSize: 14,
    color: COLORS.white,
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
    lineHeight: 20,
  },
});
