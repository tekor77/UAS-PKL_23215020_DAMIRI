import React, { useState } from "react";
import { Bell, BookOpen, LogOut, Award, User, Clock, AlertTriangle, ShieldCheck } from "lucide-react";
import { Siswa, Guru, Notifikasi } from "../types";

interface HeaderProps {
  user: Siswa | Guru | null;
  role: "guru" | "siswa" | "admin" | null;
  notifications: Notifikasi[];
  onLogout: () => void;
  onNavigateToSection?: (section: string) => void;
}

export default function Header({
  user,
  role,
  notifications,
  onLogout,
  onNavigateToSection
}: HeaderProps) {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Filter notifications for siswa based on class, or show all for guru
  const relevantNotifs = role === "siswa"
    ? notifications.filter((n) => n.kelas === (user as Siswa).kelas || n.kelas === "all")
    : notifications;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm" id="header-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* School Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-amber-400">
            AI
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm sm:text-base font-display font-bold text-emerald-800 tracking-tight leading-tight">
              Smart Teacher
            </h1>
            <span className="text-[10px] sm:text-xs text-slate-500 font-sans font-medium">
              MTs Ma'arif NU 7 Sawojajar
            </span>
          </div>
        </div>

        {/* Right Nav Options */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications Bell */}
            <div className="relative">
              <button
                id="notif-bell-btn"
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="p-2 rounded-full text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors relative focus:outline-none"
              >
                <Bell className="w-5 h-5" />
                {relevantNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                    {relevantNotifs.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifDropdown(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-800">Notifikasi</span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                        {relevantNotifs.length} Baru
                      </span>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                      {relevantNotifs.length === 0 ? (
                        <div className="px-4 py-6 text-center text-slate-400 text-xs">
                          Tidak ada notifikasi saat ini.
                        </div>
                      ) : (
                        relevantNotifs.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              setShowNotifDropdown(false);
                              if (onNavigateToSection && notif.linkTugasId) {
                                onNavigateToSection("tugas");
                              }
                            }}
                            className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3"
                          >
                            <div className="mt-0.5">
                              {notif.tipe === "tugas" && (
                                <div className="p-1 rounded-full bg-emerald-100 text-emerald-700">
                                  <BookOpen className="w-4 h-4" />
                                </div>
                              )}
                              {notif.tipe === "warning" && (
                                <div className="p-1 rounded-full bg-amber-100 text-amber-700">
                                  <Clock className="w-4 h-4" />
                                </div>
                              )}
                              {notif.tipe === "success" && (
                                <div className="p-1 rounded-full bg-sky-100 text-sky-700">
                                  <ShieldCheck className="w-4 h-4" />
                                </div>
                              )}
                              {notif.tipe === "info" && (
                                <div className="p-1 rounded-full bg-blue-100 text-blue-700">
                                  <User className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xs font-bold text-slate-800">{notif.judul}</h4>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                {notif.deskripsi}
                              </p>
                              <span className="text-[9px] text-slate-400 block mt-1 font-mono">
                                {new Date(notif.tanggal).toLocaleDateString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Avatar & Info (Hidden small screen) */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-2 sm:pl-4">
              <img
                src={user.foto}
                alt={user.nama}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full border-2 border-emerald-500 object-cover"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                  {user.nama}
                </span>
                <span className="text-[9px] text-emerald-700 font-semibold uppercase tracking-wide">
                  {role === "admin"
                    ? "Administrator Utama"
                    : role === "guru"
                    ? `Guru - ${(user as Guru).mapel}`
                    : `Siswa Kelas ${(user as Siswa).kelas}`}
                </span>
              </div>

              {/* Logout Button */}
              <button
                id="logout-btn"
                onClick={onLogout}
                title="Keluar Aplikasi"
                className="p-2 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
