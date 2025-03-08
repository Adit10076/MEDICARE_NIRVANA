"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Hospital } from '@/types/hospital';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BookingDialog({
  hospital,
  open,
  onOpenChange,
}: {
  hospital: Hospital;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Book Appointment
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-sky-100 rounded-xl">
                <User className="text-sky-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold">{hospital.name}</h3>
                <p className="text-gray-500 text-sm">{hospital.location}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-xl">
                <Calendar className="text-sky-600" size={20} />
                {/* Accessible date input */}
                <input
                  type="date"
                  aria-label="Appointment Date"
                  className="bg-transparent font-medium focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-xl">
                <Clock className="text-sky-600" size={20} />
                {/* Accessible select dropdown */}
                <select
                  aria-label="Select Appointment Time"
                  className="bg-transparent font-medium focus:outline-none w-full"
                >
                  <option>10:00 AM</option>
                  <option>10:30 AM</option>
                  <option>11:00 AM</option>
                </select>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white py-6 text-lg"
            >
              Confirm Appointment
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}