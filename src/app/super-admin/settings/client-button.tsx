"use client"
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ClientButton() {
    const { toast } = useToast();

    function handleSave() {
        toast({
            title: "Saved (demo only)",
            description: "Your settings have been updated.",
        });
    }

    return (
        <Button onClick={handleSave}>Save Changes</Button>
    )
}