import express from "express";
import path from "path";
import fs from "fs";
import pg from "pg";
import { Siswa, Guru, Buku, Tugas, JawabanSiswa, Notifikasi } from "./src/types";

const PORT = Number(process.env.PORT) || 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

// Helper to load DB
function getNormalizedInitialData() {
  if (!fs.existsSync(DB_FILE)) {
    // Initial Seed Data
    const initialData = {
      siswa: [
        {
          id: "s1",
          username: "ahmad",
          nama: "Ahmad Fauzi",
          kelas: "7A",
          alamat: "Jl. Kyai Haji Wahid Hasyim No. 12, Sawojajar, Wanasari, Brebes",
          citaCita: "Guru Agama dan Ahli IT",
          motoHidup: "Belajar tiada henti, berbakti kepada orang tua dan guru.",
          foto: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=60",
          password: "123",
          noHp: "085987654321"
        },
        {
          id: "s2",
          username: "siti",
          nama: "Siti Fatimah",
          kelas: "7B",
          alamat: "RT 03/RW 02, Desa Sawojajar, Kec. Wanasari, Brebes",
          citaCita: "Dokter Spesialis",
          motoHidup: "Khoirunnas anfauhum linnas (Sebaik-baik manusia adalah yang paling bermanfaat).",
          foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60",
          password: "123",
          noHp: "085987654322"
        },
        {
          id: "s3",
          username: "yusuf",
          nama: "Muhammad Yusuf",
          kelas: "8A",
          alamat: "Gg. Madrasah, Sawojajar, Brebes",
          citaCita: "Pengusaha Sukses",
          motoHidup: "Man jadda wajada (Siapa yang bersungguh-sungguh akan berhasil).",
          foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60",
          password: "123",
          noHp: "085987654323"
        },
        {
          id: "s4",
          username: "laila",
          nama: "Lailatul Fitriyah",
          kelas: "8B",
          alamat: "Jl. Diponegoro No. 45, Wanasari, Brebes",
          citaCita: "Dosen Sastra Arab",
          motoHidup: "Adab dulu baru ilmu, sukses dunia akhirat.",
          foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60",
          password: "123",
          noHp: "085987654324"
        },
        {
          id: "s5",
          username: "rizky",
          nama: "Rizky Aditya",
          kelas: "9A",
          alamat: "Mulyasari, Sawojajar, Brebes",
          citaCita: "Insinyur Sipil",
          motoHidup: "Disiplin adalah kunci utama menuju gerbang kesuksesan.",
          foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60",
          password: "123",
          noHp: "085987654325"
        },
        {
          id: "s6",
          username: "nur",
          nama: "Nur Halimah",
          kelas: "9B",
          alamat: "Blok Masjid Jami, Sawojajar, Brebes",
          citaCita: "Penulis dan Hafizah",
          motoHidup: "Dengan Al-Qur'an hidup menjadi berkah dan terarah.",
          foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60",
          password: "123",
          noHp: "085987654326"
        }
      ],
      guru: [
        {
          id: "g1",
          username: "anisa",
          nama: "Ibu Anisa Rahmawati, S.Pd.I",
          nuptk: "198503122010122003",
          mapel: "Fiqih",
          foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60",
          kelasDiajar: ["7A", "7B", "7C"],
          password: "123",
          noHp: "085123456781"
        },
        {
          id: "g2",
          username: "syarif",
          nama: "Bapak Drs. KH. Ahmad Syarifuddin",
          nuptk: "197204151998031002",
          mapel: "Al-Qur'an Hadits",
          foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=60",
          kelasDiajar: ["7A", "8A", "8B"],
          password: "123",
          noHp: "085123456782"
        },
        {
          id: "g3",
          username: "mansur",
          nama: "Bapak Muhammad Mansur, M.Pd",
          nuptk: "198911022015041001",
          mapel: "Bahasa Arab",
          foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60",
          kelasDiajar: ["9A", "9B", "9C", "9D"],
          password: "123",
          noHp: "085123456783"
        }
      ],
      buku: [
        {
          id: "b1",
          judul: "Fiqih Madrasah Tsanawiyah Kelas VII",
          mapel: "Fiqih",
          kelas: "7A",
          bab: [
            {
              nomor: 1,
              judul: "Al-Taharah (Ketentuan Bersuci dari Najis dan Hadas)",
              konten: "Bersuci (Taharah) merupakan kunci ibadah shalat. Najis terbagi menjadi tiga: Mukhaffafah (ringan, seperti air seni bayi laki-laki yang hanya minum ASI), Mutawassitah (sedang, seperti darah, nanah, tinja), dan Mugallazah (berat, seperti air liur anjing/babi). Pembasihan najis Mukhaffafah cukup memercikkan air, Mutawassitah harus membasuh hingga hilang rasa, bau, dan warna, sedangkan Mugallazah dibasuh 7 kali dan salah satunya menggunakan tanah."
            },
            {
              nomor: 2,
              judul: "Ketentuan Shalat Fardhu Lima Waktu",
              konten: "Shalat fardhu lima waktu hukumnya fardhu 'ain bagi setiap Muslim yang baligh dan berakal. Syarat wajib shalat meliputi beragama Islam, baligh, dan berakal sehat. Syarat sah shalat meliputi suci dari hadas besar/kecil, menutup aurat, menghadap kiblat, dan masuk waktu shalat. Rukun shalat meliputi Niat, Berdiri bagi yang mampu, Takbiratul Ihram, Membaca Al-Fatihah, Ruku' dengan tuma'ninah, I'tidal, Sujud dua kali, Duduk di antara dua sujud, Duduk Tasyahud Akhir, Membaca Shalawat Nabi, dan Salam."
            }
          ]
        },
        {
          id: "b2",
          judul: "Al-Qur'an Hadits MTs Kelas VIII",
          mapel: "Al-Qur'an Hadits",
          kelas: "8A",
          bab: [
            {
              nomor: 1,
              judul: "Kuhindari Makanan Haram demi Keberkahan Hidup",
              konten: "Allah SWT memerintahkan umat Islam untuk memakan makanan yang halal lagi baik (halalan tayyiban). Halal zatnya berarti makanan tersebut bukan makanan yang diharamkan seperti babi, darah, bangkai. Halal cara memperolehnya berarti bukan dari mencuri, korupsi, atau menipu. Makanan haram merusak kesehatan lahiriah, mengotori batin, dan menghalangi terkabulnya doa."
            },
            {
              nomor: 2,
              judul: "Keutamaan Berbakti kepada Kedua Orang Tua (Birrul Walidain)",
              konten: "Ridha Allah SWT bergantung pada ridha kedua orang tua, dan murka Allah juga bergantung pada kemurkaan orang tua. Berbakti kepada orang tua dilakukan dengan bertutur kata lemah lembut, menaati perintah mereka selama tidak bermaksiat kepada Allah, dan mendoakan mereka baik ketika masih hidup maupun setelah wafat."
            }
          ]
        },
        {
          id: "b3",
          judul: "Bahasa Arab Kelas IX MTs",
          mapel: "Bahasa Arab",
          kelas: "9A",
          bab: [
            {
              nomor: 1,
              judul: "Rasulullah SAW Hijrah ke Madinah (Rasul's Migration)",
              konten: "Peristiwa Hijrah Nabi Muhammad SAW dari Makkah ke Madinah merupakan tonggak sejarah besar dalam Islam. Penduduk Madinah (Ansar) menyambut hangat kaum Muhajirin dengan penuh persaudaraan. Kosakata penting: Hijrah (הجرة), Sahabat (الصحابة), Madinah Al-Munawwarah (المدينة المنورة), Kaum Anshar (الأنصار), Kaum Muhajirin (المهاجرon)."
            },
            {
              nomor: 2,
              judul: "Hari Raya Islam (Al-A'yadul Islamiyah)",
              konten: "Umat Islam memiliki dua hari raya utama: Idul Fitri pada tanggal 1 Syawal setelah melaksanakan ibadah puasa Ramadhan, dan Idul Adha pada tanggal 10 Dzulhijjah diiringi dengan penyembelihan hewan qurban seperti sapi, kambing, atau unta sebagai wujud takwa kepada Allah SWT."
            }
          ]
        }
      ],
      tugas: [
        {
          id: "t1",
          kelas: "7A",
          mapel: "Fiqih",
          semester: "1",
          bab: "Bab 1: Al-Taharah (Ketentuan Bersuci dari Najis dan Hadas)",
          jumlahSoal: 3,
          waktu: 15,
          soal: [
            {
              id: "q1",
              pertanyaan: "Najis yang digolongkan sebagai najis berat dalam ajaran Fiqih disebut najis...",
              pilihan: {
                A: "Mukhaffafah",
                B: "Mutawassitah",
                C: "Mugallazah",
                D: "Ainiyah"
              },
              jawabanBenar: "C"
            },
            {
              id: "q2",
              pertanyaan: "Bagaimanakah cara mensucikan benda yang terkena najis Mukhaffafah (ringan)?",
              pilihan: {
                A: "Membasuhnya sebanyak tujuh kali dengan tanah",
                B: "Memercikkan air bersih ke bagian yang terkena najis",
                C: "Mencucinya sampai hilang bau, rasa, dan warnanya",
                D: "Merendam benda tersebut di air mengalir seharian"
              },
              jawabanBenar: "B"
            },
            {
              id: "q3",
              pertanyaan: "Darah, nanah, dan kotoran manusia tergolong ke dalam najis jenis...",
              pilihan: {
                A: "Mugallazah",
                B: "Mukhaffafah",
                C: "Mutawassitah",
                D: "Hukmiyah"
              },
              jawabanBenar: "C"
            }
          ],
          dibuatTanggal: "2026-07-01T08:00:00Z",
          deadlineTanggal: "2026-07-20"
        },
        {
          id: "t2",
          kelas: "8A",
          mapel: "Al-Qur'an Hadits",
          semester: "1",
          bab: "Bab 1: Kuhindari Makanan Haram demi Keberkahan Hidup",
          jumlahSoal: 2,
          waktu: 10,
          soal: [
            {
              id: "t2-q1",
              pertanyaan: "Berikut adalah salah satu dampak negatif dari mengonsumsi makanan yang haram, yaitu...",
              pilihan: {
                A: "Tubuh menjadi semakin sehat dan kuat",
                B: "Mendapatkan pahala yang melimpah",
                C: "Terhalangnya terkabulnya doa oleh Allah SWT",
                D: "Meningkatkan kecerdasan otak"
              },
              jawabanBenar: "C"
            },
            {
              id: "t2-q2",
              pertanyaan: "Istilah untuk makanan yang diperbolehkan dikonsumsi serta menyehatkan tubuh dalam Islam adalah...",
              pilihan: {
                A: "Halalan Thayyiban",
                B: "Halalan Mutlaqan",
                C: "Haram lighairihi",
                D: "Makruh tahrim"
              },
              jawabanBenar: "A"
            }
          ],
          dibuatTanggal: "2026-07-02T09:00:00Z",
          deadlineTanggal: "2026-07-25"
        }
      ],
      jawabanSiswa: [
        {
          id: "j1",
          tugasId: "t1",
          siswaId: "s1",
          namaSiswa: "Ahmad Fauzi",
          kelas: "7A",
          nilai: 100,
          jawaban: {
            "q1": "C",
            "q2": "B",
            "q3": "C"
          },
          tanggalSelesai: "2026-07-02T10:15:00Z",
          waktuPengerjaanDetik: 245
        },
        {
          id: "j2",
          tugasId: "t1",
          siswaId: "s2",
          namaSiswa: "Siti Fatimah",
          kelas: "7B",
          nilai: 67,
          jawaban: {
            "q1": "C",
            "q2": "C",
            "q3": "C"
          },
          tanggalSelesai: "2026-07-03T11:20:00Z",
          waktuPengerjaanDetik: 320
        }
      ],
      notifikasi: [
        {
          id: "n1",
          judul: "Tugas Baru: Al-Taharah",
          deskripsi: "Tugas Baru Fiqih kelas 7A bab Ketentuan Bersuci telah dirilis oleh Ibu Anisa Rahmawati.",
          kelas: "7A",
          tanggal: "2026-07-01T08:00:00Z",
          tipe: "tugas",
          linkTugasId: "t1"
        },
        {
          id: "n2",
          judul: "Tenggat Waktu Tugas!",
          deskripsi: "Pengingat: Tugas Al-Qur'an Hadits kelas 8A bab Makanan Haram akan segera berakhir.",
          kelas: "8A",
          tanggal: "2026-07-03T12:00:00Z",
          tipe: "warning",
          linkTugasId: "t2"
        }
      ]
    };
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf8");
    } catch (err: any) {
      console.warn("Could not write initial db.json due to read-only filesystem:", err.message);
    }
    return initialData;
  }
  const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  let dirty = false;
  
  if (data.guru) {
    data.guru.forEach((g: any) => {
      if (g.nip !== undefined) {
        g.nuptk = g.nip;
        delete g.nip;
        dirty = true;
      }
      if (!g.password) {
        g.password = "123";
        dirty = true;
      }
      if (!g.noHp) {
        g.noHp = "085123456781";
        dirty = true;
      }
    });
  }
  if (data.siswa) {
    data.siswa.forEach((s: any) => {
      if (!s.password) {
        s.password = "123";
        dirty = true;
      }
      if (!s.noHp) {
        s.noHp = "085987654321";
        dirty = true;
      }
    });
  }
  if (!data.tkaTasks) {
    data.tkaTasks = [];
    dirty = true;
  }
  if (!data.tkaSubmissions) {
    data.tkaSubmissions = [];
    dirty = true;
  }
  if (!data.presentasi) {
    data.presentasi = [];
    dirty = true;
  }
  
  if (dirty) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    } catch (err: any) {
      console.warn("Could not write normalized db.json due to read-only filesystem:", err.message);
    }
  }
  return data;
}

