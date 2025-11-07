import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import SelectionScreen from '@/components/SelectionScreen';

const DEPARTMENTS = [
  'Roads & Infrastructure - Zone West',
  'Roads & Infrastructure - Zone East',
  'Roads & Infrastructure - Zone North',
  'Roads & Infrastructure - Zone South',
  'Electrical Services - Zone West',
  'Electrical Services - Zone East',
  'Electrical Services - Zone North',
  'Electrical Services - Zone South',
  'Water & Sanitation - Zone West',
  'Water & Sanitation - Zone East',
  'Water & Sanitation - Zone North',
  'Water & Sanitation - Zone South',
  'Waste Management - Zone West',
  'Waste Management - Zone East',
  'Waste Management - Zone North',
  'Waste Management - Zone South',
  'Building & Planning - Zone Central',
  'Traffic Management - Zone West',
  'Traffic Management - Zone East',
  'Parks & Gardens - Zone North',
  'Parks & Gardens - Zone South',
];

export default function SelectDepartmentScreen() {
  const params = useLocalSearchParams();
  const selectedValue = params.selected as string;

  const handleSelect = (value: string) => {
    // Navigate back with the selected value
    if (router.canGoBack()) {
      router.back();
    }
    // The parent screen will handle updating the filter state
  };

  return (
    <SelectionScreen
      title="Select Department"
      options={DEPARTMENTS}
      selectedValue={selectedValue}
      onSelect={handleSelect}
    />
  );
}
