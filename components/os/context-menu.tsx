"use client";

type MenuAction = {
  label: string;
  onClick: () => void;
};

export function ContextMenu({
  x,
  y,
  actions,
}: {
  x: number;
  y: number;
  actions: MenuAction[];
}) {
  return (
    <div
      className="desktop-flyout absolute z-[400] min-w-56 p-1 text-sm text-[var(--desktop-flyout-text)]"
      style={{ left: x, top: y }}
    >
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={action.onClick}
          className="flex w-full items-center px-3 py-2 text-left hover:bg-[var(--desktop-flyout-hover)]"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
