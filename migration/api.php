<?php
/**
 * REST API Backend PHP untuk Smart Teacher - MTs Ma'arif NU 7 Sawojajar
 * File ini menangani koneksi database MySQL dan menyediakan API endpoints dalam format JSON
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ==================== KONFIGURASI DATABASE MYSQL ====================
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'smart_teacher');

try {
    $db = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Koneksi database gagal: " . $e->getMessage()
    ]);
    exit();
}

// Parsing URI request
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Helper untuk membaca input JSON POST
function getJsonInput() {
    return json_decode(file_get_contents("php://input"), true) ?: [];
}

// Router sederhana berbasis endpoint
// Catatan: Anda dapat menyesuaikan htaccess atau routing web server agar mengarah ke file ini
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

switch ($endpoint) {
    
    // ------------------ API: LOGIN ------------------
    case 'login':
        if ($requestMethod !== 'POST') {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
            break;
        }
        $data = getJsonInput();
        $username = isset($data['username']) ? trim($data['username']) : '';
        $password = isset($data['password']) ? $data['password'] : '';
        $role = isset($data['role']) ? $data['role'] : 'siswa';

        if (empty($username)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Nama pengguna harus diisi."]);
            break;
        }

        if ($role === 'admin' || strtolower($username) === 'admin') {
            if ($password && $password !== 'admin' && $password !== 'admin123' && $password !== '123') {
                http_response_code(401);
                echo json_encode(["success" => false, "message" => "Sandi administrator salah."]);
                break;
            }
            echo json_encode([
                "success" => true,
                "role" => "admin",
                "user" => [
                    "id" => "admin",
                    "username" => "admin",
                    "nama" => "Administrator Utama",
                    "nuptk" => "197001012026011001",
                    "mapel" => "Semua",
                    "foto" => "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60"
                ]
            ]);
            break;
        }

        if ($role === 'guru') {
            $stmt = $db->prepare("SELECT * FROM guru WHERE LOWER(username) = ?");
            $stmt->execute([strtolower($username)]);
            $user = $stmt->fetch();

            if ($user) {
                $dbPass = isset($user['password']) ? $user['password'] : '123';
                if ($password && $dbPass !== $password) {
                    http_response_code(401);
                    echo json_encode(["success" => false, "message" => "Sandi salah."]);
                    break;
                }
                // Decode JSON kelas_diajar jika ada
                $user['kelasDiajar'] = json_decode($user['kelas_diajar'], true) ?: [];
                echo json_encode(["success" => true, "role" => "guru", "user" => $user]);
            } else {
                http_response_code(401);
                echo json_encode(["success" => false, "message" => "Username guru tidak ditemukan."]);
            }
        } else {
            $stmt = $db->prepare("SELECT * FROM siswa WHERE LOWER(username) = ?");
            $stmt->execute([strtolower($username)]);
            $user = $stmt->fetch();

            if ($user) {
                $dbPass = isset($user['password']) ? $user['password'] : '123';
                if ($password && $dbPass !== $password) {
                    http_response_code(401);
                    echo json_encode(["success" => false, "message" => "Sandi salah."]);
                    break;
                }
                echo json_encode(["success" => true, "role" => "siswa", "user" => $user]);
            } else {
                http_response_code(401);
                echo json_encode(["success" => false, "message" => "Username siswa tidak ditemukan."]);
            }
        }
        break;

    // ------------------ API: SISWA (STUDENTS) ------------------
    case 'students':
        if ($requestMethod === 'GET') {
            $kelas = isset($_GET['kelas']) ? $_GET['kelas'] : '';
            if ($kelas) {
                $stmt = $db->prepare("SELECT * FROM siswa WHERE kelas = ?");
                $stmt->execute([$kelas]);
            } else {
                $stmt = $db->query("SELECT * FROM siswa");
            }
            echo json_encode($stmt->fetchAll());
        } elseif ($requestMethod === 'POST') {
            $data = getJsonInput();
            $id = 's_' . round(microtime(true) * 1000);
            $stmt = $db->prepare("INSERT INTO siswa (id, username, nama, kelas, alamat, cita_cita, moto_hidup, foto, password, no_hp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $id,
                $data['username'],
                $data['nama'],
                $data['kelas'],
                isset($data['alamat']) ? $data['alamat'] : '',
                isset($data['citaCita']) ? $data['citaCita'] : '',
                isset($data['motoHidup']) ? $data['motoHidup'] : '',
                isset($data['foto']) ? $data['foto'] : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
                isset($data['password']) ? $data['password'] : '123',
                isset($data['noHp']) ? $data['noHp'] : ''
            ]);
            $data['id'] = $id;
            http_response_code(201);
            echo json_encode($data);
        }
        break;

    // ------------------ API: GURU (TEACHERS) ------------------
    case 'teachers':
        if ($requestMethod === 'GET') {
            $stmt = $db->query("SELECT * FROM guru");
            $teachers = $stmt->fetchAll();
            foreach ($teachers as &$t) {
                $t['kelasDiajar'] = json_decode($t['kelas_diajar'], true) ?: [];
            }
            echo json_encode($teachers);
        } elseif ($requestMethod === 'POST') {
            $data = getJsonInput();
            $id = 'g_' . round(microtime(true) * 1000);
            $kelas_diajar_json = json_encode(isset($data['kelasDiajar']) ? $data['kelasDiajar'] : []);
            
            $stmt = $db->prepare("INSERT INTO guru (id, username, nama, nuptk, mapel, foto, kelas_diajar, password, no_hp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $id,
                $data['username'],
                $data['nama'],
                isset($data['nuptk']) ? $data['nuptk'] : '',
                $data['mapel'],
                isset($data['foto']) ? $data['foto'] : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
                $kelas_diajar_json,
                isset($data['password']) ? $data['password'] : '123',
                isset($data['noHp']) ? $data['noHp'] : ''
            ]);
            $data['id'] = $id;
            http_response_code(201);
            echo json_encode($data);
        }
        break;

    // ------------------ API: BUKU (BOOKS) ------------------
    case 'books':
        if ($requestMethod === 'GET') {
            $stmt = $db->query("SELECT * FROM buku");
            $books = $stmt->fetchAll();
            foreach ($books as &$b) {
                $subStmt = $db->prepare("SELECT nomor, judul, konten FROM bab WHERE buku_id = ? ORDER BY nomor ASC");
                $subStmt->execute([$b['id']]);
                $b['bab'] = $subStmt->fetchAll();
            }
            echo json_encode($books);
        }
        break;

    // ------------------ API: TUGAS (ASSIGNMENTS) ------------------
    case 'assignments':
        if ($requestMethod === 'GET') {
            $kelas = isset($_GET['kelas']) ? $_GET['kelas'] : '';
            if ($kelas) {
                $stmt = $db->prepare("SELECT * FROM tugas WHERE kelas = ?");
                $stmt->execute([$kelas]);
            } else {
                $stmt = $db->query("SELECT * FROM tugas");
            }
            $tugasList = $stmt->fetchAll();
            foreach ($tugasList as &$t) {
                $subStmt = $db->prepare("SELECT id, pertanyaan, opsi_a as A, opsi_b as B, opsi_c as C, opsi_d as D, jawaban_benar as jawabanBenar FROM soal WHERE tugas_id = ?");
                $subStmt->execute([$t['id']]);
                $t['soal'] = $subStmt->fetchAll();
                // Format ulang pilihan agar sesuai struktur frontend
                foreach ($t['soal'] as &$s) {
                    $s['pilihan'] = [
                        "A" => $s['A'],
                        "B" => $s['B'],
                        "C" => $s['C'],
                        "D" => $s['D']
                    ];
                    unset($s['A'], $s['B'], $s['C'], $s['D']);
                }
            }
            echo json_encode($tugasList);
        }
        break;

    // ------------------ DEFAULT ENDPOINT ------------------
    default:
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Endpoint API tidak ditemukan. Gunakan parameter ?endpoint=login, ?endpoint=students, ?endpoint=teachers, ?endpoint=books, atau ?endpoint=assignments"
        ]);
        break;
}
?>
