"use client";

import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import { Modal } from "@/app/_components/ui/Modal";
import { ProfileLocationForm } from "@/app/upload/[providerId]/ProfileLocationForm";
import { ProfileLocationModal } from "@/app/upload/[providerId]/ProfileLocationModal";
import { toTitleCase } from "@/lib/utils/string";
import { Globe2, Instagram, MapPin } from "lucide-react";
import { useState } from "react";

interface MiniProfileCardProps {
  age: number;
  gender: string;
  location: {
    city: string;
    region: string;
    country: string;
  };
  height?: number;
  instagramConnected?: boolean;
  bio?: string;
  interests?: string[];
  descriptors?: string[];
}

export default function MiniProfileCard({
  age,
  gender,
  location,
  height,
  instagramConnected = false,
  bio,
  interests = [],
  descriptors = [],
}: MiniProfileCardProps) {
  const unknownLocation =
    !location?.city && !location?.region && !location?.country;

  const [openLocationModal, setOpenLocationModal] = useState(false);

  return (
    <Card.Container className="w-full max-w-sm overflow-hidden">
      <div className="h-12 bg-gradient-to-r from-rose-500 to-rose-300" />
      <Card.Content className="space-y-3 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">{`${toTitleCase(gender)}, ${age}`}</h2>
            <div className="text-muted-foreground flex items-center text-sm">
              <MapPin className="mr-1 h-3 w-3" />
              {unknownLocation
                ? "Unknown"
                : `${location.city}, ${location.region}, ${location.country}`}
              <Button onClick={() => setOpenLocationModal(true)}>
                open modal
              </Button>
              <Modal
                isOpen={openLocationModal}
                onClose={() => setOpenLocationModal(false)}
                title="Edit Location"
              >
                <ProfileLocationForm
                  profileLocation={location}
                  onSave={(data) => {
                    console.log(data);
                  }}
                />
              </Modal>
            </div>
          </div>
          <div className="flex gap-1">
            {height && (
              <Badge variant="secondary" className="h-6">
                <Globe2 className="mr-1 h-3 w-3" />
                {height}cm
              </Badge>
            )}
            {instagramConnected && (
              <Badge variant="secondary" className="h-6">
                <Instagram className="h-3 w-3" />
              </Badge>
            )}
          </div>
        </div>

        {bio && <p className="text-sm">{bio}</p>}

        {interests.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {interests.map((interest) => (
              <Badge key={interest} variant="outline" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        )}

        {descriptors.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {descriptors.map((descriptor) => (
              <Badge key={descriptor} variant="secondary" className="text-xs">
                {descriptor}
              </Badge>
            ))}
          </div>
        )}
      </Card.Content>
    </Card.Container>
  );
}
