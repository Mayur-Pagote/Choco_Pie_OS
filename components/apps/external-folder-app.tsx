"use client";

export function ExternalFolderApp({
  title,
  src,
}: {
  title: string;
  src: string;
}) {
  return (
    <iframe
      title={title}
      src={src}
      className="h-full w-full border-0"
    />
  );
}
