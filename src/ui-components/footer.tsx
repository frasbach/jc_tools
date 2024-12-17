import { siteConfig } from '@/config/site-config';

export function SiteFooter() {
  return (
    <footer className="border-grid border-t py-6 md:px-8 md:py-0">
      <div className="container-wrapper">
        <div className="container py-4">
          <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{' '}
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              justcurious
            </a>
            . To support the development of this tool, please consider donating
            via{' '}
            <a
              href={siteConfig.links.paypal}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Paypal
            </a>
            .
          </div>
        </div>
      </div>
    </footer>
  );
}
