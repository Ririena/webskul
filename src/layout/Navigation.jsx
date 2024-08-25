import BottomNavigation from "@/components/navigation/BottomNavigation";
import Header from "@/components/navigation/Header";

export default function Navigation({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <div className="">
        <BottomNavigation />
      </div>
    </>
  );
}
