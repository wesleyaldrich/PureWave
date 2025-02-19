import './GetHelp.css';
import GetHelpItem from '../Components/GetHelpItem';
import addEnhance from "../assets/icon-addEnhance.png";
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function GetHelp() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqItems = [
    {
        question: 'Bagaimana cara melakukan Enhance Audio PureWave?',
        answer: [
          '1. Masuk ke halaman “LABORATORY”.',
          '2. Upload audio yang ingin di-enhance.',
          '3. Klik tombol “ENHANCE” (Opsional: jika Anda ingin menyesuaikan audio quality & audio file size, klik “Advanced Settings”).',
          '4. a. Jika ingin mengunduh audio (audio original maupun enhanced), silahkan klik icon “DOWNLOAD” di sebelah audio yang ingin diunduh.',
          '    b. Jika ingin mengunduh enhanced audio dengan output extract tertentu, pilih option-nya pada bagian “EXTRACT OUTPUT OPTION”, kemudian klik tombol “EXTRACT”.',
          '    c. Jika tidak ingin mengunduh audionya, Anda dapat menyimpannya dengan klik tombol “SAVE”, kemudian audio tersebut dapat diakses kembali pada halaman “HISTORY”.'
        ]    
    },
    {
        question: 'Saya mengalami masalah saat login dengan Google, apa yang harus saya lakukan?',
        answer: [
          'Jika Anda mengalami masalah, pastikan:',
          '- Akun Google Anda aktif dan tidak terkunci.',
          '- Koneksi internet Anda stabil.',
          '- Izin autentikasi Google diberikan saat diminta.',
          '- Jika masalah berlanjut, silakan hubungi tim dukungan kami.'
        ]
    },
    {
        question: 'Format file apa yang didukung oleh Audio Enhance?',
        answer: ['Saat ini, kami hanya mendukung format file .wav. Pastikan file audio Anda memiliki format tersebut sebelum diunggah.']
    },
    {
        question: 'Apa yang terjadi jika koneksi internet saya terputus saat proses enhancement?',
        answer: ['Jika koneksi terputus, proses enhancement akan otomatis dihentikan. Anda dapat mengunggah kembali file tersebut setelah koneksi Anda stabil.']
    },
    {
        question: 'Apakah saya bisa mengakses kembali file yang telah dihapus dari history?',
        answer: ['Tidak, file yang sudah dihapus dari halaman History tidak dapat dikembalikan. Pastikan Anda menyimpan salinan file yang penting sebelum menghapusnya.']
    },
    {
        question: 'Apakah layanan ini gratis?',
        answer: ['Kami menyediakan opsi gratis dengan fitur dasar. Untuk fitur premium seperti penghapusan noise tingkat lanjut atau akses penyimpanan tambahan, Anda dapat berlangganan paket premium kami.']
    },
    {
        question: 'Siapa saja yang bisa melihat postingan saya di Community?',
        answer: ['Semua pengguna yang terdaftar di platform dapat melihat postingan Anda.']
    }
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Tutup item jika diklik ulang
  };

  return (
    <div className="get-help-page container-fluid">
      <h1 className="title firacode">HELP-CENTER</h1>
      <div className="buttons flex-row justify-content-between gurajada">
          <NavLink to="/lab" className="button col-4" end>
            <img src={addEnhance} alt="Icon Add Enhance" className="ebutton-icon" />
            <span>ENHANCE YOUR AUDIO</span>
          </NavLink>
      </div>
      
      <div className="faq-section container-fluid">
        {faqItems.map((item, index) => (
          <GetHelpItem
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
      <p className='copyright cambria'>copyrights©2024 Reserved by PureWave</p>
    </div>
  );
}

export default GetHelp;
