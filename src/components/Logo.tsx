import Image from "next/image";

/** The BVB Automotive monogram and wordmark, gold on transparent. */
export function Logo({ className = "h-11 w-auto", priority }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/bvb-logo.png"
      alt="BVB Automotive"
      width={250}
      height={153}
      className={className}
      priority={priority}
      unoptimized
    />
  );
}
