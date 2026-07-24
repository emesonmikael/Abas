import { useSyncExternalStore } from 'react';
import { Vehicle, Driver, FuelTransaction } from '@/types/fuel';
import { INITIAL_VEHICLES, INITIAL_DRIVERS, INITIAL_TRANSACTIONS } from './mock-data';

const STORAGE_KEYS = {
  VEHICLES: 'nfc_fuel_vehicles_v1',
  DRIVERS: 'nfc_fuel_drivers_v1',
  TRANSACTIONS: 'nfc_fuel_transactions_v1',
};

let cachedVehiclesRaw: string | null = null;
let cachedVehiclesParsed: Vehicle[] = INITIAL_VEHICLES;

let cachedDriversRaw: string | null = null;
let cachedDriversParsed: Driver[] = INITIAL_DRIVERS;

let cachedTransactionsRaw: string | null = null;
let cachedTransactionsParsed: FuelTransaction[] = INITIAL_TRANSACTIONS;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(cb => cb());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', callback);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', callback);
    }
  };
}

export function getStoredVehicles(): Vehicle[] {
  if (typeof window === 'undefined') return INITIAL_VEHICLES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    if (!raw) {
      cachedVehiclesRaw = null;
      cachedVehiclesParsed = INITIAL_VEHICLES;
      return INITIAL_VEHICLES;
    }
    if (raw !== cachedVehiclesRaw) {
      cachedVehiclesRaw = raw;
      cachedVehiclesParsed = JSON.parse(raw);
    }
    return cachedVehiclesParsed;
  } catch {
    return INITIAL_VEHICLES;
  }
}

export function saveStoredVehicles(vehicles: Vehicle[]): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = JSON.stringify(vehicles);
    localStorage.setItem(STORAGE_KEYS.VEHICLES, raw);
    cachedVehiclesRaw = raw;
    cachedVehiclesParsed = vehicles;
    notify();
  } catch (e) {
    console.error('Error saving vehicles', e);
  }
}

export function getStoredDrivers(): Driver[] {
  if (typeof window === 'undefined') return INITIAL_DRIVERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRIVERS);
    if (!raw) {
      cachedDriversRaw = null;
      cachedDriversParsed = INITIAL_DRIVERS;
      return INITIAL_DRIVERS;
    }
    if (raw !== cachedDriversRaw) {
      cachedDriversRaw = raw;
      cachedDriversParsed = JSON.parse(raw);
    }
    return cachedDriversParsed;
  } catch {
    return INITIAL_DRIVERS;
  }
}

export function saveStoredDrivers(drivers: Driver[]): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = JSON.stringify(drivers);
    localStorage.setItem(STORAGE_KEYS.DRIVERS, raw);
    cachedDriversRaw = raw;
    cachedDriversParsed = drivers;
    notify();
  } catch (e) {
    console.error('Error saving drivers', e);
  }
}

export function getStoredTransactions(): FuelTransaction[] {
  if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      cachedTransactionsRaw = null;
      cachedTransactionsParsed = INITIAL_TRANSACTIONS;
      return INITIAL_TRANSACTIONS;
    }
    if (raw !== cachedTransactionsRaw) {
      cachedTransactionsRaw = raw;
      cachedTransactionsParsed = JSON.parse(raw);
    }
    return cachedTransactionsParsed;
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

export function saveStoredTransactions(transactions: FuelTransaction[]): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = JSON.stringify(transactions);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, raw);
    cachedTransactionsRaw = raw;
    cachedTransactionsParsed = transactions;
    notify();
  } catch (e) {
    console.error('Error saving transactions', e);
  }
}

export function resetToDefaults(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.VEHICLES);
  localStorage.removeItem(STORAGE_KEYS.DRIVERS);
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  cachedVehiclesRaw = null;
  cachedVehiclesParsed = INITIAL_VEHICLES;
  cachedDriversRaw = null;
  cachedDriversParsed = INITIAL_DRIVERS;
  cachedTransactionsRaw = null;
  cachedTransactionsParsed = INITIAL_TRANSACTIONS;
  notify();
}

export function useStoredVehicles(): Vehicle[] {
  return useSyncExternalStore(
    subscribe,
    getStoredVehicles,
    () => INITIAL_VEHICLES
  );
}

export function useStoredDrivers(): Driver[] {
  return useSyncExternalStore(
    subscribe,
    getStoredDrivers,
    () => INITIAL_DRIVERS
  );
}

export function useStoredTransactions(): FuelTransaction[] {
  return useSyncExternalStore(
    subscribe,
    getStoredTransactions,
    () => INITIAL_TRANSACTIONS
  );
}
