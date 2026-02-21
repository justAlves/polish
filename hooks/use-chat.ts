import { api } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";

interface MessageResponse {
  userTranscription: string;
  text: string;
  audio: string; // base64 MP3
}

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async ({ uri, id }: { uri: string; id: string }) => {
      const formData = new FormData();
      formData.append("audio", {
        uri: uri,
        type: "audio/m4a",
        name: "recording.m4a",
      } as any);

      const response = await api.post(
        `/chat/conversations/${id}/message`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data as MessageResponse;
    },
  });
};

export const useCreateConversation = () => {
  return useMutation({
    mutationFn: async (
      language: "en" | "pt" | "es" | "fr" | "de" | "it" | "ja" | "ko" | "zh",
    ) => {
      const response = await api.post("/chat/conversations", { language });
      return response.data;
    },
  });
};

export const useGetConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await api.get("/chat/conversations");
      return response.data;
    },
  });
};
