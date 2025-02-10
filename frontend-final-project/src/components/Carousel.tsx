import Image from "next/image";
import { useSearchBar } from "@/store/zustand";

function Carousel() {
  const brands = [
    "/assets/brands/adidas.png",
    "/assets/brands/nike.png",
    "/assets/brands/jordan.png",
    "/assets/brands/converse.png",
    "/assets/brands/new-balance.png",
    "/assets/brands/asics.png",
    "/assets/brands/fila.png",
    "/assets/brands/puma.png",
    "/assets/brands/reebok.png",
    "/assets/brands/timberland.png",
    "/assets/brands/vans.png",
  ];

  const { isOpenSearchBar } = useSearchBar();

  return (
    <div
      className={`overflow-hidden relative bg-background border-b-[1px] border-[#C3C3C3] ${
        isOpenSearchBar && "opacity-30"
      }`}
    >
      <div className="flex animate-marquee space-x-8">
        {[...Array(5)].flatMap((_, repeat) =>
          brands.map((brand, index) => (
            <div
              key={`${repeat}-${index}`}
              className="w-14 h-14 md:w-24 md:h-24 relative flex-shrink-0"
            >
              <Image
                src={brand}
                alt={`Brand ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain opacity-50"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Carousel;
