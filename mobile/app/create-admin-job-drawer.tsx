import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { BottomDrawer } from "@/components/bottom-drawer";
import { useCreateJobMutation } from "@/app/(admin)/_hooks/use-admin-jobs";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { digitsOnly, getFirstErrorMessage, useZodForm } from "@/lib/forms";

const createJobSchema = z.object({
  title: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(1, "Job title is required")),
  description: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(1, "Description is required")),
  location: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(1, "Location is required")),
  salary: z
    .string()
    .transform((v) => v.trim())
    .refine((v) => v === "" || /^\d+$/.test(v), {
      message: "Salary must be a number",
    }),
});

export default function CreateJobScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const createJobMutation = useCreateJobMutation();

  const form = useZodForm(createJobSchema, {
    defaultValues: {
      title: "",
      description: "",
      location: "",
      salary: "",
    },
  });

  const handleSubmit = form.handleSubmit(
    async (values) => {
      try {
        const salaryNum = values.salary
          ? Number.parseInt(values.salary, 10)
          : undefined;

        await createJobMutation.mutateAsync({
          title: values.title,
          description: values.description,
          location: values.location,
          salary: salaryNum,
        });
        Alert.alert("Job posted", "Your job is now live.");
        router.back();
      } catch (error) {
        console.error("Failed to create job:", error);
        Alert.alert("Create job failed", "Please try again.");
      }
    },
    () => {
      // Keep the existing UX (an alert) in addition to inline errors.
      Alert.alert("Fix errors", "Please correct the highlighted fields.");
    },
  );

  const isLoading = createJobMutation.isPending;

  return (
    <BottomDrawer
      visible
      onClose={() => router.back()}
      containerStyle={{ backgroundColor: colors.card }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-lg font-semibold text-card-foreground">
          Post New Job
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-lg bg-secondary"
          activeOpacity={0.85}
        >
          <Ionicons name="close" size={18} color={colors.secondaryForeground} />
        </TouchableOpacity>
      </View>
      <Text className="text-muted-foreground text-sm mb-4">
        Create a job post in seconds.
      </Text>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
          {/* Title */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground mb-2">
              Job Title *
            </Text>
            <Controller
              control={form.control}
              name="title"
              render={({ field: { onChange, onBlur, value }, fieldState }) => (
                <>
                  <TextInput
                    className="w-full min-h-12 px-4 bg-background border border-input rounded-lg text-foreground"
                    placeholder="e.g. Senior Software Engineer"
                    placeholderTextColor={colors.mutedForeground}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
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

          {/* Description */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground mb-2">
              Description *
            </Text>
            <Controller
              control={form.control}
              name="description"
              render={({ field: { onChange, onBlur, value }, fieldState }) => (
                <>
                  <TextInput
                    className="w-full min-h-32 px-4 py-3 bg-background border border-input rounded-lg text-foreground"
                    placeholder="Describe the role, responsibilities, and requirements..."
                    placeholderTextColor={colors.mutedForeground}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    textAlignVertical="top"
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

          {/* Location */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground mb-2">
              Location *
            </Text>
            <Controller
              control={form.control}
              name="location"
              render={({ field: { onChange, onBlur, value }, fieldState }) => (
                <>
                  <TextInput
                    className="w-full min-h-12 px-4 bg-background border border-input rounded-lg text-foreground"
                    placeholder="e.g. New York, NY or Remote"
                    placeholderTextColor={colors.mutedForeground}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
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

          {/* Salary */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-foreground mb-2">
              Salary (optional)
            </Text>
            <Controller
              control={form.control}
              name="salary"
              render={({ field: { onChange, onBlur, value }, fieldState }) => (
                <>
                  <TextInput
                    className="w-full min-h-12 px-4 bg-background border border-input rounded-lg text-foreground"
                    placeholder="e.g. 120000"
                    placeholderTextColor={colors.mutedForeground}
                    value={value}
                    onChangeText={(t) => onChange(digitsOnly(t))}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    inputMode="numeric"
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
            <Text className="text-xs text-muted-foreground mt-1">
              Annual salary in USD
            </Text>
          </View>

          <TouchableOpacity
            className={`w-full h-12 rounded-lg items-center justify-center ${
              isLoading ? "bg-primary/70" : "bg-primary"
            }`}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator
                  color={colors.primaryForeground}
                  size="small"
                />
                <Text className="text-primary-foreground font-semibold">
                  Posting...
                </Text>
              </View>
            ) : (
              <Text className="text-primary-foreground font-semibold">
                Post Job
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </BottomDrawer>
  );
}
