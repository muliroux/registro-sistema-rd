import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Building2,
  Users,
  Mail,
  Lock,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserCreate {
  nome_completo: string;
  codigo_a?: string;
  email: string;
  password: string;
  roles_list: number[];
  filial_id?: number;
}

interface UserCreateResponse {
  id: number;
  login: string;
  roles: number[];
  createdAt: Date;
}

const FILIAIS = [
  { id: 1, name: "HOLDING" },
  { id: 2, name: "NATAL" },
  { id: 3, name: "SP1" },
  { id: 4, name: "SP2" },
  { id: 5, name: "RJ" },
];

const ROLES = [
  { id: 1, name: "DESENVOLVEDOR" },
  { id: 2, name: "ADMINISTRADOR" },
  { id: 3, name: "GESTOR" },
  { id: 4, name: "ASSESSOR" },
  { id: 5, name: "OPERADOR" },
  { id: 6, name: "OPERADOR_JR" },
];

export default function RegistrationForm() {
  const [formData, setFormData] = useState<UserCreate>({
    nome_completo: "",
    codigo_a: "",
    email: "",
    password: "",
    roles_list: [],
    filial_id: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({
    success: false,
    result: null,
  });
  const [error, setError] = useState("");
  const { toast } = useToast();
  const apiUrl = import.meta.env.VITE_API_URI;
  const webUrl = import.meta.env.VITE_WEB_URI;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!apiUrl) {
    //   toast({
    //     title: "Erro",
    //     description: "Por favor, configure a URL da sua API",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    if (formData.password.length < 8) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 8 caracteres",
        variant: "destructive",
      });
      return;
    }

    if (formData.roles_list.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um cargo",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          codigo_a: formData.codigo_a || null,
          filial_id: formData.filial_id || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Erro no registro");
      }

      setSuccess({
        success: true,
        result: result,
      });
      toast({
        title: "Sucesso!",
        description: "Usuário registrado com sucesso",
      });

      // Reset form
      setFormData({
        nome_completo: "",
        codigo_a: "",
        email: "",
        password: "",
        roles_list: [],
        filial_id: undefined,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      toast({
        title: "Erro no registro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (roleId: number, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        roles_list: [...prev.roles_list, roleId],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        roles_list: prev.roles_list.filter((id) => id !== roleId),
      }));
    }
  };

  if (success.success && success.result) {
    return (
      <div className="min-h-screen bg-teal-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-elegant">
          <CardContent className="pt-8 text-center">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Registro Concluído!
            </h2>
            <p className="text-muted-foreground mb-6">
              O usuário foi registrado com sucesso no sistema.
            </p>
            <p className="text-muted-foreground mb-6">
              Seu login é {success.result.login}!
            </p>
            <div className="flex flex-col gap-4 mt-6">
              <Button className="w-full bg-teal-600 border-0 hover:opacity-90 hover:bg-teal-400 transition-smooth">
                <a href={webUrl}>Entre no sistema!</a>
              </Button>
              <Button
                onClick={() =>
                  setSuccess({
                    success: false,
                    result: null,
                  })
                }
                className="w-full bg-teal-700 border-0 hover:opacity-90 hover:bg-teal-500 transition-smooth">
                Registrar Novo Usuário
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-elegant">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 bg-teal-700 rounded-full flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold bg-teal-700 bg-clip-text text-transparent">
            Registro de Usuário
          </CardTitle>
          <CardDescription className="text-lg">
            Preencha os dados para registrar um novo usuário no sistema
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Configuração da API */}
          {/* <div className="bg-accent/50 p-4 rounded-lg border">
            <Label
              htmlFor="apiUrl"
              className="text-sm font-medium flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4" />
              URL da API
            </Label>
            <Input
              id="apiUrl"
              type="url"
              placeholder="https://sua-api.com"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="transition-smooth focus:shadow-soft"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Configure a URL base da sua API (ex: https://api.exemplo.com)
            </p>
          </div> */}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="nome_completo"
                  className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome Completo *
                </Label>
                <Input
                  id="nome_completo"
                  type="text"
                  required
                  value={formData.nome_completo}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      nome_completo: e.target.value,
                    }))
                  }
                  className="transition-smooth focus:shadow-soft"
                  placeholder="João Silva Santos"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigo_a">Código A (Ex.: A12345)</Label>
                <Input
                  id="codigo_a"
                  type="text"
                  value={formData.codigo_a}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      codigo_a: e.target.value,
                    }))
                  }
                  className="transition-smooth focus:shadow-soft"
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="transition-smooth focus:shadow-soft"
                  placeholder="joao.silva@empresa.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Senha *
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="transition-smooth focus:shadow-soft"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Filial
              </Label>
              <Select
                value={formData.filial_id?.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    filial_id: value ? parseInt(value) : undefined,
                  }))
                }>
                <SelectTrigger className="transition-smooth focus:shadow-soft">
                  <SelectValue placeholder="Selecione uma filial (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {FILIAIS.map((filial) => (
                    <SelectItem key={filial.id} value={filial.id.toString()}>
                      {filial.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Cargos *
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((role) => (
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={formData.roles_list.includes(role.id)}
                      onCheckedChange={(checked) =>
                        handleRoleChange(role.id, checked as boolean)
                      }
                      className="transition-smooth  border-teal-400"
                    />
                    <Label
                      htmlFor={`role-${role.id}`}
                      className="text-sm font-normal cursor-pointer ">
                      {role.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 border-0 hover:opacity-90 hover:bg-teal-500 transition-smooth shadow-elegant text-lg py-6">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Registrar Usuário"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
