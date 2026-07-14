-- Schema Database MySQL untuk SmartTeacher (Tekor AI)

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- 1. Tabel Siswa
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `siswa` (
  `id` VARCHAR(50) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `nama` VARCHAR(100) NOT NULL,
  `kelas` VARCHAR(10) NOT NULL,
  `alamat` TEXT,
  `citaCita` VARCHAR(255),
  `motoHidup` VARCHAR(255),
  `foto` TEXT,
  `password` VARCHAR(50) NOT NULL DEFAULT '123',
  `noHp` VARCHAR(20),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 2. Tabel Guru
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `guru` (
  `id` VARCHAR(50) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `nama` VARCHAR(100) NOT NULL,
  `nuptk` VARCHAR(50),
  `mapel` VARCHAR(50) NOT NULL,
  `foto` TEXT,
  `kelasDiajar` TEXT, -- Disimpan sebagai JSON array (misal: ["7A", "7B"])
  `password` VARCHAR(50) NOT NULL DEFAULT '123',
  `noHp` VARCHAR(20),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 3. Tabel Buku Pelajaran & Bab Materi
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `buku` (
  `id` VARCHAR(50) NOT NULL,
  `judul` VARCHAR(150) NOT NULL,
  `mapel` VARCHAR(50) NOT NULL,
  `kelas` VARCHAR(10) NOT NULL,
  `bab` LONGTEXT, -- Disimpan sebagai JSON array dari bab-bab materi
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 4. Tabel Tugas Harian
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tugas` (
  `id` VARCHAR(50) NOT NULL,
  `kelas` VARCHAR(10) NOT NULL,
  `mapel` VARCHAR(50) NOT NULL,
  `semester` VARCHAR(10) NOT NULL,
  `bab` VARCHAR(150) NOT NULL,
  `jumlahSoal` INT NOT NULL DEFAULT 0,
  `waktu` INT NOT NULL DEFAULT 15,
  `soal` LONGTEXT, -- Disimpan sebagai JSON array objek soal
  `dibuatTanggal` VARCHAR(50),
  `deadlineTanggal` VARCHAR(50),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 5. Tabel Jawaban Siswa
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `jawaban_siswa` (
  `id` VARCHAR(50) NOT NULL,
  `tugasId` VARCHAR(50) NOT NULL,
  `siswaId` VARCHAR(50) NOT NULL,
  `namaSiswa` VARCHAR(100) NOT NULL,
  `kelas` VARCHAR(10) NOT NULL,
  `nilai` INT NOT NULL DEFAULT 0,
  `jawaban` LONGTEXT, -- Disimpan sebagai JSON objek jawaban per soal
  `tanggalSelesai` VARCHAR(50),
  `waktuPengerjaanDetik` INT DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX (`tugasId`),
  INDEX (`siswaId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 6. Tabel Notifikasi Pengumuman
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `notifikasi` (
  `id` VARCHAR(50) NOT NULL,
  `judul` VARCHAR(150) NOT NULL,
  `deskripsi` TEXT,
  `kelas` VARCHAR(10),
  `tanggal` VARCHAR(50),
  `tipe` VARCHAR(20) DEFAULT 'info',
  `linkTugasId` VARCHAR(50),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 7. Tabel Presentasi Slide Ajar (PPTX Generator Cache)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `presentasi` (
  `id` VARCHAR(50) NOT NULL,
  `judul` VARCHAR(150) NOT NULL,
  `mapel` VARCHAR(50) NOT NULL,
  `kelas` VARCHAR(10) NOT NULL,
  `bab` VARCHAR(150),
  `tema` VARCHAR(150),
  `slides` LONGTEXT, -- Disimpan sebagai JSON array objek slide materi
  `dibuatTanggal` VARCHAR(50),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 8. Tabel TKA Tasks (Tugas Khusus Akademik / Pertanyaan AI)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tka_tasks` (
  `id` VARCHAR(50) NOT NULL,
  `bookId` VARCHAR(50),
  `chapterNum` INT,
  `theme` VARCHAR(255),
  `totalQuestions` INT,
  `durationMinutes` INT,
  `questions` LONGTEXT, -- Disimpan sebagai JSON array objek soal TKA
  `createdAt` VARCHAR(50),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 9. Tabel TKA Submissions (Jawaban Tugas AI)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tka_submissions` (
  `id` VARCHAR(50) NOT NULL,
  `taskId` VARCHAR(50) NOT NULL,
  `siswaId` VARCHAR(50) NOT NULL,
  `siswaName` VARCHAR(100),
  `kelas` VARCHAR(10),
  `answers` LONGTEXT, -- Disimpan sebagai JSON objek jawaban siswa
  `score` FLOAT,
  `aiFeedback` LONGTEXT, -- Disimpan sebagai JSON objek analisa evaluasi AI
  `createdAt` VARCHAR(50),
  PRIMARY KEY (`id`),
  INDEX (`taskId`),
  INDEX (`siswaId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- --------------------------------------------------------
-- DATA SHEET AWAL (SEED DATA)
-- --------------------------------------------------------

INSERT IGNORE INTO `siswa` (`id`, `username`, `nama`, `kelas`, `alamat`, `citaCita`, `motoHidup`, `foto`, `password`, `noHp`) VALUES
('s1', 'ahmad', 'Ahmad Fauzi', '7A', 'Jl. Kyai Haji Wahid Hasyim No. 12, Sawojajar, Wanasari, Brebes', 'Guru Agama dan Ahli IT', 'Belajar tiada henti, berbakti kepada orang tua dan guru.', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=60', '123', '085987654321'),
('s2', 'siti', 'Siti Fatimah', '7B', 'RT 03/RW 02, Desa Sawojajar, Kec. Wanasari, Brebes', 'Dokter Spesialis', 'Khoirunnas anfauhum linnas (Sebaik-baik manusia adalah yang paling bermanfaat).', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60', '123', '085987654322'),
('s3', 'yusuf', 'Muhammad Yusuf', '8A', 'Gg. Madrasah, Sawojajar, Brebes', 'Pengusaha Sukses', 'Man jadda wajada (Siapa yang bersungguh-sungguh akan berhasil).', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60', '123', '085987654323');

INSERT IGNORE INTO `guru` (`id`, `username`, `nama`, `nuptk`, `mapel`, `foto`, `kelasDiajar`, `password`, `noHp`) VALUES
('g1', 'anisa', 'Ibu Anisa Rahmawati, S.Pd.I', '198503122010122003', 'Fiqih', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60', '[\"7A\", \"7B\", \"7C\"]', '123', '085123456781'),
('g2', 'syarif', 'Bapak Drs. KH. Ahmad Syarifuddin', '197204151998031002', 'Al-Qur\'an Hadits', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=60', '[\"7A\", \"8A\", \"8B\"]', '123', '085123456782');

INSERT IGNORE INTO `buku` (`id`, `judul`, `mapel`, `kelas`, `bab`) VALUES
('b1', 'Fiqih Madrasah Tsanawiyah Kelas VII', 'Fiqih', '7A', '[{\"nomor\":1,\"judul\":\"Al-Taharah (Ketentuan Bersuci dari Najis dan Hadas)\",\"konten\":\"Bersuci (Taharah) merupakan kunci ibadah shalat. Najis terbagi menjadi tiga: Mukhaffafah (ringan, seperti air seni bayi laki-laki yang hanya minum ASI), Mutawassitah (sedang, seperti darah, nanah, tinja), dan Mugallazah (berat, seperti air liur anjing/babi). Pembasihan najis Mukhaffafah cukup memercikkan air, Mutawassitah harus membasuh hingga hilang rasa, bau, dan warna, sedangkan Mugallazah dibasuh 7 kali dan salah satunya menggunakan tanah.\"},{\"nomor\":2,\"judul\":\"Ketentuan Shalat Fardhu Lima Waktu\",\"konten\":\"Shalat fardhu lima waktu hukumnya fardhu \'ain bagi setiap Muslim yang baligh dan berakal. Syarat wajib shalat meliputi beragama Islam, baligh, dan berakal sehat. Syarat sah shalat meliputi suci dari hadas besar/kecil, menutup aurat, menghadap kiblat, dan masuk waktu shalat. Rukun shalat meliputi Niat, Berdiri bagi yang mampu, Takbiratul Ihram, Membaca Al-Fatihah, Ruku\' dengan tuma\'ninah, I\'tidal, Sujud dua kali, Duduk di antara dua sujud, Duduk Tasyahud Akhir, Membaca Shalawat Nabi, dan Salam.\"}]');

INSERT IGNORE INTO `notifikasi` (`id`, `judul`, `deskripsi`, `kelas`, `tanggal`, `tipe`, `linkTugasId`) VALUES
('n1', 'Tugas Baru: Al-Taharah', 'Tugas Baru Fiqih kelas 7A bab Ketentuan Bersuci telah dirilis oleh Ibu Anisa Rahmawati.', '7A', '2026-07-01T08:00:00Z', 'tugas', 't1');

SET FOREIGN_KEY_CHECKS = 1;
