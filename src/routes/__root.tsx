import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Provider } from 'jotai'
import { createStore } from 'jotai'
import { DevTools } from 'jotai-devtools'

import 'jotai-devtools/styles.css'
import '../index.css'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'


const store = createStore()

export const Route = createRootRoute({
  component: () => (
    <>
        <Provider store={store}>
                <DevTools store={store} position='bottom-right'/>
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                        <div className="flex items-center gap-2 px-3">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Building Your Application
                                </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        </header>
                        <main className='w-[100%] h-[100%]'>
                        <Outlet />
                        <TanStackRouterDevtools />
                        </main>
       
                    </SidebarInset>
                </SidebarProvider>
            </Provider>
        </>
    ),
})