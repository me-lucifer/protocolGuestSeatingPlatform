"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>Save Changes</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Prototype Action</AlertDialogTitle>
                    <AlertDialogDescription>
                        This is a prototype and this action is for demonstration purposes only. No changes will be saved. Do you want to continue?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSave}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}