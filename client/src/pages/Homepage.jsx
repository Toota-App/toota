import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import registerComponentInObserver from '../lib/utils/intersection';
import 'swiper/css';
import 'swiper/css/pagination';

const Homepage = () => {

  const driverCardImageRef = useRef(null);
  const driverCardContentRef = useRef(null);
  const userCardImageRef = useRef(null);
  const userCardContentRef = useRef(null);
  const fleetServiceCardRef = useRef(null);
  const formServiceCardRef = useRef(null);
  const negotiateServiceCardRef = useRef(null);
  const rateServiceCardRef = useRef(null);
  const jobsServiceCardRef = useRef(null);
  const routesServiceCardRef = useRef(null);
  const swipperRef = useRef(null);

  useEffect(() => {
    const options = {
      threshold: 0,
      rootMargin: "0px 999px 0px 999px"
    };

    registerComponentInObserver(driverCardImageRef, [{
      element: driverCardImageRef,
      classList: ['animate-fadefromstartwithdelay'],
    }, {
      element: driverCardContentRef,
      classList: ['animate-fadefromendwithdelay'],
    },
    ], options);
    registerComponentInObserver(userCardImageRef, [{
      element: userCardImageRef,
      classList: ['animate-fadefromend'],
    }, {
      element: userCardContentRef,
      classList: ['animate-fadefromstart']
    }
    ], options);
    registerComponentInObserver(fleetServiceCardRef, [{
      element: fleetServiceCardRef,
      classList: ['animate-fadefromstartwithdelay1000',],
    }], options);
    registerComponentInObserver(formServiceCardRef, [{
      element: formServiceCardRef,
      classList: ['animate-fadefromendwithdelay2000',],
    }], options);
    registerComponentInObserver(negotiateServiceCardRef, [{
      element: negotiateServiceCardRef,
      classList: ['animate-fadefromstartwithdelay2000',],
    }], options);
    registerComponentInObserver(rateServiceCardRef, [{
      element: rateServiceCardRef,
      classList: ['animate-fadefromendwithdelay1000',],
    }], options);
    registerComponentInObserver(jobsServiceCardRef, [{
      element: jobsServiceCardRef,
      classList: ['animate-fadefromstartwithdelay',],
    }], options);
    registerComponentInObserver(routesServiceCardRef, [{
      element: routesServiceCardRef,
      classList: ['animate-fadefromendwithdelay',],
    }], options);
    registerComponentInObserver(swipperRef, [{
      element: swipperRef,
      classList: ['animate-fadefromstartwithdelay2000'],
    }], options)
  }, []);

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center">
        <div className="flex flex-col gap-12">
          <div className="relative h-[36rem] overflow-y-hidden">
            <div className="flex flex-col items-start gap-8 absolute z-10 px-8 top-1/2 -translate-y-1/2 opacity-0 text-white md:px-32 lg:px-48 animate-herocontentup">
              <p className="text-xl text-[#f89f1b]">Welcome to <span className="font-bold text-white">Toota</span></p>
              <div className="flex flex-col gap-4">
                <h1 className="text-xl font-bold text-[#f89f1b] md:text-5xl">Your Ultimate Transportation Solution</h1>
                <p>Connect effortlessly with a diverse fleet of vehicles</p>
              </div>
              <Link className="px-4 py-2 rounded text-black bg-[#f89f1b] hover:bg-transparent hover:outline-1 hover:outline hover:outine-[#f89f1b] hover:text-[#f89f1b] transition-all" to="/become-driver">Join as a driver</Link>
            </div>
            <img aria-hidden="true" className="w-full h-full object-cover animate-scaledown" src="https://images.pexels.com/photos/7843985/pexels-photo-7843985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Photo of a delivery truck" />
            <i className="absolute inset-0 bg-black opacity-40"></i>
          </div>
          <div className="flex flex-col gap-8 md:text-left pb-16 px-4 md:px-32 lg:px-48 text-black dark:text-white">
            <p className="text-base md:text-lg">With Toota, you can effortlessly connect with a diverse fleet of vehicles and experienced drivers to meet all your transportation needs. Whether you're moving goods, moving out, or in need of a truck to help convey your items, Toota ensures a reliable, efficient, and hassle-free experience every time.</p>
            <p className="text-base md:text-lg">Looking for a transparent and reliable transportation service? Look no further! Toota has got you covered.</p>
            <p className="text-base md:text-lg">Join Toota today and experience the future of transportation!</p>
          </div>
        </div>
      </div>
      <section className="bg-[#f89f1b] mb-12 py-20 dark:bg-[#404042] overflow-x-hidden">
        <div className="flex flex-col gap-8">
          <h2 className="text-3xl font-bold text-center text-black dark:text-white">Featured Services</h2>
          <div className="grid md:grid-cols-2 place-content-center gap-16 lg:gap-32">
            <div ref={fleetServiceCardRef} className="flex items-center justify-center flex-col gap-4 w-full max-w-sm md:pl-4 md:ml-auto opacity-0 -translate-x-full text-black dark:text-white">
              <h3 className="text-xl font-semibold">Diverse Fleet</h3>
              <div className="glass group flex flex-col gap-4 pb-4">
                <div className="relative w-full h-80 overflow-hidden">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://images.pexels.com/photos/20882743/pexels-photo-20882743/free-photo-of-red-and-blue-trucks-parked-at-a-depot.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="A photo of some fleet of trucks" />
                  <i className="absolute inset-0 opacity-70 group-hover:bg-black transition-all duration-700"></i>
                  <p className="absolute bottom-0 left-0 p-4 text-[#f89f1b] bg-black opacity-0 translate-y-full dark:text-white group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">We can help with your current transportation problem because we offer a range of drivers with different trucks. We will assist you in determining which truck could be of use to you.</p>
                </div>
                <p className="px-4">Access a variety of vans and trucks to meet your transportation needs.</p>
              </div>
            </div>
            <div ref={formServiceCardRef} className="flex items-center justify-center flex-col gap-4 w-full max-w-sm md:pr-4 md:mr-auto opacity-0 translate-x-full text-black dark:text-white">
              <h3 className="text-xl font-semibold">Standard Form</h3>
              <div className="glass group flex flex-col gap-4 pb-4">
                <div className="relative w-full h-80 overflow-hidden">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://cdn.pixabay.com/photo/2017/06/13/12/28/pen-2398693_1280.jpg" alt="A photo of an application form" />
                  <i className="absolute inset-0 opacity-70 group-hover:bg-black transition-all duration-700"></i>
                  <p className="absolute bottom-0 left-0 p-4 text-[#f89f1b] bg-black opacity-0 translate-y-full dark:text-white group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">We only gather information that is necessary to give you a smooth, rich, and intuitive experience.</p>
                </div>
                <p className="px-4">Fill out a standard form to provide details about your transportation requirements.</p>
              </div>
            </div>
            <div ref={negotiateServiceCardRef} className="flex items-center justify-center flex-col gap-4 w-full max-w-sm md:pl-4 md:ml-auto opacity-0 -translate-x-full text-black dark:text-white">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Negotiate</h3>
              <div className="glass group flex flex-col gap-4 pb-4">
                <div className="relative w-full h-80 overflow-hidden">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"  src="https://cdn.pixabay.com/photo/2024/05/15/19/16/ai-generated-8764343_960_720.jpg" alt="A photo of two hands shaking during a negotiation" />
                  <i className="absolute inset-0 opacity-70 group-hover:bg-black transition-all duration-700"></i>
                  <p className="absolute bottom-0 left-0 p-4 text-[#f89f1b] bg-black opacity-0 translate-y-full dark:text-white group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">We give you the power to agree on what works best for all parties. We have in-app features to enable you negotiate at ease</p>
                </div>
                <p className="px-4">To guarantee that everyone gets a fair bargain, we enable you both parties to haggle over the price.</p>
              </div>
            </div>
            <div ref={rateServiceCardRef} className="flex items-center justify-center flex-col gap-4 w-full max-w-sm md:pr-4 md:mr-auto opacity-0 translate-x-full text-black dark:text-white">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Peer-to-Peer Rating</h3>
              <div className="glass group flex flex-col gap-4 pb-4">
                <div className="relative w-full h-80 overflow-hidden">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"  src="https://cdn.pixabay.com/photo/2024/04/05/14/16/ai-generated-8677495_1280.png" alt="A photo of how end users can rate each other" />
                  <i className="absolute inset-0 opacity-70 group-hover:bg-black transition-all duration-700"></i>
                  <p className="absolute bottom-0 left-0 p-4 text-[#f89f1b] bg-black opacity-0 translate-y-full dark:text-white group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">In order to give each and every one of our users a special experience, we respect ratings and reviews.</p>
                </div>
                <p className="px-4">Review drivers based on your experience to help others make informed choices.</p>
              </div>
            </div>
            <div ref={jobsServiceCardRef} className="flex items-center justify-center flex-col gap-4 w-full max-w-sm md:pl-4 ml-auto opacity-0 -translate-x-full text-black dark:text-white">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Upcoming Jobs</h3>
              <div className="glass group flex flex-col gap-4 pb-4">
                <div className="relative w-full h-80 overflow-hidden">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"  src="https://images.pexels.com/photos/28353100/pexels-photo-28353100/free-photo-of-a-white-notebook-with-a-pen-on-top-of-it.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="A photo of a book to monitor calendar" />
                  <i className="absolute inset-0 opacity-70 group-hover:bg-black transition-all duration-700"></i>
                  <p className="absolute bottom-0 left-0 p-4 text-[#f89f1b] bg-black opacity-0 translate-y-full dark:text-white group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">We make it simple for you to determine when your next trip is due. You can keep track of future trips you have planned with our in-app calendar.</p>
                </div>
                <p className="px-4">View and manage your upcoming jobs with ease using our integrated calendar.</p>
              </div>
            </div>
            <div ref={routesServiceCardRef} className="flex items-center justify-center flex-col gap-4 w-full max-w-sm md:pr-4 md:mr-auto opacity-0 translate-x-full text-black dark:text-white">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Explore New Routes</h3>
              <div className="glass group flex flex-col gap-4 pb-4">
                <div className="relative w-full h-80 overflow-hidden">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"  src="https://images.pexels.com/photos/21014/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="A photo showing Google Map with some routes" />
                  <i className="absolute inset-0 opacity-70 group-hover:bg-black transition-all duration-700"></i>
                  <p className="absolute bottom-0 left-0 p-4 text-[#f89f1b] bg-black opacity-0 translate-y-full dark:text-white group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">We offer real-time updates on the driver you request using our in-app map feature. Additionally, drivers can receive real-time updates about clients who want to travel with them.</p>
                </div>
                <p className="px-4">Discover new routes and expand your horizons with our integrated map feature.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-16 py-12 md:px-2 overflow-x-hidden">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div ref={driverCardImageRef} className="group shadow-lg relative h-80 opacity-0 -translate-x-full">
            <img src="https://img.freepik.com/premium-photo/happy-smiling-truck-driver-sitting-his-truck-created-with-generative-ai-technology_132358-11849.jpg" alt="Driver" className="w-full h-full object-cover object-top transition-all duration-1000 group-hover:scale-110" />
            <i className="absolute inset-0 bg-black opacity-70 transition-opacity duration-1000 group-hover:opacity-50"></i>
            <div className="absolute inset-0 w-full text-white">
              <p className="absolute bottom-0 w-full overflow-y-hidden">
                <span className="block relative z-10 p-4 bg-[#f89f1b] text-black dark:text-white dark:bg-black translate-y-[200%] group-hover:translate-y-0 transition-all duration-700">As a driver, you can make what you need with Toota's flexible schedule</span>
                <span className="block relative z-20 p-4 text-xl lg:text-3xl bg-[#f89f1b] text-black dark:text-white dark:bg-black">Drive when you want</span>
              </p>
            </div>
          </div>
          <div ref={driverCardContentRef} className="flex flex-col gap-4 justify-center items-start px-4 opacity-0 translate-x-full">
            <p className="text-lg">Whether you're looking to earn extra income or make a living, Toota gives you the freedom to choose when and where you work.</p>
            <a href="/signup/driver" className="px-6 py-2 rounded-full bg-[#f89f1b] text-black hover:bg-gray-300 transition-colors duration-300">Get started as a driver</a>
            <p className="text-sm">Already have an account as a driver? <a href="/login/driver" className="text-orange-700 dark:text-white hover:text-black dark:hover:text-[#f89f1b]">Login</a></p>
          </div>
        </div>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div ref={userCardContentRef} className="flex flex-col gap-4 justify-center items-start px-4 opacity-0 -translate-x-full">
            <p className="text-lg">We understand that moving or transfering goods is not an easy task, this is why we provide you with the most secure and reliable way to get what matters to you safely to its destination.</p>
            <a href="/signup/user" className="px-6 py-2 rounded-full bg-[#f89f1b] text-black hover:bg-gray-300 transition-colors duration-300">Start creating new trips</a>
            <p className="text-sm">Already a user? <a href="/login/user" className="text-orange-700 dark:text-white hover:text-black dark:hover:text-[#f89f1b]">Login</a></p>
          </div>
          <div ref={userCardImageRef} className="group shadow-lg relative h-80 opacity-0 translate-x-full">
            <img src="https://cdn.pixabay.com/photo/2024/01/18/16/33/ai-generated-8517190_960_720.jpg" alt="Driver" className="w-full h-full object-cover object-top transition-all duration-1000 group-hover:scale-110" />
            <i className="absolute inset-0 bg-black opacity-70 transition-opacity duration-1000 group-hover:opacity-50"></i>
            <div className="absolute inset-0 w-full text-white">
              <p className="absolute bottom-0 w-full overflow-y-hidden">
                <span className="block relative z-10 p-4 bg-[#f89f1b] text-black dark:text-white dark:bg-black translate-y-[200%] group-hover:translate-y-0 transition-all duration-700">Easily book a trip at your convenience. Anyday! Anytime! Anywhere!</span>
                <span className="block relative z-20 p-4 text-xl lg:text-3xl bg-[#f89f1b] text-black dark:text-white dark:bg-black">Book your next trip</span>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center gap-16 py-12 px-4 text-black dark:text-white dark:bg-black md:px-32 lg:px-48 overflow-x-scroll" style={{clipPath: 'polygon(0% 0%, 46% 0%, 50% 5%, 54% 0%, 100% 0%, 100% 100%, 0% 100%)'}}>
        <div className="flex flex-col gap-8">
          <h2 className="text-3xl font-bold text-center text-black dark:text-white">Our Values</h2>
          <p>At Toota, we are known by our values. We are bound to these and we believe this is what sets us apart.</p>
        </div>
        <Swiper
        ref={swipperRef}
          pagination={{
            dynamicBullets: true,
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="flex flex-col items-center gap-4 p-4">
              <p className="uppercase text-xl">Quality</p>
              <div className="h-96">
                <img className="w-full h-full object-contain drop-shadow-2xl" src="https://cdn.pixabay.com/photo/2022/03/01/08/11/call-center-7040784_960_720.png" alt="" />
              </div>
              <p>We have you at heart and care about providing quality service to build a stronger and lasting relationship</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex flex-col items-center gap-4 p-4">
              <p className="uppercase text-xl">Trust</p>
              <div className="h-96">
                <img className="w-full h-full object-contain drop-shadow-2xl" src="https://cdn.pixabay.com/photo/2022/01/22/01/54/job-6956074_960_720.png" alt="" />
              </div>
              <p>We strive to keep our platform secure so you do not worry about any breach</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex flex-col items-center gap-4 p-4">
              <p className="uppercase text-xl">Satisfaction</p>
              <div className="h-96">
                <img className="w-full h-full object-contain drop-shadow-2xl" src="https://cdn.pixabay.com/photo/2024/03/28/19/43/customer-service-8661577_960_720.png" alt="" />
              </div>
              <p>We provide support to ensure you always come back to us with a smile</p>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
      <Footer />
    </div>
  );
};

export default Homepage;