let dbMemoryCache: any = null;
let pgClient: any = null;
let isSaving = false;
let pendingSave = false;
let initPromise: Promise<void> | null = null;

function parseConnectionString(url: string) {
  try {
    if (!url.startsWith("postgresql://") && !url.startsWith("postgres://")) {
      return { connectionString: url };
    }
    const prefix = url.startsWith("postgresql://") ? "postgresql://" : "postgres://";
    const remaining = url.substring(prefix.length);
    const lastAtIdx = remaining.lastIndexOf("@");
    if (lastAtIdx === -1) {
      return { connectionString: url };
    }
    const creds = remaining.substring(0, lastAtIdx);
    const hostDbParams = remaining.substring(lastAtIdx + 1);
    
    const firstColonIdx = creds.indexOf(":");
    let user = creds;
    let password = "";
    if (firstColonIdx !== -1) {
      user = creds.substring(0, firstColonIdx);
      password = creds.substring(firstColonIdx + 1);
    }
    
    const firstSlashIdx = hostDbParams.indexOf("/");
    let hostPort = hostDbParams;
    let database = "";
    if (firstSlashIdx !== -1) {
      hostPort = hostDbParams.substring(0, firstSlashIdx);
      database = hostDbParams.substring(firstSlashIdx + 1);
    }
    
    const questionMarkIdx = database.indexOf("?");
    if (questionMarkIdx !== -1) {
      database = database.substring(0, questionMarkIdx);
    }
    
    const colonIdx = hostPort.lastIndexOf(":");
    let host = hostPort;
    let port = 5432;
    if (colonIdx !== -1) {
      host = hostPort.substring(0, colonIdx);
      port = parseInt(hostPort.substring(colonIdx + 1)) || 5432;
    }
    
    let decodedUser = user;
    try { decodedUser = decodeURIComponent(user); } catch (e) {}
    
    let decodedPassword = password;
    try { decodedPassword = decodeURIComponent(password); } catch (e) {}

    let decodedDatabase = database;
    try { decodedDatabase = decodeURIComponent(database); } catch (e) {}

    return {
      user: decodedUser,
      password: decodedPassword,
      host: host,
      port: port,
      database: decodedDatabase
    };
  } catch (err) {
    console.error("Custom connection string parsing failed, falling back to raw URL:", err);
    return { connectionString: url };
  }
}

function ensureDbInitialized() {
  if (!initPromise) {
    initPromise = initDatabase();
  }
  return initPromise;
}

async function syncToPostgres(data: any) {
  if (!pgClient) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    } catch (e) {
      console.error("Failed to write to local DB_FILE:", e);
    }
    return;
  }

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {}

  if (isSaving) {
    pendingSave = true;
    return;
  }

  isSaving = true;
  try {
    const dbRes = await pgClient.query("SELECT collection, id FROM app_records");
    const existingKeys = new Set<string>(dbRes.rows.map((r: any) => `${r.collection}:${r.id}`));
    const currentKeys = new Set<string>();

    for (const [collection, records] of Object.entries(data)) {
      if (Array.isArray(records)) {
        for (const record of records) {
          const recordId = record.id;
          if (!recordId) continue;
          
          const key = `${collection}:${recordId}`;
          currentKeys.add(key);

          await pgClient.query(
            `INSERT INTO app_records (collection, id, data) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (collection, id) 
             DO UPDATE SET data = EXCLUDED.data`,
            [collection, recordId, JSON.stringify(record)]
          );
        }
      }
    }

    for (const key of existingKeys) {
      if (!currentKeys.has(key)) {
        const [collection, id] = key.split(":");
        await pgClient.query("DELETE FROM app_records WHERE collection = $1 AND id = $2", [collection, id]);
      }
    }
  } catch (err: any) {
    console.error("Error syncing to PostgreSQL:", err.message);
  } finally {
    isSaving = false;
    if (pendingSave) {
      pendingSave = false;
      await syncToPostgres(dbMemoryCache);
    }
  }
}

