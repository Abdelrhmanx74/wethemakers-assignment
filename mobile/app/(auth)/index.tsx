import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <LinearGradient
      colors={["#0f172a", "#581c87", "#0f172a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 px-6 py-10">
        {/* Header */}
        <View className="items-center mb-12 pt-8">
          <View className="w-14 h-14 bg-primary rounded-xl items-center justify-center mb-4">
            <Ionicons
              name="layers-outline"
              size={32}
              color={colors.primaryForeground}
            />
          </View>
          <Text className="text-4xl font-bold text-white mb-2">Acme Jobs</Text>
          <Text className="text-xl text-slate-300 text-center">
            Find your dream job or hire top talent
          </Text>
        </View>

        {/* Role Selection Cards */}
        <View className="flex-1 justify-center gap-5">
          {/* Job Seeker Card */}
          <Link href="/signup/jobseeker" asChild>
            <TouchableOpacity
              className="rounded-2xl p-6 border overflow-hidden"
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                borderColor: "rgba(59, 130, 246, 0.3)",
              }}
              activeOpacity={0.8}
            >
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center mb-5"
                style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
              >
                <Ionicons name="briefcase-outline" size={32} color="#60a5fa" />
              </View>
              <Text className="text-2xl font-bold text-white mb-2">
                I&apos;m looking for a job
              </Text>
              <Text className="text-slate-300 mb-5 leading-6">
                Browse thousands of job listings and find your perfect match.
                Apply with one click.
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-blue-400 font-semibold">Get Started</Text>
                <Ionicons name="arrow-forward" size={20} color="#60a5fa" />
              </View>
            </TouchableOpacity>
          </Link>

          {/* Employer Card */}
          <Link href="/signup/employer" asChild>
            <TouchableOpacity
              className="rounded-2xl p-6 border overflow-hidden"
              style={{
                backgroundColor: "rgba(168, 85, 247, 0.15)",
                borderColor: "rgba(168, 85, 247, 0.3)",
              }}
              activeOpacity={0.8}
            >
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center mb-5"
                style={{ backgroundColor: "rgba(168, 85, 247, 0.2)" }}
              >
                <Ionicons name="people-outline" size={32} color="#c084fc" />
              </View>
              <Text className="text-2xl font-bold text-white mb-2">
                I&apos;m hiring
              </Text>
              <Text className="text-slate-300 mb-5 leading-6">
                Post jobs and find the best candidates for your company. Manage
                applications easily.
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-purple-400 font-semibold">
                  Start Hiring
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#c084fc" />
              </View>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Already have account */}
        <View className="items-center pt-6">
          <Text className="text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-white underline">
              Sign in
            </Link>
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
