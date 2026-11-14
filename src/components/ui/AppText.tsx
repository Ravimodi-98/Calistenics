import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

export interface AppTextProps extends TextProps {
  variant?: keyof typeof typography;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color = colors.text,
  align = 'left',
  style,
  children,
  ...props
}) => {
  return (
    <Text
      allowFontScaling={props.allowFontScaling ?? true}
      maxFontSizeMultiplier={props.maxFontSizeMultiplier ?? 2.0}
      style={[
        typography[variant],
        { color, textAlign: align },
        style,
      ]}
      accessibilityRole="text"
      {...props}
    >
      {children}
    </Text>
  );
};

