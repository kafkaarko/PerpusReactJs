
const Home = () => {
  return (
    <div className="min-h-screen bg-base-100 text-white flex flex-col items-center justify-center px-6">
      <img
        src="public/perpus.png"
        alt="perpus"
        className="w-32 h-32 object-contain mb-6"
        height={600}
        width={600}
      />
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
        Selamat Datang di Perpustakaan Wikrama!
      </h1>
      <p className="text-center text-gray-400 text-lg md:text-xl mb-8 max-w-xl">
        Perpustakaan adalah jendela dunia. Buka cakrawala pengetahuanmu sekarang juga!
      </p>
      {/* <div className="flex flex-col md:flex-row gap-4">
        <button className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-black transition duration-300">
          Daftar Member
        </button>
        <button className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-black transition duration-300">
          Pinjam Buku
        </button>
      </div> */}
    </div>
  );
};

export default Home;

