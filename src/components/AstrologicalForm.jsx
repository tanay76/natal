import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import * as Popover from '@radix-ui/react-popover'
import { cn } from '../lib/utils'
import { ChevronDown, Check } from 'lucide-react'
import { Checkbox } from './ui/checkbox'

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']
const STARS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
    'Magha', 'Purva Falguni', 'Uttara Falguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyestha',
    'Moola', 'Purva Shadha', 'Uttara Shadha', 'Shrovona', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
]
const STAR_NA_OPTION = 'Star is NA but Star Lord is available'
const RETRO_DIRECT = ['Retrograde', 'Direct']
const YES_NO = ['Yes', 'No']

// Star to Nakshatra Lord mapping
const STAR_TO_LORD = {
    'Ashwini': 'Ketu', 'Magha': 'Ketu', 'Moola': 'Ketu',
    'Bharani': 'Venus', 'Purva Falguni': 'Venus', 'Purva Shadha': 'Venus',
    'Krittika': 'Sun', 'Uttara Falguni': 'Sun', 'Uttara Shadha': 'Sun',
    'Rohini': 'Moon', 'Hasta': 'Moon', 'Shrovona': 'Moon',
    'Mrigashira': 'Mars', 'Chitra': 'Mars', 'Dhanishtha': 'Mars',
    'Ardra': 'Rahu', 'Swati': 'Rahu', 'Shatabhisha': 'Rahu',
    'Punarvasu': 'Jupiter', 'Vishakha': 'Jupiter', 'Purva Bhadrapada': 'Jupiter',
    'Pushya': 'Saturn', 'Anuradha': 'Saturn', 'Uttara Bhadrapada': 'Saturn',
    'Ashlesha': 'Mercury', 'Jyestha': 'Mercury', 'Revati': 'Mercury'
}

// MultiSelect component
const MultiSelect = ({ value = [], onChange, options, placeholder, disabled }) => {
    if (disabled) {
        return (
            <Button
                variant="ghost"
                disabled
                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-normal cursor-not-allowed opacity-50"
            >
                <span className="text-slate-500">{placeholder}</span>
                <ChevronDown className="h-4 w-4 opacity-50 text-slate-950" />
            </Button>
        )
    }
    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 font-normal hover:bg-white"
                >
                    {value.length > 0 ? value.join(' + ') : <span className="text-slate-500">{placeholder}</span>}
                    <ChevronDown className="h-4 w-4 opacity-50 text-slate-950" />
                </Button>
            </Popover.Trigger>
            <Popover.Content
                className="p-0 z-50 overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md animate-in fade-in-0 zoom-in-95"
                align="start"
                style={{ width: 'var(--radix-popover-trigger-width)' }}
            >
                <div className="max-h-60 overflow-y-auto p-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-thumb]:rounded-md" style={{ scrollbarWidth: 'thin', scrollbarColor: '#94a3b8 #f1f5f9' }}>
                    {options.map((opt) => {
                        const isSelected = value.includes(opt)
                        return (
                            <div
                                key={opt}
                                className={cn(
                                    "relative flex w-full cursor-default select-none items-center rounded-sm py-2.5 pl-2 pr-2 text-sm outline-none hover:bg-slate-100 hover:text-slate-900",
                                )}
                                onClick={() => {
                                    if (isSelected) {
                                        onChange(value.filter((v) => v !== opt))
                                    } else {
                                        onChange([...value, opt].sort((a, b) => options.indexOf(a) - options.indexOf(b)))
                                    }
                                }}
                            >
                                <Checkbox
                                    id={`ms-${opt}`}
                                    checked={isSelected}
                                    className="mr-2 h-4 w-4 rounded border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                />
                                <Label htmlFor={`ms-${opt}`} className="cursor-pointer font-normal text-slate-900">{opt}</Label>
                            </div>
                        )
                    })}
                </div>
            </Popover.Content>
        </Popover.Root>
    )
}

// CustomSelect component
const CustomSelect = ({ value, onChange, options, placeholder, disabled }) => {
    const [open, setOpen] = React.useState(false)

    if (disabled) {
        return (
            <Button
                variant="ghost"
                disabled
                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-normal cursor-not-allowed opacity-50"
            >
                <span className="text-slate-500">{placeholder}</span>
                <ChevronDown className="h-4 w-4 opacity-50 text-slate-950" />
            </Button>
        )
    }

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 font-normal hover:bg-white"
                >
                    {value ? <span>{value}</span> : <span className="text-slate-500">{placeholder}</span>}
                    <ChevronDown className="h-4 w-4 opacity-50 text-slate-950" />
                </Button>
            </Popover.Trigger>
            <Popover.Content
                className="p-0 z-50 overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md animate-in fade-in-0 zoom-in-95"
                align="start"
                style={{ width: 'var(--radix-popover-trigger-width)' }}
            >
                <div className="max-h-60 overflow-y-auto p-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-thumb]:rounded-md" style={{ scrollbarWidth: 'thin', scrollbarColor: '#94a3b8 #f1f5f9' }}>
                    {options.map((opt) => {
                        const isSelected = value === opt
                        return (
                            <div
                                key={opt}
                                className={cn(
                                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 hover:text-slate-900",
                                    isSelected && "bg-slate-100"
                                )}
                                onClick={() => {
                                    onChange(opt)
                                    setOpen(false)
                                }}
                            >
                                {isSelected && (
                                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                        <Check className="h-4 w-4" />
                                    </span>
                                )}
                                <span>{opt}</span>
                            </div>
                        )
                    })}
                </div>
            </Popover.Content>
        </Popover.Root>
    )
}

