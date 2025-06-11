import React, { useEffect, useState } from "react";
import API from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

const MemberIndex = () => {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isId, setIsId] = useState(0);
  const [modalMode, setModalMode] = useState("tambah");

  const Navigate = useNavigate();

  // if(formModal.no_ktp === length 12) 
  const [formModal, setFormModal] = useState({
    no_ktp: "",
    nama: "",
    alamat: "",
    tgl_lahir: "",
  });

  useEffect(() => {
    getMembers();
  }, []);

  const getMembers = async () => {
    try {
      const res = await API.get("/member", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      setMembers(res.data);
    } catch (error) {
      setError(error.response?.data || "Gagal mengambil data");
    }
  };

  const SubmitForm = async (e) => {
    e.preventDefault();
    try {
      await API.post("/member", formModal, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      setIsModalOpen(false);
      getMembers();
      resetForm();
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        Navigate("/login");
      }
      setError(err.response?.data);
    }
  };

  const UpdateForm = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/member/${isId}`, formModal, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      setIsModalOpen(false);
      getMembers();
      resetForm();
    } catch (err) {
      setError(err.response?.data);
    }
  };

  const deleteMember = async (id) => {
    try {
      await API.delete(`/member/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      setIsModalOpen(false);
      getMembers();
    } catch (err) {
      setError(err.response?.data);
    }
  };

  const handleModal = async (mode, id = null) => {
    setModalMode(mode);
    if (mode === "tambah") {
      resetForm();
      setIsModalOpen(true);
    } else if (id) {
      try {
        const res = await API.get(`/member/${id}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        });
        setFormModal(res.data);
        setIsId(id);
        setIsModalOpen(true);
      } catch (err) {
        setError(err.response?.data);
      }
    }
  };

  const resetForm = () => {
    setFormModal({ no_ktp: "", nama: "", alamat: "", tgl_lahir: "" });
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-base-200 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-white">Daftar Anggota</h1>
          <p className="text-gray-500 mt-1">Data anggota yang terdaftar.</p>
        </div>
        <button
          onClick={() => handleModal("tambah")}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
        >
          + Add
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-150">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">No KTP</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Nama</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Alamat</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Tgl Lahir</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-base-200 divide-y divide-gray-200">
            {members.length > 0 ? (
              members.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200 font-medium">{item.no_ktp}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">{item.nama}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">{item.alamat}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">{item.tgl_lahir}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm flex gap-2">
                    <button
                      onClick={() => handleModal("detail", item.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      aria-label="Detail"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => handleModal("edit", item.id)}
                      className="text-green-600 hover:text-green-800 font-medium"
                      aria-label="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleModal("hapus", item.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                      aria-label="Hapus"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-400 italic">
                  Data kosong
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === "tambah"
            ? "Tambah Anggota"
            : modalMode === "edit"
            ? "Edit Anggota"
            : modalMode === "detail"
            ? "Detail Anggota"
            : "Hapus Anggota"
        }
      >
        {/* Error Message */}
        {error && typeof error === "object" && (
          <ul className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {Object.entries(error).map(([key, value]) => (
              <li key={key}>{value}</li>
            ))}
          </ul>
        )}

        {(modalMode === "tambah" || modalMode === "edit") && (
          <form
            onSubmit={modalMode === "edit" ? UpdateForm : SubmitForm}
            className="space-y-5"
          >
            <input
              type="number"
              placeholder="No KTP"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formModal.no_ktp}
              onChange={(e) => setFormModal({ ...formModal, no_ktp: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Nama"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formModal.nama}
              onChange={(e) => setFormModal({ ...formModal, nama: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Alamat"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formModal.alamat}
              onChange={(e) => setFormModal({ ...formModal, alamat: e.target.value })}
              required
            />
            <input
              type="date"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formModal.tgl_lahir}
              onChange={(e) => setFormModal({ ...formModal, tgl_lahir: e.target.value })}
              required
            />
            <button
              type="submit"
              className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              {modalMode === "tambah" ? "Tambah" : "Update"}
            </button>
          </form>
        )}

        {modalMode === "hapus" && (
          <div>
            <p className="text-gray-200 mb-6">Yakin ingin menghapus anggota ini?</p>
            <button
              onClick={() => deleteMember(isId)}
              className="w-full py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Hapus
            </button>
          </div>
        )}

        {modalMode === "detail" && (
          <div className="space-y-3 text-gray-200">
            <p><strong>No KTP:</strong> {formModal.no_ktp}</p>
            <p><strong>Nama:</strong> {formModal.nama}</p>
            <p><strong>Alamat:</strong> {formModal.alamat}</p>
            <p><strong>Tanggal Lahir:</strong> {formModal.tgl_lahir}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MemberIndex;
