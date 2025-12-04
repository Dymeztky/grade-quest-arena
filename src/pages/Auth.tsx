import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Gamepad2, Mail, Lock, User, Chrome } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          toast({
            title: "Login Gagal",
            description: error.message === "Invalid login credentials" 
              ? "Email atau password salah" 
              : error.message,
            variant: "destructive",
          });
        }
      } else {
        if (!displayName.trim()) {
          toast({
            title: "Error",
            description: "Nama tampilan harus diisi",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        const { error } = await signUpWithEmail(email, password, displayName);
        if (error) {
          toast({
            title: "Registrasi Gagal",
            description: error.message.includes("already registered")
              ? "Email sudah terdaftar"
              : error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Berhasil!",
            description: "Akun berhasil dibuat. Selamat datang!",
          });
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan. Coba lagi nanti.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      toast({
        title: "Error",
        description: "Gagal login dengan Google",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/20 rounded-full blur-3xl animate-pulse" />

      <div className="glass-card w-full max-w-md p-8 relative z-10 animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-gold mb-4">
            <Gamepad2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-primary via-gold to-primary bg-clip-text text-transparent">
            ACADEMIX
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? "Masuk ke akun kamu" : "Daftar akun baru"}
          </p>
        </div>

        {/* Google Login */}
        <Button
          variant="outline"
          className="w-full mb-6 h-12 text-base gap-3 border-border/50 hover:bg-muted/50"
          onClick={handleGoogleLogin}
        >
          <Chrome className="w-5 h-5" />
          Lanjutkan dengan Google
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">atau</span>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="displayName">Nama Tampilan</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Nama kamu"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold"
            variant="gold"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : isLogin ? "Masuk" : "Daftar"}
          </Button>
        </form>

        {/* Toggle */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline font-medium"
          >
            {isLogin ? "Daftar sekarang" : "Masuk"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