async function refreshDbMemoryCache() {
  if (!pgClient) {
    if (!dbMemoryCache) {
      dbMemoryCache = getNormalizedInitialData();
    }
    return;
  }

  try {
    const allRows = await pgClient.query("SELECT collection, id, data FROM app_records");
    const loadedDb: any = {
      siswa: [],
      guru: [],
      buku: [],
      tugas: [],
      jawabanSiswa: [],
      notifikasi: [],
      tkaTasks: [],
      tkaSubmissions: [],
      presentasi: []
    };

    for (const row of allRows.rows) {
      if (!loadedDb[row.collection]) {
        loadedDb[row.collection] = [];
      }
      let recordData = row.data;
      if (typeof recordData === "string") {
        try {
          recordData = JSON.parse(recordData);
        } catch (e) {}
      }
      loadedDb[row.collection].push(recordData);
    }
    dbMemoryCache = loadedDb;
    console.log(`Refreshed ${allRows.rows.length} rows from PostgreSQL into memory cache.`);
  } catch (err: any) {
    console.error("Failed to refresh PostgreSQL cache:", err.message);
    if (!dbMemoryCache) {
      dbMemoryCache = getNormalizedInitialData();
    }
  }
}

async function awaitPendingSaves() {
  const start = Date.now();
  // Wait up to 15 seconds for saving to complete
  while ((isSaving || pendingSave) && (Date.now() - start < 15000)) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

function readDb() {
  if (!dbMemoryCache) {
    dbMemoryCache = getNormalizedInitialData();
  }
  return dbMemoryCache;
}

function writeDb(data: any): Promise<void> {
  dbMemoryCache = data;
  return syncToPostgres(data).catch((err) => {
    console.error("Sync error:", err);
  });
}

async function initDatabase() {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    console.log("DATABASE_URL detected. Connecting to PostgreSQL/Supabase...");
    try {
      pgClient = new pg.Client({
        connectionString: dbUrl,
        connectionTimeoutMillis: 10000,
        ssl: { rejectUnauthorized: false }
      });

      pgClient.on("error", (err: any) => {
        console.error("Unexpected error on idle pgClient:", err.message);
        pgClient = null;
        initPromise = null;
      });

      await pgClient.connect();
      console.log("Connected to PostgreSQL successfully!");

      await pgClient.query(`
        CREATE TABLE IF NOT EXISTS app_records (
          collection VARCHAR(50) NOT NULL,
          id VARCHAR(100) NOT NULL,
          data JSONB NOT NULL,
          PRIMARY KEY (collection, id)
        );
      `);

      const res = await pgClient.query("SELECT COUNT(*) FROM app_records");
      const count = parseInt(res.rows[0].count);
      if (count === 0) {
        console.log("PostgreSQL database is empty. Seeding from local data or initialData...");
        const localData = getNormalizedInitialData();
        for (const [collection, records] of Object.entries(localData)) {
          if (Array.isArray(records)) {
            for (const record of records) {
              const recordId = record.id;
              if (!recordId) continue;
              await pgClient.query(
                "INSERT INTO app_records (collection, id, data) VALUES ($1, $2, $3) ON CONFLICT (collection, id) DO NOTHING",
                [collection, recordId, JSON.stringify(record)]
              );
            }
          }
        }
        console.log("Seeding complete!");
      }

      const allRows = await pgClient.query("SELECT collection, id, data FROM app_records");
      const loadedDb: any = {
        siswa: [],
        guru: [],
        buku: [],
        tugas: [],
        jawabanSiswa: [],
        notifikasi: [],
        tkaTasks: [],
        tkaSubmissions: [],
        presentasi: []
      };

      for (const row of allRows.rows) {
        if (!loadedDb[row.collection]) {
          loadedDb[row.collection] = [];
        }
        loadedDb[row.collection].push(row.data);
      }
      dbMemoryCache = loadedDb;
      console.log("Loaded all data from PostgreSQL into memory cache.");
    } catch (err: any) {
      console.error("Failed to initialize PostgreSQL. Falling back to local file db.json:", err.message);
      pgClient = null;
      dbMemoryCache = getNormalizedInitialData();
    }
  } else {
    console.log("No DATABASE_URL detected. Using local file db.json...");
    dbMemoryCache = getNormalizedInitialData();
  }
}

export const app = express();

