import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Facebook, Github, Instagram, Twitter, Brain, Pencil, Clock} from "lucide-react"

 export default function page() {
  return (
    <div className="min-h-screen bg-[#1a2942]">
     
      {/* Hero Section */}
      <section className="relative h-[400px]">
        <Image
          src="/images/hero.jpg"
          alt="Person reading news"
          fill
          className="object-cover brightness-50"
        />
        <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center text-white relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Stay informed</h1>
          <p className="text-lg md:text-xl mb-8">
            Subscribe now for curated news and insights, delivered directly to you.
          </p>
          <Button size="lg" className="bg-[#1a2942] hover:bg-[#1a2942]/90">
            <Link href="/auth">Join Us Today</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-[#1a2942] text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  
                  Bite-Sized News
                </h3>
                <div className="mb-4 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-white" />
                  <span className="font-medium">AI Summarization</span>
                </div>
                <p className="text-white/80">Stay informed in minutes without the need to read lengthy articles.</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1a2942] text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  Your News,
                  Your Way.
                </h3>
                <div className="mb-4 flex items-center gap-2">
                  <Pencil className="w-6 h-6 text-white" />
                  <span className="font-medium">Personalized Newsfeed</span>
                </div>
                <p className="text-white/80">
                  Personalize your news feed with categories that matter most to you - source of the information, 
                  keywords you want to include, and keywords you want to exclude. Tailored to your interests for a truly unique experience.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1a2942] text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">
                Read-o-Meter  
                </h3>
                <div className="mb-4">
                <div className="mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-white" />
                  <span className="font-medium">Read Time Estimator</span>
                </div>
                </div>
                <p className="text-white/80">
                  Engage with the news like never before! Like, comment, and share stories that resonate with you. Join
                  the community and interact with fellow readers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How it work</h2>
          <div className="grid gap-8 max-w-4xl mx-auto">
            <Card className="ml-0 md:ml-12">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Step 1: Sign Up and Customize Preference</h3>
                <p className="text-gray-600">
                  Create an account to get started and create categories based on personal interest
                </p>
              </CardContent>
            </Card>

            <Card className="mr-0 md:mr-12 md:ml-auto">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Step 2: Get News Summaries</h3>
                <p className="text-gray-600">Articles are summarized through the power of OpenAi technology</p>
              </CardContent>
            </Card>

            <Card className="ml-0 md:ml-12">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Step 3: Like and Read</h3>
                <p className="text-gray-600">Like, select an article, and enjoy</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Link href="/" className="text-2xl font-bold mb-4 block">
                InBrief
              </Link>
              <p className="text-gray-400 mb-4">Start your personalized news journey today!</p>
              <Button variant="secondary" className="bg-white text-black hover:bg-white/90">
                Get Started for Free
              </Button>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Community</h3>
              <div className="flex gap-4">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="w-6 h-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Github className="w-6 h-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="w-6 h-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="w-6 h-6" />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Company</h3>
              <div className="grid gap-2">
                <Link href="#" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Collaboration
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Advertise
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


