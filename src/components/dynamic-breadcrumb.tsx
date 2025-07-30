import { useRouterState, Link } from '@tanstack/react-router'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

interface BreadcrumbSegment {
  title: string
  path: string
  isLast: boolean
}

// Mapping of route paths to human-readable titles
const routeTitleMap: Record<string, string> = {
  '/': 'Home',
  '/overview': 'Overview',
  '/overview/how-it-works': 'How it works',
  '/overview/setup': 'Jotai Setup',
  '/concepts': 'Core Concepts',
  '/concepts/declaring-atoms': 'Structuring atoms',
  '/concepts/action-atoms': 'Action atoms',
  '/concepts/exporting-atoms': 'Exporting atoms',
  '/concepts/effects': 'Effects',
  '/utilities': 'Atom Utilities',
  '/utilities/atomWithDefault': 'atomWithDefault',
  '/utilities/atomFamily': 'atomFamily',
  '/utilities/atomWithReducer': 'atomWithReducer',
  '/utilities/atomWithQuery': 'atomWithQuery variants',
  '/advanced': 'Advanced Topics',
  '/advanced/async': 'Managing Async',
  '/advanced/testing': 'Testing',
  '/examples': 'Examples',
  '/examples/basic-counter': 'Basic Counter',
  '/examples/action-atoms': 'Action Atoms',
  '/examples/async-data': 'Async Data Fetching',
  '/examples/form-management': 'Form Management',
  '/examples/persistence': 'State Persistence',
}

function generateBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  // Handle root path
  if (pathname === '/') {
    return [{ title: 'Home', path: '/', isLast: true }]
  }

  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbSegment[] = []

  // Always start with Home
  breadcrumbs.push({ title: 'Home', path: '/', isLast: false })

  // Build up the path segments
  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1
    const title = routeTitleMap[currentPath] || segment
    
    breadcrumbs.push({
      title,
      path: currentPath,
      isLast
    })
  })

  return breadcrumbs
}

export function DynamicBreadcrumb() {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  const breadcrumbs = generateBreadcrumbs(pathname)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.path} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator className="mr-2" />}
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={crumb.path}>{crumb.title}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}