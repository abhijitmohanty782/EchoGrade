import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from "@/components/ui/sidebar";
import { BookCopy } from "lucide-react";
import { EchoGradeClient } from "@/components/echo-grade-client";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-3 p-2">
            <h1 className="font-bold text-xl text-foreground font-headline">EchoGrade</h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Mathematical Proofs" isActive>
                <BookCopy />
                <span>Mathematical Proofs</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="p-4 sm:p-6 lg:p-8">
          <EchoGradeClient />
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}

export default App; 