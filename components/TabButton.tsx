import { Colors } from '@/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TabTriggerSlotProps } from 'expo-router/ui';
import { ComponentProps, Ref, forwardRef } from 'react';
import { Text, Pressable, View } from 'react-native';

type Icon = ComponentProps<typeof Ionicons>['name'];

export type TabButtonProps = TabTriggerSlotProps & {
  icon?: Icon;
  ref: Ref<View>;
};

export function TabButton({ icon, children, isFocused, ...props }: TabButtonProps) {
  return (
    <Pressable
      {...props}
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: "50%",
          width: 56,
          height: 56
        },
        isFocused ? { backgroundColor: Colors.brand.ORANGE } : undefined,
      ]}>
      <Ionicons name={icon} size={28} color={"#FFFFFF"}/>
    </Pressable>
  );
}
