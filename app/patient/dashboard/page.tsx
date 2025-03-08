"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Home,
  Settings,
  Hospital,
  AlertTriangle,
  Ambulance,
  Shield,
  Bed,
  Droplet,
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  LogOut,
  Clock,
  Pill,
  AlertCircle,
  HeartPulse,
  ClipboardList,
  Star,
  Stethoscope,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  onProfileClick: () => void;
}

const Sidebar = ({ isCollapsed, toggleSidebar, onProfileClick }: SidebarProps) => {
  const [isServicesOpen, setIsServicesOpen] = useState(true);
  const router = useRouter();

  return (
    <div className={`bg-gray-100 border-r border-gray-300 h-screen fixed left-0 top-0 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
      <div className="p-4 border-b border-gray-300 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full" />
        {!isCollapsed && <span className="text-xl font-bold text-gray-900">MediCare+</span>}
      </div>

      <nav className="p-4">
        <div className="space-y-2">
          <button
            onClick={onProfileClick}
            className={`w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-400/20 rounded-lg transition ${isCollapsed ? "justify-center" : ""}`}
          >
            <User className="w-5 h-5 text-blue-600" />
            {!isCollapsed && "Profile"}
          </button>

          <Link href={`/patient/dashboard`}>
            <button className={`w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-400/20 rounded-lg transition ${isCollapsed ? "justify-center" : ""}`}>
              <Home className="w-5 h-5 text-blue-600" />
              {!isCollapsed && "Home"}
            </button>
          </Link>

          <button className={`w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-400/20 rounded-lg transition ${isCollapsed ? "justify-center" : ""}`}>
            <Settings className="w-5 h-5 text-blue-600" />
            {!isCollapsed && "Settings"}
          </button>

          <Link href={'/hospital'} className={`w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-400/20 rounded-lg transition ${isCollapsed ? "justify-center" : ""}`}>
            <Hospital className="w-5 h-5 text-blue-600" />
            {!isCollapsed && "Hospitals"}
          </Link>

          <div className="border-t border-gray-300 mt-3 pt-3">
            <button
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className={`w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-400/20 rounded-lg transition ${isCollapsed ? "justify-center" : ""}`}
            >
              <Shield className="w-5 h-5 text-blue-600" />
              {!isCollapsed && "Services"}
              {!isCollapsed && (isServicesOpen ? <ChevronUp className="ml-auto w-4 h-4" /> : <ChevronDown className="ml-auto w-4 h-4" />)}
            </button>

            {isServicesOpen && (
              <div className="space-y-1 pl-6">
                {[
                  { icon: AlertTriangle, label: "Emergency", route: "/services" },
                  { icon: Ambulance, label: "Ambulances", route: "/patient/dashboard/ambulances" },
                  { icon: Shield, label: "Oxygen Cylinder", route: "/patient/dashboard/oxygen" },
                  { icon: Bed, label: "Available Beds", route: "/patient/dashboard/beds" },
                  { icon: Droplet, label: "Blood Bank", route: "/patient/dashboard/blood-bank" },
                  { icon: BrainCircuit, label: "AI Assistance", route: "/patient/dashboard" },
                ].map(({ icon: Icon, label, route }, idx) => (
                  <Link href={route} key={idx}>
                    <button className={`w-full flex items-center gap-3 p-2 text-gray-700 hover:bg-blue-400/20 rounded-lg transition ${isCollapsed ? "justify-center" : ""}`}>
                      <Icon className="w-4 h-4 text-blue-600" />
                      {!isCollapsed && label}
                    </button>
                  </Link>
                ))}
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={`w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-400/20 rounded-lg transition ${isCollapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-5 h-5 text-red-600" />
          {!isCollapsed && "Log Out"}
        </button>
      </nav>
    </div>
  );
};

interface MedicalProfile {
  id: number;
  bloodType: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  vaccinations: string[];
  lastCheckup: Date;
  favoriteDoctors: Array<{
    id: number;
    name: string;
    specialty: string;
    hospital: string;
  }>;
  userId: number;
}

export default function PatientDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [medicalProfile, setMedicalProfile] = useState<MedicalProfile | null>(null);
  const session = useSession();
  const userId = session.data?.user.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMedicalProfile = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`/api/medical-profile/${userId}`);
        console.log(response)
        if (!response.ok) throw new Error('Failed to fetch medical profile');
        const data = await response.json();
        
        setMedicalProfile({
          ...data,
          lastCheckup: new Date(data.lastCheckup)
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalProfile();
  }, [userId]);

  const handleModalClick = () => setIsProfileModalOpen(false);
  const handleModalContentClick = (e: React.MouseEvent) => e.stopPropagation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eef2f7] to-[#d0d8e5] flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eef2f7] to-[#d0d8e5] flex items-center justify-center">
        <div className="text-red-500 text-xl font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2f7] to-[#d0d8e5] text-gray-900">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
        onProfileClick={() => setIsProfileModalOpen(true)}
      />

      <main className={`transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"} pt-20 p-8`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6 mb-8">
            <img 
              className="w-16 h-16 rounded-full border-2 border-blue-200"
              src={`https://ui-avatars.com/api/?name=${session.data?.user.name}&background=3b82f6&color=fff`}
              alt="User avatar"
            />
            <div>
              <h1 className="text-3xl font-bold">Welcome, {session.data?.user.name}</h1>
              <p className="text-gray-600">Your Personal Health Dashboard</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {medicalProfile && [
              {
                title: "Blood Type",
                value: medicalProfile.bloodType || "Unknown",
                icon: User,
                hoverBg: "hover:bg-indigo-100",
                borderColor: "border-indigo-500",
              },
              {
                title: "Last Checkup",
                value: medicalProfile.lastCheckup.toLocaleDateString(),
                icon: ClipboardList,
                hoverBg: "hover:bg-green-100",
                borderColor: "border-green-500",
              },
              {
                title: "Active Allergies",
                value: medicalProfile.allergies.length,
                icon: AlertCircle,
                hoverBg: "hover:bg-teal-100",
                borderColor: "border-teal-500",
              },
              {
                title: "Current Medications",
                value: medicalProfile.medications.length,
                icon: Pill,
                hoverBg: "hover:bg-yellow-100",
                borderColor: "border-yellow-500",
              },
              {
                title: "Medical Conditions",
                value: medicalProfile.conditions.length,
                icon: HeartPulse,
                hoverBg: "hover:bg-pink-100",
                borderColor: "border-pink-500",
              },
              {
                title: "Vaccinations",
                value: medicalProfile.vaccinations.length,
                icon: Shield,
                hoverBg: "hover:bg-orange-100",
                borderColor: "border-orange-500",
              },
            ].map(({ title, value, icon: Icon, hoverBg, borderColor }, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-xl shadow-lg border-2 transition-all ${hoverBg} ${borderColor}`}
              >
                <div className="flex items-center gap-4">
                  <Icon className="w-6 h-6 text-gray-700" />
                  <div>
                    <p className="text-gray-700">{title}</p>
                    <p className="text-lg font-semibold">{value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-red-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-500" />
                Allergies
              </h2>
              <ul className="space-y-2">
                {medicalProfile?.allergies.map((allergy, idx) => (
                  <li key={idx} className="p-3 bg-red-50 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    {allergy}
                  </li>
                ))}
                {medicalProfile?.allergies.length === 0 && <p className="text-gray-500">No allergies recorded</p>}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Pill className="w-6 h-6 text-blue-500" />
                Current Medications
              </h2>
              <ul className="space-y-2">
                {medicalProfile?.medications.map((medication, idx) => (
                  <li key={idx} className="p-3 bg-blue-50 rounded-lg flex items-center gap-2">
                    <Pill className="w-4 h-4 text-blue-600" />
                    {medication}
                  </li>
                ))}
                {medicalProfile?.medications.length === 0 && <p className="text-gray-500">No current medications</p>}
              </ul>
            </div>

            {medicalProfile && (
              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-yellow-100 col-span-full">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  Favorite Doctors
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medicalProfile.favoriteDoctors.map((doctor, idx) => (
                    <div key={idx} className="p-4 bg-yellow-50 rounded-lg flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Stethoscope className="w-8 h-8 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        <p className="text-sm text-gray-500">{doctor.hospital}</p>
                      </div>
                    </div>
                  ))}
                  {medicalProfile.favoriteDoctors.length === 0 && <p className="text-gray-500">No favorite doctors saved</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleModalClick}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full" onClick={handleModalContentClick}>
            <h2 className="text-2xl font-bold mb-4">Medical Profile</h2>
            {medicalProfile && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Blood Type</label>
                  <p className="font-medium">{medicalProfile.bloodType || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Last Checkup</label>
                  <p className="font-medium">{medicalProfile.lastCheckup.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Allergies</label>
                  <p className="font-medium">{medicalProfile.allergies.join(", ") || "None"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Medications</label>
                  <p className="font-medium">{medicalProfile.medications.join(", ") || "None"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}