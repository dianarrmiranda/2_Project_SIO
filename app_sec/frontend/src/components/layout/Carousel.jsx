import { useNavigate } from 'react-router-dom';
import '../../utils/styles.css'

const Carousel = ({ images }) => {
  const navigate = useNavigate();

  return (
    <div className="carousel w-full">
      <div
        id={`slide0`}
        className="carousel-item ease-in-out duration-300 relative w-full max-h-[80vh] overflow-y-hidden"
      >
        <div
          className="hero min-h-screen"
          style={{
            backgroundImage:
              'url(https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg)',
          }}
        >
          <div className="hero-overlay bg-opacity-70"></div>
          <div className="hero-content text-center text-neutral-content">
            <div className="max-w-lg">
              <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
              <p className="mb-5">
                Welcome to our department's online merch store!<br/>
                Here you can find your favorite stuff with our favorite designs, from your department's logo to your beloved TUX!<br/>
                <span className='font-bold'>Dig in!</span> 
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/store')}
              >
                Go to Store
              </button>
            </div>
          </div>
        </div>
        <span className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <a
            href={'#slide3'}
            className="btn btn-circle opacity-20 hover:opacity-100"
          >
            ❮
          </a>
          <a
            href={'#slide1'}
            className="btn btn-circle opacity-20 hover:opacity-100"
          >
            ❯
          </a>
        </span>
      </div>

      {images.map((url, idx) => (
        <div
          key={idx}
          id={`slide${idx + 1}`}
          className="carousel-item relative w-full easy-in-out duration-700 max-h-[80vh] overflow-y-hidden"
        >
          <img
            src={url}
            className="w-full"
          />
          <span className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a
              href={'#slide' + ((idx - 1 + 1) % 4)}
              className="btn btn-circle opacity-20 hover:opacity-100"
            >
              ❮
            </a>
            <a
              href={'#slide' + ((idx + 1 + 1) % 4)}
              className="btn btn-circle opacity-20 hover:opacity-100"
            >
              ❯
            </a>
          </span>
        </div>
      ))}
    </div>
  );
};

export default Carousel;
