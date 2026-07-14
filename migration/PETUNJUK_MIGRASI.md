# Panduan Migrasi & Salinan Aplikasi Smart Teacher - MTs Ma'arif NU 7 Sawojajar

Web ini menggunakan frontend react dan backend expres.js
Agar web ini bisa berjalan pada layanan web hosting berbasis server Linux dan Apache yang mendukung situs web berbasis HTML, CSS, JavaScript, PHP, dan MySQL seperti infinityfree.com.
Maka perlu penyesuaian

---

## 🚀 Langkah-Langkah Mendeploy ke InfinityFree

### Langkah 1: Bangun (Build) Proyek Anda
Untuk mengubah kode React menjadi file web statik yang bisa dibaca InfinityFree:
1. buka terminal/command prompt di dalam folder proyek tersebut.
2. Jalankan perintah berikut untuk menginstal dependensi dan membangun aplikasi:
   Pastikan node.js sudah terinstall di komputer anda
   ```bash
   npm install
   npm run build
   ```

5. Perintah ini akan menghasilkan folder baru bernama **`dist`** yang berisi seluruh file situs web yang siap diunggah (termasuk `api.php` dan `.htaccess`).

---

### Langkah 2: Buat & Impor Database di InfinityFree
1. Masuk ke **Client Area InfinityFree** Anda, lalu buka **Control Panel** (cPanel).
2. Cari menu **MySQL Databases** dan buat database baru (misalnya `epiz_xxx_xxx`).
3. Setelah dibuat, catat detail koneksi berikut:
   * **MySQL Hostname** (biasanya berupa alamat IP atau host khusus seperti `sql302.infinityfree.com`)
   * **MySQL Username** (biasanya `epiz_xxxxxxxx`)
   * **MySQL Password** (sandi cPanel Anda)
   * **Database Name** (nama database yang baru Anda buat)
4. Buka **phpMyAdmin** dari cPanel untuk database baru tersebut.
5. Klik menu **Import** (Impor) di bagian atas phpMyAdmin.
6. Klik **Choose File**, pilih file `schema.sql` yang berada di dalam folder `/migration/schema.sql` pada proyek yang Anda unduh.
7. Gulir ke bawah dan klik **Go** atau **Import**. Semua tabel dan data awal madrasah akan langsung terbuat!

---

### Langkah 3: Konfigurasi Database pada `api.php`
1. Buka folder **`dist`** hasil build Anda di komputer.
2. Cari file **`api.php`** lalu buka menggunakan teks editor (seperti Notepad, VS Code, atau Notepad++).
3. Cari baris konfigurasi berikut (biasanya di baris ke-20 sampai 25):
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   define('DB_NAME', 'smart_teacher');
   ```
4. Ubah nilainya sesuai dengan detail database dari InfinityFree Anda pada Langkah 2 di atas:
   ```php
   define('DB_HOST', 'sql302.infinityfree.com'); // Ganti dengan MySQL Hostname dari InfinityFree
   define('DB_USER', 'epiz_xxxxxxxx');          // Ganti dengan MySQL Username dari InfinityFree
   define('DB_PASS', 'SandiAnda123');           // Ganti dengan MySQL Password dari InfinityFree
   define('DB_NAME', 'epiz_xxx_smart_teacher');  // Ganti dengan nama database Anda
   ```
5. Simpan (Save) perubahan file `api.php` tersebut.

---

### Langkah 4: Unggah (Upload) File ke InfinityFree
1. Di cPanel InfinityFree, buka **Online File Manager** (atau gunakan aplikasi FTP Client seperti **FileZilla**).
2. Masuk ke dalam direktori **`htdocs`** (ini adalah folder publik tempat semua file web harus berada).
3. Unggah **SELURUH ISI** yang ada di dalam folder **`dist`** komputer Anda langsung ke dalam folder **`htdocs`** di InfinityFree.
   * *Catatan:* Unggah isinya saja (file-file di dalam `dist` seperti `index.html`, `api.php`, `.htaccess`, dan folder `assets`), **bukan** folder `dist`-nya sendiri. Hal ini penting agar situs web Anda langsung terbuka saat pengunjung mengakses domain Anda.
4. Pastikan file `.htaccess` juga terunggah dengan sukses (biasanya file berawalan titik tersembunyi, pastikan opsi "Show Hidden Files" diaktifkan jika menggunakan File Manager).

---

## 🎉 Selesai!
Sekarang buka domain situs web InfinityFree Anda (misalnya `http://nama-situs-anda.infinityfreeapp.com`).
* Situs web Anda akan tampil dengan antarmuka yang modern dan elegan!
* Login menggunakan data guru atau siswa yang sudah ada di database MySQL Anda (misalnya guru `anisa` sandi `123`, siswa `fauzi` sandi `123`).
* Kuis interaktif, pengelolaan buku, TKA (Tugas Keagamaan Amaliah) dengan rubrik modern, dan fitur presentasi otomatis akan berfungsi dengan sempurna!
