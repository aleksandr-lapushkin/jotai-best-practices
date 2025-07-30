import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/overview",
      items: [
        {
          title: "How it works",
          url: "/overview/how-it-works",
        },
        {
          title: "Jotai Setup",
          url: "/overview/setup",
        },
      ],
    },
    {
      title: "Core Concepts",
      url: "/concepts",
      items: [
        {
          title: "Structuring atoms",
          url: "/concepts/declaring-atoms",
        },
        {
          title: "Action atoms",
          url: "/concepts/action-atoms",
        },
        {
          title: "Exporting atoms",
          url: "/concepts/exporting-atoms",
        },
        {
          title: "Effects",
          url: "/concepts/effects",
        },
      ],
    },
    {
      title: "Atom Utilities",
      url: "/utilities",
      items: [
        {
          title: "atomWithDefault",
          url: "/utilities/atomWithDefault",
        },
        {
          title: "atomFamily",
          url: "/utilities/atomFamily",
        },
        {
          title: "atomWithReducer",
          url: "/utilities/atomWithReducer",
        },
        {
          title: "atomWithQuery variants",
          url: "/utilities/atomWithQuery",
        },
      ],
    },
    {
      title: "Advanced Topics",
      url: "/advanced",
      items: [
        {
          title: "Managing Async",
          url: "/advanced/async",
        },
        {
          title: "Testing",
          url: "/advanced/testing",
        },
      ],
    },
    {
      title: "Examples",
      url: "/examples",
      items: [
        {
          title: "Basic Counter",
          url: "/examples/basic-counter",
        },
        {
          title: "Action Atoms",
          url: "/examples/action-atoms",
        },
        {
          title: "Async Data Fetching",
          url: "/examples/async-data",
        },
        {
          title: "Form Management",
          url: "/examples/form-management",
        },
        {
          title: "State Persistence",
          url: "/examples/persistence",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Jotai Best Practices</span>
                  <span className="">Presentation Guide</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to={item.url} className="font-medium">
                    {item.title}
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
