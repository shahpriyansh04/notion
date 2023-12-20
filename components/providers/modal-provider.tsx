"use client";

import { useEffect, useState } from "react";

import { useSettings } from "@/hooks/use-settings";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { CoverImageModal } from "../modals/CoverImageModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }

  <>
    <SettingsModal />
    <CoverImageModal />
  </>;
};
