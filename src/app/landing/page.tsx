import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { ArrowRight, BarChart2, PiggyBank, TrendingUp, Users } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col justify-center items-center p-4 md:p-8">
      <header className="w-full max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-800 mb-4">Retirement Planner</h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">Plan your financial future with confidence</p>
        <Link href="/planner">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            Start Planning Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-6xl mx-auto">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Why Choose Our Retirement Planner?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<PiggyBank className="h-12 w-12 text-blue-600" />}
              title="Personalized Planning"
              description="Tailor your retirement plan to your unique financial situation and goals."
            />
            <FeatureCard
              icon={<TrendingUp className="h-12 w-12 text-blue-600" />}
              title="Investment Strategies"
              description="Explore various investment stages and optimize your portfolio growth."
            />
            <FeatureCard
              icon={<BarChart2 className="h-12 w-12 text-blue-600" />}
              title="Expense Management"
              description="Account for major life expenses and see their impact on your retirement savings."
            />
          </div>
        </section>

        <section className="mb-16">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-800">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Step number={1} title="Enter Your Information">
                Provide details about your current financial situation, including age, salary, and expenses.
              </Step>
              <Step number={2} title="Set Your Goals">
                Define your retirement age and desired lifestyle expenses during retirement.
              </Step>
              <Step number={3} title="Customize Your Plan">
                Add information about major life events, such as children's education or property purchases.
              </Step>
              <Step number={4} title="Analyze Results">
                Review your personalized retirement plan, including FIRE number and portfolio growth projections.
              </Step>
            </CardContent>
          </Card>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">Ready to Secure Your Future?</h2>
          <p className="text-xl text-gray-600 mb-8">Start planning for your retirement today and take control of your financial destiny.</p>
          <Link href="/planner">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </section>
      </main>

      <footer className="w-full max-w-6xl mx-auto mt-16 text-center text-gray-600">
        <p>&copy; 2024 Retirement Planner. All rights reserved.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="bg-white/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="mb-4 flex justify-center">{icon}</div>
        <CardTitle className="text-xl font-semibold text-blue-700">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-blue-800">{title}</h3>
        <p className="text-gray-600">{children}</p>
      </div>
    </div>
  )
}