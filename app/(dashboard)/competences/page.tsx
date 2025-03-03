"use client"

import { useState } from "react"
import { HardHat, Plus, Search, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

// Données fictives pour la démonstration
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

export default function CompetencesPage() {
  const { toast } = useToast()
  const [competences, setCompetences] = useState(competencesMock)
  const [searchTerm, setSearchTerm] = useState("")
  const [newCompetence, setNewCompetence] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredCompetences = competences.filter(competence => 
    competence.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCompetence = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newCompetence.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Veuillez saisir un libellé pour la compétence.",
      })
      return
    }
    
    // Vérifier si la compétence existe déjà
    if (competences.some(c => c.libelle.toLowerCase() === newCompetence.toLowerCase())) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Cette compétence existe déjà.",
      })
      return
    }
    
    // Ajouter la nouvelle compétence
    const newId = Math.max(...competences.map(c => c.id)) + 1
    setCompetences([...competences, { id: newId, libelle: newCompetence }])
    
    // Réinitialiser le formulaire et fermer la boîte de dialogue
    setNewCompetence("")
    setIsDialogOpen(false)
    
    toast({
      title: "Compétence créée",
      description: `La compétence "${newCompetence}" a été créée avec succès.`,
    })
  }

  const handleDeleteCompetence = (id: number) => {
    // Dans une vraie application, on vérifierait si la compétence est utilisée
    // avant de la supprimer
    
    setCompetences(competences.filter(c => c.id !== id))
    
    toast({
      title: "Compétence supprimée",
      description: "La compétence a été supprimée avec succès.",
    })
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Compétences</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle compétence
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle compétence</DialogTitle>
                <DialogDescription>
                  Saisissez le libellé de la nouvelle compétence.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCompetence}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="libelle" className="text-right">
                      Libellé
                    </Label>
                    <Input
                      id="libelle"
                      value={newCompetence}
                      onChange={(e) => setNewCompetence(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Ajouter</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Rechercher une compétence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Button type="submit" size="icon" variant="ghost">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Liste des compétences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredCompetences.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune compétence trouvée.</p>
              ) : (
                filteredCompetences.map((competence) => (
                  <div
                    key={competence.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex items-center gap-2">
                      <HardHat className="h-5 w-5 text-muted-foreground" />
                      <span>{competence.libelle}</span>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action ne peut pas être annulée. Cela supprimera définitivement la compétence
                            &quot;{competence.libelle}&quot;.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCompetence(competence.id)}>
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}