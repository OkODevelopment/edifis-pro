"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Building, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ChantiersPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { data: session, status } = useSession();

  interface Chantier {
    id: number;
    nom: string;
    description: string;
    date_deb: string;
    date_fin?: string;
    adresse: string;
  }

  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newChantier, setNewChantier] = useState<Chantier>({
    id: 0,
    nom: "",
    description: "",
    date_deb: "",
    date_fin: "",
    adresse: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role === "ouvrier") {
        router.push("/dashboard");
      }
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchChantiers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/chantiers");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des chantiers.");
        }
        const data = await response.json();
        setChantiers(data);
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de charger les chantiers." });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChantiers();
  }, [toast]);

  const filteredChantiers = chantiers.filter(chantier =>
    chantier.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chantier.adresse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewChantier(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newChantier.nom || !newChantier.date_deb || !newChantier.adresse) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }

    const response = await fetch("http://localhost:8080/api/chantiers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newChantier)
    });

    if (response.ok) {
      const createdChantier = await response.json();
      setChantiers([...chantiers, createdChantier]);

      setNewChantier({
        id: 0,
        nom: "",
        description: "",
        date_deb: "",
        date_fin: "",
        adresse: ""
      });
      setIsDialogOpen(false);

      toast({
        title: "Chantier créé",
        description: `Le chantier "${newChantier.nom}" a été créé avec succès.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Échec de la création du chantier.",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-10">Chargement des chantiers...</div>;
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Chantiers</h1>
          {session?.user.role === "admin" && (
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
          )}
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
  );
}
