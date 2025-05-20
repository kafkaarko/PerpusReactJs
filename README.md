 Website Perpustakaan Sederhana
Website ini adalah aplikasi perpustakaan berbasis web yang dibuat menggunakan React.js, dirancang untuk memudahkan pengelolaan anggota, buku, peminjaman, pengembalian, serta perhitungan denda.

 Fitur Utama:
Login Sistem

Hanya pengguna yang sudah login yang bisa mengakses halaman utama.

Menggunakan token (access_token) yang disimpan di localStorage.

Dashboard / Beranda

Menampilkan pesan selamat datang dan gambar perpustakaan.

Manajemen Anggota (/memberIndex)

Menambah, mengedit, dan menghapus data anggota perpustakaan.

Manajemen Buku (/bukuIndex)

Mengelola daftar buku yang tersedia untuk dipinjam.

Peminjaman Buku (/minjamIndex)

Melakukan transaksi peminjaman buku.

Pengembalian & Denda (/dendaIndex)

Menampilkan denda keterlambatan berdasarkan tanggal pengembalian.

Grafik (/grafikIndex)

Menampilkan data statistik perpustakaan dalam bentuk grafik.

 Keamanan Akses (Middleware):
Semua halaman utama dibungkus dengan middleware IsLogin agar tidak bisa diakses tanpa login.

UI / Tampilan:
Menggunakan Tailwind CSS atau DaisyUI untuk tampilan modern dan responsif.

Tampilan beranda meniru gaya Vercel (bersih, fokus di tengah, tombol jelas).