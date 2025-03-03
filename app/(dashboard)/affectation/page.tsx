"use client"

import { useState } from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"

const employesMock = [
    { id: 1, nom: "Dupont", prenom: "Martin" },
    { id: 2, nom: "Lefebvre", prenom: "Sophie" },
    { id: 3, nom: "Moreau", prenom: "Jean" },
    { id: 4, nom: "Bernard", prenom: "Lucie" },
    { id: 5, nom: "Petit", prenom: "Thomas" },
]

const chantierOptions = [
    "Hangar Industriel",
    "Bureaux Modernes",
    "Magasin Central",
    "Entrepôt Logistique",
]

export default function AssignPage() {
    const [employeeId, setEmployeeId] = useState("")
    const [chantier, setChantier] = useState("")
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [horaires, setHoraires] = useState("")
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Ici, vous pouvez envoyer les données à votre API ou serveur.
        console.log("Employé ID:", employeeId)
        console.log("Chantier:", chantier)
        console.log("Date:", selectedDate)
        console.log("Horaires:", horaires)
        setSubmitted(true)
    }

    return (
        <div className="container py-8">
            <form onSubmit={handleSubmit}>
                {/* On augmente la taille max de la card pour l'élargir */}
                <Card className="mx-auto w-full max-w-3xl">
                    <CardHeader>
                        <CardTitle>Assigner un employé</CardTitle>
                        <CardDescription>
                            Remplissez le formulaire pour affecter un employé sur un chantier.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* Mise en page en deux colonnes pour prendre plus de place */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="employee" className="mb-1">
                                        Employé
                                    </Label>
                                    <Select onValueChange={(value) => setEmployeeId(value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un employé" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employesMock.map((employee) => (
                                                <SelectItem
                                                    key={employee.id}
                                                    value={employee.id.toString()}
                                                >
                                                    {employee.prenom} {employee.nom}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="chantier" className="mb-1">
                                        Chantier
                                    </Label>
                                    <Select onValueChange={(value) => setChantier(value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un chantier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {chantierOptions.map((option, index) => (
                                                <SelectItem key={index} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="date" className="mb-1">
                                        Date
                                    </Label>
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        initialFocus
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="horaires" className="mb-1">
                                        Horaires
                                    </Label>
                                    <Input
                                        type="text"
                                        id="horaires"
                                        placeholder="ex: 8h00 - 16h00"
                                        value={horaires}
                                        onChange={(e) => setHoraires(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end">
                        <Button type="submit">Assigner</Button>
                    </CardFooter>
                </Card>
            </form>

            {submitted && (
                <div className="mt-4 max-w-3xl mx-auto p-4 bg-green-100 text-green-700 rounded">
                    Affectation soumise avec succès !
                </div>
            )}
        </div>
    )
}
