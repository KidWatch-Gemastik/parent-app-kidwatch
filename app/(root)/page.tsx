// import KiddyGooLanding from "@/components/layouts/landing-page";
import MaintenancePage from "@/components/maintenance-page";
export const metadata = {
  title: "Situs Dalam Pemeliharaan - KiddyGoo Parent App",
  description: "Situs sedang dalam pemeliharaan untuk meningkatkan pengalaman pengguna",
}

export default function Home() {
  return (
    <>
      {/* <KiddyGooLanding /> */}

      <MaintenancePage />

    </>
  );
}
