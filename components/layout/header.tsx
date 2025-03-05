"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building, Calendar, HardHat, LogOut, Menu, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { signOut, useSession } from "next-auth/react"

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const allRoutes = [
    {
      href: "/dashboard",
      label: "Tableau de bord",
      icon: <Calendar className="h-5 w-5 mr-2 ml-10" />,
    },
    {
      href: "/planning",
      label: "Calendrier",
      icon: <Calendar className="h-5 w-5 mr-2" />,
    },
    {
      href: "/affectation",
      label: "Affectation",
      icon: <Users className="h-5 w-5 mr-2" />,
    },
    {
      href: "/chantiers",
      label: "Chantiers",
      icon: <Building className="h-5 w-5 mr-2" />,
    },
    {
      href: "/employes",
      label: "Employés",
      icon: <Users className="h-5 w-5 mr-2" />,
    },
    {
      href: "/competences",
      label: "Compétences",
      icon: <HardHat className="h-5 w-5 mr-2" />,
    },
  ];

  const getFilteredRoutes = () => {
    if (!session) return [];

    const { role } = session.user;

    switch (role) {
      case "ouvrier":
        return allRoutes.filter(route =>
          ["/dashboard", "/planning"].includes(route.href)
        );
      case "chef de chantier":
        return allRoutes.filter(route =>
          !["/employes", "/competences"].includes(route.href)
        );
      case "admin":
        return allRoutes;
      default:
        return [];
    }
  };

  const routes = getFilteredRoutes();

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="grid gap-2 py-6">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-lg font-medium rounded-md hover:bg-accent hover:text-accent-foreground",
                      pathname === route.href ? "bg-accent text-accent-foreground" : ""
                    )}
                  >
                    {route.icon}
                    {route.label}
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  className="flex items-center justify-start px-3 py-2 text-lg font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Déconnexion
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/dashboard" className="flex items-center space-x-2">
            <HardHat className="h-6 w-6" />
            <span className="font-bold inline-block">Édifis Pro</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center transition-colors hover:text-foreground/80",
                  pathname === route.href ? "text-foreground font-medium" : "text-foreground/60"
                )}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut()}
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Déconnexion</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
