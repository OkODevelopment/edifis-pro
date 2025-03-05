"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Calendar, Edit, HardHat, Trash, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"

type Competence = {
  id: number
  libelle: string
  niveau?: number
  selected?: boolean
}

type Employe = {
  id: number
  nom: string
  prenom: string
  email: string
  competences: Competence[]
}

type Affectation = {
  id: number
  date: string
  chantier: {
    id: number
    nom: string
    adresse: string
  }
}

export default function EmployeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const employeId = parseInt(params.id as string)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const [employe, setEmploye] = useState<Employe | null>(null)
  const [competences, setCompetences] = useState<Competence[]>([])
  const [affectations, setAffectations] = useState<Affectation[]>([])
  const [loading, setLoading] = useState(true)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedEmploye, setEditedEmploye] = useState<Partial<Employe>>({})

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role !== "admin") {
        router.push("/dashboard");
      }
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const headers = { Authorization: `Bearer ${token}` }

        const [employeRes, competencesRes, affectationsRes, allCompetencesRes] = await Promise.all([
          fetch(`http://localhost:8080/api/users/${employeId}`, { headers }),
          fetch(`http://localhost:8080/api/user-competences/user/${employeId}`, { headers }),
          fetch(`http://localhost:8080/api/affectations/utilisateur/${employeId}`, { headers }),
          fetch(`http://localhost:8080/api/competences`, { headers })
        ])

        if (!employeRes.ok || !competencesRes.ok || !affectationsRes.ok || !allCompetencesRes.ok) {
          throw new Error("Erreur lors de la récupération des données.")
        }

        const employeData = await employeRes.json()
        setEmploye(employeData)
        setEditedEmploye(employeData)

        const employeCompetences = await competencesRes.json()
        const allCompetences = await allCompetencesRes.json()

        const enrichedCompetences = allCompetences.map((comp: Competence) => ({
          ...comp,
          selected: employeCompetences.some((uc: any) => uc.competence.id === comp.id),
          niveau: employeCompetences.find((uc: any) => uc.competence.id === comp.id)?.niveau || 1
        }))

        setCompetences(enrichedCompetences)

        const affectationsData = await affectationsRes.json()
        setAffectations(affectationsData)
      } catch (error) {
        toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les données." })
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [employeId, toast, token])

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedEmploye(prev => ({ ...prev, [name]: value }))
  }

  const handleCompetenceChange = (id: number) => {
    setCompetences(prev =>
      prev.map(c => (c.id === id ? { ...c, selected: !c.selected } : c))
    )
  }

  const handleDeleteEmploye = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/users/${employeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        toast({ title: "Employé supprimé", description: "L'employé a été supprimé." })
        router.push("/employes")
      } else {
        toast({ variant: "destructive", title: "Erreur", description: "Impossible de supprimer l'employé." })
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue." })
    }
  }

  const handleSave = async () => {
    const selectedCompetences = competences
      .filter(c => c.selected)
      .map(c => ({ id: c.id, niveau: c.niveau || 1 }))

    const payload = { ...editedEmploye, competences: selectedCompetences }

    try {
      const res = await fetch(`http://localhost:8080/api/users/${employeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast({ title: "Employé mis à jour", description: "Les modifications ont été enregistrées." })
        setIsEditDialogOpen(false)
      } else {
        toast({ variant: "destructive", title: "Erreur", description: "Échec de la mise à jour." })
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Erreur", description: "Une erreur est survenue." })
    }
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>
  if (!employe) return <div className="text-center py-10">Employé non trouvé.</div>

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {employe.prenom[0]}{employe.nom[0]}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold tracking-tight">{employe.prenom} {employe.nom}</h1>
          </div>
          <div className="flex gap-2">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Modifier l'employé</DialogTitle>
                  <DialogDescription>
                    Modifiez les informations de l'employé.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSave}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nom" className="text-right">
                        Nom
                      </Label>
                      <Input
                        id="nom"
                        name="nom"
                        value={editedEmploye.nom || ""}
                        onChange={handleEditInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="prenom" className="text-right">
                        Prénom
                      </Label>
                      <Input
                        id="prenom"
                        name="prenom"
                        value={editedEmploye.prenom || ""}
                        onChange={handleEditInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label className="text-right pt-2">
                        Compétences
                      </Label>
                      <div className="col-span-3 grid grid-cols-2 gap-2">
                        {competences.map((competence) => (
                          <div key={competence.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`competence-${competence.id}`}
                              checked={competence.selected}
                              onCheckedChange={() => handleCompetenceChange(competence.id)}
                            />
                            <Label
                              htmlFor={`competence-${competence.id}`}
                              className="text-sm font-normal"
                            >
                              {competence.libelle} (Niveau {competence.niveau})
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Enregistrer les modifications</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action ne peut pas être annulée. Cela supprimera définitivement l'employé
                    &quot;{employe.prenom} {employe.nom}&quot; et toutes ses affectations.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteEmploye}>
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Identité</p>
                  <p className="text-sm text-muted-foreground">{employe.prenom} {employe.nom}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <HardHat className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Compétences</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {competences.filter(c => c.selected).map((competence) => (
                      <span
                        key={competence.id}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        {competence.libelle} (Niveau {competence.niveau})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Affectations</CardTitle>
              <CardDescription>
                Chantiers auxquels cet employé est affecté
              </CardDescription>
            </CardHeader>
            <CardContent>
              {affectations.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune affectation pour cet employé.</p>
              ) : (
                <div className="space-y-4">
                  {Array.from(new Set(affectations.map(a => a.chantier.id))).map(chantierId => {
                    const chantierAffectations = affectations.filter(a => a.chantier.id === chantierId)

                    return (
                      <div key={chantierId} className="rounded-md border p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{chantierAffectations[0].chantier.nom}</div>
                          <div className="text-sm text-muted-foreground">
                            {chantierAffectations.length} jour(s)
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{chantierAffectations[0].chantier.adresse}</p>
                        <Separator className="my-2" />
                        <div className="text-sm">
                          <span className="font-medium">Dates : </span>
                          {chantierAffectations
                            .map(a => new Date(a.date).toLocaleDateString())
                            .join(", ")}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="planning" className="space-y-4">
          <TabsList>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="conflits">Conflits potentiels</TabsTrigger>
          </TabsList>
          <TabsContent value="planning" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Planning de l'employé</CardTitle>
                <CardDescription>
                  Vue d'ensemble des affectations par date
                </CardDescription>
              </CardHeader>
              <CardContent>
                {affectations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune affectation planifiée.</p>
                ) : (
                  <div className="space-y-4">
                    {affectations
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map(affectation => (
                        <div key={affectation.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{new Date(affectation.date).toLocaleDateString()}</div>
                              <div className="text-sm text-muted-foreground">{affectation.chantier.nom}</div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {affectation.chantier.adresse}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="conflits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conflits potentiels</CardTitle>
                <CardDescription>
                  Détection des affectations multiples à la même date
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const dateCount = affectations.reduce((acc, curr) => {
                    acc[curr.date] = (acc[curr.date] || 0) + 1
                    return acc
                  }, {} as Record<string, number>)

                  const conflictDates = Object.entries(dateCount)
                    .filter(([_, count]) => count > 1)
                    .map(([date]) => date)

                  if (conflictDates.length === 0) {
                    return (
                      <p className="text-sm text-muted-foreground">Aucun conflit détecté.</p>
                    )
                  }

                  return (
                    <div className="space-y-4">
                      {conflictDates.map(date => {
                        const dateAffectations = affectations.filter(a => a.date === date)
                        return (
                          <div key={date} className="rounded-md border border-destructive p-4">
                            <div className="font-medium text-destructive mb-2">
                              Conflit détecté le {new Date(date).toLocaleDateString()}
                            </div>
                            <p className="text-sm mb-3">
                              L'employé est affecté à {dateAffectations.length} chantiers différents le même jour.
                            </p>
                            <div className="space-y-2">
                              {dateAffectations.map(affectation => (
                                <div key={affectation.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                  <div className="font-medium">{affectation.chantier.nom}</div>
                                  <div className="text-sm text-muted-foreground">{affectation.chantier.adresse}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
