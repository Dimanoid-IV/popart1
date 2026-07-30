import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

export default function BlogArticleImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "h-auto w-full rounded-lg object-cover",
  sizes = "(max-width: 768px) 100vw, 720px",
}: Props) {
  if (src.startsWith("http")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      priority={priority}
      sizes={sizes}
    />
  );
}
