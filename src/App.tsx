/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import pptxgen from "pptxgenjs";
// @ts-ignore
import mammoth from "mammoth";
import {
  BookOpen,
  User,
  GraduationCap,
  Plus,
  Trash2,
  Edit2,
  Brain,
  Award,
  FileText,
  Printer,
  ChevronRight,
  BookMarked,
  Clock,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  UserPlus,
  Upload,
  ArrowRight,
  Sparkles,
  CheckCircle,
  X,
  Search,
  Check,
  RefreshCw,
  Instagram,
  Facebook,
  Phone,
  Heart,
  ClipboardList,
  Download,
  FileAudio,
  FileVideo,
  Image as ImageIcon,
  FileSpreadsheet,
  File,
  Play,
  Presentation,
  Tv,
  Menu
} from "lucide-react";
import Header from "./components/Header";
import { Siswa, Guru, Buku, Tugas, JawabanSiswa, Notifikasi, Soal, TkaTask, TkaSubmission } from "./types";
import { getTkaDefaultQuestions } from "./data/tkaDefaultQuestions";
import { motion, AnimatePresence } from "motion/react";

export const DAFTAR_MAPEL = [
  "Al-Qur'an Hadis",
  "Akidah Akhlak",
  "Fiqih",
  "Sejarah Kebudayaan Islam (SKI)",
  "Bahasa Arab",
  "Pendidikan Pancasila dan Kewarganegaraan (PPKn)",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "Matematika",
  "Ilmu Pengetahuan Alam (IPA)",
  "Ilmu Pengetahuan Sosial (IPS)",
  "Seni Budaya/Prakarya",
  "Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)",
  "Informatika",
  "Koding dan Kecerdasan Buatan",
  "Bahasa Jawa",
  "Ke-NU-an"
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.98
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.98
  })
};

const getTransitionVariants = (slideIdx: number) => {
  const type = slideIdx % 4;
  switch (type) {
    case 1: // Slide Vertikal
      return {
        enter: (direction: number) => ({ x: 0, y: direction > 0 ? 120 : -120, opacity: 0, scale: 0.97, rotate: 0 }),
        center: { x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 },
        exit: (direction: number) => ({ x: 0, y: direction > 0 ? -120 : 120, opacity: 0, scale: 0.97, rotate: 0 })
      };
    case 2: // Zoom Card
      return {
        enter: () => ({ x: 0, y: 0, opacity: 0, scale: 0.85, rotate: 0 }),
        center: { x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 },
        exit: () => ({ x: 0, y: 0, opacity: 0, scale: 1.12, rotate: 0 })
      };
    case 3: // Rotasi Artistik
      return {
        enter: (direction: number) => ({ x: direction > 0 ? 150 : -150, y: 0, opacity: 0, scale: 0.95, rotate: direction > 0 ? 4 : -4 }),
        center: { x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 },
        exit: (direction: number) => ({ x: direction > 0 ? -150 : 150, y: 0, opacity: 0, scale: 0.95, rotate: direction > 0 ? -4 : 4 })
      };
    default: // Slide Horisontal
      return {
        enter: (direction: number) => ({ x: direction > 0 ? 150 : -150, y: 0, opacity: 0, scale: 0.98, rotate: 0 }),
        center: { x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 },
        exit: (direction: number) => ({ x: direction > 0 ? -150 : 150, y: 0, opacity: 0, scale: 0.98, rotate: 0 })
      };
  }
};

const getImageUrl = (keyword: string) => {
  if (!keyword) return "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop";
  const kw = keyword.toLowerCase();
  if (kw.includes("quran") || kw.includes("islamic") || kw.includes("book")) {
    return "https://images.unsplash.com/photo-1609599006353-e629eeabfeae?w=800&auto=format&fit=crop";
  } else if (kw.includes("pray") || kw.includes("mosque") || kw.includes("sholat") || kw.includes("dzikir") || kw.includes("doa") || kw.includes("sujud") || kw.includes("dhikr") || kw.includes("supplication") || kw.includes("ibadah") || kw.includes("zikir")) {
    return "https://images.unsplash.com/photo-1597935258735-e2c602a51563?w=800&auto=format&fit=crop";
  } else if (kw.includes("student") || kw.includes("class") || kw.includes("school") || kw.includes("belajar") || kw.includes("guru") || kw.includes("madrasah")) {
    return "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop";
  } else if (kw.includes("clean") || kw.includes("water") || kw.includes("wudhu") || kw.includes("bersih") || kw.includes("mandi")) {
    return "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800&auto=format&fit=crop";
  } else if (kw.includes("arabic") || kw.includes("calligraphy") || kw.includes("arab")) {
    return "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop";
  } else if (kw.includes("hand") || kw.includes("giving") || kw.includes("charity") || kw.includes("sedekah") || kw.includes("zakat") || kw.includes("amal")) {
    return "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&auto=format&fit=crop";
  } else if (kw.includes("food") || kw.includes("eat") || kw.includes("halal")) {
    return "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop";
  } else if (kw.includes("history") || kw.includes("camel") || kw.includes("desert") || kw.includes("sejarah")) {
    return "https://images.unsplash.com/photo-1547234935-80c7145ec969?w=800&auto=format&fit=crop";
  }
  return "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop";
};

