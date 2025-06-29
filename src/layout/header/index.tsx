import { getSession } from "@/lib/auth";
import DesktopHeader from "./components/desktop-header";
import MobileHeader from "./components/mobile-header";

export default async function Header() {
  const session = await getSession();
  const user = session.user;

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
