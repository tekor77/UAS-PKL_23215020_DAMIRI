<?php
/**
 * API Backend PHP + MySQL untuk Tekor AI (MTs Ma'arif NU 7 Sawojajar)
 * Kompatibel dengan InfinityFree, Niagahoster, Hostinger, dan Web Hosting PHP biasa.
 * 
 * Cara Penggunaan di InfinityFree:
 * 1. Unggah seluruh folder 'dist' hasil build React Anda ke folder 'htdocs' Anda.
 * 2. Unggah file 'api.php' ini ke folder 'htdocs' Anda.
 * 3. Ubah konfigurasi database di bawah ini sesuai dengan detail database MySQL Anda di InfinityFree.
 * 4. Impor berkas 'schema.sql' ke phpMyAdmin Anda.
 */

// --- AKTIFKAN PENANGANAN ERROR UNTUK DEBUGGING ---
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// --- KONFIGURASI DATABASE MYSQL ---
$db_host = "HostDatabase"; // Sesuaikan dengan Host Database InfinityFree Anda
$db_name = "NamaDatabase";     // Sesuaikan dengan Nama Database Anda
$db_user = "NamaUser";              // Sesuaikan dengan Username Database Anda
$db_pass = "SandiDatabase";                 // Sesuaikan dengan Sandi Database Anda

// --- KONFIGURASI KEY GEMINI AI ---
$gemini_api_key = getenv("GEMINI_API_KEY") ?: "MAIzaSyD_JJMdfkeym0rdqofhLYcMt73QZTEwTdU";

// --- KONFIGURASI KEY GROQ AI ---
$groq_api_key = getenv("GROQ_API_KEY") ?: "YOUR_GROQ_API_KEY_HERE"; // Ganti dengan kunci API Groq AI Anda

// --- HEADER CORS & JSON ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- INISIALISASI KONEKSI DATABASE PDO ---
try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "error" => "Koneksi database gagal: " . $e->getMessage(),
        "instruction" => "Silakan sesuaikan variabel konfigurasi \$db_host, \$db_name, \$db_user, dan \$db_pass di bagian atas berkas api.php!"
    ]);
    exit();
}

// --- AUTO RUN MIGRASI SCHEMA (DEFENSIVE PROGRAMMING) ---
// Melakukan upgrade tabel secara otomatis jika terdapat kolom baru yang dibutuhkan oleh aplikasi
try {
    // 1. Tambah kolom di tka_tasks jika belum ada
    @$pdo->exec("ALTER TABLE tka_tasks ADD COLUMN judul VARCHAR(255) NULL");
    @$pdo->exec("ALTER TABLE tka_tasks ADD COLUMN deskripsi TEXT NULL");
    @$pdo->exec("ALTER TABLE tka_tasks ADD COLUMN kelas VARCHAR(50) NULL");
    @$pdo->exec("ALTER TABLE tka_tasks ADD COLUMN deadlineTanggal VARCHAR(50) NULL");
    @$pdo->exec("ALTER TABLE tka_tasks ADD COLUMN items LONGTEXT NULL");
    @$pdo->exec("ALTER TABLE tka_tasks ADD COLUMN bidangUji VARCHAR(100) NULL");
    @$pdo->exec("ALTER TABLE tka_tasks ADD COLUMN sistemPenilaian VARCHAR(100) NULL");
    @$pdo->exec("ALTER TABLE tka_tasks ADD COLUMN kkm INT NULL");
    @$pdo->exec("ALTER TABLE tka_tasks ADD COLUMN soalTka LONGTEXT NULL");
    @$pdo->exec("ALTER TABLE tka_tasks ADD COLUMN soal LONGTEXT NULL");
    @$pdo->exec("ALTER TABLE tka_tasks ADD COLUMN createdTanggal VARCHAR(50) NULL");

    // 2. Tambah kolom di tka_submissions jika belum ada
    @$pdo->exec("ALTER TABLE tka_submissions ADD COLUMN tkaTaskId VARCHAR(50) NULL");
    @$pdo->exec("ALTER TABLE tka_submissions ADD COLUMN tkaTaskJudul VARCHAR(255) NULL");
    @$pdo->exec("ALTER TABLE tka_submissions ADD COLUMN namaSiswa VARCHAR(100) NULL");
    @$pdo->exec("ALTER TABLE tka_submissions ADD COLUMN kelasSiswa VARCHAR(10) NULL");
    @$pdo->exec("ALTER TABLE tka_submissions ADD COLUMN jawabanChecklist LONGTEXT NULL");
    @$pdo->exec("ALTER TABLE tka_submissions ADD COLUMN catatanAmaliah TEXT NULL");
    @$pdo->exec("ALTER TABLE tka_submissions ADD COLUMN jawabanUjian LONGTEXT NULL");
    @$pdo->exec("ALTER TABLE tka_submissions ADD COLUMN jawabanTka LONGTEXT NULL");
    @$pdo->exec("ALTER TABLE tka_submissions ADD COLUMN nilai INT NULL");
    @$pdo->exec("ALTER TABLE tka_submissions ADD COLUMN status VARCHAR(50) NULL");
    @$pdo->exec("ALTER TABLE tka_submissions ADD COLUMN tanggalSubmisi VARCHAR(50) NULL");
    @$pdo->exec("ALTER TABLE tka_submissions ADD COLUMN catatanGuru TEXT NULL");
    @$pdo->exec("ALTER TABLE tka_submissions ADD COLUMN dinilaiOleh VARCHAR(100) NULL");

    // 3. Tambah kolom di buku jika belum ada untuk dukungan berkas digital/e-book
    @$pdo->exec("ALTER TABLE buku ADD COLUMN fileName VARCHAR(255) NULL");
    @$pdo->exec("ALTER TABLE buku ADD COLUMN fileType VARCHAR(100) NULL");
    @$pdo->exec("ALTER TABLE buku ADD COLUMN fileData LONGTEXT NULL");
} catch (Exception $e) {
    // Abaikan error jika kolom sudah ada
}

// --- PARSING URL ROUTE ---
$route = isset($_GET['endpoint']) ? $_GET['endpoint'] : (isset($_GET['route']) ? $_GET['route'] : '');

if (empty($route)) {
    $request_uri = $_SERVER['REQUEST_URI'];
    $script_name = $_SERVER['SCRIPT_NAME'];
    $path_info = str_replace($script_name, '', $request_uri);
    $path_info = explode('?', $path_info)[0];
    $route = trim($path_info, '/');
}

// Hapus awalan "api/" jika ada
if (strpos($route, 'api/') === 0) {
    $route = substr($route, 4);
}

// Pisahkan rute untuk mendukung parameter ID (misal: students/s1 -> resource = students, id = s1)
$route_parts = explode('/', $route);
$resource = isset($route_parts[0]) ? trim($route_parts[0]) : '';
$route_id = isset($route_parts[1]) ? trim($route_parts[1]) : (isset($_GET['id']) ? trim($_GET['id']) : '');

// Dukungan khusus rute bertingkat (misal: tka/tasks -> resource = tka/tasks)
if ($resource === 'tka' && isset($route_parts[1])) {
    $resource = 'tka/' . $route_parts[1];
    $route_id = isset($route_parts[2]) ? trim($route_parts[2]) : (isset($_GET['id']) ? trim($_GET['id']) : '');
}

// Map nama endpoint Bahasa Inggris (dari React App) ke nama Switch Case
$route_mapping = [
    'students' => 'siswa',
    'student' => 'siswa',
    'teachers' => 'guru',
    'teacher' => 'guru',
    'books' => 'buku',
    'book' => 'buku',
    'assignments' => 'tugas',
    'assignment' => 'tugas',
    'submissions' => 'jawaban',
    'submission' => 'jawaban',
    'notifications' => 'notifikasi',
    'notification' => 'notifikasi',
    'presentations' => 'presentasi',
    'presentation' => 'presentasi',
    'tka/tasks' => 'tka-tasks',
    'tka-tasks' => 'tka-tasks',
    'tka_tasks' => 'tka-tasks',
    'tka/submissions' => 'tka-submissions',
    'tka-submissions' => 'tka-submissions',
    'tka_submissions' => 'tka-submissions',
    'generate-presentation' => 'generate-slideshow',
    'generate-questions' => 'generate-questions'
];

if (isset($route_mapping[$resource])) {
    $route = $route_mapping[$resource];
} else {
    $route = $resource;
}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?: [];

// --- HELPER UNTUK MENGIRIM RESPONSE ---
function sendResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit();
}

// --- HELPER UNTUK MEMBUAT ID UNIK ---
function generateUUID() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

