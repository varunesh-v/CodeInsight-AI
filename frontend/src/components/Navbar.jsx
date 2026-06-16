function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-cyan-400">
        CodeInsight AI
      </h1>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;