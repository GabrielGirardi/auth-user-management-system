import DesktopHeader from "./components/desktop-header";
import MobileHeader from "./components/mobile-header";

type HeaderProps = {
  user: {
    name: string;
    id: string;
    role: "ADMIN" | "VIEWER";
    validUntil?: Date | null;
  };
}

export default async function Header({ user }: HeaderProps) {
  return (
    <>
      <div className="hidden md:block">
        <DesktopHeader user={user} />
      </div>

      <div className="block md:hidden">
        <MobileHeader user={user} />
      </div>
    </>
  )
}
