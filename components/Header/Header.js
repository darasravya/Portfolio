import Fade from "react-reveal/Fade";

const Header = ({ children }) => {
  return (
    <nav className="w-full fixed top-0 py-8 z-50 select-none bg-gradient-to-b from-gray-dark-5 shadow-gray-dark-5 transition-all duration-300">
      <Fade>
          <div className="outer-menu relative">
            <input
              aria-labelledby="menu"
              className="checkbox-toggle link absolute top-0 right-0 w-6 h-6 opacity-0 cursor-pointer"
              type="checkbox"
              aria-label="menu"
            />
            <div className="hamburger absolute top-0 right-0 w-6 h-6 flex items-center justify-center">
              <div className="relative flex-none w-full bg-white duration-300 flex items-center justify-center"></div>
            </div>
            {children}
          </div>
      </Fade>
    </nav>
  );
};

export default Header;
