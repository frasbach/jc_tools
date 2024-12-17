import { Calculator, Home, LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export const siteConfig = {
  name: 'justcurious',
  url: 'https://justcurious.vercel.app',
  ogImage: 'https://ui.shadcn.com/og.jpg',
  description: 'A free, add-free and easy-to-use cost splitter',
  links: {
    twitter: 'https://twitter.com/tw_justcurious',
    github: 'https://github.com/justcurious',
  },
};

export type SiteConfig = typeof siteConfig;

export const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b',
};

export type MetaThemeColor = typeof META_THEME_COLORS;

export const sidebarGroupValues: SidebarGroupType[] = [
  {
    grouptitel: 'Tools',
    items: [
      {
        title: 'Cost Splitter',
        url: '/cost-splitter',
        icon: Calculator,
      },
    ],
  },
];

export type SidebarGroupType = {
  grouptitel: string;
  items: {
    title: string;
    url: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >;
  }[];
};

export type SidebarItemType = SidebarGroupType['items'][number];
