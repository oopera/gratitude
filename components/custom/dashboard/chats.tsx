import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function Chats({ handleClick }: { handleClick: () => void }) {
  return (
    <Button variant="outline" onClick={() => handleClick()}>
      <Download />
    </Button>
  );
}
