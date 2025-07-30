export function Code({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={`rounded-md bg-muted px-2 py-1 text-sm font-mono text-foreground ${className}`}
      {...props}
    >
      {children}
    </code>
  )
}