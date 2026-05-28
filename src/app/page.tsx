import { VfacApp } from "@/components/vfac-app";
import { getPocData } from "@/lib/repository";

export default function Home() {
  return <VfacApp data={getPocData()} />;
}