// --- ROUTER API ENDPOINTS ---
switch ($route) {

    case 'login':
        if ($method !== 'POST') sendResponse(["success" => false, "message" => "Method not allowed"], 405);
        $username = isset($input['username']) ? trim($input['username']) : '';
        $password = isset($input['password']) ? trim($input['password']) : '';
        $role = isset($input['role']) ? trim($input['role']) : '';

        if (empty($username)) {
            sendResponse(["success" => false, "message" => "Nama pengguna harus diisi."], 400);
        }

        if ($role === 'admin' || strtolower($username) === 'admin') {
            if ($password !== '123' && $password !== 'admin' && $password !== 'admin123') {
                sendResponse(["success" => false, "message" => "Sandi administrator salah."], 401);
            }
            sendResponse([
                "success" => true,
                "user" => [
                    "id" => "admin", 
                    "username" => "admin", 
                    "nama" => "Administrator Utama", 
                    "role" => "admin",
                    "foto" => "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60"
                ],
                "role" => "admin"
            ]);
        }

        // Cari di tabel guru
        $stmt = $pdo->prepare("SELECT * FROM guru WHERE username = ?");
        $stmt->execute([$username]);
        $guru = $stmt->fetch();
        if ($guru && $guru['password'] === $password) {
            $guru['kelasDiajar'] = json_decode($guru['kelasDiajar'], true) ?: [];
            $guru['role'] = 'guru';
            sendResponse(["success" => true, "user" => $guru, "role" => "guru"]);
        }

        // Cari di tabel siswa
        $stmt = $pdo->prepare("SELECT * FROM siswa WHERE username = ?");
        $stmt->execute([$username]);
        $siswa = $stmt->fetch();
        if ($siswa && $siswa['password'] === $password) {
            $siswa['role'] = 'siswa';
            sendResponse(["success" => true, "user" => $siswa, "role" => "siswa"]);
        }

        sendResponse(["success" => false, "message" => "Nama pengguna atau kata sandi Anda salah!"], 401);
        break;

    case 'siswa':
        if ($method === 'GET') {
            $kelas = isset($_GET['kelas']) ? trim($_GET['kelas']) : '';
            if (!empty($kelas)) {
                $stmt = $pdo->prepare("SELECT * FROM siswa WHERE kelas = ?");
                $stmt->execute([$kelas]);
            } else {
                $stmt = $pdo->query("SELECT * FROM siswa");
            }
            sendResponse($stmt->fetchAll());
        } elseif ($method === 'POST') {
            // Cek jika bulk import
            if ($route_id === 'bulk' || (isset($_GET['id']) && $_GET['id'] === 'bulk')) {
                $students = isset($input['students']) ? $input['students'] : [];
                if (!empty($students) && is_array($students)) {
                    $count = 0;
                    $pdo->beginTransaction();
                    try {
                        $stmt_check = $pdo->prepare("SELECT id FROM siswa WHERE id = ? OR username = ?");
                        $stmt_insert = $pdo->prepare("INSERT INTO siswa (id, username, nama, kelas, alamat, citaCita, motoHidup, foto, password, noHp) 
                            VALUES (:id, :username, :nama, :kelas, :alamat, :citaCita, :motoHidup, :foto, :password, :noHp)");
                        $stmt_update = $pdo->prepare("UPDATE siswa SET username = :username, nama = :nama, kelas = :kelas, alamat = :alamat, citaCita = :citaCita, motoHidup = :motoHidup, foto = :foto, password = :password, noHp = :noHp WHERE id = :id");

                        foreach ($students as $s) {
                            $id = isset($s['id']) ? $s['id'] : 's_' . (time() . mt_rand(10, 99));
                            $username = $s['username'];
                            
                            $stmt_check->execute([$id, $username]);
                            $existing = $stmt_check->fetch();

                            $params = [
                                ':username' => $username,
                                ':nama' => $s['nama'],
                                ':kelas' => $s['kelas'],
                                ':alamat' => isset($s['alamat']) ? $s['alamat'] : '',
                                ':citaCita' => isset($s['citaCita']) ? $s['citaCita'] : '',
                                ':motoHidup' => isset($s['motoHidup']) ? $s['motoHidup'] : '',
                                ':foto' => isset($s['foto']) ? $s['foto'] : '',
                                ':password' => isset($s['password']) ? $s['password'] : '123',
                                ':noHp' => isset($s['noHp']) ? $s['noHp'] : ''
                            ];

                            if ($existing) {
                                $params[':id'] = $existing['id'];
                                $stmt_update->execute($params);
                            } else {
                                $params[':id'] = $id;
                                $stmt_insert->execute($params);
                            }
                            $count++;
                        }
                        $pdo->commit();
                        sendResponse(["success" => true, "count" => $count]);
                    } catch (Exception $ex) {
                        $pdo->rollBack();
                        sendResponse(["success" => false, "message" => "Gagal mengimpor data siswa: " . $ex->getMessage()], 500);
                    }
                } else {
                    sendResponse(["success" => false, "message" => "Data siswa tidak valid atau kosong."], 400);
                }
            } else {
                // Tambah atau update siswa tunggal
                $id = isset($input['id']) ? $input['id'] : 's_' . time();
                $username = $input['username'];
                $nama = $input['nama'];
                $kelas = $input['kelas'];
                $alamat = isset($input['alamat']) ? $input['alamat'] : '';
                $citaCita = isset($input['citaCita']) ? $input['citaCita'] : '';
                $motoHidup = isset($input['motoHidup']) ? $input['motoHidup'] : '';
                $foto = isset($input['foto']) ? $input['foto'] : '';
                $password = isset($input['password']) ? $input['password'] : '123';
                $noHp = isset($input['noHp']) ? $input['noHp'] : '';

                $stmt_check = $pdo->prepare("SELECT id FROM siswa WHERE id = ? OR username = ?");
                $stmt_check->execute([$id, $username]);
                $existing = $stmt_check->fetch();

                if ($existing) {
                    $student_id = $existing['id'];
                    $stmt = $pdo->prepare("UPDATE siswa SET username = :username, nama = :nama, kelas = :kelas, alamat = :alamat, citaCita = :citaCita, motoHidup = :motoHidup, foto = :foto, password = :password, noHp = :noHp WHERE id = :id");
                    $stmt->execute([
                        ':id' => $student_id,
                        ':username' => $username,
                        ':nama' => $nama,
                        ':kelas' => $kelas,
                        ':alamat' => $alamat,
                        ':citaCita' => $citaCita,
                        ':motoHidup' => $motoHidup,
                        ':foto' => $foto,
                        ':password' => $password,
                        ':noHp' => $noHp
                    ]);
                    sendResponse(["success" => true, "id" => $student_id]);
                } else {
                    $stmt = $pdo->prepare("INSERT INTO siswa (id, username, nama, kelas, alamat, citaCita, motoHidup, foto, password, noHp) 
                        VALUES (:id, :username, :nama, :kelas, :alamat, :citaCita, :motoHidup, :foto, :password, :noHp)");
                    $stmt->execute([
                        ':id' => $id,
                        ':username' => $username,
                        ':nama' => $nama,
                        ':kelas' => $kelas,
                        ':alamat' => $alamat,
                        ':citaCita' => $citaCita,
                        ':motoHidup' => $motoHidup,
                        ':foto' => $foto,
                        ':password' => $password,
                        ':noHp' => $noHp
                    ]);
                    sendResponse(["success" => true, "id" => $id]);
                }
            }
        } elseif ($method === 'PUT') {
            $id = $route_id;
            if (empty($id)) {
                sendResponse(["success" => false, "message" => "ID siswa wajib disertakan."], 400);
            }
            $stmt_get = $pdo->prepare("SELECT * FROM siswa WHERE id = ?");
            $stmt_get->execute([$id]);
            $existing = $stmt_get->fetch();
            if (!$existing) {
                sendResponse(["success" => false, "message" => "Siswa tidak ditemukan"], 404);
            }
            $username = isset($input['username']) ? $input['username'] : $existing['username'];
            $nama = isset($input['nama']) ? $input['nama'] : $existing['nama'];
            $kelas = isset($input['kelas']) ? $input['kelas'] : $existing['kelas'];
            $alamat = isset($input['alamat']) ? $input['alamat'] : $existing['alamat'];
            $citaCita = isset($input['citaCita']) ? $input['citaCita'] : $existing['citaCita'];
            $motoHidup = isset($input['motoHidup']) ? $input['motoHidup'] : $existing['motoHidup'];
            $foto = isset($input['foto']) ? $input['foto'] : $existing['foto'];
            $password = isset($input['password']) ? $input['password'] : $existing['password'];
            $noHp = isset($input['noHp']) ? $input['noHp'] : $existing['noHp'];

            $stmt = $pdo->prepare("UPDATE siswa SET username = :username, nama = :nama, kelas = :kelas, alamat = :alamat, citaCita = :citaCita, motoHidup = :motoHidup, foto = :foto, password = :password, noHp = :noHp WHERE id = :id");
            $stmt->execute([
                ':id' => $id,
                ':username' => $username,
                ':nama' => $nama,
                ':kelas' => $kelas,
                ':alamat' => $alamat,
                ':citaCita' => $citaCita,
                ':motoHidup' => $motoHidup,
                ':foto' => $foto,
                ':password' => $password,
                ':noHp' => $noHp
            ]);
            sendResponse(["success" => true, "id" => $id]);
        } elseif ($method === 'DELETE') {
            $id = $route_id;
            if (empty($id)) {
                sendResponse(["success" => false, "message" => "ID siswa wajib disertakan."], 400);
            }
            $stmt = $pdo->prepare("DELETE FROM siswa WHERE id = ?");
            $stmt->execute([$id]);

            // Hapus juga jawaban siswa yang bersangkutan
            $stmt_clean = $pdo->prepare("DELETE FROM jawaban_siswa WHERE siswaId = ?");
            $stmt_clean->execute([$id]);

            sendResponse(["success" => true]);
        }
        break;

    case 'guru':
        if ($method === 'GET') {
            $stmt = $pdo->query("SELECT * FROM guru");
            $gurus = $stmt->fetchAll();
            foreach ($gurus as &$g) {
                $g['kelasDiajar'] = json_decode($g['kelasDiajar'], true) ?: [];
            }
            sendResponse($gurus);
        } elseif ($method === 'POST') {
            $id = isset($input['id']) ? $input['id'] : 'g_' . time();
            $kelasDiajar_json = json_encode(isset($input['kelasDiajar']) ? $input['kelasDiajar'] : []);
            $username = $input['username'];
            $nama = $input['nama'];
            $nuptk = isset($input['nuptk']) ? $input['nuptk'] : (isset($input['nip']) ? $input['nip'] : '');
            $mapel = $input['mapel'];
            $foto = isset($input['foto']) ? $input['foto'] : '';
            $password = isset($input['password']) ? $input['password'] : '123';
            $noHp = isset($input['noHp']) ? $input['noHp'] : '';

            $stmt_check = $pdo->prepare("SELECT id FROM guru WHERE id = ? OR username = ?");
            $stmt_check->execute([$id, $username]);
            $existing = $stmt_check->fetch();

            if ($existing) {
                $teacher_id = $existing['id'];
                $stmt = $pdo->prepare("UPDATE guru SET username = :username, nama = :nama, nuptk = :nuptk, mapel = :mapel, foto = :foto, kelasDiajar = :kelasDiajar, password = :password, noHp = :noHp WHERE id = :id");
                $stmt->execute([
                    ':id' => $teacher_id,
                    ':username' => $username,
                    ':nama' => $nama,
                    ':nuptk' => $nuptk,
                    ':mapel' => $mapel,
                    ':foto' => $foto,
                    ':kelasDiajar' => $kelasDiajar_json,
                    ':password' => $password,
                    ':noHp' => $noHp
                ]);
                sendResponse(["success" => true, "id" => $teacher_id]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO guru (id, username, nama, nuptk, mapel, foto, kelasDiajar, password, noHp) 
                    VALUES (:id, :username, :nama, :nuptk, :mapel, :foto, :kelasDiajar, :password, :noHp)");
                $stmt->execute([
                    ':id' => $id,
                    ':username' => $username,
                    ':nama' => $nama,
                    ':nuptk' => $nuptk,
                    ':mapel' => $mapel,
                    ':foto' => $foto,
                    ':kelasDiajar' => $kelasDiajar_json,
                    ':password' => $password,
                    ':noHp' => $noHp
                ]);
                sendResponse(["success" => true, "id" => $id]);
            }
        } elseif ($method === 'PUT') {
            $id = $route_id;
            if (empty($id)) {
                sendResponse(["success" => false, "message" => "ID guru wajib disertakan."], 400);
            }
            $stmt_get = $pdo->prepare("SELECT * FROM guru WHERE id = ?");
            $stmt_get->execute([$id]);
            $existing = $stmt_get->fetch();
            if (!$existing) {
                sendResponse(["success" => false, "message" => "Guru tidak ditemukan"], 404);
            }
            $username = isset($input['username']) ? $input['username'] : $existing['username'];
            $nama = isset($input['nama']) ? $input['nama'] : $existing['nama'];
            $nuptk = isset($input['nuptk']) ? $input['nuptk'] : (isset($input['nip']) ? $input['nip'] : $existing['nuptk']);
            $mapel = isset($input['mapel']) ? $input['mapel'] : $existing['mapel'];
            $foto = isset($input['foto']) ? $input['foto'] : $existing['foto'];
            $kelasDiajar = isset($input['kelasDiajar']) ? json_encode($input['kelasDiajar']) : $existing['kelasDiajar'];
            $password = isset($input['password']) ? $input['password'] : $existing['password'];
            $noHp = isset($input['noHp']) ? $input['noHp'] : $existing['noHp'];

            $stmt = $pdo->prepare("UPDATE guru SET username=:username, nama=:nama, nuptk=:nuptk, mapel=:mapel, foto=:foto, kelasDiajar=:kelasDiajar, password=:password, noHp=:noHp WHERE id=:id");
            $stmt->execute([
                ':id' => $id,
                ':username' => $username,
                ':nama' => $nama,
                ':nuptk' => $nuptk,
                ':mapel' => $mapel,
                ':foto' => $foto,
                ':kelasDiajar' => $kelasDiajar,
                ':password' => $password,
                ':noHp' => $noHp
            ]);
            sendResponse(["success" => true, "id" => $id]);
        } elseif ($method === 'DELETE') {
            $id = $route_id;
            if (empty($id)) {
                sendResponse(["success" => false, "message" => "ID guru wajib disertakan."], 400);
            }
            $stmt = $pdo->prepare("DELETE FROM guru WHERE id = ?");
            $stmt->execute([$id]);
            sendResponse(["success" => true]);
        }
        break;

    case 'buku':
        if ($method === 'GET') {
            $kelas = isset($_GET['kelas']) ? trim($_GET['kelas']) : '';
            if (!empty($kelas)) {
                $stmt = $pdo->prepare("SELECT * FROM buku WHERE kelas = ?");
                $stmt->execute([$kelas]);
            } else {
                $stmt = $pdo->query("SELECT * FROM buku");
            }
            $bukus = $stmt->fetchAll();
            foreach ($bukus as &$b) {
                $b['bab'] = json_decode($b['bab'], true) ?: [];
            }
            sendResponse($bukus);
        } elseif ($method === 'POST') {
            $id = isset($input['id']) ? $input['id'] : 'b_' . time();
            $bab_json = json_encode(isset($input['bab']) ? $input['bab'] : []);
            $fileName = isset($input['fileName']) ? $input['fileName'] : null;
            $fileType = isset($input['fileType']) ? $input['fileType'] : null;
            $fileData = isset($input['fileData']) ? $input['fileData'] : null;

            $stmt_check = $pdo->prepare("SELECT id FROM buku WHERE id = ?");
            $stmt_check->execute([$id]);
            $existing = $stmt_check->fetch();

            if ($existing) {
                $stmt = $pdo->prepare("UPDATE buku SET judul=:judul, mapel=:mapel, kelas=:kelas, bab=:bab, fileName=:fileName, fileType=:fileType, fileData=:fileData WHERE id=:id");
                $stmt->execute([
                    ':id' => $id,
                    ':judul' => $input['judul'],
                    ':mapel' => $input['mapel'],
                    ':kelas' => $input['kelas'],
                    ':bab' => $bab_json,
                    ':fileName' => $fileName,
                    ':fileType' => $fileType,
                    ':fileData' => $fileData
                ]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO buku (id, judul, mapel, kelas, bab, fileName, fileType, fileData) VALUES (:id, :judul, :mapel, :kelas, :bab, :fileName, :fileType, :fileData)");
                $stmt->execute([
                    ':id' => $id,
                    ':judul' => $input['judul'],
                    ':mapel' => $input['mapel'],
                    ':kelas' => $input['kelas'],
                    ':bab' => $bab_json,
                    ':fileName' => $fileName,
                    ':fileType' => $fileType,
                    ':fileData' => $fileData
                ]);
            }
            sendResponse(["success" => true, "id" => $id]);
        } elseif ($method === 'PUT') {
            $id = $route_id;
            if (empty($id)) {
                sendResponse(["success" => false, "message" => "ID buku wajib disertakan."], 400);
            }
            $stmt_get = $pdo->prepare("SELECT * FROM buku WHERE id = ?");
            $stmt_get->execute([$id]);
            $existing = $stmt_get->fetch();
            if (!$existing) {
                sendResponse(["success" => false, "message" => "Buku tidak ditemukan"], 404);
            }
            $judul = isset($input['judul']) ? $input['judul'] : $existing['judul'];
            $mapel = isset($input['mapel']) ? $input['mapel'] : $existing['mapel'];
            $kelas = isset($input['kelas']) ? $input['kelas'] : $existing['kelas'];
            $bab = isset($input['bab']) ? json_encode($input['bab']) : $existing['bab'];
            $fileName = isset($input['fileName']) ? $input['fileName'] : $existing['fileName'];
            $fileType = isset($input['fileType']) ? $input['fileType'] : $existing['fileType'];
            $fileData = isset($input['fileData']) ? $input['fileData'] : $existing['fileData'];

            $stmt = $pdo->prepare("UPDATE buku SET judul=:judul, mapel=:mapel, kelas=:kelas, bab=:bab, fileName=:fileName, fileType=:fileType, fileData=:fileData WHERE id=:id");
            $stmt->execute([
                ':id' => $id,
                ':judul' => $judul,
                ':mapel' => $mapel,
                ':kelas' => $kelas,
                ':bab' => $bab,
                ':fileName' => $fileName,
                ':fileType' => $fileType,
                ':fileData' => $fileData
            ]);
            sendResponse(["success" => true, "id" => $id]);
        } elseif ($method === 'DELETE') {
            $id = $route_id;
            if (empty($id)) {
                sendResponse(["success" => false, "message" => "ID buku wajib disertakan."], 400);
            }
            $stmt = $pdo->prepare("DELETE FROM buku WHERE id = ?");
            $stmt->execute([$id]);
            sendResponse(["success" => true]);
        }
        break;

    case 'tugas':
        if ($method === 'GET') {
            $kelas = isset($_GET['kelas']) ? trim($_GET['kelas']) : '';
            if (!empty($kelas)) {
                $stmt = $pdo->prepare("SELECT * FROM tugas WHERE kelas = ?");
                $stmt->execute([$kelas]);
            } else {
                $stmt = $pdo->query("SELECT * FROM tugas");
            }
            $tugasList = $stmt->fetchAll();
            foreach ($tugasList as &$t) {
                $t['soal'] = json_decode($t['soal'], true) ?: [];
            }
            sendResponse($tugasList);
        } elseif ($method === 'POST') {
            $id = isset($input['id']) ? $input['id'] : 't_' . time();
            $soal_json = json_encode(isset($input['soal']) ? $input['soal'] : []);
            $dibuatTanggal = isset($input['dibuatTanggal']) ? $input['dibuatTanggal'] : date('c');

            $stmt_check = $pdo->prepare("SELECT id FROM tugas WHERE id = ?");
            $stmt_check->execute([$id]);
            $existing = $stmt_check->fetch();

            if ($existing) {
                $stmt = $pdo->prepare("UPDATE tugas SET kelas=:kelas, mapel=:mapel, semester=:semester, bab=:bab, jumlahSoal=:jumlahSoal, waktu=:waktu, soal=:soal, deadlineTanggal=:deadlineTanggal WHERE id=:id");
                $stmt->execute([
                    ':id' => $id,
                    ':kelas' => $input['kelas'],
                    ':mapel' => $input['mapel'],
                    ':semester' => $input['semester'],
                    ':bab' => $input['bab'],
                    ':jumlahSoal' => $input['jumlahSoal'],
                    ':waktu' => $input['waktu'],
                    ':soal' => $soal_json,
                    ':deadlineTanggal' => $input['deadlineTanggal']
                ]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO tugas (id, kelas, mapel, semester, bab, jumlahSoal, waktu, soal, dibuatTanggal, deadlineTanggal)
                    VALUES (:id, :kelas, :mapel, :semester, :bab, :jumlahSoal, :waktu, :soal, :dibuatTanggal, :deadlineTanggal)");
                $stmt->execute([
                    ':id' => $id,
                    ':kelas' => $input['kelas'],
                    ':mapel' => $input['mapel'],
                    ':semester' => $input['semester'],
                    ':bab' => $input['bab'],
                    ':jumlahSoal' => $input['jumlahSoal'],
                    ':waktu' => $input['waktu'],
                    ':soal' => $soal_json,
                    ':dibuatTanggal' => $dibuatTanggal,
                    ':deadlineTanggal' => $input['deadlineTanggal']
                ]);
            }

            // Buat Notifikasi secara otomatis untuk Siswa di kelas tersebut
            $notif_id = 'n_' . time();
            $notif_judul = "Tugas Baru: " . $input['mapel'];
            $notif_deskripsi = "Tugas baru " . $input['mapel'] . " kelas " . $input['kelas'] . " materi \"" . $input['bab'] . "\" telah tersedia. Segera kerjakan!";
            $stmt_notif = $pdo->prepare("INSERT INTO notifikasi (id, judul, deskripsi, kelas, tanggal, tipe, linkTugasId) 
                VALUES (?, ?, ?, ?, ?, 'tugas', ?)");
            $stmt_notif->execute([$notif_id, $notif_judul, $notif_deskripsi, $input['kelas'], date('c'), $id]);

            sendResponse(["success" => true, "id" => $id]);
        } elseif ($method === 'DELETE') {
            $id = $route_id;
            if (empty($id)) {
                sendResponse(["success" => false, "message" => "ID tugas wajib disertakan."], 400);
            }
            $stmt = $pdo->prepare("DELETE FROM tugas WHERE id = ?");
            $stmt->execute([$id]);
            sendResponse(["success" => true]);
        }
        break;

    case 'jawaban':
        if ($method === 'GET') {
            $tugasId = isset($_GET['tugasId']) ? trim($_GET['tugasId']) : '';
            $siswaId = isset($_GET['siswaId']) ? trim($_GET['siswaId']) : '';
            
            if (!empty($tugasId) && !empty($siswaId)) {
                $stmt = $pdo->prepare("SELECT * FROM jawaban_siswa WHERE tugasId = ? AND siswaId = ?");
                $stmt->execute([$tugasId, $siswaId]);
            } elseif (!empty($tugasId)) {
                $stmt = $pdo->prepare("SELECT * FROM jawaban_siswa WHERE tugasId = ?");
                $stmt->execute([$tugasId]);
            } elseif (!empty($siswaId)) {
                $stmt = $pdo->prepare("SELECT * FROM jawaban_siswa WHERE siswaId = ?");
                $stmt->execute([$siswaId]);
            } else {
                $stmt = $pdo->query("SELECT * FROM jawaban_siswa");
            }
            $jawabans = $stmt->fetchAll();
            foreach ($jawabans as &$j) {
                $j['jawaban'] = json_decode($j['jawaban'], true) ?: [];
            }
            sendResponse($jawabans);
        } elseif ($method === 'POST') {
            $tugasId = isset($input['tugasId']) ? $input['tugasId'] : '';
            $siswaId = isset($input['siswaId']) ? $input['siswaId'] : '';

            $id = isset($input['id']) ? $input['id'] : 'j_' . time();
            $jawaban_json = json_encode(isset($input['jawaban']) ? $input['jawaban'] : []);
            $tanggalSelesai = isset($input['tanggalSelesai']) ? $input['tanggalSelesai'] : date('c');
            $waktuPengerjaanDetik = isset($input['waktuPengerjaanDetik']) ? $input['waktuPengerjaanDetik'] : 0;

            // Cegah double submission / check existence
            $stmt_check = $pdo->prepare("SELECT id FROM jawaban_siswa WHERE tugasId = ? AND siswaId = ?");
            $stmt_check->execute([$tugasId, $siswaId]);
            $existing = $stmt_check->fetch();

            if ($existing) {
                // UPDATE if already exists
                $jawaban_id = $existing['id'];
                $stmt = $pdo->prepare("UPDATE jawaban_siswa SET nilai = :nilai, jawaban = :jawaban, tanggalSelesai = :tanggalSelesai, waktuPengerjaanDetik = :waktuPengerjaanDetik WHERE id = :id");
                $stmt->execute([
                    ':id' => $jawaban_id,
                    ':nilai' => $input['nilai'],
                    ':jawaban' => $jawaban_json,
                    ':tanggalSelesai' => $tanggalSelesai,
                    ':waktuPengerjaanDetik' => $waktuPengerjaanDetik
                ]);
                sendResponse(["success" => true, "id" => $jawaban_id]);
            } else {
                // INSERT new
                $stmt = $pdo->prepare("INSERT INTO jawaban_siswa (id, tugasId, siswaId, namaSiswa, kelas, nilai, jawaban, tanggalSelesai, waktuPengerjaanDetik)
                    VALUES (:id, :tugasId, :siswaId, :namaSiswa, :kelas, :nilai, :jawaban, :tanggalSelesai, :waktuPengerjaanDetik)");
                $stmt->execute([
                    ':id' => $id,
                    ':tugasId' => $tugasId,
                    ':siswaId' => $siswaId,
                    ':namaSiswa' => $input['namaSiswa'],
                    ':kelas' => $input['kelas'],
                    ':nilai' => $input['nilai'],
                    ':jawaban' => $jawaban_json,
                    ':tanggalSelesai' => $tanggalSelesai,
                    ':waktuPengerjaanDetik' => $waktuPengerjaanDetik
                ]);
                sendResponse(["success" => true, "id" => $id]);
            }
        }
        break;

    case 'notifikasi':
        if ($method === 'GET') {
            $kelas = isset($_GET['kelas']) ? trim($_GET['kelas']) : '';
            if (!empty($kelas)) {
                $stmt = $pdo->prepare("SELECT * FROM notifikasi WHERE kelas = ? OR kelas = 'all'");
                $stmt->execute([$kelas]);
            } else {
                $stmt = $pdo->query("SELECT * FROM notifikasi");
            }
            sendResponse($stmt->fetchAll());
        } elseif ($method === 'POST') {
            $id = isset($input['id']) ? $input['id'] : 'n_' . time();
            $stmt = $pdo->prepare("INSERT INTO notifikasi (id, judul, deskripsi, kelas, tanggal, tipe, linkTugasId)
                VALUES (:id, :judul, :deskripsi, :kelas, :tanggal, :tipe, :linkTugasId)");
            $stmt->execute([
                ':id' => $id,
                ':judul' => $input['judul'],
                ':deskripsi' => $input['deskripsi'],
                ':kelas' => isset($input['kelas']) ? $input['kelas'] : '',
                ':tanggal' => isset($input['tanggal']) ? $input['tanggal'] : date('c'),
                ':tipe' => isset($input['tipe']) ? $input['tipe'] : 'info',
                ':linkTugasId' => isset($input['linkTugasId']) ? $input['linkTugasId'] : null
            ]);
            sendResponse(["success" => true, "id" => $id]);
        }
        break;

    case 'presentasi':
        if ($method === 'GET') {
            $stmt = $pdo->query("SELECT * FROM presentasi");
            $presentations = $stmt->fetchAll();
            foreach ($presentations as &$p) {
                $p['slides'] = json_decode($p['slides'], true) ?: [];
            }
            sendResponse($presentations);
        } elseif ($method === 'POST') {
            $id = isset($input['id']) ? $input['id'] : 'p_' . time();
            $slides_json = json_encode(isset($input['slides']) ? $input['slides'] : []);
            $dibuatTanggal = isset($input['dibuatTanggal']) ? $input['dibuatTanggal'] : date('c');
            $bab = isset($input['bab']) ? $input['bab'] : '';
            $tema = isset($input['tema']) ? $input['tema'] : '';

            $stmt_check = $pdo->prepare("SELECT id FROM presentasi WHERE id = ?");
            $stmt_check->execute([$id]);
            $existing = $stmt_check->fetch();

            if ($existing) {
                $stmt = $pdo->prepare("UPDATE presentasi SET judul=:judul, mapel=:mapel, kelas=:kelas, bab=:bab, tema=:tema, slides=:slides WHERE id=:id");
                $stmt->execute([
                    ':id' => $id,
                    ':judul' => $input['judul'],
                    ':mapel' => $input['mapel'],
                    ':kelas' => $input['kelas'],
                    ':bab' => $bab,
                    ':tema' => $tema,
                    ':slides' => $slides_json
                ]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO presentasi (id, judul, mapel, kelas, bab, tema, slides, dibuatTanggal)
                    VALUES (:id, :judul, :mapel, :kelas, :bab, :tema, :slides, :dibuatTanggal)");
                $stmt->execute([
                    ':id' => $id,
                    ':judul' => $input['judul'],
                    ':mapel' => $input['mapel'],
                    ':kelas' => $input['kelas'],
                    ':bab' => $bab,
                    ':tema' => $tema,
                    ':slides' => $slides_json,
                    ':dibuatTanggal' => $dibuatTanggal
                ]);
            }
            sendResponse(["success" => true, "id" => $id]);
        } elseif ($method === 'DELETE') {
            $id = $route_id ?: (isset($_GET['id']) ? $_GET['id'] : '');
            if (!empty($id)) {
                $stmt = $pdo->prepare("DELETE FROM presentasi WHERE id = ?");
                $stmt->execute([$id]);
                sendResponse(["success" => true]);
            }
            sendResponse(["success" => false, "message" => "ID tidak valid"], 400);
        }
        break;

    case 'tka-tasks':
        if ($method === 'GET') {
            $stmt = $pdo->query("SELECT * FROM tka_tasks");
            $tasks = $stmt->fetchAll();
            foreach ($tasks as &$t) {
                $t['questions'] = json_decode($t['questions'], true) ?: [];
                $t['items'] = json_decode($t['items'], true) ?: [];
                $t['soalTka'] = json_decode($t['soalTka'], true) ?: [];
                $t['soal'] = json_decode($t['soal'], true) ?: [];
            }
            
            // Filter by kelas jika ada param
            $kelas = isset($_GET['kelas']) ? trim($_GET['kelas']) : '';
            if (!empty($kelas)) {
                $filtered = [];
                foreach ($tasks as $t) {
                    $task_kelas = isset($t['kelas']) ? $t['kelas'] : '';
                    if (empty($task_kelas)) {
                        $filtered[] = $t;
                    } else {
                        $tk = strtoupper(trim($task_kelas));
                        $qk = strtoupper(trim($kelas));
                        if ($tk === $qk || (strlen($tk) === 1 && strpos($qk, $tk) === 0) || (strlen($qk) === 1 && strpos($tk, $qk) === 0)) {
                            $filtered[] = $t;
                        }
                    }
                }
                sendResponse($filtered);
            }
            sendResponse($tasks);
        } elseif ($method === 'POST') {
            $id = isset($input['id']) ? $input['id'] : 'tka_' . time();
            $items_json = json_encode(isset($input['items']) ? $input['items'] : []);
            $soalTka_json = json_encode(isset($input['soalTka']) ? $input['soalTka'] : []);
            $soal_json = json_encode(isset($input['soal']) ? $input['soal'] : []);
            $questions_json = json_encode(isset($input['questions']) ? $input['questions'] : []);
            $createdAt = isset($input['createdAt']) ? $input['createdAt'] : date('c');
            $createdTanggal = isset($input['createdTanggal']) ? $input['createdTanggal'] : date('c');

            $stmt_check = $pdo->prepare("SELECT id FROM tka_tasks WHERE id = ?");
            $stmt_check->execute([$id]);
            $existing = $stmt_check->fetch();

            if ($existing) {
                $stmt = $pdo->prepare("UPDATE tka_tasks SET 
                    bookId=:bookId, chapterNum=:chapterNum, theme=:theme, totalQuestions=:totalQuestions, 
                    durationMinutes=:durationMinutes, questions=:questions, judul=:judul, deskripsi=:deskripsi, 
                    kelas=:kelas, deadlineTanggal=:deadlineTanggal, items=:items, bidangUji=:bidangUji, 
                    sistemPenilaian=:sistemPenilaian, kkm=:kkm, soalTka=:soalTka, soal=:soal 
                    WHERE id=:id");
                $stmt->execute([
                    ':id' => $id,
                    ':bookId' => isset($input['bookId']) ? $input['bookId'] : null,
                    ':chapterNum' => isset($input['chapterNum']) ? $input['chapterNum'] : null,
                    ':theme' => isset($input['theme']) ? $input['theme'] : null,
                    ':totalQuestions' => isset($input['totalQuestions']) ? $input['totalQuestions'] : null,
                    ':durationMinutes' => isset($input['durationMinutes']) ? $input['durationMinutes'] : null,
                    ':questions' => $questions_json,
                    ':judul' => isset($input['judul']) ? $input['judul'] : null,
                    ':deskripsi' => isset($input['deskripsi']) ? $input['deskripsi'] : null,
                    ':kelas' => isset($input['kelas']) ? $input['kelas'] : null,
                    ':deadlineTanggal' => isset($input['deadlineTanggal']) ? $input['deadlineTanggal'] : null,
                    ':items' => $items_json,
                    ':bidangUji' => isset($input['bidangUji']) ? $input['bidangUji'] : null,
                    ':sistemPenilaian' => isset($input['sistemPenilaian']) ? $input['sistemPenilaian'] : null,
                    ':kkm' => isset($input['kkm']) ? $input['kkm'] : null,
                    ':soalTka' => $soalTka_json,
                    ':soal' => $soal_json
                ]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO tka_tasks (
                    id, bookId, chapterNum, theme, totalQuestions, durationMinutes, questions, createdAt,
                    judul, deskripsi, kelas, deadlineTanggal, items, bidangUji, sistemPenilaian, kkm, soalTka, soal, createdTanggal
                ) VALUES (
                    :id, :bookId, :chapterNum, :theme, :totalQuestions, :durationMinutes, :questions, :createdAt,
                    :judul, :deskripsi, :kelas, :deadlineTanggal, :items, :bidangUji, :sistemPenilaian, :kkm, :soalTka, :soal, :createdTanggal
                )");
                $stmt->execute([
                    ':id' => $id,
                    ':bookId' => isset($input['bookId']) ? $input['bookId'] : null,
                    ':chapterNum' => isset($input['chapterNum']) ? $input['chapterNum'] : null,
                    ':theme' => isset($input['theme']) ? $input['theme'] : null,
                    ':totalQuestions' => isset($input['totalQuestions']) ? $input['totalQuestions'] : null,
                    ':durationMinutes' => isset($input['durationMinutes']) ? $input['durationMinutes'] : null,
                    ':questions' => $questions_json,
                    ':createdAt' => $createdAt,
                    ':judul' => isset($input['judul']) ? $input['judul'] : null,
                    ':deskripsi' => isset($input['deskripsi']) ? $input['deskripsi'] : null,
                    ':kelas' => isset($input['kelas']) ? $input['kelas'] : null,
                    ':deadlineTanggal' => isset($input['deadlineTanggal']) ? $input['deadlineTanggal'] : null,
                    ':items' => $items_json,
                    ':bidangUji' => isset($input['bidangUji']) ? $input['bidangUji'] : null,
                    ':sistemPenilaian' => isset($input['sistemPenilaian']) ? $input['sistemPenilaian'] : null,
                    ':kkm' => isset($input['kkm']) ? $input['kkm'] : null,
                    ':soalTka' => $soalTka_json,
                    ':soal' => $soal_json,
                    ':createdTanggal' => $createdTanggal
                ]);
            }
            sendResponse(["success" => true, "id" => $id]);
        } elseif ($method === 'DELETE') {
            $id = $route_id;
            if (empty($id)) {
                sendResponse(["success" => false, "message" => "ID TKA wajib disertakan."], 400);
            }
            $stmt = $pdo->prepare("DELETE FROM tka_tasks WHERE id = ?");
            $stmt->execute([$id]);

            // Bersihkan juga seluruh jawaban / submisi siswa dari tugas TKA ini
            $stmt_clean = $pdo->prepare("DELETE FROM tka_submissions WHERE tkaTaskId = ? OR taskId = ?");
            $stmt_clean->execute([$id, $id]);

            sendResponse(["success" => true]);
        }
        break;

    case 'tka-submissions':
        if ($method === 'GET') {
            $task_id = isset($_GET['task_id']) ? trim($_GET['task_id']) : '';
            $siswa_id = isset($_GET['siswa_id']) ? trim($_GET['siswa_id']) : '';
            $kelas = isset($_GET['kelas']) ? trim($_GET['kelas']) : '';
            
            $query = "SELECT * FROM tka_submissions WHERE 1=1";
            $params = [];
            
            if (!empty($task_id)) {
                $query .= " AND (tkaTaskId = ? OR taskId = ?)";
                $params[] = $task_id;
                $params[] = $task_id;
            }
            if (!empty($siswa_id)) {
                $query .= " AND siswaId = ?";
                $params[] = $siswa_id;
            }
            if (!empty($kelas)) {
                $query .= " AND (kelasSiswa = ? OR kelas = ?)";
                $params[] = $kelas;
                $params[] = $kelas;
            }
            
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $subs = $stmt->fetchAll();
            foreach ($subs as &$s) {
                $s['answers'] = json_decode($s['answers'], true) ?: [];
                $s['aiFeedback'] = json_decode($s['aiFeedback'], true) ?: null;
                $s['jawabanChecklist'] = json_decode($s['jawabanChecklist'], true) ?: [];
                $s['jawabanUjian'] = json_decode($s['jawabanUjian'], true) ?: [];
                $s['jawabanTka'] = json_decode($s['jawabanTka'], true) ?: [];
            }
            sendResponse($subs);
        } elseif ($method === 'POST') {
            $id = isset($input['id']) ? $input['id'] : 'tkas_' . time();
            
            $answers_json = json_encode(isset($input['answers']) ? $input['answers'] : []);
            $aiFeedback_json = json_encode(isset($input['aiFeedback']) ? $input['aiFeedback'] : null);
            $jawabanChecklist_json = json_encode(isset($input['jawabanChecklist']) ? $input['jawabanChecklist'] : []);
            $jawabanUjian_json = json_encode(isset($input['jawabanUjian']) ? $input['jawabanUjian'] : []);
            $jawabanTka_json = json_encode(isset($input['jawabanTka']) ? $input['jawabanTka'] : []);

            $stmt_check = $pdo->prepare("SELECT id FROM tka_submissions WHERE id = ?");
            $stmt_check->execute([$id]);
            $existing = $stmt_check->fetch();

            if ($existing) {
                $stmt = $pdo->prepare("UPDATE tka_submissions SET 
                    answers=:answers, score=:score, aiFeedback=:aiFeedback, nilai=:nilai, status=:status,
                    catatanGuru=:catatanGuru, dinilaiOleh=:dinilaiOleh WHERE id=:id");
                $stmt->execute([
                    ':id' => $id,
                    ':answers' => $answers_json,
                    ':score' => isset($input['nilai']) ? floatval($input['nilai']) : (isset($input['score']) ? floatval($input['score']) : 0.0),
                    ':aiFeedback' => $aiFeedback_json,
                    ':nilai' => isset($input['nilai']) ? intval($input['nilai']) : null,
                    ':status' => isset($input['status']) ? $input['status'] : 'Belum Dinilai',
                    ':catatanGuru' => isset($input['catatanGuru']) ? $input['catatanGuru'] : null,
                    ':dinilaiOleh' => isset($input['dinilaiOleh']) ? $input['dinilaiOleh'] : null
                ]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO tka_submissions (
                    id, taskId, siswaId, siswaName, kelas, answers, score, aiFeedback, createdAt,
                    tkaTaskId, tkaTaskJudul, namaSiswa, kelasSiswa, jawabanChecklist, catatanAmaliah, 
                    jawabanUjian, jawabanTka, nilai, status, tanggalSubmisi, catatanGuru, dinilaiOleh
                ) VALUES (
                    :id, :taskId, :siswaId, :siswaName, :kelas, :answers, :score, :aiFeedback, :createdAt,
                    :tkaTaskId, :tkaTaskJudul, :namaSiswa, :kelasSiswa, :jawabanChecklist, :catatanAmaliah,
                    :jawabanUjian, :jawabanTka, :nilai, :status, :tanggalSubmisi, :catatanGuru, :dinilaiOleh
                )");
                $stmt->execute([
                    ':id' => $id,
                    ':taskId' => isset($input['tkaTaskId']) ? $input['tkaTaskId'] : (isset($input['taskId']) ? $input['taskId'] : ''),
                    ':siswaId' => isset($input['siswaId']) ? $input['siswaId'] : '',
                    ':siswaName' => isset($input['namaSiswa']) ? $input['namaSiswa'] : (isset($input['siswaName']) ? $input['siswaName'] : ''),
                    ':kelas' => isset($input['kelasSiswa']) ? $input['kelasSiswa'] : (isset($input['kelas']) ? $input['kelas'] : ''),
                    ':answers' => $answers_json,
                    ':score' => isset($input['nilai']) ? floatval($input['nilai']) : (isset($input['score']) ? floatval($input['score']) : 0.0),
                    ':aiFeedback' => $aiFeedback_json,
                    ':createdAt' => isset($input['tanggalSubmisi']) ? $input['tanggalSubmisi'] : (isset($input['createdAt']) ? $input['createdAt'] : date('c')),
                    ':tkaTaskId' => isset($input['tkaTaskId']) ? $input['tkaTaskId'] : null,
                    ':tkaTaskJudul' => isset($input['tkaTaskJudul']) ? $input['tkaTaskJudul'] : null,
                    ':namaSiswa' => isset($input['namaSiswa']) ? $input['namaSiswa'] : null,
                    ':kelasSiswa' => isset($input['kelasSiswa']) ? $input['kelasSiswa'] : null,
                    ':jawabanChecklist' => $jawabanChecklist_json,
                    ':catatanAmaliah' => isset($input['catatanAmaliah']) ? $input['catatanAmaliah'] : null,
                    ':jawabanUjian' => $jawabanUjian_json,
                    ':jawabanTka' => $jawabanTka_json,
                    ':nilai' => isset($input['nilai']) ? intval($input['nilai']) : null,
                    ':status' => isset($input['status']) ? $input['status'] : 'Belum Dinilai',
                    ':tanggalSubmisi' => isset($input['tanggalSubmisi']) ? $input['tanggalSubmisi'] : date('c'),
                    ':catatanGuru' => isset($input['catatanGuru']) ? $input['catatanGuru'] : null,
                    ':dinilaiOleh' => isset($input['dinilaiOleh']) ? $input['dinilaiOleh'] : null
                ]);
            }
            sendResponse(["success" => true, "id" => $id]);
        } elseif ($method === 'PUT') {
            $id = $route_id;
            if (empty($id)) {
                sendResponse(["success" => false, "message" => "ID submisi wajib diisi."], 400);
            }
            $stmt_get = $pdo->prepare("SELECT * FROM tka_submissions WHERE id = ?");
            $stmt_get->execute([$id]);
            $existing = $stmt_get->fetch();
            if (!$existing) {
                sendResponse(["success" => false, "message" => "Submisi tidak ditemukan"], 404);
            }

            $status = isset($input['status']) ? $input['status'] : $existing['status'];
            $nilai = isset($input['nilai']) ? intval($input['nilai']) : $existing['nilai'];
            $catatanGuru = isset($input['catatanGuru']) ? $input['catatanGuru'] : $existing['catatanGuru'];
            $dinilaiOleh = isset($input['dinilaiOleh']) ? $input['dinilaiOleh'] : $existing['dinilaiOleh'];

            $stmt = $pdo->prepare("UPDATE tka_submissions SET 
                status = :status, 
                nilai = :nilai, 
                score = :score,
                catatanGuru = :catatanGuru, 
                dinilaiOleh = :dinilaiOleh 
                WHERE id = :id");
            
            $stmt->execute([
                ':id' => $id,
                ':status' => $status,
                ':nilai' => $nilai,
                ':score' => floatval($nilai),
                ':catatanGuru' => $catatanGuru,
                ':dinilaiOleh' => $dinilaiOleh
            ]);
            sendResponse(["success" => true, "id" => $id]);
        }
        break;

    // ========================================================
    // AI INTEGRATION WITH GOOGLE GEMINI VIA CURL
    // ========================================================

    case 'generate-slideshow':
        if ($method !== 'POST') sendResponse(["success" => false, "message" => "POST required"], 405);

        $mapel = isset($input['mapel']) ? $input['mapel'] : '';
        $kelas = isset($input['kelas']) ? $input['kelas'] : '';
        $bab = isset($input['bab']) ? $input['bab'] : '';
        $materiLengkap = isset($input['materiLengkap']) ? $input['materiLengkap'] : '';
        $tema = isset($input['tema']) ? $input['tema'] : '';
        $judul = isset($input['judul']) ? $input['judul'] : '';

        if (empty($materiLengkap)) {
            $materiLengkap = !empty($tema) ? $tema : (!empty($judul) ? $judul : (!empty($bab) ? $bab : ''));
        }

        $parsed = null;

        if (!hasAI()) {
            $parsed = generateFallbackSlideshowInPHP($mapel, $kelas, $bab, $tema, $judul);
        } else {
            $prompt = "Buat materi presentasi pelajaran $mapel untuk kelas $kelas, bab $bab berdasarkan materi pelajaran berikut:\n\n$materiLengkap\n\nAturan:\n1. Rangkum bab ini menjadi tepat 14 halaman presentasi.\n2. Ambil judul bab, tema serta penjelasannya, poin serta penjelasannya, dan sub-poin serta penjelasannya.\n3. Tambahkan gambar, tentukan keyword gambar yang relevan di tiap slide berdasarkan sub-tema (keyword gambar ditaruh di field 'image_keyword').\n4. Jangan gunakan arahan kurikulum merdeka, KURIKULUM BERBASIS CINTA (KBC) atau PANCACINTA untuk menghindari bias.\n5. Hasilkan respon hanya berupa JSON dengan format:\n{\n  \"judul\": \"Judul Bab\",\n  \"mapel\": \"$mapel\",\n  \"kelas\": \"$kelas\",\n  \"bab\": \"$bab\",\n  \"slides\": [\n    {\n      \"title\": \"Judul Slide\",\n      \"subtitle\": \"Sub Judul Slide\",\n      \"layout\": \"image_highlight\",\n      \"image_keyword\": \"keyword gambar\",\n      \"bullets\": [\"poin 1\", \"poin 2\", \"poin 3\"]\n    }\n  ]\n}";

            $response_text = callAI($prompt);
            $clean_json = extractJsonFromMarkdown($response_text);
            $parsed = json_decode($clean_json, true);
            
            if (!$parsed || !isset($parsed['slides']) || !is_array($parsed['slides'])) {
                $parsed = generateFallbackSlideshowInPHP($mapel, $kelas, $bab, $tema, $judul);
            }
        }

        // Auto-save to `presentasi` table
        $pres_id = 'pres_' . time() . mt_rand(10, 99);
        $slides_json = json_encode($parsed['slides']);
        try {
            $stmt_save = $pdo->prepare("INSERT INTO presentasi (id, judul, mapel, kelas, bab, tema, slides, dibuatTanggal)
                VALUES (:id, :judul, :mapel, :kelas, :bab, :tema, :slides, :dibuatTanggal)");
            $stmt_save->execute([
                ':id' => $pres_id,
                ':judul' => !empty($judul) ? $judul : (isset($parsed['judul']) ? $parsed['judul'] : 'Presentasi ' . $mapel),
                ':mapel' => $mapel,
                ':kelas' => $kelas,
                ':bab' => $bab,
                ':tema' => $tema,
                ':slides' => $slides_json,
                ':dibuatTanggal' => date('c')
            ]);
        } catch (Exception $ex) {
            // Abaikan jika gagal menyimpan, tapi usahakan
        }

        // Return same structure as server.ts
        $allPresentations = [];
        try {
            $stmt_all = $pdo->query("SELECT * FROM presentasi");
            $allPresentations = $stmt_all->fetchAll();
            foreach ($allPresentations as &$p) {
                $p['slides'] = json_decode($p['slides'], true) ?: [];
            }
        } catch (Exception $ex) {}

        sendResponse([
            "slides" => $parsed['slides'],
            "presentationId" => $pres_id,
            "allPresentations" => $allPresentations
        ]);
        break;

    case 'tka-task-generate':
        if ($method !== 'POST') sendResponse(["success" => false, "message" => "POST required"], 405);
        if (!hasAI()) {
            sendResponse(["success" => false, "message" => "API Key belum dikonfigurasi"], 500);
        }

        $bookId = isset($input['bookId']) ? $input['bookId'] : '';
        $chapterNum = isset($input['chapterNum']) ? $input['chapterNum'] : '';
        $theme = isset($input['theme']) ? $input['theme'] : '';
        $textbookReference = isset($input['textbookReference']) ? $input['textbookReference'] : '';
        $totalQuestions = isset($input['totalQuestions']) ? intval($input['totalQuestions']) : 5;
        $durationMinutes = isset($input['durationMinutes']) ? intval($input['durationMinutes']) : 15;

        $prompt = "Hasilkan $totalQuestions pertanyaan esai analitis mendalam tentang tema '$theme' berdasarkan referensi materi buku berikut:\n\n$textbookReference\n\nFormat keluaran harus berupa array JSON dari objek pertanyaan, masing-masing dengan kunci 'id', 'questionText', 'maxScore', dan 'modelAnswerKey'.\n\nHasilkan hanya JSON valid.";

        $response_text = callAI($prompt);
        $clean_json = extractJsonFromMarkdown($response_text);
        $questions = json_decode($clean_json, true) ?: [];

        if (empty($questions)) {
            sendResponse(["success" => false, "message" => "Gagal menghasilkan soal TKA", "raw" => $response_text], 500);
        }

        $id = 'tka_task_' . mt_rand(1000, 9999);
        $stmt = $pdo->prepare("INSERT INTO tka_tasks (id, bookId, chapterNum, theme, totalQuestions, durationMinutes, questions, createdAt)
            VALUES (:id, :bookId, :chapterNum, :theme, :totalQuestions, :durationMinutes, :questions, :createdAt)");
        $stmt->execute([
            ':id' => $id,
            ':bookId' => $bookId,
            ':chapterNum' => $chapterNum,
            ':theme' => $theme,
            ':totalQuestions' => $totalQuestions,
            ':durationMinutes' => $durationMinutes,
            ':questions' => json_encode($questions),
            ':createdAt' => date('c')
        ]);

        sendResponse([
            "id" => $id,
            "bookId" => $bookId,
            "chapterNum" => $chapterNum,
            "theme" => $theme,
            "totalQuestions" => $totalQuestions,
            "durationMinutes" => $durationMinutes,
            "questions" => $questions,
            "createdAt" => date('c')
        ]);
        break;

    case 'tka-task-analyse':
        if ($method !== 'POST') sendResponse(["success" => false, "message" => "POST required"], 405);
        if (!hasAI()) {
            sendResponse(["success" => false, "message" => "API Key missing"], 500);
        }

        $taskId = isset($input['taskId']) ? $input['taskId'] : '';
        $siswaId = isset($input['siswaId']) ? $input['siswaId'] : '';
        $siswaName = isset($input['siswaName']) ? $input['siswaName'] : '';
        $kelas = isset($input['kelas']) ? $input['kelas'] : '';
        $answers = isset($input['answers']) ? $input['answers'] : [];

        // Ambil data TKA Task
        $stmt = $pdo->prepare("SELECT * FROM tka_tasks WHERE id = ?");
        $stmt->execute([$taskId]);
        $task = $stmt->fetch();
        if (!$task) sendResponse(["success" => false, "message" => "Tugas TKA tidak ditemukan"], 404);

        $taskQuestions = json_decode($task['questions'], true) ?: [];

        $prompt = "Evaluasi jawaban esai siswa berikut berdasarkan soal dan kunci jawaban model.\n\nSoal & Jawaban Siswa:\n";
        foreach ($taskQuestions as $q) {
            $qId = $q['id'];
            $ansText = isset($answers[$qId]) ? $answers[$qId] : '';
            $prompt .= "Pertanyaan: {$q['questionText']}\n";
            $prompt .= "Kunci Model: {$q['modelAnswerKey']}\n";
            $prompt .= "Jawaban Siswa: $ansText\n\n";
        }
        $prompt .= "Hasilkan evaluasi dalam format JSON:\n{\n  \"overallScore\": 85.5,\n  \"generalComment\": \"Komentar umum\",\n  \"breakdown\": [\n    {\n      \"questionId\": \"id\",\n      \"score\": 17.5,\n      \"feedback\": \"Umpan balik detail\"\n    }\n  ]\n}";

        $response_text = callAI($prompt);
        $clean_json = extractJsonFromMarkdown($response_text);
        $feedback = json_decode($clean_json, true) ?: [];

        if (empty($feedback)) {
            sendResponse(["success" => false, "message" => "Gagal menganalisa jawaban", "raw" => $response_text], 500);
        }

        $id = 'tka_sub_' . mt_rand(1000, 9999);
        $stmt = $pdo->prepare("INSERT INTO tka_submissions (id, taskId, siswaId, siswaName, kelas, answers, score, aiFeedback, createdAt)
            VALUES (:id, :taskId, :siswaId, :siswaName, :kelas, :answers, :score, :aiFeedback, :createdAt)");
        $stmt->execute([
            ':id' => $id,
            ':taskId' => $taskId,
            ':siswaId' => $siswaId,
            ':siswaName' => $siswaName,
            ':kelas' => $kelas,
            ':answers' => json_encode($answers),
            ':score' => isset($feedback['overallScore']) ? floatval($feedback['overallScore']) : 0.0,
            ':aiFeedback' => json_encode($feedback),
            ':createdAt' => date('c')
        ]);

        sendResponse([
            "id" => $id,
            "taskId" => $taskId,
            "siswaId" => $siswaId,
            "siswaName" => $siswaName,
            "kelas" => $kelas,
            "answers" => $answers,
            "score" => isset($feedback['overallScore']) ? floatval($feedback['overallScore']) : 0.0,
            "aiFeedback" => $feedback,
            "createdAt" => date('c')
        ]);
        break;

    case 'generate-questions':
        if ($method !== 'POST') sendResponse(["success" => false, "message" => "POST required"], 405);
        
        $mapel = isset($input['mapel']) ? $input['mapel'] : '';
        $kelas = isset($input['kelas']) ? $input['kelas'] : '';
        $semester = isset($input['semester']) ? $input['semester'] : '';
        $bab = isset($input['bab']) ? $input['bab'] : '';
        $jumlahSoal = isset($input['jumlahSoal']) ? intval($input['jumlahSoal']) : 5;
        $referensiMateri = isset($input['referensiMateri']) ? $input['referensiMateri'] : '';

        if (!hasAI()) {
            $fallbackQuestions = generateFallbackQuestionsInPHP($mapel, $bab, $jumlahSoal);
            sendResponse([
                "questions" => $fallbackQuestions,
                "fallbackUsed" => true,
                "message" => "Menggunakan soal cadangan karena API Key belum dikonfigurasi di file api.php."
            ]);
        }

        $prompt = "Anda adalah seorang AI pembuat soal ujian profesional untuk Madrasah Tsanawiyah (MTs) Ma'arif NU 7 Sawojajar.\n" .
                  "Buatlah $jumlahSoal butir soal pilihan ganda berkualitas tinggi dalam Bahasa Indonesia dengan nuansa pendidikan Islami Madrasah yang sesuai untuk siswa Kelas $kelas.\n\n" .
                  "Mata Pelajaran: $mapel\n" .
                  "Semester: $semester\n" .
                  "Materi/Bab: $bab\n" .
                  "Referensi Tambahan: $referensiMateri\n\n" .
                  "Aturan:\n" .
                  "1. Soal harus memiliki tepat 4 opsi pilihan ganda yaitu A, B, C, dan D.\n" .
                  "2. Kembalikan data dalam format JSON murni berstruktur berikut:\n" .
                  "{\n" .
                  "  \"questions\": [\n" .
                  "    {\n" .
                  "      \"pertanyaan\": \"Teks pertanyaan di sini\",\n" .
                  "      \"pilihan\": {\n" .
                  "        \"A\": \"Jawaban opsi A\",\n" .
                  "        \"B\": \"Jawaban opsi B\",\n" .
                  "        \"C\": \"Jawaban opsi C\",\n" .
                  "        \"D\": \"Jawaban opsi D\"\n" .
                  "      },\n" .
                  "      \"jawabanBenar\": \"A\"\n" .
                  "    }\n" .
                  "  ]\n" .
                  "}\n\n" .
                  "Pastikan kunci jawaban benar di \"jawabanBenar\" bernilai salah satu dari \"A\", \"B\", \"C\", atau \"D\". Hasilkan hanya JSON murni.";

        $response_text = callAI($prompt);
        $clean_json = extractJsonFromMarkdown($response_text);
        $parsed = json_decode($clean_json, true);

        if ($parsed && isset($parsed['questions']) && is_array($parsed['questions'])) {
            $questions = [];
            foreach ($parsed['questions'] as $i => $q) {
                $questions[] = [
                    "id" => "q_" . time() . "_" . $i,
                    "pertanyaan" => isset($q['pertanyaan']) ? $q['pertanyaan'] : '',
                    "pilihan" => isset($q['pilihan']) ? $q['pilihan'] : ["A" => "", "B" => "", "C" => "", "D" => ""],
                    "jawabanBenar" => isset($q['jawabanBenar']) ? strtoupper($q['jawabanBenar']) : "A"
                ];
            }
            sendResponse(["questions" => $questions]);
        } else {
            $fallbackQuestions = generateFallbackQuestionsInPHP($mapel, $bab, $jumlahSoal);
            sendResponse([
                "questions" => $fallbackQuestions,
                "fallbackUsed" => true,
                "message" => "Gagal memproses respon AI, menggunakan soal cadangan.",
                "raw_error" => $response_text
            ]);
        }
        break;

    default:
        sendResponse(["success" => false, "message" => "API route not found: " . $route], 404);
        break;
}

// ========================================================
// UTILITY FUNCTIONS UNTUK GEMINI API
// ========================================================

function callGeminiAPI($apiKey, $prompt) {
    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $apiKey;

    $postData = [
        "contents" => [
            [
                "parts" => [
                    ["text" => $prompt]
                ]
            ]
        ],
        "generationConfig" => [
            "responseMimeType" => "application/json"
        ]
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);

    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code !== 200) {
        return json_encode([
            "error" => "Gemini API returned code " . $http_code,
            "raw_response" => $response
        ]);
    }

    $parsed_response = json_decode($response, true);
    if (isset($parsed_response['candidates'][0]['content']['parts'][0]['text'])) {
        return $parsed_response['candidates'][0]['content']['parts'][0]['text'];
    }

    return $response;
}

function callGroqAPI($apiKey, $prompt) {
    $url = "https://api.groq.com/openai/v1/chat/completions";

    $postData = [
        "model" => "llama-3.3-70b-versatile",
        "messages" => [
            [
                "role" => "user",
                "content" => $prompt
            ]
        ],
        "response_format" => [
            "type" => "json_object"
        ]
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey
    ]);

    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code !== 200) {
        return json_encode([
            "error" => "Groq API returned code " . $http_code,
            "raw_response" => $response
        ]);
    }

    $parsed_response = json_decode($response, true);
    if (isset($parsed_response['choices'][0]['message']['content'])) {
        return $parsed_response['choices'][0]['message']['content'];
    }

    return $response;
}

function hasAI() {
    global $gemini_api_key, $groq_api_key;
    $has_gemini = (!empty($gemini_api_key) && $gemini_api_key !== 'MASUKKAN_API_KEY_GEMINI_ANDA_DISINI');
    $has_groq = (!empty($groq_api_key) && $groq_api_key !== 'gsk_MASUKKAN_API_KEY_GROQ_ANDA_DISINI');
    return $has_gemini || $has_groq;
}

function callAI($prompt) {
    global $gemini_api_key, $groq_api_key;
    if (!empty($groq_api_key) && $groq_api_key !== 'gsk_MASUKKAN_API_KEY_GROQ_ANDA_DISINI') {
        return callGroqAPI($groq_api_key, $prompt);
    }
    return callGeminiAPI($gemini_api_key, $prompt);
}

function extractJsonFromMarkdown($text) {
    $text = trim($text);
    if (preg_match('/^```(?:json)?\s*([\s\S]*?)\s*```$/i', $text, $matches)) {
        return trim($matches[1]);
    }
    return $text;
}

function generateFallbackQuestionsInPHP($mapel, $bab, $count) {
    $fallbackDb = [
        "Fiqih" => [
            [
                "q" => "Hukum bersuci (taharah) sebelum melaksanakan ibadah shalat wajib lima waktu bagi umat Islam adalah...",
                "a" => "Fardhu Kifayah",
                "b" => "Fardhu 'Ain",
                "c" => "Sunnah Muakkad",
                "d" => "Mubah",
                "ans" => "B"
            ],
            [
                "q" => "Najis mughalladhah dapat disucikan dengan mencucinya sebanyak 7 kali basuhan, salah satu basuhan diantaranya dicampur dengan...",
                "a" => "Sabun wangi",
                "b" => "Tanah atau debu suci",
                "c" => "Air kelapa",
                "d" => "Minyak kasturi",
                "ans" => "B"
            ],
            [
                "q" => "Kotoran hewan menyusui atau kotoran manusia tergolong ke dalam najis...",
                "a" => "Mutawassitah",
                "b" => "Mukhaffafah",
                "c" => "Mugallazah",
                "d" => "Hukmiyah",
                "ans" => "A"
            ],
            [
                "q" => "Di bawah ini yang termasuk salah satu sebab seseorang wajib melakukan mandi besar adalah...",
                "a" => "Buang air kecil",
                "b" => "Selesai masa haid bagi wanita",
                "c" => "Buang angin",
                "d" => "Menyentuh kulit bukan mahram",
                "ans" => "B"
            ],
            [
                "q" => "Bila tidak ditemukan air untuk berwudhu atau dalam keadaan sakit keras, bersuci diganti dengan...",
                "a" => "Istinja",
                "b" => "Tayamum menggunakan debu suci",
                "c" => "Mandi uap",
                "d" => "Berwudhu dengan minyak",
                "ans" => "B"
            ]
        ],
        "Al-Qur'an Hadits" => [
            [
                "q" => "Umat Islam diperintahkan untuk memakan makanan yang halal lagi 'thayyib'. Arti kata thayyib adalah...",
                "a" => "Mahal harganya",
                "b" => "Enak dan manis rasanya",
                "c" => "Baik, bergizi, dan sehat untuk tubuh",
                "d" => "Impor dari luar negeri",
                "ans" => "C"
            ],
            [
                "q" => "Sikap 'Birrul Walidain' yang dianjurkan dalam ajaran Islam memiliki arti...",
                "a" => "Bekerja keras siang malam",
                "b" => "Berbakti kepada kedua orang tua",
                "c" => "Menuntut ilmu sampai ke negeri China",
                "d" => "Saling membantu antar sesama tetangga",
                "ans" => "B"
            ]
        ]
    ];

    $subj = isset($fallbackDb[$mapel]) ? $mapel : "Fiqih";
    $pool = $fallbackDb[$subj];
    $list = [];
    
    for ($i = 0; $i < $count; $i++) {
        $idx = $i % count($pool);
        $q = $pool[$idx];
        $list[] = [
            "id" => "q_fb_" . time() . "_" . $i,
            "pertanyaan" => "Wacana: Pentingnya mempelajari bidang keagamaan secara mendalam.\\n\\n" . $q['q'],
            "pilihan" => [
                "A" => $q['a'],
                "B" => $q['b'],
                "C" => $q['c'],
                "D" => $q['d']
            ],
            "jawabanBenar" => $q['ans']
        ];
    }
    
    return $list;
}

function generateFallbackSlideshowInPHP($mapel, $kelas, $bab, $tema, $judul) {
    $judul_final = !empty($judul) ? $judul : (!empty($bab) ? $bab : "Materi Pembelajaran");
    $tema_final = !empty($tema) ? $tema : "Pendalaman Materi";
    $mapel_final = !empty($mapel) ? $mapel : "Mata Pelajaran";
    $kelas_final = !empty($kelas) ? $kelas : "Umum";

    $slides = [
        [
            "title" => "Selamat Datang di Kelas " . $mapel_final,
            "subtitle" => "Materi: " . $judul_final . " (Kelas " . $kelas_final . ")",
            "layout" => "title_only",
            "image_keyword" => "madrasah classroom school study",
            "bullets" => [
                "Mari kita mulai pelajaran dengan membaca Basmalah bersama.",
                "Tema Pembahasan Hari Ini: " . $tema_final,
                "Fokus: Memahami hakikat, hukum, ketentuan, serta hikmah praktis dari " . $tema_final . "."
            ]
        ],
        [
            "title" => "Tujuan Pembelajaran Hari Ini",
            "subtitle" => "Kompetensi Inti & Kompetensi Dasar",
            "layout" => "bullets_only",
            "image_keyword" => "success goal target islam",
            "bullets" => [
                "1. Menjelaskan pengertian dan hakikat dari " . $tema_final . " secara bahasa dan istilah.",
                "2. Menyebutkan dalil naqli (Al-Qur'an dan Hadits) yang melandasi syariat " . $tema_final . ".",
                "3. Menerapkan ketentuan dan tata cara " . $tema_final . " dengan baik dan benar dalam kehidupan sehari-hari.",
                "4. Memetik hikmah spiritual dan sosial dari ajaran " . $tema_final . "."
            ]
        ],
        [
            "title" => "Pengantar: Apa itu " . $tema_final . "?",
            "subtitle" => "Menyelami Esensi dan Kedudukannya",
            "layout" => "image_highlight",
            "image_keyword" => "nature water clean pure",
            "bullets" => [
                "Secara harfiah, tema ini membahas hal penting dalam " . $mapel_final . " yang wajib dipelajari.",
                "Berfungsi menyempurnakan ibadah kita dan membentuk akhlak mulia.",
                "Sangat erat kaitannya dengan kebersihan batin, ketaatan sosial, dan kepatuhan hukum Allah."
            ]
        ],
        [
            "title" => "Landasan Dalil Al-Qur'an & Hadits",
            "subtitle" => "Dasar Hukum yang Kuat & Mulia",
            "layout" => "bullets_only",
            "image_keyword" => "quran book read learn",
            "bullets" => [
                "Segala hukum di dalam " . $mapel_final . " bersandar pada dalil yang kokoh.",
                "Allah Swt. mencintai hamba-hamba-Nya yang taat, bersuci, dan senantiasa memperbaiki diri.",
                "Rasulullah Saw. bersabda bahwa kesucian dan ketaatan lahir batin adalah sebagian dari iman.",
                "Sebagai siswa madrasah, mengamalkan dalil ini mendatangkan keberkahan luar biasa."
            ]
        ],
        [
            "title" => "Rukun dan Syarat Sah " . $tema_final,
            "subtitle" => "Ketentuan Utama yang Wajib Dipenuhi",
            "layout" => "image_highlight",
            "image_keyword" => "structure foundation strong",
            "bullets" => [
                "Niat yang ikhlas lillahi ta'ala di awal pelaksanaan.",
                "Memenuhi syarat kecakapan (Islam, baligh, berakal sehat).",
                "Melaksanakan seluruh rukun secara tertib dan berurutan (tidak boleh ada yang terlewat)."
            ]
        ],
        [
            "title" => "Tata Cara & Urutan Pelaksanaan",
            "subtitle" => "Langkah-Langkah Praktis Secara Benar",
            "layout" => "bullets_only",
            "image_keyword" => "step progress hand guide",
            "bullets" => [
                "Langkah 1: Membaca Basmalah dan membersihkan diri dari kotoran lahiriah.",
                "Langkah 2: Melafalkan niat khusus sesuai ketentuan " . $tema_final . ".",
                "Langkah 3: Melaksanakan gerakan utama atau rukun inti secara khusyuk.",
                "Langkah 4: Mengakhiri dengan doa syukur dan memohon penerimaan amal dari Allah Swt."
            ]
        ],
        [
            "title" => "Hal-Hal yang Membatalkan / Merusak",
            "subtitle" => "Waspada Terhadap Penghalang Keabsahan",
            "layout" => "bullets_only",
            "image_keyword" => "caution warning stop cross",
            "bullets" => [
                "Adanya hadas besar maupun hadas kecil yang merusak kesucian.",
                "Meninggalkan salah satu rukun fardhu dengan sengaja.",
                "Masuknya hal-hal najis atau tidak suci ke dalam media pelaksanaan.",
                "Hilangnya kesadaran (pingsan, tidur nyenyak) atau berubahnya niat di tengah jalan."
            ]
        ],
        [
            "title" => "Hikmah Spiritual & Kedekatan kepada Allah",
            "subtitle" => "Merasakan Kedamaian Iman",
            "layout" => "image_highlight",
            "image_keyword" => "light sun rays sky cloud",
            "bullets" => [
                "Melatih jiwa agar senantiasa tunduk dan patuh pada syariat-Nya.",
                "Mendapatkan ampunan dosa dan peningkatan derajat di sisi-Nya.",
                "Menenangkan hati dan memperindah ibadah harian kita di hadapan Allah Swt."
            ]
        ],
        [
            "title" => "Hikmah Sosial & Dampak bagi Lingkungan",
            "subtitle" => "Menjadi Rahmatan Lil 'Alamin",
            "layout" => "bullets_only",
            "image_keyword" => "people help community unity",
            "bullets" => [
                "Menumbuhkan rasa persaudaraan dan empati antar sesama umat Muslim.",
                "Menciptakan lingkungan madrasah yang harmonis, bersih, sehat, dan teladan.",
                "Melatih kedisiplinan waktu dan kejujuran dalam segala aktivitas sehari-hari.",
                "Menebarkan energi positif, kedamaian, serta cinta kasih di tengah masyarakat."
            ]
        ],
        [
            "title" => "Penerapan Praktis di Madrasah & Rumah",
            "subtitle" => "Mengamalkan Ilmu Menjadi Karakter Mulia",
            "layout" => "image_highlight",
            "image_keyword" => "family home garden work",
            "bullets" => [
                "Membiasakan hidup bersih secara jasmani dan rohani setiap hari.",
                "Saling mengingatkan antar teman untuk selalu disiplin beribadah tepat waktu.",
                "Menjadikan adab Islami sebagai cermin utama karakter siswa Ma'arif NU."
            ]
        ],
        [
            "title" => "Diskusi Kelompok & Studi Kasus",
            "subtitle" => "Mari Berpikir Kritis dan Berbagi Pendapat",
            "layout" => "bullets_only",
            "image_keyword" => "chat speech bubbles conversation talk",
            "bullets" => [
                "Pertanyaan Diskusi: Bagaimana cara kita menjaga konsistensi amalan " . $tema_final . " di tengah kesibukan sekolah?",
                "Tugas Kelompok: Diskusikan bersama rekan sebangku contoh hambatan nyata dan solusinya.",
                "Tuliskan poin hasil diskusi pada buku catatan Anda untuk dipresentasikan singkat.",
                "Saling memberikan masukan secara santun sesuai adab belajar Islami."
            ]
        ],
        [
            "title" => "Ringkasan & Kesimpulan Utama",
            "subtitle" => "Intisari Pembelajaran Hari Ini",
            "layout" => "bullets_only",
            "image_keyword" => "summary notebook checklist pen",
            "bullets" => [
                "1. " . $tema_final . " adalah bagian integral dari kesempurnaan iman dan diterimanya amal shaleh.",
                "2. Pelaksanaan harus memenuhi syarat, rukun, serta menghindari hal-hal yang membatalkan.",
                "3. Ilmu yang telah dipelajari wajib diiringi dengan niat ikhlas untuk dipraktikkan.",
                "4. Generasi Ma'arif NU adalah generasi yang unggul dalam prestasi dan anggun dalam akhlak."
            ]
        ],
        [
            "title" => "Uji Kompetensi Mandiri (Kuis Kelas)",
            "subtitle" => "Mengukur Pemahaman dan Ketajaman Analisis",
            "layout" => "bullets_only",
            "image_keyword" => "quiz paper exam test question",
            "bullets" => [
                "Soal 1: Sebutkan rukun terpenting dalam pelaksanaan " . $tema_final . "!",
                "Soal 2: Apa dampak buruk jika kita mengabaikan syarat sah pelaksanaan syariat ini?",
                "Catat jawaban singkat Anda dan kumpulkan ke meja guru sebelum kelas berakhir.",
                "Kuis ini bertujuan memantapkan pemahaman tanpa membebani siswa."
            ]
        ],
        [
            "title" => "Doa Penutup Majelis & Berkah Ilmu",
            "subtitle" => "Subhanakallahumma Wa Bihamdika...",
            "layout" => "title_only",
            "image_keyword" => "hands pray sunset serene",
            "bullets" => [
                "Alhamdulillah, proses belajar mengajar kita telah selesai dengan lancar.",
                "Semoga ilmu yang kita dapatkan bermanfaat dunia akhirat dan diridhai Allah Swt.",
                "Sampai jumpa di pertemuan berikutnya. Tetap semangat belajar dan jaga kesehatan!"
            ]
        ]
    ];

    return [
        "judul" => $judul_final,
        "mapel" => $mapel_final,
        "kelas" => $kelas_final,
        "bab" => $judul_final,
        "slides" => $slides
    ];
}
