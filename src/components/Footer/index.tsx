const Footer = () => {
  return (
    <footer className="absolute bottom-2 w-full">
      <div className="mx-auto w-max text-xs sm:text-base">
        © {new Date().getFullYear()} Rishav Medhi ·{" "}
        <a className="underline underline-offset-2" href="https://github.com/rishavmedhi/fun-bluff">Source</a>
      </div>
    </footer>
  );
};

export default Footer;