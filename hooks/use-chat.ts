import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

interface MessageResponse {
  userTranscription: string;
  text: string;
  audio: string; // base64 MP3
}

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (uri: string) => {
      const formData = new FormData();
      formData.append("audio", {
        uri: uri,
        type: "audio/m4a",
        name: "recording.m4a",
      } as any);

      const response = await api.post(
        "/chat/conversations/cmlmfm56l00002ourcwhydgcr/message",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data as MessageResponse;
    },
  });
};
