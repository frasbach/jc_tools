import { ModeSwitcher } from "@/components/mode-switcher"
export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
            <div className="flex h-14 items-center px-4">
                <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
                    <nav className="flex items-center gap-0.5">
                        <ModeSwitcher />
                    </nav>
                </div>
            </div>
        </header>
    )
}