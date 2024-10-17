'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, Trash2, Info, Edit, Calculator, ChevronDown, ChevronUp } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { motion, AnimatePresence } from 'framer-motion'

type ChildExpense = {
  educationExpense: number
  weddingExpense: number
  isEducationLoan: boolean
  educationLoanInterest: number
  educationLoanTerm: number
  educationUpfrontPayment: number
  isWeddingLoan: boolean
  weddingLoanInterest: number
  weddingLoanTerm: number
  weddingUpfrontPayment: number
  educationExpenseYears: number
  weddingExpenseYears: number
}

type AssetExpense = {
  type: 'House' | 'Car'
  totalExpense: number
  isLoan: boolean
  upfrontPayment: number
  emi: number
  interestRate: number
  loanTerm: number
  cumulativeEmi: number
  yearsUntilPurchase: number
}

type RetirementData = {
  currentAge: number
  retirementAge: number
  lumpsumInvestment: number
  initialSIP: number
  annualIncrease: number
  currentSalary: number
  increaseModel: 'YOY' | 'Basic'
  averageIncrements: number
  currentLifestyleExpense: number
  numberOfChildren: number
  childExpenses: ChildExpense[]
  assetExpenses: AssetExpense[]
  inflationRate: number
  initialInvestmentRatio: number
}

type DetailedPortfolioGrowthItem = {
  age: number
  month: number
  portfolioValue: number
  emi: number
  lifestyleExpense: number
  majorExpense: number
  stage: number
  stageReturn: string
}

type InflationRates = {
  homeInflation: number
  educationInflation: number
  weddingInflation: number
}

type MajorWithdrawal = {
  age: number
  amount: number
  reason: string
}

const defaultChildExpense: ChildExpense = {
  educationExpense: 2000000,
  weddingExpense: 1000000,
  isEducationLoan: false,
  educationLoanInterest: 0,
  educationLoanTerm: 60,
  educationUpfrontPayment: 0,
  isWeddingLoan: false,
  weddingLoanInterest: 0,
  weddingLoanTerm: 60,
  weddingUpfrontPayment: 0,
  educationExpenseYears: 0,
  weddingExpenseYears: 0
}

const defaultAssetExpense: AssetExpense = {
  type: 'House',
  totalExpense: 5000000,
  isLoan: false,
  upfrontPayment: 0,
  emi: 0,
  interestRate: 0,
  loanTerm: 240,
  cumulativeEmi: 0,
  yearsUntilPurchase: 0
}

const investmentStages = [
  { code: 1, mf: 90, equity: 0, bonds: 0, aif: 10, unlisted: 0, roi: 16.80 },
  { code: 2, mf: 85, equity: 0, bonds: 15, aif: 0, unlisted: 0, roi: 13.95 },
  { code: 3, mf: 65, equity: 0, bonds: 25, aif: 0, unlisted: 10, roi: 16.75 },
  { code: 4, mf: 65, equity: 0, bonds: 35, aif: 0, unlisted: 0, roi: 12.55 },
  { code: 5, mf: 70, equity: 0, bonds: 10, aif: 0, unlisted: 20, roi: 21.30 },
  { code: 6, mf: 45, equity: 20, bonds: 15, aif: 10, unlisted: 10, roi: 22.25 },
  { code: 7, mf: 55, equity: 0, bonds: 45, aif: 0, unlisted: 0, roi: 11.85 },
  { code: 8, mf: 55, equity: 0, bonds: 45, aif: 0, unlisted: 0, roi: 11.85 },
  { code: 9, mf: 55, equity: 0, bonds: 45, aif: 0, unlisted: 0, roi: 11.85 },
  { code: 10, mf: 55, equity: 0, bonds: 45, aif: 0, unlisted: 0, roi: 11.85 },
  { code: 11, mf: 0, equity: 0, bonds: 100, aif: 0, unlisted: 0, roi: 8.00 },
]

