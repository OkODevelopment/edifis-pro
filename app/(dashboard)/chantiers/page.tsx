"use client"

import { useState } from "react"
import Link from "next/link"
import { Building, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

// Données fictives pour la démonstration
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

export default function ChantiersPage() {
  const { toast } = useToast()
  const [chantiers, setChantiers] = useState(chantiersMock)
  const [searchTerm, setSearchTerm] = useState("")
  const [newChantier, setNewChantier] = useState({
    nom: "",
    description: "",
    date_deb: "",
    date_fin: "",
    adresse: ""
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredChantiers = chantiers.filter(chantier => 
    chantier.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chantier.adresse.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewChantier(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation basique
    if (!newChantier.nom || !newChantier.date_deb || !newChantier.adresse) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
      })
      return
    }

    // Ajouter le nouveau chantier
    const newId = Math.max(...chantiers.map(c => c.id)) + 1
    setChantiers([...chantiers, { ...newChantier, id: newId }])
    
    // Réinitialiser le formulaire et fermer la boîte de dialogue
    setNewChantier({
      nom: "",
      description: "",
      date_deb: "",
      date_fin: "",
      adresse: ""
    })
    setIsDialogOpen(false)
    
    toast({
      title: "Chantier créé",
      description: `Le chantier "${newChantier.nom}" a été créé avec succès.`,
    })
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Chantiers</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau chantier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau chantier</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer un nouveau chantier.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nom" className="text-right">
                      Nom*
                    </Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={newChantier.nom}
                      onChange={handleInputChange}
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
                      value={newChantier.description}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date_deb" className="text-right">
                      Date de début*
                    </Label>
                    <Input
                      id="date_deb"
                      name="date_deb"
                      type="date"
                      value={newChantier.date_deb}
                      onChange={handleInputChange}
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
                      value={newChantier.date_fin}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="adresse" className="text-right">
                      Adresse*
                    </Label>
                    <Input
                      id="adresse"
                      name="adresse"
                      value={newChantier.adresse}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Créer le chantier</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Rechercher un chantier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Button type="submit" size="icon" variant="ghost">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChantiers.map((chantier) => (
            <Link href={`/chantiers/${chantier.id}`} key={chantier.id}>
              <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>{chantier.nom}</CardTitle>
                  </div>
                  <CardDescription className="line-clamp-1">
                    {chantier.adresse}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {chantier.description || "Aucune description disponible"}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                  <div>Début: {new Date(chantier.date_deb).toLocaleDateString()}</div>
                  {chantier.date_fin && (
                    <div>Fin: {new Date(chantier.date_fin).toLocaleDateString()}</div>
                  )}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}