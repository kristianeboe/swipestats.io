"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { ProfileLocationForm } from "./ProfileLocationForm";

interface ProfileLocationModalProps {
  profileLocation?: {
    city: string;
    region: string;
    country: string;
  };
  onSave: (location: any) => void;
}

export function ProfileLocationModal({
  profileLocation,
  onSave,
}: ProfileLocationModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Location</DialogTitle>
        </DialogHeader>
        <ProfileLocationForm
          profileLocation={profileLocation}
          onSave={onSave}
        />
      </DialogContent>
    </Dialog>
  );
}
