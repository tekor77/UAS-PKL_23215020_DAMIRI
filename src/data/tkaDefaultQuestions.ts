import { SoalTka } from "../types";

const getTkaDefaultQuestionsBase = (
  bidang: "Matematika (Numerasi)" | "Bahasa Indonesia (Literasi Membaca)",
  kelas: string
): SoalTka[] => {
  const isMath = bidang.includes("Matematika") || bidang.includes("Numerasi");
  const grade = kelas.replace(/\D/g, "") || "7"; // extract digits, default 7

  if (isMath) {
    if (grade === "7") {
      return [
        {
          id: "m7-q1",
          pertanyaan: "Seorang petani membagikan hasil panen padi kepada 3 kelompok warga. Kelompok pertama menerima 3/8 bagian, kelompok kedua menerima 2/5 bagian, dan sisanya untuk kelompok ketiga. Jika total panen padi adalah 1.200 kg, berapakah berat padi yang diterima oleh kelompok ketiga?",
          pilihan: {
            A: "270 kg",
            B: "340 kg",
            C: "450 kg",
            D: "480 kg"
          },
          jawabanBenar: "A",
          tipe: "Pilihan Ganda",
          level: "Level 2",
          bobotIrt: 4.2
        },
        {
          id: "m7-q2",
          pertanyaan: "Sebuah peta memiliki skala 1:250.000. Jarak kota A ke kota B pada peta adalah 8 cm. Berdasarkan informasi ini, tentukan kebenaran dari pernyataan berikut:",
          pilihan: {
            A: "Pernyataan 1: Jarak sebenarnya adalah 20 km. (Benar)",
            B: "Pernyataan 2: Jika ditempuh dengan motor berkecepatan 40 km/jam, butuh waktu 30 menit. (Salah)"
          },
          jawabanBenar: "A",
          tipe: "Benar/Salah",
          level: "Level 1",
          bobotIrt: 3.1
        },
        {
          id: "m7-q3",
          pertanyaan: "Suatu panti asuhan memiliki persediaan beras yang cukup untuk 40 anak selama 15 hari. Jika panti asuhan tersebut kedatangan 10 anak baru, persediaan beras akan habis dalam waktu...",
          pilihan: {
            A: "12 hari",
            B: "11 hari",
            C: "10 hari",
            D: "9 hari"
          },
          jawabanBenar: "A",
          tipe: "Pilihan Ganda",
          level: "Level 2",
          bobotIrt: 4.0
        },
        {
          id: "m7-q4",
          pertanyaan: "Manakah dari relasi bilangan berikut yang memiliki rasio senilai dengan perbandingan harga 5 buku seharga Rp 15.000? (Pilih semua jawaban yang benar)",
          pilihan: {
            A: "3 buku seharga Rp 9.000",
            B: "8 buku seharga Rp 24.000",
            C: "10 buku seharga Rp 28.000",
            D: "12 buku seharga Rp 36.000"
          },
          jawabanBenar: "A,B,D",
          tipe: "Pilihan Ganda Kompleks",
          level: "Level 3",
          bobotIrt: 5.5
        },
        {
          id: "m7-q5",
          pertanyaan: "Sebuah taman berbentuk persegi panjang dengan ukuran panjang (2x + 5) meter dan lebar (x + 2) meter. Jika keliling taman adalah 44 meter, berapakah nilai x dan luas taman tersebut?",
          pilihan: {
            A: "x = 5, Luas = 105 m²",
            B: "x = 5, Luas = 98 m²",
            C: "x = 6, Luas = 120 m²",
            D: "x = 4, Luas = 104 m²"
          },
          jawabanBenar: "A",
          tipe: "Pilihan Ganda",
          level: "Level 3",
          bobotIrt: 5.8
        }
      ];
    } else if (grade === "8") {
      return [
        {
          id: "m8-q1",
          pertanyaan: "Perhatikan pola bilangan berikut: 3, 7, 15, 31, 63, ... Tentukan rumus suku ke-n (Un) dari barisan tersebut.",
          pilihan: {
            A: "Un = 2^(n+1) - 1",
            B: "Un = 2^n + 1",
            C: "Un = 3^n - n",
            D: "Un = 4n - 1"
          },
          jawabanBenar: "A",
          tipe: "Pilihan Ganda",
          level: "Level 3",
          bobotIrt: 4.9
        },
        {
          id: "m8-q2",
          pertanyaan: "Sebuah tangga sepanjang 10 meter disandarkan pada dinding tembok. Jarak ujung bawah tangga dengan dinding adalah 6 meter. Berapakah tinggi dinding yang dicapai oleh ujung atas tangga?",
          pilihan: {
            A: "8 meter",
            B: "7 meter",
            C: "6.5 meter",
            D: "9 meter"
          },
          jawabanBenar: "A",
          tipe: "Pilihan Ganda",
          level: "Level 1",
          bobotIrt: 3.0
        },
        {
          id: "m8-q3",
          pertanyaan: "Sebuah limas memiliki alas berbentuk persegi dengan panjang rusuk 12 cm. Jika tinggi limas tersebut adalah 8 cm, berapakah luas permukaan limas tersebut seluruhnya?",
          pilihan: {
            A: "384 cm²",
            B: "420 cm²",
            C: "240 cm²",
            D: "324 cm²"
          },
          jawabanBenar: "A",
          tipe: "Pilihan Ganda",
          level: "Level 2",
          bobotIrt: 4.5
        },
        {
          id: "m8-q4",
          pertanyaan: "Manakah pernyataan yang BENAR mengenai sistem persamaan linear dua variabel berikut: 2x + y = 8 dan x - y = 1? (Pilih semua yang benar)",
          pilihan: {
            A: "Nilai x adalah 3",
            B: "Nilai y adalah 2",
            C: "Nilai dari 3x + 2y adalah 13",
            D: "Titik potong kedua garis berada di koordinat (3, 2)"
          },
          jawabanBenar: "A,B,C,D",
          tipe: "Pilihan Ganda Kompleks",
          level: "Level 2",
          bobotIrt: 5.0
        },
        {
          id: "m8-q5",
          pertanyaan: "Titik K(3, -5) ditranslasikan oleh T(2, 4), kemudian direfleksikan terhadap sumbu X. Di manakah posisi koordinat bayangan akhir dari titik K?",
          pilihan: {
            A: "K''(5, 1)",
            B: "K''(5, -1)",
            C: "K''(-5, 1)",
            D: "K''(1, 5)"
          },
          jawabanBenar: "A",
          tipe: "Pilihan Ganda",
          level: "Level 3",
          bobotIrt: 5.6
        }
      ];
    } else { // Kelas 9
      return [
        {
          id: "m9-q1",
          pertanyaan: "Sebuah kotak berisi 5 bola merah, 3 bola kuning, dan 2 bola hijau. Jika diambil sebuah bola secara acak, berapakah peluang terambilnya bola yang bukan berwarna merah?",
          pilihan: {
            A: "1/2",
            B: "3/10",
            C: "1/5",
            D: "3/5"
          },
          jawabanBenar: "A",
          tipe: "Pilihan Ganda",
          level: "Level 2",
          bobotIrt: 4.1
        },
        {
          id: "m9-q2",
          pertanyaan: "Diberikan sekumpulan data hasil ujian matematika: 60, 75, 80, 85, 70, 90, 80. Berdasarkan data tersebut, manakah analisis statistik yang benar?",
          pilihan: {
            A: "Pernyataan 1: Rata-rata (mean) data tersebut adalah 77.1 (Benar)",
            B: "Pernyataan 2: Median data tersebut adalah 85. (Salah)"
          },
          jawabanBenar: "A",
          tipe: "Benar/Salah",
          level: "Level 2",
          bobotIrt: 3.8
        },
        {
          id: "m9-q3",
          pertanyaan: "Sebuah tabung memiliki jari-jari alas 7 cm dan tinggi 10 cm. Di dalam tabung dimasukkan sebuah kerucut dengan diameter alas dan tinggi yang sama dengan tabung. Berapakah volume sisa ruang tabung di luar kerucut tersebut?",
          pilihan: {
            A: "1.026,67 cm³",
            B: "1.540 cm³",
            C: "513,33 cm³",
            D: "2.053,33 cm³"
          },
          jawabanBenar: "A",
          tipe: "Pilihan Ganda",
          level: "Level 3",
          bobotIrt: 5.9
        },
        {
          id: "m9-q4",
          pertanyaan: "Persamaan kuadrat x² - 5x + 6 = 0 memiliki akar-akar x1 dan x2. Manakah sifat-sifat persamaan kuadrat berikut yang benar? (Pilih semua yang benar)",
          pilihan: {
            A: "Akar-akarnya adalah x = 2 dan x = 3",
            B: "Hasil penjumlahan akar-akar (x1 + x2) adalah 5",
            C: "Hasil perkalian akar-akar (x1 * x2) adalah 6",
            D: "Diskriminan (D) bernilai 1"
          },
          jawabanBenar: "A,B,C,D",
          tipe: "Pilihan Ganda Kompleks",
          level: "Level 2",
          bobotIrt: 4.8
        },
        {
          id: "m9-q5",
          pertanyaan: "Sebuah balon udara berbentuk bola memiliki volume 36π m³. Jika balon tersebut dipompa sehingga jari-jarinya menjadi dua kali lipat, berapakah volume balon udara yang baru?",
          pilihan: {
            A: "288π m³",
            B: "144π m³",
            C: "72π m³",
            D: "576π m³"
          },
          jawabanBenar: "A",
          tipe: "Pilihan Ganda",
          level: "Level 3",
          bobotIrt: 5.7
        }
      ];
    }
  } else {
    // Bahasa Indonesia (Literasi Membaca)
    if (grade === "7") {
      const s1 = "Wacana 1: Hutan mangrove merupakan ekosistem penting di kawasan pesisir Indonesia. Selain berfungsi sebagai penahan abrasi pantai dari gelombang air laut, mangrove juga menjadi habitat berkembang biak berbagai jenis ikan, kepiting, dan burung air. Mangrove memiliki kemampuan luar biasa dalam menyerap karbon dioksida dari udara, menyimpannya di dalam tanah liat pesisir dalam jumlah yang jauh lebih besar dibanding hutan tropis biasa. Sayangnya, alih fungsi lahan mangrove menjadi tambak udang komersial dan pemukiman terus mengancam keberlangsungan ekosistem pelindung pantai ini.";
      const s2 = "Wacana 2: Di era digital ini, keamanan data pribadi di internet menjadi sangat krusial. Kebocoran data sering kali terjadi akibat kecerobohan pengguna seperti menggunakan kata sandi yang mudah ditebak, menggunakan jaringan Wi-Fi publik tanpa VPN, atau mengeklik tautan phising. Penggunaan autentikasi dua faktor (2FA) dan kesadaran digital dapat meminimalisir risiko peretasan akun pribadi.";
      const s3 = "Wacana 3: Sarapan pagi sering kali dilewatkan oleh remaja dengan alasan terburu-buru pergi ke sekolah atau tidak merasa lapar di pagi hari. Padahal, sarapan menyediakan glukosa yang sangat dibutuhkan otak untuk berkonsentrasi saat belajar di kelas. Remaja yang rutin sarapan memiliki tingkat kefokusan lebih tinggi, emosi yang lebih stabil, dan metabolisme tubuh yang lebih sehat.";
      const s4 = "Wacana 4: Karapan Sapi merupakan festival perlombaan pacuan sapi khas suku Madura, Jawa Timur. Selain menjadi ajang pesta rakyat yang melestarikan tradisi nenek moyang, festival ini memiliki nilai prestise sosial yang tinggi bagi pemilik sapi. Sapi karapan dirawat secara khusus dengan pakan berkualitas tinggi, jamu herbal tradisional, dan pijatan rutin sebelum perlombaan dimulai.";
      const s5 = "Wacana 5: Energi angin merupakan salah satu energi terbarukan paling potensial di daerah pesisir Indonesia yang memiliki garis pantai panjang. Dengan menggunakan kincir atau turbin angin, embusan angin diubah menjadi energi kinetik lalu menjadi listrik. PLTB Sidrap di Sulawesi Selatan adalah salah satu contoh sukses pemanfaatan energi ramah lingkungan ini.";

      return [
        {
          id: "b7-q1",
          pertanyaan: `${s1}\n\nBerdasarkan wacana 1 di atas, fungsi utama ekosistem hutan mangrove bagi lingkungan fisik pesisir pantai adalah...`,
          pilihan: {
            A: "Menjadi kawasan budidaya tambak udang komersial berskala besar",
            B: "Sebagai penahan abrasi pantai dari gelombang air laut",
            C: "Menyediakan kayu bakar yang murah bagi warga sekitar pantai",
            D: "Mengurangi kadar garam air laut agar bisa langsung dimakan"
          },
          jawabanBenar: "B",
          tipe: "Pilihan Ganda",
          level: "Level 1",
          bobotIrt: 3.0
        },
        {
          id: "b7-q2",
          pertanyaan: `${s2}\n\nTentukan kebenaran pernyataan berikut mengenai keamanan data digital berdasarkan wacana 2:`,
          pilihan: {
            A: "Pernyataan 1: Kebocoran data pribadi sebagian besar dipicu oleh faktor kelalaian pengguna. (Benar)",
            B: "Pernyataan 2: Menggunakan Wi-Fi publik tanpa pengaman (VPN) dinilai sangat aman dan dianjurkan. (Salah)"
          },
          jawabanBenar: "A",
          tipe: "Benar/Salah",
          level: "Level 2",
          bobotIrt: 3.5
        },
        {
          id: "b7-q3",
          pertanyaan: `${s3}\n\nApa dampak utama melewatkan sarapan pagi bagi performa belajar siswa berdasarkan wacana 3?`,
          pilihan: {
            A: "Meningkatkan nafsu makan di siang hari secara drastis",
            B: "Menurunkan konsentrasi belajar karena kekurangan glukosa untuk otak",
            C: "Mempercepat metabolisme tubuh siswa secara keseluruhan",
            D: "Mengurangi berat badan siswa secara signifikan"
          },
          jawabanBenar: "B",
          tipe: "Pilihan Ganda",
          level: "Level 3",
          bobotIrt: 4.8
        },
        {
          id: "b7-q4",
          pertanyaan: `${s4}\n\nManakah pernyataan berikut yang RELEVAN dengan isi wacana 4 tentang Karapan Sapi? (Pilih semua yang benar)`,
          pilihan: {
            A: "Karapan Sapi merupakan budaya tradisional khas suku Madura",
            B: "Perlombaan ini meningkatkan prestise sosial para pemilik sapi",
            C: "Sapi karapan dirawat secara khusus dengan pakan berkualitas dan jamu",
            D: "Sapi karapan dibiarkan liar tanpa perlu perawatan khusus"
          },
          jawabanBenar: "A,B,C",
          tipe: "Pilihan Ganda Kompleks",
          level: "Level 2",
          bobotIrt: 4.0
        },
        {
          id: "b7-q5",
          pertanyaan: `${s5}\n\nMengapa energi angin dikategorikan sebagai energi terbarukan berdasarkan wacana 5?`,
          pilihan: {
            A: "Karena angin dapat terus diproduksi dari mesin generator buatan manusia",
            B: "Karena ketersediaan angin di alam melimpah, tidak akan habis, dan ramah lingkungan",
            C: "Karena ia menghasilkan polusi udara yang bermanfaat menghangatkan laut",
            D: "Karena ia memerlukan bahan bakar fosil untuk menggerakkan turbin angin"
          },
          jawabanBenar: "B",
          tipe: "Pilihan Ganda",
          level: "Level 3",
          bobotIrt: 5.1
        }
      ];
    } else if (grade === "8") {
      const s1 = "Wacana 1: Penggunaan plastik sekali pakai di lingkungan urban telah mencapai titik kritis. Setiap harinya, ribuan ton sampah plastik berakhir di tempat pembuangan akhir dan sebagian besar bocor ke aliran sungai hingga bermuara di laut. Plastik membutuhkan waktu ratusan tahun untuk terurai secara alami, dan dalam prosesnya, ia pecah menjadi partikel mikroskopis bernama mikroplastik. Mikroplastik ini kini terdeteksi dalam tubuh ikan, garam dapur, bahkan air minum kemasan yang dikonsumsi manusia sehari-hari.";
      const s2 = "Wacana 2: Candi Borobudur yang megah di Magelang, Jawa Tengah, merupakan monumen Buddha terbesar di dunia. Dibangun pada masa Dinasti Syailendra abad ke-9, candi ini menggunakan teknik susun batu andesit presisi tanpa semen. Relief-relief di dinding candi tidak hanya menggambarkan kisah spiritual Buddha, tetapi juga merekam dinamika kehidupan sosial, maritim, dan budaya masyarakat Jawa kuno pada masa lampau.";
      const s3 = "Wacana 3: Gerhana matahari terjadi ketika posisi bulan terletak di antara bumi dan matahari sehingga menutup sebagian atau seluruh cahaya matahari di langit. Fenomena alam yang spektakuler ini selalu menarik perhatian para ilmuwan untuk mempelajari korona matahari. Namun, mengamati gerhana secara langsung tanpa pelindung mata bersertifikat khusus dapat merusak retina mata secara permanen.";
      const s4 = "Wacana 4: Metode bertani secara hidroponik menjadi solusi cerdas bagi keterbatasan lahan pertanian di wilayah perkotaan (urban farming). Metode ini memanfaatkan media air yang kaya akan nutrisi makro dan mikro tanpa menggunakan tanah. Sayuran hidroponik seperti selada dan pakcoy memiliki pertumbuhan lebih cepat, higienis, serta bebas dari residu pestisida kimia berbahaya.";
      const s5 = "Wacana 5: Garis Wallace merupakan batas biogeografis fiktif yang memisahkan tipe fauna Asia di bagian barat dengan fauna peralihan khas di Indonesia bagian tengah. Wilayah Wallacea yang meliputi Sulawesi, Maluku, dan Nusa Tenggara memiliki keanekaragaman hayati yang sangat unik dengan keberadaan satwa endemik purba seperti komodo, anoa, babirusa, dan burung maleo.";

      return [
        {
          id: "b8-q1",
          pertanyaan: `${s1}\n\nBerdasarkan wacana 1 tersebut, apa yang dimaksud dengan mikroplastik?`,
          pilihan: {
            A: "Butiran sampah plastik utuh yang mengambang di permukaan air sungai",
            B: "Partikel mikroskopis hasil pecahan plastik sekali pakai yang terurai secara parsial",
            C: "Plastik ramah lingkungan yang diproduksi dari tepung pati singkong",
            D: "Alat pengukur kadar racun plastik di laboratoium biologi kelautan"
          },
          jawabanBenar: "B",
          tipe: "Pilihan Ganda",
          level: "Level 1",
          bobotIrt: 3.2
        },
        {
          id: "b8-q2",
          pertanyaan: `${s2}\n\nEvaluasi pernyataan berikut mengenai Candi Borobudur berdasarkan wacana 2:`,
          pilihan: {
            A: "Pernyataan 1: Relief di dinding candi merekam kondisi sosial dan budaya masyarakat Jawa kuno. (Benar)",
            B: "Pernyataan 2: Candi Borobudur dibangun menggunakan semen perekat modern agar kokoh. (Salah)"
          },
          jawabanBenar: "A",
          tipe: "Benar/Salah",
          level: "Level 2",
          bobotIrt: 3.6
        },
        {
          id: "b8-q3",
          pertanyaan: `${s3}\n\nBerdasarkan wacana 3, mengapa kita dilarang keras mengamati gerhana matahari secara langsung tanpa alat pelindung khusus?`,
          pilihan: {
            A: "Karena gravitasi bulan akan meningkat tajam saat gerhana berlangsung",
            B: "Karena radiasi cahaya intensitas tinggi dapat merusak retina mata secara permanen",
            C: "Karena suhu udara di bumi akan turun secara mendadak hingga titik beku",
            D: "Karena korona matahari memancarkan gas beracun ke permukaan bumi"
          },
          jawabanBenar: "B",
          tipe: "Pilihan Ganda",
          level: "Level 3",
          bobotIrt: 5.2
        },
        {
          id: "b8-q4",
          pertanyaan: `${s4}\n\nManakah keunggulan pertanian metode hidroponik yang dikemukakan dalam wacana 4? (Pilih semua yang benar)`,
          pilihan: {
            A: "Sangat cocok untuk wilayah perkotaan dengan lahan terbatas",
            B: "Menghasilkan sayuran yang higienis dan bebas pestisida kimia",
            C: "Memiliki waktu pertumbuhan tanaman yang relatif lebih cepat",
            D: "Memerlukan tanah subur dalam jumlah yang sangat banyak"
          },
          jawabanBenar: "A,B,C",
          tipe: "Pilihan Ganda Kompleks",
          level: "Level 2",
          bobotIrt: 4.1
        },
        {
          id: "b8-q5",
          pertanyaan: `${s5}\n\nMengapa satwa di wilayah Wallacea disebut sebagai fauna unik dan endemik berdasarkan wacana 5?`,
          pilihan: {
            A: "Karena satwa tersebut hanya hidup di wilayah tersebut dan tidak ditemukan di belahan bumi lain",
            B: "Karena mereka memiliki ukuran tubuh yang jauh lebih besar dari hewan Asia",
            C: "Karena semua jenis satwanya telah mengalami domestikasi oleh masyarakat lokal",
            D: "Karena mereka bermigrasi melintasi garis fiktif Wallace setiap tahunnya"
          },
          jawabanBenar: "A",
          tipe: "Pilihan Ganda",
          level: "Level 3",
          bobotIrt: 5.5
        }
      ];
    } else { // Kelas 9
      const s1 = "Wacana 1: Kemajuan kecerdasan buatan (Artificial Intelligence/AI) telah mentransformasi dunia pendidikan modern secara masif. Melalui platform pembelajaran adaptif, AI mampu memetakan gaya belajar individual siswa, mendeteksi kelemahan pemahaman materi secara real-time, serta memberikan rekomendasi soal latihan secara presisi. Namun, integrasi teknologi ini memicu kekhawatiran bahwa ketergantungan pada asisten AI akan melemahkan kemampuan penalaran mandiri dan analisis kritis siswa.";
      const s2 = "Wacana 2: Inflasi didefinisikan sebagai fenomena kenaikan harga barang dan jasa secara umum dan terus-menerus dalam jangka waktu tertentu. Salah satu pemicu utamanya adalah kenaikan biaya produksi (cost-push inflation), seperti lonjakan harga bahan bakar minyak (BBM) global. Inflasi yang tidak terkendali secara sistemik dapat menggerus daya beli riil masyarakat, memicu suku bunga tinggi, dan menghambat pemulihan ekonomi nasional.";
      const s3 = "Wacana 3: Menulis puisi kini tidak lagi terbatas pada media cetak konvensional. Kehadiran media sosial menjadi panggung digital baru bagi penyair muda untuk mempublikasikan karyanya secara instan. Walaupun memperluas jangkauan pembaca secara masif, tantangan terbesar adalah menjaga kedalaman makna estetis dan keaslian ekspresi di tengah gempuran konten instan yang sangat cepat berganti di linimasa.";
      const s4 = "Wacana 4: Gaya hidup sedenter (sedentary lifestyle) atau kurangnya aktivitas gerak fisik telah menjadi ancaman serius bagi kesehatan masyarakat modern. Kebiasaan duduk terlalu lama di depan layar gawai atau komputer meningkatkan risiko penyakit kardiovaskular, diabetes melitus tipe 2, serta obesitas. Para praktisi kesehatan menyarankan aktivitas fisik aerobik ringan minimal 30 menit setiap hari.";
      const s5 = "Wacana 5: Situs megalitikum Gunung Padang di Cianjur, Jawa Barat, terus menarik perhatian arkeolog dunia. Struktur punden berundak yang terbuat dari ribuan balok batu andesit purba ini diduga didirikan oleh peradaban prasejarah yang sangat maju. Penelitian georadar menunjukkan adanya rongga-rongga misterius di bawah permukaan situs yang memicu berbagai spekulasi mengenai fungsi asli bangunan tersebut.";

      return [
        {
          id: "b9-q1",
          pertanyaan: `${s1}\n\nBerdasarkan wacana 1 di atas, kemampuan adaptif dari teknologi Artificial Intelligence (AI) di bidang pendidikan diwujudkan melalui...`,
          pilihan: {
            A: "Menggantikan peran kehadiran guru fisik secara penuh di semua sekolah",
            B: "Memetakan gaya belajar individual siswa serta merekomendasikan latihan soal personal",
            C: "Menghukum siswa yang melakukan kecurangan secara otomatis lewat sensor kamera",
            D: "Membatasi pendaftaran siswa baru secara online berdasarkan algoritma usia"
          },
          jawabanBenar: "B",
          tipe: "Pilihan Ganda",
          level: "Level 1",
          bobotIrt: 3.1
        },
        {
          id: "b9-q2",
          pertanyaan: `${s2}\n\nTentukan kebenaran dari pernyataan berikut mengenai inflasi berdasarkan wacana 2:`,
          pilihan: {
            A: "Pernyataan 1: Kenaikan harga BBM global dapat memicu terjadinya cost-push inflation. (Benar)",
            B: "Pernyataan 2: Inflasi yang tinggi menguntungkan daya beli riil masyarakat ekonomi lemah. (Salah)"
          },
          jawabanBenar: "A",
          tipe: "Benar/Salah",
          level: "Level 2",
          bobotIrt: 3.7
        },
        {
          id: "b9-q3",
          pertanyaan: `${s3}\n\nApa tantangan terbesar bagi penyair muda dalam berkarya melalui media sosial berdasarkan wacana 3?`,
          pilihan: {
            A: "Kesulitan mencari pengikut (followers) yang menyukai seni sastra",
            B: "Mempertahankan kedalaman estetika puisi di tengah arus konten instan yang cepat berganti",
            C: "Keterbatasan jumlah karakter kata yang dapat diunggah di platform digital",
            D: "Biaya publikasi karya digital yang sangat mahal dibanding media cetak"
          },
          jawabanBenar: "B",
          tipe: "Pilihan Ganda",
          level: "Level 3",
          bobotIrt: 5.4
        },
        {
          id: "b9-q4",
          pertanyaan: `${s4}\n\nManakah penyakit kronis yang risikonya meningkat akibat gaya hidup sedenter menurut wacana 4? (Pilih semua yang benar)`,
          pilihan: {
            A: "Penyakit jantung dan kardiovaskular",
            B: "Diabetes melitus tipe 2",
            C: "Obesitas atau kelebihan berat badan",
            D: "Penyakit asma akut dan infeksi paru"
          },
          jawabanBenar: "A,B,C",
          tipe: "Pilihan Ganda Kompleks",
          level: "Level 2",
          bobotIrt: 4.4
        },
        {
          id: "b9-q5",
          pertanyaan: `${s5}\n\nApa hal menarik dari Situs Gunung Padang yang dideteksi oleh teknologi georadar berdasarkan wacana 5?`,
          pilihan: {
            A: "Ditemukannya sisa-sisa emas peninggalan kerajaan kuno",
            B: "Adanya rongga-rongga misterius di bawah permukaan tanah struktur situs",
            C: "Situs tersebut terbukti terbentuk murni dari aktivitas vulkanik alami",
            D: "Ditemukannya fosil dinosaurus di dalam batuan andesit purba"
          },
          jawabanBenar: "B",
          tipe: "Pilihan Ganda",
          level: "Level 3",
          bobotIrt: 5.8
        }
      ];
    }
  }
  return [];
};

