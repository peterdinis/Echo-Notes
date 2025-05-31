"use client"

import { FC, RefObject } from "react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";

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
  return (
    <ContextMenu open={open} onOpenChange={setOpen}>
      <ContextMenuTrigger asChild>
        <div ref={triggerRef} />
      </ContextMenuTrigger>
      <ContextMenuContent
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
        }}
      >
        <ContextMenuItem onSelect={() => alert("Akcia 1")}>Akcia 1</ContextMenuItem>
        <ContextMenuItem onSelect={() => alert("Akcia 2")}>Akcia 2</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default DashboardContextMenu;