"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from "./ui/alert-dialog";

export default function ReviewDialog() {
    return(
        <AlertDialog>
            <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction>Envoyer</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialog>
    );
}
