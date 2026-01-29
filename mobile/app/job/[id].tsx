import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/stores/auth-store";
import { Colors } from "@/constants/theme";
import { formatCurrency } from "@/lib/api";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  useCreateApplicationMutation,
  useHasAppliedQuery,
  useJobQuery,
} from "@/app/job/_hooks/use-job";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { getFirstErrorMessage, useZodForm } from "@/lib/forms";

const applySchema = z.object({
  resume: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(1, "Resume is required")),
  coverLetter: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(1, "Cover letter is required")),
});

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applySubmitError, setApplySubmitError] = useState<string | null>(null);

  const jobQuery = useJobQuery(id);
  const job = jobQuery.data ?? null;

  const hasAppliedQuery = useHasAppliedQuery(
    id,
    Boolean(user && user.role === "jobseeker" && job?.status === "open"),
  );

  const createApplicationMutation = useCreateApplicationMutation();

  const applyForm = useZodForm(applySchema, {
    defaultValues: {
      resume: "",
      coverLetter: "",
    },
  });

  useEffect(() => {
    if (jobQuery.isError) {
      Alert.alert("Error", "Failed to load job details");
      router.back();
    }
  }, [jobQuery.isError]);

  const handleApply = applyForm.handleSubmit(
    async (values) => {
      setApplySubmitError(null);
      try {
        await createApplicationMutation.mutateAsync({
          jobId: id as string,
          resume: values.resume,
          coverLetter: values.coverLetter,
        });

        // Don't rely on Alert for feedback (it's inconsistent on web).
        applyForm.reset();
        setShowApplyModal(false);
        router.push("/(tabs)/applications");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const apiMessage =
            (error.response?.data as any)?.message ||
            (error.response?.data as any)?.error ||
            error.message;

          if (status === 409) {
            // Already applied: take user to their applications.
            if (Platform.OS !== "web") {
              Alert.alert(
                "Already applied",
                "You have already applied for this job.",
              );
            }
            applyForm.reset();
            setShowApplyModal(false);
            router.push("/(tabs)/applications");
            return;
          }

          const message =
            typeof apiMessage === "string" ? apiMessage : error.message;
          setApplySubmitError(message);
          if (Platform.OS !== "web") {
            Alert.alert("Error", message);
          }
          return;
        }

        const fallbackMessage =
          error instanceof Error
            ? error.message
            : "Failed to submit application";
        setApplySubmitError(fallbackMessage);
        if (Platform.OS !== "web") {
          Alert.alert("Error", fallbackMessage);
        }
      }
    },
    () => {
      setApplySubmitError("Please correct the highlighted fields.");
      if (Platform.OS !== "web") {
        Alert.alert("Fix errors", "Please correct the highlighted fields.");
      }
    },
  );

  const resumeValue = applyForm.watch("resume");
  const coverLetterValue = applyForm.watch("coverLetter");

  if (jobQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!job) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground">Job not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* Job Header */}
        <View className="bg-card rounded-xl border border-border p-4 mb-4">
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 mr-3">
              <Text className="text-xl font-bold text-card-foreground mb-2">
                {job.title}
              </Text>
              <View className="flex-row flex-wrap gap-3">
                <View className="flex-row items-center">
                  <IconSymbol
                    name="location.fill"
                    size={14}
                    color={colors.mutedForeground}
                  />
                  <Text className="text-sm text-muted-foreground ml-1">
                    {job.location}
                  </Text>
                </View>
                {job.salary && (
                  <View className="flex-row items-center">
                    <IconSymbol
                      name="dollarsign.circle.fill"
                      size={14}
                      color={colors.mutedForeground}
                    />
                    <Text className="text-sm text-muted-foreground ml-1">
                      {formatCurrency(job.salary)}/year
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View
              className={`px-3 py-1 rounded-full ${
                job.status === "open" ? "bg-primary" : "bg-secondary"
              }`}
            >
              <Text
                className={`text-xs font-medium capitalize ${
                  job.status === "open"
                    ? "text-primary-foreground"
                    : "text-secondary-foreground"
                }`}
              >
                {job.status}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3 mt-2">
            <View className="flex-row items-center">
              <IconSymbol
                name="calendar"
                size={14}
                color={colors.mutedForeground}
              />
              <Text className="text-sm text-muted-foreground ml-1">
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-row items-center">
              <IconSymbol
                name="person.2.fill"
                size={14}
                color={colors.mutedForeground}
              />
              <Text className="text-sm text-muted-foreground ml-1">
                {job._count?.applications || 0} applicants
              </Text>
            </View>
          </View>
        </View>

        {/* Job Description */}
        <View className="bg-card rounded-xl border border-border p-4 mb-4">
          <Text className="text-lg font-semibold text-card-foreground mb-3">
            Job Description
          </Text>
          <Text className="text-card-foreground leading-6">
            {job.description}
          </Text>
        </View>

        {/* Posted By */}
        {job.creator && (
          <View className="bg-card rounded-xl border border-border p-4 mb-4">
            <Text className="text-lg font-semibold text-card-foreground mb-2">
              Posted by
            </Text>
            <Text className="text-muted-foreground">
              {job.creator.fullName}
            </Text>
          </View>
        )}

        {/* Apply Section */}
        {user?.role === "jobseeker" && job.status === "open" && (
          <View className="bg-card rounded-xl border border-border p-4 mb-4">
            <Text className="text-lg font-semibold text-card-foreground mb-3">
              Apply for this position
            </Text>
            {hasAppliedQuery.data ? (
              <View>
                <Text className="text-muted-foreground mb-3">
                  You have already applied for this job.
                </Text>
                <TouchableOpacity
                  className="bg-secondary py-3 rounded-lg items-center"
                  onPress={() => router.push("/(tabs)/applications")}
                >
                  <Text className="text-secondary-foreground font-medium">
                    View My Applications
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className="bg-primary py-3 rounded-lg items-center flex-row justify-center"
                onPress={() => setShowApplyModal(true)}
              >
                <IconSymbol
                  name="paperplane.fill"
                  size={18}
                  color={colors.primaryForeground}
                />
                <Text className="text-primary-foreground font-semibold ml-2">
                  Apply Now
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Not logged in */}
        {!user && (
          <View className="bg-card rounded-xl border border-border p-4 mb-4 items-center">
            <Text className="text-muted-foreground text-center mb-4">
              You need to be logged in as a job seeker to apply for this
              position.
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="bg-secondary px-4 py-2 rounded-lg"
                onPress={() => router.push("/(auth)/login")}
              >
                <Text className="text-secondary-foreground font-medium">
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-primary px-4 py-2 rounded-lg"
                onPress={() => router.push("/(auth)" as any)}
              >
                <Text className="text-primary-foreground font-medium">
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Apply Modal */}
      <Modal
        visible={showApplyModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          applyForm.reset();
          setApplySubmitError(null);
          setShowApplyModal(false);
        }}
      >
        <SafeAreaView className="flex-1 bg-background">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            {/* Modal Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-border">
              <TouchableOpacity
                onPress={() => {
                  applyForm.reset();
                  setApplySubmitError(null);
                  setShowApplyModal(false);
                }}
              >
                <Text className="text-primary">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-foreground">
                Apply for Position
              </Text>
              <View style={{ width: 50 }} />
            </View>

            <ScrollView className="flex-1 p-4">
              <Text className="text-muted-foreground mb-4">{job.title}</Text>

              {applySubmitError ? (
                <View className="mb-4 bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <Text className="text-destructive text-sm">
                    {applySubmitError}
                  </Text>
                </View>
              ) : null}

              {/* Resume */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-foreground mb-2">
                  Resume / CV
                </Text>
                <Controller
                  control={applyForm.control}
                  name="resume"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState,
                  }) => (
                    <>
                      <TextInput
                        className="bg-card border border-border rounded-lg p-3 text-foreground min-h-[150]"
                        placeholder="Paste your resume here or describe your experience, skills, and qualifications..."
                        placeholderTextColor={colors.mutedForeground}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        multiline
                        textAlignVertical="top"
                        editable={!createApplicationMutation.isPending}
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
                  Include your work experience, education, skills, and relevant
                  achievements.
                </Text>
              </View>

              {/* Cover Letter */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-foreground mb-2">
                  Cover Letter
                </Text>
                <Controller
                  control={applyForm.control}
                  name="coverLetter"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState,
                  }) => (
                    <>
                      <TextInput
                        className="bg-card border border-border rounded-lg p-3 text-foreground min-h-[120]"
                        placeholder="Tell us why you're a great fit for this role..."
                        placeholderTextColor={colors.mutedForeground}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        multiline
                        textAlignVertical="top"
                        editable={!createApplicationMutation.isPending}
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
            </ScrollView>

            {/* Submit Button */}
            <View className="p-4 border-t border-border">
              <TouchableOpacity
                className={`py-4 rounded-lg items-center ${
                  createApplicationMutation.isPending ||
                  !resumeValue.trim() ||
                  !coverLetterValue.trim()
                    ? "bg-primary/50"
                    : "bg-primary"
                }`}
                onPress={handleApply}
                disabled={
                  createApplicationMutation.isPending ||
                  !resumeValue.trim() ||
                  !coverLetterValue.trim()
                }
              >
                {createApplicationMutation.isPending ? (
                  <ActivityIndicator color={colors.primaryForeground} />
                ) : (
                  <Text className="text-primary-foreground font-semibold">
                    Submit Application
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
