import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted p-4 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-6 relative">
          <ShieldAlert className="h-24 w-24 text-red-500 mx-auto mb-2" />
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-black font-bold rounded-full h-8 w-8 flex items-center justify-center animate-bounce">
            !
          </div>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Whoops! Nothing to see here...</h1>
        <h2 className="text-2xl font-bold text-red-500 mb-6">SECURITY ALERT</h2>

        <div className="bg-card p-6 rounded-lg shadow-lg mb-8 border border-border">
          <p className="text-xl mb-4">Nice try, secret agent! 🕵️</p>
          <p className="mb-4">
            Our highly sophisticated security hamsters have detected your sneaky attempt to access a restricted area.
          </p>
          <p className="text-sm text-muted-foreground italic mb-4">
            Your IP, browser history, and favorite ice cream flavor have been recorded for future reference.
          </p>
          <div className="p-4 bg-muted rounded-md text-left">
            <code className="text-sm">
              Error: User attempted to access admin area without proper clearance level.
              <br />
              Solution: Return to safety immediately!
            </code>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to safety
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="javascript:history.back()">
              <ArrowLeft className="h-4 w-4" />
              Retreat!
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
