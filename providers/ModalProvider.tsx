"use client";
import { CardModal } from "@/components/modals/card-modal";
import ProModal from "@/components/modals/ProModal";
import React, { useEffect, useState } from "react";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CardModal />
      <ProModal/>
    </>
  );
};

export default ModalProvider;
