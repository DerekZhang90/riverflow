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

    router.push(pathname || "/", { locale: selectedLocale as any });
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
        className="bg-[#111827] text-white border border-white/10"
      >
        {Object.keys(localesName).map((item) => (
          <DropdownItem
            key={item}
            onClick={() => changeLanguage(item)}
            className="text-sm text-slate-100 hover:bg-white/10"
          >
            {localesName[item as keyof typeof localesName]}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