export default function RetirementPlanner() {
  const [data, setData] = useState<RetirementData>({
    currentAge: 30,
    retirementAge: 58,
    lumpsumInvestment: 4000000,
    initialSIP: 10000,
    annualIncrease: 10,
    currentSalary: 30000,
    increaseModel: 'YOY',
    averageIncrements: 8,
    currentLifestyleExpense: 50000,
    numberOfChildren: 2,
    childExpenses: [defaultChildExpense, defaultChildExpense],
    assetExpenses: [defaultAssetExpense],
    inflationRate: 4,
    initialInvestmentRatio: (10000 / 30000) * 100 // Set an initial value based on initialSIP and currentSalary
  });
  
  // Recalculate initialInvestmentRatio when initialSIP or currentSalary changes
  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      initialInvestmentRatio: (prevData.initialSIP / prevData.currentSalary) * 100
    }));
  }, [data.initialSIP, data.currentSalary]);
  
  
  const [fireNumber, setFireNumber] = useState<number>(0)
  const [portfolioGrowth, setPortfolioGrowth] = useState<Array<{
    age: number,
    portfolioValue: number,
    currentValue: number,
    stage: number,
    stageReturn: number
  }>>([])
  const [detailedPortfolioGrowth, setDetailedPortfolioGrowth] = useState<DetailedPortfolioGrowthItem[]>([])
  const [finalSalary, setFinalSalary] = useState<number>(0)
  const [finalInvestableAmount, setFinalInvestableAmount] = useState<number>(0)
  const [majorExpenses, setMajorExpenses] = useState<number>(0)
  const [totalEMI, setTotalEMI] = useState<number>(0)
  const [inflationRates, setInflationRates] = useState<InflationRates>({
    homeInflation: 9.50,
    educationInflation: 10.00,
    weddingInflation: 10.00
  })
  const [expandedYears, setExpandedYears] = useState<number[]>([])
  const [majorWithdrawals, setMajorWithdrawals] = useState<MajorWithdrawal[]>([])

  const handleInputChange = (name: keyof RetirementData, value: string | number) => {
    setData(prevData => ({
      ...prevData,
      [name]: typeof prevData[name] === 'number' ? Number(value) : value
    }))
  }

  const handleInflationRateChange = (type: keyof InflationRates, value: string) => {
    setInflationRates(prev => ({
      ...prev,
      [type]: parseFloat(value)
    }))
  }

  const calculateFutureExpense = (currentExpense: number, years: number, inflationRate: number) => {
    return currentExpense * Math.pow(1 + inflationRate / 100, years)
  }

  const handleChildExpenseChange = (index: number, field: keyof ChildExpense, value: string | boolean) => {
    setData(prevData => {
      const newChildExpenses = [...prevData.childExpenses]
      if (field === 'educationExpenseYears' || field === 'weddingExpenseYears') {
        const yearsUntilExpense = parseInt(value as string)
        const expenseType = field === 'educationExpenseYears' ? 'educationExpense' : 'weddingExpense'
        const currentExpense = newChildExpenses[index][expenseType] as number
        const inflationRate = field === 'educationExpenseYears' ? inflationRates.educationInflation : inflationRates.weddingInflation
        const futureExpense = calculateFutureExpense(currentExpense, yearsUntilExpense, inflationRate)
        newChildExpenses[index] = {
          ...newChildExpenses[index],
          [expenseType]: futureExpense,
          [field]: yearsUntilExpense
        }
      } else {
        newChildExpenses[index] = {
          ...newChildExpenses[index],
          [field]: typeof value === 'boolean' ? value : Number(value)
        }
      }
      return { ...prevData, childExpenses: newChildExpenses }
    })
  }

  const handleAssetExpenseChange = (index: number, field: keyof AssetExpense, value: string | number | boolean) => {
    setData(prevData => {
      const newAssetExpenses = [...prevData.assetExpenses]
      let updatedAsset = { ...newAssetExpenses[index] }

      if (field === 'yearsUntilPurchase') {
        const yearsUntilPurchase = typeof value === 'string' ? parseInt(value) : value as number
        const currentExpense = updatedAsset.totalExpense
        const futureExpense = calculateFutureExpense(currentExpense, yearsUntilPurchase, inflationRates.homeInflation)
        updatedAsset = {
          ...updatedAsset,
          totalExpense: futureExpense,
          yearsUntilPurchase
        }
      } else if (field === 'type') {
        updatedAsset[field] = value as 'House' | 'Car'
      } else if (field === 'isLoan') {
        updatedAsset[field] = value as boolean
      } else {
        updatedAsset[field] = typeof value === 'string' ? parseFloat(value) : value as number
      }

      if (field === 'totalExpense' || field === 'upfrontPayment' || field === 'interestRate' || field === 'loanTerm' || field === 'yearsUntilPurchase') {
        updatedAsset.emi = calculateEMI(updatedAsset)
        updatedAsset.cumulativeEmi = updatedAsset.emi * updatedAsset.loanTerm
      }

      newAssetExpenses[index] = updatedAsset
      return { ...prevData, assetExpenses: newAssetExpenses }
    })
  }

  const calculateEMI = (expense: AssetExpense | ChildExpense) => {
    if ('type' in expense) {
      if (!expense.isLoan) return 0
      const principal = expense.totalExpense - expense.upfrontPayment
      const rate = expense.interestRate / 12 / 100
      const term = expense.loanTerm

      if (rate === 0) return principal / term

      return (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)
    } else {
      const isEducationLoan = expense.isEducationLoan
      const isWeddingLoan = expense.isWeddingLoan
      if (!isEducationLoan && !isWeddingLoan) return 0

      const principal = isEducationLoan
        ? expense.educationExpense - expense.educationUpfrontPayment
        : expense.weddingExpense - expense.weddingUpfrontPayment
      const rate = (isEducationLoan ? expense.educationLoanInterest : expense.weddingLoanInterest) / 12 / 100
      const term = isEducationLoan ? expense.educationLoanTerm : expense.weddingLoanTerm

      if (rate === 0) return principal / term

      return (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)
    }
  }

  const addAssetExpense = () => {
    setData(prevData => ({
      ...prevData,
      assetExpenses: [...prevData.assetExpenses, defaultAssetExpense]
    }))
  }

  const removeAssetExpense = (index: number) => {
    setData(prevData => ({
      ...prevData,
      assetExpenses: prevData.assetExpenses.filter((_, i) => i !== index)
    }))
  }

  const calculateFireNumber = () => {
    const years = data.retirementAge - data.currentAge
    const futureMonthlyExpense = data.currentLifestyleExpense * Math.pow(1 + (data.inflationRate / 100), years)
    const calculatedFireNumber = futureMonthlyExpense * 25 * 12
    setFireNumber(calculatedFireNumber)
  }

  const calculateMajorExpenses = () => {
    let totalMajorExpenses = 0
    let calculatedTotalEMI = 0
    const newMajorWithdrawals: MajorWithdrawal[] = []

    data.childExpenses.forEach((child, index) => {
      if (child.isEducationLoan) {
        totalMajorExpenses += child.educationUpfrontPayment
        calculatedTotalEMI += calculateEMI(child)
        newMajorWithdrawals.push({
          age: data.currentAge + child.educationExpenseYears,
          amount: child.educationUpfrontPayment,
          reason: `Child ${index + 1} Education Upfront Payment`
        })
      } else {
        totalMajorExpenses +=   child.educationExpense
        newMajorWithdrawals.push({
          age: data.currentAge + child.educationExpenseYears,
          amount: child.educationExpense,
          reason: `Child ${index + 1} Education Expense`
        })
      }

      if (child.isWeddingLoan) {
        totalMajorExpenses += child.weddingUpfrontPayment
        calculatedTotalEMI += calculateEMI(child)
        newMajorWithdrawals.push({
          age: data.currentAge + child.weddingExpenseYears,
          amount: child.weddingUpfrontPayment,
          reason: `Child ${index + 1} Wedding Upfront Payment`
        })
      } else {
        totalMajorExpenses += child.weddingExpense
        newMajorWithdrawals.push({
          age: data.currentAge + child.weddingExpenseYears,
          amount: child.weddingExpense,
          reason: `Child ${index + 1} Wedding Expense`
        })
      }
    })

    data.assetExpenses.forEach((asset, index) => {
      if (asset.isLoan) {
        totalMajorExpenses += asset.upfrontPayment
        newMajorWithdrawals.push({
          age: data.currentAge + asset.yearsUntilPurchase,
          amount: asset.upfrontPayment,
          reason: `${asset.type} Upfront Payment`
        })
      } else {
        totalMajorExpenses += asset.totalExpense
        newMajorWithdrawals.push({
          age: data.currentAge + asset.yearsUntilPurchase,
          amount: asset.totalExpense,
          reason: `${asset.type} Purchase`
        })
      }
    })

    setMajorExpenses(totalMajorExpenses)
    setTotalEMI(calculatedTotalEMI)
    setMajorWithdrawals(newMajorWithdrawals)
  }

  const calculatePortfolioGrowth = () => {
    const growth = []
    let currentAge = data.currentAge
    let portfolioValue = data.lumpsumInvestment
    let monthlySIP = data.initialSIP
    let currentSalary = data.currentSalary
    const investmentToInject = 100000
    const initialInvestmentRatio = (data.initialSIP / data.currentSalary) * 100
  
    while (currentAge <= 75) {
      const stage = currentAge < 30 ? 2 : currentAge < 45 ? 6 : 11
      const stageData = investmentStages.find(s => s.code === stage)
      const stageReturn = stageData ? stageData.roi : 0
      const stageReturnMonthly = Math.pow(1 + stageReturn / 100, 1 / 12) - 1
  
      for (let month = 0; month < 12; month++) {
        if (currentAge >= data.retirementAge) {
          portfolioValue = portfolioValue * (1 + stageReturnMonthly) - (data.currentLifestyleExpense * Math.pow(1 + data.inflationRate / 100, currentAge - data.currentAge) / 12)
        } else {
          portfolioValue = portfolioValue * (1 + stageReturnMonthly) + monthlySIP
        }
  
        if (portfolioValue < 0) {
          portfolioValue += investmentToInject
        }
      }
  
      if (currentAge < data.retirementAge) {
        if (data.increaseModel === 'YOY') {
          currentSalary *= (1 + data.averageIncrements / 100)
        } else {
          currentSalary = data.currentSalary * (1 + (data.averageIncrements / 100) * (currentAge - data.currentAge + 1))
        }
  
        monthlySIP = (currentSalary * initialInvestmentRatio) / 100
  
        if (currentAge + 1 === data.retirementAge) {
          setFinalSalary(currentSalary)
          setFinalInvestableAmount(monthlySIP)
        }
      } else {
        currentSalary = 0
        monthlySIP = 0
      }
  
      const currentValue = portfolioValue / Math.pow(1 + data.inflationRate / 100, currentAge - data.currentAge)
  
      if ((currentAge - data.currentAge) % 5 === 0) {
        growth.push({
          age: currentAge,
          portfolioValue,
          currentValue,
          stage,
          stageReturn
        })
      }
  
      currentAge += 1
    }
  
    setPortfolioGrowth(growth)
  }

  const calculateDetailedPortfolioGrowth = useCallback(() => {
    const growth: DetailedPortfolioGrowthItem[] = []
    let currentAge = data.currentAge
    let portfolioValue = data.lumpsumInvestment
    let monthlySIP = data.initialSIP
    const investmentToInject = 100000
  
    let adjustedLifestyleExpenseAtRetirement = data.currentLifestyleExpense * Math.pow(1 + data.inflationRate / 100, data.retirementAge - data.currentAge)
    let monthlyLifestyleExpense = data.currentLifestyleExpense
  
    // Initialize EMI trackers
    let activeEMIs: { monthlyAmount: number, remainingMonths: number }[] = []
  
    let currentMonth = 0
    const totalMonths = (100 - data.currentAge) * 12
  
    while (currentMonth < totalMonths) {
      const age = data.currentAge + Math.floor(currentMonth / 12)
      const month = currentMonth % 12 + 1
  
      if (month === 1 && age < data.retirementAge) {
        if (data.increaseModel === 'YOY') {
          monthlySIP *= (1 + data.annualIncrease / 100)
        }
      }
  
      const stage = age < 30 ? 2 : age < 45 ? 6 : 11
      const stageData = investmentStages.find(s => s.code === stage)
      const stageReturn = stageData ? stageData.roi : 0
      const monthlyReturn = Math.pow(1 + stageReturn / 100, 1 / 12) - 1
  
      portfolioValue *= (1 + monthlyReturn)
  
      if (age < data.retirementAge) {
        portfolioValue += monthlySIP
      }
  
      // Calculate total EMI for this month
      let totalMonthlyEMI = activeEMIs.reduce((sum, emi) => sum + emi.monthlyAmount, 0)
      portfolioValue -= totalMonthlyEMI
  
      // Update EMI trackers
      activeEMIs = activeEMIs.map(emi => ({
        ...emi,
        remainingMonths: emi.remainingMonths - 1
      })).filter(emi => emi.remainingMonths > 0)
  
      // Check for new major expenses and EMIs
      let majorExpense = 0
  
      // Child expenses
      data.childExpenses.forEach((child, index) => {
        if (age === data.currentAge + child.educationExpenseYears && month === 1) {
          if (child.isEducationLoan) {
            majorExpense += child.educationUpfrontPayment
            activeEMIs.push({
              monthlyAmount: calculateEMI(child),
              remainingMonths: child.educationLoanTerm
            })
          } else {
            majorExpense += child.educationExpense
          }
        }
        if (age === data.currentAge + child.weddingExpenseYears && month === 1) {
          if (child.isWeddingLoan) {
            majorExpense += child.weddingUpfrontPayment
            activeEMIs.push({
              monthlyAmount: calculateEMI(child),
              remainingMonths: child.weddingLoanTerm
            })
          } else {
            majorExpense += child.weddingExpense
          }
        }
      })
  
      // Asset expenses
      data.assetExpenses.forEach((asset) => {
        if (age === data.currentAge + asset.yearsUntilPurchase && month === 1) {
          if (asset.isLoan) {
            majorExpense += asset.upfrontPayment
            activeEMIs.push({
              monthlyAmount: asset.emi,
              remainingMonths: asset.loanTerm
            })
          } else {
            majorExpense += asset.totalExpense
          }
        }
      })
  
      portfolioValue -= majorExpense
  
      if (age >= data.retirementAge) {
        portfolioValue -= monthlyLifestyleExpense
        monthlyLifestyleExpense *= Math.pow(1 + data.inflationRate / 100, 1 / 12)
      }
  
      if (portfolioValue < 0) {
        portfolioValue += investmentToInject
      }
  
      growth.push({
        age,
        month,
        portfolioValue,
        emi: totalMonthlyEMI,
        lifestyleExpense: age >= data.retirementAge ? monthlyLifestyleExpense : 0,
        majorExpense,
        stage,
        stageReturn: `${stageReturn.toFixed(2)}%`
      })
  
      currentMonth++
    }
  
    setDetailedPortfolioGrowth(growth)
  }, [data, calculateEMI])

  const handleStageChange = useCallback((age: number, newStage: number) => {
    const stageData = investmentStages.find(s => s.code === newStage)
    const stageReturn = stageData ? stageData.roi : 0
    const monthlyReturn = Math.pow(1 + stageReturn / 100, 1 / 12) - 1
  
    setDetailedPortfolioGrowth(prevGrowth => {
      const updatedGrowth = prevGrowth.map(row => {
        if (row.age >= age) {
          const updatedRow = { ...row }
          updatedRow.stage = newStage
          updatedRow.stageReturn = `${stageReturn.toFixed(2)}%`
          updatedRow.portfolioValue *= (1 + monthlyReturn)
          if (updatedRow.portfolioValue < 0) {
            updatedRow.portfolioValue += 100000 // Simulating investment injection
          }
          return updatedRow
        }
        return row
      })
      return updatedGrowth
    })
  
    // Update the portfolio growth as well
    setPortfolioGrowth(prevGrowth => {
      const updatedGrowth = prevGrowth.map(row => {
        if (row.age >= age) {
          const updatedRow = { ...row }
          updatedRow.stage = newStage
          updatedRow.stageReturn = stageReturn
          updatedRow.portfolioValue *= (1 + monthlyReturn)
          if (updatedRow.portfolioValue < 0) {
            updatedRow.portfolioValue += 100000 // Simulating investment injection
          }
          return updatedRow
        }
        return row
      })
      return updatedGrowth
    })
  }, [])
  

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
  }

  const formatCrores = (value: number) => {
    return (value / 10000000).toFixed(2)
  }

  const toggleYearExpansion = (age: number) => {
    setExpandedYears(prev => 
      prev.includes(age) ? prev.filter(a => a !== age) : [...prev, age]
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="w-full max-w-5xl mx-auto bg-white shadow-lg">
        <CardHeader className="bg-gray-800 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold">Retirement Planner</CardTitle>
          <CardDescription className="text-gray-300">Plan your financial future with our advanced retirement calculator</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="children">Children</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="inflation">Inflation</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="space-y-4 mt-4">
              <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentAge">Current Age</Label>
                  <Input
                    id="currentAge"
                    type="number"
                    value={data.currentAge}
                    onChange={(e) => handleInputChange('currentAge', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retirementAge">Retirement Age</Label>
                  <Input
                    id="retirementAge"
                    type="number"
                    value={data.retirementAge}
                    onChange={(e) => handleInputChange('retirementAge', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="financial" className="space-y-4 mt-4">
  <h3 className="text-xl font-semibold text-gray-800">Financial Details</h3>
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div className="space-y-2">
      <Label htmlFor="lumpsumInvestment">Lumpsum Investment (₹)</Label>
      <Input
        id="lumpsumInvestment"
        type="number"
        value={data.lumpsumInvestment}
        onChange={(e) => handleInputChange('lumpsumInvestment', e.target.value)}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="initialSIP">Initial SIP (Monthly) (₹)</Label>
      <Input
        id="initialSIP"
        type="number"
        value={data.initialSIP}
        onChange={(e) => handleInputChange('initialSIP', e.target.value)}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="currentSalary">Current Salary (Monthly) (₹)</Label>
      <Input
        id="currentSalary"
        type="number"
        value={data.currentSalary}
        onChange={(e) => handleInputChange('currentSalary', e.target.value)}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="initialInvestmentRatio">Initial Investment Ratio (%)</Label>
      <Input
  id="initialInvestmentRatio"
  type="number"
  value={data.initialInvestmentRatio ? data.initialInvestmentRatio.toFixed(2) : '0.00'}
  disabled
/>

    </div>
    <div className="space-y-2">
      <Label htmlFor="increaseModel">Increase Model</Label>
      <Select
        value={data.increaseModel}
        onValueChange={(value) => handleInputChange('increaseModel', value as 'YOY' | 'Basic')}
      >
        <SelectTrigger id="increaseModel">
          <SelectValue placeholder="Select increase model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="YOY">Year-on-Year (YOY)</SelectItem>
          <SelectItem value="Basic">Basic</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="averageIncrements">Average Salary Increments (%)</Label>
      <Input
        id="averageIncrements"
        type="number"
        value={data.averageIncrements}
        onChange={(e) => handleInputChange('averageIncrements', e.target.value)}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="currentLifestyleExpense">Current Lifestyle Expense (Monthly) (₹)</Label>
      <Input
        id="currentLifestyleExpense"
        type="number"
        value={data.currentLifestyleExpense}
        onChange={(e) => handleInputChange('currentLifestyleExpense', e.target.value)}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
      <Input
        id="inflationRate"
        type="number"
        value={data.inflationRate}
        onChange={(e) => handleInputChange('inflationRate', e.target.value)}
      />
    </div>
  </div>
</TabsContent>
            <TabsContent value="children" className="space-y-4 mt-4">
              <h3 className="text-xl font-semibold text-gray-800">Child Expenses</h3>
              <div className="space-y-2">
                <Label htmlFor="numberOfChildren">Number of Children</Label>
                <Input
                  id="numberOfChildren"
                  type="number"
                  value={data.numberOfChildren}
                  onChange={(e) => {
                    const newValue = Number(e.target.value)
                    handleInputChange('numberOfChildren', newValue)
                    setData(prevData => ({
                      ...prevData,
                      childExpenses: Array(newValue).fill(defaultChildExpense)
                    }))
                  }}
                />
              </div>
              {data.childExpenses.map((child, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-800">Child {index + 1}</h4>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Child {index + 1} Expenses</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`educationExpense-${index}`} className="text-right">
                              Education Expense
                            </Label>
                            <Input
                              id={`educationExpense-${index}`}
                              type="number"
                              value={child.educationExpense}
                              onChange={(e) => handleChildExpenseChange(index, 'educationExpense', e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`educationExpenseYears-${index}`} className="text-right">
                              Years until Education
                            </Label>
                            <Input
                              id={`educationExpenseYears-${index}`}
                              type="number"
                              value={child.educationExpenseYears}
                              onChange={(e) => handleChildExpenseChange(index, 'educationExpenseYears', e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`isEducationLoan-${index}`} className="text-right">
                              Education Loan?
                            </Label>
                            <Select
                              value={child.isEducationLoan ? "Yes" : "No"}
                              onValueChange={(value) => handleChildExpenseChange(index, 'isEducationLoan', value === "Yes")}
                            >
                              <SelectTrigger id={`isEducationLoan-${index}`} className="col-span-3">
                                <SelectValue placeholder="Select loan status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="No">No</SelectItem>
                                <SelectItem value="Yes">Yes</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {child.isEducationLoan && (
                            <>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor={`educationLoanInterest-${index}`} className="text-right">
                                  Education Loan Interest (%)
                                </Label>
                                <Input
                                  id={`educationLoanInterest-${index}`}
                                  type="number"
                                  value={child.educationLoanInterest}
                                  onChange={(e) => handleChildExpenseChange(index, 'educationLoanInterest', e.target.value)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor={`educationLoanTerm-${index}`} className="text-right">
                                  Education Loan Term (months)
                                </Label>
                                <Input
                                  id={`educationLoanTerm-${index}`}
                                  type="number"
                                  value={child.educationLoanTerm}
                                  onChange={(e) => handleChildExpenseChange(index, 'educationLoanTerm', e.target.value)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor={`educationUpfrontPayment-${index}`} className="text-right">
                                  Education Upfront Payment
                                </Label>
                                <Input
                                  id={`educationUpfrontPayment-${index}`}
                                  type="number"
                                  value={child.educationUpfrontPayment}
                                  onChange={(e) => handleChildExpenseChange(index, 'educationUpfrontPayment', e.target.value)}
                                  className="col-span-3"
                                />
                              </div>
                            </>
                          )}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`weddingExpense-${index}`} className="text-right">
                              Wedding Expense
                            </Label>
                            <Input
                              id={`weddingExpense-${index}`}
                              type="number"
                              value={child.weddingExpense}
                              onChange={(e) => handleChildExpenseChange(index, 'weddingExpense', e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`weddingExpenseYears-${index}`} className="text-right">
                              Years until Wedding
                            </Label>
                            <Input
                              id={`weddingExpenseYears-${index}`}
                              type="number"
                              value={child.weddingExpenseYears}
                              onChange={(e) => handleChildExpenseChange(index, 'weddingExpenseYears', e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`isWeddingLoan-${index}`} className="text-right">
                              Wedding Loan?
                            </Label>
                            <Select
                              value={child.isWeddingLoan ? "Yes" : "No"}
                              onValueChange={(value) => handleChildExpenseChange(index, 'isWeddingLoan', value === "Yes")}
                            >
                              <SelectTrigger id={`isWeddingLoan-${index}`} className="col-span-3">
                                <SelectValue placeholder="Select loan status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="No">No</SelectItem>
                                <SelectItem value="Yes">Yes</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {child.isWeddingLoan && (
                            <>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor={`weddingLoanInterest-${index}`} className="text-right">
                                  Wedding Loan Interest (%)
                                </Label>
                                <Input
                                  id={`weddingLoanInterest-${index}`}
                                  type="number"
                                  value={child.weddingLoanInterest}
                                  onChange={(e) => handleChildExpenseChange(index, 'weddingLoanInterest', e.target.value)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor={`weddingLoanTerm-${index}`} className="text-right">
                                  Wedding Loan Term (months)
                                </Label>
                                <Input
                                  id={`weddingLoanTerm-${index}`}
                                  type="number"
                                  value={child.weddingLoanTerm}
                                  onChange={(e) => handleChildExpenseChange(index, 'weddingLoanTerm', e.target.value)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor={`weddingUpfrontPayment-${index}`} className="text-right">
                                  Wedding Upfront Payment
                                </Label>
                                <Input
                                  id={`weddingUpfrontPayment-${index}`}
                                  type="number"
                                  value={child.weddingUpfrontPayment}
                                  onChange={(e) => handleChildExpenseChange(index, 'weddingUpfrontPayment', e.target.value)}
                                  className="col-span-3"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Education Expense</Label>
                      <p>{formatCurrency(child.educationExpense)}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Wedding Expense</Label>
                      <p>{formatCurrency(child.weddingExpense)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="assets" className="space-y-4 mt-4">
              <h3 className="text-xl font-semibold text-gray-800">Asset Expenses</h3>
              {data.assetExpenses.map((asset, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-800">Asset {index + 1}</h4>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit Asset {index + 1}</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor={`assetType-${index}`} className="text-right">
                                Asset Type
                              </Label>
                              <Select
                                value={asset.type}
                                onValueChange={(value) => handleAssetExpenseChange(index, 'type', value as 'House' | 'Car')}
                              >
                                <SelectTrigger id={`assetType-${index}`} className="col-span-3">
                                  <SelectValue placeholder="Select asset type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="House">House</SelectItem>
                                  <SelectItem value="Car">Car</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor={`totalExpense-${index}`} className="text-right">
                                Total Expense (₹)
                              </Label>
                              <Input
                                id={`totalExpense-${index}`}
                                type="number"
                                value={asset.totalExpense}
                                onChange={(e) => handleAssetExpenseChange(index, 'totalExpense', e.target.value)}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor={`yearsUntilPurchase-${index}`} className="text-right">
                                Years until Purchase
                              </Label>
                              <Input
                                id={`yearsUntilPurchase-${index}`}
                                type="number"
                                value={asset.yearsUntilPurchase}
                                onChange={(e) => handleAssetExpenseChange(index, 'yearsUntilPurchase', e.target.value)}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor={`isLoan-${index}`} className="text-right">
                                Is Loan?
                              </Label>
                              <Select
                                value={asset.isLoan ? "Yes" : "No"}
                                onValueChange={(value) => handleAssetExpenseChange(index, 'isLoan', value === "Yes")}
                              >
                                <SelectTrigger id={`isLoan-${index}`} className="col-span-3">
                                  <SelectValue placeholder="Select loan status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="No">No</SelectItem>
                                  <SelectItem value="Yes">Yes</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {asset.isLoan && (
                              <>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor={`upfrontPayment-${index}`} className="text-right">
                                    Upfront Payment (₹)
                                  </Label>
                                  <Input
                                    id={`upfrontPayment-${index}`}
                                    type="number"
                                    value={asset.upfrontPayment}
                                    onChange={(e) => handleAssetExpenseChange(index, 'upfrontPayment', e.target.value)}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor={`interestRate-${index}`} className="text-right">
                                    Interest Rate (%)
                                  </Label>
                                  <Input
                                    id={`interestRate-${index}`}
                                    type="number"
                                    value={asset.interestRate}
                                    onChange={(e) => handleAssetExpenseChange(index, 'interestRate', e.target.value)}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor={`loanTerm-${index}`} className="text-right">
                                    Loan Term (months)
                                  </Label>
                                  <Input
                                    id={`loanTerm-${index}`}
                                    type="number"
                                    value={asset.loanTerm}
                                    onChange={(e) => handleAssetExpenseChange(index, 'loanTerm', e.target.value)}
                                    className="col-span-3"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="icon" onClick={() => removeAssetExpense(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Asset Type</Label>
                      <p>{asset.type}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Total Expense</Label>
                      <p>{formatCurrency(asset.totalExpense)}</p>
                    </div>
                    {asset.isLoan && (
                      <>
                        <div className="space-y-2">
                          <Label>Upfront Payment</Label>
                          <p>{formatCurrency(asset.upfrontPayment)}</p>
                        </div>
                        <div className="space-y-2">
                          <Label>EMI</Label>
                          <p>{formatCurrency(asset.emi)}</p>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              ))}
              <Button onClick={addAssetExpense} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Asset Expense
              </Button>
            </TabsContent>
            <TabsContent value="inflation" className="space-y-4 mt-4">
              <h3 className="text-xl font-semibold text-gray-800">Inflation Rates</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="homeInflation">Home Inflation (%)</Label>
                  <Input
                    id="homeInflation"
                    type="number"
                    value={inflationRates.homeInflation}
                    onChange={(e) => handleInflationRateChange('homeInflation', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="educationInflation">Education Inflation (%)</Label>
                  <Input
                    id="educationInflation"
                    type="number"
                    value={inflationRates.educationInflation}
                    onChange={(e) => handleInflationRateChange('educationInflation', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weddingInflation">Wedding Inflation (%)</Label>
                  <Input
                    id="weddingInflation"
                    type="number"
                    value={inflationRates.weddingInflation}
                    onChange={(e) => handleInflationRateChange('weddingInflation', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-8" />

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">Results</h3>
            <Button 
              onClick={() => { calculateFireNumber(); calculatePortfolioGrowth(); calculateMajorExpenses(); calculateDetailedPortfolioGrowth(); }} 
              className="w-full mb-4"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Calculate
            </Button>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>FIRE Number</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{formatCurrency(fireNumber)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>At Retirement Age</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Final Salary</p>
                    <p className="text-2xl font-bold">{formatCurrency(finalSalary)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Final Investable Amount</p>
                    <p className="text-2xl font-bold">{formatCurrency(finalInvestableAmount)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="sm:col-span-2">
                <CardHeader>
                  <CardTitle>Major Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{formatCurrency(majorExpenses)}</p>
                </CardContent>
              </Card>
              <Card className="sm:col-span-2">
                <CardHeader>
                  <CardTitle>Total EMI</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{formatCurrency(totalEMI)}</p>
                </CardContent>
              </Card>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4">
              <h4 className="text-xl font-semibold mb-4 text-gray-800">Portfolio Growth</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Age</TableHead>
                    <TableHead>Portfolio Value (Cr)</TableHead>
                    <TableHead>Current Value (Cr)</TableHead>
                    <TableHead>
                      Stage
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="ml-2">
                            <Info className="h-4 w-4" />
                            <span className="sr-only">Stage information</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <ScrollArea className="h-80">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Stage</TableHead>
                                  <TableHead>MF</TableHead>
                                  <TableHead>Equity</TableHead>
                                  <TableHead>Bonds</TableHead>
                                  <TableHead>AIF</TableHead>
                                  <TableHead>Unlisted</TableHead>
                                  <TableHead>ROI</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {investmentStages.map((stage) => (
                                  <TableRow key={stage.code}>
                                    <TableCell>{stage.code}</TableCell>
                                    <TableCell>{stage.mf}%</TableCell>
                                    <TableCell>{stage.equity}%</TableCell>
                                    <TableCell>{stage.bonds}%</TableCell>
                                    <TableCell>{stage.aif}%</TableCell>
                                    <TableCell>{stage.unlisted}%</TableCell>
                                    <TableCell>{stage.roi}%</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                    </TableHead>
                    <TableHead>Stage Return</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolioGrowth.map((row, index) => (
                    <TableRow key={index} className={row.portfolioValue >= fireNumber ? "bg-green-100" : "bg-red-100"}>
                      <TableCell>{row.age}</TableCell>
                      <TableCell>{formatCrores(row.portfolioValue)}</TableCell>
                      <TableCell>{formatCrores(row.currentValue)}</TableCell>
                      <TableCell>
                        <Select
                          value={row.stage.toString()}
                          onValueChange={(value) => handleStageChange(row.age, parseInt(value))}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                          <SelectContent>
                            {investmentStages.map((stage) => (
                              <SelectItem key={stage.code} value={stage.code.toString()}>
                                Stage {stage.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{row.stageReturn.toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4">
              <h4 className="text-xl font-semibold mb-4 text-gray-800">Detailed Portfolio Growth</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Age</TableHead>
                    <TableHead>Portfolio Value (₹)</TableHead>
                    <TableHead>EMI (₹)</TableHead>
                    <TableHead>Lifestyle Expense (₹)</TableHead>
                    <TableHead>Major Expense (₹)</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Stage Return</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailedPortfolioGrowth.reduce((acc, row) => {
                    if (row.month === 1) {
                      acc.push(
                        <React.Fragment key={`${row.age}-${row.month}`}>
                          <TableRow>
                            <TableCell>{row.age}</TableCell>
                            <TableCell>{formatCurrency(row.portfolioValue)}</TableCell>
                            <TableCell>{formatCurrency(row.emi)}</TableCell>
                            <TableCell>{formatCurrency(row.lifestyleExpense)}</TableCell>
                            <TableCell>{formatCurrency(row.majorExpense)}</TableCell>
                            <TableCell>
                              <Select
                                value={row.stage.toString()}
                                onValueChange={(value) => handleStageChange(row.age, parseInt(value))}
                              >
                                <SelectTrigger className="w-[100px]">
                                  <SelectValue placeholder="Select stage" />
                                </SelectTrigger>
                                <SelectContent>
                                  {investmentStages.map((stage) => (
                                    <SelectItem key={stage.code} value={stage.code.toString()}>
                                      Stage {stage.code}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>{row.stageReturn}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => toggleYearExpansion(row.age)}>
                                {expandedYears.includes(row.age) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                            </TableCell>
                          </TableRow>
                          <AnimatePresence>
                            {expandedYears.includes(row.age) && (
                              <motion.tr
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <TableCell colSpan={8} className="p-0">
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                  >
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Month</TableHead>
                                          <TableHead>Portfolio Value (₹)</TableHead>
                                          <TableHead>EMI (₹)</TableHead>
                                          <TableHead>Lifestyle Expense (₹)</TableHead>
                                          <TableHead>Major Expense (₹)</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {detailedPortfolioGrowth.filter(item => item.age === row.age).map((month, monthIndex) => (
                                          <TableRow key={monthIndex}>
                                            <TableCell>{month.month}</TableCell>
                                            <TableCell>{formatCurrency(month.portfolioValue)}</TableCell>
                                            <TableCell>{formatCurrency(month.emi)}</TableCell>
                                            <TableCell>{formatCurrency(month.lifestyleExpense)}</TableCell>
                                            <TableCell>{formatCurrency(month.majorExpense)}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </motion.div>
                                </TableCell>
                              </motion.tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      )
                    }
                    return acc
                  }, [] as React.ReactNode[])}
                </TableBody>
              </Table>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4">
              <h4 className="text-xl font-semibold mb-4 text-gray-800">Major Withdrawals</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Age</TableHead>
                    <TableHead>Amount (₹)</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {majorWithdrawals.map((withdrawal, index) => (
                    <TableRow key={index}>
                      <TableCell>{withdrawal.age}</TableCell>
                      <TableCell>{formatCurrency(withdrawal.amount)}</TableCell>
                      <TableCell>{withdrawal.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}