import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type Props = {
  content?: string;
};

export default function BeeHTMLTooltip({ content }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-5 w-5 cursor-pointer" />
      </TooltipTrigger>
      <TooltipContent>
        <div
          dangerouslySetInnerHTML={{
            __html: content ?? "Chưa có mô tả",
          }}
        />
      </TooltipContent>
    </Tooltip>
  );
}
