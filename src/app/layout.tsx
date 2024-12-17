import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/theme-provider';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/ui-components/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/ui-components/breadcrumb';
import { Separator } from '@/ui-components/separator';
import { AppSidebar } from '@/custom-components/app-sidebar';
import { sidebarGroupValues } from '@/config/site-config';
import { ModeSwitcher } from '@/ui-components/mode-switcher';
import { SiteFooter } from '@/ui-components/footer';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar sidebarGroups={sidebarGroupValues} />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">JC Tools</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Cost Splitter</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <div className="flex-grow"></div>
                <ModeSwitcher />
              </header>
              <main>{children}</main>
              <SiteFooter />
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
