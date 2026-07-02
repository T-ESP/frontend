import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  ScanLine,
  Search,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  UserPlus,
  X,
  Gift,
  CreditCard,
  Banknote,
  Tag,
  Receipt,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import PageLayout from "@/ui/components/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/ui/components/common/Toast";
import { productService } from "@/infrastructure/api/services/productService";
import { orderService } from "@/infrastructure/api/services/orderService";
import { userService } from "@/infrastructure/api/services/userService";
import { loyaltyService } from "@/infrastructure/api/services/loyaltyService";
import { discountService } from "@/infrastructure/api/services/discountService";
import type { Product } from "@/domain/models/Product";
import type { User } from "@/domain/models/User";
import type { LoyaltyUserStats, LoyaltyConfig } from "@/domain/models/Loyalty";
import type { ApplicableDiscount } from "@/domain/models/Discount";
import { useBarcodeScanner, normalizeScan } from "@/ui/features/caisse/hooks/useBarcodeScanner";

type CartLine = {
  product: Product;
  quantity: number;
};

type PaymentMethod = "card" | "cash";

const EUR = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

export default function CaissePage() {
  const { addToast } = useToast();

  // ----- Panier -----
  const [cart, setCart] = useState<CartLine[]>([]);
  const [scanValue, setScanValue] = useState("");
  const [lookingUp, setLookingUp] = useState(false);
  const scanInputRef = useRef<HTMLInputElement>(null);

  // ----- Recherche manuelle -----
  const [suggestions, setSuggestions] = useState<{ id: number; name: string; category: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ----- Client / fidélité -----
  const [users, setUsers] = useState<User[]>([]);
  const [clientQuery, setClientQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [clientLoyalty, setClientLoyalty] = useState<LoyaltyUserStats | null>(null);
  const [loyaltyConfig, setLoyaltyConfig] = useState<LoyaltyConfig | null>(null);

  // ----- Nouveau compte fidélité -----
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClient, setNewClient] = useState({ firstname: "", lastname: "", email: "", password: "" });
  const [creatingClient, setCreatingClient] = useState(false);

  // ----- Encaissement (inline) -----
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [applicable, setApplicable] = useState<ApplicableDiscount[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [checkingPromos, setCheckingPromos] = useState(false);
  const [cashReceived, setCashReceived] = useState("");
  const [wantReceipt, setWantReceipt] = useState(false);
  const [receiptEmail, setReceiptEmail] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);

  const focusScan = useCallback(() => {
    scanInputRef.current?.focus();
  }, []);

  // Charger clients + config fidélité
  useEffect(() => {
    userService.getAll().then(setUsers).catch(() => {});
    loyaltyService.getConfig().then(setLoyaltyConfig).catch(() => {});
    focusScan();
  }, [focusScan]);

  // ---------------------------------------------------------------------------
  // Ajout au panier
  // ---------------------------------------------------------------------------
  const addProductToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.product.id === product.id);
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id ? { ...l, quantity: l.quantity + 1 } : l
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const lookupByReference = useCallback(
    async (reference: string) => {
      const ref = reference.trim();
      if (!ref) return;
      // Corrige un éventuel mauvais layout clavier (scannette QWERTY sur poste AZERTY).
      // On tente en priorité la version corrigée, puis la valeur brute.
      const normalized = normalizeScan(ref);
      const candidates = normalized !== ref ? [normalized, ref] : [ref];
      const shown = normalized; // référence décodée (affichage)
      setLookingUp(true);
      try {
        let product = null;
        for (const candidate of candidates) {
          try {
            product = await productService.getByReference(candidate);
            if (product) break;
          } catch {
            /* essaie le candidat suivant */
          }
        }
        if (product) {
          addProductToCart(product);
          addToast("Produit ajouté", product.name, "success", 2000);
        } else {
          addToast("Produit introuvable", `Référence « ${shown} » absente du catalogue`, "error");
        }
      } finally {
        setScanValue("");
        setSuggestions([]);
        setShowSuggestions(false);
        setLookingUp(false);
        focusScan();
      }
    },
    [addProductToCart, addToast, focusScan]
  );

  useBarcodeScanner(lookupByReference, { enabled: !showNewClient });

  const onScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scanValue.trim()) lookupByReference(scanValue);
  };

  // Suggestions de recherche
  useEffect(() => {
    const q = scanValue.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const handle = setTimeout(async () => {
      try {
        const results = await productService.searchLight(q);
        setSuggestions(results.slice(0, 6));
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [scanValue]);

  const pickSuggestion = async (id: number) => {
    setShowSuggestions(false);
    try {
      const product = await productService.getById(id);
      addProductToCart(product);
      addToast("Produit ajouté", product.name, "success", 2000);
    } catch {
      addToast("Erreur", "Impossible d'ajouter ce produit", "error");
    } finally {
      setScanValue("");
      focusScan();
    }
  };

  // ---------------------------------------------------------------------------
  // Quantités
  // ---------------------------------------------------------------------------
  const changeQty = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((l) => (l.product.id === productId ? { ...l, quantity: l.quantity + delta } : l))
        .filter((l) => l.quantity > 0)
    );
  };
  const removeLine = (productId: number) => setCart((prev) => prev.filter((l) => l.product.id !== productId));
  const clearCart = () => setCart([]);

  const totalItems = useMemo(() => cart.reduce((acc, l) => acc + l.quantity, 0), [cart]);
  const total = useMemo(
    () => cart.reduce((acc, l) => acc + l.product.buying_price * l.quantity, 0),
    [cart]
  );

  // ---------------------------------------------------------------------------
  // Promotions : recalcule à chaque changement de panier (debounced)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (cart.length === 0) {
      setApplicable([]);
      setSelectedIds(new Set());
      return;
    }
    const handle = setTimeout(async () => {
      setCheckingPromos(true);
      try {
        const res = await discountService.check({
          line_items: cart.map((l) => ({
            product_id: l.product.id,
            quantity: l.quantity,
            line_total: l.product.buying_price * l.quantity,
          })),
          total_amount: total,
        });
        setApplicable(res.applicable_discounts);
        setSelectedIds(new Set(res.applicable_discounts.map((d) => d.id)));
      } catch {
        setApplicable([]);
        setSelectedIds(new Set());
      } finally {
        setCheckingPromos(false);
      }
    }, 400);
    return () => clearTimeout(handle);
  }, [cart, total]);

  const toggleDiscount = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedSaving = useMemo(
    () => applicable.filter((d) => selectedIds.has(d.id)).reduce((acc, d) => acc + Number(d.saving_amount), 0),
    [applicable, selectedIds]
  );
  const discountedTotal = Math.max(total - selectedSaving, 0);

  const discountActionLabel = (d: ApplicableDiscount) =>
    d.action_type === "percentage" ? `-${Number(d.action_value)}%` : `-${EUR.format(Number(d.action_value))}`;

  // ---------------------------------------------------------------------------
  // Client / fidélité
  // ---------------------------------------------------------------------------
  const filteredClients = useMemo(() => {
    const q = clientQuery.trim().toLowerCase();
    if (!q) return [];
    return users
      .filter(
        (u) =>
          `${u.firstname} ${u.lastname}`.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [clientQuery, users]);

  const selectClient = async (client: User) => {
    setSelectedClient(client);
    setClientQuery("");
    setClientLoyalty(null);
    setWantReceipt(true);
    setReceiptEmail(client.email);
    try {
      const stats = await loyaltyService.getUserStats(client.id);
      setClientLoyalty(stats);
    } catch {
      /* fidélité non disponible */
    }
  };

  const clearClient = () => {
    setSelectedClient(null);
    setClientLoyalty(null);
    setWantReceipt(false);
    setReceiptEmail("");
  };

  const handleCreateClient = async () => {
    if (!newClient.firstname || !newClient.lastname || !newClient.email || !newClient.password) {
      addToast("Champs requis", "Renseignez tous les champs du compte fidélité", "error");
      return;
    }
    setCreatingClient(true);
    try {
      const created = await userService.create(newClient);
      setUsers((prev) => [...prev, created]);
      await selectClient(created);
      addToast("Compte fidélité créé", `${created.firstname} ${created.lastname}`, "success");
      setShowNewClient(false);
      setNewClient({ firstname: "", lastname: "", email: "", password: "" });
    } catch (err) {
      addToast(
        "Création impossible",
        err instanceof Error ? err.message : "Erreur lors de la création du compte",
        "error"
      );
    } finally {
      setCreatingClient(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Validation de la commande
  // ---------------------------------------------------------------------------
  const emailOk = !wantReceipt || isValidEmail(receiptEmail);
  const canValidate = cart.length > 0 && !!paymentMethod && emailOk && !checkingOut;

  const handleValidate = async () => {
    if (cart.length === 0) return;
    if (!paymentMethod) {
      addToast("Mode de paiement", "Choisissez Carte ou Espèces", "error");
      return;
    }
    const userId = selectedClient?.id ?? users[0]?.id;
    if (userId == null) {
      addToast("Aucun client disponible", "Créez au moins un compte client avant d'encaisser", "error");
      return;
    }

    setCheckingOut(true);
    try {
      const order = await orderService.create({
        user_id: userId,
        status: "delivered",
        payment_method: paymentMethod,
        discount_ids: Array.from(selectedIds),
        line_items: cart.map((l) => ({ product_id: l.product.id, quantity: l.quantity })),
      });

      const savings = Number(order.discount_amount ?? 0);
      const eurosPerPoint = loyaltyConfig ? Number(loyaltyConfig.euros_per_point) : 0;
      const earned = eurosPerPoint > 0 ? Math.floor(Number(order.amount) / eurosPerPoint) : 0;
      addToast(
        "Vente encaissée ✓",
        `Commande #${order.id} — ${EUR.format(Number(order.amount))}` +
          (savings > 0 ? ` · remise ${EUR.format(savings)}` : "") +
          (selectedClient && earned > 0 ? ` · +${earned} pts fidélité` : ""),
        "success",
        6000
      );

      // Envoi du ticket par email si demandé (best-effort, ne bloque pas la vente)
      if (wantReceipt && receiptEmail.trim()) {
        try {
          await orderService.sendReceipt(order.id, receiptEmail.trim());
          addToast("Ticket envoyé", receiptEmail.trim(), "success", 4000);
        } catch (err) {
          addToast(
            "Ticket non envoyé",
            err instanceof Error ? err.message : "Échec de l'envoi de l'email",
            "error"
          );
        }
      }

      if (selectedClient) {
        loyaltyService.getUserStats(selectedClient.id).then(setClientLoyalty).catch(() => {});
      }

      // Reset de la vente
      clearCart();
      setPaymentMethod(null);
      setCashReceived("");
      setWantReceipt(false);
      setReceiptEmail("");
      focusScan();
    } catch (err) {
      addToast(
        "Échec de l'encaissement",
        err instanceof Error ? err.message : "Vérifiez le stock et réessayez",
        "error"
      );
    } finally {
      setCheckingOut(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Rendu
  // ---------------------------------------------------------------------------
  return (
    <PageLayout
      title="Caisse"
      subtitle="Scannez les articles, gérez le panier et encaissez vos ventes"
      actions={
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ScanLine className="w-4 h-4 text-emerald-500" />
          Scannette prête
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* ----------------- Colonne gauche : scan + panier ----------------- */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <form onSubmit={onScanSubmit} className="relative">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    ref={scanInputRef}
                    data-scan-input="true"
                    autoFocus
                    value={scanValue}
                    onChange={(e) => setScanValue(e.target.value)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    placeholder="Scannez un code-barres ou recherchez un produit…"
                    className="pl-9 h-11 text-base"
                  />
                </div>
                <Button type="submit" size="lg" disabled={lookingUp || !scanValue.trim()}>
                  <ScanLine className="w-4 h-4" />
                  Ajouter
                </Button>
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-20 mt-1 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pickSuggestion(s.id)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-muted transition-colors"
                    >
                      <span className="text-sm font-medium text-foreground">{s.name}</span>
                      <span className="text-xs text-muted-foreground">{s.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </form>
            <p className="mt-2 text-xs text-muted-foreground">
              Astuce : le lecteur code-barres ajoute automatiquement l'article au panier.
            </p>
          </div>

          {/* Panier */}
          <div className="bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="flex items-center gap-2 font-semibold text-foreground">
                <ShoppingCart className="w-4 h-4" />
                Panier
                {totalItems > 0 && (
                  <span className="text-xs font-normal text-muted-foreground">
                    ({totalItems} article{totalItems > 1 ? "s" : ""})
                  </span>
                )}
              </h2>
              {cart.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearCart}>
                  <Trash2 className="w-4 h-4" />
                  Vider
                </Button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <ScanLine className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm">Aucun article. Scannez un produit pour commencer.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {cart.map((line) => {
                  const overStock = line.quantity > line.product.stock_quantity;
                  return (
                    <li key={line.product.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{line.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {line.product.reference} · {EUR.format(line.product.buying_price)} / u
                          {overStock && (
                            <span className="ml-2 inline-flex items-center gap-1 text-amber-600">
                              <AlertTriangle className="w-3 h-3" />
                              stock : {line.product.stock_quantity}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon-sm" onClick={() => changeQty(line.product.id, -1)} aria-label="Diminuer">
                          <Minus className="w-3.5 h-3.5" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium tabular-nums">{line.quantity}</span>
                        <Button variant="outline" size="icon-sm" onClick={() => changeQty(line.product.id, 1)} aria-label="Augmenter">
                          <Plus className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      <div className="w-24 text-right font-semibold text-foreground tabular-nums">
                        {EUR.format(line.product.buying_price * line.quantity)}
                      </div>

                      <Button variant="ghost" size="icon-sm" onClick={() => removeLine(line.product.id)} aria-label="Retirer">
                        <X className="w-4 h-4" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* ----------------- Colonne droite : client + encaissement ----------------- */}
        <div className="space-y-4">
          {/* Carte fidélité */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="flex items-center gap-2 font-semibold text-foreground mb-3">
              <Gift className="w-4 h-4" />
              Compte fidélité
            </h2>

            {selectedClient ? (
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {selectedClient.firstname} {selectedClient.lastname}
                    </p>
                    <p className="text-xs text-muted-foreground">{selectedClient.email}</p>
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={clearClient} aria-label="Retirer le client">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {clientLoyalty && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-xs font-medium">
                      <Gift className="w-3 h-3" />
                      {clientLoyalty.total_points} points
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={clientQuery}
                    onChange={(e) => setClientQuery(e.target.value)}
                    placeholder="Rechercher un client (nom, email)…"
                    className="pl-9"
                  />
                  {filteredClients.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                      {filteredClients.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => selectClient(c)}
                          className="w-full px-3 py-2 text-left hover:bg-muted transition-colors"
                        >
                          <p className="text-sm font-medium text-foreground">
                            {c.firstname} {c.lastname}
                          </p>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Button variant="outline" className="w-full" onClick={() => setShowNewClient(true)}>
                  <UserPlus className="w-4 h-4" />
                  Nouveau compte fidélité
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Sans sélection, la vente est enregistrée comme « client de passage ».
                </p>
              </div>
            )}
          </div>

          {/* Encaissement (inline) */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-4">
            <h2 className="flex items-center gap-2 font-semibold text-foreground">
              <CreditCard className="w-4 h-4" />
              Encaissement
            </h2>

            {/* Mode de paiement */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Mode de paiement</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setPaymentMethod("card"); setCashReceived(""); }}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-colors ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-sm font-medium">Carte</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-colors ${
                    paymentMethod === "cash"
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  <span className="text-sm font-medium">Espèces</span>
                </button>
              </div>

              {/* Aide au rendu de monnaie (espèces) */}
              {paymentMethod === "cash" && (
                <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3 space-y-2">
                  <label className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-muted-foreground whitespace-nowrap">Montant reçu</span>
                    <span className="relative">
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        inputMode="decimal"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        placeholder={discountedTotal.toFixed(2)}
                        className="w-28 text-right pr-6"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                    </span>
                  </label>
                  {(() => {
                    const received = parseFloat(cashReceived);
                    if (!cashReceived || isNaN(received)) return null;
                    const diff = received - discountedTotal;
                    return diff >= 0 ? (
                      <div className="flex items-center justify-between text-base font-semibold text-emerald-600">
                        <span>À rendre</span>
                        <span className="tabular-nums">{EUR.format(diff)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-sm font-medium text-amber-600">
                        <span>Manque</span>
                        <span className="tabular-nums">{EUR.format(-diff)}</span>
                      </div>
                    );
                  })()}
                  {/* Raccourcis montants courants */}
                  <div className="flex flex-wrap gap-1.5">
                    {[5, 10, 20, 50].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setCashReceived(String(v))}
                        className="rounded-md border border-border px-2 py-0.5 text-xs hover:bg-muted transition-colors"
                      >
                        {v} €
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setCashReceived(discountedTotal.toFixed(2))}
                      className="rounded-md border border-border px-2 py-0.5 text-xs hover:bg-muted transition-colors"
                    >
                      Appoint
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Promotions */}
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                Promotions
                {checkingPromos && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
              </p>
              {cart.length === 0 ? (
                <p className="text-xs text-muted-foreground">Ajoutez des articles pour voir les promotions.</p>
              ) : applicable.length === 0 ? (
                <p className="text-xs text-muted-foreground">Aucune promotion applicable à ce panier.</p>
              ) : (
                <div className="space-y-1.5">
                  {applicable.map((d) => (
                    <label
                      key={d.id}
                      className="flex items-center gap-2 rounded-lg border border-border p-2 cursor-pointer hover:bg-muted/50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.has(d.id)}
                        onChange={() => toggleDiscount(d.id)}
                        className="h-4 w-4 accent-emerald-600"
                      />
                      <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="flex-1 text-sm text-foreground truncate">
                        {d.name} <span className="text-muted-foreground">({discountActionLabel(d)})</span>
                      </span>
                      <span className="text-sm font-medium text-emerald-600 tabular-nums">
                        -{EUR.format(Number(d.saving_amount))}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Ticket de caisse */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Ticket de caisse</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wantReceipt}
                  onChange={(e) => setWantReceipt(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                <Receipt className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Envoyer le ticket par email</span>
              </label>
              {wantReceipt && (
                <div className="mt-2">
                  <Input
                    type="email"
                    value={receiptEmail}
                    onChange={(e) => setReceiptEmail(e.target.value)}
                    placeholder="email@client.fr"
                    className={!emailOk && receiptEmail ? "border-destructive" : ""}
                  />
                  {selectedClient && receiptEmail === selectedClient.email && (
                    <p className="mt-1 text-xs text-muted-foreground">Email du compte fidélité.</p>
                  )}
                </div>
              )}
            </div>

            {/* Totaux */}
            <div className="border-t border-border pt-3 space-y-1">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Sous-total ({totalItems})</span>
                <span className="tabular-nums">{EUR.format(total)}</span>
              </div>
              {selectedSaving > 0 && (
                <div className="flex items-center justify-between text-sm text-emerald-600">
                  <span>Remises</span>
                  <span className="tabular-nums">-{EUR.format(selectedSaving)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-2xl font-bold text-foreground">
                <span>À payer</span>
                <span className="tabular-nums">{EUR.format(discountedTotal)}</span>
              </div>
            </div>

            <Button size="lg" className="w-full h-12 text-base" disabled={!canValidate} onClick={handleValidate}>
              {checkingOut ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Traitement…
                </>
              ) : (
                `Valider la commande${cart.length > 0 ? ` · ${EUR.format(discountedTotal)}` : ""}`
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Montant final calculé par la caisse au tarif de vente.
            </p>
          </div>
        </div>
      </div>

      {/* ----------------- Modal nouveau compte fidélité ----------------- */}
      <Dialog open={showNewClient} onOpenChange={setShowNewClient}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau compte fidélité</DialogTitle>
            <DialogDescription>
              Créez un client pour le rattacher à la vente et cumuler des points.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Prénom</label>
                <Input
                  value={newClient.firstname}
                  onChange={(e) => setNewClient((p) => ({ ...p, firstname: e.target.value }))}
                  placeholder="Jean"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Nom</label>
                <Input
                  value={newClient.lastname}
                  onChange={(e) => setNewClient((p) => ({ ...p, lastname: e.target.value }))}
                  placeholder="Dupont"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient((p) => ({ ...p, email: e.target.value }))}
                placeholder="jean.dupont@email.fr"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Mot de passe</label>
              <Input
                type="password"
                value={newClient.password}
                onChange={(e) => setNewClient((p) => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewClient(false)} disabled={creatingClient}>
              Annuler
            </Button>
            <Button onClick={handleCreateClient} disabled={creatingClient}>
              {creatingClient ? "Création…" : "Créer le compte"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
