import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import API from "../../lib/axios";

const BookIndex = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isId, setIsId] = useState(null);
  const [modalMode, setModalMode] = useState("tambah");

  const Navigate = useNavigate();

  const [formModal, setFormModal] = useState({
    no_rak: "",
    judul: "",
    pengarang: "",
    tahun_terbit: "",
    penerbit: "",
    stok: "",
    detail: "",
  });

  function SubmitForm(e) {
    e.preventDefault();

    API.post("/buku", formModal, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then(() => {
        setIsModalOpen(false);
        getBooks();
        setFormModal({
          no_rak: "",
          judul: "",
          pengarang: "",
          tahun_terbit: "",
          penerbit: "",
          stok: "",
          detail: "",
        });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          Navigate("/login");
        }
        setError(err.response.data);
      });
  }

  function UpdateForm(e) {
    e.preventDefault();
    API.put(`/buku/${isId}`, formModal, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    })
      .then(() => {
        setIsModalOpen(false);
        getBooks();
        setFormModal({
          no_rak: "",
          judul: "",
          pengarang: "",
          tahun_terbit: "",
          penerbit: "",
          stok: "",
          detail: "",
        });
      })
      .catch((err) => {
        setError(err.response.data);
      });
  }

  function handleModal(mode, id) {
    setModalMode(mode);
    setIsId(id);
    if (mode === "tambah") {
      setFormModal({
        no_rak: "",
        judul: "",
        pengarang: "",
        tahun_terbit: "",
        penerbit: "",
        stok: "",
        detail: "",
      });
      setIsModalOpen(true);
    } else {
      API.get(`/buku/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      }).then((res) => {
        setFormModal(res.data);
        setIsId(id);
        setIsModalOpen(true);
      });
    }
  }

  function deleteBuku(id) {
    API.delete(`/buku/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    }).then(() => {
      setIsModalOpen(false);
      getBooks();
    });
  }

  useEffect(() => {
    getBooks();
  }, []);

  function getBooks() {
    API.get("/buku", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        setBooks(res.data);
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data);
      });
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-medium text-gray-900 dark:text-gray-50">Daftar Buku</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Data buku yang terdaftar dalam sistem
              </p>
            </div>
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 h-10 px-4 py-2"
              onClick={() => {
                handleModal("tambah");
                setFormModal({
                  no_rak: "",
                  judul: "",
                  pengarang: "",
                  tahun_terbit: "",
                  penerbit: "",
                  stok: "",
                  detail: "",
                });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 mr-2"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              Tambah Buku
            </button>
          </div>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400">No. Rak</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400">Judul</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400">Pengarang</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400">Tahun Terbit</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400">Penerbit</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400">Stok</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400">Detail</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {books && books.length > 0 ? (
                  books.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                    >
                      <td className="p-4 align-middle">{item.no_rak}</td>
                      <td className="p-4 align-middle">{item.judul}</td>
                      <td className="p-4 align-middle">{item.pengarang}</td>
                      <td className="p-4 align-middle">{item.tahun_terbit}</td>
                      <td className="p-4 align-middle">{item.penerbit}</td>
                      <td className="p-4 align-middle">{item.stok}</td>
                      <td className="p-4 align-middle">{item.detail}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <button
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 h-9 px-3"
                            onClick={() => {
                              setIsModalOpen(true);
                              handleModal("detail", item.id);
                            }}
                          >
                            Detail
                          </button>
                          <button
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 dark:border-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 h-9 px-3"
                            onClick={() => {
                              setIsModalOpen(true);
                              handleModal("edit", item.id);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 border border-red-600 bg-transparent text-red-600 hover:bg-red-600 hover:text-white dark:border-red-600 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white h-9 px-3"
                            onClick={() => {
                              setIsModalOpen(true);
                              handleModal("hapus", item.id);
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500 dark:text-gray-400">
                      Data Kosong
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === "tambah"
            ? "Tambah Buku"
            : modalMode === "edit"
            ? "Edit Buku"
            : modalMode === "detail"
            ? "Detail Buku"
            : "Hapus Buku"
        }
      >
        {error && typeof error === "object" && Object.keys(error).length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-900/30 dark:border-red-900 dark:text-red-400">
            <ul className="list-disc pl-5 space-y-1">
              {Object.entries(error).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (modalMode === "edit") {
              UpdateForm(e);
            } else if (modalMode === "tambah") {
              SubmitForm(e);
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-gray-100">
              No Rak <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
              value={formModal.no_rak}
              onChange={(e) => setFormModal({ ...formModal, no_rak: e.target.value })}
              disabled={modalMode === "detail" || modalMode === "hapus"}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-gray-100">
              Judul <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
              value={formModal.judul}
              onChange={(e) => setFormModal({ ...formModal, judul: e.target.value })}
              disabled={modalMode === "detail" || modalMode === "hapus"}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-gray-100">
              Pengarang <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
              value={formModal.pengarang}
              onChange={(e) => setFormModal({ ...formModal, pengarang: e.target.value })}
              disabled={modalMode === "detail" || modalMode === "hapus"}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-gray-100">
              Tahun Terbit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
              value={formModal.tahun_terbit}
              onChange={(e) => setFormModal({ ...formModal, tahun_terbit: e.target.value })}
              disabled={modalMode === "detail" || modalMode === "hapus"}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-gray-100">
              Penerbit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
              value={formModal.penerbit}
              onChange={(e) => setFormModal({ ...formModal, penerbit: e.target.value })}
              disabled={modalMode === "detail" || modalMode === "hapus"}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-gray-100">
              Stok <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
              value={formModal.stok}
              onChange={(e) => setFormModal({ ...formModal, stok: e.target.value })}
              disabled={modalMode === "detail" || modalMode === "hapus"}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-gray-100">
              Detail <span className="text-red-500">*</span>
            </label>
            <textarea
              className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300 min-h-[80px]"
              value={formModal.detail}
              onChange={(e) => setFormModal({ ...formModal, detail: e.target.value })}
              disabled={modalMode === "detail" || modalMode === "hapus"}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 h-10 px-4 py-2"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </button>
            
            {modalMode === "tambah" && (
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 h-10 px-4 py-2"
              >
                Tambah
              </button>
            )}

            {modalMode === "edit" && (
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 h-10 px-4 py-2"
              >
                Simpan Perubahan
              </button>
            )}

            {modalMode === "hapus" && (
              <button
                type="button"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 h-10 px-4 py-2"
                onClick={() => deleteBuku(isId)}
              >
                Konfirmasi Hapus
              </button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BookIndex;