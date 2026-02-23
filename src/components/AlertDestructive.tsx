import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export function AlertDestructive(props: string) {
    return (
        <Alert variant="destructive" className="max-w-md">
            <AlertCircleIcon />
            <AlertTitle>Erreur de connexion</AlertTitle>
            <AlertDescription>
                {props}
            </AlertDescription>
        </Alert>
    );
}
