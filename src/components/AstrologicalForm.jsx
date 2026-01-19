import React from 'react'
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import * as Popover from '@radix-ui/react-popover'
import { cn } from '../lib/utils'
import { ChevronDown, X, Check } from 'lucide-react'

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']
const STARS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
    'Magha', 'Purva Falguni', 'Uttara Falguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyestha',
    'Moola', 'Purva Shadha', 'Uttara Shadha', 'Shrovona', 'Dhanistha', 'Shatbhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
]
const RETRO_DIRECT = ['Retrograde', 'Direct']
const YES_NO = ['Yes', 'No']

// Helper for MultiSelect using Popover and Checkboxes
const MultiSelect = ({ value = [], onChange, options, placeholder }) => {
    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-normal hover:bg-white"
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
                <div className="max-h-60 overflow-y-auto p-1">
                    {options.map((opt) => {
                        const isSelected = value.includes(opt)
                        return (
                            <div
                                key={opt}
                                className={cn(
                                    "relative flex w-full cursor-default select-none items-center rounded-sm py-2.5 pl-2 pr-2 text-sm outline-none hover:bg-slate-100 hover:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
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
                                    onCheckedChange={(checked) => {
                                        // Handled by parent div onClick for better UX, but keeping accessible
                                    }}
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

// Custom Single Select using Popover for consistent scrollbar behavior
const CustomSelect = ({ value, onChange, options, placeholder }) => {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-normal hover:bg-white"
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
                                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 hover:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
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

const parseSignifications = (inputs) => {
    let mainNumbers = new Set()
    let bracketNumbers = new Set()

    inputs.forEach(input => {
        if (!input) return
        // Match numbers outside brackets
        const mainMatches = input.replace(/\[.*?\]/g, '').match(/\d+/g)
        if (mainMatches) mainMatches.forEach(n => mainNumbers.add(parseInt(n)))

        // Match numbers inside brackets
        const bracketMatches = input.match(/\[(.*?)\]/)
        if (bracketMatches && bracketMatches[1]) {
            const nums = bracketMatches[1].match(/\d+/g)
            if (nums) nums.forEach(n => bracketNumbers.add(parseInt(n)))
        }
    })

    // Sort and format
    const mainStr = Array.from(mainNumbers).sort((a, b) => a - b).join(', ')
    const bracketStr = bracketNumbers.size > 0 ? `[${Array.from(bracketNumbers).sort((a, b) => a - b).join(', ')}]` : ''

    return [mainStr, bracketStr].filter(Boolean).join(', ')
}


export default function AstrologicalForm() {
    const { register, control, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            houseNo: '',
            subLord: '',
            isSubLordRetro: '',
            star: '',
            starLord: '',
            isStarLordRetro: '',
            starLordOwnedHouses: '',
            isStarLordConnecting: '',
            isSubLordConjunct: '',
            conjunctPlanets: [],
            // Dynamic fields will be handled by watch
        }
    })

    const houseNo = watch('houseNo')
    const subLord = watch('subLord')
    const star = watch('star')
    const starLord = watch('starLord')
    const isSubLordConjunct = watch('isSubLordConjunct')
    const conjunctPlanets = watch('conjunctPlanets') || []

    // Q12 logic
    const q12Values = watch(['q12', 'q12A', 'q12B', 'q12C', 'q12D'])
    React.useEffect(() => {
        const total = parseSignifications(q12Values.filter(Boolean))
        setValue('totalSignification', total)
    }, [JSON.stringify(q12Values), setValue])

    // Q18 logic
    const isStarLordConjunct = watch('isStarLordConjunct')
    const starLordConjunctPlanets = watch('starLordConjunctPlanets') || []
    const q17Values = watch(['q17', 'q17A', 'q17B', 'q17C', 'q17D'])
    React.useEffect(() => {
        const total = parseSignifications(q17Values.filter(Boolean))
        setValue('totalSignificationStarLord', total)
    }, [JSON.stringify(q17Values), setValue])


    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6 form-container">
            <Card>
                <CardHeader><CardTitle>Astrological Details</CardTitle></CardHeader>
                <CardContent className="grid gap-6">
                    {/* Q1 */}
                    <div className="grid gap-2">
                        <Label>1. Primary House of Matter in Question (1-12)</Label>
                        <Input type="number" min="1" max="12" {...register('houseNo', { required: true, min: 1, max: 12 })} />
                    </div>

                    {/* Q2 */}
                    <div className="grid gap-2">
                        <Label>2. Sub Lord of the Primary House No.: {houseNo || 'HOUSE_NO'}</Label>
                        <Controller
                            name="subLord"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={PLANETS}
                                    placeholder="Select Planet"
                                />
                            )}
                        />
                    </div>

                    {/* Q3 */}
                    <div className="grid gap-2">
                        <Label>3. Is Sub-Lord {subLord || 'SUB_LORD_1'} Retrograde or Direct?</Label>
                        <Controller
                            name="isSubLordRetro"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={RETRO_DIRECT}
                                    placeholder="Select Status"
                                />
                            )}
                        />
                    </div>

                    {/* Q4 */}
                    <div className="grid gap-2">
                        <Label>4. Sub-Lord {subLord || 'SUB_LORD_1'} is deposited in which Star?</Label>
                        <Controller
                            name="star"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={STARS}
                                    placeholder="Select Star"
                                />
                            )}
                        />
                    </div>

                    {/* Q5 */}
                    <div className="grid gap-2">
                        <Label>5. Star lord of the star {star || 'STAR_1'}?</Label>
                        <Controller
                            name="starLord"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={PLANETS}
                                    placeholder="Select Planet"
                                />
                            )}
                        />
                    </div>

                    {/* Q6 */}
                    <div className="grid gap-2">
                        <Label>6. Is Star-Lord {starLord || 'STAR_LORD_1'} retrograde?</Label>
                        <Controller
                            name="isStarLordRetro"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={RETRO_DIRECT}
                                    placeholder="Select Status"
                                />
                            )}
                        />
                    </div>

                    {/* Q7 */}
                    <div className="grid gap-2">
                        <Label>7. Star-Lord {starLord || 'STAR_LORD_1'} deposited in and owning houses?</Label>
                        <Input {...register('starLordOwnedHouses')} />
                    </div>

                    {/* Q8 */}
                    <div className="grid gap-2">
                        <Label>8. Is Star-Lord {starLord || 'STAR_LORD_1'} connecting to 6, 8, 12?</Label>
                        <Controller
                            name="isStarLordConnecting"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={YES_NO}
                                    placeholder="Select"
                                />
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Q9 - Conjunct Logic */}
            <Card>
                <CardHeader><CardTitle>Conjunction Details (Sub-Lord)</CardTitle></CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                        <Label>9. Is Sub-Lord {subLord || 'SUB_LORD_1'} Conjunct with any planet?</Label>
                        <Controller
                            name="isSubLordConjunct"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={YES_NO}
                                    placeholder="Select"
                                />
                            )}
                        />
                    </div>

                    {isSubLordConjunct === 'Yes' && (
                        <div className="grid gap-2">
                            <Label>9A. What is/are the planet/planets that the Sub-Lord {subLord || 'SUB_LORD_1'} conjunct with?</Label>
                            <Controller
                                name="conjunctPlanets"
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={PLANETS}
                                        placeholder="Select Planets"
                                    />
                                )}
                            />
                        </div>
                    )}

                    {/* Dynamic Q10-12 Logic */}
                    {conjunctPlanets.map((planet, index) => {
                        const q10Label = index === 0 ? '10' : `10${['A', 'B', 'C', 'D'][index - 1]}`
                        const q11Label = index === 0 ? '11' : `11${['A', 'B', 'C', 'D'][index - 1]}`
                        const starLordLabel = index === 0 ? 'Star_Lord_01' : `Star_Lord_0${index + 1}`
                        const qStarRetroLabel = index === 0 ? '11E' : `11${['F', 'G', 'H', 'I'][index - 1]}`
                        const q12Label = index === 0 ? '12' : `12${['A', 'B', 'C', 'D'][index - 1]}`

                        const q10Field = index === 0 ? 'q10' : `q10${['A', 'B', 'C', 'D'][index - 1]}`
                        const q11Field = index === 0 ? 'q11' : `q11${['A', 'B', 'C', 'D'][index - 1]}`
                        const qStarRetroField = index === 0 ? 'q11E' : `q11${['F', 'G', 'H', 'I'][index - 1]}`
                        const q12Field = index === 0 ? 'q12' : `q12${['A', 'B', 'C', 'D'][index - 1]}`

                        return (
                            <div key={`conjunct-${index}`} className="p-4 border rounded-md space-y-4 bg-slate-50">
                                <div className="font-semibold underline">Details for {planet} (Conjunct Planet {index + 1})</div>

                                {/* Q10x */}
                                <div className="grid gap-2">
                                    <Label>{q10Label}. Is the Conjunct planet {planet} retrograde?</Label>
                                    <Controller
                                        name={q10Field}
                                        control={control}
                                        render={({ field }) => (
                                            <CustomSelect
                                                value={field.value}
                                                onChange={field.onChange}
                                                options={RETRO_DIRECT}
                                                placeholder="Select"
                                            />
                                        )}
                                    />
                                </div>

                                {/* Q11x */}
                                <div className="grid gap-2">
                                    <Label>{q11Label}. What is the Star-Lord of the Conjunct planet {planet}?</Label>
                                    <Controller
                                        name={q11Field}
                                        control={control}
                                        render={({ field }) => (
                                            <CustomSelect
                                                value={field.value}
                                                onChange={field.onChange}
                                                options={PLANETS}
                                                placeholder="Select"
                                            />
                                        )}
                                    />
                                </div>

                                {/* Q11 Retro */}
                                <div className="grid gap-2">
                                    <Label>{qStarRetroLabel}. Is the Star Lord {watch(q11Field) || starLordLabel} retrograde?</Label>
                                    <Controller
                                        name={qStarRetroField}
                                        control={control}
                                        render={({ field }) => (
                                            <CustomSelect
                                                value={field.value}
                                                onChange={field.onChange}
                                                options={RETRO_DIRECT}
                                                placeholder="Select"
                                            />
                                        )}
                                    />
                                </div>

                                {/* Q12x */}
                                <div className="grid gap-2">
                                    <Label>{q12Label}. Signification of {planet} along with its Star Lord {watch(q11Field) || starLordLabel}</Label>
                                    <Input {...register(q12Field)} placeholder="e.g. 1, 5, 10, [2, 7]" />
                                </div>
                            </div>
                        )
                    })}

                    {conjunctPlanets.length > 0 && (
                        <>
                            <div className="grid gap-2">
                                <Label>13. Total signification of all the conjunct planets with all their Star Lords</Label>
                                <Input {...register('totalSignification')} readOnly className="bg-slate-100" />
                            </div>
                            <div className="grid gap-2">
                                <Label>13A. Is/Are the Conjunct planet/planets signifying favorable houses to the matter?</Label>
                                <Controller
                                    name="favHouses"
                                    control={control}
                                    render={({ field }) => (
                                        <CustomSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={YES_NO}
                                            placeholder="Select"
                                        />
                                    )}
                                />
                            </div>
                        </>
                    )}

                </CardContent>
            </Card>

            {/* Section 4 - Star Lord Conjunct */}
            <Card>
                <CardHeader><CardTitle>Star Lord Conjunction Details</CardTitle></CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                        <Label>14. Is Star Lord {starLord || 'STAR_LORD_1'} Conjunct with any planet?</Label>
                        <Controller
                            name="isStarLordConjunct"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={YES_NO}
                                    placeholder="Select"
                                />
                            )}
                        />
                    </div>

                    {isStarLordConjunct === 'Yes' && (
                        <div className="grid gap-2">
                            <Label>14A. Star Lord {starLord || 'STAR_LORD_1'} conjunct with which planets?</Label>
                            <Controller
                                name="starLordConjunctPlanets"
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={PLANETS}
                                        placeholder="Select Planets"
                                    />
                                )}
                            />
                        </div>
                    )}

                    {starLordConjunctPlanets.map((planet, index) => {
                        const q15Label = index === 0 ? '15' : `15${['A', 'B', 'C', 'D'][index - 1]}`
                        const q15Field = index === 0 ? 'q15' : `q15${['A', 'B', 'C', 'D'][index - 1]}`

                        const q15StarLabel = index === 0 ? '15E' : `15${['F', 'G', 'H', 'I'][index - 1]}`
                        const q15StarField = index === 0 ? 'q15E' : `q15${['F', 'G', 'H', 'I'][index - 1]}`

                        const q16Label = index === 0 ? '16' : `16${['A', 'B', 'C', 'D'][index - 1]}`
                        const q16Field = index === 0 ? 'q16' : `q16${['A', 'B', 'C', 'D'][index - 1]}`

                        const q17Label = index === 0 ? '17' : `17${['A', 'B', 'C', 'D'][index - 1]}`
                        const q17Field = index === 0 ? 'q17' : `q17${['A', 'B', 'C', 'D'][index - 1]}`

                        const starLordNum = index + 6
                        const starLordObjLabel = `Star_Lord_${starLordNum < 10 ? '0' + starLordNum : starLordNum}`

                        return (
                            <div key={`sl-conjunct-${index}`} className="p-4 border rounded-md space-y-4 bg-slate-50">
                                <div className="font-semibold underline">Details for {planet} (Conjunct Planet {index + 1})</div>

                                <div className="grid gap-2">
                                    <Label>{q15Label}. Is conjunct Planet {planet} retrograde?</Label>
                                    <Controller
                                        name={q15Field}
                                        control={control}
                                        render={({ field }) => (
                                            <CustomSelect
                                                value={field.value}
                                                onChange={field.onChange}
                                                options={RETRO_DIRECT}
                                                placeholder="Select"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label>{q15StarLabel}. What is the Star-Lord of {planet}?</Label>
                                    <Controller
                                        name={q15StarField}
                                        control={control}
                                        render={({ field }) => (
                                            <CustomSelect
                                                value={field.value}
                                                onChange={field.onChange}
                                                options={PLANETS}
                                                placeholder="Select"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label>{q16Label}. Is {watch(q15StarField) || starLordObjLabel} retrograde?</Label>
                                    <Controller
                                        name={q16Field}
                                        control={control}
                                        render={({ field }) => (
                                            <CustomSelect
                                                value={field.value}
                                                onChange={field.onChange}
                                                options={RETRO_DIRECT}
                                                placeholder="Select"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label>{q17Label}. Signification of {planet} along with its star lord {watch(q15StarField) || starLordObjLabel}</Label>
                                    <Input {...register(q17Field)} placeholder="e.g. 1, 5, 10, [2, 7]" />
                                </div>
                            </div>
                        )
                    })}

                    {starLordConjunctPlanets.length > 0 && (
                        <>
                            <div className="grid gap-2">
                                <Label>18. Total signification of all the conjunct planets with all their Star Lords</Label>
                                <Input {...register('totalSignificationStarLord')} readOnly className="bg-slate-100" />
                            </div>
                            <div className="grid gap-2">
                                <Label>18A. Is/Are the Conjunct planet/planets signifying favorable houses to the matter?</Label>
                                <Controller
                                    name="favHousesStarLord"
                                    control={control}
                                    render={({ field }) => (
                                        <CustomSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={YES_NO}
                                            placeholder="Select"
                                        />
                                    )}
                                />
                            </div>
                        </>
                    )}

                </CardContent>
            </Card>

        </div>
    )
}
