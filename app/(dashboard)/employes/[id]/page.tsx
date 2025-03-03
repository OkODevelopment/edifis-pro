"use client"

import { useState } from "react"
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

// Données fictives pour la démonstration
const employesMock = [
  { id: 1, nom: "Dupont", prenom: "Martin", competences: ["Maçonnerie", "Charpente"] },
  { id: 2, nom: "Lefebvre", prenom: "Sophie", competences: ["Électricité", "Plomberie"] },
  { id: 3, nom: "Moreau", prenom: "Jean", competences: ["Maçonnerie", "Carrelage"] },
  { id: 4, nom: "Bernard", prenom: "Lucie", competences: ["Peinture", " Plâtrerie"] },
  { id: 5, nom: "Petit", prenom: "Thomas", competences: ["Charpente", "Couverture"] },
  { id: 6, nom: "Martin", prenom: "Pierre", competences: ["Électricité", "Domotique"] },
  { id: 7, nom: "Dubois", prenom: "Marie", competences: ["Plomberie", "Chauffage"] }
]

const competencesMock = [
  { id: 1, libelle: "Maçonnerie" },
  { id: 2, libelle: "Charpente" },
  { id: 3, libelle: "Électricité" },
  { id: 4, libelle: "Plomberie" },
  { id: 5, libelle: "Carrelage" },
  { id: 6, libelle: "Peinture" },
  { id: 7, libelle: "Plâtrerie" },
  { id: 8, libelle: "Couverture" },
  { id: 9, libelle: "Domotique" },
  { id: 10, libelle: "Chauffage" }
]

const chantiersMock = [
  {
    id: 1,
    nom: "Hangar Industriel",
    description: "Construction d'un hangar industriel de 2000m²",
    date_deb: "2025-03-01",
    date_fin: "2025-06-15",
    adresse: "15 rue des Industries, Bordeaux"
  },
  {
    id: 2,
    nom: "Bureaux Modernes",
    description: "Rénovation complète d'un immeuble de bureaux",
    date_deb: "2025-02-15",
    date_fin: "2025-05-30",
    adresse: "8 avenue des Affaires, Toulouse"
  },
  {
    id: 3,
    nom: "Magasin Central",
    description: "Construction d'un magasin commercial",
    date_deb: "2025-01-10",
    date_fin: "2025-04-20",
    adresse: "22 rue du Commerce, Lyon"
  },
  {
    id: 4,
    nom: "Entrepôt Logistique",
    description: "Agrandissement d'un entrepôt existant",
    date_deb: "2025-03-05",
    date_fin: "2025-07-15",
    adresse: "5 boulevard Maritime, Marseille"
  }
]

const affectationsMock = [
  { id: 1, id_utilisateur: 1, id_chantier: 1, date: "2025-03-15" },
  { id: 2, id_utilisateur: 1, id_chantier: 1, date: "2025-03-16" },
  { id: 3, id_utilisateur: 1, id_chantier: 2, date: "2025-03-20" },
  { id: 4, id_utilisateur: 2, id_chantier: 1, date: "2025-03-15" },
  { id: 5, id_utilisateur: 2, id_chantier: 3, date: "2025-03-18" },
  { id: 6, id_utilisateur: 3, id_chantier: 1, date: "2025-03-16" },
  { id: 7, id_utilisateur: 3, id_chantier: 4, date: "2025-03-22" },
  { id: 8, id_utilisateur: 4, id_chantier: 2, date: "2025-03-17" },
  { id: 9, id_utilisateur: 4, id_chantier: 3, date: "2025-03-25" },
  { id: 10, id_utilisateur: 5, id_chantier: 1, date: "2025-03-18" },
  { id: 11, id_utilisateur: 5, id_chantier: 4, date: "2025-03-28" },
  { id: 12, id_utilisateur: 6, id_chantier: 2, date: "2025-03-19" },
  { id: 13, id_utilisateur: 6, id_chantier: 3, date: "2025-03-30" },
  { id: 14, id_utilisateur: 7, id_chantier: 4, date: "2025-03-21" },
  { id: 15, id_utilisateur: 7, id_chantier: 1, date: "2025-04-02" }
]

