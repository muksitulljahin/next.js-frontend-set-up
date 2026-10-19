import { PageHeader } from "@/Components/Reusable/PageHeader";
import { Button } from "@/Components/Reusable/button";

export default function page() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <PageHeader className=" w-fit" />
      <Button>
        <span>Button</span>
      </Button>
    </div>
  );
}
