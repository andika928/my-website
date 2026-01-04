// Mock Data for School Website

// News/Berita Data
export const newsData = [
    {
        id: 1,
        title: 'Siswa SMA Negeri 1 Raih Medali Emas Olimpiade Sains Nasional',
        excerpt: 'Prestasi membanggakan kembali diraih oleh siswa kita dalam ajang OSN tingkat nasional dengan membawa pulang medali emas.',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        category: 'Prestasi',
        date: '28 Des 2024',
        image: null,
        author: 'Admin'
    },
    {
        id: 2,
        title: 'Pembukaan Pendaftaran PPDB Online Tahun Ajaran 2025/2026',
        excerpt: 'Pendaftaran peserta didik baru untuk tahun ajaran 2025/2026 resmi dibuka. Simak informasi lengkapnya di sini.',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        category: 'Pengumuman',
        date: '25 Des 2024',
        image: null,
        author: 'Admin'
    },
    {
        id: 3,
        title: 'Perayaan Dies Natalis ke-50 SMA Negeri 1',
        excerpt: 'Rangkaian acara perayaan ulang tahun sekolah yang ke-50 digelar meriah dengan berbagai kegiatan menarik.',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        category: 'Kegiatan',
        date: '20 Des 2024',
        image: null,
        author: 'Admin'
    },
    {
        id: 4,
        title: 'Workshop Teknologi Digital untuk Guru dan Siswa',
        excerpt: 'Dalam rangka meningkatkan literasi digital, sekolah mengadakan workshop teknologi bersama praktisi IT.',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        category: 'Kegiatan',
        date: '18 Des 2024',
        image: null,
        author: 'Admin'
    },
    {
        id: 5,
        title: 'Tim Basket Putra Juara Provinsi',
        excerpt: 'Tim basket putra SMA Negeri 1 berhasil meraih juara pertama dalam kejuaraan basket antar SMA tingkat provinsi.',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        category: 'Prestasi',
        date: '15 Des 2024',
        image: null,
        author: 'Admin'
    }
]

// Announcements Data
export const announcementsData = [
    {
        id: 1,
        title: 'Jadwal Ujian Akhir Semester Ganjil 2024/2025',
        content: 'Ujian Akhir Semester Ganjil akan dilaksanakan pada tanggal 16-20 Desember 2024. Harap persiapkan diri dengan baik.',
        category: 'Umum',
        date: '10 Des 2024',
        priority: 'high'
    },
    {
        id: 2,
        title: 'Libur Akhir Tahun dan Tahun Baru',
        content: 'Sekolah akan libur mulai tanggal 23 Desember 2024 - 1 Januari 2025. Kegiatan belajar mengajar kembali normal pada 2 Januari 2025.',
        category: 'Siswa',
        date: '8 Des 2024',
        priority: 'normal'
    },
    {
        id: 3,
        title: 'Rapat Orang Tua/Wali Murid',
        content: 'Rapat orang tua/wali murid akan dilaksanakan pada Sabtu, 21 Desember 2024 pukul 09.00 WIB di Aula Sekolah.',
        category: 'Orang Tua',
        date: '5 Des 2024',
        priority: 'high'
    },
    {
        id: 4,
        title: 'Pengumpulan Berkas Beasiswa',
        content: 'Bagi siswa yang ingin mengajukan beasiswa prestasi, harap mengumpulkan berkas ke ruang BK paling lambat 15 Desember 2024.',
        category: 'Siswa',
        date: '1 Des 2024',
        priority: 'normal'
    }
]

// Students Data
export const studentsData = [
    {
        id: 1,
        nisn: '0012345678',
        name: 'Ahmad Rizky Pratama',
        class: 'XII IPA 1',
        gender: 'Laki-laki',
        address: 'Jl. Merdeka No. 123, Kota Contoh',
        parentName: 'Budi Pratama',
        parentPhone: '08123456789',
        status: 'Aktif'
    },
    {
        id: 2,
        nisn: '0012345679',
        name: 'Siti Nurhaliza',
        class: 'XII IPA 1',
        gender: 'Perempuan',
        address: 'Jl. Pahlawan No. 45, Kota Contoh',
        parentName: 'Heri Santoso',
        parentPhone: '08234567890',
        status: 'Aktif'
    },
    {
        id: 3,
        nisn: '0012345680',
        name: 'Muhammad Farhan',
        class: 'XII IPA 2',
        gender: 'Laki-laki',
        address: 'Jl. Sudirman No. 78, Kota Contoh',
        parentName: 'Ahmad Farhan',
        parentPhone: '08345678901',
        status: 'Aktif'
    },
    {
        id: 4,
        nisn: '0012345681',
        name: 'Dewi Lestari',
        class: 'XII IPS 1',
        gender: 'Perempuan',
        address: 'Jl. Diponegoro No. 32, Kota Contoh',
        parentName: 'Wahyu Lestari',
        parentPhone: '08456789012',
        status: 'Aktif'
    },
    {
        id: 5,
        nisn: '0012345682',
        name: 'Reza Mahendra',
        class: 'XI IPA 1',
        gender: 'Laki-laki',
        address: 'Jl. Ahmad Yani No. 55, Kota Contoh',
        parentName: 'Dedi Mahendra',
        parentPhone: '08567890123',
        status: 'Aktif'
    }
]

