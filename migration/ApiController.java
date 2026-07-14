package com.madrasah.smartteacher.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.*;

/**
 * Controller Java Spring Boot untuk Backend Aplikasi Smart Teacher
 * Mengelola integrasi API dengan database MySQL untuk sekolah MTs Ma'arif NU 7 Sawojajar
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // 1. API: LOGIN ENDPOINT
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");
        String role = payload.get("role");

        Map<String, Object> response = new HashMap<>();

        if (username == null || username.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Nama pengguna harus diisi.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Admin default check
        if ("admin".equalsIgnoreCase(role) || "admin".equalsIgnoreCase(username)) {
            if (password != null && !password.equals("admin") && !password.equals("admin123") && !password.equals("123")) {
                response.put("success", false);
                response.put("message", "Sandi administrator salah.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            response.put("success", true);
            response.put("role", "admin");
            
            Map<String, Object> adminUser = new HashMap<>();
            adminUser.put("id", "admin");
            adminUser.put("username", "admin");
            adminUser.put("nama", "Administrator Utama");
            adminUser.put("foto", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60");
            response.put("user", adminUser);
            return ResponseEntity.ok(response);
        }

        if ("guru".equalsIgnoreCase(role)) {
            String sql = "SELECT * FROM guru WHERE LOWER(username) = LOWER(?)";
            List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, username);
            if (results.isEmpty()) {
                response.put("success", false);
                response.put("message", "Username guru tidak ditemukan.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            Map<String, Object> guru = results.get(0);
            String dbPass = (String) guru.getOrDefault("password", "123");
            if (password != null && !dbPass.equals(password)) {
                response.put("success", false);
                response.put("message", "Sandi salah.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            response.put("success", true);
            response.put("role", "guru");
            response.put("user", guru);
            return ResponseEntity.ok(response);
        } else {
            String sql = "SELECT * FROM siswa WHERE LOWER(username) = LOWER(?)";
            List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, username);
            if (results.isEmpty()) {
                response.put("success", false);
                response.put("message", "Username siswa tidak ditemukan.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            Map<String, Object> siswa = results.get(0);
            String dbPass = (String) siswa.getOrDefault("password", "123");
            if (password != null && !dbPass.equals(password)) {
                response.put("success", false);
                response.put("message", "Sandi salah.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            response.put("success", true);
            response.put("role", "siswa");
            response.put("user", siswa);
            return ResponseEntity.ok(response);
        }
    }

    // 2. API: AMBIL DAFTAR SISWA (GET STUDENTS)
    @GetMapping("/students")
    public ResponseEntity<List<Map<String, Object>>> getStudents(@RequestParam(value = "kelas", required = false) String kelas) {
        String sql;
        List<Map<String, Object>> students;
        if (kelas != null && !kelas.trim().isEmpty()) {
            sql = "SELECT * FROM siswa WHERE kelas = ?";
            students = jdbcTemplate.queryForList(sql, kelas);
        } else {
            sql = "SELECT * FROM siswa";
            students = jdbcTemplate.queryForList(sql);
        }
        return ResponseEntity.ok(students);
    }

    // 3. API: TAMBAH SISWA BARU (POST STUDENT)
    @PostMapping("/students")
    public ResponseEntity<Map<String, Object>> addStudent(@RequestBody Map<String, Object> payload) {
        String id = "s_" + System.currentTimeMillis();
        String sql = "INSERT INTO siswa (id, username, nama, kelas, alamat, cita_cita, moto_hidup, foto, password, no_hp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        jdbcTemplate.update(sql,
                id,
                payload.get("username"),
                payload.get("nama"),
                payload.get("kelas"),
                payload.getOrDefault("alamat", ""),
                payload.getOrDefault("citaCita", ""),
                payload.getOrDefault("motoHidup", ""),
                payload.getOrDefault("foto", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60"),
                payload.getOrDefault("password", "123"),
                payload.getOrDefault("noHp", "")
        );
        
        payload.put("id", id);
        return ResponseEntity.status(HttpStatus.CREATED).body(payload);
    }

    // 4. API: AMBIL DAFTAR BUKU DAN MATERI (GET BOOKS & CHAPTERS)
    @GetMapping("/books")
    public ResponseEntity<List<Map<String, Object>>> getBooks() {
        String sqlBooks = "SELECT * FROM buku";
        List<Map<String, Object>> books = jdbcTemplate.queryForList(sqlBooks);
        
        for (Map<String, Object> book : books) {
            String bookId = (String) book.get("id");
            String sqlBab = "SELECT nomor, judul, konten FROM bab WHERE buku_id = ? ORDER BY nomor ASC";
            List<Map<String, Object>> babs = jdbcTemplate.queryForList(sqlBab, bookId);
            book.put("bab", babs);
        }
        return ResponseEntity.ok(books);
    }
}
