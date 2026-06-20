import type { ReactNode } from "react";
import * as ui from "../uiStyles";

export function NavButton({
  active,
  children,
  icon,
  onClick
}: {
  active: boolean;
  children: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button className={ui.cn(ui.navButtonBase, active && ui.navButtonActive)} onClick={onClick}>
      {icon}
      {children}
    </button>
  );
}