// Teachers Data
export const teachersData = [
    {
        id: 1,
        nip: '198501012010011001',
        name: 'Dr. H. Ahmad Fauzi, M.Pd.',
        subject: 'Matematika',
        position: 'Kepala Sekolah',
        email: 'ahmad.fauzi@sman1.sch.id',
        phone: '08111222333',
        status: 'Aktif'
    },
    {
        id: 2,
        nip: '198612152011012002',
        name: 'Dra. Siti Rahayu, M.Si.',
        subject: 'Fisika',
        position: 'Wakil Kepala Sekolah',
        email: 'siti.rahayu@sman1.sch.id',
        phone: '08222333444',
        status: 'Aktif'
    },
    {
        id: 3,
        nip: '199003202015011003',
        name: 'Bambang Sutrisno, S.Pd.',
        subject: 'Bahasa Indonesia',
        position: 'Wali Kelas XII IPA 1',
        email: 'bambang.s@sman1.sch.id',
        phone: '08333444555',
        status: 'Aktif'
    },
    {
        id: 4,
        nip: '199105102016012004',
        name: 'Rina Wulandari, S.Pd.',
        subject: 'Bahasa Inggris',
        position: 'Guru',
        email: 'rina.w@sman1.sch.id',
        phone: '08444555666',
        status: 'Aktif'
    },
    {
        id: 5,
        nip: '199207252017011005',
        name: 'Deni Kurniawan, S.Kom.',
        subject: 'Informatika',
        position: 'Guru',
        email: 'deni.k@sman1.sch.id',
        phone: '08555666777',
        status: 'Aktif'
    }
]

// PPDB Registrations Data
export const ppdbData = [
    {
        id: 1,
        registrationNumber: 'PPDB2025001',
        name: 'Andi Saputra',
        previousSchool: 'SMP Negeri 1 Contoh',
        parentName: 'Eko Saputra',
        phone: '08123456789',
        registrationDate: '28 Des 2024',
        documents: ['Ijazah', 'SKHUN', 'Kartu Keluarga'],
        status: 'Menunggu Verifikasi'
    },
    {
        id: 2,
        registrationNumber: 'PPDB2025002',
        name: 'Bunga Melati',
        previousSchool: 'SMP Negeri 2 Contoh',
        parentName: 'Hendra Gunawan',
        phone: '08234567890',
        registrationDate: '27 Des 2024',
        documents: ['Ijazah', 'SKHUN', 'Kartu Keluarga', 'Akta Kelahiran'],
        status: 'Diterima'
    },
    {
        id: 3,
        registrationNumber: 'PPDB2025003',
        name: 'Candra Wijaya',
        previousSchool: 'SMP Swasta Harapan',
        parentName: 'Wijaya Kusuma',
        phone: '08345678901',
        registrationDate: '26 Des 2024',
        documents: ['Ijazah', 'SKHUN'],
        status: 'Berkas Belum Lengkap'
    },
    {
        id: 4,
        registrationNumber: 'PPDB2025004',
        name: 'Diana Putri',
        previousSchool: 'SMP Negeri 3 Contoh',
        parentName: 'Bambang Sutrisno',
        phone: '08456789012',
        registrationDate: '25 Des 2024',
        documents: ['Ijazah', 'SKHUN', 'Kartu Keluarga', 'Akta Kelahiran'],
        status: 'Menunggu Verifikasi'
    }
]

// SPP Payments Data
export const paymentsData = [
    {
        id: 1,
        studentId: 1,
        studentName: 'Ahmad Rizky Pratama',
        class: 'XII IPA 1',
        month: 'Desember',
        year: 2024,
        amount: 500000,
        status: 'Lunas',
        paymentDate: '5 Des 2024'
    },
    {
        id: 2,
        studentId: 1,
        studentName: 'Ahmad Rizky Pratama',
        class: 'XII IPA 1',
        month: 'November',
        year: 2024,
        amount: 500000,
        status: 'Lunas',
        paymentDate: '3 Nov 2024'
    },
    {
        id: 3,
        studentId: 2,
        studentName: 'Siti Nurhaliza',
        class: 'XII IPA 1',
        month: 'Desember',
        year: 2024,
        amount: 500000,
        status: 'Belum Lunas',
        paymentDate: null
    },
    {
        id: 4,
        studentId: 2,
        studentName: 'Siti Nurhaliza',
        class: 'XII IPA 1',
        month: 'November',
        year: 2024,
        amount: 500000,
        status: 'Lunas',
        paymentDate: '10 Nov 2024'
    },
    {
        id: 5,
        studentId: 3,
        studentName: 'Muhammad Farhan',
        class: 'XII IPA 2',
        month: 'Desember',
        year: 2024,
        amount: 500000,
        status: 'Lunas',
        paymentDate: '1 Des 2024'
    }
]

// Calendar Events Data
export const calendarEvents = [
    {
        id: 1,
        title: 'Ujian Akhir Semester',
        startDate: '2024-12-16',
        endDate: '2024-12-20',
        type: 'exam',
        description: 'Ujian Akhir Semester Ganjil untuk semua kelas'
    },
    {
        id: 2,
        title: 'Libur Natal',
        startDate: '2024-12-24',
        endDate: '2024-12-26',
        type: 'holiday',
        description: 'Libur Hari Raya Natal'
    },
    {
        id: 3,
        title: 'Libur Tahun Baru',
        startDate: '2024-12-31',
        endDate: '2025-01-01',
        type: 'holiday',
        description: 'Libur Tahun Baru 2025'
    },
    {
        id: 4,
        title: 'Pembagian Rapor',
        startDate: '2024-12-21',
        endDate: '2024-12-21',
        type: 'event',
        description: 'Pembagian rapor semester ganjil'
    },
    {
        id: 5,
        title: 'PPDB 2025',
        startDate: '2025-01-15',
        endDate: '2025-02-28',
        type: 'registration',
        description: 'Pendaftaran Peserta Didik Baru tahun ajaran 2025/2026'
    }
]

// User session mock (for portal)
export const currentUser = {
    id: 1,
    name: 'Budi Santoso',
    nisn: '0012345678',
    class: 'XII IPA 1',
    role: 'student', // or 'parent'
    avatar: null
}
