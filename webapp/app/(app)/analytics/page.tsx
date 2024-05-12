import DailyRatings, {TurnOffDefaultPropsWarning} from "./DailyRatings";


export default function Page() {
  return (
    <div className="flex flex-col grow items-center py-4">
      <h1 className="text-lunar-green-300">Analytics</h1>
      <TurnOffDefaultPropsWarning />
      <DailyRatings />
    </div>
  )
}