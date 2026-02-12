import { Button } from "@/components/base/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
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
import { auth } from "@/lib/auth";
import { useToast } from "@/components/molecules/toast";

const loginSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const { signIn } = auth;
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await signIn.email({
      email: data.email,
      password: data.password,
    }, {
      onError: (error) => {
        if(error.error.message === "Invalid email or password") {
          toast.show("E-mail ou senha inválidos", {
            type: "error",
            backgroundColor: "#dc2626",
            position: "top",
          })
        }
      }
    })
  };

  const handleGoogleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/dashboard"
    }, {
      onError: (error) => {
        console.log("Google Sign-In Error:", error);
      }
    })
  }

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
          Entrar na sua conta
        </Text>
        <Text className="text-neutral-400 mt-2 text-base leading-6">
          Preencha seus dados para continuar praticando.
        </Text>

        <View className="mt-8 items-center">
          <Button
            onPress={handleGoogleSignIn}
            width={300}
            height={52}
            backgroundColor="transparent"
            style={{ borderWidth: 1, borderColor: "#404040" }}
          >
            <View className="flex-row items-center gap-3">
              <Ionicons name="logo-google" size={20} color="#fff" />
              <Text className="text-white text-base font-semibold">
                Continuar com Google
              </Text>
            </View>
          </Button>
        </View>

        <View className="flex-row items-center my-8">
          <View className="flex-1 h-px bg-neutral-800" />
          <Text className="text-neutral-500 mx-4 text-sm font-space-mono">
            ou
          </Text>
          <View className="flex-1 h-px bg-neutral-800" />
        </View>

        <View className="gap-5">
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
                    autoComplete="password"
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

          <Pressable className="self-end">
            <Text className="text-indigo-400 text-sm font-space-mono">
              Esqueceu a senha?
            </Text>
          </Pressable>
        </View>

        <View className="mt-10 items-center gap-4">
          <Button
            onPress={handleSubmit(onSubmit)}
            width={300}
            height={52}
            backgroundColor="transparent"
            gradientColors={["#6366f1", "#8b5cf6", "#a78bfa"]}
          >
            <Text className="text-white text-base font-semibold">Entrar</Text>
          </Button>

          <View className="flex-row items-center gap-2 mt-2">
            <Text className="text-neutral-500 text-sm">
              Ainda não tem conta?
            </Text>
            <Pressable onPress={() => router.replace("/(auth)/register")}>
              <Text className="text-indigo-400 text-sm font-semibold">
                Criar conta
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
