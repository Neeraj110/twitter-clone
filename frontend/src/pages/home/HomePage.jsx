import { Link } from "react-router-dom";
import HeroImage from "../../assets/download12.jpeg";

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white w-[100%]">
      <main className="grid place-content-center ">
        <section className="w-full p-3 md:my-8 ">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-3">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                    Discover the world in real-time
                  </h1>
                  <p className="max-w-[600px] text-gray-400 md:text-xl">
                    Join the conversation and stay connected with the people and
                    topics that matter to you.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to="/register">
                    <button className="bg-[#1DA1F2] text-white hover:bg-[#63b1e5] transition-colors px-4 py-3 font-bold rounded-md">
                      Sign Up
                    </button>
                  </Link>

                  <Link to="/login">
                    {" "}
                    <button className="border border-[#1DA1F2] text-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-colors px-4 py-3 font-bold rounded-md">
                      Sign In
                    </button>
                  </Link>
                </div>
              </div>
              <img
                src={HeroImage}
                width="550"
                height="310"
                alt="Hero"
                loading="lazy"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-contain sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section className="w-full p-5 md:pb-[7rem] md:pt-[3rem] ">
          <div className="container space-y-12 px-4 md:px-6 md:ml-[1rem]">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-700 px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Powerful tools to connect and engage
                </h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl lg:text-base xl:text-xl">
                  EchoHub provides a platform for real-time communication,
                  allowing you to share your thoughts, connect with others, and
                  stay informed on the latest news and trends.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-sm items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Post Tweets</h3>
                <p className="text-sm text-gray-400">
                  Share your thoughts, ideas, and updates with your followers.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Follow Users</h3>
                <p className="text-sm text-gray-400">
                  Connect with people and organizations that interest you.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Interact with Content</h3>
                <p className="text-sm text-gray-400">
                  Like, comment, and retweet to engage with the EchoHub
                  community.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Discover Trends</h3>
                <p className="text-sm text-gray-400">
                  Stay up-to-date on the latest news, events, and conversations.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Customize Your Feed</h3>
                <p className="text-sm text-gray-400">
                  Tailor your EchoHub experience to your interests and
                  preferences.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Engage with Communities</h3>
                <p className="text-sm text-gray-400">
                  Join conversations and connect with people who share your
                  passions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <hr />
      <footer className="bg-black  p-6 md:py-12 w-full">
        <div className="container max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm">
          <div className="grid gap-1">
            <h3 className="font-semibold">EchoHub</h3>
            <Link to="#">About</Link>
            <Link to="#">Careers</Link>
            <Link to="#">Developers</Link>
            <Link to="#">Blog</Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Legal</h3>
            <Link to="#">Terms of Service</Link>
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Cookie Policy</Link>
            <Link to="#">Accessibility</Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Resources</h3>
            <Link to="#">Help Center</Link>
            <Link to="#">EchoHub for Business</Link>
            <Link to="#">EchoHub Ads</Link>
            <Link to="#">EchoHub Media</Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Company</h3>
            <Link to="#">Leadership</Link>
            <Link to="#">Investor Relations</Link>
            <Link to="#">Transparency</Link>
            <Link to="#">Diversity</Link>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Follow Us</h3>
            <Link to="#">Twitter</Link>
            <Link to="#">Facebook</Link>
            <Link to="#">Instagram</Link>
            <Link to="#">LinkedIn</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
