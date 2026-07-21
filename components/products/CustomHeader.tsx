import { View, Text } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { globalStyles } from '@/constants/styles';

interface CustomHeaderProps {
    title: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
}

const CustomHeader = ({ title, icon }: CustomHeaderProps) => {
    return (
        <View>
            <Text style={globalStyles.h1}>{title}</Text>
            <Ionicons name={icon} size={24} />
        </View>
    )
}

export default CustomHeader