/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Siswa {
  id: string;
  username: string;
  nama: string;
  kelas: string; // e.g. "7A", "7B", "7C", "8A", "8B", "8C", "8D", "9A", "9B", "9C", "9D"
  alamat: string;
  citaCita: string;
  motoHidup: string;
  foto: string;
  noHp?: string;
  password?: string;
}

export interface Guru {
  id: string;
  username: string;
  nama: string;
  nuptk: string;
  mapel: string;
  foto: string;
  kelasDiajar: string[]; // e.g. ["7A", "7B", "7C"]
  noHp?: string;
  password?: string;
}

export interface Bab {
  nomor: number;
  judul: string;
  konten: string;
}

export interface Buku {
  id: string;
  judul: string;
  mapel: string;
  kelas: string; // "7", "8", "9"
  bab: Bab[];
  fileName?: string;
  fileType?: string;
  fileData?: string; // base64 representation of the uploaded file
}

export interface Soal {
  id: string;
  pertanyaan: string;
  pilihan: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  jawabanBenar: string; // "A" | "B" | "C" | "D"
}

export interface Tugas {
  id: string;
  kelas: string; // e.g. "7A", "7B", "7C", "8A", "8B", "8C", "8D", "9A", "9B", "9C", "9D"
  mapel: string;
  semester: string; // "1" | "2"
  bab: string; // e.g. "Bab 1: ..."
  jumlahSoal: number;
  waktu: number; // in minutes
  soal: Soal[];
  dibuatTanggal: string;
  deadlineTanggal: string; // ISO date string or yyyy-mm-dd
}

export interface JawabanSiswa {
  id: string;
  tugasId: string;
  siswaId: string;
  namaSiswa: string;
  kelas: string;
  nilai: number;
  jawaban: Record<string, string>; // mapping of soal.id -> "A"/"B"/"C"/"D"
  tanggalSelesai: string;
  waktuPengerjaanDetik: number;
}

export interface Notifikasi {
  id: string;
  judul: string;
  deskripsi: string;
  kelas: string; // to filter notifications for specific student class
  tanggal: string;
  tipe: "tugas" | "info" | "warning" | "success";
  linkTugasId?: string;
}

export interface SoalTka {
  id: string;
  pertanyaan: string;
  pilihan: Record<string, string>; // A, B, C, D or Benar, Salah
  jawabanBenar: string; // e.g. "A" or complex "A,B" or "Benar"
  tipe: "Pilihan Ganda" | "Pilihan Ganda Kompleks" | "Benar/Salah";
  level: "Level 1" | "Level 2" | "Level 3"; // Level 1 (Pengetahuan/Menghitung), Level 2 (Aplikasi/Memodelkan), Level 3 (Penalaran/Menganalisis)
  bobotIrt?: number;
}

export interface TkaTask {
  id: string;
  judul: string;
  deskripsi: string;
  kelas: string; // e.g. "7A", "7B", etc. Or "7", "8", "9" for general category
  deadlineTanggal: string;
  items: string[]; // fallback list of amaliah tasks
  createdTanggal: string;
  // Tes Kemampuan Akademik (TKA) SMP specific fields:
  bidangUji?: "Matematika (Numerasi)" | "Bahasa Indonesia (Literasi Membaca)" | "IPA" | "Bahasa Inggris";
  sistemPenilaian?: "IRT" | "Poin Klasik";
  kkm?: number;
  soalTka?: SoalTka[];
}

export interface TkaSubmission {
  id: string;
  tkaTaskId: string;
  tkaTaskJudul: string;
  siswaId: string;
  namaSiswa: string;
  kelasSiswa: string;
  jawabanChecklist: Record<string, boolean>; // mapping of item name -> checked or not (fallback)
  catatanAmaliah: string; // text report (fallback)
  tanggalSubmisi: string;
  status: "Belum Dinilai" | "Sudah Dinilai";
  nilai?: number;
  catatanGuru?: string;
  dinilaiOleh?: string;
  // Tes Kemampuan Akademik (TKA) SMP specific fields:
  jawabanTka?: Record<string, string>; // mapping of soalTka.id -> answer string
  scoreBreakdown?: {
    level1: { benar: number; total: number };
    level2: { benar: number; total: number };
    level3: { benar: number; total: number };
    totalBenar: number;
    totalSalah: number;
    totalKosong: number;
  };
  sistemPenilaianUsed?: "IRT" | "Poin Klasik";
  bidangUjiUsed?: "Matematika (Numerasi)" | "Bahasa Indonesia (Literasi Membaca)" | "IPA" | "Bahasa Inggris";
}
