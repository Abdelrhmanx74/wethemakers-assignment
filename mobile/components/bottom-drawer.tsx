import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type BottomDrawerProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
};

export function BottomDrawer({
  visible,
  onClose,
  children,
  containerStyle,
}: BottomDrawerProps) {
  const translateY = useRef(new Animated.Value(0)).current;

  const sheetTranslate = useMemo(
    () =>
      translateY.interpolate({
        inputRange: [0, 1],
        outputRange: [420, 0],
      }),
    [translateY],
  );

  useEffect(() => {
    if (visible) {
      translateY.setValue(0);
      Animated.timing(translateY, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View
        style={[
          styles.sheet,
          containerStyle,
          { transform: [{ translateY: sheetTranslate }] },
        ]}
      >
        <View style={styles.handle} />
        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: 18,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(148,163,184,0.9)",
    marginBottom: 10,
  },
});
