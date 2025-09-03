import { BeeMiddlewareErrorHandler } from "@/components/bee-ui/BeeMiddlewareErrorHandler";
import BeeTitle from "@/components/bee-ui/BeeTitle";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { PaysheetsProvider } from "@/context/PaysheetContext";
import { SessionProvider } from "@/context/SessionContext";
import { TemplatesProvider } from "@/context/TemplatesProvider";
import { UsersProvider } from "@/context/UsersProvider";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <PaysheetsProvider>
        <UsersProvider>
          <TemplatesProvider>
            <SidebarProvider className="flex w-full h-screen">
              <AppSidebar />
              <SidebarInset className="flex-1 flex flex-col overflow-hidden">
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                  <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                      orientation="vertical"
                      className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <BeeTitle />
                  </div>
                </header>
                <div className="flex-1 px-4 py-1 my-2 overflow-auto bg-accent">
                  {children}
                </div>
              </SidebarInset>
            </SidebarProvider>
            <Suspense fallback={null}>
              <BeeMiddlewareErrorHandler />
            </Suspense>
          </TemplatesProvider>
        </UsersProvider>
      </PaysheetsProvider>
    </SessionProvider>
  );
}