// Parse significations helper
const parseSignifications = (inputs) => {
    let mainNumbers = new Set()
    let bracketNumbers = new Set()

    inputs.forEach(input => {
        if (!input) return
        const mainMatches = input.replace(/\[.*?\]/g, '').match(/\d+/g)
        if (mainMatches) mainMatches.forEach(n => mainNumbers.add(parseInt(n)))

        const bracketMatches = input.match(/\[(.*?)\]/)
        if (bracketMatches && bracketMatches[1]) {
            const nums = bracketMatches[1].match(/\d+/g)
            if (nums) nums.forEach(n => bracketNumbers.add(parseInt(n)))
        }
    })

    const mainStr = Array.from(mainNumbers).sort((a, b) => a - b).join(', ')
    const bracketStr = bracketNumbers.size > 0 ? `[${Array.from(bracketNumbers).sort((a, b) => a - b).join(', ')}]` : ''

    return [mainStr, bracketStr].filter(Boolean).join(', ')
}

export default function AstrologicalForm() {
    const { register, control, watch, setValue } = useForm({
        defaultValues: {
            q1_houseNo: '',
            q2_subLord: '',
            q3_subLordRetro: '',
            q4_star: '',
            q5_starLord: '',
            q6_starLordRetro: '',
            q7_starLordHouses: '',
            q8_starLordConnecting: '',
            q9_isSubLordConjunct: '',
            q10_conjunctPlanets: [],
            q33_isStarLordConjunct: '',
            q34_starLordConjunctPlanets: [],
            q57_isSubLordOpposed: '',
            q58_opposedPlanets: [],
            q81_isStarLordOpposed: '',
            q82_starLordOpposedPlanets: [],
        }
    })

    // Watch core values
    const q1 = watch('q1_houseNo')
    const q2 = watch('q2_subLord')  // SUB_LORD_1
    const q4 = watch('q4_star')      // STAR_1
    const q5 = watch('q5_starLord')  // STAR_LORD_1
    const q9 = watch('q9_isSubLordConjunct')
    const q10 = watch('q10_conjunctPlanets') || []
    const q33 = watch('q33_isStarLordConjunct')
    const q34 = watch('q34_starLordConjunctPlanets') || []
    const q57 = watch('q57_isSubLordOpposed')
    const q58 = watch('q58_opposedPlanets') || []
    const q81 = watch('q81_isStarLordOpposed')
    const q82 = watch('q82_starLordOpposedPlanets') || []

    // Watch signification fields for auto-fill
    const q7 = watch('q7_starLordHouses')
    const q14 = watch('q14_sig') || ''
    const q18 = watch('q18_sig') || ''
    const q22 = watch('q22_sig') || ''
    const q26 = watch('q26_sig') || ''
    const q30 = watch('q30_sig') || ''
    const q38 = watch('q38_sig') || ''
    const q42 = watch('q42_sig') || ''
    const q46 = watch('q46_sig') || ''
    const q50 = watch('q50_sig') || ''
    const q54 = watch('q54_sig') || ''
    const q62 = watch('q62_sig') || ''
    const q66 = watch('q66_sig') || ''
    const q70 = watch('q70_sig') || ''
    const q74 = watch('q74_sig') || ''
    const q78 = watch('q78_sig') || ''
    const q86 = watch('q86_sig') || ''
    const q90 = watch('q90_sig') || ''
    const q94 = watch('q94_sig') || ''
    const q98 = watch('q98_sig') || ''
    const q102 = watch('q102_sig') || ''

    // Watch all retrograde/direct questions
    const q3_value = watch('q3_subLordRetro')
    const q6_value = watch('q6_starLordRetro')

    // Conjunct planets of Sub-Lord (Q11-Q30)
    const q11_retro = watch('q11_retro')
    const q12_starLord = watch('q12_starLord')
    const q13_retro = watch('q13_retro')
    const q15_retro = watch('q15_retro')
    const q16_starLord = watch('q16_starLord')
    const q17_retro = watch('q17_retro')
    const q19_retro = watch('q19_retro')
    const q20_starLord = watch('q20_starLord')
    const q21_retro = watch('q21_retro')
    const q23_retro = watch('q23_retro')
    const q24_starLord = watch('q24_starLord')
    const q25_retro = watch('q25_retro')
    const q27_retro = watch('q27_retro')
    const q28_starLord = watch('q28_starLord')
    const q29_retro = watch('q29_retro')

    // Conjunct planets of Star-Lord (Q35-Q54)
    const q35_retro = watch('q35_retro')
    const q36_starLord = watch('q36_starLord')
    const q37_retro = watch('q37_retro')
    const q39_retro = watch('q39_retro')
    const q40_starLord = watch('q40_starLord')
    const q41_retro = watch('q41_retro')
    const q43_retro = watch('q43_retro')
    const q44_starLord = watch('q44_starLord')
    const q45_retro = watch('q45_retro')
    const q47_retro = watch('q47_retro')
    const q48_starLord = watch('q48_starLord')
    const q49_retro = watch('q49_retro')
    const q51_retro = watch('q51_retro')
    const q52_starLord = watch('q52_starLord')
    const q53_retro = watch('q53_retro')

    // Opposed planets to Sub-Lord (Q59-Q78)
    const q59_retro = watch('q59_retro')
    const q60_starLord = watch('q60_starLord')
    const q61_retro = watch('q61_retro')
    const q63_retro = watch('q63_retro')
    const q64_starLord = watch('q64_starLord')
    const q65_retro = watch('q65_retro')
    const q67_retro = watch('q67_retro')
    const q68_starLord = watch('q68_starLord')
    const q69_retro = watch('q69_retro')
    const q71_retro = watch('q71_retro')
    const q72_starLord = watch('q72_starLord')
    const q73_retro = watch('q73_retro')
    const q75_retro = watch('q75_retro')
    const q76_starLord = watch('q76_starLord')
    const q77_retro = watch('q77_retro')

    // Opposed planets to Star-Lord (Q83-Q102)
    const q83_retro = watch('q83_retro')
    const q84_starLord = watch('q84_starLord')
    const q85_retro = watch('q85_retro')
    const q87_retro = watch('q87_retro')
    const q88_starLord = watch('q88_starLord')
    const q89_retro = watch('q89_retro')
    const q91_retro = watch('q91_retro')
    const q92_starLord = watch('q92_starLord')
    const q93_retro = watch('q93_retro')
    const q95_retro = watch('q95_retro')
    const q96_starLord = watch('q96_starLord')
    const q97_retro = watch('q97_retro')
    const q99_retro = watch('q99_retro')
    const q100_starLord = watch('q100_starLord')
    const q101_retro = watch('q101_retro')

    // Compute Direct and Retrograde planet lists with designations
    const { directPlanets, retrogradePlanets } = React.useMemo(() => {
        const direct = []
        const retrograde = []

        // Helper to add planet with designation to appropriate list
        const addPlanet = (planet, status, designation) => {
            if (!planet || !status) return
            const entry = { planet, designation }
            if (status === 'Direct') direct.push(entry)
            if (status === 'Retrograde') retrograde.push(entry)
        }

        // Q3: Sub-Lord
        addPlanet(q2, q3_value, 'Sub Lord')
        // Q6: Star-Lord of Sub-Lord
        addPlanet(q5, q6_value, `Star Lord of Sub Lord ${q2}`)

        // Conjunct planets of Sub-Lord and their Star Lords
        if (q10.length >= 1) {
            addPlanet(q10[0], q11_retro, `Conjunct Planet of Sub Lord ${q2}`)
            addPlanet(q12_starLord, q13_retro, `Star Lord of Conjunct Planet ${q10[0]} of Sub Lord ${q2}`)
        }
        if (q10.length >= 2) {
            addPlanet(q10[1], q15_retro, `Conjunct Planet of Sub Lord ${q2}`)
            addPlanet(q16_starLord, q17_retro, `Star Lord of Conjunct Planet ${q10[1]} of Sub Lord ${q2}`)
        }
        if (q10.length >= 3) {
            addPlanet(q10[2], q19_retro, `Conjunct Planet of Sub Lord ${q2}`)
            addPlanet(q20_starLord, q21_retro, `Star Lord of Conjunct Planet ${q10[2]} of Sub Lord ${q2}`)
        }
        if (q10.length >= 4) {
            addPlanet(q10[3], q23_retro, `Conjunct Planet of Sub Lord ${q2}`)
            addPlanet(q24_starLord, q25_retro, `Star Lord of Conjunct Planet ${q10[3]} of Sub Lord ${q2}`)
        }
        if (q10.length >= 5) {
            addPlanet(q10[4], q27_retro, `Conjunct Planet of Sub Lord ${q2}`)
            addPlanet(q28_starLord, q29_retro, `Star Lord of Conjunct Planet ${q10[4]} of Sub Lord ${q2}`)
        }

        // Conjunct planets of Star-Lord and their Star Lords
        if (q34.length >= 1) {
            addPlanet(q34[0], q35_retro, `Conjunct Planet of Star Lord ${q5} of Sub Lord ${q2}`)
            addPlanet(q36_starLord, q37_retro, `Star Lord of Conjunct Planet ${q34[0]} of Star Lord ${q5} of Sub Lord ${q2}`)
        }
        if (q34.length >= 2) {
            addPlanet(q34[1], q39_retro, `Conjunct Planet of Star Lord ${q5} of Sub Lord ${q2}`)
            addPlanet(q40_starLord, q41_retro, `Star Lord of Conjunct Planet ${q34[1]} of Star Lord ${q5} of Sub Lord ${q2}`)
        }
        if (q34.length >= 3) {
            addPlanet(q34[2], q43_retro, `Conjunct Planet of Star Lord ${q5} of Sub Lord ${q2}`)
            addPlanet(q44_starLord, q45_retro, `Star Lord of Conjunct Planet ${q34[2]} of Star Lord ${q5} of Sub Lord ${q2}`)
        }
        if (q34.length >= 4) {
            addPlanet(q34[3], q47_retro, `Conjunct Planet of Star Lord ${q5} of Sub Lord ${q2}`)
            addPlanet(q48_starLord, q49_retro, `Star Lord of Conjunct Planet ${q34[3]} of Star Lord ${q5} of Sub Lord ${q2}`)
        }
        if (q34.length >= 5) {
            addPlanet(q34[4], q51_retro, `Conjunct Planet of Star Lord ${q5} of Sub Lord ${q2}`)
            addPlanet(q52_starLord, q53_retro, `Star Lord of Conjunct Planet ${q34[4]} of Star Lord ${q5} of Sub Lord ${q2}`)
        }

        // Opposed planets to Sub-Lord and their Star Lords
        if (q58.length >= 1) {
            addPlanet(q58[0], q59_retro, `Opposed Planet of Sub Lord ${q2}`)
            addPlanet(q60_starLord, q61_retro, `Star Lord of Opposed Planet ${q58[0]} of Sub Lord ${q2}`)
        }
        if (q58.length >= 2) {
            addPlanet(q58[1], q63_retro, `Opposed Planet of Sub Lord ${q2}`)
            addPlanet(q64_starLord, q65_retro, `Star Lord of Opposed Planet ${q58[1]} of Sub Lord ${q2}`)
        }
        if (q58.length >= 3) {
            addPlanet(q58[2], q67_retro, `Opposed Planet of Sub Lord ${q2}`)
            addPlanet(q68_starLord, q69_retro, `Star Lord of Opposed Planet ${q58[2]} of Sub Lord ${q2}`)
        }
        if (q58.length >= 4) {
            addPlanet(q58[3], q71_retro, `Opposed Planet of Sub Lord ${q2}`)
            addPlanet(q72_starLord, q73_retro, `Star Lord of Opposed Planet ${q58[3]} of Sub Lord ${q2}`)
        }
        if (q58.length >= 5) {
            addPlanet(q58[4], q75_retro, `Opposed Planet of Sub Lord ${q2}`)
            addPlanet(q76_starLord, q77_retro, `Star Lord of Opposed Planet ${q58[4]} of Sub Lord ${q2}`)
        }

        // Opposed planets to Star-Lord and their Star Lords
        if (q82.length >= 1) {
            addPlanet(q82[0], q83_retro, `Opposed Planet of Star Lord ${q5} of Sub Lord ${q2}`)
            addPlanet(q84_starLord, q85_retro, `Star Lord of Opposed Planet ${q82[0]} of Star Lord ${q5} of Sub Lord ${q2}`)
        }
        if (q82.length >= 2) {
            addPlanet(q82[1], q87_retro, `Opposed Planet of Star Lord ${q5} of Sub Lord ${q2}`)
            addPlanet(q88_starLord, q89_retro, `Star Lord of Opposed Planet ${q82[1]} of Star Lord ${q5} of Sub Lord ${q2}`)
        }
        if (q82.length >= 3) {
            addPlanet(q82[2], q91_retro, `Opposed Planet of Star Lord ${q5} of Sub Lord ${q2}`)
            addPlanet(q92_starLord, q93_retro, `Star Lord of Opposed Planet ${q82[2]} of Star Lord ${q5} of Sub Lord ${q2}`)
        }
        if (q82.length >= 4) {
            addPlanet(q82[3], q95_retro, `Opposed Planet of Star Lord ${q5} of Sub Lord ${q2}`)
            addPlanet(q96_starLord, q97_retro, `Star Lord of Opposed Planet ${q82[3]} of Star Lord ${q5} of Sub Lord ${q2}`)
        }
        if (q82.length >= 5) {
            addPlanet(q82[4], q99_retro, `Opposed Planet of Star Lord ${q5} of Sub Lord ${q2}`)
            addPlanet(q100_starLord, q101_retro, `Star Lord of Opposed Planet ${q82[4]} of Star Lord ${q5} of Sub Lord ${q2}`)
        }

        // Sort by PLANETS order
        const sortByPlanetsOrder = (arr) => arr.sort((a, b) => PLANETS.indexOf(a.planet) - PLANETS.indexOf(b.planet))

        return {
            directPlanets: sortByPlanetsOrder(direct),
            retrogradePlanets: sortByPlanetsOrder(retrograde)
        }
    }, [
        q2, q3_value, q5, q6_value,
        q10, q11_retro, q12_starLord, q13_retro, q15_retro, q16_starLord, q17_retro,
        q19_retro, q20_starLord, q21_retro, q23_retro, q24_starLord, q25_retro,
        q27_retro, q28_starLord, q29_retro,
        q34, q35_retro, q36_starLord, q37_retro, q39_retro, q40_starLord, q41_retro,
        q43_retro, q44_starLord, q45_retro, q47_retro, q48_starLord, q49_retro,
        q51_retro, q52_starLord, q53_retro,
        q58, q59_retro, q60_starLord, q61_retro, q63_retro, q64_starLord, q65_retro,
        q67_retro, q68_starLord, q69_retro, q71_retro, q72_starLord, q73_retro,
        q75_retro, q76_starLord, q77_retro,
        q82, q83_retro, q84_starLord, q85_retro, q87_retro, q88_starLord, q89_retro,
        q91_retro, q92_starLord, q93_retro, q95_retro, q96_starLord, q97_retro,
        q99_retro, q100_starLord, q101_retro
    ])

    // Q31 auto-fill
    React.useEffect(() => {
        const total = parseSignifications([q14, q18, q22, q26, q30].filter(Boolean))
        setValue('q31_totalSig', total)
    }, [q14, q18, q22, q26, q30, setValue])

    // Q55 auto-fill
    React.useEffect(() => {
        const total = parseSignifications([q38, q42, q46, q50, q54].filter(Boolean))
        setValue('q55_totalSig', total)
    }, [q38, q42, q46, q50, q54, setValue])

    // Q79 auto-fill
    React.useEffect(() => {
        const total = parseSignifications([q62, q66, q70, q74, q78].filter(Boolean))
        setValue('q79_totalSig', total)
    }, [q62, q66, q70, q74, q78, setValue])

    // Q103 auto-fill
    React.useEffect(() => {
        const total = parseSignifications([q86, q90, q94, q98, q102].filter(Boolean))
        setValue('q103_totalSig', total)
    }, [q86, q90, q94, q98, q102, setValue])

    // Q5 auto-fill based on Q4 star selection (nakshatra lord)
    // Only auto-fill when an actual star is selected (not the special NA option)
    React.useEffect(() => {
        if (q4 && q4 !== STAR_NA_OPTION && STAR_TO_LORD[q4]) {
            setValue('q5_starLord', STAR_TO_LORD[q4])
        } else if (q4 === STAR_NA_OPTION) {
            // Clear the auto-filled value when switching to NA option - user will select manually
            setValue('q5_starLord', '')
        } else {
            setValue('q5_starLord', '')
        }
    }, [q4, setValue])

    // Q105 auto-fill (summary)
    const q31 = watch('q31_totalSig') || ''
    const q55 = watch('q55_totalSig') || ''
    const q79 = watch('q79_totalSig') || ''
    const q103 = watch('q103_totalSig') || ''

    React.useEffect(() => {
        const total = parseSignifications([q7, q31, q55, q79, q103].filter(Boolean))
        setValue('q105_summary', total)
    }, [q7, q31, q55, q79, q103, setValue])

    // Render planet details group (for conjunct planets) - HIDE questions until star lord is selected
    const renderConjunctPlanetGroup = (planet, index, baseQNum) => {
        const retroQ = baseQNum
        const starLordQ = baseQNum + 1
        const starLordRetroQ = baseQNum + 2
        const sigQ = baseQNum + 3
        const starLordVal = watch(`q${starLordQ}_starLord`)

        return (
            <div key={`conjunct-${baseQNum}-${index}`} className="p-4 border rounded-md space-y-4 bg-slate-50">
                <div className="font-semibold underline">Details for {planet} (Conjunct Planet {index + 1})</div>

                {/* Q: Is Conjunct planet retrograde? - Always shown when planet is selected */}
                <div className="grid gap-2">
                    <Label>{retroQ}. Is the Conjunct planet {planet} retrograde?</Label>
                    <Controller
                        name={`q${retroQ}_retro`}
                        control={control}
                        render={({ field }) => (
                            <CustomSelect value={field.value} onChange={field.onChange} options={RETRO_DIRECT} placeholder="Select" />
                        )}
                    />
                </div>

                {/* Q: Star Lord of conjunct planet - Always shown */}
                <div className="grid gap-2">
                    <Label>{starLordQ}. What is the Star-Lord of the Conjunct planet {planet}?</Label>
                    <Controller
                        name={`q${starLordQ}_starLord`}
                        control={control}
                        render={({ field }) => (
                            <CustomSelect value={field.value} onChange={field.onChange} options={PLANETS} placeholder="Select" />
                        )}
                    />
                </div>

                {/* Q: Is Star Lord retrograde? - HIDDEN until star lord is selected */}
                {starLordVal && (
                    <div className="grid gap-2">
                        <Label>{starLordRetroQ}. Is the Star Lord {starLordVal} retrograde?</Label>
                        <Controller
                            name={`q${starLordRetroQ}_retro`}
                            control={control}
                            render={({ field }) => (
                                <CustomSelect value={field.value} onChange={field.onChange} options={RETRO_DIRECT} placeholder="Select" />
                            )}
                        />
                    </div>
                )}

                {/* Q: Signification - HIDDEN until star lord is selected */}
                {starLordVal && (
                    <div className="grid gap-2">
                        <Label>{sigQ}. Signification of the Conjunct Planet {planet} along with its Star Lord {starLordVal}</Label>
                        <Input {...register(`q${sigQ}_sig`)} placeholder="e.g. 1, 5, 10, [2, 7]" />
                    </div>
                )}
            </div>
        )
    }

    // Render opposed planet details group - HIDE questions until star lord is selected
    const renderOpposedPlanetGroup = (planet, index, baseQNum) => {
        const retroQ = baseQNum
        const starLordQ = baseQNum + 1
        const starLordRetroQ = baseQNum + 2
        const sigQ = baseQNum + 3
        const starLordVal = watch(`q${starLordQ}_starLord`)

        return (
            <div key={`opposed-${baseQNum}-${index}`} className="p-4 border rounded-md space-y-4 bg-slate-50">
                <div className="font-semibold underline">Details for {planet} (Opposed Planet {index + 1})</div>

                {/* Q: Is opposed planet retrograde? - Always shown when planet is selected */}
                <div className="grid gap-2">
                    <Label>{retroQ}. Is the opposed planet {planet} retrograde?</Label>
                    <Controller
                        name={`q${retroQ}_retro`}
                        control={control}
                        render={({ field }) => (
                            <CustomSelect value={field.value} onChange={field.onChange} options={RETRO_DIRECT} placeholder="Select" />
                        )}
                    />
                </div>

                {/* Q: Star Lord of opposed planet - Always shown */}
                <div className="grid gap-2">
                    <Label>{starLordQ}. Star Lord of the opposed planet {planet}?</Label>
                    <Controller
                        name={`q${starLordQ}_starLord`}
                        control={control}
                        render={({ field }) => (
                            <CustomSelect value={field.value} onChange={field.onChange} options={PLANETS} placeholder="Select" />
                        )}
                    />
                </div>

                {/* Q: Is Star Lord retrograde? - HIDDEN until star lord is selected */}
                {starLordVal && (
                    <div className="grid gap-2">
                        <Label>{starLordRetroQ}. Is the Star Lord {starLordVal} of the opposed planet {planet} retrograde?</Label>
                        <Controller
                            name={`q${starLordRetroQ}_retro`}
                            control={control}
                            render={({ field }) => (
                                <CustomSelect value={field.value} onChange={field.onChange} options={RETRO_DIRECT} placeholder="Select" />
                            )}
                        />
                    </div>
                )}

                {/* Q: Signification - HIDDEN until star lord is selected */}
                {starLordVal && (
                    <div className="grid gap-2">
                        <Label>{sigQ}. Signification of the Opposed Planet {planet} and its Star Lord {starLordVal}?</Label>
                        <Input {...register(`q${sigQ}_sig`)} placeholder="e.g. 1, 5, 10, [2, 7]" />
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6 form-container">
            {/* Card 1: Core Astrological Details (Q1-Q8) */}
            <Card>
                <CardHeader><CardTitle>Core Astrological Details</CardTitle></CardHeader>
                <CardContent className="grid gap-6">
                    {/* Q1: Always visible */}
                    <div className="grid gap-2">
                        <Label>1. Primary House of Matter in Question (1-12)</Label>
                        <Input type="number" min="1" max="12" {...register('q1_houseNo')} />
                    </div>

                    {/* Q2: HIDDEN until Q1 has value */}
                    {q1 && (
                        <div className="grid gap-2">
                            <Label>2. Sub Lord of the Primary House No.: {q1}</Label>
                            <Controller
                                name="q2_subLord"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect value={field.value} onChange={field.onChange} options={PLANETS} placeholder="Select Planet" />
                                )}
                            />
                        </div>
                    )}

                    {/* Q3: HIDDEN until Q2 (SUB_LORD_1) has value */}
                    {q2 && (
                        <div className="grid gap-2">
                            <Label>3. Is Sub-Lord {q2} Retrograde or Direct?</Label>
                            <Controller
                                name="q3_subLordRetro"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect value={field.value} onChange={field.onChange} options={RETRO_DIRECT} placeholder="Select Status" />
                                )}
                            />
                        </div>
                    )}

                    {/* Q4: HIDDEN until Q2 (SUB_LORD_1) has value */}
                    {q2 && (
                        <div className="grid gap-2">
                            <Label>4. Sub-Lord {q2} is deposited in which Star?</Label>
                            <Controller
                                name="q4_star"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect value={field.value} onChange={field.onChange} options={[STAR_NA_OPTION, ...STARS]} placeholder="Select Star" />
                                )}
                            />
                        </div>
                    )}

                    {/* Q5: HIDDEN until Q4 (STAR_1) has value - AUTO-FILLED based on star selection */}
                    {/* When Star is NA option is chosen, show dropdown with planets instead */}
                    {q4 && q4 !== STAR_NA_OPTION && q5 && (
                        <div className="grid gap-2">
                            <Label>5. Star lord of the star {q4}?</Label>
                            <Input value={q5} readOnly className="bg-slate-100 font-medium" />
                        </div>
                    )}

                    {/* Q5 alternate: When Star NA option is chosen, show dropdown */}
                    {q4 === STAR_NA_OPTION && (
                        <div className="grid gap-2">
                            <Label>5. Star Lord of the Star in which the Sub Lord {q2} is deposited?</Label>
                            <Controller
                                name="q5_starLord"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect value={field.value} onChange={field.onChange} options={PLANETS} placeholder="Select Star Lord" />
                                )}
                            />
                        </div>
                    )}

                    {/* Q6: HIDDEN until Q5 (STAR_LORD_1) has value */}
                    {q5 && (
                        <div className="grid gap-2">
                            <Label>6. Is Star-Lord {q5} retrograde?</Label>
                            <Controller
                                name="q6_starLordRetro"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect value={field.value} onChange={field.onChange} options={RETRO_DIRECT} placeholder="Select Status" />
                                )}
                            />
                        </div>
                    )}

                    {/* Q7: HIDDEN until Q5 (STAR_LORD_1) has value */}
                    {q5 && (
                        <div className="grid gap-2">
                            <Label>7. Star-Lord {q5} deposited in and owning houses?</Label>
                            <Input {...register('q7_starLordHouses')} />
                        </div>
                    )}

                    {/* Q8: HIDDEN until Q5 (STAR_LORD_1) has value */}
                    {q5 && (
                        <div className="grid gap-2">
                            <Label>8. Is Star-Lord {q5} connecting to 6, 8, 12?</Label>
                            <Controller
                                name="q8_starLordConnecting"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect value={field.value} onChange={field.onChange} options={YES_NO} placeholder="Select" />
                                )}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Card 2: Sub-Lord Conjunction Details (Q9-Q32) - HIDDEN until Q2 (SUB_LORD_1) has value */}
            {q2 && (
                <Card>
                    <CardHeader><CardTitle>Sub-Lord Conjunction Details</CardTitle></CardHeader>
                    <CardContent className="grid gap-6">
                        {/* Q9: Shown when Q2 (SUB_LORD_1) has value */}
                        <div className="grid gap-2">
                            <Label>9. Is Sub-Lord {q2} Conjunct with any planet?</Label>
                            <Controller
                                name="q9_isSubLordConjunct"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect value={field.value} onChange={field.onChange} options={YES_NO} placeholder="Select" />
                                )}
                            />
                        </div>

                        {/* Q10: HIDDEN until Q9 = Yes */}
                        {q9 === 'Yes' && (
                            <div className="grid gap-2">
                                <Label>10. What is/are the planet/planets that the Sub-Lord {q2} conjunct with?</Label>
                                <Controller
                                    name="q10_conjunctPlanets"
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect value={field.value} onChange={field.onChange} options={PLANETS} placeholder="Select Planets" />
                                    )}
                                />
                            </div>
                        )}

                        {/* Q11-Q14: Conjunct Planet 1 */}
                        {q10.length >= 1 && renderConjunctPlanetGroup(q10[0], 0, 11)}

                        {/* Q15-Q18: Conjunct Planet 2 */}
                        {q10.length >= 2 && renderConjunctPlanetGroup(q10[1], 1, 15)}

                        {/* Q19-Q22: Conjunct Planet 3 */}
                        {q10.length >= 3 && renderConjunctPlanetGroup(q10[2], 2, 19)}

                        {/* Q23-Q26: Conjunct Planet 4 */}
                        {q10.length >= 4 && renderConjunctPlanetGroup(q10[3], 3, 23)}

                        {/* Q27-Q30: Conjunct Planet 5 */}
                        {q10.length >= 5 && renderConjunctPlanetGroup(q10[4], 4, 27)}

                        {q10.length > 0 && (
                            <>
                                <div className="grid gap-2">
                                    <Label>31. Total signification of all the conjunct planets with all their Star Lords</Label>
                                    <Input {...register('q31_totalSig')} readOnly className="bg-slate-100" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>32. Is/Are the Conjunct planet/planets signifying favorable houses to the matter?</Label>
                                    <Controller
                                        name="q32_favorable"
                                        control={control}
                                        render={({ field }) => (
                                            <CustomSelect value={field.value} onChange={field.onChange} options={YES_NO} placeholder="Select" />
                                        )}
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Card 3: Star-Lord Conjunction Details (Q33-Q56) - HIDDEN until Q5 (STAR_LORD_1) has value */}
            {q5 && (
                <Card>
                    <CardHeader><CardTitle>Star-Lord Conjunction Details</CardTitle></CardHeader>
                    <CardContent className="grid gap-6">
                        {/* Q33: Shown when Q5 (STAR_LORD_1) has value */}
                        <div className="grid gap-2">
                            <Label>33. Is Star Lord {q5} Conjunct with any planet?</Label>
                            <Controller
                                name="q33_isStarLordConjunct"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect value={field.value} onChange={field.onChange} options={YES_NO} placeholder="Select" />
                                )}
                            />
                        </div>

                        {/* Q34: HIDDEN until Q33 = Yes */}
                        {q33 === 'Yes' && (
                            <div className="grid gap-2">
                                <Label>34. Star Lord {q5} conjunct with which planets?</Label>
                                <Controller
                                    name="q34_starLordConjunctPlanets"
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect value={field.value} onChange={field.onChange} options={PLANETS} placeholder="Select Planets" />
                                    )}
                                />
                            </div>
                        )}

                        {/* Q35-Q38: Conjunct Planet 1 */}
                        {q34.length >= 1 && renderConjunctPlanetGroup(q34[0], 0, 35)}

                        {/* Q39-Q42: Conjunct Planet 2 */}
                        {q34.length >= 2 && renderConjunctPlanetGroup(q34[1], 1, 39)}

                        {/* Q43-Q46: Conjunct Planet 3 */}
                        {q34.length >= 3 && renderConjunctPlanetGroup(q34[2], 2, 43)}

                        {/* Q47-Q50: Conjunct Planet 4 */}
                        {q34.length >= 4 && renderConjunctPlanetGroup(q34[3], 3, 47)}

                        {/* Q51-Q54: Conjunct Planet 5 */}
                        {q34.length >= 5 && renderConjunctPlanetGroup(q34[4], 4, 51)}

                        {q34.length > 0 && (
                            <>
                                <div className="grid gap-2">
                                    <Label>55. Total signification of all the conjunct planets with all their Star Lords</Label>
                                    <Input {...register('q55_totalSig')} readOnly className="bg-slate-100" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>56. Is/Are the Conjunct planet/planets signifying favorable houses to the matter?</Label>
                                    <Controller
                                        name="q56_favorable"
                                        control={control}
                                        render={({ field }) => (
                                            <CustomSelect value={field.value} onChange={field.onChange} options={YES_NO} placeholder="Select" />
                                        )}
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Card 4: Sub-Lord Opposition Details (Q57-Q80) - HIDDEN until Q2 (SUB_LORD_1) has value */}
            {q2 && (
                <Card>
                    <CardHeader><CardTitle>Sub-Lord Opposition Details</CardTitle></CardHeader>
                    <CardContent className="grid gap-6">
                        {/* Q57: Shown when Q2 (SUB_LORD_1) has value */}
                        <div className="grid gap-2">
                            <Label>57. Is the Sub Lord {q2} Opposed by any planet?</Label>
                            <Controller
                                name="q57_isSubLordOpposed"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect value={field.value} onChange={field.onChange} options={YES_NO} placeholder="Select" />
                                )}
                            />
                        </div>

                        {/* Q58: HIDDEN until Q57 = Yes */}
                        {q57 === 'Yes' && (
                            <div className="grid gap-2">
                                <Label>58. Sub Lord {q2} opposed by which planets?</Label>
                                <Controller
                                    name="q58_opposedPlanets"
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect value={field.value} onChange={field.onChange} options={PLANETS} placeholder="Select Planets" />
                                    )}
                                />
                            </div>
                        )}

                        {/* Q59-Q62: Opposed Planet 1 */}
                        {q58.length >= 1 && renderOpposedPlanetGroup(q58[0], 0, 59)}

                        {/* Q63-Q66: Opposed Planet 2 */}
                        {q58.length >= 2 && renderOpposedPlanetGroup(q58[1], 1, 63)}

                        {/* Q67-Q70: Opposed Planet 3 */}
                        {q58.length >= 3 && renderOpposedPlanetGroup(q58[2], 2, 67)}

                        {/* Q71-Q74: Opposed Planet 4 */}
                        {q58.length >= 4 && renderOpposedPlanetGroup(q58[3], 3, 71)}

                        {/* Q75-Q78: Opposed Planet 5 */}
                        {q58.length >= 5 && renderOpposedPlanetGroup(q58[4], 4, 75)}

                        {q58.length > 0 && (
                            <>
                                <div className="grid gap-2">
                                    <Label>79. Total Signification of the Opposed planet/planets and their Star Lords</Label>
                                    <Input {...register('q79_totalSig')} readOnly className="bg-slate-100" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>80. Is the signification of the opposed planet and its star lord favorable?</Label>
                                    <Controller
                                        name="q80_favorable"
                                        control={control}
                                        render={({ field }) => (
                                            <CustomSelect value={field.value} onChange={field.onChange} options={YES_NO} placeholder="Select" />
                                        )}
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Card 5: Star-Lord Opposition Details (Q81-Q104) - HIDDEN until Q5 (STAR_LORD_1) has value */}
            {q5 && (
                <Card>
                    <CardHeader><CardTitle>Star-Lord Opposition Details</CardTitle></CardHeader>
                    <CardContent className="grid gap-6">
                        {/* Q81: Shown when Q5 (STAR_LORD_1) has value */}
                        <div className="grid gap-2">
                            <Label>81. Is Star Lord {q5} Opposed by any planet?</Label>
                            <Controller
                                name="q81_isStarLordOpposed"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect value={field.value} onChange={field.onChange} options={YES_NO} placeholder="Select" />
                                )}
                            />
                        </div>

                        {/* Q82: HIDDEN until Q81 = Yes */}
                        {q81 === 'Yes' && (
                            <div className="grid gap-2">
                                <Label>82. Star Lord {q5} opposed by which planets?</Label>
                                <Controller
                                    name="q82_starLordOpposedPlanets"
                                    control={control}
                                    render={({ field }) => (
                                        <MultiSelect value={field.value} onChange={field.onChange} options={PLANETS} placeholder="Select Planets" />
                                    )}
                                />
                            </div>
                        )}

                        {/* Q83-Q86: Opposed Planet 1 */}
                        {q82.length >= 1 && renderOpposedPlanetGroup(q82[0], 0, 83)}

                        {/* Q87-Q90: Opposed Planet 2 */}
                        {q82.length >= 2 && renderOpposedPlanetGroup(q82[1], 1, 87)}

                        {/* Q91-Q94: Opposed Planet 3 */}
                        {q82.length >= 3 && renderOpposedPlanetGroup(q82[2], 2, 91)}

                        {/* Q95-Q98: Opposed Planet 4 */}
                        {q82.length >= 4 && renderOpposedPlanetGroup(q82[3], 3, 95)}

                        {/* Q99-Q102: Opposed Planet 5 */}
                        {q82.length >= 5 && renderOpposedPlanetGroup(q82[4], 4, 99)}

                        {q82.length > 0 && (
                            <>
                                <div className="grid gap-2">
                                    <Label>103. Total Signification of the Opposed planet/planets and their Star Lords</Label>
                                    <Input {...register('q103_totalSig')} readOnly className="bg-slate-100" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>104. Is the signification of the opposed planet and its star lord favorable?</Label>
                                    <Controller
                                        name="q104_favorable"
                                        control={control}
                                        render={({ field }) => (
                                            <CustomSelect value={field.value} onChange={field.onChange} options={YES_NO} placeholder="Select" />
                                        )}
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Card 6: Summary (Q105) */}
            <Card>
                <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                        <Label>105. SUMMARY of the Significators</Label>
                        <Input {...register('q105_summary')} readOnly className="bg-slate-100 font-semibold" />
                        <p className="text-sm text-slate-500">Auto-filled from Q7, Q31, Q55, Q79, and Q103</p>
                    </div>

                    {/* Direct Planets List */}
                    <div className="grid gap-2">
                        <Label className="text-green-700 font-semibold">Direct Planets</Label>
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md min-h-[40px]">
                            {directPlanets.length > 0 ? (
                                <div className="space-y-2">
                                    {directPlanets.map((entry, index) => (
                                        <div key={`direct-${index}`} className="p-2 bg-green-100 rounded-md border border-green-200">
                                            <span className="font-bold text-green-900">{entry.planet}</span>
                                            <span className="text-green-700 text-sm ml-2">— {entry.designation}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic">No direct planets recorded yet</p>
                            )}
                        </div>
                    </div>

                    {/* Retrograde Planets List */}
                    <div className="grid gap-2">
                        <Label className="text-orange-700 font-semibold">Retrograde Planets</Label>
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-md min-h-[40px]">
                            {retrogradePlanets.length > 0 ? (
                                <div className="space-y-2">
                                    {retrogradePlanets.map((entry, index) => (
                                        <div key={`retro-${index}`} className="p-2 bg-orange-100 rounded-md border border-orange-200">
                                            <span className="font-bold text-orange-900">{entry.planet}</span>
                                            <span className="text-orange-700 text-sm ml-2">— {entry.designation}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic">No retrograde planets recorded yet</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
