import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  TrendingUp, 
  Users, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  LogOut,
  Search,
  Eye,
  Send,
  X,
  RefreshCcw
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Client {
  id: string;
  whatsapp_number: string;
  client_name: string | null;
  selected_platform: string | null;
  payment_amount: number | null;
  payment_status: string;
  state: string;
  trading_id: string | null;
  trading_password: string | null;
  login_url: string | null;
  created_at: string;
  wallet_amount: number | null;
}

interface DashboardStats {
  totalClients: number;
  pendingPayments: number;
  completedAccounts: number;
  totalPayments: number;
}

const AdminDashboard = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    pendingPayments: 0,
    completedAccounts: 0,
    totalPayments: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [credentials, setCredentials] = useState({
    tradingId: "",
    password: "",
    loginUrl: "",
    supportContact: "+91 99999 99999",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/admin");
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin]);

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (clientsError) {
        console.error("Error fetching clients:", clientsError);
        toast.error("Failed to load clients");
      } else {
        setClients(clientsData || []);
      }

      // Calculate stats
      const { data: statsData } = await supabase
        .from("clients")
        .select("payment_status, state, payment_amount");

      if (statsData) {
        setStats({
          totalClients: statsData.length,
          pendingPayments: statsData.filter(c => c.payment_status === "pending").length,
          completedAccounts: statsData.filter(c => c.state === "completed").length,
          totalPayments: statsData
            .filter(c => c.payment_status === "paid")
            .reduce((sum, c) => sum + (c.payment_amount || 0), 0),
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin");
    toast.success("Signed out successfully");
  };

  const openClientDialog = (client: Client) => {
    setSelectedClient(client);
    setCredentials({
      tradingId: client.trading_id || "",
      password: client.trading_password || "",
      loginUrl: client.login_url || "",
      supportContact: "+91 99999 99999",
    });
    setIsDialogOpen(true);
  };

  const handleSubmitCredentials = async () => {
    if (!selectedClient) return;

    if (!credentials.tradingId || !credentials.password || !credentials.loginUrl) {
      toast.error("Please fill in all credential fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("clients")
        .update({
          trading_id: credentials.tradingId,
          trading_password: credentials.password,
          login_url: credentials.loginUrl,
          state: "completed",
          admin_assigned: true,
        })
        .eq("id", selectedClient.id);

      if (error) {
        toast.error("Failed to update client");
        console.error(error);
      } else {
        toast.success("Credentials saved! Client will receive WhatsApp notification.");
        setIsDialogOpen(false);
        fetchData();
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.whatsapp_number.includes(searchTerm) ||
      client.selected_platform?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-primary bg-primary/10";
      case "pending":
        return "text-accent bg-accent/10";
      case "failed":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getStateLabel = (state: string) => {
    switch (state) {
      case "awaiting_platform_selection":
        return "Platform Selection";
      case "awaiting_client_name":
        return "Name Collection";
      case "awaiting_payment":
        return "Awaiting Payment";
      case "payment_received":
        return "Payment Received";
      case "admin_processing":
        return "Processing";
      case "completed":
        return "Completed";
      case "expired":
        return "Expired";
      default:
        return state;
    }
  };

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2 text-primary">
          <RefreshCcw className="w-5 h-5 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - TradeID</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="font-display font-bold text-lg">
                  Trade<span className="text-primary">ID</span>
                </span>
                <span className="text-muted-foreground text-sm ml-2">Admin</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
              <div className="text-3xl font-display font-bold">{stats.totalClients}</div>
              <p className="text-sm text-muted-foreground">Total Clients</p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-xs text-muted-foreground">Pending</span>
              </div>
              <div className="text-3xl font-display font-bold text-accent">{stats.pendingPayments}</div>
              <p className="text-sm text-muted-foreground">Pending Payments</p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground">Done</span>
              </div>
              <div className="text-3xl font-display font-bold text-primary">{stats.completedAccounts}</div>
              <p className="text-sm text-muted-foreground">Completed Accounts</p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <Wallet className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground">Revenue</span>
              </div>
              <div className="text-3xl font-display font-bold">₹{stats.totalPayments.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Payments</p>
            </div>
          </div>

          {/* Client Records */}
          <div className="glass-card">
            <div className="p-6 border-b border-border/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="font-display text-xl font-bold">Client Records</h2>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clients..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      State
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                        {searchTerm ? "No clients found matching your search." : "No clients yet. They will appear here when they start onboarding."}
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium">{client.client_name || "—"}</div>
                            <div className="text-sm text-muted-foreground">{client.whatsapp_number}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {client.selected_platform || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {client.payment_amount ? `₹${client.payment_amount}` : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.payment_status)}`}>
                            {client.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {getStateLabel(client.state)}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(client.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openClientDialog(client)}
                            className="gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Client Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">Client Details</DialogTitle>
            </DialogHeader>
            
            {selectedClient && (
              <div className="space-y-6">
                {/* Client Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name</span>
                    <p className="font-medium">{selectedClient.client_name || "—"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">WhatsApp</span>
                    <p className="font-medium">{selectedClient.whatsapp_number}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Platform</span>
                    <p className="font-medium">{selectedClient.selected_platform || "—"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Payment</span>
                    <p className="font-medium">
                      {selectedClient.payment_amount ? `₹${selectedClient.payment_amount}` : "—"}
                      <span className={`ml-2 text-xs ${selectedClient.payment_status === "paid" ? "text-primary" : "text-accent"}`}>
                        ({selectedClient.payment_status})
                      </span>
                    </p>
                  </div>
                </div>

                {/* Credentials Form */}
                {selectedClient.state !== "completed" && selectedClient.payment_status === "paid" && (
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <h4 className="font-display font-semibold">Create Trading Account</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tradingId">Trading ID</Label>
                      <Input
                        id="tradingId"
                        placeholder="Enter trading ID"
                        value={credentials.tradingId}
                        onChange={(e) => setCredentials({ ...credentials, tradingId: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        placeholder="Enter password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="loginUrl">Login URL</Label>
                      <Input
                        id="loginUrl"
                        placeholder="https://..."
                        value={credentials.loginUrl}
                        onChange={(e) => setCredentials({ ...credentials, loginUrl: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supportContact">Support Contact</Label>
                      <Input
                        id="supportContact"
                        placeholder="+91 99999 99999"
                        value={credentials.supportContact}
                        onChange={(e) => setCredentials({ ...credentials, supportContact: e.target.value })}
                      />
                    </div>

                    <Button
                      variant="hero"
                      className="w-full gap-2"
                      onClick={handleSubmitCredentials}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : (
                        <>
                          <Send className="w-4 h-4" />
                          Save & Send to Client
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Show existing credentials if completed */}
                {selectedClient.state === "completed" && selectedClient.trading_id && (
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <h4 className="font-display font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      Account Activated
                    </h4>
                    <div className="glass-card p-4 space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Trading ID:</span> {selectedClient.trading_id}</p>
                      <p><span className="text-muted-foreground">Password:</span> {selectedClient.trading_password}</p>
                      <p><span className="text-muted-foreground">Login URL:</span> {selectedClient.login_url}</p>
                    </div>
                  </div>
                )}

                {/* Waiting for payment */}
                {selectedClient.payment_status !== "paid" && (
                  <div className="text-center py-4 text-muted-foreground">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-accent" />
                    <p>Waiting for payment confirmation</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminDashboard;