const expandQuestionsTo30 = (baseQuestions: SoalTka[], bidang: string): SoalTka[] => {
  if (!baseQuestions || baseQuestions.length === 0) return [];
  const expanded: SoalTka[] = [];
  const isMath = bidang.includes("Matematika") || bidang.includes("Numerasi");
  
  for (let i = 0; i < 30; i++) {
    const baseQ = baseQuestions[i % baseQuestions.length];
    const index = i + 1;
    const newId = `${baseQ.id}-v${index}`;
    
    let questionText = baseQ.pertanyaan;
    let choices = { ...baseQ.pilihan };
    let correctAns = baseQ.jawabanBenar;
    let level = baseQ.level;
    let weight = baseQ.bobotIrt;
    
    if (isMath) {
      const multiplier = (i % 3) + 1;
      const offset = (i % 4) * 10;
      
      if (baseQ.pertanyaan.includes("1.200 kg")) {
        const totalPadi = 1200 * multiplier;
        const correctVal = 270 * multiplier;
        questionText = `Seorang petani membagikan hasil panen padi kepada 3 kelompok warga. Kelompok pertama menerima 3/8 bagian, kelompok kedua menerima 2/5 bagian, dan sisanya untuk kelompok ketiga. Jika total panen padi adalah ${totalPadi.toLocaleString("id-ID")} kg, berapakah berat padi yang diterima oleh kelompok ketiga? (Soal No. ${index})`;
        choices = {
          A: `${correctVal} kg`,
          B: `${340 * multiplier} kg`,
          C: `${450 * multiplier} kg`,
          D: `${480 * multiplier} kg`
        };
      } else if (baseQ.pertanyaan.includes("skala 1:250.000")) {
        const scale = 250000;
        const cm = 8 + (i % 3) * 2;
        const km = (cm * scale) / 100000;
        questionText = `Sebuah peta memiliki skala 1:250.000. Jarak kota A ke kota B pada peta adalah ${cm} cm. Berdasarkan informasi ini (Soal No. ${index}), tentukan kebenaran dari pernyataan berikut:`;
        choices = {
          A: `Pernyataan 1: Jarak sebenarnya adalah ${km} km. (Benar)`,
          B: `Pernyataan 2: Jika ditempuh dengan motor berkecepatan 40 km/jam, butuh waktu ${Math.round(km / 40 * 60)} menit. (Salah)`
        };
      } else if (baseQ.pertanyaan.includes("40 anak")) {
        const baseAnak = 40 + offset;
        const baseHari = 15;
        const newAnak = 10;
        const targetHari = Math.round((baseAnak * baseHari) / (baseAnak + newAnak));
        questionText = `Suatu panti asuhan memiliki persediaan beras yang cukup untuk ${baseAnak} anak selama ${baseHari} hari. Jika panti asuhan tersebut kedatangan ${newAnak} anak baru, persediaan beras akan habis dalam waktu... (Soal No. ${index})`;
        choices = {
          A: `${targetHari} hari`,
          B: `${targetHari - 2} hari`,
          C: `${targetHari + 2} hari`,
          D: `${targetHari + 4} hari`
        };
      } else if (baseQ.pertanyaan.includes("Rp 15.000")) {
        const price = 15000 + offset * 1000;
        const pricePerBook = price / 5;
        questionText = `Manakah dari relasi bilangan berikut yang memiliki rasio senilai dengan perbandingan harga 5 buku seharga Rp ${price.toLocaleString("id-ID")}? (Soal No. ${index} - Pilih semua jawaban yang benar)`;
        choices = {
          A: `3 buku seharga Rp ${(pricePerBook * 3).toLocaleString("id-ID")}`,
          B: `8 buku seharga Rp ${(pricePerBook * 8).toLocaleString("id-ID")}`,
          C: `10 buku seharga Rp ${(pricePerBook * 10 - 2000).toLocaleString("id-ID")}`,
          D: `12 buku seharga Rp ${(pricePerBook * 12).toLocaleString("id-ID")}`
        };
      } else if (baseQ.pertanyaan.includes("keliling taman adalah 44 meter")) {
        const keliling = 44 + offset * 2;
        const xValue = (keliling - 14) / 6;
        const isInt = Number.isInteger(xValue);
        const finalX = isInt ? xValue : 5;
        const finalKeliling = isInt ? keliling : 44;
        const p = 2 * finalX + 5;
        const l = finalX + 2;
        const area = p * l;
        questionText = `Sebuah taman berbentuk persegi panjang dengan ukuran panjang (2x + 5) meter dan lebar (x + 2) meter. Jika keliling taman adalah ${finalKeliling} meter, berapakah nilai x dan luas taman tersebut? (Soal No. ${index})`;
        choices = {
          A: `x = ${finalX}, Luas = ${area} m²`,
          B: `x = ${finalX}, Luas = ${area - 7} m²`,
          C: `x = ${finalX + 1}, Luas = ${area + 15} m²`,
          D: `x = ${finalX - 1}, Luas = ${area - 12} m²`
        };
      } else {
        questionText = `${baseQ.pertanyaan} (Soal No. ${index})`;
      }
    } else {
      questionText = `${baseQ.pertanyaan}\n\n[Butir Soal Ke-${index}]`;
    }
    
    const levelList: ("Level 1" | "Level 2" | "Level 3")[] = ["Level 1", "Level 2", "Level 3"];
    level = levelList[(i + (isMath ? 1 : 0)) % 3];
    weight = parseFloat((2.5 + (i * 0.15) % 3.5).toFixed(1));
    
    expanded.push({
      id: newId,
      pertanyaan: questionText,
      pilihan: choices,
      jawabanBenar: correctAns,
      tipe: baseQ.tipe,
      level: level,
      bobotIrt: weight
    });
  }
  
  return expanded;
};

export const getTkaDefaultQuestions = (
  bidang: "Matematika (Numerasi)" | "Bahasa Indonesia (Literasi Membaca)",
  kelas: string
): SoalTka[] => {
  const base = getTkaDefaultQuestionsBase(bidang, kelas);
  return expandQuestionsTo30(base, bidang);
};