export default function EmployeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const employeIdStr = params.id as string
  const employeId = parseInt(employeIdStr)
  
  const employe = employesMock.find(e => e.id === employeId)
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedEmploye, setEditedEmploye] = useState(employe)
  const [affectations, setAffectations] = useState(affectationsMock.filter(a => a.id_utilisateur === employeId))

  if (!employe) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">Employé non trouvé</h1>
        <Button onClick={() => router.push("/employes")} className="mt-4">
          Retour à la liste des employés
        </Button>
      </div>
    )
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedEmploye(prev => ({ ...prev!, [name]: value }))
  }

  const handleCompetenceChange = (competence: string) => {
    setEditedEmploye(prev => {
      const competences = prev!.competences.includes(competence)
        ? prev!.competences.filter(c => c !== competence)
        : [...prev!.competences, competence]
      
      return { ...prev!, competences }
    })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Ici, on simulerait la mise à jour dans la base de données
    // Pour la démo, on affiche juste un toast
    
    setIsEditDialogOpen(false)
    
    toast({
      title: "Employé mis à jour",
      description: `Les informations de l'employé "${editedEmploye!.prenom} ${editedEmploye!.nom}" ont été mises à jour.`,
    })
  }

  const handleDeleteEmploye = () => {
    // Ici, on simulerait la suppression dans la base de données
    // Pour la démo, on redirige vers la liste des employés
    
    toast({
      title: "Employé supprimé",
      description: `L'employé "${employe.prenom} ${employe.nom}" a été supprimé.`,
    })
    
    router.push("/employes")
  }

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
                <form onSubmit={handleEditSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nom" className="text-right">
                        Nom
                      </Label>
                      <Input
                        id="nom"
                        name="nom"
                        value={editedEmploye?.nom}
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
                        value={editedEmploye?.prenom}
                        onChange={handleEditInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        Mot de passe
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Nouveau mot de passe"
                        onChange={handleEditInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label className="text-right pt-2">
                        Compétences
                      </Label>
                      <div className="col-span-3 grid grid-cols-2 gap-2">
                        {competencesMock.map((competence) => (
                          <div key={competence.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`competence-${competence.id}`}
                              checked={editedEmploye?.competences.includes(competence.libelle)}
                              onCheckedChange={() => handleCompetenceChange(competence.libelle)}
                            />
                            <Label
                              htmlFor={`competence-${competence.id}`}
                              className="text-sm font-normal"
                            >
                              {competence.libelle}
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
                    {employe.competences.map((competence) => (
                      <span
                        key={competence}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        {competence}
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
                  {/* Grouper les affectations par chantier */}
                  {Array.from(new Set(affectations.map(a => a.id_chantier))).map(chantierId => {
                    const chantier = chantiersMock.find(c => c.id === chantierId)
                    const chantierAffectations = affectations.filter(a => a.id_chantier === chantierId)
                    
                    return (
                      <div key={chantierId} className="rounded-md border p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{chantier?.nom}</div>
                          <div className="text-sm text-muted-foreground">
                            {chantierAffectations.length} jour(s)
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{chantier?.adresse}</p>
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
                    {/* Trier les affectations par date */}
                    {affectations
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map(affectation => {
                        const chantier = chantiersMock.find(c => c.id === affectation.id_chantier)
                        return (
                          <div key={affectation.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{new Date(affectation.date).toLocaleDateString()}</div>
                                <div className="text-sm text-muted-foreground">{chantier?.nom}</div>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {chantier?.adresse}
                            </div>
                          </div>
                        )
                      })}
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
                {/* Rechercher les dates avec plusieurs affectations */}
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
                              {dateAffectations.map(affectation => {
                                const chantier = chantiersMock.find(c => c.id === affectation.id_chantier)
                                return (
                                  <div key={affectation.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                    <div className="font-medium">{chantier?.nom}</div>
                                    <div className="text-sm text-muted-foreground">{chantier?.adresse}</div>
                                  </div>
                                )
                              })}
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