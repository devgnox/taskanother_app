"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { useMobileSideBar } from "@/hooks/use-mobile-sideBar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const MobileSideBar = () => {
  const pathName = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const isOpen = useMobileSideBar((state) => state.isOpen);
  const onOpen = useMobileSideBar((state) => state.onOpen);
  const onClose = useMobileSideBar((state) => state.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    onClose();
  }, [pathName, onClose]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Button
        onClick={onOpen}
        size="sm"
        variant="ghost"
        className="block md:hidden mr-2"
      >
        <Menu className="w-4 h-4" />
      </Button>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-2 pt-10">
          <Sidebar storageKey="t-sidebar-mobile-state" />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileSideBar;
