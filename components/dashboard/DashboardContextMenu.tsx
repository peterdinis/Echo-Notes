"use client";

import { FC, RefObject, useEffect, useRef } from "react";
import { ContextMenuContent, ContextMenuItem } from "../ui/context-menu";
import { createPortal } from "react-dom";

type DashboardContextMenuPropsType = {
  open: boolean;
  setOpen?: (open: boolean) => void;
  triggerRef: RefObject<HTMLDivElement>;
  position: { x: number; y: number };
};

const DashboardContextMenu: FC<DashboardContextMenuPropsType> = ({
  open,
  setOpen,
  triggerRef,
  position,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen?.(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen, triggerRef]);

  if (!open) return null;

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        zIndex: 1000,
      }}
    >
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => alert("Akcia 1")}>Akcia 1</ContextMenuItem>
        <ContextMenuItem onSelect={() => alert("Akcia 2")}>Akcia 2</ContextMenuItem>
      </ContextMenuContent>
    </div>,
    document.body
  );
};

export default DashboardContextMenu;