export default function App() {
  // Authentication & Session States
  const [user, setUser] = useState<Siswa | Guru | any>(() => {
    try {
      const saved = localStorage.getItem("smart_teacher_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [role, setRole] = useState<"guru" | "siswa" | "admin" | null>(() => {
    try {
      const saved = localStorage.getItem("smart_teacher_role");
      return saved ? (JSON.parse(saved) as "guru" | "siswa" | "admin" | null) : null;
    } catch {
      return null;
    }
  });
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [roleInput, setRoleInput] = useState<"guru" | "siswa" | "admin">("siswa");
  const [authError, setAuthError] = useState("");

  // Navigation state (for tabs / bento highlights)
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Core Data Lists
  const [students, setStudents] = useState<Siswa[]>([]);
  const [teachers, setTeachers] = useState<Guru[]>([]);
  const [books, setBooks] = useState<Buku[]>([]);
  const [assignments, setAssignments] = useState<Tugas[]>([]);
  const [submissions, setSubmissions] = useState<JawabanSiswa[]>([]);
  const [notifications, setNotifications] = useState<Notifikasi[]>([]);

  // Helper to match book grade level (e.g., "7") with a specific class (e.g., "7A")
  const isBookClassMatch = (bookClass: string, targetClass: string) => {
    if (!bookClass || !targetClass) return false;
    if (bookClass === targetClass) return true;
    if (bookClass.length === 1 && targetClass.startsWith(bookClass)) return true;
    return false;
  };

  // Class selection for Teacher panels (Default to Class 7A)
  const [selectedClass, setSelectedClass] = useState<string>("7A");

  // Loading States
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Active Student Quiz State
  const [activeQuiz, setActiveQuiz] = useState<Tugas | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizTimeLeft, setQuizTimeLeft] = useState<number>(0); // in seconds
  const [quizTimerActive, setQuizTimerActive] = useState(false);

  // Modal / Detail States
  const [selectedSubmission, setSelectedSubmission] = useState<JawabanSiswa | null>(null);
  const [selectedSubmissionTugas, setSelectedSubmissionTugas] = useState<Tugas | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [successOverlay, setSuccessOverlay] = useState<{ show: boolean; msg: string; redirectText?: string }>({ show: false, msg: "" });
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);

  // For Student Book Viewer
  const [selectedBookToRead, setSelectedBookToRead] = useState<Buku | null>(null);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const [bookDirection, setBookDirection] = useState<number>(1); // 1 for next, -1 for prev
  const [bookSidebarOpen, setBookSidebarOpen] = useState<boolean>(true);
  const [bookViewerMode, setBookViewerMode] = useState<"file" | "text">("file");
  const [docxHtml, setDocxHtml] = useState<string>("");
  const [docxLoading, setDocxLoading] = useState<boolean>(false);
  const [docxError, setDocxError] = useState<string>("");

  // Generator State
  const [genMapel, setGenMapel] = useState("Fiqih");
  const [genSemester, setGenSemester] = useState("1");
  const [genBab, setGenBab] = useState("");
  const [genJumlahSoal, setGenJumlahSoal] = useState<number>(5);
  const [genWaktu, setGenWaktu] = useState<number>(15);
  const [genPreviewQuestions, setGenPreviewQuestions] = useState<Soal[]>([]);
  const [genSuccessMsg, setGenSuccessMsg] = useState("");
  const [genDeadlineTanggal, setGenDeadlineTanggal] = useState<string>("2026-07-11");
  const [genKelas, setGenKelas] = useState("7A");
  
  // AI Presentation Generator State
  const [presTitle, setPresTitle] = useState("");
  const [presTheme, setPresTheme] = useState("");
  const [presMapel, setPresMapel] = useState("Fiqih");
  const [presKelas, setPresKelas] = useState("7A");
  const [presBab, setPresBab] = useState("Bab I");
  const [generatedPresentation, setGeneratedPresentation] = useState<any[] | null>(null);
  const [isGeneratingPres, setIsGeneratingPres] = useState(false);
  const [presActiveSlideIdx, setPresActiveSlideIdx] = useState(0);
  const [savedPresentations, setSavedPresentations] = useState<any[]>([]);
  const [currentPresentingPres, setCurrentPresentingPres] = useState<any | null>(null);
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [slideshowDirection, setSlideshowDirection] = useState(1); // 1 for next, -1 for prev
  const [presToDeleteId, setPresToDeleteId] = useState<string | null>(null);
  const [bookToDeleteId, setBookToDeleteId] = useState<string | null>(null);

  // Form inputs
  const [studentForm, setStudentForm] = useState({
    username: "",
    nama: "",
    kelas: "7A",
    alamat: "",
    citaCita: "",
    motoHidup: "",
    password: "",
    noHp: ""
  });
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  const [teacherForm, setTeacherForm] = useState({
    username: "",
    nama: "",
    nuptk: "",
    mapel: "Fiqih",
    kelasDiajar: [] as string[],
    password: "",
    noHp: ""
  });
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);

  const [bookForm, setBookForm] = useState({
    judul: "",
    mapel: "Fiqih",
    kelas: "7"
  });
  const [uploadedFile, setUploadedFile] = useState<{ name: string; type: string; data: string } | null>(null);
  const [kkmVal, setKkmVal] = useState<number>(75);

  const [chapterForm, setChapterForm] = useState({
    bookId: "",
    nomor: 1,
    judul: "",
    konten: ""
  });

  const isTkaClassMatch = (taskKelas: string, currentKelas: string): boolean => {
    const tk = String(taskKelas).trim().toUpperCase();
    const ck = String(currentKelas).trim().toUpperCase();
    if (tk === ck) return true;
    if (tk === "7") return ["7A", "7B", "7C", "7D", "7"].includes(ck);
    if (tk === "8") return ["8A", "8B", "8C", "8D", "8"].includes(ck);
    if (tk === "9") return ["9A", "9B", "9C", "9D", "9E", "9"].includes(ck);
    if (ck === "7") return ["7A", "7B", "7C", "7D", "7"].includes(tk);
    if (ck === "8") return ["8A", "8B", "8C", "8D", "8"].includes(tk);
    if (ck === "9") return ["9A", "9B", "9C", "9D", "9E", "9"].includes(tk);
    return false;
  };

  // TKA (Tes Kemampuan Akademik) States
  const [tkaTasks, setTkaTasks] = useState<TkaTask[]>([]);
  const [tkaSubmissions, setTkaSubmissions] = useState<TkaSubmission[]>([]);
  const [activeTkaTaskId, setActiveTkaTaskId] = useState<string | null>(null);
  const [tkaChecklistAnswers, setTkaChecklistAnswers] = useState<Record<string, boolean>>({});
  const [tkaCatatanAmaliah, setTkaCatatanAmaliah] = useState("");

  const [tkaForm, setTkaForm] = useState({
    judul: "",
    deskripsi: "",
    kelas: "7",
    deadlineTanggal: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [] as string[],
    bidangUji: "Matematika (Numerasi)" as "Matematika (Numerasi)" | "Bahasa Indonesia (Literasi Membaca)" | "IPA" | "Bahasa Inggris",
    sistemPenilaian: "IRT" as "IRT" | "Poin Klasik",
    kkm: 75
  });
  const [tkaItemInput, setTkaItemInput] = useState("");
  const [editingTkaTaskId, setEditingTkaTaskId] = useState<string | null>(null);

  const [gradingTkaSubmissionId, setGradingTkaSubmissionId] = useState<string | null>(null);
  const [tkaGrade, setTkaGrade] = useState<number>(100);
  const [tkaCatatanGuru, setTkaCatatanGuru] = useState("");

  // Student active exam taking states
  const [selectedTkaTaskToTake, setSelectedTkaTaskToTake] = useState<TkaTask | null>(null);
  const [tkaExamAnswers, setTkaExamAnswers] = useState<Record<string, string>>({});
  const [viewingShtkaSubmission, setViewingShtkaSubmission] = useState<TkaSubmission | null>(null);
  const [viewingTugasSubmission, setViewingTugasSubmission] = useState<{
    submission: JawabanSiswa;
    tugas: Tugas;
  } | null>(null);
  const [tkaTimeRemaining, setTkaTimeRemaining] = useState<number | null>(null);
  const [tkaAlertMsg, setTkaAlertMsg] = useState<string | null>(null);
  const [tkaConfirmData, setTkaConfirmData] = useState<{
    show: boolean;
    taskId: string;
    message: string;
  } | null>(null);
  const [quizConfirmData, setQuizConfirmData] = useState<{
    show: boolean;
    message: string;
  } | null>(null);

  const formatTkaTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Load Initial Data
  useEffect(() => {
    fetchData();
  }, [user, role, selectedClass]);

  useEffect(() => {
    if (selectedClass) {
      setGenKelas(selectedClass);
    }
  }, [selectedClass]);

  // Countdown timer for active TKA exam pengerjaan
  useEffect(() => {
    if (!selectedTkaTaskToTake) {
      setTkaTimeRemaining(null);
      return;
    }

    // Aturan waktu: Bahasa Indonesia 45 menit, Matematika 50 menit, lainnya default 45 menit
    let durationMinutes = 45;
    const bidang = selectedTkaTaskToTake.bidangUji || "";
    if (bidang.toLowerCase().includes("matematika")) {
      durationMinutes = 50;
    } else if (bidang.toLowerCase().includes("indonesia")) {
      durationMinutes = 45;
    }

    setTkaTimeRemaining(durationMinutes * 60);

    const timer = setInterval(() => {
      setTkaTimeRemaining((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timer);
          triggerAlert("Waktu pengerjaan ujian telah habis! Jawaban Anda otomatis dikirim oleh sistem.", "info");
          const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
          handleSubmitTkaSubmission(fakeEvent, selectedTkaTaskToTake.id, true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedTkaTaskToTake]);

  useEffect(() => {
    if (!slideshowActive || !currentPresentingPres) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        setSlideshowDirection(1);
        setSlideshowIndex((prev) => Math.min((currentPresentingPres.slides || []).length - 1, prev + 1));
      } else if (e.key === "ArrowLeft") {
        setSlideshowDirection(-1);
        setSlideshowIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "Escape") {
        setSlideshowActive(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slideshowActive, currentPresentingPres]);

  useEffect(() => {
    if (!selectedBookToRead) return;

    // Automatically set viewer mode based on whether file is available
    if (selectedBookToRead.fileData) {
      setBookViewerMode("file");
    } else {
      setBookViewerMode("text");
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (bookViewerMode === "text") {
        if (e.key === "ArrowRight" || e.key === "Space") {
          setBookDirection(1);
          setSelectedChapterIndex((prev) => Math.min((selectedBookToRead.bab || []).length - 1, prev + 1));
        } else if (e.key === "ArrowLeft") {
          setBookDirection(-1);
          setSelectedChapterIndex((prev) => Math.max(0, prev - 1));
        }
      }
      if (e.key === "Escape") {
        setSelectedBookToRead(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedBookToRead, bookViewerMode]);

  useEffect(() => {
    if (!selectedBookToRead || !selectedBookToRead.fileData) {
      setDocxHtml("");
      setDocxError("");
      return;
    }

    const fileName = selectedBookToRead.fileName || "";
    const isDocx = fileName.toLowerCase().endsWith(".docx");

    if (!isDocx) {
      setDocxHtml("");
      setDocxError("");
      return;
    }

    const loadDocx = async () => {
      setDocxLoading(true);
      setDocxError("");
      setDocxHtml("");
      try {
        const base64Str = selectedBookToRead.fileData;
        const commaIndex = base64Str.indexOf(",");
        const cleanBase64 = commaIndex !== -1 ? base64Str.substring(commaIndex + 1) : base64Str;
        
        // Decode base64 to binary string
        const binaryString = window.atob(cleanBase64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Convert to html using mammoth
        const result = await mammoth.convertToHtml({ arrayBuffer: bytes.buffer });
        setDocxHtml(result.value);
      } catch (err: any) {
        console.error("Error reading docx file with mammoth:", err);
        setDocxError("Gagal membaca dokumen Word secara langsung. Anda dapat mengunduh berkas aslinya.");
      } finally {
        setDocxLoading(false);
      }
    };

    loadDocx();
  }, [selectedBookToRead]);

  const fetchData = async () => {
    try {
      const classParam = (role === "guru" || role === "admin") ? `?kelas=${selectedClass}` : "";
      
      const [studentsRes, booksRes, assignmentsRes, submissionsRes, notifsRes] = await Promise.all([
        fetch(`/api/students${classParam}`),
        fetch(`/api/books`),
        fetch(`/api/assignments`),
        fetch(`/api/submissions`),
        fetch(`/api/notifications${role === "siswa" ? `?kelas=${(user as Siswa).kelas}` : ""}`)
      ]);

      if (studentsRes.ok) setStudents(await studentsRes.json());
      if (booksRes.ok) setBooks(await booksRes.json());
      if (assignmentsRes.ok) setAssignments(await assignmentsRes.json());
      if (submissionsRes.ok) setSubmissions(await submissionsRes.json());
      if (notifsRes.ok) setNotifications(await notifsRes.json());

      // Fetch TKA Data
      const tkaParam = (role === "siswa" && user) ? `?kelas=${(user as Siswa).kelas}` : classParam;
      const [tkaTasksRes, tkaSubmissionsRes] = await Promise.all([
        fetch(`/api/tka/tasks${tkaParam}`),
        fetch(`/api/tka/submissions${role === "siswa" && user ? `?siswa_id=${(user as Siswa).id}` : classParam}`)
      ]);
      if (tkaTasksRes.ok) setTkaTasks(await tkaTasksRes.json());
      if (tkaSubmissionsRes.ok) setTkaSubmissions(await tkaSubmissionsRes.json());

      try {
        const presRes = await fetch("/api/presentations");
        if (presRes.ok) setSavedPresentations(await presRes.json());
      } catch (err) {
        console.error("Gagal memuat presentasi terimpan:", err);
      }

      try {
        const teachersRes = await fetch("/api/teachers");
        if (teachersRes.ok) setTeachers(await teachersRes.json());
      } catch (err) {
        console.error("Gagal memuat data guru:", err);
      }
    } catch (e) {
      console.error("Error fetching data", e);
    }
  };

  // Toast Helper
  const triggerAlert = (text: string, type: "success" | "error" | "info" = "success") => {
    setAlertMsg({ text, type });
    setTimeout(() => setAlertMsg(null), 5000);
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setAuthError("Harap masukkan nama pengguna anda.");
      return;
    }
    setLoadingAction("login");
    setAuthError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput || "123", role: roleInput })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setRole(data.role);
        try {
          localStorage.setItem("smart_teacher_user", JSON.stringify(data.user));
          localStorage.setItem("smart_teacher_role", JSON.stringify(data.role));
        } catch (e) {
          console.error("Gagal menyimpan sesi ke localStorage:", e);
        }
        triggerAlert(`Selamat datang kembali, ${data.user.nama}!`, "success");
      } else {
        const errorData = await res.json();
        setAuthError(errorData.message || "Gagal masuk.");
      }
    } catch (err) {
      setAuthError("Gagal terhubung ke server.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    setRole(null);
    setActiveQuiz(null);
    setQuizTimerActive(false);
    setUsernameInput("");
    setPasswordInput("");
    try {
      localStorage.removeItem("smart_teacher_user");
      localStorage.removeItem("smart_teacher_role");
    } catch (e) {
      console.error("Gagal menghapus sesi dari localStorage:", e);
    }
    triggerAlert("Anda berhasil keluar dari sistem.", "info");
  };

  // Update User Profile Self (Siswa, Guru or Admin)
  const handleUpdateSelfProfile = async (updatedData: any) => {
    if (!user || !role) return;
    try {
      let url = "";
      if (role === "siswa") {
        url = `/api/students/${user.id}`;
      } else if (role === "guru") {
        url = `/api/teachers/${user.id}`;
      } else if (role === "admin") {
        triggerAlert("Profil admin diperbarui secara lokal.", "success");
        const updatedAdmin = { ...user, ...updatedData };
        setUser(updatedAdmin);
        try {
          localStorage.setItem("smart_teacher_user", JSON.stringify(updatedAdmin));
        } catch (e) {}
        return;
      }
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        try {
          localStorage.setItem("smart_teacher_user", JSON.stringify(updated));
        } catch (e) {}
        triggerAlert("Profil Anda berhasil diperbarui!", "success");
        fetchData();
      }
    } catch (e) {
      console.error("Error updating self profile", e);
      triggerAlert("Gagal memperbarui profil.", "error");
    }
  };

  // Create Student (Teacher Action)
  const handleAddOrEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.nama || !studentForm.username) {
      triggerAlert("Nama dan Username harus diisi.", "error");
      return;
    }

    try {
      if (editingStudentId) {
        // Edit student
        const res = await fetch(`/api/students/${editingStudentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentForm)
        });
        if (res.ok) {
          setSuccessOverlay({
            show: true,
            msg: "Data Siswa Berhasil Diperbarui!",
            redirectText: "Kembali ke Laman Kelola Siswa..."
          });
          setShowAddStudentModal(false);
          setEditingStudentId(null);
          fetchData();
          setTimeout(() => {
            setSuccessOverlay({ show: false, msg: "" });
            setActiveTab("siswa-kelola");
          }, 1800);
        } else {
          const errData = await res.json().catch(() => ({}));
          triggerAlert(errData.message || "Gagal memperbarui data siswa.", "error");
        }
      } else {
        // Create student
        const res = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentForm)
        });
        if (res.ok) {
          setSuccessOverlay({
            show: true,
            msg: "Siswa Baru Berhasil Ditambahkan!",
            redirectText: "Kembali ke Laman Kelola Siswa..."
          });
          setShowAddStudentModal(false);
          fetchData();
          setTimeout(() => {
            setSuccessOverlay({ show: false, msg: "" });
            setActiveTab("siswa-kelola");
          }, 1800);
        } else {
          const errData = await res.json().catch(() => ({}));
          triggerAlert(errData.message || "Gagal menambahkan siswa baru.", "error");
        }
      }
      setStudentForm({
        username: "",
        nama: "",
        kelas: selectedClass,
        alamat: "",
        citaCita: "",
        motoHidup: "",
        password: "",
        noHp: ""
      });
    } catch (e) {
      triggerAlert("Gagal menyimpan data siswa.", "error");
    }
  };

  // Delete Student
  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data siswa ini? Semua nilai tugas siswa bersangkutan juga akan dihapus.")) return;
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        triggerAlert("Data siswa berhasil dihapus.", "success");
        fetchData();
      }
    } catch (e) {
      triggerAlert("Gagal menghapus siswa.", "error");
    }
  };

  // Generate presentation with Tekor AI
  const handleGeneratePresentation = async () => {
    if (!presTitle.trim()) {
      triggerAlert("Harap isi Judul Presentasi terlebih dahulu.", "error");
      return;
    }
    if (!presTheme.trim()) {
      triggerAlert("Harap isi Tema / Topik presentasi.", "error");
      return;
    }

    setIsGeneratingPres(true);
    setGeneratedPresentation(null);
    setPresActiveSlideIdx(0);

    try {
      const res = await fetch("/api/generate-presentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul: presTitle,
          tema: presTheme,
          mapel: presMapel,
          kelas: presKelas,
          bab: presBab
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.slides && Array.isArray(data.slides)) {
          setGeneratedPresentation(data.slides);
          if (data.allPresentations) {
            setSavedPresentations(data.allPresentations);
          } else {
            const listRes = await fetch("/api/presentations");
            if (listRes.ok) setSavedPresentations(await listRes.json());
          }
          triggerAlert("Presentasi berhasil disusun oleh Tekor AI & otomatis tersimpan!", "success");
        } else {
          triggerAlert("Format data presentasi salah.", "error");
        }
      } else {
        triggerAlert("Gagal menghasilkan presentasi via AI.", "error");
      }
    } catch (e) {
      console.error(e);
      triggerAlert("Koneksi gagal atau bermasalah saat generate presentasi.", "error");
    } finally {
      setIsGeneratingPres(false);
    }
  };

  // Download genuine PPTX file using pptxgenjs (delegated to downloadPresentationAsPPTX)
  const handleDownloadPPTX = () => {
    if (!generatedPresentation || generatedPresentation.length === 0) {
      triggerAlert("Tidak ada data presentasi untuk diunduh.", "error");
      return;
    }
    downloadPresentationAsPPTX({
      judul: presTitle,
      tema: presTheme,
      mapel: presMapel,
      kelas: presKelas,
      bab: presBab,
      slides: generatedPresentation
    });
  };

  const downloadPresentationAsPPTX = (pres: any) => {
    if (!pres || !pres.slides || pres.slides.length === 0) {
      triggerAlert("Tidak ada data presentasi untuk diunduh.", "error");
      return;
    }

    try {
      const pptx = new pptxgen();
      pptx.layout = "LAYOUT_16x9";

      // Palette based on Mata Pelajaran
      let primaryColor = "0F5132"; // Emerald green for Fiqih / Islam
      let secondaryColor = "198754";
      let accentColor = "FFC107";
      
      const mapelLower = (pres.mapel || "").toLowerCase();
      if (mapelLower.includes("hadits") || mapelLower.includes("qur'an")) {
        primaryColor = "1E3A8A"; // Deep Blue
        secondaryColor = "3B82F6";
      } else if (mapelLower.includes("arab")) {
        primaryColor = "5B21B6"; // Purple
        secondaryColor = "8B5CF6";
      } else if (mapelLower.includes("akhlak") || mapelLower.includes("aqidah")) {
        primaryColor = "0369A1"; // Sky blue
        secondaryColor = "0EA5E9";
      }
      
      const textColor = "1F2937";
      const bgColor = "F9FAFB";


      pres.slides.forEach((slideData: any, idx: number) => {
        const slide = pptx.addSlide();
        slide.background = { fill: "F8FAFC" }; // Sleek modern soft off-white background

        // Draw top accent bar
        slide.addShape(pptx.ShapeType.rect, {
          x: 0,
          y: 0,
          w: 13.3,
          h: 0.15,
          fill: { color: primaryColor }
        });

        // Add Slide-specific watermark/badge
        slide.addText(`${pres.mapel || "Tekor AI"}  |  Kelas ${pres.kelas || "MTs"}`, {
          x: 0.6,
          y: 0.25,
          w: 6.0,
          h: 0.3,
          fontSize: 10,
          color: "64748B",
          fontFace: "Arial"
        });

        // Draw slide footer (page numbers and brand)
        slide.addText("MTs Ma'arif NU 7 Sawojajar  •  Media Ajar Interaktif", {
          x: 0.6,
          y: 7.0,
          w: 8.0,
          h: 0.4,
          fontSize: 9,
          color: "94A3B8",
          fontFace: "Arial"
        });

        slide.addText(`Halaman ${idx + 1} dari ${pres.slides.length}`, {
          x: 10.0,
          y: 7.0,
          w: 2.7,
          h: 0.4,
          fontSize: 9,
          align: "right",
          color: "94A3B8",
          fontFace: "Arial"
        });

        // Layout switching
        if (slideData.layout === "title_slide" || idx === 0) {
          // --- TITLE SLIDE ---
          // Draw a beautiful central focus card
          slide.addShape(pptx.ShapeType.rect, {
            x: 1.0,
            y: 1.2,
            w: 11.3,
            h: 5.0,
            fill: { color: "FFFFFF" },
            line: { color: "E2E8F0", width: 1 }
          });

          // Subject/Identity tag
          slide.addText((pres.mapel ? `Mata Pelajaran: ${pres.mapel} (Kelas ${pres.kelas || "7"})` : "Materi Pembelajaran").toUpperCase(), {
            x: 1.5,
            y: 1.8,
            w: 10.3,
            h: 0.4,
            fontSize: 11,
            bold: true,
            color: secondaryColor,
            align: "center",
            fontFace: "Arial"
          });

          // Title
          slide.addText(slideData.title || pres.judul, {
            x: 1.5,
            y: 2.3,
            w: 10.3,
            h: 1.4,
            fontSize: 32,
            bold: true,
            color: primaryColor,
            align: "center",
            fontFace: "Georgia"
          });

          // Subtitle / Chapter detail
          slide.addText(slideData.subtitle || `Pembahasan: ${pres.tema || ""}`, {
            x: 1.5,
            y: 3.9,
            w: 10.3,
            h: 0.6,
            fontSize: 15,
            italic: true,
            color: "475569",
            align: "center",
            fontFace: "Arial"
          });

          // Bottom tiny decoration dots
          slide.addText("❖  ❖  ❖", {
            x: 1.5,
            y: 4.8,
            w: 10.3,
            h: 0.3,
            fontSize: 12,
            color: secondaryColor,
            align: "center"
          });

          // Bullet summaries (if any)
          if (slideData.bullets && slideData.bullets.length > 0) {
            slide.addText(slideData.bullets.join("  •  "), {
              x: 1.5,
              y: 5.3,
              w: 10.3,
              h: 0.6,
              fontSize: 10,
              color: "64748B",
              align: "center",
              fontFace: "Arial"
            });
          }

        } else if (slideData.layout === "dalil_slide") {
          // --- DALIL SLIDE (GOLDEN SPIRITUAL QUOTE) ---
          // Draw a luxurious left border bar for the quote
          slide.addShape(pptx.ShapeType.rect, {
            x: 0.6,
            y: 1.8,
            w: 0.15,
            h: 4.5,
            fill: { color: "D97706" } // Gold accent
          });

          // Slide Title
          slide.addText(slideData.title, {
            x: 0.6,
            y: 0.7,
            w: 12.1,
            h: 0.7,
            fontSize: 22,
            bold: true,
            color: primaryColor,
            fontFace: "Georgia"
          });

          if (slideData.subtitle) {
            slide.addText(slideData.subtitle, {
              x: 0.6,
              y: 1.3,
              w: 12.1,
              h: 0.4,
              fontSize: 12,
              italic: true,
              color: "64748B",
              fontFace: "Arial"
            });
          }

          // Render dalil text with beautiful styling
          const bulletObjects = (slideData.bullets || []).map((b: string) => {
            return {
              text: b,
              options: {
                bullet: false,
                italic: true,
                fontSize: 15,
                color: "1E293B",
                paraSpaceAfter: 12
              }
            };
          });

          slide.addText(bulletObjects, {
            x: 1.0,
            y: 2.0,
            w: 11.7,
            h: 4.3,
            fontFace: "Georgia"
          });

        } else if (slideData.layout === "two_columns") {
          // --- TWO COLUMNS SLIDE ---
          // Slide Title
          slide.addText(slideData.title, {
            x: 0.6,
            y: 0.7,
            w: 12.1,
            h: 0.7,
            fontSize: 22,
            bold: true,
            color: primaryColor,
            fontFace: "Georgia"
          });

          if (slideData.subtitle) {
            slide.addText(slideData.subtitle, {
              x: 0.6,
              y: 1.3,
              w: 12.1,
              h: 0.4,
              fontSize: 12,
              italic: true,
              color: "64748B",
              fontFace: "Arial"
            });
          }

          const half = Math.ceil((slideData.bullets || []).length / 2);
          const bulletsCol1 = (slideData.bullets || []).slice(0, half).map((b: string) => {
            return { text: b, options: { bullet: true, color: "1E293B", paraSpaceAfter: 8 } };
          });
          const bulletsCol2 = (slideData.bullets || []).slice(half).map((b: string) => {
            return { text: b, options: { bullet: true, color: "1E293B", paraSpaceAfter: 8 } };
          });

          // Column 1
          slide.addText(bulletsCol1, {
            x: 0.6,
            y: 1.9,
            w: 5.8,
            h: 4.5,
            fontSize: 13,
            fontFace: "Arial"
          });

          // Column 2
          slide.addText(bulletsCol2, {
            x: 6.8,
            y: 1.9,
            w: 5.8,
            h: 4.5,
            fontSize: 13,
            fontFace: "Arial"
          });

        } else if (slideData.layout === "image_highlight") {
          // --- IMAGE HIGHLIGHT SLIDE (SPLIT SCREEN - RANDOMIZED LAYOUT) ---
          // Slide Title
          slide.addText(slideData.title, {
            x: 0.6,
            y: 0.7,
            w: 12.1,
            h: 0.7,
            fontSize: 22,
            bold: true,
            color: primaryColor,
            fontFace: "Georgia"
          });

          if (slideData.subtitle) {
            slide.addText(slideData.subtitle, {
              x: 0.6,
              y: 1.3,
              w: 12.1,
              h: 0.4,
              fontSize: 12,
              italic: true,
              color: "64748B",
              fontFace: "Arial"
            });
          }

          const bulletsList = (slideData.bullets || []).map((b: string) => {
            return { text: b, options: { bullet: true, color: "1E293B", paraSpaceAfter: 8 } };
          });

          const imgPosList = ["right", "left", "below"];
          const imgPos = imgPosList[idx % 3];
          const imageUrl = getImageUrl(slideData.image_keyword);

          if (imgPos === "right") {
            // Text on left, image on right
            slide.addText(bulletsList, {
              x: 0.6,
              y: 1.9,
              w: 7.2,
              h: 4.5,
              fontSize: 13,
              fontFace: "Arial"
            });
            try {
              slide.addImage({
                path: imageUrl,
                x: 8.2,
                y: 1.9,
                w: 4.5,
                h: 4.3
              });
            } catch (imgErr) {
              console.error("Gagal menyematkan gambar di PPTX:", imgErr);
            }
          } else if (imgPos === "left") {
            // Image on left, text on right
            try {
              slide.addImage({
                path: imageUrl,
                x: 0.6,
                y: 1.9,
                w: 4.5,
                h: 4.3
              });
            } catch (imgErr) {
              console.error("Gagal menyematkan gambar di PPTX:", imgErr);
            }
            slide.addText(bulletsList, {
              x: 5.5,
              y: 1.9,
              w: 7.2,
              h: 4.5,
              fontSize: 13,
              fontFace: "Arial"
            });
          } else {
            // Image below subtheme
            try {
              slide.addImage({
                path: imageUrl,
                x: 4.5,
                y: 1.8,
                w: 4.3,
                h: 2.1
              });
            } catch (imgErr) {
              console.error("Gagal menyematkan gambar di PPTX:", imgErr);
            }

            // Split bullets into 2 columns at the bottom
            const half = Math.ceil((slideData.bullets || []).length / 2);
            const bulletsCol1 = (slideData.bullets || []).slice(0, half).map((b: string) => {
              return { text: b, options: { bullet: true, color: "1E293B", paraSpaceAfter: 4 } };
            });
            const bulletsCol2 = (slideData.bullets || []).slice(half).map((b: string) => {
              return { text: b, options: { bullet: true, color: "1E293B", paraSpaceAfter: 4 } };
            });

            slide.addText(bulletsCol1, {
              x: 0.6,
              y: 4.1,
              w: 5.8,
              h: 2.5,
              fontSize: 11,
              fontFace: "Arial"
            });

            slide.addText(bulletsCol2, {
              x: 6.8,
              y: 4.1,
              w: 5.8,
              h: 2.5,
              fontSize: 11,
              fontFace: "Arial"
            });
          }

        } else {
          // --- STANDARD CONTENT ONLY SLIDE ---
          // Slide Title
          slide.addText(slideData.title, {
            x: 0.6,
            y: 0.7,
            w: 12.1,
            h: 0.7,
            fontSize: 22,
            bold: true,
            color: primaryColor,
            fontFace: "Georgia"
          });

          if (slideData.subtitle) {
            slide.addText(slideData.subtitle, {
              x: 0.6,
              y: 1.3,
              w: 12.1,
              h: 0.4,
              fontSize: 12,
              italic: true,
              color: "64748B",
              fontFace: "Arial"
            });
          }

          const bulletsList = (slideData.bullets || []).map((b: string) => {
            return { text: b, options: { bullet: true, color: "1E293B", paraSpaceAfter: 8 } };
          });

          if (slideData.image_keyword) {
            const imgPosList = ["right", "left", "below"];
            const imgPos = imgPosList[idx % 3];
            const imageUrl = getImageUrl(slideData.image_keyword);

            if (imgPos === "right") {
              // Text on left, image on right
              slide.addText(bulletsList, {
                x: 0.6,
                y: 1.9,
                w: 7.2,
                h: 4.5,
                fontSize: 13,
                fontFace: "Arial"
              });
              try {
                slide.addImage({
                  path: imageUrl,
                  x: 8.2,
                  y: 1.9,
                  w: 4.5,
                  h: 4.3
                });
              } catch (imgErr) {
                console.error("Gagal menyematkan gambar di PPTX:", imgErr);
              }
            } else if (imgPos === "left") {
              // Image on left, text on right
              try {
                slide.addImage({
                  path: imageUrl,
                  x: 0.6,
                  y: 1.9,
                  w: 4.5,
                  h: 4.3
                });
              } catch (imgErr) {
                console.error("Gagal menyematkan gambar di PPTX:", imgErr);
              }
              slide.addText(bulletsList, {
                x: 5.5,
                y: 1.9,
                w: 7.2,
                h: 4.5,
                fontSize: 13,
                fontFace: "Arial"
              });
            } else {
              // Image below subtheme
              try {
                slide.addImage({
                  path: imageUrl,
                  x: 4.5,
                  y: 1.8,
                  w: 4.3,
                  h: 2.1
                });
              } catch (imgErr) {
                console.error("Gagal menyematkan gambar di PPTX:", imgErr);
              }

              // Split bullets into 2 columns at the bottom
              const half = Math.ceil((slideData.bullets || []).length / 2);
              const bulletsCol1 = (slideData.bullets || []).slice(0, half).map((b: string) => {
                return { text: b, options: { bullet: true, color: "1E293B", paraSpaceAfter: 4 } };
              });
              const bulletsCol2 = (slideData.bullets || []).slice(half).map((b: string) => {
                return { text: b, options: { bullet: true, color: "1E293B", paraSpaceAfter: 4 } };
              });

              slide.addText(bulletsCol1, {
                x: 0.6,
                y: 4.1,
                w: 5.8,
                h: 2.5,
                fontSize: 11,
                fontFace: "Arial"
              });

              slide.addText(bulletsCol2, {
                x: 6.8,
                y: 4.1,
                w: 5.8,
                h: 2.5,
                fontSize: 11,
                fontFace: "Arial"
              });
            }
          } else {
            // Full width layout
            slide.addText(bulletsList, {
              x: 0.6,
              y: 1.9,
              w: 12.1,
              h: 4.5,
              fontSize: 13,
              fontFace: "Arial"
            });
          }
        }
      });

      const sanitizedTitle = (pres.judul || "presentasi_materi").replace(/[^a-zA-Z0-9]/g, "_");
      pptx.writeFile({ fileName: `materi_${sanitizedTitle}.pptx` })
        .then(() => triggerAlert("Unduh file PPTX berhasil!", "success"))
        .catch((err) => {
          console.error(err);
          triggerAlert("Gagal mengunduh berkas PPTX.", "error");
        });
    } catch (err) {
      console.error(err);
      triggerAlert("Sistem gagal menghasilkan file PowerPoint.", "error");
    }
  };

  const handleDeletePresentation = async (id: string) => {
    try {
      const res = await fetch(`/api/presentations/${id}`, { method: "DELETE" });
      if (res.ok) {
        triggerAlert("Presentasi berhasil dihapus.", "success");
        // Reload list
        const listRes = await fetch("/api/presentations");
        if (listRes.ok) setSavedPresentations(await listRes.json());
      } else {
        triggerAlert("Gagal menghapus presentasi.", "error");
      }
    } catch (err) {
      console.error(err);
      triggerAlert("Koneksi gagal saat menghapus presentasi.", "error");
    }
  };

  // Export Student list to genuine Excel format (.xlsx)
  const exportStudentsToExcel = () => {
    if (students.length === 0) {
      triggerAlert(`Tidak ada data siswa untuk diekspor di kelas ${selectedClass}`, "error");
      return;
    }

    const headers = ["nama", "username", "kelas", "alamat", "citaCita", "motoHidup", "noHp", "password"];
    const rows = students.map(s => [
      s.nama || "",
      s.username || "",
      s.kelas || "",
      s.alamat || "",
      s.citaCita || "",
      s.motoHidup || "",
      s.noHp || "",
      s.password || "123"
    ]);

    // Build worksheet with header row first
    const wsData = [headers, ...rows];
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Kelas ${selectedClass}`);

    XLSX.writeFile(workbook, `data_siswa_kelas_${selectedClass}.xlsx`);
    triggerAlert(`Berhasil mengekspor ${students.length} data siswa Kelas ${selectedClass} ke Excel (.xlsx).`, "success");
  };

  // Download Student template in genuine Excel format (.xlsx)
  const downloadTemplateExcel = () => {
    const headers = ["nama", "username", "kelas", "alamat", "citaCita", "motoHidup", "noHp", "password"];
    const sampleRow1 = [
      "Ahmad Fauzi",
      "ahmadfauzi",
      selectedClass || "7A",
      "Jl. KH. Wahid Hasyim No. 7, Sawojajar, Brebes",
      "Guru",
      "Belajar Sepanjang Hayat",
      "085123456789",
      "password123"
    ];
    const sampleRow2 = [
      "Siti Aminah",
      "sitiaminah",
      selectedClass || "7A",
      "Sawojajar RT 02 RW 03, Brebes",
      "Dokter",
      "Bermanfaat bagi sesama",
      "085234567890",
      "siswa2026"
    ];

    const wsData = [headers, sampleRow1, sampleRow2];
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Siswa");

    XLSX.writeFile(workbook, "template_tambah_siswa.xlsx");
    triggerAlert("Template Excel (.xlsx) berhasil diunduh. Silakan isi dan unggah kembali.", "success");
  };

  // Import Student list from genuine Excel file (.xlsx, .xls)
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (!arrayBuffer) {
          triggerAlert("File kosong atau rusak.", "error");
          return;
        }

        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Parse sheet to array of arrays
        const jsonRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
        if (jsonRows.length <= 1) {
          triggerAlert("Tidak ada data siswa ditemukan di file Excel.", "error");
          return;
        }

        const headers = jsonRows[0].map((h: any) => String(h || "").trim().toLowerCase());
        const namaIdx = headers.indexOf("nama");
        const usernameIdx = headers.indexOf("username");
        const kelasIdx = headers.indexOf("kelas");
        const alamatIdx = headers.indexOf("alamat");
        const citaCitaIdx = headers.indexOf("citacita");
        const motoHidupIdx = headers.indexOf("motohidup");
        const noHpIdx = headers.indexOf("nohp");
        const passwordIdx = headers.indexOf("password");

        if (namaIdx === -1 || usernameIdx === -1 || kelasIdx === -1) {
          triggerAlert("Format kolom salah! Harus mengandung kolom: nama, username, kelas", "error");
          return;
        }

        const importedStudents: any[] = [];

        for (let i = 1; i < jsonRows.length; i++) {
          const row = jsonRows[i];
          if (!row || row.length === 0) continue;

          const nama = String(row[namaIdx] || "").trim();
          const username = String(row[usernameIdx] || "").trim().replace(/\s+/g, "").toLowerCase();
          const kelas = String(row[kelasIdx] || "").trim().toUpperCase();
          const alamat = alamatIdx !== -1 ? String(row[alamatIdx] || "").trim() : "";
          const citaCita = citaCitaIdx !== -1 ? String(row[citaCitaIdx] || "").trim() : "";
          const motoHidup = motoHidupIdx !== -1 ? String(row[motoHidupIdx] || "").trim() : "";
          const noHp = noHpIdx !== -1 ? String(row[noHpIdx] || "").trim() : "";
          const password = passwordIdx !== -1 ? String(row[passwordIdx] || "").trim() : "123";

          if (nama && username && kelas) {
            importedStudents.push({
              nama,
              username,
              kelas,
              alamat,
              citaCita,
              motoHidup,
              noHp,
              password,
              foto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60"
            });
          }
        }

        if (importedStudents.length === 0) {
          triggerAlert("Tidak ada data siswa valid yang ditemukan di file Excel.", "error");
          return;
        }

        setLoadingAction("Mengimpor data siswa...");
        const res = await fetch("/api/students/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ students: importedStudents })
        });

        setLoadingAction(null);
        if (res.ok) {
          const result = await res.json();
          triggerAlert(`Berhasil mengimpor ${result.count} data siswa baru dari Excel!`, "success");
          fetchData();
          e.target.value = "";
        } else {
          const err = await res.json();
          triggerAlert(`Gagal mengimpor siswa: ${err.message || "Kesalahan server"}`, "error");
        }
      } catch (err) {
        setLoadingAction(null);
        triggerAlert("Gagal memproses file Excel.", "error");
        console.error(err);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Create or Edit Teacher (Admin Action)
  const handleAddOrEditTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.nama || !teacherForm.username) {
      triggerAlert("Nama dan Username guru harus diisi.", "error");
      return;
    }

    try {
      if (editingTeacherId) {
        // Edit teacher
        const res = await fetch(`/api/teachers/${editingTeacherId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teacherForm)
        });
        if (res.ok) {
          setSuccessOverlay({ show: true, msg: "Data Guru Berhasil Diperbarui!" });
          setShowAddTeacherModal(false);
          setEditingTeacherId(null);
          fetchData();
          setTimeout(() => {
            setSuccessOverlay({ show: false, msg: "" });
            setActiveTab("admin-teachers");
          }, 1800);
        } else {
          const errData = await res.json().catch(() => ({}));
          triggerAlert(errData.message || "Gagal memperbarui data guru.", "error");
        }
      } else {
        // Create teacher
        const res = await fetch("/api/teachers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teacherForm)
        });
        if (res.ok) {
          setSuccessOverlay({ show: true, msg: "Guru Baru Berhasil Ditambahkan!" });
          setShowAddTeacherModal(false);
          fetchData();
          setTimeout(() => {
            setSuccessOverlay({ show: false, msg: "" });
            setActiveTab("admin-teachers");
          }, 1800);
        } else {
          const errData = await res.json().catch(() => ({}));
          triggerAlert(errData.message || "Gagal menambahkan guru baru.", "error");
        }
      }
      setTeacherForm({
        username: "",
        nama: "",
        nuptk: "",
        mapel: "Fiqih",
        kelasDiajar: [],
        password: "",
        noHp: ""
      });
    } catch (e) {
      triggerAlert("Gagal menyimpan data guru.", "error");
    }
  };

  // Delete Teacher (Admin Action)
  const handleDeleteTeacher = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data guru ini?")) return;
    try {
      const res = await fetch(`/api/teachers/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        triggerAlert("Data guru berhasil dihapus.", "success");
        fetchData();
      }
    } catch (e) {
      triggerAlert("Gagal menghapus guru.", "error");
    }
  };

  // Create TKA Task (Guru & Admin)
  const handleCreateTkaTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tkaForm.judul) {
      triggerAlert("Judul TKA wajib diisi.", "error");
      return;
    }
    try {
      const targetKelas = tkaForm.kelas;
      const questions = getTkaDefaultQuestions(tkaForm.bidangUji, targetKelas);
      const payload = {
        judul: tkaForm.judul,
        deskripsi: tkaForm.deskripsi,
        kelas: targetKelas,
        deadlineTanggal: tkaForm.deadlineTanggal,
        items: questions.map((_, i) => `Butir Soal ${i + 1}`),
        bidangUji: tkaForm.bidangUji,
        sistemPenilaian: tkaForm.sistemPenilaian,
        kkm: tkaForm.kkm,
        soalTka: questions,
        soal: questions
      };
      
      const res = await fetch("/api/tka/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        triggerAlert("Asesmen Tes Kemampuan Akademik (TKA) berhasil diterbitkan.", "success");
        setTkaForm({
          judul: "",
          deskripsi: "",
          kelas: "7",
          deadlineTanggal: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          items: [],
          bidangUji: "Matematika (Numerasi)",
          sistemPenilaian: "IRT",
          kkm: 75
        });
        fetchData();
      } else {
        triggerAlert("Gagal menyimpan tugas TKA.", "error");
      }
    } catch (err) {
      triggerAlert("Gagal menyimpan tugas TKA.", "error");
    }
  };

  // Delete TKA Task
  const handleDeleteTkaTask = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus Tugas Keagamaan Amaliah ini? Semua laporan siswa yang bersangkutan juga akan dihapus.")) return;
    try {
      const res = await fetch(`/api/tka/tasks/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        triggerAlert("Tugas TKA berhasil dihapus.", "success");
        fetchData();
      }
    } catch (err) {
      triggerAlert("Gagal menghapus tugas TKA.", "error");
    }
  };

  // Submit Student TKA Checklist / Exam Answers
  const handleSubmitTkaSubmission = async (e: React.FormEvent, customTaskId?: string, isAutoSubmit?: boolean, isConfirmed?: boolean) => {
    e.preventDefault();
    const taskId = customTaskId || activeTkaTaskId;
    if (!taskId || !user) return;
    
    const task = tkaTasks.find(t => t.id === taskId);
    if (!task) return;

    let questions: any[] = [];
    if (task.soalTka) {
      if (Array.isArray(task.soalTka)) {
        questions = task.soalTka;
      } else if (typeof task.soalTka === "string") {
        try {
          questions = JSON.parse(task.soalTka);
        } catch (err) {
          console.error("Gagal parse soalTka string", err);
        }
      }
    } else if ((task as any).soal) {
      const ts = (task as any).soal;
      if (Array.isArray(ts)) {
        questions = ts;
      } else if (typeof ts === "string") {
        try {
          questions = JSON.parse(ts);
        } catch (err) {
          console.error("Gagal parse soal string", err);
        }
      }
    }

    const totalQuestions = questions.length;
    
    // Check if there are unanswered questions
    const answeredCount = questions.filter(q => {
      const ans = tkaExamAnswers[q.id];
      return ans !== undefined && ans !== null && ans !== "";
    }).length;

    if (!isAutoSubmit && answeredCount < totalQuestions) {
      setTkaAlertMsg("Ada Butir Soal Yang Belum Anda Kerjakan");
      return;
    }

    if (!isAutoSubmit && !isConfirmed) {
      setTkaConfirmData({
        show: true,
        taskId: taskId,
        message: "Anda yakin Ingin Mengirim Jawaban"
      });
      return;
    }

    try {
      // Calculate automated score if it has exam questions
      let computedScore = 80; // default fallback
      
      if (questions.length > 0) {
        if (task.sistemPenilaian === "Poin Klasik") {
          let points = 0;
          questions.forEach(q => {
            const studentAns = tkaExamAnswers[q.id]?.trim().toUpperCase();
            const correctAns = q.jawabanBenar.trim().toUpperCase();
            if (studentAns === correctAns) {
              points += 4;
            } else if (!studentAns) {
              points += 0;
            } else {
              points -= 1;
            }
          });
          // Scale from [-5, 20] to [0, 100]
          computedScore = Math.max(0, Math.round(((points + 5) / 25) * 100));
        } else {
          // IRT Scoring (Teori Respons Butir)
          let earnedIrt = 0;
          let totalIrt = 0;
          questions.forEach(q => {
            const studentAns = tkaExamAnswers[q.id]?.trim().toUpperCase();
            const correctAns = q.jawabanBenar.trim().toUpperCase();
            const weight = q.bobotIrt || 3.0;
            totalIrt += weight;
            if (studentAns === correctAns) {
              earnedIrt += weight;
            }
          });
          computedScore = totalIrt > 0 ? Math.round((earnedIrt / totalIrt) * 100) : 0;
        }
      }

      const payload = {
        tkaTaskId: taskId,
        tkaTaskJudul: task.judul,
        siswaId: user.id,
        namaSiswa: user.nama,
        kelasSiswa: (user as Siswa).kelas,
        jawabanChecklist: tkaChecklistAnswers,
        catatanAmaliah: tkaCatatanAmaliah,
        jawabanUjian: tkaExamAnswers,
        jawabanTka: tkaExamAnswers,
        nilai: computedScore,
        status: "Sudah Dinilai",
        catatanGuru: `TKA diselesaikan menggunakan metode evaluasi ${task.sistemPenilaian || "IRT"}. Hasil terekam secara objektif dalam database terstandar Kemendikdasmen.`,
        sistemPenilaianUsed: task.sistemPenilaian || "IRT",
        bidangUjiUsed: task.bidangUji || "Matematika",
        tanggalSubmisi: new Date().toISOString()
      };

      const res = await fetch("/api/tka/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        triggerAlert(`Asesmen TKA berhasil dikirim! Skor Anda: ${computedScore}`, "success");
        setActiveTkaTaskId(null);
        setSelectedTkaTaskToTake(null);
        setTkaChecklistAnswers({});
        setTkaExamAnswers({});
        setTkaCatatanAmaliah("");
        fetchData();
      } else {
        triggerAlert("Gagal mengirim laporan TKA.", "error");
      }
    } catch (err) {
      triggerAlert("Gagal mengirim laporan TKA.", "error");
    }
  };

  // Grade TKA Submission
  const handleGradeTkaSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingTkaSubmissionId) return;

    try {
      const payload = {
        status: "Sudah Dinilai",
        nilai: Number(tkaGrade),
        catatanGuru: tkaCatatanGuru,
        dinilaiOleh: user?.nama || "Guru"
      };

      const res = await fetch(`/api/tka/submissions/${gradingTkaSubmissionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        triggerAlert("Penilaian Test Kompetensi Akademik (TKA) berhasil disimpan.", "success");
        setGradingTkaSubmissionId(null);
        setTkaGrade(100);
        setTkaCatatanGuru("");
        fetchData();
      } else {
        triggerAlert("Gagal menyimpan penilaian TKA.", "error");
      }
    } catch (err) {
      triggerAlert("Gagal menyimpan penilaian TKA.", "error");
    }
  };

  // Create Book
  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.judul) {
      triggerAlert("Judul materi atau buku pelajaran harus diisi.", "error");
      return;
    }
    try {
      const payload: any = {
        ...bookForm,
        bab: []
      };
      
      if (uploadedFile) {
        payload.fileName = uploadedFile.name;
        payload.fileType = uploadedFile.type;
        payload.fileData = uploadedFile.data;
      }

      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSuccessOverlay({
          show: true,
          msg: "Buku / Materi Baru Berhasil Diunggah!",
          redirectText: "Kembali ke Laman Buku Pelajaran..."
        });
        setShowAddBookModal(false);
        setBookForm({ judul: "", mapel: "Fiqih", kelas: "7" });
        setUploadedFile(null);
        fetchData();
        setTimeout(() => {
          setSuccessOverlay({ show: false, msg: "" });
          setActiveTab("buku");
        }, 1800);
      } else {
        const errData = await res.json().catch(() => ({}));
        triggerAlert(errData.message || "Gagal mengunggah buku materi.", "error");
      }
    } catch (e) {
      triggerAlert("Gagal menyimpan materi.", "error");
    }
  };

  // Delete Book
  const handleDeleteBook = async (id: string) => {
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        triggerAlert("Buku atau berkas materi berhasil dihapus.", "success");
        fetchData();
      }
    } catch (e) {
      triggerAlert("Gagal menghapus materi.", "error");
    }
  };

  // Add Chapter to Book
  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterForm.bookId || !chapterForm.judul || !chapterForm.konten) {
      triggerAlert("Harap isi semua kolom bab.", "error");
      return;
    }

    const book = books.find((b) => b.id === chapterForm.bookId);
    if (!book) return;

    const updatedChapters = [...book.bab, {
      nomor: Number(chapterForm.nomor),
      judul: chapterForm.judul,
      konten: chapterForm.konten
    }].sort((a, b) => a.nomor - b.nomor);

    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...book, bab: updatedChapters })
      });
      if (res.ok) {
        triggerAlert(`Bab baru berhasil ditambahkan ke buku ${book.judul}.`, "success");
        setShowAddChapterModal(false);
        setChapterForm({ bookId: "", nomor: 1, judul: "", konten: "" });
        fetchData();
      }
    } catch (e) {
      triggerAlert("Gagal menambahkan bab.", "error");
    }
  };

  // AI Automatic Question Generator via GROQ
  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    setGenPreviewQuestions([]);
    setGenSuccessMsg("");

    // Look for matching book in DB to find content reference
    const matchedBook = books.find((b) => b.mapel === genMapel && isBookClassMatch(b.kelas, genKelas));
    let matchedChapterText = "";
    if (matchedBook && genBab) {
      const chapter = matchedBook.bab.find((ch) => `${ch.nomor}` === genBab || ch.judul.includes(genBab));
      if (chapter) {
        matchedChapterText = chapter.konten;
      }
    }

    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mapel: genMapel,
          kelas: genKelas,
          semester: genSemester,
          bab: genBab ? `Bab ${genBab}` : "Umum / Kurikulum Standar",
          jumlahSoal: genJumlahSoal,
          referensiMateri: matchedChapterText
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGenPreviewQuestions(data.questions);
        if (data.fallbackUsed) {
          triggerAlert(data.message, "info");
        } else {
          triggerAlert("AI berhasil menyusun soal tugas berkualitas tinggi!", "success");
        }
      } else {
        triggerAlert("Gagal menghubungi mesin AI. Menggunakan bank soal cadangan lokal.", "error");
      }
    } catch (err) {
      triggerAlert("Gagal memanggil AI generator.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Confirm and Publish the Generated Task
  const handlePublishTask = async () => {
    if (genPreviewQuestions.length === 0) return;

    const newTugas: Partial<Tugas> = {
      kelas: genKelas,
      mapel: genMapel,
      semester: genSemester,
      bab: genBab ? `Bab ${genBab}` : "Evaluasi Umum",
      jumlahSoal: genPreviewQuestions.length,
      waktu: genWaktu,
      deadlineTanggal: genDeadlineTanggal,
      soal: genPreviewQuestions
    };

    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTugas)
      });

      if (res.ok) {
        triggerAlert("Tugas berhasil dipublikasikan untuk seluruh siswa kelas!", "success");
        setGenPreviewQuestions([]);
        setGenSuccessMsg("Tugas Berhasil Dipublikasikan!");
        fetchData();
        setActiveTab("dashboard");
      }
    } catch (e) {
      triggerAlert("Gagal mempublikasikan tugas.", "error");
    }
  };

  // Student Quiz Operations
  const startStudentQuiz = (tugas: Tugas) => {
    // Check if class matches
    if ((user as Siswa).kelas !== tugas.kelas) {
      triggerAlert(`Maaf, tugas ini dikhususkan untuk kelas ${tugas.kelas}. Anda berada di kelas ${(user as Siswa).kelas}.`, "error");
      return;
    }

    // Check if already completed
    const alreadyDone = submissions.find((s) => s.tugasId === tugas.id && s.siswaId === user.id);
    if (alreadyDone) {
      triggerAlert("Anda sudah mengerjakan tugas ini sebelumnya.", "error");
      return;
    }

    setActiveQuiz(tugas);
    setQuizAnswers({});
    setQuizTimeLeft(tugas.waktu * 60);
    setQuizTimerActive(true);
    setActiveTab("mengerjakan");
  };

  // Quiz Timer Countdown Loop
  useEffect(() => {
    let interval: any = null;
    if (quizTimerActive && quizTimeLeft > 0) {
      interval = setInterval(() => {
        setQuizTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setQuizTimerActive(false);
            submitQuizAutomatically();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizTimerActive, quizTimeLeft]);

  // Submit student quiz
  const submitQuiz = async (answersToSubmit = quizAnswers) => {
    if (!activeQuiz || !user) return;

    setQuizTimerActive(false);

    // Calculate score
    let correctCount = 0;
    activeQuiz.soal.forEach((q) => {
      if (answersToSubmit[q.id] === q.jawabanBenar) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / activeQuiz.soal.length) * 100);
    const durationSpent = (activeQuiz.waktu * 60) - quizTimeLeft;

    const submissionData: Partial<JawabanSiswa> = {
      tugasId: activeQuiz.id,
      siswaId: user.id,
      namaSiswa: user.nama,
      kelas: (user as Siswa).kelas,
      nilai: finalScore,
      jawaban: answersToSubmit,
      waktuPengerjaanDetik: durationSpent
    };

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData)
      });

      if (res.ok) {
        const resData = await res.json();
        const savedId = resData.id || 'j_' + Date.now();
        triggerAlert(`Selamat! Anda berhasil menyelesaikan tugas dengan nilai ${finalScore}.`, "success");
        
        const completedSubmission: JawabanSiswa = {
          id: savedId,
          tugasId: activeQuiz.id,
          siswaId: user.id,
          namaSiswa: user.nama,
          kelas: (user as Siswa).kelas,
          nilai: finalScore,
          jawaban: answersToSubmit,
          tanggalSelesai: new Date().toISOString(),
          waktuPengerjaanDetik: durationSpent
        };

        setActiveQuiz(null);
        setActiveTab("tugas");
        setViewingTugasSubmission({
          submission: completedSubmission,
          tugas: activeQuiz
        });
        fetchData();
      } else {
        triggerAlert("Terjadi kesalahan saat mengumpulkan tugas.", "error");
      }
    } catch (e) {
      triggerAlert("Gagal terhubung ke server.", "error");
    }
  };

  const submitQuizAutomatically = () => {
    triggerAlert("Waktu Anda habis! Sistem mengumpulkan jawaban Anda secara otomatis.", "info");
    submitQuiz(quizAnswers);
  };

  // Print Window Trigger
  const handlePrint = () => {
    window.print();
  };

  // Print Tugas Madrasah Certificate Flow
  const handlePrintTugas = (sub: JawabanSiswa, tugas: Tugas) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      // Find matching teacher
      const matchingGuru = teachers.find(t => 
        t.mapel?.toLowerCase() === tugas.mapel?.toLowerCase() && 
        t.kelasDiajar?.includes(sub.kelas || "")
      ) || teachers.find(t => 
        t.mapel?.toLowerCase() === tugas.mapel?.toLowerCase()
      );

      const guruNama = matchingGuru ? matchingGuru.nama : "Nurul Huda, S.Ag.";
      const guruRole = matchingGuru ? "Guru Mata Pelajaran" : "Kepala Madrasah";
      const guruIdLabel = matchingGuru ? "NUPTK" : "ID";
      const guruIdValue = matchingGuru ? matchingGuru.nuptk : "197410122005011002";

      printWindow.document.write(`
        <html>
          <head>
            <title>Hasil Tugas Madrasah - ${sub.namaSiswa}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;950&family=Playfair+Display:wght@700;800&display=swap');
              
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              
              body {
                font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
                background-color: #ffffff !important;
                color: #0f172a !important;
                padding: 40px !important;
                line-height: 1.5;
              }

              @page {
                size: A4 portrait;
                margin: 15mm;
              }
            </style>
          </head>
          <body class="bg-white p-6 antialiased">
            <div class="max-w-2xl mx-auto border-4 double border-emerald-600 rounded-3xl p-8 bg-emerald-50/10 relative shadow-md">
              
              <!-- Header / Kop Surat -->
              <div class="text-center space-y-1 border-b-2 border-black pb-3 mb-6">
                <h4 class="text-[13px] text-black font-medium tracking-tight">
                  YAYASAN PENDIDIKAN MA’ARIF ATH-THOHIRIYAH
                </h4>
                <h1 class="text-[21px] font-extrabold text-emerald-600 uppercase tracking-wide" style="color: #059669 !important;">
                  MTs. MA’ARIF NU 7 SAWOJAJAR
                </h1>
                <h2 class="text-[15px] font-bold text-black uppercase tracking-tight">
                  KECAMATAN WANASARI KABUPATEN BREBES
                </h2>
                <p class="text-[10px] font-bold text-black">
                  SK Menkumham RI No. : AHU-0014995.AH.01.04.Tahun 2016
                </p>
                <p class="text-[9px] text-black">
                  Alamat : Jl. Raya Pemuda KM. 5,5 Sawojajar Kecamatan Wanasari Kabupaten Brebes
                </p>
              </div>

              <!-- Certificate Title -->
              <div class="text-center space-y-2 mb-6">
                <h3 class="font-serif font-extrabold text-xl text-slate-800 tracking-wide uppercase">
                  Laporan Hasil Evaluasi & Tugas Madrasah
                </h3>
                <p class="text-xs font-mono text-emerald-800 font-bold">
                  Nomor Seri: LHETM/MTs-${sub.kelas || "7"}/${(sub.id || "").substring(0, 8).toUpperCase()}
                </p>
              </div>

              <p class="text-xs text-slate-600 leading-relaxed text-center max-w-md mx-auto mb-6">
                Dengan ini menerangkan secara resmi bahwa siswa yang tercantum di bawah ini telah menyelesaikan Tugas Madrasah / Evaluasi Pembelajaran Mandiri Teruji AI:
              </p>

              <!-- Student Identity Block -->
              <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 max-w-sm mx-auto space-y-2 text-xs shadow-sm mb-6">
                <div class="flex justify-between border-b border-slate-200 pb-1.5">
                  <span class="text-slate-500 font-medium">Nama Lengkap</span>
                  <span class="font-extrabold text-slate-950">${sub.namaSiswa}</span>
                </div>
                <div class="flex justify-between border-b border-slate-200 pb-1.5">
                  <span class="text-slate-500 font-medium">Nomor Induk Siswa (NIS)</span>
                  <span class="font-mono font-bold text-slate-800">MTs-${sub.siswaId || 'Siswa'}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500 font-medium">Kelas / Satuan Pendidikan</span>
                  <span class="font-bold text-slate-800">Kelas ${sub.kelas || "7"} - MTs Model</span>
                </div>
              </div>

              <!-- Scoring Block -->
              <div class="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                <div class="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-center">
                  <span class="text-[9px] uppercase font-bold text-emerald-800 block">Mata Pelajaran</span>
                  <span class="text-[10px] font-extrabold text-slate-800 block truncate mt-1">
                    ${tugas.mapel || "Umum"}
                  </span>
                </div>
                <div class="bg-amber-50 rounded-xl p-3 border border-amber-100 text-center">
                  <span class="text-[9px] uppercase font-bold text-amber-800 block">Nilai Tugas</span>
                  <span class="text-lg font-black text-amber-950 block mt-1">
                    ${sub.nilai || 0}
                  </span>
                </div>
                <div class="bg-blue-50 rounded-xl p-3 border border-blue-100 text-center">
                  <span class="text-[9px] uppercase font-bold text-blue-800 block">Status Capaian</span>
                  <span class="text-[10px] font-extrabold block mt-2 ${(sub.nilai || 0) >= 75 ? 'text-emerald-700' : 'text-rose-700'}">
                    ${(sub.nilai || 0) >= 75 ? "TUNTAS KKM" : "BELUM TUNTAS"}
                  </span>
                </div>
              </div>

              <!-- Additional Meta (Bab / Chapter) -->
              <div class="max-w-md mx-auto text-center mb-8 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-medium text-slate-600">
                Materi Tugas: <span class="font-bold text-slate-800">${tugas.bab || "-"}</span>
              </div>

              <!-- Stamp & Footer Signatures -->
              <div class="flex justify-between items-end pt-4 border-t border-slate-200">
                <!-- Left Footer Print out -->
                <div class="text-left text-[9px] text-slate-400 font-mono">
                  © 2026 Smart Teacher  • Powered By Ahmad Tekor •
                </div>

                <div class="text-center w-56 relative">
                  <p class="text-[10px] text-slate-500 font-medium">
                    Brebes, ${new Date(sub.tanggalSelesai).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                  <p class="text-xs font-bold text-slate-700 mt-1">${guruRole},</p>
                  
                  <!-- QR Code / Tanda Tangan Digital -->
                  <div class="my-1.5 flex justify-center">
                    <svg width="45" height="45" viewBox="0 0 29 29" fill="none" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 1h6v6H1V1zm2 2v2h2V3H3zm8-2h2v2h-2V1zm4 0h2v4h-2V1zm4 0h6v6h-6V1zm2 2v2h2V3h-2zM1 11h2v2H1v-2zm4 0h2v4H5v-4zm4 0h4v2H9v-2zm6 0h2v2h-2v-2zm4 0h4v4h-4v-4zm-8 4H9v2h2v-2zm2 0h2v4h-2v-4zm6 0h2v2h-2v-2zM1 21h6v6H1v-6zm2 2v2h2v-2H3zm8-2h2v4h-2v-4zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm2 2h2v4h-2v-4zm-4 2h2v2h-2v-2zm-4 0h2v2h-2v-2z"/>
                    </svg>
                  </div>

                  <p class="text-xs font-extrabold text-slate-950 underline">
                    ${guruNama}
                  </p>
                  <p class="text-[9px] text-slate-500 font-bold font-mono mt-0.5">
                    ${guruIdLabel}. ${guruIdValue}
                  </p>
                </div>
              </div>

            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 400);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Print SHTKA Certificate Flow
  const handlePrintShtka = (sub: TkaSubmission) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Sertifikat Hasil TKA - ${sub.namaSiswa}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;950&family=Playfair+Display:wght@700;800&display=swap');
              
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              
              body {
                font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
                background-color: #ffffff !important;
                color: #0f172a !important;
                padding: 40px !important;
                line-height: 1.5;
              }

              @page {
                size: A4 portrait;
                margin: 15mm;
              }
            </style>
          </head>
          <body class="bg-white p-6 antialiased">
            <div class="max-w-2xl mx-auto border-4 double border-amber-600 rounded-3xl p-8 bg-amber-50/10 relative shadow-md">
              
              <!-- Header / Kop Surat -->
              <div class="text-center space-y-1 border-b-2 border-black pb-3 mb-6">
                <h4 class="text-[13px] text-black font-medium tracking-tight">
                  YAYASAN PENDIDIKAN MA’ARIF ATH-THOHIRIYAH
                </h4>
                <h1 class="text-[21px] font-extrabold text-emerald-600 uppercase tracking-wide" style="color: #16a34a !important;">
                  MTs. MA’ARIF NU 7 SAWOJAJAR
                </h1>
                <h2 class="text-[15px] font-bold text-black uppercase tracking-tight">
                  KECAMATAN WANASARI KABUPATEN BREBES
                </h2>
                <p class="text-[10px] font-bold text-black">
                  SK Menkumham RI No. : AHU-0014995.AH.01.04.Tahun 2016
                </p>
                <p class="text-[9px] text-black">
                  Alamat : Jl. Raya Pemuda KM. 5,5 Sawojajar Kecamatan Wanasari Kabupaten Brebes
                </p>
              </div>

              <!-- Certificate Title -->
              <div class="text-center space-y-2 mb-6">
                <h3 class="font-serif font-extrabold text-xl text-slate-800 tracking-wide uppercase">
                  Sertifikat Hasil TKA (SHTKA)
                </h3>
                <p class="text-xs font-mono text-amber-800 font-bold">
                  Nomor Seri: SHTKA/SMP-${(user as Siswa)?.kelas || "7"}/${sub.id.substring(0, 8).toUpperCase()}
                </p>
              </div>

              <p class="text-xs text-slate-600 leading-relaxed text-center max-w-md mx-auto mb-6">
                Dengan ini menerangkan secara resmi bahwa siswa yang tercantum di bawah ini telah menyelesaikan ujian evaluasi capaian kognitif terstandar nasional:
              </p>

              <!-- Student Identity Block -->
              <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 max-w-sm mx-auto space-y-2 text-xs shadow-sm mb-6">
                <div class="flex justify-between border-b border-slate-200 pb-1.5">
                  <span class="text-slate-500 font-medium">Nama Lengkap</span>
                  <span class="font-extrabold text-slate-950">${sub.namaSiswa}</span>
                </div>
                <div class="flex justify-between border-b border-slate-200 pb-1.5">
                  <span class="text-slate-500 font-medium">Nomor Induk Siswa (NIS)</span>
                  <span class="font-mono font-bold text-slate-800">MTs-${sub.siswaId || 'Siswa'}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500 font-medium">Kelas / Satuan Pendidikan</span>
                  <span class="font-bold text-slate-800">Kelas ${sub.kelasSiswa || (user as Siswa)?.kelas || "7"} - MTs Model</span>
                </div>
              </div>

              <!-- Scoring Block -->
              <div class="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                <div class="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-center">
                  <span class="text-[9px] uppercase font-bold text-emerald-800 block">Bidang Uji</span>
                  <span class="text-[10px] font-extrabold text-slate-800 block truncate mt-1">
                    ${sub.bidangUjiUsed || "Matematika"}
                  </span>
                </div>
                <div class="bg-amber-50 rounded-xl p-3 border border-amber-100 text-center">
                  <span class="text-[9px] uppercase font-bold text-amber-800 block">Nilai Akhir</span>
                  <span class="text-lg font-black text-amber-950 block mt-1">
                    ${sub.nilai || 0}
                  </span>
                </div>
                <div class="bg-blue-50 rounded-xl p-3 border border-blue-100 text-center">
                  <span class="text-[9px] uppercase font-bold text-blue-800 block">Status Hasil</span>
                  <span class="text-[10px] font-extrabold block mt-2 ${(sub.nilai || 0) >= ((sub as any).kkm || 75) ? 'text-emerald-700' : 'text-rose-700'}">
                    ${(sub.nilai || 0) >= ((sub as any).kkm || 75) ? "MELAMPAUI KKM" : "BELUM LULUS"}
                  </span>
                </div>
              </div>

              <!-- Stamp & Footer Signatures -->
              <div class="flex justify-between items-end pt-4 border-t border-slate-200">
                <!-- Left Footer Print out -->
                <div class="text-left text-[9px] text-slate-400 font-mono">
                  © 2026 Smart Teacher  • Powered By Ahmad Tekor •
                </div>

                <div class="text-center w-56 relative">
                  <p class="text-[10px] text-slate-500 font-medium">
                    Brebes, ${new Date(sub.tanggalSubmisi).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                  <p class="text-xs font-bold text-slate-700 mt-1">Kepala Madrasah,</p>
                  
                  <!-- QR Code / Tanda Tangan Digital -->
                  <div class="my-1.5 flex justify-center">
                    <svg width="45" height="45" viewBox="0 0 29 29" fill="none" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 1h6v6H1V1zm2 2v2h2V3H3zm8-2h2v2h-2V1zm4 0h2v4h-2V1zm4 0h6v6h-6V1zm2 2v2h2V3h-2zM1 11h2v2H1v-2zm4 0h2v4H5v-4zm4 0h4v2H9v-2zm6 0h2v2h-2v-2zm4 0h4v4h-4v-4zm-8 4H9v2h2v-2zm2 0h2v4h-2v-4zm6 0h2v2h-2v-2zM1 21h6v6H1v-6zm2 2v2h2v-2H3zm8-2h2v4h-2v-4zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm2 2h2v4h-2v-4zm-4 2h2v2h-2v-2zm-4 0h2v2h-2v-2z"/>
                    </svg>
                  </div>

                  <p class="text-xs font-extrabold text-slate-950 underline">
                    Nurul Huda, S.Ag.
                  </p>
                  <p class="text-[9px] text-slate-500 font-bold font-mono mt-0.5">
                    ID.197410122005011002
                  </p>
                </div>
              </div>

            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 400);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Print Individual Submission Answer Sheet
  const handlePrintSubmission = () => {
    const printContent = document.getElementById("printable-submission-area");
    if (!printContent) return;
    
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      // Gather stylesheets from the main document to preserve Tailwind and local theme styles
      const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
        .map(style => style.outerHTML)
        .join('\n');

      printWindow.document.write(`
        <html>
          <head>
            <title>Lembar Jawaban Hasil Tugas Siswa - ${selectedSubmission?.namaSiswa || 'Rekap'}</title>
            <!-- Include Tailwind CDN so utility classes are compiled perfectly on the print page -->
            <script src="https://cdn.tailwindcss.com"></script>
            ${stylesheets}
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
              
              /* Force browsers to print backgrounds and colors accurately */
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              
              body {
                font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
                background-color: #ffffff !important;
                color: #0f172a !important;
                padding: 20px !important;
                line-height: 1.5;
              }

              /* Configure page size and clean margins */
              @page {
                size: A4 portrait;
                margin: 15mm;
              }
              
              /* Ensure there are no cutoffs and text renders crisply */
              body, html {
                width: 100%;
                height: auto;
              }
            </style>
          </head>
          <body class="bg-white p-6 antialiased">
            <div class="max-w-3xl mx-auto">
              ${printContent.innerHTML}
            </div>
            <script>
              window.onload = function() {
                // Short timeout to guarantee Tailwind parser completes compilation
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 400);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-200">
      
      {/* Alert Notifier toast style */}
      {alertMsg && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl transition-all duration-300 transform translate-y-0 ${
          alertMsg.type === "success" ? "bg-emerald-600 text-white" :
          alertMsg.type === "error" ? "bg-red-600 text-white" : "bg-sky-700 text-white"
        }`}>
          <Sparkles className="w-5 h-5 flex-shrink-0 animate-spin" />
          <span className="text-sm font-semibold">{alertMsg.text}</span>
          <button onClick={() => setAlertMsg(null)} className="ml-2 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SUCCESS OVERLAY POPUP */}
      {successOverlay.show && (
        <div id="success-save-overlay" className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-2xl max-w-sm w-full mx-4 text-center animate-in zoom-in-95 duration-300 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border-4 border-emerald-500/20 shadow-inner animate-pulse">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mb-2">
              Berhasil Disimpan!
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              {successOverlay.msg}
            </p>
            <div className="mt-6 flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {successOverlay.redirectText || "Kembali ke Laman Kelola Guru..."}
            </div>
          </div>
        </div>
      )}

      {/* 1. LOGIN SCREEN OVERLAY */}
      {!user ? (
        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 md:p-12 relative overflow-hidden bg-slate-100">
          {/* Islamic Geometric Deco elements */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-100/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-yellow-100/30 rounded-full blur-3xl"></div>

          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-10 transition-transform duration-500 hover:scale-[1.01]">
            
            {/* Header branding */}
            <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 p-8 text-center text-white relative">
              <div className="absolute top-3 right-3 text-amber-300/40 text-4xl">★</div>
              <div className="mx-auto w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg border-2 border-amber-400 mb-4 animate-bounce">
                <span className="text-white font-extrabold text-2xl tracking-tighter">AI</span>
              </div>
              <h2 className="text-2xl font-display font-extrabold tracking-tight">Smart Teacher</h2>
              <p className="text-xs text-emerald-100 mt-1 font-medium">
                Madrasah MTs Ma'arif NU 7 Sawojajar
              </p>
            </div>

            <div className="p-8">
              {/* Role selector tab */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1.5 rounded-xl mb-6">
                <button
                  onClick={() => setRoleInput("siswa")}
                  className={`py-2 px-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                    roleInput === "siswa"
                      ? "bg-white text-emerald-800 shadow-md border-b-2 border-emerald-600"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Siswa
                </button>
                <button
                  onClick={() => setRoleInput("guru")}
                  className={`py-2 px-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                    roleInput === "guru"
                      ? "bg-white text-emerald-800 shadow-md border-b-2 border-emerald-600"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Guru
                </button>
                <button
                  onClick={() => setRoleInput("admin")}
                  className={`py-2 px-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                    roleInput === "admin"
                      ? "bg-white text-emerald-800 shadow-md border-b-2 border-emerald-600"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span className="text-xs">🔑</span>
                  Admin
                </button>
              </div>

              {authError && (
                <div className="bg-red-50 text-red-700 text-xs p-3.5 rounded-xl mb-4 border border-red-100 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">
                    Nama Pengguna
                  </label>
                  <input
                    type="text"
                    value={usernameInput || ""}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder={
                      roleInput === "admin"
                        ? "Masukkan nama pengguna admin"
                        : roleInput === "guru"
                        ? "contoh: anisa, syarif, mansur"
                        : "contoh: ahmad, siti, yusuf, laila, rizky"
                    }
                    className="w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none bg-slate-50 border"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    value={passwordInput || ""}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder={roleInput === "admin" ? "Masukkan kata sandi admin" : "Sandi akun (Default: 123)"}
                    className="w-full rounded-xl border-slate-200 px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none bg-slate-50 border"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 ml-1">
                    Hubungi Admin Jika Anda belum terdaftar
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all transform hover:translate-y-[-1px] active:translate-y-[1px]"
                  >
                    <span>Masuk Kelas Digital</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Quick testing helpers */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <span className="block text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                  Akses Cepat Pengujian
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => {
                      setUsernameInput("admin");
                      setPasswordInput("admin");
                      setRoleInput("admin");
                    }}
                    className="text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 py-2 px-1 rounded-lg border border-red-100 transition-colors text-center"
                  >
                    Admin (admin)
                  </button>
                  <button
                    onClick={() => {
                      setUsernameInput("anisa");
                      setPasswordInput("123");
                      setRoleInput("guru");
                    }}
                    className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 py-2 px-1 rounded-lg border border-emerald-100 transition-colors text-center"
                  >
                    Guru (anisa)
                  </button>
                  <button
                    onClick={() => {
                      setUsernameInput("ahmad");
                      setPasswordInput("123");
                      setRoleInput("siswa");
                    }}
                    className="text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 py-2 px-1 rounded-lg border border-amber-100 transition-colors text-center"
                  >
                    Siswa (ahmad)
                  </button>
                </div>
              </div>

            </div>
          </div>
          
          <p className="mt-8 text-xs text-slate-400 font-medium text-center">
            Aplikasi Handal e-Learning "Smart Teacher" • MTs Ma'arif NU 7 Sawojajar © 2026
          </p>
        </div>
      ) : (
        /* 2. LOGGED IN APPLICATION INTERFACE */
        <div className="flex-1 flex flex-col">
          <Header
            user={user}
            role={role}
            notifications={notifications}
            onLogout={handleLogout}
            onNavigateToSection={(sec) => setActiveTab(sec)}
          />

          {/* Main Dashboard Layout inside Max Width Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6" id="applet-main-view">
            
            {/* Class Switching utility on Teacher or Admin's panel */}
            {(role === "guru" || role === "admin") && (
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Panel Kontrol Pembelajaran ({role === "admin" ? "Administrator" : "Guru"})
                    </h3>
                    <p className="text-xs text-slate-500">
                      {role === "admin"
                        ? "Pilih kelas aktif untuk memfilter data siswa, buku, tugas, dan penilaian."
                        : "Kelola kelas pembelajaran berdasarkan penempatan mengajar Anda."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kelas Aktif:</span>
                  <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 justify-center">
                    {(role === "admin"
                      ? ["7A", "7B", "7C", "8A", "8B", "8C", "8D", "9A", "9B", "9C", "9D"]
                      : (user && (user as Guru).kelasDiajar) || ["7A"]
                    ).map((kls) => (
                      <button
                        key={kls}
                        onClick={() => setSelectedClass(kls)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          selectedClass === kls
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-emerald-700"
                        }`}
                      >
                        Kelas {kls}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BENTO GRID INTERFACE STARTS HERE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* SIDEBAR NAVIGATION BENTO CARD (Left pane - Spans 3 cols on Large Screens) */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                
                {/* 1. Primary Navigation Menu Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                    Menu Utama
                  </h2>
                  <nav className="space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab("dashboard");
                        setSelectedBookToRead(null);
                        setSelectedSubmission(null);
                      }}
                      className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                        activeTab === "dashboard"
                          ? "bg-emerald-600 text-white shadow-md"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-lg">🏠</span>
                      Dashboard
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("buku");
                        setSelectedBookToRead(null);
                        setSelectedSubmission(null);
                      }}
                      className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                        activeTab === "buku"
                          ? "bg-emerald-600 text-white shadow-md"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-lg">📚</span>
                      Buku Pelajaran
                    </button>

                    {(role === "guru" || role === "admin") && (
                      <button
                        onClick={() => {
                          setActiveTab("ai-presentation");
                          setSelectedBookToRead(null);
                          setSelectedSubmission(null);
                        }}
                        className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                          activeTab === "ai-presentation"
                            ? "bg-emerald-600 text-white shadow-md"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-lg">📊</span>
                        AI Presentasi (PPTX)
                      </button>
                    )}

                    {role === "admin" && (
                      <>
                        <button
                          onClick={() => {
                            setActiveTab("admin-teachers");
                            setSelectedBookToRead(null);
                            setSelectedSubmission(null);
                          }}
                          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                            activeTab === "admin-teachers"
                              ? "bg-emerald-600 text-white shadow-md"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-lg">👩‍🏫</span>
                          Kelola Guru
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab("siswa-kelola");
                            setSelectedBookToRead(null);
                            setSelectedSubmission(null);
                          }}
                          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                            activeTab === "siswa-kelola"
                              ? "bg-emerald-600 text-white shadow-md"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-lg">👥</span>
                          Kelola Siswa
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab("buat-tugas");
                            setSelectedBookToRead(null);
                            setSelectedSubmission(null);
                          }}
                          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                            activeTab === "buat-tugas"
                              ? "bg-emerald-600 text-white shadow-md"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-lg">✨</span>
                          AI Buat Tugas
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab("penilaian");
                            setSelectedBookToRead(null);
                            setSelectedSubmission(null);
                          }}
                          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                            activeTab === "penilaian"
                              ? "bg-emerald-600 text-white shadow-md"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-lg">📊</span>
                          Penilaian Siswa
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab("buat-tka");
                            setSelectedBookToRead(null);
                            setSelectedSubmission(null);
                          }}
                          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                            activeTab === "buat-tka"
                              ? "bg-emerald-600 text-white shadow-md"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-lg">🏆</span>
                          Asesmen TKA (SMP)
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab("penilaian-tka");
                            setSelectedBookToRead(null);
                            setSelectedSubmission(null);
                          }}
                          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                            activeTab === "penilaian-tka"
                              ? "bg-emerald-600 text-white shadow-md"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-lg">📜</span>
                          Sertifikat & Hasil TKA
                        </button>
                      </>
                    )}

                    {role === "guru" && (
                      <>
                        <button
                          onClick={() => {
                            setActiveTab("siswa-kelola");
                            setSelectedBookToRead(null);
                            setSelectedSubmission(null);
                          }}
                          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                            activeTab === "siswa-kelola"
                              ? "bg-emerald-600 text-white shadow-md"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-lg">👥</span>
                          Kelola Siswa
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab("buat-tugas");
                            setSelectedBookToRead(null);
                            setSelectedSubmission(null);
                          }}
                          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                            activeTab === "buat-tugas"
                              ? "bg-emerald-600 text-white shadow-md"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-lg">✨</span>
                          AI Buat Tugas
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab("penilaian");
                            setSelectedBookToRead(null);
                            setSelectedSubmission(null);
                          }}
                          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                            activeTab === "penilaian"
                              ? "bg-emerald-600 text-white shadow-md"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-lg">📊</span>
                          Penilaian Siswa
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab("buat-tka");
                            setSelectedBookToRead(null);
                            setSelectedSubmission(null);
                          }}
                          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                            activeTab === "buat-tka"
                              ? "bg-emerald-600 text-white shadow-md"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-lg">🏆</span>
                          Asesmen TKA (SMP)
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab("penilaian-tka");
                            setSelectedBookToRead(null);
                            setSelectedSubmission(null);
                          }}
                          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                            activeTab === "penilaian-tka"
                              ? "bg-emerald-600 text-white shadow-md"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-lg">📜</span>
                          Sertifikat & Hasil TKA
                        </button>
                      </>
                    )}

                    {role === "siswa" && (
                      <>
                        <button
                          onClick={() => {
                            setActiveTab("tugas");
                            setSelectedBookToRead(null);
                            setSelectedSubmission(null);
                          }}
                          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                            activeTab === "tugas"
                              ? "bg-emerald-600 text-white shadow-md"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-lg">📝</span>
                          Tugas Madrasah
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab("siswa-tka");
                            setSelectedBookToRead(null);
                            setSelectedSubmission(null);
                          }}
                          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                            activeTab === "siswa-tka"
                              ? "bg-emerald-600 text-white shadow-md"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-lg">🏆</span>
                          Ujian TKA (SMP)
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setActiveTab("perpustakaan")}
                      className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                        activeTab === "perpustakaan"
                          ? "bg-emerald-600 text-white shadow-md"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-lg">🏫</span>
                      Perpustakaan MTs
                    </button>
                  </nav>
                </div>

                {/* 2. Profile Bento Info Box */}
                <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                  <div className="absolute bottom-2 left-2 text-[8px] text-emerald-300 font-mono">
                    SmartTeacher-v1.2-APK
                  </div>

                  <div className="flex flex-col items-center text-center gap-3">
                    <img
                      src={user.foto}
                      alt={user.nama}
                      className="w-16 h-16 rounded-2xl border-2 border-amber-400 object-cover shadow-md"
                    />
                    <div>
                      <h3 className="font-bold text-sm leading-tight">{user.nama}</h3>
                      <p className="text-[10px] text-amber-300 font-semibold mt-1 uppercase tracking-wider">
                        {role === "guru" ? "Pendidik Madrasah" : `Siswa Kelas ${ (user as Siswa).kelas }`}
                      </p>
                    </div>

                    {role === "siswa" && (
                      <div className="w-full mt-3 pt-3 border-t border-white/10 text-left space-y-2">
                        <div className="text-[11px]">
                          <span className="text-emerald-300 font-bold block">Cita-Cita:</span>
                          <span className="text-slate-100 font-medium italic">"{(user as Siswa).citaCita || 'Belum diisi'}"</span>
                        </div>
                        <div className="text-[11px]">
                          <span className="text-emerald-300 font-bold block">Moto Hidup:</span>
                          <span className="text-slate-100 font-medium">"{(user as Siswa).motoHidup || 'Belum diisi'}"</span>
                        </div>
                        <button
                          onClick={() => setActiveTab("edit-profil-siswa")}
                          className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] text-center transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Edit2 className="w-3 h-3" />
                          Ubah Profil Saya
                        </button>
                      </div>
                    )}

                    {role === "guru" && (
                      <div className="w-full mt-2 text-left text-[11px] space-y-1 bg-white/5 p-2.5 rounded-xl border border-white/10">
                        <div>
                          <span className="text-emerald-300 font-bold">NUPTK: </span>
                          <span className="text-slate-200">{(user as Guru).nuptk || (user as any).nip || "-"}</span>
                        </div>
                        <div>
                          <span className="text-emerald-300 font-bold">Mata Pelajaran: </span>
                          <span className="text-slate-200">{(user as Guru).mapel}</span>
                        </div>
                        <button
                          onClick={() => setActiveTab("edit-profil-guru")}
                          className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-1 px-2 rounded-lg text-[9px] text-center transition-colors flex items-center justify-center gap-1 mt-2"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                          Ubah Profil Saya
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. School Quick Links Widget */}
                <div className="bg-sky-50 rounded-3xl p-5 border border-sky-100 shadow-sm">
                  <div className="flex items-center gap-2 text-sky-800 font-bold text-xs uppercase tracking-wider mb-3">
                    <BookMarked className="w-4 h-4 text-sky-600" />
                    <span>Profil Madrasah</span>
                  </div>
                  <ul className="space-y-2 text-[11px] font-medium text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      MTs Ma'arif NU 7 Sawojajar
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      NPSN: 20326477 • Akreditasi A
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Wanasari, Kabupaten Brebes
                    </li>
                  </ul>
                  <div className="mt-4 pt-3 border-t border-sky-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Sistem Digital MTs</span>
                    <span className="font-bold text-sky-600">AKTIF</span>
                  </div>
                </div>

              </div>

              {/* CENTER COMPONENT / BENTO CONTENT (Spans 9 cols on large screen) */}
              <div className="lg:col-span-9 flex flex-col gap-6">
                
                {/* -------------------- VIEW: DASHBOARD -------------------- */}
                {activeTab === "dashboard" && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Welcome Announcement Card */}
                    <div className="md:col-span-12 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
                      <div className="absolute right-0 top-0 opacity-10 text-[180px] select-none pointer-events-none translate-x-[40px] translate-y-[-40px]">
                        🕌
                      </div>
                      <div className="relative z-10 max-w-xl">
                        <span className="bg-amber-400 text-slate-900 font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                          Selamat Datang di Madrasah Digital
                        </span>
                        <h2 className="text-xl sm:text-3xl font-display font-black tracking-tight mt-3">
                          Assalamu'alaikum, {user.nama}
                        </h2>
                        <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed">
                          Selamat datang di aplikasi **Smart Teacher** MTs Ma'arif NU 7 Sawojajar. Platform e-learning dengan dukungan AI Generative untuk memudahkan proses belajar mengajar yang produktif, berkah, dan modern.
                        </p>
                      </div>
                    </div>

                    {/* STATS BENTO ROW */}
                    {role === "admin" ? (
                      <>
                        {/* Stats 1: Total Guru */}
                        <div className="md:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Pendidik (Guru)</span>
                            <span className="text-3xl font-black text-slate-800 mt-1 block">{teachers.length}</span>
                            <span className="text-[10px] text-red-600 font-semibold mt-1 block">Guru pengajar aktif</span>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center text-xl shadow-inner font-mono font-bold">
                            👩‍🏫
                          </div>
                        </div>

                        {/* Stats 2: Total Siswa */}
                        <div className="md:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Siswa Terdaftar (Aktif)</span>
                            <span className="text-3xl font-black text-slate-800 mt-1 block">
                              {students.length}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Semua rombongan belajar</span>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl shadow-inner font-mono font-bold">
                            👥
                          </div>
                        </div>

                        {/* Stats 3: Total Tugas */}
                        <div className="md:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tugas Terpublikasi</span>
                            <span className="text-3xl font-black text-slate-800 mt-1 block">
                              {assignments.length}
                            </span>
                            <span className="text-[10px] text-sky-600 font-semibold mt-1 block">Bank tugas AI Madrasah</span>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center text-xl shadow-inner font-mono font-bold">
                            📝
                          </div>
                        </div>
                      </>
                    ) : role === "guru" ? (
                      <>
                        {/* Stats 1: Total Siswa */}
                        <div className="md:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Siswa Kelas {selectedClass}</span>
                            <span className="text-3xl font-black text-slate-800 mt-1 block">{students.length}</span>
                            <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Siswa terdaftar aktif</span>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl shadow-inner">
                            👥
                          </div>
                        </div>

                        {/* Stats 2: Total Tugas Aktif */}
                        <div className="md:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tugas Aktif</span>
                            <span className="text-3xl font-black text-slate-800 mt-1 block">
                              {assignments.filter((t) => t.kelas === selectedClass).length}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Materi terpublikasi</span>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl shadow-inner">
                            📝
                          </div>
                        </div>

                        {/* Stats 3: Rata-rata Nilai */}
                        <div className="md:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Rata-Rata Nilai</span>
                            <span className="text-3xl font-black text-slate-800 mt-1 block">
                              {submissions.filter((s) => s.kelas === selectedClass).length > 0
                                ? Math.round(submissions.filter((s) => s.kelas === selectedClass).reduce((acc, cur) => acc + cur.nilai, 0) / submissions.filter((s) => s.kelas === selectedClass).length)
                                : "N/A"
                              }
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Dari pengumpulan tugas</span>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl shadow-inner">
                            📊
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Student Side Stats */}
                        {/* Stats 1: Tugas Saya */}
                        <div className="md:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tugas Tersedia</span>
                            <span className="text-3xl font-black text-slate-800 mt-1 block">
                              {assignments.filter((t) => t.kelas === (user as Siswa).kelas).length}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Sesuai jenjang kelas Anda</span>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl shadow-inner">
                            📖
                          </div>
                        </div>

                        {/* Stats 2: Tugas Selesai */}
                        <div className="md:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tugas Selesai</span>
                            <span className="text-3xl font-black text-slate-800 mt-1 block">
                              {submissions.filter((s) => s.siswaId === user.id).length}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Telah dinilai otomatis</span>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl shadow-inner">
                            ✅
                          </div>
                        </div>

                        {/* Stats 3: Nilai Rata-rata */}
                        <div className="md:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Nilai Rata-Rata</span>
                            <span className="text-3xl font-black text-slate-800 mt-1 block">
                              {submissions.filter((s) => s.siswaId === user.id).length > 0
                                ? Math.round(submissions.filter((s) => s.siswaId === user.id).reduce((acc, cur) => acc + cur.nilai, 0) / submissions.filter((s) => s.siswaId === user.id).length)
                                : "N/A"
                              }
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Fokus & Pertahankan prestasi!</span>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center text-xl shadow-inner">
                            🌟
                          </div>
                        </div>
                      </>
                    )}

                    {/* BENTO GRID: MULTI-FUNCTIONAL COLUMNS */}
                    {/* Column 1: AI Prompt Generator Quick Access or Tasks list */}
                    <div className="md:col-span-8 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-3xl p-6 border border-blue-200 shadow-sm relative overflow-hidden">
                      <div className="absolute right-[-20px] top-[-20px] w-36 h-36 bg-blue-300/30 rounded-full blur-2xl"></div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Brain className="w-5 h-5 text-indigo-700 animate-pulse" />
                          <h3 className="text-base font-bold text-indigo-950 font-display">
                            {role === "admin"
                              ? "Pusat Kendali Administrasi AI"
                              : role === "guru"
                              ? "AI Generator Soal Tugas"
                              : "Tugas Pelajaran Terkini"}
                          </h3>
                        </div>
                        <span className="bg-indigo-600 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">
                          AI Engine
                        </span>
                      </div>

                      {role === "admin" ? (
                        <div>
                          <p className="text-xs text-indigo-900 leading-relaxed mb-4">
                            Sebagai Administrator Utama MTs Ma'arif NU 7 Sawojajar, Anda memiliki kekuasaan penuh untuk mengelola database pendidik, mengalokasikan kelas mengajar, serta meninjau kuis pembelajaran berbasis AI.
                          </p>
                          
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <button
                              onClick={() => {
                                setActiveTab("admin-teachers");
                                setSelectedBookToRead(null);
                                setSelectedSubmission(null);
                              }}
                              className="bg-white/80 p-3 rounded-xl border border-indigo-200/50 text-left hover:bg-white transition-colors"
                            >
                              <span className="text-[9px] text-slate-500 font-bold block uppercase">Menu Guru</span>
                              <span className="text-xs font-bold text-red-700">👩‍🏫 Kelola Akun Guru</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveTab("siswa-kelola");
                                setSelectedBookToRead(null);
                                setSelectedSubmission(null);
                              }}
                              className="bg-white/80 p-3 rounded-xl border border-indigo-200/50 text-left hover:bg-white transition-colors"
                            >
                              <span className="text-[9px] text-slate-500 font-bold block uppercase">Menu Siswa</span>
                              <span className="text-xs font-bold text-emerald-700">👥 Kelola Database Siswa</span>
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              setActiveTab("buat-tugas");
                              setSelectedBookToRead(null);
                              setSelectedSubmission(null);
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors text-xs"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>Buka Generator Tugas AI</span>
                          </button>
                        </div>
                      ) : role === "guru" ? (
                        <div>
                          <p className="text-xs text-indigo-900 leading-relaxed mb-4">
                            Gunakan asisten kecerdasan buatan (Artificial Inteligent) ** Tekor AI ** untuk menyusun soal evaluasi otomatis dari bab buku pelajaran. Cukup klik tombol di bawah untuk langsung menyusun kuis dengan sekali ketukan.
                          </p>
                          
                          <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className="bg-white/80 p-3 rounded-xl border border-indigo-200/50">
                              <span className="text-[9px] text-slate-500 font-bold block uppercase">Buku Pelajaran</span>
                              <span className="text-xs font-bold text-slate-800">Sesuai Bab Pilihan</span>
                            </div>
                            <div className="bg-white/80 p-3 rounded-xl border border-indigo-200/50">
                              <span className="text-[9px] text-slate-500 font-bold block uppercase">Output Format</span>
                              <span className="text-xs font-bold text-slate-800">Pilihan Ganda & Jawaban</span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setActiveTab("buat-tugas");
                              setSelectedBookToRead(null);
                              setSelectedSubmission(null);
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors text-xs"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>Buka Generator Tugas AI Sekarang</span>
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-indigo-950/80 mb-4 font-medium">
                            Daftar tugas teranyar yang harus Anda kerjakan sebelum tenggat waktu berakhir:
                          </p>
                          <div className="space-y-3">
                            {assignments.filter((t) => t.kelas === (user as Siswa).kelas).slice(0, 3).map((t) => {
                              const alreadyDone = submissions.find((s) => s.tugasId === t.id && s.siswaId === user.id);
                              return (
                                <div key={t.id} className="bg-white rounded-xl p-3 border border-indigo-100 flex items-center justify-between hover:border-indigo-300 transition-colors">
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-800">{t.mapel} - {t.bab}</h4>
                                    <div className="flex gap-3 text-[10px] text-slate-500 mt-1">
                                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {t.waktu} Menit</span>
                                      <span>{t.jumlahSoal} Soal</span>
                                    </div>
                                  </div>

                                  {alreadyDone ? (
                                    <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1">
                                      Nilai: {alreadyDone.nilai}
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => startStudentQuiz(t)}
                                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                                    >
                                      Kerjakan
                                    </button>
                                  )}
                                </div>
                              );
                            })}

                            {assignments.filter((t) => t.kelas === (user as Siswa).kelas).length === 0 && (
                              <p className="text-xs text-slate-500 italic text-center py-4 bg-white/60 rounded-xl">
                                Alhamdulillah! Belum ada tugas untuk kelas Anda hari ini.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Column 2: Activity logs or classmates who did the homework */}
                    <div className="md:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                        Aktivitas Belajar Terbaru
                      </h3>
                      
                      <div className="space-y-4">
                        {submissions.length === 0 ? (
                          <div className="text-center py-8 text-slate-400 text-xs italic">
                            Belum ada aktivitas pengerjaan tugas hari ini.
                          </div>
                        ) : (
                          submissions.slice(0, 4).map((sub) => {
                            const task = assignments.find((t) => t.id === sub.tugasId);
                            return (
                              <div key={sub.id} className="flex items-start gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                                  {sub.namaSiswa.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate">
                                    {sub.namaSiswa}
                                  </p>
                                  <p className="text-[10px] text-slate-500">
                                    Menyelesaikan tugas {task ? task.mapel : "Tugas"} • Kelas {sub.kelas}
                                  </p>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-[9px] font-mono text-slate-400">
                                      {new Date(sub.tanggalSelesai).toLocaleDateString("id-ID")}
                                    </span>
                                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                                      Nilai: {sub.nilai}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Column 3: Wide Banner for AI Presentation (Guru & Admin Only) */}
                    {(role === "guru" || role === "admin") && (
                      <div className="md:col-span-12 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 rounded-3xl p-6 border border-emerald-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mt-4">
                        <div className="space-y-2 text-left">
                          <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full inline-block">
                            ✨ AI Generator Presentasi (PPTX)
                          </span>
                          <h4 className="text-base font-extrabold text-slate-800 font-display">
                            Susun Slide Pembelajaran Menarik dengan Tekor AI
                          </h4>
                          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                            Cukup masukkan judul, topik pembahasan, dan bab pilihan. AI akan menyusun slide, mengelompokkan submateri, mereferensikan gambar edukatif yang relevan, dan menghasilkan file PowerPoint (.pptx) asli siap pakai.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab("ai-presentation");
                            setSelectedBookToRead(null);
                            setSelectedSubmission(null);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-5 rounded-2xl shadow transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
                        >
                          <Presentation className="w-4 h-4" />
                          <span>Buat Presentasi Sekarang</span>
                        </button>
                      </div>
                    )}

                  </div>
                )}

                {/* -------------------- VIEW: BUKU PELAJARAN -------------------- */}
                {activeTab === "buku" && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-lg font-bold font-display text-emerald-800">
                          Perpustakaan Buku Pelajaran Madrasah
                        </h2>
                        <p className="text-xs text-slate-500">
                          Daftar buku pegangan e-book digital MTs Ma'arif NU 7 Sawojajar.
                        </p>
                      </div>

                      {(role === "guru" || role === "admin") && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowAddBookModal(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                          >
                            <Plus className="w-4 h-4" />
                            Tambah Buku
                          </button>
                          <button
                            onClick={() => setShowAddChapterModal(true)}
                            className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                          >
                            <Plus className="w-4 h-4" />
                            Tambah Bab Materi
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Books list layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {books
                        .filter((b) => (role === "guru" || role === "admin") ? isBookClassMatch(b.kelas, selectedClass) : isBookClassMatch(b.kelas, (user as Siswa).kelas))
                        .map((b) => (
                          <div
                            key={b.id}
                            className="bg-slate-50 rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                  {b.mapel}
                                </span>
                                {b.fileName && (
                                  <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wide">
                                    📎 {b.fileName.split('.').pop() || 'Berkas'}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-sm font-bold text-slate-800 mt-3 leading-snug">
                                {b.judul}
                              </h3>
                              <p className="text-xs text-slate-500 mt-1 font-medium">
                                Buku Kelas {b.kelas} MTs
                              </p>
                              
                              {b.fileName && (
                                <div className="mt-2 text-[10px] text-slate-500 font-semibold bg-slate-150/40 border border-slate-200/60 p-2 rounded-xl flex items-center gap-1.5 truncate">
                                  <span className="text-emerald-600 font-bold">📂</span>
                                  <span className="truncate" title={b.fileName}>{b.fileName}</span>
                                </div>
                              )}

                              <div className="mt-4 pt-3 border-t border-slate-200/60">
                                <span className="text-[11px] font-bold text-slate-400 block uppercase">Daftar Bab Tersedia ({(b.bab || []).length})</span>
                                <ul className="mt-1.5 space-y-1 text-xs text-slate-700 font-medium">
                                  {(b.bab || []).length === 0 ? (
                                    <li className="text-slate-400 italic">Materi teks bab belum diupload.</li>
                                  ) : (
                                    (b.bab || []).slice(0, 3).map((ch) => (
                                      <li key={ch.nomor} className="truncate">
                                        Bab {ch.nomor}: {ch.judul}
                                      </li>
                                    ))
                                  )}
                                  {(b.bab || []).length > 3 && <li className="text-[10px] text-emerald-600 font-semibold">+ {(b.bab || []).length - 3} Bab lainnya</li>}
                                </ul>
                              </div>
                            </div>

                            <div className="mt-6">
                              {(role === "guru" || role === "admin") ? (
                                <div className="grid grid-cols-12 gap-2">
                                  <button
                                    onClick={() => {
                                      if ((b.bab || []).length === 0 && !b.fileData) {
                                        triggerAlert("Materi e-book ini belum memiliki isi bab maupun berkas lampiran.", "info");
                                        return;
                                      }
                                      setSelectedBookToRead(b);
                                      setSelectedChapterIndex(0);
                                    }}
                                    className="col-span-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                                  >
                                    <BookOpen className="w-3.5 h-3.5" />
                                    <span>Tampilkan</span>
                                  </button>

                                  <button
                                    onClick={() => setBookToDeleteId(b.id)}
                                    className="col-span-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                                    title="Hapus Buku"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Hapus</span>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    if ((b.bab || []).length === 0 && !b.fileData) {
                                      triggerAlert("Materi e-book ini belum memiliki isi bab maupun berkas lampiran.", "info");
                                      return;
                                    }
                                    setSelectedBookToRead(b);
                                    setSelectedChapterIndex(0);
                                  }}
                                  className="w-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold py-2 px-3 rounded-xl text-xs transition-colors text-center flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <BookOpen className="w-4 h-4 text-emerald-700" />
                                  <span>Mulai Membaca Materi</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                      {books.filter((b) => (role === "guru" || role === "admin") ? isBookClassMatch(b.kelas, selectedClass) : isBookClassMatch(b.kelas, (user as Siswa).kelas)).length === 0 && (
                        <div className="col-span-3 text-center py-12 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 text-xs italic">
                          Belum ada buku pelajaran yang terupload untuk kelas {role === "guru" ? selectedClass : (user as Siswa).kelas}.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* -------------------- VIEW: KELOLA GURU (ADMIN ONLY) -------------------- */}
                {activeTab === "admin-teachers" && role === "admin" && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-lg font-bold font-display text-emerald-800">
                          Database Guru & Staf Pengajar
                        </h2>
                        <p className="text-xs text-slate-500">
                          Kelola data guru, NIP, mata pelajaran, serta penempatan kelas mengajar di Madrasah.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setEditingTeacherId(null);
                          setTeacherForm({
                            username: "",
                            nama: "",
                            nuptk: "",
                            mapel: "Fiqih",
                            kelasDiajar: [],
                            password: "123",
                            noHp: ""
                          });
                          setShowAddTeacherModal(true);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        Tambah Guru Baru
                      </button>
                    </div>

                    {/* Teachers list table */}
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200">
                            <th className="p-4">Nama Lengkap</th>
                            <th className="p-4">Username</th>
                            <th className="p-4">NUPTK / Identitas</th>
                            <th className="p-4">Mata Pelajaran</th>
                            <th className="p-4">Alokasi Mengajar (Kelas)</th>
                            <th className="p-4 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {teachers.map((te) => (
                            <tr key={te.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                                  {te.nama.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <span className="block font-bold">{te.nama}</span>
                                  {te.username === "admin" && (
                                    <span className="bg-red-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                                      Administrator
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 font-mono text-slate-600">{te.username}</td>
                              <td className="p-4 font-mono text-slate-500">{te.nuptk || (te as any).nip || "-"}</td>
                              <td className="p-4">
                                <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-1 rounded text-[10px]">
                                  {te.mapel}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-wrap gap-1 max-w-xs">
                                  {te.kelasDiajar && te.kelasDiajar.length > 0 ? (
                                    te.kelasDiajar.map((kls) => (
                                      <span key={kls} className="bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded text-[10px]">
                                        Kelas {kls}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-slate-400 italic text-[10px]">Belum ditempatkan</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingTeacherId(te.id);
                                      setTeacherForm({
                                        username: te.username,
                                        nama: te.nama,
                                        nuptk: te.nuptk || te.nip || "",
                                        mapel: te.mapel || "Fiqih",
                                        kelasDiajar: te.kelasDiajar || [],
                                        password: te.password || "123",
                                        noHp: te.noHp || ""
                                      });
                                      setShowAddTeacherModal(true);
                                    }}
                                    title="Edit Guru"
                                    className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTeacher(te.id)}
                                    title="Hapus Guru"
                                    disabled={te.username === "admin"}
                                    className={`p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors ${
                                      te.username === "admin" ? "opacity-30 cursor-not-allowed" : ""
                                    }`}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {teachers.length === 0 && (
                            <tr>
                              <td colSpan={6} className="text-center py-8 text-slate-400 italic">
                                Belum ada data pendidik terdaftar. Klik "Tambah Guru Baru" untuk memulai.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* -------------------- VIEW: KELOLA SISWA (GURU & ADMIN) -------------------- */}
                {activeTab === "siswa-kelola" && (role === "guru" || role === "admin") && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-lg font-bold font-display text-emerald-800">
                          Manajemen Peserta Didik (Siswa)
                        </h2>
                        <p className="text-xs text-slate-500">
                          Kelola, edit, tambah, atau hapus data siswa Madrasah kelas {selectedClass}.
                        </p>
                      </div>

                      {role === "admin" ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingStudentId(null);
                              setStudentForm({
                                username: "",
                                nama: "",
                                kelas: selectedClass,
                                alamat: "",
                                citaCita: "",
                                motoHidup: ""
                              });
                              setShowAddStudentModal(true);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                          >
                            <UserPlus className="w-4 h-4" />
                            Tambah Siswa
                          </button>

                          <button
                            onClick={exportStudentsToExcel}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                            title="Export data siswa kelas ini ke Excel (.xlsx)"
                          >
                            <Download className="w-4 h-4" />
                            Export File Excel
                          </button>

                          <button
                            onClick={downloadTemplateExcel}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                            title="Unduh template Excel (.xlsx) kosong"
                          >
                            <FileSpreadsheet className="w-4 h-4" />
                            Download Template Excel
                          </button>

                          <label className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer" title="Unggah file Excel (.xlsx atau .xls) untuk tambah siswa">
                            <Upload className="w-4 h-4" />
                            <span>Import File Excel</span>
                            <input
                              type="file"
                              accept=".xlsx, .xls"
                              onChange={handleImportExcel}
                              className="hidden"
                            />
                          </label>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingStudentId(null);
                            setStudentForm({
                              username: "",
                              nama: "",
                              kelas: selectedClass,
                              alamat: "",
                              citaCita: "",
                              motoHidup: ""
                            });
                            setShowAddStudentModal(true);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                        >
                          <UserPlus className="w-4 h-4" />
                          Tambah Siswa Baru
                        </button>
                      )}
                    </div>

                    {/* Students list table */}
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200">
                            <th className="p-4">Nama Lengkap</th>
                            <th className="p-4">Username</th>
                            <th className="p-4">Alamat Rumah</th>
                            <th className="p-4">Cita-Cita & Moto</th>
                            <th className="p-4 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {students.map((st) => (
                            <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                                <img
                                  src={st.foto}
                                  alt={st.nama}
                                  className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                                />
                                {st.nama}
                              </td>
                              <td className="p-4 font-mono text-slate-600">{st.username}</td>
                              <td className="p-4 max-w-xs truncate text-slate-500" title={st.alamat}>{st.alamat}</td>
                              <td className="p-4">
                                <div className="max-w-xs text-slate-600 font-medium">
                                  <span className="font-bold text-emerald-700">Cita: </span> {st.citaCita || "-"}
                                </div>
                                <div className="max-w-xs text-slate-400 italic mt-0.5">
                                  " {st.motoHidup || "-"} "
                                </div>
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingStudentId(st.id);
                                      setStudentForm({
                                        username: st.username,
                                        nama: st.nama,
                                        kelas: st.kelas,
                                        alamat: st.alamat,
                                        citaCita: st.citaCita,
                                        motoHidup: st.motoHidup,
                                        password: st.password || "123",
                                        noHp: st.noHp || ""
                                      });
                                      setShowAddStudentModal(true);
                                    }}
                                    title="Edit Siswa"
                                    className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStudent(st.id)}
                                    title="Hapus Siswa"
                                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {students.length === 0 && (
                            <tr>
                              <td colSpan={5} className="text-center py-8 text-slate-400 italic">
                                Tidak ada siswa terdaftar di kelas {selectedClass}. Klik "Tambah Siswa Baru" di atas untuk menambahkan.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* -------------------- VIEW: AI PRESENTASI PPTX (GURU & ADMIN) -------------------- */}
                {activeTab === "ai-presentation" && (role === "guru" || role === "admin") && (
                  <div className="space-y-6">
                    {/* Top Header Card */}
                    <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute right-[-40px] top-[-40px] w-52 h-52 bg-white/10 rounded-full blur-3xl"></div>
                      <div className="absolute left-[-20px] bottom-[-20px] w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl"></div>

                      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shadow-inner backdrop-blur-sm">
                            📊
                          </div>
                          <div>
                            <h1 className="text-xl md:text-2xl font-black tracking-tight font-display">
                              Presentasi Otomatis Dengan Tekor AI
                            </h1>
                            <p className="text-xs text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
                              Rancang materi slide ajar interaktif berformat PowerPoint (.pptx) secara instan. AI akan menstrukturkan bab pembahasan, dalil, materi, hingga rekomendasi visual yang relevan.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main Layout Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Input Form Card */}
                      <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                          <span className="text-lg">⚙️</span> Parameter Presentasi
                        </h3>

                        <div className="space-y-4">
                          {/* Judul Presentasi */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                              Judul Presentasi
                            </label>
                            <input
                              type="text"
                              value={presTitle}
                              onChange={(e) => setPresTitle(e.target.value)}
                              placeholder="Contoh: Indahnya Saling Menghargai dalam Fiqih"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                            />
                          </div>

                          {/* Tema / Topik */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                              Tema / Topik Bahasan
                            </label>
                            <input
                              type="text"
                              value={presTheme}
                              onChange={(e) => setPresTheme(e.target.value)}
                              placeholder="Contoh: Konsep Wudhu, Rukun, dan Pembatalnya"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                            />
                          </div>

                          {/* Mata Pelajaran Dropdown */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                              Mata Pelajaran
                            </label>
                            <select
                              value={presMapel}
                              onChange={(e) => setPresMapel(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            >
                              {DAFTAR_MAPEL.map((mapel) => (
                                <option key={mapel} value={mapel}>{mapel}</option>
                              ))}
                            </select>
                          </div>

                          {/* Sasaran Kelas Dropdown */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                              Sasaran Kelas
                            </label>
                            <select
                              value={presKelas}
                              onChange={(e) => setPresKelas(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            >
                              <option value="7A">Kelas 7A</option>
                              <option value="7B">Kelas 7B</option>
                              <option value="7C">Kelas 7C</option>
                              <option value="8A">Kelas 8A</option>
                              <option value="8B">Kelas 8B</option>
                              <option value="8C">Kelas 8C</option>
                              <option value="9A">Kelas 9A</option>
                              <option value="9B">Kelas 9B</option>
                              <option value="9C">Kelas 9C</option>
                            </select>
                          </div>

                          {/* Bab Dropdown */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                              Bab Pilihan
                            </label>
                            <select
                              value={presBab}
                              onChange={(e) => setPresBab(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            >
                              <option value="Bab I">Bab I</option>
                              <option value="Bab II">Bab II</option>
                              <option value="Bab III">Bab III</option>
                              <option value="Bab IV">Bab IV</option>
                              <option value="Bab V">Bab V</option>
                              <option value="Bab VI">Bab VI</option>
                              <option value="Bab VII">Bab VII</option>
                              <option value="Bab VIII">Bab VIII</option>
                            </select>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button
                          onClick={handleGeneratePresentation}
                          disabled={isGeneratingPres}
                          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-3 px-4 rounded-2xl shadow-md transition-all text-xs cursor-pointer"
                        >
                          {isGeneratingPres ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Sedang Menyusun Materi Slide...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-amber-300" />
                              <span>Buat Slide Presentasi</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Right: Slide Previewer */}
                      <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between min-h-[500px]">
                        {!generatedPresentation ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mb-4 shadow-inner">
                              📊
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 font-display">
                              Belum Ada Presentasi yang Dibuat
                            </h4>
                            <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
                              Silakan isi formulir di sebelah kiri dan klik tombol buat untuk merancang draf presentasi berkualitas tinggi melalui Tekor AI.
                            </p>
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col justify-between space-y-6">
                            {/* Slide Preview Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div>
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                  Draf Slide {presActiveSlideIdx + 1} dari {generatedPresentation.length}
                                </h4>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  Layout tipe: <span className="font-mono text-emerald-700 font-bold">{generatedPresentation[presActiveSlideIdx].layout || "standard"}</span>
                                </p>
                              </div>

                              <button
                                onClick={handleDownloadPPTX}
                                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-sm transition-all"
                              >
                                <Download className="w-4 h-4" />
                                <span>Unduh File PPTX Asli</span>
                              </button>
                            </div>

                            {/* Simulated Slide Canvas */}
                            <div className="flex-1 bg-slate-900 rounded-2xl p-6 text-white shadow-inner border border-slate-800 relative overflow-hidden flex flex-col justify-between aspect-[16/9] min-h-[320px]">
                              {/* Slide Branding Background Decor */}
                              <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500"></div>
                              <div className="absolute right-[-40px] bottom-[-40px] w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl"></div>

                              {/* Slide Content rendering based on layout */}
                              {generatedPresentation[presActiveSlideIdx].layout === "title_slide" || presActiveSlideIdx === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center px-8 space-y-4">
                                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/30">
                                    {presMapel} • Kelas {presKelas}
                                  </span>
                                  <h2 className="text-xl md:text-3xl font-extrabold tracking-tight font-serif text-emerald-200">
                                    {generatedPresentation[presActiveSlideIdx].title || presTitle}
                                  </h2>
                                  <p className="text-xs text-slate-300 italic max-w-xl">
                                    {generatedPresentation[presActiveSlideIdx].subtitle || `Materi ${presBab}: ${presTheme}`}
                                  </p>

                                  {generatedPresentation[presActiveSlideIdx].bullets && (
                                    <div className="flex flex-wrap justify-center gap-4 pt-4 text-[10px] text-slate-400 font-mono">
                                      {generatedPresentation[presActiveSlideIdx].bullets.map((b: string, i: number) => (
                                        <span key={i} className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                                          ✓ {b}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="flex-1 flex flex-col justify-between space-y-4">
                                  <div>
                                    <h3 className="text-base md:text-xl font-bold font-serif text-emerald-300">
                                      {generatedPresentation[presActiveSlideIdx].title}
                                    </h3>
                                    {generatedPresentation[presActiveSlideIdx].subtitle && (
                                      <p className="text-[10px] md:text-xs text-slate-400 italic mt-1">
                                        {generatedPresentation[presActiveSlideIdx].subtitle}
                                      </p>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1">
                                    {/* Bullets text column */}
                                    <div className={`${
                                      generatedPresentation[presActiveSlideIdx].image_keyword && generatedPresentation[presActiveSlideIdx].layout !== "content_only"
                                        ? "md:col-span-7"
                                        : "md:col-span-12"
                                    } space-y-3`}>
                                      {(generatedPresentation[presActiveSlideIdx].bullets || []).map((b: string, i: number) => (
                                        <div key={i} className="flex items-start gap-2.5">
                                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                            {i + 1}
                                          </span>
                                          <p className="text-xs text-slate-200 leading-relaxed">
                                            {b}
                                          </p>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Image column */}
                                    {generatedPresentation[presActiveSlideIdx].image_keyword && generatedPresentation[presActiveSlideIdx].layout !== "content_only" && (
                                      <div className="md:col-span-5 relative rounded-xl overflow-hidden border border-slate-700 bg-slate-800 aspect-video flex flex-col items-center justify-center text-center">
                                        <img
                                          src={
                                            generatedPresentation[presActiveSlideIdx].image_keyword.toLowerCase().includes("quran") ||
                                            generatedPresentation[presActiveSlideIdx].image_keyword.toLowerCase().includes("islamic") ||
                                            generatedPresentation[presActiveSlideIdx].image_keyword.toLowerCase().includes("book")
                                              ? "https://images.unsplash.com/photo-1609599006353-e629eeabfeae?w=800&auto=format&fit=crop"
                                              : generatedPresentation[presActiveSlideIdx].image_keyword.toLowerCase().includes("pray") ||
                                                generatedPresentation[presActiveSlideIdx].image_keyword.toLowerCase().includes("mosque") ||
                                                generatedPresentation[presActiveSlideIdx].image_keyword.toLowerCase().includes("sholat")
                                              ? "https://images.unsplash.com/photo-1597935258735-e2c602a51563?w=800&auto=format&fit=crop"
                                              : generatedPresentation[presActiveSlideIdx].image_keyword.toLowerCase().includes("student") ||
                                                generatedPresentation[presActiveSlideIdx].image_keyword.toLowerCase().includes("class") ||
                                                generatedPresentation[presActiveSlideIdx].image_keyword.toLowerCase().includes("school")
                                              ? "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop"
                                              : generatedPresentation[presActiveSlideIdx].image_keyword.toLowerCase().includes("clean") ||
                                                generatedPresentation[presActiveSlideIdx].image_keyword.toLowerCase().includes("water") ||
                                                generatedPresentation[presActiveSlideIdx].image_keyword.toLowerCase().includes("wudhu")
                                              ? "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800&auto=format&fit=crop"
                                              : generatedPresentation[presActiveSlideIdx].image_keyword.toLowerCase().includes("arabic") ||
                                                generatedPresentation[presActiveSlideIdx].image_keyword.toLowerCase().includes("calligraphy")
                                              ? "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop"
                                              : generatedPresentation[presActiveSlideIdx].image_keyword.toLowerCase().includes("hand") ||
                                                generatedPresentation[presActiveSlideIdx].image_keyword.toLowerCase().includes("giving") ||
                                                generatedPresentation[presActiveSlideIdx].image_keyword.toLowerCase().includes("charity")
                                              ? "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&auto=format&fit=crop"
                                              : "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop"
                                          }
                                          alt={generatedPresentation[presActiveSlideIdx].image_keyword}
                                          className="w-full h-full object-cover"
                                          referrerPolicy="no-referrer"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1 text-[9px] text-slate-300 truncate font-mono">
                                          Visual: "{generatedPresentation[presActiveSlideIdx].image_keyword}"
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Footer branding of simulated slide */}
                              <div className="flex items-center justify-between text-[9px] text-slate-500 border-t border-slate-800/80 pt-2.5">
                                <span>Tekor AI Generator • MTs Ma'arif NU 7 Sawojajar</span>
                                <span className="font-mono">Halaman {presActiveSlideIdx + 1} dari {generatedPresentation.length}</span>
                              </div>
                            </div>

                            {/* Slide Pagination & Navigation controls */}
                            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100 font-sans">
                              <button
                                onClick={() => setPresActiveSlideIdx(Math.max(0, presActiveSlideIdx - 1))}
                                disabled={presActiveSlideIdx === 0}
                                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition-all flex items-center gap-1 cursor-pointer"
                              >
                                ← Sebelumnya
                              </button>

                              <div className="flex gap-1.5">
                                {generatedPresentation.map((_, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setPresActiveSlideIdx(idx)}
                                    className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                                      presActiveSlideIdx === idx
                                        ? "bg-emerald-600 text-white shadow"
                                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                                    }`}
                                  >
                                    {idx + 1}
                                  </button>
                                ))}
                              </div>

                              <button
                                onClick={() => setPresActiveSlideIdx(Math.min(generatedPresentation.length - 1, presActiveSlideIdx + 1))}
                                disabled={presActiveSlideIdx === generatedPresentation.length - 1}
                                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition-all flex items-center gap-1 cursor-pointer"
                              >
                                Selanjutnya →
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* --- LIBRARY OF SAVED PRESENTATIONS --- */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mt-8">
                      <div className="border-b border-slate-100 pb-3 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <span className="text-lg">📚</span> Perpustakaan Slide Presentasi Tersimpan
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Kumpulan slide ajar interaktif yang telah disusun dan disimpan di basis data.
                          </p>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider self-start sm:self-center">
                          {savedPresentations.length} Presentasi
                        </span>
                      </div>

                      {savedPresentations.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 border border-slate-200 border-dashed rounded-2xl text-slate-400 text-xs italic">
                          Belum ada presentasi tersimpan. Buat draf baru di atas dan simpan secara otomatis.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {savedPresentations.map((pres: any) => {
                            const isArabic = (pres.mapel || "").toLowerCase().includes("arab");
                            const isAqidah = (pres.mapel || "").toLowerCase().includes("aqidah") || (pres.mapel || "").toLowerCase().includes("akhlak");
                            const isSejarah = (pres.mapel || "").toLowerCase().includes("sejarah") || (pres.mapel || "").toLowerCase().includes("ski");

                            let badgeBg = "bg-emerald-50 text-emerald-800 border-emerald-200";
                            if (isArabic) badgeBg = "bg-purple-50 text-purple-800 border-purple-200";
                            if (isAqidah) badgeBg = "bg-sky-50 text-sky-800 border-sky-200";
                            if (isSejarah) badgeBg = "bg-amber-50 text-amber-800 border-amber-200";

                            return (
                              <div
                                key={pres.id}
                                className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-2 mb-3">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeBg}`}>
                                      {pres.mapel}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium font-mono">
                                      Kelas {pres.kelas || "MTs"} • {pres.bab || "Materi"}
                                    </span>
                                  </div>

                                  <h4 className="text-sm font-bold text-slate-800 leading-snug tracking-tight group-hover:text-emerald-700 transition-colors">
                                    {pres.judul}
                                  </h4>
                                  <p className="text-xs text-slate-500 mt-1 font-medium italic line-clamp-1">
                                    Tema: {pres.tema}
                                  </p>

                                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                                    <span>🎥 {pres.slides?.length || 0} Slide Interaktif</span>
                                    <span>📅 {pres.createdAt ? new Date(pres.createdAt).toLocaleDateString("id-ID") : "Baru-baru ini"}</span>
                                  </div>
                                </div>

                                <div className="mt-5 grid grid-cols-12 gap-2">
                                  <button
                                    onClick={() => {
                                      setCurrentPresentingPres(pres);
                                      setSlideshowIndex(0);
                                      setSlideshowActive(true);
                                    }}
                                    className="col-span-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                                  >
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    <span>Tampilkan</span>
                                  </button>

                                  <button
                                    onClick={() => downloadPresentationAsPPTX(pres)}
                                    className="col-span-4 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                    title="Unduh File PowerPoint (.pptx)"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Unduh</span>
                                  </button>

                                  <button
                                    onClick={() => setPresToDeleteId(pres.id)}
                                    className="col-span-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center cursor-pointer"
                                    title="Hapus Presentasi"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* -------------------- VIEW: GENERATE SOAL TUGAS (GURU & ADMIN) -------------------- */}
                {activeTab === "buat-tugas" && (role === "guru" || role === "admin") && (
                  <div className="bg-gradient-to-br from-indigo-50/50 via-white to-sky-50/30 rounded-3xl border border-indigo-100 p-6 shadow-md">
                    
                    {/* Header with Powered By */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                          <Brain className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold font-display text-indigo-900 flex items-center gap-1.5">
                            AI Generator Soal Madrasah
                            <Sparkles className="w-4.5 h-4.5 text-amber-500" />
                          </h2>
                          <p className="text-xs text-slate-500">
                            Penyusunan tugas digital otomatis terintegrasi AI Generative.
                          </p>
                        </div>
                      </div>

                      <span className="bg-indigo-600 text-white font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-inner flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-yellow-300" />
                        Tekor AI ACTIVE
                      </span>
                    </div>

                    {/* Settings Form Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-5 mb-6">
                      
                      <div className="md:col-span-3 space-y-1.5">
                        <label className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider ml-1">Mata Pelajaran</label>
                        <select
                          value={genMapel}
                          onChange={(e) => setGenMapel(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                        >
                          {DAFTAR_MAPEL.map((mapel) => (
                            <option key={mapel} value={mapel}>{mapel}</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-3 space-y-1.5">
                        <label className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider ml-1">Target Kelas</label>
                        <select
                          value={genKelas}
                          onChange={(e) => setGenKelas(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                        >
                          {["7A", "7B", "7C", "7D", "8A", "8B", "8C", "8D", "9A", "9B", "9C", "9D", "9E"].map((kls) => (
                            <option key={kls} value={kls}>Kelas {kls}</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider ml-1">Semester</label>
                        <select
                          value={genSemester}
                          onChange={(e) => setGenSemester(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                        >
                          <option value="1">Semester 1 (Ganjil)</option>
                          <option value="2">Semester 2 (Genap)</option>
                        </select>
                      </div>

                      <div className="md:col-span-4 space-y-1.5">
                        <label className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider ml-1">Pilih BAB Referensi</label>
                        <select
                          value={genBab}
                          onChange={(e) => setGenBab(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                        >
                          <option value="">-- Buat Soal dari Seluruh Materi Buku --</option>
                          {books
                            .filter((b) => b.mapel === genMapel && isBookClassMatch(b.kelas, genKelas))
                            .flatMap((b) => b.bab || [])
                            .map((ch) => (
                              <option key={ch.nomor} value={`${ch.nomor}`}>
                                Bab {ch.nomor}: {ch.judul}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="md:col-span-3 space-y-1.5">
                        <label className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider ml-1">Jumlah Soal</label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={genJumlahSoal}
                          onChange={(e) => setGenJumlahSoal(Number(e.target.value))}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                      </div>

                      <div className="md:col-span-3 space-y-1.5">
                        <label className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider ml-1">Batas Tanggal Pengerjaan</label>
                        <input
                          type="date"
                          required
                          value={genDeadlineTanggal}
                          onChange={(e) => setGenDeadlineTanggal(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                      </div>

                      <div className="md:col-span-6 flex items-end">
                        <button
                          onClick={handleGenerateQuestions}
                          disabled={isGenerating}
                          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs"
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>AI sedang menganalisis materi & menyusun soal...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4.5 h-4.5 text-amber-300" />
                              <span>Klik untuk Buat Soal Otomatis oleh AI</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>

                    {/* AI Preview Section */}
                    {genPreviewQuestions.length > 0 && (
                      <div className="bg-white rounded-2xl border border-indigo-100 p-5 shadow-inner animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                          <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                            <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                            Pratinjau Hasil Penyusunan AI ({genPreviewQuestions.length} Soal)
                          </span>
                          
                          <button
                            onClick={handlePublishTask}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 px-4 rounded-xl shadow transition-colors flex items-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            Publikasikan Tugas Sekarang
                          </button>
                        </div>

                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                          {genPreviewQuestions.map((q, qIdx) => (
                            <div key={q.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs">
                              <p className="font-bold text-slate-800">
                                {qIdx + 1}. {q.pertanyaan}
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                                {Object.entries(q.pilihan).map(([key, opt]) => (
                                  <div
                                    key={key}
                                    className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 ${
                                      q.jawabanBenar === key
                                        ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                                        : "bg-white border-slate-200 text-slate-700"
                                    }`}
                                  >
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                      q.jawabanBenar === key ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                                    }`}>
                                      {key}
                                    </span>
                                    <span>{opt}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3 text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Kunci Jawaban Benar: Opsi ({q.jawabanBenar})
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {genSuccessMsg && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center text-emerald-800 text-xs font-bold animate-pulse">
                        🎉 {genSuccessMsg} Tugas telah disebarluaskan untuk siswa Kelas {selectedClass}.
                      </div>
                    )}
                  </div>
                )}

                {/* -------------------- VIEW: PENILAIAN SISWA (GURU & ADMIN) -------------------- */}
                {activeTab === "penilaian" && (role === "guru" || role === "admin") && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm relative space-y-6">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="text-lg font-bold font-display text-emerald-800">
                          Buku Rekap Nilai Evaluasi Siswa
                        </h2>
                        <p className="text-xs text-slate-500">
                          Data otomatis dikalkulasi AI. Klik nama siswa untuk melihat kertas jawaban ujiannya.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {/* KKM Setting Tool */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-600">KKM:</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={kkmVal}
                            onChange={(e) => setKkmVal(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                            className="w-14 text-center text-xs font-extrabold text-emerald-700 bg-white border border-slate-300 rounded-lg py-1 outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <input
                            type="range"
                            min="50"
                            max="90"
                            value={kkmVal}
                            onChange={(e) => setKkmVal(parseInt(e.target.value))}
                            className="w-20 accent-emerald-600 cursor-pointer hidden md:block"
                          />
                        </div>

                        <button
                          onClick={handlePrint}
                          className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2 px-4 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Cetak PDF Laporan Resmi</span>
                        </button>
                      </div>
                    </div>

                    {/* Class Category Tables */}
                    {(() => {
                      const categories = [
                        { name: "Kelas 7 (Tujuh)", prefix: "7" },
                        { name: "Kelas 8 (Delapan)", prefix: "8" },
                        { name: "Kelas 9 (Sembilan)", prefix: "9" }
                      ];

                      return (
                        <div className="space-y-8" id="scoreboard-table-section">
                          {categories.map((cat) => {
                            const filteredSubs = submissions.filter((sub) => {
                              const matchesPrefix = sub.kelas && sub.kelas.startsWith(cat.prefix);
                              // If guru, only show classes they are allowed to teach
                              if (role === "guru") {
                                const allowedClasses = (user as Guru).kelasDiajar || [];
                                return matchesPrefix && allowedClasses.includes(sub.kelas);
                              }
                              return matchesPrefix;
                            });

                            const totalScore = filteredSubs.reduce((acc, sub) => acc + sub.nilai, 0);
                            const classAverage = filteredSubs.length > 0 ? (totalScore / filteredSubs.length).toFixed(1) : "0.0";

                            return (
                              <div key={cat.prefix} className="bg-slate-50/50 rounded-2xl border border-slate-200/80 p-5 space-y-3">
                                {/* Title and Stats Above Table */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                                  <h3 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                    <span className="text-base">🏆</span> {cat.name}
                                    <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-[9px] font-bold">
                                      {filteredSubs.length} Siswa Mengerjakan
                                    </span>
                                  </h3>

                                  {/* Rerata Kelas */}
                                  <div className="flex items-center gap-3 text-xs">
                                    <div className="bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">
                                      <span className="text-slate-500 font-medium">Rata-rata Kelas: </span>
                                      <span className="font-black text-emerald-700">{classAverage}</span>
                                    </div>
                                    <div className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg">
                                      <span className="text-slate-500 font-medium">KKM Aktif: </span>
                                      <span className="font-black text-slate-700">{kkmVal}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                                  <table className="w-full text-left border-collapse">
                                    <thead>
                                      <tr className="bg-slate-50 text-slate-500 text-[10px] font-extrabold uppercase border-b border-slate-200">
                                        <th className="p-3.5">Nama Siswa</th>
                                        <th className="p-3.5">Mata Pelajaran</th>
                                        <th className="p-3.5">Kelas</th>
                                        <th className="p-3.5 text-center">Tanggal Selesai</th>
                                        <th className="p-3.5 text-center">Nilai Ujian</th>
                                        <th className="p-3.5 text-center">Hasil AI</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs">
                                      {filteredSubs.map((sub) => {
                                        const t = assignments.find((asg) => asg.id === sub.tugasId);
                                        const isPass = sub.nilai >= kkmVal;
                                        return (
                                          <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-3.5 font-bold text-slate-800">
                                              <button
                                                onClick={() => {
                                                  setSelectedSubmission(sub);
                                                  setSelectedSubmissionTugas(t || null);
                                                }}
                                                className="text-emerald-700 hover:text-emerald-900 underline text-left focus:outline-none"
                                              >
                                                {sub.namaSiswa}
                                              </button>
                                            </td>
                                            <td className="p-3.5 font-semibold text-slate-600">{t ? t.mapel : "Mata Pelajaran"}</td>
                                            <td className="p-3.5 text-slate-500 font-mono">Kelas {sub.kelas}</td>
                                            <td className="p-3.5 text-center text-slate-400 font-mono">
                                              {new Date(sub.tanggalSelesai).toLocaleDateString("id-ID")}
                                            </td>
                                            <td className="p-3.5 text-center">
                                              <span className={`font-extrabold text-sm px-2.5 py-1 rounded-lg ${
                                                isPass ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                                              }`}>
                                                {sub.nilai}
                                              </span>
                                            </td>
                                            <td className="p-3.5 text-center">
                                              <span className={`font-bold text-[10px] uppercase px-2 py-0.5 rounded-full ${
                                                isPass ? "bg-emerald-500 text-white" : "bg-amber-400 text-slate-900"
                                              }`}>
                                                {isPass ? "TUNTAS (KKM)" : "REMIDI"}
                                              </span>
                                            </td>
                                          </tr>
                                        );
                                      })}

                                      {filteredSubs.length === 0 && (
                                        <tr>
                                          <td colSpan={6} className="text-center py-8 text-slate-400 italic">
                                            Belum ada pengerjaan tugas dari siswa {cat.name} saat ini.
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}

                    {/* Hidden printable section styled for PDF */}
                    <div className="hidden print:block bg-white p-8 absolute inset-0 z-50">
                      <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                        <h2 className="text-xl font-bold uppercase">Madrasah Tsanawiyah Ma'arif NU 7 Sawojajar</h2>
                        <p className="text-xs text-slate-600">Alamat: Sawojajar, Wanasari, Brebes, Jawa Tengah</p>
                        <h3 className="text-sm font-bold uppercase mt-4">Laporan Hasil Penilaian Ujian Digital Siswa</h3>
                        <p className="text-xs font-mono">Seluruh Kelas • Tahun Ajaran: 2026/2027</p>
                      </div>

                      <table className="w-full text-left border-collapse border border-slate-300 text-xs">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-300">
                            <th className="p-2 border-r border-slate-300">Nama Siswa</th>
                            <th className="p-2 border-r border-slate-300">Mata Pelajaran</th>
                            <th className="p-2 border-r border-slate-300">Tugas / Bab</th>
                            <th className="p-2 border-r border-slate-300 font-mono">Kelas</th>
                            <th className="p-2 border-r border-slate-300 text-center">Nilai Akhir</th>
                            <th className="p-2 text-center">Status Ketuntasan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {submissions.map((sub) => {
                            const t = assignments.find((asg) => asg.id === sub.tugasId);
                            const isPass = sub.nilai >= kkmVal;
                            return (
                              <tr key={sub.id} className="border-b border-slate-300">
                                <td className="p-2 border-r border-slate-300 font-bold">{sub.namaSiswa}</td>
                                <td className="p-2 border-r border-slate-300">{t ? t.mapel : ""}</td>
                                <td className="p-2 border-r border-slate-300">{t ? t.bab : ""}</td>
                                <td className="p-2 border-r border-slate-300 font-mono">{sub.kelas}</td>
                                <td className="p-2 border-r border-slate-300 text-center font-bold">{sub.nilai}</td>
                                <td className="p-2 text-center font-bold">
                                  {isPass ? "TUNTAS (KKM)" : "REMIDI"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      <div className="mt-12 flex justify-between text-xs">
                        <div className="text-center">
                          <p>Mengetahui,</p>
                          <p className="font-bold mt-16">Kepala Madrasah MTs</p>
                        </div>
                        <div className="text-center">
                          <p>Brebes, {new Date().toLocaleDateString("id-ID")}</p>
                          <p className="font-bold mt-16">Guru Mata Pelajaran</p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* -------------------- VIEW: TUGAS MADRASAH (SISWA) -------------------- */}
                {activeTab === "tugas" && role === "siswa" && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                    <div>
                      <h2 className="text-lg font-bold font-display text-emerald-800">
                        Evaluasi & Tugas Siswa Aktif
                      </h2>
                      <p className="text-xs text-slate-500 mb-6">
                        Menampilkan tugas khusus siswa Kelas {(user as Siswa).kelas}. Tugas yang sudah dikerjakan tidak dapat dibuka kembali.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {assignments
                        .filter((t) => t.kelas === (user as Siswa).kelas)
                        .map((t) => {
                          const submission = submissions.find((s) => s.tugasId === t.id && s.siswaId === user.id);
                          
                          // list classmate scores for community scoreboard
                          const completions = submissions.filter((s) => s.tugasId === t.id);

                          return (
                            <div
                              key={t.id}
                              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                                submission
                                  ? "bg-slate-50 border-slate-200"
                                  : "bg-emerald-50/40 border-emerald-100 shadow-sm hover:shadow-md"
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                    {t.mapel}
                                  </span>
                                  
                                  {submission ? (
                                    <span className="bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg">
                                      Nilai Anda: {submission.nilai}
                                    </span>
                                  ) : (
                                    <span className="bg-amber-400 text-slate-900 font-bold text-[10px] px-2.5 py-1 rounded-lg animate-pulse">
                                      Belum Dikerjakan
                                    </span>
                                  )}
                                </div>

                                <h3 className="text-sm font-bold text-slate-800 leading-snug">
                                  {t.bab}
                                </h3>
                                
                                <div className="grid grid-cols-2 gap-2 my-4 text-[11px] text-slate-600 font-medium">
                                  <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-100 col-span-2">
                                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Batas Tanggal: {t.deadlineTanggal ? new Date(t.deadlineTanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "7 Juli 2026"}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-100 col-span-2">
                                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{t.jumlahSoal} Butir Soal PG Teruji AI</span>
                                  </div>
                                </div>

                                {/* Classmate list of completions */}
                                <div className="pt-3 border-t border-slate-200/60">
                                  <span className="text-[10px] font-bold text-slate-400 block uppercase mb-1.5">Siswa Sudah Mengerjakan ({completions.length})</span>
                                  {completions.length === 0 ? (
                                    <span className="text-[10px] text-slate-400 italic block">Menjadi yang pertama mengerjakan!</span>
                                  ) : (
                                    <div className="flex flex-wrap gap-1.5">
                                      {completions.map((c) => (
                                        <span key={c.id} className="text-[9px] bg-white border border-slate-200 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                                          {c.namaSiswa}: {c.nilai}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>

                              </div>

                              <div className="mt-6">
                                {submission ? (
                                  <div className="flex gap-2">
                                    <div className="flex-1 bg-slate-100 text-slate-600 font-bold py-2 px-3 rounded-xl text-xs text-center flex items-center justify-center gap-2 border border-slate-200">
                                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                      <span>Tugas Selesai</span>
                                    </div>
                                    <button
                                      onClick={() => setViewingTugasSubmission({ submission, tugas: t })}
                                      className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1 transition-all shadow-sm"
                                      title="Lihat Nilai & Cetak Laporan"
                                    >
                                      <span>📜 Nilai</span>
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => startStudentQuiz(t)}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow transition-colors text-center flex items-center justify-center gap-1.5"
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                    <span>Mulai Kerjakan Tugas Ini</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}

                      {assignments.filter((t) => t.kelas === (user as Siswa).kelas).length === 0 && (
                        <div className="col-span-2 text-center py-12 bg-slate-50 border border-slate-200 rounded-3xl text-slate-400 text-xs italic">
                          Alhamdulillah! Tidak ada tugas kelas {(user as Siswa).kelas} yang dirilis pendidik saat ini.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* -------------------- VIEW: QUIZ PORTAL (ACTIVE TEST RUNNING) -------------------- */}
                {activeTab === "mengerjakan" && activeQuiz && (
                  <div className="bg-white rounded-3xl border border-amber-200 p-6 shadow-lg relative animate-in zoom-in-95 duration-300">
                    {/* Confirmation Popup for Assignment Submission */}
                    {quizConfirmData && quizConfirmData.show && (
                      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-emerald-200 text-center space-y-4">
                          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold">
                            ❓
                          </div>
                          <h3 className="font-extrabold text-slate-800 text-base">Konfirmasi Pengiriman</h3>
                          <p className="text-xs text-slate-600 font-bold leading-relaxed">
                            {quizConfirmData.message}
                          </p>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setQuizConfirmData(null)}
                              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-2 px-4 rounded-xl text-xs transition-colors"
                            >
                              Tidak
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setQuizConfirmData(null);
                                submitQuiz();
                              }}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 px-4 rounded-xl text-xs shadow-sm transition-colors"
                            >
                              Ya
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Header with timer countdown */}
                    <div className="flex items-center justify-between border-b border-amber-100 pb-4 mb-6 bg-amber-50/50 p-4 rounded-2xl border">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          📖
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-slate-800">{activeQuiz.mapel}</h2>
                          <p className="text-xs text-slate-500 font-medium">{activeQuiz.bab}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md">
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Sisa Waktu: {Math.floor(quizTimeLeft / 60)}m {quizTimeLeft % 60}s</span>
                      </div>
                    </div>

                    {/* Quiz Questions List */}
                    <div className="space-y-6 mb-8">
                      {activeQuiz.soal.map((q, qIdx) => (
                        <div key={q.id} className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs">
                          <p className="font-bold text-slate-800 leading-relaxed text-sm">
                            {qIdx + 1}. {q.pertanyaan}
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            {Object.entries(q.pilihan).map(([key, opt]) => (
                              <button
                                key={key}
                                onClick={() => {
                                  setQuizAnswers((prev) => ({ ...prev, [q.id]: key }));
                                }}
                                className={`p-3.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-3 ${
                                  quizAnswers[q.id] === key
                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md transform scale-[1.01]"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100/60"
                                }`}
                              >
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                                  quizAnswers[q.id] === key ? "bg-white text-emerald-800" : "bg-slate-100 text-slate-500"
                                }`}>
                                  {key}
                                </span>
                                <span className="text-left">{opt}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Submit footer banner */}
                    <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">
                        Pastikan semua pertanyaan diisi dengan benar sebelum mengumpulkan.
                      </span>

                      <button
                        onClick={() => {
                          const total = activeQuiz.soal.length;
                          const answered = Object.keys(quizAnswers).filter(k => quizAnswers[k] && activeQuiz.soal.some(s => s.id === k)).length;
                          const unanswered = total - answered;
                          let warningText = "Apakah Anda yakin ingin menyelesaikan tugas ini sekarang?";
                          if (unanswered > 0) {
                            warningText = `Anda memiliki ${unanswered} dari ${total} soal yang belum dijawab. Apakah Anda yakin ingin mengumpulkan tugas sekarang?`;
                          }
                          setQuizConfirmData({
                            show: true,
                            message: warningText
                          });
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 px-6 rounded-xl shadow-md transition-all transform hover:scale-[1.01]"
                      >
                        Kumpulkan Tugas Sekarang
                      </button>
                    </div>

                  </div>
                )}

                {/* -------------------- VIEW: PERPUSTAKAAN SEKOLAH -------------------- */}
                {activeTab === "perpustakaan" && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                    <div className="max-w-xl mx-auto text-center py-8">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-100 shadow-inner">
                        📚
                      </div>
                      <h2 className="text-lg font-bold font-display text-emerald-800">
                        Perpustakaan Madrasah MTs Ma'arif NU 7
                      </h2>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        Anda akan diarahkan menuju gerbang koleksi digital perpustakaan resmi MTs Ma'arif NU 7 Sawojajar atau E-Perpus Daerah Brebes untuk mengakses ratusan buku, kitab kuning, jurnal ilmiah, dan referensi bacaan berkualitas.
                      </p>

                      <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 my-6 text-xs text-emerald-800 font-medium">
                        📖 Portal Buku Digital ini bebas kuota untuk seluruh siswa Madrasah.
                      </div>

                      <a
                        href="https://www.perpusnas.go.id"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-xs shadow-md transition-transform hover:scale-[0.98]"
                      >
                        <span>Buka Website Perpustakaan</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}

                {/* -------------------- VIEW: BUAT / KELOLA TKA (GURU & ADMIN) -------------------- */}
                {activeTab === "buat-tka" && (role === "guru" || role === "admin") && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Header info */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700 text-2xl border border-emerald-100 shadow-inner">
                          🏆
                        </div>
                        <div>
                          <h2 className="text-lg font-bold font-display text-slate-800">
                            Asesmen Tes Kemampuan Akademik (TKA) SMP
                          </h2>
                          <p className="text-xs text-slate-500">
                            Kelola ujian terstandar nasional Kemendikdasmen untuk mengukur penalaran, literasi, dan capaian kognitif siswa secara objektif.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* Left: Create Form (Spans 5 cols) */}
                      <div className="md:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
                        <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                          <span>✨</span> Terbitkan Asesmen TKA Baru
                        </h3>

                        <form onSubmit={handleCreateTkaTask} className="space-y-4 text-xs">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Judul TKA</label>
                            <input
                              type="text"
                              required
                              value={tkaForm.judul}
                              onChange={(e) => setTkaForm({ ...tkaForm, judul: e.target.value })}
                              placeholder="Contoh: Tryout TKA Tingkat Provinsi Jawa Tengah"
                              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Panduan / Instruksi</label>
                            <textarea
                              rows={2}
                              value={tkaForm.deskripsi}
                              onChange={(e) => setTkaForm({ ...tkaForm, deskripsi: e.target.value })}
                              placeholder="Kerjakan dengan jujur dan teliti..."
                              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Bidang Uji</label>
                              <select
                                value={tkaForm.bidangUji}
                                onChange={(e) => setTkaForm({ ...tkaForm, bidangUji: e.target.value as any })}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs shadow-sm outline-none font-semibold"
                              >
                                <option value="Matematika (Numerasi)">Matematika (Numerasi)</option>
                                <option value="Bahasa Indonesia (Literasi Membaca)">Bahasa Indonesia (Literasi)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Sistem Penilaian</label>
                              <select
                                value={tkaForm.sistemPenilaian}
                                onChange={(e) => setTkaForm({ ...tkaForm, sistemPenilaian: e.target.value as any })}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs shadow-sm outline-none font-semibold"
                              >
                                <option value="IRT">IRT (Teori Respons Butir)</option>
                                <option value="Poin Klasik">Poin Klasik (+4/-1/0)</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Target Kelas</label>
                              <select
                                value={tkaForm.kelas}
                                onChange={(e) => setTkaForm({ ...tkaForm, kelas: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs shadow-sm outline-none font-semibold"
                              >
                                <option value="7">Kelas 7 (7a, 7b, 7c, 7d)</option>
                                <option value="8">Kelas 8 (8a, 8b, 8c, 8d)</option>
                                <option value="9">Kelas 9 (9a, 9b, 9c, 9d, 9e)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Batas Tanggal</label>
                              <input
                                type="date"
                                required
                                value={tkaForm.deadlineTanggal}
                                onChange={(e) => setTkaForm({ ...tkaForm, deadlineTanggal: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs shadow-sm outline-none"
                              />
                            </div>
                          </div>

                          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100 space-y-2">
                            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">ℹ️ Butir Soal Terintegrasi</span>
                            <p className="text-[11px] text-emerald-700 leading-relaxed font-medium">
                              Sistem akan otomatis memuat <strong>30 soal HOTS (High Order Thinking Skills)</strong> berstandar nasional sesuai dengan kategori tingkatan <strong>Kelas {tkaForm.kelas}</strong> dan bidang uji pilihan Anda.
                            </p>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition-colors text-center"
                          >
                            Terbitkan Asesmen TKA
                          </button>
                        </form>
                      </div>

                      {/* Right: Active TKA Tasks (Spans 7 cols) */}
                      <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
                        <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-100">
                          📋 Daftar Asesmen TKA Aktif (Kelas {selectedClass})
                        </h3>

                        <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
                          {tkaTasks.filter(task => role === "admin" || isTkaClassMatch(task.kelas, selectedClass)).length === 0 ? (
                            <div className="text-center py-12 text-slate-400 italic text-xs">
                              Tidak ada ujian TKA aktif untuk kelas {selectedClass}.
                            </div>
                          ) : (
                            tkaTasks
                              .filter(task => role === "admin" || isTkaClassMatch(task.kelas, selectedClass))
                              .map((task) => (
                                <div key={task.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4 shadow-sm">
                                  <div className="space-y-2 text-xs flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded text-[10px]">
                                        Kelas {task.kelas}
                                      </span>
                                      <span className="bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded text-[10px]">
                                        {task.bidangUji || "Matematika (Numerasi)"}
                                      </span>
                                      <span className="bg-purple-100 text-purple-800 font-extrabold px-2 py-0.5 rounded text-[10px]">
                                        Skor: {task.sistemPenilaian || "IRT"}
                                      </span>
                                      <span className="text-slate-400 font-mono text-[10px]">
                                        Batas: {task.deadlineTanggal}
                                      </span>
                                    </div>
                                    <h4 className="font-bold text-sm text-slate-800">{task.judul}</h4>
                                    {task.deskripsi && <p className="text-slate-500 text-[11px] leading-relaxed">{task.deskripsi}</p>}
                                    
                                    <div className="pt-2">
                                      <span className="text-[10px] font-bold text-slate-400 block mb-1">Cakupan Evaluasi ({(task.soalTka || []).length || 5} Soal HOTS):</span>
                                      <div className="flex flex-wrap gap-1">
                                        {(task.soalTka || []).map((s, idx) => (
                                          <span key={s.id || idx} className="bg-white border border-slate-200 text-slate-600 font-semibold px-2 py-0.5 rounded text-[10px]">
                                            Q{idx + 1}: {s.level} ({s.tipe})
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => handleDeleteTkaTask(task.id)}
                                    title="Hapus Asesmen TKA"
                                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------- VIEW: PENILAIAN TKA (GURU & ADMIN) -------------------- */}
                {activeTab === "penilaian-tka" && (role === "guru" || role === "admin") && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm relative space-y-6 animate-in fade-in duration-300">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="text-lg font-bold font-display text-emerald-800">
                          Buku Rekap Nilai Asesmen TKA (SHTKA) Siswa
                        </h2>
                        <p className="text-xs text-slate-500">
                          Data otomatis dikalkulasi sistem. Klik nama siswa untuk melihat Sertifikat Hasil TKA (SHTKA) resmi.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {/* KKM Setting Tool */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-600">KKM TKA:</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={kkmVal}
                            onChange={(e) => setKkmVal(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                            className="w-14 text-center text-xs font-extrabold text-emerald-700 bg-white border border-slate-300 rounded-lg py-1 outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <input
                            type="range"
                            min="50"
                            max="90"
                            value={kkmVal}
                            onChange={(e) => setKkmVal(parseInt(e.target.value))}
                            className="w-20 accent-emerald-600 cursor-pointer hidden md:block"
                          />
                        </div>

                        <button
                          onClick={() => {
                            // Print the entire scoreboard section
                            const printWindow = window.open("", "_blank");
                            if (printWindow) {
                              const printContent = document.getElementById("tka-scoreboard-table-section");
                              if (printContent) {
                                const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
                                  .map(style => style.outerHTML)
                                  .join('\n');
                                printWindow.document.write(`
                                  <html>
                                    <head>
                                      <title>Rekapitulasi Hasil TKA (SHTKA)</title>
                                      ${stylesheets}
                                      <style>
                                        body { padding: 20px; font-family: sans-serif; }
                                      </style>
                                    </head>
                                    <body>
                                      ${printContent.innerHTML}
                                      <script>
                                        window.onload = function() {
                                          window.print();
                                          window.close();
                                        }
                                      </script>
                                    </body>
                                  </html>
                                `);
                                printWindow.document.close();
                              }
                            }
                          }}
                          className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2 px-4 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Cetak PDF Laporan Resmi</span>
                        </button>
                      </div>
                    </div>

                    {/* Class Category Tables */}
                    {(() => {
                      const categories = [
                        { name: "Kelas 7 (Tujuh)", prefix: "7" },
                        { name: "Kelas 8 (Delapan)", prefix: "8" },
                        { name: "Kelas 9 (Sembilan)", prefix: "9" }
                      ];

                      return (
                        <div className="space-y-8" id="tka-scoreboard-table-section">
                          {categories.map((cat) => {
                            const filteredSubs = tkaSubmissions.filter((sub) => {
                              const matchesPrefix = sub.kelasSiswa && sub.kelasSiswa.startsWith(cat.prefix);
                              // If guru, only show classes they are allowed to teach
                              if (role === "guru") {
                                const allowedClasses = (user as Guru).kelasDiajar || [];
                                return matchesPrefix && allowedClasses.includes(sub.kelasSiswa);
                              }
                              return matchesPrefix;
                            });

                            const totalScore = filteredSubs.reduce((acc, sub) => acc + (sub.nilai || 0), 0);
                            const classAverage = filteredSubs.length > 0 ? (totalScore / filteredSubs.length).toFixed(1) : "0.0";

                            return (
                              <div key={cat.prefix} className="bg-slate-50/50 rounded-2xl border border-slate-200/80 p-5 space-y-3">
                                {/* Title and Stats Above Table */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                                  <h3 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                    <span className="text-base">🏆</span> {cat.name}
                                    <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-[9px] font-bold">
                                      {filteredSubs.length} Siswa Mengerjakan
                                    </span>
                                  </h3>

                                  {/* Rerata Kelas */}
                                  <div className="flex items-center gap-3 text-xs">
                                    <div className="bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">
                                      <span className="text-slate-500 font-medium">Rata-rata Kelas: </span>
                                      <span className="font-black text-emerald-700">{classAverage}</span>
                                    </div>
                                    <div className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg">
                                      <span className="text-slate-500 font-medium">KKM TKA: </span>
                                      <span className="font-black text-slate-700">{kkmVal}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                                  <table className="w-full text-left border-collapse">
                                    <thead>
                                      <tr className="bg-slate-50 text-slate-500 text-[10px] font-extrabold uppercase border-b border-slate-200">
                                        <th className="p-3.5">Nama Siswa</th>
                                        <th className="p-3.5">Bidang Uji</th>
                                        <th className="p-3.5">Kelas</th>
                                        <th className="p-3.5 text-center">Tanggal Selesai</th>
                                        <th className="p-3.5 text-center">Nilai Ujian</th>
                                        <th className="p-3.5 text-center">Hasil Kelulusan</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs">
                                      {filteredSubs.map((sub) => {
                                        const isPass = (sub.nilai || 0) >= kkmVal;
                                        return (
                                          <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-3.5 font-bold text-slate-800">
                                              <button
                                                onClick={() => {
                                                  setViewingShtkaSubmission(sub);
                                                }}
                                                className="text-emerald-700 hover:text-emerald-900 underline text-left focus:outline-none"
                                              >
                                                {sub.namaSiswa}
                                              </button>
                                            </td>
                                            <td className="p-3.5 font-semibold text-slate-600">{sub.bidangUjiUsed || sub.bidangUji || "Matematika"}</td>
                                            <td className="p-3.5 text-slate-500 font-mono">Kelas {sub.kelasSiswa}</td>
                                            <td className="p-3.5 text-center text-slate-400 font-mono">
                                              {new Date(sub.tanggalSubmisi).toLocaleDateString("id-ID")}
                                            </td>
                                            <td className="p-3.5 text-center">
                                              <span className={`font-extrabold text-sm px-2.5 py-1 rounded-lg ${
                                                isPass ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                                              }`}>
                                                {sub.nilai || 0}
                                              </span>
                                            </td>
                                            <td className="p-3.5 text-center">
                                              <span className={`font-bold text-[10px] uppercase px-2 py-0.5 rounded-full ${
                                                isPass ? "bg-emerald-500 text-white" : "bg-amber-400 text-slate-900"
                                              }`}>
                                                {isPass ? "MELAMPAUI KKM" : "BELUM LULUS"}
                                              </span>
                                            </td>
                                          </tr>
                                        );
                                      })}

                                      {filteredSubs.length === 0 && (
                                        <tr>
                                          <td colSpan={6} className="text-center py-8 text-slate-400 italic">
                                            Belum ada data pengerjaan TKA dari siswa {cat.name} saat ini.
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}

                  </div>
                )}

                {/* -------------------- VIEW: TUGAS TKA SISWA (SISWA ONLY) -------------------- */}
                {activeTab === "siswa-tka" && role === "siswa" && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700 text-2xl border border-emerald-100 shadow-inner">
                          🏆
                        </div>
                        <div>
                          <h2 className="text-lg font-bold font-display text-emerald-800">
                            Asesmen Tes Kemampuan Akademik (TKA) SMP
                          </h2>
                          <p className="text-xs text-slate-500">
                            Ikuti asesmen terstandar nasional untuk mengukur kemampuan penalaran, literasi, dan capaian kognitif tingkat tinggi (HOTS).
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* SHTKA Certificate Modal Overlay if viewing */}
                    {tkaAlertMsg && (
                      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-amber-200 text-center space-y-4">
                          <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-2xl font-bold">
                            ⚠️
                          </div>
                          <h3 className="font-extrabold text-slate-800 text-base">Informasi</h3>
                          <p className="text-xs text-slate-600 font-bold leading-relaxed">
                            {tkaAlertMsg}
                          </p>
                          <button
                            onClick={() => setTkaAlertMsg(null)}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-2 px-4 rounded-xl text-xs transition-colors"
                          >
                            Tutup
                          </button>
                        </div>
                      </div>
                    )}

                    {tkaConfirmData && tkaConfirmData.show && (
                      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-emerald-200 text-center space-y-4">
                          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold">
                            ❓
                          </div>
                          <h3 className="font-extrabold text-slate-800 text-base">Konfirmasi Pengiriman</h3>
                          <p className="text-xs text-slate-600 font-bold leading-relaxed">
                            {tkaConfirmData.message}
                          </p>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setTkaConfirmData(null)}
                              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-2 px-4 rounded-xl text-xs transition-colors"
                            >
                              Tidak
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                const taskId = tkaConfirmData.taskId;
                                setTkaConfirmData(null);
                                handleSubmitTkaSubmission(e, taskId, false, true);
                              }}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 px-4 rounded-xl text-xs shadow-sm transition-colors"
                            >
                              Ya
                            </button>
                          </div>
                        </div>
                      </div>
                    )}



                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* Left Pane: Assigned Checklist (Spans 8 cols) */}
                      <div className="md:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                        {selectedTkaTaskToTake ? (
                          /* ----------------- ACTIVE EXAM WORKSPACE ----------------- */
                          <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
                            <div className="border-b border-slate-100 pb-4 flex justify-between items-start md:items-center flex-wrap gap-4">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
                                    Ujian Sedang Berlangsung
                                  </span>
                                  {tkaTimeRemaining !== null && (
                                    <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                      tkaTimeRemaining < 300
                                        ? "bg-rose-100 text-rose-800 animate-pulse border border-rose-200"
                                        : "bg-amber-100 text-amber-800 border border-amber-200"
                                    }`}>
                                      ⏱️ {formatTkaTime(tkaTimeRemaining)}
                                    </span>
                                  )}
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mt-1">{selectedTkaTaskToTake.judul}</h3>
                                <p className="text-xs text-slate-400">
                                  Bidang Uji: {selectedTkaTaskToTake.bidangUji} • Sistem Skor: {selectedTkaTaskToTake.sistemPenilaian} • KKM: {selectedTkaTaskToTake.kkm || 75}
                                </p>
                              </div>

                              <button
                                onClick={() => {
                                  if (confirm("Apakah Anda yakin ingin keluar dari pengerjaan ujian? Jawaban Anda saat ini belum disimpan.")) {
                                    setSelectedTkaTaskToTake(null);
                                    setTkaExamAnswers({});
                                  }
                                }}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold py-2 px-3.5 rounded-xl transition-colors"
                              >
                                Batalkan Ujian
                              </button>
                            </div>

                            {selectedTkaTaskToTake.deskripsi && (
                              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
                                <strong>Petunjuk Ujian:</strong> {selectedTkaTaskToTake.deskripsi}
                              </div>
                            )}

                            {/* List of generated questions */}
                            <div className="space-y-6">
                              {(selectedTkaTaskToTake.soalTka || selectedTkaTaskToTake.soal || []).map((soal, sIdx) => {
                                const isComplex = soal.tipe === "Pilihan Ganda Kompleks";
                                return (
                                  <div key={soal.id || sIdx} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-slate-100 pb-2">
                                      <span>BUTIR SOAL {sIdx + 1} ({soal.level})</span>
                                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded uppercase">{soal.tipe}</span>
                                    </div>

                                    <p className="text-xs font-bold text-slate-800 leading-relaxed">
                                      {soal.pertanyaan}
                                    </p>

                                    {/* Option fields */}
                                    <div className="grid grid-cols-1 gap-2 pt-2">
                                      {Object.entries(soal.pilihan).map(([key, label]) => {
                                        const isChecked = isComplex
                                          ? (tkaExamAnswers[soal.id] || "").split(",").includes(key)
                                          : tkaExamAnswers[soal.id] === key;
                                        return (
                                          <label
                                            key={key}
                                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all text-xs font-semibold ${
                                              isChecked
                                                ? "bg-emerald-50/80 border-emerald-500 text-emerald-900 shadow-xs"
                                                : "bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100/50"
                                            }`}
                                          >
                                            <input
                                              type={isComplex ? "checkbox" : "radio"}
                                              name={`q-${soal.id}`}
                                              checked={isChecked}
                                              onChange={() => {
                                                if (isComplex) {
                                                  const currentAns = tkaExamAnswers[soal.id] || "";
                                                  const answersArr = currentAns ? currentAns.split(",") : [];
                                                  let newAnswersArr;
                                                  if (answersArr.includes(key)) {
                                                    newAnswersArr = answersArr.filter(item => item !== key);
                                                  } else {
                                                    newAnswersArr = [...answersArr, key].sort();
                                                  }
                                                  setTkaExamAnswers(prev => ({
                                                    ...prev,
                                                    [soal.id]: newAnswersArr.join(",")
                                                  }));
                                                } else {
                                                  setTkaExamAnswers(prev => ({
                                                    ...prev,
                                                    [soal.id]: key
                                                  }));
                                                }
                                                setActiveTkaTaskId(selectedTkaTaskToTake.id);
                                              }}
                                              className="mt-0.5 w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500 rounded-sm"
                                            />
                                            <div className="flex gap-2">
                                              <span className="font-extrabold text-emerald-700">{key}.</span>
                                              <span className="leading-relaxed">{label}</span>
                                            </div>
                                          </label>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Submit exam button action */}
                            <div className="bg-emerald-50 rounded-3xl p-5 border border-emerald-100 flex items-center justify-between flex-wrap gap-4 mt-6">
                              <div className="space-y-1">
                                <h4 className="text-xs font-extrabold text-emerald-900">Ujian Telah Selesai?</h4>
                                <p className="text-[11px] text-emerald-700">Pastikan seluruh butir soal telah dijawab dengan teliti sebelum mengirimkan lembar jawaban.</p>
                              </div>

                              <button
                                onClick={(e) => {
                                  handleSubmitTkaSubmission(e, selectedTkaTaskToTake.id);
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-6 rounded-xl text-xs shadow-md transition-transform hover:scale-[0.98]"
                              >
                                Kirim Lembar Jawaban Asesmen TKA
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* ----------------- AVAILABLE ASSESSMENTS LIST ----------------- */
                          <div className="space-y-4">
                            <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
                              <span>📋</span> Daftar Asesmen TKA Terjadwal
                            </h3>

                            {tkaTasks.filter(task => isTkaClassMatch(task.kelas, (user as Siswa).kelas)).length === 0 ? (
                              <div className="text-center py-12 text-slate-400 italic text-xs">
                                Belum ada asesmen TKA yang ditugaskan untuk kelas Anda saat ini.
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {tkaTasks
                                  .filter(task => isTkaClassMatch(task.kelas, (user as Siswa).kelas))
                                  .map((task) => {
                                  const existingSub = tkaSubmissions.find(s => s.tkaTaskId === task.id && s.siswaId === user.id);
                                  const isSubmitted = !!existingSub;

                                  return (
                                    <div key={task.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">
                                            {task.bidangUji || "Matematika"}
                                          </span>
                                          <span className="text-slate-400 font-mono text-[10px]">
                                            Batas: {task.deadlineTanggal}
                                          </span>
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-800">{task.judul}</h4>
                                        <p className="text-slate-500 text-[11px] leading-relaxed max-w-md">
                                          {task.deskripsi || "Asesmen kemampuan penalaran tingkat tinggi Kemendikdasmen."}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        {isSubmitted ? (
                                          <div className="flex items-center gap-2">
                                            <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-1 rounded-lg">
                                              Skor: {existingSub.nilai} / 100
                                            </span>
                                            <button
                                              onClick={() => setViewingShtkaSubmission(existingSub)}
                                              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1 transition-all"
                                            >
                                              <span>SHTKA</span>
                                              <span>📜</span>
                                            </button>
                                          </div>
                                        ) : (
                                          <button
                                            onClick={() => {
                                              setSelectedTkaTaskToTake(task);
                                              setTkaExamAnswers({});
                                            }}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition-colors shadow-sm"
                                          >
                                            Mulai Ujian TKA
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right Pane: History / Achievements (Spans 4 cols) */}
                      <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
                        <div className="space-y-1">
                          <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
                            <span>📜</span> Dompet SHTKA Digital
                          </h3>
                          <p className="text-[10px] text-slate-400">
                            Sertifikat Hasil TKA Anda akan terbit otomatis di bawah setelah menyelesaikan pengerjaan ujian.
                          </p>
                        </div>

                        {tkaSubmissions.filter(s => s.siswaId === user.id).length === 0 ? (
                          <div className="text-center py-8 text-slate-400 italic text-[11px] bg-slate-50 rounded-2xl border border-slate-100">
                            Belum ada sertifikat terbit. Selesaikan satu ujian TKA untuk menerbitkan SHTKA resmi Anda!
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {tkaSubmissions
                              .filter(s => s.siswaId === user.id)
                              .map((sub) => (
                                <div
                                  key={sub.id}
                                  onClick={() => setViewingShtkaSubmission(sub)}
                                  className="p-3.5 rounded-2xl border-2 border-amber-200 bg-amber-50/20 hover:bg-amber-50/50 cursor-pointer transition-all flex items-center justify-between gap-3 shadow-xs"
                                >
                                  <div className="space-y-1 truncate">
                                    <h4 className="font-bold text-xs text-slate-800 truncate">{sub.tkaTaskJudul}</h4>
                                    <span className="text-[10px] text-slate-400 block">{sub.bidangUji || "Matematika"} • {sub.sistemPenilaian || "IRT"}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xs font-black text-amber-900 block bg-amber-100/60 px-2 py-0.5 rounded-lg border border-amber-200">
                                      {sub.nilai}
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}

                        <div className="bg-emerald-950/5 border border-emerald-900/10 rounded-2xl p-4 text-xs space-y-1.5 text-slate-600">
                          <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">💡 Kegunaan SHTKA</span>
                          <p className="text-[11px] leading-relaxed">
                            Sertifikat Hasil TKA (SHTKA) memuat pemetaan kemampuan kognitif Anda secara transparan dan berstandar nasional. Sertifikat ini dapat digunakan sebagai **dokumen lampiran resmi untuk pendaftaran masuk SMA/SMK jalur prestasi**.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------- VIEW: EDIT STUDENT PROFILE (SISWA) -------------------- */}
                {activeTab === "edit-profil-siswa" && role === "siswa" && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                    <div className="border-b border-slate-100 pb-4 mb-6">
                      <h2 className="text-lg font-bold font-display text-emerald-800">
                        Ubah Informasi Akun Siswa
                      </h2>
                      <p className="text-xs text-slate-500">
                        Sesuaikan data diri untuk ditampilkan di beranda guru dan siswa lain. Nama Anda telah terkunci secara administratif.
                      </p>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const target = e.target as any;
                        handleUpdateSelfProfile({
                          alamat: target.alamat.value,
                          citaCita: target.citaCita.value,
                          motoHidup: target.motoHidup.value,
                          noHp: target.noHp.value,
                          password: target.password.value
                        });
                        setActiveTab("dashboard");
                      }}
                      className="space-y-4 text-xs"
                    >
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Nama Administratif</label>
                        <input
                          type="text"
                          disabled
                          value={user.nama}
                          className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-xs text-slate-400 font-bold cursor-not-allowed outline-none"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">Nama siswa hanya bisa diubah melalui operator admin Guru Madrasah.</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Alamat Rumah Tinggal</label>
                        <textarea
                          name="alamat"
                          defaultValue={(user as Siswa).alamat}
                          rows={2}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1.5">Cita-Cita</label>
                          <input
                            type="text"
                            name="citaCita"
                            defaultValue={(user as Siswa).citaCita}
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1.5">Moto Hidup Utama</label>
                          <input
                            type="text"
                            name="motoHidup"
                            defaultValue={(user as Siswa).motoHidup}
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1.5">No. HP / WhatsApp</label>
                          <input
                            type="text"
                            name="noHp"
                            defaultValue={(user as Siswa).noHp || ""}
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="Contoh: 085987654321"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1.5">Kata Sandi Akun</label>
                          <input
                            type="text"
                            name="password"
                            defaultValue={(user as Siswa).password || "123"}
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="Sandi baru..."
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab("dashboard")}
                          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold py-2 px-4 rounded-xl text-xs transition-colors"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs shadow transition-colors"
                        >
                          Simpan Perubahan
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* -------------------- VIEW: EDIT TEACHER PROFILE (GURU) -------------------- */}
                {activeTab === "edit-profil-guru" && role === "guru" && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                    <div className="border-b border-slate-100 pb-4 mb-6">
                      <h2 className="text-lg font-bold font-display text-emerald-800">
                        Ubah Informasi Akun Guru Pendidik
                      </h2>
                      <p className="text-xs text-slate-500">
                        Perbarui profil profesional Anda untuk tampilan kelas digital dan interaksi wali murid.
                      </p>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const target = e.target as any;
                        handleUpdateSelfProfile({
                          nama: target.nama.value,
                          noHp: target.noHp.value,
                          password: target.password.value,
                          foto: target.foto.value
                        });
                        setActiveTab("dashboard");
                      }}
                      className="space-y-4 text-xs"
                    >
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">NUPTK Pendidik</label>
                        <input
                          type="text"
                          disabled
                          value={(user as Guru).nuptk || (user as any).nip || "-"}
                          className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-xs text-slate-400 font-bold cursor-not-allowed outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Nama Lengkap & Gelar</label>
                        <input
                          type="text"
                          name="nama"
                          required
                          defaultValue={user.nama}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1.5">No. HP / WhatsApp</label>
                          <input
                            type="text"
                            name="noHp"
                            required
                            defaultValue={(user as Guru).noHp || ""}
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="Contoh: 085123456789"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1.5">Kata Sandi Akun</label>
                          <input
                            type="text"
                            name="password"
                            required
                            defaultValue={(user as Guru).password || "123"}
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="Sandi baru..."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">URL Foto Profil</label>
                        <input
                          type="text"
                          name="foto"
                          defaultValue={user.foto || ""}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab("dashboard")}
                          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold py-2 px-4 rounded-xl text-xs transition-colors"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs shadow transition-colors"
                        >
                          Simpan Perubahan
                        </button>
                      </div>
                    </form>
                  </div>
                )}

              </div>

            </div>

          </main>

          {/* FOOTER */}
          <footer className="mt-auto bg-white border-t border-slate-200 py-6 px-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-medium">
              <p className="uppercase tracking-wider">
                © 2026 Smart Teacher • All Right Reserved • Powered By Ahmad Tekor • 
              </p>
              <div className="flex gap-4 items-center flex-wrap">
                <span className="flex items-center gap-2 text-slate-400">
                  <span className="font-bold text-slate-500 text-[9px] tracking-wider uppercase">SOSIAL MEDIA:</span>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram Madrasah" className="p-1.5 rounded-full bg-slate-100 hover:bg-pink-50 hover:text-pink-600 transition-all">
                    <Instagram className="w-3.5 h-3.5" />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook Madrasah" className="p-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-all">
                    <Facebook className="w-3.5 h-3.5" />
                  </a>
                </span>
                <span className="text-slate-300">|</span>
                <a
                  href="https://wa.me/628815617984"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  <span> Developer Contact : @ahmadtekor</span>
                </a>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* 3. MODALS AND DETAILS OVERLAYS */}

      {/* MODAL: SHTKA CERTIFICATE (UNIVERSAL POPUP) */}
      {viewingShtkaSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[92vh] border border-amber-200">
            {/* Closing button */}
            <button
              onClick={() => setViewingShtkaSubmission(null)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-2 rounded-full transition-colors z-10"
            >
              &times;
            </button>

            {/* Scrollable certificate area */}
            <div className="overflow-y-auto flex-1 pr-1 pb-2 scrollbar-thin">
              {/* Elegant Certificate Border */}
              <div className="border-4 double border-amber-600 rounded-2xl p-4 sm:p-5 bg-amber-50/20 text-center space-y-4 sm:space-y-5 relative">
                {/* Watermark icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none text-[160px]">
                  🇮🇩
                </div>

                {/* Header / Kop Surat */}
                <div className="text-center space-y-0.5 select-none border-b-2 border-black pb-2 mb-3">
                  <h4 className="text-[11px] sm:text-[13px] text-black font-medium tracking-tight">
                    YAYASAN PENDIDIKAN MA’ARIF ATH-THOHIRIYAH
                  </h4>
                  <h1 className="text-[17px] sm:text-[21px] font-extrabold text-emerald-600 uppercase tracking-wide">
                    MTs. MA’ARIF NU 7 SAWOJAJAR
                  </h1>
                  <h2 className="text-[12px] sm:text-[15px] font-bold text-black uppercase tracking-tight">
                    KECAMATAN WANASARI KABUPATEN BREBES
                  </h2>
                  <p className="text-[9px] sm:text-[10px] font-bold text-black">
                    SK Menkumham RI No. : AHU-0014995.AH.01.04.Tahun 2016
                  </p>
                  <p className="text-[8px] sm:text-[9px] text-black">
                    Alamat : Jl. Raya Pemuda KM. 5,5 Sawojajar Kecamatan Wanasari Kabupaten Brebes
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif font-extrabold text-base sm:text-lg text-slate-800 tracking-wide uppercase">
                    Sertifikat Hasil TKA (SHTKA)
                  </h3>
                  <p className="text-[9px] sm:text-[10px] font-mono text-amber-800 font-bold">
                    Nomor Seri: SHTKA/SMP-{viewingShtkaSubmission.kelasSiswa}/{viewingShtkaSubmission.id.substring(0, 8).toUpperCase()}
                  </p>
                </div>

                <p className="text-[10px] sm:text-[11px] text-slate-600 leading-relaxed max-w-md mx-auto">
                  Dengan ini menerangkan secara resmi bahwa siswa yang tercantum di bawah ini telah menyelesaikan ujian evaluasi capaian kognitif terstandar nasional:
                </p>

                {/* Student Identity Block */}
                <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-slate-200 max-w-sm mx-auto space-y-0.5 sm:space-y-1 text-xs shadow-xs">
                  <div className="flex justify-between border-b border-slate-100 py-0.5">
                    <span className="text-slate-400 font-medium">Nama Lengkap</span>
                    <span className="font-extrabold text-slate-800">{viewingShtkaSubmission.namaSiswa}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 py-0.5">
                    <span className="text-slate-400 font-medium">Nomor Induk Siswa (NIS)</span>
                    <span className="font-mono font-bold text-slate-700">MTs-{viewingShtkaSubmission.siswaId}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-400 font-medium">Kelas / Satuan Pendidikan</span>
                    <span className="font-bold text-slate-800">Kelas {viewingShtkaSubmission.kelasSiswa} - MTs Model</span>
                  </div>
                </div>

                {/* Scoring Block */}
                <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto">
                  <div className="bg-emerald-50 rounded-xl p-2 sm:p-3 border border-emerald-100 shadow-inner">
                    <span className="text-[8px] sm:text-[9px] uppercase font-bold text-emerald-800 block">Bidang Uji</span>
                    <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-800 block truncate mt-0.5 sm:mt-1">
                      {viewingShtkaSubmission.bidangUjiUsed || viewingShtkaSubmission.bidangUji || "Matematika"}
                    </span>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-2 sm:p-3 border border-amber-100 shadow-inner">
                    <span className="text-[8px] sm:text-[9px] uppercase font-bold text-amber-800 block">Nilai Akhir</span>
                    <span className="text-base sm:text-lg font-black text-amber-900 block mt-0.5">
                      {viewingShtkaSubmission.nilai || 0}
                    </span>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-2 sm:p-3 border border-blue-100 shadow-inner">
                    <span className="text-[8px] sm:text-[9px] uppercase font-bold text-blue-800 block">Status Hasil</span>
                    <span className={`text-[9px] sm:text-[10px] font-extrabold block mt-1 ${
                      (viewingShtkaSubmission.nilai || 0) >= (viewingShtkaSubmission.kkm || kkmVal || 75)
                        ? "text-emerald-700"
                        : "text-rose-700"
                    }`}>
                      {(viewingShtkaSubmission.nilai || 0) >= (viewingShtkaSubmission.kkm || kkmVal || 75) ? "MELAMPAUI KKM" : "BELUM LULUS"}
                    </span>
                  </div>
                </div>

                {/* Stamp & Footer Signatures */}
                <div className="flex justify-between items-end pt-3 border-t border-slate-200">
                  {/* Left Footer Print out */}
                  <div className="text-left text-[8px] sm:text-[9px] text-slate-400 font-mono">
                    © 2026 Smart Teacher  • Powered By Ahmad Tekor •
                  </div>

                  <div className="text-center w-48 sm:w-56 relative">
                    <p className="text-[8px] sm:text-[10px] text-slate-500 font-medium">
                      Brebes, {new Date(viewingShtkaSubmission.tanggalSubmisi).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </p>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-700 mt-0.5 sm:mt-1">Kepala Madrasah,</p>
                    
                    {/* QR Code / Tanda Tangan Digital */}
                    <div className="my-1 sm:my-1.5 flex justify-center">
                      <svg width="35" height="35" viewBox="0 0 29 29" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800">
                        <path d="M1 1h6v6H1V1zm2 2v2h2V3H3zm8-2h2v2h-2V1zm4 0h2v4h-2V1zm4 0h6v6h-6V1zm2 2v2h2V3h-2zM1 11h2v2H1v-2zm4 0h2v4H5v-4zm4 0h4v2H9v-2zm6 0h2v2h-2v-2zm4 0h4v4h-4v-4zm-8 4H9v2h2v-2zm2 0h2v4h-2v-4zm6 0h2v2h-2v-2zM1 21h6v6H1v-6zm2 2v2h2v-2H3zm8-2h2v4h-2v-4zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm2 2h2v4h-2v-4zm-4 2h2v2h-2v-2zm-4 0h2v2h-2v-2z"/>
                      </svg>
                    </div>

                    <p className="text-[10px] sm:text-xs font-extrabold text-slate-950 underline">
                      Nurul Huda, S.Ag.
                    </p>
                    <p className="text-[8px] sm:text-[9px] text-slate-500 font-bold font-mono mt-0.5">
                      ID.197410122005011002
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Print/Download helper action */}
            <div className="mt-4 flex justify-end gap-3 text-xs border-t border-slate-100 pt-3 flex-shrink-0">
              <button
                onClick={() => handlePrintShtka(viewingShtkaSubmission)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 transition-transform hover:scale-[0.98]"
              >
                <span>Cetak Sertifikat</span>
              </button>
              <button
                onClick={() => setViewingShtkaSubmission(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl transition-transform hover:scale-[0.98]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TUGAS MADRASAH REPORT CARD (UNIVERSAL POPUP) */}
      {viewingTugasSubmission && (() => {
        const sub = viewingTugasSubmission.submission;
        const tugas = viewingTugasSubmission.tugas;
        const matchingGuru = teachers.find(t => 
          t.mapel?.toLowerCase() === tugas.mapel?.toLowerCase() && 
          t.kelasDiajar?.includes(sub.kelas || "")
        ) || teachers.find(t => 
          t.mapel?.toLowerCase() === tugas.mapel?.toLowerCase()
        );

        const guruNama = matchingGuru ? matchingGuru.nama : "Nurul Huda, S.Ag.";
        const guruRole = matchingGuru ? "Guru Mata Pelajaran" : "Kepala Madrasah";
        const guruIdLabel = matchingGuru ? "NUPTK" : "ID";
        const guruIdValue = matchingGuru ? matchingGuru.nuptk : "197410122005011002";

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[92vh] border border-emerald-200">
              {/* Closing button */}
              <button
                onClick={() => setViewingTugasSubmission(null)}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-2 rounded-full transition-colors z-10"
              >
                &times;
              </button>

              {/* Scrollable report card area */}
              <div className="overflow-y-auto flex-1 pr-1 pb-2 scrollbar-thin">
                {/* Elegant Certificate Border */}
                <div className="border-4 double border-emerald-600 rounded-2xl p-4 sm:p-5 bg-emerald-50/20 text-center space-y-4 sm:space-y-5 relative">
                  {/* Watermark icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none text-[160px]">
                    🇮🇩
                  </div>

                  {/* Header / Kop Surat */}
                  <div className="text-center space-y-0.5 select-none border-b-2 border-black pb-2 mb-3">
                    <h4 className="text-[11px] sm:text-[13px] text-black font-medium tracking-tight">
                      YAYASAN PENDIDIKAN MA’ARIF ATH-THOHIRIYAH
                    </h4>
                    <h1 className="text-[17px] sm:text-[21px] font-extrabold text-emerald-600 uppercase tracking-wide">
                      MTs. MA’ARIF NU 7 SAWOJAJAR
                    </h1>
                    <h2 className="text-[12px] sm:text-[15px] font-bold text-black uppercase tracking-tight">
                      KECAMATAN WANASARI KABUPATEN BREBES
                    </h2>
                    <p className="text-[9px] sm:text-[10px] font-bold text-black">
                      SK Menkumham RI No. : AHU-0014995.AH.01.04.Tahun 2016
                    </p>
                    <p className="text-[8px] sm:text-[9px] text-black">
                      Alamat : Jl. Raya Pemuda KM. 5,5 Sawojajar Kecamatan Wanasari Kabupaten Brebes
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif font-extrabold text-base sm:text-lg text-slate-800 tracking-wide uppercase">
                      Hasil Penilaian Tugas Madrasah
                    </h3>
                    <p className="text-[9px] sm:text-[10px] font-mono text-emerald-800 font-bold">
                      Nomor Seri: LHETM/MTs-{(user as Siswa)?.kelas || sub.kelas || "7"}/{(sub.id || "").substring(0, 8).toUpperCase()}
                    </p>
                  </div>

                  <p className="text-[10px] sm:text-[11px] text-slate-600 leading-relaxed max-w-md mx-auto">
                    Dengan ini menerangkan secara resmi bahwa siswa yang tercantum di bawah ini telah menyelesaikan Tugas Madrasah / Evaluasi Pembelajaran Mandiri Teruji AI:
                  </p>

                  {/* Student Identity Block */}
                  <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-slate-200 max-w-sm mx-auto space-y-0.5 sm:space-y-1 text-xs shadow-xs">
                    <div className="flex justify-between border-b border-slate-100 py-0.5">
                      <span className="text-slate-400 font-medium">Nama Lengkap</span>
                      <span className="font-extrabold text-slate-800">{sub.namaSiswa}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 py-0.5">
                      <span className="text-slate-400 font-medium">Nomor Induk Siswa (NIS)</span>
                      <span className="font-mono font-bold text-slate-700">MTs-{sub.siswaId}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-400 font-medium">Kelas / Satuan Pendidikan</span>
                      <span className="font-bold text-slate-800">Kelas {sub.kelas || (user as Siswa)?.kelas || "7"} - MTs Model</span>
                    </div>
                  </div>

                  {/* Scoring Block */}
                  <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto">
                    <div className="bg-emerald-50 rounded-xl p-2 sm:p-3 border border-emerald-100 shadow-inner">
                      <span className="text-[8px] sm:text-[9px] uppercase font-bold text-emerald-800 block">Mata Pelajaran</span>
                      <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-800 block truncate mt-0.5 sm:mt-1">
                        {tugas.mapel || "Umum"}
                      </span>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-2 sm:p-3 border border-amber-100 shadow-inner">
                      <span className="text-[8px] sm:text-[9px] uppercase font-bold text-amber-800 block">Nilai Tugas</span>
                      <span className="text-base sm:text-lg font-black text-amber-900 block mt-0.5">
                        {sub.nilai || 0}
                      </span>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-2 sm:p-3 border border-blue-100 shadow-inner">
                      <span className="text-[8px] sm:text-[9px] uppercase font-bold text-blue-800 block">Status Capaian</span>
                      <span className={`text-[9px] sm:text-[10px] font-extrabold block mt-1 ${
                        (sub.nilai || 0) >= 75
                          ? "text-emerald-700"
                          : "text-rose-700"
                      }`}>
                        {(sub.nilai || 0) >= 75 ? "TUNTAS KKM" : "BELUM TUNTAS"}
                      </span>
                    </div>
                  </div>

                  {/* Additional Meta (Bab / Chapter) */}
                  <div className="max-w-md mx-auto text-center px-4 py-2.5 bg-white/65 border border-slate-200 rounded-xl text-[11px] font-medium text-slate-600 shadow-2xs">
                    Materi Tugas: <span className="font-bold text-slate-800">{tugas.bab || "-"}</span>
                  </div>

                  {/* Stamp & Footer Signatures */}
                  <div className="flex justify-between items-end pt-3 border-t border-slate-200">
                    {/* Left Footer Print out */}
                    <div className="text-left text-[8px] sm:text-[9px] text-slate-400 font-mono">
                      © 2026 Smart Teacher  • Powered By Ahmad Tekor •
                    </div>

                    <div className="text-center w-48 sm:w-56 relative">
                      <p className="text-[8px] sm:text-[10px] text-slate-500 font-medium">
                        Brebes, {new Date(sub.tanggalSelesai).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </p>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-700 mt-0.5 sm:mt-1">{guruRole},</p>
                      
                      {/* QR Code / Tanda Tangan Digital */}
                      <div className="my-1 sm:my-1.5 flex justify-center">
                        <svg width="35" height="35" viewBox="0 0 29 29" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800">
                          <path d="M1 1h6v6H1V1zm2 2v2h2V3H3zm8-2h2v2h-2V1zm4 0h2v4h-2V1zm4 0h6v6h-6V1zm2 2v2h2V3h-2zM1 11h2v2H1v-2zm4 0h2v4H5v-4zm4 0h4v2H9v-2zm6 0h2v2h-2v-2zm4 0h4v4h-4v-4zm-8 4H9v2h2v-2zm2 0h2v4h-2v-4zm6 0h2v2h-2v-2zM1 21h6v6H1v-6zm2 2v2h2v-2H3zm8-2h2v4h-2v-4zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm2 2h2v4h-2v-4zm-4 2h2v2h-2v-2zm-4 0h2v2h-2v-2z"/>
                        </svg>
                      </div>

                      <p className="text-[10px] sm:text-xs font-extrabold text-slate-950 underline">
                        {guruNama}
                      </p>
                      <p className="text-[8px] sm:text-[9px] text-slate-500 font-bold font-mono mt-0.5">
                        {guruIdLabel}. {guruIdValue}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Print/Download helper action */}
              <div className="mt-4 flex justify-end gap-3 text-xs border-t border-slate-100 pt-3 flex-shrink-0">
                <button
                  onClick={() => handlePrintTugas(sub, tugas)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 transition-transform hover:scale-[0.98]"
                >
                  <span>Cetak Laporan Nilai</span>
                </button>
                <button
                  onClick={() => setViewingTugasSubmission(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl transition-transform hover:scale-[0.98]"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL: SUBMISSION DETAILS EXAM SHEET FOR GURU */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-700 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Lembar Jawaban Hasil Tugas Siswa</h3>
                <p className="text-xs text-emerald-100 font-medium mt-0.5">Koreksi otomatis oleh AI Smart Teacher</p>
              </div>
              <button
                onClick={() => {
                  setSelectedSubmission(null);
                  setSelectedSubmissionTugas(null);
                }}
                className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[450px] overflow-y-auto space-y-6 text-xs">
              
              {/* PRINTABLE AREA CONTAINER */}
              <div id="printable-submission-area" className="bg-white p-2">
                {/* Print Header Logo / Kop Surat */}
                <div className="text-center space-y-1 select-none border-b-2 border-black pb-3 mb-5">
                  <h4 className="text-[13px] text-black font-medium tracking-tight">
                    YAYASAN PENDIDIKAN MA’ARIF ATH-THOHIRIYAH
                  </h4>
                  <h1 className="text-[21px] font-extrabold text-emerald-600 uppercase tracking-wide">
                    MTs. MA’ARIF NU 7 SAWOJAJAR
                  </h1>
                  <h2 className="text-[15px] font-bold text-black uppercase tracking-tight">
                    KECAMATAN WANASARI KABUPATEN BREBES
                  </h2>
                  <p className="text-[10px] font-bold text-black">
                    SK Menkumham RI No. : AHU-0014995.AH.01.04.Tahun 2016
                  </p>
                  <p className="text-[9px] text-black">
                    Alamat : Jl. Raya Pemuda KM. 5,5 Sawojajar Kecamatan Wanasari Kabupaten Brebes
                  </p>
                </div>

                {/* Header profile of student exam */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 font-semibold text-slate-700">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Nama Siswa</span>
                    <span className="text-slate-900 font-bold text-xs">{selectedSubmission.namaSiswa}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Jenjang Kelas</span>
                    <span className="text-slate-900">Kelas {selectedSubmission.kelas} MTs</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Mata Pelajaran & Bab</span>
                    <span className="text-slate-900 truncate max-w-xs block">
                      {selectedSubmissionTugas?.mapel} ({selectedSubmissionTugas?.bab || "Evaluasi Umum"})
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Tanggal Pengerjaan</span>
                    <span className="text-slate-900">
                      {new Date(selectedSubmission.tanggalSelesai).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Status Evaluasi AI</span>
                      <span className={`text-xs font-extrabold ${selectedSubmission.nilai >= 75 ? "text-emerald-700" : "text-amber-600"}`}>
                        {selectedSubmission.nilai >= 75 ? "✓ TUNTAS KKM (MEMUASKAN)" : "⚠ REMEDIASI MANDIRI"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Nilai Akhir</span>
                      <span className={`text-base font-extrabold ${selectedSubmission.nilai >= 75 ? "text-emerald-700" : "text-red-600"}`}>
                        {selectedSubmission.nilai} / 100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Answers Details - ONLY SELECTED CHOICES */}
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider pl-1 pt-4 pb-2 border-b border-slate-100">
                  Lembar Rekap Hasil Jawaban yang Dipilih Siswa:
                </h4>
                
                <div className="divide-y divide-slate-100 mt-2">
                  {selectedSubmissionTugas?.soal.map((q, idx) => {
                    const studentAnsCode = selectedSubmission.jawaban[q.id];
                    const studentAnsText = q.pilihan[studentAnsCode] || "(Siswa Tidak Menjawab)";
                    const isCorrect = studentAnsCode === q.jawabanBenar;

                    return (
                      <div key={q.id} className="py-2.5 flex items-start justify-between text-xs gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-700">
                            {idx + 1}. <span className="font-extrabold text-slate-900">{studentAnsCode}.</span> {studentAnsText}
                          </p>
                          <p className="text-[9px] text-slate-400 mt-0.5">Pertanyaan: {q.pertanyaan}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          {isCorrect ? (
                            <span className="text-emerald-700 font-extrabold text-[10px] bg-emerald-100 px-2 py-0.5 rounded-full">
                              ✓ BENAR
                            </span>
                          ) : (
                            <div className="flex flex-col items-end gap-0.5">
                              <span className="text-red-600 font-extrabold text-[10px] bg-red-100 px-2 py-0.5 rounded-full">
                                ✗ SALAH
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono">Kunci: {q.jawabanBenar}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* SIGNATURE & FOOTER BLOCK */}
                <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-end">
                  {/* Footer print out pada bagian kiri bawah */}
                  <div className="text-left text-[9px] text-slate-400 font-mono">
                    © 2026 Smart Teacher • Powered By Ahmad Tekor •
                  </div>

                  <div className="text-center w-56">
                    <p className="text-[10px] text-slate-500 font-medium">
                      Brebes, {new Date(selectedSubmission.tanggalSelesai).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </p>
                    <p className="text-xs font-bold text-slate-700 mt-1">Guru Mata Pelajaran,</p>
                    
                    {/* QR Code / Tanda Tangan Digital */}
                    <div className="my-1.5 flex justify-center">
                      <svg width="45" height="45" viewBox="0 0 29 29" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800">
                        <path d="M1 1h6v6H1V1zm2 2v2h2V3H3zm8-2h2v2h-2V1zm4 0h2v4h-2V1zm4 0h6v6h-6V1zm2 2v2h2V3h-2zM1 11h2v2H1v-2zm4 0h2v4H5v-4zm4 0h4v2H9v-2zm6 0h2v2h-2v-2zm4 0h4v4h-4v-4zm-8 4H9v2h2v-2zm2 0h2v4h-2v-4zm6 0h2v2h-2v-2zM1 21h6v6H1v-6zm2 2v2h2v-2H3zm8-2h2v4h-2v-4zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm2 2h2v4h-2v-4zm-4 2h2v2h-2v-2zm-4 0h2v2h-2v-2z"/>
                      </svg>
                    </div>

                    <p className="text-xs font-extrabold text-slate-950 underline">
                      {teachers.find((t) => t.mapel === selectedSubmissionTugas?.mapel)?.nama || "Ibu Anisa, S.Pd."}
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold font-mono mt-0.5">
                      ID.2026021004
                    </p>
                  </div>
                </div>

              </div>

            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handlePrintSubmission}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded-xl text-xs shadow flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar Jawaban (Printer / PDF)</span>
              </button>
              
              <button
                onClick={() => {
                  setSelectedSubmission(null);
                  setSelectedSubmissionTugas(null);
                }}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded-xl text-xs shadow"
              >
                Tutup Rekap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD STUDENT FOR TEACHER */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-700 p-5 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingStudentId ? "Edit Informasi Peserta Didik" : "Tambah Siswa Baru Madrasah"}
              </h3>
              <button onClick={() => setShowAddStudentModal(false)} className="text-white hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOrEditStudent} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={studentForm.nama || ""}
                  onChange={(e) => setStudentForm({ ...studentForm, nama: e.target.value })}
                  placeholder="Nama Lengkap Siswa"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Username Login (Tanpa spasi)</label>
                <input
                  type="text"
                  required
                  disabled={!!editingStudentId}
                  value={studentForm.username || ""}
                  onChange={(e) => setStudentForm({ ...studentForm, username: e.target.value.replace(/\s+/g, "").toLowerCase() })}
                  placeholder="username_siswa"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Tingkat Kelas</label>
                <select
                  value={studentForm.kelas || ""}
                  onChange={(e) => setStudentForm({ ...studentForm, kelas: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="7A">Kelas 7A</option>
                  <option value="7B">Kelas 7B</option>
                  <option value="7C">Kelas 7C</option>
                  <option value="8A">Kelas 8A</option>
                  <option value="8B">Kelas 8B</option>
                  <option value="8C">Kelas 8C</option>
                  <option value="8D">Kelas 8D</option>
                  <option value="9A">Kelas 9A</option>
                  <option value="9B">Kelas 9B</option>
                  <option value="9C">Kelas 9C</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Alamat Lengkap Rumah</label>
                <textarea
                  value={studentForm.alamat || ""}
                  onChange={(e) => setStudentForm({ ...studentForm, alamat: e.target.value })}
                  rows={2}
                  placeholder="Jl. Kyai Haji..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Cita-Cita</label>
                  <input
                     type="text"
                     value={studentForm.citaCita || ""}
                     onChange={(e) => setStudentForm({ ...studentForm, citaCita: e.target.value })}
                     placeholder="Pekerjaan impian"
                     className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Moto Hidup</label>
                  <input
                    type="text"
                    value={studentForm.motoHidup || ""}
                    onChange={(e) => setStudentForm({ ...studentForm, motoHidup: e.target.value })}
                    placeholder="Kata mutiara..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">No. HP / WhatsApp</label>
                  <input
                    type="text"
                    value={studentForm.noHp || ""}
                    onChange={(e) => setStudentForm({ ...studentForm, noHp: e.target.value })}
                    placeholder="Contoh: 085987654321"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Kata Sandi Login</label>
                  <input
                    type="text"
                    value={studentForm.password || ""}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    placeholder="Sandi default: 123"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold py-2 px-4 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs shadow"
                >
                  {editingStudentId ? "Simpan Perubahan" : "Tambahkan Siswa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD/EDIT TEACHER FOR ADMIN */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-700 p-5 text-white flex items-center justify-between flex-shrink-0">
              <h3 className="font-bold text-sm">
                {editingTeacherId ? "Edit Informasi Guru Pendidik" : "Tambah Guru Pendidik Baru"}
              </h3>
              <button
                onClick={() => {
                  setShowAddTeacherModal(false);
                  setEditingTeacherId(null);
                  setTeacherForm({
                    username: "",
                    nama: "",
                    nuptk: "",
                    mapel: "Fiqih",
                    kelasDiajar: [],
                    password: "",
                    noHp: ""
                  });
                }}
                className="text-white hover:opacity-80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOrEditTeacher} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs scrollbar-thin">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Nama Lengkap Guru (Beserta Gelar)</label>
                <input
                  type="text"
                  required
                  value={teacherForm.nama || ""}
                  onChange={(e) => setTeacherForm({ ...teacherForm, nama: e.target.value })}
                  placeholder="Contoh: Ibu Anisa, S.Pd."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Username Login (Tanpa spasi)</label>
                <input
                  type="text"
                  required
                  disabled={!!editingTeacherId}
                  value={teacherForm.username || ""}
                  onChange={(e) => setTeacherForm({ ...teacherForm, username: e.target.value.replace(/\s+/g, "").toLowerCase() })}
                  placeholder="Contoh: anisa_guru"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">NUPTK Pendidik</label>
                <input
                  type="text"
                  value={teacherForm.nuptk || ""}
                  onChange={(e) => setTeacherForm({ ...teacherForm, nuptk: e.target.value })}
                  placeholder="Contoh: 19940321 202203 2 004"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Mata Pelajaran Diampu</label>
                <select
                  value={teacherForm.mapel || "Fiqih"}
                  onChange={(e) => setTeacherForm({ ...teacherForm, mapel: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {DAFTAR_MAPEL.map((mapel) => (
                    <option key={mapel} value={mapel}>{mapel}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">No. HP / WhatsApp</label>
                  <input
                    type="text"
                    value={teacherForm.noHp || ""}
                    onChange={(e) => setTeacherForm({ ...teacherForm, noHp: e.target.value })}
                    placeholder="Contoh: 085..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Kata Sandi Akun</label>
                  <input
                    type="text"
                    value={teacherForm.password || ""}
                    onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                    placeholder="Sandi default: 123"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Penempatan Kelas Diajar (Bisa lebih dari satu)</label>
                <div className="grid grid-cols-5 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  {["7A", "7B", "7C", "8A", "8B", "8C", "8D", "9A", "9B", "9C"].map((subclass) => {
                    const isChecked = teacherForm.kelasDiajar.includes(subclass);
                    return (
                      <label
                        key={subclass}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? "bg-emerald-600 border-emerald-600 text-white font-bold"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const exists = teacherForm.kelasDiajar.includes(subclass);
                            let updated: string[];
                            if (exists) {
                              updated = teacherForm.kelasDiajar.filter((c) => c !== subclass);
                            } else {
                              updated = [...teacherForm.kelasDiajar, subclass];
                            }
                            setTeacherForm({ ...teacherForm, kelasDiajar: updated });
                          }}
                          className="sr-only"
                        />
                        <span className="text-[11px]">{subclass}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTeacherModal(false);
                    setEditingTeacherId(null);
                    setTeacherForm({
                      username: "",
                      nama: "",
                      nuptk: "",
                      mapel: "Fiqih",
                      kelasDiajar: [],
                      password: "",
                      noHp: ""
                    });
                  }}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold py-2 px-4 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs shadow"
                >
                  {editingTeacherId ? "Simpan Perubahan" : "Tambahkan Guru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD BOOK FOR TEACHER */}
      {showAddBookModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-700 p-5 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Upload Buku Pelajaran Baru</h3>
              <button onClick={() => setShowAddBookModal(false)} className="text-white hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBook} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Judul Lengkap Buku</label>
                <input
                  type="text"
                  required
                  value={bookForm.judul || ""}
                  onChange={(e) => setBookForm({ ...bookForm, judul: e.target.value })}
                  placeholder="Contoh: Akidah Akhlak Madrasah Tsanawiyah Kelas VII"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Mata Pelajaran</label>
                  <select
                    value={bookForm.mapel || "Fiqih"}
                    onChange={(e) => setBookForm({ ...bookForm, mapel: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {DAFTAR_MAPEL.map((mapel) => (
                      <option key={mapel} value={mapel}>{mapel}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Sasaran Kelas</label>
                  <select
                    value={bookForm.kelas || "7"}
                    onChange={(e) => setBookForm({ ...bookForm, kelas: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <optgroup label="Tingkat Paralel (Semua Kelas)">
                      <option value="7">Semua Kelas 7</option>
                      <option value="8">Semua Kelas 8</option>
                      <option value="9">Semua Kelas 9</option>
                    </optgroup>
                    <optgroup label="Kelas Spesifik">
                      <option value="7A">Kelas 7A</option>
                      <option value="7B">Kelas 7B</option>
                      <option value="7C">Kelas 7C</option>
                      <option value="8A">Kelas 8A</option>
                      <option value="8B">Kelas 8B</option>
                      <option value="8C">Kelas 8C</option>
                      <option value="8D">Kelas 8D</option>
                      <option value="9A">Kelas 9A</option>
                      <option value="9B">Kelas 9B</option>
                      <option value="9C">Kelas 9C</option>
                      <option value="9D">Kelas 9D</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Upload Berkas Materi / Buku (Semua Jenis Berkas)</label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const files = e.dataTransfer.files;
                    if (files && files.length > 0) {
                      const file = files[0];
                      const reader = new FileReader();
                      reader.onload = () => {
                        setUploadedFile({
                          name: file.name,
                          type: file.type || "application/octet-stream",
                          data: reader.result as string
                        });
                        if (!bookForm.judul) {
                          setBookForm(prev => ({
                            ...prev,
                            judul: file.name.split('.').slice(0, -1).join('.')
                          }));
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors bg-slate-50/50 cursor-pointer"
                  onClick={() => document.getElementById("book-file-uploader")?.click()}
                >
                  <input
                    type="file"
                    id="book-file-uploader"
                    className="sr-only"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        const file = files[0];
                        const reader = new FileReader();
                        reader.onload = () => {
                          setUploadedFile({
                            name: file.name,
                            type: file.type || "application/octet-stream",
                            data: reader.result as string
                          });
                          if (!bookForm.judul) {
                            setBookForm(prev => ({
                              ...prev,
                              judul: file.name.split('.').slice(0, -1).join('.')
                            }));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {uploadedFile ? (
                    <div className="space-y-1 text-emerald-800">
                      <span className="text-2xl block">📎</span>
                      <p className="font-extrabold text-xs">{uploadedFile.name}</p>
                      <p className="text-[10px] text-slate-400">Tipe: {uploadedFile.type}</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                        }}
                        className="text-red-500 hover:text-red-700 text-[10px] font-bold underline mt-1 block mx-auto animate-bounce"
                      >
                        Hapus Berkas
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-slate-500">
                      <span className="text-3xl block">📁</span>
                      <p className="font-bold text-xs">Tarik & lepas berkas di sini, atau klik untuk memilih</p>
                      <p className="text-[10px] text-slate-400">Mendukung PDF, DOCX, XLSX, MP3, MP4, JPEG, PNG, dll. (Max 50MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBookModal(false)}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold py-2 px-4 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs shadow"
                >
                  Simpan Buku
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CHAPTER FOR TEACHER */}
      {showAddChapterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-700 p-5 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Upload Bab Materi Baru</h3>
              <button onClick={() => setShowAddChapterModal(false)} className="text-white hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddChapter} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Pilih Buku Target</label>
                <select
                  required
                  value={chapterForm.bookId || ""}
                  onChange={(e) => setChapterForm({ ...chapterForm, bookId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Pilih Buku Pelajaran --</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.judul} (Kls {b.kelas})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-500 mb-1">No. Bab</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={chapterForm.nomor === undefined || chapterForm.nomor === null ? "" : chapterForm.nomor}
                    onChange={(e) => setChapterForm({ ...chapterForm, nomor: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Judul Bab Materi</label>
                  <input
                    type="text"
                    required
                    value={chapterForm.judul || ""}
                    onChange={(e) => setChapterForm({ ...chapterForm, judul: e.target.value })}
                    placeholder="Contoh: Ketentuan Shalat Fardhu"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Konten / Ringkasan Materi Bab</label>
                <textarea
                  required
                  value={chapterForm.konten || ""}
                  onChange={(e) => setChapterForm({ ...chapterForm, konten: e.target.value })}
                  rows={6}
                  placeholder="Tuliskan materi pelajaran secara mendalam disini sebagai referensi membaca siswa serta referensi AI generator dalam membuat soal tugas..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddChapterModal(false)}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold py-2 px-4 rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs shadow"
                >
                  Simpan Bab Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRM DELETE PRESENTATION */}
      {presToDeleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-6">
            <div className="flex items-center gap-3.5 text-red-600">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-xl shadow-inner border border-red-100 flex-shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Hapus Presentasi Ajar</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Tindakan ini bersifat permanen dan tidak bisa dibatalkan.</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Apakah Anda yakin ingin menghapus materi slide presentasi tersimpan ini dari pangkalan data Madrasah?
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPresToDeleteId(null)}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold py-2 px-4 rounded-xl text-xs cursor-pointer transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  handleDeletePresentation(presToDeleteId);
                  setPresToDeleteId(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md cursor-pointer transition-all"
              >
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRM DELETE BOOK */}
      {bookToDeleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-6">
            <div className="flex items-center gap-3.5 text-red-600">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-xl shadow-inner border border-red-100 flex-shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Hapus Buku Pelajaran</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Tindakan ini bersifat permanen dan tidak bisa dibatalkan.</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Apakah Anda yakin ingin menghapus buku pelajaran tersimpan ini? Semua materi bab yang ada di dalamnya juga akan terhapus secara permanen dari basis data Madrasah.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setBookToDeleteId(null)}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold py-2 px-4 rounded-xl text-xs cursor-pointer transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  handleDeleteBook(bookToDeleteId);
                  setBookToDeleteId(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md cursor-pointer transition-all"
              >
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- IMMERSIVE INTERACTIVE SLIDESHOW PLAYER --- */}
      {slideshowActive && currentPresentingPres && currentPresentingPres.slides && currentPresentingPres.slides.length > 0 && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 md:p-10 select-none animate-in fade-in duration-300">
          
          {/* Top Header Controls Bar */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm">
                Live Presentasi
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-200 tracking-tight font-sans line-clamp-1">
                  {currentPresentingPres.judul}
                </h2>
                <p className="text-[10px] text-slate-400">
                  {currentPresentingPres.mapel} • Kelas {currentPresentingPres.kelas} • {currentPresentingPres.bab}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadPresentationAsPPTX(currentPresentingPres)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold text-xs py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                title="Unduh File PPTX PowerPoint"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Unduh PPTX</span>
              </button>

              <button
                onClick={() => setSlideshowActive(false)}
                className="bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-900/40 font-bold text-xs py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                title="Tutup Presentasi (Esc)"
              >
                <X className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>

          {/* Immersive Center Stage Container */}
          <div className="flex-1 flex items-center justify-center max-w-7xl mx-auto w-full relative px-4 md:px-8">
            
            {/* Left Stage Click Indicator */}
            <button
              onClick={() => {
                setSlideshowDirection(-1);
                setSlideshowIndex((prev) => Math.max(0, prev - 1));
              }}
              disabled={slideshowIndex === 0}
              className="absolute left-[-20px] md:left-[-50px] top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:border-emerald-500 disabled:opacity-20 disabled:hover:bg-slate-900/60 disabled:hover:text-inherit transition-all z-10 cursor-pointer text-lg font-bold"
            >
              ←
            </button>

            {/* Slide Page Content Frame */}
            <div className="w-full bg-slate-900/40 border border-slate-800 rounded-3xl p-8 md:p-12 aspect-[16/9] min-h-[360px] md:min-h-[480px] flex flex-col justify-between relative overflow-hidden shadow-2xl">
              
              {/* Layout-Based Stage Decor */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500"></div>
              <div className="absolute right-[-60px] bottom-[-60px] w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>

              {/* Dynamic Slide Content Render */}
              <AnimatePresence mode="wait" custom={slideshowDirection}>
                <motion.div
                  key={slideshowIndex}
                  custom={slideshowDirection}
                  variants={getTransitionVariants(slideshowIndex)}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="flex-1 flex flex-col justify-between overflow-hidden"
                >
                  {(() => {
                    const slide = currentPresentingPres.slides[slideshowIndex];
                const layout = slide.layout || "standard";

                if (layout === "title_slide" || slideshowIndex === 0) {
                  return (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 md:px-12 space-y-6">
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-500/30">
                        {currentPresentingPres.mapel} • Kelas {currentPresentingPres.kelas}
                      </span>
                      <h1 className="text-2xl md:text-5xl font-black tracking-tight font-serif text-emerald-200 leading-tight">
                        {slide.title || currentPresentingPres.judul}
                      </h1>
                      <p className="text-sm md:text-lg text-slate-300 font-sans italic max-w-2xl">
                        {slide.subtitle || `Materi ${currentPresentingPres.bab}: ${currentPresentingPres.tema}`}
                      </p>
                      {slide.bullets && (
                        <div className="flex flex-wrap justify-center gap-4 pt-4 text-xs text-slate-400 font-mono">
                          {slide.bullets.map((b: string, i: number) => (
                            <span key={i} className="bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-800">
                              ✓ {b}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                if (layout === "dalil_slide") {
                  return (
                    <div className="flex-1 flex flex-col justify-center space-y-6 md:px-12">
                      <div className="border-l-4 border-amber-400 pl-6 space-y-4 py-3">
                        <span className="text-[10px] bg-amber-500/10 text-amber-300 font-extrabold px-3 py-1 rounded-md border border-amber-500/20 uppercase tracking-widest">
                          Dalil / Nash Referensi
                        </span>
                        <h2 className="text-lg md:text-2xl font-bold font-serif text-emerald-300">
                          {slide.title}
                        </h2>
                      </div>
                      
                      <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-2xl p-6 italic text-slate-200 font-serif leading-relaxed text-sm md:text-lg relative">
                        <span className="absolute top-2 left-3 text-emerald-800/40 font-serif text-6xl select-none leading-none">“</span>
                        <p className="relative z-10 pl-4">{slide.bullets && slide.bullets[0]}</p>
                        {slide.bullets && slide.bullets.length > 1 && (
                          <p className="relative z-10 pl-4 mt-3 text-xs md:text-sm text-slate-400 font-sans not-italic">
                            Artinya: "{slide.bullets[1]}"
                          </p>
                        )}
                      </div>

                      {slide.subtitle && (
                        <p className="text-xs text-slate-400 font-mono italic text-right">
                          Sumber: {slide.subtitle}
                        </p>
                      )}
                    </div>
                  );
                }

                if (layout === "two_columns") {
                  return (
                    <div className="flex-1 flex flex-col justify-between space-y-6">
                      <div>
                        <h2 className="text-lg md:text-3xl font-bold font-serif text-emerald-300">
                          {slide.title}
                        </h2>
                        {slide.subtitle && (
                          <p className="text-xs text-slate-400 italic mt-1 font-sans">
                            {slide.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start flex-1 pt-2">
                        {/* Column 1 */}
                        <div className="space-y-4">
                          {(slide.bullets || []).slice(0, Math.ceil((slide.bullets || []).length / 2)).map((b: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 bg-slate-950/40 border border-slate-800/50 p-3.5 rounded-xl">
                              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                {i + 1}
                              </span>
                              <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                                {b}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-4">
                          {(slide.bullets || []).slice(Math.ceil((slide.bullets || []).length / 2)).map((b: string, i: number) => {
                            const actualIdx = i + Math.ceil((slide.bullets || []).length / 2);
                            return (
                              <div key={actualIdx} className="flex items-start gap-3 bg-slate-950/40 border border-slate-800/50 p-3.5 rounded-xl">
                                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                  {actualIdx + 1}
                                </span>
                                <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                                  {b}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Default / image_highlight Layout
                const hasImage = slide.image_keyword && layout !== "content_only";
                const imgPosList = ["right", "left", "below"];
                const imgPos = imgPosList[slideshowIndex % 3];
                const slideImageUrl = getImageUrl(slide.image_keyword);

                if (hasImage) {
                  if (imgPos === "below") {
                    return (
                      <div className="flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h2 className="text-lg md:text-3xl font-bold font-serif text-emerald-300">
                            {slide.title}
                          </h2>
                          {slide.subtitle && (
                            <p className="text-xs text-slate-400 italic mt-1 font-sans">
                              {slide.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Image centered below title */}
                        <div className="w-full max-w-sm mx-auto aspect-[2.2/1] relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl group">
                          <img
                            src={slideImageUrl}
                            alt={slide.image_keyword}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-slate-950/85 px-3 py-1 text-[9px] text-slate-300 truncate font-mono">
                            Rekomendasi Visual: "{slide.image_keyword}"
                          </div>
                        </div>

                        {/* Bullets below image in 2 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                          {(slide.bullets || []).map((b: string, i: number) => (
                            <div key={i} className="flex items-start gap-2 bg-slate-950/20 border border-slate-800/30 p-2 rounded-xl">
                              <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <p className="text-[11px] md:text-xs text-slate-200 leading-relaxed">
                                {b}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  } else {
                    // LEFT or RIGHT layout
                    const isLeft = imgPos === "left";
                    return (
                      <div className="flex-1 flex flex-col justify-between space-y-4 md:space-y-6">
                        <div>
                          <h2 className="text-lg md:text-3xl font-bold font-serif text-emerald-300">
                            {slide.title}
                          </h2>
                          {slide.subtitle && (
                            <p className="text-xs text-slate-400 italic mt-1 font-sans">
                              {slide.subtitle}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center flex-1 pt-2">
                          {/* Text Column */}
                          <div className={`md:col-span-7 space-y-4 ${isLeft ? "md:order-2" : "md:order-1"}`}>
                            {(slide.bullets || []).map((b: string, i: number) => (
                              <div key={i} className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                                  {b}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Image Column */}
                          <div className={`md:col-span-5 relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video md:aspect-[4/3] flex flex-col items-center justify-center text-center shadow-xl group ${isLeft ? "md:order-1" : "md:order-2"}`}>
                            <img
                              src={slideImageUrl}
                              alt={slide.image_keyword}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-slate-950/85 px-3 py-1.5 text-[10px] text-slate-300 truncate font-mono border-t border-slate-850">
                              Rekomendasi Visual: "{slide.image_keyword}"
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                } else {
                  // No image standard slide
                  return (
                    <div className="flex-1 flex flex-col justify-between space-y-4 md:space-y-6">
                      <div>
                        <h2 className="text-lg md:text-3xl font-bold font-serif text-emerald-300">
                          {slide.title}
                        </h2>
                        {slide.subtitle && (
                          <p className="text-xs text-slate-400 italic mt-1 font-sans">
                            {slide.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="space-y-4 pt-2">
                        {(slide.bullets || []).map((b: string, i: number) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                              {b}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
              })()}
                </motion.div>
              </AnimatePresence>

              {/* Slide Show Branding Footer */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80 pt-3">
                <span>Tekor AI Presentation Suite</span>
                <span className="font-mono bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800">
                  Slide {slideshowIndex + 1} dari {currentPresentingPres.slides.length}
                </span>
              </div>

            </div>

            {/* Right Stage Click Indicator */}
            <button
              onClick={() => {
                setSlideshowDirection(1);
                setSlideshowIndex((prev) => Math.min((currentPresentingPres.slides || []).length - 1, prev + 1));
              }}
              disabled={slideshowIndex === currentPresentingPres.slides.length - 1}
              className="absolute right-[-20px] md:right-[-50px] top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:border-emerald-500 disabled:opacity-20 disabled:hover:bg-slate-900/60 disabled:hover:text-inherit transition-all z-10 cursor-pointer text-lg font-bold"
            >
              →
            </button>

          </div>

          {/* Bottom Navigation & Indicator bar */}
          <div className="mt-6 flex flex-col items-center gap-4 max-w-2xl mx-auto w-full border-t border-slate-900 pt-4">
            
            {/* Interactive Progress Indicator Bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${((slideshowIndex + 1) / currentPresentingPres.slides.length) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSlideshowDirection(-1);
                  setSlideshowIndex((prev) => Math.max(0, prev - 1));
                }}
                disabled={slideshowIndex === 0}
                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer"
              >
                ← Sebelumnya
              </button>

              <div className="flex gap-1.5 max-w-[280px] sm:max-w-md overflow-x-auto px-2 py-1 scrollbar-thin">
                {currentPresentingPres.slides.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSlideshowDirection(idx > slideshowIndex ? 1 : -1);
                      setSlideshowIndex(idx);
                    }}
                    className={`w-7 h-7 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                      slideshowIndex === idx
                        ? "bg-emerald-600 text-white shadow-md border border-emerald-500"
                        : "bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-slate-200 border border-slate-850"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setSlideshowDirection(1);
                  setSlideshowIndex((prev) => Math.min((currentPresentingPres.slides || []).length - 1, prev + 1));
                }}
                disabled={slideshowIndex === currentPresentingPres.slides.length - 1}
                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer"
              >
                Selanjutnya →
              </button>
            </div>

            <p className="text-[10px] text-slate-500 font-sans tracking-wide">
              Gunakan tombol arah <kbd className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">←</kbd> dan <kbd className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">→</kbd> pada keyboard atau tekan <kbd className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Spasi</kbd> untuk berpindah halaman.
            </p>
          </div>

        </div>
      )}

      {/* --- IMMERSIVE INTERACTIVE E-BOOK READER PLAYER --- */}
      {selectedBookToRead && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-4 md:p-10 select-none animate-in fade-in duration-300">
          
          {/* Top Header Controls Bar */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4 md:mb-6">
            <div className="flex items-center gap-3">
              <span className="bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm">
                E-Book Reader
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-200 tracking-tight font-sans line-clamp-1">
                  {selectedBookToRead.judul}
                </h2>
                <p className="text-[10px] text-slate-400">
                  {selectedBookToRead.mapel} • Kelas {selectedBookToRead.kelas} • {(selectedBookToRead.bab || []).length} Bab Materi
                </p>
              </div>
            </div>

            {/* Mode Switcher if BOTH file and chapters exist */}
            {selectedBookToRead.fileData && selectedBookToRead.bab && selectedBookToRead.bab.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center gap-1">
                <button
                  onClick={() => setBookViewerMode("file")}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    bookViewerMode === "file" 
                      ? "bg-emerald-650 text-white shadow-md shadow-emerald-500/10" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span>📄</span>
                  <span>Berkas Asli</span>
                </button>
                <button
                  onClick={() => setBookViewerMode("text")}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    bookViewerMode === "text" 
                      ? "bg-emerald-650 text-white shadow-md shadow-emerald-500/10" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span>📝</span>
                  <span>Teks Bab</span>
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              {/* Toggle Sidebar (Daftar Bab) - Only show if in text mode or has chapters */}
              {selectedBookToRead.bab && selectedBookToRead.bab.length > 0 && bookViewerMode === "text" && (
                <button
                  onClick={() => setBookSidebarOpen(prev => !prev)}
                  className={`text-xs font-bold py-2 px-3.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                    bookSidebarOpen 
                      ? "bg-emerald-950/40 text-emerald-300 border-emerald-900/60" 
                      : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800"
                  }`}
                  title="Tampilkan Daftar Bab"
                >
                  <Menu className="w-4 h-4" />
                  <span className="hidden sm:inline">{bookSidebarOpen ? "Sembunyikan Bab" : "Tampilkan Bab"}</span>
                </button>
              )}

              {selectedBookToRead.fileData && (
                <a
                  href={selectedBookToRead.fileData}
                  download={selectedBookToRead.fileName || "Buku_Pelajaran"}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500/20 font-bold text-xs py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/10"
                  title="Unduh Berkas Asli"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Berkas</span>
                </a>
              )}

              <button
                onClick={() => setSelectedBookToRead(null)}
                className="bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-900/40 font-bold text-xs py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                title="Tutup E-Book (Esc)"
              >
                <X className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>

          {/* Immersive Center Stage Container with optional Sidebar */}
          <div className="flex-1 flex gap-6 max-w-7xl mx-auto w-full relative items-center justify-center px-4 md:px-8 py-2">
            
            {/* Left Sidebar Table of Contents (Chapter List) - Only if in text mode and has chapters */}
            {bookSidebarOpen && selectedBookToRead.bab && selectedBookToRead.bab.length > 0 && bookViewerMode === "text" && (
              <div className="w-64 bg-slate-900/50 border border-slate-800/80 rounded-3xl p-4 flex flex-col justify-between overflow-hidden animate-in slide-in-from-left duration-200 flex-shrink-0 self-stretch">
                <div className="flex-1 flex flex-col min-h-0">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-4 border-b border-slate-800 pb-2">
                    Daftar Isi Bab
                  </span>
                  
                  <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                    {selectedBookToRead.bab.map((ch, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setBookDirection(idx > selectedChapterIndex ? 1 : -1);
                          setSelectedChapterIndex(idx);
                        }}
                        className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition-all flex items-start gap-2.5 cursor-pointer border ${
                          selectedChapterIndex === idx
                            ? "bg-emerald-600/20 text-emerald-200 border-emerald-500 pl-3.5 shadow-lg shadow-emerald-500/5"
                            : "text-slate-400 border-transparent hover:bg-slate-800/40 hover:text-slate-200"
                        }`}
                      >
                        <span className={`font-mono px-1.5 py-0.5 rounded text-[9px] font-extrabold flex-shrink-0 ${
                          selectedChapterIndex === idx ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-500"
                        }`}>
                          {ch.nomor}
                        </span>
                        <span className="line-clamp-2 leading-relaxed">{ch.judul}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="pt-3 border-t border-slate-800 text-[9px] text-slate-500 font-medium">
                  E-Book Digital Madrasah
                </div>
              </div>
            )}

            {/* Book Frame Center Stage */}
            <div className="flex-1 flex items-center justify-center relative min-w-0 w-full">
              
              {/* Left Page Turn Button - Only in text mode */}
              {bookViewerMode === "text" && selectedBookToRead.bab && selectedBookToRead.bab.length > 0 && (
                <button
                  onClick={() => {
                    setBookDirection(-1);
                    setSelectedChapterIndex((prev) => Math.max(0, prev - 1));
                  }}
                  disabled={selectedChapterIndex === 0}
                  className="absolute left-[-15px] md:left-[-45px] top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:border-emerald-500 disabled:opacity-20 disabled:hover:bg-slate-900/60 disabled:hover:text-inherit transition-all z-10 cursor-pointer text-lg font-bold"
                >
                  ←
                </button>
              )}

              {/* Book Content Paper/Screen */}
              <div className="w-full bg-slate-900/40 border border-slate-800 rounded-3xl p-8 md:p-12 aspect-[16/9] min-h-[360px] md:min-h-[480px] flex flex-col justify-between relative overflow-hidden shadow-2xl">
                
                {/* Layout aesthetics matching pptx presentation stage */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500"></div>
                <div className="absolute right-[-60px] bottom-[-60px] w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>

                {/* Main Content Area */}
                {bookViewerMode === "file" && selectedBookToRead.fileData ? (
                  /* --- IMMERSIVE ORIGINAL FILE VIEWER --- */
                  <div className="flex-1 flex flex-col min-h-0 relative select-text">
                    {(() => {
                       const fileType = selectedBookToRead.fileType || "";
                       const fileName = selectedBookToRead.fileName || "";
                       const isPDF = fileType.includes("pdf") || fileName.toLowerCase().endsWith(".pdf");
                       const isImage = fileType.includes("image") || 
                                       fileName.toLowerCase().endsWith(".jpg") || 
                                       fileName.toLowerCase().endsWith(".jpeg") || 
                                       fileName.toLowerCase().endsWith(".png") || 
                                       fileName.toLowerCase().endsWith(".webp") || 
                                       fileName.toLowerCase().endsWith(".gif");
                       const isVideo = fileType.includes("video") || 
                                       fileName.toLowerCase().endsWith(".mp4") || 
                                       fileName.toLowerCase().endsWith(".webm") || 
                                       fileName.toLowerCase().endsWith(".ogg") || 
                                       fileName.toLowerCase().endsWith(".mov");
                       const isAudio = fileType.includes("audio") || 
                                       fileName.toLowerCase().endsWith(".mp3") || 
                                       fileName.toLowerCase().endsWith(".wav") || 
                                       fileName.toLowerCase().endsWith(".m4a");

                       if (isPDF) {
                         return (
                           <div className="w-full flex-1 min-h-0 flex flex-col bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
                             <iframe
                               src={selectedBookToRead.fileData}
                               className="w-full h-full border-none bg-white rounded-2xl"
                               title={selectedBookToRead.judul}
                             />
                           </div>
                         );
                       }

                       if (isImage) {
                         return (
                           <div className="w-full flex-1 min-h-0 flex items-center justify-center p-4 bg-slate-950/20 rounded-2xl overflow-auto border border-slate-800/50">
                             <img
                               src={selectedBookToRead.fileData}
                               className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-all duration-300"
                               alt={selectedBookToRead.judul}
                             />
                           </div>
                         );
                       }

                       if (isVideo) {
                         return (
                           <div className="w-full flex-1 min-h-0 flex items-center justify-center bg-black/40 border border-slate-800/50 rounded-2xl overflow-hidden p-2">
                             <video
                               controls
                               className="max-w-full max-h-full rounded-xl shadow-2xl border border-slate-800"
                               src={selectedBookToRead.fileData}
                             >
                               Browser Anda tidak mendukung pemutaran video secara langsung.
                             </video>
                           </div>
                         );
                       }

                       if (isAudio) {
                         return (
                           <div className="w-full flex-1 min-h-0 flex flex-col items-center justify-center p-8 bg-slate-900/60 border border-slate-800/50 rounded-2xl space-y-6">
                             <div className="w-24 h-24 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-4xl shadow-xl animate-pulse">
                               🎵
                             </div>
                             <div className="text-center max-w-sm">
                               <p className="font-extrabold text-sm text-slate-200 truncate">{selectedBookToRead.fileName || "Berkas Audio"}</p>
                               <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-extrabold">Audio Pembelajaran Madrasah</p>
                             </div>
                             <audio controls className="w-full max-w-md" src={selectedBookToRead.fileData} />
                           </div>
                         );
                       }

                       // Office document fallback (DOCX, PPTX, XLSX)
                       const isDocx = fileName.toLowerCase().endsWith(".docx");

                       if (isDocx) {
                         if (docxLoading) {
                           return (
                             <div className="w-full flex-1 min-h-0 flex flex-col items-center justify-center p-8 bg-slate-900/40 border border-slate-800/50 rounded-2xl space-y-4 shadow-2xl">
                               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
                               <span className="text-xs text-slate-400 font-bold tracking-wide">Membaca dan menerjemahkan dokumen Word...</span>
                             </div>
                           );
                         }

                         if (docxError) {
                           return (
                             <div className="w-full flex-1 min-h-0 flex flex-col items-center justify-center p-8 bg-slate-900/40 border border-slate-800/50 rounded-2xl space-y-4">
                               <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 text-2xl">
                                 ⚠️
                               </div>
                               <div className="text-center max-w-sm">
                                 <p className="font-extrabold text-sm text-slate-200">{docxError}</p>
                                 <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">Anda tetap dapat mengunduh berkas aslinya menggunakan tombol unduh di kanan atas.</p>
                               </div>
                             </div>
                           );
                         }

                         return (
                           <div className="w-full flex-1 min-h-0 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl">
                             <div className="flex-shrink-0 bg-slate-50 border-b border-slate-200 px-5 py-3 flex justify-between items-center select-none">
                               <div className="flex items-center gap-2">
                                 <span className="text-base">📝</span>
                                 <span className="font-extrabold text-[10px] text-slate-700 font-sans tracking-wide uppercase">Word Document Viewer</span>
                               </div>
                               <span className="text-[10px] font-extrabold text-slate-400 font-mono">Format .docx</span>
                             </div>
                             <div className="flex-1 overflow-y-auto p-6 md:p-10 text-slate-800 select-text bg-white scrollbar-thin scroll-smooth docx-content">
                               {docxHtml ? (
                                 <div dangerouslySetInnerHTML={{ __html: docxHtml }} />
                               ) : (
                                 <div className="text-center py-10 text-slate-400 text-xs italic">
                                   Dokumen kosong atau tidak berisi teks.
                                 </div>
                               )}
                             </div>
                           </div>
                         );
                       }

                       return (
                         <div className="w-full flex-1 min-h-0 flex flex-col items-center justify-center p-6 md:p-10 bg-slate-900/40 border border-slate-800/50 rounded-2xl space-y-4">
                           <div className="w-20 h-20 rounded-2xl bg-slate-850 border border-slate-800 flex items-center justify-center text-4xl shadow-xl">
                             {fileName.toLowerCase().endsWith(".pptx") || fileName.toLowerCase().endsWith(".ppt") ? "📊" : 
                              fileName.toLowerCase().endsWith(".xlsx") || fileName.toLowerCase().endsWith(".xls") ? "📈" : "📝"}
                           </div>
                           <div className="text-center max-w-md">
                             <h4 className="font-black text-sm text-slate-200 truncate">{fileName || "Dokumen Pelajaran"}</h4>
                             <p className="text-[10px] text-slate-500 mt-1">
                               Format: {fileType || "Dokumen Kantor (.pptx/.xlsx)"}
                             </p>
                           </div>
                           <div className="max-w-sm text-center text-[10px] text-slate-400 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
                             Berkas dokumen ini tidak dapat ditampilkan secara langsung di peramban. Silakan klik tombol unduh di kanan atas untuk mengunduh dan membuka berkas asli di perangkat Anda secara aman.
                           </div>
                         </div>
                       );
                    })()}
                  </div>
                ) : (
                  /* --- INTERACTIVE TEXT SLIDESHOW --- */
                  selectedBookToRead.bab && selectedBookToRead.bab.length > 0 ? (
                    <AnimatePresence mode="wait" custom={bookDirection}>
                      <motion.div
                        key={selectedChapterIndex}
                        custom={bookDirection}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex-1 flex flex-col justify-between overflow-hidden"
                      >
                        <div className="flex-1 flex flex-col min-h-0 select-text">
                          {/* Chapter Title Badge and Title */}
                          <div className="border-b border-slate-800/80 pb-3 mb-4 md:mb-6 flex-shrink-0">
                            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider border border-emerald-500/20">
                              Bab {(selectedBookToRead.bab || [])[selectedChapterIndex]?.nomor}
                            </span>
                            <h3 className="text-lg md:text-2xl font-black text-emerald-200 font-serif tracking-tight mt-2.5">
                              {(selectedBookToRead.bab || [])[selectedChapterIndex]?.judul}
                            </h3>
                          </div>

                          {/* Main Scrollable Chapter Content */}
                          <div className="flex-1 overflow-y-auto pr-2 text-slate-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-sans scrollbar-thin scroll-smooth font-medium">
                            {(selectedBookToRead.bab || [])[selectedChapterIndex]?.konten}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                      <span className="text-4xl mb-3">📝</span>
                      <p className="text-slate-400 text-xs italic">Buku ini belum memiliki naskah teks bab.</p>
                      {selectedBookToRead.fileData && (
                        <button
                          onClick={() => setBookViewerMode("file")}
                          className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer shadow-md transition-all"
                        >
                          Buka Tampilan Berkas Asli
                        </button>
                      )}
                    </div>
                  )
                )}

                {/* Book Branding Footer */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80 pt-3 mt-4 flex-shrink-0 select-none">
                  <span>MTs Ma'arif NU Sawojajar • Kelas {selectedBookToRead.kelas}</span>
                  {bookViewerMode === "text" && selectedBookToRead.bab && selectedBookToRead.bab.length > 0 && (
                    <span className="font-mono bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800">
                      Bab {selectedChapterIndex + 1} dari {selectedBookToRead.bab.length}
                    </span>
                  )}
                  {bookViewerMode === "file" && selectedBookToRead.fileName && (
                    <span className="font-mono bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800 truncate max-w-[150px]">
                      {selectedBookToRead.fileName}
                    </span>
                  )}
                </div>

              </div>

              {/* Right Page Turn Button - Only in text mode */}
              {bookViewerMode === "text" && selectedBookToRead.bab && selectedBookToRead.bab.length > 0 && (
                <button
                  onClick={() => {
                    setBookDirection(1);
                    setSelectedChapterIndex((prev) => Math.min((selectedBookToRead.bab || []).length - 1, prev + 1));
                  }}
                  disabled={selectedChapterIndex === selectedBookToRead.bab.length - 1}
                  className="absolute right-[-15px] md:right-[-45px] top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:border-emerald-500 disabled:opacity-20 disabled:hover:bg-slate-900/60 disabled:hover:text-inherit transition-all z-10 cursor-pointer text-lg font-bold"
                >
                  →
                </button>
              )}

            </div>

          </div>

          {/* Bottom Progress and Navigation indicator */}
          {bookViewerMode === "text" && selectedBookToRead.bab && selectedBookToRead.bab.length > 0 ? (
            <div className="mt-4 md:mt-6 flex flex-col items-center gap-4 max-w-2xl mx-auto w-full border-t border-slate-900 pt-4 flex-shrink-0 select-none">
              
              {/* Interactive Progress Indicator Bar */}
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${((selectedChapterIndex + 1) / selectedBookToRead.bab.length) * 100}%` }}
                ></div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setBookDirection(-1);
                    setSelectedChapterIndex((prev) => Math.max(0, prev - 1));
                  }}
                  disabled={selectedChapterIndex === 0}
                  className="bg-slate-900 hover:bg-slate-850 disabled:opacity-40 text-slate-300 font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer animate-in duration-300"
                >
                  ← Sebelumnya
                </button>

                <div className="flex gap-1.5 max-w-[140px] sm:max-w-md overflow-x-auto px-2 py-1 scrollbar-thin">
                  {selectedBookToRead.bab.map((_: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setBookDirection(idx > selectedChapterIndex ? 1 : -1);
                        setSelectedChapterIndex(idx);
                      }}
                      className={`w-7 h-7 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                        selectedChapterIndex === idx
                          ? "bg-emerald-600 text-white shadow-md border border-emerald-500"
                          : "bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-slate-200 border border-slate-850"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setBookDirection(1);
                    setSelectedChapterIndex((prev) => Math.min((selectedBookToRead.bab || []).length - 1, prev + 1));
                  }}
                  disabled={selectedChapterIndex === selectedBookToRead.bab.length - 1}
                  className="bg-slate-900 hover:bg-slate-850 disabled:opacity-40 text-slate-300 font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer animate-in duration-300"
                >
                  Selanjutnya →
                </button>
              </div>

              <p className="text-[10px] text-slate-500 font-sans tracking-wide text-center">
                Gunakan tombol arah <kbd className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">←</kbd> dan <kbd className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">→</kbd> pada keyboard atau tekan <kbd className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Spasi</kbd> untuk berpindah bab.
              </p>
            </div>
          ) : (
            selectedBookToRead.fileData && (
              <div className="mt-4 md:mt-6 flex flex-col items-center gap-2 max-w-2xl mx-auto w-full border-t border-slate-900 pt-4 flex-shrink-0 select-none">
                <p className="text-[10px] text-slate-500 font-sans tracking-wide text-center">
                  Menampilkan Berkas Digital Pembelajaran. Gunakan menu navigasi di atas untuk kembali atau mengunduh berkas asli.
                </p>
              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}
