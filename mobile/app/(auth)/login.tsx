import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { useLoginMutation } from "@/app/(auth)/_hooks/use-auth-mutations";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useZodForm, getFirstErrorMessage, trimOrEmpty } from "@/lib/forms";

const loginSchema = z.object({
  email: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().email("Enter a valid email")),
  password: z.string().min(1, "Password is required"),
});

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const loginMutation = useLoginMutation();

  const form = useZodForm(loginSchema, {
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isLoading = loginMutation.isPending;

  const handleLogin = form.handleSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync({
        email: trimOrEmpty(values.email),
        password: values.password,
      });
      // Small delay to ensure token is stored before navigation
      setTimeout(() => {
        router.replace("/(tabs)" as any);
      }, 100);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      Alert.alert("Login Failed", message);
    }
  });

  return (
    <SafeAreaView className="flex-1 bg-muted">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center items-center px-6 py-10">
            {/* Logo */}
            <View className="items-center mb-8">
              <View className="w-12 h-12 bg-primary rounded-lg items-center justify-center mb-3">
                <Text className="text-primary-foreground text-xl font-bold">
                  A
                </Text>
              </View>
              <Text className="text-foreground text-lg font-semibold">
                Acme Jobs
              </Text>
            </View>

            {/* Login Card */}
            <View className="w-full max-w-sm bg-card rounded-2xl p-6 shadow-sm border border-border">
              <Text className="text-xl font-bold text-center text-card-foreground mb-1">
                Welcome back
              </Text>
              <Text className="text-muted-foreground text-center mb-6">
                Sign in to your account
              </Text>

              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-card-foreground mb-2">
                  Email
                </Text>
                <Controller
                  control={form.control}
                  name="email"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState,
                  }) => (
                    <>
                      <TextInput
                        className="w-full h-12 px-4 bg-background border border-input rounded-lg text-foreground"
                        placeholder="m@example.com"
                        placeholderTextColor={colors.mutedForeground}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!isLoading}
                      />
                      {getFirstErrorMessage(fieldState.error) && (
                        <Text className="text-xs text-red-500 mt-1">
                          {getFirstErrorMessage(fieldState.error)}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-card-foreground mb-2">
                  Password
                </Text>
                <Controller
                  control={form.control}
                  name="password"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState,
                  }) => (
                    <>
                      <TextInput
                        className="w-full h-12 px-4 bg-background border border-input rounded-lg text-foreground"
                        placeholder="Enter your password"
                        placeholderTextColor={colors.mutedForeground}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry
                        editable={!isLoading}
                      />
                      {getFirstErrorMessage(fieldState.error) && (
                        <Text className="text-xs text-red-500 mt-1">
                          {getFirstErrorMessage(fieldState.error)}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>

              {/* Login Button */}
              <TouchableOpacity
                className={`w-full h-12 rounded-lg items-center justify-center ${
                  isLoading ? "bg-primary/70" : "bg-primary"
                }`}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.primaryForeground} />
                ) : (
                  <Text className="text-primary-foreground font-semibold">
                    Login
                  </Text>
                )}
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View className="mt-4 flex-row justify-center">
                <Text className="text-muted-foreground">
                  Don&apos;t have an account?{" "}
                </Text>
                <Link href={"/(auth)" as any} asChild>
                  <TouchableOpacity>
                    <Text className="text-primary font-semibold underline">
                      Sign up
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
