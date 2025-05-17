"use client"

import { FC, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"; // ← pridaj aj button
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useRouter } from "next/navigation";

const StartSettingsWrapper: FC = () => {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🚀");
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true); // ← na toggle viditeľnosti
  const router = useRouter()
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setEmoji(emojiData.emoji);
  };

  if (!isVisible) return null; // ak zavreté, nič nerenderuj

  return (
    <div className="flex items-center justify-center h-screen px-4">
      <Alert className="w-full max-w-lg text-center">
        <AlertTitle className="text-xl mb-4">
          Vytvorte si svoj prvý workspace {emoji}
        </AlertTitle>
        <AlertDescription>
          <div className="space-y-4">
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

            <div className="pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsVisible(false)
                  router.push("/dashboard")
                }}
                className="w-full"
              >
                Preskočiť / Vytvoriť neskôr
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default StartSettingsWrapper;
