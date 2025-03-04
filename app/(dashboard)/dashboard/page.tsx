"use client";

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Users, Building, AlertTriangle } from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()

  // Affiche la session dans la console pour debug
  useEffect(() => {
    if (status === "authenticated") {
      console.log("✅ Utilisateur connecté :", session)
    } else if (status === "unauthenticated") {
      console.log("❌ Aucun utilisateur connecté.")
    }
  }, [session, status])
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Chantiers actifs
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">
                +1 depuis le mois dernier
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Employés disponibles
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                -3 par rapport à la semaine dernière
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Affectations aujourd'hui
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">38</div>
              <p className="text-xs text-muted-foreground">
                +5 par rapport à hier
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conflits d'affectation
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                -4 par rapport à la semaine dernière
              </p>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="planning" className="space-y-4">
          <TabsList>
            <TabsTrigger value="planning">Planning du jour</TabsTrigger>
            <TabsTrigger value="chantiers">Chantiers en cours</TabsTrigger>
            <TabsTrigger value="conflits">Conflits d'affectation</TabsTrigger>
          </TabsList>
          <TabsContent value="planning" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Planning du jour</CardTitle>
                <CardDescription>
                  Vue d'ensemble des affectations pour aujourd'hui
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="rounded-md border">
                  <div className="grid grid-cols-3 gap-4 p-4 font-medium">
                    <div>Employé</div>
                    <div>Chantier</div>
                    <div>Horaires</div>
                  </div>
                  <div className="divide-y divide-border rounded-md border">
                    <div className="grid grid-cols-3 gap-4 p-4">
                      <div>Martin Dupont</div>
                      <div>Hangar Industriel - Bordeaux</div>
                      <div>8h00 - 16h00</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-4">
                      <div>Sophie Lefebvre</div>
                      <div>Bureaux Modernes - Toulouse</div>
                      <div>9h00 - 17h00</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-4">
                      <div>Jean Moreau</div>
                      <div>Magasin Central - Lyon</div>
                      <div>7h30 - 15h30</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-4">
                      <div>Lucie Bernard</div>
                      <div>Entrepôt Logistique - Marseille</div>
                      <div>8h00 - 16h00</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-4">
                      <div>Thomas Petit</div>
                      <div>Hangar Industriel - Bordeaux</div>
                      <div>8h00 - 16h00</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="chantiers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Chantiers en cours</CardTitle>
                <CardDescription>
                  Liste des chantiers actuellement actifs
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 gap-4 p-4 font-medium">
                    <div>Nom</div>
                    <div>Adresse</div>
                    <div>Date de début</div>
                    <div>Date de fin prévue</div>
                  </div>
                  <div className="divide-y divide-border rounded-md border">
                    <div className="grid grid-cols-4 gap-4 p-4">
                      <div>Hangar Industriel</div>
                      <div>15 rue des Industries, Bordeaux</div>
                      <div>01/03/2025</div>
                      <div>15/06/2025</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 p-4">
                      <div>Bureaux Modernes</div>
                      <div>8 avenue des Affaires, Toulouse</div>
                      <div>15/02/2025</div>
                      <div>30/05/2025</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 p-4">
                      <div>Magasin Central</div>
                      <div>22 rue du Commerce, Lyon</div>
                      <div>10/01/2025</div>
                      <div>20/04/2025</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 p-4">
                      <div>Entrepôt Logistique</div>
                      <div>5 boulevard Maritime, Marseille</div>
                      <div>05/03/2025</div>
                      <div>15/07/2025</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="conflits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conflits d'affectation</CardTitle>
                <CardDescription>
                  Employés affectés à plusieurs chantiers simultanément
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="rounded-md border">
                  <div className="grid grid-cols-3 gap-4 p-4 font-medium">
                    <div>Employé</div>
                    <div>Chantiers en conflit</div>
                    <div>Date</div>
                  </div>
                  <div className="divide-y divide-border rounded-md border">
                    <div className="grid grid-cols-3 gap-4 p-4">
                      <div className="font-medium text-destructive">Pierre Martin</div>
                      <div>Hangar Industriel / Bureaux Modernes</div>
                      <div>15/04/2025</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-4">
                      <div className="font-medium text-destructive">Marie Dubois</div>
                      <div>Magasin Central / Entrepôt Logistique</div>
                      <div>22/04/2025</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}