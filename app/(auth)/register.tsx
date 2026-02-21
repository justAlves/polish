import { Button } from "@/components/base/button";
import { auth } from "@/lib/auth";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(2, "Mínimo de 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Mínimo de 6 caracteres"),
    confirmPassword: z.string().min(6, "Mínimo de 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { signUp } = auth;

  const onSubmit = async (data: RegisterFormData) => {
    console.log("Form data:", data);
    await signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      {
        onSuccess: () => {
          router.replace("/(app)/dashboard");
        },
        onError: (error) => {
          console.error("Registration error:", error);
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-950"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow px-8 pt-20 pb-10"
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => router.back()} className="mb-8">
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>

        <Text className="text-white font-space-mono text-2xl font-bold">
          Criar sua conta
        </Text>
        <Text className="text-neutral-400 mt-2 text-base leading-6">
          Cadastre-se e comece a praticar idiomas agora.
        </Text>

        <View className="gap-5 mt-10">
          <View>
            <Text className="text-neutral-300 text-sm mb-2 font-space-mono">
              Nome
            </Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-neutral-900 text-white text-base px-4 py-4 rounded-2xl border border-neutral-800"
                  placeholder="Seu nome"
                  placeholderTextColor="#525252"
                  autoCapitalize="words"
                  autoComplete="name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={{ fontFamily: "SpaceMono" }}
                />
              )}
            />
            {errors.name && (
              <Text className="text-red-400 text-xs mt-1">
                {errors.name.message}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-neutral-300 text-sm mb-2 font-space-mono">
              E-mail
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-neutral-900 text-white text-base px-4 py-4 rounded-2xl border border-neutral-800"
                  placeholder="seu@email.com"
                  placeholderTextColor="#525252"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={{ fontFamily: "SpaceMono" }}
                />
              )}
            />
            {errors.email && (
              <Text className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-neutral-300 text-sm mb-2 font-space-mono">
              Senha
            </Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="relative">
                  <TextInput
                    className="bg-neutral-900 text-white text-base px-4 py-4 rounded-2xl border border-neutral-800 pr-12"
                    placeholder="********"
                    placeholderTextColor="#525252"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={{ fontFamily: "SpaceMono" }}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4"
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#737373"
                    />
                  </Pressable>
                </View>
              )}
            />
            {errors.password && (
              <Text className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-neutral-300 text-sm mb-2 font-space-mono">
              Confirmar senha
            </Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="relative">
                  <TextInput
                    className="bg-neutral-900 text-white text-base px-4 py-4 rounded-2xl border border-neutral-800 pr-12"
                    placeholder="********"
                    placeholderTextColor="#525252"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={{ fontFamily: "SpaceMono" }}
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-4"
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color="#737373"
                    />
                  </Pressable>
                </View>
              )}
            />
            {errors.confirmPassword && (
              <Text className="text-red-400 text-xs mt-1">
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>
        </View>

        <View className="mt-10 items-center gap-4">
          <Button
            onPress={handleSubmit(onSubmit)}
            width={300}
            height={52}
            backgroundColor="transparent"
            gradientColors={["#6366f1", "#8b5cf6", "#a78bfa"]}
          >
            <Text className="text-white text-base font-semibold">
              Criar conta
            </Text>
          </Button>

          <View className="flex-row items-center gap-2 mt-2">
            <Text className="text-neutral-500 text-sm">Já tem uma conta?</Text>
            <Pressable onPress={() => router.replace("/(auth)/login")}>
              <Text className="text-indigo-400 text-sm font-semibold">
                Entrar
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
