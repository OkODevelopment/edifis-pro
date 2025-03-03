"use client"

import { useState } from "react"
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
} from "date-fns"
import { Card } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// Données fictives
const employesMock = [
    { id: 1, nom: "Dupont", prenom: "Martin" },
    { id: 2, nom: "Lefebvre", prenom: "Sophie" },
    { id: 3, nom: "Moreau", prenom: "Jean" },
    { id: 4, nom: "Bernard", prenom: "Lucie" },
    { id: 5, nom: "Petit", prenom: "Thomas" },
]

const affectationsMock = [
    { id: 1, id_utilisateur: 1, chantier: "Hangar Industriel", date: "2025-03-15", horaires: "8h00 - 16h00" },
    { id: 2, id_utilisateur: 2, chantier: "Bureaux Modernes", date: "2025-03-15", horaires: "9h00 - 17h00" },
    { id: 3, id_utilisateur: 3, chantier: "Magasin Central", date: "2025-03-16", horaires: "7h30 - 15h30" },
    { id: 4, id_utilisateur: 4, chantier: "Entrepôt Logistique", date: "2025-03-17", horaires: "8h00 - 16h00" },
    { id: 5, id_utilisateur: 5, chantier: "Hangar Industriel", date: "2025-03-18", horaires: "8h00 - 16h00" },
]

// Composant d'une cellule de calendrier
function CalendarCell({
                          day,
                          currentMonth,
                          affectationsForDay,
                          onClick,
                      }: {
    day: Date
    currentMonth: Date
    affectationsForDay: typeof affectationsMock
    onClick: (day: Date) => void
}) {
    const today = new Date()
    const isToday = isSameDay(day, today)
    return (
        <div
            onClick={() => onClick(day)}
            className={`border p-2 h-32 cursor-pointer hover:bg-gray-200 ${
                !isSameMonth(day, currentMonth) ? "bg-gray-100" : ""
            }`}
        >
            {isToday ? (
                <div className="w-6 h-6 flex items-center justify-center bg-blue-500 rounded-full text-white text-sm font-bold">
                    {format(day, "d")}
                </div>
            ) : (
                <div className="text-sm font-bold">{format(day, "d")}</div>
            )}
            <div className="mt-1 text-xs space-y-1">
                {affectationsForDay.map((affectation) => {
                    const employe = employesMock.find((e) => e.id === affectation.id_utilisateur)
                    return (
                        <div key={affectation.id} className="truncate">
                            {employe?.prenom}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default function MonthlyCalendar() {
    // Pour cet exemple, on fixe le mois initial à mars 2025, mais on le rend modifiable
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 2, 1))
    // État pour le jour sélectionné
    const [selectedDay, setSelectedDay] = useState<Date | null>(null)

    // Fonctions de navigation entre mois
    const handlePrevMonth = () => {
        setCurrentMonth((prev) => subMonths(prev, 1))
    }

    const handleNextMonth = () => {
        setCurrentMonth((prev) => addMonths(prev, 1))
    }

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            // Filtrer les affectations pour le jour courant
            const affectationsForDay = affectationsMock.filter((a) =>
                isSameDay(new Date(a.date), day)
            )
            days.push(
                <CalendarCell
                    key={day.toString()}
                    day={day}
                    currentMonth={currentMonth}
                    affectationsForDay={affectationsForDay}
                    onClick={(day) => setSelectedDay(day)}
                />
            )
            day = addDays(day, 1)
        }
        rows.push(
            <div key={day.toString()} className="grid grid-cols-7 gap-1">
                {days}
            </div>
        )
        days = []
    }

    // Détails du jour sélectionné
    const selectedAffectations = selectedDay
        ? affectationsMock.filter((a) =>
            isSameDay(new Date(a.date), selectedDay)
        )
        : []

    return (
        <div className="container py-8">
            {/* En-tête avec titre et navigation du mois */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Calendrier mensuel</h1>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 rounded hover:bg-gray-200"
                        aria-label="Mois précédent"
                    >
                        &larr;
                    </button>
                    <span className="text-lg font-medium">
            {format(currentMonth, "MMMM yyyy")}
          </span>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 rounded hover:bg-gray-200"
                        aria-label="Mois suivant"
                    >
                        &rarr;
                    </button>
                </div>
            </div>

            {/* En-tête des jours */}
            <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
                <div>Lun</div>
                <div>Mar</div>
                <div>Mer</div>
                <div>Jeu</div>
                <div>Ven</div>
                <div>Sam</div>
                <div>Dim</div>
            </div>
            <div className="mt-2 space-y-1">{rows}</div>

            {/* Affichage du détail du jour sélectionné */}
            {selectedDay && (
                <Dialog
                    open={!!selectedDay}
                    onOpenChange={(open) => { if (!open) setSelectedDay(null) }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Détails du {format(selectedDay, "dd MMMM yyyy")}</DialogTitle>
                        </DialogHeader>
                        {selectedAffectations.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Aucune affectation pour ce jour.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {selectedAffectations.map((affectation) => {
                                    const employe = employesMock.find(e => e.id === affectation.id_utilisateur)
                                    return (
                                        <div key={affectation.id} className="border-b pb-1">
                                            <p className="font-medium">Chantier : {affectation.chantier}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Employé : {employe?.prenom} {employe?.nom}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Horaires : {affectation.horaires}
                                            </p>
                                            {/* Vous pouvez ajouter d'autres informations ici si nécessaire */}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                        <DialogFooter>
                            <Button onClick={() => setSelectedDay(null)}>Fermer</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
