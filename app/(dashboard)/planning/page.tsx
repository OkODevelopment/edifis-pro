"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
} from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Employe {
  id: number;
  nom: string;
  prenom: string;
}

interface Chantier {
  id: number;
  nom: string;
}

interface Affectation {
  id: number;
  id_utilisateur: number;
  id_chantier: number;
  date: string;
  role?: string;
}

// Fonction pour récupérer les employés depuis l'API
async function fetchEmployes(): Promise<Employe[]> {
  const response = await fetch('http://localhost:8080/api/users');
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des employés');
  }
  return response.json();
}

// Fonction pour récupérer les chantiers depuis l'API
async function fetchChantiers(): Promise<Chantier[]> {
  const response = await fetch('http://localhost:8080/api/chantiers');
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des chantiers');
  }
  return response.json();
}

// Fonction pour récupérer les affectations depuis l'API
async function fetchAffectations(): Promise<Affectation[]> {
  const response = await fetch('http://localhost:8080/api/affectations');
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des affectations');
  }
  return response.json();
}

// Composant d'une cellule de calendrier
function CalendarCell({
  day,
  currentMonth,
  affectationsForDay,
  onClick,
  employes,
}: {
  day: Date;
  currentMonth: Date;
  affectationsForDay: Affectation[];
  onClick: (day: Date) => void;
  employes: Employe[];
}) {
  const today = new Date();
  const isToday = isSameDay(day, today);
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
          const employe = employes.find((e) => e.id === affectation.id_utilisateur);
          return (
            <div key={affectation.id} className="truncate">
              {employe?.prenom}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MonthlyCalendar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 2, 1));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [affectations, setAffectations] = useState<Affectation[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
    } else if (status === "unauthenticated") {
      // Rediriger l'utilisateur vers la page de connexion sur la ligne suivante (/login)
      router.push("/login");
    }
  }, [session, status]);

  useEffect(() => {
    async function loadData() {
      try {
        const employesData = await fetchEmployes();
        const chantiersData = await fetchChantiers();
        const affectationsData = await fetchAffectations();
        setEmployes(employesData);
        setChantiers(chantiersData);
        setAffectations(affectationsData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    }
    loadData();
  }, []);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const rows: JSX.Element[] = [];
  let days: JSX.Element[] = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const affectationsForDay = affectations.filter((a) =>
        isSameDay(new Date(a.date), day)
      );
      days.push(
        <CalendarCell
          key={day.toString()}
          day={day}
          currentMonth={currentMonth}
          affectationsForDay={affectationsForDay}
          onClick={(day) => setSelectedDay(day)}
          employes={employes}
        />
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-1">
        {days}
      </div>
    );
    days = [];
  }

  const selectedAffectations = selectedDay
    ? affectations.filter((a) =>
        isSameDay(new Date(a.date), selectedDay)
      )
    : [];

  return (
    <div className="container py-8">
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
                  const employe = employes.find(e => e.id === affectation.id_utilisateur);
                  const chantier = chantiers.find(c => c.id === affectation.id_chantier);
                  return (
                    <div key={affectation.id} className="border-b pb-1">
                      <p className="font-medium">Chantier : {chantier?.nom}</p>
                      <p className="text-xs text-muted-foreground">
                        Employé : {employe?.prenom} {employe?.nom}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Rôle : {affectation.role}
                      </p>
                    </div>
                  );
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
  );
}