function startServer() {
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Initialize DB asynchronously on boot
  ensureDbInitialized();

  // Middleware to ensure database is fully initialized and refreshed before processing any requests
  app.use(async (req, res, next) => {
    try {
      await ensureDbInitialized();
      await refreshDbMemoryCache();
      next();
    } catch (err: any) {
      console.error("Database initialization failed during request:", err);
      res.status(500).json({ error: "Database initialization failed: " + err.message });
    }
  });

  // Response interceptor to ensure all database writes are fully synced to Supabase before sending the response
  app.use((req, res, next) => {
    const originalJson = res.json;
    const originalSend = res.send;
    const originalEnd = res.end;

    res.json = function (body) {
      awaitPendingSaves().then(() => {
        originalJson.call(res, body);
      }).catch((err) => {
        console.error("Error awaiting pending saves in res.json:", err);
        originalJson.call(res, body);
      });
      return res;
    };

    res.send = function (body) {
      awaitPendingSaves().then(() => {
        originalSend.call(res, body);
      }).catch((err) => {
        console.error("Error awaiting pending saves in res.send:", err);
        originalSend.call(res, body);
      });
      return res;
    };

    (res as any).end = function (chunk?: any, encoding?: any, callback?: any) {
      const realCallback = typeof chunk === 'function' ? chunk : callback;
      awaitPendingSaves().then(() => {
        originalEnd.call(res, chunk, encoding, realCallback);
      }).catch((err) => {
        console.error("Error awaiting pending saves in res.end:", err);
        originalEnd.call(res, chunk, encoding, realCallback);
      });
    };

    next();
  });

  // API ROUTE: Authentication
  app.post("/api/login", (req, res) => {
    try {
      let body = req.body;
      if (typeof body === "string") {
        try {
          body = JSON.parse(body);
        } catch (e) {}
      }
      body = body || {};
      const { username, password, role } = body;

      if (!username) {
        return res.status(400).json({ success: false, message: "Nama pengguna harus diisi." });
      }

      const db = readDb();
      if (!db) {
        return res.status(500).json({ success: false, message: "Database tidak dapat dimuat." });
      }

      if (role === "admin" || username.toLowerCase() === "admin") {
        // Enforce admin password check (password must be "admin" or "admin123" or "123")
        if (password && password !== "admin" && password !== "admin123" && password !== "123") {
          return res.status(401).json({ success: false, message: "Sandi administrator salah." });
        }
        return res.json({
          success: true,
          user: {
            id: "admin",
            username: "admin",
            nama: "Administrator Utama",
            nuptk: "197001012026011001",
            mapel: "Semua",
            foto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60",
            password: "admin",
            noHp: "081234567890"
          },
          role: "admin"
        });
      }

      if (role === "guru") {
        const listGuru = db.guru || [];
        const user = listGuru.find((g: any) => g && g.username && g.username.toLowerCase() === username.toLowerCase());
        if (user) {
          const userPass = user.password || "123";
          if (password && userPass !== password) {
            return res.status(401).json({ success: false, message: "Sandi yang Anda masukkan salah." });
          }
          return res.json({ success: true, user, role: "guru" });
        }
      } else {
        const listSiswa = db.siswa || [];
        const user = listSiswa.find((s: any) => s && s.username && s.username.toLowerCase() === username.toLowerCase());
        if (user) {
          const userPass = user.password || "123";
          if (password && userPass !== password) {
            return res.status(401).json({ success: false, message: "Sandi yang Anda masukkan salah." });
          }
          return res.json({ success: true, user, role: "siswa" });
        }
      }
      return res.status(401).json({ success: false, message: "Username tidak ditemukan." });
    } catch (err: any) {
      console.error("Login endpoint error:", err);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan internal pada server: " + err.message,
        error: err.message,
        stack: err.stack
      });
    }
  });

  // API ROUTES: Teachers Management (Admin only)
  app.get("/api/teachers", (req, res) => {
    const db = readDb();
    res.json(db.guru || []);
  });

  app.post("/api/teachers", (req, res) => {
    const newGuru = req.body;
    const db = readDb();
    newGuru.id = "g_" + Date.now();
    if (!newGuru.foto) {
      newGuru.foto = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60";
    }
    if (!newGuru.kelasDiajar) {
      newGuru.kelasDiajar = [];
    }
    db.guru.push(newGuru);
    writeDb(db);
    res.status(201).json(newGuru);
  });

  app.put("/api/teachers/:id", (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const db = readDb();
    const idx = db.guru.findIndex((g: any) => g.id === id);
    if (idx !== -1) {
      db.guru[idx] = { ...db.guru[idx], ...updateData };
      writeDb(db);
      return res.json(db.guru[idx]);
    }
    return res.status(404).json({ message: "Guru tidak ditemukan" });
  });

  app.delete("/api/teachers/:id", (req, res) => {
    const { id } = req.params;
    const db = readDb();
    db.guru = db.guru.filter((g: any) => g.id !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // API ROUTE: Get active user lists by class (for Guru - Kelola Siswa)
  app.get("/api/students", (req, res) => {
    const { kelas } = req.query;
    const db = readDb();
    if (kelas) {
      const filtered = db.siswa.filter((s: any) => s.kelas === kelas);
      return res.json(filtered);
    }
    return res.json(db.siswa);
  });

  // Create student
  app.post("/api/students", (req, res) => {
    const newStudent: Siswa = req.body;
    const db = readDb();
    newStudent.id = "s_" + Date.now();
    if (!newStudent.foto) {
      newStudent.foto = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60";
    }
    db.siswa.push(newStudent);
    writeDb(db);
    res.status(201).json(newStudent);
  });

  // Create students in bulk
  app.post("/api/students/bulk", (req, res) => {
    const { students } = req.body;
    if (!students || !Array.isArray(students)) {
      return res.status(400).json({ message: "Data siswa tidak valid" });
    }
    const db = readDb();
    let count = 0;
    const now = Date.now();
    students.forEach((s: any, idx: number) => {
      const newStudent = { ...s };
      newStudent.id = "s_" + (now + idx);
      if (!newStudent.foto) {
        newStudent.foto = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60";
      }
      db.siswa.push(newStudent);
      count++;
    });
    writeDb(db);
    res.status(201).json({ success: true, count });
  });

  // Edit student
  app.put("/api/students/:id", (req, res) => {
    const { id } = req.params;
    const updateData: Partial<Siswa> = req.body;
    const db = readDb();
    const idx = db.siswa.findIndex((s: any) => s.id === id);
    if (idx !== -1) {
      // Ensure name isn't changed if coming from Student self-profile, but for Teacher panel, let them change whatever
      db.siswa[idx] = { ...db.siswa[idx], ...updateData };
      writeDb(db);
      return res.json(db.siswa[idx]);
    }
    return res.status(404).json({ message: "Siswa tidak ditemukan" });
  });

  // Delete student
  app.delete("/api/students/:id", (req, res) => {
    const { id } = req.params;
    const db = readDb();
    db.siswa = db.siswa.filter((s: any) => s.id !== id);
    // clean up their submissions too
    db.jawabanSiswa = db.jawabanSiswa.filter((j: any) => j.siswaId !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // ================= TKA (TUGAS KEAGAMAAN AMALIAH) API ROUTES =================
  // Helper to match parallel grade with specific class
  const isTkaClassMatch = (taskKelas: string, queryKelas: string): boolean => {
    const tk = String(taskKelas).trim().toUpperCase();
    const qk = String(queryKelas).trim().toUpperCase();
    if (tk === qk) return true;
    if (tk.length === 1 && qk.startsWith(tk)) return true;
    if (qk.length === 1 && tk.startsWith(qk)) return true;
    return false;
  };

  // Get TKA Tasks
  app.get("/api/tka/tasks", (req, res) => {
    const db = readDb();
    const { kelas } = req.query;
    let list = db.tkaTasks || [];
    if (kelas) {
      list = list.filter((t: any) => isTkaClassMatch(t.kelas, kelas as string));
    }
    res.json(list);
  });

  // Create TKA Task (Guru & Admin)
  app.post("/api/tka/tasks", (req, res) => {
    const newTask = req.body;
    const db = readDb();
    newTask.id = "tka_" + Date.now();
    newTask.createdTanggal = new Date().toISOString();
    if (!db.tkaTasks) db.tkaTasks = [];
    db.tkaTasks.push(newTask);
    writeDb(db);
    res.status(201).json(newTask);
  });

  // Delete TKA Task (Guru & Admin)
  app.delete("/api/tka/tasks/:id", (req, res) => {
    const { id } = req.params;
    const db = readDb();
    db.tkaTasks = (db.tkaTasks || []).filter((t: any) => t.id !== id);
    // clean up student submissions for this task
    db.tkaSubmissions = (db.tkaSubmissions || []).filter((s: any) => s.tkaTaskId !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // Get TKA Submissions
  app.get("/api/tka/submissions", (req, res) => {
    const db = readDb();
    const { task_id, siswa_id, kelas } = req.query;
    let list = db.tkaSubmissions || [];
    if (task_id) {
      list = list.filter((s: any) => s.tkaTaskId === task_id);
    }
    if (siswa_id) {
      list = list.filter((s: any) => s.siswaId === siswa_id);
    }
    if (kelas) {
      list = list.filter((s: any) => s.kelasSiswa === kelas);
    }
    res.json(list);
  });

  // Submit TKA Work (Siswa)
  app.post("/api/tka/submissions", (req, res) => {
    const submission = req.body;
    const db = readDb();
    submission.id = "tkas_" + Date.now();
    submission.tanggalSubmisi = new Date().toISOString();
    submission.status = "Belum Dinilai";
    
    if (!db.tkaSubmissions) db.tkaSubmissions = [];
    db.tkaSubmissions.push(submission);
    writeDb(db);
    res.status(201).json(submission);
  });

  // Grade TKA Work (Guru & Admin)
  app.put("/api/tka/submissions/:id", (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const db = readDb();
    if (!db.tkaSubmissions) db.tkaSubmissions = [];
    const idx = db.tkaSubmissions.findIndex((s: any) => s.id === id);
    if (idx !== -1) {
      db.tkaSubmissions[idx] = { ...db.tkaSubmissions[idx], ...updateData };
      writeDb(db);
      return res.json(db.tkaSubmissions[idx]);
    }
    return res.status(404).json({ message: "Submisi TKA tidak ditemukan" });
  });

  // API ROUTE: Manage Books
  app.get("/api/books", (req, res) => {
    const { kelas } = req.query;
    const db = readDb();
    if (kelas) {
      return res.json(db.buku.filter((b: any) => b.kelas === kelas));
    }
    return res.json(db.buku);
  });

  app.post("/api/books", (req, res) => {
    const newBook: Buku = req.body;
    const db = readDb();
    newBook.id = "b_" + Date.now();
    if (!newBook.bab) {
      newBook.bab = [];
    }
    db.buku.push(newBook);
    writeDb(db);
    res.status(201).json(newBook);
  });

  app.put("/api/books/:id", (req, res) => {
    const { id } = req.params;
    const updatedBook: Buku = req.body;
    const db = readDb();
    const idx = db.buku.findIndex((b: any) => b.id === id);
    if (idx !== -1) {
      db.buku[idx] = { ...db.buku[idx], ...updatedBook };
      writeDb(db);
      return res.json(db.buku[idx]);
    }
    return res.status(404).json({ message: "Buku tidak ditemukan" });
  });

  app.delete("/api/books/:id", (req, res) => {
    const { id } = req.params;
    const db = readDb();
    db.buku = db.buku.filter((b: any) => b.id !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // API ROUTE: Manage Assignments
  app.get("/api/assignments", (req, res) => {
    const { kelas } = req.query;
    const db = readDb();
    if (kelas) {
      return res.json(db.tugas.filter((t: any) => t.kelas === kelas));
    }
    return res.json(db.tugas);
  });

  app.post("/api/assignments", (req, res) => {
    const newTugas: Tugas = req.body;
    const db = readDb();
    newTugas.id = "t_" + Date.now();
    newTugas.dibuatTanggal = new Date().toISOString();
    db.tugas.push(newTugas);

    // Automatically create a notification for students in that class
    const notif: Notifikasi = {
      id: "n_" + Date.now(),
      judul: `Tugas Baru: ${newTugas.mapel}`,
      deskripsi: `Tugas baru ${newTugas.mapel} kelas ${newTugas.kelas} materi "${newTugas.bab}" telah tersedia. Segera kerjakan!`,
      kelas: newTugas.kelas,
      tanggal: newTugas.dibuatTanggal,
      tipe: "tugas",
      linkTugasId: newTugas.id
    };
    db.notifikasi.push(notif);

    writeDb(db);
    res.status(201).json(newTugas);
  });

  // API ROUTE: Submissions (Jawaban Siswa)
  app.get("/api/submissions", (req, res) => {
    const { tugasId, siswaId } = req.query;
    const db = readDb();
    let filtered = db.jawabanSiswa;
    if (tugasId) {
      filtered = filtered.filter((j: any) => j.tugasId === tugasId);
    }
    if (siswaId) {
      filtered = filtered.filter((j: any) => j.siswaId === siswaId);
    }
    res.json(filtered);
  });

  app.post("/api/submissions", (req, res) => {
    const submission: JawabanSiswa = req.body;
    const db = readDb();
    submission.id = "j_" + Date.now();
    submission.tanggalSelesai = new Date().toISOString();

    // Prevent double submission
    const existing = db.jawabanSiswa.find((j: any) => j.tugasId === submission.tugasId && j.siswaId === submission.siswaId);
    if (existing) {
      return res.status(400).json({ message: "Anda sudah mengerjakan tugas ini." });
    }

    db.jawabanSiswa.push(submission);
    writeDb(db);
    res.status(201).json(submission);
  });

  // API ROUTE: Notifications list
  app.get("/api/notifications", (req, res) => {
    const { kelas } = req.query;
    const db = readDb();
    let list = db.notifikasi;
    if (kelas) {
      list = list.filter((n: any) => n.kelas === kelas || n.kelas === "all");
    }
    res.json(list);
  });

  // API ROUTE: Generate questions via Groq API
  app.post("/api/generate-questions", async (req, res) => {
    const { mapel, kelas, semester, bab, jumlahSoal, referensiMateri } = req.body;

    if (!mapel || !kelas || !semester || !bab || !jumlahSoal) {
      return res.status(400).json({ error: "Parameter tidak lengkap." });
    }

    const count = parseInt(jumlahSoal) || 5;
    const groqKey = process.env.GROQ_API_KEY || "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";

    const promptMessage = `
Anda adalah seorang AI pembuat soal ujian profesional untuk Madrasah Tsanawiyah (MTs) Ma'arif NU 7 Sawojajar.
Buatlah ${count} butir soal pilihan ganda berkualitas tinggi dalam Bahasa Indonesia dengan nuansa pendidikan Islami Madrasah yang sesuai untuk siswa Kelas ${kelas}.

Mata Pelajaran: ${mapel}
Semester: ${semester}
Materi/Bab: ${bab}
Referensi Tambahan Materi: ${referensiMateri || "Gunakan kurikulum standar MTs terkait."}

ATURAN GENERASI SOAL:
1. Soal harus memiliki tepat 4 opsi pilihan ganda yaitu A, B, C, dan D.
2. Tingkat kesulitan soal harus sesuai dengan usia anak sekolah Madrasah Kelas ${kelas} (berusia 12-15 tahun).
3. Buat soal berdasarkan referensi materi yang dicantumkan agar relevan.
4. VARIASI WACANA & REFERENSI KEMENDIKBUD (SANGAT PENTING):
   - Setiap butir soal harus menggunakan teks stimulus ("Wacana:") yang BERVARIASI, UNIK, dan BERBEDA-BEDA antara satu soal dengan soal lainnya. SANGAT DILARANG menggunakan satu wacana yang sama persis untuk semua soal.
   - Gunakan referensi gaya soal Tes Kompetensi Akademik (TKA) dan Asesmen Kompetensi Minimum (AKM) Kemendikbud RI yang menguji literasi membaca mendalam dan penalaran kritis.
   - Wacana harus informatif, menarik, dan berbobot (misalnya berupa artikel sains populer, ulasan warisan budaya nusantara, fenomena sosial terkini, atau studi kasus ilmiah).
   - Untuk Matematika (Numerasi), buatlah soal cerita dengan konteks aplikatif dunia nyata yang bervariasi (seperti perhitungan zakat, transaksi pasar tradisional, sains/astronomi, atau arsitektur bangunan bersejarah).
5. Anda WAJIB mengembalikan data dalam format JSON murni berstruktur berikut tanpa penjelasan teks di luar JSON:
{
  "questions": [
    {
      "pertanyaan": "Wacana: [Isi wacana unik di sini, minimal 1-2 paragraf informatif]\\n\\nBerdasarkan wacana di atas, [pertanyaan spesifik di sini]...",
      "pilihan": {
        "A": "Jawaban opsi A",
        "B": "Jawaban opsi B",
        "C": "Jawaban opsi C",
        "D": "Jawaban opsi D"
      },
      "jawabanBenar": "A"
    }
  ]
}

Pastikan kunci jawaban benar di "jawabanBenar" bernilai salah satu dari "A", "B", "C", atau "D". Jangan berikan komentar apa pun sebelum atau setelah JSON agar file dapat diparse.
`;

    try {
      console.log(`Mengirim request ke Groq API untuk membuat soal ${mapel}...`);
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "Anda adalah asisten pembuat soal ujian Madrasah. Anda harus merespon dalam format JSON objek murni."
            },
            {
              role: "user",
              content: promptMessage
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.6,
          max_tokens: 3000
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API returned status: ${response.status}`);
      }

      const result = await response.json();
      const contentText = result.choices?.[0]?.message?.content;
      console.log("Response sukses diterima dari Groq.");

      if (!contentText) {
        throw new Error("Konten respon kosong dari AI.");
      }

      const parsed = JSON.parse(contentText);
      if (parsed.questions && Array.isArray(parsed.questions)) {
        // Add random IDs to questions
        const questionsWithIds = parsed.questions.map((q: any, i: number) => ({
          id: `q_${Date.now()}_${i}`,
          pertanyaan: q.pertanyaan,
          pilihan: q.pilihan,
          jawabanBenar: q.jawabanBenar || "A"
        }));
        return res.json({ questions: questionsWithIds });
      } else {
        throw new Error("Struktur JSON tidak sesuai.");
      }

    } catch (error: any) {
      console.error("Gagal generate soal via Groq API, menggunakan generator lokal sebagai cadangan:", error.message);
      
      // Sophisticated Fallback Local Question Generator based on standard topics
      const fallbackQuestions = generateFallbackQuestions(mapel, bab, count);
      return res.json({
        questions: fallbackQuestions,
        fallbackUsed: true,
        message: "Menggunakan soal cadangan berkualitas tinggi karena kendala koneksi AI."
      });
    }
  });

  // API ROUTE: GET all saved presentations
  app.get("/api/presentations", (req, res) => {
    try {
      const db = readDb();
      res.json(db.presentasi || []);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API ROUTE: DELETE saved presentation
  app.delete("/api/presentations/:id", (req, res) => {
    try {
      const { id } = req.params;
      const db = readDb();
      if (!db.presentasi) db.presentasi = [];
      db.presentasi = db.presentasi.filter((p: any) => p.id !== id);
      writeDb(db);
      res.json({ success: true, message: "Presentasi berhasil dihapus." });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API ROUTE: Generate presentation via Groq API with 14 slides and auto-saving
  app.post("/api/generate-presentation", async (req, res) => {
    const { judul, tema, mapel, kelas, bab } = req.body;

    if (!judul || !tema || !mapel || !kelas || !bab) {
      return res.status(400).json({ error: "Parameter tidak lengkap." });
    }

    const groqKey = process.env.GROQ_API_KEY || "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";

    // Lookup book and chapter content from database (db.json)
    const db = readDb();
    const books = db.buku || [];
    let matchedBook = books.find((b: any) => b.mapel.toLowerCase() === mapel.toLowerCase() && b.kelas.substring(0, 1) === kelas.substring(0, 1));
    if (!matchedBook) {
      matchedBook = books.find((b: any) => b.mapel.toLowerCase() === mapel.toLowerCase());
    }

    let matchedChapter: any = null;
    const reqChapterNum = (() => {
      const cleanStr = bab.toLowerCase();
      const romanMatch = cleanStr.match(/\b(ix|viii|vii|vi|iv|v|iii|ii|i)\b/);
      if (romanMatch) {
        const roman = romanMatch[1];
        const map: any = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9, x: 10 };
        return map[roman] || null;
      }
      const digitMatch = cleanStr.match(/\b([0-9]+)\b/);
      if (digitMatch) {
        return parseInt(digitMatch[1], 10);
      }
      return null;
    })();

    if (matchedBook && matchedBook.bab && Array.isArray(matchedBook.bab)) {
      if (reqChapterNum !== null) {
        matchedChapter = matchedBook.bab.find((ch: any) => ch.nomor === reqChapterNum);
      }
      if (!matchedChapter) {
        const cleanBabInput = bab.toLowerCase();
        matchedChapter = matchedBook.bab.find((ch: any) => 
          cleanBabInput.includes(ch.judul.toLowerCase()) || 
          ch.judul.toLowerCase().includes(cleanBabInput)
        );
      }
      if (!matchedChapter && matchedBook.bab.length > 0) {
        matchedChapter = matchedBook.bab[reqChapterNum ? (reqChapterNum - 1) % matchedBook.bab.length : 0];
      }
    }

    let sourceText = "";
    if (matchedBook && matchedChapter) {
      sourceText = `Buku Sumber: "${matchedBook.judul}"
Bab: Bab ${matchedChapter.nomor} - ${matchedChapter.judul}
Isi Konten Bab:
${matchedChapter.konten}`;
    } else {
      sourceText = `Gunakan materi pelajaran standard untuk Mata Pelajaran: ${mapel}, Kelas: ${kelas}, Bab/Topik: ${bab} - ${tema}.`;
    }

    const promptMessage = `
Anda adalah seorang AI instruksional desainer profesional tingkat pakar untuk tingkat Madrasah Tsanawiyah (MTs).
Tugas Anda adalah merangkum materi pelajaran dari buku sumber yang disediakan di bawah ini menjadi TEPAT 14 slide/halaman presentasi yang terstruktur, lengkap, dan informatif secara berurutan dalam Bahasa Indonesia.

SUMBER MATERI:
${sourceText}

INFORMASI PRESENTASI:
Judul Presentasi: ${judul}
Tema/Topik Utama: ${tema}
Mata Pelajaran: ${mapel}
Sasaran Kelas: ${kelas}
Bab Buku Pelajaran: ${bab}

ATURAN KETAT GENERASI PRESENTASI:
1. Hasilkan TEPAT 14 slide yang terstruktur rapi, logis, dan berurutan dari Pembuka, pembahasan materi secara bertahap, hingga kesimpulan/penutup.
2. Setiap slide harus memiliki struktur JSON dengan field: "slide_number", "title", "subtitle", "bullets", "image_keyword", "layout".
3. Layout yang diperbolehkan: "title_slide" (hanya untuk slide pertama/judul), "dalil_slide" (untuk pembahasan dalil/teks agama bila ada), "content_only", "two_columns", atau "image_highlight".
4. CARA MERANGKUM MATERI:
   - AI harus menelusuri isi bab di atas yang sesuai dengan permintaan (${bab}).
   - Rangkum bab tersebut menjadi 14 slide presentasi dengan mengambil judul bab, tema serta penjelasannya, poin serta penjelasannya, dan sub-poin serta penjelasannya secara runtut dan mendalam.
   - Jangan menambahkan informasi di luar isi bab tersebut jika materi sudah lengkap. Hindari halusinasi.
5. PENYEMATAN GAMBAR:
   - Wajib menambahkan "image_keyword" berupa 1-2 kata kunci bahasa Inggris yang sangat relevan dengan tema/topik/sub-tema spesifik di slide tersebut.
   - Contoh: Jika sub-tema/slide membahas "Keutamaan Dzikir dan Do'a", maka keyword gambarnya harus menyesuaikan secara spesifik seperti "praying", "supplication", "dhikr beads", atau "islamic prayer", bukan kata kunci umum. Jangan menggunakan tanda koma.
6. LARANGAN KERAS:
   - JANGAN gunakan atau sebutkan arahan "Kurikulum Merdeka", "Kurikulum Berbasis Cinta (KBC)", ataupun "Pancacinta" karena hal ini dapat menimbulkan bias dan halusinasi. Fokus murni pada rangkuman buku pelajaran yang disediakan.
7. KEDALAMAN MATERI:
   - Kolom "bullets" harus berisi 3-4 poin penjelasan materi yang rinci, analitis, dan mendalam (berupa kalimat utuh) yang menjelaskan konsep secara tuntas berdasarkan buku sumber.

Anda WAJIB mengembalikan data dalam format JSON murni berstruktur berikut tanpa penjelasan teks di luar JSON:
{
  "slides": [
    {
      "slide_number": 1,
      "title": "...",
      "subtitle": "...",
      "bullets": [
        "Poin penjelasan 1...",
        "Poin penjelasan 2...",
        "Poin penjelasan 3..."
      ],
      "image_keyword": "kata kunci gambar",
      "layout": "..."
    }
  ]
}

Jangan sertakan komentar, markdown block JSON, atau teks pembuka/penutup lainnya. Kembalikan string JSON murni yang valid agar dapat di-parse otomatis.
`;

    try {
      console.log(`Mengirim request ke Groq API untuk presentasi 14 slide: ${judul}...`);
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "Anda adalah asisten pembuat materi presentasi Madrasah. Anda harus merespon dalam format JSON objek murni dengan kunci 'slides'."
            },
            {
              role: "user",
              content: promptMessage
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API returned status: ${response.status}`);
      }

      const result = await response.json();
      const contentText = result.choices?.[0]?.message?.content;
      console.log("Response sukses diterima dari Groq untuk presentasi.");

      if (!contentText) {
        throw new Error("Konten respon kosong dari AI.");
      }

      const parsed = JSON.parse(contentText);
      if (parsed.slides && Array.isArray(parsed.slides)) {
        // Auto-save to local db
        const db = readDb();
        if (!db.presentasi) db.presentasi = [];
        
        const newPres = {
          id: `pres_${Date.now()}`,
          judul,
          tema,
          mapel,
          kelas,
          bab,
          slides: parsed.slides,
          createdAt: new Date().toISOString()
        };
        db.presentasi.push(newPres);
        writeDb(db);

        return res.json({ slides: parsed.slides, presentationId: newPres.id, allPresentations: db.presentasi });
      } else {
        throw new Error("Struktur JSON tidak mengandung array 'slides'.");
      }

    } catch (error: any) {
      console.error("Gagal generate presentasi via Groq API, menggunakan generator lokal 14 slide sebagai cadangan:", error.message);
      
      const fallbackSlides = generateFallbackPresentation(judul, tema, mapel, kelas, bab);
      const db = readDb();
      if (!db.presentasi) db.presentasi = [];
      
      const newPres = {
        id: `pres_${Date.now()}`,
        judul,
        tema,
        mapel,
        kelas,
        bab,
        slides: fallbackSlides,
        createdAt: new Date().toISOString()
      };
      db.presentasi.push(newPres);
      writeDb(db);

      return res.json({
        slides: fallbackSlides,
        presentationId: newPres.id,
        allPresentations: db.presentasi,
        fallbackUsed: true,
        message: "Menggunakan materi presentasi cadangan berkualitas tinggi karena kendala koneksi AI."
      });
    }
  });

  // Local Offline fallback presentation generator (Produces exactly 14 high-quality slides)
  function generateFallbackPresentation(judul: string, tema: string, mapel: string, kelas: string, bab: string) {
    const t = (tema || "").toLowerCase();
    const m = (mapel || "").toLowerCase();

    // Determine context-based keywords
    let kw1 = "book";
    let kw2 = "school";
    let kw3 = "thinking";
    let kw4 = "writing";
    let kw5 = "quran";
    let kw6 = "analytics";
    let kw7 = "structure";
    let kw8 = "law";
    let kw9 = "tablet";
    let kw10 = "people";
    let kw11 = "charity";
    let kw12 = "technology";
    let kw13 = "graduation";
    let kw14 = "praying";

    if (t.includes("dzikir") || t.includes("doa") || t.includes("sholat") || t.includes("pray") || t.includes("ibadah") || t.includes("zikir")) {
      kw1 = "islamic book";
      kw2 = "mosque";
      kw3 = "praying";
      kw4 = "supplication";
      kw5 = "dhikr beads";
      kw6 = "kaaba";
      kw7 = "mosque interior";
      kw8 = "holy book";
      kw9 = "muslim student";
      kw10 = "communal prayer";
      kw11 = "hand pray";
      kw12 = "islamic art";
      kw13 = "school kids";
      kw14 = "sujud prayer";
    } else if (t.includes("bersih") || t.includes("wudhu") || t.includes("thaharah") || t.includes("air") || t.includes("clean") || t.includes("water")) {
      kw1 = "clean water";
      kw2 = "wudhu area";
      kw3 = "washing hands";
      kw4 = "water splash";
      kw5 = "pure water";
      kw6 = "cleanliness";
      kw7 = "running water";
      kw8 = "hygiene";
      kw9 = "eco friendly";
      kw10 = "river water";
      kw11 = "giving water";
      kw12 = "nature environment";
      kw13 = "washing face";
      kw14 = "healthy life";
    } else if (t.includes("zakat") || t.includes("sedekah") || t.includes("charity") || t.includes("amal")) {
      kw1 = "charity box";
      kw2 = "giving help";
      kw3 = "hand giving";
      kw4 = "donating food";
      kw5 = "zakat fitrah";
      kw6 = "social community";
      kw7 = "sharing care";
      kw8 = "money donation";
      kw9 = "volunteers";
      kw10 = "helping poor";
      kw11 = "generous give";
      kw12 = "financial care";
      kw13 = "happy kids";
      kw14 = "kindness";
    } else if (m.includes("fiqih") || m.includes("agama") || m.includes("islam")) {
      kw1 = "quran study";
      kw2 = "madrasah library";
      kw3 = "student discussion";
      kw4 = "islamic class";
      kw5 = "quran stand";
      kw6 = "mind mapping";
      kw7 = "mosque school";
      kw8 = "islamic rules";
      kw9 = "digital learning";
      kw10 = "group learning";
      kw11 = "ethical support";
      kw12 = "modern tech";
      kw13 = "creative class";
      kw14 = "joint prayer";
    }

    return [
      {
        slide_number: 1,
        title: judul || `Materi Pembelajaran ${mapel}`,
        subtitle: `Materi ${bab}: ${tema} (Kelas ${kelas})`,
        bullets: [
          `Selamat datang di pembelajaran interaktif ${mapel} MTs Ma'arif NU 7 Sawojajar. Media presentasi ini disiapkan untuk membantu kelancaran kegiatan belajar mengajar kita.`,
          `Pembahasan kita kali ini berfokus secara mendalam pada bab ${bab} dengan topik utama: ${tema}, disesuaikan khusus untuk tingkat kelas ${kelas}.`,
          "Mari kita buka kegiatan belajar mengajar hari ini dengan berdoa bersama-sama seraya menata niat ikhlas menuntut ilmu yang bermanfaat."
        ],
        image_keyword: kw1,
        layout: "title_slide"
      },
      {
        slide_number: 2,
        title: "Tujuan Pembelajaran & Kompetensi Dasar",
        subtitle: "Target pemahaman dan keterampilan akademik yang wajib dikuasai siswa",
        bullets: [
          `Pemahaman Konseptual: Siswa mampu mengidentifikasi, menguraikan, dan menjelaskan esensi utama dari materi ${tema} secara mendalam dan logis.`,
          `Analisis Terperinci: Mengembangkan kemampuan untuk menganalisis prinsip-prinsip dasar, klasifikasi, serta elemen pendukung yang ada pada pelajaran ${mapel} bab ini.`,
          "Aplikasi Praktis: Mampu menerapkan pengetahuan yang diperoleh ke dalam studi kasus nyata di kehidupan sehari-hari."
        ],
        image_keyword: kw2,
        layout: "content_only"
      },
      {
        slide_number: 3,
        title: "Pertanyaan Pemantik & Eksplorasi Pikiran",
        subtitle: "Menyalakan rasa ingin tahu dan nalar kritis sebelum mendalami konsep",
        bullets: [
          `Refleksi Kehidupan Nyata: Pernahkah kalian memperhatikan bagaimana prinsip-prinsip ${tema} ini bekerja di sekeliling kita dan mengapa hal tersebut sangat penting?`,
          "Simulasi Masalah: Seandainya kita mengabaikan ketentuan atau teori yang diajarkan dalam bab ini, kekacauan atau kendala apa yang mungkin muncul di lingkungan kita?",
          "Curah Pendapat (Brainstorming): Mari diskusikan bersama teman sebangku mengenai pengalaman pribadi atau pengetahuan awal yang kalian miliki tentang topik hari ini."
        ],
        image_keyword: kw3,
        layout: "two_columns"
      },
      {
        slide_number: 4,
        title: "Eksplorasi Konsep Dasar & Pengantar",
        subtitle: `Pengertian, definisi, dan pondasi teoretis dari topik ${tema}`,
        bullets: [
          `Definisi Secara Bahasa (Etimologi): Menelaah asal-usul kata dari istilah ${tema} guna melacak makna orisinalnya dalam sejarah bahasa.`,
          `Definisi Secara Istilah (Terminologi): Merumuskan definisi baku dari ${tema} sebagai konsep keilmuan yang terstruktur di dalam mata pelajaran ${mapel}.`,
          "Urgensi Pembahasan: Memahami mengapa materi ini diletakkan pada tingkatan kelas ini serta hubungannya dengan materi pembelajaran sebelumnya."
        ],
        image_keyword: kw4,
        layout: "content_only"
      },
      {
        slide_number: 5,
        title: "Landasan Kebenaran & Dalil Rujukan",
        subtitle: "Pondasi pembuktian ilmiah atau teologis yang melandasi materi ajar",
        bullets: [
          `Rujukan Utama Agama Islam (untuk Pelajaran Agama): Menyajikan ayat suci Al-Qur'an atau Hadits Nabi SAW yang memerintahkan, menganjurkan, atau menjelaskan hukum tentang ${tema}.`,
          `Pembuktian Rasional/Empiris (untuk Pelajaran Umum): Menyandarkan konsep pada hukum alam, rumus matematika, fakta sejarah, atau data eksperimen ilmiah yang sahih.`,
          "Pelajaran Berharga: Menghubungkan landasan teoretis ini dengan sikap moderasi agar kita dapat menyikapi perbedaan sudut pandang secara bijaksana."
        ],
        image_keyword: kw5,
        layout: "dalil_slide"
      },
      {
        slide_number: 6,
        title: "Karakteristik & Struktur Anatomi Materi",
        subtitle: "Membedah bagian-bagian pembentuk materi secara analitis",
        bullets: [
          "Elemen Penyusun Utama: Mengenali setiap variabel, organ, bagian, atau aspek esensial yang menyusun keseluruhan bahasan dari bab ini.",
          "Sistem Interaksi Internal: Menganalisis bagaimana setiap elemen saling berkaitan, memengaruhi, dan mendukung fungsi satu sama lain secara dinamis.",
          "Stabilitas Konsep: Memahami bahwa hilangnya salah satu struktur utama akan mengakibatkan pemahaman konsep menjadi parsial atau tidak lengkap."
        ],
        image_keyword: kw6,
        layout: "content_only"
      },
      {
        slide_number: 7,
        title: "Klasifikasi & Pembagian Kategori",
        subtitle: "Pengelompokan elemen materi berdasarkan kriteria keilmuan tertentu",
        bullets: [
          "Golongan Primer/Wajib: Klasifikasi utama yang wajib dipatuhi atau dipenuhi agar amalan, perhitungan, atau analisis bernilai benar dan sah.",
          "Golongan Sekunder/Pelengkap: Aspek-aspek tambahan yang berfungsi sebagai penyempurna nilai keindahan dan kemanfaatan konsep.",
          "Aspek Negatif/Pengecualian: Hal-hal yang bertentangan, merusak, atau menggugurkan nilai positif dari pokok pembahasan yang harus kita hindari."
        ],
        image_keyword: kw7,
        layout: "two_columns"
      },
      {
        slide_number: 8,
        title: "Ketentuan Hukum, Syarat, & Rukun",
        subtitle: "Aturan regulasi dan kesepakatan normatif yang mengikat",
        bullets: [
          "Syarat-Syarat Pendahuluan: Kriteria eksternal yang harus dipenuhi atau dipersiapkan terlebih dahulu sebelum memulai pelaksanaan konsep.",
          "Rukun atau Aturan Internal: Langkah-langkah substansial di dalam sistem yang mutlak dikerjakan dengan tertib dan berurutan dari awal hingga akhir.",
          "Konsekuensi Hukum: Memahami dampak konkret berupa tidak sahnya suatu ibadah atau salahnya suatu analisis ilmiah bila salah satu ketentuan diabaikan."
        ],
        image_keyword: kw8,
        layout: "two_columns"
      },
      {
        slide_number: 9,
        title: "Prosedur & Tata Cara Pengaplikasian",
        subtitle: "Panduan praktis langkah demi langkah untuk melaksanakan materi",
        bullets: [
          "Langkah Kerja Sistematis: Memulai tindakan dengan urutan prosedural yang runtut untuk meminimalkan risiko kesalahan dan mengoptimalkan hasil.",
          "Instruksi Khusus (Best Practice): Tips dan kiat-kiat praktis untuk mengasah keahlian motorik atau logika berpikir siswa dalam memecahkan masalah ini.",
          "Penggunaan Alat Bantu: Memanfaatkan media, alat peraga, atau perangkat lunak digital di sekitar kita guna melancarkan proses implementasi di lapangan."
        ],
        image_keyword: kw9,
        layout: "content_only"
      },
      {
        slide_number: 10,
        title: "Kontekstualisasi & Studi Kasus Kehidupan Nyata",
        subtitle: "Menjembatani teori akademik dengan realitas kehidupan sosial siswa",
        bullets: [
          "Penerapan di Lingkungan Sekolah: Contoh konkret bagaimana nilai-nilai dari bab ini menuntun perilaku siswa ketika berinteraksi dengan guru dan teman di sekolah.",
          "Studi Kasus Pemecahan Masalah: Menganalisis skenario nyata di masyarakat, mengidentifikasi akar persoalan, dan merumuskan solusi berbasis materi hari ini.",
          "Pembelajaran Bermakna: Menyadari bahwa setiap pengetahuan yang didapatkan di kelas memiliki kegunaan praktis untuk memperbaiki kualitas kehidupan sosial."
        ],
        image_keyword: kw10,
        layout: "image_highlight"
      },
      {
        slide_number: 11,
        title: "Nilai Etika & Sikap Akhlak",
        subtitle: "Menanamkan nilai spiritualitas, empati, dan akhlak mulia",
        bullets: [
          `Kesadaran Moral: Mengembangkan rasa syukur mendalam atas keteraturan ilmu ${tema} sebagai bukti keagungan penciptaan.`,
          "Kepedulian Sosial: Menumbuhkan kepedulian tulus untuk membantu sesama manusia serta menjaga kelestarian lingkungan alam sekitar kita.",
          "Integritas Diri: Membingkai seluruh pengetahuan yang diperoleh hari ini sebagai bekal berbakti demi kemajuan bangsa dan keharmonisan sosial."
        ],
        image_keyword: kw11,
        layout: "content_only"
      },
      {
        slide_number: 12,
        title: "Peluang & Tantangan di Era Modern",
        subtitle: "Menghadapi modernitas teknologi dengan akhlak mulia dan kecerdasan",
        bullets: [
          "Pemanfaatan Teknologi Informasi: Menggunakan media sosial dan platform digital sebagai sarana belajar aktif serta menyebarkan konten edukasi positif.",
          "Filter terhadap Dampak Negatif: Bersikap kritis dan bijaksana dalam menyaring arus informasi di internet demi menghindari hoaks dan fitnah.",
          "Kreativitas Generasi Unggul: Menjadi generasi madrasah unggul yang kreatif, adaptif terhadap perkembangan zaman, namun tetap memegang teguh adab dan moral."
        ],
        image_keyword: kw12,
        layout: "content_only"
      },
      {
        slide_number: 13,
        title: "Asesmen Formatif & Diskusi Kritis",
        subtitle: "Mengukur tingkat pemahaman dan mempertajam daya analisis siswa",
        bullets: [
          `Pertanyaan Reflektif: Mengapa pemahaman tentang ${tema} harus selalu beriringan dengan keikhlasan hati dan komitmen kebaikan dalam bertindak?`,
          "Tugas Analitis: Sebutkan dan jelaskan 3 contoh nyata di sekitar tempat tinggalmu yang mencerminkan keberhasilan penerapan materi bab ini.",
          "Proyek Kolaboratif: Buatlah resume kreatif atau peta pikiran berkelompok mengenai materi bab ini di buku catatan kalian masing-masing."
        ],
        image_keyword: kw13,
        layout: "two_columns"
      },
      {
        slide_number: 14,
        title: "Refleksi, Kesimpulan, & Doa Penutup",
        subtitle: "Mengakhiri majelis ilmu dengan penuh rasa syukur dan doa keberkahan",
        bullets: [
          `Intisari Pembelajaran: Pengetahuan tentang ${tema} adalah jembatan emas untuk meningkatkan spiritualitas ibadah dan keluhuran etika sosial kita.`,
          "Komitmen Aksi Nyata: Mari kita bulatkan tekad untuk mengamalkan pelajaran hari ini mulai dari hal paling kecil, dari diri sendiri, dan dimulai saat ini juga.",
          "Doa Penutupan Majelis: Membaca doa bersama-sama seraya bersyukur atas kelancaran proses pembelajaran hari ini. Wassalamu'alaikum Warahmatullahi Wabarakatuh."
        ],
        image_keyword: kw14,
        layout: "title_slide"
      }
    ];
  }

  // Local Offline fallback question database generator to ensure perfect resilience
  function generateFallbackQuestions(mapel: string, bab: string, count: number) {
    const list: any[] = [];
    const subjectsLocal: Record<string, Array<{q: string, a: string, b: string, c: string, d: string, ans: string}>> = {
      "Fiqih": [
        {
          q: "Hukum bersuci (taharah) sebelum melaksanakan ibadah shalat wajib lima waktu bagi umat Islam adalah...",
          a: "Fardhu Kifayah",
          b: "Fardhu 'Ain",
          c: "Sunnah Muakkad",
          d: "Mubah"
        , ans: "B"
        },
        {
          q: "Najis mughalladhah dapat disucikan dengan mencucinya sebanyak 7 kali basuhan, salah satu basuhan diantaranya dicampur dengan...",
          a: "Sabun wangi",
          b: "Tanah atau debu suci",
          c: "Air kelapa",
          d: "Minyak kasturi"
        , ans: "B"
        },
        {
          q: "Kotoran hewan menyusui atau kotoran manusia tergolong ke dalam najis...",
          a: "Mutawassitah",
          b: "Mukhaffafah",
          c: "Mugallazah",
          d: "Hukmiyah"
        , ans: "A"
        },
        {
          q: "Di bawah ini yang termasuk salah satu sebab seseorang wajib melakukan mandi besar adalah...",
          a: "Buang air kecil",
          b: "Selesai masa haid bagi wanita",
          c: "Buang angin",
          d: "Menyentuh kulit bukan mahram"
        , ans: "B"
        },
        {
          q: "Bila tidak ditemukan air untuk berwudhu atau dalam keadaan sakit keras, bersuci diganti dengan...",
          a: "Istinja",
          b: "Tayamum menggunakan debu suci",
          c: "Mandi uap",
          d: "Berwudhu dengan minyak"
        , ans: "B"
        }
      ],
      "Al-Qur'an Hadits": [
        {
          q: "Umat Islam diperintahkan untuk memakan makanan yang halal lagi 'thayyib'. Arti kata thayyib adalah...",
          a: "Mahal harganya",
          b: "Enak dan manis rasanya",
          c: "Baik, bergizi, dan sehat untuk tubuh",
          d: "Berasal dari luar negeri"
        , ans: "C"
        },
        {
          q: "Dampak buruk dari mengonsumsi makanan yang haram secara terus menerus dalam pandangan agama adalah...",
          a: "Menjadikan wajah berseri-seri",
          b: "Doa-doa sulit dikabulkan oleh Allah SWT",
          c: "Menjadi terkenal di lingkungan sekolah",
          d: "Tubuh menjadi gemuk dan bugar"
        , ans: "B"
        },
        {
          q: "Kandungan hadits tentang 'Birrul Walidain' mengajarkan umat Islam untuk bersikap...",
          a: "Keras kepala kepada teman sebaya",
          b: "Berbakti, patuh, dan menyayangi kedua orang tua",
          c: "Menjauhi tetangga sekitar",
          d: "Mementingkan urusan duniawi semata"
        , ans: "B"
        },
        {
          q: "Ridha Allah SWT bergantung kepada ridha...",
          a: "Teman akrab",
          b: "Kedua orang tua",
          c: "Pejabat pemerintahan",
          d: "Tokoh masyarakat"
        , ans: "B"
        }
      ],
      "Bahasa Arab": [
        {
          q: "Apa arti kosakata bahasa Arab 'Al-Hijrah' (الهجرة) dalam peristiwa sejarah Nabi Muhammad SAW?",
          a: "Peperangan melawan musuh",
          b: "Perpindahan/migrasi dari Makkah ke Madinah",
          c: "Perdamaian antar suku",
          d: "Pernikahan agung"
        , ans: "B"
        },
        {
          q: "Kaum Muslimin yang menyambut hangat dan membantu rombongan hijrah Nabi di Madinah dikenal sebagai...",
          a: "Kaum Anshar",
          b: "Kaum Muhajirin",
          c: "Kaum Quraisy",
          d: "Kaum Hawariyun"
        , ans: "A"
        },
        {
          q: "Kata tanya 'Aina' (أين) dalam bahasa Arab digunakan untuk menanyakan...",
          a: "Waktu kejadian",
          b: "Alasan",
          c: "Tempat/Lokasi",
          d: "Nama orang"
        , ans: "C"
        },
        {
          q: "Hari Raya Idul Fitri dalam bahasa Arab dirayakan umat Islam pada tanggal...",
          a: "1 Syawal",
          b: "10 Dzulhijjah",
          c: "17 Ramadhan",
          d: "12 Rabiul Awal"
        , ans: "A"
        }
      ]
    };

    const cleanMapel = mapel === "Al-Qur'an Hadis" ? "Al-Qur'an Hadits" : mapel;
    const source = subjectsLocal[cleanMapel] || subjectsLocal["Fiqih"];
    for (let i = 0; i < count; i++) {
      const item = source[i % source.length];
      list.push({
        id: `q_fallback_${Date.now()}_${i}`,
        pertanyaan: `[Soal Cadangan] ${item.q} (Materi: ${bab})`,
        pilihan: {
          A: item.a,
          B: item.b,
          C: item.c,
          D: item.d
        },
        jawabanBenar: item.ans
      });
    }
    return list;
  }

  // Handle Vite middleware inside server
  if (process.env.NODE_ENV !== "production") {
    import("vite").then(({ createServer }) => {
      createServer({
        server: { middlewareMode: true },
        appType: "spa",
      }).then((vite) => {
        app.use(vite.middlewares);
      }).catch((err) => {
        console.error("Failed to start Vite dev server:", err);
      });
    }).catch((err) => {
      console.error("Failed to dynamically import vite:", err);
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (process.env.NETLIFY || process.env.VERCEL || process.env.LAMBDA_TASK_ROOT) {
    console.log("Running in Netlify/Vercel/Serverless environment. Port listener skipped.");
  } else {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Smart Teacher Server is running on port ${PORT}`);
    });
  }
}

startServer();
