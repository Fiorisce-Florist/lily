export const NAV_MENU = [
  { key: "home", name: "Home", href: "/" },
  { key: "shop", name: "Shop", href: "/shop" },
  { key: "news", name: "News", href: "/news" },
] as const satisfies {
  key: "home" | "shop" | "news";
  name: string;
  href: string;
}[];
