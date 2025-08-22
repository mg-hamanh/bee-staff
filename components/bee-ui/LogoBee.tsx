import Image from "next/image";
import Link from "next/link";

type LogoBeeProps = {
  href: string;
  type: "image" | "text" | "full";
  width: number;
  height: number;
};

export default function LogoBee({ href, type, width, height }: LogoBeeProps) {
  return (
    <>
      <Link className="flex flex-row items-center justify-center" href={href}>
        {(type === "image" || type === "full") && (
          <Image
            src="/identity.png"
            alt="Logo Bee"
            width={width}
            height={height}
            priority
            unoptimized
          />
        )}

        {(type === "text" || type === "full") && (
          <span className="text-md font-bold">BeeAdmin</span>
        )}
      </Link>
    </>
  );
}
