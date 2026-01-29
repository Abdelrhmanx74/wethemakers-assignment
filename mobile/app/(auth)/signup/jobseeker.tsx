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
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { useRegisterMutation } from "@/app/(auth)/_hooks/use-auth-mutations";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { getFirstErrorMessage, trimOrEmpty, useZodForm } from "@/lib/forms";

const signupSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z
      .string()
      .transform((v) => v.trim())
      .pipe(z.string().email("Enter a valid email")),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function JobSeekerSignupScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const registerMutation = useRegisterMutation();

  const form = useZodForm(signupSchema, {
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isLoading = registerMutation.isPending;

  const handleSignup = form.handleSubmit(async (values) => {
    try {
      await registerMutation.mutateAsync({
        fullName: trimOrEmpty(values.fullName),
        email: trimOrEmpty(values.email),
        password: values.password,
        role: "jobseeker",
      });
      // Small delay to ensure token is stored before navigation
      setTimeout(() => {
        router.replace("/(tabs)" as any);
      }, 100);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      Alert.alert("Registration Failed", message);
    }
  });

  return (
    <LinearGradient
      colors={["#0f172a", "#1e3a8a80", "#0f172a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
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
              <TouchableOpacity
                onPress={() => router.back()}
                className="items-center mb-8"
              >
                <View className="w-12 h-12 bg-primary rounded-lg items-center justify-center mb-3">
                  <Ionicons
                    name="layers-outline"
                    size={24}
                    color={colors.primaryForeground}
                  />
                </View>
                <Text className="text-white text-lg font-semibold">
                  Acme Jobs
                </Text>
              </TouchableOpacity>

              {/* Signup Card */}
              <View className="w-full max-w-sm bg-card rounded-2xl p-6 shadow-2xl border border-border">
                {/* Icon */}
                <View className="items-center mb-4">
                  <View
                    className="w-14 h-14 rounded-2xl items-center justify-center"
                    style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                  >
                    <Ionicons
                      name="briefcase-outline"
                      size={28}
                      color="#3b82f6"
                    />
                  </View>
                </View>

                <Text className="text-2xl font-bold text-center text-card-foreground mb-1">
                  Create Job Seeker Account
                </Text>
                <Text className="text-muted-foreground text-center mb-6">
                  Find your dream job today
                </Text>

                {/* Full Name Input */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-card-foreground mb-2">
                    Full Name
                  </Text>
                  <Controller
                    control={form.control}
                    name="fullName"
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState,
                    }) => (
                      <>
                        <TextInput
                          className="w-full h-12 px-4 bg-background border border-input rounded-lg text-foreground"
                          placeholder="John Doe"
                          placeholderTextColor={colors.mutedForeground}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          autoCapitalize="words"
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

                {/* Password Row */}
                <View className="flex-row gap-3 mb-2">
                  <View className="flex-1">
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
                            placeholder="••••••••"
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
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-card-foreground mb-2">
                      Confirm
                    </Text>
                    <Controller
                      control={form.control}
                      name="confirmPassword"
                      render={({
                        field: { onChange, onBlur, value },
                        fieldState,
                      }) => (
                        <>
                          <TextInput
                            className="w-full h-12 px-4 bg-background border border-input rounded-lg text-foreground"
                            placeholder="••••••••"
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
                </View>
                <Text className="text-xs text-muted-foreground mb-4">
                  Must be at least 8 characters long.
                </Text>

                {/* Signup Button */}
                <TouchableOpacity
                  className="w-full h-12 bg-primary rounded-lg items-center justify-center mb-4"
                  onPress={handleSignup}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <View className="flex-row items-center gap-2">
                      <ActivityIndicator
                        color={colors.primaryForeground}
                        size="small"
                      />
                      <Text className="text-primary-foreground font-semibold">
                        Creating account...
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-primary-foreground font-semibold">
                      Create Account
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Login Link */}
                <Text className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary underline">
                    Sign in
                  </Link>
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
