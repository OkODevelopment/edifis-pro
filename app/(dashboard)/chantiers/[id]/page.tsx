"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Building, Calendar, Edit, MapPin, Plus, Trash, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function ChantierDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const chantierIdStr = params.id as string
  const chantierId = parseInt(chantierIdStr)

  const [chantier, setChantier] = useState(null)
  const [employes, setEmployes] = useState([])
  const [affectations, setAffectations] = useState([])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedChantier, setEditedChantier] = useState(null)
  const [newAffectation, setNewAffectation] = useState({
    id_utilisateur: "",
    date: ""
  })
  const [isAffectationDialogOpen, setIsAffectationDialogOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chantierRes, employesRes, affectationsRes] = await Promise.all([
          fetch(`http://localhost:8080/api/chantiers/${chantierId}`),
          fetch("http://localhost:8080/api/users"),
          fetch(`http://localhost:8080/api/affectations/chantier/${chantierId}`)
        ])

        if (!chantierRes.ok || !employesRes.ok || !affectationsRes.ok) {
          throw new Error("Erreur lors de la récupération des données.")
        }

        const chantierData = await chantierRes.json()
        const employesData = await employesRes.json()
        const affectationsData = await affectationsRes.json()

        setChantier(chantierData)
        setEmployes(employesData)
        setAffectations(affectationsData)
        setEditedChantier(chantierData)
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de charger les données." })
        console.error(error)
      }
    }

    fetchData()
  }, [chantierId, toast])

  if (!chantier) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">Chargement...</h1>
      </div>
    )
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedChantier(prev => ({ ...prev, [name]: value }))
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`http://localhost:8080/api/chantiers/${chantierId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedChantier)
      })

      if (response.ok) {
        setIsEditDialogOpen(false)
        setChantier(editedChantier)
        toast({
          title: "Chantier mis à jour",
          description: `Les informations du chantier "${editedChantier.nom}" ont été mises à jour.`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Échec de la mise à jour du chantier.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour du chantier.",
      })
      console.error(error)
    }
  }

  const handleDeleteChantier = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/chantiers/${chantierId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast({
          title: "Chantier supprimé",
          description: `Le chantier "${chantier.nom}" a été supprimé.`,
        })
        router.push("/chantiers")
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Échec de la suppression du chantier.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression du chantier.",
      })
      console.error(error)
    }
  }

  const handleAffectationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAffectation(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setNewAffectation(prev => ({ ...prev, id_utilisateur: value }))
  }

  const handleAffectationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newAffectation.id_utilisateur || !newAffectation.date) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Veuillez sélectionner un employé et une date.",
      })
      return
    }

    try {
      const response = await fetch("http://localhost:8080/api/affectations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newAffectation, id_chantier: chantierId })
      })

      if (response.ok) {
        const newAffectationData = await response.json()
        setAffectations([...affectations, newAffectationData])
        setNewAffectation({ id_utilisateur: "", date: "" })
        setIsAffectationDialogOpen(false)

        const employe = employes.find(e => e.id === parseInt(newAffectation.id_utilisateur))
        toast({
          title: "Affectation créée",
          description: `${employe?.prenom} ${employe?.nom} a été affecté au chantier pour le ${new Date(newAffectation.date).toLocaleDateString()}.`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Échec de la création de l'affectation.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création de l'affectation.",
      })
      console.error(error)
    }
  }

  const handleDeleteAffectation = async (affectationId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/affectations/${affectationId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setAffectations(affectations.filter(a => a.id !== affectationId))
        toast({
          title: "Affectation supprimée",
          description: "L'affectation a été supprimée avec succès.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Échec de la suppression de l'affectation.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression de l'affectation.",
      })
      console.error(error)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold tracking-tight">{chantier.nom}</h1>
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
                  <DialogTitle>Modifier le chantier</DialogTitle>
                  <DialogDescription>
                    Modifiez les informations du chantier.
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
                        value={editedChantier?.nom}
                        onChange={handleEditInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="description"
                        name="description"
                        value={editedChantier?.description}
                        onChange={handleEditInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date_deb" className="text-right">
                        Date de début
                      </Label>
                      <Input
                        id="date_deb"
                        name="date_deb"
                        type="date"
                        value={editedChantier?.date_deb}
                        onChange={handleEditInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date_fin" className="text-right">
                        Date de fin
                      </Label>
                      <Input
                        id="date_fin"
                        name="date_fin"
                        type="date"
                        value={editedChantier?.date_fin}
                        onChange={handleEditInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="adresse" className="text-right">
                        Adresse
                      </Label>
                      <Input
                        id="adresse"
                        name="adresse"
                        value={editedChantier?.adresse}
                        onChange={handleEditInputChange}
                        className="col-span-3"
                      />
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
                    Cette action ne peut pas être annulée. Cela supprimera définitivement le chantier
                    &quot;{chantier.nom}&quot; et toutes les affectations associées.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteChantier}>
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
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Adresse</p>
                  <p className="text-sm text-muted-foreground">{chantier.adresse}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Période</p>
                  <p className="text-sm text-muted-foreground">
                    Du {new Date(chantier.date_deb).toLocaleDateString()}
                    {chantier.date_fin && ` au ${new Date(chantier.date_fin).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
              {chantier.description && (
                <div className="pt-2">
                  <p className="font-medium">Description</p>
                  <p className="text-sm text-muted-foreground mt-1">{chantier.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Affectations</CardTitle>
                <Dialog open={isAffectationDialogOpen} onOpenChange={setIsAffectationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter une affectation</DialogTitle>
                      <DialogDescription>
                        Affectez un employé à ce chantier pour une date spécifique.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAffectationSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="id_utilisateur" className="text-right">
                            Employé
                          </Label>
                          <Select
                            value={newAffectation.id_utilisateur}
                            onValueChange={handleSelectChange}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Sélectionner un employé" />
                            </SelectTrigger>
                            <SelectContent>
                              {employes.map((employe) => (
                                <SelectItem key={employe.id} value={employe.id.toString()}>
                                  {employe.prenom} {employe.nom}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="date" className="text-right">
                            Date
                          </Label>
                          <Input
                            id="date"
                            name="date"
                            type="date"
                            value={newAffectation.date}
                            onChange={handleAffectationInputChange}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Ajouter l'affectation</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                Employés affectés à ce chantier
              </CardDescription>
            </CardHeader>
            <CardContent>
              {affectations.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune affectation pour ce chantier.</p>
              ) : (
                <div className="space-y-4">
                  {affectations.map((affectation) => {
                    const employe = employes.find(e => e.id === affectation.id_utilisateur)
                    return (
                      <div key={affectation.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{employe?.prenom} {employe?.nom}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(affectation.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAffectation(affectation.id)}
                        >
                          <Trash className="h-4 w-4 text-muted-foreground" />
                        </Button>
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
            <TabsTrigger value="employes">Employés</TabsTrigger>
          </TabsList>
          <TabsContent value="planning" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Planning du chantier</CardTitle>
                <CardDescription>
                  Vue d'ensemble des affectations par date
                </CardDescription>
              </CardHeader>
              <CardContent>
                {affectations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune affectation planifiée.</p>
                ) : (
                  <div className="space-y-4">
                    {Array.from(new Set(affectations.map(a => a.date))).sort().map(date => (
                      <div key={date} className="space-y-2">
                        <h3 className="font-medium">{new Date(date).toLocaleDateString()}</h3>
                        <div className="rounded-md border">
                          {affectations
                            .filter(a => a.date === date)
                            .map(affectation => {
                              const employe = employes.find(e => e.id === affectation.id_utilisateur)
                              return (
                                <div key={affectation.id} className="flex items-center justify-between p-3 border-b last:border-0">
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span>{employe?.prenom} {employe?.nom}</span>
                                  </div>
                                  

                                </div>
                              )
                            })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="employes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Employés affectés</CardTitle>
                <CardDescription>
                  Liste des employés travaillant sur ce chantier
                </CardDescription>
              </CardHeader>
              <CardContent>
                {affectations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun employé affecté à ce chantier.</p>
                ) : (
                  <div className="space-y-4">
                    {Array.from(new Set(affectations.map(a => a.id_utilisateur))).map(employeId => {
                      const employe = employes.find(e => e.id === employeId)
                      const employeAffectations = affectations.filter(a => a.id_utilisateur === employeId)

                      return (
                        <div key={employeId} className="rounded-md border p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Users className="h-5 w-5 text-muted-foreground" />
                              <h3 className="font-medium">{employe?.prenom} {employe?.nom}</h3>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {employeAffectations.length} jour(s) d'affectation
                            </div>
                          </div>
                          <Separator className="my-2" />
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <p className="text-sm font-medium">Dates d'affectation</p>
                              <p className="text-sm text-muted-foreground">
                                {employeAffectations
                                  .map(a => new Date(a.date).toLocaleDateString())
                                  .join(", ")}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
