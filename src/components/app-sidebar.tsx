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
import { Link, useRouterState } from "@tanstack/react-router"
import type { FileRouteTypes } from "@/routeTree.gen"

// Type-safe route references using the generated route tree
type RoutePath = FileRouteTypes['fullPaths']

interface NavItem {
  title: string
  url: RoutePath
}

interface NavSection {
  title: string
  url: RoutePath
  items?: NavItem[]
}

interface NavData {
  navMain: NavSection[]
}

const data: NavData = {
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
          title: "Structuring Atoms",
          url: "/concepts/declaring-atoms",
        },
        {
          title: "Atom Composition",
          url: "/concepts/composition",
        },
        {
          title: "Action Atoms",
          url: "/concepts/action-atoms",
        },
        {
          title: "Exporting & Boundaries",
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
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  // Helper function to check if a path is active
  const isPathActive = (path: string) => {
    // Exact match for current path
    if (currentPath === path) return true
    
    // For index paths like /concepts, also match /concepts/
    if (path !== '/' && currentPath.startsWith(path + '/')) return true
    
    return false
  }


  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Jotai Best Practices</span>
                  <span className="">Presentation Guide</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((section) => {
              const sectionActive = isPathActive(section.url)
              
              return (
                <SidebarMenuItem key={section.title}>
                  <SidebarMenuButton asChild isActive={sectionActive}>
                    <Link to={section.url} className="font-medium">
                      {section.title}
                    </Link>
                  </SidebarMenuButton>
                  {section.items?.length ? (
                    <SidebarMenuSub>
                      {section.items.map((item) => {
                        const itemActive = isPathActive(item.url)
                        
                        return (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild isActive={itemActive}>
                              <Link to={item.url}>{item.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
