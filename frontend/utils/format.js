"use client";

export const formatCurrency = (amount) =>
    new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
}).format(amount);