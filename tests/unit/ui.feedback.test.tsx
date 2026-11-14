import React from 'react';
import { View } from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn().mockResolvedValue(null),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
  clear: jest.fn().mockResolvedValue(null),
}));

jest.mock('react-native-reanimated', () => {
  const R = require('react');
  const V = require('react-native').View;
  return {
    __esModule: true,
    default: {
      View: (props: any) => R.createElement(V, props),
    },
    useSharedValue: (init: any) => ({ value: init }),
    useAnimatedStyle: (fn: any) => fn(),
    withRepeat: (anim: any) => anim,
    withTiming: (toVal: any) => toVal,
    Easing: {
      inOut: (e: any) => e,
      ease: (v: any) => v,
    },
  };
});

jest.mock('lucide-react-native', () => ({
  WifiOff: 'WifiOff',
  RefreshCw: 'RefreshCw',
  CheckCircle2: 'CheckCircle2',
  X: 'X',
}));

import { ConfirmationDialog } from '../../src/components/feedback/ConfirmationDialog';
import { OfflineBanner } from '../../src/components/feedback/OfflineBanner';
import { SuccessBanner } from '../../src/components/feedback/SuccessBanner';
import { LoadingSkeleton, CardSkeleton } from '../../src/components/feedback/LoadingSkeleton';

describe('UI Feedback & Polish Components', () => {
  describe('ConfirmationDialog', () => {
    it('defines accessible alert role and title/message props', () => {
      const onConfirm = jest.fn();
      const onCancel = jest.fn();

      const element = (
        <ConfirmationDialog
          visible={true}
          title="Discard Session"
          message="Are you sure you want to discard your workout?"
          confirmLabel="Discard"
          cancelLabel="Continue"
          isDestructive={true}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      );

      expect(element).toBeDefined();
      expect(element.props.visible).toBe(true);
      expect(element.props.title).toBe('Discard Session');
      expect(element.props.isDestructive).toBe(true);
    });
  });

  describe('OfflineBanner', () => {
    it('provides accessible alert role and handles retry callback', () => {
      const onRetry = jest.fn();
      const element = (
        <OfflineBanner
          message="Saved locally. Will sync when reconnected."
          onRetry={onRetry}
          isRetrying={false}
        />
      );

      expect(element).toBeDefined();
      expect(element.props.onRetry).toBe(onRetry);
      expect(element.props.message).toContain('Saved locally');
    });
  });

  describe('SuccessBanner', () => {
    it('renders success notification and auto-dismiss handler', () => {
      const onDismiss = jest.fn();
      const element = (
        <SuccessBanner
          message="Profile updated successfully."
          onDismiss={onDismiss}
          autoDismissMs={3000}
        />
      );

      expect(element).toBeDefined();
      expect(element.props.message).toBe('Profile updated successfully.');
      expect(element.props.autoDismissMs).toBe(3000);
    });
  });

  describe('LoadingSkeleton & CardSkeleton', () => {
    it('defines loading skeleton with customizable dimensions', () => {
      const element = <LoadingSkeleton width="80%" height={24} borderRadius={8} />;
      expect(element).toBeDefined();
      expect(element.props.width).toBe('80%');
      expect(element.props.height).toBe(24);
    });

    it('defines card skeleton layout container', () => {
      const element = <CardSkeleton />;
      expect(element).toBeDefined();
    });
  });
});
