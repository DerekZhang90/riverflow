import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  type Selection,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { localesName } from "@/i18n/routing";

export default function Locales() { 
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    () => new Set([locale])
  );

  useEffect(() => {
    setSelectedKeys(new Set([locale]));
  }, [locale]);

  const changeLanguage = (selectedLocale: string) => {
    if (selectedLocale === locale) return;

    const cleanPath = pathname?.split("/").filter(Boolean) ?? [];
    if (cleanPath[0] === locale) {
      cleanPath.shift();
    }

    const nextPath = `/${cleanPath.join("/")}` || "/";

    router.push(nextPath, { locale: selectedLocale as any });
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          variant="bordered"
          className="capitalize border-white/20 bg-white/5 text-white backdrop-blur-md"
          startContent={<span role="img" aria-label="globe">🌏</span>}
        >
          {locale.toUpperCase()}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        classNames={{
          base: "min-w-24 rounded-xl border-none bg-[#0f172a] text-white shadow-2xl shadow-black/50 backdrop-blur-xl outline-none",
          list: "p-0",
        }}
        itemClasses={{
          base: "text-sm text-slate-100 px-3 py-2 data-[hover=true]:bg-white/10",
        }}
      >
        {Object.keys(localesName).map((item) => (
          <DropdownItem key={item} onClick={() => changeLanguage(item)}>
            {localesName[item as keyof typeof localesName]}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
