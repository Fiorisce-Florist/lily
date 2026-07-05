export const NAV_MENU = [
  { key: "home", name: "Home", href: "/" },
  { key: "shop", name: "Shop", href: "/shop" },
] as const satisfies {
  key: "home" | "shop";
  name: string;
  href: string;
}[];
