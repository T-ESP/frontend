import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, AlertTriangle, Tag, X, CheckCircle2 } from 'lucide-react';
import { orderService } from '@/infrastructure/api/services/orderService';
import { userService } from '@/infrastructure/api/services/userService';
import { productService } from '@/infrastructure/api/services/productService';
import { discountService } from '@/infrastructure/api/services/discountService';
import type { CreateOrderDto, CreateLineItemDto } from '@/domain/models/Order';
import type { User as UserType } from '@/domain/models/User';
import type { Product as ProductType } from '@/domain/models/Product';
import type { ApplicableDiscount, CheckDiscountResponse } from '@/domain/models/Discount';
import { useToast } from '@/ui/components/common/Toast';
import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchableSelect } from '@/ui/components/common/SearchableSelect';


interface AddOrderModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const INITIAL_LINE_ITEM: CreateLineItemDto = { product_id: 0, quantity: 1 };
const INITIAL_FORM_DATA: CreateOrderDto = {
  user_id: 0,
  status: 'pending',
  line_items: [],
};

export function AddOrderModal({ onClose, onSuccess }: AddOrderModalProps) {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [formData, setFormData] = useState<CreateOrderDto>(INITIAL_FORM_DATA);
  const [lineItems, setLineItems] = useState<CreateLineItemDto[]>([INITIAL_LINE_ITEM]);
  const [loading, setLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Discount flow
  const [checkingDiscounts, setCheckingDiscounts] = useState(false);
  const [discountResult, setDiscountResult] = useState<CheckDiscountResponse | null>(null);
  const [selectedDiscountIds, setSelectedDiscountIds] = useState<number[]>([]);

  const { addToast } = useToast();

  useEffect(() => {
    const loadStaticData = async () => {
      setIsDataLoading(true);
      try {
        const [userData, productData] = await Promise.all([
          userService.getAll(),
          productService.getAll(),
        ]);
        setUsers(userData);
        setProducts(productData);
      } catch (err) {
        console.error('Failed to load static data:', err);
        setError('Error loading users/products.');
      } finally {
        setIsDataLoading(false);
      }
    };
    loadStaticData();
  }, []);

  const resetDiscounts = () => { setDiscountResult(null); setSelectedDiscountIds([]); };

  const addLineItem = () => {
    setLineItems([...lineItems, INITIAL_LINE_ITEM]);
    setError(null);
    resetDiscounts();
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
      setError(null);
      resetDiscounts();
    }
  };

  const updateLineItem = (index: number, field: keyof CreateLineItemDto, value: number) => {
    const updated = [...lineItems];
    const finalValue = field === 'quantity' ? Math.max(1, value) : value;
    updated[index] = { ...updated[index], [field]: finalValue };
    setLineItems(updated);
    // Reset discount check when cart changes
    setDiscountResult(null);
    setSelectedDiscountIds([]);
  };

  const handleCheckDiscounts = async () => {
    const validItems = lineItems.filter((i) => i.product_id !== 0 && i.quantity > 0);
    if (validItems.length === 0) return;
    setCheckingDiscounts(true);
    try {
      const checkItems = validItems.map((li) => {
        const p = products.find((x) => x.id === li.product_id);
        return {
          product_id: li.product_id,
          quantity: li.quantity,
          line_total: p ? p.buying_price * li.quantity : 0,
        };
      });
      const result = await discountService.check({
        line_items: checkItems,
        total_amount: total,
      });
      setDiscountResult(result);
      // Pre-select all applicable (respecting cumul rule: all cumulatives + best non-cumulative)
      const cumulatives = result.applicable_discounts.filter((d) => d.cumulative);
      const nonCumulatives = result.applicable_discounts.filter((d) => !d.cumulative);
      const bestNc = nonCumulatives.reduce<ApplicableDiscount | null>(
        (best, d) => (!best || d.saving_amount > best.saving_amount ? d : best),
        null,
      );
      const preSelected = [...cumulatives.map((d) => d.id), ...(bestNc ? [bestNc.id] : [])];
      setSelectedDiscountIds(preSelected);
    } catch {
      addToast('Remises', 'Impossible de vérifier les remises applicables.', 'error');
    } finally {
      setCheckingDiscounts(false);
    }
  };

  const toggleDiscount = (id: number) => {
    setSelectedDiscountIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.user_id === 0) {
      setError(t('orders.add_modal.user_error'));
      return;
    }
    if (lineItems.some((item) => item.product_id === 0)) {
      setError(t('orders.add_modal.product_error'));
      return;
    }
    if (lineItems.some((item) => item.quantity <= 0)) {
      setError(t('orders.add_modal.quantity_error'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const finalPayload: CreateOrderDto = {
        ...formData,
        line_items: lineItems.map((item) => {
          const productDetails = products.find((p) => p.id === item.product_id);
          return {
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: productDetails ? productDetails.buying_price : 0,
          };
        }),
        discount_ids: selectedDiscountIds.length > 0 ? selectedDiscountIds : undefined,
      };

      await orderService.create(finalPayload);
      addToast(t('orders.add_modal.created_toast'), t('orders.add_modal.created_msg'), 'success');
      onSuccess();
    } catch (err) {
      console.error('API Error during order creation:', err);
      const errorMsg = err instanceof Error ? err.message : t('orders.add_modal.create_error');
      setError(errorMsg);
      addToast(t('orders.add_modal.create_error'), errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const total = lineItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.product_id);
    return sum + (product ? product.buying_price * item.quantity : 0);
  }, 0);

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('orders.add_modal.title')}</DialogTitle>
          <DialogDescription>
            {t('orders.add_modal.subtitle', 'Créer une nouvelle commande')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isDataLoading ? (
            <div className="py-10 text-center">
              <Loader2 className="mx-auto mb-2 size-5 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                {t('orders.add_modal.loading_data')}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="user_id">{t('orders.add_modal.user_label')}</Label>
                  <SearchableSelect
                    options={users.map((u) => ({
                      value: String(u.id),
                      label: `${u.firstname} ${u.lastname}`,
                    }))}
                    value={formData.user_id ? String(formData.user_id) : undefined}
                    placeholder={t('orders.add_modal.select_user')}
                    searchPlaceholder="Rechercher un utilisateur..."
                    onChange={(v) => setFormData({ ...formData, user_id: parseInt(v) })}
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="status">{t('orders.add_modal.status_label')}</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="pending">{t('orders.status.pending')}</SelectItem>
                      <SelectItem value="confirmed">{t('orders.status.confirmed')}</SelectItem>
                      <SelectItem value="shipped">{t('orders.status.shipped')}</SelectItem>
                      <SelectItem value="delivered">{t('orders.status.delivered')}</SelectItem>
                      <SelectItem value="cancelled">{t('orders.status.cancelled')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label>{t('orders.add_modal.items_label')}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addLineItem}
                  >
                    <Plus />
                    {t('orders.add_modal.add_item')}
                  </Button>
                </div>

                <div className="flex flex-col gap-2">
                  {lineItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-lg border bg-muted/30 p-2"
                    >
                      <div className="flex-1 min-w-0">
                        <SearchableSelect
                          options={products.map((p) => ({
                            value: String(p.id),
                            label: `${p.name} — ${p.buying_price}€`,
                          }))}
                          value={item.product_id ? String(item.product_id) : undefined}
                          placeholder={t('orders.add_modal.select_product')}
                          searchPlaceholder="Rechercher un produit..."
                          onChange={(v) => updateLineItem(index, 'product_id', parseInt(v))}
                          className="bg-background"
                        />
                      </div>
                      <Input
                        type="number"
                        min={1}
                        required
                        value={item.quantity}
                        onChange={(e) =>
                          updateLineItem(index, 'quantity', parseInt(e.target.value))
                        }
                        className="w-20 bg-background text-center"
                        placeholder={t('orders.add_modal.quantity_placeholder')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeLineItem(index)}
                        disabled={lineItems.length <= 1}
                        aria-label={t('orders.add_modal.delete_item')}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>

                {total > 0 && (
                  <div className="mt-1 space-y-2">
                    {/* Total brut */}
                    <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                      <span className="text-muted-foreground">
                        {t('orders.add_modal.estimated_total', 'Total estimé')}
                      </span>
                      <span className="font-semibold tabular-nums">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(total)}
                      </span>
                    </div>

                    {/* Discount check button */}
                    {!discountResult && (
                      <button
                        type="button"
                        onClick={handleCheckDiscounts}
                        disabled={checkingDiscounts || lineItems.some((i) => i.product_id === 0)}
                        className="flex items-center gap-2 w-full justify-center px-3 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {checkingDiscounts
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Tag className="w-4 h-4" />}
                        {checkingDiscounts ? 'Vérification…' : 'Vérifier les remises applicables'}
                      </button>
                    )}

                    {/* Discount results */}
                    {discountResult && (
                      <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
                            Remises ({discountResult.applicable_discounts.length})
                          </p>
                          <button
                            type="button"
                            onClick={() => { setDiscountResult(null); setSelectedDiscountIds([]); }}
                            className="text-muted-foreground/60 hover:text-muted-foreground"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {discountResult.applicable_discounts.length === 0 ? (
                          <p className="text-[12px] text-muted-foreground/70">Aucune remise applicable pour cette commande.</p>
                        ) : (
                          <>
                            {discountResult.applicable_discounts.map((d) => {
                              const selected = selectedDiscountIds.includes(d.id);
                              return (
                                <button
                                  key={d.id}
                                  type="button"
                                  onClick={() => toggleDiscount(d.id)}
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-colors ${
                                    selected
                                      ? 'border-primary/40 bg-primary/5 text-primary'
                                      : 'border-border bg-card text-muted-foreground hover:bg-muted'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 text-left">
                                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${selected ? 'text-primary' : 'text-muted-foreground/30'}`} />
                                    <div>
                                      <p className="font-medium text-[13px]">{d.name}</p>
                                      <p className="text-[11px] text-muted-foreground/70">
                                        {d.cumulative ? 'Cumulable' : 'Non cumulable'}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="font-semibold tabular-nums text-[13px] shrink-0 ml-2">
                                    -{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(d.saving_amount)}
                                  </span>
                                </button>
                              );
                            })}

                            {/* Summary */}
                            {selectedDiscountIds.length > 0 && (() => {
                              const saving = discountResult.applicable_discounts
                                .filter((d) => selectedDiscountIds.includes(d.id))
                                .reduce((s, d) => s + d.saving_amount, 0);
                              const finalTotal = total - saving;
                              return (
                                <div className="flex items-center justify-between pt-1 border-t border-border text-sm font-semibold">
                                  <span className="text-muted-foreground">Total après remise</span>
                                  <span className="text-foreground tabular-nums">
                                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(finalTotal)}
                                    <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-medium ml-1">
                                      (-{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(saving)})
                                    </span>
                                  </span>
                                </div>
                              );
                            })()}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('orders.add_modal.cancel')}
            </Button>
            <Button type="submit" disabled={loading || isDataLoading}>
              {loading && <Loader2 className="animate-spin" />}
              {loading ? t('orders.add_modal.creating') : t('orders.add_modal.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
