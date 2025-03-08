"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Hospital } from '@/types/hospital';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function BookingDialog({
  hospital,
  open,
  onOpenChange,
}: {
  hospital: Hospital;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  // Automatically detect user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Use a reverse geocoding API to get the location name
          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
            .then(response => response.json())
            .then(data => {
              setLocation(`${data.locality}, ${data.countryName}`);
            })
            .catch(() => {
              setError('Unable to fetch location details.');
            });
        },
        () => {
          setError('Unable to retrieve your location.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

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
            {/* Hospital Information */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-sky-100 rounded-xl">
                <User className="text-sky-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold">{hospital.name}</h3>
                <p className="text-gray-500 text-sm">{hospital.location}</p>
              </div>
            </div>

            {/* User Information Fields */}
            <div className="space-y-4">
              {/* Name Field */}
              <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-xl">
                <User className="text-sky-600" size={20} />
                <input
                  type="text"
                  aria-label="Your Name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent font-medium focus:outline-none w-full"
                />
              </div>

              {/* Phone Number Field */}
              <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-xl">
                <Phone className="text-sky-600" size={20} />
                <input
                  type="tel"
                  aria-label="Your Phone Number"
                  placeholder="Your Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-transparent font-medium focus:outline-none w-full"
                />
              </div>

              {/* Location Field (Auto-detected) */}
              <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-xl">
                <MapPin className="text-sky-600" size={20} />
                <input
                  type="text"
                  aria-label="Your Location"
                  placeholder="Your Location"
                  value={location}
                  readOnly
                  className="bg-transparent font-medium focus:outline-none w-full"
                />
              </div>

              {/* Symptoms Field */}
              <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-xl">
                <User className="text-sky-600" size={20} />
                <textarea
                  aria-label="Symptoms"
                  placeholder="Describe your symptoms"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="bg-transparent font-medium focus:outline-none w-full"
                />
              </div>

              {/* Appointment Date Field */}
              <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-xl">
                <Calendar className="text-sky-600" size={20} />
                <input
                  type="date"
                  aria-label="Appointment Date"
                  className="bg-transparent font-medium focus:outline-none"
                />
              </div>

              {/* Appointment Time Field */}
              <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-xl">
                <Clock className="text-sky-600" size={20} />
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

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Confirm Appointment Button */}
            <Link href="/stripepayment">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white py-6 text-lg"
              >
                Confirm Appointment
              </Button>
            </Link>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}