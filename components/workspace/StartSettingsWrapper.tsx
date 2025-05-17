"use client";

import { FC, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useRouter } from "next/navigation";

const StartSettingsWrapper: FC = () => {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🚀");
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setEmoji(emojiData.emoji);
  };

  if (!isVisible) return null;

  return (
    <div className="flex items-center justify-center h-screen px-4">
      <Alert className="!flex !flex-col items-center text-center w-full max-w-lg p-6 gap-4">
        <AlertTitle className="text-xl">
          Vytvorte si svoj prvý workspace {emoji}
        </AlertTitle>

        <AlertDescription className="w-full space-y-4">
          <Input
            placeholder="Názov workspace"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex items-center justify-center">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>

          <Textarea
            placeholder="Popis workspace"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              className="w-full bg-primary text-white"
              onClick={() => {
                // Tu môžeš dať funkciu na vytvorenie workspace
                console.log("Vytváram workspace:", { name, emoji, description });
              }}
            >
              Vytvoriť
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsVisible(false);
                router.push("/dashboard");
              }}
            >
              Preskočiť
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default StartSettingsWrapper;
