import Logo from '../../assets/images/logo/Sleek-logo.png';

export default function Hero() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,#121827,#0f0f1b)] text-white px-8 md:px-16 py-12 flex flex-col justify-between">
       {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-purple-700 opacity-30 rounded-full blur-[200px] z-0" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-500 opacity-20 rounded-full blur-[100px] z-0" />
      {/* Nav */}
      <nav className="flex justify-between items-center">
        <div className="text-2xl font-bold">StockS</div>
        <div className="hidden md:flex items-center gap-4">
          <a href="#features" className="text-white hover:text-purple-300 transition">Features</a>
          <a href="#pricing" className="text-white hover:text-purple-300 transition">Pricing</a>
          <a href="#company" className="text-white hover:text-purple-300 transition">Company</a>
          <button className="border border-gray-500 text-white px-4 py-2 rounded-md hover:border-purple-400 transition">
            Try Demo
          </button>
          <button className="bg-[#7B5FA2] text-white px-4 py-2 rounded-md font-semibold hover:bg-purple-700 transition">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between flex-1 mt-16 gap-10 mx-auto">
        
        {/* Left Side */}
        <div className="w-full lg:w-1/2 max-w-[50%] text-center lg:text-left">
          <h1 className="text-4xl md:text-[3rem] leading-tight font-extrabold">
            Smarter Stock Management <br />
            with{" "}
            <span className="bg-linear-to-r from-[#7B5FA2] to-[#ff6ec7] bg-clip-text text-transparent">
              AI Precision
            </span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-gray-300">
            Say goodbye to overstock, shortages, and guesswork. StockS gives you real-time insights and smart predictions to boost profits.
          </p>
          <button className="mt-8 bg-[#7B5FA2] text-white px-6 py-3 rounded-md font-bold text-base hover:bg-purple-700 transition">
            Get Started Free
          </button>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <img
            src={Logo}
            alt="3D AI Assistant Box"
            className="w-[500px] max-w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
