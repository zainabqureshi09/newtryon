import "@/MarqueeBanner.css";

const MarqueeBanner = () => {
  return (
    <div className="marquee-container">
      <div className="marquee-content">
        <span className="marquee-item purple">
          Pay with bank transfer and get
        </span>
        <span className="marquee-item white">
          flat 15% discount <br /> on glasses & sunglasses
        </span>
        <span className="marquee-item sky"> at checkout! </span>
        <span className="marquee-item pink">
          10% discount <br /> on contact lenses
        </span>

        {/* Duplicate for seamless loop */}
        <span className="marquee-item purple">
          Pay with bank transfer and get
        </span>
        <span className="marquee-item white">
          flat 15% discount <br /> on glasses & sunglasses
        </span>
        <span className="marquee-item sky"> at checkout! </span>
        <span className="marquee-item pink">
          10% discount <br /> on contact lenses
        </span>
      </div>
    </div>
  );
};

export default MarqueeBanner;
