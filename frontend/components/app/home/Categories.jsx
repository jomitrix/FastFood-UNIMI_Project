import { useRouter } from "next/navigation";
import { Chip } from "@heroui/chip";
import { courses } from "@/utils/lists";
import { Button } from "@heroui/button";

export default function TopCategories() {
  const router = useRouter();
  
  return (
    <section
      className="
        flex flex-col items-center gap-8 px-4 pb-10"
    >
      {/* Card circolare con icona */}
      <img src="/images/service.svg" className="w-16 h-16 text-warning-600" />

      {/* Titolo */}
      <h2 className="text-4xl font-extrabold text-center">
        Top Categories
      </h2>

      {/* Lista chip, va automaticamente a capo se serve */}
      <div className="flex flex-wrap justify-center gap-4 max-w-5xl">
        {courses.map((course) => (
          <Chip
            key={course.name}
            variant="flat"
            as={Button}
            className="px-6 py-3 text-lg text-white font-semibold bg-[#083d77]"
            onPress={() => {
              localStorage.setItem("course", course.name);
              if (localStorage.getItem("selectedAddressId") === null) {
                localStorage.setItem("selectedAddressId", 1);
              }
              router.push("/search");
            }}
          >
            {course.name}
          </Chip>
        ))}
      </div>
    </section>
  );
}
