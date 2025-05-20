import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../lib/axios";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

const MinjamIndex = () => {
  const [peminjaman, setPeminjaman] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isId, setIsId] = useState(null);
  const [modalMode, setModalMode] = useState("tambah");

  // Data untuk dropdown
  const [bukuList, setBukuList] = useState([]);
  const [memberList, setMemberList] = useState([]);

  // const [denda, setDenda] = useState(0);
  // const [notif, setNotif] = useState(""); // notifikasi denda

  const navigate = useNavigate();

  const [formModal, setFormModal] = useState({
    id_buku: "",
    id_member: "",
    tgl_pinjam: "",
    tgl_pengembalian: "",
    status_pengembalian: "",
  });

  function SubmitForm(e) {
    e.preventDefault();

    API.post("/peminjaman", formModal, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then(() => {
        setIsModalOpen(false);
        getPeminjaman();
        setFormModal({
          id_buku: "",
          id_member: "",
          tgl_pinjam: "",
          tgl_pengembalian: "",
          status_pengembalian: "",
        });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          navigate("/login");
        }
        setError(err.response.data);
      });
  }

  function handleModal(mode, id) {
    setModalMode(mode);
    setIsId(id);

    if (mode === "tambah") {
      setFormModal({
        id_buku: "",
        id_member: "",
        tgl_pinjam: "",
        tgl_pengembalian: "",
        status_pengembalian: "",
      });
      setIsModalOpen(true);
    } else if (mode === "detail") {
      // Debug untuk melihat ID
      console.log("Detail untuk ID:", id);

      // Cari data peminjaman langsung dari state peminjaman yang sudah ada
      const selectedPeminjaman = peminjaman.find((item) => item.id === id);

      if (selectedPeminjaman) {
        console.log("Data ditemukan di state:", selectedPeminjaman);
        // Set form modal dengan data yang sudah ada di state
        setFormModal({
          id_buku: selectedPeminjaman.id_buku || "",
          id_member: selectedPeminjaman.id_member || "",
          tgl_pinjam: selectedPeminjaman.tgl_pinjam || "",
          tgl_pengembalian: selectedPeminjaman.tgl_pengembalian || "",
          status_pengembalian:
            selectedPeminjaman.status_pengembalian === 1 ? "sudah" : "belum",
        });
        setIsModalOpen(true);
      } else {
        // Jika tidak ditemukan di state, coba ambil dari API
        console.log("Data tidak ditemukan di state, mencoba dari API");
        API.get(`/peminjaman/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
          .then((res) => {
            console.log("API response:", res.data);
            // Memastikan data tersedia dan diatur dengan benar
            if (res.data && res.data.data) {
              setFormModal({
                id_buku: res.data.data.id_buku || "",
                id_member: res.data.data.id_member || "",
                tgl_pinjam: res.data.data.tgl_pinjam || "",
                tgl_pengembalian: res.data.data.tgl_pengembalian || "",
                status_pengembalian:
                  res.data.data.status_pengembalian === 1 ? "sudah" : "belum",
              });
              setIsModalOpen(true);
            }
          })
          .catch((err) => {
            console.error("Error fetching detail:", err);
            alert("Gagal mengambil data detail");
            if (err.response && err.response.status === 401) {
              localStorage.removeItem("access_token");
              localStorage.removeItem("user");
              navigate("/");
            }
            setError(
              err.response
                ? err.response.data
                : { message: "Failed to fetch details" }
            );
          });
      }
    } else if (mode === "pengembalian") {
      // Mode pengembalian
      // Cari data peminjaman langsung dari state peminjaman
      const selectedPeminjaman = peminjaman.find((item) => item.id === id);

      if (selectedPeminjaman) {
        setFormModal({
          id_buku: selectedPeminjaman.id_buku || "",
          id_member: selectedPeminjaman.id_member || "",
          tgl_pinjam: selectedPeminjaman.tgl_pinjam || "",
          tgl_pengembalian: selectedPeminjaman.tgl_pengembalian || "",
          status_pengembalian:
            selectedPeminjaman.status_pengembalian === 1 ? "sudah" : "belum",
        });
        setIsModalOpen(true);
      } else {
        // Jika tidak ditemukan di state, coba ambil dari API
        API.get(`/peminjaman/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
          .then((res) => {
            if (res.data && res.data.data) {
              setFormModal({
                id_buku: res.data.data.id_buku || "",
                id_member: res.data.data.id_member || "",
                tgl_pinjam: res.data.data.tgl_pinjam || "",
                tgl_pengembalian: res.data.data.tgl_pengembalian || "",
                status_pengembalian:
                  res.data.data.status_pengembalian === 1 ? "sudah" : "belum",
              });
              setIsModalOpen(true);
            }
          })
          .catch((err) => {
            console.error("Error fetching for return:", err);
            alert("Gagal mengambil data untuk pengembalian");
            if (err.response && err.response.status === 401) {
              localStorage.removeItem("access_token");
              localStorage.removeItem("user");
              navigate("/login");
            }
          });
      }
    }
  }

  function Pengembalian(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("_method", "PUT");

    API.post(`/peminjaman/pengembalian/${isId}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((res) => {
        console.log(res.data.data);
        const data = res.data.data;

        const today = new Date();
        const targetDate = new Date(formModal.tgl_pengembalian);
        const selisihHari = Math.ceil(
          (today - targetDate) / (1000 * 60 * 60 * 24)
        );
        // const jumlahDenda = selisihHari > 0 ? selisihHari * 1000 : 0;

        // setDenda(jumlahDenda);

        // Cek apakah telat dan munculkan notif
        if (selisihHari > 0) {
          const jumlahDenda = selisihHari * 1000;
          toast.warn(
            `Kamu telat ${selisihHari} hari. Denda: Rp ${jumlahDenda.toLocaleString()}`
          );
          console.log(
            `apakah id_member ada: ${data.id_member},apakah id_buku ada: ${data.id_buku},`
          );
          console.log(
            `apakah id_member ada: ${formModal.id_member},apakah id_buku ada: ${formModal.id_buku},`
          );
          const newDenda = {
            id_member: formModal.id_member,
            id_buku: formModal.id_buku,
            jumlah_denda: String(jumlahDenda),
            jenis_denda: "terlambat",
            deskripsi: `User ${formModal.id_member} telah telat mengembalikan buku ${formModal.id_buku}`,
          };

          API.post("/denda", newDenda, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          })
            .then((res) => {
              console.log(res.data);
              console.log("denda berhasil dicatat");
            })
            .catch((err) => {
              console.log("ada yang eror: " + err);
            });
          //   setNotif(
          //     `Kamu telat ${selisihHari} hari. Denda: Rp ${jumlahDenda.toLocaleString()}`
          //   );
        } else {
          //   setNotif("Pengembalian tepat waktu. Tidak ada denda.");
          toast.success("Pengembalian tepat waktu. Tidak ada denda.");
        }

        setFormModal({
          id_buku: res.data.data.id_buku,
          id_member: res.data.data.id_member,
          tgl_pinjam: res.data.data.tgl_pinjam,
          tgl_pengembalian: res.data.data.tgl_pengembalian || "",
          status_pengembalian:
            res.data.data.status_pengembalian === 1 ? "sudah" : "belum",
        });
        setIsModalOpen(false);
        getPeminjaman();
      })
      .catch((err) => {
        console.error("Error returning book:", err);
        setError(
          err.response
            ? err.response.data
            : { message: "Failed to process return" }
        );
      });
  }

  useEffect(() => {
    getPeminjaman();
    // Fetch data buku dan member untuk dropdown
    getBukuData();
    getMemberData();
  }, []);

  function getBukuData() {
    // Fungsi ini harusnya mengambil data buku dari API
    API.get("/buku", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((res) => {
        if (res.data) {
          setBukuList(res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
      });
  }

  function getMemberData() {
    // Fungsi ini harusnya mengambil data member dari API
    API.get("/member", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((res) => {
        if (res.data) {
          setMemberList(res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching members:", err);
      });
  }

  function getPeminjaman() {
    API.get("/peminjaman", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((res) => {
        console.log("Data peminjaman:", res.data);
        if (res.data && res.data.data) {
          setPeminjaman(res.data.data);
        } else {
          setPeminjaman([]);
          console.warn("Format data peminjaman tidak sesuai");
        }
      })
      .catch((error) => {
        console.error("Error fetching peminjaman:", error);
        setError(
          error.response
            ? error.response.data
            : { message: "Failed to fetch data" }
        );
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      });
  }

  function exportExcel() {
    const formatedData = peminjaman.map((item, index) => ({
      No: index + 1,
      Buku: item.id_buku,
      Member: item.id_member,
      Tanggal_Peminjaman: item.tgl_pinjam,
      Tanggal_Pengembalian: item.tgl_pengembalian || "-",
      Status_Pengembalian: item.status_pengembalian === 1 ? "Sudah" : "Belum",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formatedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(file, "data_peminjaman.xlsx");
  }

  const generatePDF = (data) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Detail Peminjaman Buku", 14, 20);

    doc.setFontSize(12);
    doc.text(`ID Member: ${data.id_member}`, 14, 30);
    doc.text(`ID Buku: ${data.id_buku}`, 14, 36);
    doc.text(`Tanggal Pinjam: ${data.tgl_pinjam}`, 14, 42);
    doc.text(`Tanggal Pengembalian: ${data.tgl_pengembalian || "-"}`, 14, 48);
    doc.text(
      `Status Pengembalian: ${
        data.status_pengembalian === 1 ? "Sudah" : "Belum"
      }`,
      14,
      54
    );

    doc.save(`Peminjaman_${data.id_member}_${data.id_buku}.pdf`);
  };

  return (
    <div>
      <>
        <div className="bg-base-200 p-4 rounded-box shadow-sm">
          <h2 className="text-2xl font-bold mb-2">Daftar Peminjaman</h2>
          <p className="mb-4 text-sm text-gray-500">
            Data Peminjaman yang terdaftar dalam sistem.
          </p>
          <button
            className="btn btn-success"
            onClick={() => {
              handleModal("tambah");
            }}
          >
            + Add
          </button>
          <button className="btn btn-primary" onClick={exportExcel}>
            Eksport to excel
          </button>
          <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-200 shadow-sm">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>buku</th>
                  <th>member</th>
                  <th>tanggal peminjaman</th>
                  <th>pengembalian</th>
                  <th>status</th>
                  <th>action</th>
                </tr>
              </thead>
              <tbody>
                {peminjaman && peminjaman.length > 0 ? (
                  peminjaman.map((item, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{item.id_buku}</td>
                      <td>{item.id_member}</td>
                      <td>{item.tgl_pinjam}</td>
                      <td>{item.tgl_pengembalian || "-"}</td>
                      <td>
                        {item.status_pengembalian === 1 ? "sudah" : "belum"}
                      </td>
                      <td>
                        <button
                          className="btn btn-outline me-2"
                          onClick={() => {
                            // Debug: tampilkan ID yang dikirim ke handleModal
                            console.log("ID yang dikirim ke detail:", item.id);
                            handleModal("detail", item.id);
                          }}
                        >
                          detail
                        </button>
                        {item.status_pengembalian === 0 ? (
                          <button
                            className="btn btn-outline me-2"
                            onClick={() => {
                              handleModal("pengembalian", item.id);
                            }}
                          >
                            kembalikan buku
                          </button>
                        ) : (
                          ""
                        )}
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => generatePDF(item)}
                        >
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <th colSpan={7} className="text-center">
                      Data Kosong
                    </th>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === "tambah"
            ? "Tambah Peminjaman"
            : modalMode === "pengembalian"
            ? "Kembalikan Buku"
            : "Detail Peminjaman"
        }
      >
        {/* Menampilkan error jika ada */}
        {error &&
          typeof error === "object" &&
          Object.keys(error).length > 0 && (
            <ul className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">
              {Object.entries(error).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
          )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (modalMode === "tambah") {
              SubmitForm(e);
            } else if (modalMode === "pengembalian") {
              Pengembalian(e);
            }
          }}
          method={"PUT"}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buku <span className="text-red-500">*</span>
            </label>
            {modalMode === "detail" || modalMode === "pengembalian" ? (
              // Jika mode detail atau pengembalian, tampilkan sebagai text biasa
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formModal.id_buku || ""}
                disabled={true}
              />
            ) : (
              // Jika mode tambah, tampilkan sebagai dropdown
              <select
                value={formModal.id_buku || ""}
                onChange={(e) =>
                  setFormModal({ ...formModal, id_buku: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Buku</option>
                {bukuList && bukuList.length > 0 ? (
                  bukuList.map((item) => (
                    <option key={item.id} value={item.id} className="text-sm">
                      {item.judul || item.id}
                    </option>
                  ))
                ) : (
                  <option value="">Tidak ada data buku</option>
                )}
              </select>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Member <span className="text-red-500">*</span>
            </label>
            {modalMode === "detail" || modalMode === "pengembalian" ? (
              // Jika mode detail atau pengembalian, tampilkan sebagai text biasa
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formModal.id_member || ""}
                disabled={true}
              />
            ) : (
              // Jika mode tambah, tampilkan sebagai dropdown
              <select
                value={formModal.id_member || ""}
                onChange={(e) =>
                  setFormModal({ ...formModal, id_member: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Member</option>
                {memberList && memberList.length > 0 ? (
                  memberList.map((item) => (
                    <option key={item.id} value={item.id} className="text-sm">
                      {item.nama || item.id}
                    </option>
                  ))
                ) : (
                  <option value="">Tidak ada data member</option>
                )}
              </select>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Peminjaman <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              value={formModal.tgl_pinjam || ""}
              disabled={modalMode === "detail" || modalMode === "pengembalian"}
              onChange={(e) =>
                setFormModal({ ...formModal, tgl_pinjam: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Pengembalian <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              value={formModal.tgl_pengembalian || ""}
              disabled={modalMode === "detail" || modalMode === "pengembalian"}
              onChange={(e) =>
                setFormModal({ ...formModal, tgl_pengembalian: e.target.value })
              }
            />
          </div>

          {modalMode === "detail" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Pengembalian
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                value={formModal.status_pengembalian || ""}
                disabled={true}
              />
            </div>
          )}

          {modalMode === "tambah" && (
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Tambah
            </button>
          )}

          {modalMode === "pengembalian" && (
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Konfirmasi Pengembalian
            </button>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default MinjamIndex;
