"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Employe = {
  id: number
  nom: string
  prenom: string
  email: string
  competences: { id: number; libelle: string; niveau: number }[]
}

type Competence = {
  id: number
  libelle: string
}

export default function EmployesPage() {
  const { toast } = useToast()

  const [employes, setEmployes] = useState<Employe[]>([])
  const [competences, setCompetences] = useState<Competence[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [newEmploye, setNewEmploye] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    competences: [] as number[]
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, competencesRes] = await Promise.all([
          fetch("http://localhost:8080/api/users"),
          fetch("http://localhost:8080/api/competences")
        ])

        if (!usersRes.ok || !competencesRes.ok) {
          throw new Error("Erreur de récupération des données.")
        }

        const rawUsers = await usersRes.json()
        const allCompetences = await competencesRes.json()

        setCompetences(allCompetences)

        // ⚠️ Adapte les données pour correspondre au type attendu
        const usersWithCleanData = await Promise.all(
          rawUsers.map(async (user: any) => {
            const userData = user.dataValues || user // Prendre dataValues ou direct selon la réponse
            const userCompetencesRes = await fetch(`http://localhost:8080/api/user-competences/user/${userData.id}`)
            const userCompetences = userCompetencesRes.ok ? await userCompetencesRes.json() : []

            return {
              id: userData.id,
              nom: userData.nom,
              prenom: userData.prenom,
              email: userData.email,
              competences: userCompetences.map((uc: any) => ({
                id: uc.competence.id,
                libelle: uc.competence.libelle,
                niveau: uc.niveau
              }))
            }
          })
        )

        setEmployes(usersWithCleanData)
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de charger les données." })
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const filteredEmployes = employes.filter(employe =>
    employe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employe.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employe.competences.some(comp => comp.libelle.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEmploye(prev => ({ ...prev, [name]: value }))
  }

  const handleCompetenceChange = (id: number) => {
    setNewEmploye(prev => {
      const competences = prev.competences.includes(id)
        ? prev.competences.filter(c => c !== id)
        : [...prev.competences, id]
      return { ...prev, competences }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newEmploye.nom || !newEmploye.prenom || !newEmploye.email || !newEmploye.password) {
      toast({ variant: "destructive", title: "Erreur", description: "Tous les champs sont obligatoires." })
      return
    }

    fetch("http://localhost:8080/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmploye)
    }).then(res => {
      if (res.ok) {
        toast({ title: "Employé créé", description: "L'employé a été ajouté avec succès." })
        setIsDialogOpen(false)
        setNewEmploye({ nom: "", prenom: "", email: "", password: "", competences: [] })
        return fetch("http://localhost:8080/api/users").then(res => res.json()).then(data => setEmployes(data))
      } else {
        toast({ variant: "destructive", title: "Erreur", description: "Échec de la création." })
      }
    })
  }

  if (loading) {
    return <div className="text-center py-10">Chargement des employés...</div>
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Employés</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2" />Nouvel employé</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvel employé</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <Input name="nom" placeholder="Nom" value={newEmploye.nom} onChange={handleInputChange} />
                <Input name="prenom" placeholder="Prénom" value={newEmploye.prenom} onChange={handleInputChange} />
                <Input name="email" placeholder="Email" value={newEmploye.email} onChange={handleInputChange} />
                <Input name="password" type="password" placeholder="Mot de passe" value={newEmploye.password} onChange={handleInputChange} />
                <div>
                  <Label>Compétences</Label>
                  {competences.map(c => (
                    <div key={c.id} className="flex items-center space-x-2">
                      <Checkbox checked={newEmploye.competences.includes(c.id)} onCheckedChange={() => handleCompetenceChange(c.id)} />
                      <Label>{c.libelle}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Créer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 flex gap-2">
        <Input placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <Button variant="ghost"><Search /></Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {filteredEmployes.map(employe => (
          <Link key={employe.id} href={`/employes/${employe.id}`}>
            <Card>
              <CardHeader>
                <Avatar><AvatarFallback>{employe.prenom[0]}{employe.nom[0]}</AvatarFallback></Avatar>
                <CardTitle>{employe.prenom} {employe.nom}</CardTitle>
                <CardDescription>{employe.competences.map(c => c.libelle).join(", ") || "Aucune compétence"}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
