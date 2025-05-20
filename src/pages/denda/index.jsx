import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../lib/axios";
import Modal from "../components/Modal";
import { toast } from "react-toastify";

const DendaIndex = () => {
  const [denda, setDenda] = useState([]);
  const [error, setError] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("tambah");
  const [selectedDenda, setSelectedDenda] = useState(null);

  const [bukuList, setBukuList] = useState([]);
  const [memberList, setMemberList] = useState([]);

  const navigate = useNavigate();

  const [formDenda, setFormDenda] = useState({
    id_member: "",
    id_buku: "",
    jumlah_denda: "",
    jenis_denda: "",
    deskripsi: "",
  });

  useEffect(() => {
    getDenda();
    getBuku();
    getMember();
  }, []);

  const getDenda = () => {
    API.get("/denda", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((res) => {
        setDenda(res.data.data);
      })
      .catch((err) => {
        setError(err.response?.data || {});
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      });
  };

  const getBuku = () => {
    API.get("/buku", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }).then((res) => {
      setBukuList(res.data);
    });
  };

  const getMember = () => {
    API.get("/member", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }).then((res) => {
      setMemberList(res.data);
    });
  };

  const submitForm = (e) => {
    e.preventDefault();

    API.post("/denda", formDenda, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then(() => {
        toast.success("Denda berhasil ditambahkan.");
        setFormDenda({
          id_member: "",
          id_buku: "",
          jumlah_denda: "",
          jenis_denda: "",
          deskripsi: "",
        });
        setIsModalOpen(false);
        getDenda();
      })
      .catch((err) => {
        setError(err.response?.data || {});
        toast.error("Gagal menambahkan denda.");
      });
  };

  const handleDetail = (item) => {
    setSelectedDenda(item);
    setModalMode("detail");
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-base-200 p-4 rounded-box shadow-sm">
        <h2 className="text-2xl font-bold mb-2">Daftar Denda</h2>
        <p className="mb-4 text-sm text-gray-500">Data Denda yang tercatat.</p>
        <button
          className="btn btn-primary mb-4"
          onClick={() => {
            setFormDenda({
              id_member: "",
              id_buku: "",
              jumlah_denda: "",
              jenis_denda: "",
              deskripsi: "",
            });
            setModalMode("tambah");
            setIsModalOpen(true);
          }}
        >
          + Tambah Denda
        </button>
        <div className="overflow-x-auto border rounded bg-base-100 shadow-sm">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Member</th>
                <th>Buku</th>
                <th>Jumlah</th>
                <th>Jenis</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {denda.length > 0 ? (
                denda.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.id_member}</td>
                    <td>{item.id_buku}</td>
                    <td>Rp {Number(item.jumlah_denda).toLocaleString()}</td>
                    <td>{item.jenis_denda}</td>
                    <td>{item.deskripsi}</td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleDetail(item)}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === "tambah" ? "Tambah Denda" : "Detail Denda"}
      >
        {modalMode === "tambah" && (
          <form onSubmit={submitForm}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member
              </label>
              <select
                value={formDenda.id_member}
                onChange={(e) =>
                  setFormDenda({ ...formDenda, id_member: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">Pilih Member</option>
                {memberList.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buku
              </label>
              <select
                value={formDenda.id_buku}
                onChange={(e) =>
                  setFormDenda({ ...formDenda, id_buku: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">Pilih Buku</option>
                {bukuList.map((buku) => (
                  <option key={buku.id} value={buku.id}>
                    {buku.judul}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Denda
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={formDenda.jumlah_denda}
                onChange={(e) =>
                  setFormDenda({ ...formDenda, jumlah_denda: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Denda
              </label>
              <select
                value={formDenda.jenis_denda}
                onChange={(e) =>
                  setFormDenda({ ...formDenda, jenis_denda: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">Pilih Jenis</option>
                <option value="kerusakan">Kerusakan</option>
                <option value="terlambat">Terlambat</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={formDenda.deskripsi}
                onChange={(e) =>
                  setFormDenda({ ...formDenda, deskripsi: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Tambah
            </button>
          </form>
        )}

        {modalMode === "detail" && selectedDenda && (
          <div>
            <p>
              <strong>Member:</strong> {selectedDenda.id_member}
            </p>
            <p>
              <strong>Buku:</strong> {selectedDenda.id_buku}
            </p>
            <p>
              <strong>Jumlah Denda:</strong> Rp{" "}
              {Number(selectedDenda.jumlah_denda).toLocaleString()}
            </p>
            <p>
              <strong>Jenis:</strong> {selectedDenda.jenis_denda}
            </p>
            <p>
              <strong>Deskripsi:</strong> {selectedDenda.deskripsi}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default DendaIndex;
