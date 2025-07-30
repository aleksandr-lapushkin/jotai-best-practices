import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface SectionCardProps {
  title: string
  description: string
  url: string
  icon: LucideIcon
  topics: string[]
}

export function SectionCard({ title, description, url, icon: IconComponent, topics }: SectionCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <ul className="space-y-2 text-sm text-muted-foreground">
          {topics.map((topic, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              {topic}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto">
        <Link 
          to={url}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-sm"
        >
          Learn more
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardFooter>
    </Card>
  )
}