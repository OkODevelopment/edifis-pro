'use client'

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Users, Building, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

interface Chantier {
  id: number;
  nom: string;
  description?: string;
  date_deb: string;
  date_fin?: string;
  adresse: string;
  statut: string;
}

interface Affectation {
  id: number;
  id_utilisateur: number;
  id_chantier: number;
  date: string;
  role?: string;
}

interface Employe {
  id: number;
  nom: string;
  prenom: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [chantiers, setChantiers] = useState<Chantier[]>([])
  const [affectations, setAffectations] = useState<Affectation[]>([])
  const [employes, setEmployes] = useState<Employe[]>([])

  useEffect(() => {
    if (status === "authenticated") {
      console.log("✅ Utilisateur connecté :", session)
    } else if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [session, status])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chantiersRes, affectationsRes, employesRes] = await Promise.all([
          fetch("http://localhost:8080/api/chantiers"),
          fetch("http://localhost:8080/api/affectations"),
          fetch("http://localhost:8080/api/users"),
        ])

        if (!chantiersRes.ok || !affectationsRes.ok || !employesRes.ok) {
          throw new Error("Erreur lors de la récupération des données.")
        }

        const chantiersData = await chantiersRes.json()
        const affectationsData = await affectationsRes.json()
        const employesData = await employesRes.json()

        setChantiers(chantiersData)
        setAffectations(affectationsData)
        setEmployes(employesData)
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      }
    }

    fetchData()
  }, [])

  const chantiersActifs = chantiers.filter(chantier => chantier.date_fin && new Date(chantier.date_fin) >= new Date())
  const affectationsAujourdhui = affectations.filter(affectation => new Date(affectation.date).toDateString() === new Date().toDateString())

  // Regrouper les affectations par employé et par date
  const affectationsParEmployeEtDate = affectations.reduce((acc, affectation) => {
    const key = `${affectation.id_utilisateur}-${affectation.date}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(affectation)
    return acc
  }, {} as Record<string, Affectation[]>)

  // Vérifier les conflits
  const conflitsAffectation = Object.values(affectationsParEmployeEtDate).filter(affectations => affectations.length > 1)

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
              <div className="text-2xl font-bold">{chantiersActifs.length}</div>
              <p className="text-xs text-muted-foreground">
                {chantiersActifs.length > 0 ? `+${chantiersActifs.length - chantiers.length} depuis le mois dernier` : "Aucun chantier actif"}
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
              <div className="text-2xl font-bold">{employes.length}</div>
              <p className="text-xs text-muted-foreground">
                {employes.length > 0 ? `-${employes.length - chantiers.length} par rapport à la semaine dernière` : "Aucun employé disponible"}
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
              <div className="text-2xl font-bold">{affectationsAujourdhui.length}</div>
              <p className="text-xs text-muted-foreground">
                {affectationsAujourdhui.length > 0 ? `+${affectationsAujourdhui.length - affectations.length} par rapport à hier` : "Aucune affectation aujourd'hui"}
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
              <div className="text-2xl font-bold">{conflitsAffectation.length}</div>
              <p className="text-xs text-muted-foreground">
                {conflitsAffectation.length > 0 ? `-${conflitsAffectation.length - affectations.length} par rapport à la semaine dernière` : "Aucun conflit d'affectation"}
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
                    <div>Rôle</div>
                  </div>
                  <div className="divide-y divide-border rounded-md border">
                    {affectationsAujourdhui.map((affectation) => {
                      const employe = employes.find(e => e.id === affectation.id_utilisateur)
                      const chantier = chantiers.find(c => c.id === affectation.id_chantier)
                      return (
                        <div key={affectation.id} className="grid grid-cols-3 gap-4 p-4">
                          <div>{employe?.prenom} {employe?.nom}</div>
                          <div>{chantier?.nom}</div>
                          <div>{affectation.role}</div>
                        </div>
                      )
                    })}
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
                    {chantiersActifs.map((chantier) => (
                      <div key={chantier.id} className="grid grid-cols-4 gap-4 p-4">
                        <div>{chantier.nom}</div>
                        <div>{chantier.adresse}</div>
                        <div>{new Date(chantier.date_deb).toLocaleDateString()}</div>
                        <div>{chantier.date_fin ? new Date(chantier.date_fin).toLocaleDateString() : "En cours"}</div>
                      </div>
                    ))}
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
                  {conflitsAffectation.length > 0 ? (
                    <div className="divide-y divide-border rounded-md border">
                      {conflitsAffectation.map((affectations, index) => {
                        const employe = employes.find(e => e.id === affectations[0].id_utilisateur)
                        const chantiersEnConflit = affectations
                          .map(a => chantiers.find(c => c.id === a.id_chantier)?.nom)
                          .join(", ")
                        return (
                          <div key={index} className="grid grid-cols-3 gap-4 p-4">
                            <div>{employe?.prenom} {employe?.nom}</div>
                            <div>{chantiersEnConflit}</div>
                            <div>{new Date(affectations[0].date).toLocaleDateString()}</div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">Pas de conflit détecté</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
