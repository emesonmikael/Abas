'use client';

import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from '@/components/Navbar';
import { NfcScanner } from '@/components/frentista/NfcScanner';
import { VehicleCard } from '@/components/frentista/VehicleCard';
import { FuelingForm } from '@/components/frentista/FuelingForm';
import { DriverPinModal } from '@/components/frentista/DriverPinModal';
import { ReceiptModal } from '@/components/frentista/ReceiptModal';
import { VehiclesTab } from '@/components/gestao/VehiclesTab';
import { DriversTab } from '@/components/gestao/DriversTab';
import { FuelLogsTab } from '@/components/gestao/FuelLogsTab';
import { AnalyticsTab } from '@/components/analytics/AnalyticsTab';
import { NfcWriterModal } from '@/components/nfc/NfcWriterModal';

import { Vehicle, Driver, FuelTransaction, FuelType } from '@/types/fuel';
import {
  useStoredVehicles,
  saveStoredVehicles,
  useStoredDrivers,
  saveStoredDrivers,
  useStoredTransactions,
  saveStoredTransactions,
  resetToDefaults
} from '@/lib/storage';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('frentista');
  
  const vehicles = useStoredVehicles();
  const drivers = useStoredDrivers();
  const transactions = useStoredTransactions();

  // Selected vehicle for current fueling session
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Form submission holding state before PIN modal
  const [pendingFuelingData, setPendingFuelingData] = useState<{
    odometerKm: number;
    fuelType: FuelType;
    liters: number;
    pricePerLiter: number;
    totalValue: number;
    stationName: string;
    pumpNumber: string;
    attendantName: string;
    flags: string[];
    calculatedKmPerLiter: number;
    kmDriven: number;
  } | null>(null);

  // Modals
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [receiptTransaction, setReceiptTransaction] = useState<FuelTransaction | null>(null);
  const [nfcWriterVehicle, setNfcWriterVehicle] = useState<Vehicle | null>(null);

  // Sync state changes to storage
  const updateVehicles = (newVehicles: Vehicle[]) => {
    saveStoredVehicles(newVehicles);
  };

  const updateDrivers = (newDrivers: Driver[]) => {
    saveStoredDrivers(newDrivers);
  };

  const updateTransactions = (newTransactions: FuelTransaction[]) => {
    saveStoredTransactions(newTransactions);
  };

  const handleResetData = () => {
    if (confirm('Deseja restaurar todos os veículos, motoristas e históricos para os dados padrão de demonstração?')) {
      resetToDefaults();
      setSelectedVehicle(null);
      setPendingFuelingData(null);
      setIsPinModalOpen(false);
    }
  };

  // Handlers for vehicle modification
  const handleAddVehicle = (vehicle: Vehicle) => {
    updateVehicles([vehicle, ...vehicles]);
  };

  const handleUpdateVehicle = (updatedVehicle: Vehicle) => {
    const list = vehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v);
    updateVehicles(list);
    if (selectedVehicle?.id === updatedVehicle.id) {
      setSelectedVehicle(updatedVehicle);
    }
  };

  // Handlers for driver modification
  const handleAddDriver = (driver: Driver) => {
    updateDrivers([driver, ...drivers]);
  };

  const handleUpdateDriver = (updatedDriver: Driver) => {
    const list = drivers.map(d => d.id === updatedDriver.id ? updatedDriver : d);
    updateDrivers(list);
  };

  // Frentista fueling flow:
  // Step 1: User fills FuelingForm
  const handleFuelingFormSubmit = (formData: {
    odometerKm: number;
    fuelType: FuelType;
    liters: number;
    pricePerLiter: number;
    totalValue: number;
    stationName: string;
    pumpNumber: string;
    attendantName: string;
    flags: string[];
    calculatedKmPerLiter: number;
    kmDriven: number;
  }) => {
    setPendingFuelingData(formData);
    setIsPinModalOpen(true);
  };

  // Step 2: Driver enters PIN and authenticates
  const handleSuccessDriverAuth = (authenticatedDriver: Driver) => {
    if (!selectedVehicle || !pendingFuelingData) return;

    // Create protocol number
    const protocolNumber = `ABS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTransaction: FuelTransaction = {
      id: `tx-${Date.now()}`,
      protocolNumber,
      vehicleId: selectedVehicle.id,
      vehiclePlate: selectedVehicle.plate,
      vehicleModel: selectedVehicle.model,
      driverId: authenticatedDriver.id,
      driverName: authenticatedDriver.name,
      timestamp: new Date().toISOString(),
      stationName: pendingFuelingData.stationName,
      pumpNumber: pendingFuelingData.pumpNumber,
      attendantName: pendingFuelingData.attendantName,
      fuelType: pendingFuelingData.fuelType,
      liters: pendingFuelingData.liters,
      pricePerLiter: pendingFuelingData.pricePerLiter,
      totalValue: pendingFuelingData.totalValue,
      odometerKm: pendingFuelingData.odometerKm,
      previousOdometerKm: selectedVehicle.currentOdometerKm,
      kmDriven: pendingFuelingData.kmDriven,
      calculatedKmPerLiter: pendingFuelingData.calculatedKmPerLiter,
      nfcTagUsed: selectedVehicle.nfcTagId,
      authenticatedWithPin: true,
      status: pendingFuelingData.flags.length > 0 ? 'flagged' : 'approved',
      flags: pendingFuelingData.flags
    };

    // Update vehicle's current odometer
    const updatedVehicle: Vehicle = {
      ...selectedVehicle,
      currentOdometerKm: pendingFuelingData.odometerKm
    };

    handleUpdateVehicle(updatedVehicle);

    // Add transaction to history
    updateTransactions([newTransaction, ...transactions]);

    // Close PIN modal, open Receipt modal
    setIsPinModalOpen(false);
    setPendingFuelingData(null);
    setReceiptTransaction(newTransaction);
  };

  const handleNewFueling = () => {
    setSelectedVehicle(null);
    setPendingFuelingData(null);
    setReceiptTransaction(null);
  };

  const assignedDriver = selectedVehicle
    ? drivers.find(d => d.assignedVehiclePlate === selectedVehicle.plate || d.id === selectedVehicle.assignedDriverId)
    : undefined;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetData={handleResetData}
        vehicleCount={vehicles.length}
        transactionCount={transactions.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TAB 1: Totem Frentista (NFC Fuel Control Station) */}
        {activeTab === 'frentista' && (
          <div className="space-y-8">
            
            {/* NFC Scanner & Virtual Reader */}
            <NfcScanner
              vehicles={vehicles}
              onSelectVehicle={setSelectedVehicle}
              selectedVehicle={selectedVehicle}
            />

            {/* Vehicle Details & Fueling Form (Rendered once NFC Card is tapped/scanned) */}
            {selectedVehicle && (
              <div className="space-y-8 animate-fadeIn">
                <VehicleCard
                  vehicle={selectedVehicle}
                  assignedDriver={assignedDriver}
                />

                <FuelingForm
                  vehicle={selectedVehicle}
                  onSubmitForm={handleFuelingFormSubmit}
                />
              </div>
            )}

          </div>
        )}

        {/* TAB 2: Gestão de Veículos */}
        {activeTab === 'veiculos' && (
          <VehiclesTab
            vehicles={vehicles}
            onAddVehicle={handleAddVehicle}
            onUpdateVehicle={handleUpdateVehicle}
            onOpenNfcWriter={(v) => setNfcWriterVehicle(v)}
          />
        )}

        {/* TAB 3: Gestão de Motoristas & PINs */}
        {activeTab === 'motoristas' && (
          <DriversTab
            drivers={drivers}
            vehicles={vehicles}
            onAddDriver={handleAddDriver}
            onUpdateDriver={handleUpdateDriver}
          />
        )}

        {/* TAB 4: Histórico de Abastecimentos */}
        {activeTab === 'historico' && (
          <FuelLogsTab
            transactions={transactions}
            onSelectTransaction={(tx) => setReceiptTransaction(tx)}
          />
        )}

        {/* TAB 5: Dashboard & IA Auditoria */}
        {activeTab === 'analise' && (
          <AnalyticsTab
            vehicles={vehicles}
            transactions={transactions}
          />
        )}

      </main>

      {/* Driver PIN Password Modal */}
      <DriverPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        drivers={drivers}
        preselectedDriverId={assignedDriver?.id}
        onSuccessAuth={handleSuccessDriverAuth}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        transaction={receiptTransaction}
        onClose={() => setReceiptTransaction(null)}
        onNewFueling={handleNewFueling}
      />

      {/* NFC Writer Modal */}
      <NfcWriterModal
        vehicle={nfcWriterVehicle}
        onClose={() => setNfcWriterVehicle(null)}
      />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>System FleetFuel NFC © 2026 • Controle Inteligente de Abastecimento de Frota</p>
      </footer>

    </div>
  );
}
