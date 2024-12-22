import { AppSidebarProps } from '@/types/interfaces';
import { SidebarGroupType, SidebarItemType } from '@/config/site-config';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/ui-components/sidebar';

export function AppSidebar({ sidebarGroups }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        {sidebarGroups.map((group, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{group.grouptitel}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
