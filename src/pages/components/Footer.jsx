const Footer = () => {
  return (
    <footer className="footer flex flex-col sm:flex-row justify-between items-center p-6 bg-base-200 text-base-content">
      <div className="flex items-center gap-3">
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-primary"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L1 21h22L12 2z" />
        </svg>
        <p className="text-sm opacity-70">
          SMK Wikrama Bogor — {new Date().getFullYear()}
        </p>
      </div>

      <div className="flex gap-4 mt-4 sm:mt-0">
        <a
          href="#"
          aria-label="Twitter"
          className="hover:text-primary transition-colors">
          <svg
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24">
            <path d="M24 4.557a9.93..." />
          </svg>
        </a>
        <a
          href="#"
          aria-label="YouTube"
          className="hover:text-primary transition-colors">
          <svg
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24">
            <path d="M19.615 3.184c..." />
          </svg>
        </a>
        <a
          href="#"
          aria-label="Facebook"
          className="hover:text-primary transition-colors">
          <svg
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24">
            <path d="M9 8h-3v4h3v12h5..." />
          </svg>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
