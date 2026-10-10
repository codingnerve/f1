import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types/media";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { SmartImage } from "@/components/ui/SmartImage";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  image?: ImageAsset;
  breadcrumbs?: Crumb[];
  children?: ReactNode;
  size?: "md" | "lg";
}

export function PageHero({ eyebrow, title, intro, image, breadcrumbs, children, size = "md" }: PageHeroProps) {
  return (
    <section className={cn("on-dark relative isolate overflow-hidden bg-obsidian text-white", size === "lg" ? "min-h-[34rem] lg:min-h-[40rem]" : "min-h-[26rem] lg:min-h-[30rem]")}>
      {image ? (
        <>
          <SmartImage
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            style={{ objectPosition: image.focal ?? "50% 50%" }}
            className="-z-10 object-cover"
          />
          <div aria-hidden="true" className="scrim-hero absolute inset-0 -z-10" />
        </>
      ) : (
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_0%,#23262c_0%,#08090b_60%)]" />
      )}
      <div className={cn("container-page flex flex-col justify-end", size === "lg" ? "min-h-[34rem] py-16 lg:min-h-[40rem] lg:py-20" : "min-h-[26rem] py-14 lg:min-h-[30rem] lg:py-16")}>
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} tone="light" className="mb-auto pb-10" /> : null}
        <div className="max-w-4xl animate-fade-up">
          <p className="eyebrow flex items-center gap-3 text-white/75">
            <span className="rule-red" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="display mt-5 text-[3rem] sm:text-6xl lg:text-[5.5rem]">{title}</h1>
          {intro ? <div className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">{intro}</div> : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
