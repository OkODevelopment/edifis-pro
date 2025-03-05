"use client"

import { useState, useEffect } from "react"
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
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface Employe {
  id: number;
  nom: string;
  prenom: string;
}

interface Chantier {
  id: number;
  nom: string;
}

export default function AssignPage() {
    const [employes, setEmployes] = useState<Employe[]>([]);
    const [chantiers, setChantiers] = useState<Chantier[]>([]);
    const [employeeId, setEmployeeId] = useState("");
    const [chantierId, setChantierId] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [role, setRole] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const { toast } = useToast();
    const router = useRouter(); 
    const { data: session, status } = useSession()

    useEffect(() => {
        if (status === "authenticated") {
            console.log("✅ Utilisateur connecté :", session);
        } else if (status === "unauthenticated") {
            router.push("/login");
        }
    }
    , [session, status]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [employesRes, chantiersRes] = await Promise.all([
                    fetch("http://localhost:8080/api/users"),
                    fetch("http://localhost:8080/api/chantiers"),
                ]);

                if (!employesRes.ok || !chantiersRes.ok) {
                    throw new Error("Erreur lors de la récupération des données.");
                }

                const employesData = await employesRes.json();
                const chantiersData = await chantiersRes.json();

                setEmployes(employesData);
                setChantiers(chantiersData);
            } catch (error) {
                toast({ title: "Erreur", description: "Impossible de charger les données." });
                console.error(error);
            }
        };

        fetchData();
    }, [toast]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!employeeId || !chantierId || !selectedDate || !role) {
            toast({
                variant: "destructive",
                title: "Erreur de validation",
                description: "Veuillez sélectionner un employé, un chantier, une date et un rôle.",
            });
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/affectations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_utilisateur: employeeId,
                    id_chantier: chantierId,
                    date: selectedDate?.toISOString().split('T')[0],
                    role: role,
                }),
            });

            if (response.ok) {
                setSubmitted(true);
                toast({
                    title: "Affectation créée",
                    description: "L'affectation a été créée avec succès.",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Échec de la création de l'affectation.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur s'est produite lors de la création de l'affectation.",
            });
            console.error(error);
        }
    };

    return (
        <div className="container py-8">
            <form onSubmit={handleSubmit}>
                <Card className="mx-auto w-full max-w-3xl">
                    <CardHeader>
                        <CardTitle>Assigner un employé</CardTitle>
                        <CardDescription>
                            Remplissez le formulaire pour affecter un employé sur un chantier.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
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
                                            {employes.map((employee) => (
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
                                    <Select onValueChange={(value) => setChantierId(value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un chantier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {chantiers.map((chantier) => (
                                                <SelectItem key={chantier.id} value={chantier.id.toString()}>
                                                    {chantier.nom}
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
                                    <Label htmlFor="role" className="mb-1">
                                        Rôle
                                    </Label>
                                    <Input
                                        type="text"
                                        id="role"
                                        placeholder="ex: Chef de chantier"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
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
    );
}
