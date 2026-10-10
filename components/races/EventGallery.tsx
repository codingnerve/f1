import type { ImageAsset } from "@/types/media";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/ui/SmartImage";

/** Editorial gallery: one large lead image with supporting frames. Captions credit each photographer. */
export function EventGallery({ images, className }: { images: ImageAsset[]; className?: string }) {
  if (images.length === 0) return null;
  const [lead, ...rest] = images;
  return (
    <div className={cn("grid gap-3 md:grid-cols-3 md:grid-rows-2", className)}>
      <figure className={cn("group relative overflow-hidden bg-carbon", rest.length ? "aspect-[4/3] md:col-span-2 md:row-span-2 md:aspect-auto md:min-h-[28rem]" : "aspect-[16/9] md:col-span-3")}>
        <SmartImage
          src={lead.src}
          alt={lead.alt}
          fill
          sizes="(min-width: 768px) 66vw, 100vw"
          style={{ objectPosition: lead.focal ?? "50% 50%" }}
          className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
        />
        <figcaption className="absolute right-0 bottom-0 bg-obsidian/70 px-2 py-1 text-[0.625rem] text-white/80">
          Photo: {lead.credit.author} · {lead.credit.license}
        </figcaption>
      </figure>
      {rest.slice(0, 2).map((image) => (
        <figure key={image.src} className="group relative aspect-[4/3] overflow-hidden bg-carbon md:aspect-auto">
          <SmartImage
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            style={{ objectPosition: image.focal ?? "50% 50%" }}
            className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
          />
          <figcaption className="absolute right-0 bottom-0 bg-obsidian/70 px-2 py-1 text-[0.625rem] text-white/80">
            Photo: {image.credit.author} · {image.credit.license}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
