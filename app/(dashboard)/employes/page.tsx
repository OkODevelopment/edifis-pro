"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Données fictives pour la démonstration
const employesMock = [
  { id: 1, nom: "Dupont", prenom: "Martin", competences: ["Maçonnerie", "Charpente"] },
  { id: 2, nom: "Lefebvre", prenom: "Sophie", competences: ["Électricité", "Plomberie"] },
  { id: 3, nom: "Moreau", prenom: "Jean", competences: ["Maçonnerie", "Carrelage"] },
  { id: 4, nom: "Bernard", prenom: "Lucie", competences: ["Peinture", "Plâtrerie"] },
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

export default function EmployesPage() {
  const { toast } = useToast()
  const [employes, setEmployes] = useState(employesMock)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newEmploye, setNewEmploye] = useState({
    nom: "",
    prenom: "",
    password: "",
    competences: [] as string[]
  })

  const filteredEmployes = employes.filter(employe => 
    employe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employe.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employe.competences.some(comp => comp.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEmploye(prev => ({ ...prev, [name]: value }))
  }

  const handleCompetenceChange = (competence: string) => {
    setNewEmploye(prev => {
      const competences = prev.competences.includes(competence)
        ? prev.competences.filter(c => c !== competence)
        : [...prev.competences, competence]
      
      return { ...prev, competences }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation basique
    if (!newEmploye.nom || !newEmploye.prenom || !newEmploye.password) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
      })
      return
    }
    
    // Ajouter le nouvel employé
    const newId = Math.max(...employes.map(e => e.id)) + 1
    setEmployes([...employes, { ...newEmploye, id: newId }])
    
    // Réinitialiser le formulaire et fermer la boîte de dialogue
    setNewEmploye({
      nom: "",
      prenom: "",
      password: "",
      competences: []
    })
    setIsDialogOpen(false)
    
    toast({
      title: "Employé créé",
      description: `L'employé "${newEmploye.prenom} ${newEmploye.nom}" a été créé avec succès.`,
    })
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Employés</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvel employé
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouvel employé</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer un nouvel employé.
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
                      value={newEmploye.nom}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="prenom" className="text-right">
                      Prénom*
                    </Label>
                    <Input
                      id="prenom"
                      name="prenom"
                      value={newEmploye.prenom}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Mot de passe*
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={newEmploye.password}
                      onChange={handleInputChange}
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
                            checked={newEmploye.competences.includes(competence.libelle)}
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
                  <Button type="submit">Créer l'employé</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Rechercher un employé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Button type="submit" size="icon" variant="ghost">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEmployes.map((employe) => (
            <Link href={`/employes/${employe.id}`} key={employe.id}>
              <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {employe.prenom[0]}{employe.nom[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{employe.prenom} {employe.nom}</CardTitle>
                      <CardDescription className="line-clamp-1">
                        {employe.competences.join(", ")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex flex-wrap gap-1">
                    {employe.competences.map((competence) => (
                      <span
                        key={competence}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        {competence}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}