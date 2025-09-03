import { Inbox } from "lucide-react";

export default function BeeEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div
        className="
  relative flex items-center justify-center
  before:content-[''] before:absolute before:w-14 before:h-14 
  before:rounded-full before:bg-primary/15 before:-z-10
  after:content-[''] after:absolute after:w-20 after:h-20
  after:rounded-full after:bg-primary/10 after:-z-20
"
      >
        <Inbox className="h-10 w-10 relative z-10 text-primary/50" />
      </div>
      <p className="text-sm font-semibold">
        Không tìm thấy kết quả nào phù hợp
      </p>
    </div>
  );
}
