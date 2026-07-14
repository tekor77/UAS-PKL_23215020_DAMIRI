-- Schema Database MySQL untuk Smart Teacher - MTs Ma'arif NU 7 Sawojajar
-- SQL Dump untuk memudahkan impor langsung ke phpMyAdmin atau MySQL Server

CREATE DATABASE IF NOT EXISTS smart_teacher;
USE smart_teacher;

-- 1. Tabel Guru
CREATE TABLE IF NOT EXISTS guru (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    nama VARCHAR(255) NOT NULL,
    nuptk VARCHAR(50) UNIQUE,
    mapel VARCHAR(100) NOT NULL,
    foto VARCHAR(255),
    kelas_diajar TEXT NOT NULL, -- Format JSON: ["7A", "7B"]
    password VARCHAR(255) DEFAULT '123',
    no_hp VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel Siswa
CREATE TABLE IF NOT EXISTS siswa (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    nama VARCHAR(255) NOT NULL,
    kelas VARCHAR(10) NOT NULL, -- e.g., "7A", "7B", "8A", "8B", etc.
    alamat TEXT,
    cita_cita VARCHAR(255),
    moto_hidup TEXT,
    foto VARCHAR(255),
    password VARCHAR(255) DEFAULT '123',
    no_hp VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel Buku
CREATE TABLE IF NOT EXISTS buku (
    id VARCHAR(50) PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    mapel VARCHAR(100) NOT NULL,
    kelas VARCHAR(10) NOT NULL, -- "7", "8", "9"
    file_name VARCHAR(255),
    file_type VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabel Bab (Materi Buku)
CREATE TABLE IF NOT EXISTS bab (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buku_id VARCHAR(50) NOT NULL,
    nomor INT NOT NULL,
    judul VARCHAR(255) NOT NULL,
    konten LONGTEXT NOT NULL,
    FOREIGN KEY (buku_id) REFERENCES buku(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabel Tugas
CREATE TABLE IF NOT EXISTS tugas (
    id VARCHAR(50) PRIMARY KEY,
    kelas VARCHAR(10) NOT NULL,
    mapel VARCHAR(100) NOT NULL,
    semester VARCHAR(5) NOT NULL,
    bab VARCHAR(255) NOT NULL,
    jumlah_soal INT NOT NULL DEFAULT 5,
    waktu INT NOT NULL DEFAULT 15, -- Dalam menit
    dibuat_tanggal DATETIME NOT NULL,
    deadline_tanggal DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabel Soal Pilihan Ganda (Menempel ke Tugas)
CREATE TABLE IF NOT EXISTS soal (
    id VARCHAR(50) PRIMARY KEY,
    tugas_id VARCHAR(50) NOT NULL,
    pertanyaan TEXT NOT NULL,
    opsi_a VARCHAR(255) NOT NULL,
    opsi_b VARCHAR(255) NOT NULL,
    opsi_c VARCHAR(255) NOT NULL,
    opsi_d VARCHAR(255) NOT NULL,
    jawaban_benar CHAR(1) NOT NULL, -- 'A', 'B', 'C', atau 'D'
    FOREIGN KEY (tugas_id) REFERENCES tugas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabel Jawaban Siswa (Submisi Kuis)
CREATE TABLE IF NOT EXISTS jawaban_siswa (
    id VARCHAR(50) PRIMARY KEY,
    tugas_id VARCHAR(50) NOT NULL,
    siswa_id VARCHAR(50) NOT NULL,
    nama_siswa VARCHAR(255) NOT NULL,
    kelas VARCHAR(10) NOT NULL,
    nilai INT NOT NULL,
    jawaban LONGTEXT NOT NULL, -- Format JSON: {"q1":"A", "q2":"B"}
    tanggal_selesai DATETIME NOT NULL,
    waktu_pengerjaan_detik INT NOT NULL,
    FOREIGN KEY (tugas_id) REFERENCES tugas(id) ON DELETE CASCADE,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Tabel Notifikasi
CREATE TABLE IF NOT EXISTS notifikasi (
    id VARCHAR(50) PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    kelas VARCHAR(10) NOT NULL, -- "all", "7A", etc.
    tanggal DATETIME NOT NULL,
    tipe VARCHAR(50) NOT NULL DEFAULT 'info', -- 'tugas', 'info', 'warning', 'success'
    link_tugas_id VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Tabel TKA Tasks (Tugas Keagamaan & Akademik Amaliah)
CREATE TABLE IF NOT EXISTS tka_tasks (
    id VARCHAR(50) PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    kelas VARCHAR(10) NOT NULL,
    deadline_tanggal DATE NOT NULL,
    items LONGTEXT NOT NULL, -- Format JSON: ["Sholat Dhuha","Muroja'ah"]
    created_tanggal DATETIME NOT NULL,
    bidang_uji VARCHAR(100), -- "Matematika", "IPA", dll
    sistem_penilaian VARCHAR(50) DEFAULT 'Poin Klasik', -- "IRT" atau "Poin Klasik"
    kkm INT DEFAULT 70
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Tabel Soal TKA (IRT / Khusus)
CREATE TABLE IF NOT EXISTS soal_tka (
    id VARCHAR(50) PRIMARY KEY,
    tka_task_id VARCHAR(50) NOT NULL,
    pertanyaan TEXT NOT NULL,
    pilihan LONGTEXT NOT NULL, -- Format JSON: {"A":"X","B":"Y"}
    jawaban_benar VARCHAR(255) NOT NULL,
    tipe VARCHAR(50) NOT NULL, -- "Pilihan Ganda", "Pilihan Ganda Kompleks", dll
    level VARCHAR(50) NOT NULL, -- "Level 1", "Level 2", "Level 3"
    bobot_irt FLOAT DEFAULT 1.0,
    FOREIGN KEY (tka_task_id) REFERENCES tka_tasks(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Tabel Submisi TKA Siswa
CREATE TABLE IF NOT EXISTS tka_submissions (
    id VARCHAR(50) PRIMARY KEY,
    tka_task_id VARCHAR(50) NOT NULL,
    tka_task_judul VARCHAR(255) NOT NULL,
    siswa_id VARCHAR(50) NOT NULL,
    nama_siswa VARCHAR(255) NOT NULL,
    kelas_siswa VARCHAR(10) NOT NULL,
    jawaban_checklist LONGTEXT, -- Format JSON
    catatan_amaliah TEXT,
    tanggal_submisi DATETIME NOT NULL,
    status VARCHAR(50) DEFAULT 'Belum Dinilai', -- 'Belum Dinilai', 'Sudah Dinilai'
    nilai INT DEFAULT 0,
    catatan_guru TEXT,
    dinilai_oleh VARCHAR(100),
    jawaban_tka LONGTEXT, -- Format JSON: {"sq1":"A"}
    score_breakdown LONGTEXT, -- Format JSON
    sistem_penilaian_used VARCHAR(50),
    bidang_uji_used VARCHAR(100),
    FOREIGN KEY (tka_task_id) REFERENCES tka_tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Tabel Presentasi AI
CREATE TABLE IF NOT EXISTS presentasi (
    id VARCHAR(50) PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    tema VARCHAR(100) NOT NULL,
    mapel VARCHAR(100) NOT NULL,
    kelas VARCHAR(10) NOT NULL,
    bab VARCHAR(100) NOT NULL,
    slides LONGTEXT NOT NULL, -- Long JSON string containing presentation slides
    dibuat_tanggal DATETIME NOT NULL,
    guru_id VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==================== DATA SEED AWAL (MATCHING MTs MA'ARIF NU 7) ====================

-- Seed Data Guru
INSERT INTO guru (id, username, nama, nuptk, mapel, foto, kelas_diajar, password, no_hp) VALUES
('g1', 'anisa', 'Ibu Anisa Rahmawati, S.Pd.I', '198503122010122003', 'Fiqih', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60', '["7A", "7B", "7C"]', '123', '085123456781'),
('g2', 'syarif', 'Bapak Drs. KH. Ahmad Syarifuddin', '197204151998031002', 'Al-Qur\'an Hadits', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=60', '["7A", "8A", "8B"]', '123', '085123456782'),
('g3', 'mansur', 'Bapak Muhammad Mansur, M.Pd', '198911022015041001', 'Bahasa Arab', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60', '["9A", "9B", "9C", "9D"]', '123', '085123456783');

-- Seed Data Siswa
INSERT INTO siswa (id, username, nama, kelas, alamat, cita_cita, moto_hidup, foto, password, no_hp) VALUES
('s1', 'ahmad', 'Ahmad Fauzi', '7A', 'Jl. Kyai Haji Wahid Hasyim No. 12, Sawojajar, Wanasari, Brebes', 'Guru Agama dan Ahli IT', 'Belajar tiada henti, berbakti kepada orang tua dan guru.', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=60', '123', '085987654321'),
('s2', 'siti', 'Siti Fatimah', '7B', 'RT 03/RW 02, Desa Sawojajar, Kec. Wanasari, Brebes', 'Dokter Spesialis', 'Khoirunnas anfauhum linnas (Sebaik-baik manusia adalah yang paling bermanfaat).', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60', '123', '085987654322'),
('s3', 'yusuf', 'Muhammad Yusuf', '8A', 'Gg. Madrasah, Sawojajar, Brebes', 'Pengusaha Sukses', 'Man jadda wajada (Siapa yang bersungguh-sungguh akan berhasil).', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60', '123', '085987654323'),
('s4', 'laila', 'Lailatul Fitriyah', '8B', 'Jl. Diponegoro No. 45, Wanasari, Brebes', 'Dosen Sastra Arab', 'Adab dulu baru ilmu, sukses dunia akhirat.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60', '123', '085987654324'),
('s5', 'rizky', 'Rizky Aditya', '9A', 'Mulyasari, Sawojajar, Brebes', 'Insinyur Sipil', 'Disiplin adalah kunci utama menuju gerbang kesuksesan.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60', '123', '085987654325'),
('s6', 'nur', 'Nur Halimah', '9B', 'Blok Masjid Jami, Sawojajar, Brebes', 'Penulis dan Hafizah', 'Dengan Al-Qur\'an hidup menjadi berkah dan terarah.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60', '123', '085987654326');

-- Seed Data Buku
INSERT INTO buku (id, judul, mapel, kelas, file_name, file_type) VALUES
('b1', 'Fiqih Madrasah Tsanawiyah Kelas VII', 'Fiqih', '7A', 'fiqih_v7.docx', 'docx'),
('b2', 'Al-Qur\'an Hadits MTs Kelas VIII', 'Al-Qur\'an Hadits', '8A', 'quran_hadits_v8.docx', 'docx'),
('b3', 'Bahasa Arab Kelas IX MTs', 'Bahasa Arab', '9A', 'b_arab_v9.docx', 'docx');

-- Seed Data Bab
INSERT INTO bab (buku_id, nomor, judul, konten) VALUES
('b1', 1, 'Al-Taharah (Ketentuan Bersuci dari Najis dan Hadas)', 'Bersuci (Taharah) merupakan kunci ibadah shalat. Najis terbagi menjadi tiga: Mukhaffafah (ringan, seperti air seni bayi laki-laki yang hanya minum ASI), Mutawassitah (sedang, seperti darah, nanah, tinja), dan Mugallazah (berat, seperti air liur anjing/babi). Pembasihan najis Mukhaffafah cukup memercikkan air, Mutawassitah harus membasuh hingga hilang rasa, bau, dan warna, sedangkan Mugallazah dibasuh 7 kali dan salah satunya menggunakan tanah.'),
('b1', 2, 'Ketentuan Shalat Fardhu Lima Waktu', 'Shalat fardhu lima waktu hukumnya fardhu \'ain bagi setiap Muslim yang baligh dan berakal. Syarat wajib shalat meliputi beragama Islam, baligh, dan berakal sehat. Syarat sah shalat meliputi suci dari hadas besar/kecil, menutup aurat, menghadap kiblat, dan masuk waktu shalat. Rukun shalat meliputi Niat, Berdiri bagi yang mampu, Takbiratul Ihram, Membaca Al-Fatihah, Ruku\' dengan tuma\'ninah, I\'tidal, Sujud dua kali, Duduk di antara dua sujud, Duduk Tasyahud Akhir, Membaca Shalawat Nabi, dan Salam.'),
('b2', 1, 'Kuhindari Makanan Haram demi Keberkahan Hidup', 'Allah SWT memerintahkan umat Islam untuk memakan makanan yang halal lagi baik (halalan tayyiban). Halal zatnya berarti makanan tersebut bukan makanan yang diharamkan seperti babi, darah, bangkai. Halal cara memperolehnya berarti bukan dari mencuri, korupsi, atau menipu. Makanan haram merusak kesehatan lahiriah, mengotori batin, dan menghalangi terkabulnya doa.'),
('b3', 1, 'Rasulullah SAW Hijrah ke Madinah (Rasul\'s Migration)', 'Peristiwa Hijrah Nabi Muhammad SAW dari Makkah ke Madinah merupakan tonggak sejarah besar dalam Islam. Penduduk Madinah (Ansar) menyambut hangat kaum Muhajirin dengan penuh persaudaraan. Kosakata penting: Hijrah (הجرة), Sahabat (الصحابة), Madinah Al-Munawwarah (المدينة المنورة), Kaum Anshar (الأنصار), Kaum Muhajirin (المهاجرon).');

-- Seed Data Tugas
INSERT INTO tugas (id, kelas, mapel, semester, bab, jumlah_soal, waktu, dibuat_tanggal, deadline_tanggal) VALUES
('t1', '7A', 'Fiqih', '1', 'Bab 1: Al-Taharah (Ketentuan Bersuci dari Najis dan Hadas)', 3, 15, '2026-07-01 08:00:00', '2026-07-20'),
('t2', '8A', 'Al-Qur\'an Hadits', '1', 'Bab 1: Kuhindari Makanan Haram demi Keberkahan Hidup', 2, 10, '2026-07-02 09:00:00', '2026-07-25');

-- Seed Data Soal
INSERT INTO soal (id, tugas_id, pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, jawaban_benar) VALUES
('q1', 't1', 'Najis yang digolongkan sebagai najis berat dalam ajaran Fiqih disebut najis...', 'Mukhaffafah', 'Mutawassitah', 'Mugallazah', 'Ainiyah', 'C'),
('q2', 't1', 'Bagaimanakah cara mensucikan benda yang terkena najis Mukhaffafah (ringan)?', 'Membasuhnya sebanyak tujuh kali dengan tanah', 'Memercikkan air bersih ke bagian yang terkena najis', 'Mencucinya sampai hilang bau, rasa, dan warnanya', 'Merendam benda tersebut di air mengalir seharian', 'B'),
('q3', 't1', 'Darah, nanah, dan kotoran manusia tergolong ke dalam najis jenis...', 'Mugallazah', 'Mukhaffafah', 'Mutawassitah', 'Hukmiyah', 'C'),
('t2-q1', 't2', 'Berikut adalah salah satu dampak negatif dari mengonsumsi makanan yang haram, yaitu...', 'Tubuh menjadi semakin sehat dan kuat', 'Mendapatkan pahala yang melimpah', 'Terhalangnya terkabulnya doa oleh Allah SWT', 'Meningkatkan kecerdasan otak', 'C'),
('t2-q2', 't2', 'Istilah untuk makanan yang diperbolehkan dikonsumsi serta menyehatkan tubuh dalam Islam adalah...', 'Halalan Thayyiban', 'Halalan Mutlaqan', 'Haram lighairihi', 'Makruh tahrim', 'A');

-- Seed Data Jawaban Siswa
INSERT INTO jawaban_siswa (id, tugas_id, siswa_id, nama_siswa, kelas, nilai, jawaban, tanggal_selesai, waktu_pengerjaan_detik) VALUES
('j1', 't1', 's1', 'Ahmad Fauzi', '7A', 100, '{"q1":"C", "q2":"B", "q3":"C"}', '2026-07-02 10:15:00', 245),
('j2', 't1', 's2', 'Siti Fatimah', '7B', 67, '{"q1":"C", "q2":"C", "q3":"C"}', '2026-07-03 11:20:00', 320);

-- Seed Data Notifikasi
INSERT INTO notifikasi (id, judul, deskripsi, kelas, tanggal, tipe, link_tugas_id) VALUES
('n1', 'Tugas Baru: Al-Taharah', 'Tugas Baru Fiqih kelas 7A bab Ketentuan Bersuci telah dirilis oleh Ibu Anisa Rahmawati.', '7A', '2026-07-01 08:00:00', 'tugas', 't1'),
('n2', 'Tenggat Waktu Tugas!', 'Pengingat: Tugas Al-Qur\'an Hadits kelas 8A bab Makanan Haram akan segera berakhir.', '8A', '2026-07-03 12:00:00', 'warning', 't2');
